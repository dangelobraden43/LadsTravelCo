import React from 'react'
import { Helmet } from 'react-helmet-async'
import './GoodNews.css'

/* ===== SHARED GEOMETRY =====
   Everything lives in the 0 0 1000 880 viewBox so routes, anchors, airports,
   and pins all stay aligned. Coordinates are ROUGH (Brady reviews the
   silhouette after Phase 1 and decides on a real tracing pass). */
const PLACES = {
  newBuffalo: { x: 330, y: 710 },
  kalamazoo: { x: 360, y: 660 },
  grandRapids: { x: 350, y: 590 },
  traverseCity: { x: 390, y: 400 },
  annArbor: { x: 490, y: 700 },
  detroit: { x: 545, y: 690 },
  roscommon: { x: 455, y: 470 }, // golf country (Forest Dunes)
  marquette: { x: 380, y: 185 }, // UP (Greywalls)
}
const AIRPORTS = {
  GRR: { x: 345, y: 615 },
  DTW: { x: 525, y: 705 },
}

/* Rough stylized silhouettes — mitten + UP. Refined in the design pass. */
const LOWER_PENINSULA =
  'M 420 300 ' +
  'C 350 315 318 390 310 470 ' +
  'C 303 550 308 635 342 700 ' +
  'C 376 745 445 750 500 740 ' +
  'C 548 731 568 705 564 658 ' +
  'C 561 618 556 582 549 552 ' +
  'C 565 545 582 548 590 525 ' +
  'C 600 498 596 458 612 452 ' +
  'C 628 446 628 492 618 525 ' +
  'C 610 552 590 575 566 582 ' +
  'C 556 545 545 470 512 408 ' +
  'C 487 362 458 322 420 300 Z'
const UPPER_PENINSULA =
  'M 250 175 ' +
  'C 320 150 400 150 470 158 ' +
  'C 540 165 600 158 648 172 ' +
  'C 632 200 580 212 520 207 ' +
  'C 450 202 360 210 300 214 ' +
  'C 270 216 248 200 250 175 Z'

/* Four routes. SVG path `d` strings in the same viewBox.
   status 'live' (solid) = validated/scouted; 'proposed' (dashed) = coming. */
const ROUTES = [
  {
    id: 'west-coast',
    name: 'The West Coast',
    color: '#5a9aad',
    status: 'live',
    note: 'New Buffalo → Kalamazoo → Grand Rapids → Traverse City',
    d: 'M 330 710 Q 345 685 360 660 Q 360 625 350 590 Q 360 490 390 400',
  },
  {
    id: 'up-north',
    name: 'Up North',
    color: '#e0913a',
    status: 'live',
    note: 'Ann Arbor → the Upper Peninsula',
    d: 'M 490 700 Q 470 580 455 470 Q 445 380 440 320 Q 445 240 420 205 Q 400 190 380 185',
  },
  {
    id: 'motor-city',
    name: 'Motor City',
    color: '#b06fb0',
    status: 'proposed',
    note: 'Detroit · Corktown — proposed, validating soon',
    d: 'M 545 690 Q 562 670 545 655 Q 518 660 513 685 Q 523 702 545 690',
  },
  {
    id: 'harbor-golf',
    name: 'Harbor & Greens',
    color: '#7faf6a',
    status: 'proposed',
    note: 'Harbor Country + golf country — proposed, validating soon',
    d: 'M 330 710 Q 350 560 390 400 Q 425 435 455 470',
  },
]

export default function GoodNews() {
  return (
    <div className="gn-root">
      <Helmet>
        <title>Good Brews · Good Views · Good News — Michigan | The Lads</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="gn-stage">
        <svg
          className="gn-map"
          viewBox="0 0 1000 880"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Illustrated map of Michigan with four road-trip routes"
        >
          <defs>
            <linearGradient id="gn-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16384a" />
              <stop offset="100%" stopColor="#0e2733" />
            </linearGradient>
            <linearGradient id="gn-land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2f6b42" />
              <stop offset="100%" stopColor="#234e31" />
            </linearGradient>
          </defs>

          {/* water backdrop (Great Lakes feel) */}
          <rect x="0" y="0" width="1000" height="880" fill="url(#gn-water)" />

          {/* land — rough silhouette */}
          <path
            className="gn-land gn-up"
            d={UPPER_PENINSULA}
            fill="url(#gn-land)"
            stroke="#9ad29f"
            strokeWidth="2"
          />
          <path
            className="gn-land gn-lp"
            d={LOWER_PENINSULA}
            fill="url(#gn-land)"
            stroke="#9ad29f"
            strokeWidth="2"
          />

          {/* routes */}
          {ROUTES.map((r) => (
            <path
              key={r.id}
              className="gn-route"
              d={r.d}
              fill="none"
              stroke={r.color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={r.status === 'proposed' ? '4 12' : 'none'}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
