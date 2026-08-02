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

test("ships a richer, practical directory with map navigation", async () => {
  const [data, planner] = await Promise.all([
    readFile(new URL("app/trip-data.ts", root), "utf8"),
    readFile(new URL("app/TripPlanner.tsx", root), "utf8"),
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
  assert.match(planner, /https:\/\/www\.google\.com\/maps\/dir/);
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
