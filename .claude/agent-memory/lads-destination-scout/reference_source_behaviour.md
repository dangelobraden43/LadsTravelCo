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
- Stadium/match-day scouting (Australia, Oct 2026): searches for "pre-game pubs near X stadium" mostly return transport-authority event pages (transportnsw.info, transperth). Good for practicals and traps, useless for named pubs. City tourism boards' "pre and post game" pages (visit.brisbane.qld.au) are the one-fetch buy for precinct venues, but check the page date (Brisbane's was 2023) and confirm each named venue still trades.
- Fan-experience polls for Australian stadiums are old (Austadiums 2021 vote, AFL 2018 survey); there is no current ranking. Label the poll year.
- Distances from a venue to a framework's walked places: compute from the Wikidata venue point and the stored coordinates in src/data, call them straight-line, and say it is your arithmetic. Costs zero calls.
- Check the framework's actual place list before trusting a brief's pairing claim: the Australia brief said Sydney/Melbourne/Tasmania but australia.js has no Melbourne places.
- mona.net.au/visit fetches cleanly (hours, closed days, ferry, booking).
- German travel press (travelbook.de) and festivalsindeutschland.de come up for German market facts; the latter is an aggregator.
- Eclipse/event viewing runs: spainsolareclipse.com/best-locations-2027/ is a one-fetch multi-town table (duration, Sun altitude, short warnings). treseclipses.es viewpoint pages fetch cleanly, but they are terrain-model rankings: no access, parking or crowd data, and no page date. Use them for names and durations, never for site quality.
- space.com list articles fetch as header only; use search snippets and mark them `snippet`.
- Spanish searches for beach parking or summer vehicle rules (Bolonia, Trafalgar) return little; "Bolonia" pulls Bologna, Italy. Spend those calls on the council or local press instead, or record the gap.
- Southern West Virginia (New River Gorge, Oct 2026): visitfayettevillewv.com's nightlife page is the one-fetch buy for Fayetteville bars (dated, names ~11 venues, few hours). brilliantstream.com (WV craft-beer press) fetches cleanly via ?p= ids and dates its posts. wvtourism.com town guides fetch and show an update date. smoothambler.com is 403; greenbrierwv.com/eat-drink/ and adventuresonthegorge.com/smokeys/ were 404; several small-brewery domains did not resolve (guessing a brewery's domain wastes a call).
- "Hinton" search results mix in Hinton, Alberta (hintonrockies.com). Any small-town name shared with another place needs the state in the query and an address check.
- The word "free" hides in phrases like "toll-free" and "duty-free"; grep the output for it before finishing.
- Commercial trip blogs (e.g. tripprof.com) can be dated and detailed but mix in entry/border claims; use them for site character only and leave entry rules to government sources.
