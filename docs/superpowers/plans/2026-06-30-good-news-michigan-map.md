# Good Brews · Good Views · Good News — Michigan Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained, illustrated, immersive Michigan road-trip map component ("Good Brews · Good Views · Good News") on its own `/good-news` route — rough first, reversible, nothing wired into the homepage or live site.

**Architecture:** A single React component `src/GoodNews.jsx` (+ co-located `GoodNews.css`) renders an inline SVG illustration of Michigan (mitten + UP) inside a fixed `viewBox`. Four colored route lines are real SVG `<path>` elements drawn in that same coordinate space so a draggable vehicle can ride them next session via `getPointAtLength()`. University anchors and airport icons are SVG markers in the same space; clicking one opens a single shared HTML overlay panel (one `activePanel` state). The component is lazy-loaded at `/good-news` in `main.jsx` on a throwaway feature branch — the homepage, nav, footer, and existing `/michigan` framework are untouched.

**Tech Stack:** React 18, React Router (already in repo), inline SVG (no new dependencies), CSS custom properties from `src/index.css`, Vite dev server + Playwright for screenshot verification.

## Global Constraints

- **Route path:** `/good-news` only. Do NOT touch the existing `/michigan` framework route, `michigan.js`, `App.jsx`, `Nav`, `Footer`, `LocalPage`, or `Globe.jsx`.
- **Branch:** all work on a new `michigan` branch cut from `main`. Never push. Never merge to `main`. Commit once per phase.
- **No new npm dependencies.** Inline SVG only — no d3-geo, no map libraries, no Three.js.
- **Self-contained + reversible:** the only file outside `src/GoodNews.*` that may be edited is `main.jsx` (one lazy route + one `<Route>`) and `vercel.json` (one rewrite) — both trivially revertible, branch-only.
- **HARD HONESTY RULE:** Use only real data already in `src/data/michigan.js` (breweries, golf). There is NO Aug–Oct event data and NO HOP-passport specifics in the repo. Those render as honestly-labeled placeholders ("Events coming — validated August"). Do NOT fabricate event names, dates, or prices.
- **NOT tonight (build as designed placeholders, do not implement):** draggable vehicle, live flight-price API, real event data, homepage placement.
- **Reduced motion:** respect `@media (prefers-reduced-motion: reduce)` for any animation.
- **Verification per phase:** `npm run build` must pass, then Playwright screenshots at **1440px** and **390px** widths against the Vite dev server. No unit-test runner exists in this repo — build + screenshots is the established frontend verification pattern (per CLAUDE.md).
- **Palette:** pull from `src/index.css :root` (`--gold #d4a843`, `--copper #b8886e`, `--teal #5a9aad`, `--cream #e8dcc8`, `--bg #141210`). Route colors defined per-route in the component.

---

## Shared Coordinate System (single source of truth)

All SVG geometry uses `viewBox="0 0 1000 880"`. Cities, routes, anchors, and airports reference this `PLACES` table so everything aligns. These coordinates are **rough** (Brady reviews the silhouette after Phase 1 and decides on a design pass):

```jsx
// Shared geometry — all in the 0 0 1000 880 viewBox.
const PLACES = {
  newBuffalo:   { x: 250, y: 805 },
  kalamazoo:    { x: 320, y: 720 },
  grandRapids:  { x: 305, y: 620 },
  traverseCity: { x: 380, y: 380 },
  annArbor:     { x: 520, y: 730 },
  detroit:      { x: 575, y: 700 },
  roscommon:    { x: 470, y: 330 }, // golf country (Forest Dunes)
  marquette:    { x: 360, y: 175 }, // UP (Greywalls)
}
const AIRPORTS = {
  GRR: { x: 300, y: 655 },
  DTW: { x: 555, y: 718 },
}
```

---

## File Structure

- **Create `src/GoodNews.jsx`** — the entire component: SVG map, routes, anchors, airports, shared panel, banner. One responsibility: render the `/good-news` experience.
- **Create `src/GoodNews.css`** — co-located styles (banner, panel overlay, marker hover states, reduced-motion).
- **Modify `src/main.jsx`** — add `const GoodNews = lazy(() => import('./GoodNews'))` and `<Route path="/good-news" element={<GoodNews />} />`. Nothing else.
- **Modify `vercel.json`** — add `{ "source": "/good-news", "destination": "/" }` to `rewrites` so the SPA route resolves (branch-only; not pushed).

