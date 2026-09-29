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
