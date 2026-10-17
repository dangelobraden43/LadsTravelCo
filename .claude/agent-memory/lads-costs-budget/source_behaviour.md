---
name: source-behaviour-costs
description: Which price and tax sources fetch cleanly for a costs run, which fail, and how to spend the WebSearch budget
metadata:
  type: reference
---

Learned on Vancouver (2026-09-29) and Pictured Rocks (2026-10-06). Re-verify, sources change.

- WebFetch on official pages is not counted against the WebSearch budget in practice, so fetch official pages directly and use searches to discover URLs. Guessed deep URLs on gov.bc.ca and translink.ca often 404; search first to get the real path (gov.bc.ca uses `/pst/publications/<topic>`).
- Fetched fine: tourism-board guides (vancouvertourism.org), museum sites, ticketing pages for Grouse Mountain, gov.bc.ca publication pages, dailyhive.com, nps.gov park pages, legislature.mi.gov statute pages (`/Laws/MCL?objectName=mcl-205-52` style), concessioner fare pages, local TV news (wxyz.com, wlns.com).
- Failed: shop/ticket portals (403), vancouverisawesome.com (403), gov PDFs (compressed text, unreadable), attraction info pages that hide the price behind a portal (Capilano), michigan.gov Treasury (403), pos.toasttab.com (403), Square ordering sites (empty).
- Small-town restaurant sites rarely publish prices (menus are PDFs or absent). For small gateway towns, use the nearest city on Numbeo + livingcost.org as two independent crowdsourced sources, label it a proxy, confidence low. Numbeo URL form that worked: `/cost-of-living/in/Marquette` (not `Marquette-MI`); it reports contributor count, record it.
- The search tool returns an LLM summary, not per-figure attribution. Snippet-only price ranges must be marked `access: snippet`, confidence low, and the note must say attribution is unclear.
- Budget-guide totals almost always include lodging; a per-day figure excluding lodging usually has to be summed from component prices and marked low confidence.
- Validator scans `notes` for point prices too: write derived-budget arithmetic with ranges only ("2 x USD 16-20 = USD 32-40"), never a lone amount.
- A derivedFrom budget can only cite findings in this file: if another agent owns the entrance fee, restate it as your own fixedPrice finding so the tier can reference it.
- Coffee and other small items tend to have only one source; plan the second-source search early or record a gap.
- Fares and attraction prices reset each July 1 (transit) or each season; guides written before then show old figures. Check for both old and new figures.
- Two same-domain pages do not count as two independent sources for the validator.

Learned on European Christmas Markets (2026-10-06):
- Gov PDFs that WebFetch calls "unreadable binary" ARE readable: WebFetch saves the PDF to tool-results, then the Read tool on that path (no `pages` param for short files) returns the text. Worked for nuernberg.de press releases and the steuerzahler.de Kommunaldatenbank.
- Bund der Steuerzahler `Kommunaldatenbank/<year>/Bettensteuer/Anhang_-_Bettensteuer.pdf` lists every German city bed tax and rate in one table. wien.gv.at `/amtshelfer/finanzielles/rechnungswesen/abgaben/ortstaxe.html` fetches with dated rates. praha1.cz `/potrebuji-si-vyridit/odbory/poplatek-z-pobytu/` fetches.
- Christmas-market drink prices: local press runs a yearly price survey (vienna.at "Punsch-Test", seznamzpravy.cz, novinky.cz, web.de, lecker.de). Search in the local language ("Glühwein Preis <year> Tassenpfand", "svařák cena"). Surveys appear in Nov-Dec, so an October run only finds last season.
- Numbeo `/cost-of-living/in/<City>` fetches for Munich, Vienna, Prague. livingcost.org works as `/cost/austria/vienna`, `/cost/czech-republic/prague`, but Germany 404s or returns a summary without restaurant items, leaving German cities with one source. expatistan, falstaff.com, postoffice.co.uk, tn.nova.cz return 403. wienerlinien.at/tickets shows no prices; dpp.cz/en/fares/fares-in-prague 404s.
- Multi-country scopes do not fit 12 searches: pick two or three anchor cities for budget tiers and record the rest as gaps early.

Ireland framework fix pass (Dublin/Galway, 2026-10-12):
- Fetch OK: numbeo Dublin + Galway (ranges + contributor counts), livingcost.org/cost/ireland/dublin (USD points only), transportforireland.ie/fares/leap-card/tfi-90-minute-fare/ (fare + daily/weekly caps), seat61.com/Ireland.htm, KPMG Ireland VAT notes, enterprise.gov.ie news pages, travelextra.ie (STR hotel data), go-to-ireland.com event budget guides (publish per-day ex-hotel tiers), hostelworld city pages, kayak.com/flight-routes/<ORD>/<DUB> pages, ratepunk route pages, ECB USD reference-rate page (use it whenever a costModel is in another currency).
- Fail: citizensinformation.ie, irishstatutebook.ie, budgetyourtrip.com, traveldailynews.com (all 403); heritageireland.ie guessed path and guinness-storehouse.com/en/tickets (404); cliffsofmoher.ie prices sit behind the booking portal; irishrail.ie fare grids are images, so the station column is unreadable.
- Recheck passes: when an existing row label carries an amount ("Pub Spend (~EUR 60/day)"), quoting it in notes trips the point-price check. Cite the label without the parenthetical, and give old point values only as converted spans ("EUR 385-402").

