# THE LADS TRAVEL CO. — CLAUDE.md
## Last Updated: May 31, 2026

---

## STATUS

Live: ladstravel.com (Vercel, auto-deploy on push)
Vercel fallback: lads-travel-co.vercel.app
Repo: dangelobraden43/LadsTravelCo
Stack: React + Vite, React Router, Three.js (react-three-fiber)
Email: brady@ladstravel.com (Google Workspace active)
Posture: PREVIEW — paid services launch Fall 2026.
Structure: LLC. No charity, no nonprofit, no "free" anywhere on site.
Frameworks: 11 React destination routes (no static flagships)
Peru completed. Ford started May 18.

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
| **Lads Global** | `/global` | International frameworks (Dublin, Spain, Rome, Iceland, Prague, Australia, Munich, Poland, Thailand) |
| **Lads Outdoors** | `/outdoors` | Treks/hikes — Ladder concept (Base Camp · Multi-Day · Expedition). Salkantay is the first validated trek. |
| **Lads Bucket List** | `/bucket-list` | Events/festivals/sports/holidays (Vivid Sydney, Oktoberfest, Ryder Cup '27, Christmas Markets). Calendar view planned. |
| **Lads Local** | `/local` | Domestic + close-to-home (Michigan, Charleston). Engineered the same as international. |

Footer carries: Follow Along (socials, blog later), The Lads (team),
brand mark. Everything else in nav is dead.

---

## DATABASE

Source of truth: Airtable base
Sync command: `npm run sync` (pulls Airtable → src/data/)
Export command: `npm run export` (src/data/ → CSV)
Build: `npm run sync:build` (sync + build together)

**Live counts on homepage Featured Work** (recomputed at mount via
the inline `countSpots()` walker in App.jsx):

| Framework | Live count (full walk) | Fully-structured spots |
|---|---|---|
| dublin | 37 | 34 |
| spain | 38 | 33 |
| rome | 27 | 24 |
| prague | 25 | 23 |
| iceland | 23 | 22 |
| australia | 22 | 19 |
| michigan | 21 | 21 (different schema) |
| charleston | 16 | 16 |
| poland | 15 | 12 |
| thailand | 13 | 13 |
| munich | 11 | 9 |

Featured Work cards show the live count. If you'd rather show the
"fully-structured" number (neighborhood + category + validated + vibeTags
all present), tighten `countSpots()` to require those fields.

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
dist/ total:       53 MB (incl. all images)
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

## SESSION SEQUENCE (what's next)

**Pass B framework engine spec** at `docs/framework-pass-b-spec.md` is
DORMANT. Reference only. Not the active backlog item.

Immediate candidates (no priority assigned — Brady picks):
- **Globe pin data fix.** Hardcoded `CITIES` array in `src/Globe.jsx`
  sums ~530 spots vs the canonical 226. Five cities (Reykjavik, Munich,
  Krakow, Bangkok, Charleston) have `n: 0` and render as tiny pins
  indistinguishable from validated cities. Sync `n` to real per-framework
  counts, add a `validated` flag, differentiate validated vs research-
  built pins by color/style.
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
/audit-all — checks all 11 framework data files
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

- **Globe pin data is stale** — hardcoded `CITIES` array in `src/Globe.jsx`
  sums ~530 spots vs the canonical 226, and 5 cities (Reykjavik, Munich,
  Krakow, Bangkok, Charleston) have `n: 0` and render as tiny
  indistinguishable pins. Fix: sync `n` to real per-framework counts,
  add a `validated` flag, differentiate validated vs research-built pins
  by color/style.
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

**Workflow patterns that worked:**
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
