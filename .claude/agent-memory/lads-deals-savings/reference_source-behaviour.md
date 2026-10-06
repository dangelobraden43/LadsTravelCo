---
name: source-behaviour-deals
description: Which deal and admission sources fetch cleanly, which block, and how call budgets got spent on the Vancouver pilot
metadata:
  type: reference
---

- Official attraction pages (capbridge.com, grousemountain.com, vanmaritime.com) fetch fine. grousemountain.com/general-admission-membership itemises prices and the resident tier; capbridge.com/tickets-and-hours does not itemise prices (only discounts and dates).
- Viator listing pages and shop.capbridge.com return 403; a museum's own admission page can also fail (vancouverartgallery.ca "Socket is closed"). Snippet only, mark access snippet.
- Go City had no Vancouver product page in two searches; do not spend a third.
- Budget counting: count fetches plus searches against the ceiling. 12 went fast (6 searches, 6 fetches). Spend fetches on official pages first; happy hours and tourism-board promos need their own calls, so reserve 3 for them.
- Contract trap: a promo with one source cannot be kind promo in researched mode (needs two independent sites). Record as fact with the end date and say why in notes.
- Money in claims: only official fixed prices may carry a single amount (set fixedPrice true). Aggregator pass prices are omitted from the claim.
- Rail passes (Oct 2026): eurail.com now 301s to interrail.com/en-int (brand merger 24 Sept 2026). interrail.com pass pages do NOT render prices on fetch (country/currency picker), so official pass prices need a different route; do not spend a second fetch there.
- wienerlinien.at/tickets lists ticket types but no prices (prices are in the WienMobil shop). viennacitycard.at/en/vienna-city-card/ fetches cleanly with full official prices.
- strasbourg.eu/web/musees/tarifs-musees-de-strasbourg fetches cleanly (prices, pass, exempt groups) but the fetch summary dropped the first-Sunday rule that the search snippet showed; ask for it explicitly in the prompt.
- Ski runs (Oct 2026): unofficialnetworks.com returns 403 on fetch (snippets only), but its "pass deadlines in the next 10 days" roundups carry Epic/Ikon step dates. highlandsharborsprings.com/season-passes fetches with Boyne pass prices AND the price-step date; boynemountain.com pages hide prices. crystalmountain.com (Michigan) /season-passes gives deadlines and tiers but no prices. nubsnob.com rate-sheet 404s; shop.nubsnob.com gives snippets only.
- Ski Tivoli trap: ikonpass.com "Crystal Mountain" local passes are Washington; search summaries pin them on Michigan.
- Northern Express (northernexpress.com) runs a yearly "Up North staycation deals" stay-and-ski roundup (published late January), good for the pattern, always last season by autumn.
- Resort deadlines usually come only from the resort's own site, so in researched mode they end up kind fact with datedUntil, not promo. derivedFrom cannot point at another agent's file: put break-even arithmetic in notes, citing the costs-xxx ids.
- Multi-city runs: 12 calls cover roughly 3-4 cities. Pick the cities where a pass or no-charge day actually changes the plan, and gap the rest honestly.
