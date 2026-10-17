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

- **A guide's single-day budget widened to a whole window** (Dublin fix pass 2026-10-12): Go-to-Ireland's
  tiers were for 17 March itself, and the claim said "a day around St Patrick's". Ask what day or period
  the published band covers.
- **A range whose top is a floor.** A rail band topped with a shorter leg's walk-up fare, while the
  agent's own note says the real walk-up fare is higher. Weaken it, and weaken every derived total that uses it.
- **One event's price data stretched across "festival weeks".** Race-week hotel prices (2022) were applied
  to the Arts Festival as well. Check which event and which year the price comes from.
- **Framework fix passes:** check the founder-voice copy elsewhere on the site against UNVERIFIABLE window
  fields (Dublin's "70% local" is quoted on /christmas-markets). Flag it to the founders; never rewrite it.

- **Road-trip runs (gorge-ridge-drive 2026-10-15):** the toll/route core held up; the errors sat in stop
  details. Seen: names an official page uses only as landmarks listed as its merchants (North Market's
  Omega/Satori); "cannot reach it without the turnpike" inferred from the one exit a venue's site names;
  a "sources conflict" trap that dissolved because the second page had since been updated (Seneca Rocks
  office page, Apr 2026); "calls itself America's oldest" where the site says "oldest continually
  operating"; a state-ranking stat mixing two study years (State Farm deer odds). Re-read both pages of
  any claimed conflict before confirming the trap.
- **Road-name equations and hours from one aggregator.** "County 23 (Paint Creek Road)" where AARoads names
  Paint Creek Road CR 15; a chain's "6 am to 8 pm daily" from Franki while the brand locator lists two shops and
  other listings say 5:30 am. Scout rankings ("earliest", "safest") ride along with these; strip them.
- **Venue-list claims from Wikivoyage** read as current fact but carry 2022-2024 listing dates. Weaken to
  "listed (updated YEAR)" unless a 2026 source shows the business trading.

- **Shared place-name closures (Shenandoah 2026-10-15).** A "Patocka's Gastropub closes in Greene" report was
  Greene, New York, cited as Greene County, Virginia. For any closure claim, confirm the street address or town in
  the article itself before accepting it. Syndicated Yahoo local news is where this hides.
- **Trip-day schedules beat venue praise.** Check whether a venue serves at all on the trip weekdays before
  verifying its description: Three Blacksmiths (Wed-Sat only), Triple Crown BBQ (Fri-Sun only), Montpelier (Mon
  closed), Monticello (Tuesdays closed on its calendar). Operator sites and current listings settle these in one call.
- **Official pages contradict themselves.** NPS Shenandoah's hours table had Opening/Closing cells that read swapped
  for the two visitor centers and a "closed for the season" note beside open dates. Report the contradiction rather
  than pick a side; a "status" page last updated a year ago is not evidence a road is open.
- **Seasons get extended.** An agent's "official site says polo ends mid-October" was now "through October" on the
  same official page. Re-read season-end claims; they move.

- **Agents in one run contradict each other on venue status** (New River Gorge 2026-10-15). Provenance
  flagged a restaurant "currently closed" from Trip.com while the eat scout had read its own live site with
  hours; nearbase then said "no weekend hours anywhere". **How to apply:** for every Open/Closed conflict,
  fetch the venue's own site first; one fetch settled four findings. Also check later-wave files for news
  (a fire) that refutes an earlier agent's "lunch stop".
- **Closure detail attributed to the closures page but taken from a place record** ("Polls Plateau closed").
  Ask a yes/no word-search fetch ("does 'Polls' appear?").
- **`fixedPrice: true` on an operator's "starting at" price** (BridgeWalk, ACE zipline). Not an official fee;
  weaken and drop the amount from proposedClaim.
- **"No source after year X" claims fall to CVB event systems.** A brewery whose domain failed had 2026
  event pages on the town's visitor-bureau calendar. A different business listed at the same street address in
  the current directory is the tell that a venue moved or closed.
- **Season-end claims for outfitters** often rest on an unread snippet; the cited blog index had no dates.
  An operator's own director quoted in press ("Gauley marks the close of the season") outranks it.

- **Same-name venue in the next town** (Shenandoah recheck): an official directory "Sal's Pizza" was the Crozet restaurant,
  not the Stanardsville one in the claim. Check the address on the page before counting it as a second source.
- **Lodging/press citations that name none of the venues.** A 2017 state-tourism article was cited for a Madison County
  winery list. Re-sourcing the venues one by one is cheaper than leaving the finding unverifiable.
- **"No schedule found" gaps go stale.** An operator site later showed a 2026 season (Endless Caverns, Mar 27-Nov 15).
  Re-read the operator's home page before confirming an absence.

- **Gap-fill passes (gorge-ridge-drive gaps, 2026-10-15):** scouts on a spent budget lean on undated TV pieces
  and state-tourism listings. Two failure shapes: a WV Tourism restaurant listing still "open except winter" for a
  place an OnlyInYourState editor's note says closed (Front Porch, Seneca Rocks); a "local TV report" that was
  from 2016. Fetch the TV page once for its posted date. Also: "the only X found" claims (only fuel on US-33)
  fall to one aggregator search; and the official site often settles listing conflicts in one fetch (Tony
  Packo's, Secret Sandwich Society, Pies & Pints locations page). An agent's "likely closed" can be understated:
  the NPS compendium said outright "closed on Mondays, Tuesdays".

- **Event-transport capacity pinned to the wrong service (Ryder Cup 2027, 2026-10-16).** A tender's
  "train-and-ride ~2,000/day" was attached to the Irish Rail shuttle train when it belonged to the Colbert
  service, which inverted the fallback advice. For any capacity figure, ask the fetch which station/mode it
  belongs to, and read two press reports of the same tender: they can disagree on mode (train vs bus).
- **"Official sources disagree" traps** often turn out to be press vs press; re-read each official page.
- **Old press dressed as current:** a 2024 radio piece (Ryanair capacity) and a Feb 2024 developer update
  ("under construction in 2026") cited without dates. Always get the article date before confirming.
- **Fare product renames:** Delta Basic Economy is now "Delta Main Basic"; agent seat-purchase rules
  ("from 30 days out") were not on any page. Check product names like brand names.
- **Booking-window findings are time-critical:** recompute the day arithmetic and flag any opening date
  within a week of the run in the reason.

Related: [[source-access-notes]]
