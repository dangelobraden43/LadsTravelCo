/* localIndex — ONE list of everything /local shows, normalised from the files that own it.
 *
 * Nothing is authored here. Each source file keeps its own provenance rules; this module
 * only gives every record the same shape, so the map, the lists and the counts all read
 * one array and cannot disagree:
 *
 *   michigan.js          the Michigan guide's places
 *   brucePeninsula.js    the Bruce Peninsula list (Aug 2026)
 *   midwestCandidates.js saved Maps lists across the region
 *   localBestOf.js       landmarks with coordinates from published records
 *   localResearch.js     GENERATED from the research agents' verified findings
 *
 * ⛔ /local is an information page (ruled Nov 17 2026): it does not split places by who has
 *    been there. Provenance stays on every record (`source`) and is never a tier on the page.
 * ⛔ Counts are derived from these arrays wherever they are printed. Never type one.
 * ⛔ Headline places are ORDERED BY A PUBLISHED MEASURE (how many Wikipedia editions carry an
 *    article, read from Wikidata at build), never by an opinion typed here.
 */
import michigan from './michigan.js'
import { BRUCE_PLACES, BRUCE_SOURCE } from './brucePeninsula.js'
import { MIDWEST_CANDIDATES, MIDWEST_CANDIDATES_SOURCE } from './midwestCandidates.js'
import { GOOD_VIEWS } from './localBestOf.js'
import { RESEARCH_PLACES, RESEARCH_EVENTS, RESEARCH_META } from './localResearch.js'

export const LAYERS = [
  { id: 'brews', label: 'Brews', long: 'Breweries, bars and wineries' },
  { id: 'eats', label: 'Eats', long: 'Food' },
  { id: 'views', label: 'Views', long: 'Shorelines, parks and lookouts' },
  { id: 'sights', label: 'Sights', long: 'Museums, landmarks and attractions' },
  { id: 'venues', label: 'Venues', long: 'Arenas, stadiums, theatres and clubs' },
  { id: 'golf', label: 'Golf', long: 'Golf courses' },
]

const TYPE_LAYER = {
  brewery: 'brews',
  winery: 'brews',
  bar: 'brews',
  food: 'eats',
  golf: 'golf',
  view: 'views',
  gem: 'sights',
}
const CATEGORY_LAYER = {
  venue: 'venues',
  arena: 'venues',
  stadium: 'venues',
  amphitheatre: 'venues',
  theatre: 'venues',
  'music-club': 'venues',
  'comedy-club': 'venues',
  museum: 'sights',
  'zoo-garden': 'sights',
  market: 'sights',
  landmark: 'sights',
  amusement: 'sights',
  tour: 'sights',
  park: 'views',
}
export const KIND_LABELS = {
  venue: 'Venue',
  brewery: 'Brewery',
  winery: 'Winery',
  bar: 'Bar',
  food: 'Food',
  golf: 'Golf',
  view: 'View',
  gem: 'Hidden gem',
  arena: 'Arena',
  stadium: 'Stadium',
  amphitheatre: 'Amphitheatre',
  theatre: 'Theatre',
  'music-club': 'Music club',
  'comedy-club': 'Comedy club',
  museum: 'Museum',
  'zoo-garden': 'Zoo or garden',
  market: 'Market',
  landmark: 'Landmark',
  amusement: 'Amusement park',
  tour: 'Tour',
  park: 'Park',
}

const slug = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/* michigan.js is a framework file: its places carry no `type`, so the kind is read from
 * the name. Its Lads rating is deliberately NOT carried over to this page. */
const NAME_KIND = [
  [/golf|links|dunes|bluffs/i, 'golf'],
  [/brewing|brewery|brewpub|beer|cider|distiller|pull barn/i, 'brewery'],
  [/winery|vineyard|cellars/i, 'winery'],
  [/\b(bar|pub|lounge|saloon|tavern)\b/i, 'bar'],
]
const michiganKind = (s) => {
  if (s.type && TYPE_LAYER[s.type]) return s.type
  for (const [re, k] of NAME_KIND) if (re.test(`${s.name} ${s.category || ''}`)) return k
  return 'food'
}
const michiganSpots = (() => {
  const found = []
  const walk = (o) => {
    if (!o || typeof o !== 'object') return
    if (Array.isArray(o)) return o.forEach(walk)
    if (o.name && (o.description || o.notes) && o !== michigan) found.push(o)
    Object.values(o).forEach(walk)
  }
  walk(michigan)
  return found
})()

const pin = (p) =>
  Number.isFinite(p.lat) && Number.isFinite(p.lng) ? { lat: p.lat, lng: p.lng } : {}
const google = (p) =>
  p.rating != null ? { rating: p.rating, reviews: p.reviews ?? null, price: p.price || null } : null

