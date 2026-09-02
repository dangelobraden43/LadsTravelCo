# THE LADS TRAVEL CO. — CLAUDE.md
## Last Updated: September 2, 2026

---

## STATUS

Live: ladstravel.com (Vercel, auto-deploy on push)
Vercel fallback: lads-travel-co.vercel.app
Repo: dangelobraden43/LadsTravelCo
Stack: React + Vite, React Router, Three.js (react-three-fiber)
Email: brady@ladstravel.com (Google Workspace active)
Posture: PREVIEW — **launch target JANUARY 1, 2027, quality-gated.**
Structure: LLC. No charity, no nonprofit, no "free" anywhere on site.
Frameworks: **10** React destination routes (Vienna split from Prague Aug 29)
Canonical total: **220 spots · 13 validated cities · 10 countries · 3 continents**
  (219 → 220 on Aug 31 via Short's Elk Rapids in michigan.js)
⭐ **READ `THE VISION AND THE TIMELINE` FIRST** — it is the plan everything
  serves. Then `THE NEW FRAMEWORK AGENDA`, which is the September build slate.
Peru completed. Ford started May 18.
LIVE: **`/local` IS THE MAP** (graduated Sept 2, 2026). Full MIDWEST canvas
  (MN·WI·MI·IL·IN·OH + the Ontario shore) as the page hero, under the banner
  identity **"Good Brews · Good Views · Good News"**. Indexed, in nav, with a
  companion list beside it. **83 markers: 25 gold validated · 58 copper
  candidates**, plus 14 validated-but-unplaceable spots named in the list only.
  ⛔ **`/good-news` is RETIRED** — it permanently redirects to `/local`. Do not
  re-add its route or its rewrite.
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

## ⭐ THE VISION AND THE TIMELINE (set September 1, 2026 — read this before the queue)

> This section replaces `internal/brady/3-WEEK-SPRINT.md`, which was an April 11 –
> May 3, 2026 document and had been stale for four months. It is **archived** at
> `internal/brady/archive/3-WEEK-SPRINT-2026-04-11--05-03-ARCHIVED.md`. Do not plan
> from it and do not resurrect its tiers. `/morning` no longer reads it.

### THE VISION

**The Lads Travel Company is the trust layer of travel.**

AI researches. Founders validate on foot. Travelers get plans they can stake a
weekend on.

**2027 is the year strangers pay for it.**

Everything below exists to make that sentence true on schedule, and every rule
already in this file — the endorsement gradient, the Tivoli rule, gold-vs-copper
tiers, "never invent spots, prices, or recommendations," the silence of the 16
Peru places — is not friction against that goal. It **is** the product. The trust
layer is the only thing being sold.

### JANUARY 1, 2027 — TARGET, QUALITY-GATED

Launch **aims** at January 1, 2027. **Slipping to February is acceptable if the
product is not right.** The date is a target, not a promise, and it is the thing
that moves when a gate fails.

**Launch day is BOTH of these, not one:**

- **(a)** Digital frameworks **purchasable by strangers** — not a preview, not a
  waitlist, a real checkout that delivers a real product.
- **(b)** The **Lads Travel Club opens**, with a **FOUNDING-MEMBER CAP** set by a
  **December capacity review** of the research pipeline. The question that review
  answers is *how many members can we serve excellently* — and that number,
  **honestly derived**, is the cap. Everyone beyond it goes on a waitlist.

⚠️ **The cap is a capacity finding, not a marketing number.** It is derived in
December from real pipeline throughput. Do not pick a round number because it
sounds good, and do not raise it after the fact to fit demand. A cap we exceed is
the trust layer failing on day one.

### THE FALL SEQUENCE — the thesis everything serves

    /local ships now  →  Peru sets the product bar  →  enrichment scales the count

**Everything else supports one of those three.** When a new idea arrives mid-fall,
the test is which of the three it serves. If the answer is "none," it is a
backlog item, not this fall's work.

### THE QUALITY GATES — what "launch-ready" means

**The December review runs against this checklist. If any gate fails, the DATE
moves, not the BAR.**

- [ ] **1. Purchasable frameworks.** Peru-template frameworks purchasable with a
      clean checkout and clean delivery. A stranger can pay and receive.
- [ ] **2. Travel Windows everywhere.** Rendering on every purchasable framework,
      with **zero stale windows**. (See BLOCK 4 — the Iceland `august` eclipse
      window is the worked example of exactly what must never ship. `datedUntil`
      exists so one-time events expire themselves.)
- [ ] **3. Count: 300+ published-and-described**, every spot honest per the
      endorsement gradient. Today the canonical live-walk total is **220**.
      ⛔ The gate is **published and described** — spots carrying a real
      `description`/`notes`. It is NOT a raw ingest count. The 162 ingested
      places are not 162 spots, and padding the number with silent entries fails
      this gate rather than passing it.
- [ ] **4. `/local` + `/live` running as the free proof-of-quality surface.** The
      thing a stranger sees before paying anything, and the reason they believe
      the paid product.
- [ ] **5. Club capacity review done**; cap set and the founding offer defined.
- [ ] **6. Zero known rendering errors, zero stale claims, mobile-polished at
      390.** "Known" means known to us — the December review includes a full
      sweep at 1440 and 390, not a memory of one.
- [ ] **7. Pricing decided by founders after the five conversations.** Pricing is
      a founder decision. ⛔ **Never invent, suggest-as-settled, or publish a
      price.** Same rule that governs the Scenic Shore line.

### 🚩 GATE 6 HAS A LIVE FAILURE ALREADY — found Sept 1, 2026, NOT fixed

**The site tells strangers it is "LAUNCHING FALL 2026" in seven places, and it is
now Fall 2026.** The real target is January 1, 2027. Every day this stands, the
homepage badge reads as "any day now" to anyone who lands on it.

    src/App.jsx:756        PREVIEW · LAUNCHING FALL 2026     (homepage hero badge)
    src/Footer.jsx:34      "A travel intelligence company. Launching Fall 2026."
    src/Footer.jsx:60      "We launch Fall 2026 — follow the build."
    src/GiftPage.jsx:705   "Built for a friend. The Lads launch Fall 2026."
    src/LadsSection.jsx:316 "A preview from The Lads. Launching Fall 2026."
    src/PlanPage.jsx:85    "The full thing lands Fall 2026."
    src/PrivacyPage.jsx:279 "...heading toward a Fall 2026 launch..."

⛔ **Deliberately NOT rewritten without Brady.** Public launch-date copy is a
founder decision, and there is a real choice inside it: printing "January 1,
2027" on the homepage commits us publicly to a date the plan explicitly allows to
slip to February. The honest options are (a) a specific date and accept the
commitment, (b) a season — "Launching early 2027", or (c) drop the date and say
"Launching soon" / nothing. **Brady picks; then all seven change in one pass.**

This is exactly the class of thing Gate 6 exists to catch, and it is the same
failure as the Iceland eclipse window: a true claim that quietly went stale
because a date arrived.

### MILESTONES, BACKWARDS FROM JANUARY 1

| Month | What must be true by the end of it |
|---|---|
| **December 2026** | Launch staging: pages in draft, **capacity review run**, cap set, **Travel Tuesday executed Dec 1**, pricing locked. |
| **November 2026** | Framework slate complete — **San Juan, Costa Rica, Bruce, Vancouver** (research-tier). Q4 commerce. **Phocuswright decision executed.** |
| **October 2026** | **Peru LIVE as the standard-setter** — it is the bar. First digital product **sold** (pilot). The ride documented. The film released. |
| **September 2026** | **`/local` shipped polished.** `/live` first pass. Enrichment engine **proven** through the Notion queue. Both study-abroad emails out. **Sept 18 fundraising banked.** |

**September is the month we are in.** The month's work is the top of this table,
and `THE NEW FRAMEWORK AGENDA` below is how the framework half of it gets built.

### CADENCE — and the rule that ends the recurring failure

**3+ sessions per week.** Every session **opens** with `/morning` against this
plan and **closes** with the runway updated and the work **COMMITTED AND PUSHED**.

🚩 **A SESSION IS NOT OVER UNTIL `origin/main` HAS IT.** This has now failed three
times — Aug 26 (a whole queue outlived its session), Aug 28 (three data commits
landed *after* the docs commit that was supposed to record them), and Aug 31 (the
Michigan/220 work sat uncommitted in the working tree overnight and was only found
by the next `/morning`). **That failure mode ends September 1, 2026.**

Concretely, in this order, every session:

1. Build and verify.
2. `npm run build` clean.
3. Commit — **write the docs/CLAUDE.md commit LAST**, so it cannot go stale the
   moment it lands.
4. **Push.** Then confirm the Vercel deploy reaches **READY**, not just that the
   push succeeded.
5. If a session ends mid-intent, **say so in the record** rather than leaving an
   announced build looking done.

### 🔒 CHECKPOINT COMMITS + AUTO-PUSH — STANDING RULE, effective September 2, 2026

**Every verified phase commits to the feature branch AND pushes immediately.**
Not at the end of the session. Not once the whole block is done. **The moment a
phase verifies, it is committed and pushed.**

- Work happens on a **feature branch** (`feature/<thing>`). `/ship` remains the
  **only** merge to `main` — that gate does not move.
- **Nothing ever lives only on this machine again.** A phase that builds clean but
  is not pushed is not finished, it is at risk.
- A checkpoint commit need not be a shippable increment. It needs to be **true** —
  a real state of the work with an honest message. Half-built is fine in a
  checkpoint; *misdescribed* is not.

**WHY THIS RULE EXISTS — four incidents, and the fourth was not discipline:**
Aug 26 (a queue outlived its session), Aug 28 (data commits landed after the docs
commit meant to record them), Aug 31 (the Michigan/220 work sat uncommitted
overnight), and **Sept 2 — the machine lost power at ~13:38 with the entire Block 3
build unstaged.** The first three were discipline failures. The fourth was a power
cut, which is the whole point: **discipline is not what protects the work, pushing
is.** Block 3 survived only because the files happened to still be on disk.

⚠️ **CONCURRENCY IS REAL — Sept 2 proved it.** Two sessions worked this repo the same
afternoon. One committed, pushed and deployed Block 3 while another was mid-write on
a CLAUDE.md record describing that same work as uncommitted, and would have merged a
branch reintroducing "BUILT BUT NOT COMMITTED" as fact. **Before writing any status
into CLAUDE.md, re-read `git log` and `git status` — never describe the repo from
memory of how you left it.** A confident stale record is worse than no record.

➡️ **Corollary for parallel work:** a second session builds in a **worktree on its
own branch** (see Parallel Agent Workflow at the foot of this file), never in the
shared checkout someone else is serving localhost from.

---

## 🔴 SEPTEMBER 2, 2026 (evening) — /local BECAME A PLATFORM. Branch: `feature/travel-windows`

**Everything below is COMMITTED AND PUSHED to `origin/feature/travel-windows`.
`main` is untouched at `9b5a883`. `/ship` is Brady's call and has not happened.**

`14e0a1a` windows schema · `03ab1b4` windows render · `16a7867` fares ·
`ba5a06d` list detail · `20e1e5f` THE PULSE · `ded8a2f` Good Views + golf

### What went live on the branch

- **THE LIVE PULSE** — `src/data/livePulse.js`. 58 real events, 9 venues, every
  row carrying `sourceUrl` + `checkedOn`. MLB and NHL generated straight off
  their official open payloads; NFL and NBA read off league/club pages. Dated
  pins with a breathing glow, a **This Weekend** filter that syncs the map, and
  a date-sorted board.
- **GOOD VIEWS** — 16 landmarks across all six states. **This is what finally
  put pins in MN, WI, IL, IN and OH.** Coordinates from Wikipedia's coordinates
  API, stored per entry as `coordSource`.
- **THE GOLF SLATE** — Golfweek's 2026 top-20 Michigan public ranking, cited,
  unplaced. Was 4 courses; is now 20.
- Places 97 → **113**. Canonical site total **unchanged at 220** — every one of
  these is research tier with no `description`, so the live-walk never sees them.

### 🚩 THE FOUR FALSE CLAIMS ON `/michigan` ARE STILL LIVE AND UNFIXED

Found Sept 2 while auditing the golf gap. `/michigan` is indexed, sitemap 0.7:

| Claim on the page | What the data holds |
|---|---|
| "123 Shows Tracked" · "123 concerts April–November 2026" | **0.** No event data exists in the repo |
| "42+ Venues" | 22 spots |
| "9 Golf Destinations" | 4 golf spots |
| "8 curated bar crawls" | no `crawls` key exists |

⛔ **NOT fixed without Brady.** Removing a hero stat is public copy, and "123
Shows Tracked" cannot be replaced by a derived number — the honest figure is
zero. **This is a Gate 6 failure sitting in production right now.**

### ➡️ TOMORROW'S QUEUE — written Sept 2, in priority order

1. **Fix the four `/michigan` claims.** Blocked only on Brady's call for the
   shows stat. Everything else derives from the data.
2. **Milwaukee Bucks / Fiserv Forum.** The one pulse gap.
   `nba.com/bucks/schedule` renders its calendar with no opponents and no
   home/away in the DOM — needs the signed-in browser or another official route.
   **Absent, not guessed.**
3. **Concert calendars.** Van Andel and Pine Knob are on the map with ZERO
   events and render as quiet hollow rings. Their calendars were never pulled.
   Little Caesars / United Center / Fiserv concerts too.
4. **Golf coordinates by provenance.** All 20 courses are unplaced: golf courses
   have no Wikipedia coordinate records, and geocoding 20 course names is the
   exact Tivoli failure. Signed-in browser job.
5. **Chicago + Milwaukee full sweeps.** They currently carry fixtures only, and
   the page says so out loud in copper. Do not remove that line until the depth
   is real.
6. **Eat & Do per region**, and the remaining Phase-B category depth. The full
   spec was 5 regions × 4 categories × 6–10 cited entries = 120–200 rows, which
   is beyond one session's research budget (~200 searches/session; see the
   enrich skill).
