/* CANONICAL GEOGRAPHY — the one declared table behind every site-wide number.
 *
 * The site states four totals in six different places: spots, validated
 * cities, countries, continents. Before Sept 8 2026 all four were typed by
 * hand into each of those places, and they disagreed with each other and with
 * the data — the system section was still claiming "180+ spots across 29
 * cities and 13 countries" against a real 220/13/10, and had been for weeks.
 *
 * Now: the SPOT count is walked out of the framework data files at build time
 * (see vite.config.js and src/utils/derive.js), and the GEOGRAPHY comes from
 * this file. Cities, countries and continents are COUNTED from the arrays
 * below, never typed. Add a framework here and every surface updates itself.
 *
 * ⚠️ THIS FILE IS DECLARED, NOT DERIVED — and it is the only place that is.
 * A country cannot be walked out of a spot list; nothing in dublin.js says
 * "Ireland". So this table is the human-maintained edge of the system, and it
 * is deliberately tiny and auditable for that reason. When a framework ships,
 * it is added HERE and nowhere else.
 *
 * The pin coordinates lived in Globe.jsx until today. They moved here so the
 * build can read them without loading three.js; Globe.jsx imports them back
 * and renders exactly what it rendered before.
 */

/* One entry per PUBLISHED framework — the files that make up the canonical
 * spot count. `countries` is an array because prague carries two: Dresden is a
 * two-hour day trip that Brady ruled on Aug 29 2026 stays with Prague rather
 * than moving to the new vienna framework. Germany is therefore reached by
 * both prague and munich, which is why the European entries describe fewer
 * countries than they have rows.
 *
 * 🟣 PERU JOINED Sept 16 2026, and the reason is worth recording. /peru went
 * public on Sept 8 — indexed, in the sitemap, linked — but it was never added
 * here, so for eight days every derived surface on the site said "3
 * continents" while a South American framework was live. Nobody typed a false
 * sentence; the table simply did not know about a page that had shipped. That
 * is the same failure this file was created to end, arriving through the one
 * door left open: the human-maintained edge.
 *
 * ⛔ THE RULE THAT CLOSES IT: a framework enters this table in the SAME commit
 * that lifts its noindex. Publishing a route and registering it here are one
 * action, not two.
 *
 * Peru's 25 saved places carry `note`, not `description`, so the live-walk
 * does not see them and the spot total does not move today. That is correct
 * and it is temporary — the descriptions land in their own session, and the
 * count will move itself when they do, because nothing about it is typed. */
export const FRAMEWORKS = [
  { slug: 'dublin', countries: ['Ireland'], continent: 'Europe' },
  { slug: 'spain', countries: ['Spain'], continent: 'Europe' },
  { slug: 'rome', countries: ['Italy'], continent: 'Europe' },
  { slug: 'australia', countries: ['Australia'], continent: 'Oceania' },
  { slug: 'iceland', countries: ['Iceland'], continent: 'Europe' },
  { slug: 'prague', countries: ['Czech Republic', 'Germany'], continent: 'Europe' },
  { slug: 'vienna', countries: ['Austria'], continent: 'Europe' },
  { slug: 'munich', countries: ['Germany'], continent: 'Europe' },
  { slug: 'poland', countries: ['Poland'], continent: 'Europe' },
  { slug: 'michigan', countries: ['United States'], continent: 'North America' },
  { slug: 'peru', countries: ['Peru'], continent: 'South America' },
]

/* ⚠️ TERRITORIES — the question San Juan will ask, recorded before it arrives.
 * Puerto Rico is a US territory, so a San Juan framework adds a FRAMEWORK and
 * a CITY but NOT a country: the United States is already counted through
 * michigan. Counting it would inflate our coverage claim, and not counting it
 * makes the word "countries" do work it cannot quite do. The label treatment
 * is Brady's pick and is not decided here. */

/* GOLD PINS — a validated city is one a framework actually covers. Sub-cities
 * with their own pin (Galway, Madrid, Tasmania, Vienna) take their own bucket;
 * `slug` is which framework's data feeds the pin's count, and `primary` marks
 * the pin that absorbs everything not attributed to a sub-city. */
export const VALIDATED_CITY_PINS = [
  { city: 'Dublin', lat: 53.35, lng: -6.26, slug: 'dublin', primary: true, showLabel: true },
  { city: 'Galway', lat: 53.27, lng: -9.06, slug: 'dublin' },
  { city: 'Barcelona', lat: 41.39, lng: 2.17, slug: 'spain', primary: true, showLabel: true },
  { city: 'Madrid', lat: 40.42, lng: -3.7, slug: 'spain' },
  { city: 'Rome', lat: 41.9, lng: 12.5, slug: 'rome', primary: true, showLabel: true },
  { city: 'Sydney', lat: -33.87, lng: 151.21, slug: 'australia', primary: true, showLabel: true },
  { city: 'Tasmania', lat: -42.88, lng: 147.33, slug: 'australia' },
  { city: 'Reykjavik', lat: 64.15, lng: -21.94, slug: 'iceland', primary: true, showLabel: true },
  { city: 'Prague', lat: 50.08, lng: 14.44, slug: 'prague', primary: true, showLabel: true },
  { city: 'Vienna', lat: 48.21, lng: 16.37, slug: 'vienna', primary: true },
  { city: 'Munich', lat: 48.14, lng: 11.58, slug: 'munich', primary: true },
  { city: 'Krakow', lat: 50.06, lng: 19.94, slug: 'poland', primary: true },
  { city: 'Michigan', lat: 42.96, lng: -85.67, slug: 'michigan', primary: true, showLabel: true },
]

/* COPPER PINS — explored, ingested, or planned, but no published framework.
 * They render at a uniform small size with NO count, because a count here
 * would read as validated coverage. Four of them are the September/November
 * build slate (San Juan, Costa Rica, Vancouver, plus the Bruce). */
export const RESEARCH_CITY_PINS = [
  { city: 'Costa Rica', lat: 9.62, lng: -84.63 },
  { city: 'Vancouver', lat: 49.28, lng: -123.12 },
  { city: 'Chicago', lat: 41.88, lng: -87.63 },
  { city: 'San Juan', lat: 18.47, lng: -66.11 },
  { city: 'Seattle', lat: 47.61, lng: -122.33 },
  { city: 'Smoky Mtns', lat: 35.61, lng: -83.43 },
  { city: 'Phoenix', lat: 33.45, lng: -112.07 },
]

/* PUBLISHED BUT UNCOUNTED — a framework whose page is live while its places
 * are still being described. Cusco read "Coming soon" for the eight days after
 * /peru shipped, which was false the moment the route went public.
 *
 * It is deliberately NOT a gold pin: gold carries a validated spot count, and
 * Peru's is legitimately 0 until the descriptions land. So it stays copper,
 * gains a `slug` so it actually reaches the live page, and the tooltip states
 * the fact rather than announcing what we have not finished yet — the same
 * rule that keeps the 16 silent Peru places silent. It graduates to gold, with
 * a real derived count, in the session that gives those places descriptions. */
export const PUBLISHED_UNCOUNTED_CITY_PINS = [
  { city: 'Cusco', lat: -13.52, lng: -71.97, slug: 'peru', published: true },
]

/* The counts themselves. Never type these numbers anywhere else. */
export const VALIDATED_CITY_COUNT = VALIDATED_CITY_PINS.length
export const FRAMEWORK_COUNT = FRAMEWORKS.length
export const COUNTRY_COUNT = new Set(FRAMEWORKS.flatMap((f) => f.countries)).size
export const CONTINENT_COUNT = new Set(FRAMEWORKS.map((f) => f.continent)).size
