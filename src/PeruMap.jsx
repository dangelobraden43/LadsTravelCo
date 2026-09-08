/* THE PERU ROUTE MAP — the interactive country map the paid frameworks inherit.
 *
 * This is Lane 2 of the Peru standard-setter build. It owns geometry, pins and
 * the detail panel. It does NOT own the page shell or the section motion.
 *
 * WHAT MAKES THIS THE TEMPLATE, rather than a Peru-specific one-off: every
 * piece of it that could be Peru-specific is a prop or an import instead.
 * `MapPins` already knew nothing about the Midwest; it now also knows nothing
 * about Peru. The projection comes from a generated geo file, the places come
 * from a data file, and the tier language is the same gold/copper vocabulary
 * the Globe and the Midwest map already speak. Point it at another country's
 * traced geometry and another framework's places and it works unchanged.
 */

import { useMemo, useState } from 'react'
import MapPins, { collapseDense, placeToPanel } from './MapPins'
import { VIEW_BOX, VIEW_W, VIEW_H, PERU_PATH, project } from './data/peruGeo.js'
import { PERU_PLACES, PERU_SAVED_PLACES, PERU_ROUTE } from './data/peru.js'
import './PeruMap.css'

/* ═══════════════════════════════════════════════════════════════════════
 * THE OFFICE-RECORD EXCLUSION — the single most important line in this file
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Two saved entries carry `recordIsOffice: true`. Google's stored coordinate
 * for "Salkantay Trek" and "Red Valley Cusco" is the tour operator's SALES
 * OFFICE on a Cusco street, roughly 100 km from the trek and the valley those
 * names refer to.
 *
 * Pinned at face value, this map would state that Brady hiked the Salkantay
 * traverse in downtown Cusco. That is not a cosmetic error; it is the map
 * asserting something false about where a founder physically went, which is
 * the one thing this company sells.
 *
 * So they are removed HERE, once, at the top, by data flag rather than by
 * name — a rename cannot defeat it. `MAP_PLACES` is the only list the canvas
 * ever sees, and `EXCLUDED_OFFICE_RECORDS` is exported so a test can assert
 * their absence rather than a human having to trust this comment.
 *
 * Their words are not lost. Brady's take on the Salkantay trek and the Red
 * Valley ATV ride belongs to the EXPERIENCE, and the page renders it against
 * the real places (the trail anchors, Vinicunca) in the sections below the
 * map. Dropping the pin does not drop the voice. */
export const EXCLUDED_OFFICE_RECORDS = PERU_SAVED_PLACES.filter((p) => p.recordIsOffice)
const MAP_PLACES = PERU_SAVED_PLACES.filter((p) => !p.recordIsOffice)

/* Day anchors are GPS fixes from Brady's camera EXIF — proof he stood there on
 * that date. `inPeruArc` excludes the Miami departure day, which is a real
 * anchor but not on this canvas. A day anchor is NOT a spot and is never
 * counted as one; it is a waypoint on the route. */
const DAY_ANCHORS = PERU_PLACES.filter((p) => p.inPeruArc !== false && Number.isFinite(p.lat))

/* Catmull-Rom through the real route coordinates, the same approach the
 * Midwest routes use. Real waypoints, never hand-tuned control points, so the
 * line re-fits itself if the projection ever changes. */
