import React, { useMemo } from 'react'
import './MapPins.css'

/* ===== REUSABLE MAP PIN LAYER =====
 *
 * NOTHING IN THIS FILE KNOWS ABOUT THE MIDWEST. No state names, no
 * projection, no coordinate bounds, no viewBox. The caller supplies a
 * `project(lat, lng) -> {x, y}` function and a list of normalized places,
 * and this layer draws them. Any map with any projection — the Midwest map
 * today, the Peru framework map next — consumes it identically.
 *
 * THE NORMALIZED PLACE RECORD (the intermediate agreed for pin data):
 *
 *   { name, lat, lng, type, note, validated, validatedBy, visitedDate }
 *
 * plus anything else the source carried (placeId, googleCategory, rating,
 * reviews, price). Only `name`, `lat`, `lng` are required.
 *
 * TIER LANGUAGE — the same one the Globe uses, and it is not decorative:
 *   validated: true   -> GOLD, solid. We were there.
 *   validated: false  -> COPPER, hollow. On the list, not yet validated.
 * `validatedBy` and `visitedDate` are rendered only when the data carries
 * them. A copper pin never renders a visit claim, and nothing here invents
 * one — see placeToPanel below.
 */

/* Icon glyphs, drawn in a unit box (-1..1, origin at the pin centre) and
 * scaled to the pin radius at render time. `type` is the caller's own
 * bucket vocabulary; unknown types fall back to a plain dot rather than
 * throwing or guessing. Override or extend via the `icons` prop. */
export const PIN_ICONS = {
  view: [{ d: 'M -0.78 0.42 L -0.18 -0.46 L 0.16 0.02 L 0.34 -0.24 L 0.78 0.42 Z', mode: 'fill' }],
  // mug: tapered body + a handle held well clear of it. The gap matters —
  // closer than ~0.08 units the stroke merges with the body at pin scale and
  // the whole glyph reads as a letter P rather than a mug.
  brewery: [
    { d: 'M -0.5 -0.52 L 0.04 -0.52 L -0.02 0.58 L -0.44 0.58 Z', mode: 'fill' },
    { d: 'M 0.2 -0.24 C 0.58 -0.24 0.58 0.18 0.2 0.18', mode: 'stroke' },
  ],
  food: [
    { d: 'M -0.62 -0.06 L 0.62 -0.06 A 0.62 0.62 0 0 1 -0.62 -0.06 Z', mode: 'fill' },
    { d: 'M -0.8 -0.06 L 0.8 -0.06', mode: 'stroke' },
  ],
  // Cocktail glass: bowl, stem, foot. A bar is NOT a brewery — Google files
  // 17 of the Midwest candidates as Bar / Pub / Lounge / Cocktail bar, and
  // giving them the mug would state a brewery where the record says bar.
  bar: [
    { d: 'M -0.62 -0.52 L 0.62 -0.52 L 0.06 0.08 L -0.06 0.08 Z', mode: 'fill' },
    { d: 'M 0 0.08 L 0 0.5', mode: 'stroke' },
    { d: 'M -0.34 0.58 L 0.34 0.58', mode: 'stroke' },
  ],
  // Wine glass: a deeper, narrower bowl than the cocktail glass so the two
  // stay distinguishable at pin scale.
  winery: [
    { d: 'M -0.4 -0.56 L 0.4 -0.56 A 0.42 0.5 0 0 1 -0.4 -0.56 Z', mode: 'fill' },
    { d: 'M 0 -0.06 L 0 0.5', mode: 'stroke' },
    { d: 'M -0.3 0.58 L 0.3 0.58', mode: 'stroke' },
  ],
  gem: [{ d: 'M 0 -0.62 L 0.6 -0.04 L 0 0.62 L -0.6 -0.04 Z', mode: 'fill' }],
  golf: [
    { d: 'M -0.3 0.62 L -0.3 -0.62', mode: 'stroke' },
    { d: 'M -0.3 -0.62 L 0.52 -0.36 L -0.3 -0.1 Z', mode: 'fill' },
  ],
  event: [
    { d: 'M -0.6 -0.3 L 0.6 -0.3 L 0.6 0.58 L -0.6 0.58 Z', mode: 'stroke' },
    { d: 'M -0.6 -0.02 L 0.6 -0.02', mode: 'stroke' },
    { d: 'M -0.3 -0.58 L -0.3 -0.18 M 0.3 -0.58 L 0.3 -0.18', mode: 'stroke' },
  ],
}

