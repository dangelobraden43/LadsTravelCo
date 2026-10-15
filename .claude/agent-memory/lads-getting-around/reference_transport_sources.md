---
name: reference-transport-sources
description: Which transport sources fetch cleanly vs waste calls (NPS directions pages, small-airport sites, transit authority pages, toll authorities) for the getting-around lane
metadata:
  type: reference
---

Durable source lessons for the getting-around lane (first learned on Pictured Rocks, 2026-10-06).

- **NPS `planyourvisit/directions.htm` pages** name airport cities and highways but usually give NO distances or drive times. Budget a second source (local visitors bureau "Getting Here" page) for airport mileage.
- **NPS `planyourvisit/shuttle-service.htm`** lists shuttle providers and reservation rules but defers times and fares to the operator. Fetch the operator/transit authority page directly; county transit pages (e.g. altranbus.com) fetch cleanly with times and fares.
- **Small regional airport home pages often render as navigation only.** Skip the home page; fetch the `/airlines/` subpage directly. Airline lists on visitors-bureau pages lag new routes; the airport's own page wins.
- **Toll authority URLs are guessable but unreliable** (mackinacbridge.org toll-schedule path 404'd). Use a site-scoped WebSearch (`allowed_domains`) to surface the authority's own news releases instead; snippets from the authority are usable as `government`.
- **Ferry operators to small islands** rarely surface in search; results drift to Recreation.gov and spam. Fetch the operator's own site if the name is known.
- **Resort "Getting Here" pages list drive times from several origin cities at once** (crystalmountain.com, wilmotmountain.com). For multi-origin drive-time jobs, fetch these directly instead of searching per route: search summaries merge snippets from several pages and the per-figure attribution is lost (midwest-skiing, 2026-10-06).
- **michigan.gov/mdot pages can 403 on fetch** (Blue Water Bridge border-documents page). For border documents, a WebSearch with `allowed_domains` cbp.gov + canada.ca gives two government snippets in one call.
- **mackinacbridge.org `/ufaqs/` pages** carry the wind-closure thresholds; a site-scoped search surfaces them with MDOT's wind FAQ as the second source.
- Count WebFetch calls against the budget as well as WebSearch, and report the total as `callsUsed`.
- **seat61.com pages are 300k+ chars; WebFetch reads only the first 100k** and misses most routes. A `allowed_domains: ["seat61.com"]` WebSearch naming several city pairs returns usable journey-time snippets for one call. But seat61 is ONE host: researched-mode routes still need a second domain (operator site or another guide). (Learned 2026-10-06, Christmas markets.)
- **Check the airport operator's own home page for construction notices before trusting any transfer guide.** Vienna's S-Bahn trunk closure (Sept 2026 to Oct 2027) turned the CAT into a bus and cut the S7 short; every 2026 aggregator guide still described the old trains. Search the rail operator's "Baustelleninformation"/works pages in the local language.
- Airport-transfer search results are dominated by aggregator blogs (thebettervacation, nomadepicureans); add the transit authority domain via `allowed_domains` to get an official fare instead.
- The validator scans `notes` for point prices too: describe the ends of a range in words in notes, never "EUR x" alone (unless `fixedPrice` with an official source).

- **Spain (eclipse-2027-spain, 2026-10-12):** DGT `comunicacion/noticias` pages are prose with no figures; the numbers live in the DGT `notas-de-prensa` and lamoncloa.gob.es Interior notes. Fetch those, not the noticia. Rail works and bus replacements show up in Adif TCR PDFs (atlantic-corridor.eu, "tcr-rfc4-adif_update") and regional press; check them before trusting any seat61 through-train route (Algeciras line was bus-replaced in 2026).
- Spanish place names that collide with foreign ones (Bolonia = Bologna, Bol) poison searches; always add the municipality ("Bolonia Tarifa") and the ayuntamiento.
- US driving-permit rules: one `allowed_domains: ["travel.state.gov"]` search gives the country advisory's IDP line; pair with a press second source.
- Ferry brand drift: FRS Strait routes are now DFDS; DFDS left Tarifa-Tangier in May 2025. Check the operator's own route page for exits.
- Plan the 12 calls up front: ~3 for official plans/precedent, ~3 rail/bus, 1 ferry, 1 border, 1 airport transfer, 1 driving, leaving 2 spare. Vague multi-route searches ("Madrid Cadiz, Seville Cadiz, Madrid Malaga") return one leg only.

- **Road-trip drive times (gorge-ridge-drive, 2026-10-14):** Google Maps is not fetchable. The public OSRM demo (`router.project-osrm.org/route/v1/driving/lon,lat;lon,lat?overview=false&steps=false`) fetches cleanly and gives per-leg metres/seconds; force a toll-free corridor with waypoints. Its hours read ~25% HIGH vs Google (13.1 h vs ~10-10.5 h for the same trip), so state ranges, not its figure. Leg `summary` is empty unless `steps=true`, and `steps=true` on routes over ~300 km truncates past 100k chars: use steps only on short routes or to check one leg's road refs. `alternatives=3` works for two-point queries only.
- Daylight: timeanddate.com returns 403; `api.sunrise-sunset.org/json?lat=..&lng=..&date=..&formatted=0` works (UTC).
- Toll avoidance: barrier-toll roads (WV Turnpike) can be stepped around plaza by plaza on parallel county roads; ramp/side tolls (WV exit 48) catch "toll-free" approaches. Wikipedia's turnpike article gives plaza positions between exits; millenniumhwy.net / aaroads describe bypasses. Historic "X & Y Turnpike" road names in OSM are not tolls.

- **WebSearch is a SESSION-WIDE pool (200) shared by every agent.** In a wide run (11 agents x 12) a late-wave agent can find it empty (rugby-world-cup-2027, 2026-10-14). Have a fetch-only fallback list of known URLs ready; fetch-only output ends up single-source, so record items as fact/trap and log route/range as gaps.
- **Fetch failures seen:** travel.state.gov country pages 403; nsw.gov.au ".../visiting-or-moving-to-nsw/visiting-nsw" 404; en.wikipedia "SkyBus_Super_Shuttle" 404. Wikipedia airport articles put Ground transport AFTER 100k chars: fetch with `offset: 100000` straight away.
- **Wikipedia transit pages that read well:** Opal_card (contactless history, airport access fee and cap tables), Myki (2026 contactless rollout), Airport_line,_Perth, Airport_railway_line,_Brisbane. Useful for structure, but aggregator only: pair with the operator site for anything actionable.
- Australia pattern: airport rail links are often privately owned with fees outside the state fare scheme (Sydney station access fee, Brisbane Airtrain). Always check for this trap.

- **Drive-time matrices without Google (shenandoah, 2026-10-14):** two keyless OSM routers fetch cleanly, ONE call each for a whole origin-to-many matrix. OSRM: `router.project-osrm.org/table/v1/driving/{lon,lat;lon,lat...}?sources=0&annotations=duration,distance` (lon first; metres/seconds). Valhalla: `valhalla1.openstreetmap.de/sources_to_targets?json={"sources":[{"lat":..,"lon":..}],"targets":[...],"costing":"auto","costing_options":{"auto":{"use_tolls":0}},"units":"miles"}` (also proves toll-free). OSRM `/route/v1/...?steps=true&alternatives=true` gives road-by-road sequences. Valhalla runs ~10-20% faster than OSRM; distances agree. Both share OSM data: say so in notes, add an official directions page or milepost arithmetic as the third leg. Watch endpoint snapping (Valhalla once routed Skyland around the outside of the park).
- NPS `skyline-drive-status`-style status pages can be a year stale while saying "open"; the alerts text line is the live source. NPS `places/<name>.htm` pages carry turn-by-turn trailhead directions and GPS names.

- OSRM extras (new-river-gorge, 2026-10-14): `exclude=toll` returns HTTP 400 on the demo server (use Valhalla `use_tolls:0` instead). Multi-leg `steps=true` truncates past ~3 legs. Step refs show only the first way's ref, so an I-64/I-77 concurrency hides inside an "I 64" step: infer from step length. NPS `planyourvisit/finding-your-way-around-the-park.htm` (neri) gives road names and miles-from-exit for each area: a good second source for park legs.
- WV: `transportation.wv.gov/article/...` press releases fetch cleanly with exact ramp closures and detour times; `turnpike.wv.gov/toll-rates` names plazas but no mileposts. Search the state DOT for "<exit> 2026 traffic pattern" before trusting any route: a closed exit ramp near the base changed every return leg.
- nps.gov-scoped searches for cell service or gas return planning documents, not visitor info; NPS rarely publishes either. Spend those calls elsewhere and record gaps.

See [[feedback-lane-overlap]] if written later: closures and winter roads are often already covered by provenance and timing agents; reference their ids rather than re-spending calls.
