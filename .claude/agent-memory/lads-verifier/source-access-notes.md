---
name: source-access-notes
description: Which sites fetch cleanly, block, or redirect for verification; how to classify common travel sources
metadata:
  type: reference
---

- **403 on WebFetch:** cbc.ca news articles, vancouver.ca news-calendar pages (plus the contract's
  known Reddit, Yelp and Tripadvisor blocks). Don't spend a verification call on them; use a
  press mirror, or mark unverifiable.
- **theworlds50best.com redirects (301) to the50.com.** Fetch the50.com directly to save a call.
- **vancouvertourism.org is an independent site, NOT Destination Vancouver.** It says so itself.
  Classify it as `aggregator`. The official board is destinationvancouver.com.
- **Fetch cleanly and are authoritative:** translink.ca fares, grousemountain.com (admission,
  Grind FAQ, download ticket), capbridge.com tickets-and-hours (hours and promos, but no prices;
  the shop portal 403s), vanartgallery.bc.ca/visit, moa.ubc.ca/visit, www2.gov.bc.ca PST pages,
  mtseymour.ca, bcparks.ca, dailyhive.com, en.wikipedia.org (gives decimal coordinates).
- **One official page often settles several findings.** Group findings by the page that settles
  them before spending calls.

Related: [[verification-patterns]]
