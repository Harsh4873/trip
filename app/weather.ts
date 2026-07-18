// Client-side live forecasts from Open-Meteo (free, keyless, CORS-enabled).
// The site stays fully static: forecasts are fetched in the browser and cached
// in localStorage so travel-morning reloads work on weak cell signal.

export type DailyForecast = {
  date: string; // ISO "2026-08-08"
  weatherCode: number;
  highF: number;
  lowF: number;
  precipChance: number; // %
  uvIndex: number;
  windMph: number;
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

type CacheShape = Record<string, StopForecast>;

function readCache(): CacheShape {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheShape;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(cache: CacheShape) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Cache is best-effort only.
  }
}

type OpenMeteoDaily = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: (number | null)[];
  uv_index_max: (number | null)[];
  wind_speed_10m_max: (number | null)[];
};

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
      days: daily.time.map((date, index) => ({
        date,
        weatherCode: daily.weather_code[index] ?? 3,
        highF: Math.round(daily.temperature_2m_max[index] ?? 0),
        lowF: Math.round(daily.temperature_2m_min[index] ?? 0),
        precipChance: Math.round(daily.precipitation_probability_max[index] ?? 0),
        uvIndex: Math.round(daily.uv_index_max[index] ?? 0),
        windMph: Math.round(daily.wind_speed_10m_max[index] ?? 0),
      })),
    };
  } catch {
    return null;
  }
}

export async function loadForecasts(
  stops: { id: string; lat: number; lon: number; timezone: string }[],
): Promise<Record<string, StopForecast>> {
  const cache = readCache();
  const now = Date.now();
  const stale = stops.filter((stop) => {
    const cached = cache[stop.id];
    return !cached || now - cached.fetchedAt > CACHE_TTL_MS;
  });

  if (stale.length > 0) {
    const fresh = await Promise.all(
      stale.map((stop) => fetchStopForecast(stop.id, stop.lat, stop.lon, stop.timezone)),
    );
    for (const forecast of fresh) {
      if (forecast) cache[forecast.stopId] = forecast;
    }
    writeCache(cache);
  }

  return cache;
}

// Official NWS watches/warnings per stop (api.weather.gov: free, keyless,
// CORS-enabled). During monsoon season this is the feed that carries flash
// flood watches and heat advisories.

export type StopAlert = {
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

type AlertsCache = Record<string, StopAlerts>;

function readAlertsCache(): AlertsCache {
  try {
    const raw = window.localStorage.getItem(ALERTS_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AlertsCache;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

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
  const cache = readAlertsCache();
  const now = Date.now();
  const stale = stops.filter((stop) => {
    const cached = cache[stop.id];
    return !cached || now - cached.fetchedAt > ALERTS_TTL_MS;
  });

  if (stale.length > 0) {
    const fresh = await Promise.all(
      stale.map((stop) => fetchStopAlerts(stop.id, stop.lat, stop.lon)),
    );
    for (const alerts of fresh) {
      if (alerts) cache[alerts.stopId] = alerts;
    }
    try {
      window.localStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(cache));
    } catch {
      // Cache is best-effort only.
    }
  }

  return cache;
}