function routePath(points) {
  if (points.length < 2) return ''
  const p = points.map((pt) => project(pt.lat, pt.lng))
  let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

/* Peru's own pin vocabulary. Unknown types fall back to a plain dot in
 * MapPins rather than guessing an icon that would state a category. */
const PERU_ICONS = {
  ruin: 'M-1,1 L-1,-0.4 L0,-1 L1,-0.4 L1,1 Z',
  peak: 'M-1,1 L0,-1 L1,1 Z',
  lake: 'M-1,0.2 C-0.5,-0.4 0.5,0.6 1,-0.2',
}

/* A dense group, re-projected into its own frame.
 *
 * The projection is built from the group's OWN bounds rather than the country
 * transform, which is the entire point: the same coordinates that sit inside a
 * pixel at national scale are tens of viewBox units apart here. Nothing is
 * moved, nudged or spread — the frame changes, not the data.
 *
 * A degree of longitude is shorter than a degree of latitude away from the
 * equator, so the longitude span is scaled by cos(lat) exactly as the country
 * tracer does. Skip that and a compact city block renders stretched sideways. */
function ClusterDetail({ group }) {
  const { pins, viewW, viewH } = useMemo(() => {
    const pts = group.places.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
    const lats = pts.map((p) => p.lat)
    const lngs = pts.map((p) => p.lng)
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2
    const k = Math.cos((midLat * Math.PI) / 180)

    const spanLat = Math.max(Math.max(...lats) - Math.min(...lats), 0.0008)
    const spanLng = Math.max((Math.max(...lngs) - Math.min(...lngs)) * k, 0.0008)

    const pad = 26
    const w = 320
    const scale = (w - pad * 2) / spanLng
    const h = Math.round(spanLat * scale + pad * 2)

    return {
      viewW: w,
      viewH: Math.max(h, 150),
      pins: pts.map((p) => ({
        place: p,
        x: pad + (p.lng - Math.min(...lngs)) * k * scale,
        y: pad + (Math.max(...lats) - p.lat) * scale,
      })),
    }
  }, [group])

  return (
    <div className="peru-detail">
      <div className="peru-detail-label">{group.places.length} places, shown at street scale</div>
      <svg
        className="peru-detail-svg"
        viewBox={`0 0 ${viewW} ${viewH}`}
        role="img"
        aria-label={`Detail map of ${group.places.length} places in this area`}
      >
        {pins.map((pin) => (
          <g key={pin.place.placeId || pin.place.name} className="peru-detail-pin">
            <title>{pin.place.name}</title>
            <circle className="peru-detail-halo" cx={pin.x} cy={pin.y} r="9" />
            <circle className="peru-detail-dot" cx={pin.x} cy={pin.y} r="4" />
          </g>
        ))}
      </svg>
    </div>
  )
}

/* THE VIEWBOX IS CROPPED TO THE TRIP, NOT THE COUNTRY.
 *
 * Peru is a tall country: the traced canvas is 698 x 1000, portrait. The page
 * reserves a 16:10 landscape box for the map. Fitting one into the other with
 * `meet` scaled the whole country down to about 468px inside a 1072px frame,
 * marooned it in empty background, and shrank every pin to a speck. Brady's
 * words for the result were "a random GIS map with no pins", which was a fair
 * description of what it had become.
 *
 * So the canvas crops to the ground the trip actually covers, padded out to
 * the box's aspect ratio. The projection does not change and no pin moves —
 * this is a window onto the same canvas, so the coastline near Lima still
 * reads as Peru while the pins get the room to be pins.
 */
const MAP_ASPECT = 16 / 10

const AOI = (() => {
  const pts = [
    ...MAP_PLACES.map((p) => project(p.lat, p.lng)),
    ...DAY_ANCHORS.map((a) => project(a.lat, a.lng)),
    ...PERU_ROUTE.map((r) => project(r.lat, r.lng)),
  ]
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)

  /* Breathing room around the outermost pin so nothing sits on the edge. */
  const margin = 46
  let minX = Math.min(...xs) - margin
  let maxX = Math.max(...xs) + margin
  let minY = Math.min(...ys) - margin
  let maxY = Math.max(...ys) + margin

  /* Grow the short side to match the box, so the SVG fills the frame instead
   * of letterboxing itself inside it. */
  let w = maxX - minX
  let h = maxY - minY
  if (w / h < MAP_ASPECT) {
    const target = h * MAP_ASPECT
    const grow = (target - w) / 2
    minX -= grow
    maxX += grow
  } else {
    const target = w / MAP_ASPECT
    const grow = (target - h) / 2
    minY -= grow
    maxY += grow
  }

  return {
    box: `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`,
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  }
})()