---

## Phase 1 — Illustrated Michigan + 4 Routes (rough)

**Deliverable:** Visiting `/good-news` on the dev server shows a colorful illustrated Michigan (mitten + UP) with four distinctly-colored route lines drawn across it. Routes 1 & 2 solid (validated/scouted), Routes 3 & 4 dashed (proposed/coming). No anchors, panels, or airports yet. Build passes; 1440 + 390 screenshots captured.

**Files:**
- Create: `src/GoodNews.jsx`, `src/GoodNews.css`
- Modify: `src/main.jsx`, `vercel.json`

**Interfaces:**
- Produces: default-exported `GoodNews` React component; module-level `PLACES`, `AIRPORTS`, and `ROUTES` constants (Phase 2/3 consume `PLACES`/`AIRPORTS`).

- [ ] **Step 1: Cut the branch from main**

```bash
git fetch origin
git switch main
git switch -c michigan
git switch --show-current   # expect: michigan
```

- [ ] **Step 2: Create the component scaffold + route geometry**

Create `src/GoodNews.jsx` with the `PLACES`/`AIRPORTS` tables above plus the route definitions and a minimal render:

```jsx
import React from 'react'
import { Helmet } from 'react-helmet-async'
import './GoodNews.css'

const PLACES = { /* ...table above... */ }
const AIRPORTS = { /* ...table above... */ }

// Four routes. SVG path `d` strings in the 0 0 1000 880 space.
// status: 'live' (solid) = validated/scouted; 'proposed' (dashed) = coming.
const ROUTES = [
  {
    id: 'west-coast', name: 'The West Coast', color: '#5a9aad', status: 'live',
    note: 'New Buffalo → Kalamazoo → Grand Rapids → Traverse City',
    d: 'M 250 805 Q 270 760 320 720 Q 330 670 305 620 Q 320 500 380 380',
  },
  {
    id: 'up-north', name: 'Up North', color: '#e0913a', status: 'live',
    note: 'Ann Arbor → the Upper Peninsula',
    d: 'M 520 730 Q 470 600 430 460 Q 410 360 430 280 Q 470 210 430 180 Q 400 175 360 175',
  },
  {
    id: 'motor-city', name: 'Motor City', color: '#b06fb0', status: 'proposed',
    note: 'Detroit · Corktown — proposed, validating soon',
    d: 'M 575 700 Q 600 685 588 660 Q 560 648 540 668 Q 545 700 575 700',
  },
  {
    id: 'harbor-golf', name: 'Harbor & Greens', color: '#7faf6a', status: 'proposed',
    note: 'Harbor Country + golf country — proposed, validating soon',
    d: 'M 380 380 Q 440 360 470 330 Q 430 250 385 180',
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
        <svg className="gn-map" viewBox="0 0 1000 880" preserveAspectRatio="xMidYMid meet" role="img"
             aria-label="Illustrated map of Michigan with four road-trip routes">
          {/* water backdrop */}
          <rect x="0" y="0" width="1000" height="880" fill="url(#gn-water)" />
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
          {/* land — rough silhouette, refined in design pass */}
          <path className="gn-lp" d={LOWER_PENINSULA} fill="url(#gn-land)" stroke="#9ad29f" strokeWidth="2" />
          <path className="gn-up" d={UPPER_PENINSULA} fill="url(#gn-land)" stroke="#9ad29f" strokeWidth="2" />
          {/* routes */}
          {ROUTES.map((r) => (
            <path key={r.id} className="gn-route" d={r.d} fill="none" stroke={r.color}
                  strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={r.status === 'proposed' ? '4 12' : 'none'} />
          ))}
        </svg>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add the rough land silhouette path constants**

Add above the component (rough mitten + UP — Brady reviews after this phase):

```jsx
// Rough stylized silhouettes — refined in the design pass after Phase 1 review.
const LOWER_PENINSULA =
  'M 300 300 C 270 360 262 440 280 510 C 298 580 330 650 380 705 ' +
  'C 425 752 495 765 545 735 C 575 716 585 678 575 648 ' +
  'C 600 660 625 640 615 612 C 605 585 575 585 560 600 ' +
  'C 560 520 545 430 500 360 C 455 300 380 280 300 300 Z'
