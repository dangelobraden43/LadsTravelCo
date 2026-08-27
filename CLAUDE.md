# THE LADS TRAVEL CO. — CLAUDE.md
## Last Updated: August 27, 2026 (queue dated Aug 27 — Aug 26 was a no-op day)

---

## STATUS

Live: ladstravel.com (Vercel, auto-deploy on push)
Vercel fallback: lads-travel-co.vercel.app
Repo: dangelobraden43/LadsTravelCo
Stack: React + Vite, React Router, Three.js (react-three-fiber)
Email: brady@ladstravel.com (Google Workspace active)
Posture: PREVIEW — paid services launch Fall 2026.
Structure: LLC. No charity, no nonprofit, no "free" anywhere on site.
Frameworks: 9 React destination routes (no static flagships)
Peru completed. Ford started May 18.
LIVE: `/good-news` — full MIDWEST map (MN·WI·MI·IL·IN·OH), three pin
  tiers (roots anchors · city context · airports). Unlinked from nav,
  `noindex`, reachable by URL. Phases 1–3 done; Phase 4 pins pending
  Dawson's data. See MIDWEST MAP RUNWAY + TOMORROW'S QUEUE.
LIVE: `/privacy` + footer affiliate disclosure.
AFFILIATES: **VIATOR-DIRECT ONLY** (company Viator Partners account).
  Link format is PINNED from real dashboard links — append
  `?pid=P00297284&mcid=42383&medium=link` to a Viator PRODUCT url. Use
  `viatorLink()` in `src/utils/affiliate.js`; it is idempotent and
  refuses to tag non-Viator hosts.
  ⛔ **Travelpayouts was REMOVED Aug 25** — its programs denied us. Its
  site-wide script (which was running an AD layer, not just attribution)
  is gone. Do not re-add it.
  ⛔ **GetYourGuide is DEAD** — we only ever reached it via Travelpayouts.
  The 2 remaining `gyg.me` links (Wicklow, Pompeii) are live but earn
  nothing; they await Viator equivalents. Do not delete them yet.
LLC: **FILED** (confirmed Aug 24). The pitch-deck slide-3 claim is now true.
DONE: Scenic Shore ride happened July 25–26, 2026. Table run, crewnecks
  sold in person. The 5-product seal line is STILL DRAFT/$0.00 and was
  never published — see SCENIC SHORE below.

---

## SCENIC SHORE MERCH (June 30, 2026 — separate venture, Shopify)

Charity merch for the **Scenic Shore bike ride, July 25–26, 2026
(Mequon, WI)** — Brady + Dawson ride; proceeds support **Velo Palmetto BCU
(Blood Cancer United)**. NOT part of ladstravel.com — it is a Shopify line
in **The Lads Travel Company** store (myshopify domain `ui5imc-dy`,
primary domain `ladstravel.myshopify.com`). The Lads' charity-off-the-site
rule governs the website, not this separate storefront.

**THE RIDE HAPPENED — July 25–26, 2026.** Table run, crewnecks sold in
person. The 5-product seal line below was **never published** and is
still DRAFT at $0.00. What actually sold is the separate ACTIVE Printify
catalog in the same store. The old runway (mockups → prices → cause copy
→ publish) is moot for the event; open question is whether the seal line
gets retired, repriced for evergreen sale, or left dark.

The `scenic-shore` collection was **deleted Aug 17** (its 5 products
survive as drafts). The live collection is **"The Lads Travel Company
Scenic Shore 2026"** (`521287336218`).

