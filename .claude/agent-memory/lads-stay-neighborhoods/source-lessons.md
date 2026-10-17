---
name: stay-source-lessons
description: Durable source lessons for lodging/neighbourhood research - which pages give distances, why snippets cannot give price ranges, STR article dating traps
metadata:
  type: reference
---

- **Resort "off-site lodging" pages are the best single source for slopeside-vs-town layout.** They list partner lodging with the resort's own distance figures (Lutsen's did; read in one fetch). Fetch these before searching.
- **Aggregator snippets (Expedia, Hotels.com, Travelocity) only show single "from" prices.** They cannot become a `range` and the validator rejects point prices. Budget calls for resort lodging pages or a tourism bureau rate page if price tiers are required; otherwise record `lodging-price-ranges` as a gap early rather than burning calls.
- **Local-press STR articles are often years old.** A search for "2026 rules" returned a 2018 Northern Express piece and a 2020 Traverse Ticker piece. Always state the article date and whether final adoption was confirmed; the city code itself is the source to read next time.
- **Tourism-bureau pages lag renames** (Petoskey bureau still said Boyne Highlands in 2026). Cross-check names against lads-provenance before using them.
- **Ontario towns publish STR licensing by-laws on municipal sites** (thebluemountains.ca, collingwood.ca); pair with local press (collingwoodtoday.ca) for the two-host rule.
- **Spain: INE's API gives hotel ADR for every tourist point in ONE fetch.** `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/46298?nult=2` returns the last two months per town (government source, read). Each town's two months make an honest range. It is an all-category average (no tiers) and a normal-season floor, never an event-week price. Small towns (Conil, Vejer) are not tourist points. Other countries' statistics offices may have the same shape; look for it before searching aggregators.
- **Small-town "where to stay" searches (Tarifa) return one booking-site guide cloned across 10 languages.** Near-zero value; spend the call on the town's tourist office page instead.
- **Event "how fast beds fill" evidence = CoStar/STR press releases** (they publish match-night occupancy and ADR % change per host city for big events). costar.com returns 403 on fetch; str.com and hospitalitynet.org re-posts show in snippets. Next time fetch the hospitalitynet re-post to upgrade to `read`. Their ADR figures are single citywide averages, so they cannot become a tier range. Percent changes can go in claims.
- **Comparable events in a winter low season overstate % jumps** for a spring/summer event; say so as a trap.
- **Regional-city bed shortages show up in local press plus the regional tourism body's news archive** (e.g. a tourism body brokering rate ceilings and minimum-stay warnings for a concert). Search "<city> accommodation booked out <past event>".
- **"Hotels near <stadium>" searches return only aggregator listings.** The city tourism board's own stadium page (pre/post-game guide) lists nearby streets with walk times; search for that page by name instead.
- **Australian STR rules:** NSW = Planning Portal STRA register + 180-night Greater Sydney cap; WA = mandatory register (all sources are *.wa.gov.au, one publisher, so add a press source if it must be a `requirement`); Victoria = SRO short stay levy. Queensland/SA not yet checked.
- **Ireland:** STR register rules = enterprise.gov.ie short-term-letting page (government, read; undated, blogs disagree on start date). limerickleader.ie returns 403; travelextra.ie fetch timed out; limerickpost.ie, clarechampion.ie, irishexaminer.com and limerick.ie fetch fine. Council news pages (limerick.ie/node/...) restate organiser prices and make the second source.
- **Single-venue event official lodging:** the organiser's travel-services FAQ page carries the real terms (minimum nights, deposit, cancellation coupling, occupancy per room); its listings pages render empty to WebFetch (JS). The event's own *transport* page ranks bases (which towns are rail feeds to the shuttle) better than any "where to stay" search.
- **Validator scans titles/notes for single amounts:** strip "EUR 55,000"-style figures out of press headlines in source titles and notes, or fold them into a range.
- 12 calls covers ~5 bases plus STR rules with no prices. Price tiers need their own budget. See [[stay-run-strategy]].
