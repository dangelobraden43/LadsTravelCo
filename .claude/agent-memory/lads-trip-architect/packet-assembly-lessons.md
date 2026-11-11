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
- **Clustering is scale-dependent.** For a park (Pictured Rocks, run 2026-10-06T14-18) 0.6 km isolates every point; 10 km single linkage over point features gave west / middle / east days. Keep area markers and low-precision coordinates out of the linkage and attach them to the nearest group; attach coordinate-less places by what their findings say about access roads. State the threshold sensitivity, not pairwise distances.
- **Parks: trail difficulty and time rarely survive.** The NPS Day Hikes page carries distance but usually no difficulty label, hours or gain, and the verifier strips agent-attributed ones. Expect `difficulty: GAP` rows; carry only "NPS describes it as easy" wording that sits inside the proposedClaim. Plan Task 9 bars AllTrails-class sites as sole source for difficulty, so an AllTrails-only rating is a GAP plus an attribution note.
- **proposedClaim can drop a number the verifier's reason confirms** (e.g. a fixed campground fee or shuttle fare replaced by "the fee on the NPS page"). Use the proposedClaim; list the number under verifier additions.
- **Windows in researched mode:** carry `driver` and months from the finding, but set `recommended`/`verdict` to null on weakened windows (note the agent's flag); never put Lads voice in a window.
- **Contract-flag findings (promo filed as fact, fixedPrice on dated pass prices, same-owner "two sources", arithmetic as fact).** Midwest skiing run 2026-10-06T15-15. Keep the point prices out of the draft body; use the confirmed range finding instead, and put the price plus the fix in a "Fix before publishing" table near the top. Deadlines that pass before publish go in a dated table marked STAGING ONLY.
- **Pass-coverage tables: "No" vs "not named".** Write "No" only when a finding states an exhaustive list (Epic's Midwest hills). When findings just name some resorts (Ikon), write "not named", because the absence is not evidence.
- **Region-scale clustering (ski areas over 5 states).** Single linkage at 60 km gave sensible base groups. Call them base groups rather than days, and give sensitivity at 40/50/70 km.
- **Put the mode on its own line, `**Mode:** researched`, directly under the title.** The validator does not match it inside a table row (`| **Mode:** | ... |`) and rejected the packet.
- **Count the verdicts yourself.** The brief's verdict totals can be wrong (European Christmas Markets run 2026-10-06T15-15: the brief said 58/40/1/76 and the file said 72/34/1/68). Count per agent from lads-verifier.json and state any mismatch in the header.
  **Why:** the coverage table must match the file, not the orchestrator's summary.
- **Multi-country event frameworks need two clustering passes.** Run 2 km single linkage to make city stops (it joins same-city squares), then about 160 km to make route legs. Around 250 km, Central Europe collapses into a single group. Attach cities to a leg by rail findings, not distance, and mark any leg with no rail finding behind it as "geometry only". Each market needs `datedUntil` = the last day of its edition; a market with no official closing day is "hold".
- **Agents self-flag inferences in their notes** (tags, "general knowledge", "drop if unsourced"). Withhold those parts even when the verifier only said "budget", and log them in a "Withheld by the architect" table.
- **Researched mode means no rating slots.** Founder slots are include/cut, add/leave-out for discoveries, and "whether any Lads line belongs here", never a verdict.

Lessons from the Rugby World Cup 2027 event packet (run 2026-10-12T15-35, assembled 2026-11-10).

- **The caller's brief can override where unverifiable findings go.** This brief said leave them out of the draft and list them in an appendix as "not yet confirmed". Follow the brief; give each appendix row a subject without its figures, the verifier's reason, and what would confirm it. Carry the verifier's "do not publish" lines in bold.
- **"Lead with the open items" still needs the Mode line first.** Title, `**Mode:** researched`, citation legend, then `## 0. Settle first`, then the header table as §1.
- **A "confirmed" verdict often hides an unread part.** Read every confirmed `reason`. Three-way rule that worked: (1) part the agent read and the verifier just did not re-read: keep, cite as `[id · part unread]`, list in a table; (2) part neither read on a page (snippet-only, "not on that page", "rests on unread press"): withhold and log; (3) part the agent's notes call inference: withhold or label as agent reading.
- **A confirmed finding can lean on an unverifiable one** (a transfer-partner row calling an airline "the official partner" when the partnership finding was unverifiable). Drop the borrowed descriptor and log it.
- **Card rows: fees are an issuer's own price, not a government fee.** The verifier confirms them and flags `fixedPrice`. Body uses the relative fee tiers from the corrected comparison finding; exact fees and undated welcome offers go in the contract-flags table pending a founder ruling.
- **Research and verification a month apart means stale-since-research facts** (a new airport opened, a second official seller list appeared). Put a "what changed between research and verification" table near the top and a STAGING ONLY table of dates that pass before publish.
- **Event day grouping:** cluster only the venue coordinates into bases (single linkage, state the stable band, here about 20 to 100 km for one group per host city), then take days from fixture findings, not geometry. With no code tool, say the distances were worked by hand.
- **Disputed fixture dates:** mark every line that uses the date "date disputed" and list which findings carry it.
- **Never write the banned words even to say they are absent.** `validatePacket` scans every non-quote line for the coverage-product word, the giving words and first-person voice; RUN.json also bans the no-cost word. Grep the packet for them before handing back.
- **Check run hygiene and report it:** id sequences with holes (no `fly-001`), `callsUsed` counted differently between agents, agent `generatedOn` dates later than RUN.json `today`.

Related: [[research-contract]]
