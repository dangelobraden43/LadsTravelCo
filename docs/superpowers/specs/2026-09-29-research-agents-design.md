# THE LADS RESEARCH AGENTS — DESIGN SPEC

**Date:** 2026-09-29 · **Branch:** `feature/research-agents` · **Status:** awaiting Brady's review

---

## 1. WHY THIS EXISTS

The homepage has said **"6 AI RESEARCH AGENTS"** since April 15, 2026. Until today the
research behind every framework came from **Google research passes Brady ran by hand, one
destination at a time**, turned into synthesis documents that `/build` consumed. No agent
was ever defined in the repo.

This spec makes the full switch to Anthropic's research stack: **real, named, version-
controlled Claude Code agents** that together cover everything that goes into planning the
right trip, and a homepage number **counted from those files** so it can never again claim
more than exists.

### Success criteria

1. Every domain a traveller has to decide on (section 3) is owned by exactly one agent.
2. Every agent emits the **same machine-checkable format**; malformed output is rejected
   mechanically before a human sees it.
3. No agent can write to `src/data/`, speak in the Lads' voice, or mark anything validated
   — enforced by **tool restriction**, not instruction.
4. A pilot run on a real destination produces a review packet that is **better than the
   banked Sept 17 ad-hoc /enrich run (internal/brady/vancouver-enrichment.md)** for the
   same place, judged side by side.
5. The homepage agent count and its sub-label derive from `.claude/agents/` at build time.

### What does NOT change

- **Founders validate. Agents research.** The Verdict Room, `ladsRating`, `ladsTake`,
  `validated: true` — all founder-only, forever.
- Every standing rule in CLAUDE.md: Tivoli, ranges-never-point-prices, no insurance, no
  "free" pricing copy about OUR services, never invent spots/prices, two-layer card.
- The Notion review queue from `/enrich` stays the human gate before anything publishes.

### Research-tier destinations are FIRST-CLASS (Brady, Sept 29)

**The Lads are not committed to only sending people where a founder has been.** Most
future trip planning — and the national parks guide above all — will be places nobody has
walked. The pipeline must produce a trustworthy product for those destinations on its own,
not a lesser draft waiting for a visit. Two modes, one pipeline:

| | **Walked** (founder has been) | **Researched** (nobody has been) |
|---|---|---|
| Where the place list comes from | Founder's saved Maps list, read by provenance | **Discovery** by `lads-destination-scout` / `lads-parks-trails` from official and primary sources |
| Where coordinates come from | Google place ID off the saved list | **An authoritative record for that exact entity**: NPS/Parks Canada unit and feature pages, Wikidata QID / Wikipedia coordinates API, the official site. Never a geocoder search on a name — the Tivoli rule, adapted for places with no saved list |
| Sourcing bar | ≥1 source per claim, 2 for money/time | **≥2 independent sources for every claim a traveller acts on**; verifier runs stricter |
| How it renders | Gold, founder voice where given | **Copper, framed proudly as researched-not-yet-walked** — the Dusk Field Guide's two visible tiers. Never styled as gold; never apologised for |
| Founder role | Verdicts, ladsTake | Review and approve the packet — curation, not validation |

The orchestrator takes `--mode walked|researched`. Default: walked only if the
destination has a src/data file containing validated places; otherwise researched. A saved
Maps list is a place SOURCE in either mode, never proof of a visit (Vancouver has a saved
list and nobody has been). The packet header states the mode, so a
reviewer always knows which bar the findings were held to.

**The parks guide is the primary customer of researched mode.** Pilot 2 (section 9) is an
unvisited national park, so researched mode is proven on the product that needs it most.

---

## 2. THE SHAPE

```
            /research <destination> [--agents ...] [--mode full|refresh]
                                  │
     ┌────────────────────────────┼─────────────────────────────┐
     │  WAVE 1 — FOUNDATION       │  (needs nothing)            │
     │   provenance · entry-essentials · timing-events          │
     │  WAVE 2 — THE TRIP         │  (reads wave-1 output)      │
     │   destination-scout · stay-neighborhoods · flights       │
     │   getting-around · costs-budget · parks-trails*          │
     │  WAVE 3 — MONEY + BOOKING  │  (reads waves 1–2)          │
     │   bookings-tickets · rewards-points · deals-savings      │
     └────────────────────────────┼─────────────────────────────┘
                                  ▼
                 validate.mjs  (SubagentStop hook, mechanical)
                                  ▼
                     verifier  (adversarial fact-check)
                                  ▼
                 trip-architect (assembles the review packet)
                                  ▼
          internal/research/<dest>/PACKET.md  →  Notion review queue
                                  ▼
             Brady / Dawson rule  →  /enrich stage 3–4 publishes
```
`*` parks-trails runs only when the destination has park/trail content.

