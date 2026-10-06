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

- **"Drop it, the operator closed" traps can be operator changes** (Christmas markets 2026-10-06,
  Schönbrunn). A farewell page from the old organiser is not proof the event ended: search for the
  event name plus the year and look for a new organiser domain before accepting a closure.
- **One sub-venue's span reported as the city range.** Vienna punch "EUR 4.80-8.80" was Spittelberg's
  own row; the survey's real span was wider. Re-read the table, then recompute every derived budget
  that used the component.
- **Aggregator route listings reflect the summer schedule.** "Daily nonstop" from flightsfrom/idealo
  can be a summer-only route (DTW-MUC), and a "winter cut" from last year can be reversed in the new
  filing (KLM MSP returned for NW26). AeroRoutes NWxx filings settle winter frequency in one fetch.
- **"The one / the only" in transit claims.** Check the official disruption page for other services
  (ÖBB listed REX 7 alongside the Railjets).
- **Second sources often differ by minutes.** Tourism-board rail times differed from seat61 by 3-10
  minutes on three legs; propose bands, not points.

- **Quoted fee/tax wording that is not on the page** (Midwest skiing 2026-10-06). Agent quoted Blue
  Mountain as "before the 1% fee plus 13% HST"; two reads found only "products are subject to a 1% fee;
  this fee is also subject to HST". Ask a yes/no fetch question ("does 'before' appear?").
- **Aggregator deadline labels vs operator press releases.** OnTheSnow showed an Epic "price expires
  Oct 31"; Vail's own release said "after October 7". The operator's release wins. Ski aggregators
  (OnTheSnow, Skiinfo) put a new-season heading over last season's dated samples.
- **Drive times from merged snippets disagree with the resort's own page** by 30-60 minutes (Boyne,
  Wilmot, Crystal). Fetch the resort's getting-here page first; it usually settles several findings.
- **Pass partner vs "allied"/discount tier.** Indy lists Mont Ripley as Indy Allied (discount only),
  not a partner. Check the pass's How It Works page before confirming a coverage list.
- **Promo recoded as fact plus `fixedPrice: true`** to carry a dated season-pass price on one official
  site. Confirm the substance, flag the kind and the fixedPrice misuse.
- **Superlatives that contradict the agent's own source** (a "largest by acreage" claim where the same
  guide lists a bigger resort). Read the whole source table, not just the row cited.

- **Scout praise lines inflate a listicle rank into "consensus"** (markets pass 2): "the town consensus
  calls most atmospheric" from a #15 rank; "the major market closest to London" from "one of the
  nearest". Rewrite as "Time Out ranked it N and says X".
- **Trap magnitudes grow between source and claim**: "two or three times the amount" where the source
  says "a little more than you asked for". Re-read the trap's own wording.
- **A cited page that does not carry the sentence.** Stay agents blend search summaries and attribute
  lines (sell-out order, tram stops, "car parks fill") to a page that says none of it. One fetch with
  yes/no questions per line exposes it; a later press piece may even contradict (parking expanded).
- **Second-pass edits:** a confirmed pass-1 verdict can still be overstated in a part pass 1 did not
  read (Aachen). Change it, and say in the reason that pass 2 changed it.

Related: [[source-access-notes]]
