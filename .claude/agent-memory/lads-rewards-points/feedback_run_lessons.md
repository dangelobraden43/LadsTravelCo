---
name: rewards-run-lessons
description: Durable lessons for the rewards agent's output shape: card comparisons, derived synthesis findings, carrying other agents' sources, and when search is exhausted
metadata:
  type: feedback
---

- **Cards: every option side by side, never one alone** (Brady, Sept 29 2026). Write one
  `fact` per card (fee, bonus with spend and window, earn, partners, the catch), then one
  synthesis finding with `derivedFrom` listing them that says who each suits.
  **Why:** the ruling; the reader chooses. **How to apply:** if a card's annual fee could
  not be sourced, say so in the claim and keep it out of fee comparisons.
- **Bonuses have no end date on issuer pages.** Record the observed date and set
  `datedUntil` to today + 30 as the re-check date.
- **Transfer paths are not interchangeable.** Only Chase listed Iberia Plus directly (Oct
  2026); Capital One lists British Airways and Qatar, not Iberia. Never assume Avios can be
  moved between programmes without the programme's own terms.
- **Carrying another agent's source:** mark `access: "snippet"` and name the other
  agent's finding id in `notes`; do not claim `read` for a page you did not fetch.
- **Search can be exhausted before you start** (session-wide cap shared by all agents).
  Record award prices and devaluations as `could-not-look`, never fill from memory.
  Absence of a devaluation found is not evidence of none.

Related: [[rewards-source-behaviour]]