const UPPER_PENINSULA =
  'M 250 150 C 300 120 380 118 470 130 C 540 140 600 130 640 150 ' +
  'C 620 185 560 195 500 190 C 430 185 360 195 300 200 ' +
  'C 270 200 250 180 250 150 Z'
```

- [ ] **Step 4: Style the stage + map in `GoodNews.css`**

Create `src/GoodNews.css`:

```css
.gn-root { min-height: 100vh; background: var(--bg); color: var(--cream);
  font-family: var(--sans); display: flex; flex-direction: column; }
.gn-stage { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
.gn-map { width: min(100%, 1100px); height: auto; display: block;
  filter: drop-shadow(0 24px 60px rgba(0,0,0,0.5)); }
.gn-route { transition: stroke-width 0.2s var(--transition); }
@media (prefers-reduced-motion: reduce) { .gn-route { transition: none; } }
@media (max-width: 520px) { .gn-stage { padding: 12px; } }
```

- [ ] **Step 5: Register the route (branch-only)**

In `src/main.jsx`, add after the other `lazy(...)` lines:

```jsx
const GoodNews = lazy(() => import('./GoodNews'))
```

and inside `<Routes>` (near the "Kept reachable" block):

```jsx
<Route path="/good-news" element={<GoodNews />} />
```

In `vercel.json` `rewrites`, add:

```json
{ "source": "/good-news", "destination": "/" }
```

- [ ] **Step 6: Build to verify it compiles**

Run: `npm run build`
Expected: build completes with no errors; a `GoodNews` chunk appears in the output.

- [ ] **Step 7: Capture screenshots (1440 + 390)**

Start the dev server (`npm run dev`), then with Playwright navigate to `http://localhost:5173/good-news` and screenshot full page at viewport width 1440 and again at 390. Save to the scratchpad as `phase1-1440.png` and `phase1-390.png`.

- [ ] **Step 8: Commit**

```bash
git add src/GoodNews.jsx src/GoodNews.css src/main.jsx vercel.json
git commit -m "feat(good-news): rough illustrated Michigan map + 4 routes (Phase 1)"
```

- [ ] **Step 9: STOP — report to Brady with both screenshots. Await approval before Phase 2.**

---

## Phase 2 — University Anchors + Story Panels

**Deliverable:** Two clickable anchor markers (GVSU/Grand Rapids — Brady; Kalamazoo College — Dawson). Clicking one opens a single shared dismissible story panel with that anchor's content. Clicking the other swaps content; clicking outside / a close button dismisses. Build passes; 1440 + 390 screenshots captured.

**Files:**
- Modify: `src/GoodNews.jsx`, `src/GoodNews.css`

**Interfaces:**
- Consumes: `PLACES` from Phase 1.
- Produces: `activePanel` state (`useState`) + `ANCHORS` array; Phase 3 reuses the same panel mechanism for airports.

- [ ] **Step 1: Add anchor data**

Add module-level (content drawn only from the spec — real, not invented):

```jsx
const ANCHORS = [
  {
    id: 'gvsu', kind: 'anchor', at: PLACES.grandRapids, label: 'GVSU · Grand Rapids',
    person: 'Brady',
    title: 'GVSU & Grand Rapids — Brady',
    body: [
      'Grand Valley State University: the Padnos International Center (study abroad + global programs), the Seidman College of Business, and the Honors College.',
      'Grand Rapids is "Beer City USA" — the launch point of The West Coast route and the densest brewery cluster in the state.',
    ],
  },
  {
    id: 'kcollege', kind: 'anchor', at: PLACES.kalamazoo,
    person: 'Dawson',
    title: 'Kalamazoo College — Dawson',
    body: [
      "Dawson's campus: football and the start of his broadcasting career.",
      'A stop on The West Coast route between New Buffalo and Grand Rapids.',
    ],
  },
]
```

- [ ] **Step 2: Add shared panel state + render markers**

Inside the component, add `const [activePanel, setActivePanel] = React.useState(null)`. Render anchor markers inside the SVG (after routes):

```jsx
{ANCHORS.map((a) => (
  <g key={a.id} className="gn-anchor" transform={`translate(${a.at.x} ${a.at.y})`}
     onClick={() => setActivePanel(a)} role="button" tabIndex={0}
     aria-label={a.title}
     onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePanel(a) }}>
    <circle r="13" className="gn-anchor-dot" />
    <circle r="6" fill="var(--bg)" />
    <text y="-22" className="gn-anchor-label" textAnchor="middle">{a.label || a.title}</text>
  </g>
))}
```

- [ ] **Step 3: Render the shared panel overlay**

After the `</svg>`, inside `.gn-stage` wrapper, add:

```jsx
{activePanel && (
  <div className="gn-panel" role="dialog" aria-label={activePanel.title}>
    <button className="gn-panel-close" onClick={() => setActivePanel(null)} aria-label="Close">×</button>
    {activePanel.person && <span className="gn-panel-eyebrow">{activePanel.person}</span>}
    <h3 className="gn-panel-title">{activePanel.title}</h3>
    {activePanel.body.map((p, i) => <p key={i} className="gn-panel-body">{p}</p>)}
  </div>
)}
{activePanel && <div className="gn-scrim" onClick={() => setActivePanel(null)} />}
```

- [ ] **Step 4: Style anchors + panel**

Append to `GoodNews.css`:

```css
.gn-anchor { cursor: pointer; }
.gn-anchor-dot { fill: var(--gold); transition: r 0.2s var(--transition); }
.gn-anchor:hover .gn-anchor-dot, .gn-anchor:focus .gn-anchor-dot { r: 16; }
.gn-anchor-label { fill: var(--cream); font-family: var(--mono); font-size: 13px;
  letter-spacing: 1px; paint-order: stroke; stroke: var(--bg); stroke-width: 4px; }
.gn-scrim { position: fixed; inset: 0; background: rgba(10,8,6,0.5); z-index: 10; }
.gn-panel { position: fixed; z-index: 11; right: 24px; top: 50%; transform: translateY(-50%);
  width: min(380px, 90vw); background: var(--surface); border: 1px solid var(--gold-border);
  border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow-lg); }
.gn-panel-close { position: absolute; top: 12px; right: 16px; background: none; border: none;
  color: var(--cream2); font-size: 24px; cursor: pointer; line-height: 1; }
.gn-panel-eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--gold); }
.gn-panel-title { font-family: var(--editorial); font-style: italic; font-size: 24px;
  margin: 6px 0 14px; color: var(--cream); }
.gn-panel-body { color: var(--cream2); font-size: 14px; line-height: 1.6; margin-bottom: 10px; }
@media (max-width: 520px) { .gn-panel { right: 12px; left: 12px; width: auto; } }
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build completes, no errors.

- [ ] **Step 6: Screenshots**

Dev server + Playwright: navigate to `/good-news`, click the GVSU anchor, screenshot panel open at 1440 and 390. Save `phase2-1440.png`, `phase2-390.png`.

- [ ] **Step 7: Commit**

```bash
git add src/GoodNews.jsx src/GoodNews.css
git commit -m "feat(good-news): clickable university anchors + story panels (Phase 2)"
```

- [ ] **Step 8: STOP — report to Brady with screenshots. Await approval before Phase 3.**

---

## Phase 3 — Airport Icons + Coming-Soon Panels + Banner Framing

**Deliverable:** Two big clickable airport icons (GRR, DTW) that open a "Live flight prices — coming soon" panel (structure ready for an API next session, no API now). The "Good Brews · Good Views · Good News" banner frames the map, with the three meanings as subtext and an honestly-labeled "Events coming — validated August" placeholder for the Aug–Oct layer. Build passes; 1440 + 390 screenshots captured.

**Files:**
- Modify: `src/GoodNews.jsx`, `src/GoodNews.css`

**Interfaces:**
- Consumes: `AIRPORTS`, `activePanel`/`setActivePanel` from earlier phases.

- [ ] **Step 1: Add airport panel data + markers**

Add module-level:

```jsx
const AIRPORT_NODES = [
  { id: 'grr', kind: 'airport', at: AIRPORTS.GRR, code: 'GRR', title: 'GRR — Gerald R. Ford Int’l',
    body: ['Live flight prices — coming soon.', 'Gateway to The West Coast route.'], comingSoon: true },
  { id: 'dtw', kind: 'airport', at: AIRPORTS.DTW, code: 'DTW', title: 'DTW — Detroit Metro',
    body: ['Live flight prices — coming soon.', 'Gateway to Up North + Motor City.'], comingSoon: true },
]
```

Render inside the SVG (after anchors) — bigger than anchors, with a plane glyph and the code:

```jsx
{AIRPORT_NODES.map((a) => (
  <g key={a.id} className="gn-airport" transform={`translate(${a.at.x} ${a.at.y})`}
     onClick={() => setActivePanel(a)} role="button" tabIndex={0} aria-label={a.title}
     onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePanel(a) }}>
    <circle r="20" className="gn-airport-disc" />
    <text className="gn-airport-glyph" textAnchor="middle" dy="6">✈</text>
    <text y="38" className="gn-airport-code" textAnchor="middle">{a.code}</text>
  </g>
))}
```

- [ ] **Step 2: Extend the panel for coming-soon state**

In the panel render, add a coming-soon badge when `activePanel.comingSoon`:

```jsx
{activePanel.comingSoon && <span className="gn-panel-soon">COMING SOON · NEXT SESSION</span>}
```

(Place it directly under `.gn-panel-eyebrow` / above the title.)

- [ ] **Step 3: Add the banner framing + events placeholder**

Above `.gn-stage` in the component, add the hero banner:

```jsx
<header className="gn-banner">
  <h1 className="gn-banner-title">
    <span style={{ color: '#5a9aad' }}>Good Brews</span> ·{' '}
    <span style={{ color: '#7faf6a' }}>Good Views</span> ·{' '}
    <span style={{ color: '#e0913a' }}>Good News</span>
  </h1>
  <p className="gn-banner-sub">
    Brews — breweries, HOP passport, happy hours · Views — golf, fall colors, lakeshore, the UP ·
    News — what’s happening, August through October
  </p>
  <p className="gn-banner-soon">Events coming — validated August</p>