7. **Bruce framework tie-in** — 17 gold pins, still no framework, and no Bruce
   spot carries a description.
8. **Weekend trips** as first-class map objects — Brady's Route 1 (Jul 10–11)
   and Dawson's UP scout (Jul 4) ship gold; proposals ship dashed copper.

### ⚠️ ONE THING BRADY ASKED FOR THAT WAS DELIBERATELY NOT DONE

The Phase C spec said section intros **"in Lads voice."** The standing rule is
that the Lads voice is never AI-generated — it comes from a founder verbatim or
it stays empty, which is the same rule keeping the 16 Peru places silent. The
section intros shipped are **neutral and factual**. **The voice lines are
Brady's to write**, and the page is built to take them.

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

## WHAT WAS BUILT (September 2, 2026 — /local graduates, the Bruce ruling, the vision)

**4 commits, all pushed.** `5734c6a` Michigan coords + 220 · `e0cff0d` Bruce ruling ·
`8ebb137` the vision + timeline · `b84652d` the /local graduation.

### BLOCK 3 IS DONE — `/local` IS THE MAP

The map is the hero, "Good Brews · Good Views · Good News" is its banner identity, and
**`/good-news` now permanently redirects to `/local`** (vercel.json redirect + a
client-side `<Navigate replace>`; its rewrite is gone and its `noindex` went with it).
`GoodNews.jsx` keeps its filename but its default export is now `LadsLocalMap` — a
section, not a page. `LocalPage.jsx` owns Nav, hero, SEO and Footer.

