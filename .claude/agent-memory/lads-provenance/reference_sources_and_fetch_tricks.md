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
- BEST NPS coordinate source: `https://developer.nps.gov/api/v1/places?parkCode=<code>&limit=150&api_key=DEMO_KEY` returns latitude/longitude for every NPS place record (112 for neri). It is ~550k chars, so it needs one WebFetch per 100k `offset` (6 calls). Ask for "title | lat | lng | url" plus any "closed" sentences. Traps seen: several trails share one trailhead point (don't pin them as the viewpoint); one record's coordinate field disagreed with the GPS in its own body text by 2.6 km (Camp Washington Carver); some records have empty coords.
- NPS closures: `nps.gov/<unit>/planyourvisit/road-and-trail-closures.htm` is maintained (updated Sept 2026 for neri) while conditions.htm was 3 years stale. Fetch the closures page first.
- Wikipedia redirect traps for parks: falls -> town (Sandstone Falls), mill -> state park (Glade Creek Grist Mill), exhibition mine -> historic mine name. The NRG park point equals Thurmond town.
- wvstateparks.com park pages read cleanly but carry no tram/facility status; WV restaurant status via search mostly returns undated guides.
- NPS park status: conditions.htm and the home page can show NO alerts while closures live in news releases (nps.gov/<unit>/learn/news/...). One WebSearch "<park> closure <year>" surfaces them; read the newest release.
- Wikipedia feature titles often redirect to the park article (inheriting its centroid) or to a same-named place elsewhere (Mosquito Beach -> South Carolina). Use as a trap finding.
- Candidate-list runs (empty scope.places): ONE Wikidata SPARQL fetch = UNION of a VALUES list of known QIDs and `?item wdt:P31/wdt:P279* wd:Q130003 ; wdt:P131+ ?st` (VALUES ?st = state/province QIDs), OPTIONAL P625/P131/P856/P576. Returned ~60 ski areas with coord + admin + official site in one call. URL-encode `+` as %2B and `*` as %2A.
- The Wikipedia API takes up to 50 titles per call with `&redirects=1`; the redirects array is itself a trap detector (Searchmont Resort -> the community article; same-name items in another province).
- Overpass (overpass-api.de) with a long name regex over a multi-state bbox TIMED OUT at 60s in WebFetch. Keep Overpass queries to one small bbox, or skip.
- Wikidata never says summit vs base vs centroid. Flag rounded points (x.5, two decimals) as too coarse to pin; set coordinateIsSummit only when a source confirms it.
- Official-site guess URLs 404 (snowriver.com/discover-snowriver/our-history); northernontariobusiness.com returns 403.
- WebFetch summaries of the Wikipedia API ROUND coordinates (to 0.001). For full precision, one Wikidata SPARQL fetch with `VALUES ?item { wd:Q.. ... }` + OPTIONAL P625 + P131 returned 23 squares in one call. Use the Wikipedia API only to discover QIDs.
- German/Austrian/Swiss squares often have no enwiki page (Hauptmarkt Nuremberg, Rathausplatz Wien): query de.wikipedia.org's API with German titles. Enwiki/dewiki redirects can land on a parent record (Roncalliplatz -> Cologne Cathedral / "Domumgebung").
- Label SPARQL (`?item rdfs:label "Neumarkt"@de`) returns dozens of same-named squares and sometimes 3 items for one city: always read P131 and never pin when items conflict.
- Event places (markets, festivals): national/city tourism boards read cleanly and list current names/operators (wien.info, zuerich.com, prague.eu, kudyznudy.cz, visitbruges.be). An old organiser's farewell page or a redirected domain is usually an operator change, not a closure: cross-check the tourism board before calling anything closed.
- dresden.de returned 503 on every page (Oct 2026). basel.com returns 403.
- Event venues (tournaments): the governing body uses clean names ("Brisbane Stadium", "Newcastle Stadium") that collide with other records on enwiki (a proposed Olympic stadium; an English venue). Pass sponsor names AND clean names to one Wikipedia API call with `&redirects=1`, then SPARQL the QIDs for P625 + skos:altLabel + P856: the aliases map clean name to sponsor name in one call. Confirm identity by matching the host's match allocation (state stadium authority page) to the governing body's.
- Rebuilt stadiums keep two Wikidata items on one point (old one with P576). Read P1619/P576 before using any status or history.
- Spanish towns: ONE SPARQL with `VALUES ?name { "Tarifa"@es ... }` + `rdfs:label ?name ; wdt:P31 wd:Q2074737` (municipality of Spain) + P772 (INE code) + P131 returned 14 towns, unambiguous, with the INE code as the second identity attribute. Villages (Zahara de los Atunes) are not municipalities: find them via the eswiki API.
- Eclipse runs: NASA GSFC SEpath table (eclipse.gsfc.nasa.gov/SEpath/...Tpath.html) reads cleanly in WebFetch; interpolate the limit latitude at a town's longitude to catch towns just outside the path (Seville, Sanlúcar in 2027). timeanddate.com eclipse pages return 403.
- Event-day traps: compute the event's weekday and check it against the site's closing day (Andalusian archaeological ensembles close Mondays).
- museosdeandalucia.es fails with a TLS certificate error; puertos.es PDFs come back as compressed binary and the local Read tool cannot render PDFs (no pdftoppm). Do not spend calls on either.
- Park SPARQL works without knowing the park QID: `?park rdfs:label "<Park name>"@en . ?item (wdt:P3018|wdt:P361|wdt:P131|wdt:P276) ?park` (Shenandoah: 158 rows, ~80 overlooks, waysides, VCs). Mountains are summits; trailheads have no items. Watch for duplicate items (two Loft Mountain Wayside records; gas station + wayside).
- Name-collision detector, one call: SPARQL `VALUES ?name {...}` + rdfs:label + P625 + `FILTER` on `geof:latitude/geof:longitude` bbox + P131 + P856. Surfaced 3 Lewis Mountains and 2 Montpeliers inside one trip area.
- US addresses: Census geocoder `/geocoder/geographies/onelineaddress?...&benchmark=Public_AR_Current&vintage=Current_Current&format=json` reads cleanly and gives county (second attribute), but the point is interpolated along a TIGER range: flag it, never call it rooftop.
- NPS Shenandoah: planyourvisit/hours.htm is the live season table (updated Sept 2026); conditions.htm was stale since Nov 2024. Recreation.gov `/ticket/facility/<id>` pages read cleanly with alerts. nationalparkstraveler.org returns 403; cbs19news.com returned 429.
- Budget: 12 calls covers about 6 flagged records well. Decide up front which of the 20 places get status checks and record the rest as a `could-not-look` gap naming them.
