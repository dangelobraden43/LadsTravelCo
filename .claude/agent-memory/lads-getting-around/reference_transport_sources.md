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
- Count WebFetch calls against the budget as well as WebSearch, and report the total as `callsUsed`.

See [[feedback-lane-overlap]] if written later: closures and winter roads are often already covered by provenance and timing agents; reference their ids rather than re-spending calls.
