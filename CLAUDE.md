# THE LADS TRAVEL CO. — CLAUDE.md
## Last Updated: September 29, 2026 (evening — research agents shipped)
> Sept 29: trimmed 3,005 → ~1,700 lines. Old session logs and shipped queues moved
> verbatim to **`docs/history.md`** (a record, never a work order); their durable
> rules are distilled in **`HARD-WON LESSONS`** below.

---

## STATUS

Live: ladstravel.com (Vercel, auto-deploy on push)
Vercel fallback: lads-travel-co.vercel.app
Repo: dangelobraden43/LadsTravelCo
Stack: React + Vite, React Router, Three.js (react-three-fiber)
Email: brady@ladstravel.com (Google Workspace active)
Posture: PREVIEW — **launch target JANUARY 1, 2027, quality-gated.**
Structure: LLC. No charity, no nonprofit, no "free" anywhere on site.
Frameworks: **11** React destination routes (Peru went public Sept 8 and entered
  `canonical.js` Sept 16; Vienna split from Prague Aug 29)
Canonical total: **227 places · 14 validated cities · 11 countries · 4 continents**
  (cities 13 → 14 on **Sept 29**: Cusco graduated to a gold pin, ruled by Brady.)
  (219 → 220 on Aug 31 via Short's Elk Rapids in michigan.js. Countries 10 → 11
  and continents 3 → 4 on Sept 16 when Peru joined the table. **220 → 227 on
  Sept 24** when the live-walk began accepting a founder's verbatim take.)
  ✅ **PERU NOW CONTRIBUTES 7** — ruled and shipped Sept 24. The live-walk
  counts `description || notes || ladsTake`, because a place carrying a
  founder's own words is a described place. Seven of Peru's nine founder-voice
  places count; the two **tour-operator office records** do not, because a
  downtown Cusco sales desk is a booking record, not somewhere a reader can go.
  ⛔ **THE FORECAST IN THIS FILE SAID 229 AND IT WAS WRONG.** Two things were
  wrong with it: it assumed `note` held Brady's words (it holds **engineering
  provenance** — EXIF anchors, Tivoli-rule reasoning, renderer instructions),
  and it counted both office records as places. Promoting `note` would have
  published our own paperwork onto place cards. **The number came out of the
  data, not out of the forecast. That is the system working.**
  🔑 **THESE NUMBERS ARE DERIVED, NOT TYPED (since Sept 8, 2026).** Places are
  walked out of the `src/data/*.js` files at build time; cities/countries/
  continents are counted from `src/data/canonical.js`. The figures above are a
  human-readable snapshot for reading convenience — **the site never reads them
  from here.** ⛔ Do not type a data count into any page, string or meta tag.
  See `SEPTEMBER 8, 2026 — THE TRUTH PASS`.
⭐ **READ `THE VISION AND THE TIMELINE` FIRST** — it is the plan everything
  serves. Then **`THE SEPTEMBER 8 QUEUE`**, which is the live work order, and
  `THE NEW FRAMEWORK AGENDA` behind it. **`THE OCTOBER VISION` sets next month.**
Peru completed. Ford started May 18.
LIVE: **`/local` IS THE MAP** (graduated Sept 2, 2026). Full MIDWEST canvas
  (MN·WI·MI·IL·IN·OH + the Ontario shore) as the page hero, under the banner
  identity **"Good Brews · Good Views · Good News"**. Indexed, in nav, with a
  companion list beside it. **83 markers: 25 gold validated · 58 copper
  candidates**, plus 14 validated-but-unplaceable spots named in the list only.
  ⛔ **`/good-news` is RETIRED** — it permanently redirects to `/local`. Do not
  re-add its route or its rewrite.
  ✅ **SHIPPED TO PRODUCTION** (`f9af4b7`, merged from `feature/travel-windows`).
  `/local` carries **113 places** (16 Good Views across all six states) plus
  **THE LIVE PULSE** — 58 sourced events at 9 venues with a This Weekend filter
  — and Golfweek's cited top-20 golf slate. Every framework gained a **"When to
  Go"** section; Dublin/Spain gained **Flight Intelligence**. The branch/
  production split that used to be described here is GONE: both figures are now
  the same figure.
🟣 **PERU IS MERGED, LIVE AND INDEXED.** ✅ Shipped Sept 8 (`2446f94`), `noindex`
  lifted, in the sitemap at 0.9, and registered in `canonical.js` on Sept 16.
  ⛔ **The old "built but not merged" record in `THE PERU STANDARD-SETTER` below
  is HISTORY — do not read it as a pending action.** It sat here stale for eight
  days while /peru was public, which is how every derived surface said "3
  continents" with a South American framework live. That is the fourth instance
  of the same failure. **Re-read `git log` before writing any status here.**
  Still open on Peru: Brady's "What We'd Do Differently" words (the section is
  hidden on the live page until they land) and the photo-people ruling.
🟢 **LIVE CALL TO ACTION — `/join`, shipped Sept 17.** `EarlyAccess.jsx` on the
  homepage, `/local` and its own page, plus a gold nav CTA. Two tracks: the
  founding-member list, and a 2026 trip enquiry. See the Sept 17 record.
LIVE: `/privacy` + footer affiliate disclosure.
⏸ **`/shop` HIDDEN since Sept 29, 2026** — Shopify store suspended. Out of nav/footer, `/shop` 302s to `/`. See the Sept 29 record §7 to restore.
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
      with **zero stale windows**. (Schema in `HARD-WON LESSONS` — the Iceland `august` eclipse
      window is the worked example of exactly what must never ship. `datedUntil`
      exists so one-time events expire themselves.)
- [ ] **3. Count: 300+ published-and-described**, every spot honest per the
      endorsement gradient. Today the canonical live-walk total is **227**.
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

### ✅ GATE 6's LAUNCH-DATE FAILURE — CLOSED September 8, 2026

**Was:** the site told strangers it was "LAUNCHING FALL 2026" in seven places,
and it was Fall 2026. Nobody had written a false sentence — a true one had been
overtaken by the calendar, in seven files that knew nothing about each other.

**Brady ruled Sept 8:** state the specific date. All seven now read **January 1,
2027**, and they read it from **one constant**, `LAUNCH_LABEL` in
`src/utils/launch.js`. When the date moves it moves once and no surface can be
left behind.

⚠️ **This was option (a) of three, and it carries what option (a) carries:** we
are now publicly committed to a date the plan explicitly allows to slip to
February. If a December gate fails, changing that constant is part of the slip,
not an afterthought.

### MILESTONES, BACKWARDS FROM JANUARY 1

| Month | What must be true by the end of it |
|---|---|
| **December 2026** | Launch staging: pages in draft, **capacity review run**, cap set, **Travel Tuesday executed Dec 1**, pricing locked. |
| **November 2026** | Framework slate complete — **San Juan, Costa Rica, Bruce, Vancouver** (research-tier). Q4 commerce. **Phocuswright decision executed.** |
| **October 2026** | **GLOBAL EXPANSION MONTH.** Peru LIVE as the standard-setter — it is the bar. Every existing framework raised to it. Dawson's study-abroad countries begin. Periodic-improvement cadence running. 100% affiliate coverage. First digital product **sold** (pilot). The ride documented. The film released. **See `THE OCTOBER VISION`.** |
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

### ⛔ CLAUDE.md SHIPS WITH THE MERGE — STANDING RULE, effective September 24, 2026

**The CLAUDE.md update describing a merge goes in the SAME push as the merge.
Never in a later session. Never "next time".**

🚩 **THIS IS FAILURE INSTANCE FIVE, and the first four were all the same shape.**
Aug 26 · Aug 28 · Aug 31 · Sept 2 · and Sept 17→24, when `SESSION START STATE`
sat for **seven days** saying the truth pass and `/join` were "pending `/ship`"
after they had merged as `9a0a47b`, while the same block called `ladsTake`
"0 of 220" after the count had moved. Nobody wrote a false sentence. **A true
record was overtaken by a push it did not ride along with.**

Rule 3 above already says *write the docs commit LAST*. That was necessary and
insufficient: last-in-the-session still leaves a window, and the window is
exactly where every one of these five failures lived. So:

- **A merge to `main` that changes status is not complete until the CLAUDE.md
  edit describing it is in the same push.** If the docs edit is not ready, the
  merge is not ready.
- **`/ship` writes the record as part of shipping**, not after it.
- ⛔ **Never describe the repo from memory of how you left it.** Re-read
  `git log`, `git status`, and — for anything claiming production — the actual
  Vercel deployment SHA. A confident stale record is worse than no record.
- 🔑 **The tell:** if a status line in this file names a branch, a commit or a
  "pending", it must have been re-verified in THIS session. If it was not,
  delete it rather than carry it forward.

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

## 🟢 SEPTEMBER 29, 2026 — THE RESEARCH AGENTS

Branch `feature/research-agents`, merged to `main` in the same push as this record.
Spec `docs/superpowers/specs/2026-09-29-research-agents-design.md` · plan
`docs/superpowers/plans/2026-09-29-research-agents.md`.

### 1 — THE "6 AI RESEARCH AGENTS" CLAIM WAS NOT TRUE. NOW IT IS, AND IT COUNTS ITSELF.

The homepage said **6** from April 15. A full search (every branch, the stash,
the worktrees, user-level config) found **no agent ever committed**. The April
research was Brady's Google research passes, turned into synthesis documents.
Sept 29 made the switch to Claude Code's own research stack:

- **14 agents in `.claude/agents/`** — 12 researchers in five lanes (*Where ·
  When · Getting there & around · Cost & savings · Before you go*), one
  **Independent Verification** fact-checker, and the internal **Itinerary
  Architect** that assembles the founder packet. Display names, lanes and
  one-line summaries live in each file's `lads-label / lads-group / lads-summary`.
- **One shared law:** `.claude/skills/research-contract/SKILL.md`, preloaded by
  every agent. Output format, sourcing bar, ranges-never-points, banned content,
  walked vs **researched** mode.
- **Researched mode is first-class (Brady):** most future planning, and the parks
  guide above all, is places nobody has walked. Two independent sources for
  anything actionable; coordinates only from an authoritative record for that
  exact entity (Wikidata, NPS, official site). Rendered copper, never apologised for.