Waves run **two agents at a time** (the Aug 31 rate-limit finding), so a full run is
~7 pairs. `--agents` runs a subset; `--mode refresh` re-checks only findings whose
`checkedOn` is older than the domain's freshness window (section 6).

---

## 3. THE ROSTER — 14 agents, grouped by the question each answers

All live in `.claude/agents/` as `lads-<name>.md`. All preload the `research-contract`
skill (section 4). All carry `memory: project`.

### A. WHERE — the ground truth

| Agent | Owns | Primary sources |
|---|---|---|
| **lads-provenance** | Coordinates by place ID, closures (temporary/permanent), renames, `recordIsOffice` / `coordinateIsSummit` traps, duplicate-property detection | Google place IDs (never name search), official sites, Wikipedia coordinates API |
| **lads-destination-scout** | Public consensus per place: summary, praised, criticized, the trap, practical, best time of day, who it suits; **candidate discovery** of places not yet on our lists (always research tier) | Local press, official sites, forums, review-site snippets |
| **lads-stay-neighborhoods** | Where to stay: neighbourhoods by traveller type (first-timers, nightlife, families, budget, quiet), what each is like after dark, lodging-tier **ranges**, the neighbourhood trap | Tourism boards, local press, hotel-market ranges |
| **lads-parks-trails** | Parks and trails: trails (distance, gain, difficulty, time), permits and lotteries, reservations, camping, seasonal closures, altitude/conditions, park fees as ranges, gateway towns | NPS, Parks Canada, national park services, AllTrails-class sources as snippets |

### B. WHEN — timing

| Agent | Owns | Primary sources |
|---|---|---|
| **lads-timing-events** | Travel windows typed by `driver` (weather/events/pricing/logistics) in the existing `timingWindows` schema; festivals, holidays, school breaks, closures, strikes, one-time events with `datedUntil`; crowd curves | Official event pages, tourism boards, climate normals |

### C. HOW — getting there and around

| Agent | Owns | Primary sources |
|---|---|---|
| **lads-flights** | Airports and which to use, routes from Midwest hubs (ORD · DTW · GRR · MSP · MKE), nonstop vs one-stop, fare **bands** with lead time, fare-alert strategy, open-jaw options | Airline route maps, airport sites, Google Flights/Kayak data as dated observations |
| **lads-getting-around** | Airport transfers, transit and passes, rideshare/taxi norms, driving and car-hire rules, intercity rail/bus/ferry, walkability, day-trip logistics | Transit authorities, official rail/ferry sites |

### D. HOW MUCH — money

| Agent | Owns | Primary sources |
|---|---|---|
| **lads-costs-budget** | Daily budget **ranges** by tier (shoestring/mid/comfort), price levels for meals/drinks/attractions, tipping norms, cash vs card, ATM/FX traps, tourist taxes | Published cost surveys, official fee pages, dated menus/price lists |
| **lads-rewards-points** | Points and miles: which programmes serve the destination, award sweet spots, transfer partners, alliance routing, hotel-programme footprint, how to earn toward the trip | Programme award charts and partner pages, dated observations |
| **lads-deals-savings** | Time-limited promotions (**`datedUntil` mandatory**), city passes and whether they pay off, no-cost entry days and hours, happy hours, local savings programmes (Hop Passport class), student/age discounts | Official promo pages, venue sites, city pass sites |
| **lads-bookings-tickets** | What must be booked ahead and how far (timed entry, permits, reservations), official sale channels, and **Viator product matching** for validated places — disambiguated, never name-searched blind | Official ticket portals, Viator product pages |

### E. BEFORE YOU GO — practicalities

| Agent | Owns | Primary sources |
|---|---|---|
| **lads-entry-essentials** | Entry requirements (visa/ETA/ESTA-class, passport validity) **for US passport holders**, customs, currency, power plugs, connectivity (eSIM/SIM availability as a fact, no product pushed), language basics, safety and common scams, health *entry* requirements, emergency numbers | **Government sources only** for entry/health: travel.state.gov, the destination's official immigration site, CDC |

⛔ **Never insurance.** This agent is the most likely to drift toward it; its definition
names the ban explicitly and the validator rejects the word.

### F. QUALITY + ASSEMBLY

