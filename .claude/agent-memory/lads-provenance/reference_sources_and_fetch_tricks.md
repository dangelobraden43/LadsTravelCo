---
name: reference-sources-and-fetch-tricks
description: Cheap provenance moves that worked (or failed) on the Vancouver pilot; read before spending calls on coordinates or status checks
metadata:
  type: reference
---

- One WebFetch of the Wikipedia API returns coordinates and the Wikidata QID for up to ~6 pages at once:
  `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageprops&ppprop=wikibase_item&colimit=max&titles=A|B|C&format=json`
  Cheapest identity cross-check for saved-list places. Some pages carry no coordinate (Commodore Ballroom); Stanley Park is rounded to 0.1 degree.
- Operator "locations" pages are the best status source for chains (tacofino.com/locations read cleanly). Guess-URLs on official sites often 404 (grousemountain.com/getting-here did); siegelsbagels.com home page returned no addresses.
- Search summaries surface Apple Maps place URLs with a `coordinate=` parameter. Aggregator only, not authoritative; usable to show a summit-vs-base gap, not to replace a coordinate.
- Search summaries are model paraphrases: postal codes and street numbers conflicted between results (Mt Seymour, Siegel's Granville Island). Assert none of them without a page read.
- Budget: 12 calls covers about 6 flagged records well. Decide up front which of the 20 places get status checks and record the rest as a `could-not-look` gap naming them.
