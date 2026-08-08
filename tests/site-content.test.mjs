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

test("ships a richer, practical directory with map navigation", async () => {
  const [data, planner, maps] = await Promise.all([
    readFile(new URL("app/trip-data.ts", root), "utf8"),
    readFile(new URL("app/TripPlanner.tsx", root), "utf8"),
    readFile(new URL("app/maps.ts", root), "utf8"),
  ]);

  assert.match(data, /export const dayTips/);
  assert.match(data, /Mirch Masala/);
  assert.match(data, /Sweetwater Harvest Kitchen/);
  assert.match(data, /Itality Plant Based Foods/);
  assert.match(data, /Yellow City Street Food/);
  assert.match(data, /Museum of North Texas History/);
  assert.ok((data.match(/category: "food"/g) ?? []).length >= 21);
  assert.ok((data.match(/category: "attraction"/g) ?? []).length >= 26);
  assert.match(data, /Open drive route/);
  assert.match(planner, /routeHref\(activeDay\.route\)/);
  assert.match(planner, /Know before you go/);
  assert.match(maps, /https:\/\/www\.google\.com\/maps\/dir/);
});

test("puts named road stops and cuisine choices directly in the schedule", async () => {
  const [data, planner] = await Promise.all([
    readFile(new URL("app/trip-data.ts", root), "utf8"),
    readFile(new URL("app/TripPlanner.tsx", root), "utf8"),
  ]);

  assert.match(data, /export type ScheduleOption/);
  assert.match(data, /Buc-ee’s · Amarillo/);
  assert.match(data, /Love’s Travel Stop · Santa Rosa #285/);
  assert.match(data, /Pilot Travel Center · Clovis #1118/);
  assert.match(data, /Love’s Travel Stop · Las Vegas #733/);
  assert.match(data, /Flying J Travel Center · Abilene/);
  assert.match(data, /Wichita County Safety Rest Area/);
  assert.match(data, /Other cuisines for arrival night/);
  assert.match(data, /Mediterranean/);
  assert.match(data, /Italian/);
  assert.match(data, /Mexican/);
  assert.match(data, /route: "abilene"/);
  assert.match(data, /route: "wichita"/);
  assert.match(planner, /timeline-location/);
  assert.match(planner, /timeline-options/);
  assert.match(planner, /August 15 needs a route choice/);
});

test("keeps every travel-day meal restaurant-first and vegetarian", async () => {
  const data = await readFile(new URL("app/trip-data.ts", root), "utf8");

  assert.doesNotMatch(data, /packed (vegetarian )?(meal|lunch|snack|breakfast)/i);
  assert.doesNotMatch(data, /road meal|road lunch/i);
  assert.match(data, /Vegetarian restaurant lunch/);
  assert.match(data, /Plaza Grill · Las Vegas lunch/);
  assert.match(data, /La Cueva Café · Taos lunch/);
  assert.match(data, /Canyon dine-in vegetarian dinner/);
  assert.match(data, /Early vegetarian dinner before the final leg/);
  assert.match(data, /Bigg’s Pizza & More/);
  assert.match(data, /Kaveri Indian Cuisine/);
  assert.match(data, /Nikos Greek Gyros/);
  assert.match(data, /Pepito’s Mexican Restaurante/);
});

test("keeps the schedule route-verified and visual", async () => {
  const [data, planner, images] = await Promise.all([
    readFile(new URL("app/trip-data.ts", root), "utf8"),
    readFile(new URL("app/TripPlanner.tsx", root), "utf8"),
    readFile(new URL("app/place-images.ts", root), "utf8"),
  ]);

  // Verified lodging: Homewood Suites, not the old Hampton Inn guess.
  assert.match(data, /Homewood Suites by Hilton Lubbock, 5320 W Loop 289/);
  assert.doesNotMatch(data, /Hampton Inn/);
  // Day-1 stops sit on the real Houston corridors (no Dallas-direction detour).
  assert.match(data, /Buc-ee’s · Bastrop/);
  assert.match(data, /Buc-ee’s · Waller/);
  assert.doesNotMatch(data, /Hillsboro/);
  // On-route alternative for the east-Amarillo Buc-ee's detour.
  assert.match(data, /Russell's Truck & Travel Center · Glenrio/);
  // The verified-shorter Wichita Falls corridor is the return default.
  assert.match(planner, /useState<"abilene" \| "wichita">\("wichita"\)/);
  // Swipe-card schedule view with photos and a nested options swiper.
  assert.match(planner, /event-deck/);
  assert.match(planner, /option-swiper/);
  assert.match(planner, /placeImages/);
  assert.match(images, /taos-pueblo/);
  assert.match(images, /CC BY/);
});

test("ships the full-screen swipe deck", async () => {
  const [deck, planner] = await Promise.all([
    readFile(new URL("app/FocusDeck.tsx", root), "utf8"),
    readFile(new URL("app/TripPlanner.tsx", root), "utf8"),
  ]);

  // Swipe left marks the shared checklist; swipe right cycles to the bottom.
  assert.match(deck, /commit\(topId, "done"\)/);
  assert.match(deck, /commit\(topId, "later"\)/);
  assert.match(deck, /onToggleChecked\(id\)/);
  assert.match(deck, /current\.slice\(1\), current\[0\]/);
  // Horizontal-intent drag that still allows vertical scrolling in the card.
  assert.match(deck, /setPointerCapture/);
  // Entry points: the launch button and tapping a card's photo.
  assert.match(planner, /focus-launch/);
  assert.match(planner, /<FocusDeck/);
});

test("keeps the site standalone and Pages-safe", async () => {
  const [config, workflow, layout, page, pinGate, packageJson] = await Promise.all([
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/PinGate.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(config, /basePath: "\/trip"/);
  assert.match(workflow, /test ! -e out\/CNAME/);
  assert.match(layout, /index: false/);
  assert.match(layout, /canonical: "\/trip\/"/);
  assert.match(page, /<PinGate \/>/);
  assert.match(pinGate, /const ACCESS_PIN = "6002"/);
  assert.match(pinGate, /sessionStorage/);
  assert.match(pinGate, /dynamic\(\(\) => import\("\.\/TripPlanner"\)\)/);
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
