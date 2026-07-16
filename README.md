# New Mexico Road Trip

A temporary, standalone trip planner for August 8–15, 2026. It is intentionally separate from the portfolio and deploys as the independent `trip` GitHub Pages project at `https://harsh.bet/trip/`.

## What is included

- the fixed dates, destinations, mileage, drive times, and lodging sequence from the original plan
- a researched daily schedule with realistic stop, meal, check-in, rest, and weather buffers
- vegetarian-only food guidance with an Indian-first focus
- a single food + attraction directory searchable and filterable by place and trip day, with date-rigid closures (Harwood, Nambé Falls, the TEXAS musical, the Bandelier shuttle) called out on the affected entries
- shared checklists with custom to-dos, trip-mode choices for Aug 13, fuel math, home-route meal options, and live-condition links
- Firestore synchronization with browser/offline caching
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

Attraction, restaurant, park, lodging, road, weather, and performance details were checked on July 15, 2026 against official operator, municipal, NPS, TPWD, NWS, and tourism sources. The interface links directly to the relevant sources and tells travelers which details must be reconfirmed near departure.
