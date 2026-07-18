# New Mexico Road Trip

A temporary, standalone trip planner for August 8–15, 2026. It is intentionally separate from the portfolio and deploys as the independent `trip` GitHub Pages project at `https://harsh.bet/trip/`.

## What is included

- the fixed dates, destinations, mileage, drive times, and lodging sequence from the original plan
- a researched daily schedule with realistic stop, meal, check-in, rest, and weather buffers
- a **Weather & sky** tab: NOAA 1991–2020 August normals per stop, live 16-day Open-Meteo forecasts (keyless, client-side, localStorage-cached), live NWS watches/warnings per stop, a monsoon-rhythm explainer, USNO-verified sunrise/sunset for every trip day, nightly moon phases, and the 2026 Perseid peak (new moon on Aug 12 — the first moonless maximum since 2018)
- per-day conditions on every schedule card: sunrise/sunset, typical temps, the storm window, plus the live forecast and any NWS alert once dates are in range
- vegetarian-only food guidance with an Indian-first focus
- a single food + attraction directory searchable and filterable by place, trip day, and don't-miss status, with Google Maps links and date-rigid closures (Harwood, Nambé Falls, the TEXAS musical, the Bandelier shuttle) called out on the affected entries
- verified 2026 event research: SWAIA Indian Market week (Aug 15–16), the Picuris Pueblo San Lorenzo feast day (Aug 10), the Tuesday Santa Fe Farmers' Market, Santa Fe Summer Scene, Meow Wolf as the monsoon rain backup, and confirmed Earthship/Taos Pueblo/Nambé hours and prices
- a projected-coordinate SVG route map with a live "you are here" marker during the trip
- shared checklists with custom to-dos, trip-mode choices for Aug 13, a whole-trip budget sketch (fuel, lodging, food, tickets), home-route meal options, and live-condition links
- Firestore synchronization with browser/offline caching
- automatic dark mode via `prefers-color-scheme`
- `noindex` metadata because the site contains a future personal travel schedule

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Validation and static GitHub Pages export:

```bash
npm test
npm run lint
npm run build
npm run build:pages
```

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`. The static export uses `/trip` as its base path and deliberately fails if a `CNAME` enters the artifact. The apex `harsh.bet` CNAME remains owned only by the GitHub user site.

## Firebase

The web app uses the `harsh-trip-2026` Firebase project and the single Firestore document `tripBoards/new-mexico-2026`. Rules permit only the small trip-board schema, deny collection listing and deletion, deny every other document, and automatically stop writes after September 1, 2026.

Firebase web configuration identifiers are public by design; Firestore rules are the access boundary. The shared board should contain trip tasks only, not private notes.

## Research

Attraction, restaurant, park, lodging, road, weather, and performance details were checked July 15–17, 2026 against official operator, municipal, NPS, TPWD, NWS, and tourism sources. Climate figures are NOAA/NCEI 1991–2020 normals; sun and moon times were verified against the USNO Astronomical Applications API; 2026 event dates (Indian Market, feast days, opera schedule, TEXAS musical season) were verified against each operator's official site. The interface links directly to the relevant sources and tells travelers which details must be reconfirmed near departure.

Live data at runtime comes only from keyless public APIs: Open-Meteo for 16-day forecasts and api.weather.gov for active watches/warnings. Both are fetched client-side and cached in localStorage so the static site keeps working on weak cell signal.
