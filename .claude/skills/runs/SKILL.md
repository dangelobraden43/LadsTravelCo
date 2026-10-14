---
name: runs
description: Find every Lads research run that stalled and finish it. Scans internal/research/ for runs missing agents, a verifier pass, a packet or FIXES file, or carrying .MISSING/.INVALID markers, reports them, and re-dispatches only what is missing. Use when Brady says "runs", "resume the research", "collect the runs", "what's stuck", or at /morning when background runs were left going.
---

# /runs — FIND AND FINISH STALLED RESEARCH RUNS

Runs in the main session (it dispatches agents). Read-only until Brady says go, except
for the report itself.

## 1. Inventory (no agents yet)

For every `internal/research/<slug>/<runId>/RUN.json` (skip `market/` and `_setup/`):

1. **Expected outputs** = `RUN.json.roster` (fall back to the agents named in
   `callBudgets`). A roster entry `lads-x.part` expects `lads-x.part.json`; `lads-verifier`
   expects `lads-verifier.json`; `lads-trip-architect` expects `PACKET.md`. A run whose
   `purpose` starts `FRAMEWORK FIX PASS` expects `FIXES.md` instead of `PACKET.md`.
2. **Present** = the file exists AND `node tools/research/validate.mjs <file>` passes.
3. **Markers.** A `.MISSING.txt` beside a file that exists and validates is a FALSE marker
   (the pre-Oct-14 hook collision). Report it as false; never act on it. A `.INVALID.txt`
   is real until the file it sits beside re-validates.
4. **Stage** of the run: `researching` (research outputs missing) → `verifying`
   (all research present, no verifier) → `assembling` (verifier present, no packet/FIXES)
   → `complete`.
5. **Age.** A run older than 14 days with research but no verifier is stale: its
   findings' `checkedOn` dates are aging. Recommend `--refresh` over a bare verify.

Write the inventory to `internal/research/RUNS.md` (gitignored) as one table:
`run | stage | missing | false markers | invalid | next step`. Show the same table to Brady.

## 2. Ask before dispatching

One question, multi-select: which runs to finish. Default recommendation: everything
in `verifying` or `assembling` first (cheap, unblocks a packet), then `researching`.

## 3. Finish, in stage order

- **Missing research agent:** dispatch it with the standard /research prompt, naming
  the run directory AND the exact output file:
  `Research <displayName> for the Lads. Your run directory is <runDir>. Read <runDir>RUN.json first. Your call budget is <n>. Write <runDir><file>.`
  (The stop hook reads the run from the agent's transcript, so the path in the prompt
  is what it validates. Always include it.)
- **Verifier:** dispatch `lads-verifier` alone per run, budget from
  `callBudgets.lads-verifier` (or 9 per research file, minimum 30).
- **Packet:** dispatch `lads-trip-architect` → `PACKET.md`. For a FRAMEWORK FIX PASS,
  write `FIXES.md` yourself following `internal/research/dublin/2026-10-12T15-39/FIXES.md`
  (the worked example), or run `/resource-frameworks` for that framework.
- Several runs may proceed in parallel now (hook fixed Oct 14). Keep it to about six
  agents in flight at once.
- Validate every file after its agent returns. Re-dispatch once with the errors pasted
  in; a second failure is recorded in SUMMARY.md and left.

## 4. Close

Update each finished run's `SUMMARY.md` (agents, findings per agent, verdict counts,
invalid files, calls used, top open questions) and re-write `RUNS.md`. Report to Brady:
what finished, what is still stuck and why. Delete false `.MISSING.txt` markers only
after reporting them. Commit `.claude/agent-memory/` changes the agents made.
Publishes nothing.
