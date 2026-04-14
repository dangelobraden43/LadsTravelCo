# THE LADS TRAVEL CO. — CLAUDE CODE MASTER CONTEXT
## Last Updated: April 14, 2026

---

## STATUS

**Live Site:** Deployed on Vercel via GitHub (dangelobraden43/LadsTravelCo). Auto-deploys on every `git push origin main`.

**Completed:**
- Main site converted from static HTML to React (April 10, 2026)
- Migrated from inline Babel CDN to Vite build system (April 11, 2026) — proper React compilation, instant load
- v0 design system integrated: scroll-based architecture, pill nav, crossfading hero, filter tabs, photo-forward cards
- 60 base64 images total (29 original + 16 batch 1 + 15 batch 2 processed via sharp)
- Prague + Vienna + Dresden framework built (prague-vienna.html) — last placeholder link resolved
- All 6 destination cards with filter tabs (All/Validated/Bucket List)
- Scroll-triggered animations via Intersection Observer throughout
- All sections complete: Destinations, System (Travel Windows, Flight Intelligence, What You Get + quiz), Domestic, The Lads
- Lads Local Michigan rebuilt as featured domestic hero with 30+ spots across 5 categories
- Cal.com booking widget live (Book a Call button in Lads section)
- Umami analytics tracking all 12 pages
- Formspree intake form live (endpoint xvzvekkk)
- Brave Search MCP configured for web search in Claude Code sessions
- Body font fixed to Outfit on 5 frameworks, confidence label colors standardized
- Ryder Cup 2027 added to Bucket List, Charleston added to Domestic
- Old static site archived as index-old-babel.html

**Zero placeholder links remain.**

**APRIL 11, 2026 — SHIPPED TODAY:**
- Migrated from inline Babel to Vite build system (permanent infrastructure fix)
- v0 design system integrated as visual blueprint
- Cal.com booking widget live (Book a Call button)
- Umami analytics tracking all 12 pages
- Brave Search MCP configured for future sessions
- 16 new photos processed and integrated (75MB raw → 2.3MB via sharp)
- Hero carousel cycling 5 strongest shots with crossfade
- Photo strips between sections eliminating dead space
- Lads Local Michigan rebuilt as featured hero with 30+ spots across 5 categories
- Domestic section restructured: Michigan hero + other destinations below
- Stats rewritten to tell stories across all cards
- Custom commands created: /morning, /ship, /audit-all
- Econ research paper improved (44KB → 70KB, 5 new analytical methods)
- Brady personal context and site vision documented in internal/brady/
- Lads Summer Hub and AI Playbook created in internal/

**APRIL 11, 2026 — SESSION 2 (Fix-First + Improvements):**
- Full health check: 10 items audited, zero FAILs, foundation solid
- vercel.json: added cleanUrls for clean URL routing (/dublin instead of /dublin-galway.html)
- sitemap.xml + robots.txt added to public/
- OG meta tags completed (added og:url)
- Microsoft Clarity placeholder comment added to index.html + all 11 framework HTMLs
- Email capture section added between hero and destinations (Fall 2026 early access, wired to Formspree)
- Study abroad paragraph added to Lads section (GVSU Padnos International Center reference)
- Icelandair stopover callout added to iceland.html (up to 7 days free on transatlantic routes)
- Ryder Cup 2027 callout added to dublin-galway.html (Adare Manor, Sep 26-Oct 3 2027)
- 15 new photos processed via sharp (800px, q80, 2MB total) and added to images-new.js
- LinkedIn launch post drafted (internal/brady/linkedin-launch-post.md)
- Affiliate setup guide created (internal/brady/affiliate-setup.md) — Booking.com, Viator, GYG

**APRIL 11, 2026 — SESSION 3 (Strategic Repositioning):**
- Business model shifted: all services free through 2026, affiliate revenue only, paid consulting launches 2027
- Giving Back section added to main site: 5 charity causes matched to travel windows, donations go 100% to charity
- Hero label updated: "Free Personal Travel Consulting Through 2026"
- Email capture updated: reflects free model, no "launching" language
- Intake form messaging updated: "No cost through 2026. Seriously."
- Photo strips refreshed with batch 2 photos: Pantheon, Prague skyline, Fitzroy beach, Montserrat, Dresden, Bondi, Colosseum interior, rock arch PNW, Pilsner Urquell, koala, Spice Alley
- Added third photo strip between domestic and Lads sections
- Lads section photo row refreshed: Prague Old Town, surf group, Schonbrunn walk, mountain overlook
- Vibe selector verified: 6 vibes, all destination mappings logical, every destination in at least one vibe
- internal/brady/CONTEXT.md updated with 6-MONTH FREE MODEL section