| Agent | Owns |
|---|---|
| **lads-verifier** | Adversarial fact-check of every finding: does the source exist, does it say this, is it current, is a range really a range, is anything expired, any Lads voice, any insurance, any point price, any unattributed claim. **Read-only + fetch.** Emits a verdict per finding: `confirmed` · `weakened` (edit proposed) · `refuted` · `unverifiable`. |
| **lads-trip-architect** | Assembles verified findings into the review packet: the framework-shaped draft (sections in `FrameworkPage` order), **trip versions** by group/budget/length (the Peru gap vs Spain), a geographic day-grouping built from stored coordinates, open questions for the founders. **Never writes Lads voice** — founder slots are left as explicit blanks. |

**Public count:** the 12 research agents (A–E) + the verifier = **13 "AI research
agents"**. The trip-architect is an assembler, not a researcher, and is excluded. The
count is derived (section 8), so this paragraph is a snapshot, not the source.

---

## 4. THE SHARED CONTRACT — one skill, preloaded into every agent

`.claude/skills/research-contract/SKILL.md` — loaded via each agent's `skills:` field, so
the rules exist **once**. Contains:

1. **The line.** Research explains the world; only Brady and Dawson speak for the Lads.
2. **The output format** (section 5) and where to write it.
3. **Source rules.** Primary/official beats aggregator beats forum. Every claim ≥1 source.
   A search snippet never read in full is marked `access: "snippet"`. Two independent
   sources for anything a traveller would spend money or time on.
4. **Honest gaps.** `looked-found-nothing` and `could-not-look` are different claims and
   are recorded differently. Thin research ships thin.
5. **Money.** Ranges with currency, source and `checkedOn`. Never a point price. Our own
   prices appear nowhere.
6. **Tivoli.** Never resolve a place from a bare string; follow IDs; disambiguate by
   coordinates.
7. **Banned in output:** insurance of any kind; first-person Lads voice ("we loved", "our
   pick"); ratings or scores presented as ours; charity content; "free" as a claim about
   the Lads' own services. (A third party's no-cost entry day is a fact and is allowed in
   research; how it renders on the site is a founder ruling — see section 10.)
8. **Environment limits.** Reddit blocked; Yelp/Tripadvisor 403 on fetch (snippets OK);
   WebSearch ~200 calls/session — each agent gets a **call budget** from the orchestrator
   and reports calls used.
9. **Memory discipline.** Write to your memory only durable, reusable lessons (a source
   that blocks, a site that is authoritative, a trap pattern). Never store findings there.

---

## 5. THE OUTPUT FORMAT

One JSON file per agent per run:
`internal/research/<destination>/<run-id>/<agent>.json` (gitignored, like all staging).

```json
{
  "agent": "lads-costs-budget",
  "destination": "vancouver",
  "mode": "walked|researched",
  "runId": "2026-09-29T14-05",
  "generatedOn": "2026-09-29",
  "callsUsed": 14,
  "findings": [
    {
      "id": "costs-001",
      "topic": "daily-budget",
      "kind": "range",
      "claim": "A mid-range day runs CAD 180-260 per person excluding lodging.",
      "value": { "low": 180, "high": 260, "currency": "CAD", "unit": "per person per day" },
      "appliesTo": null,
      "sources": [
        { "title": "...", "url": "https://...", "kind": "official|press|forum|aggregator|google|government",
          "access": "read|snippet", "checkedOn": "2026-09-29" }
      ],
      "checkedOn": "2026-09-29",
      "datedUntil": null,
      "confidence": "high|medium|low",
      "notes": ""
    }
  ],
  "gaps": [
    { "topic": "tourist-tax", "status": "looked-found-nothing|could-not-look", "detail": "..." }
  ]
}
```

`kind` ∈ `fact · range · window · promo · place · route · requirement · product · trap`.

**Hard rules the validator enforces:**
- every finding has ≥1 source with `url` and `checkedOn`
- `kind: "range"` → `value.low < value.high` and a `currency`; no bare point prices anywhere
- `kind: "promo"` → `datedUntil` required and in the future
- `kind: "window"` → `driver` ∈ weather/events/pricing/logistics
- `kind: "place"` referencing a coordinate → coordinate came from a source, never inferred
- banned-term scan (section 4.7)
- `checkedOn` not in the future; `generatedOn` is today

---

## 6. FRESHNESS — the Iceland-eclipse lesson, automated

| Domain | Re-check window | Mechanism |
|---|---|---|
| deals-savings | 7 days, and on `datedUntil` | Weekly cloud routine |
| flights | 30 days | Monthly cloud routine |
| timing-events | quarterly + on `datedUntil` | Quarterly cloud routine |
| costs-budget, stay-neighborhoods, getting-around, bookings-tickets | quarterly | Quarterly cloud routine |
| entry-essentials | quarterly, and before any purchasable launch | Quarterly cloud routine |
| rewards-points | quarterly | Quarterly cloud routine |
| provenance, destination-scout, parks-trails | 6 months | Semi-annual |

