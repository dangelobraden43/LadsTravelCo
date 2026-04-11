# THE LADS TRAVEL CO. — CLAUDE CODE MASTER CONTEXT
## Last Updated: April 10, 2026

---

## STATUS

**Live Site:** Deployed on Vercel via GitHub (dangelobraden43/LadsTravelCo). Auto-deploys on every `git push origin main`.

**Completed:**
- Main site converted from static HTML to React (April 10, 2026)
- React site uses inline Babel transpilation via unpkg CDN — future optimization: convert to Vite/Next.js build
- 31 base64 images embedded (11 original + 18 new photos from photos/ folder + 2 SVG)
- 18 new photos integrated: Montserrat, Pantheon, Colosseum interior, Prague aerial, Pilsner Urquell brewery, Bondi rocks, koala, Spice Alley, Costa Rica viewpoint, and more
- Prague + Vienna + Dresden framework built (prague-vienna.html) — last placeholder link resolved
- All 6 destination cards now full-size (Iceland and Prague elevated from side-by-side)
- Scroll-triggered animations via Intersection Observer throughout
- All 4 tabs complete: Destinations, System (Travel Windows, Flight Intelligence, What You Get + quiz), Domestic, The Lads
- Body font fixed to Outfit on 5 frameworks, confidence label colors standardized
- Ryder Cup 2027 added to Bucket List, Charleston added to Domestic
- Old static site archived as index-static-backup.html

**Zero placeholder links remain.**

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

## REVENUE (Not Finalized)

Consulting fee ($200-500/framework) · Affiliate (Viator/GYG at 8%) · Rewards optimization add-on · Group coordination margin · Study abroad advising

Not the summer priority. Ready for fall push.

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
