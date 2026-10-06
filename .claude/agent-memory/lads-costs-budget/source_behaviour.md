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

Ski runs (Midwest skiing, 2026-10-06):
- OnTheSnow (and sister site skiinfo.fr, same publisher) heads ticket tables with the NEXT season label while the figures say "last updated" the previous autumn and quote December sample dates. Treat them as last-season and never as corroboration of each other. State tables (`onthesnow.com/<state>/lift-tickets`) fetch fine and give a weekday spread in one call.
- Resort ticket pages that print real tables: lutsen.com/lift-tickets (booking-window x tier grid), cascademountain.com/lift-tickets (tickets + rentals), bluemountain.ca winter-lift-tickets ("from" prices, pre-fee/HST). Boyne and Crystal pages print no prices (shop portal). snowstash.com gives dynamic low/peak ranges and fetches.
- epicpass.com and Vail resort pages redirect to waitingroom.snow.com; do not spend calls there. Use OnTheSnow's dated Epic/Ikon buyer's guides plus a press article; retailer pages (peterglenn.com) carry current Ikon prices.
- Numbeo URL forms that worked: `Traverse-City-MI-United-States`, `Collingwood-Canada` (the latter has 2 contributors and junk values; reject). livingcost.org guessed paths 404.
- Resort "cashless" and service-charge policies live on a `/cashless-resort` or `/cashless-payments` page; one search surfaced several.