**83 markers in three tiers:** 25 gold (17 Bruce + 8 Michigan) · 58 copper candidates ·
14 Michigan spots that are validated but **unplaceable** and stay off the canvas.

### 🔑 THE NAMES HAD TO BE RE-READ, AND IT MATTERED

`internal/brady/maps-lists-2026-08-29.txt` had punctuation flattened by the shell
encoding limit. Building the candidate file from it would have published **"Graydons
Crossing", "OTooles", "Big Es", "Kusterer Brauhaus"** and four `and Grill` for `& Grill`.

**The method that fixed it, and it is reusable:** convert the captured decimal feature-ID
pair to hex and open `https://www.google.com/maps/place//data=!4m2!3m1!1s<hex>:<hex>` in
the signed-in browser, then read the `h1`. That **follows the ID, never resolves a
string**, so the Tivoli rule still holds. It restored `O'Toole's Public House`,
`Big E's Sports Grill`, `Küsterer Brauhaus`, `Mo's Cocktail Lounge`.
⛔ **Never build a data file from the ASCII staging text.** This is the second time that
rule has paid for itself.

### 🚩 THE MAP RENDERED PERFECTLY AND WAS QUIETLY BROKEN — five dead click targets

Screenshots showed nothing wrong. **Clicking every marker at 1440 and 390 found five
separate defects**, three of them pre-existing:

1. **Decorative geometry was eating clicks.** `.gn-anchor-halo` (r=16, more than twice
   the 7px dot), `.mp-halo` (r = pin × 2.1), `.mp-leader`, `.mp-truth` and the cluster
   leader all accepted pointer events. Short's Pull Barn's halo was covering the centre
   of The Chief Golf Course; the GVSU halo killed the Grand Rapids cluster outright.
   All are now `pointer-events: none`.
2. **The anchors had no hit target of their own** once the halo went inert — an SVG `<g>`
   has no fill, so there was nothing under the middle of it. They now carry an explicit
   transparent `.gn-anchor-hit` circle.
3. **Three pin layers each declustered only against themselves.** Journeyman Distillery
   (Michigan, gold) and Redamak's (candidate, copper) are real neighbours ~8 km apart,
   never saw each other, and Journeyman's disc sat on Redamak's so that pin took **no
   clicks at all**. All pins now share ONE `<MapPins>` layer and decluster together.
4. **Anchors render BELOW the pins** — a specific validated place should win a tap over a
   campus marker.
5. Result, re-verified: **3/3 clusters · 2/2 anchors · 9/9 airports · 32/32 pins**, both
   widths.

**The lesson, worth more than the fixes: a rendering check is not a verification.** Build
+ screenshots was the standing pattern here and it would have shipped a map whose pins
did nothing. **Click the things.**

### THE DENSE-CITY COLLAPSE — and why minDist 34 was reverted

32 of the 58 candidates are Grand Rapids bars within a few viewBox units. Raising
`minDist` 20 → 34 fanned that one city across ~190 units and **put Grand Rapids breweries
in Lake Michigan**. Leader lines meant it was not strictly lying, but nobody reads a
leader line before they read a position.

So `minDist` went back to **22**, and any group of **6+ within 18 units collapses to ONE
copper marker at its real centroid carrying the count**, whose panel names every member.
Today that is Grand Rapids 32, Northern Michigan 10, Chicago & Harbor Country 9.
The marker searches outward for clear ground and **prefers land over water** (tested
against the same traced state polygons via `window.Path2D`), with a leader line and a
truth dot wherever it is offset.

### THE 44px RULING — it cannot be met on the canvas, and the file says so

At 390px the map scales to ~0.37. Even well-spread neighbours sit **~13 CSS px** apart, so
a 44px target would swallow them and make them unreachable — a regression dressed as a
fix. Measured: pin hit target **13px**, companion-list row **53px × 335px**.

➡️ **The companion list IS the 44px surface.** Every pin appears in it as a full-width,
keyboard-reachable row wired to the same panel, plus the 14 unplaceable Michigan spots
under a heading saying why they are not on the map. Do not "fix" the pins by enlarging
them; the real fix is a zoomed Michigan view or pinch-zoom, and neither is faked.

### NEW FILE: `src/data/midwestCandidates.js` — 58 candidates, research tier

From GR Bars (37) + Northern MI (17) + CHI/New Buffalo (15) = 69 ingested, minus:
- **2 closed** — Graydon's Crossing, Flanagan's Irish Pub. Still Temporarily closed on
  Google today. **Suppressed entirely, not greyed.**
- **8 already validated in `michigan.js`** — deduped on feature ID so no venue appears
  twice claiming two tiers at once.
- **1 unverifiable** — **Grandview Golf Club**'s feature ID no longer resolves to a place
  (falls back to a bare map). Its Aug 29 record was already the thinnest in the set: no
  category, rating, reviews or address. Left out rather than shipped as a name we can no
  longer stand behind, and recorded in the file header.

Every entry is `validated: false`, carries **no** Lads rating, take or description, and
its Google category/rating is labelled as **Google's** wherever it renders.
📐 **No canonical count change — 220 stands.** Candidates carry no `description`, so the
live-walk counter never sees them and the 300+ gate is untouched.

### ALSO FIXED THIS SESSION

- **`.globe-hint` 320px overflow — CLOSED.** It rendered ~318px wide and pushed the whole
  homepage sideways on a 305px viewport. Now capped to the viewport and wrapping below
  360px. Homepage at 320: `scrollWidth` **312**, no horizontal scroll.
- **`thailand` + `charleston` removed from the sitemap.** Retired Aug 13, they had been
  pointing search engines at two 404s for three weeks.
- **Michigan card copy.** "Every region across both peninsulas, validated" is gone —
  unsupportable at 8-of-22 coordinates. It now states the real numbers.
- Mobile map fills the viewport width instead of centring in dead space.
- New pin types `bar` and `winery` in MapPins — 17 candidates are Bars/Pubs/Lounges and
  giving them the brewery mug would have stated a brewery where Google says bar.

