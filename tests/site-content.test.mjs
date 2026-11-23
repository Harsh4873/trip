import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

const read = (rel) => readFile(new URL(rel, root), "utf8");

function hrefsFrom(source) {
  return [...source.matchAll(/\bhref:\s*"([^"]+)"/g)].map((match) => match[1]);
}

test("keeps the site standalone and Pages-safe", async () => {
  const [config, workflow, layout, page, pinGate, packageJson] = await Promise.all([
    read("next.config.ts"),
    read(".github/workflows/deploy-pages.yml"),
    read("app/layout.tsx"),
    read("app/page.tsx"),
    read("app/PinGate.tsx"),
    read("package.json"),
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

test("keeps noindex/nofollow and does not add a sitemap", async () => {
  const layout = await read("app/layout.tsx");
  assert.match(layout, /<meta name="robots" content="noindex,nofollow"/);
  assert.match(layout, /follow: false/);
  await assert.rejects(access(new URL("public/sitemap.xml", root)));
  await assert.rejects(access(new URL("app/sitemap.ts", root)));
});

test("every external link in the content data has an http(s) URL", async () => {
  const data = await read("app/bandera-content.ts");
  const hrefs = hrefsFrom(data);
  assert.ok(hrefs.length >= 50, `expected many source hrefs, got ${hrefs.length}`);
  for (const href of hrefs) {
    assert.match(href, /^https?:\/\//, href);
  }
});

test("UNVERIFIED flags exist in the data and render on the trip page", async () => {
  const [data, planner] = await Promise.all([
    read("app/bandera-content.ts"),
    read("app/TripPlanner.tsx"),
  ]);
  const unverifiedCount = (data.match(/unverified:\s*true/g) ?? []).length;
  assert.ok(unverifiedCount >= 15, `expected many UNVERIFIED facts, got ${unverifiedCount}`);
  assert.match(planner, /UNVERIFIED/);
  assert.match(planner, /badge-unverified/);
  assert.match(data, /confirm Thanksgiving hours/);
  assert.match(data, /confirm check-in/);
  assert.match(planner, /chip-confirm/);
});

test("PinGate lazy-loads TripPlanner and does not inline trip content", async () => {
  const pinGate = await read("app/PinGate.tsx");
  const planner = await read("app/TripPlanner.tsx");
  assert.match(pinGate, /dynamic\(\(\) => import\("\.\/TripPlanner"\)\)/);
  assert.doesNotMatch(pinGate, /bandera-content/);
  assert.doesNotMatch(pinGate, /Vegetarian Pasta/);
  assert.doesNotMatch(pinGate, /Dickens on Main/);
  assert.match(planner, /import\("\.\/bandera-content"\)/);
});

test("lock screen is rethemed for Bandera, not NM", async () => {
  const pinGate = await read("app/PinGate.tsx");
  assert.match(pinGate, />TX</);
  assert.match(pinGate, /Bandera roadbook/);
  assert.doesNotMatch(pinGate, />NM</);
  assert.doesNotMatch(pinGate, /New Mexico Roadbook/);
});

test("encodes the Bandera stay, diet, weather strip, and as-of stamp", async () => {
  const data = await read("app/bandera-content.ts");
  assert.match(data, /Flying L Ranch/);
  assert.match(data, /675 Flying L Dr, Bandera, TX 78003/);
  assert.match(data, /Thu Nov 26 to Sun Nov 29, 2026/);
  assert.match(data, /America\/Chicago/);
  assert.match(data, /1:42 pm CST Mon Nov 23, 2026/);
  assert.match(data, /Strict ovo-lacto vegetarian/);
  assert.match(data, /lard in refried beans/);
  assert.match(data, /Caesar dressing/);
  assert.match(data, /Coconut Cowboys/);
  assert.match(data, /Nov 23, 2026/);
  assert.match(data, /high near 62°F/);
  assert.match(data, /high near 73°F/);
});

test("events cover Nov 26-29 only and do not promote later parades as this weekend", async () => {
  const data = await read("app/bandera-content.ts");
  assert.match(data, /Country Christmas in the Park/);
  assert.match(data, /Dickens on Main/);
  assert.match(data, /Kin Faux/);
  assert.match(data, /Rick Rice Band/);
  assert.match(data, /dates: \["2026-11-26"/);
  assert.doesNotMatch(data, /dates: \["2026-12-12"/);
  assert.match(data, /Cowboy Christmas Parade and Jubilee are Dec 11-12, after this trip/);
  assert.match(data, /Albert & Bessie Kronkosky State Natural Area \(Pipe Creek\) opens Dec 1, after this trip/);
});

test("keeps source-linked food cards, OSRM drives, and local alerts", async () => {
  const data = await read("app/bandera-content.ts");
  assert.match(data, /Vegetarian Pasta/);
  assert.match(data, /Beyond Burger/);
  assert.match(data, /tjsoldforge.com\/wp-content\/uploads\/2026\/06\/Main-Menu-May-2026-Revision-1_bleed-2.pdf/);
  assert.match(data, /Charcuterie Plate 1, Small \(Meat-Free\)/);
  assert.match(data, /Menupix/);
  assert.match(data, /Nachos de Frijoles/);
  assert.match(data, /Lowe's Market/);
  assert.match(data, /4 hours 9 minutes/);
  assert.match(data, /reservation flag|reserve: true/);
  assert.match(data, /Wharton's Dock Road/);
  assert.match(data, /Lowe's Market closed Thanksgiving/);
  assert.match(data, /Hill Country SNA reopens 6:00 a.m. Thursday/);
});

test("does not put the owner's name or personal contact on the page", async () => {
  const [data, planner, pinGate, layout] = await Promise.all([
    read("app/bandera-content.ts"),
    read("app/TripPlanner.tsx"),
    read("app/PinGate.tsx"),
    read("app/layout.tsx"),
  ]);
  const joined = `${data}\n${planner}\n${pinGate}\n${layout}`;
  assert.doesNotMatch(joined, /Harsh Dave/);
  assert.doesNotMatch(joined, /\bBoss\b/);
  assert.doesNotMatch(joined, /@gmail\.com/);
});