</header>
```

- [ ] **Step 4: Style banner + airports + coming-soon badge**

Append to `GoodNews.css`:

```css
.gn-banner { text-align: center; padding: 40px 24px 8px; }
.gn-banner-title { font-family: var(--editorial); font-weight: 600; font-size: clamp(28px, 5vw, 52px);
  letter-spacing: -0.5px; }
.gn-banner-sub { color: var(--cream2); font-size: 14px; max-width: 760px; margin: 12px auto 0; }
.gn-banner-soon { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--copper); margin-top: 10px; }
.gn-airport { cursor: pointer; }
.gn-airport-disc { fill: var(--bg); stroke: var(--gold); stroke-width: 2.5; transition: r 0.2s var(--transition); }
.gn-airport:hover .gn-airport-disc, .gn-airport:focus .gn-airport-disc { r: 24; }
.gn-airport-glyph { fill: var(--gold); font-size: 18px; }
.gn-airport-code { fill: var(--cream); font-family: var(--mono); font-size: 12px; letter-spacing: 1px;
  paint-order: stroke; stroke: var(--bg); stroke-width: 4px; }
.gn-panel-soon { display: inline-block; font-family: var(--mono); font-size: 10px; letter-spacing: 2px;
  color: var(--copper); border: 1px solid var(--copper); border-radius: var(--radius-full);
  padding: 3px 10px; margin-bottom: 8px; }