const fromMichigan = michiganSpots.map((s) => {
  const kind = michiganKind(s)
  return {
    name: s.name,
    ...pin(s),
    kind,
    layer: TYPE_LAYER[kind],
    city: s.area || null,
    state: 'MI',
    what: s.description || s.notes,
    source: 'The Lads Michigan guide',
    link: { to: '/michigan', label: 'Read the Michigan guide' },
  }
})

const fromBruce = BRUCE_PLACES.map((p) => ({
  name: p.name,
  ...pin(p),
  kind: p.type,
  layer: TYPE_LAYER[p.type] || 'sights',
  city: 'Bruce Peninsula',
  state: 'ON',
  what: p.note || null,
  google: google(p),
  source: BRUCE_SOURCE.label,
}))

const fromCandidates = MIDWEST_CANDIDATES.map((p) => ({
  name: p.name,
  ...pin(p),
  kind: p.type,
  layer: TYPE_LAYER[p.type] || 'sights',
  // a region label that names one city is that city; a label that names an area is not
  city: p.region === 'Grand Rapids' ? 'Grand Rapids' : null,
  area: p.region,
  state: null,
  what: null, // no description is written for a place nobody has ruled on
  google: google(p),
  address: p.address || null,
  source: MIDWEST_CANDIDATES_SOURCE.label,
}))

const fromViews = GOOD_VIEWS.map((p) => ({
  name: p.name,
  ...pin(p),
  kind: 'view',
  layer: 'views',
  city: null,
  area: p.region,
  state: p.state,
  what: p.what,
  source: 'Published records',
  url: p.wiki ? `https://en.wikipedia.org/wiki/${p.wiki}` : null,
  urlLabel: 'Read about it on Wikipedia',
}))

const fromResearch = RESEARCH_PLACES.map((p) => ({
  key: p.id,
  name: p.name,
  ...pin(p),
  kind: p.category,
  layer: CATEGORY_LAYER[p.category] || 'sights',
  city: p.city,
  state: p.state,
  what: p.what,
  caution: p.caution || null,
  capacity: p.capacity || null,
  editions: p.editions || 0,
  visitors: p.visitors && p.visitors.year ? p.visitors : null,
  source:
    p.sources && p.sources.length ? p.sources.map((s) => s.title).join(' · ') : 'Published records',
  url: p.officialUrl || null,
  urlLabel: 'Open the official site',
  checkedOn: p.checkedOn,
}))

/* A researched record of a place that is already here from another list is not a second
 * place: the earlier record wins and the research record is dropped (matched on the name). */
const norm = (s) => slug(s).replace(/^the-/, '')
const owned = new Set(
  [...fromMichigan, ...fromBruce, ...fromCandidates, ...fromViews].map((p) => norm(p.name))
)
const researchOnly = fromResearch.filter((p) => !owned.has(norm(p.name)))

const seen = new Map()
export const LOCAL_PLACES = [
  ...fromMichigan,
  ...fromBruce,
  ...fromCandidates,
  ...fromViews,
  ...researchOnly,
].map((p) => {
  const base = slug(p.name)
  const n = (seen.get(base) || 0) + 1
  seen.set(base, n)
  return {
    ...p,
    id: n === 1 ? base : `${base}-${n}`,
    pinned: Number.isFinite(p.lat),
    editions: p.editions || 0,
    visitors: p.visitors || null,
  }
})
const idByKey = new Map(LOCAL_PLACES.filter((p) => p.key).map((p) => [p.key, p.id]))
export const placeById = (id) => LOCAL_PLACES.find((p) => p.id === id) || null

export const PINNED = LOCAL_PLACES.filter((p) => p.pinned)
export const UNPINNED = LOCAL_PLACES.filter((p) => !p.pinned)
export const TOTAL = LOCAL_PLACES.length

/* ---------- what is on ---------- */
export const EVENT_TYPES = {
  concert: 'Live music',
  comedy: 'Comedy',
  theatre: 'Theatre',
  festival: 'Festival',
  market: 'Market',
  family: 'Family',
  football: 'Football',
  basketball: 'Basketball',
  hockey: 'Hockey',
  baseball: 'Baseball',
  soccer: 'Soccer',
  other: 'Event',
}
export const EVENT_GROUPS = [
  { id: 'all', label: 'Everything', types: null },
  { id: 'music', label: 'Music', types: ['concert'] },
  {
    id: 'sport',
    label: 'Sport',
    types: ['football', 'basketball', 'hockey', 'baseball', 'soccer'],
  },
  { id: 'stage', label: 'Comedy & theatre', types: ['comedy', 'theatre'] },
  { id: 'season', label: 'Festivals & markets', types: ['festival', 'market', 'family', 'other'] },
]
export const EVENTS_META = RESEARCH_META

