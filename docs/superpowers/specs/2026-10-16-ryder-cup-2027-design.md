# Ryder Cup 2027 Guide — Design

Date: October 16, 2026 · Status: **awaiting founder review** · Path: architectural

## 1. What this is

The flagship guide. It does two jobs at once:

1. **The founders' own trip.** Four travellers from DTW, Friday match tickets only. Depart Sept 13 or 14, 2027; return Sept 20 or 21. One round of links golf on another day. Weekend watched from the best place to watch. Trains and buses preferred. Nothing booked yet.
2. **A sellable product for any Ryder Cup traveller**, from any origin and in any ticket situation, with the founders' trip as the worked example.

Success means a stranger can pick how to run the week, and the guide rebuilds itself around that choice from fact-checked research only. The four travellers can book from it and run the trip from their phones.

**Said by Brady (Oct 16):**
- Show all three trip shapes in one framework, with toggles.
- The intro opens on dusk.
- Look: dusk links mainly, with the other two looks "where it makes sense".
- Layout: a tabbed app.
- Signature pieces: a live route map, a trade-off simulator and golf course cards.
- Build the private guide and the public product together.
- Public preview, with the full guide paid.
- Every budget tier shown.
- Car hire only if it is truly best.
- Show the regional airports near DTW.

**Assumed (correct me):**
- The private copy opens on shape C with Friday-only and DTW preset.
- Until checkout exists, the paid guide is shared only with the group.

## 2. Three outputs, one source

```
verified research (verdicts only)
        │  build-data.mjs
        ▼
internal/trip-guides/ryder-cup-2027/data.json  +  plan.mjs (shapes, days, toggles, hand layer)
        │  build-guide.mjs  (event template)
        ├──► PRIVATE GUIDE   Artifact, capabilities {db, user}; preset C / Fri-only / DTW; shared checklist
        ├──► PRODUCT GUIDE   same build, origin-neutral, all toggles open (delivered later as /guide/<token>)
        └──► preview.json ──► PUBLIC PAGE  /ryder-cup-2027 (React route on the site)
```

- **The private and product guides are the same file.** They differ only by a preset block (`preset: { shape, tickets, budget, origin, dates }`) and by whether the shared checklist renders. There is one renderer, so the two can never drift apart.
- **The public page is a React route.** It reads a small generated `preview.json` holding the shape comparison, map geometry and simulator metrics, and contains none of the paid detail.
- **Every build input is cached**, so rebuilds run offline. That covers the map geometry and every number.

## 3. The shape and toggle model

`plan.mjs` gains a `shapes` array. Each shape:

```js
{ id: 'C', label: 'Limerick, then Dublin', bestFor: 'pubs and a Dublin weekend',
  bases: [{ id: 'lim', town: 'Limerick', nights: [...] }, { id: 'dub', town: 'Dublin', nights: [...] }],
  days:  [{ date: '2027-09-14', legs: [...], plan: [...findingIds], watch?: ... }],
  golf:  ['lahinch'],            // ordered course ids that fit this shape's bases
  watch: { sat: findingId, sun: findingId },
  metrics: { moves: 1, transitHours: [5, 7.5], costTier: {...derivedFrom} } }
```

**The toggles.** They sit pinned under the header, and each is a segmented control.

| Toggle | Values | What it changes |
|---|---|---|
| Shape | A · B · C | Days, bases, legs, stay, golf order, watch plan, Book order, map route |
| Tickets | Friday only · Two or more days · None | Match-day blocks, the weekend watch plan, resale guidance |
| Budget | each tier the research supports | Lodging and day-spend ranges, Stay ordering |
| Origin | DTW + regional airports · Any origin | Flight panel (DTW is one labelled panel in the product copy) |
| Dates | Sept 13 – 20 · Sept 14 – 21 | Day list and booking-window dates (private copy only) |

- **Deep links** use bare anchor tokens such as `#shape-b` and `#golf`. Artifacts pass only a plain `#anchor`, so a link can open on a shape and a tab, never on full state.
- **Per-viewer toggle state** lives in `localStorage`, wrapped in try/catch. The page renders correctly without it.
- **A combination the research cannot support says so in plain words** and never fills the gap. For example, a budget tier with no published lodging range for that base.

## 4. The tabbed app

Five tabs, bottom bar on phones, top bar at 1440: **Plan · Days · Golf · Watch · Book.**

**Plan.**
- A scoreboard countdown to the first tee: big numerals, calculated live.
- The A/B/C comparison strip: moves, transit hours (range), nights per place, cost range and best for.
- The trade-off simulator.
- The live route map.
- How to get to Ireland: flights by origin, and the drive-to airports.

**Days.**
- One card per day, styled like a yardage book: cream card, fine ink rule.
- Each leg lists mode, operator, duration range and the official timetable link.
- Each day lists what to do from that day's base, with the drive or transit time.
- Stay sits under each base: the area, what it is like after dark, the lodging tier ranges and the trap.