const FALLBACK_ICON = [
  { d: 'M 0 -0.34 A 0.34 0.34 0 1 1 0 0.34 A 0.34 0.34 0 1 1 0 -0.34 Z', mode: 'fill' },
]

/* Human labels for the shipped buckets. A type with no entry falls back to
 * its own raw value, so a new bucket is never silently mislabelled. */
export const PIN_TYPE_LABELS = {
  view: 'View',
  brewery: 'Brewery',
  bar: 'Bar',
  winery: 'Winery',
  food: 'Food',
  gem: 'Hidden gem',
  golf: 'Golf',
  event: 'Event',
}

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/* One id scheme, exported, so the parent can match its `activeId` back to a
 * record without re-deriving the rule. */
export const makePinId = (idPrefix, place) =>
  `${idPrefix}-${place.placeId || place.id || slug(place.name)}`

const typeLabel = (type) => PIN_TYPE_LABELS[type] || (type ? String(type) : 'Place')

/* 'YYYY-MM' -> 'August 2026'. Anything that is not that shape is passed
 * through verbatim — better a raw string than a wrong date. */
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export function formatVisitedDate(v) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(v || ''))
  if (!m) return v || null
  const i = Number(m[2]) - 1
  return MONTHS[i] ? `${MONTHS[i]} ${m[1]}` : v
}

/* ---------- DECLUSTERING ----------
 * Saved lists cluster hard. In the Bruce set five Tobermory places sit
 * inside 0.3 viewBox units of one another — visually one dot, and one
 * unhittable target. This is the same problem the airport chips already
 * solved on this map, so it gets the same honest answer rather than a new
 * one: the marker stays on the TRUE projected coordinate, and the glyph is
 * pushed out onto a ring with a leader line back to it. The pin never lies
 * about where the place is.
 *
 * Two stages, because one alone gets it wrong:
 *   1. STACKS. Points inside `stackDist` are effectively the same coordinate
 *      (Tobermory: five places inside 0.5 units). A ring seed fans them out,
 *      rotated to match their true bearings so the ring still reads as the
 *      real layout instead of scrambling north and south.
 *   2. RELAXATION. Pairwise repulsion until every glyph clears `minDist`.
 *      Ring seeding alone is not enough — two nearby rings can overlap each
 *      other, and a chain of merely-close points becomes one huge ring with
 *      absurd leaders. Relaxation moves each glyph the minimum needed.
 *
 * Deterministic: no randomness, so the layout is stable across renders.
 * Pure geometry in viewBox units — no projection, no map knowledge. */
