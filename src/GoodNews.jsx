import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { VIEWBOX, VB_W, STATES, PLACES, AIRPORTS, ROUTE_PATHS, project } from './midwestGeo'
import { ONTARIO_PENINSULA } from './ontarioGeo'
import MapPins, { placeToPanel, makePinId, spreadClusters, PIN_TYPE_LABELS } from './MapPins'
import { BRUCE_PLACES, BRUCE_SOURCE } from './data/brucePeninsula'
import { MIDWEST_CANDIDATES, MIDWEST_CANDIDATES_SOURCE } from './data/midwestCandidates'
import michigan from './data/michigan'
import { GOOD_VIEWS, GOLF_SLATE, GOLF_SOURCE, BEST_OF_CHECKED_ON } from './data/localBestOf'
import {
  PULSE_VENUES,
  PULSE_TYPE_LABELS,
  PULSE_CHECKED_ON,
  liveEvents,
  upcoming,
  eventsByVenue,
} from './data/livePulse'
import './GoodNews.css'

/* ===== SHARED GEOMETRY =====
   All silhouettes, cities, anchors and routes come from src/midwestGeo.js,
   which is GENERATED from real state-boundary GeoJSON through ONE shared
   equirectangular projection (lat0 43.177). Nothing here is hand-placed —
   change the projection in the tracer and every layer re-fits together.

   Michigan is the FOCUS state (full colour, bright coastline). The other five
   are context: same trace quality, deliberately subdued so the mitten still
   reads as the subject. */

/* Routes. status 'live' (solid) = validated/scouted;
   'proposed' (dashed) = coming. Path data is generated from real waypoints.

   MOTOR CITY IS DELIBERATELY NOT A ROUTE HERE (decided Aug 17). At Midwest
   zoom Detroit metro is genuinely ~40px across, so the loop read as a stray
   dash rather than a route. It is represented as the Detroit marker instead.
   Its real waypoints are PRESERVED in the tracer + ROUTE_PATHS['motor-city']
   so it can return the moment we build a Michigan-zoom view — do not delete
   them from midwestGeo.js. */
const ROUTES = [
  {
    id: 'west-coast',
    name: 'The West Coast',
    color: '#5ab0c4',
    status: 'live',
    note: 'New Buffalo → Kalamazoo → Grand Rapids → Traverse City',
  },
  {
    id: 'up-north',
    name: 'Up North',
    color: '#e8943a',
    status: 'live',
    note: 'Ann Arbor → the Straits → Marquette',
  },
  {
    id: 'harbor-golf',
    name: 'Harbor & Greens',
    color: '#7fc06a',
    status: 'proposed',
    note: 'Harbor Country + golf country — proposed, validating soon',
  },
]

/* OUR ROOTS — gold anchors. Deliberately distinct from the quiet city dots:
   these are the two campuses the Lads actually came out of. */
const ANCHORS = [
  {
    id: 'gvsu',
    at: PLACES.gvsu,
    label: 'GVSU',
    who: 'Brady',
    title: 'Grand Valley State University',
    place: 'Allendale + Grand Rapids, Michigan',
    lines: [
      'The Padnos International Center — the office that turns a Michigan student into someone with a passport and a plan.',
      'The Seidman College of Business, and the Honors College.',
      'And Grand Rapids itself: "Beer City USA," which is not a nickname the city gave itself quietly.',
    ],
    tail: 'Half of this company started here.',
  },
  {
    id: 'kcollege',
    at: PLACES.kalamazooCollege,
    label: 'K-College',
    // GVSU sits ~52px directly north; label below so the two never collide
    labelBelow: true,
    who: 'Dawson',
    title: 'Kalamazoo College',
    place: 'Kalamazoo, Michigan',
    lines: [
      'Football, and the start of a broadcasting career.',
      'A small campus in a city most people drive past on I-94 without stopping.',
    ],
    tail: 'The other half started here.',
  },
]

/* Quiet geography context — NOT features yet. Real lat/lngs through the same
   transform. `flag` marks Detroit as the home of the proposed Motor City run. */
const CITIES = [
  { id: 'chicago', at: PLACES.chicago, name: 'Chicago', anchor: 'end' },
  { id: 'milwaukee', at: PLACES.milwaukee, name: 'Milwaukee', anchor: 'end' },
  { id: 'minneapolis', at: PLACES.minneapolis, name: 'Minneapolis', anchor: 'middle' },
  { id: 'indianapolis', at: PLACES.indianapolis, name: 'Indianapolis', anchor: 'middle' },
  { id: 'columbus', at: PLACES.columbus, name: 'Columbus', anchor: 'start' },
  { id: 'cleveland', at: PLACES.cleveland, name: 'Cleveland', anchor: 'start' },
  {
    id: 'detroit',
    at: PLACES.detroit,
    name: 'Detroit',
    anchor: 'start',
    flag: 'Motor City — proposed, validating soon',
  },
]

/* AIRPORTS — third tier of the pin hierarchy.
   At Midwest zoom an airport sits 7-20px from its own city (MKE is 7px from
   Milwaukee), so a second labelled dot per city would be unreadable mud. Each
   airport is therefore drawn at its TRUE projected coordinate as a small dot,
   with a leader line out to an IATA chip placed in clear space — standard
   cartographic practice, and the marker never lies about where it is.

   `searchUrl` is a PROVIDER-NEUTRAL FLIGHT-SEARCH SLOT. Null today, and no
   flight provider is signed — Travelpayouts (the original candidate) was
   dropped Aug 25. When a provider does land, the panel switches from the
   coming-soon state to live data with no component change and no hard-coded
   price copy to rip out. */
const AIRPORT_LIST = [
  {
    iata: 'DTW',
    name: 'Detroit Metropolitan Wayne County Airport',
    city: 'Detroit, Michigan',
    at: AIRPORTS.DTW,
    chip: { x: 841, y: 600 },
    searchUrl: null,
  },
  {
    iata: 'GRR',
    name: 'Gerald R. Ford International Airport',
    city: 'Grand Rapids, Michigan',
    at: AIRPORTS.GRR,
    chip: { x: 710, y: 537 },
    searchUrl: null,
  },
  {
    iata: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago, Illinois',
    at: AIRPORTS.ORD,
    chip: { x: 512, y: 636 },
    searchUrl: null,
  },
  {
    iata: 'MDW',
    name: 'Chicago Midway International Airport',
    city: 'Chicago, Illinois',
    at: AIRPORTS.MDW,
    chip: { x: 566, y: 636 },
    searchUrl: null,
  },
  {
    iata: 'MKE',
    name: 'Milwaukee Mitchell International Airport',
    city: 'Milwaukee, Wisconsin',
    at: AIRPORTS.MKE,
    chip: { x: 540, y: 548 },
    searchUrl: null,
  },
  {
    iata: 'MSP',
    name: 'Minneapolis–Saint Paul International Airport',
    city: 'Minneapolis, Minnesota',
    at: AIRPORTS.MSP,
    chip: { x: 236, y: 410 },
    searchUrl: null,
  },
  {
    iata: 'IND',
    name: 'Indianapolis International Airport',
    city: 'Indianapolis, Indiana',
    at: AIRPORTS.IND,
    chip: { x: 639, y: 816 },
    searchUrl: null,
  },
  {
    iata: 'CLE',
    name: 'Cleveland Hopkins International Airport',
    city: 'Cleveland, Ohio',
    at: AIRPORTS.CLE,
    chip: { x: 920, y: 668 },
    searchUrl: null,
  },
  {
    iata: 'CMH',
    name: 'John Glenn Columbus International Airport',
    city: 'Columbus, Ohio',
    at: AIRPORTS.CMH,
    chip: { x: 846, y: 786 },
    searchUrl: null,
  },
]

