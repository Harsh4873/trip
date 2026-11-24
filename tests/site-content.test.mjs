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
  assert.match(pinGate, /"6002"/);
  assert.match(pinGate, /"3605"/);
  assert.match(pinGate, /PIN_TRIPS/);
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
  for (const file of ["app/bandera-content.ts", "app/nola-content.ts"]) {
    const data = await read(file);
    const hrefs = hrefsFrom(data);
    assert.ok(hrefs.length >= 20, `${file}: expected many source hrefs, got ${hrefs.length}`);
    for (const href of hrefs) {
      assert.match(href, /^https?:\/\//, `${file} ${href}`);
    }
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
  assert.match(data, /confirm Thanksgiving hours|Thanksgiving hours are UNVERIFIED/);
  assert.match(data, /Confirm check-in|confirm checkout/);
  assert.doesNotMatch(planner, /chip-confirm/);
  assert.doesNotMatch(planner, /jump-nav/);
});

test("PinGate lazy-loads TripPlanner and does not inline trip content", async () => {
  const pinGate = await read("app/PinGate.tsx");
  const planner = await read("app/TripPlanner.tsx");
  assert.match(pinGate, /dynamic\(\(\) => import\("\.\/TripPlanner"\)\)/);
  assert.doesNotMatch(pinGate, /bandera-content/);
  assert.doesNotMatch(pinGate, /nola-content/);
  assert.doesNotMatch(pinGate, /Vegetarian Pasta/);
  assert.doesNotMatch(pinGate, /Dickens on Main/);
  assert.doesNotMatch(pinGate, /Cafe du Monde/);
  assert.doesNotMatch(pinGate, /Celebration in the Oaks/);
  assert.match(planner, /import\("\.\/bandera-content"\)/);
  assert.match(planner, /import\("\.\/nola-content"\)/);
});

