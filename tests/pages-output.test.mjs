import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("static Pages export keeps the PIN shell free of itinerary content", async () => {
  try {
    await access(new URL("out/index.html", root));
  } catch {
    assert.ok(true, "pages build not present; skipped");
    return;
  }

  const html = await readFile(new URL("out/index.html", root), "utf8");
  assert.match(html, /noindex,nofollow|noindex, nofollow|noindex/);
  assert.doesNotMatch(html, /Vegetarian Pasta/);
  assert.doesNotMatch(html, /Dickens on Main/);
  assert.doesNotMatch(html, /Menupix/);
  assert.doesNotMatch(html, /Pap's Italian Grill/);
  assert.doesNotMatch(html, /Flying L Dr/);
  assert.doesNotMatch(html, /College Station/);
  assert.doesNotMatch(html, /Cafe du Monde/);
  assert.doesNotMatch(html, /Celebration in the Oaks/);
  assert.doesNotMatch(html, /2 Phat Vegans/);
  assert.doesNotMatch(html, /Steamboat Natchez/);
  assert.doesNotMatch(html, /Cajun Pride/);
  assert.match(html, /Enter the trip PIN|trip PIN|4-digit PIN/);
  await assert.rejects(access(new URL("out/CNAME", root)));
  await assert.rejects(access(new URL("out/sitemap.xml", root)));
});