**APRIL 11, 2026 — SESSION 4 (Pre-Launch QA Audit + Sprint Setup):**
- Full production bundle audit: 20/20 critical content checks pass in build output
- All 31 NEW_IMAGES keys verified present (16 batch 1 + 15 batch 2)
- 4 domestic cards received photos: San Juan (surfGroup), Phoenix (mountainOverlook), Las Vegas (spiceAlley), Charleston (bondiRocks) — all 9 domestic cards now have images
- Fixed domestic card renderer to check both IMAGES and NEW_IMAGES objects
- Link audit across all 11 framework HTMLs: 13 Google Maps links OK, 2 GYG links OK, 2 Viator links + 1 Icelandair blocked by bot protection (valid URLs, work in browser)
- Verified live Vercel deploy: sitemap.xml serving 12 URLs, robots.txt correct, framework pages loading
- Ryder Cup 2027 callout confirmed in dublin-galway.html, Icelandair stopover confirmed in iceland.html
- All framework HTMLs have Umami analytics and Microsoft Clarity placeholder
- Created internal/brady/3-WEEK-SPRINT.md — living priority roadmap (4 tiers, 20+ items)
- Updated /morning command to read sprint file and recommend from highest unchecked tier

**Active sprint:** `internal/brady/3-WEEK-SPRINT.md` is the living priority list. Every session starts with `/morning`.

---

## PLATFORM VISION (Updated April 14, 2026)

The site is a five-axis travel intelligence platform. One database. Five views.

AXIS 1 — City Immersion: 10 frameworks live
AXIS 2 — Adventure & Trekking: three-rung ladder (accessible → multi-day → expedition)
AXIS 3 — Road Trips & Routes: west coast spine Vancouver → Phoenix
AXIS 4 — Signature Events / Where We're Headed: Oktoberfest, Thailand NYE, TMB
AXIS 5 — Sacred Sites: filter + badge across all frameworks

Every spot has a `contexts` array that allows it to surface across multiple axes.
This is the data architecture decision that makes the platform possible.

## PERFORMANCE TARGET
Current bundle: 59MB (main chunk, base64 images split into 7 chunks)
Target: under 8MB initial load
Method: extract-images script → /public/images/ → Vercel CDN serves WebP
Status: Script created (scripts/extract-images.js), not yet run

## BUILD SESSION SEQUENCE
Session 1: Performance (image extraction + React.lazy routes)
Session 2: Where We're Headed section + Giving Back redesign
Session 3: Travel Windows immersive rebuild
Session 4 (post-Peru): Salkantay framework — first adventure anchor

## CHARITY WINDOWS (confirmed April 14, 2026)
Late Apr/May: NPCA
June/July/Aug: TUFF
Late Aug/Sep: Ginny L. Clements Breast Cancer Research (U of Arizona)
Late Nov/Dec: C.S. Mott Children's Hospital
Rotating: Brady + Dawson decide

## AUTOMATION TARGET (Summer 2026)
All client touchpoints automated except the 15-minute call.
Formspree → MailerLite sequence → Cal.com → framework delivery → post-trip survey
Brady touches: the call, the pipeline run, the delivery email.
Everything else runs.

---

## BUSINESS MODEL (Updated April 11, 2026)

**Free through 2026.** No consulting fees. No payments. Revenue from affiliate links only (Booking.com, Viator, GetYourGuide). Any donations go 100% to charity matched to travel windows. Paid consulting ($200-500/framework) launches 2027.

---

## PERSONAL CONTEXT & 3-WEEK SPRINT

### Personal Context

Brady has ~3 weeks before Ford Motor Company starts (May 18, 2026). This is the most open schedule he'll have for the foreseeable future.

- **Peru trip May 3-13** with roommate. Salkantay Trek to Machu Picchu. First case study for the site. Already fully planned (Peru_Trip_Guide.pdf).
- **After May 18:** Evenings and weekends only around Ford graduate program.
- **Poland trip August 2026** — bucket list framework becomes validated.
- **M.S. Applied Statistics graduation May 2027.**
- **Origin story:** The motivation for building this began winter 2025-26 when Brady broke his hand surfing in Costa Rica, which created extra free time from not being able to work out. That window became the 20-day build sprint.

### 3-Week Sprint Priorities (April 10 - May 3)

