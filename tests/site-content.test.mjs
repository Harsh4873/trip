import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("contains the fixed trip facts and researched corrections", async () => {
  const data = await readFile(new URL("app/trip-data.ts", root), "utf8");

  assert.match(data, /1 hr 15 min/);
  assert.match(data, /338 mi/);
  assert.match(data, /9 hr 16 min/);
  assert.match(data, /Mountain → Central · lose 1 hour/);
  assert.match(data, /season ends August 1/);
  assert.match(data, /Paper Dosa/);
  assert.match(data, /Indian Oven/);
  assert.match(data, /beans, rice, and chile/);
});

test("keeps the food + attraction directory aligned with the trip's constraints", async () => {
  const data = await readFile(new URL("app/trip-data.ts", root), "utf8");

  // Both categories exist in the lookup directory.
  assert.match(data, /category: "attraction"/);
  assert.match(data, /category: "food"/);
  // Date-rigid closures stay visible as explicit constraints.
  assert.match(data, /Harwood Museum of Art/);
  assert.match(data, /Closed Monday and Tuesday/);
  assert.match(data, /Closed Tuesday and Wednesday, so Thursday is the only day that works/);
  assert.match(data, /2026 season ends August 1/);
  // Both route-dependent home-leg Indian stops are in the directory.
  assert.match(data, /Spicy India/);
  assert.match(data, /Masala & Curry/);
});

test("documents the researched weather, sun, and sky data", async () => {
  const [almanac, weather, planner] = await Promise.all([
    readFile(new URL("app/almanac-data.ts", root), "utf8"),
    readFile(new URL("app/weather.ts", root), "utf8"),
    readFile(new URL("app/TripPlanner.tsx", root), "utf8"),
  ]);

  // NOAA 1991-2020 normals for every stop, including the canyon-floor caveat.
  assert.match(almanac, /NOAA\/NCEI 1991–2020/);
  assert.match(almanac, /augHighF: 84/); // Taos
  assert.match(almanac, /augHighF: 97/); // Palo Duro canyon floor
  assert.match(almanac, /TXZ317/); // canyon-specific NWS forecast zone
  // USNO-verified sun times at the trip's endpoints.
  assert.match(almanac, /7:05 AM CDT/);
  assert.match(almanac, /8:36 PM CDT/);
  // The moonless 2026 Perseid peak is the sky headline.
  assert.match(almanac, /New moon/);
  assert.match(almanac, /moonless Perseid maximum since 2018/);

  // Live data comes only from keyless, CORS-open government/free APIs.
  assert.match(weather, /api\.open-meteo\.com/);
  assert.match(weather, /api\.weather\.gov/);
  assert.match(weather, /forecast_days: "16"/);

  // The planner surfaces the Weather & sky tab and per-day conditions.
  assert.match(planner, /weather-panel/);
  assert.match(planner, /day-conditions/);
  assert.match(planner, /loadForecasts/);
  assert.match(planner, /loadAlerts/);
});

test("keeps the event research in the directory", async () => {
  const data = await readFile(new URL("app/trip-data.ts", root), "utf8");

  // Verified 2026 event findings.
  assert.match(data, /SWAIA Santa Fe Indian Market/);
  assert.match(data, /Aug 15–16/);
  assert.match(data, /San Lorenzo Feast Day · Picuris Pueblo/);
  assert.match(data, /Santa Fe Farmers' Market/);
  assert.match(data, /Meow Wolf/);
  // Resolved research questions stay resolved.
  assert.match(data, /Daily 9 AM–4 PM self-guided/); // Earthship
  assert.match(data, /annual closure starts Aug 20/); // Taos Pueblo
  assert.match(data, /Perseid peak with zero moonlight/);
});

test("keeps the site standalone and Pages-safe", async () => {
  const [config, workflow, layout, page, packageJson] = await Promise.all([
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(config, /basePath: "\/trip"/);
  assert.match(workflow, /test ! -e out\/CNAME/);
  assert.match(layout, /index: false/);
  assert.match(layout, /canonical: "\/trip\/"/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("public/CNAME", root)));
});

test("limits Firebase writes to the temporary trip board", async () => {
  const rules = await readFile(new URL("firestore.rules", root), "utf8");

  assert.match(rules, /tripBoards\/new-mexico-2026/);
  assert.match(rules, /timestamp\.date\(2026, 9, 1\)/);
  assert.match(rules, /allow list, delete: if false/);
  assert.match(rules, /customTodos\.size\(\) <= 30/);
});