Routines run `/research <dest> --mode refresh`, write a **report / PR for review**, and
**never push to `main`**. (Cloud routines run on a fresh clone, so they read the committed
data files; the staging folder is regenerated per run.) Routines are **set up only after
the pilot passes** — scheduling an unproven agent automates its mistakes.

---

## 7. ENFORCEMENT — what stops each failure, mechanically

| Failure | Stopped by |
|---|---|
| Agent edits `src/data/` | `tools:` allowlist — research agents get WebSearch, WebFetch, Read, Glob, Grep, Write; the orchestrator prompt + a **PreToolUse hook** blocks any Write/Edit outside `internal/research/` and `.claude/agent-memory/` |
| Verifier "fixes" instead of judging | Verifier has **no Write/Edit** beyond its verdict file path (same hook) |
| Claim with no source / point price / expired promo / insurance | `tools/research/validate.mjs` via **SubagentStop hook**; failures returned to the agent to fix |
| Lads voice creeping in | Validator banned-phrase scan + verifier check + trip-architect leaves founder slots blank |
| Stale research | `checkedOn` + `datedUntil` + refresh routines |
| Homepage over-claiming | Count derived from `.claude/agents/` (section 8) |
| Rate-limit collapse | Orchestrator runs pairs, assigns call budgets |

---

## 8. THE HOMEPAGE CLAIM, DERIVED

- Each agent's frontmatter carries `lads-public: true|false` and `lads-label: "<short>"`.
  (Custom keys; verified in the build that Claude Code ignores them harmlessly.)
- `vite.config.js`'s existing `ladsCanonicalStats()` plugin reads `.claude/agents/*.md`
  at build time and adds `agents: { count, labels[] }` to `virtual:lads-stats`.
- `App.jsx`'s stat card renders `AGENTS.count` and a sub-label built from the labels.
  **The literal `'6'` is deleted.** Same rule as every other count since Sept 8.

---

## 9. BUILD ORDER AND VERIFICATION (this session)

1. **Contract + format + validator** — `research-contract` skill, `validate.mjs` with a
   fixture test (a good file passes, each rule has a failing fixture).
2. **Hooks** — PreToolUse path guard + SubagentStop validator in `.claude/settings.json`,
   verified by a deliberate violation.
3. **All 14 agent definitions.**
4. **`/research` orchestrator skill.**
5. **Pilot: Vancouver**, a subset first (provenance · destination-scout · costs-budget ·
   deals-savings → verifier → architect). Vancouver is chosen because it is pure research
   tier (no founder voice to protect) and the banked Sept 17 ad-hoc /enrich run
   (internal/brady/vancouver-enrichment.md) is the comparison. Then the full roster.
6. **Side-by-side comparison** vs the banked file — reported honestly, including where the
   agents lost.
6b. **Pilot 2: an unvisited national park in researched mode** — `lads-provenance`,
   `lads-parks-trails`, `lads-timing-events`, `lads-getting-around`, `lads-costs-budget`,
   `lads-bookings-tickets` → verifier → architect (a US park needs permits and
   reservations, not entry rules). Proposed: **Pictured Rocks National
   Lakeshore** (Michigan — reachable, and one of the three Dusk Field Guide Phase A poster
   samples), unless Brady names another. Output shaped to the Dusk Field Guide `parkData`
   schema so Phase A builds on real data.
7. **Homepage derivation** + `npm run build` + render check at 1440 and 390.
8. **Checkpoint commit + push after every step.** CLAUDE.md record in the same push as any
   merge.

Out of this session unless time allows: cloud routines (after pilot), Notion push
automation (reuse `/enrich` stage 2 manually first), parks guide Phase A.

---

## 10. RULINGS OWED BY BRADY (none block the build)

1. **Credit cards.** `lads-rewards-points` will research card programmes as facts
   (transfer partners, earn rates, sign-up bonus ranges with dates). **Publishing a card
   recommendation** is a financial-product endorsement with affiliate money attached —
   same neighbourhood as the insurance ban. Default until ruled: research only, never
   rendered, and never framed as "apply for X".
2. **"Free" in rendered deals.** Research may state "Museum X has no-cost entry on the
   first Sunday." Whether a page may render that sentence is a ruling on the Sept 17 rule.
   Default until ruled: renders as "no admission charge," never "free".
3. **Who rewards research is for** — travellers on the site, founders planning client
   trips, or both. Default until ruled: founder-facing packet only.
4. **Model spend.** Default: research agents on `sonnet` at `high` effort; verifier and
   trip-architect on `opus`. The pilot compares one agent on both and reports.
