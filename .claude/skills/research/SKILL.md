---
name: research
description: Run the Lads research agents on a destination and produce a founder review packet. Use when Brady says "research", "run the agents", "research pass", or names a destination or park to research. Args - <destination> [--mode walked|researched] [--agents a,b,c] [--refresh].
---

# /research — THE LADS RESEARCH PIPELINE

Runs in the main session (it dispatches agents; agents do not dispatch each other).
Spec: `docs/superpowers/specs/2026-09-29-research-agents-design.md`.

## 1. Set up the run
1. Destination slug from the args (lowercase, hyphens). Display name from the user's words.
2. Mode: `--mode` if given. Otherwise **walked** only if `src/data/<slug>.js` exists and
   contains places with `validated: true` (import it with node and count; never grep).
   Everything else is **researched**. A saved Maps list does not make a place walked.
3. `runId` = local time `YYYY-MM-DDTHH-mm`. `runDir` = `internal/research/<slug>/<runId>/`.
4. Inputs: list existing files the agents should read: `src/data/<slug>.js`, any
   `internal/brady/<slug>*-enrichment.md`, rows for the destination from
   `internal/brady/maps-lists-2026-08-29.txt`, and the latest prior run's PACKET.md.
5. `scope.places`: known places with coordinates and `coordSource`, from a data file or a
   saved list only. Names from ASCII staging text are acceptable for research scope, but
   the packet must flag them to be re-read from the browser before any data file is built.
6. Call budgets: 12 per research agent, 20 for the verifier, unless the user says
   otherwise. Keep the whole run under ~180 WebSearch calls.
7. Write `RUN.json` with: `destination, displayName, mode, runId, runDir, today,
   callBudgets, inputs, scope` (field meanings are in the research-contract skill).

## 2. Dispatch in waves, TWO AT A TIME
Default roster (drop `lads-parks-trails` when the destination has no park or trail
content; `--agents` overrides the whole list):
- Wave 1: lads-provenance + lads-timing-events, then lads-entry-essentials (paired with
  the first Wave 2 agent).
- Wave 2: lads-destination-scout, lads-stay-neighborhoods, lads-flights,
  lads-getting-around, lads-costs-budget, lads-parks-trails.
- Wave 3: lads-bookings-tickets, lads-rewards-points, lads-deals-savings.

Each dispatch: the `Agent` tool with `subagent_type` = the agent name and a prompt of the
form:
`Research <displayName> for the Lads. Your run directory is <runDir>. Read <runDir>RUN.json first. Your call budget is <n>. Write <runDir><agent>.json.`
Launch the pair in one message; wait for both before the next pair.

After each agent returns: `node tools/research/validate.mjs <runDir><agent>.json`.
If invalid, or a `.INVALID.txt` exists, re-dispatch that agent once with the errors
pasted in. If still invalid, keep the file, mark it in SUMMARY.md, and continue.

## 3. Verify, then assemble
- Dispatch `lads-verifier` alone with the run directory. Validate `lads-verifier.json`.
- Dispatch `lads-trip-architect` alone. Validate `PACKET.md`.

## 4. Summarise
Write `SUMMARY.md` in the run directory: agents run, findings per agent, verdict counts,
invalid files, calls used, and the top 5 open questions. Report the same to the user in
chat, with the path to PACKET.md. Publish nothing. Publishing goes through the Notion
review queue and /enrich stages 3-4 after a founder rules.

## --refresh
Re-run only the agents whose domain freshness window has passed (spec section 6), with
`inputs` including the prior run, and instruct them to re-check findings rather than
research from scratch.
