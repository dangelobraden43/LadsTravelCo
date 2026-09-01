---
name: enrich
description: Research a spot's public consensus, put it in front of Brady/Dawson as a Notion review queue, then publish only what a founder signed off on. Use when Brady says "enrich", "consensus", "review queue", "verdict sheet", or names a framework or saved list that needs its spots deepened.
---

# Spot Enrichment Pipeline

Turns a one-line `description` into a researched, founder-verified spot entry.
Four stages, and **stages 3 and 4 do not run until a human has reviewed stage 2.**

The research layer explains the world. Only Brady and Dawson speak for the Lads.
That line is the whole point of this skill — do not blur it to make output look fuller.

## The hard rules

- **`publicConsensus` is the public's opinion, never ours.** If it is rendered it must be
  labelled as such. Same discipline as `GOOGLE_LISTING` in `src/data/peru.js`.
- **A consensus claim with no source does not ship.** Every claim traces to `consensusSources`.
- **Never AI-generate `ladsTake`, `forWho`, `story`, or an anecdote.** These come from Brady
  or Dawson verbatim, or they stay empty. A spot with no founder verdict stays silent — the
  same rule that keeps the 16 silent Peru places silent.
- **THE NON-DESTRUCTIVE RULE.** A proposed draft may ADD specificity but may never REMOVE a
  firsthand detail from the current description. Anecdotes, ratings and practical warnings in
  existing lines are protected. If a draft drops one, flag the row and do not auto-publish it.
- **`nearby` is computed from stored coordinates, never geocoded from a name.** Tivoli rule.
- **Research-tier spots get consensus only** — no verdict, no Lads voice, copper.
- **Thin research ships empty, not padded.** No invented specifics, ever.
- Voice for any drafted copy: warm, plainspoken, specific. No em-dashes, no tricolons,
  no "not just X, it's Y," no generic travel-ad language.

## Known environment blockers — read before dispatching research

Learned the hard way on the Grand Rapids pilot, Aug 31 2026. These are environment
limits, not research gaps, and the difference matters: an empty row because we could not
look is NOT the same claim as an empty row because we looked and found nothing. Say which.

- **reddit.com is blocked.** Direct fetches and site-scoped searches both fail. Do not
  spend calls on it, and note its absence in the sourcing.
- **Yelp and Tripadvisor return HTTP 403 on direct fetch.** Their content is still usable
  through WebSearch result snippets. Mark any such claim `(search snippet)` so a reviewer
  knows it was never read in full.
- **WebSearch has a per-session quota, around 200 calls.** The pilot exhausted it and five
  spots got zero queries. **Budget 4-5 calls per spot and cap a batch at roughly 30 spots.**
- **What reliably fetches:** official venue sites, local press (Crain's, MLive, WOOD TV8,
  WZZM13, WWMT, Grand Rapids Magazine), Experience Grand Rapids, BeerAdvocate, BringFido.
- **Concurrency:** 4+ research subagents at once trips the session rate limit. Run two
  waves of two.

## Stage 1 — Public pull

For each spot, research with a Lads angle: is it worth it, when to go, what is the trap,
what is nearby. Sources: Reddit, travel forums, recent articles, plus any Google category /
rating / review count already captured by provenance.

- [ ] Paraphrase into `publicConsensus.summary` (2-3 sentences), `.praised`, `.criticized`,
      `.practical`. No long quotes.
- [ ] Record every source in `consensusSources` as `{ title, url, kind, checkedOn }`
      where kind is `reddit | forum | article | google`.
- [ ] Compute `nearby` by distance from coordinates already in the data file.
- [ ] Set `enrichedOn`.
- [ ] Where research is thin or contradictory, say so and leave the field empty.

## Stage 2 — Verdict sheet to Notion

One row per spot in the **Spot Review Queue** database inside The Lads Operations Hub.

Columns: `Spot` · `Framework/List` · `Validated` · `Current Description` · `Public Consensus`
· `Proposed Draft` · `Verdict` · `Copy Decision` · `Rating` · `Anecdote` · `Best Time` ·
`Nearby` · `The Trap` · `Protected Detail Dropped` · `Reviewer` · `Status`.

- [ ] `Status` starts at **Needs Review**.
- [ ] Assign `Reviewer` per spot by city: Dawson takes Madrid, Iceland, Ireland, Rome, and
      UP/Bruce-adjacent places. Brady takes the rest. Shared trips go to either.
      `spain.js` splits — Madrid to Dawson, Barcelona to Brady.
- [ ] Tick `Protected Detail Dropped` and note what was lost whenever the draft omits a
      firsthand detail the current description carried.
- [ ] Research-tier rows carry no `Proposed Draft` and no verdict prompt.
- [ ] **Write the `Proposed Draft` here, not in Stage 3.** The reviewer has to see the current
      line and the proposed line side by side to choose Keep / Replace / Merge — a draft that
      arrives after the decision is useless. The draft is a proposal for a human to accept,
      never a published claim, and it must not read as firsthand where it is not.
- [ ] STOP. Report the database link and wait.

## Stage 3 — Quality pass

Runs **only** on rows marked Reviewed.

- [ ] Finalise the description from the draft + the founder's verdict, honouring the
      Copy Decision (Keep / Replace / Merge) and folding in their anecdote verbatim.
- [ ] Fill the tips layer: `bestTime` with its reasoning, `nearby`, `theTrap`, `forWho`.
- [ ] Append every **Challenge** verdict to `internal/brady/challenge-posts.md`. Those are posts.
- [ ] Re-check the non-destructive rule against the final text, not just the draft.

## Stage 4 — Publish

- [ ] Write to the v2 data file. ⚠️ `src/data/michigan.js` is still the legacy
      `categories:` schema and must be migrated to a `spots:` array before it can receive
      enriched fields — `FrameworkPage.jsx` legacy card reads only name/area/description/
      validator/rating/price.
- [ ] `validated: true` only for founder-visited places. Never flip a tier to look fuller.
- [ ] Mark the Notion row **Published**.
- [ ] Update the canonical count for that batch and propagate to every derived surface
      (App.jsx counter + globe caption + system copy + stat card, ExplorePage, all three
      `index.html` metas). Canonical figures never move silently.
- [ ] `npm run build` clean.

## Quality check

- [ ] Zero `ladsTake` / `forWho` / anecdote values written by the pipeline — grep the diff.
- [ ] Every consensus claim traceable to a source URL that resolves.
- [ ] No spot padded where research was thin.
- [ ] Closed venues suppressed entirely, not greyed.
- [ ] Canonical count reconciles to the live-walk, not to memory.