Spain / Gibraltar (eclipse 2027 run, 2026-10-12):
- Numbeo Spain: `/in/Malaga` works; `/in/Cadiz` and `/in/Seville` fail (ambiguous or not found). Use `/in/Cadiz-Spain`; for Seville try `Sevilla`. livingcost.org `/cost/spain/<city>` works for malaga and cadiz (USD points only, so it corroborates, never sets, a range).
- Official ticket pages that fetch: alcazabaygibralfaro.malaga.eu `/fr/visites/horaires-et-tarifs/`; museopicassomalaga.org `/en/visita` (resellers like taquilla.com show different prices; official wins); visitgibraltar.gi `/see-and-do/gibraltar-nature-reserve-upper-rock` (Gibraltar tourist board, gives the reserve fee). Guessed visitgibraltar paths 404: fetch the homepage to get links. gibraltarnaturereserve.gi does not resolve; naturereserve.gi homepage has no prices. emtmalaga.es refuses connections.
- Spanish consumer rules on bills (IVA included, no cover charge, bread and terrace surcharge) are cleanly stated in ocu.org press releases (`/organizacion/prensa/notas-de-prensa/<year>/...`), which fetch.
- ATM/DCC: card-company money guides (you.co, spainhandbook.com) fetch and give dated fee ranges, but contradict each other on specific banks; do not name a bank as cheap.
- An eclipse or one-off event: last event's market (glasses, sell-outs) is reported in local press the week before; search in Spanish.
- Without a Bash tool the validator cannot be run; re-scan claims and notes by hand for any lone currency amount (e.g. "the current fare is EUR x").

Australia (Rugby World Cup 2027 run, 2026-10-14):
- WebSearch is a SESSION-WIDE pool shared by every agent (cap 200). On a big parallel run it can be empty before your first search. Plan fetch-first from known URLs; do not count on any searches.
- Fetch OK: numbeo `/in/Sydney`, `/in/Brisbane`, `/in/Perth`, `/in/Melbourne` (all AU, AUD ranges + contributor counts); transportnsw.info `/tickets-fares/fares` and `/tickets-fares/fares/adult-opal-fares` (caps; fare tables collapsed); translink.com.au `/tickets-and-fares/fares-and-zones`; transperth.wa.gov.au `/tickets-fares/fares`; rba.gov.au review pages + `/conclusions-paper/faqs/` (surcharge rules); australia.com `/en/facts-and-planning/about-australia/key-facts-about-australia.html` (tipping, GST, cards) and `.../australia-on-budget.html` (stale 2025 figures); nomadicmatt.com country guides (budgets INCLUDE lodging, component ranges usable); sydneyoperahouse.com `/tours/<slug>` (prints prices incl. next year's rise); australian.museum `/visit/`, artgallery.nsw.gov.au `/visit/`; Wikipedia transit-card pages (Opal_card, Myki, Translink_(Queensland)) carry fare tables with effective dates.
- Fail: abf.gov.au (TRS), accc.gov.au, moneysmart.gov.au, transport.vic.gov.au (ptv redirects there), bridgeclimb.com (all 403); taronga.org.au prices sit in a ticketsales portal; livingcost.org AU shows USD by default.
- Wikipedia "Surcharge (payment systems)" pointed to the RBA source when search was down: follow a Wikipedia citation to the official page rather than guessing official URLs.

Ski runs (Midwest skiing, 2026-10-06):
- OnTheSnow (and sister site skiinfo.fr, same publisher) heads ticket tables with the NEXT season label while the figures say "last updated" the previous autumn and quote December sample dates. Treat them as last-season and never as corroboration of each other. State tables (`onthesnow.com/<state>/lift-tickets`) fetch fine and give a weekday spread in one call.
- Resort ticket pages that print real tables: lutsen.com/lift-tickets (booking-window x tier grid), cascademountain.com/lift-tickets (tickets + rentals), bluemountain.ca winter-lift-tickets ("from" prices, pre-fee/HST). Boyne and Crystal pages print no prices (shop portal). snowstash.com gives dynamic low/peak ranges and fetches.
- epicpass.com and Vail resort pages redirect to waitingroom.snow.com; do not spend calls there. Use OnTheSnow's dated Epic/Ikon buyer's guides plus a press article; retailer pages (peterglenn.com) carry current Ikon prices.
- Numbeo URL forms that worked: `Traverse-City-MI-United-States`, `Collingwood-Canada` (the latter has 2 contributors and junk values; reject). livingcost.org guessed paths 404.
- Resort "cashless" and service-charge policies live on a `/cashless-resort` or `/cashless-payments` page; one search surfaced several.
