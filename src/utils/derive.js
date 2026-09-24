/* DERIVED STATS — the end of hardcoded claims.
 *
 * WHY THIS FILE EXISTS. On Sept 2 2026 an audit of /michigan found four hero
 * claims that the data could not support: "42+ Venues" against 22 spots,
 * "9 Golf Destinations" against 4, "8 curated bar crawls" against a `crawls`
 * key that has never existed, and "123 Shows Tracked" against zero event rows
 * in the repo. The sweep that followed found the same class of failure on six
 * more frameworks and five shared surfaces — spain claiming 100+ spots against
 * 38, australia claiming 123 against 22, the system section claiming "180+
 * spots across 29 cities and 13 countries" against a canonical 220/13/10.
 *
 * None of those were ever lies when they were typed. Every one of them was
 * true on the day someone wrote it and went stale silently when the data moved
 * underneath it. That is the failure mode, and a proofreading pass does not fix
 * it — it only resets the clock.
 *
 * ⛔ THE RULE, effective Sept 8 2026: a number that describes our own data is
 * NEVER typed into a string. It is derived from the data, at build time or at
 * render, so it cannot drift. If you find yourself typing a count into copy,
 * you are reintroducing the bug this file was written to kill.
 *
 * WHAT IS NOT DERIVED, DELIBERATELY. Founder facts are not data counts and
 * cannot come from here: "6 Weeks Lived There", "2 Study Abroads", "Sept 19
 * Festival Opens", dublin's "35+ Pubs Visited". Those rest on Brady's word
 * about a trip, exactly like the endorsement gradient and the silent 16 Peru
 * places, and the data file has no way to know them. They stay authored as
 * `value`. The distinction is the whole point: derive what we can count,
 * attribute what only a founder can say.
 */

/* The live-walk. The same shape App.jsx's countSpots and Globe.jsx's
 * countSpotsByCity have used since June 7 2026: any object carrying a `name`
 * AND a `description` or `notes` is a spot. Day anchors, category headings and
 * bare coordinate records are not spots and are not counted — which is why
 * peru.js's 10 day anchors and the silent saved places do not move a total.
 * The `seen` set guards the cycles that cross-referenced data can introduce.
 *
 * ── AMENDED September 24, 2026, on Brady's note→notes ruling ──
 *
 * A place carrying a founder's verbatim `ladsTake` IS a described place. It is
 * described by a person rather than by a research pass, which is the stronger
 * of the two and the entire product. Counting `description` while ignoring
 * `ladsTake` meant Peru's 25 places contributed 0 to the canonical total while
 * nine of them carried Brady's own words — the site under-reporting its single
 * most valuable content.
 *
 * ⛔ WHY NOT THE OBVIOUS FIX. The recorded plan was to rename peru.js's `note`
 * key to `notes` and let the walker see it. That would have counted the wrong
 * nine. `note` in peru.js does NOT hold Brady's voice — it holds ENGINEERING
 * PROVENANCE: EXIF anchor coordinates, Tivoli-rule reasoning, and instructions
 * to the renderer like "Do NOT render this as the trek's location". Promoting
 * those would have published our own paperwork onto place cards, which is the
 * exact thing Brady ruled against on /peru, and would have passed the 300+
 * gate on entries that describe nothing to a reader. The gate is "published
 * AND described"; padding it with silent entries fails it rather than passing
 * it. `ladsTake` is the key that actually holds a description.
 *
 * ⛔ OFFICE RECORDS ARE NOT PLACES. A record whose coordinate is a tour
 * operator's downtown sales office is a booking record, not somewhere a reader
 * can go — peru.js flags two of them (`Salkantay Trek` and `Red Valley Cusco`,
 * both sitting in central Cusco ~100 km from what they name) with
 * `recordIsOffice: true`, and PeruMap already refuses to draw them. They are
 * now excluded from the count for the same reason, which is why this ruling
 * lands on 227 rather than the forecast 229: that forecast counted both office
 * records as places. The duplicate-quote guard in PeruPage already resolves
 * the one shared `ladsTake` in favour of the real place (Vinicunca) over the
 * office record, so no founder sentence is counted twice.
 */
import { FRAMEWORKS } from '../data/canonical.js'

/* A framework's ROOT object carries a `name` and, on every one of the eleven,
 * a framework-level `ladsTake` — the founder quote FrameworkPage renders once
 * at the foot of the page, about the destination as a whole. It is not a
 * place. Counting it added exactly +1 to all eleven frameworks the first time
 * this walk accepted `ladsTake`, which is the kind of silent inflation this
 * whole derived-numbers system exists to prevent. A node holding an array of
 * places is a container, never one of them. */