### 🚩 THE WHOLE SITE WAS CANONICALISING TO THE HOMEPAGE — found AFTER deploy, FIXED

Checking the live `/local` (not the local build) showed `canonical` =
`https://ladstravel.com/`, not `/local`. Cause: **`index.html` carried a hard-coded
canonical**, which every SPA route inherited, so each page shipped **TWO** canonicals —
the shell's homepage one plus its own. Two conflicting canonicals is undefined behaviour
and commonly resolves to the first, so `/local`, `/outdoors`, `/bucket-list`, `/shop` and
`/privacy` were all telling search engines they were duplicates of the front page.

**Worse: the 10 framework routes had NO canonical of their own at all**, so `/dublin`,
`/spain`, `/rome`, `/michigan` and the rest inherited the homepage one outright. The
entire framework catalogue was self-reporting as duplicate content.

Fixed in `f87aa79`: the static tag is gone from `index.html` (with a comment saying why
it must not return), the homepage declares its own in `App.jsx`, and `FrameworkPage.jsx`
emits `canonical` + `og:url` per framework from `data.id`. **Verified on 9 routes locally
and 4 in production: exactly one canonical each, and the right one.**

⛔ **Never put a canonical in `index.html`.** In an SPA it is not a default, it is an
override on every route.

### ⚠️ `src/utils/seo.js` HAD A BANNED "FREE" CLAIM — dead, but loaded

`SEO_DEFAULTS.description` still read *"Free personal travel consulting through 2026.
650+ validated spots across 20+ cities."* — a banned "free" claim plus a count that never
matched canonical (220 / 13). `image` pointed at **ladstravel.CO**, not our domain.
**Only `siteName` is consumed, so nothing live was wrong.** Replaced anyway: it was one
wire-up away from putting a banned claim in a meta tag. The May-31 "free" purge cleaned
visible copy and missed this, the same way it missed the JSON-LD `priceRange` in August.

### ⚠️ TOOLING: `io.open(p, 'w')` TRUNCATED CLAUDE.md TO ZERO BYTES

A Python patch script opened CLAUDE.md for writing and *then* hit a `UnicodeEncodeError`
on a lone-surrogate escape (`🚩` for 🚩). The open had already truncated the
file; 1,678 lines were gone. Recovered with `git checkout --`, because the previous
commit existed.
**Rule going forward: build the whole string, `.encode('utf-8')` it, write to a TEMP
file, then `os.replace`.** Never open the real file for writing until the bytes exist.
Also: rolldown **rejects astral-plane characters in source** — `🔑` in a JSX comment
failed the build with `Invalid Character`. Emoji are fine in .md, not in .jsx.

---

## WHAT WAS BUILT (August 29, 2026 — the great ingestion, the Vienna split)

### BLOCK 1 — 162 PLACES INGESTED FROM 8 SAVED LISTS

All read in the signed-in Playwright browser as brady@ladstravel.com, by provenance.
**Integrity: parsed count == Google's own header count on all 8 lists. 162/162 unique
feature IDs. 162/162 coordinates.** Everything defaults `validated: false`.

🔑 **THE METHOD CHANGED — the old note is now WRONG.** CLAUDE.md said the list panel
sits in a subframe and each place must be CLICKED to read `!3d/!4d` off the URL. Neither
still holds: the panel is in the **main frame**, and the entire list — name, address,
lat/lng, feature ID, Google KG mid, **and Brady's own per-place notes** — parses out of
the page's embedded `APP_INITIALIZATION_STATE` payload in ONE pass with no clicking.
162 places took one page load each. Clicking also proved fragile: `goBack()` broke
navigation after the first place.

**Michigan: 8 of 21 zero-coordinate spots SOLVED** — Brewery Vivant, New Holland, Mitten,
Short's, Journeyman, Beer Church, Arcadia Bluffs, Forest Dunes.
⚠️ **Loose fuzzy matching was tried and REJECTED** — it paired Founders→Arvon and Sugar
House→O'Toole's off shared words like "brewing" and "house". Only strict token
containment + a distance sanity check was trusted. **Do not lower that bar.**
❌ **13 still unsolved. FOUR ARE DETROIT and there is no Detroit list** — Brady is
compiling one (said Aug 29, expected that weekend). It closes 4 in one step.

✅ **SHORT'S BREWING — RULED Aug 31, 2026. Brady has been to BOTH.**
`michigan.js` records Short's as **Bellaire / TC**; the saved place is the **Elk Rapids
Pull Barn**, a different venue 17 km off. Brady: *"shorts is the elk rapids pull barn I
would like on the list but I have been to both."*
➡️ **Therefore they are TWO venues, both genuinely visited — not a correction.**
⛔ **Do NOT overwrite the Bellaire entry with the Elk Rapids coordinate.** Elk Rapids
(`44.9035254, -85.4069907`) has provenance and can pin now. Bellaire is a real visit with
**no coordinate yet** and stays unpinned until one arrives by provenance.
🚩 **COUNT IMPLICATION — needs Brady's ok at build time.** Adding Elk Rapids as its own
spot with a description moves michigan **21 → 22** and the site total **219 → 220**.
Canonical totals do not move silently. Options: (a) add it and update every derived
surface, or (b) carry Elk Rapids as a map pin attached to the existing Short's spot so no
counter moves. **Ask before building.**

❓ **STILL OPEN: Brewery Vivant.** Google now lists it as "Vivant Brewery and Spirits" at
the same address (925 Cherry St SE). Keep our name or follow the rename? Not yet ruled.

### BLOCK 2 — PRAGUE/VIENNA SPLIT (`/vienna` is live as a route)

`prague.js` was a **THREE**-city framework (Prague + Vienna + **Dresden**), not two.
**Brady approved: Dresden STAYS with Prague** — it is a 2-hour day trip and still carries
its own `from: 'Prague'` dayTrip entry; Vienna is 250 km the other way.

**COUNT GATE PASSED EXACTLY:** prague 25 → **17** (Prague 11 + Dresden 4 + 2 day trips),
vienna **8**. 17+8=25. **Site total 219 UNCHANGED. Globe pin sum 219 across 13 gold pins
UNCHANGED.** Countries 10 / continents 3 / cities 13 all unchanged. The Globe pin VALUES
did not even move — Prague was already 25 minus an 8-spot Vienna sub-bucket, so the split
only promoted Vienna from sub-bucket to primary pin.

⚠️ **ONE canonical number DID change: frameworks 9 → 10.** Updated in all three
`index.html` meta descriptions (the text search results actually render) + a peru.js
comment. **Do not "correct" it back to 9.**

Separation, not rewriting: all 8 Vienna spots moved verbatim. Framework-level prose that
became FALSE was rewritten (hero stats claiming 3 countries, 3 Vienna itinerary days, the
2-column Prague/Vienna cost table, the "Skipping Vienna Beisl" mistake, and the Cafe
Central renovation callout which moved to Vienna). Vienna palette `#a85c62` — its own,
per the never-reuse-a-palette rule.

### 🔧 TOOLING GOTCHA — cost real time this session

**The Bash heredoc eats backslashes.** `<<'PYEOF'` did NOT preserve `

	` or `'`
