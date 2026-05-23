# THE LADS TRAVEL CO. — CLAUDE.md
## Last Updated: May 22, 2026

---

## STATUS

Live: ladstravel.com (Vercel, auto-deploy on push)
Vercel fallback: lads-travel-co.vercel.app
Repo: dangelobraden43/LadsTravelCo
Stack: React + Vite, React Router, Three.js (react-three-fiber)
Email: brady@ladstravel.com (Google Workspace active)
Frameworks: 11 React destination routes + jordi + vegas-zion-rise (static flagships) + /story
Peru completed. Ford started May 18, week 1 going well.

## WHAT WAS BUILT (May 22, 2026)

SESSION 6 — Routing cleanup, stat consistency, Featured Work promotion,
Pass B spec, /story route. Five commits, all pushed.

PHASE 1 (commit 230ccf0) — Routing cleanup:
- Deleted 11 static HTML duplicates from public/ (the 6 colliding slugs
  spain/iceland/munich/poland/thailand/charleston PLUS the 5 legacy slugs
  dublin-galway/italy/australia-nz/prague-vienna/lads-local)
- Kept public/jordi.html and public/vegas-zion-rise.html as flagships
- vercel.json: added SPA rewrites for the 6 newly-React-served slugs
- Internal links in flagships retargeted (/italy → /rome, /dublin-galway → /dublin)
- vite.config.js sitemap dynamicRoutes updated to canonical 11 + 2 flagships
- All 11 React destinations now reachable through one FrameworkPage engine