const CHIP_W = 46
const CHIP_H = 20

/* PINS — Phase 4, first data set.
 *
 * The 17 Bruce Peninsula places from Brady's saved Google list, projected
 * through the SAME transform as everything else on this canvas (see
 * `project` in midwestGeo.js) and drawn by the reusable MapPins layer. The
 * Ontario land they sit on landed in 50a4d8b, so they finally have ground
 * beneath them.
 *
 * ALL 17 NOW RENDER GOLD. From Aug 25 to Sept 1 2026 they all rendered
 * copper, which was correct — the per-spot visited/not-visited split was
 * outstanding and a saved list is a superset of a trip. Brady closed it on
 * Sept 1: he visited all 17 on the Aug 8–12 trip. The tier is not hardcoded
 * here; MapPins reads `validated` off each place, so the flip was a pure
 * data edit in brucePeninsula.js and this layer followed it.
 *
 * MICHIGAN IS PINNED AS OF SEPT 2 2026 — 8 of its 22 spots, the ones that
 * carry lat/lng matched by provenance to Brady's own saved lists. The other
 * 14 have no coordinate and stay OFF the canvas rather than be geocoded from
 * their names; they are named in the companion list under a heading that says
 * why. Four of them are Detroit and land together when that list arrives.
 *
 * THE THIRD LAYER IS THE 58 CANDIDATES — copper, research tier, deduped
 * against michigan.js on Google's feature ID so no venue appears twice in two
 * different tiers. They carry no Lads rating and no Lads words. */
/* One prefix now that every pin shares a layer. Ids stay unique because each
 * record carries its own Google feature id, and the three datasets were
 * deduped against each other on exactly that. */
const PIN_PREFIX = 'pin'

/* Five Tobermory places sit inside ~0.5 viewBox units of each other, so
 * without declustering they are one unhittable dot. `stackDist` decides what
 * counts as a true stack worth fanning onto a ring; `minDist` is the floor
 * every glyph is relaxed out to. Geometry only — MapPins owns the algorithm.
 *
 * ⚠️ minDist WAS TRIED AT 34 AND PUT BACK TO 22. Grand Rapids alone holds 32
 * candidates inside a few viewBox units, so a 34-unit floor fanned that one
 * city across ~190 units — nearly a fifth of the map — and pushed pins out
 * into Lake Michigan and over Wisconsin. The leader lines keep each glyph tied
 * to its true coordinate so nothing was strictly lying, but a map that puts a
 * Grand Rapids bar in open water has stopped being a map. 22 keeps the city's
 * footprint honest.
 *
 * The cost is admitted rather than hidden: a tight cluster means small targets,
 * and the map is NOT the way to reach a downtown GR pin on a phone. The
 * companion list is, and every pin is in it. The real fix for the dense-city
 * case is a zoomed Michigan view or a collapse-to-count marker; both are
 * bigger than this build and neither is faked here. */
const PIN_CLUSTER = { minDist: 22, stackDist: 6 }
/* Half of minDist, so neighbouring tap targets touch but never overlap — an
 * overlapping hit circle would make whichever pin renders first unreachable. */
const PIN_HIT_R = 11

/* THE VALIDATED MICHIGAN SPOTS, flattened out of the framework's nested
 * categories. Only the 8 that carry a real coordinate can be pinned; the rest
 * go to the companion list. Nothing here is geocoded from a name. */
const MICHIGAN_SPOTS = (() => {
  const found = []
  const walk = (o) => {
    if (!o || typeof o !== 'object') return
    if (Array.isArray(o)) return o.forEach(walk)
    if (o.name && (o.description || o.notes)) found.push(o)
    Object.values(o).forEach(walk)
  }
  walk(michigan)
  return found
})()

/* michigan.js is a framework file, not a pin file: its spots carry `rating`
 * (the LADS rating, 0–10) and `area`, where the pin layer expects `type` and
 * `note`. Adapt rather than reshape the framework — and deliberately DROP the
 * Lads rating on the way through, because MapPins renders `rating` as Google's
 * number in the panel. Publishing a Lads 9.2 under a "Google" label would
 * launder our own score as a third party's. */
const CATEGORY_TYPE = [
  [/golf|course|links|dunes|bluffs|greens/i, 'golf'],
  [/brewing|brewery|brewpub|beer|cider/i, 'brewery'],
  [/distiller/i, 'brewery'],
  [/winery|vineyard|cellars/i, 'winery'],
  [/bar|pub|lounge|saloon|tavern/i, 'bar'],
]
const michiganType = (s) => {
  const hay = `${s.name} ${s.category || ''} ${s.type || ''}`
  for (const [re, t] of CATEGORY_TYPE) if (re.test(hay)) return t
  return 'food'
}
/* ---------- DENSE-CITY COLLAPSE ----------
 *
 * THE PROBLEM THIS SOLVES, because it is not obvious from the result:
 * 32 of the 58 candidates are Grand Rapids bars sitting inside a couple of
 * viewBox units of one another. Declustering relaxes overlapping glyphs apart,
 * which works beautifully for the five Tobermory places — but fed 32 points in
 * one city it fanned them across ~190 units and put Grand Rapids bars in the
 * middle of Lake Michigan. Each one still had a leader line back to its true
 * coordinate, so it was not strictly a lie; it was still a map that showed a
 * brewery offshore, and nobody reads leader lines before they read position.
 *
 * So a dense cluster collapses to ONE marker at the group's real centroid,
 * carrying the count. It claims exactly what it can support — "this many saved
 * places, here" — and its panel names every one of them. Sparse pins are
 * untouched and still render individually.
 *
 * Single-linkage on projected coordinates: anything within JOIN units of any
 * member joins the group. Groups of COLLAPSE_AT or more collapse; smaller ones
 * fall through to normal pins. */
const CLUSTER_JOIN = 18
const CLUSTER_COLLAPSE_AT = 6

function buildClusters(places) {
  const pts = places
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
    .map((p) => ({ p, ...project(p.lat, p.lng) }))

  const groups = []
  const seen = new Set()
  pts.forEach((pt, i) => {
    if (seen.has(i)) return
    const members = [i]
    seen.add(i)
    // breadth-first: keep absorbing anything within JOIN of any member
    for (let k = 0; k < members.length; k++) {
      const a = pts[members[k]]
      pts.forEach((b, j) => {
        if (seen.has(j)) return
        if (Math.hypot(a.x - b.x, a.y - b.y) <= CLUSTER_JOIN) {
          seen.add(j)
          members.push(j)
        }
      })
    }
    groups.push(members.map((m) => pts[m]))
  })

  const collapsed = []
  const loose = []
  groups.forEach((g, i) => {
    if (g.length >= CLUSTER_COLLAPSE_AT) {
      collapsed.push({
        id: `grp-${i}`,
        // The centroid is a real average of real coordinates, not a nudged
        // label position. The marker sits where the cluster actually is.
        x: g.reduce((s, m) => s + m.x, 0) / g.length,
        y: g.reduce((s, m) => s + m.y, 0) / g.length,
        places: g.map((m) => m.p),
      })
    } else {
      g.forEach((m) => loose.push(m.p))
    }
  })
  return { collapsed, loose }
}