into Python — they arrived as real control characters, producing broken JS regexes and
failed string matches. **Workarounds that work:** build strings with `chr(39)` / 
`String.fromCharCode()`, replace whole lines by index instead of matching text containing
apostrophes, or use the Write tool for any content with quotes/accents.

**Also:** the Playwright MCP `browser_run_code_unsafe` VM has **no `fs` and no dynamic
import** — it cannot write files. Return compact delimited text and write it locally.
Its file access is restricted to the repo root + `.playwright-mcp/`.

🚩 **A STALE PLAYWRIGHT BROWSER BLOCKS THE PROFILE.** Aug 28's browser was still
running and held the signed-in profile, throwing "Browser is already in use" — the exact
failure that killed the Aug 27 Machu read. **Fix: kill the leftover chrome tree; cookies
live on disk so the profile stays signed in.** Close the browser at session end.

---

## WHAT WAS BUILT (August 28, 2026 — the Machu list, the film, the Michigan lie)

**6 commits shipped** (`3744a70`, `f03c97c`, `393fac6`, `5114547`, and then
three that this file did not record until Aug 29: `cab0f6d`, `165a6d7`,
`973db6b`). The docs commit landed at 12:07 and three data commits landed
*after* it — which is exactly how a session's own record goes stale. **Write
the docs commit last.**

### ➕ THE THREE LATE COMMITS — recorded Aug 29, they change the Peru picture

- **`cab0f6d` — Humantay, Huacachina Oasis, Paracas (22 → 25 places).** These
  close every open geography flag in this file. **Humantay Lake**
  `-13.3793789,-72.5844385` was named in Brady's validated prose but
  deliberately left unpinned (geocoding a bare name breaks the Tivoli rule);
  it now arrives with provenance and lands on the **May 8 EXIF anchor**,
  independently confirming May 8 as the first real Salkantay day — the
  off-by-one correction now has a fourth witness. **Huacachina Oasis** lands on
  the May 5 anchor, settling Brady's "Huacachina" over the manifest's
  "Ica / Paracas". **Paracas** sits ~70 km northwest of that anchor, so the
  manifest's day-4 heading had **conflated two places 70 km apart** — it did
  not invent the Ballestas boat tour, it attached it to the wrong point.
  Paracas is therefore attached to **no day** and kept **off the route**.
  The Salkantay Pass stays unpinned: in the prose, in no list.
- **`165a6d7` — Brady's endorsement + his own words on 6 places.** He closed the
  validation question himself: *"everything on the List we would recommend I
  removed some bad spots."* That is a **curation** statement, not merely a visit
  claim, so all 25 move to `validated: true` with `validationBasis` recording
  that it rests on **his word, not EXIF**. `BRADY_TAKE_SOURCE` holds the
  statement verbatim and is the ONLY source for the personal layer here.
  Normalised "calarbra trident" → the **Paracas Candelabra** (El Candelabro) —
  spelling only, meaning intact.
- **`973db6b` — Moray, Wild Rover, Magicpacker + Google listing provenance.**
  Moray is "the best Cusco food spot that we had"; Magicpacker is where they
  actually stayed; **Wild Rover is a HANGOUT recommendation, not a stay one**,
  and the entry says so explicitly so the two are never conflated.
  `LADS_COLLECTIVE_TAKE` carries "truly all of the restaurants were as good as
  advertised" and is marked **render-as-a-group, never split per spot** —
  slicing a sentence about a set into per-restaurant blurbs would manufacture a
  firsthand opinion. Brady offered "you can do some research for taglines";
  **deliberately not taken up**, because a researched blurb in a Lads card reads
  as firsthand. Instead `GOOGLE_LISTING` carries Google's own category, rating,
  review count and PEN band for **23 of 25**, read verbatim off the saved list.
  **If rendered it must be labelled as Google's, never ours**, and the bands are
  Google's, not quoted prices.

**Net: 9 of 25 carry Brady's voice. 16 are silent and stay that way.**
`ladsRating` is absent throughout, so nothing here can be read as a Lads score.

### The 22 Peru spots — the "zero spots" gap is closed

Brady supplied his **"Machu"** Maps list (`maps.app.goo.gl/7N98pQtXNVr2R1Xy7`).
All 22 read **by provenance** in the signed-in browser: each place opened from
his own saved list, lat/lng taken off the URL's `!3d/!4d` plus the stable Place
ID. All 22 Place IDs unique. Coverage: Cusco 14 · Lima 3 · Machu Picchu 2 ·
Aguas Calientes 1 · Santa Teresa 1 · Vinicunca 1.

All ship `validated: false` (research tier). **Awaiting Brady's visited-split**
— a saved list is a superset, exactly as with the Bruce. Do not flip wholesale.

🚩 **A SAVED COORDINATE IS WHERE GOOGLE'S RECORD SITS, NOT WHERE THE EXPERIENCE
HAPPENS.** Two entries are tour-operator records in central Cusco, ~100 km from
what they name: **"Salkantay Trek"** (Plaza de Armas block) and **"Red Valley
Cusco"** (Cusco city; the real Valle Rojo is beside Vinicunca). Both carry
`recordIsOffice: true`. Pinned at face value the map would claim Brady hiked
Salkantay downtown. **This is a general trap for every Maps-list ingest.**

ℹ️ Brady said on Aug 27 the list excludes Lima. **It does not** — three
Miraflores places at ~-12.13,-77.03. Recorded as found, not as remembered.

### 🎬 THE FIRST YOUTUBE VIDEO EXISTS — rough cut, not for publication

`Peru26/review/rough-cut-v1.mp4` — **5:02**, 1920×1080, h264+AAC, 127 MB.
Plan at `internal/brady/peru26-video-plan.md`. Both gitignored. Frames were
extracted and eyeballed: upright throughout, chronology correct, titled
"ROUGH CUT – NOT FOR PUBLICATION". 226 source files untouched, nothing uploaded.

**Runtime maths, honestly:** 3:23 is the absolute ceiling of motion. This cut is
**2:24 of video against 2:10 of stills** — less than half is video. More length
means more photos; there is no more footage. **28 of 30 clips are vertical**, so
16:9 pillarboxes nearly everything and **9:16 is arguably the honest format**.

🚩 **`/outdoors` says "five days on trail"; the media evidences only FOUR dated
trek days.** Not necessarily wrong — it rests on Brady's record, not the
footage. Nothing was changed. Flagged so nobody "corrects" it either way.

### MAY 7 = RAINBOW MOUNTAIN — settled from four directions

1. Coordinate matches Vinicunca to ~0.01°.
2. `SystemSection.jsx:436` records the pre-trip intent.
3. **`IMG_2212.HEIC` photographs a sign reading "Rainbow Mountain"**; another
   shows a marker reading "MIRADOR VALLE ROJO". The day ends at **16:37 in
   Cusco's Plaza de Armas** — impossible on trek day 1.
4. Brady's own Machu list contains **Vinicunca** at -13.8701658, -71.3029901.

**The manifest's trek day labels are off by one. Salkantay starts May 8.**

### /local no longer fronts Michigan with a Tennessee photo