Built June 30 (all DRAFT, $0.00 placeholder prices, NO proceeds/cause
copy — those need Brady's explicit sign-off):
- **Brand:** premium "travel club" aesthetic (ref **Dandy Worldwide**).
  Logo = the **Seal** (gold double-ring crest, arched SCENIC SHORE,
  sun-on-horizon, EST 2026). Co-brand "✦ by The Lads" (real globe mark,
  kept subtle). Brand sheet / lookbook / storefront comps + **print-ready
  files** in `C:\Users\brady\OneDrive\Desktop\scenic-shore-mockups\`.
- **5 DRAFT products** in the collection: Tee (6 colors × S–XXL = 30
  variants; Product 10296105894170), Cap (Sand/Navy), Bottle (Steel/Navy),
  Mug (White/Navy), Tote (Natural). SKUs `SS-…`.
- Full status + Shopify gotchas in memory **`project-scenic-shore`**.

HARD RULES (real charity commerce): never publish, set prices, or state any
proceeds/cause claim without Brady's explicit per-step sign-off. Product
renders so far are **vector mockups (the ceiling)** — real photographic
images come from **Printify's mockup generator** (Printify is NOT an MCP
connector; it is Brady's manual admin).

Shopify MCP gotcha: connector shows "Connected" but tool calls can return
`token expired`. Fix that worked — be signed into Shopify in the browser as
brady@ladstravel.com FIRST, then `/mcp` authorize, then call immediately.
Images: `stagedUploadsCreate` → POST bytes to GCS → `productCreateMedia`
(create-product `images` URLs fail; staged URLs are private).

---

## BIG DAY TOMORROW (July 1, 2026 — Scenic Shore: polish + order samples + go sellable)

GOAL: team merch samples ordered + a full array of products ready to sell.
🧍 = Brady (admin / payment / approvals)   🤖 = Claude can do via Shopify MCP

1. 🧍 **Connect Printify** to the Shopify store (no MCP — manual).
2. 🧍 **Upload the print-ready files** (`print-front-light/dark.png`,
   `print-back-dark.png`, Desktop) into Printify; choose blanks for
   tee/cap/bottle/mug/tote and place the seal + back art.
3. → Printify **auto-generates real photographic mockups**.
4. 🤖 **Swap those real mockups onto the Shopify products** (replace the
   placeholder vector images) once they sync.
5. 🤖 **Set prices** — Brady gives numbers per product (no invented prices).
6. 🤖 **Place the exact cause/proceeds wording** — Brady brings the
   literally-true BCU line. THE approval gate.
7. 🧍 **Order team samples** (Printify sample order — payment).
8. 🤖→🧍 **Publish** the collection live on Brady's explicit go.

BRING TOMORROW (Brady): Printify login + payout set · price per product ·
exact proceeds wording · team sample sizes/colors · ship-by math vs
July 25–26 (POD ~1–2.5 weeks, so order samples ASAP).

---

## WHAT WAS BUILT (August 27, 2026 — pins, Peru data, paused mid-session)

**Session PAUSED by Brady mid-afternoon; resuming later today.** 4 commits
shipped. Aug 26 was a no-op day (zero commits) — the whole Aug-26 queue was
still outstanding when this session opened.

**Shipped** (`2acea81`, `3f5a093`, `b701cd7`, + this):
- **`src/data/peru.js`** — 10 day anchors from camera-EXIF GPS provenance.
  The Peru map had NO data file at all. See PERU below.
- **`bookingEndorsed`** — booking endorsement split from `ladsRating`.
  `const endorsed = Boolean(trip.ladsRating) && trip.bookingEndorsed !== false`.
  Absent = unchanged; `false` = neutral CTA but KEEPS the rating chip;
  `true` deliberately cannot manufacture a claim where no rating exists.
  Applied to **Kilkenny** (live gyg.me link, now neutral) and **Blue
  Mountains** (no `bookingUrl` yet, so prospective — it fires when a link
  is wired). `bookingUrl` re-verified as rendering at exactly ONE place.
- **`src/MapPins.jsx` + `MapPins.css`** — the reusable pin layer. Knows
  nothing about the Midwest: places, `project(lat,lng)`, panel state and
  icons all arrive as props, so the Peru map inherits it directly.
  All 17 Bruce places render **copper**, which is CORRECT — the
  visited-split still has not been supplied and no flag was flipped to make
  the map look better. Declustering follows the airport pattern: marker
  stays on the TRUE coordinate, glyph pushed onto a ring with a leader
  line, so a pin never lies about position.
- **`midwestGeo.js` is PURELY ADDITIVE** — 30 insertions, 0 deletions,
  verified by `--numstat`. The projection is structurally untouched; every
  ring, PLACE, AIRPORT and ROUTE_PATH is byte-identical. The transform had
  only ever existed inside `tools/trace-midwest.mjs`, so there was no way
  to put lat/lng on the canvas; it is now exported as `PROJECTION` +
  `project(lat, lng)`. **Mind the argument order** — `(lat, lng)`, because
  data files store lat first while the tracer's internal one is GeoJSON
  `(lon, lat)`.

### 🔑 EVERY FILE IN `src/data/` BECOMES A BUNDLE CHUNK — found Aug 27

`src/App.jsx:501` does `import(\`./data/${f.slug}.js\`)`. A template-literal
dynamic import cannot be statically resolved, so Rollup emits a **separate
lazy chunk for every file in `src/data/`** — confirmed: `peru`,
`brucePeninsula` and `michigan` all have chunks in `dist/assets/`, though
`FEATURED` only ever fetches dublin/spain/rome at runtime.

So a new data file is **not** free and **not** truly inert. It is a lazy
chunk no visitor downloads (peru = 2.57 KB gzip), which is harmless — but
do not claim "imported by nothing." `dist` holds at **40 MB**.

### PERU — data foundation only, NOT a published framework

`peru.js` is day anchors, nothing more. No route in `main.jsx`, no
`vercel.json` entry, no Globe pin, and **no change to 219/13/10/3**. Day
anchors are not spots and must never be counted by the live-walk counter.

**🚩 THE MANIFEST'S TREK DAY LABELS ARE OFF BY ONE.** May 7 is labelled
"Salkantay day 1" but sits at `-13.86,-71.30` — ~150 km from every other
trek day (which cluster between -72.53 and -72.66) and matching **Vinicunca
/ Rainbow Mountain** to ~0.01°. Independently, `SystemSection.jsx:436`
records the pre-trip intent as "Salkantay Trek, Rainbow Mountain". So May 7
was a Rainbow Mountain day trip and Salkantay proper starts May 8.
Coordinate kept verbatim, caption withheld pending Brady.

**Paracas is not supported** by the day-4 coordinate (~50 km away);
Ica/Huacachina is, and agrees with Brady's own /outdoors prose.
**Brady confirmed Aug 27:** the Islas Ballestas boat tour DID happen — a
Lima day tour before Cusco. Firsthand, so it may be named; it still has no
coordinate, so it stays unpinned and is not a waypoint.

Humantay Lake and the Salkantay Pass are named in Brady's validated prose
but have **no coordinate in the manifest**, so they are deliberately not
pins. Geocoding them from the name would break the Tivoli rule.

---

## WHAT WAS BUILT (August 25, 2026 — partner purge, the Bruce, Ontario)

**11 commits — ALL SHIPPED to production. Nothing is pending `/ship`.**
Verified Aug 27 by commit count, not by memory: `git log --since=2026-08-25
--until=2026-08-26` returns 11; working tree clean, `main` == `origin/main`.
(The last two, `b6b273a` + `aee5d40`, are the docs close-out and the Peru26
prep record — both pushed.)

**First push** (`9b6b9ce`, `718fe98`, `d527d32`):
- **Travelpayouts purged.** The `tpembars.com` loader in `index.html` was
  the source of the Aug-17 ad-layer flag (`emerald monetization`,
  `link_switcher`, the failing doubleclick call). Deleted; the
  `/privacy` entry went with it. Attribution now rides in link URLs.
- **A World Nomads travel-INSURANCE affiliate link** was still sitting in
  `src/utils/affiliate.js` — a direct hard-rule violation that survived
  the Aug-17 deletion pass. Gone, along with Airalo/Booking.com entries
  using invented `ladstravel` IDs we never held.
- 🚩 **`"priceRange":"Free"` was still in the homepage JSON-LD.** May 31
  killed "free" from visible copy but missed the structured data — the
  part Google actually reads. Removed (no substitute; preview = unpriced).
- 🚩 **All three meta descriptions claimed "285+ spots / 12 frameworks".**
  Canonical is 219/9. That is the text search results and link previews
  render. Fixed.
- **`viatorLink()` rebuilt** against real links. The old one read
  `VITE_VIATOR_AFFILIATE_ID`, which was **never set in `.env.local`** —
  it would have shipped untagged links that looked right in review.
  Params are hardcoded now (they are public and account-level).
- **Cliffs of Moher + Montserrat** wired through the partner account.
- **Paris sticker pulled from `/shop`** — see PRINTIFY DEFECT below.

**Second push** (`7a8da65`, `3ecd0de`, `50d694e`, `9fe4dfc`):
- **17 Bruce Peninsula places geocoded** → `src/data/brucePeninsula.js`.
- **108 dead images deleted** — `dist` 53 MB → **41 MB**.
- **Ontario renders** — the long-standing blocker is solved.
- `Peru26/` gitignored (225 files, 932 MB of raw media never enters git).

**Late** (`0d96f4e`, `7555098`):
- 🚩 **`dist/bundle-report.html` was being deployed.** `rollup-plugin-visualizer`
  wrote it into `dist/`, so every deploy published 368 KB laying out the
  entire internal module structure, dependency weights and file names at
  `ladstravel.com/bundle-report.html`. Nothing linked to it; it is a local
  build artefact, not a page. Moved to `.bundle-report.html` at the repo
  root and gitignored — still generated every build, still there for
  `/perf`, just not shipped. `dist` 41 MB → **40 MB**.
- The Aug 26 queue itself.

### 🔑 THE MAPS-LIST BLOCKER IS LIFTED — this changes the workflow

The Aug-17 note said `maps.app.goo.gl` links "carry no place data." That
is true for `curl` (you get a generic Maps shell). But the **Playwright
browser is signed in as brady@ladstravel.com**, so it IS the list owner
and renders them fine. **Paste a Google Maps list link and it can be read
directly.** No more "paste the contents as plain text."

Better still, coordinates should come **by provenance, not by search**:
click the saved place and Google puts its real lat/lng in the URL as
`!3d<lat>!4d<lng>`, plus a stable Place ID. This is how all 17 Bruce
places were geocoded, and it is why generic names (Grotto, The Sweet
Shop, Crowsnest, Torched, Bad Apple) were safe — we never resolved a
string. **The Tivoli rule is satisfied by provenance.** The list panel
sits in a subframe, so page-context `evaluate` cannot see it; use
`browser_run_code_unsafe` with Playwright-level locators.

### Ontario — SOLVED (`50d694e`)

Neither source works alone, in **opposite** directions:
- The **political** boundary runs through the middle of the Great Lakes
  (all of Georgian Bay, half of Huron) → paints land over water.
- Natural Earth's **land** layer is "everything that is not ocean", so
  mid-Lake-Huron tests as land too, and degenerates to a rectangle here.

So the old README note — "just needs a land/coastline source" — was
**wrong**; a land source alone reproduces the same bug. The fix is both:
political boundary for real inland edges, lakes punched out via
`fill-rule="evenodd"`. **Georgian Bay is a separate Natural Earth
feature** — miss it and the peninsula's whole east side becomes land.

367 pts / ~5 KB, AOI-scoped (full-canvas would be ~22.9 KB of mostly
hidden lake outline). **Projection untouched — structurally, not by
promise:** bounds come from the six US states, clipping runs after, so
`midwestGeo.js` is byte-identical and no route needed re-fitting.

### PRINTIFY DEFECT — the Paris sticker (needs Brady, manual)

The `/shop` card was not wrong; it matched Shopify exactly. **All 4 media
have a transparency checkerboard rasterized into the artwork** — flat art
AND all three Printify lifestyle mockups. Printify composites the real
print file, so a buyer receives a sticker with a printed grey grid.
**Still ACTIVE and purchasable on Shopify at $6.99** (Brady's call — only
the site card was pulled). Fix is a Printify re-export with real alpha.
It IS genuine Lads art ("LADS TRAVEL CO. / PARIS") — rename to **"Paris
Sticker"** when it returns, alongside the Barcelona and Prague stickers.

---

## WHAT WAS BUILT (August 17, 2026 — big session: commerce, trust, the map)

**5 production deploys, all verified live.** Branch history reconciled;
`main` is now the single branch.

**Commerce.**
- Shopify store curated **28 → 11 active**: $999.99 calendar drafted,
  5 joke-price test SKUs archived, the "Loads Travel Co." typo product
  archived, `scenic-shore` collection deleted, storefront homepage
  repointed off a **$0.00 draft** onto the real crewneck. Those 6 test
  products were the ONLY ones published to all 4 channels — including
  Google Shopping. Closed.
- **`/shop` shipped** (`268f8bc`) — 7 real products linking OUT to
  Shopify. Every price/image/URL pulled live from the store. Pre-flight
  confirmed the storefront is genuinely public (no password gate) before
  building a page of links to it. Sticker renamed in Shopify to
  "Lads Travel Co. Sticker — Kiss-Cut Vinyl Decal" (handle unchanged).

**Revenue plumbing.**
- **Travelpayouts live + verified** (marker `563356`, PayPal set),
  shipped isolated (`cc951ea`) so the WIP map didn't ride along.
- **Endorsement gradient** (`77860a7`): `ladsRating` present → gold
  "WE DID THIS"; absent → neutral "Book this tour". Driven off the data
  so it applies itself to every link, present and future.
- Link worksheet for the 12 approved day trips at
  `internal/brady/affiliate-link-worksheet.md` (gitignored).

**Trust.**
- **`/privacy` shipped** (`706ab16`) — 10 disclosed third parties,
  including Vercel Analytics and Google Fonts which were NOT on the
  original list but are in the code. Footer affiliate disclosure.
- Clarity de-duped — it was initialising twice (inline + npm package).

**The map** — `/good-news`, Phases 1–3:
- Michigan → **6-state Midwest**, 8,831 raw pts → 1,200, one shared
  projection (`be00339`).
- Routes converted from hand-tuned control points to **real lat/lng
  waypoints** + Catmull-Rom, so they re-fit themselves.
- Anchors + story panels + city context (`ec7fa96`); 9 airports with
  leader-line IATA chips and the Aviasales slot pre-architected
  (`a9f66f7`).
- Geometry pipeline committed to `tools/` with clipping (`81f2a50`).

**Bugs found and fixed** (several pre-existing):
- **`/michigan` served a completely blank page** — `logistics: null`
  dereferenced unguarded threw during render and unmounted the whole
  tree. Guarded + honest placeholder, and a **route-level error boundary
  added** so one bad field can never blank a page again (`78648b0`).
- **Mobile nav** was broken site-wide — the existing `@media` rules had
  NEVER applied because inline styles outranked them (`21915bd`).
- Cost table overflowed the page body on mobile (`15cbf32`).
- `.sr-only` was defined only in LocalPage.css, so hidden headings
  rendered as visible text on `/shop`.

**Three catches worth remembering:**
1. GetYourGuide returns **Copenhagen** for "Tivoli" — a Rome-page link
   would have sent readers to Denmark. Hence the disambiguated worksheet.
2. Ontario's political boundary **includes the Great Lakes**, so it
   renders as land over the water. Needs a coastline source.
3. `maps.app.goo.gl` links resolve to an authenticated list ID that only
   the owner can read — they carry no place data.

---

## WHAT WAS BUILT (June 30, 2026 — "Good Brews · Good Views · Good News" Michigan map)

Big build session. New immersive, illustrated Michigan road-trip map.
Followed the superpowers sequence (brainstorming → writing-plans → phased
execution with a report + STOP between every phase). Spec/plan at
`docs/superpowers/plans/2026-06-30-good-news-michigan-map.md`.

**Posture: SELF-CONTAINED + UNMERGED.** Lives on its own `/good-news`
route, all in `src/GoodNews.jsx` + `src/GoodNews.css`. On the `michigan`
branch ONLY — NOT merged, NOT pushed, `main` + live site untouched.
The only files outside GoodNews.* are a one-line lazy route in
`src/main.jsx` and a one-line `/good-news` rewrite in `vercel.json`
(both branch-only, trivially revertible). `/michigan` is the EXISTING
brewery/golf framework — do NOT collide with it; the new map is `/good-news`.

Two commits this session:
- `d5e803c` — rough hand-authored blob silhouette + 4 routes (Phase 1).
- `c391836` — geo-traced silhouette + de-tangled routes (CURRENT). This
  is the banked "tonight's win."

**What's BUILT (Phase 1 + tracing pass only):**
- Accurate Michigan silhouette traced from real state boundary GeoJSON
  (glynnbird/usstatesgeojson — Michigan). Two largest polygons kept (LP +
  UP), islands dropped, Douglas-Peucker simplified HARD (LP 1674→130 pts,
  UP 2056→170 pts ≈ 300 total), equirectangular-projected (lat0 44.58°)
  into `viewBox="0 0 1000 880"`. Reads instantly as Michigan — mitten,
  thumb/Saginaw Bay, true UP form, real Mackinac gap at the Straits.
- 4 routes drawn as REAL SVG `<path>` elements, VEHICLE-READY (a draggable
  car rides them next via `getPointAtLength()` — no vehicle yet):
  · Route 1 **West Coast** (teal, LIVE/validated) — New Buffalo→Kalamazoo
    →Grand Rapids→Traverse City.
  · Route 2 **Up North** (orange, LIVE/scouted) — Ann Arbor→UP, bridging
    cleanly at the Straits (no UP overshoot).
  · Route 3 **Motor City** (magenta, PROPOSED/dashed) — Detroit·Corktown.
  · Route 4 **Harbor & Greens** (green, PROPOSED/dashed) — Harbor Country
    + golf country; de-tangled from West Coast on the west side.
- Shared `PLACES` + `AIRPORTS` coordinate table = real city lat/longs
  projected through the SAME transform, so every point sits on the true
  coastline. This is the single reference frame for routes/anchors/pins.
- Styling (signature asset): water radial gradient, land depth-shadow,
  coastline stroke, soft glow on the two live routes, dashed = proposed.
- Verified at 1440 + 390 via Playwright; `npm run build` clean; bundle
  ~7 KB raw / ~3 KB gzip (own lazy chunk).

**Organizing model decided — Option C (NOT a toggle system):** one
unified map; "Good Brews · Good Views · Good News" is the hero
framing/banner over it. Brews = breweries/HOP/happy hours · Views =
golf/fall colors/lakeshore/UP · News = Aug–Oct events (lead) + the
lighter human/campus story. Do NOT build filter states.

**HONESTY RULE applied (Brady's standing rule):** breweries + golf use
real `michigan.js` data; events / HOP-passport / live-flight-prices are
HONESTLY-LABELED PLACEHOLDERS, never fabricated. No invented event
names, dates, or prices.

**Placeholder label — RETIRED Aug 17:** the old spec said label pending
data "coming — validated August." It IS August and the validation trips
already happened, so that label is now self-contradicting. Use
**"Dawson's UP picks — loading in"** (or the equivalent for whichever
data is pending), never a month that has already passed.

---

## MIDWEST MAP RUNWAY (what's next — now on `main`)

The traced Michigan foundation is banked and merged. It is being
EXPANDED to a full Midwest regional map: WI · IL · IN · OH · MN · MI,
re-traced from the same state GeoJSON source, same simplify-hard
approach (~150–300 pts/state), one shared projection + viewBox, with
the 4 existing routes re-fitted.

Build sequence (each its own report+STOP phase per Brady's rule),
spec'd in the plan doc above:

- **NEXT SESSION → Phase 2:** university anchors + ONE shared dismissible
  story panel. GVSU/Grand Rapids (Brady): Padnos International Center,
  Seidman College of Business, Honors College, GR = "Beer City USA."
  Kalamazoo College (Dawson): football + broadcasting career, campus.
- **THEN Phase 3:** clickable airport icons → "flight prices coming
  soon" panels (API-ready structure, NO API yet). Now the MIDWEST set,
  minimum: DTW · GRR · ORD · MDW · MKE · MSP · IND · CLE · CMH.
  **ARCHITECT FOR TRAVELPAYOUTS (decided Aug 17):** Travelpayouts is
  live and verified, and its flight side (Aviasales/WayAway) is the
  likely source of BOTH the real price data and the revenue on these
  panels. Build the panel as a slot that can later host either an
  embedded flight-search widget or affiliate deep links — keep the
  airport record carrying an IATA code and an optional `searchUrl`, and
  do NOT hard-code static price copy that a widget would have to
  replace. No widget in Phase 3; just don't paint us into a corner.
- **THEN Phase 4:** pin SYSTEM — unique icon per type (brewery / golf /
  view / event / hidden gem), click + hover detail cards. REAL pins only
  where real data exists. Pins ingest a NORMALIZED INTERMEDIATE
  (`name, lat, lng, type, note, source`) so Dawson's Google Maps list
  exports drop straight in. Pending data is labeled "Dawson's UP picks
  — loading in", never a past month.
- **THEN:** the "Good Brews · Good Views · Good News" banner + framing.
- **LATER (own sessions):** draggable vehicle on the routes
  (`getPointAtLength` ready) · real live-flight-price API · real Aug–Oct
  events data · polish nits (bolder magenta Motor City loop; mobile
  vertical centering) · homepage-placement decision (2nd hero vs.
  embedded link — decide once the map is fuller).
- **TRIP DEPENDENCIES — BOTH TRIPS ARE DONE (as of Aug 17):** Brady's
  Route 1 drive (July 10–11) is COMPLETE. Dawson's Route 2 / UP scout
  (July 4) is COMPLETE. **Validation data exists now.** Dawson's UP
  picks live in Google Maps lists — Brady supplies the export or share
  link; until then the UP pins are honestly labeled as loading, not
  invented.

---

## WHAT WAS BUILT (August 13, 2026 — Midwest-build session prep)

Branch `midwest-map`. Two content agents (retire + outdoors) ran in
parallel, then a numbers-propagation barrier.

1. **Fully retired `thailand` + `charleston`** — dropped from `/global`
   list, The List event, `/local` Charleston card, Globe pins, `main.jsx`
   routes, `vercel.json` rewrites, and every dead link across
   NorthAmericaSection / SystemSection (quiz repointed to `/spain`) /
   WhenPage. Data files **preserved** in `retired/` (git mv, not deleted)
   for possible revival.
2. **Recomputed canonical totals** across all derived surfaces (Globe
   caption, DataSpectacle, System section, `/global` hero):
   `248→219 spots · 15→13 cities · 11→10 countries · 4→3 continents`.
   Asia dropped (Thailand was the only Asian framework). Personal founder
   bios keep "20+ cities, 4 continents" — travel history, not framework
   coverage; the two are never blended.
3. **/outdoors buffed** — validated Salkantay→Machu Picchu block expanded
   with the real trek arc + stat chips; **Bruce Peninsula** added as an
   on-the-board (copper/research) card, no validation claim.
4. **Tooling** — custom skills modernized to React+Vite; Parallel Agent
   Workflow section added (see bottom).

Open follow-ups: `/audit-all` command still lists retired frameworks +
omits michigan; `/thailand` `/charleston` have no redirect/404 route
(Vercel 404s in prod; blank shell if typed in-SPA).

---

## WHAT WAS BUILT (June 7, 2026 — Globe pin data + homepage stats unification)

Two commits, both shipped to ladstravel.com via fast-forward push to main.

1. `ce8093e` — `fix(globe): derive pin counts from canonical data + add Michigan + research/validated split`
   - `src/Globe.jsx` was hardcoded with `CITIES.n` values summing to 545 (Sydney 123,
     Barcelona 115, etc.) and 5 validated cities (Reykjavik, Munich, Krakow, Bangkok,
     Charleston) sat at `n: 0` and rendered as tiny indistinguishable pins.
   - Now: each pin's count is derived programmatically from `src/data/*.js` at module
     load. Same walker as App.jsx's Featured Work `countSpots`, bucketed by city/area.
   - Attribution rule: every framework spot maps to exactly one pin. Sub-cities with
     their own pin (Galway, Madrid, Tasmania, Vienna) take their bucket; everything
     else (untagged, sub-regions without pins, the framework anchor) folds into the
     framework's PRIMARY pin. Drift-proof — Globe always agrees with the data files.
   - Added pins: Madrid (Barcelona→Madrid arc now lands on a real pin) and Michigan
     (anchored at Grand Rapids).
   - Added `validated` flag. Research-only cities (Costa Rica, Vancouver, Chicago,
     San Juan, Seattle, Smoky Mtns, Phoenix) render in copper at a uniform small
     size with no count; tooltip reads "Explored · framework coming." Cusco
     comingSoon tooltip updated from stale "Coming May 2026" → "Coming soon."
   - Sizing: `MAX_SPOTS` is the new top (Barcelona at 30). Formula
     `0.020 + (n/MAX_SPOTS) * 0.016` keeps Tasmania (3) visible and caps Barcelona
     at 0.036. Research/comingSoon pins uniform at 0.014.
   - Default labels (`showLabel`) extended to Reykjavik + Michigan in addition to
     the original five (Sydney, Barcelona, Rome, Dublin, Prague).
   - Bundle impact: ~0 KB net — the 11 framework data files already exist as their
     own chunks (built for FrameworkPage); Globe references the same chunks behind
     its existing lazy boundary.

2. `0aae698` — `fix(home): unify spot/city stats to 248 / 15 validated across homepage`
   - The Globe fix landed correct counts on the globe (15 gold pins summing to 248),
     but the homepage still showed three competing totals in one scroll:
     DataSpectacle 226/21, Globe caption 21/226, System section 226/21.
   - Aligned every on-screen total to the live-walk method:
       DataSpectacle big counter:      226 → 248
       DataSpectacle cities counter:    21 → 15
       Globe caption:  "21 CITIES · 4 CONTINENTS · 226 SPOTS"
                    → "15 VALIDATED CITIES · 4 CONTINENTS · 248 SPOTS"
       System description: "226 spots. 11 countries..." → "248 spots. 11 countries..."
       System stat card VALIDATED SPOTS: 226 → 248
       System COUNTRIES card sub: "4 continents. 21 cities." → "4 continents. 15 cities."
   - Verified `11 countries / 4 continents` against the framework data files:
     Ireland, Spain, Italy, Australia, Iceland, Czech Republic, Austria, Germany,
     Poland, Thailand, USA — spread across Europe (8), Oceania, Asia, North America.
     11 frameworks == 11 distinct countries is a coincidence (Germany shared by
     prague + munich, USA shared by charleston + michigan, prague contributes
     three countries by itself).
   - The "21 cities mentioned in data" stat is retired in favor of "15 validated
     cities" — reproducible and matches the gold globe pins a visitor can count.

---

## WHAT WAS BUILT (May 31, 2026 — Rebrand session)

Single long session, 14 commits on the `rebrand` branch.
Nothing on `main` yet — push at end of session via /ship.

1. `chore(rebrand): remove /story route` — origin-story narrative retired.
   StoryPage.jsx/.css deleted, nav item + hero link + SPA rewrite gone.
2. `chore(mcp): wrap local servers with cmd /c for Windows` — fixes the
   four local MCP servers that fail without a cmd shell on Windows. Takes
   effect on next Claude Code restart.
3. `chore: gitignore Playwright cache, audit screenshots, loose Jordi PNGs`
4. `feat(routing): introduce four-collection nav + redirects` — nav drops
   from 6 items to 4: **Global · Outdoors · Bucket List · Local**.
   Redirects: /explore → /global, /adventure → /outdoors, /plan → /,
   /story → /. /when /lads /gift/michigan remain reachable, out of nav.
5. `feat(footer): add site-wide Footer` — Follow Along + The Lads moved
   from nav into a new Footer.jsx + Footer.css. Three columns under brand
   mark: Explore (collections), Follow Along (IG/TikTok/YouTube
   placeholders), The Lads (#team anchor + brady@). Wired into App,
   ExplorePage, AdventurePage, WhenPage, LadsPage, FrameworkPage.
6. `feat(collections): build /outdoors page` — hero "Where the trail
   starts.", three-rung Ladder, Salkantay validated block, coming-soon
   trio (TMB/EBC/Kilimanjaro).
7. `feat(collections): build /bucket-list page` — hero, four event cards
   (Vivid Sydney HAPPENING NOW → /australia, Oktoberfest 2026 → /munich,
   Centenary Ryder Cup 2027 → /dublin, European Christmas Markets), each
   linking to existing city frameworks. Italic "calendar view coming" line.
8. `feat(collections): build /local page` — hero "Closer than you think.",
   two cards (Michigan, Charleston) linking to existing routes.
9. `refactor: remove charity/donation surfaces site-wide` — -1101 lines.
   Deletes GivingBackFooter.jsx/.css and HoodieMockup.jsx (orphaned),
   strips cause render block + cause data field from all 4 WhenPage
   seasons, removes giving-back-* dead CSS from index.css.
10. `copy(hero): rewrite homepage hero for Fall 2026 preview posture` —
    badge `PREVIEW · LAUNCHING FALL 2026`, H1 "Step into your" /
    *comfort zone.*, lede "AI guesses. We know. Built by friends who've
    actually been there."
11. `copy: kill remaining 'free through 2026' messaging` — PlanPage,
    GiftPage, LadsSection (2 spots), SystemSection. Also fixes a latent
    react-hooks/set-state-in-effect error in SystemSection.jsx by
    deferring the setCount via Promise.resolve().then().
12. `refactor: remove Vegas-Zion-Rise + Jordi flagships` — -2546 lines.
    Deletes public/jordi.html, public/vegas-zion-rise.html, root
    jordi.html. Removes the homepage Featured Work block and the dupe
    on /global. Removes VEGAS_PROOF card from /bucket-list (bucket-list
    is now thin: hero → events grid → calendar line). vite.config sitemap
    drops both static slugs and adds the four collections.
13. `feat(lads): Jordi as Lads' first international partner` — adds a
    small PARTNERS subsection in LadsSection between the Founders grid
    and 20 Days build callout. Two sentences, mono eyebrow, Fraunces
    italic name + sans role, body. Distinct from founder cards.
14. `feat(home): new Featured Work — Dublin · Spain · Rome cards` —
    new section in App.jsx. THE WORK eyebrow + *Real frameworks. Real
    places.* H2. Three cards in collection card style (4:5, single
    gold accent). Live spot counts pulled at mount via dynamic import
    of each data file: Dublin 37, Spain 38, Rome 27. Fallback constants
    34/33/24 if import fails.

---

## WHAT WAS BUILT (earlier sessions — condensed)

**May 22, 2026 (Session 6)** — Routing cleanup deleted 11 static HTML
duplicates from public/; stat consistency pass landed 226 spots / 11
countries / 21 cities / 4 continents; Featured Work moved to position 2;
Pass B engine spec written at docs/framework-pass-b-spec.md (now
dormant); /story route shipped (REMOVED tonight).

**April 16, 2026 (Sessions 5 + 5.5)** — vegas-zion-rise.html and
jordi.html shipped as static flagships (BOTH DELETED tonight). SEO
foundation: Microsoft Clarity wbqqkbsekh, JSON-LD on every framework,
canonical URLs, sitemap. Globe atmosphere shader rewrite (gold sun-ball
fix). Critical Vercel SPA routing fix — explicit per-route rewrites
because cleanUrls: true was 404-ing direct hits.

**April 10–15, 2026** — React + Vite migration from inline Babel.
Bundle: 59MB → 5.5MB (90.6% reduction). Five-spoke architecture
established (now superseded by 4-collection IA). 3D globe (Globe.jsx),
3D depth hero, GSAP + Splitting.js. Airtable sync pipeline. Google
Workspace email live.

---

## PLATFORM VISION

**Four-collection IA** (since May 31, 2026):

| Collection | Path | Contains |
|---|---|---|
| **Lads Global** | `/global` | International frameworks (Dublin, Spain, Rome, Iceland, Prague, Australia, Munich, Poland) |
| **Lads Outdoors** | `/outdoors` | Treks/hikes — Ladder concept (Base Camp · Multi-Day · Expedition). Salkantay is the first validated trek. |
| **Lads Bucket List** | `/bucket-list` | Events/festivals/sports/holidays (Vivid Sydney, Oktoberfest, Ryder Cup '27, Christmas Markets). Calendar view planned. |
| **Lads Local** | `/local` | Domestic + close-to-home (Michigan). Engineered the same as international. |

Footer carries: Follow Along (socials, blog later), The Lads (team),
brand mark. Everything else in nav is dead.

---

## DATABASE

Source of truth: Airtable base
Sync command: `npm run sync` (pulls Airtable → src/data/)
Export command: `npm run export` (src/data/ → CSV)
Build: `npm run sync:build` (sync + build together)

**Canonical site-wide totals (August 13, 2026)** — used by Globe pins,
Featured Work cards, DataSpectacle counters, Globe caption, and System
section. Single source of truth: the 9 `src/data/*.js` files. Method:
live-walk (any object with `name` AND `description|notes` is a spot).

  219 spots  ·  13 validated cities  ·  10 countries  ·  3 continents

(Thailand + Charleston retired Aug 13 — data preserved in `retired/`.
Asia dropped: Thailand was the only Asian framework.)

Per-framework breakdown (live-walk via App.jsx `countSpots` /
Globe.jsx `countSpotsByCity` — identical algorithm):

| Framework | Live count (full walk) | Fully-structured spots |
|---|---|---|
| dublin | 37 | 34 |
| spain | 38 | 33 |
| rome | 27 | 24 |
| prague | 25 | 23 |
| iceland | 23 | 22 |
| australia | 22 | 19 |
| michigan | 21 | 21 (different schema) |
| poland | 15 | 12 |
| munich | 11 | 9 |

Old figures (`226 / 21`) are retired — they came from a stricter
"fully-structured" count (spots with `neighborhood + category +
validated + vibeTags` all present) but the site now uses the live-walk
total everywhere for consistency. Do not reintroduce 226 or 21 as
on-page numbers.

Personal layer (ladsTake, forWho, story) mostly empty.
Brady fills these — they cannot be AI-generated.

---

## CURRENT BUNDLE (post-rebrand, May 31)

```
App (homepage):    162 KB raw / 57 KB gzip
react-vendor:      245 KB raw / 77 KB gzip
three-vendor:      863 KB raw / 227 KB gzip   (unchanged — Globe still uses it)
OutdoorsPage:        5 KB raw / 2 KB gzip
BucketListPage:      4 KB raw / 2 KB gzip
LocalPage:           3 KB raw / 1 KB gzip
Footer:              3 KB raw / 1 KB gzip
Framework chunks:  5–33 KB each (lazy)
index.html:          4 KB raw / 2 KB gzip
dist/assets:       2.5 MB across 40 chunks
dist/ total:       40 MB (incl. all images) — was 53 MB until Aug 25
                   (-12 MB dead images, -368 KB bundle-report.html)
```

vs Session 6 (May 22): dropped /story chunk (-14 KB), jordi.html
(-26 KB), vegas-zion-rise.html (-38 KB), GivingBackFooter chunk,
HoodieMockup module. Net source change: -3,800+ lines deleted across
the rebrand commits.

---

## PHOTO ASSIGNMENTS (LOCKED)

TIER 1 — HERO SLOTS:
Hero carousel: colosseum, opera, fitzroyBeach,
  iceland, oahuSunset, cliffs
Featured Work cards: cliffs (Dublin), sagrada (Spain), colosseum (Rome)
/when spring: schonbrunn
/when summer: rockPoolSwim
/when fall: munichMarienplatz
/when winter: glendaloughCelticCrosses
/outdoors hero + Rung 1: olympicDeerAboveClouds
/outdoors Rung 2: mountainOverlook
/outdoors Rung 3: hiking_7103980642848666692
/global header: montserrat
/local Michigan: smokyMountainsCabinOverlook (placeholder — needs a real Michigan photo)
/local Charleston: smokyRockOverlook

TIER 2 — STRIPS:
Strip 1 (range): sagradaSunset, bondiCoastal,
  glendalough, prauge_IMG_0247, rockPoolSwim
Strip 3 (moments): galwayGuinness, pragueOldTown,
  kangarooFeeding, castelSantAngelo

---

## VIDEO ASSIGNMENTS (CLOUDINARY)

Hero: Vivid Opera House
Data moment: Vivid Harbor Bridge drone
/when spring: Schonbrunn pan · /when summer: Jaco beach sunset
/when fall: Inside Colosseum · /when winter: Irish pub band
/outdoors Rung 1: Olympic rope hike · Rung 2: Costa Rica ATV canopy
/lads founders: Scooter to Trevi · /lads secondary: Smoky Mountains hike

(RiseLantern was Vegas-Zion-Rise hero — flagship deleted, video unused.)

---

## THE QUEUE — Thursday, August 27, 2026 (/morning reads this first)

> **Date discipline.** This queue is dated. If today is not Aug 27, say so out
> loud before working from it — a previous queue sat titled "TOMORROW'S QUEUE"
> for eight days with cleared blockers still listed as blockers.

### ⚠️ AUGUST 26 DID NOT HAPPEN

`git log` shows **zero commits on Aug 26**. The entire Aug-26 queue — the /local
graduation, both pin phases, all of it — went untouched and is carried forward
below unchanged. Do not read the Aug-26 plan as partially done; nothing against
it shipped. The last commit of any kind is `aee5d40`, Aug 25 22:11.

**START STATE (verified Aug 27):** working tree clean, `main` == `origin/main`,
all 11 Aug-25 commits deployed. One stash still sits there — `stash@{0}`, dated
**April 11**, "WIP on main: Reimagine Tab 1 as magazine-style destination
layout". It predates the React rebrand and almost certainly will not apply;
decide to drop it or leave it, do not pop it blind.

### ▶️ RESUME POINT — paused mid-afternoon Aug 27, resuming later the same day

**Everything finished is committed and pushed. Working tree is clean except
CLAUDE.md.** Done today: `2acea81` Peru data · `3f5a093` bookingEndorsed ·
`b701cd7` pin system. `npm run build` verified passing on the committed state.

**Pick up here, in this order:**

1. **READ BRADY'S MACHU PICCHU LIST — the top item.** He supplied it Aug 27:
   `https://maps.app.goo.gl/dkDQgdoXWFS2prtNA?g_st=i`
   It was NOT read — the signed-in Playwright browser was held by a parallel
   agent all session. **Do not read it with an isolated/signed-out profile**;
   that returns a generic Maps shell with no place data, which is the entire
   reason the provenance method exists. Signed in as brady@ladstravel.com,
   open each saved place, take lat/lng from the URL's `!3d<lat>!4d<lng>` plus
   the Place ID. The list panel is in a SUBFRAME — page-context `evaluate` is
   blind to it, use `browser_run_code_unsafe` with Playwright locators.
   **Scope Brady stated:** Machu Picchu only. It does NOT cover Lima,
   Huacachina, or the Ballestas boat tour. Do not expect it to fill the
   earlier days.
2. **Check the Peru26 video agent's output** — it was still running at the
   pause. Look for `internal/brady/peru26-video-plan.md` and
   `Peru26/review/rough-cut-v1.mp4`. Both paths are gitignored, which is
   correct. **Verify the rough cut is UPRIGHT before trusting it** (the
   `transpose=2` trap). Nothing publishes without Brady's explicit go.
3. **Then** the /local graduation proposal (Phase 3) — still proposal-first,
   still blocked on a real Michigan photo.

**Do NOT re-do:** the pin components, the endorsement gradient, or peru.js.
All three are shipped and verified.

### 🎯 SESSION GOAL — two builds, running in parallel

Aug 26's goal (**/local graduates** — the broken Michigan page becomes the
interactive Midwest hub) now shares the day with what the old queue called
"Thursday's Peru map". Today IS that Thursday.

### 🚧 FOUR THINGS ARE STILL BLOCKED ON BRADY — verified Aug 27, not assumed

| Blocked item | Verified state |
|---|---|
| Bruce visited-split | **18 of 19 entries still `validated: false`** — never supplied |
| Michigan geocoding | **0 coordinates** in `michigan.js` — nothing to pin |
| Michigan hero photo | still `smokyMountainsCabinOverlook` (a Smoky Mtns shot) |
| Peru26 beat sheet | **not in `internal/brady/`** — never arrived from claude.ai |

The film cannot start without the beat sheet, and `/local` cannot ship publicly
fronted by a Tennessee photo. Neither is a reason to idle — the two builds below
are unblocked and were launched around them.

### 🔑 THE PERU MAP HAS A REAL FOUNDATION — and it is not the framework data

There is **no `src/data/peru.js`**. Peru lives only as prose in the /outdoors
Salkantay block plus images. But `internal/brady/peru26-manifest.md` carries
**GPS-confirmed coordinates for all 10 trip days**, read out of Brady's own
camera EXIF — Miami → Lima → Ica/Paracas → Cusco → three Salkantay days →
Aguas Calientes → Machu Picchu, May 2–11 2026.

That is the **same provenance standard that made the Bruce pins safe**: the
coordinates were followed, never resolved from a string, so the Tivoli rule is
satisfied by provenance. A GPS fix proves Brady stood there on that date. It
proves **nothing** about any named business, operator, hotel or restaurant —
so day anchors may carry `validated: true`, and commercial spots may not exist
at all until Brady supplies them.

---

### PHASE 1 — PIN DATA COMPLETE

1. **Ingest Brady's Bruce visited-split** — still not supplied as of end-of-night
   Aug 25, so this is a morning ask, not a done deal. All 17 in
   `src/data/brucePeninsula.js` currently ship `validated: false`. Visited ones
   flip to `validated: true, validatedBy: 'Brady', visitedDate: '2026-08'`.
   The trip ran Aug 8–12 but the saved list is a SUPERSET of it — **never flip
   wholesale.** Pure data edit; the schema already carries the flag per spot.
2. **Geocode the 21 `michigan.js` spots.** They have no coordinates at all,
   which is what blocks relating them to the map. **Provenance-first**: several
   are known Grand Rapids / Michigan businesses with unambiguous locations. For
   anything generic, the Tivoli rule applies — do not resolve a bare string.
   The method that worked for the Bruce: open the place from a saved Google
   list in the signed-in Playwright browser and read `!3d<lat>!4d<lng>` off the
   URL. Note the list panel is in a subframe, so page-context `evaluate` is
   blind to it — use `browser_run_code_unsafe` with Playwright locators.
3. **`bookingEndorsed: false`** ✅ **DONE Aug 27 (3f5a093).**
   The endorsement gradient is binary on `ladsRating` (`FrameworkPage.jsx`), so
   today a spot cannot be "neutral despite having a rating" without deleting the
   rating and its visible "Lads: X/10" chip. The new field separates the two.
   Absent → today's behaviour unchanged; `false` → force neutral framing while
   KEEPING the rating chip. This unblocks Blue Mountains and Kilkenny, which
   wire NEUTRAL per Brady's standing rule: any product that is not the exact
   version we did makes no WE DID THIS claim.

### PHASE 2 — PHASE 4 PIN BUILD ✅ DONE Aug 27 (b701cd7)

Props-driven reusable pin components. **Nothing Midwest-hardcoded** — the Peru
interactive framework map inherits these directly, and that map is the 2027
paid-product prototype. This is the whole reason the components are generic:
state names, projection and coordinate bounds all arrive as props.

- Render honestly off the data: **gold = validated, copper = research tier**,
  per the established tier language. `validatedBy` / `visitedDate` surface in
  the card, never invented.
- Pin cards reuse the existing `Panel` / mobile-sheet pattern in
  `GoodNews.jsx` (see `Panel` at ~:192 and the `anchorToPanel` / `airportToPanel`
  adapter convention at ~:241/:252) rather than a new pattern.
- Bruce renders **all 17 copper** — that is CORRECT, not a bug, because the
  visited-split never arrived. Do not "fix" it by flipping flags.
- Michigan CANNOT render yet: zero coordinates. Build for drop-in, fabricate
  nothing.

### PHASE 2B — PERU DATA FOUNDATION ✅ DONE Aug 27 (2acea81)

Creating `src/data/peru.js` as a normalized pin intermediate on the
`brucePeninsula.js` schema and commenting discipline, sourced ONLY from the
GPS-confirmed manifest days + the existing validated /outdoors Salkantay prose.
Includes a `PERU_SOURCE` block and the trek as ordered real lat/lng waypoints
(real waypoints + Catmull-Rom downstream, never hand-tuned control points).

**Creating this file does NOT make Peru a published framework.** Deliberately
out of scope until Brady says otherwise: no route in `main.jsx`, no
`vercel.json` rewrite, no Globe pin, and **no change to the canonical totals**
(219 spots · 13 cities · 10 countries · 3 continents).

Watch the one wrinkle: the manifest's GPS arc says **Ica/Paracas**, while
Brady's own /outdoors prose says **Lima to Huacachina**. Huacachina is the
oasis beside Ica, so they agree — record the distinction, don't silently pick.

### PHASE 3 — /local GRADUATION — **PROPOSAL FIRST, Brady approves before build**

Propose the new `/local` structure with screenshots:
- Map as the **hero experience**, not a card below the fold.
- **"Good Brews · Good Views · Good News"** identity carried onto the page.
- How the 21 Michigan spots relate to the pins.
- Nav entry, and the `/good-news` **redirect-or-coexist** decision.

**The three standing flags get fixed as part of this — they were only ever
acceptable because the route was unlinked and `noindex`:**
1. **The Tennessee-photo-as-Michigan-hero DIES.** `/local` and `/michigan` both
   use `smokyMountainsCabinOverlook`. Use a real Michigan shot from the
   processed photos, or Brady supplies one. Shipping a public Michigan
   flagship fronted by a Smoky Mountains photo is not an option.
2. **Airport touch targets are 33×22 CSS px at 390px** — under the 44px
   guideline. Propose the fix rather than assuming one: zoom/pan, a companion
   list, or a tap-target redesign.
3. **Any 320px overflow** — `.globe-hint` renders 318px wide on a 305px
   viewport and pushes the homepage sideways. 360px and up are clean.

Also: graduating means dropping `noindex`, which pulls in canonical + sitemap
+ SEO work that does not exist yet. Scope it in the proposal.

**Hop Passport is THIRD-PARTY** — a real Michigan brewery passport program the
Lads use, not ours. Attribute it as such; invent none of its rules, members or
branding.

### PHASE 4 — VERIFY + SHIP

Full sweep at **1440 and 390**. `npm run build` clean. `/ship` on Brady's go.

---

### STILL WAITING ON BRADY (not blocking the above unless noted)

**🔴 THE FOUR HARD BLOCKERS — all four have now missed a full session:**
1. **Bruce visited-split** — which of the 17 you actually hit Aug 8–12. The
   saved list is a SUPERSET of the trip, so it cannot be inferred. Until this
   lands every Bruce pin renders copper and claims nothing. **BLOCKING Phase 1.1.**
2. **Michigan coordinates** — or a Google Maps saved list to read them from by
   provenance. **BLOCKING Phase 1.2 and any Michigan pin.**
3. **A real Michigan photo** — Sleeping Bear, Torch Lake, Detroit, Grand Rapids.
   None exists in `src/images-*.js`. **BLOCKING the /local graduation**, because
   a public Michigan flagship cannot be fronted by a Smoky Mountains shot.
4. **The Peru26 beat sheet** — never arrived from claude.ai. **BLOCKING all film
   assembly**; the "no editing until the beat sheet" rule still stands.

**Peru-specific, needed before `peru.js` can become a published framework:**
- Named spots. GPS proves location, not businesses — so there are no
  restaurants, hotels, operators or ratings in the data and there must not be
  until Brady supplies them firsthand.
- The unplaceable clip `72581579-…mp4` (no GPS, no Apple metadata, stamped
  May 20, outside the May 2–11 cluster) — where does it belong?

- **Dawson's UP list** — the genuinely validated half of Phase 4 (his July 4
  scout). Paste the link; it can be read directly now.
- **Seattle list provenance** — visited, or planned like the Bruce list was?
  17 places already extracted, banked for the Seattle framework runway.
  Default assumption stays research-only.
- **GetYourGuide** — direct partner account, or re-source the 8 GYG-preference
  worksheet rows as Viator products? GYG earns nothing today.
- **Blue Mountains / Kilkenny** — did we do those exact versions? (With
  `bookingEndorsed` approved these can ship neutral without an answer.)

### CARRIED FORWARD

- **Peru26 film prep — MECHANICAL PREP IS DONE (Aug 25 night).** `Peru26/` is
  **gitignored** (225 files, 932 MB; raw media never enters git), as is
  `internal/`. **No editing until the beat sheet** — that rule still stands;
  only inventory and capability tests were run, no real footage was touched.
  - **Manifest:** `internal/brady/peru26-manifest.md` (353 lines) — summary,
    flags, full videos table, photos grouped by day.
  - **Contact sheets:** `Peru26/review/` — 3 video sheets (10 clips each,
    start/mid/end frames labeled) + 10 photo sheets (~20 each, chronological).
    `Peru26/review/tmp_video_frames/` holds the 90 individual labeled stills
    as a fallback if a tiled frame is hard to read.
  - **Inventory:** 225 files / 0.91 GB / **0 corrupt**. 30 videos totalling
    only **3:35** (longest clip 14.8s — all Live-Photo-style captures, none
    over 60s) + 195 photos. Trip arc from GPS EXIF: Miami (F1 GP) → Lima →
    Ica/Paracas (Ballestas boat + dune buggy) → Cusco → Salkantay → Machu
    Picchu, May 2–11 2026. Place *names* are inferred from coordinates, not
    from an itinerary — verify before putting any of them on screen.

  **🔧 THREE GOTCHAS FOR THE EDIT — read before running any ffmpeg:**
  1. **`transpose=2` is mandatory per input.** 28/30 clips are portrait iPhone
     HEVC carrying a -90° rotation flag. ffmpeg auto-applies rotation in a
     simple `-vf` chain but **NOT inside `-filter_complex`** — so any
     multi-clip assembly renders sideways unless each rotated input gets an
     explicit `transpose=2` before scaling/concat. Found by test render.
  2. **Use the right ffmpeg binary.** There is no system ffmpeg/ffprobe/
     exiftool on this machine. An OBS-bundled `ffmpeg.exe` exists inside an
     Overwolf extension folder and its banner claims "full_build", but
     **`drawtext` is compiled out** — it fails with `Unknown filter 'drawtext'`.
     Use the `imageio-ffmpeg` pip package's binary (gyan.dev essentials 7.1)
     for anything with text. The OBS `ffprobe` is fine for probing.
     Font: `C:\Windows\Fonts\arial.ttf` works. HEIC/EXIF reading was done with
     Python `Pillow` + `pillow-heif` (installed) since exiftool is absent.
  3. **Sort by Apple's timestamp, not the generic one.** 10 of 30 videos have a
     generic QuickTime `creation_time` that disagrees with the file's own
     `com.apple.quicktime.creationdate` (which carries the real `-05:00` Peru
     offset). 4 are wildly off — `IMG_1944.MOV`'s generic tag claims **Aug 25**
     when it is May 5 dune-buggy footage; `IMG_1128` / `IMG_2406` / `IMG_3030`
     are mis-stamped into late May. Re-export artifacts. The manifest already
     sorts by the corrected time and tables every correction.

  **⚠️ ONE FILE NEEDS BRADY:** `72581579-9d47-4394-9304-fbad79f114c1.mp4` has no
  Apple metadata, no GPS, no device tag — only a generic `creation_time` of
  May 20, outside the May 2–11 cluster. Placed there by default but genuinely
  unplaceable. Also odd: `IMG_2760.JPG` is 1980×3520, unlike any native camera
  output in the set (possibly a screenshot/re-export).
- **13 tagged Viator links stockpiled** in
  `internal/brady/affiliate-link-worksheet.md`, grouped by why each cannot be
  wired. Note `bookingUrl` renders at exactly ONE place in the codebase
  (`FrameworkPage.jsx`, inside `dayTrips`) — spots have no booking CTA at all,
  so Schönbrunn / Guinness / Camp Nou need a component change plus a decision
  on what signals endorsement for spots.
- **Paris sticker** — still ACTIVE on Shopify with a checkerboard rasterized
  into the print file. Printify re-export needed (manual, Brady). Rename to
  "Paris Sticker" when it returns.
- **2 orphaned `gyg.me` links** (Wicklow, Pompeii) — awaiting Viator
  equivalents. Flagged, deliberately not deleted.

### POLISH BACKLOG (drop these first if the day runs long)

- **Salkantay + Michigan photo processing** — folders pending from Brady.
- **Travel-tools affiliate surface** — the single home for Klook / Tiqets /
  Yesim / Kiwitaxi / Localrent. See the HARD RULE in SESSION SEQUENCE.
- **Motor City at Michigan zoom** — waypoints preserved in the tracer and
  `ROUTE_PATHS['motor-city']`, unused until a zoomed view exists.
- **`/audit-all` still lists retired frameworks** and omits michigan.
- **`/thailand` `/charleston`** have no redirect/404 route.

---

## SESSION SEQUENCE (what's next)

**MIDWEST BUILD (active — on `main` since the Aug 17 reconciliation):**
- **Replace the Michigan hero photo.** `/local` card (`LocalPage.jsx`) and
  `/michigan` both use `smokyMountainsCabinOverlook` (a Smoky Mtns placeholder).
  NO Michigan photo exists in `src/images-*.js` yet — **Brady must supply one**
  (Sleeping Bear, Torch Lake, Detroit, Grand Rapids…) before this can be fixed.
- **Build the Michigan + Midwest interactive hero figure.** Net-new — no
  scaffold exists; 3D/interactive per the core vision. Brainstorm design first.
- **`/global` rework** to showcase all 9 current frameworks. CONFIRM intent
  with Brady: re-skin the existing page vs. a fuller rebuild. (NOT re-adding
  the retired thailand/charleston — "current frameworks" = the 9.)
- **Quality-improvement pass across all 9 current frameworks** (data + pages).

**FOR NEXT /morning:** the Michigan map is merged and being expanded to a
full Midwest map (WI · IL · IN · OH · MN · MI). See MIDWEST MAP RUNWAY.

**Pass B framework engine spec** at `docs/framework-pass-b-spec.md` is
DORMANT. Reference only. Not the active backlog item.

**LATER BLOCK — "Travel Tools" / Ways-to-Save surface (decided Aug 17,
do NOT build yet):** Travelpayouts carries ready-made programs well
beyond tours — Klook, Tiqets, Yesim (eSIM), Kiwitaxi (transfers),
Localrent (car rental).

  HARD RULE: booking links **on framework spots** stay
  tours-we-can-vouch-for ONLY (Viator / GetYourGuide; Tiqets is a
  candidate). The service-category programs get exactly ONE home — a
  single "travel tools" / Ways-to-Save surface, clearly framed as
  **services, not validated recommendations** — and are NEVER scattered
  across framework spots. Mixing a car-rental affiliate into a validated
  spot list would launder a service link as a Lads endorsement.

**Endorsement gradient (in force since Aug 17):** a spot WITH a
`ladsRating` gets the full Lads-endorsed CTA framing; a spot WITHOUT one
gets neutral "Book this tour →" framing that implies no firsthand visit.
Never imply we did something the data has no rating for.

Immediate candidates (no priority assigned — Brady picks):
- Wire real social URLs into Footer (`#` placeholders today)
- Salkantay framework build (homepage callout still says "coming soon")
- /bucket-list build-out — page is thin (hero → events → calendar line)
- /global re-skin to match the new collection card system
- Real Michigan photo for /local
- Photo coverage audit per framework
- Google Search Console verification + sitemap submit
- Bing Webmaster Tools verify (meta tag live)
- Apply to Travelpayouts (higher affiliate rates than direct)
- LinkedIn launch post (drafted previously)

**FORD PERIOD** (in progress, May 18 onward):
- Site on autopilot
- Brady: calls evenings/weekends only

**FALL 2026:**
- Paid services launch (no specific date set)
- Real social presence begins
- /bucket-list calendar view

---

## CUSTOM COMMANDS

/morning  — reads this file + sprint, outputs top 3 priorities
/ship     — diff → commit message → confirm → push
/perf     — build + bundle size report + Lighthouse
/audit-all — checks all 9 framework data files
/context-tag [destination] — tags spots with five-axis contexts

---

## SERVICES

| Service | Detail |
|---|---|
| Vercel | Auto-deploy on push to main |
| GitHub | dangelobraden43/LadsTravelCo |
| Cloudflare | ladstravel.com DNS |
| Formspree | xvzvekkk (intake) |
| Cal.com | braden-dangelo/secret |
| Umami | f00e4164-73db-481f-bd5c-5f5ab609f191 |
| Clarity | wbqqkbsekh |
| Airtable | Base configured, Dawson has access |
| Cloudinary | Videos connected |
| Google Workspace | brady@/dawson@/stew@ ladstravel.com |

(MailerLite, Printify, Buffer all paused or unused — re-evaluate before
the Fall 2026 launch.)

---

## NORTH STAR

Would a stranger trust two 22-year-olds to plan their trip
after scrolling this page?

Does every section SHOW expertise or just CLAIM it?

Could someone screenshot this and know it's the Lads?

The tech makes them faster. It doesn't make them less human.

---

## WHAT WE DON'T DO / DON'T SELL

- We do NOT sell travel insurance, do not recommend providers,
  do not position as advisors on it. Frameworks must never mention
  insurance in any form — no section, no aside, no line.
- The older `audit_results.md` "Insurance is non-negotiable" rule is
  STALE — ignore it.
- We do NOT sell direct bookings or fulfillment. Revenue = affiliate
  tour commissions (Viator/GYG), merch (future), paid consulting (Fall 2026).
- We do NOT sell / operate our own flights, hotels, or tours.
- We are an **LLC, not a nonprofit**. Charity/fundraising lives on
  social media only — never on the site, in copy, in components, or
  in data.

---

## OPEN DECISIONS

- Real social URLs for Footer (`#` placeholders today)
- Salkantay framework — content + photos
- /when route: keep dormant (out of nav, still reachable), redirect to
  /bucket-list, or kill?
- /global re-skin — when, and what direction
- Pass B framework engine: revive someday, or build out collections
  organically and let Pass B die?
- Footer rollout: per-page imports today (App, ExplorePage, AdventurePage,
  WhenPage, LadsPage, FrameworkPage); refactor to a layout wrapper later?

---

## ARCHITECTURE PATTERNS (how this codebase works)

**Components & pages:**
- Components live at `src/` top-level with co-located `.css`
  (`FrameworkPage.jsx` + `FrameworkPage.css`). No `src/components/`
  or `src/pages/` folder.
- Inline sub-components inside a parent file is the convention
  (App.jsx has DataSpectacle, PhotoStrip, Nav, CursorGlow, FeaturedWork
  all inline).
- Pages import Nav from App.jsx: `import { Nav } from './App'` then
  render `<Nav scrolled={true} />`.
- Pages import Footer from Footer.jsx and render `<Footer />` near
  the bottom. Footer is per-page imported (not via layout).
- Lazy-load each route in `src/main.jsx`:
  `const Foo = lazy(() => import('./Foo'))`, then
  `<Route path="/foo" element={<Foo />} />`.
- SEO per-route via `<Helmet>` from `react-helmet-async` (already in deps).

**Styling:**
- No Tailwind. CSS custom properties in `src/index.css :root` are
  the design system.
- Palette vars: `--gold #d4a843`, `--copper #b8886e`, `--cream #e8dcc8`,
  `--bg #141210`, `--surface #1c1915`.
- Type vars: `--editorial` (Fraunces), `--sans` (Inter), `--mono`
  (JetBrains), `--serif` (EB Garamond), `--display` (Space Grotesk).
  All 5 fonts loaded in `index.html`.
- `html { scroll-behavior: smooth }` is global.
- `--radius` 16px, `--radius-sm` 10px, `--gold-border` rgba(212,168,67,0.22).

**Collection card style** (introduced May 31 — Featured Work, /local,
/bucket-list proof slot if it returns):
- 4:5 aspect ratio, full-bleed photo, dark bottom gradient.
- Eyebrow (mono, gold, letter-spaced) + Fraunces italic title +
  Inter sans region/subtitle + Inter sans 1-line lede + mono CTA
  `OPEN FRAMEWORK →`.
- Single gold accent throughout — no per-card accent colors.

**Motion:**
- No framer-motion. The Reveal-on-scroll pattern is native
  `IntersectionObserver` adding a `.visible` class to elements that
  start `opacity: 0; transform: translateY(20px)`.
- GSAP is used in the homepage hero only. Splitting.js for
  character-by-character hero text.
- Always respect `prefers-reduced-motion`.

**Routing:**
- Vercel `cleanUrls: true` means `/foo` resolves to `public/foo.html`
  *before* SPA rewrites. If a React route collides with a `public/*.html`,
  the static file wins silently. (No collisions remain — all static
  flagships were deleted May 31.)
- Every React-only route MUST have an entry in `vercel.json` rewrites:
  `{ "source": "/foo", "destination": "/" }`.
- The 4 collection routes (`/global`, `/outdoors`, `/bucket-list`,
  `/local`) all have rewrites.
- Retired-path redirects (vercel.json `redirects` block + client-side
  `<Navigate replace>`): /explore → /global, /adventure → /outdoors,
  /plan → /, /story → /.

**Featured Work live spot counts:**
- App.jsx defines `countSpots(data)` which recursively counts named
  entries with descriptions. `FeaturedWork` dynamic-imports each
  framework data file on mount and updates the counts. Fallback
  constants exist so cards never render empty.

**Globe pin data is drift-proof (since June 7):**
- `src/Globe.jsx` imports the 9 framework data files statically and
  derives each pin's `n` via `countSpotsByCity(data)` — the same
  walker as App.jsx's `countSpots`, bucketed by `city`/`area`.
- Attribution rule: every spot maps to exactly one pin. Sub-cities
  with their own pin (Galway, Madrid, Tasmania, Vienna) take their
  bucket; everything else folds into the framework's PRIMARY pin
  (`PIN_ATTRIBUTION` table in Globe.jsx). Sum across validated pins
  = 219, matches the homepage.
- `validated: true/false` flag distinguishes the 13 gold pins from
  the 7 research-only copper pins. Cusco stays `comingSoon`.
- When adding/removing spots from `src/data/*.js`, the Globe updates
  on the next build automatically — do NOT hand-edit pin counts.

**Workflow patterns that worked:**
- Playwright is NOT installed in this repo. For screenshots: `npx playwright
  install chromium` once, then `npm i playwright` inside the scratchpad and
  run a small `.mjs` (chromium.launch → page per viewport → fullPage
  screenshot). Verify frontend at **1440 + 390**; there is no unit-test
  runner — build + screenshots IS the verification pattern.
- To trace a real geographic silhouette into an SVG: fetch state GeoJSON
  (e.g. glynnbird/usstatesgeojson), keep the largest rings (drop islands),
  Douglas-Peucker simplify to a few hundred pts, then equirectangular-
  project (`lon*cos(lat0)`, `lat`) fit to the target viewBox. Project any
  place markers through the SAME transform so they land on the coastline.
  (Used for the /good-news Michigan map — see scratchpad `trace.mjs`.)
- For counting canonical stats, write a Node script that imports each
  `src/data/*.js` and tallies. Do NOT trust numbers already on the
  page — they drift.
- For Playwright full-page screenshots, inject a one-off CSS rule
  overriding `.reveal { opacity:1 !important; transform:none !important; }`
  because the IntersectionObserver doesn't fire under stationary capture.
- Brady prefers **phased execution with a report between each phase** —
  never combine phases, never skip ahead, always stop and confirm.

---

## RULES

- Never invent spots, prices, or recommendations.
- Never push without showing the diff.
- Never reuse another framework's palette.
- Never add insurance content to any framework.
- **Charity and fundraising live on social media only — never on the site, in copy, in components, or in data.**
- Never add "free" / "free through 2026" / "no cost" pricing copy. The site is a PREVIEW; paid services launch Fall 2026.
- Always run `npm run build` before committing.
- Always end sessions with CLAUDE.md updated.
- Quality over deadline. Nothing ships until it's right.

---

## Parallel Agent Workflow

Worktrees live OUTSIDE the repo (sibling folder) so the harness watcher on
`.claude/` can't lock them on Windows (a `.claude/worktrees/` tree wedged Aug 13).

    git worktree add ../lads-wt-<branch> -b <branch> main    # create off main
    cd ../lads-wt-<branch> && claude                         # launch agent HERE (loads its .claude/ tooling)
    #  ...work + commit on <branch> inside the worktree...
    git -C ../lads-wt-<branch> push -u origin <branch>       # optional: push the branch
    git checkout main && git pull && git merge --no-ff <branch> && git push
    git worktree remove ../lads-wt-<branch>                  # remove worktree
    git branch -d <branch>                                   # delete merged branch
