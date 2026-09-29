---
name: packet-assembly-lessons
description: Reusable lessons for assembling PACKET.md from research-agent JSON and lads-verifier.json (verifier additions, derived numbers, clustering threshold, checkedOn honesty)
metadata:
  type: project
---

Lessons from the Vancouver pilot packet (run 2026-09-29T15-59).

- **Facts the verifier found are not findings.** The verifier's `reason` text often holds new facts it read on official pages (extra hours, parking rules, postal codes). Keep them out of the draft and list them under Open Questions as "verifier additions, not yet findings", so the next run can turn them into findings.
  **Why:** the contract only lets confirmed findings, weakened findings (using `proposedClaim`) and unverifiable findings into the draft.
  **How to apply:** for a weakened finding, use only its `proposedClaim`, and log every struck part in a "Struck by the verifier" table.
- **Don't write derived numbers.** Don't round percentages ("57 percent" becomes "46 of 81") and don't multiply daily ranges into trip totals. Distances between stored coordinates are method outputs. Describe the threshold rather than quoting pairwise distances.
- **Clustering.** Single linkage at 1.0 km chained Vancouver's Granville Island into downtown across False Creek. 0.6 km gave sensible neighbourhood groups. Straight-line distance ignores water, so name the water break from a finding. Leave summit-flagged coordinates out of clustering.
- **checkedOn in parkData.** Use the oldest evidence date behind the fields, not the finding-level date. Scout findings often carry forward sources read in earlier enrichment.
- **Researched mode means no rating slots.** Founder slots are include/cut, add/leave-out for discoveries, and "whether any Lads line belongs here", never a verdict.

Related: [[research-contract]]
