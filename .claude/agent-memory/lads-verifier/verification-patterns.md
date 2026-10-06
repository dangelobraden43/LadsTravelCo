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

- **A correction can be wrong too.** Before replacing a figure with an official one, check whether
  another official source gives the first figure and whether the two count different things (MOA:
  the museum's visit page says "nearly 50,000 objects", Destination Vancouver says "530,000
  ethnographic and archeological objects"). Then the fix is "reported two ways", not a swap.
- **Agents' own second sources can contradict them.** Read the snippet-only second source before
  confirming: a "product" (Vancouver attractions passport) turned out to be off the market per its
  own cited page.
- **Venue hours carried forward from an older enrichment go stale fast.** Re-read the venue's own
  page; hours were wrong for one of three venues checked a week later.
- **Re-verification is a new date.** The validator requires generatedOn = the actual local date,
  not RUN.json `today`. Note time-sensitive items (promo end dates, listed event dates) that have
  moved closer or passed since the research run.

- **Trail difficulty and time attributed to a park page that does not carry them** (Pictured Rocks
  2026-10-06). Parks agent wrote "the park rates it strenuous, 5-7 hours" for 11 trails, citing
  nps.gov/piro hikes.htm as read; three reads found no difficulty words and no hour estimates there.
  NPS Hikes Over a Mile even called one "moderate" trail "an easy walk". **How to apply:** for
  park trail findings, ask the fetch a yes/no question ("does the word strenuous appear?") rather
  than trusting a summary, and weaken to distance-only when ratings are not on the page.
- **Price sourced from an operator not authorized to operate there.** Kayak price came from an
  outfitter absent from the NPS Commercial Use Authorization list. Cross-check any guided-activity
  price against the official permit list before confirming; derived budgets built on it fall too.
- **Source date makes the claim impossible.** An August 14 article cited for "every month July to
  October set a record". Check the source's publication date against the period claimed.
- **"Postponed", "only", "never"** added to a closure claim from a snippet that only announces a date.

- **My own proposedClaim text is validated for point prices** and has no `fixedPrice` escape hatch.
  When rewriting a claim that carries an official fixed fee (camp fee, shuttle fare), refer to "the
  fee on the NPS fees page" instead of typing the amount; ranges ("USD 5-15") pass.

Related: [[source-access-notes]]
