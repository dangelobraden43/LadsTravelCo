# THE LADS TRAVEL CO. — CLAUDE.md
## Last Updated: April 16, 2026 (evening)

---

## STATUS

Live: ladstravel.com (Vercel, auto-deploy on push)
Vercel fallback: lads-travel-co.vercel.app
Repo: dangelobraden43/LadsTravelCo
Stack: React + Vite, React Router, Three.js (react-three-fiber)
Email: brady@ladstravel.com (Google Workspace active)
Frameworks: 14 total (12 destination + vegas-zion-rise + jordi)

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

285 spots. Context tags needed on most.
Personal layer (ladsTake, forWho, story) mostly empty.
Brady fills these — they cannot be AI-generated.

---

## CHARITY MODEL

| Window | Cause | Charity |
|---|---|---|
| Late Apr/May | NPCA | National Parks Conservation Assoc. |
| Jun/Jul/Aug | TUFF | Uniform Funding Foundation |
| Late Aug/Sep | Breast Cancer | Ginny L. Clements Institute (U of Arizona) |
| Late Nov/Dec | Children's | C.S. Mott Children's Hospital |
| Rotating | Brady + Dawson | TBD each window |

Hoodie: $65 retail / ~$28 Printify cost / $37 → charity
Printify store: in progress

---

## CURRENT BUNDLE

Main chunk: ~15.7KB
three-vendor: 891KB
react-vendor: 250KB
Framework routes: 11-33KB each (lazy loaded)
Total: ~5.5MB across 26 chunks

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

SESSION 6 — FRAMEWORK ENGINE (Pass B):
Architecture decided: Hybrid approach. Keep homepage, rebuild FrameworkPage.jsx
into a cultural immersive experience. Full sensory stack per destination:
- Globe zoom → cinematic video transition → 3D scene → framework content
- Per-destination: ambient audio, Cloudinary video hero, palette shift,
  3D particle environment, scroll-aware scene evolution
- Data-driven from Airtable/JS files — one engine, all frameworks
- Design direction: "D — all of the above" (sensory + cinematic + interactive + layered)
Brady provides: ambient audio clips (sourced from Freesound/Pixabay), additional
Cloudinary video uploads, one-line vibe descriptions per destination
Spec not yet written — brainstorm paused mid-question, resume next session

SESSION 7 — MAIN SITE VISUAL LEAP (Pass C):
Bring immersive design back to homepage. Upgrade worlds system.
Depends on Session 6 engine being built first.

ALSO NEXT:
- Google Search Console: verify domain, submit sitemap
- Bing Webmaster Tools: verify (meta tag live)
- LinkedIn launch post (already drafted)
- Book CPA consult ($150-300, Michigan small business)
- Apply to Travelpayouts (higher affiliate rates than direct)
- ConvertKit free account + embed on site (email capture)
- Padnos International Center outreach (schedule post-Peru meeting)
- All 4 seasonal hoodies in HoodieShowcase.jsx
- Video integration complete (remaining 4 videos)
- Printify store connected to /giving

PRE-PERU (May 3):
- File MI LLC via LARA ($50, pending CPA input)
- Apply for Chase Ink Business Preferred
- Beta client framework delivered ✓ (vegas-zion-rise)
- Padnos + K-College outreach sent
- Personal layer on 30 spots Brady knows best

POST-PERU (May 14-17):
- Process Peru photos in Lightroom
- Build Salkantay framework (first adventure anchor)
- Buy domain, transfer DNS, update Vercel
- Public launch post — full narrative
- SEO sprint: 2-3 months Ahrefs/Semrush

FORD PERIOD (May 18 - Aug):
- Site on autopilot
- Stew handles first touch on all intakes
- Brady: calls evenings/weekends only
- Target: 8-12 frameworks delivered

FALL 2026:
- Phase 2 builds (adventure vertical, global calendar)
- Study abroad partnerships formalized
- Paid consulting path starts

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

- Two parallel framework systems exist:
  (a) Static HTML in public/ (jordi, vegas-zion-rise, italy, munich,
      thailand, iceland, spain, australia-nz, charleston, poland,
      prague-vienna, lads-local, dublin-galway)
  (b) React routes driven by src/data/*.js + FrameworkPage.jsx
      (rome, dublin, spain, australia, iceland, prague, munich, poland,
       thailand, michigan, charleston)
  Jordi + vegas-zion-rise prove (a) is the client-grade direction.
  Next session: pick one, delete the other, fix the overlap.

## RULES

- Never invent spots, prices, or recommendations
- Never push without showing the diff
- Never reuse another framework's palette
- Never add insurance content to any framework (see above)
- Always run npm run build before committing
- Always end sessions with CLAUDE.md updated
- Quality over deadline. Nothing ships until it's right.