`smokyMountainsCabinOverlook` is gone from the Michigan card. Swapping was
impossible — **no Michigan photograph exists in `src/images-*.js`** — so rather
than trade one placeholder for another the card renders the **real traced
Midwest geometry** from `midwestGeo.js`, Michigan in gold, four real projected
PLACES as dots. It previews what is being built instead of standing in for it.
Purely presentational: no data, copy or route changed, and **nothing links to
`/good-news`**, so the noindex map stays unlinked and the graduation decision
is untouched. `preserveAspectRatio` is **`meet`, not `slice`** — slice cropped
Michigan's eastern edge in the 4:5 card at 390px.

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

## 📍 SESSION START STATE — verified September 2, 2026

**Working tree clean. `main` == `origin/main`. Nothing pending `/ship`.**
Last commits: `5734c6a`, `e0cff0d`, `8ebb137`, `b84652d` — all Sept 1–2, all pushed,
deploy confirmed READY on ladstravel.com.

**✅ What IS live:** the Jan 1 2027 vision + quality gates in this file · the Bruce
ruling (all 17 gold) · Michigan coordinates and the 219 → 220 move · **`/local` as the
map**, with `/good-news` redirecting into it.

🚩 **STILL OPEN, needs Brady:** the site says **"LAUNCHING FALL 2026" in seven places**
and it is now Fall 2026. Listed with file and line under THE VISION AND THE TIMELINE.
Public launch-date copy is a founder decision, so it was deliberately not rewritten.

---

## ✅ APPROVED BUILDS (Brady, Aug 29, 2026)

### BLOCK 3 — /local GRADUATION — ✅ **BUILT AND SHIPPED Sept 2, 2026**

> Everything below was the approved spec; see `WHAT WAS BUILT (September 2, 2026)`
> for what actually shipped and the four places reality differed from the plan:
> the unpinnable count is **14, not 13** (Elk Rapids moved michigan 21 → 22); the
> candidate count is **58, not 69** (closed, deduped and unverifiable records were
> removed); dense cities **collapse to a count marker** rather than fanning out; and
> the **44px target is met by the companion list, not by the pins**, because it
> cannot be met on the canvas at this zoom.

`/local` becomes the map-as-hero experience. Proposal artifact:
`https://claude.ai/code/artifact/024e7bb9-bcf6-4c15-85bc-16b1d29778a8`

- Map is the hero, **"Good Brews · Good Views · Good News"** as the banner identity of
  Lads Local — not a separate destination.