- **`/research <destination>`** (`.claude/skills/research/SKILL.md`) runs them
  two at a time, then the verifier, then the architect →
  `internal/research/<dest>/<runId>/PACKET.md` for founder review. Publishes nothing.
- **Enforcement is mechanical, not a promise** — `tools/research/`:
  `validate.mjs` (the contract as code), `guard.mjs` (agents may write only to
  `internal/research/` and `.claude/agent-memory/`), `hook-validate.mjs` (bad
  output goes back to the agent; second failure releases with `.INVALID.txt`).
  Both hooks are wired in **`.claude/settings.json`** and act only when
  `agent_type` starts with `lads-`. **`npm test` → 60 tests.**
- **Agent memory is committed** (`.claude/agent-memory/`): durable source lessons
  only, never findings.
- **Homepage:** `AGENT_COUNT` / `AGENT_ROSTER` come from `virtual:lads-stats`,
  read from the agent files at build. **13** today. The literal `'6'` is gone.

### 2 — THE LIVE HOOK TEST CAUGHT TWO THINGS THE UNIT TESTS COULD NOT

An agent was told to write `src/data/smoke-test.js`. **It succeeded, twice.**
1. **Hooks in an agent's frontmatter do not fire for Agent-tool subagents.**
   Moved to `.claude/settings.json`, keyed on `agent_type`.
2. **Exit code 2 from a PreToolUse hook is ignored inside a subagent** — a
   wrapper logged the guard exiting 2 with its reason while the write went
   through. The structured stdout form (`permissionDecision: "deny"`;
   `{"decision":"block"}` for SubagentStop) **is** honoured. Verified live: the
   write refused, a "$18" point price sent back and fixed. The stray file was
   never committed. ➡️ **Click the things applies to infrastructure too.**

### 3 — PILOT 1: VANCOUVER (researched mode, 4 agents)

`internal/research/vancouver/2026-09-29T15-59/` (gitignored). **81 findings, every
file valid.** Verifier: **22 confirmed · 13 corrected · 46 unverifiable** — the
last because it ran out at 20 calls (queue item 1). What it caught was real: the
Museum of Anthropology "530,000 objects" is **nearly 50,000** (museum's own
page); the Grouse Grind is **2.5 km** not ~3; the Capilano price claim had tax
and online discounts backwards; the daily budgets were agent arithmetic, not a
published range. Also resurfaced: Mount Seymour's saved pin is a summit point;
the Celebration of Light cancellation. **Comparison report not yet written.**
⚠️ The Capilano Twilight Rate (25% off after 5pm) **expires Oct 8** — it lives only
in staging and must never be typed onto a page.

### 4 — THE HOMEPAGE, CHANGED WITH BRADY IN THE VISUAL COMPANION

- **How It Works** (`src/HowItWorks.jsx`): four plain steps, click an icon to go
  deeper (the brief · the twelve specialists by lane, selectable · confirmed /
  corrected / left out with the real museum example · what you receive). Two
  rejected rounds taught the brief: **plain, professional, descriptive; no
  example data a stranger has to decode; no chat-slang.** Replaced the vague
  "Research / Validate / Rate / Build / Deliver" row. Click-tested at 1440 + 390.
- **Cusco → gold, validated cities 13 → 14 (Brady ruled).** `Globe.jsx` kept its
  own out-of-date walker (pre-Sept 24 rules), so gold pins summed to **220 under a
  227 caption**. Counting now lives once in `derive.js` (`isCountedSpot`,
  `countSpotsByCity`, `derivePinCount`); attribution moved to `canonical.js`;
  `tools/tests/pins.test.mjs` fails if they ever disagree again.
- **"90% of AI itineraries contain factual errors"** was unsourced and rested on a
  May 2024 ChatGPT-3.5 test. Replaced with the **Greetwell survey, Aug 2026, 1,000
  U.S. leisure travelers: 55% of AI users hit a bad recommendation**, linked on
  the page, plus what we actually do. Brady approved "Founders validate."
- **Dead CTAs fixed:** both *Start Planning* buttons went to `/plan` (redirects to
  `/`) — now `/join`. `/explore`, `/adventure` pills → `/global`, `/outdoors`.
  Peru's "Framework coming soon" (three weeks after it went live) → links `/peru`.

### 5 — RULINGS

✅ **RULED by Brady, Sept 29:**
1. **Travel cards: recommend, but always show every option.** Cards are a real way
   to save and earn toward future travel. A recommendation is allowed only
   alongside every relevant option with trade-offs (fees, earning, partners, who it
   suits, the catch); never one card alone, never urgency. Written into
   `lads-rewards-points` and the research contract. Affiliate rendering is still a
   separate, disclosed publish-time decision.
2. **"No admission charge"**, never "free", for third-party no-cost entry.
3. **Rewards research is for Lads Travel Club members** — all of it.

4. **All 14 agents run on Opus, the strongest model** (Brady, Sept 29 evening). Revisit
   if token spend becomes a problem; the switch is one `model:` line per agent file.
5. **Budgets the agents add up themselves may ship** when rooted in quality sources:
   `derivedFrom` must name the sourced findings they were built from, and the
   validator rejects a missing or self reference (`tools/research/validate.mjs`,
   4 tests). Arithmetic goes in `notes`; the result stays a range.
6. **Discovered places publish on framework pages as researched, not visited**, in
   both walked and researched frameworks, held to two independent sources. Brady:
   *"we obviously weren't able to visit everywhere even if we have been, and we are
   going to do this for the fully researched frameworks in any case."* The scout marks
   them `DISCOVERED:` in `notes`. ⚠️ The framework pages have no rendering for this yet:
   when the first discovered place is published, it needs the copper
   "researched, not visited" treatment on the card, never gold.

### 7 — EVENING: SHOP HIDDEN, HOW IT WORKS MOVED, FULL QUALITY SWEEP (branch `fix/quality-sweep`)

- ✅ **Production verified:** Vercel READY for the research-agents merge (`8057f29`);
  the live page showed How It Works, 13 agents, 14 cities, the survey. ⚠️ The domain
  switched ~1 minute AFTER READY — check the served `index-*.js` against the local
  build before concluding a deploy is stale. Phones may show a cached page.
- ⏸ **`/shop` HIDDEN (Shopify store suspended).** Removed from nav and footer;
  `/shop` → `/` as a **temporary (302)** redirect plus a client `<Navigate>`.
  `ShopPage.jsx` stays in `src/`, unrouted and unbundled. To restore: re-add the
  nav/footer items, the route and the `/shop` rewrite; drop the redirect.
- **How It Works moved directly beneath the globe** (Brady).
- **Quality sweep:** a Playwright audit of 21 routes at 1440 and 390 — overflow,
  broken images, alt text, retired links, headings, titles/canonicals, tap targets,
  banned/stale phrasing. **Structure is clean everywhere** (0 overflow, 0 broken
  images, 0 missing alt, 0 retired links, one h1 per page, no JS errors).
  Fixed in this batch:
  1. **`/bucket-list` was stale:** Vivid Sydney "HAPPENING NOW" 3.5 months after it
     ended; Oktoberfest "COMING SOON" while running. Status is now computed from
     `start`/`end` (`src/utils/events.js`, `tools/tests/events.test.mjs`); past
     events drop off; "framework coming soon" lines removed.
  2. **`og:image` pointed at a file that never existed** — every shared link had no
     preview image. `public/og-image.jpg` (1200×630 hero, 136 KB) + width/height +
     `twitter:image`.
  3. `/global`, `/when`, `/lads` had no title or canonical — added.
  4. Dublin "Happy hour available (times TBD)" removed (a placeholder on a live page).
  5. How It Works "Learn more" links raised to 44px tap targets.

**✅ QUICK FIXES SHIPPED (late Sept 29, branch `fix/quick-fixes`):**
- **Nav pills 20px → 40px tall on phones** (`index.css`, ≤640px). Click-tested at 390
  and 320: no overflow, header height unchanged, a tap lands on the right route.
- **`/michigan` "COMING SOON" logistics card removed:** the Logistics section now
  renders only when a framework has `logistics` or `costModel` (`FrameworkPage.jsx`).
  Dublin's still renders.
