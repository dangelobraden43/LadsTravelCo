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
- Carried-forward prior enrichment can be cited with its original checkedOn and access; say in notes that it was not re-read.
