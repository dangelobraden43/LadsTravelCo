# THE LADS TRAVEL CO. — CLAUDE CODE MASTER CONTEXT
## Everything Claude Code Needs to Continue the Build
## Last Updated: April 9, 2026

Save this file as `CLAUDE.md` in your `C:\Users\brady\lads-travel-co` folder.
Claude Code reads it automatically every session.

---

## STATUS AS OF APRIL 9, 2026

**LIVE SITE:** Deployed on Vercel via GitHub (`dangelobraden43/LadsTravelCo`). Auto-deploys on every `git push`.

### Completed Today
- Main site v4 built and deployed (`index.html`)
- All 8 frameworks audited against quality rubric
- Universal fixes applied across all 8 (Outfit font, OG tags, preconnect, email, insurance removed)
- Munich, Thailand, Poland rebuilt from scratch using synthesis docs
- Iceland: Dawson attribution fixed, Quick Read added, 4 photos embedded (Westman Islands, Oxararfoss, Eldfell overlook, Eldfell close-up)
- Dublin, Italy, Spain, Australia: Google Maps links added, Quick Read added, First-Timers added, spot counts corrected, tour booking links fixed
- Confidence label colors standardized across all frameworks (research = blue-grey `#8a9ab0`, validated = copper)
- All files renamed to clean URLs
- Research docs (docx, pdf, xlsx) gitignored to keep repo lightweight
- Stale dates and deadlines updated across 4 files (Poland, Iceland, Munich, Charleston)
- All placeholder framework links in `index.html` replaced with real relative paths
- GitHub repo created and first push complete (21 files, 16,677 lines)
- Vercel deployment live and auto-deploying

### Tomorrow's Priorities
1. Build Prague + Vienna + Dresden framework from scratch (synthesis needed — use database spots for Vienna 37, Prague 38 + personal photos: St. Vitus, Schonbrunn, Dresden square, Pilsner Urquell)
2. Explore Vercel dashboard — custom domain, analytics, Speed Insights
3. Begin converting main site from static HTML to React (enables v0 components, better interactivity)
4. Set up Formspree to replace mailto on intake form
5. Set up Cal.com booking widget
6. Evaluate v0 by Vercel for UI component generation
7. Explore Claude Code MCP servers (GitHub MCP already configured in `.mcp.json`)

### Remaining Placeholder
- 1 `href="#"` in `index.html` for Prague + Vienna + Dresden (no framework built yet)

---

## WHO THIS IS

Brady D'Angelo and Dawson. Two guys who've actually been there.

**Brady** — M.S. Applied Statistics (GVSU). Studied abroad in Sydney six weeks. 25+ countries, 4 continents. Built the AI research system behind every client deliverable. Former peer advisor at GVSU's Padnos International Center. Starting at Ford Motor Company May 18th, 2026.

**Dawson** — Data Analytics (Kalamazoo College). Studied abroad in Madrid. Full Iceland Ring Road. Deep knowledge of Spain, Ireland, Iceland, Rome. 35+ pubs in Ireland in one week.

**The business:** Personal travel consulting service. Not a travel agency. Not a blog. A consulting service built on real knowledge and honest advice. Contact: dangelobraden43@gmail.com

---

## BRAND VOICE

Confident. Specific. Direct. Dry wit welcome. Like getting advice from a friend who's actually been there. No emoji in deliverables. No startup language. No generic travel writing. Never invent spots, prices, or recommendations not in the source documents or database.

---

## VISUAL IDENTITY

### Main Site Palette (The Atlas)
| Element | Value |
|---------|-------|
| Background | `#141210` |
| Surface / cards | `#1c1915` |
| Elevated | `#242019` |
| Gold primary | `#c9a84c` |
| Copper secondary | `#b8886e` |
| Cream text | `#e8dcc8` |
| Muted text | `#8a8070` |
| Dim text | `#5a5550` |
| Border | `rgba(201, 168, 76, 0.12)` |
| Border accent | `rgba(201, 168, 76, 0.25)` |