- **`/outdoors` trek badges:** "Coming soon" → "On the list" (no date promised).
- **Footer "Follow Along":** shows only socials with a real URL. **Instagram is live**
  (https://www.instagram.com/ladstravelcompany/, Brady, Sept 29) and is in the
  homepage JSON-LD `sameAs`. TikTok and YouTube stay hidden until they have URLs —
  add them to `SOCIALS` in `Footer.jsx`.

**⏭️ QUALITY BACKLOG — still open, in priority order:**
1. **"free" in framework copy — ~130 occurrences across 11 frameworks, NOT ~12.**
   (The first sweep reported one match per page; the recount is from `src/data`.)
   Brady ruled "no admission charge" for no-cost entry. ⚠️ **Not a find-and-replace:**
   "Bobby's Free" is a bar name, "KEF Duty-Free" a shop, itinerary "Free Day" means
   free *time*, "free pasta hour" is a hostel's own offer, and `priceRange: 'Free'`
   renders as a chip. Do it as its own pass, line by line, and never touch
   `ladsTake`.
2. **"← Back home" (16px) and footer email links (16px)** are still small tap targets.
3. **Every page carries the site-wide meta description**; per-page descriptions are
   added alongside, not instead. Real fix: pre-render (or strip the static tag once
   pages set their own).
4. ✅ **`/gift/michigan` RETIRED Sept 29 (Brady):** an Apr 15 standalone "premium gift" Michigan page,
   unlinked since May. Deleted; `/gift/*` permanently redirects to `/local`, which replaces it.

### 6 — THE FINAL REVIEW (independent, Opus) — 0 Critical, 3 Important, all fixed

1. **Point-price hole:** one range anywhere excused every price in a claim ("Entry
   is $25; tours run $40-60" passed; "euros"/"S/" missed). Now each amount must
   itself be part of a range; notes scanned too. Re-run over the Vancouver pilot it
   caught **6 findings the old check had passed.**
2. **Relative hook paths failed OPEN** when cwd moved. `"$CLAUDE_PROJECT_DIR/…"`
   was tried and **failed live** (Git Bash expands it to empty in hooks). Hooks now
   launch via `node -e` resolving `process.env.CLAUDE_PROJECT_DIR` inside node.
   Verified live: `src/data` write denied; the "$25; $40-60" claim bounced and fixed.
3. **Stop hook could validate an older run.** It now checks only the run with the
   newest `RUN.json`, and writes `<agent>.json.MISSING.txt` when nothing was written.
4. (Minor, upgraded) **How It Works keyboard:** closed panel is `inert`; × and Esc
   return focus to the icon. Verified in browser.

**Deferred minors** (logged, not fixed): malformed hook stdin fails open (Claude
Code always sends JSON); `claude --agent lads-x` runs get no Stop validation;
resizing across 760px with a panel open resets the chosen specialist; roster test
hard-codes 13/12/1; "N independent fact-checker" grammar if the count ever
changes; the survey line mixes our copy into a quoted statistic and links a news
report rather than Greetwell directly.

---

## 🟢 SEPTEMBER 24, 2026 — THE AFFILIATE STRUCTURE, THE DEAD TREE, AND 227

Branch `feature/affiliate-structure`, **4 commits** (3 build + this record),
pushed. ✅ **Merged to `main` as `884ce47`** (verified in `git log` Sept 29).
`c654484` the gate · `dd5e8ae` the deletion · `7f3d0e6` the count · **the docs
commit is the tip — read `git log` for its SHA.**

ℹ️ **TWO DRAFTS OF THIS LINE WERE STALE BEFORE THEY LANDED, and the second one
is the more useful lesson.** Draft one said "3 commits" and named the count
commit as the tip; the docs commit then landed on top of it. Draft two counted
itself but *named its own SHA* — which changed the instant the commit was
amended. **A record cannot cite its own hash: the hash does not exist until
after the text is written.** So it does not try. It names the three commits it
can know and points at `git log` for the one it cannot. That is the shape any
self-describing status has to take to survive the
`CLAUDE.md SHIPS WITH THE MERGE` rule.

Session opened with a **seven-day gap** since `9a0a47b` — the 3+/week cadence
was missed. Vercel was verified READY on `9a0a47b` by SHA before any work began.

### 1 — AFFILIATE COVERAGE WAS NOT LOW, IT WAS IMPOSSIBLE

`bookingUrl` rendered at **exactly one place in the entire codebase** — inside
the `dayTrips` block of `FrameworkPage`. So October's *100% affiliate coverage*
goal could not have been reached by any amount of data entry. It needed a
component, and no data pass would ever have revealed that.

| | Reachable surface | Filled |
|---|---|---|
| Before | **22** (day trips only) | 4 |
| After | **227** (every counted place) | 4 |

⚠️ **The 22 day trips were always INSIDE the 227**, not additive — they carry
`name` + `description`, so the live-walk has always counted them. The honest
statement is **reachable 22 → 227, a 10.3× increase; filled 4/227 = 1.8%.**

- New **`BookingCTA`** in `PlaceLayers.jsx`, rendered on BOTH place-card paths —
  the v2 two-layer card AND the legacy category-array card. Leaving the legacy
  path out would have capped reachable coverage at the four v2 frameworks.
- **`src/utils/affiliate.js` had ZERO importers.** Both live Viator links were
  pre-tagged string literals pasted into data files, so `viatorLink()` guarded
  nothing and an untagged paste looked identical in review. New
  **`resolveBooking()` is now the only path a booking link takes to a page:**
  it tags Viator at render (idempotent — a stale or missing `pid` cannot ship),
  **derives the platform NAME from the host** so the data cannot lie about it,
  and **returns null for any unapproved host**, which renders nothing.
- **`isBookingEndorsed()` centralises the gradient.** `ladsRating` remains the
  only accepted evidence, for places as well as day trips. ⛔ `validated: true`
  is deliberately NOT enough — it can mean a founder curated a saved list
  without standing behind a bookable product. **No framework spot carries a
  rating today, so every place-level link renders NEUTRAL.** That is the correct
  starting state, not a gap to paper over.
- Outbound booking links now carry `rel="sponsored"`.

✅ **VERIFIED BY CLICKING, NOT BY SCREENSHOT.** At 1440 and 390: Kilkenny
(`bookingEndorsed: false`) renders neutral outline; Cliffs of Moher renders
solid gold + WE DID THIS, tagged; Rome's Pompeii renders gold reading **"Book on
GetYourGuide"** with the platform derived from the host. Tap target 52×270 at
390. No horizontal overflow (375/390). Only console errors are the known Vercel
analytics 404s.

### 2 — THE DEAD TREE HELD 47 FARES AND A RETIRED DESTINATION

`PlanPage → SystemSection → TravelWindows` was built, bundled, deployed and
reachable by NOBODY: `/plan` has 301'd to `/` since the May 31 rebrand and
`PlanPage` has no `<Route>`. Only an orphan `lazy()` import in `main.jsx` kept
the whole tree in the bundle.

🚩 **What was inside it, found while deleting it — the audit said 20 fares:**
- **47 hand-typed dollar figures**, none sourced: `$580 round-trip`, `$880 in
  July`, `$680 versus $950`, plus `34% drop`, `40% shorter lines`, `25 minutes
  versus 90+`.
- **THAILAND, named twice.** Retired **Aug 13** — six weeks. The Sept 17 truth
  pass deleted Thailand and ten authored fares from `/when`; **the identical two
  faults sat in this tree the entire time** and were missed because nothing
  renders it.

➡️ **That is the `ALL_CITIES` shape exactly: dead code holding false numbers is
a loaded gun, and it cannot be caught by reading the site — because it is not on
the site, until someone wires it up.** `dist/assets` 3.1 MB → 3.0 MB.

⚠️ **Two provenance comments in `peru.js` cited `SystemSection.jsx:436`** as the
fourth witness for the May 7 = Rainbow Mountain ruling. Updated to say the file
lives at **`869b3e1`** rather than point at nothing. **The finding does not
weaken** — it was settled from four directions and three are still in the tree.

### 3 — THE COUNT RULING: 227, NOT 229

Brady granted the `note`→`notes` promotion. **Implemented against the data
rather than the forecast, and it lands on 227.** Both differences are deliberate
and both matter.

⛔ **`note` IN `peru.js` DOES NOT HOLD BRADY'S WORDS.** It holds **engineering
provenance** — EXIF anchor coordinates, Tivoli-rule reasoning, and renderer
instructions like *"Do NOT render this as the trek's location"*. Renaming that
key would have published **our own paperwork onto place cards**, which is the
exact thing Brady ruled against on `/peru`, and would have passed the 300+ gate
on entries that describe nothing to a reader. **The gate is "published AND
described"; padding it with silent entries fails it rather than passing it.**

✅ **`ladsTake` is the key that actually holds a description.** The live-walk now
accepts `description || notes || ladsTake`, because **a place carrying a
founder's verbatim words is a described place** — described by a person rather
than a research pass, which is the stronger of the two and the entire product.

⛔ **OFFICE RECORDS ARE NOT PLACES.** Two of the nine founder-voice places are
tour-operator records (`Salkantay Trek`, `Red Valley Cusco`) sitting on a
downtown Cusco sales block ~100 km from what they name, already flagged
`recordIsOffice` and already refused by `PeruMap`. **Excluded. The 229 forecast
counted both as places.** `PeruPage`'s existing duplicate-quote guard already
gives the one shared ATV sentence to Vinicunca over the office record, so no
founder sentence is counted twice.

🚩 **A BUG THE VERIFICATION CAUGHT AND THE BUILD DID NOT.** Accepting `ladsTake`
added **+1 to all ELEVEN frameworks** — every framework ROOT carries a `name`
and a framework-level `ladsTake`, the quote `FrameworkPage` renders about the
destination as a whole. A container is not one of its own places. Guarded via
`isContainer()`. **All ten pre-existing frameworks then re-derived to their exact
prior counts** (38/37/27/23/22/22/17/15/11/8 = 220); Peru adds 7.

**227 · 13 cities · 11 countries · 4 continents.** Nothing was hand-typed:
`index.html`'s meta description rebuilt itself to *"227 validated places"* and
the homepage reads 227 in three places with zero stale 220s.

### 4 — THE STALENESS RULE IS NOW STRUCTURAL

Instance five, closed. See **`CLAUDE.md SHIPS WITH THE MERGE`** under CADENCE.
Rule 3 ("write the docs commit LAST") was necessary and insufficient — last in
the session still leaves a window, and that window is where all five failures
lived. The docs edit now ships in the **same push** as the merge it describes.

### ⏭️ QUEUED, DELIBERATELY NOT STARTED

**THE CLOUDIMAGE BUNDLE BLOCK.** `dist` is **41 MB against an 8 MB target**;
`dist/assets` is only 3.0 MB, so **~38 MB is images**. `CloudImage.jsx` already
exists and is the answer. Brady scheduled it as **its own session, this week.**

---

## 🟢 SEPTEMBER 17, 2026 — THE AUDIT, THE CALL TO ACTION, AND THE VERDICT ROOM

Branch `feature/truth-pass-round-2`, 2 commits. ✅ **Merged to `main` as `9a0a47b`** (verified in `git log` Sept 29).
`259f0c6` the truth pass · `45c58f6` `/join` + early access.

### 1 — TRUTH PASS ROUND 2 IS DONE. All three items closed.

- **`/when` carried TEN hand-typed point fares** (`$480 avg RT` and nine more)
  and still listed **Thailand**, retired Aug 13, five weeks after its route,
  rewrite and sitemap entry were all deleted. A retired destination with an
  invented price on it, on a live page.
- **The fix was deletion, not retyping.** `fareIntelligence.js` already states
  our position in code: every `bands` field is deliberately `null` and
  `FARE_BANDS_BLOCKED` records why. **The page was publishing ten numbers our own
  data layer formally refuses to state.** In their place `/when` now ends on
  `BOOKING_LEAD_TIME`, which is sourced, dated, and reports the disagreement
  between sources rather than picking the tidier answer.
- 🔑 **It renders behind `isFareStale()`** — the first real call site that
  predicate has ever had. If nobody re-checks the sources within a quarter the
  block removes itself. That is the Iceland eclipse lesson wired in rather than
  written down.
- `SystemSection`: removed "flights from ORD under $500" plus two "under $2K"
  claims. **"35+ pubs" STAYS** — a founder's word about a trip, authored on
  purpose. `NorthAmericaSection.jsx` was already gone.
- **Found doing it:** `/when` was the surface the Sept 16 "places" rename missed.

### 2 — `/join` — THE SITE HAS A CALL TO ACTION FOR THE FIRST TIME

Until today the only route to us from our own website was a Formspree form
inside `/lads`, **which is not in the nav.** New: `EarlyAccess.jsx` + `.css`,
`JoinPage.jsx` at `/join` (routed, rewritten, sitemap 0.9, own canonical),
embedded compact on the homepage and `/local`, and a gold nav CTA.

**Email first, everything after it optional, and the email posts on its own
submission the moment it is given** — abandoning the optional questions still
leaves us the only field that matters. Two tracks self-select: a trip before the
end of the year opens a fuller intake, everyone else joins the founding list.

⛔ **THE "FREE" RULING — see also the RULES section.** Brady asked for "free trip
advising for the rest of 2026". That string is banned and has been purged three
times. Offered the choice, **he kept the rule**: the advising ships with no cost
claim on the page, and the price is said in the reply. **Do not delete the
advising copy as a violation, and do not add the word.**

🚩 **A REAL BUG, FOUND BY USING IT RATHER THAN LOOKING AT IT.** The destination
multi-select read its array from the render closure, so two quick taps dropped
one — Ireland and Peru went in, only Peru came out. Fixed with functional
updates. **A screenshot would never have caught this.** Same lesson as the
`/local` pins and the Peru map panels, now three times over.

### 3 — THE COMPANY AUDIT, and the five drifts it found

Full document: **https://claude.ai/code/artifact/b8eb3222-89b9-4278-bb52-ace6d6965b22**

| The record said | The code said |
|---|---|
| `/peru` noindex, unmerged | Public, indexed, merged, in `canonical.js` |
| 10 frameworks · 10 countries · 3 continents | **11 · 11 · 4** |
| "Use `viatorLink()`" | **`affiliate.js` has ZERO importers** |
| Personal layer "mostly empty" | **Entirely empty — 0 of 220** |
| 2 dead data keys | **7** (+ `itinerary`, `confidence`, `region`, `route`, `templeBarWarning`) |

🚩 **THE THREE THAT COST MONEY OR TRUST:**
1. **`src/utils/affiliate.js` is imported by nothing.** Both live Viator links
   are pre-tagged string literals pasted into data files. The guard protects
   nothing and an untagged paste looks identical in review.
2. **Affiliate coverage on places is structurally 0%.** `bookingUrl` renders at
   exactly one place in the codebase, inside `dayTrips`. October's "100%
   coverage" goal needs a **component change**, not a data pass.
3. **`PlanPage` → `SystemSection` → `TravelWindows` is built, bundled, deployed
   and UNREACHABLE** (`/plan` 301s to `/`, `PlanPage` has no `<Route>`). ~65 KB
   of dead JS+CSS holding a hand-typed table of **20 unsourced fares**. Same
   shape as the `ALL_CITIES` loaded gun. **Recommendation: delete the tree.**

**The headline finding is about the cap.** The December capacity review has no
data source, and it is the only gap here that cannot be closed in a week because
the data has to accumulate.

### 4 — THE VERDICT ROOM — the founder tool, and the capacity instrument

**https://claude.ai/artifact/WR4RysanRRLGVCd7mssQMk** · share to Dawson as
"Can interact". All 220 places, **six rating systems, five levels each**, in each
genre's own language — a pub asks what the room is for and whether you can talk
in it; an attraction asks whether it is worth the ticket and the queue. Brady's
call, and it is the right one: *"you cant rate an attraction and pub on the same
scale."* No number is ever shown; the five levels map to the endorsement
gradient behind the scenes, so `ladsRating` keeps working.

- **"Neither of us has been" is a first-class button.** A place nobody visited
  can never carry a verdict.
- **48 places arrive with no usable category** and are asked what they are before
  any scale appears. Triage is a step, not a guess.
- ⛔ **The anecdote, the trap and who-it-is-for are founder-only**, as always.

🔑 **BRADY'S CORRECTION, and it changed the design.** The cap does not depend on
research throughput. It depends on **how long it takes to orchestrate a framework
once a client's preferences and trip details are in hand** — which varies by
trip and customer and cannot be read out of git. So the tool times the work as
it happens: every card times itself, and a **Client runs** tab times a real run
end to end. **December's cap comes out of those rows.** It refuses to average
fewer than three.

### 5 — RESEARCH BANKED — two unpublished lists, Stage 1 complete

Agents ran the `enrich` pipeline. **Zero founder-voice lines written**, every
claim sourced, thin rows shipped empty and say whether we looked or could not.

- `internal/brady/vancouver-enrichment.md` — 20 spots (House of Funk
  **suppressed, permanently closed**), 31 of 65 web calls.
- `internal/brady/costa-rica-jaco-enrichment.md` — 24 spots, 38 of 70 calls.

🚩 **TWO TRAPS CAUGHT BEFORE THEY REACHED A PAGE:**
1. **Grouse Mountain and Mount Seymour coordinates are SUMMIT points**, not the
   places you go. Mount Seymour's is repeating decimals in both axes. Pinned at
   face value they send a reader up a mountainside. **This is the Peru
   `recordIsOffice` trap in Canadian form** — recommend `coordinateIsSummit`.
2. **The Honda Celebration of Light is CANCELLED** — funding collapsed, replaced
   by one night on July 31 2026. Every older guide still names it as Vancouver's
   August anchor. An events window written from guide consensus would have
   published a festival that no longer exists. **An Iceland-eclipse-shaped trap,
   caught pre-publication.**
3. **Oz Poolside Bar and Oz Hotel are ONE property**, not two venues — the
   routing table's declustering note was wrong. Two pins would state a falsehood;
   filter the second record out the way the Cusco office records are filtered.

⚠️ **Accents:** the Jacó file carries a correction table and an explicit
unresolved list. **No data file may be built from the ASCII staging text.**

---

## 🟣 THE PERU STANDARD-SETTER — built September 8, 2026. Branch: `feature/peru-standard-setter`

✅ **MERGED AND LIVE** as `2446f94` (Sept 8), indexed, in the sitemap, and in
`canonical.js` since Sept 16. ⛔ **The branch/commit/"noindex" detail below is the
build record from Sept 8 — history, not pending work.** What is genuinely still
open on Peru is listed under `STILL OPEN ON PERU` at the foot of this section.

### THE COMMITS

    18ad784  Lane 2 — the interactive country map on real data
    dfad8af  correct an unverified count in a code comment
    06bba9a  Lane 3 — the /peru page shell and its motion language
    4f96227  merge Lane 3 into the standard-setter
    5827e17  every map target actually works, and the panel actually says something
    bce1440  real photography, and stop showing the reader our own paperwork
    9cf9861  the practical layer — tickets, permits, packing, ways to save
    741b0fb  GETTING IN — the four routes to Machu Picchu, costed and compared
    d483aef  the map was unreadable, the hook was flat, and 16 cards were empty
    b47dd47  drop the locked trip length, and make the map read like a map

### NEW FILES, AND WHAT EACH IS FOR

| File | What it is |
|---|---|
| `src/PeruPage.jsx` / `.css` | The page. Nine sections, motion language, reduced-motion complete |
| `src/PeruMap.jsx` / `.css` | The interactive country map. Props-driven; the other nine frameworks inherit it |
| `src/data/peruGeo.js` | GENERATED. Peru traced from Natural Earth 1:50m, 589 → 200 points |
| `tools/trace-peru.mjs` | The tracer that regenerates it. Same method as `trace-midwest.mjs` |
| `src/data/peruConsensus.js` | **The research layer.** Public consensus for all 25 places, sourced |
| `src/data/peruPrepare.js` | Tickets, permits, packing, ways to save |
| `src/data/peruRoutes.js` | The four ways into Machu Picchu, with cost bands |
| `src/CloudImage.jsx` / `.css` | **Site-wide image delivery.** Not Peru-specific — see below |

Modified: `MapPins.jsx` (+`collapseDense`), `peru.js` (one stale note fixed),
`main.jsx`, `vercel.json`.

### 🔑 WHAT CAME OUT OF THIS THAT THE WHOLE SITE INHERITS

1. **`CloudImage.jsx` — the image delivery layer, ruled by Brady.** Cloudinary,
   `f_auto/q_auto`, six-width srcset, lazy below the fold, blur-up, **alt text
   required** (it throws without one), width/height so CLS stays at zero.
   ⛔ Do not hardcode a `res.cloudinary.com` URL anywhere else.
   ➡️ This is the answer to `dist` sitting at 40 MB against an 8 MB target with
   images as the entire overage. Every framework that gains imagery from here
   makes that better instead of worse.
2. **`collapseDense()` promoted into `MapPins.jsx`.** ⚠️ `GoodNews.jsx` still
   holds its own local copy for the Midwest map. Migrate it in a follow-up
   rather than editing both. It was left alone on purpose: `/local` is in
   production and mid-session was not the time.
3. **The AOI crop pattern.** A tall country in a wide box is a general problem,
   and the fix generalises: crop the viewBox to the ground the trip covers,
   padded to the box's aspect. See the map defect below.

### 🚩 FIVE DEFECTS FOUND BY REVIEW, NOT BY BUILDING

Every one of these rendered fine and was wrong. Worth reading before the next
framework repeats them.

1. **The map was portrait in a landscape box.** Traced canvas 698×1000, the box
   is 16:10. `meet`-fitting shrank all of Peru to ~468px inside a 1072px frame
   and reduced every pin to a speck. Brady: *"a random GIS AI map that has no
   pins or interactive ability."* Fixed by cropping the viewBox to the trip
   (386×241, a **1.81× zoom**). The projection is unchanged and **no pin moved**.
2. **Every pin opened an empty panel.** `MapPins` calls `onToggle(pin.id)` with
   ONE argument; the handler took `(place, id)` and ran `placeToPanel` over an
   id string. The panel still appeared, so a screenshot looked fine.
   ➡️ **Clicking all 21 targets is what found it.** A rendering check is not a
   verification — the same lesson as the Sept 2 `/local` audit, learned again.
3. **A class collision between two lanes.** Lane 3's trek rail used
   `li.peru-day`; the map used `g.peru-day`. `PeruMap.css` was bleeding onto the
   page's list items. The map's classes are now `peru-mapday*`.
4. **`PERU_SAVED_SOURCE.note` was a false claim** — still reading "split not yet
   supplied, all entries research tier" while all 25 are `validated: true`.
   Lane 3 caught it and refused to render it. Same shape as the Iceland eclipse
   window: true when written, false since Aug 28, survived only because nothing
   rendered it.
5. **A count typed from memory into a code comment** (18 Cusco places; the
   measurement is 12 inside a 0.63 × 0.39 pixel box). Corrected. The habit this
   week was spent removing from pages applies to comments too.

### ⛔ THE PRESENTATION RULES BRADY SET, AND THEY GOVERN EVERY FRAMEWORK

He reviewed hard and the same error appeared three times in three places: **our
pipeline state, and our itinerary, presented as the product.**

- ⛔ **Never publish our own completeness accounting.** Gone: the hero stat
  "In his words: 8", "N of the 25 carry no note from us", "25 saved places, 8 of
  them spoken for", and "No note from the Lads on this one" on every silent card.
  **Absence is never announced.** The anecdotes are being filled in through the
  Notion queue and get integrated later; a reader has no use for the progress bar.
- ⛔ **No "IN HIS WORDS" chips.** Brady: *"this is a professional site not a
  quote board."* The site's voice IS the Lads' voice, so a founder line simply
  reads as the description. No captioned pull-quotes, and **never** print
  `BRADY_TAKE_SOURCE.medium`, which renders as "Brady, direct to Claude Code in
  session".
- ⛔ **Never advertise a trip length as a metric.** Brady: *"you can make this
  trip as long or as short as you want."* The hero reads **Ways in / Places /
  Regions / Travelled** with no duration anywhere. Our itinerary is one way to
  run it, not the runtime.
- ⛔ **No internal flags on the page.** The "LABEL DISPUTED" chip is gone, and
  day 6 renders as **Vinicunca — Rainbow Mountain**, because that question was
  CLOSED from four independent directions. The data keeps the flag; the page
  states the finding.
- ⛔ **Miami is removed entirely.** A departure-day GPS fix in Florida. It stays
  in `peru.js` as provenance and is filtered out by the data's own `inPeruArc`.
- ⛔ **No raw coordinates on a place card.** That is how we know the pin is
  right, not something a traveller reads.

### WHAT THE PAGE NOW CONTAINS

- **Hero** — the Machu Picchu photograph, and a hook that leads with the actual
  choice: reach it on a train in an afternoon, or walk in over a 4,600 m pass.
- **The Route** — the interactive map. 23 of 25 places on canvas, 9 day anchors,
  the two office records **provably excluded** (0 leaked, asserted in code).
  Cusco's 12 collapse to one honest count marker; **clicking it re-projects them
  into a street-scale frame where each gets its own pin on its own true
  coordinate** — 268 × 169 units of spread instead of 0.63 px.
- **When To Go** — the four driver-typed windows, sourcing visible.
- **Getting There** — fare intelligence with sources and `checkedOn`.
- **GETTING IN** ⭐ — the four routes compared on one **logarithmic** cost axis.
  Salkantay clusters $500–750, Inca Trail $800–900, train $70–250,
  Hidroeléctrica $15–40. Log scale on purpose: linear across 15–3,500 renders
  the budget routes as slivers and flatters the luxury end.
- **Before You Go** — tickets from the **government portal** (`tuboleto.cultura.pe`,
  `machupicchu.gob.pe`, or the Cusco offices), circuits fixed at purchase,
  **Huayna Picchu as its own permit with the push to take it**, packing, and six
  sourced ways to save.
- **Lima** — Maido holds The World's Best Restaurant 2025, Central held it in
  2023, and the 50 Best ranking is staged in Lima in November 2026.
- **The Trek** — how we ran it and where you would flex.
- **The Places** — all 25 with the research layer. **25/25 carry research, 20
  carry a trap, zero are empty.**

### ⛔ THE TWO-LAYER RULE, WHICH IS THE PRODUCT

`ladsTake` is Brady verbatim or empty. `peruConsensus.js` is what the public
says, labelled, indented, quieter, and sourced on every entry. **They render
differently on purpose and must never be mistaken for each other.** Nothing in
the research layer was written to fill a silence. An empty `criticized` renders
NOTHING rather than "no complaints found", which would be an endorsement we did
not make, and genuinely thin entries say **"limited coverage"** out loud.

### 💰 THE MONEY RULE, EXTENDED

Third-party costs may ship as **RANGES WITH SOURCES AND A CHECK DATE**, never as
point prices — the discipline already in `fareIntelligence.js`: *"$780 is a
promise. $650–$900 is a pattern."* These are researched market ranges published
by others, and the page says so. **Our own pricing still appears nowhere.**
⛔ **No operator is named, ranked or endorsed.** The tiers describe what changes
as you pay more, which is a market fact. Who to hand money to is a
recommendation we have not earned, and we take affiliate revenue in this
category. Brady asked for "different operators" and got tiers instead — **if he
wants named operators that is a line to cross deliberately, not by default.**

### PHOTOGRAPHY

12 frames from May 2026, converted from HEIC and uploaded to Cloudinary under
`peru/`. Nine are placed: the hero, four section figures, three full-bleed bands
carrying section transitions, and the approach shot opening Before You Go.
⚠️ Three of the twelve show people other than the founders and are **deliberately
unused** — Brady's ruling on including them never landed.

### 🚧 THE THREE GATES BEFORE `/peru` CAN BE INDEXED

1. **Lift `noindex` and add `/peru` to the sitemap** in `vite.config.js`.
2. **"What We'd Do Differently" is empty by design** and needs Brady's words.
3. **No Lads voice in any section intro.** They are neutral and factual per the
   standing rule. The markup takes his lines; they are his to write.

### ➡️ STILL OPEN ON PERU

- **Trip-versions framing.** Spain carries 3 versions by group size and budget;
  Peru does not. This is the last structural gap against Spain-level depth.
- **The photo-people ruling**, above.
- ✅ **RESOLVED Sept 24, 2026 — canonical totals DID move, to 227.** This entry
  used to read "Peru is still not a counted framework… **220 stands**". The
  live-walk now accepts a founder's verbatim `ladsTake` as a description, so
  **seven** Peru places count. The two tour-operator office records do not. See
  the Sept 24 record for why the answer is 227 and not the forecast 229.

---

## 🟢 SEPTEMBER 8, 2026 — THE TRUTH PASS. Every displayed number now derives.

**SHIPPED TO PRODUCTION.** `main` is at `869b3e1`, `main == origin/main`, and the
deployed bundle was verified to carry the new build (the `PAID LAUNCH` marker is
present in the live App chunk at ladstravel.com). `f9af4b7` — the travel-windows
platform work — also landed on main this week.

### WHAT THE AUDIT ACTUALLY FOUND — the `/michigan` four were the small half

The session opened intending to fix four false claims on one page. The sweep that
followed found the **same class of failure on six more frameworks and five shared
surfaces**:

| Surface | Claimed | Data held |
|---|---|---|
| `/michigan` hero + overview | 42+ venues · 123 shows · 9 golf · 8 crawls | 18 · 27 · 4 · **no crawls key has ever existed** |
| `spain` (hero + overview + 2 quiz rows) | **100+ spots**, ×4 places | **38** |
| `australia` (hero + overview) | 123 Sydney spots; "57 + 18" | **22** |
| `rome` (hero + overview) | 25 rated spots | **27** |
| `prague` hero | 15 database spots | **17** (stale since the Vienna split) |
| `dublin` overview | "30 in Dublin, 15 in Galway" | **22 / 12** |
| `SystemSection` lede | **180+ spots across 29 cities and 13 countries** | 220 · 13 · 10 |
| `/lads` + homepage, ×3 | **650+ spots** | 220 |
| `ExplorePage` | 9 per-city counts | **7 of 9 stale** |
| `WhenPage` | 6 per-city counts | all stale |

🔑 **NOT ONE OF THESE WAS A LIE WHEN IT WAS TYPED.** Every one was true on the day
someone wrote it and went stale silently when the data moved underneath it. That
is the whole finding. **A proofreading pass does not fix this — it only resets the
clock.** So the fix was not to retype twenty numbers correctly.

### ⛔ THE STANDING RULE THAT CAME OUT OF IT

**A number that describes our own data is NEVER typed into a string.** It is
derived — at build time or at render — so it cannot drift. If you are typing a
count into copy, you are reintroducing the bug.

### HOW IT WORKS NOW — three files

- **`src/utils/derive.js`** — the live-walk plus resolvers. A `heroStat` carrying
  a `derive` token (`spots`, `category:golf`, `except:golf`, `dayTrips`,
  `windows`, `countries`) or a **function** is counted from that framework's own
  data on every render. Michigan's live-event count is a function on purpose:
  date-dependent numbers must live where they are recomputed, not where they are
  frozen at import.
- **`src/data/canonical.js`** — the ONE declared geography table. Cities,
  countries and continents are **counted** from it (13 · 10 · 3), never typed.
  ⚠️ This is the human-maintained edge of the system and deliberately the only
  one: nothing inside `dublin.js` says "Ireland". A new framework is added HERE
  and nowhere else.
- **`vite.config.js`** — `ladsCanonicalStats()` imports the real data files at
  build, walks them, and serves the totals as `virtual:lads-stats`. It also fills
  the **three `index.html` meta descriptions** (the text search results actually
  render) from the same walk. The homepage renders 220 **without shipping the
  ~150 KB of prose those 220 spots live in**.

### WHAT IS DELIBERATELY *NOT* DERIVED — and why the distinction is the product

Founder facts stay authored: dublin's **"35+ pubs visited"**, "6 Weeks Lived
There", "2 Study Abroads", Oktoberfest's opening date. Those rest on a founder's
word about a trip, and the data file has no way to know them.

➡️ **Ruled by Brady, Sept 8:** deriving "35+ pubs" would replace a person's claim
with a database artefact. It is the same rule that keeps the 16 silent Peru places
silent — **derive what we can count, attribute what only a founder can say.** The
code carries that comment so nobody "fixes" it into a row count later.

### THE LAUNCH DATE — ruled and centralised

Seven "Fall 2026" strings → **January 1, 2027**, all reading `LAUNCH_LABEL` from
`src/utils/launch.js`. See the closed Gate 6 entry above for the commitment this
carries.

### REMOVED ON BRADY'S INSTRUCTION

- The **"20 Days / broke his hand surfing in Costa Rica"** build callout, and the
  two timeline rows naming the injury and the Costa Rica trip.
- The **founder credential bios** on `/lads` and the homepage team cards. Names,
  roles and photos stay. ⚠️ He said **"for now"** — this is a removal, not a
  ruling against ever having bios.
- `SystemSection`'s **`ALL_CITIES`** table — dead code that claimed Sydney 123
  against a real 22. Dead code holding false numbers is a loaded gun.

### 🔧 TWO THINGS THAT COST TIME, BOTH ALREADY IN THIS FILE

1. **The heredoc ate the backslashes — again, twice.** A quoted `<<PYEOF` heredoc
   turned an escaped NUL literal into a real NUL byte and an escaped newline into
   a real newline, producing a `vite.config.js` with a NUL inside a string, a
   broken `.join()` and a mangled regex. Later, a large markdown heredoc failed to
   parse at all. **The note about this was already in CLAUDE.md and it still
   happened twice in one session.** ➡️ **Use the Write tool for any content with
   backslashes or heavy punctuation. Write the payload to a file, then splice it
   with a short script.** Do not retry the heredoc.
2. **A composer targeted the wrong key and nearly shipped a raw token.** The
   first version filled `overview.quickRead` by name while the claim actually
   lived in `overview.framework`, which would have rendered a literal token like
   `{{SPOTS}}` on a public page. Rewritten to walk every overview string, plus an
   assertion that no framework contains an unfilled token after load. **A
   find-and-replace that targets one named field is a guess about where the text
   is.**

### ✅ VERIFIED RENDERED, NOT JUST BUILT

`npm run build` clean, then every claim checked in a real browser at **1440 and
390** on `/`, `/michigan`, `/spain`, `/lads`: hero stats resolve, composed prose
reads right, meta tags carry derived values, zero unfilled tokens, no horizontal
overflow at 390 (scrollWidth 375). The only console errors are Vercel analytics
404s, which exist only on local preview.

---

## 🚩 THE SEPTEMBER 8 QUEUE — work this in order

### 1 — TRUTH PASS ROUND 2 — ✅ **DONE September 17, 2026.** All three closed.

> See the Sept 17 record above for what actually shipped. The fares were
> **deleted, not rewired**, because `fareIntelligence.js` cannot source a dollar
> band — which is the honest reading of "derive or delete". Kept here for the
> original wording only. **Do not work from this list.**

Brady's addendum, Sept 8. **Peru proceeds on a fully honest site, not a mostly
honest one.**

1. **`WhenPage`: remove Thailand** — retired Aug 13, still listed — and **audit
   the whole page for other retired content**.
2. **Wire the prices to `fareIntelligence.js`.** `WhenPage`'s per-city fares
   (`$480 avg RT` and five more) and `SystemSection`'s "flights from ORD under
   $500" are authored prices. ➡️ **Derive or delete. No authored prices** — the
   same rule that governs the Scenic Shore line and the December pricing lock.
3. **Delete `src/NorthAmericaSection.jsx`.** Dead code (imported by nothing),
   hardcoded counts, a remount landmine. Git history preserves it.

### 2 — PERU: ✅ MERGED (`2446f94`), LIVE AND INDEXED

What remains is founder-owned, not building:
1. **Brady's words** for "What We'd Do Differently" and the section intros.
2. **The photo-people ruling** — three frames are held back without it.

### 3 — /outdoors: THE DUSK FIELD GUIDE ⭐ **THIS IS TOMORROW'S BUILD**

✅ **THE GATE IS CLEARED.** Brady's sequencing was that this starts once the Peru
standard-setter's structure is approved. Peru is built and reviewed, so this is
next, and Salkantay now has real Peru photography and data to inherit.

📍 **START STATE, verified Sept 8:** no Dusk Field Guide code exists yet. The
dusk palette appears nowhere in `src/` except as a reserved-and-off-limits note
in `PeruPage.css`. `src/OutdoorsPage.jsx` is the CURRENT 213-line page — the
Ladder concept, the validated Salkantay block, and the coming-soon trio. That
page is what Phase D has to redirect or absorb, so read it before Phase A.

🎁 **WHAT PERU HANDS IT.** Do not rebuild these:
- `CloudImage.jsx` — image delivery, already site-wide.
- `collapseDense()` in `MapPins.jsx`, and the **AOI-crop pattern** for fitting a
  tall region into a wide box.
- `tools/trace-peru.mjs` — the tracer to copy for park geometry.
- The **two-layer rule** (founder voice vs sourced research) and the
  **ranges-never-point-prices** money rule, both now proven on a real page.
- Twelve Peru photographs on Cloudinary under `peru/`, three of them unused.
- ⛔ **And the presentation rules Brady set on Peru apply here from line one:**
  no completeness accounting, no voice chips, no advertised trip length, no
  internal flags on the page. Do not relearn those in Phase B.

**One route, two worlds:** PARKS (US / Canada / El Yunque) + EXPEDITIONS
(international treks).

**DESIGN SYSTEM — locked by Brady.** Dark dusk base: pine-black `#0F1714`, panels
`#16211C`, lake-navy `#1B2A38`, glacier `#7FB4C9`, moss `#6E8B5E`, pine `#2E4A3B`,
bark `#7A5C44`, stone-cream `#E5DCC9` text, campfire ochre `#D9973B` accents.
Topo contour-line textures (low-opacity SVG) + fine grain. Body stays Inter;
propose one condensed poster display face + Fraunces bridging.
⛔ **This palette is EXCLUSIVE to `/outdoors`** — the never-reuse-a-palette rule
applies in both directions.

**PARK CARDS — original WPA-genre poster compositions** as layered SVG (sky band,
2–3 ridge silhouettes, water band where true, sun/moon, poster type, est. line),
**generated per park from real park geography** — a lake park gets water, a canyon
park gets strata.
⛔ **LEGAL RULE:** 1930s WPA originals are public-domain *inspiration*. Modern
poster recreations (Anderson Design Group and similar) are **copyrighted —
reference NOTHING from them.**

**SIGNATURE MOTION:** the trail draws itself — SVG elevation profiles tracing on
scroll, waypoints/camps dropping in with elevation labels. **GSAP/ScrollTrigger
only, no WebGL**, `prefers-reduced-motion` static, and it must be smooth at 390 on
a mid-range phone or it is wrong.

**DATA + HONESTY:** `parkData` schema — windows driver-typed · trails with
miles/difficulty/why · airports with fare-band refs · access · camping · lodging ·
permits · theTrap · sources · checkedOn · validated flags. **Two visible tiers:**
VALIDATED (Bruce Peninsula NP gold; Salkantay corridor; **audit Olympic + Costa
Rica visit status and report**) vs PIPELINE-RESEARCHED (cited consensus, framed
proudly as researched-not-yet-walked). NPS / Parks Canada official sources first.
**No invented stats, ever.**

**PHASES:**
- **A — DESIGN PROPOSAL.** Palette applied, type specimens, **three** poster-card
  samples (recommend Pictured Rocks · Banff · El Yunque as a range test), the
  `/outdoors` hub layout, one park field-guide page structure, one expedition page
  structure with the trail-draw sketch. Screenshots at 1440 + 390. **Brady
  approves before any build.**
- **B — PILOT.** Bruce Peninsula NP field-guide page (our validated gold — the
  honest flagship) + the Salkantay expedition page (full trail-draw, Peru photos,
  founding story). Brady reviews on localhost.
- **C — LAUNCH SET**, batched across sessions: propose the 12-park list for
  sign-off (balance icons / Midwest-reachable / Canada / Caribbean), then build in
  checkpoint phases. Researched trek cards for the 6 expeditions.
- **D —** nav integration, redirect handling from current `/outdoors` content,
  full verify, `/ship` on Brady's go.

➡️ **This closes the Bruce framework gap** (queue item 7 from Sept 2): 17 gold
pins that have never had a framework.

### 4 — BACKGROUND, as capacity allows

- **Golf coordinates by provenance** for all 20 courses — signed-in browser job.
  ⛔ Geocoding 20 course names is the exact Tivoli failure. Follow IDs, not strings.
- **Bucks / Fiserv + Van Andel / Pine Knob calendars** — signed-in browser.
- **Populate the Spot Review Queue** from the staged Michigan lists (Stage 1).

---

## 🔭 THE OCTOBER VISION — GLOBAL EXPANSION MONTH (set September 8, 2026)

**September proves the standard. October scales it.**

**NEW COUNTRIES — Dawson's study-abroad pipeline.** Dawson is gathering spots from
his Kalamazoo College study-abroad connections, which is the first framework
source that is neither a Lads trip nor a research pass: it is **firsthand
knowledge from people we actually know**. ⚠️ That is a THIRD provenance tier and
it needs its own honesty treatment before it renders — a friend's firsthand
account is not a Lads validation and must never be styled as gold. **Decide the
tier language before the first spot ships.**

**THE THREE EMPHASES:**

1. **EVERY FRAMEWORK TOP-TIER.** Not more frameworks at the current bar — the
   existing ten brought UP to whatever Peru establishes. A framework that has not
   been raised to the Peru standard is not done.
2. **PERIODIC-IMPROVEMENT SYSTEMS.** The site must maintain its own freshness
   rather than relying on someone noticing:
   - **Quarterly** — travel windows + fare intelligence refresh.
   - **Monthly** — the Live Pulse refresh (events expire themselves already;
     new seasons do not add themselves).
   - **Rolling** — enrichment batches through the Notion review queue.
   🔑 **This is the Sept 8 lesson applied to content instead of numbers.** Derived
   counts cannot go stale; researched *content* still can. `datedUntil` and
   `checkedOn` exist for exactly this — build the cadence that reads them.
3. **100% AFFILIATE LINK COVERAGE.** Every spot that can carry a Viator link
   carries one. ⛔ Under the standing endorsement gradient: a link on a spot with
   no `ladsRating` gets neutral framing, and service-category programs stay off
   framework spots entirely.

**Milestone framing:** October also still owns Peru LIVE, the first digital
product sold (pilot), the ride documented and the film released.

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

## 📍 SESSION START STATE — verified September 29, 2026

**Verified from `git log`, `git status`, the Vercel API and a real browser —
not from memory, and not from this file's own previous record.**

| | |
|---|---|
| `main` | Five merges on Sept 29, all verified LIVE by matching the served `index-*.js` to the local build: `8057f29` research agents + How It Works · `d7be4b6` quality sweep (Shop hidden, Bucket List dates, share image) · `50df815` agent rulings · `d7c6ac3` quick fixes · `431f8a5` Instagram. This docs-only commit sits on top; read `git log` for its hash. |
| Working tree | clean at merge |
| Pending `/ship` | **Nothing.** |
| Vercel | Confirm the production deployment for the merge SHA reached **READY** at the start of the next session if this session did not record it below. |

**✅ SHIPPED SEPT 29 (see `SEPTEMBER 29, 2026 — THE RESEARCH AGENTS`):** the 14
research agents + `/research` + the enforcement hooks · the interactive **How It
Works** homepage section · the homepage agent count derived (**13**, was a typed
"6") · **Cusco graduated to gold → 14 validated cities**, gold pins now sum to 227
· the unsourced "90%" claim replaced by a cited Aug 2026 survey · the dead
`Start Planning → /plan` CTAs and Peru's "Framework coming soon" fixed.

**✅ Also on production from before:** every displayed count derived · the launch
date stated once · `/local` with the Live Pulse · "When to Go" on every framework ·
`/peru` indexed · founder schema v2 + two-layer card · `/join` · the affiliate gate.

🚩 **NEXT SESSION'S QUEUE — set Sept 29. Work in order.**

**1 — FINISH PROVING THE RESEARCH PIPELINE. ⭐ NEXT.** Three pieces, one session:
- **Raise the verifier's budget.** The Vancouver pilot left **46 of 81 findings
  unverifiable** because `lads-verifier` ran out at 20 calls. Size it to the run
  (≈ 8-9 calls per research agent) in the `/research` skill, then re-verify
  Vancouver.
- **Pilot 2: Pictured Rocks, researched mode** (plan Task 9). Nobody has been; it
  is the Dusk Field Guide's first real `parkData`. Command is in the plan.
- **Write `docs/research-pilots.md`** (plan Task 8 step 3): the side-by-side vs
  `internal/brady/vancouver-enrichment.md`, including where the agents lost.
⚠️ **Run pilots from a FRESH session** — agents created mid-session are not
dispatchable in that session (see HARD-WON LESSONS). Or `claude -p "/research …"`.

**1b — `/local` LIVE HUB CITIES (Brady, Sept 29 close).** Make Lads Local more
interactive so visitors *"can always see the best things going on in our hub
cities."* Architectural: brainstorm → spec → plan. The shape so far: a rolling "This
week in [city]" view fed by `lads-timing-events` + `lads-deals-savings` on a scheduled
refresh, every item dated so it expires itself (the Live Pulse already does this for
58 events). ❓ **Open first question: which cities are the hubs** (GR, Detroit, Chicago,
Milwaukee, Traverse City? college towns? the Bruce?).

**Brady's goal for the agents (Sept 29):** ready to roll for new trips, improving the
existing frameworks, expanding Lads Local, and eventually the national parks and
hiking guide.

**2 — THE DUSK FIELD GUIDE, Phase A.** Brady: *the national parks guide will be the
biggest part of this.* It now has an engine. Phase A spec is in `THE SEPTEMBER 8
QUEUE` item 3 and has not moved: design proposal, three poster samples, Brady
approves before any build.

**3 — THE CLOUDIMAGE BUNDLE BLOCK.** `dist` still **41 MB against an 8 MB target**,
~38 MB of it images. `CloudImage.jsx` is the answer. Its own session; do not start
mid-block.

**4 — THE VERDICT ROOM.** Founders rate; worksheet generated:
`internal/brady/verdict-room-worksheet.md` and the phone doc
https://claude.ai/code/artifact/61dd272d-ec23-4940-abbe-cb4c96fd5cf1 . 212 of 227
places carry no `ladsRating`. ⛔ Never rate a place nobody visited.

**5 — Then:** enrichment ingestion (`rome-prague`, `dublin-sanjuan`, `costa-rica-jaco`
— now best redone through `/research`), cloud refresh routines (only after the
pilots pass), Vancouver + Costa Rica frameworks, place-level booking links.

### ⚠️ BLOCKERS — OWED BY BRADY (re-checked Sept 29)

1. **Peru's "What We'd Do Differently" words** (+ the section intros). The
   section is hidden on the live page until they land. AI cannot write these.
2. **The photo-people ruling.** Three of the twelve Peru frames show people who
   are not the founders and stay unused until he rules.
3. **The Costa Rica visited-split**, per spot. Blocks that framework; a saved
   list is a superset of a trip and is never flipped wholesale.
4. **The Detroit Maps list.** Closes four unpinnable Michigan spots in one step.
5. **Licensed music for the Peru film.** Blocks publication of the cut, not its
   assembly. None sourced, and none will be invented.

✅ **All research-agent rulings CLOSED Sept 29:** cards (recommend with every option),
"no admission charge", rewards for Club members, all agents on Opus, derived budgets
allowed with `derivedFrom`, discovered places publish as researched-not-visited.

✅ **Closed Sept 24:** the Peru `note`→`notes` ruling. Granted, and implemented
against the data rather than the forecast — **227, not 229.** See the record.

📌 **This list replaced TWO near-duplicate "Owed by Brady" blocks** that had sat
one after the other, disagreeing slightly about what was owed. Same class as the
staleness rule above: one statement of a fact, or none.

---

## 🚩 THE NEW FRAMEWORK AGENDA — SEPTEMBER BUILD SLATE (approved Aug 29, 2026)

> **/morning MUST surface this queue every session until it is empty.** These are
> **not parked ideas.** Brady approved this sequence on Aug 29. Work the numbers in
> order unless he re-prioritises.

**Every queue entry ships the same four things:**
1. **Pipeline research pass** — researched, then human-sanity-checked. Never published raw.
2. **Travel windows** — the `timingWindows` layer, 3–4 windows typed by `driver`
   (weather / events / pricing / logistics), each stating its reasoning. Schema in
   `HARD-WON LESSONS`.
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

## PLATFORM VISION

**Four-collection IA** (since May 31, 2026):

| Collection | Path | Contains |
|---|---|---|
| **Lads Global** | `/global` | International frameworks (Dublin, Spain, Rome, Iceland, Prague, Vienna, Australia, Munich, Poland, Peru) |
| **Lads Outdoors** | `/outdoors` | Treks/hikes — Ladder concept (Base Camp · Multi-Day · Expedition). Salkantay is the first validated trek. |
| **Lads Bucket List** | `/bucket-list` | Events/festivals/sports/holidays (Vivid Sydney, Oktoberfest, Ryder Cup '27, Christmas Markets). Calendar view planned. |
| **Lads Local** | `/local` | The Midwest map (Good Brews · Good Views · Good News) + the `/michigan` framework. Engineered the same as international. |

Footer carries: Follow Along (socials, blog later), The Lads (team),
brand mark. Everything else in nav is dead.

---

## DATABASE

Source of truth: Airtable base
Sync command: `npm run sync` (pulls Airtable → src/data/)
Export command: `npm run export` (src/data/ → CSV)
Build: `npm run sync:build` (sync + build together)

**Canonical site-wide totals (re-derived September 24, 2026)** — used by Globe
pins, Featured Work cards, DataSpectacle counters, Globe caption, and the
index.html meta descriptions. Single source of truth: the **11**
`src/data/*.js` framework files listed in `canonical.js`.
Method: live-walk (any object with `name` AND `description|notes|ladsTake`,
excluding containers and `recordIsOffice` records).

  227 places  ·  14 validated cities  ·  11 countries  ·  4 continents   (cities → 14 Sept 29, Cusco)

🚩 **THIS BLOCK WAS CARRYING THREE STALE NUMBERS, and two of them predate
today.** It read `220 · 13 · 10 · 3` and "the 10 framework files". Countries
went to 11 and continents to 4 on **Sept 16** when Peru entered `canonical.js`;
this table was never updated and sat wrong for eight days beside a correct
header. **It is a snapshot for reading convenience. The site has never read it,
which is the only reason it did no damage** — and is exactly why the header
block at the top of this file says do not type a data count into a page.

(Thailand + Charleston retired Aug 13 — data preserved in `retired/`.
Asia dropped: Thailand was the only Asian framework.)

Per-framework breakdown — **re-derived Sept 24, 2026 by importing every file
through the real `walkSpots`, not by reading the page:**

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
| peru | **7** | **new Sept 24** — the founder-voice places. 2 office records excluded |
| **TOTAL** | **227** | |

⚠️ The "fully-structured spots" column that used to sit here is GONE. It came
from the retired 226/21 method and had not been re-counted since Aug 13, so it
sat quietly stale beside a live column. If that figure is wanted again,
re-derive it — do not copy the old numbers forward.

🚩 **NOT counted, deliberately — and the list changed Sept 24:**
- `peru.js`'s **10 day anchors** — a GPS fix is not a place.
- Peru's **2 tour-operator office records** (`recordIsOffice`) — a downtown
  Cusco sales desk is a booking record, not somewhere a reader can go.
- Peru's **16 silent saved places** — no founder words, no description. They
  stay silent and they stay uncounted.
- `brucePeninsula.js` (17 places) — not a published framework, no descriptions.
- **Framework ROOT objects.** Each carries a `name` and a framework-level
  `ladsTake`; a container is not one of its own places. Caught on Sept 24 when
  accepting `ladsTake` briefly added +1 to all eleven.

The **300+ launch gate counts published AND described spots**, so
ingested-but-silent places do not advance it — the 16 silent Peru places are
the worked example, and the 7 that DO count are the worked example of the
opposite: a founder's own sentence is what turns a saved pin into a place.

Old figures (`226 / 21`) are retired — they came from a stricter
"fully-structured" count (spots with `neighborhood + category +
validated + vibeTags` all present) but the site now uses the live-walk
total everywhere for consistency. Do not reintroduce 226 or 21 as
on-page numbers.

Personal layer (ladsTake, forWho, story) mostly empty.
Brady fills these — they cannot be AI-generated.

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
/local Michigan: RETIRED Aug 28 — the card renders the traced Midwest map instead
  (a real Michigan photo is still wanted; none exists in `src/images-*.js`)
/local Charleston: RETIRED Aug 13 with the framework

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

## CUSTOM COMMANDS

/morning  — reads this file + sprint, outputs top 3 priorities
/ship     — diff → commit message → confirm → push
/research — run the Lads research agents on a destination → founder review packet
             (`.claude/skills/research/SKILL.md`; run from a fresh session)
npm test  — every tools/**/*.test.mjs (research contract, hooks, roster, globe pins)
/perf     — build + bundle size report + Lighthouse
/audit-all — checks framework data files (⚠️ its own list is stale: still names
             thailand + charleston, omits michigan/vienna/peru)
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

- TikTok and YouTube URLs for the footer (Instagram is live since Sept 29)
- Salkantay framework — content + photos
- /when route: keep dormant (out of nav, still reachable), redirect to
  /bucket-list, or kill?
- /global re-skin — when, and what direction
- Pass B framework engine: revive someday, or build out collections
  organically and let Pass B die?
- Footer rollout: per-page imports today (App, ExplorePage, AdventurePage,
  WhenPage, LadsPage, FrameworkPage); refactor to a layout wrapper later?

---

## 🧠 HARD-WON LESSONS (distilled Sept 29, 2026 — the full session logs live in `docs/history.md`)

Every line here cost real time once. The story behind each is in `docs/history.md`;
the rule is what matters.

**Verification**
- **A rendering check is not a verification. Click the things.** Five dead map
  targets on `/local` (Sept 2), every empty Peru panel (Sept 8) and the `/join`
  multi-select bug (Sept 17) all looked perfect in screenshots.
- **Decorative SVG eats clicks.** Halos, leaders and truth dots get
  `pointer-events: none`; a `<g>` needs an explicit transparent hit circle.
- **Count by importing the module, never by grep.** `peru.js` sets `validated`
  inside a `saved()` helper — a line-grep said 13 where the truth was 35.

**Data provenance (the Tivoli rule)**
- **Never resolve a place from a bare string.** GetYourGuide returns Copenhagen
  for "Tivoli". Follow IDs, never names.
- **Google Maps lists are read by provenance** in the signed-in Playwright browser
  (brady@ladstravel.com). The whole list — names, lat/lng, feature IDs, Brady's
  notes — parses out of `APP_INITIALIZATION_STATE` in one page load, no clicking.
  A signed-out/isolated profile returns an empty Maps shell.
- **Re-reading a flattened name:** convert the decimal feature-ID pair to hex and
  open `https://www.google.com/maps/place//data=!4m2!3m1!1s<hex>:<hex>`, read the `h1`.
- **A saved coordinate is where Google's record sits, not where the experience
  happens** — tour-operator offices (`recordIsOffice`), summit points
  (`coordinateIsSummit`). Filter, don't pin.
- ⛔ **Never build a data file from ASCII staging text** — accents and apostrophes
  were flattened (`Küsterer`, `O'Toole's`, `Jacó`).
- **Loose fuzzy matching is rejected.** Strict token containment + distance check only.
- **A saved list is a SUPERSET of a trip.** Never flip `validated` wholesale
  without a founder ruling.

**Tooling on this machine**
- ⛔ **Bash heredocs eat backslashes and apostrophes.** Use the Write tool for any
  payload with backslashes/quotes, then splice with a short script.
- ⛔ **Never open a real file for writing before the bytes exist.** `io.open(p,'w')`
  once truncated CLAUDE.md to zero. Build the string, `.encode('utf-8')`, write a
  temp file, `os.replace`.
- **rolldown rejects astral-plane characters (emoji) in `.jsx` source.** Fine in `.md`.
- **A stale Playwright browser holds the signed-in profile** ("Browser is already
  in use"). Kill the leftover chrome tree; close the browser at session end.
- Playwright MCP `browser_run_code_unsafe` has no `fs` and no dynamic import —
  return compact text and write it locally.
- **Every file in `src/data/` becomes its own lazy bundle chunk** (template-literal
  dynamic import in `App.jsx`). A new data file is cheap, not inert.

**SEO / site**
- ⛔ **Never put a canonical in `index.html`.** In an SPA it overrides every route.
  Each page declares its own (`App.jsx`, `FrameworkPage.jsx` from `data.id`).
- **Structured data and dead config get missed by copy purges** — the "free" claim
  survived in JSON-LD `priceRange` and `seo.js` after the visible copy was clean.
- `rollup-plugin-visualizer` must write outside `dist/` (it is `.bundle-report.html`
  at the repo root, gitignored) or it deploys publicly.

**Maps / geometry**
- One shared projection per canvas. `project(lat, lng)` — **lat first**; the tracer's
  internal one is GeoJSON `(lon, lat)`.
- Ontario needs the political boundary **with lakes punched out** (`evenodd`),
  Georgian Bay included. A land layer alone reproduces the bug.
- Dense cities collapse to one count marker at the true centroid (6+ within 18
  units), preferring land over water. Don't raise `minDist` to fan them out —
  that put Grand Rapids breweries in Lake Michigan.
- 44px targets are met by the **companion list**, not by enlarging pins.

**Peru26 film (ffmpeg)**
- Use the `imageio-ffmpeg` binary (**v4.2.2**; path via
  `python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`). The
  OBS `ffmpeg.exe` has no `drawtext`; its `ffprobe` is fine.
- Rotation: `-noautorotate` + **`transpose=1`**, only on clips whose probed rotation
  is -90. (`transpose=2` was wrong.) **Pull frames from the real assembly and look.**
- Sort by `com.apple.quicktime.creationdate`, not generic `creation_time`.
- `peru26-manifest.md` mixes **UTC video times with local photo times** — normalise
  to `-05:00` before interleaving.
- Unplaced: `72581579-…mp4` (van interior, no metadata) — only Brady can place it.

**Travel windows — the schema (shipped in `f9af4b7`)**
- Base keys `id / name / recommended / atmosphere / crowdMix / pubExperience /
  priceTier / primaryDraw / verdict / detail`, plus `driver`
  (weather|events|pricing|logistics), `months`, `datedUntil` (one-time events
  expire themselves — the Iceland eclipse lesson) and `sourcing`
  `{basis, checkedOn, sources[]}`.
- **A window that cannot name its driver does not ship.** Never apply Lads voice
  to a researched window.

**Affiliates beyond tours (decided Aug 17, not built)**
- Service programs (eSIM, transfers, car rental) get exactly ONE home — a single
  "travel tools" surface framed as services, never scattered across framework spots.
  Mixing a car-rental link into a validated spot list launders it as an endorsement.

**Claude Code agents and hooks (learned Sept 29, 2026, v2.1.284-285)**
- **Hooks in an agent's frontmatter did NOT fire for Agent-tool subagents.** Put
  them in `.claude/settings.json` and key on the payload's `agent_type`.
- **Exit code 2 from a PreToolUse hook was IGNORED inside a subagent.** Answer with
  structured stdout and exit 0: `hookSpecificOutput.permissionDecision: "deny"`
  (PreToolUse), `{"decision":"block","reason":…}` (SubagentStop).
- **Agent files created mid-session are not dispatchable in that session.** Start
  a fresh session, or run `claude -p "/research …"` headless.
- `memory: project` silently adds **Edit** to an agent's tools. The guard covers it.
- The Playwright MCP browser can be **shared with another session** (a foreign tab
  appeared, the renderer stalled, a page navigated on its own). If animations report
  `currentTime 0` or screenshots time out, close and reopen before trusting a result.

**Git**
- `stash@{0}` (April 11, "Reimagine Tab 1") predates the React rebrand and almost
  certainly will not apply. Drop it or leave it; never pop it blind.

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

**Globe pin data is drift-proof (since June 7; tables moved Sept 16):**
- The pin tables (`VALIDATED_CITY_PINS`, `RESEARCH_CITY_PINS`,
  `PUBLISHED_UNCOUNTED_CITY_PINS`) live in `src/data/canonical.js`, not
  in Globe.jsx. Globe imports the framework data files statically and
  derives each validated pin's `n` via `countSpotsByCity(data)`.
- Attribution rule: every spot maps to exactly one pin. Sub-cities
  with their own pin (Galway, Madrid, Tasmania, Vienna) take their
  bucket; everything else folds into the framework's PRIMARY pin
  (`PIN_ATTRIBUTION` table in Globe.jsx).
- Gold = validated (count shown), copper = research-only or
  published-uncounted (Cusco/Peru is published-uncounted: clickable,
  no count).
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
  ✅ **RE-AFFIRMED Sept 17, 2026, and worth reading because it was nearly reversed.**
  Brady asked for "free trip advising for the rest of 2026" on the new `/join`
  page. That exact string has been purged three times (May 31 rebrand, the Aug 25
  JSON-LD `priceRange`, `seo.js` on Sept 2). Given the choice between reversing
  the rule and keeping it, **he kept it**: the advising is offered on the site
  **without any cost claim** — "we are advising a handful of trips this autumn
  while we build" — and what it costs is said in the reply, not on the page.
  ➡️ So the offer is REAL and deliberate. Do not delete the advising copy as a
  rule violation, and do not add the word "free" to it. Both would be wrong.
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
