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

See [[feedback-lane-overlap]] if written later: closures and winter roads are often already covered by provenance and timing agents; reference their ids rather than re-spending calls.