@media (prefers-reduced-motion: reduce) { .gn-airport-disc { transition: none; } }
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build completes, no errors.

- [ ] **Step 6: Screenshots**

Dev server + Playwright: navigate to `/good-news`, screenshot the full map with banner at 1440 and 390; then click GRR and screenshot the coming-soon panel at both widths. Save `phase3-1440.png`, `phase3-390.png`, `phase3-grr-1440.png`.

- [ ] **Step 7: Commit**

```bash
git add src/GoodNews.jsx src/GoodNews.css
git commit -m "feat(good-news): airport icons + coming-soon panels + banner framing (Phase 3)"
```

- [ ] **Step 8: STOP — final report to Brady with screenshots. No push, no merge. Placement decided separately.**

---

## Phase 4 — Pin System (category pins + detail cards)

**Deliverable:** A reusable pin system with a unique icon per category — **brewery, golf, view, event, hidden gem**. Each pin is hover-able and clickable, opening a small detail card. REAL pins are placed only where `michigan.js` has data (brewery clusters + golf courses), with real names in the card. Event / HOP / hidden-gem pins render as honestly-labeled "coming — validated August" pins. All pins use the shared `PLACES`/pin-coordinate space so they align with routes and anchors. Build passes; 1440 + 390 screenshots captured.

