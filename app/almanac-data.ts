// Researched climate, sun, and moon data for the exact trip dates.
// Climate normals: NOAA/NCEI 1991–2020 monthly normals (Taos COOP USC00298668,
// Santa Fe County Airport USW00023049, Albuquerque Sunport USW00023050,
// Lubbock Intl USW00023042, Amarillo Intl USW00023047). The Palo Duro canyon
// floor has no normals station; its figures derive from the NOAA/NWS Amarillo
// canyon heat study (Lindley et al. 2015). Sun/moon times: timeanddate + USNO,
// checked July 2026.

export type StopAlmanac = {
  id: string;
  name: string;
  nights: string;
  lat: number;
  lon: number;
  elevationFt: number;
  timezone: string; // IANA, for the forecast API
  tripDates: string[]; // ISO dates this stop hosts
  augHighF: number;
  augLowF: number;
  augPrecipIn: number;
  augRainDays: number;
  climateNote: string;
  stormNote: string;
  nwsUrl: string;
};

export const stopAlmanacs: StopAlmanac[] = [
  {
    id: "lubbock",
    name: "Lubbock, TX",
    nights: "Night of Aug 8",
    lat: 33.5779,
    lon: -101.8552,
    elevationFt: 3202,
    timezone: "America/Chicago",
    tripDates: ["2026-08-08"],
    augHighF: 92,
    augLowF: 68,
    augPrecipIn: 1.74,
    augRainDays: 6,
    climateNote:
      "Peak summer on the South Plains: hot, dry, sunny days with low humidity and a fast cool-down after sunset—pleasant by 9–10 PM.",
    stormNote:
      "Storms are the exception here, not the rule. When they fire it's 4–10 PM off Caprock heating: gusty outflow, brief heavy rain, lots of lightning.",
    nwsUrl: "https://forecast.weather.gov/MapClick.php?lat=33.5779&lon=-101.8552",
  },
  {
    id: "taos",
    name: "Taos, NM",
    nights: "Aug 9–10",
    lat: 36.4072,
    lon: -105.5734,
    elevationFt: 6969,
    timezone: "America/Denver",
    tripDates: ["2026-08-09", "2026-08-10"],
    augHighF: 84,
    augLowF: 51,
    augPrecipIn: 1.77,
    augRainDays: 10,
    climateNote:
      "August is Taos's wettest month, but rain comes as brief afternoon downpours, not gray days. The 33°F day–night swing means evenings drop into the 50s—pack layers.",
    stormNote:
      "Clear mornings; storms build on the Sangre de Cristos noon–2 PM and drift over the mesa and gorge 2–6 PM. The Gorge Bridge walkway has zero lightning shelter—walk it before noon.",
    nwsUrl: "https://forecast.weather.gov/MapClick.php?lat=36.4072&lon=-105.5734",
  },
  {
    id: "santa-fe",
    name: "Santa Fe · Pojoaque, NM",
    nights: "Aug 11–12",
    lat: 35.687,
    lon: -105.9378,
    elevationFt: 7199,
    timezone: "America/Denver",
    tripDates: ["2026-08-11", "2026-08-12"],
    augHighF: 86,
    augLowF: 56,
    augPrecipIn: 1.96,
    augRainDays: 10,
    climateNote:
      "Santa Fe's wettest month of the year, in the usual burst-and-break monsoon rhythm. Buffalo Thunder sits ~1,200 ft below the Plaza and runs a couple degrees warmer.",
    stormNote:
      "Storms initiate over the Sangres and the Jemez ~noon–2 PM, then cross the city and the Pojoaque valley 2–7 PM. Bandelier sits below a burn scar—flash floods can arrive under blue sky, so clear canyon bottoms by early afternoon.",
    nwsUrl: "https://forecast.weather.gov/MapClick.php?lat=35.687&lon=-105.9378",
  },
  {
    id: "albuquerque",
    name: "Albuquerque, NM",
    nights: "Aug 13",
    lat: 35.0844,
    lon: -106.6504,
    elevationFt: 5312,
    timezone: "America/Denver",
    tripDates: ["2026-08-13"],
    augHighF: 89,
    augLowF: 65,
    augPrecipIn: 1.31,
    augRainDays: 8,
    climateNote:
      "Warmer and drier than the mountain towns; nights stay in the mid-60s. When the monsoon high shifts west, Albuquerque can pick up rain overnight rather than in the afternoon.",
    stormNote:
      "Storms fire on the Sandias ~noon–2 PM and drift over the city late afternoon. Rooftop sunset plans usually survive—cells are scattered and brief.",
    nwsUrl: "https://forecast.weather.gov/MapClick.php?lat=35.0844&lon=-106.6504",
  },
  {
    id: "palo-duro",
    name: "Palo Duro Canyon, TX",
    nights: "Aug 14",
    lat: 34.9375,
    lon: -101.6595,
    elevationFt: 2844,
    timezone: "America/Chicago",
    tripDates: ["2026-08-14", "2026-08-15"],
    augHighF: 97,
    augLowF: 66,
    augPrecipIn: 2.5,
    augRainDays: 8,
    climateNote:
      "The canyon floor runs 5–10°F+ hotter than the rim—NWS runs a separate forecast zone just for it, and 104°F afternoons are routine, not extreme. The heat is radiative and daytime-only: evenings cool steadily to comfortable mid-60s sleeping weather.",
    stormNote:
      "Any storms arrive 4–10 PM. Heavy rain west of the park can flood the park-road water crossings under sunny skies—never cross moving water, and check the canyon-zone forecast (not Amarillo's) on the morning drive.",
    nwsUrl: "https://forecast.weather.gov/MapClick.php?zoneid=TXZ317",
  },
];

