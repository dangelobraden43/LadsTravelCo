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
- Parks: ONE Wikidata SPARQL fetch returns every coordinate-bearing feature linked to a park QID (union of P3018 / P361 / P131 = park QID, OPTIONAL P625 + P31). Got 9 features for Pictured Rocks in one call; the park link is the second identity attribute. Precision varies (one item had lat 46.55).
- Park centroids (Wikipedia/Wikidata) land in backcountry; compare against the park's wilderness-area QID point. NPS directions pages often carry an explicit "don't route to the park name" warning: quote it.
- NPS place pages (nps.gov/places/<slug>.htm) give directions and history but no coordinates in the fetched text.
- NPS park status: conditions.htm and the home page can show NO alerts while closures live in news releases (nps.gov/<unit>/learn/news/...). One WebSearch "<park> closure <year>" surfaces them; read the newest release.
- Wikipedia feature titles often redirect to the park article (inheriting its centroid) or to a same-named place elsewhere (Mosquito Beach -> South Carolina). Use as a trap finding.
- Budget: 12 calls covers about 6 flagged records well. Decide up front which of the 20 places get status checks and record the rest as a `could-not-look` gap naming them.
