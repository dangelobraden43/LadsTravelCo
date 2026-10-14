---
name: resource-frameworks
description: Re-source a framework's travel windows and cost tables so they pass the quality gates - every window gets a driver and real sources, every cost becomes a sourced range (or an exact official fee). Produces a FIXES.md for founder review; edits src/ only after Brady approves. Use when Brady says "re-source", "fix the windows", "fix the costs", "sources: []", "point prices", or names a framework that needs its windows or costModel refreshed.
---

# /resource-frameworks — WINDOWS AND COST TABLES, SOURCED

**Why it exists (Oct 12 audit):** all 28 framework travel windows carried `sources: []`
and 9 `costModel` tables carried unsourced point prices. Both fail launch Gate 2 and the
money rule. Dublin was fixed first and is the worked example:
`internal/research/dublin/2026-10-12T15-39/` (RUN.json, EXISTING.js.txt, FIXES.md).

Args: `<framework...>` or `--all` (every framework in `src/data/canonical.js`).
`--status` only reports.

## 1. Status first (always)

Import each `src/data/<slug>.js` with node (never grep) and report, per framework:
windows total / windows with empty `sources`; `costModel` present / rows with a point
price (use `hasPointPrice` from `tools/research/validate.mjs`); the newest prior FIXES
run if any. That table is the work list. Skip a framework whose newest FIXES.md is
under 90 days old unless Brady names it.

## 2. One run per framework

`runId` = local `YYYY-MM-DDTHH-mm`; `runDir` = `internal/research/<slug>/<runId>/`.

1. **EXISTING.js.txt** — copy the `timingWindows` and `costModel` blocks VERBATIM from the
   source file, with their line numbers. This is what gets re-checked. Use the Write tool
   or a node script, never a heredoc (backslashes and apostrophes get eaten).
2. **RUN.json** — copy Dublin's shape: `purpose` starting `FRAMEWORK FIX PASS`, `roster`
   `[lads-timing-events, lads-costs-budget, lads-verifier]`, budgets 12 / 12 /
   9 per research file (min 30), `inputs` naming EXISTING.js.txt, the source file and line
   ranges, and any prior enrichment file. Mode: walked if the framework carries
   founder-validated places, else researched. Flight rows are origin-specific: the site
   is origin-neutral, so a flight row is only proposed as a sourced range with its origin
   named, or recorded as a gap (`src/data/fareIntelligence.js` refuses unsourced bands).
3. Dispatch timing + costs as a pair, then the verifier alone. Every prompt names the
   exact output path (the stop hook validates the path in the transcript).
4. Validate each file. Re-dispatch once on failure.

Up to three frameworks may run in parallel (about six agents in flight).

## 3. Write FIXES.md (the main session does this, not an agent)

Follow Dublin's FIXES.md exactly:
- Header: framework, runId, agents and calls, verdict counts by agent. Note any false
  `.MISSING.txt` markers.
- For every window and every cost row: **Current** (verbatim) → **Proposed replacement**
  (as code), built ONLY from findings the verifier confirmed or corrected (a `weakened`
  verdict's `proposedClaim` is the corrected wording). Unverifiable → removed, never kept.
- Founder-judgement fields (`recommended`, `verdict`) are carried over and flagged, or set
  to `null` for the founders to restate. Never researched into existence.
- Money: ranges with sources and `checkedOn`; an official fixed fee may be exact with
  `fixedPrice: true` and its government/official source (Brady, Oct 12).
- One-time events carry `datedUntil`. A window that cannot name its driver does not ship.
- End with numbered open questions for the founders.

## 4. Apply only on approval

Show Brady the per-framework summary (what changes, what gets removed, open questions).
Brady said improvement passes may be committed (Oct 12), but each framework is applied
only after he has seen its FIXES summary. Then: edit `src/data/<slug>.js` to the proposed
blocks, `npm test`, `npm run build`, check the framework page at 1440 and 390 (When to Go
and Logistics render, no `null` printed, no point price visible), commit per framework on a
feature branch, push.

Never touch `ladsTake`, founder facts, or places. Timing and costs only.