**Focus:** Get the website and all subworkflows as polished and automated as possible so everything runs over the summer and is ready to be picked up seriously in fall 2026.

**Week 1 — Operational Setup:**
1. Formspree (replace mailto on intake form)
2. Cal.com booking widget
3. Umami analytics
4. React site visual refinement based on Brady's feedback (fonts, photos, spacing)
5. Convert Babel CDN to Vite build (eliminates 1-2s load delay)

**Week 2 — Content & Visual Polish:**
1. Integrate remaining photos into React site and frameworks
2. Refine Tab 1 destinations (better hero images, elevated Iceland + Prague cards)
3. Refine Tab 2 system (more interactive depth, progressive disclosure)
4. Bulk up Tab 3 domestic cards with expandable content and photos

**Week 3 — Pre-Departure Lockdown:**
1. Full end-to-end test of every page, link, form, and booking widget
2. Verify automation: Formspree delivers, Cal.com syncs, Umami tracks
3. Final audit of all frameworks
4. Lock the site so it runs all summer without intervention

### Post-Peru Plan

- Domain purchase and DNS setup happen AFTER returning from Peru (not before)
- Build Peru HTML framework from trip photos and notes
- Site "launch" is post-Peru — share the URL publicly for the first time
- Summer: site runs on autopilot. Brady improves when inspired. Dawson contributes when he travels. Stew networks in Chicago.
- Fall 2026: The real push begins with client acquisition and marketing.

### What Claude Code Should Prioritize

When Brady sits down for a session, prioritize in this order:

1. **Automation and operational setup** (things that run without humans)
2. **Visual and content improvements** to the React site
3. **Framework builds or upgrades**
4. **Experimental features** (flight intelligence, rewards optimization)

Never prioritize visual tweaks over operational infrastructure.

---

## THE BUSINESS

The Lads Travel Co. is a personal travel consulting service built on firsthand experience across 20+ cities on four continents. Not a travel agency. Not a blog. Not a SaaS platform. A consulting service built on real knowledge and honest advice.

**The Differentiator:** 90% of AI-generated travel itineraries contain factual errors. Every other AI travel tool generates generic output from the same training data. The Lads have 650+ personally validated spots, cost models built by a data scientist, and a six-agent AI research system that can build a framework for any destination on earth. The combination of firsthand knowledge + data science + AI research + designed deliverables is not replicable by any single tool or competitor.

---

## THE TEAM

**Brady** — M.S. Applied Statistics (GVSU). Co-founder. The builder. Starting Ford Motor Company May 18, 2026. One year building LLMs and AI models at Farmers Insurance. Built the research system, the database, every framework, and the website. Former peer advisor at GVSU's Padnos International Center.

**Dawson** — Data Analytics (Kalamazoo College). Co-founder. Madrid study abroad, full Iceland Ring Road. Deep firsthand knowledge of Spain, Ireland, Iceland, Rome, Paris. The other half of every "Both Lads" validation label.

**Stew** — Sales. Moving to Chicago summer 2026. Handles client outreach, networking, intake pipeline. On the ground in Chicago. Went to Ireland with Brady and Dawson.

**Contribution model (summer):** Brady improves when inspired around Ford schedule. Dawson contributes city knowledge when he travels. Stew handles outreach from Chicago. No hard deadlines. Keep it fun.

---

## BRAND VOICE

Confident. Specific. Direct. Dry wit welcome. Like getting advice from a friend who's actually been there. No emoji in deliverables. No startup language. No generic travel writing. Never invent spots, prices, or recommendations not in the source documents or database.

---

## AUDIENCES

**Gooners (21-28):** Recently graduated or studying abroad. First real income. Want to travel but don't know how to plan. Overpay by 20-30% on flights. Need someone to say "here's exactly what to do." Acquisition: study abroad offices, Instagram/TikTok, friend networks.

**Elders (40-60):** Have money, want great experiences, want someone to handle logistics. Done the generic resort, ready for depth. Would pay $300-500 for a plan that works. Acquisition: parent networks, word of mouth.

**The Bridge:** Bucket list experiences. A 24-year-old and a 55-year-old both want Machu Picchu. Same destination intelligence — framework adjusts for budget, pace, accommodation style.

---

## VISUAL IDENTITY