const { collapsed: RAW_CLUSTERS, loose: CANDIDATE_LOOSE } = buildClusters(MIDWEST_CANDIDATES)

const MICHIGAN_PINS = MICHIGAN_SPOTS.filter((s) => Number.isFinite(s.lat)).map((s) => ({
  name: s.name,
  lat: s.lat,
  lng: s.lng,
  placeId: s.placeId,
  type: michiganType(s),
  note: s.description || s.notes || null,
  validated: s.validated === true,
  validatedBy: s.validator || s.validatedBy || null,
  visitedDate: s.visitedDate || null,
}))
const MICHIGAN_UNPINNED = MICHIGAN_SPOTS.filter((s) => !Number.isFinite(s.lat))

/* CLUSTER PLACEMENT — the cluster disc has to find clear space.
 *
 * Grand Rapids is crowded with things that are NOT candidates: the GVSU roots
 * anchor sits 11 viewBox units from the candidate centroid, and three
 * validated gold pins (Vivant, New Holland, Mitten) sit on top of it. Drawn at
 * its raw centroid the 18-unit cluster disc lands underneath all of them and
 * becomes unclickable — every click goes to whatever is drawn last.
 *
 * ⚠️ THIS WAS ONLY CAUGHT BY CLICKING IT. It looks completely fine in a
 * screenshot: the disc renders, the number renders, nothing overlaps visibly
 * enough to notice. Two of three clusters were dead. A rendering check that
 * does not attempt the interaction would have shipped this.
 *
 * So the glyph searches outward on a ring for a spot clear of every anchor and
 * every validated pin, and a leader line plus a small dot mark where the
 * cluster truly is. Same convention as the airport chips and the pin
 * declustering: the glyph may move, the truth marker never does.
 *
 * IMPORTANT: OBSTACLES ARE THE DRAWN POSITIONS, NOT THE TRUE ONES. This
 * distinction cost a round of blocked pins: MapPins declusters before it
 * draws, so a pin's
 * glyph is often several units from its own coordinate. Checking the cluster
 * against true coordinates therefore cleared space that nothing occupied and
 * left the actual glyphs covered — New Holland and Mitten both went dead that
 * way. spreadClusters is exported for exactly this, and it must be called with
 * the SAME options the layer renders with or the two disagree again. */
const CLUSTER_CLEAR = 27

/* ONE PIN LAYER, NOT THREE.
 *
 * Bruce, Michigan and the loose candidates were three separate <MapPins>
 * elements, and each one declustered ONLY against itself. So Journeyman
 * Distillery (Michigan, gold) and Redamak's (candidate, copper) — real
 * neighbours about 8 km apart — never saw each other, overlapped exactly, and
 * Journeyman's disc sat on Redamak's making it unclickable. Declustering is
 * only meaningful across everything drawn on the same canvas.
 *
 * They are therefore merged into one array behind one id prefix. Tier still
 * comes from each record's own `validated` flag, so nothing about the gold /
 * copper distinction is lost by sharing a layer — and PIN_SOURCE resolves each
 * pin back to the dataset it came from so a panel still names its source.
 *
 * ORDER WITHIN THE ARRAY IS DRAW ORDER: candidates first, validated last, so
 * where two still coincide the validated record is the one on top. */
/* GOOD VIEWS joins as a fourth pin layer. It is the layer that finally puts
   something in Minnesota, Wisconsin, Illinois, Indiana and Ohio — until now the
   map had five states of empty ground and a note about it. Copper throughout:
   these are landmarks we have researched, not places we have walked. */
const ALL_PINS = [...CANDIDATE_LOOSE, ...BRUCE_PLACES, ...MICHIGAN_PINS, ...GOOD_VIEWS]

const PIN_SOURCE = (place) =>
  BRUCE_PLACES.includes(place)
    ? { idPrefix: PIN_PREFIX, sourceLabel: BRUCE_SOURCE.label }
    : MICHIGAN_PINS.includes(place)
      ? { idPrefix: PIN_PREFIX, sourceLabel: 'Lads Michigan framework — validated firsthand' }
      : GOOD_VIEWS.includes(place)
        ? {
            idPrefix: PIN_PREFIX,
            sourceLabel: 'Researched landmarks — coordinates from published records, not visited',
          }
        : { idPrefix: PIN_PREFIX, sourceLabel: MIDWEST_CANDIDATES_SOURCE.label }

const drawnPositions = (places, prefix) =>
  spreadClusters(
    places
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => ({ place: p, id: makePinId(prefix, p), ...project(p.lat, p.lng) })),
    PIN_CLUSTER
  ).map((p) => ({ x: p.gx, y: p.gy }))

const CLUSTER_OBSTACLES = [
  ...ANCHORS.map((a) => ({ x: a.at.x, y: a.at.y })),
  ...drawnPositions(ALL_PINS, PIN_PREFIX),
]

const clearOf = (x, y) =>
  CLUSTER_OBSTACLES.every((o) => Math.hypot(x - o.x, y - o.y) >= CLUSTER_CLEAR)

/* PREFER LAND. The first version of the ring search took the first clear spot
 * it found, which for Grand Rapids was straight out into Lake Michigan — a
 * marker reading "32" floating in open water, which is precisely the failure
 * the collapse was built to prevent. It is not strictly a lie (the leader line
 * runs back to the true centroid) but it reads as one at a glance.
 *
 * So candidate positions are tested against the same traced state polygons the
 * map draws, via Path2D, and a land position always beats a water position at
 * the same radius. Guarded for any non-browser environment: if Path2D or
 * canvas is unavailable the test simply returns true and the search degrades
 * to the old behaviour rather than throwing. */
const landTest = (() => {
  try {
    // window.Path2D rather than the bare global: the lint config's browser
    // globals do not include Path2D, and reaching through window is also the
    // honest check for 'is this a browser at all'.
    if (typeof window === 'undefined' || typeof window.Path2D === 'undefined') return null
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return null
    const paths = STATES.flatMap((st) => st.rings.map((d) => new window.Path2D(d)))
    return (x, y) => paths.some((pth) => ctx.isPointInPath(pth, x, y))
  } catch {
    return null
  }
})()
const onLand = (x, y) => (landTest ? landTest(x, y) : true)