**Golf.** The yardage-book course cards (section 5c).

**Watch.**
- A scoreboard-style Fri / Sat / Sun board that changes with the tickets toggle:
  - Friday at Adare: getting there by the Limerick Junction shuttle train, gates, what to carry.
  - Sat and Sun: the Limerick fan zone, Newcastle West, and pubs showing Sky Sports.
- Every venue is dated and expires itself (`datedUntil`).

**Book.**
- Every ticket, fare and reservation, ordered by its deadline for the chosen shape.
- Each item carries the official link, the release date and the refund cutoff.
- Before you go: entry rules, Fáilte Ireland short-term let registration, plugs, money.

**Private copy only.** Every card carries a "Booked / Done" mark shared by all four phones (the `marks` collection, keyed by finding id), with a one-line note field.

## 5. Signature pieces

### a. The live route map
- **Canvas.** The Ireland outline is traced from Natural Earth 1:10m (outer ring only, simplified), using the `trace-peru.mjs` method, with one equirectangular projection for the whole canvas.
- **Rail.** The Irish Rail lines actually used are drawn solid, from OpenStreetMap route relations fetched once at build time through Overpass and cached. They are matched by relation ID, never by name.
- **Bus.** The bus links used (for example Expressway and the Ennis–Lahinch 350) are drawn dashed. Their geometry comes from the operator's GTFS where it is published, otherwise as a straight dashed connector labelled "bus".
- **Pins.** Bases, Adare Manor, the golf courses, the fan zones and the airports (DUB, SNN, ORK). Every pin is placed by provenance (the Tivoli rule).
- **Switching shapes animates the route redraw.** Tapping a pin opens its card, and every pin also has an entry in a companion list, which meets the 44px tap rule.
- **Constraints.**
  - Decorative layers get `pointer-events: none`.
  - Reduced motion shows the finished route.
  - The page makes no map requests at runtime.
- **Tooling.** `build-map.mjs` is US-specific (state outlines, OSRM roads), so this needs a new `build-map-ie.mjs` beside it. It should not branch the existing builder.

### b. The trade-off simulator
- **Inputs.** Three sliders: how much golf, how much of Ireland to see, and how much you mind moving.
- **Output.** A score for A, B and C, shown live, with a plain sentence on why the leader leads. For example: "C: one move, Lahinch by train and bus, Dublin weekend."
- **The scoring is open.** It is a weighted sum over each shape's published `metrics`, and a "How this is scored" disclosure shows the weights. There are no hidden numbers, and the metrics are the same ones shown in the comparison strip.
- **Tapping "Use this shape"** sets the Shape toggle.

### c. Golf course cards (yardage book)
One card per course that fits at least one shape. Candidates are Lahinch, Ballybunion, Tralee, Waterville, Old Head, Adare-area parkland options, and the Dublin links for shape C's bookend. Each card shows:
- The visitor rate (display rule pending, see section 9)
- Visitor days and times (for example, Ballybunion takes visitors on weekday mornings only)
- How far ahead to book, and the refund cutoff, dated (Ballybunion full refund until ~Mar 13, 2027)
- **Transit from each base in the current shape**, by train and bus where possible
- How hard a Ryder Cup-week tee time is to get
- The official booking link

Brand status is checked for every club. For example, The European Club is now the Brittas Bay Club, closed until early 2027. Adare Manor is not offered: it is closed to the public for most of 2027.

## 6. The intro

- **The 3D intro becomes a reusable module.**
  - Location: `tools/golf-intro/first-tee.js` plus a small loader.
  - Config: `{ eyebrow, title, sub, mode: 'dusk' | 'dawn' }`. Dusk is the default.
  - Future golf events change only the config and the course constants.
  - Prototype: https://claude.ai/artifact/6rykXMrX6xiqNJ4XRP3aVn
- **Where it plays.**
  - It opens both guides and the public page.
  - It plays once per session and then hands over to the Plan tab with a crossfade into the dusk palette.
  - Skip is always visible.
  - `prefers-reduced-motion` shows one still hero frame.
- **On the site.**
  - Three.js is loaded lazily, only on this route.
  - The bundle cost is measured and reported.
  - On a low-power device (a failed WebGL context, or a frame budget missed over the first second), it falls back to the still frame.

## 7. Look

**Base: dusk links.**

| Token | Value |
|---|---|
| sea-navy ground | `#0E1A22` |
| fairway panels | `#2F4A3A` |
| dusk-gold accent | `#E0A75E` |
| fog-cream text | `#EDE4D3` |

Fonts are the ones the site already loads: Fraunces italic for titles, Inter for body, JetBrains Mono for labels and numbers.

**Borrowed where it makes sense:**
- **Yardage book** for the day legs and golf cards: cream card `#F3EEE2`, ink `#1F2A24`, hairline rules, tabular numerals.
- **Scoreboard** for the countdown and the Watch board: big mono numerals on the dark ground.