### Palette (The Atlas)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#141210` | Main background |
| `--surface` | `#1c1915` | Card backgrounds |
| `--elevated` | `#242019` | Nested elements |
| `--gold` | `#c9a84c` | Primary accent |
| `--copper` | `#b8886e` | Secondary accent, personal validation |
| `--cream` | `#e8dcc8` | Primary text |
| `--cream2` | `#b8ad9a` | Secondary text |
| `--muted` | `#8a8070` | Tertiary text |
| `--dim` | `#5a5550` | Faint text |
| `--border` | `rgba(201,168,76,0.10)` | Default borders |
| `--border2` | `rgba(201,168,76,0.20)` | Accent borders |

### Typography
- **Headlines:** EB Garamond (serif) — non-negotiable
- **Body:** Outfit (sans-serif)
- **Labels / data:** JetBrains Mono (monospace)
- All three loaded via Google Fonts with `preconnect`

### Framework Palettes (each must be distinct)
| Destination | Background | Note |
|-------------|-----------|------|
| Dublin + Galway | `#0f1a15` | Dark green |
| Rome + Italy | `#1C1510` | Terracotta |
| Barcelona + Madrid | `#1C1714` | Warm brown |
| Australia + NZ | `#0B1A2E` | Deep navy |
| Iceland | `#1a1e24` | Volcanic slate |
| Munich | `#15120e` | Amber dark |
| Poland | `#12110f` | Warm stone |
| Thailand | `#0e0e0c` | Near-black |
| Prague + Vienna | TBD | Must differ from all above |

### Confidence Labels
- **Personally validated:** Copper `#b8886e`
- **Research-based:** Cool blue-grey `#8a9ab0`

---

## SITE STRUCTURE (index.html)

### Tab 1 — Destinations
Large cards: Dublin+Galway, Rome+Italy, Barcelona+Madrid, Australia+NZ
Side-by-side: Iceland, Prague+Vienna+Dresden
Post-May: Peru/Machu Picchu joins as validated

### Tab 2 — The System
Five-step process → Travel Windows (4 expandable) → How We Find the Deals (11 cards) → Bucket List (7 items) → Database display → What You Get (5 expandable with quiz)

### Tab 3 — Lads Domestic
Lads Local Michigan hero + domestic cards (Jaco, San Juan, Vancouver, Seattle, Phoenix, Smoky Mountains, Vegas, Charleston)

### Tab 4 — The Lads
Bios, mission, build story, intake form, contact

---

## FILE INVENTORY

### Deployed (12 HTML + React main)
`index.html` (React app) · `dublin-galway.html` · `italy.html` · `spain.html` · `australia-nz.html` · `iceland.html` · `munich.html` · `poland.html` · `thailand.html` · `prague-vienna.html` · `lads-local.html` · `charleston.html`

### Archived
- `index-static-backup.html` — original static site, preserved for rollback

### Not Yet Built
- **Peru / Machu Picchu** — PDF complete. After May trip.
- **Ryder Cup 2027 Ireland** — PDF complete. Bucket list build.

### Project Structure
```
lads-travel-co/
├── index.html              ← React app (live)
├── index-static-backup.html ← old static site (archived)
├── CLAUDE.md
├── audit_results.md
├── prague-vienna.html       ← NEW framework
├── .gitignore
├── .mcp.json
├── .claude/
│   ├── settings.json
│   └── skills/ (deploy, audit, optimize, links, build)
├── testing/
│   ├── lads-react-v1.jsx   ← React source
│   └── preview.html        ← browser preview
├── photos/                  ← gitignored, 140+ images
├── internal/                ← gitignored, build scripts
└── [11 framework HTML files]
```

---

## DATABASE

### Spots by City
Sydney: 123 | Barcelona: 115 | Rome: 43 | Dublin: 39 | Prague: 38 | Vienna: 37 | Costa Rica: 28 | Tasmania: 27 | Vancouver: 22 | Chicago: 15 | Galway: 15 | San Juan: 14 | Seattle: 14 | Smoky Mountains: 8 | Phoenix: 7

### Pending Extraction
Madrid (Dawson), Iceland (Dawson), Paris (Dawson), Cancun (Dawson), Charleston, Detroit/Dearborn, Munich

---

## GOOGLE MAPS LINKS (18)