### Typography
- **Headlines / display:** EB Garamond (non-negotiable)
- **Body:** Outfit
- **Labels / data / mono:** JetBrains Mono

### Framework-Specific Palettes
Each framework HTML has its own distinct visual identity:
- Dublin/Galway: dark green `#0f1a15` / gold
- Rome/Italy: terracotta `#1C1510` / amber `#C9883A`
- Spain: warm brown `#1C1714` / gold `#D4A039`
- Australia/NZ: deep navy `#0B1A2E` / coral `#D4835E`
- Iceland: volcanic slate `#1a1e24` / ice-blue
- Munich: dark / amber-gold `#C9A84C`
- Thailand: near-black `#0e0e0c` / gold
- Poland: dark warm-brown `#12110f` / stone

### Destination Card Accent Borders (main site)
- Dublin + Galway: `#2a6b3a` (pub green)
- Rome + Italy: `#bc6c25` (terracotta)
- Barcelona + Madrid: `#8a3040` (warm burgundy)
- Australia + NZ: `#c26e52` (coral)
- Iceland: `#6a8ea8` (glacial blue)
- Prague + Vienna: `#7a6a4a` (old stone)
- Munich: `#c9a84c` (amber gold)
- Poland: `#a07850` (warm stone)
- Thailand: `#3a7a6a` (tropical teal)

### Confidence Label System
- **Personally validated:** Copper warm left-border treatment
- **Research-based:** Cool blue-grey treatment
- These are visually separated, never conflated

---

## FOUR-TAB SITE STRUCTURE