**Files:**
- Modify: `src/GoodNews.jsx`, `src/GoodNews.css`

**Interfaces:**
- Consumes: `PLACES` from Phase 1, `activePanel`/`setActivePanel` reused as the detail-card mechanism, plus a lightweight `hoverPin` state for hover cards.
- Produces: `PIN_KINDS` (icon/color per category) and `PINS` (placed pins).

- [ ] **Step 1: Import real Michigan data + define the pin kinds**

At the top of `GoodNews.jsx`:

```jsx
import michiganData from './data/michigan'
```

Add module-level (unique icon + color per category):

```jsx
const PIN_KINDS = {
  brewery: { glyph: '🍺', color: '#d4a843', label: 'Brewery' },
  golf:    { glyph: '⛳', color: '#7faf6a', label: 'Golf' },
  view:    { glyph: '⛰', color: '#5a9aad', label: 'Scenic View' },
  event:   { glyph: '★',  color: '#e0913a', label: 'Event' },
  gem:     { glyph: '◆',  color: '#b06fb0', label: 'Hidden Gem' },
}
```

- [ ] **Step 2: Derive REAL pins from michigan.js + add honest placeholders**

Add a helper that buckets the brewery categories to `PLACES` coords and pulls golf courses out by name (real data only):

```jsx
// Map michigan.js brewery categories → shared coordinates.
const BREWERY_CLUSTERS = {
  'grand-rapids-breweries': PLACES.grandRapids,
  'detroit': PLACES.detroit,
  'traverse-city': PLACES.traverseCity,
  'harbor-country': PLACES.newBuffalo,
}
// Golf course coordinates (rough; refined in design pass).
const GOLF_COORDS = {
  'Arcadia Bluffs': { x: 350, y: 360 },
  'Forest Dunes': PLACES.roscommon,
  'Greywalls': PLACES.marquette,
  'Hills of Lenawee': { x: 545, y: 775 },
}

function buildPins(data) {
  const pins = []
  for (const cat of data.categories) {
    if (BREWERY_CLUSTERS[cat.id]) {
      pins.push({
        id: `brew-${cat.id}`, kind: 'brewery', at: BREWERY_CLUSTERS[cat.id],
        title: cat.name, real: true,
        items: cat.spots.map((s) => s.name), // real brewery names
      })
    }
    if (cat.id === 'golf') {
      for (const s of cat.spots) {
        const at = GOLF_COORDS[s.name]
        if (at) pins.push({ id: `golf-${s.name}`, kind: 'golf', at, title: s.name,
          real: true, items: [s.note, s.price].filter(Boolean) })
      }
    }
  }
  return pins
}

// Honest placeholders — NOT invented spots. Labeled "coming".
const PLACEHOLDER_PINS = [
  { id: 'event-soon', kind: 'event', at: { x: 305, y: 590 }, title: 'Late-summer events',
    coming: true, items: ['Events coming — validated August.'] },
  { id: 'gem-soon', kind: 'gem', at: { x: 420, y: 450 }, title: 'Hidden gems',
    coming: true, items: ['Hand-picked gems coming — validated August.'] },
]
```

In the component: `const PINS = [...buildPins(michiganData), ...PLACEHOLDER_PINS]`.

- [ ] **Step 3: Render pins with hover + click**

Add a `const [hoverPin, setHoverPin] = React.useState(null)`. Render pins inside the SVG (after airports) as teardrop markers:

