---
name: flight-source-lessons
description: Which flight/fare sources fetched cleanly, which were snippet-only, and recurring traps in schedule and fare research (Midwest-Europe, Spain eclipse, Australia event runs)
metadata:
  type: reference
---

Learned on the European Christmas Markets run (2026-10-06, 12-call budget).

**Fetch worked (read):**
- aeroroutes.com schedule-filing posts: clean, dated, carrier + weekly frequency + date ranges. Best source for seasonal cuts. Search "aeroroutes <carrier> NW26 <city>".
- ratepunk.com `/flights-from-to/<ORIG>/<DEST>/...`: month-by-month medians, typical range, refresh date. Aggregator, but readable; use as one of two fare sources.

**Snippet-only / weak:**
- Airline route pages (airlineinformation, flightsfrom, directflights, idealo, roame) mostly reflect SUMMER schedules; never take them as winter confirmation.
- Search summaries for "Detroit nonstop Europe" hallucinated that Delta has no winter DTW-Europe service. Trust only named-route snippets.
- Kayak route pages: snippet numbers, direction of route often unclear.
- Google's annual holiday-travel blog (blog.google/products/search/holiday-travel-trends-YYYY) carries the days-before-departure finding; widely re-reported (Time Out, Travel Noire), so two sources come easily.

**Traps that recur:**
- Article year: infer from schedule-season dates (IATA winter = last Sunday Oct; summer = last Sunday Mar). A "stops Oct 25, resumes Mar 29" article was 2025-26, not 2026-27.
- MSP loses KLM and Icelandair in winter; check every winter run.
- Budget tip: 3 searches on hub nonstops, 1 aeroroutes fetch, 2-3 on fares/lead time, 1 basic economy, 1 airport-name traps. Leaves smaller origins (MKE/GRR/IND/CLE/CMH) uncovered at 12 calls; ask for more or search them first if the brief stresses them.
- Origin-neutral event runs (eclipse-2027-spain, 2026-10-12): Wikipedia airport pages (en.wikipedia.org/wiki/<Airport>) fetch cleanly and give distance to centre, rail station, Aena passenger counts and a full airlines/destinations table in one call; pair each with a second host (tourspain.es B2B connectivity page is an official, readable 2026 route round-up for Spain). Gibraltar Airport schedule only came via snippets.
- Event demand: Euronews (es.euronews.com) carries airline booking-surge statements; they include promo lead-in fares that are point prices, leave them out.
- FareCompare route pages give "cheapest month" labels from ordinary years; useful only as a trap for event weeks, never as a fare band.
- Read the earlier agents' JSON first: path/edge-of-path facts and arrival-day traffic were already sourced; cite their read sources with a "not re-read here" note rather than spending calls.
- Australia event run (rugby-world-cup-2027, 2026-10-12): Wikipedia pages for Sydney, Perth and Townsville airports fetched cleanly with terminal layouts (Perth's Qantas T3/T4 vs T1/T2 split is a recurring trap). Two Wikipedia pages are ONE host for the validator's two-source rule; pair each route claim with aeroroutes, aerocorner, airportroutes or an airline release. Small airports (Newcastle NTL) came only via snippets.
- Fare searches phrased "London to Sydney" returned only AUD, Sydney-origin pages; for a GBP band search a UK-domain site (skyscanner.net, kayak.co.uk) by name.
- Schedules load about 11 months out (EWN quoting a sports-travel agent, Oct 2026). For events 12+ months away, say fares are not observable yet and give ordinary-year baselines labelled as such.
- Validator scans notes too: write money as "AUD 1,151 to 2,171", never "AUD 1,151 (cheapest) to ..." or a lone figure.
- Lead-time evidence disagrees (Google 32-73 days vs blogs saying 3-6 months); report both, see [[fare-intelligence-rule]].
