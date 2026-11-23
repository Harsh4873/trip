# Bandera / Flying L Ranch trip

Private, PIN-gated trip notes for **Thu Nov 26 to Sun Nov 29, 2026** at Flying L Ranch Resort, Bandera, TX. Served at `https://harsh.bet/trip/` with base path `/trip/`.

The page is for the owner. It does not publish a personal name, home address, or personal email/phone.

## What is on the page

After the existing four-digit PIN gate:

- Hero and an NWS weather strip (Bandera point forecast, timestamped Nov 23, 2026)
- Diet callout: strict ovo-lacto vegetarian, no meat broths, ask about lard / fish sauce / Caesar, coconut flagged
- Day-by-day itinerary with **confirm Thanksgiving hours** and **confirm check-in** chips
- Top 5 food cards with named dishes and source links
- Events for Nov 26-29 only
- Drives table with OSRM times, reservation flags, and official links
- Local alerts
- An **as of Nov 23, 2026** note on hours and weather

Hours, menus, prices, and times are never invented. Every fact keeps its source link. **UNVERIFIED** items stay visible. Prefer calling to confirm, especially Thanksgiving Day.

The previous August 2026 New Mexico planner is retired from this tree. It remains in git history.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The PIN is the existing trip PIN in `app/PinGate.tsx`. Trip content loads in a lazily imported chunk only after unlock.

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
