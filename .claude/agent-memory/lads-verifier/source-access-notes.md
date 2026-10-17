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

- **Ireland (Dublin fix pass 2026-10-12), fetch cleanly:** stpatricksfestival.ie, giaf.ie, galwayraces.com,
  transportforireland.ie (christmas-services, fares pages), thisisgalway.ie, dublintown.ie, travelextra.ie,
  met.ie climate pages (rainfall gives 1991-2020 normals; the sunshine page has no period), enterprise.gov.ie,
  kpmg.com/ie, seat61.com, racingpost.com, ie.irishnews.com, ECB eurofxref graph pages (min/max/latest).
  irishrail.ie fares-info pages list letter fares as text, but the station-to-letter grid is an image
  (only some pairs are in the text). guinness-storehouse.com shows no prices outside its booking calendar.
  A search for Ireland's current Christmas Day alcohol rule finds nothing later than 2018; try the Irish
  Statute Book directly.

- **US road trips (WV/VA/OH, 2026-10-15):** router.project-osrm.org with `steps=false` returns small JSON and
  reproduces agent drive figures in one call (with `steps=true` the page is 250k chars; ask only for step
  names containing a word). `alternatives=3` may come back as a single route. api.sunrise-sunset.org fetches.
  turnpike.wv.gov/toll-rates gives the class rate but not the exit 48 amount; Wikipedia's WV Turnpike page
  has plaza positions and ramp-toll directions. nps.gov neri/blri/shen/hocu hours, closures and fees pages
  fetch cleanly (neri hours page last updated Oct 2024). ohiodnr.gov Hocking Hills page 404s at the obvious
  URL. Fetch cleanly: wvstateparks.com (address, 24/7, phone; little history), dcr.virginia.gov state parks,
  fs.usda.gov r09 pages, greenbankobservatory.org/visit (its fall Thu-Mon schedule is in the 2023 brochure
  PDF, not the visit page), grandcaverns.com, trans-alleghenylunaticasylum.com (weekly schedule is an image),
  casanueva.com, schmidthaus.com, northmarket.org, jackieos.com (today's hours only), piesandpints.net/
  store-locations, capitolmarket.net, tamarackwv.com, oglebay.com, en.wikivoyage.org town pages.

- **Virginia / Shenandoah (2026-10-15).** Fetch cleanly: nps.gov/shen hours, fees, faqs-oldrag, driving-skyline-drive,
  know-before-you-go, skyline-drive-status, thingstodo pages (trail stats with difficulty); nps.gov/blri roadclosures;
  recreation.gov/api/ticket/facility/<id> (description only, NOT the alert banners, which hold lot/closure notices);
  goshenandoah.com dining, service-updates, events; luraycaverns.com and /faqs; grandcaverns.com/visit; montpelier.org
  visit pages; chilesfamilyorchards.com calendar; gravesmountain.com; virginia.org and visitcharlottesville.org blog
  guides; nelsoncounty.com; monticellowinetrail.com; dwr.virginia.gov WMA pages; USNO aa.usno.navy.mil API; Census
  geocoder; OSRM table (one call, many destinations). Blocked: monticello.org 403 (search snippets of its calendar
  work), rotunda.virginia.edu 403, nationalparkstraveler.org 403, cbs19news 429, highland.org/events/today 404,
  NPS whiteoak-canyon-upper-falls thingstodo slug 404. OpenTable restaurant pages can time out; a search returns
  their hours from mirror domains.
- **PDF fallback confirmed:** the saved PDF path from a failed WebFetch reads fully with Read (no `pages` param);
  the `pages` param needs poppler, which is not installed.
- **Wikidata VALUES with ~75 QIDs** returned every row in one fetch; ask for "every row, one line each".

- **US park + road trip (New River Gorge, 2026-10-15):** developer.nps.gov places API for a park is ~550k
  chars; a fetch reads only the first 100k. Fetch the single nps.gov/places/<slug>.htm page instead.
  Fetch cleanly: nps.gov/neri planyourvisit pages (closures, hours, finding-your-way, fayette-station-road,
  hiking, hunting), home.nps.gov/articles, home.nps.gov/gari whitewater, wvstateparks.com/parks/<park>/trails/
  (one page settles 5-10 trail findings), transportation.wv.gov articles, turnpike.wv.gov/toll-rates,
  aa.usno.navy.mil/api/rstt, waterservices.usgs.gov/nwis/iv, router.project-osrm.org route?steps=true,
  greenbrierwv.com/events/events-all, allevents.in, visitfayettevillewv.com (directory, nightlife, event pages),
  tastingtable.com, wvliving.com, woay.com, wvva.com, digital-release.wvnstv.com, bridgewalk.com, aceraft.com.
  Blocked: herald-dispatch.com (429), outdoorhub.com (307 then 402 tollbit). Budget: 274 findings for 90
  calls meant about 60% checked; group by page (NPS closures page alone settled ~20).

- **Recheck pass (gorge-ridge-drive, 2026-10-15):** mycoffeeexplorer.com fails DNS (EAI_AGAIN) on every path.
  locations.7brew.com pages give address and phone but an EMPTY Hours section (chain hours live in the app).
  roadtrippers.com 301s to maps.roadtrippers.com (fetch that directly). Fetch cleanly: dailycoffeenews.com,
  thepostathens.com (/r/ short links resolve to the article), atmosfy.io, millenniumhwy.net and aaroads.com
  (both carry 2007 page dates; read the date before trusting a road-condition line).

- **Shenandoah recheck (2026-10-15).** iexitapp.com returns 403 (search Yellow Pages/Restaurantji/MenuPix snippets
  instead); spelunkers-custard.com fails TLS; earlymountain.com/visit/ 404s. Fetch cleanly: shenandoahcaverns.com,
  skylinecaverns.com, endlesscaverns.com (season dates), magpiediner.com, monticellowinetrail.com/<x>-info (hours, food,
  dogs) and /members, hallowedground.org site pages, americanweekender.substack.com, warrennolan.com schedules,
  en.wikipedia.org town pages. Toast (toasttab.com/local/...) ordering pages give small-restaurant weekly hours via search.
  Budget: 43 findings for 45 searches was enough to give every one a real verdict.

- **Gaps pass (2026-10-15):** onlyinyourstate.com returns 403 on fetch (search snippets still show its editor's
  notes). bunsrestaurant.com fails TLS (cert for another domain). tonypackos.com/locations is 404; the home page
  lists every location's hours. ellensicecream.com 301s to ellenshomemadeicecream.com. Fetch cleanly:
  digital-release.wboy.com (shows posted date), woay.com, wtap.com, visitdelohio.com, wvtourism.com/company/<slug>,
  secretsandwichsociety.com, piesandpints.net/store-locations, glenferrisinn.com. NPS compendium PDFs read fully
  via the saved-PDF Read fallback.

- **Ryder Cup / Ireland events (2026-10-16).** Fetch cleanly: rydercup.com attend pages (transport, ticket-information,
  accommodation, authorised-packages, schedule-of-the-week, 2027-experiences) and news-media articles;
  officialrydercupcampsite.com (+/faqs); rydercuptravelservices.com/en/faq-ryder-cup-hotels; limerick.ie/node/<id>;
  irishtimes.com, irishexaminer.com, limerickpost.ie, balls.ie, farmersjournal.ie, irishgolfdesk.com, golfmagic.com;
  club pages (ballybuniongolfclub.com/visitors, lahinchgolf.com green-fees); aeroroutes.com; snnairportgroup.ie; cbp.gov
  preclearance; buseireann.ie routes; about.leapcard.ie; enterprise.gov.ie; heritageireland.ie; met.ie tables;
  Wikidata wbgetentities API; USNO API. Old Head policy PDF reads via the saved-PDF fallback.
  Fail: dublinairport.com national-bus-routes (404), irishrail.ie tourist-tickets accordion (empty), eflow.ie (503;
  use tii.ie toll notices), ndls.ie (403; rsa.ie via search), travelextra.ie article timed out once, limerickleader 403.
  Budget: 168 findings for 90 calls let ~80% get a real verdict by grouping on the official pages.

- **Top-up pass (Ryder Cup, 2026-10-17).** WebSearch has a SESSION-WIDE cap (200, shared by every agent in the
  session); a top-up run right after a big run hit it at call ~37. WebFetch kept working. Do fetches of cited pages
  first and save searches for replacements. Blocked: fodors.com and cdn.fodors.com 403, tipperarylive.ie 403,
  viator.com tour pages 403, expedia.com 429, united.com route page timed out, travelextra.ie timed out twice,
  rydercup.com 2016 news page 404, hostelworld.com/blog/?p= short links 404 (slug pages such as
  /blog/best-hostels-in-galway/ work), golfmonthly.com /all/ pages return a membership shell. Fetch cleanly:
  kayak.com/flight-routes/... (typical range, 12-month average, cheapest month), corkairport.com news releases,
  irishrail.ie how-to pages, dublinairport.com preclearance and security FAQs, bustimes.org rail and bus pages,
  nationaltransport.ie news, clarechampion.ie (shows date), golfbreaks.com tours, greatblasketisland.net.

- **Co. Clare (2026-10-17).** Fetch cleanly: cliffsofmoher.ie book-online (2027 rates, hours, time bands), coastal-walk
  and getting-here pages; doolinferry.com and /aran-islands-ferry-sailing-times/ (doolinferry.getanchor.io returns
  530); doolincave.ie home (hours not readable; /opening-times/ 404); aillweeburrenexperience.ie; lahinchsurfschool.com
  and /surf-lessons/; nationalparks.ie/burren/ (burrennationalpark.ie 301s there); bunrattycastle.ie; loveloophead.com
  (loophead.ie 301s); matchmakerireland.com/info/faq; discoverireland.ie; clare.fm news; clarechampion.ie (dates shown);
  vaughans.ie (Liscannor), vaughanspub.ie (Kilfenora), gusoconnorsdoolin.com, mcdermott-s-pub.com, homesteadcottage.com;
  guide.michelin.com; theirishroadtrip.com guides (show "Last Updated"); en.wikivoyage.org Clare towns. Fail: burren.ie
  403, afloat.ie 403, comhaltas.ie event pages 410, mcgannspubdoolin.com refused, roadsidetavern.ie empty,
  burrenbrewery.com no DNS. With WebSearch exhausted, 49 fetches gave all 52 findings a real verdict.

- **Kerry (2026-10-17, WebSearch pool exhausted, fetch only).** Fetch cleanly: heritageireland.ie (Ross Castle, Sceilg
  Mhichil with permit-holder list, Blasket Centre), nationalparks.ie/killarney (killarneynationalpark.ie 301s here; posts
  closure notices), muckross-house.ie/plan-your-visit (fee table), derostours.com, gapofdunloetours.com, paddywagontours.com,
  kerrymuseum.ie, discoverireland.ie listing and car-free guide pages, ireland.com guides (show update date),
  dingle-peninsula.ie, listowel.ie bar listings, theirishroadtrip.com (shows updated date), roseoftralee.ie, air.ie,
  balls.ie, bustimes.org 14/272, skelligislands.com (2026 page despite "-old" slug), sportcal.com, advanced-television.com,
  irishexaminer.com, killarneyadvertiser.ie (its ?s= search works, relative dates only), roadtrips.com, mcmunns.com,
  arbutuskillarney.com, traleebaywetlands.org, outoftheblue.ie, killarneybikerental.rezgo.com.
  Fail: dishcult.com 403, canbe.tourdesk.ie 403, citizensinformation.ie 403, kerrycliffs.ie and .com DNS, kirbysbrogueinn.com
  DNS, discoverireland.ie/kerry/sean-og-s 404. Budget: 81 findings for 49 fetches gave 72 a real verdict.

- **When WebSearch is exhausted, Google News RSS works through WebFetch** (Dublin bookend, 2026-10-17):
  `https://news.google.com/rss/search?q=<terms>&hl=en-IE&gl=IE&ceid=IE:en` (add `when:1y` to the query to limit by date)
  returns about 40-50 dated headlines per call. It settled brand status (a closure, an old sale, current trading) in one call each.
  403s: museum.ie (all paths), citizensinformation.ie (licensing pages). brazenhead.com news page carries no session
  times. Fetch cleanly: tcd.ie old-library FAQ, visittrinity.ie blog, culturenight.ie, avivastadium.ie/events (first page),
  TFI event pages, hoganstand.com, rugby.com.au news, copperfacejacks.ie (hours), bustimes.org stops, theislandgolfclub.com,
  theroyaldublingolfclub.com, portmarnockgolfclub.ie, hotelscombined.co.uk, bisnow.com, sdcc.ie, enterprise.gov.ie, ogier.com.

- **Limerick city pass (2026-10-17, fetch only).** Fetch cleanly: kingjohnscastle.ie, thomondpark.ie/museum-tours,
  heritageireland.ie place pages, flyingboatmuseum.com/plan-your-visit, loughgur.com/faq, cliffsofmoher.ie opening-hours
  and book-online (slot prices, peak hours), bunrattycastle.ie/plan-your-visit, paddywagontours.com tour pages,
  milkmarketlimerick.ie, dolans.ie, courts.ie licence guide, irishtimes.com (non-paywalled), ul.ie, clare.fm,
  adarevillage.com (Limerick Leader mirrors), limerick.ie listing and node pages, discoverireland.ie, wanderlog.com,
  guide.michelin.com/en/limerick/adare/restaurant/the-oak-room. Fail: huntmuseum.com 403 (theirishroadtrip.com has
  hours and fees), travelextra.ie timed out again (third run), limerick.ie/greenway news 403, limerickraces.ie fixtures
  are an image only, a guessed Michelin slug 404s. limerick.ie listings are undated (footer copyright only).

- **Transit pass (Ryder Cup, 2026-10-17, WebSearch pool exhausted, fetch only).** 403: citizensinformation.ie (all
  paths), gov.ie publications pages, irishstatutebook.ie. irishimmigration.ie travel-path page returns title only.
  404: about.leapcard.ie/tfi-young-adult-card. Fetch cleanly: bustimes.org (bus pages pair times; rail pages flatten),
  irishrail.ie fares-info and students pages, rydercup.com attend pages, TFI event/news/fares/taxi pages, NTA
  consultations, irishexaminer arid- articles (show date), irishtimes business, numbeo city pages, ECB graph, revenue.ie
  customs and VAT-rate pages, gov.uk/eta and news, home-affairs.ec.europa.eu news, CDC traveler pages, comreg.ie news,
  esbnetworks.ie, garda.ie Crimecall pages, Chase and Capital One card pages, dealspoints.com, awardtravelfinder.com,
  aircanada.com Aeroplan news, hilton.com/en/locations, snnairportgroup.ie, interrail.com, timeout.com, dublinexpress.ie.
  Budget: 109 findings for 70 fetches gave ~85% a real verdict by grouping on bustimes, Numbeo and issuer pages.

Related: [[verification-patterns]]