Dublin Pubs: maps.app.goo.gl/NrZtg6tUR1Rjk8oS8 · Dublin Attractions: maps.app.goo.gl/9YLakDkjrE6jj7cQA · Galway: maps.app.goo.gl/deRD11SQis6ZUsKL8 · Rome Food: maps.app.goo.gl/kmFjNeA6k8BHuHWT8 · Rome Attractions: maps.app.goo.gl/RAS5mqRhc6BYTa5D6 · Barcelona Food: maps.app.goo.gl/bZp95gDP9VwBe6Kd7 · Barcelona Bars: maps.app.goo.gl/2LZGLZQEuT53NK3Z8 · Barcelona Attractions: maps.app.goo.gl/63o5dgY5Fr8SJUZk6 · Vienna: maps.app.goo.gl/R4TC9toa9oP5qJed8 · Prague Attractions: maps.app.goo.gl/e3pGDSj6PCcPEy8j7 · Prague Bars: maps.app.goo.gl/o7BCdPPpzPHJsEA59 · Dresden: maps.app.goo.gl/FYEJQFkTJVyqZr1x7 · Vancouver Bars: maps.app.goo.gl/9n9uM7NG8Sa2aA8 · Vancouver Attractions: maps.app.goo.gl/4moCgAkEHz5uJbQ9A · Jaco: maps.app.goo.gl/hc199wu19C6cKj9G6 · San Juan: maps.app.goo.gl/ZWM8LXFGV9QpS8fB7 · Seattle: maps.app.goo.gl/Fr7KdvoLsnXeBV1q8 · Phoenix: maps.app.goo.gl/PTJn6coPBcRDKbHw5

---

## TOUR LINKS (9)

Cliffs of Moher: viator.com/tours/Galway/...d5156-8625P1 · Wicklow+Kilkenny: gyg.me/V0UrxNUe · Pompeii+Amalfi: gyg.me/c6cN0bz2 · Montserrat+Girona+Sitges: viator.com/tours/Barcelona/...d562-6874P164 · ATV Jaco: gyg.me/0vVQ5scX · Huacachina Escape: viator.com/tours/Lima/...d928-394413P1 · Rainbow Mountain ATV: viator.com/tours/Cusco/...d937-414208P7

---

## PRIORITIES

### Track 1 — Builds
1. Prague + Vienna + Dresden framework (last placeholder)
2. Peru HTML (post-May — first case study)
3. Ryder Cup 2027 bucket list framework
4. Domestic card expansion with photos

### Track 2 — Site Elevation
1. Photo integration (once photos/ is populated)
2. React conversion exploration (unlocks v0, interactivity)
3. Formspree, Cal.com, Umami analytics, custom domain
4. Visual differentiation from vibe-coded aesthetic

### Track 3 — Experimental
1. Flight Intelligence top 5 deals (ORD/DTW, monthly)
2. Travel rewards optimization deliverable
3. Wellness/adventure vertical concept
4. Progressive Web App

---

## REVENUE

**2026 (Year 0):** Free service. Affiliate revenue only (Booking.com, Viator/GYG at 8%). Donations go 100% to charity.

**2027 (Year 1):** Consulting fee ($200-500/framework) · Affiliate (Viator/GYG at 8%) · Rewards optimization add-on · Group coordination margin · Study abroad advising

---

## TIMELINE

**Now → Mid-May:** Infrastructure sprint. Brady's open window.
**May 3-13:** Peru trip. First case study. Document everything.
**May 18:** Brady starts Ford.
**Summer:** System runs. Improvements when inspired.
**August:** Poland trip. Bucket list → validated.
**Fall 2026:** The real push begins.

---

## RULES

- Never invent information not in source files
- Never reuse another framework's palette
- Never mention insurance anywhere
- Never push without showing the diff
- Never use any email other than dangelobraden43@gmail.com
- Always use EB Garamond for headlines, Outfit for body, JetBrains Mono for labels
- Always distinguish personal validation (copper) from research (blue-grey)
- Always prioritize mobile responsiveness
- Quality over deadline. Nothing ships until it's right.

---

## CLAUDE CODE USAGE

### Effort Levels
- **`/effort high`** — Framework builds, site architecture changes, multi-file refactors, new features, anything touching the React app structure
- **`/effort low`** — Quick lookups, reading files, answering questions about the codebase, small text edits, git operations

### Custom Commands
- **`/morning`** — Reads CLAUDE.md + CONTEXT.md + SITE_VISION.md, outputs today's top 3 priorities based on sprint week
- **`/ship`** — Shows diff, suggests commit message, waits for confirmation before committing and pushing
- **`/audit-all`** — Runs audit against all 11 framework HTML files, outputs single summary table

### Context Management
- Run `/compact` proactively when working on large files (index.html is 2400+ lines)
- If a session involves multiple framework edits, compact between frameworks
- Long sessions: compact after every major milestone before starting the next task