export function spreadClusters(
  points,
  { minDist = 20, stackDist = 6, ringPad = 1.15, passes = 200 } = {}
) {
  const n = points.length
  const out = points.map((p) => ({ ...p, gx: p.x, gy: p.y, spread: false }))
  if (n < 2) return out

  /* ---- 1. ring-seed true stacks ---- */
  const parent = out.map((_, i) => i)
  const find = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]
      i = parent[i]
    }
    return i
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) < stackDist) {
        const ra = find(i)
        const rb = find(j)
        if (ra !== rb) parent[rb] = ra
      }
    }
  }
  const groups = new Map()
  for (let i = 0; i < n; i++) {
    const root = find(i)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(i)
  }

  for (const members of groups.values()) {
    if (members.length < 2) continue
    const cx = members.reduce((s, i) => s + points[i].x, 0) / members.length
    const cy = members.reduce((s, i) => s + points[i].y, 0) / members.length
    const radius = Math.max(minDist * 0.75, (members.length * minDist * ringPad) / (2 * Math.PI))
    const step = (Math.PI * 2) / members.length
    // sort by true bearing; identical coordinates tie-break on index
    const ordered = [...members].sort(
      (a, b) =>
        Math.atan2(points[a].y - cy, points[a].x - cx) -
          Math.atan2(points[b].y - cy, points[b].x - cx) || a - b
    )
    // rotate the whole ring to the circular mean of (true bearing - slot),
    // so slots land as close to real bearings as a ring allows
    let sx = 0
    let sy = 0
    ordered.forEach((idx, k) => {
      const t = Math.atan2(points[idx].y - cy, points[idx].x - cx) - k * step
      sx += Math.cos(t)
      sy += Math.sin(t)
    })
    const offset = sx === 0 && sy === 0 ? -Math.PI / 2 : Math.atan2(sy, sx)
    ordered.forEach((idx, k) => {
      const angle = k * step + offset
      out[idx].gx = cx + Math.cos(angle) * radius
      out[idx].gy = cy + Math.sin(angle) * radius
    })
  }

  /* ---- 2. relax until nothing overlaps ---- */
  for (let pass = 0; pass < passes; pass++) {
    let moved = false
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = out[j].gx - out[i].gx
        let dy = out[j].gy - out[i].gy
        let d = Math.hypot(dx, dy)
        if (d >= minDist) continue
        if (d < 1e-6) {
          // exactly coincident: split along a fixed per-index angle
          const a = i * 2.399963229728653 // golden angle, deterministic
          dx = Math.cos(a)
          dy = Math.sin(a)
          d = 1
        }
        const push = (minDist - d) / 2 + 0.02
        const ux = (dx / d) * push
        const uy = (dy / d) * push
        out[i].gx -= ux
        out[i].gy -= uy
        out[j].gx += ux
        out[j].gy += uy
        moved = true
      }
    }
    if (!moved) break
  }

  for (const o of out) {
    o.spread = Math.hypot(o.gx - o.x, o.gy - o.y) > 0.6
    o.gx = +o.gx.toFixed(2)
    o.gy = +o.gy.toFixed(2)
  }
  return out
}

/* ---------- PANEL ADAPTER ----------
 * Same convention as anchorToPanel / airportToPanel in GoodNews.jsx: turn a
 * record into the shared Panel shape. Reuses that one card pattern; there is
 * no second card here.
 *
 * Every claim below is conditional on the data carrying it. A record with
 * validated: false produces no visit claim, no validator name and no date,
 * and says so explicitly. */
export function placeToPanel(place, { idPrefix = 'pin', sourceLabel = null } = {}) {
  const validated = place.validated === true
  const when = validated ? formatVisitedDate(place.visitedDate) : null

  const lines = []
  if (place.note) lines.push(place.note)

  if (validated) {
    if (place.validatedBy) {
      lines.push(`Validated firsthand by ${place.validatedBy}${when ? `, ${when}` : ''}.`)
    } else if (when) {
      lines.push(`Validated firsthand, ${when}.`)
    }
  } else {
    lines.push('On the list, not yet validated. We are not claiming to have been here.')
  }

  // Third-party numbers, labelled as third-party. These are not a Lads rating.
  if (place.rating != null) {
    const reviews = place.reviews != null ? ` across ${place.reviews.toLocaleString()} reviews` : ''
    lines.push(`Google rates it ${place.rating}${reviews} — Google's number, not ours.`)
  }
  if (place.price) lines.push(`Typical spend: ${place.price}.`)

  return {
    id: makePinId(idPrefix, place),
    eyebrow: typeLabel(place.type).toUpperCase(),
    title: place.name,
    place: place.area || place.city || place.googleCategory || null,
    status: validated
      ? `VALIDATED${when ? ` · ${when.toUpperCase()}` : ''}`
      : 'RESEARCH — NOT YET VALIDATED',
    statusTone: validated ? 'gold' : 'copper',
    lines,
    note: sourceLabel ? `Source: ${sourceLabel}` : null,
  }
}