const isContainer = (node) =>
  Array.isArray(node.spots) || Array.isArray(node.categories) || Array.isArray(node.dayTrips)

export function walkSpots(node, seen = new Set(), out = []) {
  if (!node || typeof node !== 'object' || seen.has(node)) return out
  seen.add(node)
  const described = node.description || node.notes || node.ladsTake
  if (
    !Array.isArray(node) &&
    node.name &&
    described &&
    node.recordIsOffice !== true &&
    !isContainer(node)
  ) {
    out.push(node)
  }
  for (const v of Object.values(node)) {
    if (v && typeof v === 'object') walkSpots(v, seen, out)
  }
  return out
}

export const countSpots = (data) => walkSpots(data).length

/* Spots in one city. Multi-city frameworks state a per-city split in their
 * overview prose - dublin's "Dublin and Galway", spain's "Barcelona and
 * Madrid" - and every one of those splits was typed by hand and had drifted.
 * Spots record their city on either `city` or `area`. */
export const countByCity = (data, city) =>
  walkSpots(data).filter(
    (s) => String(s.city || s.area || '').toLowerCase() === String(city).toLowerCase()
  ).length

/* Spots belonging to one category. Frameworks store this two different ways
 * and both are real: michigan.js nests its spots INSIDE each category object,
 * while dublin/spain/rome keep a flat top-level `spots` array whose entries
 * carry a `category` string. Match the nested form first (it is unambiguous),
 * then fall back to the flat form, comparing against both the category's id
 * and its display name because the flat files store the human label. */
export function countCategory(data, categoryId) {
  const cat = (data.categories || []).find((c) => c.id === categoryId)
  if (cat && Array.isArray(cat.spots) && cat.spots.length) return walkSpots(cat).length
  const names = new Set([categoryId, cat?.name].filter(Boolean).map((s) => String(s).toLowerCase()))
  return walkSpots(data).filter((s) => s.category && names.has(String(s.category).toLowerCase()))
    .length
}

/* Spots NOT in the given categories — how michigan states its venue count
 * without double-counting the golf courses alongside the taprooms. */
export function countSpotsExcept(data, categoryIds = []) {
  const excluded = new Set(categoryIds)
  const nested = new Set()
  for (const c of data.categories || []) {
    if (excluded.has(c.id)) for (const s of walkSpots(c)) nested.add(s)
  }
  const names = new Set(
    (data.categories || [])
      .filter((c) => excluded.has(c.id))
      .flatMap((c) => [c.id, c.name])
      .filter(Boolean)
      .map((s) => String(s).toLowerCase())
  )
  return walkSpots(data).filter(
    (s) => !nested.has(s) && !(s.category && names.has(String(s.category).toLowerCase()))
  ).length
}

/* Resolve one heroStat to what it should display.
 *
 * Three forms, in precedence order:
 *   { derive: () => n }        a function — for counts that need another data
 *                              file (michigan's live events read livePulse) or
 *                              that depend on today's date. Called at render,
 *                              so an expiring count expires on screen.
 *   { derive: 'spots' }        a token resolved against this framework's data.
 *   { value: '35+' }           an authored founder fact. Left exactly as typed.
 *
 * An unknown token returns null and the stat is dropped rather than rendered
 * as "undefined" — a missing stat is honest, a broken one is not. */
export function resolveStat(stat, data) {
  if (typeof stat.derive === 'function') return stat.derive(data)
  if (typeof stat.derive === 'string') {
    const token = stat.derive
    if (token === 'spots') return countSpots(data)
    if (token.startsWith('category:')) return countCategory(data, token.slice(9))
    if (token.startsWith('except:')) return countSpotsExcept(data, token.slice(7).split('+'))
    if (token === 'dayTrips') return (data.dayTrips || []).length
    if (token === 'windows') return (data.timingWindows || []).length
    if (token === 'categories') return (data.categories || []).length
    /* Countries come from the one declared table, not from the spot list -
     * nothing inside prague.js says "Germany", but Dresden is in it. */
    if (token === 'countries') {
      const fw = FRAMEWORKS.find((f) => f.slug === data.id)
      return fw ? fw.countries.length : null
    }
    return null
  }
  return stat.value ?? null
}

/* Hero stats with every derivable number resolved, and anything unresolvable
 * dropped instead of rendered broken. */
export function resolveHeroStats(data) {
  return (data.heroStats || [])
    .map((s) => ({ ...s, value: resolveStat(s, data) }))
    .filter((s) => s.value !== null && s.value !== undefined && s.value !== '')
}