### TAB 1 — DESTINATIONS
Six personally validated destination cards with:
- Full-bleed hero photo with gradient overlay
- Route line (DUBLIN → KILKENNY → GALWAY → CLIFFS OF MOHER)
- "What's Inside" stat boxes (meaningful to that specific trip)
- "Day Trips That Make This Trip" section with bookable tour links
- Description that previews what's in the framework
- Google Maps list links
- Framework link (placeholder # until Vercel URLs are live)

Featured destinations (large cards):
1. Dublin + Galway — Both Lads
2. Rome + Italy — Both Lads
3. Barcelona + Madrid — Both Lads
4. Australia + NZ — Brady

Also Validated (side-by-side cards):
5. Iceland — Dawson
6. Prague + Vienna + Dresden — Brady

### TAB 2 — THE SYSTEM
- Five-step "How It Works" process
- Research Engine description (six AI agents)
- **The Lads Bucket List** — bold integrated section:
  - Munich Oktoberfest (Framework Ready)
  - Poland August (Framework Ready)
  - Thailand NYE (Framework Ready)
  - Tour du Mont Blanc (Building)
  - Pilsenfest + Prague (Building)
  - Camp Nou Reopening (Building)
  - Ryder Cup 2027 Ireland (Building) — NEW
- Database display (city-by-city spot counts)
- Travel Windows (4 optimal windows)
- What You Get (deliverables breakdown)

### TAB 3 — LADS DOMESTIC
- Lads Local Michigan Intelligence (featured hero with stats)
- Domestic destination cards: Jaco, San Juan, Vancouver, Seattle, Phoenix, Smoky Mountains, Vegas, Charleston
- Each with database spot counts, key spots, Google Maps links

### TAB 4 — THE LADS
- Stoutie hero photo
- Brady bio + Dawson bio
- Study abroad mission (one paragraph)
- 20-day build story (one paragraph)
- Intake quiz (full form)
- Cal.com widget placeholder
- Contact email

---

## FILE INVENTORY

### Main Site
- `index.html` — deployed main site (v4)

### Framework HTMLs (9 deployed + Peru + Prague pending)
| File | Destination | Validation | Status |
|------|-------------|-----------|--------|
| `dublin-galway.html` | Dublin + Galway | Both Lads | Audited + fixed |
| `italy.html` | Rome + Italy | Both Lads | Audited + fixed |
| `spain.html` | Barcelona + Madrid | Both Lads | Audited + fixed |
| `australia-nz.html` | Australia + NZ | Brady | Audited + fixed |
| `iceland.html` | Iceland | Dawson | Audited + fixed, photos embedded |
| `munich.html` | Munich Oktoberfest | Research | Rebuilt from synthesis |
| `poland.html` | Poland August | Research | Rebuilt from synthesis |
| `thailand.html` | Thailand NYE | Research | Rebuilt from synthesis |
| Peru_Trip_Guide.pdf | Machu Picchu | Brady (post-May) | Complete PDF — needs HTML build |
| (not yet built) | Prague + Vienna + Dresden | Brady | Needs full build |

### Domestic / Other Pages
- `lads-local.html` — Michigan Intelligence
- `charleston.html` — Charleston one-pager

### Research / Synthesis Documents (gitignored — not in deployed repo)
- Lads_Travel_Co_Munich_Oktoberfest_2026_Synthesis (1).pdf
- Poland_2026_Master_Synthesis (1).pdf
- Thailand_Synthesis_Master (1).pdf
- Peru_Trip_Guide.pdf
- Ryder_Cup_2027_Ireland_Guide.pdf
- Lads_LA.pdf
- Poland_Experience_Architecture_2026 (1).docx
- Poland_Ways_To_Save_2026 (1).docx
- Thailand_Experience_Brief (1).docx
- Ways_To_Save_Thailand_2026 (1).docx
- Ways_To_Save_Pass2_Munich_Oktoberfest_2026 (1).docx
- Iceland (1).docx / Iceland_2026_Lads_Travel_Co.docx
- Dublin_Galway_Lads_Travel_Co.docx
- Australia_NZ_Lads_Travel_Co.docx
- Spain_2026_Lads_Travel_Co (1).docx
- Italy_2026_Lads_Travel_Co (1).docx

### Other Assets (gitignored)
- lads-database-v1.xlsx — 285 rated spots, 14 cities, 19 in pipeline

---

## DATABASE STATS (from lads-database-v1.xlsx)

### Rated Spots by City
Barcelona: 55 | Sydney: 57 | Dublin: 30 | Rome: 33 | Prague: 23 | Vienna: 26 | Tasmania: 18 | Galway: 15 (100%) | Vancouver: 9 | Costa Rica: 6 | Smoky Mountains: 5 | Chicago: 4 | San Juan: 3 | Seattle: 1

### Total Spots in Database (rated + unrated)
Sydney: 123 | Barcelona: 115 | Rome: 43 | Dublin: 39 | Prague: 38 | Vienna: 37 | Costa Rica: 28 | Tasmania: 27 | Vancouver: 22 | Chicago: 15 | Galway: 15 | San Juan: 14 | Seattle: 14 | Smoky Mountains: 8 | Hawaii: 7 | Phoenix: 7

### Pending Cities (not yet extracted)
Cancun (Dawson) | Charleston | Detroit/Dearborn | Iceland (Dawson) | Madrid (Dawson — priority) | Munich | Paris (Dawson)

---

## GOOGLE MAPS LINKS

| # | Link | Destination |
|---|------|-------------|
| 1 | https://maps.app.goo.gl/ZWM8LXFGV9QpS8fB7 | San Juan |
| 2 | https://maps.app.goo.gl/Fr7KdvoLsnXeBV1q8 | Seattle + Olympic |
| 3 | https://maps.app.goo.gl/PTJn6coPBcRDKbHw5 | Phoenix + Golf |
| 4 | https://maps.app.goo.gl/NrZtg6tUR1Rjk8oS8 | Dublin Pubs & Food |
| 5 | https://maps.app.goo.gl/9YLakDkjrE6jj7cQA | Dublin Attractions |
| 6 | https://maps.app.goo.gl/deRD11SQis6ZUsKL8 | Galway |
| 7 | https://maps.app.goo.gl/9n9uM7NG8Sa2aA8 | Vancouver Bars |
| 8 | https://maps.app.goo.gl/4moCgAkEHz5uJbQ9A | Vancouver Attractions |
| 9 | https://maps.app.goo.gl/kmFjNeA6k8BHuHWT8 | Rome Food & Drink |
| 10 | https://maps.app.goo.gl/RAS5mqRhc6BYTa5D6 | Rome Attractions |
| 11 | https://maps.app.goo.gl/bZp95gDP9VwBe6Kd7 | Barcelona Food |
| 12 | https://maps.app.goo.gl/hc199wu19C6cKj9G6 | Jaco |
| 13 | https://maps.app.goo.gl/2LZGLZQEuT53NK3Z8 | Barcelona Bars |
| 14 | https://maps.app.goo.gl/63o5dgY5Fr8SJUZk6 | Barcelona Attractions |
| 15 | https://maps.app.goo.gl/R4TC9toa9oP5qJed8 | Vienna Bars |
| 16 | https://maps.app.goo.gl/e3pGDSj6PCcPEy8j7 | Prague Attractions |
| 17 | https://maps.app.goo.gl/o7BCdPPpzPHJsEA59 | Prague Bars |
| 18 | https://maps.app.goo.gl/FYEJQFkTJVyqZr1x7 | Dresden |

---

## TOUR LINKS (Recommended Day Trips)

| Destination | Tour | Link |
|-------------|------|------|
| Galway | Cliffs of Moher + Burren | https://www.viator.com/tours/Galway/Cliffs-of-Moher-and-Burren-Day-Trip-Including-Dunguaire-Castle-Aillwee-Cave-and-Doolin-from-Galway/d5156-8625P1 |
| Jaco | 2 Hour ATV Jungle Adventure | https://gyg.me/0vVQ5scX |
| Rome | Pompeii + Amalfi + Sorrento | https://gyg.me/c6cN0bz2 |
| Barcelona | Montserrat + Girona + Sitges | https://www.viator.com/tours/Barcelona/From-Barcelona-Montserrat-Girona-and-Sitges-Full-Day-Tour/d562-6874P164 |
| Dublin | Wicklow + Glendalough + Kilkenny | https://gyg.me/V0UrxNUe |
| Lima/Peru | Paracas + Ica + Huacachina | https://www.viator.com/tours/Lima/ESCAPE-FROM-LIMA-Full-Day-Paracas-Ica-and-Huacachina-All-Included/d928-394413P1 |
| Cusco/Peru | Rainbow Mountain ATV | https://www.viator.com/tours/Cusco/Private-Tour-in-Red-Valley-with-ATV-and-Rainbow-Mountain/d937-414208P7 |

---

## PHOTOS AVAILABLE

### On Main Site (Tab 1 card heroes)
- Cliffs of Moher → Dublin card
- Colosseum at night → Rome card
- Sagrada Familia sunset → Spain card
- Opera House sunset → Australia card
- Eldfell crater overlook → Iceland card
- St. Vitus Cathedral → Prague card

### On Main Site (Tab 4)
- Guinness Stoutie (both lads) → Lads hero
- Surf camp group → Study abroad context

### Available for Framework HTMLs (not on main site)
- Guinness pint in pub (Dublin)
- Kilkenny Castle (Ireland)
- Sistine Chapel ceiling (Rome)
- St. Peter's Basilica (Rome)
- Montserrat viewpoint (Spain)
- Opera House night/Vivid (Sydney)
- Rock pools / tidal shelf (Sydney)
- Nightclub smiley inflatables (Sydney)
- Kangaroos (Australia)
- Surf camp group (Sydney)
- Schonbrunn Palace (Vienna)
- Dresden Hofkirche square (Dresden)
- Pilsner Urquell brewery (Pilsen)
- Oxararfoss waterfall (Iceland)
- Westman Islands (Iceland)
- Eldfell volcanic close-up (Iceland)

---

## WORKFLOW & PRIORITIES

### Track 1 — Opus (Creative Builds)
1. ✅ Main website v4 (complete — this session)
2. Prague + Vienna + Dresden framework (new build from scratch)
3. Munich Oktoberfest rebuild
4. Thailand NYE rebuild
5. Peru/Machu Picchu HTML build (from PDF)
6. Ryder Cup 2027 Ireland build (from PDF)

### Track 2 — Sonnet (Audits via Claude Code)
Audit all frameworks against quality rubric:
- Dublin/Galway, Italy, Australia/NZ, Spain, Iceland, Poland
- Each audit checks: copy consistency, visual polish, data accuracy, structure, photo integration

### Quality Rubric for Audits
**Copy:** Personal validation voice consistent? Research sections labeled? Sound like latest frameworks (Barcelona, Rome)?
**Visual:** Distinct palette? Confidence label styles correct? Tables clean on mobile? Typography hierarchy clear?
**Data:** Cost models current for 2026? Flight prices right range? Venue references still open? Timing windows match (Late Nov, Late April, Sept post-Labor Day)?
**Structure:** Quick Read section? What First-Timers Get Wrong? Interpretive Layer? Correct group sizes?
**Photos:** Personal photos from Brady/Dawson? Photo slots designed well?

### Launch Gate
Nothing goes live until:
- All frameworks pass the quality rubric
- All placeholder # links replaced with real Vercel URLs
- All photos integrated
- All Google Maps links mapped
- Formspree replaces mailto
- Cal.com widget embedded
- Open Graph meta tags on every HTML

### Timeline
Quality over deadline. No rush. But Machu Picchu (May 2026) is the natural milestone.

---

## INTAKE QUIZ FIELDS (in order)
Name* | Email* | International or Domestic (toggle) | Destination (text + "not sure yet") | Travel Dates (text, "flexible" valid) | Group Size (2 / 3-4 / 5-6 / 7-10 / 10+) | Budget Per Person (Under $1K / $1-2K / $2-3K / $3-5K / $5K+ / Not sure) | Trip Style (multi-select: Nightlife / Culture / Beach / Adventure / Food & Drink / Mix) | Cities Already Visited (optional) | Savings Priority (Flights / Accommodation / Food & Drink / Activities / All) | How'd You Hear About Us? (Friend / Social media / Study abroad office / Google / Other) | Anything Else? (textarea)

Post-submit: "Got it. Brady will follow up within 24 hours." Form submits via mailto to dangelobraden43@gmail.com (temporary until Formspree).

---

## DEPLOYMENT PATH
1. All HTML files in `C:\Users\brady\lads-travel-co`
2. `git init` → `git add .` → `git commit -m "initial"`
3. Create GitHub repo `lads-travel-co`
4. Push to GitHub
5. Import to Vercel → instant deployment
6. Buy domain (ladstravelco.com or similar)
7. Point DNS at Vercel
8. Replace all # placeholder links with real Vercel URLs
9. Push update → Vercel auto-deploys

---

## DESIGN PRINCIPLES (for any new build)
- Warm near-black base, not green — green is Dublin's identity
- Each framework card carries a subtle left-border accent in its destination palette
- Restrained, typographic, consultancy feel — frameworks are the rich moments, the site is the frame
- Confidence through what's NOT there — no parallax, no animated gradients, no gimmicks
- Insurance is non-negotiable in all frameworks — SAAP/GP coverage framed as mandatory
- Sensitive content (Auschwitz, etc.) acknowledged once with deliberate restraint
- Day trips are highlighted prominently — they turn city trips into multi-destination experiences
- Personal photos only on the main site — no stock, no AI-generated
- If no photo exists for a destination, use a dark textured card with destination name (intentional absence)

---

## WHAT CLAUDE CODE SHOULD NEVER DO
- Invent spots, prices, or recommendations not in the source files
- Use the same visual palette across different framework builds
- Conflate personal validation voice with research-based voice
- Apply a template — every destination gets a distinct visual treatment
- Produce anything that sounds like a travel blog or corporate report
- Settle for generic when specific would serve the content better
