import React from 'react'
import { Helmet } from 'react-helmet-async'
import { VIEWBOX, STATES, PLACES, ROUTE_PATHS } from './midwestGeo'
import './GoodNews.css'

/* ===== SHARED GEOMETRY =====
   All silhouettes, cities, airports and routes come from src/midwestGeo.js,
   which is GENERATED from real state-boundary GeoJSON through ONE shared
   equirectangular projection (lat0 43.177). Nothing here is hand-placed —
   change the projection in the tracer and every layer re-fits together.

   Michigan is the FOCUS state (full colour, bright coastline). The other five
   are context: same trace quality, deliberately subdued so the mitten still
   reads as the subject. */

/* Four routes. status 'live' (solid) = validated/scouted;
   'proposed' (dashed) = coming. Path data is generated from real waypoints. */
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
    id: 'motor-city',
    name: 'Motor City',
    color: '#c073c0',
    status: 'proposed',
    note: 'Detroit · Corktown — proposed, validating soon',
  },
  {
    id: 'harbor-golf',
    name: 'Harbor & Greens',
    color: '#7fc06a',
    status: 'proposed',
    note: 'Harbor Country + golf country — proposed, validating soon',
  },
]

/* Neighbour-state labels, nudged to sit in open land rather than on a border. */
const STATE_LABELS = [
  { code: 'MN', x: 180, y: 300 },
  { code: 'WI', x: 470, y: 420 },
  { code: 'MI', x: 700, y: 470 },
  { code: 'IL', x: 500, y: 700 },
  { code: 'IN', x: 650, y: 720 },
  { code: 'OH', x: 830, y: 690 },
]

export default function GoodNews() {
  return (
    <div className="gn-root">
      <Helmet>
        <title>Good Brews · Good Views · Good News — The Midwest | The Lads</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="gn-stage">
        <svg
          className="gn-map"
          viewBox={VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Illustrated map of the Midwest — Minnesota, Wisconsin, Michigan, Illinois, Indiana and Ohio — with four Michigan road-trip routes"
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

          {/* water backdrop (Great Lakes feel) */}
          <rect x="0" y="0" width="100%" height="100%" fill="url(#gn-water)" />

          {/* context states first, so Michigan always draws on top */}
          <g filter="url(#gn-land-shadow)">
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

          {/* state labels */}
          {STATE_LABELS.map((l) => (
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

          {/* route endpoint ticks — the anchor/pin systems land here in later phases */}
          {[PLACES.newBuffalo, PLACES.traverseCity, PLACES.marquette, PLACES.detroit].map(
            (p, i) => (
              <circle key={i} className="gn-tick" cx={p.x} cy={p.y} r="4" />
            )
          )}
        </svg>
      </div>
    </div>
  )
}
