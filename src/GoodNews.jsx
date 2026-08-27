import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { VIEWBOX, VB_W, STATES, PLACES, AIRPORTS, ROUTE_PATHS, project } from './midwestGeo'
import { ONTARIO_PENINSULA } from './ontarioGeo'
import MapPins, { placeToPanel, makePinId } from './MapPins'
import { BRUCE_PLACES, BRUCE_SOURCE } from './data/brucePeninsula'
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
 * ALL 17 RENDER COPPER. Brady's trip ran Aug 8–12 2026 and part of this
 * list IS now firsthand, but the per-spot visited/not-visited split has not
 * been supplied and the list is a superset of the trip. Copper is therefore
 * the correct render, not a bug — see the header of brucePeninsula.js.
 * Flipping the flags is a data edit for whoever ingests the split.
 *
 * MICHIGAN IS NOT PINNED HERE, deliberately. The 21 spots in
 * src/data/michigan.js carry no lat/lng at all — nothing in that file can be
 * placed on a map without geocoding it first, and guessing at coordinates
 * would be inventing data. The layer below takes them the moment they have
 * real coordinates: same component, same props, one more <MapPins> element. */
const BRUCE_PREFIX = 'bruce'

/* Five Tobermory places sit inside ~0.5 viewBox units of each other, so
 * without declustering they are one unhittable dot. `stackDist` decides what
 * counts as a true stack worth fanning onto a ring; `minDist` is the floor
 * every glyph is relaxed out to. Geometry only — MapPins owns the algorithm. */
const PIN_CLUSTER = { minDist: 20, stackDist: 6 }

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

export default function GoodNews() {
  const [activeId, setActiveId] = useState(null)
  const close = useCallback(() => setActiveId(null), [])

  const anchorHit = ANCHORS.find((a) => a.id === activeId)
  const airportHit = AIRPORT_LIST.find((a) => `air-${a.iata}` === activeId)
  const bruceHit = BRUCE_PLACES.find((p) => makePinId(BRUCE_PREFIX, p) === activeId)
  const active = anchorHit
    ? anchorToPanel(anchorHit)
    : airportHit
      ? airportToPanel(airportHit)
      : bruceHit
        ? {
            ...placeToPanel(bruceHit, {
              idPrefix: BRUCE_PREFIX,
              sourceLabel: BRUCE_SOURCE.label,
            }),
            /* The panel is pinned top-right, and every Bruce pin is in the
               far-right third of the canvas — so opening one would hide the
               thing you just tapped, and its whole cluster with it. Flip the
               panel to the empty left side for anything out there. Desktop
               only; the mobile sheet already solves this by shrinking the map
               to the space above it. */
            side: project(bruceHit.lat, bruceHit.lng).x > VB_W * 0.55 ? 'left' : 'right',
          }
        : null
  const toggle = useCallback((id) => setActiveId((cur) => (cur === id ? null : id)), [])

  return (
    <div className="gn-root">
      <Helmet>
        <title>Good Brews · Good Views · Good News — The Midwest | The Lads</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className={`gn-stage${active ? ' has-panel' : ''}`}>
        <svg
          className="gn-map"
          viewBox={VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Illustrated map of the Midwest — Minnesota, Wisconsin, Michigan, Illinois, Indiana and Ohio, plus the Ontario shore — with Michigan road-trip routes, the two campuses the Lads came out of, and research pins along the Bruce Peninsula and Lake Huron shore"
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

          {/* PINS — reusable layer, nothing Midwest-specific inside it */}
          <MapPins
            places={BRUCE_PLACES}
            project={project}
            idPrefix={BRUCE_PREFIX}
            activeId={activeId}
            onToggle={toggle}
            cluster={PIN_CLUSTER}
          />

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
        </svg>

        <Panel item={active} onClose={close} />
      </div>
    </div>
  )
}