**Checks.**
- The palette must be checked against every framework palette before build, and must stay clear of `/outdoors`. It is then reserved for golf events.
- Dark and light modes both work.
- It is phone-first at 390.
- **Nothing imitates official Ryder Cup or Adare Manor branding:** no logos, no trophy artwork, no team colours used as identity.

## 8. Public page `/ryder-cup-2027`

- **Shows:** the intro, the A/B/C comparison, the route map and the simulator.
- **Then a "Get the full guide" panel** describing what the paid guide holds.
- **Until checkout and a founder price exist,** the panel's button goes to `/join`, worded as "Get the guide when it opens". It shows no price and never says "free".
- **Site wiring:**
  - Helmet title and canonical.
  - A `vercel.json` rewrite.
  - Sitemap 0.8, but **`noindex` until Brady approves it live**.
  - Linked from the Bucket List Ryder Cup card.
- **Content rules:** no traveller names, no first-person Lads voice, no insurance, no "free".

## 9. Research still to run (before the data build)

The head-start run is `internal/research/ryder-cup-2027/2026-10-16T15-49/`. Its verdicts: 114 confirmed, 22 corrected, 32 unverifiable.

1. **Region runs, one per place a shape sleeps or plays:**
   - Limerick city
   - Ennis/Clare (Lahinch)
   - Kerry (Killarney/Tralee/Ballybunion)
   - Dublin
   - Each roster: `lads-destination-scout` eat, drink, see and nearbase (ordered by transit time from the base), `lads-stay-neighborhoods` (lodging tiers per base, the biggest gap), and `lads-timing-events` for that week.
2. **A transit run:** `lads-getting-around`, the per-leg rail and bus options and timetables for each shape.
3. **Missing lanes:** `lads-costs-budget` (day-spend tiers), `lads-entry-essentials` (US passport holders, plus the product's other origins as labelled panels), and `lads-rewards-points` (Club-only content).
4. **Re-verification:** a verifier top-up on the 32 unverifiable findings.

**Stagger runs a minute apart** (the Oct 6 hook collision), validate every file, and build only from confirmed or corrected verdicts.

## 10. Honesty rules applied here

- **Only confirmed or corrected findings render.** Unverifiable ones appear only under "Not yet confirmed — check before booking".
- **Third-party costs are ranges** with a source and `checkedOn`. Our own price appears nowhere.
- **Anything time-bound carries `datedUntil` and removes itself** when it passes: flight booking windows, the resale opening, refund cutoffs, fan zones.
- **Every named brand is checked as still operating.**
- **Paperwork never reaches a reader:** the `readerClaim` filter applies.
- **Car hire appears only where it is truly best:** the Ring of Kerry, Slea Head and the Burren. It is shown with the age rules and the IDP note, never as the default.

## 11. Testing

- **`tools/tests/ryder-shapes.test.mjs`:**
  - Every shape covers both date variants night by night with no gaps.
  - Every day's finding ids exist and carry a confirmed or corrected verdict.
  - Every leg has a timetable source.
  - Simulator weights reproduce the documented scores.
  - No point price, no "free", and no traveller name in the built HTML.
- **Playwright click-through at 1440 and 390:**
  - every tab
  - every toggle combination (3 shapes × 3 ticket states × each budget tier)
  - every map pin and companion-list row
  - every simulator "Use this shape"
  - checklist marks shared across two browser contexts on the private copy
  - no horizontal overflow
  - intro skip and the reduced-motion still frame
- **Build checks:** `npm run build` stays clean, and the bundle delta for the public route is reported.

## 12. Build phases (checkpoint commit and push after each)

| # | Phase | Founder check |
|---|---|---|
| 1 | Dispatch the section 9 research runs (background) | — |
| 2 | Shape model + `plan.mjs` + data build; tests | Brady checks the three shapes' days |
| 3 | Event template: tabs, toggles, Days/Watch/Book, look | Phone review of the private copy |
| 4 | Map (`build-map-ie.mjs`), simulator, golf cards | Review |
| 5 | Intro module extracted and wired in | Review |
| 6 | Private guide published to the group | Group uses it |
| 7 | Public `/ryder-cup-2027` page (noindex) | Brady approves live |

**Branch:** `feature/ryder-cup-2027`, cut from `feature/gorge-ridge-trip`, which holds the trip-guide tooling and is not yet merged. That branch should merge through `/ship` first, with its CLAUDE.md record in the same push.

## 13. Founder rulings needed

1. **Golf visitor rates.** Clubs publish one exact 2027 visitor rate (for example, Lahinch EUR 500). The money rule says ranges only, and the exception covers government fees only. **Recommendation: allow a club's own published visitor rate, exact, with source and `checkedOn`, as a third exception.**
2. **Price and checkout for the paid guide.** Deferred to the December pricing decision. Nothing ships with a price until then.
3. **Pubs showing Sky Sports.** Name specific pubs (researched, unendorsed, no affiliate), or describe how to find one?
