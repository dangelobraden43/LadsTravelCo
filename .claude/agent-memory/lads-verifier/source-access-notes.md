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

- **European markets run (2026-10-06):** dresden.de returned 503 on every path all day (whole host);
  prague.eu timed out (504) but kudyznudy.cz (CzechTourism) fetches and lists Prague market dates.
  404s: int.bahn.de/en/faq/deutschlandticket-cost-new, munich-airport.com/by-s-bahn-263075,
  wienmuseum.at/en/visit. aviacionline.com/?p= short links land on the home page, not the article.
- **Fetch cleanly and settle a lot:** aeroroutes.com schedule-filing articles (frequency and date
  ranges per route), salzburg.info ÖBB page (Railjet times), oebb.at Baustelleninformation pages,
  official market sites (christkindlmarkt.at, .co.at, christkindlesmarkt.de/en, koelnerweihnachtsmarkt.com,
  bs.ch, noel-colmar.com practical, plaisirsdhiver.be/en, adventbazilika.hu), oesterreich.gv.at,
  wien.gv.at, praha1.cz, numbeo.com, vienna.at, novinky.cz, travelbook.de, nau.ch, riga.lv, govilnius.lt.
- **Budget planning:** about 175 findings for 72 calls means checking roughly a third. Spend first on
  official date pages (one fetch confirms several findings) and money; scout praise lines are last.

- **Markets pass 2 (2026-10-06):** striezelmarkt.dresden.de is 503 too (whole dresden.de family down).
  403: travel.state.gov country pages, lechotouristique.com. lonelyplanet.com articles return nav only.
  404: mvv-muenchen.de/en/tickets-and-fares/... day-ticket path (search summaries of mvv pages work).
- **PDFs: WebFetch often says "binary, cannot read" but saves the file under tool-results.** Read that
  saved path with the Read tool: it parses the PDF for free (Nuremberg press release, Bund der
  Steuerzahler Bettensteuer table). Saves a call and beats the fetch summary.
- **One listicle read settles many scout lines.** timeout.com/europe/.../best-christmas-markets-in-europe
  fetched in full with ranks and per-entry details; ask for every entry's rank plus specific words.
- **Wikidata P31 settles "which of these duplicates is the square"** (metro station vs tram stop vs
  square) and exposes disambiguation pages posing as place items. Add P31 to every bulk SPARQL.

- **Wikidata coordinates in bulk:** `query.wikidata.org/sparql?format=json&query=` with a
  `VALUES ?item { wd:Q.. }` block and `wdt:P625` returns ~21 exact points per call. Wikipedia API
  `prop=coordinates&titles=A|B|C` gives summit/community points to test whether a pin is a summit.
- **Ski sources (2026-10-06):** epicpass.com and Vail resort ticket pages redirect to
  waitingroom.snow.com (queue). Vail press releases fetch cleanly via the placera.se Cision mirror.
  ikonpass.com/en/shop-passes and /en/reservations fetch (prices, deadline text). indyskipass.com
  home, our-resorts, how-it-works fetch; some resort slugs 404. shop.nubsnob.com fails TLS (home page
  works). snowindustrynews.com 301s to snowsportsnews.com. ontario.ca e-Laws returns an empty shell.
  OnTheSnow resort pages sometimes time out. Resort getting-here and season-pass pages (Boyne,
  Crystal, Wilmot, Highlands, Lutsen, Cascade, bluemountain.ca) fetch cleanly.

Related: [[verification-patterns]]