/** The local date as YYYY-MM-DD. (toISOString is UTC and reads a day ahead in the evening.) */
export const localISO = (d = new Date()) =>
  [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-')
export const addDays = (iso, n) => {
  const [y, m, d] = iso.split('-').map(Number)
  return localISO(new Date(y, m - 1, d + n))
}

export const LOCAL_EVENTS = RESEARCH_EVENTS.map((e) => ({
  ...e,
  placeId: e.venueKey ? idByKey.get(e.venueKey) || null : null,
  last: e.endDate || e.date,
})).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.title.localeCompare(b.title)))

/** Events that overlap [from, to]. A finished event removes itself: `from` is never before today. */
export function eventsBetween(from, to, types = null) {
  return LOCAL_EVENTS.filter(
    (e) => e.last >= from && e.date <= to && (!types || types.includes(e.type))
  )
}

/** The date windows the page offers, computed from today. */
export function dateWindows(today = localISO()) {
  const [y, m, d] = today.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay() // 0 Sunday
  // "this weekend" is the coming Friday to Sunday; on a Saturday or Sunday it is what is left of it
  const toFri = dow === 0 ? -2 : dow === 6 ? -1 : 5 - dow
  const fri = addDays(today, toFri)
  const weekendFrom = fri < today ? today : fri
  const last = LOCAL_EVENTS.length ? LOCAL_EVENTS[LOCAL_EVENTS.length - 1].last : today
  return [
    { id: 'weekend', label: 'This weekend', from: weekendFrom, to: addDays(fri, 2) },
    { id: 'week', label: 'Next 7 days', from: today, to: addDays(today, 7) },
    { id: 'month', label: 'Next 30 days', from: today, to: addDays(today, 30) },
    { id: 'all', label: 'Everything ahead', from: today, to: last > today ? last : today },
  ]
}

/* ---------- hubs: cities found in the data, never declared ----------
 * The place with the most neighbours inside REACH becomes a hub centre and takes them;
 * repeat on what is left. A hub's point is the mean of its members' own coordinates and
 * its name is the city most of them carry. */
const REACH_KM = 34
const MIN_MEMBERS = 6
const km = (a, b) => {
  const dLat = (a.lat - b.lat) * 111.2
  const dLng = (a.lng - b.lng) * 111.2 * Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180)
  return Math.hypot(dLat, dLng)
}
export const HUBS = (() => {
  let pool = PINNED.slice()
  const hubs = []
  for (;;) {
    let best = null
    for (const p of pool) {
      const near = pool.filter((q) => km(p, q) <= REACH_KM)
      if (!best || near.length > best.near.length) best = { near }
    }
    if (!best || best.near.length < MIN_MEMBERS) break
    const members = best.near
    const tally = new Map()
    members.forEach((m) => m.city && tally.set(m.city, (tally.get(m.city) || 0) + 1))
    const name = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]
    pool = pool.filter((p) => !members.includes(p))
    if (!name) continue // a cluster with no city on any member stays as loose pins
    // two clusters that carry the same city name are one city: the second joins the first
    const same = hubs.find((h) => h.name === name[0])
    if (same) same.members.push(...members)
    else hubs.push({ id: `hub-${slug(name[0])}`, name: name[0], members })
  }
  for (const h of hubs) {
    const { members } = h
    h.lat = members.reduce((s, m) => s + m.lat, 0) / members.length
    h.lng = members.reduce((s, m) => s + m.lng, 0) / members.length
    h.memberIds = members.map((m) => m.id)
    h.spreadKm = Math.max(...members.map((m) => km(m, h)))
    const states = new Map()
    members.forEach((m) => m.state && states.set(m.state, (states.get(m.state) || 0) + 1))
    h.state = ([...states.entries()].sort((a, b) => b[1] - a[1])[0] || [null])[0]
    delete h.members
  }
  return hubs.sort((a, b) => b.memberIds.length - a.memberIds.length)
})()
const hubOf = new Map()
HUBS.forEach((h) => h.memberIds.forEach((id) => hubOf.set(id, h.id)))
export const hubIdOf = (placeId) => hubOf.get(placeId) || null
export const hubById = (id) => HUBS.find((h) => h.id === id) || null

/* ---------- headline places: ordered by a published measure, never by us ----------
 * `editions` is how many Wikipedia language editions carry an article on the place, read
 * from Wikidata by QID at build. Bars, food and golf carry no such record and are not ranked. */
export const HEADLINE_LAYERS = new Set(['sights', 'views', 'venues'])
const byCoverage = (a, b) =>
  b.editions - a.editions ||
  ((b.visitors && b.visitors.n) || 0) - ((a.visitors && a.visitors.n) || 0) ||
  a.name.localeCompare(b.name)
export function headline(hub, n = 5) {
  return hub.memberIds
    .map(placeById)
    .filter((p) => HEADLINE_LAYERS.has(p.layer) && p.editions > 0)
    .sort(byCoverage)
    .slice(0, n)
}
export const headlineAcross = (n = 12) =>
  PINNED.filter((p) => HEADLINE_LAYERS.has(p.layer) && p.editions > 0)
    .sort(byCoverage)
    .slice(0, n)
