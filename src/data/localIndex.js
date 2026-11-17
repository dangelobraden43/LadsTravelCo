/* localIndex — ONE list of everything /local shows, normalised from the files that own it.
 *
 * Nothing is authored here. Each source file keeps its own provenance rules; this module
 * only gives every record the same shape, so the map, the lists and the counts all read
 * one array and cannot disagree:
 *
 *   michigan.js          walked     the Michigan framework (founder-validated)
 *   brucePeninsula.js    walked     Brady's Bruce Peninsula trip, ruled Sept 1 2026
 *   midwestCandidates.js saved      Brady's saved Maps lists: on our list, not visited
 *   localBestOf.js       researched landmarks, coordinates from published records
 *   localResearch.js     researched GENERATED from the research agents' verified findings
 *
 * ⛔ Two tiers, never blended: `walked` is gold, everything else is copper. A place moves
 * to gold only when a founder rules it, in its own source file.
 * ⛔ Counts are derived from these arrays wherever they are printed. Never type one.
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

const MONTHS =
  'January February March April May June July August September October November December'.split(' ')
const visited = (ym) => {
  const m = /^(\d{4})-(\d{2})$/.exec(ym || '')
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : null
}

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
    tier: 'walked',
    city: s.area || null,
    state: 'MI',
    what: s.description || s.notes,
    status: 'We have been',
    source: 'The Lads Michigan guide',
    link: { to: '/michigan', label: 'Open the Michigan guide' },
  }
})

const fromBruce = BRUCE_PLACES.map((p) => ({
  name: p.name,
  ...pin(p),
  kind: p.type,
  layer: TYPE_LAYER[p.type] || 'sights',
  tier: p.validated === true ? 'walked' : 'saved',
  city: 'Bruce Peninsula',
  state: 'ON',
  what: p.note || null,
  status:
    p.validated === true
      ? `We have been${visited(p.visitedDate) ? `, ${visited(p.visitedDate)}` : ''}`
      : 'On our list, not visited',
  google: google(p),
  source: BRUCE_SOURCE.label,
}))

const fromCandidates = MIDWEST_CANDIDATES.map((p) => ({
  name: p.name,
  ...pin(p),
  kind: p.type,
  layer: TYPE_LAYER[p.type] || 'sights',
  tier: 'saved',
  // a region label that names one city is that city; a label that names an area is not
  city: p.region === 'Grand Rapids' ? 'Grand Rapids' : null,
  area: p.region,
  state: null,
  what: null, // no description is written for a place nobody has ruled on
  status: 'On our list, not visited',
  google: google(p),
  address: p.address || null,
  source: MIDWEST_CANDIDATES_SOURCE.label,
}))

const fromViews = GOOD_VIEWS.map((p) => ({
  name: p.name,
  ...pin(p),
  kind: 'view',
  layer: 'views',
  tier: 'researched',
  city: null,
  area: p.region,
  state: p.state,
  what: p.what,
  status: 'Researched, not visited',
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
  tier: 'researched',
  city: p.city,
  state: p.state,
  what: p.what,
  caution: p.caution || null,
  capacity: p.capacity || null,
  status: 'Researched, not visited',
  source:
    p.sources && p.sources.length ? p.sources.map((s) => s.title).join(' · ') : 'Published records',
  url: p.officialUrl || null,
  urlLabel: 'Open the official site',
  checkedOn: p.checkedOn,
}))

const seen = new Map()
export const LOCAL_PLACES = [
  ...fromMichigan,
  ...fromBruce,
  ...fromCandidates,
  ...fromViews,
  ...fromResearch,
].map((p) => {
  const base = slug(p.name)
  const n = (seen.get(base) || 0) + 1
  seen.set(base, n)
  return { ...p, id: n === 1 ? base : `${base}-${n}`, pinned: Number.isFinite(p.lat) }
})
const idByKey = new Map(LOCAL_PLACES.filter((p) => p.key).map((p) => [p.key, p.id]))
export const placeById = (id) => LOCAL_PLACES.find((p) => p.id === id) || null

export const PINNED = LOCAL_PLACES.filter((p) => p.pinned)
export const WALKED_TOTAL = LOCAL_PLACES.filter((p) => p.tier === 'walked').length
export const OTHER_TOTAL = LOCAL_PLACES.length - WALKED_TOTAL
export const UNPINNED_WALKED = LOCAL_PLACES.filter((p) => p.tier === 'walked' && !p.pinned)

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
    h.walked = members.some((m) => m.tier === 'walked')
    delete h.members
  }
  return hubs.sort((a, b) => b.memberIds.length - a.memberIds.length)
})()
const hubOf = new Map()
HUBS.forEach((h) => h.memberIds.forEach((id) => hubOf.set(id, h.id)))
export const hubIdOf = (placeId) => hubOf.get(placeId) || null
export const hubById = (id) => HUBS.find((h) => h.id === id) || null
