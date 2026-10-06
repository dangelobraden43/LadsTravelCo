---
name: source-access-notes
description: Which sites fetch cleanly, block, or redirect for verification; how to classify common travel sources
metadata:
  type: reference
---

- **403 on WebFetch:** cbc.ca news articles AND cbc.ca/lite, all of vancouver.ca (parks pages too,
  not just news-calendar), plus the contract's known Reddit, Yelp and Tripadvisor blocks. Don't
  spend a verification call on them; use Wikipedia or a press mirror, or mark unverifiable.
- **Dead ends seen:** grousemountain.com/getting-here (404), siegelsbagels.com/visit-us/ (404),
  thetempleton.ca (expired TLS cert). Venue home pages usually give address and hours in one fetch.
- **guide.michelin.com restaurant pages fetch cleanly** and give distinction, edition year, address.
- **theworlds50best.com redirects (301) to the50.com.** Fetch the50.com directly to save a call.
- **vancouvertourism.org is an independent site, NOT Destination Vancouver.** It says so itself.
  Classify it as `aggregator`. The official board is destinationvancouver.com.
- **Fetch cleanly and are authoritative:** translink.ca fares, grousemountain.com (admission,
  Grind FAQ, download ticket), capbridge.com tickets-and-hours (hours and promos, but no prices;
  the shop portal 403s), vanartgallery.bc.ca/visit, moa.ubc.ca/visit, www2.gov.bc.ca PST pages,
  mtseymour.ca, bcparks.ca, dailyhive.com, en.wikipedia.org (gives decimal coordinates).
- **US parks (Pictured Rocks run, 2026-10-06):** nps.gov park pages and news releases fetch cleanly
  and settle most findings (directions, fees, camping, backcountry, hikes, winter-road-closures,
  au-sable, kayak-tours, boat-tour, shuttle-service). Wikidata `wbgetentities` takes up to ~50
  pipe-separated IDs in one call and returns P625 coordinates. Recreation.gov HTML is a JS shell,
  but `recreation.gov/api/ticket/facility/<id>` and `/api/camps/campgrounds/<id>` return data.
  legislature.mi.gov MCL pages, numbeo.com, livingcost.org, bankrate.com press releases,
  mackinacbridge.org, sawyerairport.com, altranbus.com, munising.org, michigan.org events all fetch.
- **travelthemitten.com: expired TLS certificate** (fetch fails). Use the NPS stats page instead.
- **WebFetch refuses long verbatim quotes.** Ask targeted yes/no or "quote the X field" questions;
  a "reproduce the full entry" prompt wastes a call.
- **One official page often settles several findings.** Group findings by the page that settles
  them before spending calls.

Related: [[verification-patterns]]
