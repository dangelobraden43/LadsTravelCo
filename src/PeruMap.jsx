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

  const togglePlace = (place, id) => {
    if (activeId === id) return show(null)
    show({ ...placeToPanel(place, { idPrefix: 'peru' }), id })
  }

  const toggleCluster = (group) => {
    if (activeId === group.id) return show(null)
    show({
      id: group.id,
      title: `${group.places.length} saved places`,
      /* The marker claims a count and a location, nothing more. The panel
       * names every member so the count is auditable rather than asserted. */
      subtitle: group.places[0].area || 'Cusco',
      members: group.places,
    })
  }

  return (
    <div className="peru-map">
      <svg
        className="peru-map-svg"
        viewBox={VIEW_BOX}
        role="img"
        aria-label="Map of Peru showing the May 2026 trip route and saved places"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="peru-sea" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="var(--peru-sea-1, #10202a)" />
            <stop offset="100%" stopColor="var(--peru-sea-2, #0a1319)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#peru-sea)" />

        <path className="peru-land" d={PERU_PATH} />

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
              className={`peru-day${activeId === id ? ' is-active' : ''}`}
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
              <circle className="peru-day-hit" cx={x} cy={y} r="16" />
              <circle className="peru-day-dot" cx={x} cy={y} r="5" />
              <text className="peru-day-label" x={x} y={y - 12}>
                {a.day}
              </text>
            </g>
          )
        })}

        {/* Dense groups collapse to one honest count marker at the real
            centroid. Cusco is 18 saved places inside about one pixel. */}
        {collapsed.map((g) => (
          <g
            key={g.id}
            className={`peru-cluster${activeId === g.id ? ' is-active' : ''}`}
            onClick={() => toggleCluster(g)}
          >
            <circle className="peru-cluster-hit" cx={g.x} cy={g.y} r="22" />
            <circle className="peru-cluster-ring" cx={g.x} cy={g.y} r="13" />
            <text className="peru-cluster-count" x={g.x} y={g.y + 4}>
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
          r={7}
          hitR={18}
        />
      </svg>

      {panel && (
        <div className="peru-panel" role="dialog" aria-label={panel.title}>
          <button className="peru-panel-close" onClick={() => show(null)} aria-label="Close">
            &times;
          </button>
          <h3 className="peru-panel-title">{panel.title}</h3>
          {panel.subtitle && <p className="peru-panel-sub">{panel.subtitle}</p>}

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
