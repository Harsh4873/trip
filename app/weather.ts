// Client-side live forecasts from Open-Meteo (free, keyless, CORS-enabled).
// The site stays fully static: forecasts are fetched in the browser and cached
// in localStorage so travel-morning reloads work on weak cell signal.

type DailyForecast = {
  date: string; // ISO "2026-08-08"
  weatherCode: number | null;
  highF: number;
  lowF: number;
  precipChance: number | null; // %; null = model gave no probability
  uvIndex: number | null;
  windMph: number | null;
};

export type StopForecast = {
  stopId: string;
  fetchedAt: number;
  days: DailyForecast[];
};

const CACHE_KEY = "harsh-trip-2026-forecast-v1";
const CACHE_TTL_MS = 45 * 60 * 1000; // refresh at most every 45 minutes

// WMO weather interpretation codes → short label + icon group.
export function describeWeatherCode(code: number): { label: string; group: "clear" | "cloud" | "fog" | "rain" | "storm" | "snow" } {
  if (code === 0) return { label: "Clear", group: "clear" };
  if (code === 1) return { label: "Mostly clear", group: "clear" };
  if (code === 2) return { label: "Partly cloudy", group: "cloud" };
  if (code === 3) return { label: "Overcast", group: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", group: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", group: "rain" };
  if (code >= 61 && code <= 67) return { label: "Rain", group: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", group: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", group: "rain" };
  if (code === 85 || code === 86) return { label: "Snow showers", group: "snow" };
  if (code === 95) return { label: "Thunderstorms", group: "storm" };
  if (code === 96 || code === 99) return { label: "Storms + hail", group: "storm" };
  return { label: "Mixed", group: "cloud" };
}

// Shared fetch-through-localStorage pattern for both forecasts and alerts:
// serve cached entries inside their TTL, refetch the stale ones, persist
// best-effort. Failures leave the previous cache entry in place.
async function loadCachedPerStop<S extends { id: string }, T extends { stopId: string; fetchedAt: number }>(
  cacheKey: string,
  ttlMs: number,
  stops: S[],
  fetchOne: (stop: S) => Promise<T | null>,
): Promise<Record<string, T>> {
  let cache: Record<string, T> = {};
  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, T>;
      if (parsed && typeof parsed === "object") cache = parsed;
    }
  } catch {
    // Start from an empty cache when storage is unavailable or corrupt.
  }

  const now = Date.now();
  const stale = stops.filter((stop) => {
    const cached = cache[stop.id];
    return !cached || now - cached.fetchedAt > ttlMs;
  });

  if (stale.length > 0) {
    const fresh = await Promise.all(stale.map(fetchOne));
    for (const item of fresh) {
      if (item) cache[item.stopId] = item;
    }
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(cache));
    } catch {
      // Cache is best-effort only.
    }
  }

  return cache;
}

type OpenMeteoDaily = {
  time: string[];
  weather_code?: (number | null)[];
  temperature_2m_max?: (number | null)[];
  temperature_2m_min?: (number | null)[];
  precipitation_probability_max?: (number | null)[];
  uv_index_max?: (number | null)[];
  wind_speed_10m_max?: (number | null)[];
};

function roundOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
}

async function fetchStopForecast(stopId: string, lat: number, lon: number, timezone: string): Promise<StopForecast | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "uv_index_max",
      "wind_speed_10m_max",
    ].join(","),
    timezone,
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    forecast_days: "16",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) return null;
    const payload = (await response.json()) as { daily?: OpenMeteoDaily };
    const daily = payload.daily;
    if (!daily?.time?.length) return null;

    return {
      stopId,
      fetchedAt: Date.now(),
      // A day without both temperatures is no forecast at all—dropping it lets
      // the UI fall back to normals instead of rendering a confident 0°/0°.
      days: daily.time.flatMap((date, index) => {
        const highF = roundOrNull(daily.temperature_2m_max?.[index]);
        const lowF = roundOrNull(daily.temperature_2m_min?.[index]);
        if (highF === null || lowF === null) return [];
        return [
          {
            date,
            weatherCode: roundOrNull(daily.weather_code?.[index]),
            highF,
            lowF,
            precipChance: roundOrNull(daily.precipitation_probability_max?.[index]),
            uvIndex: roundOrNull(daily.uv_index_max?.[index]),
            windMph: roundOrNull(daily.wind_speed_10m_max?.[index]),
          },
        ];
      }),
    };
  } catch {
    return null;
  }
}

export async function loadForecasts(
  stops: { id: string; lat: number; lon: number; timezone: string }[],
): Promise<Record<string, StopForecast>> {
  return loadCachedPerStop(CACHE_KEY, CACHE_TTL_MS, stops, (stop) =>
    fetchStopForecast(stop.id, stop.lat, stop.lon, stop.timezone),
  );
}

// Official NWS watches/warnings per stop (api.weather.gov: free, keyless,
// CORS-enabled). During monsoon season this is the feed that carries flash
// flood watches and heat advisories.

type StopAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
};

export type StopAlerts = {
  stopId: string;
  fetchedAt: number;
  alerts: StopAlert[];
};

const ALERTS_CACHE_KEY = "harsh-trip-2026-alerts-v1";
const ALERTS_TTL_MS = 15 * 60 * 1000;

type NwsAlertFeature = {
  properties?: {
    id?: string;
    event?: string;
    headline?: string;
    severity?: string;
  };
};

async function fetchStopAlerts(stopId: string, lat: number, lon: number): Promise<StopAlerts | null> {
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
      { headers: { Accept: "application/geo+json" } },
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as { features?: NwsAlertFeature[] };

    return {
      stopId,
      fetchedAt: Date.now(),
      alerts: (payload.features ?? [])
        .map((feature) => feature.properties)
        .filter((props): props is NonNullable<NwsAlertFeature["properties"]> => Boolean(props?.event))
        .slice(0, 6)
        .map((props, index) => ({
          id: props.id ?? `${stopId}-alert-${index}`,
          event: props.event ?? "Alert",
          headline: props.headline ?? "",
          severity: props.severity ?? "Unknown",
        })),
    };
  } catch {
    return null;
  }
}

export async function loadAlerts(
  stops: { id: string; lat: number; lon: number }[],
): Promise<Record<string, StopAlerts>> {
  return loadCachedPerStop(ALERTS_CACHE_KEY, ALERTS_TTL_MS, stops, (stop) =>
    fetchStopAlerts(stop.id, stop.lat, stop.lon),
  );
}
