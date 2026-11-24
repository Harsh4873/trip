# Trip roadbook (Bandera and New Orleans)

Private, PIN-gated trip notes served at `https://harsh.bet/trip/` with base path `/trip/`. Two trips share the same beige shell:

- **Bandera / Flying L Ranch**, Thu Nov 26 to Sun Nov 29, 2026
- **New Orleans**, Thu Dec 25 to Fri Dec 26, 2026 (Katy, TX start/return via I-10, about 5 hours each way, labeled as an assumption)

The page is for the owner. It does not publish a personal name, home address, or personal email/phone. City names only. Lodging for New Orleans is the owner's booking and is not named.

## What is on the page

After the four-digit PIN gate (each trip has its own code in `app/PinGate.tsx`):

- Each trip has its own PIN; a PIN opens only that trip
- Sticky tabs: Schedule, Food, Attractions, Events
- A calendar time-grid (hour rail and duration blocks). Day view on a phone; Day / all-days toggle on a wide screen
- Food, attractions, and events cards with reusable Wikimedia Commons photos where a legal photo exists
- Weather, alerts, drive info, and stay notes inside Schedule
- Diet callout: strict ovo-lacto vegetarian, no meat broths, ask about lard / fish sauce / Caesar, coconut flagged
- Each trip's own data module, lazy-loaded after unlock so `index.html` does not contain itinerary text

Hours, menus, prices, and times are never invented. Every fact keeps its source link. **UNVERIFIED** items stay visible. Prefer calling to confirm, especially Thanksgiving Day.

The previous August 2026 New Mexico planner is retired from this tree. It remains in git history.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The PINs are the two four-digit codes in `app/PinGate.tsx`. Trip content (Bandera or New Orleans) loads in a lazily imported chunk only after unlock.

```bash
npm test
npm run lint
npm run build
npm run build:pages
```

`build:pages` uses `/trip` as the Next.js `basePath` and fails if a `CNAME` enters the artifact. The apex `harsh.bet` CNAME stays on the GitHub user site, not this project.

## Privacy and indexing

- `<meta name="robots" content="noindex,nofollow">`
- `public/robots.txt` disallows `/`
- Do not add `/trip` to the harsh.bet sitemap

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`. GitHub Pages must be enabled on this repo with **Source: GitHub Actions** before `https://harsh.bet/trip/` will stop 404ing. This workflow does not enable Pages by itself.