- **Tiers: gold 8 validated / copper 69 candidate / 13 unpinnable** (4 Detroit, closing
  when Brady's list lands). Candidates are list-sourced, NOT visited-verified: they show
  Google's category + rating **labelled as Google's**, no Lads take, no rating.
- **`/good-news` → `/local` PERMANENT REDIRECT** (approved). Same retirement pattern as
  `/explore` and `/adventure`. Nothing links to it today.
- **Touch targets — FIX GLOBALLY, not just airports.** Brady: *"13.2px pins fail everyone,
  not just airports — fix the pin hit-areas globally, visual size can stay elegant while
  tap targets go 44px+."* Measured at 390: `.mp-pin` **13.2×13.2**, `.gn-anchor`
  16×21 to 37×20. Method: **transparent 44px hit area centred on the true coordinate**
  + a companion list below the map. ⛔ **Do NOT enlarge the glyphs** — that would force
  nudging pins off true position in the Grand Rapids cluster.
- Also in this build: mobile map fills the viewport at 390 (today it centres in dead
  space); **closed venues suppressed entirely, not greyed** (Graydon's Crossing +
  Flanagan's are Temporarily closed); the Michigan card's **"Every region across both
  peninsulas, validated"** line reworded — unsupportable at 8-of-21 coordinates.
- Graduating drops `noindex`, which requires: canonical + meta description, sitemap entry,
  JSON-LD, an OG image, and the `.globe-hint` 320px overflow fix.
- **Hop Passport is THIRD-PARTY.** Attribute as such; invent none of its rules or branding.

### BLOCK 4 — TRAVEL WINDOWS — **APPROVED, NOT YET BUILT — THIS IS NEXT**

🔑 **THE FINDING: 9 of 10 frameworks already carry `timingWindows`. ZERO render it.**
`FrameworkPage.jsx` consumes 14 data keys and that is not one of them. ~24 windows of
complete researched content ship in the bundle and reach nobody. `mistakes` and
`specialCallouts` are dead the same way.

🚩 **FIRST ACTION, BEFORE ANYTHING RENDERS — Iceland's stale window.** Its
`august` window is about the **Aug 12, 2026 eclipse** and still reads *"already booked…
avoid unless you planned 18 months ago."* That date has PASSED. Brady: *"a dead 'already
booked, avoid' claim going visible is exactly the AI-error embarrassment we exist to
prevent."* **Fix or remove it, then staleness-audit the other 8 frameworks the same pass.**

- **Schema extends, never reinvents.** Keep `id / name / recommended / atmosphere /
  crowdMix / pubExperience / priceTier / primaryDraw / verdict / detail`. **Add four:**
  `driver` (weather|events|pricing|logistics), `months` (machine-readable),
  `datedUntil` (ISO, optional — the Iceland fix, so one-time events self-expire),
  `sourcing` ({basis, checkedOn, sources[]}).
- **3–4 windows per destination, typed by driver.** Semantics currently diverge with
  nothing recording it: Munich's windows are Oktoberfest weekend-vs-midweek, Spain's are
  seasons. **Pricing is the axis nobody writes honestly — the one most worth owning.**
- **Renders as a "When to go" section** between Overview and the spot categories, entered
  in `navSections`. Recommended windows take a gold border; driver is a chip; the sourcing
  line sits at the foot of every card.
- **THE SOURCING RULE:** every window states the reasoning that produced it — shoulder
  season, monsoon, festival, fare curve, published closure. **A window that cannot name
  its driver does not ship.** No invented specifics. Pipeline-researched,
  **human-sanity-checked before publish**. ⛔ **Never apply a Lads voice to a researched
  window** — same rule that keeps the 16 silent Peru places silent. The window explains
  the world; only Brady speaks for the Lads.
- **Peru gets the full template treatment first**, exercising all four drivers.

---

## 🚩 THE NEW FRAMEWORK AGENDA — SEPTEMBER BUILD SLATE (approved Aug 29, 2026)

> **/morning MUST surface this queue every session until it is empty.** These are
> **not parked ideas.** Brady approved this sequence on Aug 29. Work the numbers in
> order unless he re-prioritises.

**Every queue entry ships the same four things:**
1. **Pipeline research pass** — researched, then human-sanity-checked. Never published raw.
2. **Travel windows** — the `timingWindows` layer, 3–4 windows typed by `driver`
   (weather / events / pricing / logistics), each stating its reasoning. See TRAVEL
   WINDOWS below.
3. **Peru-template structure** — whatever #1 establishes is what #2–#5 inherit.
4. **Honest validation tiers** — gold = validated, copper = research. Never flip a tier
   to make a map look fuller. A saved list is a SUPERSET of a trip.

### 1 — PERU: THE STANDARD-SETTER ⭐ next major session

The template every later framework copies. Interactive country map + motion language +
travel windows. **Peru gets the full travel-windows treatment FIRST**; its four windows
exercise all four drivers and become the worked example.

Data is already banked and unusually strong: `src/data/peru.js` — 10 GPS day anchors +
**25 saved places**, all `validated: true` on Brady's own curation statement, 9 carrying
his voice, **16 deliberately silent**. `GOOGLE_LISTING` covers 23 of 25.
**Do not write copy for the silent 16.**

### 2 — SAN JUAN, PUERTO RICO (real trip behind it)

**13 places, all coordinates, all unique IDs.** Google rating on 12/13 (avg 4,326
reviews — the highest-confidence listing data of any list). Street address on 8/13.
Spread 35 km: a tight Old San Juan core (bar crawl + two castles) plus El Yunque and
Casa BacardÍ as outliers. **Zero closed venues. Zero Brady notes.**
➡️ **Brady flags validated spots PER-SPOT.** Real trip, but the list is still a superset.

### 3 — COSTA RICA (San José + Jacó, real trip behind it)

**59 places** — the largest ingest: San José 35 + Jacó 24. All coordinates, all unique
IDs. Rating on 52/59, address on 41/59. Spread 42 km (the two cities, ~2 h apart).
San José splits cleanly into the Barrio Escalante food/bar scene and the museum core;
Jacó is 22-of-24 inside ~3 km of beach town.
✅ **ONE FRAMEWORK — RULED BY BRADY, Aug 31, 2026.** San José and Jacó ship as a single
**Costa Rica** framework (the Spain multi-city model), not two.
📐 **Count impact when it ships:** countries **10 → 11**. Continents stay **3** — Costa
Rica is North America, already represented. Spots rise by however many survive his
per-spot validation pass; the total is not 219 + 59 by default.
➡️ Per-spot validation, same as San Juan.
⚠️ `Oz Poolside Bar` and `Oz Hotel and Sport Bar` share an identical coordinate — pins
will stack, declustering required.

### 4 — BRUCE PENINSULA (geocoded, ✅ visited-split RESOLVED)

17 places geocoded by provenance in `src/data/brucePeninsula.js`, from Brady's Aug 8–12
trip. ✅ **RULED Sept 1, 2026: he visited ALL 17.** They carry
`validated: true / validatedBy: 'Brady' / visitedDate: '2026-08'` and render **gold**
on `/local`. `BRUCE_SOURCE` records `validationRuledOn` and `validationBasis`.
⚠️ **That was a RULING, not an inference.** The standing rule is unchanged for every
other list: a saved list is a SUPERSET of a trip and is never flipped wholesale on its
own. This one was, because the founder said the two sets are identical here.
➡️ Still needs its own framework build — pins are not a published framework, and no
Bruce spot carries a description, so none of them touch the canonical 220.

### 5 — VANCOUVER (pure research tier — the pipeline showcase)

**21 places** from two lists that should merge (6 "things to do" + 15 bars/restaurants).
All coordinates, rating on 20/21 (avg 6,362 reviews — highest of any list).
**⚠️ Address on 0/21 — thinnest metadata of the three destinations.**
No trip behind it, so **honest copper throughout** — this is the framework that proves
the research pipeline stands on its own without a Lads visit.
⚠️ **`House of Funk Brewing` is PERMANENTLY CLOSED** per Google. Must not render.
ℹ️ Carries the ONLY human note in all 162 ingested places: Grouse Mountain →
*"Grouse Grind Hike or Gondola"*.

### WHERE THE DATA IS BANKED

- `internal/brady/maps-lists-2026-08-29.txt` — all 162 places, pipe-delimited (gitignored).
- `internal/brady/ROUTING-TABLE-2026-08-29.md` — the routing table + honesty flags.
- ⚠️ **ACCENTS WERE FLATTENED** in the staging file (`Lúpulo→Lupulo`, `Jacó→Jaco`) by a
  shell-encoding limit. **Re-read names with accents from the browser when building real
  data files.** Do NOT build a data file from the ASCII staging text.

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

**Canonical site-wide totals (re-counted September 1, 2026)** — used by Globe
pins, Featured Work cards, DataSpectacle counters, Globe caption, and System
section. Single source of truth: the 10 `src/data/*.js` framework files.
Method: live-walk (any object with `name` AND `description|notes` is a spot).

  220 spots  ·  13 validated cities  ·  10 countries  ·  3 continents

(Thailand + Charleston retired Aug 13 — data preserved in `retired/`.
Asia dropped: Thailand was the only Asian framework.)

Per-framework breakdown — **verified Sept 1, 2026 by importing every file and
tallying, not by reading the page.** Same walker as App.jsx `countSpots` /
Globe.jsx `countSpotsByCity`:

| Framework | Live count (full walk) | Note |
|---|---|---|
| spain | 38 | |
| dublin | 37 | |
| rome | 27 | |
| iceland | 23 | |
| australia | 22 | |
| michigan | 22 | was 21; +1 for Short's Elk Rapids Pull Barn, Aug 31 |
| prague | 17 | was 25; Vienna split out Aug 29 (Prague 11 + Dresden 4 + 2 day trips) |
| poland | 15 | |
| munich | 11 | |
| vienna | 8 | new file, Aug 29 |
| **TOTAL** | **220** | |

⚠️ The "fully-structured spots" column that used to sit here is GONE. It came
from the retired 226/21 method and had not been re-counted since Aug 13, so it
sat quietly stale beside a live column. If that figure is wanted again,
re-derive it — do not copy the old numbers forward.

🚩 **NOT counted here, deliberately:** `peru.js` (10 day anchors + 25 saved
places) and `brucePeninsula.js` (17 places). Neither is a published framework,
and day anchors are not spots. The **300+ launch gate counts published AND
described spots**, so ingested-but-silent places do not advance it — the 16
silent Peru places are the worked example.

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

## ⛔ ARCHIVED QUEUE — Thursday, August 27, 2026 (HISTORICAL, DO NOT WORK FROM THIS)

> **Superseded Aug 31, 2026.** The live plan is **THE NEW FRAMEWORK AGENDA** plus
> **APPROVED BUILDS**, both above. This section is kept only for the flags and
> context inside it. Its blocker table and phase list are STALE — several items
> listed here as blocking have since closed.

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

### 🚧 BLOCKED ON BRADY — re-verified Aug 29 against the data, not from memory

| Blocked item | State as of Aug 28 |
|---|---|
| Bruce visited-split | ❌ **18 of 19 still `validated: false`** — never supplied |
| **Peru visited-split** | ✅ **RESOLVED Aug 28** — Brady: "everything on the List we would recommend I removed some bad spots". A curation statement, so all **25** saved places carry `validated: true / validatedBy: 'Brady' / visitedDate: '2026-05'`, with `validationBasis` recording that this rests on his word, NOT on EXIF. 9 carry his voice; **16 are still silent and stay that way.** |
| Michigan geocoding | ❌ **0 coordinates** in `michigan.js` — nothing to pin |
| Michigan hero photo | ✅ **NEUTRALISED Aug 28** — the Tennessee photo is gone from `/local`, replaced by the real map preview. A genuine Michigan photo is still wanted, but it no longer blocks anything. |
| Peru26 beat sheet | ✅ **SUPERSEDED** — never arrived; Brady directed the work anyway and a proposed beat sheet now exists in `peru26-video-plan.md` |
| Licensed music | ❌ **NEW, hard blocker on publishing the film.** None sourced, downloaded or embedded — and none will be. |

Of the original four, **two are closed** (Peru split, Michigan photo). What
actually remains: the **Bruce split**, **Michigan coordinates**, and **licensed
music**. Block 1 of Aug 29 attacks the Michigan-coordinates one directly.

⚠️ **Do not count `validated: true` with a raw grep.** `peru.js` sets it inside a
`saved()` helper (~:667), so a line-grep reports 13 where the real figure is 35
(10 day anchors + 25 saved places). Import the module and count.

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

**🔴 THE HARD BLOCKERS — down from four to three (re-verified Aug 29):**
1. **Bruce visited-split** — which of the 17 you actually hit Aug 8–12. The
   saved list is a SUPERSET of the trip, so it cannot be inferred. Until this
   lands every Bruce pin renders copper and claims nothing. **BLOCKING Phase 1.1.**
2. **Michigan coordinates** — or a Google Maps saved list to read them from by
   provenance. **BLOCKING Phase 1.2 and any Michigan pin.**
3. **Licensed music for the Peru26 film** — none sourced, and none will be
   invented. **BLOCKING publication of the cut**, not its assembly.
   ~~A real Michigan photo~~ — ✅ **NO LONGER BLOCKING (Aug 28).** `/local` renders
   the real traced Midwest geometry instead of the Tennessee photo. A genuine
   Michigan shot is still wanted; it gates nothing.
   ~~The Peru26 beat sheet~~ — ✅ **SUPERSEDED.** Brady directed the work directly;
   a proposed beat sheet lives in `peru26-video-plan.md`.

**Peru-specific, needed before `peru.js` can become a published framework:**
- ✅ **Named spots ARRIVED Aug 28** — 25 of them, by provenance off Brady's own
  "Machu" list. `ladsRating` is still absent everywhere in the file, so the
  endorsement gradient cannot mistake any of it for a Lads score.
- ❌ **Still missing: the personal layer for 16 of the 25.** No `ladsTake`, no
  `description`. They stay silent — the rule that the personal layer cannot be
  AI-generated is exactly what stops 12 Cusco restaurants getting plausible copy.
  Because the live-walk counts only spots carrying `description`/`notes`, those
  16 also do not move the canonical totals.
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
  1. **ROTATION — ⚠️ THE `transpose=2` NOTE WAS WRONG. CORRECTED Aug 28.**
     The premise holds: 28/30 clips are portrait iPhone HEVC with a -90°
     rotation flag, ffmpeg auto-rotates in a simple `-vf` chain but **NOT
     inside `-filter_complex`**, so a multi-clip assembly renders sideways
     unless handled per input.
     **But `transpose=2` is the wrong direction on the ffmpeg installed here**
     (imageio-ffmpeg's bundled **v4.2.2** — note that is NOT the 7.1 the Aug-25
     note claimed). It was derived from a small test render and never checked
     against a real multi-clip cut; the first Aug-27 render using it came out
     visibly sideways.
     ✅ **What actually works, proven by a rendered 5:02 cut whose frames were
     pulled and eyeballed:** `-noautorotate` on the input, then **`transpose=1`**,
     applied ONLY where the probed rotation is -90. Probe each file's real
     rotation rather than assuming — do not blanket-apply either value.
     **Lesson worth keeping: verify a rotation fix on the real assembly and
     LOOK at extracted frames. A test-clip result did not survive contact with
     the actual cut.**
  2. **Use the right ffmpeg binary.** There is no system ffmpeg/ffprobe/
     exiftool on this machine. An OBS-bundled `ffmpeg.exe` exists inside an
     Overwolf extension folder and its banner claims "full_build", but
     **`drawtext` is compiled out** — it fails with `Unknown filter 'drawtext'`.
     Use the `imageio-ffmpeg` pip package's binary for anything with text —
     path via `python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`.
     **It is v4.2.2, not the 7.1 recorded Aug 25** — that misreading is what
     produced the wrong rotation advice above. The OBS `ffprobe` is fine for probing.
     Font: `C:\Windows\Fonts\arial.ttf` works. HEIC/EXIF reading was done with
     Python `Pillow` + `pillow-heif` (installed) since exiftool is absent.
  3. **Sort by Apple's timestamp, not the generic one.** 10 of 30 videos have a
     generic QuickTime `creation_time` that disagrees with the file's own
     `com.apple.quicktime.creationdate` (which carries the real `-05:00` Peru
     offset). 4 are wildly off — `IMG_1944.MOV`'s generic tag claims **Aug 25**
     when it is May 5 dune-buggy footage; `IMG_1128` / `IMG_2406` / `IMG_3030`
     are mis-stamped into late May. Re-export artifacts. The manifest already
     sorts by the corrected time and tables every correction.
  4. **🚩 THE MANIFEST MIXES TIMEZONES — found Aug 28, and it is the nastiest
     one.** In `peru26-manifest.md` the **video** times are **UTC** while the
     **photo** times are **local**, with nothing on the page labelling the
     difference. That is a silent **5-hour** offset. Interleave the two tables
     naively — the obvious way to build a chronological edit — and every clip
     lands in the wrong part of every day. Normalise to Peru local
     (`-05:00`) before merging photos and videos.

  **⚠️ ONE FILE NEEDS BRADY:** `72581579-9d47-4394-9304-fbad79f114c1.mp4` —
  **identified Aug 28**: interior of a van/coach shot from a seat, someone
  reclined across the seating, bright daylight. No window content, signage or
  terrain that would place it. Only non-iPhone file in the set (plain .mp4,
  UUID name, no GPS, no Apple metadata, stamped May 20). Surfaced, NOT placed
  and NOT silently dropped — only Brady can say if it is trip footage.
  ✅ `IMG_2760.JPG` is **cleared** — not a screenshot, a real photo of a
  ladder-bridge crossing. The 1980×3520 oddity was a red herring.
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
- 🚩 **IMAGE DELIVERY STRATEGY (CDN / lazy tiers) — flagged Aug 29, NOT fixed.**
  `dist` is **40 MB against an 8 MB target**, and the JS is not the problem:
  `dist/assets` is only **2.7 MB**. The overage is ~37 MB of images shipped as
  build output. Options to weigh when this comes up: move images to a CDN
  (Cloudinary is already a paid service here and already hosts the videos),
  responsive `srcset` tiers instead of one full-size file per photo, and
  modern formats (AVIF/WebP). **Do not start this mid-session** — it touches
  every framework's imagery and deserves its own block.

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

**LAUNCH — JANUARY 1, 2027 (target, quality-gated):**
- Digital frameworks purchasable by strangers
- Lads Travel Club opens, founding-member cap from the December capacity review
- Real social presence begins
- /bucket-list calendar view
See THE VISION AND THE TIMELINE for the seven quality gates and the
month-by-month milestones. Slipping to February is acceptable; lowering
the bar is not.

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
the January 2027 launch.)

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
  tour commissions (Viator/GYG), merch (future), paid consulting, and from
  January 2027 the two launch products: purchasable digital frameworks and
  Lads Travel Club membership.
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
- Never add "free" / "free through 2026" / "no cost" pricing copy. The site is a PREVIEW until the January 1, 2027 launch.
- **Never invent or publish a PRICE.** Pricing is a founder decision, made after
  the five conversations and locked in December. This covers the site, the
  frameworks, the Club, and merch.
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