export default function PeruMap({ onSelect = null }) {
  const [activeId, setActiveId] = useState(null)
  const [panel, setPanel] = useState(null)

  const { collapsed, loose } = useMemo(
    () => collapseDense(MAP_PLACES, project, { join: 14, collapseAt: 6 }),
    []
  )

  const route = useMemo(() => routePath(PERU_ROUTE), [])

  const show = (next) => {
    setPanel(next)
    setActiveId(next ? next.id : null)
    if (onSelect) onSelect(next)
  }

  /* ⚠️ MapPins calls `onToggle(pin.id)` — ONE argument, the id string, not the
   * place. The first version of this handler took (place, id) and therefore
   * ran placeToPanel over an id string, which produced a panel with an empty
   * title and no content. It LOOKED fine in a screenshot because the panel
   * still opened. Clicking every pin is what found it.
   *
   * Panels are built once, keyed by the same id MapPins generates, so the
   * lookup cannot drift from the pin it belongs to. */
  const panelsById = useMemo(() => {
    const m = new Map()
    for (const p of loose) {
      const panel = placeToPanel(p, { idPrefix: 'peru' })
      m.set(panel.id, panel)
    }
    return m
  }, [loose])

  const togglePlace = (id) => {
    if (activeId === id) return show(null)
    show(panelsById.get(id) || null)
  }

  const toggleCluster = (group) => {
    if (activeId === group.id) return show(null)
    show({
      id: group.id,
      cluster: group,
      title: `${group.places.length} saved places`,
      /* The marker claims a count and a location, nothing more. The panel
       * names every member so the count is auditable rather than asserted. */
      subtitle: group.places[0].area || 'Cusco',
      members: group.places,
    })
  }

  return (
    /* `peru-map-slot` is Lane 3's layout contract: PeruPage.css reserves a
       fixed-aspect box and absolutely positions this to fill it, so swapping
       the stub for this real map costs zero layout shift. Keep the class. */
    <div className="peru-map peru-map-slot">
      <svg
        className="peru-map-svg"
        viewBox={AOI.box}
        role="img"
        aria-label="Map of Peru showing the May 2026 trip route and saved places"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="peru-sea" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="var(--peru-sea-1, #10202a)" />
            <stop offset="100%" stopColor="var(--peru-sea-2, #0a1319)" />
          </radialGradient>

          {/* ── TEXTURE ──────────────────────────────────────────────────
              Flat colour on flat colour read as elementary. These are the
              cheapest cartographic cues that fix it: a fine hatch over the
              land so it has a surface, a graticule so the frame reads as a
              map rather than a shape, and a soft inner shadow along the
              coast so the land sits above the water instead of beside it.
              All decorative, all pointer-events: none, so none of it can
              eat a click the way the Sept 2 audit found halos doing. */}
          <pattern id="peru-hatch" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,6 L6,0" stroke="rgba(143,215,201,0.07)" strokeWidth="0.7" />
          </pattern>

          <pattern id="peru-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M24,0 L0,0 L0,24"
              fill="none"
              stroke="rgba(143,215,201,0.05)"
              strokeWidth="0.6"
            />
          </pattern>

          <filter id="peru-coast-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="out" result="ring" />
            <feColorMatrix
              in="ring"
              type="matrix"
              values="0 0 0 0 0.25  0 0 0 0 0.70  0 0 0 0 0.63  0 0 0 0.5 0"
            />
          </filter>

          <clipPath id="peru-land-clip">
            <path d={PERU_PATH} />
          </clipPath>
        </defs>

        <rect x={AOI.x} y={AOI.y} width={AOI.w} height={AOI.h} fill="url(#peru-sea)" />

        {/* Graticule across the whole frame, under everything. */}
        <rect
          x={AOI.x}
          y={AOI.y}
          width={AOI.w}
          height={AOI.h}
          fill="url(#peru-grid)"
          pointerEvents="none"
        />

        <path className="peru-land" d={PERU_PATH} filter="url(#peru-coast-glow)" />
        <path className="peru-land-fill" d={PERU_PATH} />

        {/* Hatch, clipped to the land so the sea stays clean. */}
        <g clipPath="url(#peru-land-clip)" pointerEvents="none">
          <rect x={AOI.x} y={AOI.y} width={AOI.w} height={AOI.h} fill="url(#peru-hatch)" />
        </g>

        {/* The route the trip actually took, through real coordinates. */}
        <path className="peru-route" d={route} />

        {/* Day anchors: EXIF-proven positions, drawn under the place pins so a
            specific saved place always wins a tap over a day marker. */}
        {DAY_ANCHORS.map((a) => {
          const { x, y } = project(a.lat, a.lng)
          const id = `day-${a.day}`
          return (
            <g
              key={id}
              className={`peru-mapday${activeId === id ? ' is-active' : ''}`}
              onClick={() =>
                activeId === id
                  ? show(null)
                  : show({
                      id,
                      title: a.name,
                      subtitle: a.date,
                      body: a.manifestLabel,
                      note: a.note,
                      provenance: `Coordinate from ${a.coordSource}`,
                    })
              }
            >
              <circle className="peru-mapday-hit" cx={x} cy={y} r="16" />
              <circle className="peru-mapday-dot" cx={x} cy={y} r="5" />
              {/* Days bunch hard between Cusco and the trail, where four
                  anchors sit within a few units of each other. Alternating the
                  label above and below the dot separates them without moving
                  the dot itself, which must stay on its true coordinate. */}
              <text className="peru-mapday-label" x={x} y={a.day % 2 === 0 ? y - 11 : y + 18}>
                {a.day}
              </text>
            </g>
          )
        })}

        {/* Dense groups collapse to one honest count marker at the real
            centroid. Measured at this projection, the Cusco saved places sit
            inside a 0.63 x 0.39 pixel box. */}
        {collapsed.map((g) => (
          <g
            key={g.id}
            className={`peru-cluster${activeId === g.id ? ' is-active' : ''}`}
            onClick={() => toggleCluster(g)}
          >
            <circle className="peru-cluster-hit" cx={g.x} cy={g.y} r="22" />
            <circle className="peru-cluster-ring" cx={g.x} cy={g.y} r="13" />
            <text className="peru-cluster-count" x={g.x} y={g.y + 4.5}>
              {g.places.length}
            </text>
          </g>
        ))}

        <MapPins
          places={loose}
          project={project}
          idPrefix="peru"
          activeId={activeId}
          onToggle={togglePlace}
          icons={PERU_ICONS}
          r={6.5}
          hitR={20}
          cluster={{ minDist: 11, stackDist: 3.5, ringPad: 1.05 }}
        />
      </svg>

      {panel && (
        <div className="peru-panel" role="dialog" aria-label={panel.title}>
          <button className="peru-panel-close" onClick={() => show(null)} aria-label="Close">
            &times;
          </button>
          {panel.eyebrow && <p className="peru-panel-eyebrow">{panel.eyebrow}</p>}
          <h3 className="peru-panel-title">{panel.title}</h3>
          {(panel.subtitle || panel.place) && (
            <p className="peru-panel-sub">{panel.subtitle || panel.place}</p>
          )}

          {/* The tier chip. `statusTone` is gold for validated and copper for
              research, the same vocabulary the Globe and the Midwest map use.
              A copper pin never renders a visit claim. */}
          {panel.status && (
            <p className={`peru-panel-status peru-panel-status--${panel.statusTone || 'copper'}`}>
              {panel.status}
            </p>
          )}

          {/* placeToPanel puts ALL of a place's content in `lines` — the note,
              the validation sentence, Google's rating labelled as Google's, the
              spend band. The first version of this panel never rendered them,
              so every pin opened an almost-empty card. */}
          {panel.lines && panel.lines.length > 0 && (
            <ul className="peru-panel-lines">
              {panel.lines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}

          {/* THE DETAIL VIEW — how a dense city gets real pins.
              At country scale these twelve places occupy well under a pixel, so
              the canvas collapses them to one honest count marker. Opening it
              re-projects just this group into its own frame, where they are
              metres apart and every one of them is its own pin sitting on its
              own true coordinate. That is the answer to wanting more pins that
              does not involve nudging anything off where it actually is. */}
          {panel.cluster && <ClusterDetail group={panel.cluster} />}

          {panel.members ? (
            <ul className="peru-panel-list">
              {panel.members.map((m) => (
                <li key={m.placeId || m.name}>
                  <span className="peru-panel-name">{m.name}</span>
                  {/* Google's category, labelled as Google's. Never ours. */}
                  {m.googleCategory && (
                    <span className="peru-panel-cat">Google: {m.googleCategory}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <>
              {panel.body && <p className="peru-panel-body">{panel.body}</p>}
              {panel.note && <p className="peru-panel-note">{panel.note}</p>}
              {panel.provenance && <p className="peru-panel-prov">{panel.provenance}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