PHASE 2 (commit f91ed77) — Stat consistency + content cleanup:
- Three homepage stat displays disagreed (183 / 285 / 285 spots, 10/13 countries)
- Counted actual src/data/*.js content: 226 spots / 11 countries / 21 cities / 4 continents
- Updated DataSpectacle counters, Globe caption, System stat cards to match
- Salkantay callout: "Brady is on this trek May 3-13" → "completed in May 2026"
- Removed "HAPPENING NOW" badge from Multi-Day Treks rung
- Entire WORLD 5 SEASONS section deleted (four-charity rotation + HoodieMockup)
- HoodieMockup component file kept in src/worlds/ for future use, but lazy
  import removed from App.jsx — no longer in the bundle

PHASE 3 (commit f2b0ad7) — Featured Work promoted:
- Moved Featured Work block (Vegas-Zion-Rise + Jordi cards) from position 4
  to position 2 — now sits between Hero and Globe
- Top padding tightened 120 → 80px so hero chevron flows into proof
- Homepage scroll order: Hero → Featured Work → Globe → DataSpectacle → Adventure
  → System → The Lads

PHASE 4 (commit cecad99) — Framework Engine Pass B spec:
- Written at docs/framework-pass-b-spec.md (501 lines)
- All 10 sections from the spec prompt covered
- Architecture decisions documented: no per-destination three.js (Globe
  stays singular), atmosphere = 2D canvas particles (Vegas-proven),
  audio muted by default, all new data fields optional
- Three patterns from one engine: STORY (Jordi-style), CLIENT (Vegas-style),
  ENGINE (default for 11 destinations)
- 7 open questions surfaced for Brady review before Pass B implementation

COPY (commit c47a409) — Removed Lexie's name from the Vegas-Zion-Rise homepage card.
Description now reads: "Four nights, three worlds, one lantern festival in the Mojave."
Vegas-Zion-Rise framework page itself uses "you/we" throughout — no other refs to her name.

/STORY ROUTE (commit c7a0762) — Origin narrative + 14-entry timeline:
- src/StoryPage.jsx + src/StoryPage.css (single file, App.jsx convention)
- Four inline components: StoryHero, StoryLong (5 anchor-linked sections:
  #origin #barcelona #charleston #build #now), Timeline (14 entries
  Dec 2025 → Jan 2027), StoryAnchors (3 pull quotes)
- Content sourced from master story log v2, verbatim — do NOT paraphrase
- Nav link added (Story slotted before The Lads in NAV_ITEMS)
- Homepage hero gets a subtle "Read the story →" mono link below the lede
- prefers-reduced-motion respected (CSS media query + JS pre-check)
- /story SPA rewrite added to vercel.json
- SEO via react-helmet-async (matches FrameworkPage pattern)
- Lazy-loaded in main.jsx, chunk: 14.35 KB / 5.47 KB gzip

## WHAT WAS BUILT (April 16, 2026 — evening polish)

## WHAT WAS BUILT (April 16, 2026 — evening polish)

SESSION 5.5 — Visibility, routing, vision clarity:

HOMEPAGE:
- New "What We Actually Deliver" section between Globe and DataSpectacle
  Two large photo cards linking to /vegas-zion-rise and /jordi
  Copy: "Two frameworks. Live. Don't take our word for it."
  Accent colors match each framework (amber for Vegas, burgundy for Jordi)
- Jordi + Vegas-Zion-Rise were orphaned before this session —
  no link from anywhere in the React app

EXPLORE PAGE:
- Featured frameworks row added above DestinationTheater
  Same two cards, 16:9 instead of 4:5

GLOBE FIX:
- Atmosphere shader was blowing out as a yellow sun-ball
  (additive-blended front-side Fresnel with pow(0.75-dot,3.0) × 0.25)
  Rewritten as back-side rim halo, normal blending, subtler falloff
- Lighting rebalanced: ambient #b8c4d4 @ 0.9, neutral directional
  Earth stays legible at any rotation instead of going gold-washed
- Stars Math.random() moved out of useMemo (react-hooks/purity)

VERCEL SPA ROUTING FIX (critical):
- /explore, /plan, /when, /adventure, /lads, /gift/michigan and
  all React framework routes (/rome, /dublin, /australia, /prague,
  /michigan) were 404'ing on direct hit — only worked via client-side
  navigate() from homepage
- Root cause: with cleanUrls:true, Vercel didn't resolve
  destination:"/index.html" correctly in rewrites
- Fix: explicit per-route rewrites with destination:"/" (commit 1bb5715)
- All 25 routes now 200 on direct hit / refresh / shared link

## WHAT WAS BUILT (April 16, 2026)

SESSION 5 — Framework deliverables + SEO foundation:

DELIVERABLES:
- vegas-zion-rise.html — first client-grade immersive framework
  3D canvas lantern engine, Rise Festival video background,
  scene-aware scroll system, mouse parallax, 4-day itinerary
  Live: ladstravel.com/vegas-zion-rise
- jordi.html — Barcelona founding story framework
  17 processed photos (HEIC→WebP pipeline), photo-driven narrative,
  Sagrada Familia centerpiece, Brady+Lexie personal photos
  Live: ladstravel.com/jordi

SEO FOUNDATION (all 12 frameworks + index):
- Microsoft Clarity tracking live (wbqqkbsekh) — no longer placeholder
- Schema.org JSON-LD: Organization+TravelAgency on index,
  Article+TouristDestination+BreadcrumbList on each framework
- Meta descriptions with long-tail SEO keywords per destination
- OG image, URL, twitter card tags on all frameworks
- Canonical URLs: ladstravel.com (fixed from vercel.app)
- Internal cross-links: every framework → 3 related frameworks
- Sitemap: fixed hostname ladstravel.co→ladstravel.com, all 14 pages listed
- Title cleanup: removed year suffixes (Italy 2026 → Italy)

DATA:
- Airtable resync: 10 data files updated (April 16 pull)
- Cloudinary: RiseLantern_xuegox video uploaded for Vegas framework

INFRASTRUCTURE:
- HEIC→WebP conversion pipeline via heic-convert + sharp
- Framework delivery model proven: HTML in public/ → Vercel cleanURL
- Bing Webmaster Tools: verification meta tag live (E83CF4C6...)
- All integrations verified: Formspree, Cal.com, Umami, Clarity, email, affiliates

LIVE URLS:
- ladstravel.com (main site)
- ladstravel.com/vegas-zion-rise (Lexie surprise trip)
- ladstravel.com/jordi (founding story — Jordi doesn't know yet)

---

## WHAT WAS BUILT (April 10-15, 2026)

Two days of full velocity:

INFRASTRUCTURE:
- React + Vite SPA migrated from inline Babel
- Bundle: 59MB → 5.5MB (90.6% reduction, WebP CDN)
- Five-spoke architecture: /, /explore, /adventure, /when, /plan, /lads
- GitHub Actions: quality.yml, lighthouse.yml, deploy-check.yml
- Vercel Analytics + Speed Insights + Microsoft Clarity (wbqqkbsekh)
- Security headers, honeypot on all forms, zero npm vulnerabilities
- Google Workspace: brady@, dawson@, stew@ ladstravel.com
- GSAP + ScrollTrigger + Splitting.js installed
- Lenis removed — native scroll only
- MCP: brave-search, filesystem, fetch, github configured

DATABASE:
- 285 spots in Airtable (synced — source of truth)
- scripts/airtable-sync.js — run: npm run sync
- scripts/export-to-airtable-csv.js — run: npm run export
- v2 schema with contexts array (five-axis tagging)
- Dawson has Airtable editor access

VISUAL:
- 3D globe (Globe.jsx) — earth texture, atmosphere,
  21 pins, 4 route arcs, hover tooltips, click navigation
- Globe SVG logo in nav
- 3D depth hero — 4 enhanced photos with parallax
- 7-world immersive scroll sections
- 3D hoodie mockup (HoodieMockup.jsx) —
  Fall 2026 breast cancer cause live
- VideoBackground component — 8 Cloudinary videos connected
- Splitting.js on hero headline
- Gold cursor glow on dark sections
- GSAP countUpOnScroll on data stats

CONTENT:
- "Where We're Headed" section (replaces bucket list)
- /when — four sticky scroll seasons with cause panels
- /adventure — three-rung ladder, Salkantay callout
- /explore — split-screen theater layout
- /giving — cause panels, hoodie showcase
- /gift/michigan — live gift page
- Nav: Explore · Adventure · When · Plan · The Lads

AUTOMATION:
- Formspree endpoint: xvzvekkk (intake + email capture)
- Cal.com: braden-dangelo/secret
- MailerLite: Email 1 sequence active (webhook pending)
- Buffer: social scheduling (60-day batch needed)

AFFILIATE:
- src/utils/affiliate.js — UTM tracking utility
- Viator + GYG: 8% commission, "Book This" buttons
- World Nomads + Airalo applications submitted

---

## PLATFORM VISION

Five-axis travel intelligence platform.
One database. Five views.

AXIS 1 — City Immersion: 12 frameworks live + 2 special deliverables
AXIS 2 — Adventure & Trekking: three-rung ladder
AXIS 3 — Road Trips & Routes: west coast spine
AXIS 4 — Signature Events / Where We're Headed
AXIS 5 — Sacred Sites: filter + badge across frameworks

Every spot has a contexts array.
Not one category — multiple axes.

---

## DATABASE

Source of truth: Airtable base
Sync command: npm run sync (pulls Airtable → src/data/)
Export command: npm run export (src/data/ → CSV)
Build: npm run sync:build (sync + build together)

**Canonical site-visible count: 226 spots / 11 countries / 21 cities / 4 continents**
(measured by counting `src/data/{slug}.js` — what FrameworkPage actually renders)

**Airtable raw count: ~285** (some spots live in `airtable-*.js` raw exports
but haven't been promoted into framework data files yet)

Per-framework counts (from the 11 React routes):
dublin 34 · rome 24 · spain 33 · australia 19 · iceland 22
prague 23 · munich 9 · poland 12 · thailand 13 · charleston 16 · michigan 21

Context tags needed on most.
Personal layer (ladsTake, forWho, story) mostly empty.
Brady fills these — they cannot be AI-generated.

---

## CHARITY MODEL

**STATUS (May 2026): four-window rotation PAUSED.** Blood Cancer United is the
current active partnership (first meeting completed). The four-cause rotation
section was removed from the homepage in Phase 2 of Session 6. The HoodieMockup
was removed with it.

**DO NOT mention Blood Cancer United on the site yet** — separate work,
handled outside this codebase for now.

The four-window rotation below is the historical model, NOT current. Reference
only; do not surface in code or copy:

| Window | Cause | Charity |
|---|---|---|
| Late Apr/May | NPCA | National Parks Conservation Assoc. |
| Jun/Jul/Aug | TUFF | Uniform Funding Foundation |
| Late Aug/Sep | Breast Cancer | Ginny L. Clements Institute (U of Arizona) |
| Late Nov/Dec | Children's | C.S. Mott Children's Hospital |

Hoodie: $65 retail / ~$28 Printify cost / $37 → charity
Printify store: in progress (paused with rotation pending decision)

---

## CURRENT BUNDLE (post-Session 6)

App (homepage): 160 KB raw / 56 KB gzip (was 167/58 — Seasons + HoodieMockup removed)
react-vendor: 244 KB raw / 77 KB gzip
three-vendor: 863 KB raw / 227 KB gzip (was 884/235 — HoodieMockup deps gone)
StoryPage chunk: 14 KB raw / 5.5 KB gzip
Framework chunks: 5-33 KB each (lazy)
Static flagships: jordi.html 26 KB · vegas-zion-rise.html 38 KB
Total dist: ~5.5 MB across ~28 chunks
Production hash refs change per deploy — App-*.js, StoryPage-*.js

---

## PHOTO ASSIGNMENTS (LOCKED)

TIER 1 — HERO SLOTS:
Hero carousel: colosseum, opera, fitzroyBeach,
  iceland, oahuSunset, cliffs
/when spring: schonbrunn
/when summer: rockPoolSwim
/when fall: munichMarienplatz
/when winter: glendaloughCelticCrosses
/adventure rung1: olympicDeerAboveClouds
/adventure rung2: mountainOverlook (Peru placeholder)
/adventure rung3: hiking_7103980642848666692
/explore header: montserrat

TIER 2 — STRIPS:
Strip 1 (range): sagradaSunset, bondiCoastal,
  glendalough, prauge_IMG_0247, rockPoolSwim
Strip 2 (cities): dresdenFrauenkirche, galwayChristmas,
  prauge_IMG_0274, templeBarDublin, sistineChapel
Strip 3 (moments): galwayGuinness, pragueOldTown,
  kangarooFeeding, castelSantAngelo

---

## VIDEO ASSIGNMENTS (CLOUDINARY)

Hero: Vivid Opera House
Data moment: Vivid Harbor Bridge drone
/when spring: Schonbrunn pan
/when summer: Jaco beach sunset
/when fall: Inside Colosseum
/when winter: Irish pub band
/adventure rung1: Olympic rope hike
/adventure rung2: Costa Rica ATV canopy
/lads founders: Scooter to Trevi Fountain
/explore Dublin: Guinness immersive
/explore Spain: Montserrat views
/lads secondary: Smoky Mountains hike
vegas-zion-rise hero: RiseLantern_xuegox (Rise Festival footage)

---

## SESSION SEQUENCE (what's next)

NEXT SESSION — Pass B implementation (engine + 3 proof destinations):
Spec is written at docs/framework-pass-b-spec.md and awaiting Brady review.
Brady to answer the 7 open Pass B questions before any code. Recommended
phasing in the spec: ~3 weeks for engine + Dublin/Rome/Spain proof, then
rolling Pass B v2 for remaining 8 + globe-zoom transition + flagship
migration.

ALSO NEXT:
- Salkantay / Machu Picchu framework (Brady is back from Peru; homepage
  callout currently says "Framework coming soon")
- Decide what fills the space where WORLD 5 SEASONS used to be (or leave
  the gap — page is intentionally shorter post-Session 6)
- Google Search Console: verify domain, submit sitemap
- Bing Webmaster Tools: verify (meta tag live)
- LinkedIn launch post (already drafted)
- Book CPA consult ($150-300, Michigan small business)
- Apply to Travelpayouts (higher affiliate rates than direct)
- ConvertKit free account + embed on site (email capture)
- Padnos International Center outreach (post-Peru)
- Video integration complete (remaining videos)
- Printify store decision (paused with charity rotation)

FORD PERIOD (in progress, May 18 onward):
- Site on autopilot
- Stew handles first touch on all intakes
- Brady: calls evenings/weekends only
- Target: 8-12 frameworks delivered through summer

FALL 2026:
- Phase 2 builds (adventure vertical, global calendar)
- Study abroad partnerships formalized
- Paid consulting path starts Jan 2027 per /story timeline

---

## CUSTOM COMMANDS

/morning  — reads this file + sprint, outputs top 3 priorities
/ship     — diff → commit message → confirm → push
/perf     — build + bundle size report + Lighthouse
/audit-all — checks all 12 framework data files
/context-tag [destination] — tags spots with five-axis contexts

---

## SERVICES

| Service | Detail |
|---|---|
| Vercel | Auto-deploy on push |
| GitHub | dangelobraden43/LadsTravelCo |
| Cloudflare | ladstravel.com DNS |
| Formspree | xvzvekkk |
| Cal.com | braden-dangelo/secret |
| Umami | f00e4164-73db-481f-bd5c-5f5ab609f191 |
| Clarity | wbqqkbsekh |
| Airtable | Base: configured, Dawson has access |
| MailerLite | Email 1 active, webhook pending |
| Cloudinary | 9 videos connected (added RiseLantern) |
| Printify | Hoodie store in progress |
| Google Workspace | brady@/dawson@/stew@ ladstravel.com |

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
  insurance in any form — not a section, not an aside, not a
  "get insurance before you go" line, nothing.
- The older audit_results.md has a "Insurance is non-negotiable
  in all frameworks" rule — that rule is STALE. Ignore it.
- We do NOT sell direct bookings or fulfillment. Revenue = affiliate
  tour commissions (Viator/GYG), hoodie/merch with charity split,
  and future paid consulting.
- We do NOT sell / operate our own flights, hotels, or tours.

## OPEN DECISIONS

**RESOLVED in Session 6:** The dual framework system (static HTML in public/
vs React routes) is gone. The 11 React destinations are now the single engine.
Jordi + vegas-zion-rise stay as static flagships and are the quality bar for
Pass B per docs/framework-pass-b-spec.md.

**Open from Pass B spec — Brady to decide before implementation:**
1. Audio default on framework pages — muted (recommended) vs auto-play
2. Globe-zoom transition — include in Pass B v1 or defer to v2
3. Migrate Jordi + Vegas off static HTML into the engine, or keep them as
   v1 references forever
4. `prefers-reduced-motion` behavior — atmosphere off entirely? video paused?
5. Which 3 destinations ship first (spec recommends Dublin / Rome / Spain)
6. Audio file hosting — Cloudinary vs `/public/audio/`
7. AI-art tool — Midjourney, DALL-E, or Claude image API

**Other open:**
- Salkantay framework still pending build (Brady is back from Peru; the
  homepage Salkantay callout says "Framework coming soon")
- Charity model — paused, BCU is current partnership but not yet surfaced

## ARCHITECTURE PATTERNS (how this codebase works)

**Components & pages:**
- Components live at `src/` top-level with co-located `.css` (FrameworkPage.jsx + FrameworkPage.css). No `src/components/` or `src/pages/` folder.
- Inline sub-components inside a parent file is the convention (App.jsx has DataSpectacle, PhotoStrip, Nav, CursorGlow all inline).
- Pages import nav from App.jsx: `import { Nav } from './App'` then render `<Nav scrolled={true} />` — every existing route does this.
- Lazy-load each route in `src/main.jsx`: `const Foo = lazy(() => import('./Foo'))`, then `<Route path="/foo" element={<Foo />} />`.
- SEO per-route via `<Helmet>` from `react-helmet-async` (already in deps).

**Styling:**
- No Tailwind. CSS custom properties in `src/index.css :root` are the design system.
- Palette vars: `--gold #d4a843`, `--copper #b8886e`, `--cream #e8dcc8`, `--bg #141210`, `--surface #1c1915`.
- Type vars: `--editorial` (Fraunces), `--sans` (Inter), `--mono` (JetBrains), `--serif` (EB Garamond), `--display` (Space Grotesk). All 5 fonts loaded in `index.html`.
- `html { scroll-behavior: smooth }` is global — anchor links smooth-scroll without JS.
- `--radius` 16px, `--radius-sm` 10px, `--gold-border` rgba(212,168,67,0.22).

**Motion:**
- No framer-motion, no react-intersection-observer. The Reveal-on-scroll pattern is native `IntersectionObserver` adding a `.visible` class to elements that start `opacity: 0; transform: translateY(20px)`.
- GSAP is installed and used in the homepage hero only. Splitting.js for character-by-character hero text.
- Always respect `prefers-reduced-motion` — set static state immediately, skip animations.

**Routing:**
- Vercel `cleanUrls: true` means `/foo` resolves to `public/foo.html` *before* SPA rewrites. If a React route slug collides with a `public/*.html` file, the static file wins silently.
- Every React-only route MUST have an entry in `vercel.json` rewrites: `{ "source": "/foo", "destination": "/" }`.
- The 11 destination routes all rewrite to `/`. Static flagships at `/jordi` and `/vegas-zion-rise` stay (no rewrite needed).

**Workflow patterns that worked this session:**
- For moving large JSX blocks across a file, write a one-off Node script with string-anchor splice. Cleaner than 200-line Edit calls. Delete the script after use.
- For counting canonical stats, write a Node script that imports each `src/data/*.js` and tallies. Do NOT trust numbers already on the page.
- Verifying live deploys: `curl -sIL https://ladstravel.com/<slug>` for Content-Length (small = SPA fallback, large = static); grep `App-*.js` bundle for added strings (e.g., "226 SPOTS").
- Brady prefers **phased execution with a report between each phase** — never combine phases, never skip ahead, always stop and confirm before continuing.

**Editing flagships (jordi.html / vegas-zion-rise.html):**
- Self-contained single files with inline CSS. Editing them is direct.
- They cross-link to other frameworks in "MORE FRAMEWORKS" footer strips. Keep those targets aligned with React slugs (`/rome`, `/dublin`, etc.).

## RULES

- Never invent spots, prices, or recommendations
- Never push without showing the diff
- Never reuse another framework's palette
- Never add insurance content to any framework (see above)
- Never add the four-charity rotation back to the site (paused)
- Never mention Blood Cancer United on the site without explicit Brady go-ahead
- Always run `npm run build` before committing
- Always end sessions with CLAUDE.md updated
- For Pass B work: read `docs/framework-pass-b-spec.md` first
- For the /story route: content is locked verbatim, do NOT paraphrase
- Quality over deadline. Nothing ships until it's right.
