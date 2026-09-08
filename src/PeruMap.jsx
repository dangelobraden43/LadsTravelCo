/* PERU MAP — PLACEHOLDER. LANE 2 OWNS THE REAL ONE.
 *
 * This file exists so the page shell (`PeruPage.jsx`) can import and lay out
 * the map slot before the map itself exists. It renders one empty div and
 * nothing else. Do NOT add map logic, geometry, projection, pins or data
 * imports here from the shell side — the interactive Peru map is being built
 * in parallel and will replace this file wholesale.
 *
 * THE CONTRACT WITH THE SHELL, so the swap costs nothing:
 *   - `PeruPage.css` reserves the box. `.peru-map-box` holds a fixed
 *     aspect ratio at every breakpoint, and `.peru-map-slot` is absolutely
 *     positioned to fill it. The reserved height is therefore identical
 *     before, during and after the real map loads, which is what keeps the
 *     layout shift at zero.
 *   - The shell lazy-loads this module behind a Suspense skeleton, so a real
 *     map with geometry and data files will not sit in the critical path.
 *   - Keep the root element carrying `className="peru-map-slot"` (extra
 *     classes are fine) and the shell needs no edit at all.
 *
 * The div is deliberately empty rather than carrying "map coming soon" copy.
 * A placeholder that announces itself as a placeholder is still a claim on
 * the page, and this one has nothing true to say yet.
 */
export default function PeruMap() {
  return <div className="peru-map-slot" />
}