const CANDIDATE_CLUSTERS = RAW_CLUSTERS.map((c) => {
  if (clearOf(c.x, c.y)) return { ...c, gx: c.x, gy: c.y, offset: false }
  // Nearest clear spot, searched by growing radius so the glyph never wanders
  // further from its real centroid than it has to.
  let fallback = null
  for (let r = 30; r <= 96; r += 6) {
    for (let deg = 0; deg < 360; deg += 12) {
      const rad = (deg * Math.PI) / 180
      const x = c.x + Math.cos(rad) * r
      const y = c.y + Math.sin(rad) * r
      if (!clearOf(x, y)) continue
      if (onLand(x, y)) return { ...c, gx: x, gy: y, offset: true }
      // Remember the nearest clear-but-wet spot in case this cluster has no
      // land anywhere in range; better an offset marker than a buried one.
      if (!fallback) fallback = { x, y }
    }
  }
  if (fallback) return { ...c, gx: fallback.x, gy: fallback.y, offset: true }
  return { ...c, gx: c.x, gy: c.y, offset: false }
})

function Panel({ item, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null

  return (
    <div
      className={`gn-panel${item.side === 'left' ? ' gn-panel--left' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`gn-panel-title-${item.id}`}
    >
      <button
        ref={closeRef}
        className="gn-panel-close"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >
        &times;
      </button>
      <div className="gn-panel-scroll">
        <div className="gn-panel-eyebrow">{item.eyebrow}</div>
        <h2 className="gn-panel-title" id={`gn-panel-title-${item.id}`}>
          {item.title}
        </h2>
        <div className="gn-panel-place">{item.place}</div>
        {item.status && (
          <div
            className={`gn-panel-status${
              item.statusTone ? ` gn-panel-status--${item.statusTone}` : ''
            }`}
          >
            {item.status}
          </div>
        )}
        {item.lines.map((l, i) => (
          <p className="gn-panel-line" key={`${item.id}-${i}`}>
            {l}
          </p>
        ))}
        {item.tail && <p className="gn-panel-tail">{item.tail}</p>}
        {/* provenance, not voice — where the record came from */}
        {item.note && <p className="gn-panel-note">{item.note}</p>}
      </div>
    </div>
  )
}

/* THE PULSE PANEL. A venue is only ever as interesting as what is on at it, so
 * the panel leads with dates rather than with the building.
 *
 * ⛔ Every line here is a fact with a source behind it in livePulse.js. No
 * prices, ever. No "don't miss this" — we have not been to these games and the
 * Lads voice does not attach to a fixture list. */
function venueToPanel(venue, events) {
  const shown = events.slice(0, 8)
  const fmt = (iso) => {
    const d = new Date(`${iso}T12:00:00`)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
  return {
    id: `pulse-${venue.id}`,
    eyebrow: 'THE PULSE',
    title: venue.name,
    place: `${venue.city}, ${venue.state}`,
    status: events.length
      ? `${events.length} upcoming ${events.length === 1 ? 'date' : 'dates'}`
      : 'No dates pulled yet',
    statusTone: events.length ? 'live' : null,
    lines: events.length
      ? shown.map((e) => `${fmt(e.date)} — ${e.title}${e.preseason ? ' (preseason)' : ''}`)
      : [
          'This venue is on the map because it is one of the rooms that matters here. Its calendar has not been pulled yet, so we are showing you nothing rather than something invented.',
        ],
    tail:
      events.length > shown.length
        ? `+ ${events.length - shown.length} more through the end of October.`
        : null,
    note: `Schedules read from the league or club's own listing on ${PULSE_CHECKED_ON}. Dates move — confirm with the venue before you drive. We list no prices and sell no tickets.`,
  }
}

/* Every tier normalises into the same panel shape. Pins bring their own
   adapter, `placeToPanel` in MapPins.jsx, which follows this convention. */
function anchorToPanel(a) {
  return {
    id: a.id,
    eyebrow: `OUR ROOTS · ${a.who}`,
    title: a.title,
    place: a.place,
    lines: a.lines,
    tail: a.tail,
  }
}

function airportToPanel(a) {
  return {
    id: `air-${a.iata}`,
    eyebrow: `AIRPORT · ${a.iata}`,
    title: a.name,
    place: a.city,
    status: a.searchUrl ? null : 'FLIGHT PRICES — COMING SOON',
    lines: [
      `Live flight intelligence from ${a.iata} is coming — average prices and best booking windows to our framework destinations.`,
    ],
  }
}

/* A collapsed cluster's panel names every place inside it, so nothing is
 * hidden by the collapse — the marker says how many, the panel says which.
 * Copper tone throughout: this is the research tier and it makes no visit
 * claim, so the panel must not read like a recommendation. */
function clusterToPanel(c) {
  const region = c.places[0]?.region || 'This area'
  return {
    id: c.id,
    eyebrow: 'ON THE LIST · NOT YET WALKED',
    title: `${region} — ${c.places.length} saved places`,
    place: 'Research tier. Saved by us, not yet visited.',
    status: 'RESEARCH — NOT YET VALIDATED',
    statusTone: 'copper',
    lines: c.places.map((p) => p.name),
    note: 'These are grouped because they sit within a few hundred metres of each other — shown as separate pins they would land in the lake. Category and rating, where shown elsewhere, are Google’s own, never a Lads score.',
  }
}

/* ---------- THE COMPANION LIST ----------
 *
 * THIS IS NOT A NICE-TO-HAVE, IT IS THE ACCESSIBLE SURFACE. The map cannot
 * offer 44px tap targets at Midwest zoom (see the note in MapPins.jsx), and
 * an SVG full of 13px targets is not something to ship as the only way in.
 * Every pin on the canvas appears here as a full-width row that is at least
 * 44px tall, keyboard-reachable, and wired to the same toggle — tapping a row
 * opens the same panel the pin opens.
 *
 * It also carries the places that CANNOT be pinned. A spot with no coordinate
 * is not a spot we hide; it is named here, under a heading that says exactly
 * why it is not on the map. */
/* A ROW HAS TO CARRY INFORMATION, NOT JUST A NAME.
 *
 * This list previously rendered a name and a type and nothing else, which made
 * a page of 97 places that told a reader nothing about any of them. Every row
 * now carries a real second line — but WHICH line depends on where the words
 * came from, and the two are never mixed:
 *
 *   variant="lads"   Our own description, written from a visit. Michigan spots
 *                    carry these in michigan.js and they are firsthand.
 *   variant="google" Google's own category, rating, review count and price
 *                    band, captured by provenance and LABELLED as Google's.
 *                    We do not score a place we have not been to.
 *
 * ⛔ THE RATING FIELDS ARE NOT THE SAME NUMBER AND MUST NEVER SHARE A COMPONENT
 * PATH. michigan.js `rating` is the LADS rating out of 10; Google's is out of
 * 5. Rendering both through one "★" would publish a Lads 9.2 as though a third
 * party said it. The variant is passed explicitly by the caller — which knows
 * which dataset it is holding — rather than sniffed from the fields, because
 * guessing here is exactly how the two would eventually blur.
 *
 * 🚩 BRUCE DELIBERATELY GETS THE GOOGLE LINE ONLY. Its `note` field mixes
 * reader-facing geography ("boat access only from Tobermory harbour") with
 * internal data provenance ("a duplicate saved entry was dropped"), and nothing
 * in the data separates the two. Publishing them raw would leak our own
 * bookkeeping onto the page. Real Bruce descriptions are a genuine gap and want
 * the enrichment pass, not a regex. */
function ListRow({ item, id, activeId, onToggle, meta, variant }) {
  const blurb = variant === 'lads' ? item.note || item.description || null : null

  const googleBits = []
  if (variant === 'google') {
    if (item.googleCategory) googleBits.push(item.googleCategory)
    if (Number.isFinite(item.rating)) {
      googleBits.push(
        Number.isFinite(item.reviews)
          ? `${item.rating}★ (${item.reviews.toLocaleString()})`
          : `${item.rating}★`
      )
    }
    if (item.price) googleBits.push(item.price)
  }

  return (
    <li>
      <button
        type="button"
        className={`gn-row${activeId === id ? ' is-active' : ''}`}
        aria-pressed={activeId === id}
        onClick={() => onToggle(id)}
      >
        <span
          className={`gn-row-tier gn-row-tier--${item.validated === true ? 'gold' : 'copper'}`}
        />
        <span className="gn-row-body">
          <span className="gn-row-name">{item.name}</span>
          <span className="gn-row-meta">{meta}</span>
          {blurb && <span className="gn-row-blurb">{blurb}</span>}
          {!!googleBits.length && (
            <span className="gn-row-google">
              <span className="gn-row-google-tag">Google</span>
              {googleBits.join(' · ')}
            </span>
          )}
        </span>
      </button>
    </li>
  )
}

function CompanionList({ activeId, onToggle }) {
  /* CATEGORY TOGGLES. Grand Rapids alone is 32 rows, and an undifferentiated
   * run of 32 bar names is precisely what made this list unusable — you could
   * not find the breweries in it, or the golf, or the wineries.
   *
   * Every type here comes from the data: `type` is stored on the candidates and
   * the Bruce places, and derived by michiganType() for Michigan spots. Nothing
   * in this filter invents a category, and the counts are walked from the
   * arrays rather than typed, so they cannot drift. */
  const [typeFilter, setTypeFilter] = useState('all')

  const filters = useMemo(() => {
    const counts = new Map()
    const bump = (t) => t && counts.set(t, (counts.get(t) || 0) + 1)
    MICHIGAN_PINS.forEach((p) => bump(p.type))
    MICHIGAN_UNPINNED.forEach((s) => bump(michiganType(s)))
    BRUCE_PLACES.forEach((p) => bump(p.type))
    MIDWEST_CANDIDATES.forEach((p) => bump(p.type))
    GOOD_VIEWS.forEach((p) => bump(p.type))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [])

  const totalPlaces =
    MICHIGAN_PINS.length +
    MICHIGAN_UNPINNED.length +
    BRUCE_PLACES.length +
    MIDWEST_CANDIDATES.length +
    GOOD_VIEWS.length

  const keep = (t) => typeFilter === 'all' || t === typeFilter

  const goodViews = GOOD_VIEWS.filter((p) => keep(p.type))
  const michPins = MICHIGAN_PINS.filter((p) => keep(p.type))
  const michUnpinned = MICHIGAN_UNPINNED.filter((s) => keep(michiganType(s)))
  const brucePlaces = BRUCE_PLACES.filter((p) => keep(p.type))
  const candidates = MIDWEST_CANDIDATES.filter((p) => keep(p.type))

  const candByRegion = (() => {
    const m = new Map()
    candidates.forEach((p) => {
      if (!m.has(p.region)) m.set(p.region, [])
      m.get(p.region).push(p)
    })
    return [...m.entries()]
  })()

  const typeOf = (p) => PIN_TYPE_LABELS[p.type] || p.type || 'Place'

  return (
    <section className="gn-list" aria-labelledby="gn-list-h">
      <div className="gn-list-inner">
        <h2 id="gn-list-h" className="gn-list-h">
          Everything on the map
        </h2>
        <p className="gn-list-lede">
          Every pin, as a list. <strong className="gn-t-gold">Gold</strong> means one of us walked
          in. <strong className="gn-t-copper">Copper</strong> means it is on our list and nothing
          more &mdash; saved, not visited, and we will not pretend otherwise.
        </p>

        <div className="gn-filters" role="group" aria-label="Filter places by type">
          <button
            type="button"
            className={`gn-filter${typeFilter === 'all' ? ' is-on' : ''}`}
            aria-pressed={typeFilter === 'all'}
            onClick={() => setTypeFilter('all')}
          >
            Everything <span className="gn-count">{totalPlaces}</span>
          </button>
          {filters.map(([type, n]) => (
            <button
              key={type}
              type="button"
              className={`gn-filter${typeFilter === type ? ' is-on' : ''}`}
              aria-pressed={typeFilter === type}
              onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
            >
              {PIN_TYPE_LABELS[type] || type} <span className="gn-count">{n}</span>
            </button>
          ))}
        </div>

        <div className="gn-list-cols">
          <div className="gn-list-col">
            <h3 className="gn-list-sub">
              Michigan &mdash; validated <span className="gn-count">{michPins.length}</span>
            </h3>
            <ul className="gn-rows">
              {michPins.map((p) => (
                <ListRow
                  key={makePinId(PIN_PREFIX, p)}
                  id={makePinId(PIN_PREFIX, p)}
                  item={p}
                  activeId={activeId}
                  onToggle={onToggle}
                  meta={typeOf(p)}
                  variant="lads"
                />
              ))}
            </ul>

            <h3 className="gn-list-sub">
              Michigan &mdash; validated, not yet placeable{' '}
              <span className="gn-count">{michUnpinned.length}</span>
            </h3>
            <p className="gn-list-note">
              We have been to all of these. They are absent from the map because we do not yet hold
              a coordinate for them that came from a real record &mdash; and looking one up from the
              name is exactly how a map ends up confidently wrong. Four are Detroit and land
              together when that list arrives.
            </p>
            <ul className="gn-rows gn-rows--static">
              {michUnpinned.map((s) => (
                <li key={s.name} className="gn-row gn-row--static">
                  <span className="gn-row-tier gn-row-tier--gold" />
                  <span className="gn-row-body">
                    <span className="gn-row-name">{s.name}</span>
                    <span className="gn-row-meta">{s.area || 'Michigan'}</span>
                    {/* These are validated spots, so they carry our own words.
                        Missing a coordinate is not a reason to withhold what we
                        know about a place we have actually been to. */}
                    {(s.description || s.notes) && (
                      <span className="gn-row-blurb">{s.description || s.notes}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="gn-list-col">
            <h3 className="gn-list-sub">
              Good Views <span className="gn-count">{goodViews.length}</span>
            </h3>
            <p className="gn-list-note">
              The landmarks the region is known for, across all six states. Researched, not walked
              &mdash; every one is copper and none carries a verdict from us. Coordinates come from
              published records, checked {BEST_OF_CHECKED_ON}.
            </p>
            <ul className="gn-rows">
              {goodViews.map((p) => (
                <ListRow
                  key={makePinId(PIN_PREFIX, p)}
                  id={makePinId(PIN_PREFIX, p)}
                  item={{ ...p, note: p.what }}
                  activeId={activeId}
                  onToggle={onToggle}
                  meta={`${p.region} · ${p.state}`}
                  variant="lads"
                />
              ))}
            </ul>

            <h3 className="gn-list-sub">
              The golf slate <span className="gn-count">{GOLF_SLATE.length}</span>
            </h3>
            <p className="gn-list-note">
              🚩 <strong>This ranking is Golfweek&rsquo;s, not ours.</strong> Their 2026 list of
              Michigan&rsquo;s top 20 public courses, reported with attribution &mdash; a smaller
              claim than a recommendation. We have played two of the twenty and those two are
              marked. None are on the map yet: golf courses have no published coordinate records,
              and geocoding twenty course names is exactly the mistake that rule exists to stop.
            </p>
            <ol className="gn-golf">
              {GOLF_SLATE.map((g) => (
                <li key={g.rank} className="gn-golf-row">
                  <span className="gn-golf-rank">{g.rank}</span>
                  <span className="gn-golf-body">
                    <span className="gn-row-name">{g.name}</span>
                    <span className="gn-row-meta">{g.town}</span>
                  </span>
                  {g.ladsPlayed && <span className="gn-golf-played">We&rsquo;ve played it</span>}
                </li>
              ))}
            </ol>
            <p className="gn-list-note">
              Source:{' '}
              <a href={GOLF_SOURCE.url} target="_blank" rel="noopener noreferrer">
                {GOLF_SOURCE.label}
              </a>
              . Checked {GOLF_SOURCE.checkedOn}.
            </p>
          </div>

          <div className="gn-list-col">
            <h3 className="gn-list-sub">
              Bruce Peninsula &amp; Lake Huron shore{' '}
              <span className="gn-count">{brucePlaces.length}</span>
            </h3>
            <ul className="gn-rows">
              {brucePlaces.map((p) => (
                <ListRow
                  key={makePinId(PIN_PREFIX, p)}
                  id={makePinId(PIN_PREFIX, p)}
                  item={p}
                  activeId={activeId}
                  onToggle={onToggle}
                  meta={typeOf(p)}
                  variant="google"
                />
              ))}
            </ul>
          </div>

          <div className="gn-list-col">
            <h3 className="gn-list-sub">
              On the list, not yet walked <span className="gn-count">{candidates.length}</span>
            </h3>
            <p className="gn-list-note">
              Saved by us, researched, and honestly unvisited. Where a rating shows in the panel it
              is <strong>Google&rsquo;s</strong>, never ours &mdash; we do not score a place we have
              not been to.
            </p>
            {candByRegion.map(([region, places]) => (
              <div key={region}>
                <h4 className="gn-list-sub gn-list-sub--minor">
                  {region} <span className="gn-count">{places.length}</span>
                </h4>
                <ul className="gn-rows">
                  {places.map((p) => (
                    <ListRow
                      key={makePinId(PIN_PREFIX, p)}
                      id={makePinId(PIN_PREFIX, p)}
                      item={p}
                      activeId={activeId}
                      onToggle={onToggle}
                      meta={typeOf(p)}
                      variant="google"
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* THE LADS LOCAL MAP. Was the whole of /good-news; since Sept 2 2026 it is the
 * hero of /local, which owns the Nav, the SEO and the framing around it. This
 * component renders the canvas, its panel and the companion list, and nothing
 * about the page it sits on. */
/* ===== GOOD NEWS — the board under the map =====
 *
 * The signature of this page. Not "here are some venues" but "here is what is
 * on, and when". Sorted by date because that is the question a reader actually
 * arrives with.
 *
 * ⛔ NO PRICES AND NO LADS VOICE. We have not been to these fixtures. Every
 * card is a date, a room and a link to the listing it came from. */
function PulseBoard({ pulse, weekendOnly, setWeekendOnly, onOpen }) {
  const venueName = (id) => PULSE_VENUES.find((v) => v.id === id)
  const fmtDay = (iso) => {
    const d = new Date(`${iso}T12:00:00`)
    return {
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.toLocaleDateString('en-US', { day: 'numeric' }),
      mon: d.toLocaleDateString('en-US', { month: 'short' }),
    }
  }

  return (
    <section className="gn-pulse-board" aria-labelledby="gn-pulse-h">
      <div className="gn-list-inner">
        <div className="gn-pulse-head">
          <div>
            <h2 id="gn-pulse-h" className="gn-list-h">
              Good News
            </h2>
            <p className="gn-list-lede">
              What is actually on. {pulse.soon.length} in the next seven days, {pulse.all.length}{' '}
              ahead of us in all. Read from each league or club&rsquo;s own schedule on{' '}
              {PULSE_CHECKED_ON} &mdash; we list no prices and sell no tickets.
            </p>
          </div>
          <button
            type="button"
            className={`gn-weekend${weekendOnly ? ' is-on' : ''}`}
            aria-pressed={weekendOnly}
            onClick={() => setWeekendOnly(!weekendOnly)}
          >
            This Weekend <span className="gn-count">{pulse.soon.length}</span>
          </button>
        </div>

        {pulse.list.length === 0 ? (
          <p className="gn-list-note">
            Nothing in the next seven days from the calendars we have pulled so far.
          </p>
        ) : (
          <ul className="gn-events">
            {pulse.list.slice(0, weekendOnly ? 40 : 24).map((e) => {
              const v = venueName(e.venueId)
              const d = fmtDay(e.date)
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    className="gn-event"
                    onClick={() => onOpen(`pulse-${e.venueId}`)}
                  >
                    <span className="gn-event-date">
                      <span className="gn-event-dow">{d.dow}</span>
                      <span className="gn-event-day">{d.day}</span>
                      <span className="gn-event-mon">{d.mon}</span>
                    </span>
                    <span className="gn-event-body">
                      <span className="gn-event-title">
                        {e.title}
                        {e.preseason && <span className="gn-event-pre">preseason</span>}
                      </span>
                      <span className="gn-event-venue">
                        {v ? `${v.name} · ${v.city}, ${v.state}` : e.venueId}
                      </span>
                    </span>
                    <span className={`gn-event-type gn-event-type--${e.type}`}>
                      {PULSE_TYPE_LABELS[e.type] || e.type}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {!weekendOnly && pulse.list.length > 24 && (
          <p className="gn-list-note">
            Showing the next 24 of {pulse.list.length}. Tap a venue on the map for its full run of
            dates.
          </p>
        )}
      </div>
    </section>
  )
}

export default function LadsLocalMap() {
  const [activeId, setActiveId] = useState(null)
  const close = useCallback(() => setActiveId(null), [])

  /* ===== THE PULSE =====
   * `today` is read at RENDER, never at module load. A tab left open overnight
   * would otherwise keep yesterday's game glowing on the map, which is the
   * whole failure this layer is built to avoid. */
  const [weekendOnly, setWeekendOnly] = useState(false)
  const pulse = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const all = liveEvents(today)
    const soon = upcoming(7, today)
    const list = weekendOnly ? soon : all
    const byVenue = eventsByVenue(list)
    return {
      all,
      soon,
      list,
      /* DETROIT PUTS THREE VENUES INSIDE HALF A VIEWBOX UNIT — Comerica, Ford
       * Field and Little Caesars are genuinely a few hundred metres apart, and
       * Chicago stacks United Center against Soldier Field the same way. Drawn
       * raw they collapse into one dot and two of the three become untappable.
       * Same declustering the candidate pins use: the marker stays on the TRUE
       * coordinate and only the glyph is pushed onto a ring, with a leader line
       * back, so a pin never lies about where it is. */
      pins: spreadClusters(
        PULSE_VENUES.map((v) => ({
          ...v,
          ...project(v.lat, v.lng),
          events: byVenue.get(v.id) || [],
        })),
        { minDist: 15, stackDist: 7 }
      ),
    }
  }, [weekendOnly])

  const anchorHit = ANCHORS.find((a) => a.id === activeId)
  const airportHit = AIRPORT_LIST.find((a) => `air-${a.iata}` === activeId)
  const pulseHit = pulse.pins.find((v) => `pulse-${v.id}` === activeId)

  /* One lookup per pin layer. Each layer keeps its own id prefix and its own
     source label, so a panel always names where its facts came from. */
  const clusterHit = CANDIDATE_CLUSTERS.find((c) => c.id === activeId)
  const pinHit = ALL_PINS.find((p) => makePinId(PIN_PREFIX, p) === activeId)
  const pinLayer = pinHit ? PIN_SOURCE(pinHit) : null

  const active = anchorHit
    ? anchorToPanel(anchorHit)
    : pulseHit
      ? {
          ...venueToPanel(pulseHit, pulseHit.events),
          side: pulseHit.gx > VB_W * 0.55 ? 'left' : 'right',
        }
      : airportHit
        ? airportToPanel(airportHit)
        : clusterHit
          ? clusterToPanel(clusterHit)
          : pinHit
            ? {
                ...placeToPanel(pinHit, pinLayer),
                /* The panel is pinned top-right, so opening a pin in the right
               third of the canvas would hide the thing you just tapped and its
               whole cluster with it. Flip the panel to the emptier side.
               Desktop only; the mobile sheet already solves this by shrinking
               the map to the space above it. */
                side: project(pinHit.lat, pinHit.lng).x > VB_W * 0.55 ? 'left' : 'right',
              }
            : null
  const toggle = useCallback((id) => setActiveId((cur) => (cur === id ? null : id)), [])

  return (
    <div className="gn-root">
      <div className={`gn-stage${active ? ' has-panel' : ''}`}>
        <svg
          className="gn-map"
          viewBox={VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Illustrated map of the Midwest — Minnesota, Wisconsin, Michigan, Illinois, Indiana and Ohio, plus the Ontario shore — with Michigan road-trip routes, the two campuses the Lads came out of, and validated pins along the Bruce Peninsula and Lake Huron shore"
        >
          <defs>
            <radialGradient id="gn-water" cx="52%" cy="40%" r="78%">
              <stop offset="0%" stopColor="#1c4a5e" />
              <stop offset="100%" stopColor="#0c2129" />
            </radialGradient>
            <linearGradient id="gn-land" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#357a4a" />
              <stop offset="100%" stopColor="#1f4a2f" />
            </linearGradient>
            <linearGradient id="gn-land-dim" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#24503a" />
              <stop offset="100%" stopColor="#173324" />
            </linearGradient>
            {/* Ontario is clipped to a tight AOI, so its north and south edges
                are straight cut lines sitting in open water. Its east edge is
                fine — that is the map's true east bound, the same line Ohio
                ends on. Fading the two cut edges is a render-side fix: buying
                real geometry up there would mean the full-canvas polygon at
                ~22.9 KB, almost all of it lake outline hidden under the US
                states. This costs nothing and reads as "continues off-map". */}
            <linearGradient
              id="gn-ontario-fade"
              x1="0"
              y1="249.2"
              x2="0"
              y2="561.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="14%" stopColor="#fff" stopOpacity="1" />
              <stop offset="86%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="gn-ontario-mask" maskUnits="userSpaceOnUse">
              <rect x="820" y="245" width="200" height="322" fill="url(#gn-ontario-fade)" />
            </mask>
            <filter id="gn-land-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.45" />
            </filter>
            <filter id="gn-route-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="100%" height="100%" fill="url(#gn-water)" />

          {/* context states first, so Michigan always draws on top */}
          <g filter="url(#gn-land-shadow)">
            {/* Ontario sits UNDER the US states. It is drawn from the political
                boundary with the lakes punched out (fill-rule evenodd) — see
                src/ontarioGeo.js for why neither source works alone. Rendered
                a step dimmer than the US context states: it is across a border
                and carries no framework of its own, so it should read as the
                far shore rather than as another state we cover. */}
            <path
              className="gn-land gn-land--context gn-land--foreign"
              d={ONTARIO_PENINSULA}
              mask="url(#gn-ontario-mask)"
              fillRule="evenodd"
              fill="url(#gn-land-dim)"
              opacity="0.72"
              stroke="#6e9e7d"
              strokeWidth="0.8"
              strokeOpacity="0.65"
              strokeLinejoin="round"
            />
            {STATES.filter((s) => !s.focus).map((s) =>
              s.rings.map((d, i) => (
                <path
                  key={`${s.code}-${i}`}
                  className="gn-land gn-land--context"
                  d={d}
                  fill="url(#gn-land-dim)"
                  stroke="#6e9e7d"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              ))
            )}
            {STATES.filter((s) => s.focus).map((s) =>
              s.rings.map((d, i) => (
                <path
                  key={`${s.code}-${i}`}
                  className="gn-land gn-land--focus"
                  d={d}
                  fill="url(#gn-land)"
                  stroke="#a6e0ab"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              ))
            )}
          </g>

          {/* state codes */}
          {[
            { code: 'MN', x: 180, y: 300 },
            { code: 'WI', x: 470, y: 420 },
            { code: 'MI', x: 760, y: 430 },
            { code: 'IL', x: 500, y: 700 },
            { code: 'IN', x: 640, y: 700 },
            { code: 'OH', x: 860, y: 700 },
          ].map((l) => (
            <text
              key={l.code}
              className={`gn-state-label${l.code === 'MI' ? ' gn-state-label--focus' : ''}`}
              x={l.x}
              y={l.y}
              textAnchor="middle"
            >
              {l.code}
            </text>
          ))}

          {/* routes */}
          {ROUTES.map((r) => (
            <path
              key={r.id}
              className={`gn-route gn-route--${r.status}`}
              d={ROUTE_PATHS[r.id]}
              fill="none"
              stroke={r.color}
              strokeWidth={r.status === 'live' ? 5.5 : 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={r.status === 'proposed' ? '2 12' : 'none'}
              filter={r.status === 'live' ? 'url(#gn-route-glow)' : undefined}
            >
              <title>{`${r.name} — ${r.note}`}</title>
            </path>
          ))}

          {/* quiet city context */}
          {CITIES.map((c) => (
            <g key={c.id} className={`gn-city${c.flag ? ' gn-city--flagged' : ''}`}>
              {c.flag && <circle className="gn-city-ring" cx={c.at.x} cy={c.at.y} r="8" />}
              <circle className="gn-city-dot" cx={c.at.x} cy={c.at.y} r="3.5" />
              <text
                className="gn-city-label"
                x={c.at.x + (c.anchor === 'end' ? -9 : c.anchor === 'start' ? 9 : 0)}
                y={c.at.y + (c.anchor === 'middle' ? 20 : 4)}
                textAnchor={c.anchor}
              >
                {c.name}
              </text>
              <title>{c.flag ? `${c.name} — ${c.flag}` : c.name}</title>
            </g>
          ))}

          {/* AIRPORTS — dot at the true coordinate, leader out to an IATA chip */}
          {AIRPORT_LIST.map((a) => {
            const id = `air-${a.iata}`
            const cx = a.chip.x + CHIP_W / 2
            const cy = a.chip.y + CHIP_H / 2
            return (
              <g
                key={id}
                className={`gn-air${activeId === id ? ' is-active' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${a.iata} — ${a.name}`}
                onClick={() => toggle(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle(id)
                  }
                }}
              >
                <line className="gn-air-leader" x1={a.at.x} y1={a.at.y} x2={cx} y2={cy} />
                <circle className="gn-air-dot" cx={a.at.x} cy={a.at.y} r="3" />
                <rect
                  className="gn-air-chip"
                  x={a.chip.x}
                  y={a.chip.y}
                  width={CHIP_W}
                  height={CHIP_H}
                  rx="6"
                />
                {/* Generous transparent hit area. At 390px the map scales to
                    ~0.37, so the 46x20 chip alone is a ~17x7 CSS-px target —
                    far under a thumb. This pads it out without moving the
                    visible chip or risking a label collision. */}
                <rect
                  className="gn-air-hit"
                  x={a.chip.x - 22}
                  y={a.chip.y - 20}
                  width={CHIP_W + 44}
                  height={CHIP_H + 40}
                />
                <text className="gn-air-code" x={cx} y={cy + 4} textAnchor="middle">
                  {a.iata}
                </text>
                <title>{`${a.iata} — ${a.name}. Flight prices coming soon.`}</title>
              </g>
            )
          })}

          {/* ORDER: ANCHORS FIRST, PINS ON TOP.
              The anchors carry a 22-unit transparent hit circle, which is
              wider than the GVSU dot looks — drawn last it covered Mitten
              Brewing entirely and that pin took no clicks at all. A specific
              validated place should beat a campus marker anyway, so the
              anchors go underneath. They stay easy to hit: the only pixels
              they lose are the few small discs sitting on top of them. */}
          {/* OUR ROOTS anchors — gold, interactive */}
          {ANCHORS.map((a) => (
            <g
              key={a.id}
              className={`gn-anchor${activeId === a.id ? ' is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${a.title} — open story`}
              onClick={() => toggle(a.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(a.id)
                }
              }}
            >
              {/* Explicit transparent hit target. The halo used to be the de
                  facto one; it was taking clicks meant for its neighbours, so
                  it became decorative (pointer-events:none) and the anchor was
                  briefly unclickable — an SVG <g> has no fill of its own, so
                  with the halo inert there was nothing under the middle of it.
                  22 units is deliberately smaller than the 27-unit clearance
                  the cluster placement keeps, so the two can never fight. */}
              <circle className="gn-anchor-hit" cx={a.at.x} cy={a.at.y} r="22" />
              <circle className="gn-anchor-halo" cx={a.at.x} cy={a.at.y} r="16" />
              <circle className="gn-anchor-dot" cx={a.at.x} cy={a.at.y} r="7" />
              <text
                className="gn-anchor-label"
                x={a.at.x}
                y={a.at.y + (a.labelBelow ? 34 : -24)}
                textAnchor="middle"
              >
                {a.label}
              </text>
              <title>{`${a.title} — tap for the story`}</title>
            </g>
          ))}
          {/* PINS — reusable layer, nothing Midwest-specific inside it.
              ORDER MATTERS: candidates are drawn FIRST so the validated pins
              sit above them. Where a copper and a gold pin end up close
              together the gold one takes the tap, which is the right way
              round — the validated record is the one we can stand behind. */}
          <MapPins
            places={ALL_PINS}
            project={project}
            idPrefix={PIN_PREFIX}
            activeId={activeId}
            onToggle={toggle}
            cluster={PIN_CLUSTER}
            hitR={PIN_HIT_R}
          />

          {/* COLLAPSED CITY CLUSTERS — one copper marker per dense group, at
              the group's real centroid, carrying its count. Hollow like every
              other copper marker, because the tier language has to hold: this
              is still "on the list, not walked in". */}
          {CANDIDATE_CLUSTERS.map((c) => (
            <g
              key={c.id}
              className={`gn-cluster${activeId === c.id ? ' is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${c.places[0]?.region || 'This area'} — ${c.places.length} saved places, research tier, not yet validated`}
              onClick={() => toggle(c.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(c.id)
                }
              }}
            >
              {c.offset && (
                <>
                  <line className="gn-cluster-leader" x1={c.x} y1={c.y} x2={c.gx} y2={c.gy} />
                  <circle className="gn-cluster-truth" cx={c.x} cy={c.y} r="2.4" />
                </>
              )}
              <circle className="gn-cluster-halo" cx={c.gx} cy={c.gy} r="30" />
              <circle className="gn-cluster-disc" cx={c.gx} cy={c.gy} r="18" />
              <text className="gn-cluster-count" x={c.gx} y={c.gy + 6} textAnchor="middle">
                {c.places.length}
              </text>
              <title>{`${c.places[0]?.region || 'This area'} — ${c.places.length} saved places, not yet validated`}</title>
            </g>
          ))}
          {/* ===== THE PULSE LAYER — drawn last so it sits above everything.
              A venue with nothing on it renders as a quiet hollow ring rather
              than vanishing: the room still exists, we just have not pulled its
              calendar. Hiding it would imply the venue is not there. ===== */}
          <g className="gn-pulse-layer">
            {pulse.pins.map((v) => {
              const n = v.events.length
              const r = n ? 4.4 + Math.min(n, 12) * 0.17 : 3.2
              const id = `pulse-${v.id}`
              return (
                <g
                  key={v.id}
                  className={`gn-pulse${n ? '' : ' is-quiet'}${activeId === id ? ' is-active' : ''}`}
                  onClick={() => toggle(id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggle(id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${v.name}, ${v.city} — ${n} upcoming ${n === 1 ? 'date' : 'dates'}`}
                >
                  {/* Leader line + true-position tick, drawn only when the
                      glyph had to move. The tick is where the venue actually
                      is; the disc is only where its label could fit. */}
                  {v.spread && (
                    <>
                      <line className="gn-pulse-leader" x1={v.x} y1={v.y} x2={v.gx} y2={v.gy} />
                      <circle className="gn-pulse-true" cx={v.x} cy={v.y} r="1.3" />
                    </>
                  )}
                  {/* The glow. Purely decorative, and the first thing dropped
                      under prefers-reduced-motion. */}
                  {!!n && <circle className="gn-pulse-ring" cx={v.gx} cy={v.gy} r={r} />}
                  {/* Transparent tap target, centred on the drawn glyph. */}
                  <circle className="gn-pulse-hit" cx={v.gx} cy={v.gy} r="9" />
                  <circle className="gn-pulse-dot" cx={v.gx} cy={v.gy} r={r} />
                </g>
              )
            })}
          </g>
        </svg>

        <Panel item={active} onClose={close} />
      </div>

      <PulseBoard
        pulse={pulse}
        weekendOnly={weekendOnly}
        setWeekendOnly={setWeekendOnly}
        onOpen={toggle}
      />

      <CompanionList activeId={activeId} onToggle={toggle} />
    </div>
  )
}