function Glyph({ parts, x, y, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {parts.map((p, i) => (
        <path key={i} className={`mp-glyph mp-glyph--${p.mode}`} d={p.d} />
      ))}
    </g>
  )
}

/**
 * MapPins — a props-driven pin layer. Render inside an <svg>.
 *
 * PROP CONTRACT (this is the whole thing a second map has to satisfy):
 *   places    (required) normalized records — see the header block
 *   project   (required) (lat, lng) => { x, y } in the host svg's viewBox units
 *   onToggle  (required) (id) => void — the host owns which panel is open
 *   activeId  currently-open pin id, or null
 *   idPrefix  namespaces the ids so several layers can share one host
 *   r         pin radius in viewBox units (default 7)
 *   hitR      transparent tap-target radius in viewBox units (default 18)
 *   icons     type -> glyph parts; merged over PIN_ICONS
 *   cluster   { minDist, ringPad } passed to spreadClusters; false disables
 */
export default function MapPins({
  places = [],
  project,
  onToggle,
  activeId = null,
  idPrefix = 'pin',
  r = 7,
  hitR = 18,
  icons = null,
  cluster = undefined,
}) {
  const iconSet = useMemo(() => (icons ? { ...PIN_ICONS, ...icons } : PIN_ICONS), [icons])

  const pins = useMemo(() => {
    if (!project) return []
    const projected = places
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => {
        const { x, y } = project(p.lat, p.lng)
        return { place: p, id: makePinId(idPrefix, p), x, y }
      })
    return cluster === false
      ? projected.map((p) => ({ ...p, gx: p.x, gy: p.y, spread: false }))
      : spreadClusters(projected, cluster || undefined)
  }, [places, project, idPrefix, cluster])

  if (!pins.length) return null

  return (
    <g className="mp-layer">
      {pins.map((pin) => {
        const p = pin.place
        const validated = p.validated === true
        const tier = validated ? 'gold' : 'copper'
        const parts = iconSet[p.type] || FALLBACK_ICON
        const label = `${p.name} — ${typeLabel(p.type)}, ${
          validated ? 'validated' : 'research, not yet validated'
        }`
        return (
          <g
            key={pin.id}
            className={`mp-pin mp-pin--${tier}${activeId === pin.id ? ' is-active' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={label}
            onClick={() => onToggle(pin.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggle(pin.id)
              }
            }}
          >
            {pin.spread && (
              <>
                <line className="mp-leader" x1={pin.x} y1={pin.y} x2={pin.gx} y2={pin.gy} />
                <circle className="mp-truth" cx={pin.x} cy={pin.y} r={r * 0.26} />
              </>
            )}
            <circle className="mp-halo" cx={pin.gx} cy={pin.gy} r={r * 2.1} />
            {/* Transparent tap target, centred on the pin's drawn position so
                it never shifts what the pin claims.
                ⚠️ THE 44px GUIDELINE CANNOT BE MET ON THE MAP ITSELF AT THIS
                ZOOM, and pretending otherwise would be the lie. Declustering
                spreads neighbours to `minDist` viewBox units; at 390px the
                canvas scales to ~0.37, so even neighbours pushed 34 units
                apart sit ~13 CSS px from each other. A 44px target would
                swallow its neighbours and make them unreachable — a
                regression dressed as a fix. hitR is therefore set to the
                largest value that stays inside minDist/2, and the real 44px
                surface is the companion list the page renders beside the map,
                where every row is a full-width 44px+ target. */}
            <circle className="mp-hit" cx={pin.gx} cy={pin.gy} r={hitR} />
            <circle className="mp-disc" cx={pin.gx} cy={pin.gy} r={r} />
            {/* 0.62 leaves a clear ring of disc around the glyph. Tuned at the
                Midwest zoom, where r renders ~6 CSS px: any larger and the
                glyph bleeds to the rim and every type reads as the same blob. */}
            <Glyph parts={parts} x={pin.gx} y={pin.gy} scale={r * 0.62} />
            <title>{label}</title>
          </g>
        )
      })}
    </g>
  )
}
