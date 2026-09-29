---
name: verification-patterns
description: Recurring ways research-agent findings go wrong (derived ranges, carried-forward dates, kind recoding, tax-included claims) and what to check first
metadata:
  type: feedback
---

Failure shapes seen in agent output (first seen Vancouver pilot 2026-09-29). Check these before anything else.

- **Derived money presented as published.** Costs agents sum component prices into a daily
  range, then cite a guide that publishes a different, lodging-inclusive total. The fix is
  weakened, with a proposedClaim that says the range is derived.
  **Why:** a traveller reads it as a market figure. **How to apply:** for every `range`, find the
  number in the source itself.
- **Carried-forward sources with a fresh finding date.** A finding's `checkedOn` can be today
  while every source's `checkedOn` is from an earlier run. Judge freshness by the source dates.
- **Promo recoded as `fact`** to get around the researched-mode two-source rule. One official
  source is fine substantively, but flag the kind in the reason.
- **"Tax included" / "same price online and at gate"** claims about attractions. Capilano's
  official page says "subject to GST" and online saves money. Re-read the official wording.
- **Rules stated more strongly than the source says** ("requires" when the source says "may be
  required"; a release time the page never gives). Common on park and access rules.
- **The word "free"** slips into claims and notes. The contract says "no admission charge".
- **Trail and length figures.** Agents round up (for example 3 km where the operator says 2.5 km).
  Operator FAQ pages settle these in one fetch.

Related: [[source-access-notes]]
