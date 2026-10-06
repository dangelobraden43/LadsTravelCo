---
name: source-behaviour
description: Which sources fetch, block or mislead when scouting a city; how to spend a 12-call budget
metadata:
  type: reference
---

- vancouverisawesome.com returns 403 on fetch. destinationvancouver.com, moa.ubc.ca, Wikipedia and vancouvertourism.org fetch fine.
- capbridge.com ticket page shows hours and offers but no dollar price; the price sits behind the booking flow. Tourism-guide sites disagree on it, so leave price to the costs agent.
- vancouvertourism.org is a guide/aggregator site, not the official board (destinationvancouver.com is). Label it press and expect its prices to differ from official ones.
- One WebFetch of a ranked-attractions page yields more discovery signal than a search. Two searches naming places plus two fetched guides gave enough for about ten discovery places.
- Search-result text alone is `snippet` access and low confidence; do not label it `read`.
- Avoid every dollar figure and the word "free" in claims and notes: the validator rejects single amounts.
- State tourism boards with a single region-wide guide page are the best one-fetch buy for a multi-place scope (michigan.org "comprehensive guide to ski resorts" covered ~35 areas). But official guides go stale: it still listed pre-rebrand resort names, and travelwisconsin.com's ski story was dated 2017. Always note the page date and cross-check names against provenance.
- islands.com fetches fine and states its method and date; useful second independent source for regional "best of" lists.
- Validator bans the stem "fundrais*" anywhere (even describing a closure) and any number followed by a currency code; it does not check em-dashes but the contract does.
- With a long provenance list and 12 calls, cover the headline places plus traps well and record the rest as a could-not-look gap rather than thin entries.
- Carried-forward prior enrichment can be cited with its original checkedOn and access; say in notes that it was not re-read.
- Seasonal/event runs: timeout.com/europe best-of pages fetch cleanly and give ranked praise plus specialities in one call. The best consensus page per call.
- lonelyplanet.com/articles/best-christmas-markets-in-europe is 404; do not guess Lonely Planet article slugs.
- europeanbestdestinations.com rankings are social-media votes, the page is over 170k chars (only the top part gets read), and venue details go stale (2026 page still named an ended Zurich market). Popularity evidence only.
- In a later wave, read the earlier agents' files for contradictions (e.g. one says an event ended, another found a successor). Recording the conflict as a finding is cheap and valuable.
- German travel press (travelbook.de) and festivalsindeutschland.de come up for German market facts; the latter is an aggregator.