test("lock screen is rethemed for the trip roadbook, not NM", async () => {
  const pinGate = await read("app/PinGate.tsx");
  assert.match(pinGate, />TX</);
  assert.match(pinGate, /Trip roadbook/);
  assert.match(pinGate, /Bandera/);
  assert.match(pinGate, /New Orleans/);
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

test("starts and ends in Katy, not College Station", async () => {
  const [data, planner, pinGate, layout, readme] = await Promise.all([
    read("app/bandera-content.ts"),
    read("app/TripPlanner.tsx"),
    read("app/PinGate.tsx"),
    read("app/layout.tsx"),
    read("README.md"),
  ]);
  const joined = `${data}\n${planner}\n${pinGate}\n${layout}\n${readme}`;
  assert.doesNotMatch(joined, /College Station/);
  assert.match(data, /originCity: "Katy, TX"/);
  assert.match(data, /https:\/\/www\.google\.com\/maps\/dir\/Katy,\+TX\/675\+Flying\+L\+Dr,\+Bandera,\+TX\+78003/);
  assert.match(data, /https:\/\/www\.google\.com\/maps\/dir\/675\+Flying\+L\+Dr,\+Bandera,\+TX\+78003\/Katy,\+TX/);
  assert.match(data, /3 hours 57 minutes/);
  assert.match(data, /3 hours 56 minutes/);
  assert.match(data, /I-10 west \(Katy Freeway\)/);
  assert.match(data, /H-E-B in Katy before noon/);
});

test("includes Pap's Italian Grill as a Fri\/Sat dinner, not a Thursday plan", async () => {
  const data = await read("app/bandera-content.ts");
  assert.match(data, /Pap's Italian Grill/);
  assert.match(data, /632 TX-16, Bandera, TX 78003/);
  assert.match(data, /\(830\) 796-9400/);
  assert.match(data, /menusweb\.com\/restaurants\/paps-italian-grill-menu-bandera/);
  assert.match(data, /Cheese ravioli/);
  assert.match(data, /Spinach manicotti/);
  assert.match(data, /Fettuccine alfredo/);
  assert.match(data, /suggested Friday dinner/);
  assert.match(data, /do not treat Pap's as Thursday dinner unless they confirm/);
  assert.match(data, /Sauces and broth are unconfirmed|sauces and broth is UNVERIFIED/);
});

test("events cover Nov 26-29 only and do not promote later parades as this weekend", async () => {
  const data = await read("app/bandera-content.ts");
  assert.match(data, /Country Christmas in the Park/);
  assert.match(data, /Dickens on Main/);
  assert.match(data, /Kin Faux/);
  assert.match(data, /Rick Rice Band/);
  assert.match(data, /Native American Heritage Day/);
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
  assert.match(data, /reservation flag|reserve: true/);
  assert.match(data, /Wharton's Dock Road/);
  assert.match(data, /Lowe's Market closed Thanksgiving/);
  assert.match(data, /Hill Country SNA reopens 6:00 a.m. Thursday/);
  assert.match(data, /Frontier Times Museum/);
  assert.match(data, /Buc-ee's Luling/);
});

test("renders sticky tabs and a calendar time-grid without filter chips", async () => {
  const [planner, calendar, data] = await Promise.all([
    read("app/TripPlanner.tsx"),
    read("app/CalendarGrid.tsx"),
    read("app/bandera-content.ts"),
  ]);
  assert.match(planner, /Schedule/);
  assert.match(planner, /Food/);
  assert.match(planner, /Attractions/);
  assert.match(planner, /Events/);
  assert.match(planner, /tab-bar/);
  assert.match(planner, /day-switcher/);
  assert.match(planner, /span-toggle/);
  assert.match(planner, /chooseSpan\("day"\)/);
  assert.match(planner, /spanAllLabel/);
  assert.match(planner, /trip-schedule-span/);
  assert.match(planner, /America\/Chicago/);
  assert.match(planner, /2026-11-26/);
  assert.match(planner, /2026-11-29/);
  assert.match(calendar, /cal-block/);
  assert.match(calendar, /cal-grid/);
  assert.match(data, /kind: "drive"/);
  assert.match(data, /id: "thu-heb"/);
  assert.match(data, /startMin: 495/);
  assert.match(data, /shortTitle: "H-E-B in Katy"/);
  assert.match(data, /hoursNote:/);
  assert.match(data, /shortTitle: "Hike options"/);
  assert.match(data, /shortTitle: "Day options"/);
  assert.match(data, /shortTitle: "Music options"/);
  assert.match(data, /shortTitle: "Return options"/);
  assert.match(calendar, /Options: /);
  assert.match(calendar, /MIN_BLOCK_PX = 48/);
  assert.match(calendar, /mode: "day" \| "week"/);
  assert.match(calendar, /cal-block-detail/);
  assert.doesNotMatch(planner, /chip-row|Chips /);
  assert.doesNotMatch(planner, /jump-nav/);
  assert.doesNotMatch(planner, /day-row/);
});

test("keeps reusable Wikimedia photos on disk with credits and lists photo gaps", async () => {
  const data = await read("app/bandera-content.ts");
  assert.match(data, /\/images\/downtown-bandera\.webp/);
  assert.match(data, /\/images\/frontier-times\.webp/);
  assert.match(data, /\/images\/hill-country-sna\.webp/);
  assert.match(data, /\/images\/lost-maples\.webp/);
  assert.match(data, /\/images\/medina-river\.webp/);
  assert.match(data, /\/images\/ost\.webp/);
  assert.match(data, /\/images\/bucees-luling\.webp/);
  assert.match(data, /\/images\/river-walk\.webp/);
  assert.match(data, /\/images\/cave\.webp/);
  assert.match(data, /\/images\/boerne-main\.webp/);
  assert.match(data, /Larry D\. Moore/);
  assert.match(data, /CC BY 4\.0/);
  assert.match(data, /Billy Hathorn/);
  assert.match(data, /CC BY-SA 3\.0/);
  assert.match(data, /Stewart Tomlinson/);
  assert.match(data, /Pap's Italian Grill/);
  assert.match(data, /Flying L Ranch Resort \(no reusable photo found/);
  assert.match(data, /Cibolo Nature Center/);
  await access(new URL("public/images/downtown-bandera.webp", root));
  await access(new URL("public/images/frontier-times.webp", root));
  await access(new URL("public/images/bucees-luling.webp", root));
});

test("does not put the owner's name or personal contact on the page", async () => {
  const [data, nola, planner, pinGate, layout] = await Promise.all([
    read("app/bandera-content.ts"),
    read("app/nola-content.ts"),
    read("app/TripPlanner.tsx"),
    read("app/PinGate.tsx"),
    read("app/layout.tsx"),
  ]);
  const joined = `${data}\n${nola}\n${planner}\n${pinGate}\n${layout}`;
  assert.doesNotMatch(joined, /Harsh Dave/);
  assert.doesNotMatch(joined, /\bBoss\b/);
  assert.doesNotMatch(joined, /@gmail\.com/);
});

test("each PIN opens only its own trip", async () => {
  const [pinGate, planner] = await Promise.all([read("app/PinGate.tsx"), read("app/TripPlanner.tsx")]);
  assert.match(pinGate, /"6002": "bandera"/);
  assert.match(pinGate, /"3605": "nola"/);
  assert.match(pinGate, /<TripPlanner tripId=\{unlockedTrip\} \/>/);
  assert.doesNotMatch(planner, /trip-switcher|onTripId|trip-roadbook-selected/);
});

test("has a Day / all-days toggle for both trips", async () => {
  const [planner, nola, bandera] = await Promise.all([
    read("app/TripPlanner.tsx"),
    read("app/nola-content.ts"),
    read("app/bandera-content.ts"),
  ]);
  assert.match(planner, /New Orleans/);
  assert.match(planner, /chooseSpan\("day"\)/);
  assert.match(bandera, /spanAllLabel: "4 days"/);
  assert.match(nola, /spanAllLabel: "All days"/);
  assert.match(nola, /2026-12-25/);
  assert.match(nola, /2026-12-26/);
});

test("encodes the NOLA stay, Katy drive assumption, vegetarian food, and Christmas closures", async () => {
  const data = await read("app/nola-content.ts");
  assert.match(data, /New Orleans/);
  assert.match(data, /Thu Dec 25 to Fri Dec 26, 2026/);
  assert.match(data, /originCity: "Katy, TX"/);
  assert.match(data, /about 5 hours each way via I-10/);
  assert.match(data, /7 hours 2 minutes/);
  assert.match(data, /Strict ovo-lacto vegetarian/);
  assert.match(data, /Cafe du Monde/);
  assert.match(data, /closed only on Christmas Day|Closed Christmas Day/);
  assert.match(data, /2 Phat Vegans/);
  assert.match(data, /Killer PoBoys/);
  assert.match(data, /Sweet Soulfood/);
  assert.match(data, /Satsuma/);
  assert.match(data, /Cajun Pride/);
  assert.match(data, /closed Christmas Day/);
  assert.match(data, /Jean Lafitte/);
  assert.match(data, /not valid Christmas Day/);
  assert.match(data, /Honey Island/);
  assert.match(data, /Steamboat Natchez/);
  assert.match(data, /Creole Queen/);
  assert.match(data, /Celebration in the Oaks/);
  assert.match(data, /Christmas Hours: 5 PM–10 PM|Christmas Hours 5/);
  assert.match(data, /Snug Harbor/);
  assert.match(data, /Frenchmen Street/);
  assert.match(data, /St\. Charles/);
  assert.match(data, /St\. Louis Cathedral/);
  assert.match(data, /Réveillon|Reveillon/);
  assert.match(data, /bonfires/);
  assert.match(data, /ovo-lacto/);
  assert.match(data, /no hotel is named|does not name a hotel/);
});

test("notes Groupon listings without inventing Christmas sailings", async () => {
  const data = await read("app/nola-content.ts");
  assert.match(data, /groupon.com\/deals\/jean-lafitte-tours-4/);
  assert.match(data, /\$23 \(from \$32\)/);
  assert.match(data, /groupon.com\/deals\/steamboat-natchez-1/);
  assert.match(data, /\$38\.15/);
  assert.match(data, /groupon.com\/deals\/gl-cajun-pride-swamp-tours-1/);
  assert.match(data, /\$39\.99/);
  assert.match(data, /groupon.com\/deals\/creole-queen-5-new-orleans/);
  assert.match(data, /No Honey Island \/ Cajun Encounters Groupon was listed/);
});

test("keeps reusable NOLA Wikimedia photos on disk with credits", async () => {
  const data = await read("app/nola-content.ts");
  assert.match(data, /\/images\/jackson-square\.webp/);
  assert.match(data, /\/images\/cafe-du-monde\.webp/);
  assert.match(data, /\/images\/steamboat-natchez\.webp/);
  assert.match(data, /\/images\/st-charles-streetcar\.webp/);
  assert.match(data, /\/images\/garden-district\.webp/);
  assert.match(data, /\/images\/frenchmen-street\.webp/);
  assert.match(data, /\/images\/celebration-oaks\.webp/);
  assert.match(data, /\/images\/city-park\.webp/);
  assert.match(data, /\/images\/honey-island\.webp/);
  assert.match(data, /Infrogmation of New Orleans/);
  assert.match(data, /CC BY-SA 4\.0/);
  await access(new URL("public/images/jackson-square.webp", root));
  await access(new URL("public/images/cafe-du-monde.webp", root));
  await access(new URL("public/images/celebration-oaks.webp", root));
  await access(new URL("public/images/honey-island.webp", root));
});