```jsx
{PINS.map((p) => {
  const kind = PIN_KINDS[p.kind]
  return (
    <g key={p.id} className="gn-pin" transform={`translate(${p.at.x} ${p.at.y})`}
       onMouseEnter={() => setHoverPin(p)} onMouseLeave={() => setHoverPin(null)}
       onClick={() => setActivePanel({ ...p, title: p.title,
         body: p.items, comingSoon: p.coming, person: kind.label })}
       role="button" tabIndex={0} aria-label={`${kind.label}: ${p.title}`}
       onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ')
         setActivePanel({ ...p, body: p.items, comingSoon: p.coming, person: kind.label }) }}>
      <path className="gn-pin-body" d="M 0 0 C -11 -16 -11 -30 0 -30 C 11 -30 11 -16 0 0 Z"
            fill={kind.color} opacity={p.coming ? 0.55 : 1} />
      <circle cy="-21" r="7" fill="var(--bg)" />
      <text y="-17" className="gn-pin-glyph" textAnchor="middle">{kind.glyph}</text>
    </g>
  )
})}
```

- [ ] **Step 4: Render the lightweight hover card**

After the panel block, add a small hover card (does not replace the click panel):

```jsx
{hoverPin && (
  <div className="gn-hovercard">
    <span className="gn-hovercard-kind">{PIN_KINDS[hoverPin.kind].label}</span>
    <strong>{hoverPin.title}</strong>
    {hoverPin.coming && <em> · coming, validated August</em>}
  </div>
)}
```

- [ ] **Step 5: Style pins + hover card**

Append to `GoodNews.css`:

```css
.gn-pin { cursor: pointer; }
.gn-pin-body { transition: transform 0.15s var(--transition); transform-origin: center bottom; }
.gn-pin:hover .gn-pin-body, .gn-pin:focus .gn-pin-body { transform: scale(1.25); }
.gn-pin-glyph { font-size: 9px; }
.gn-hovercard { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: var(--elevated); border: 1px solid var(--gold-border); border-radius: var(--radius-sm);
  padding: 8px 16px; font-size: 13px; color: var(--cream); z-index: 12; pointer-events: none; }
.gn-hovercard-kind { font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px;
  text-transform: uppercase; color: var(--gold); margin-right: 8px; }
@media (prefers-reduced-motion: reduce) { .gn-pin-body { transition: none; } }
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build completes, no errors.

- [ ] **Step 7: Screenshots**

Dev server + Playwright: navigate to `/good-news`, hover a brewery pin (screenshot hover card), click a golf pin (screenshot detail card), at 1440 and 390. Save `phase4-1440.png`, `phase4-390.png`.

- [ ] **Step 8: Commit**

```bash
git add src/GoodNews.jsx src/GoodNews.css
git commit -m "feat(good-news): category pin system + detail cards (Phase 4)"
```

- [ ] **Step 9: STOP — final report to Brady with screenshots. No push, no merge.**

---

## Self-Review (against the locked spec)

- **Spec coverage:** illustrated mitten+UP ✓ (P1); 4 colored routes incl. the two named real routes + two honest proposed gap-fillers ✓ (P1); routes vehicle-ready as SVG paths ✓ (P1); GVSU + K-College anchors with exact named content ✓ (P2); GRR/DTW big clickable airports → coming-soon panel ✓ (P3); banner framing with Brews/Views/News meanings ✓ (P3); honest event placeholder, no invented data ✓ (P3); `/good-news` route, branch-only, no homepage/main changes ✓ (Global Constraints); per-phase screenshots 1440+390 + commit ✓ (every phase).
- **Placeholder scan:** event/HOP/flight content is intentionally placeholder per the HARD HONESTY RULE and labeled as such — not a plan gap. No "TBD" steps; every code step has real code.
- **Type consistency:** `activePanel`/`setActivePanel`, `PLACES`, `AIRPORTS`, `ANCHORS`, `AIRPORT_NODES`, `ROUTES` referenced consistently across phases; one shared panel renders both anchors (`person`/`title`/`body`) and airports (`comingSoon`/`title`/`body`).
- **Explicitly deferred (placeholders only):** draggable vehicle, flight API, real event data, homepage placement — all reserved, none built.