export type DayAlmanac = {
  dayId: string;
  stopId: string; // stop whose forecast covers this day's destination
  date: string; // ISO date for forecast lookup
  sunrise: string;
  sunset?: string;
  highF?: number;
  lowF?: number;
  stormWindow?: string;
};

export const dayAlmanacs: DayAlmanac[] = [
  {
    dayId: "aug-08",
    stopId: "lubbock",
    date: "2026-08-08",
    sunrise: "7:05 AM CDT",
    sunset: "8:41 PM",
    highF: 92,
    lowF: 68,
    stormWindow: "Storms unlikely; if any, 4–10 PM",
  },
  {
    dayId: "aug-09",
    stopId: "taos",
    date: "2026-08-09",
    sunrise: "7:06 AM CDT",
    sunset: "8:00 PM MDT",
    highF: 84,
    lowF: 51,
    stormWindow: "Taos storms 2–6 PM",
  },
  {
    dayId: "aug-10",
    stopId: "taos",
    date: "2026-08-10",
    sunrise: "6:16 AM",
    sunset: "7:58 PM",
    highF: 84,
    lowF: 51,
    stormWindow: "Gorge + Pueblo before noon; storms 2–6 PM",
  },
  {
    dayId: "aug-11",
    stopId: "santa-fe",
    date: "2026-08-11",
    sunrise: "6:17 AM",
    sunset: "7:58 PM",
    highF: 86,
    lowF: 56,
    stormWindow: "Valley storms 2–7 PM",
  },
  {
    dayId: "aug-12",
    stopId: "santa-fe",
    date: "2026-08-12",
    sunrise: "6:21 AM",
    sunset: "7:56 PM",
    highF: 86,
    lowF: 56,
    stormWindow: "Bandelier in the morning; storms 2–7 PM",
  },
  {
    dayId: "aug-13",
    stopId: "albuquerque",
    date: "2026-08-13",
    sunrise: "6:21 AM",
    sunset: "7:57 PM",
    highF: 89,
    lowF: 65,
    stormWindow: "Scattered cells late afternoon",
  },
  {
    dayId: "aug-14",
    stopId: "palo-duro",
    date: "2026-08-14",
    sunrise: "6:26 AM MDT",
    sunset: "8:36 PM CDT",
    highF: 97,
    lowF: 66,
    stormWindow: "Canyon heat peaks 12–6 PM; storms 4–10 PM",
  },
  {
    dayId: "aug-15",
    stopId: "palo-duro",
    date: "2026-08-15",
    sunrise: "7:07 AM CDT",
    stormWindow: "Check DriveTexas at each fuel stop",
  },
];

export type MoonNight = {
  date: string; // ISO
  label: string; // "Sat 8"
  phase: string;
  illumination: number; // %
  note: string;
};

export const moonNights: MoonNight[] = [
  { date: "2026-08-08", label: "Sat 8", phase: "Waning crescent", illumination: 22, note: "Rises 2:12 AM—evening is dark" },
  { date: "2026-08-09", label: "Sun 9", phase: "Waning crescent", illumination: 12, note: "Rises ~2:20 AM" },
  { date: "2026-08-10", label: "Mon 10", phase: "Waning crescent", illumination: 6, note: "Pre-dawn sliver only" },
  { date: "2026-08-11", label: "Tue 11", phase: "Waning crescent", illumination: 1, note: "All but gone" },
  { date: "2026-08-12", label: "Wed 12", phase: "New moon", illumination: 0, note: "Perseid peak night—zero moonlight" },
  { date: "2026-08-13", label: "Thu 13", phase: "Waxing crescent", illumination: 1, note: "Invisible in twilight; sets 8:37 PM" },
  { date: "2026-08-14", label: "Fri 14", phase: "Waxing crescent", illumination: 5, note: "Sets 9:46 PM at Palo Duro" },
  { date: "2026-08-15", label: "Sat 15", phase: "Waxing crescent", illumination: 11, note: "Sets 10:13 PM" },
];

export const perseids = {
  title: "Perseids: the peak lands on this trip",
  detail:
    "The shower peaks the night of Wed Aug 12 into dawn Thu Aug 13—and the new moon lands exactly on the peak, the first moonless Perseid maximum since 2018. Dark rural skies can show 60–100 meteors/hour before dawn; the radiant climbs in the northeast from about 10 PM. The opera ends near 11 PM on peak night—even twenty dark minutes near Buffalo Thunder count. Palo Duro on Aug 14 is two nights past peak but still active, and the crescent moon sets by 9:46 PM.",
};

// Forecast horizon note: Open-Meteo serves 16 days out, so live trip-date
// forecasts start appearing around July 23, 2026 and fill in day by day.
export const forecastWindowNote =
  "Live 16-day forecasts come from Open-Meteo and update on every visit. Trip dates start entering the forecast window around July 23; until then each stop shows its NOAA 1991–2020 August normals.";
