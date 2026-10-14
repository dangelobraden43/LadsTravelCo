---
name: entry-source-lessons
description: Which government entry/essentials sources fetch, which block, and how to spend a 12-call budget on entry research
metadata:
  type: reference
---

**Fetch behaviour (learned 2026-10-12):**
- travel.state.gov returns HTTP 403 to WebFetch on BOTH URL shapes (`/content/travel/en/international-travel/International-Travel-Country-Information-Pages/<Country>.html` and the newer `/en/international-travel/travel-advisories/<country>.html`). Do not spend calls fetching it. Use WebSearch with `allowed_domains: ["travel.state.gov", "<cc>.usembassy.gov"]` and mark `access: "snippet"`.
- travel-europe.europa.eu (ETIAS/EES portal) is JavaScript-rendered: fetch returns only a title. Use home-affairs.ec.europa.eu (fetchable, server-rendered) or search snippets.
- gibraltar.gov.gi press releases / technical notices fetch cleanly.
- Australia (learned 2026-10-12): immi.homeaffairs.gov.au AND au.usembassy.gov return 403 to fetch; agriculture.gov.au (biosecurity) times out at 60 s. Embassy subdomains (`<cc>.usembassy.gov`) likely block too: do not fetch, search with allowed_domains and use snippets. Search snippets from homeaffairs.gov.au PDFs (visitor visa reports, ETA app industry guidance) and abf.gov.au manuals carry the ETA rules. Snippets often show stale fee amounts: record fees as a gap unless a current page is read.
- Pattern trap worth checking in any country that shut 3G: handsets that cannot reach the emergency number get refused service on local SIMs (Australia, ACMA rules). Regulator site (acma.gov.au equivalent) is the source.
- CIA World Factbook "travel facts" PDFs surface in search and give plug type, voltage, currency and emergency number per territory in one hit: cheap way to cover the basics.

**Budget lesson:** with 12 calls, a big regime change (a border treaty, ETIAS state) can eat the budget and leave plugs/112/CDC/customs as gaps. Spend the first 2-3 calls on one batched search for the basics (Factbook travel facts + CDC destination page) before chasing the headline change.

**Recurring traps:** State Department pages disagree on Schengen passport validity (3 months beyond departure vs 6 months at entry) — record both, advise 6. ETIAS dates slip; always give a re-check `datedUntil`, never forecast mandatory status. See [[gibraltar-border-regime]].
