---
name: flight-source-lessons
description: Which flight/fare sources fetched cleanly, which were snippet-only, and recurring traps in schedule and fare research for Midwest-to-Europe routes
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
- Lead-time evidence disagrees (Google 32-73 days vs blogs saying 3-6 months); report both, see [[fare-intelligence-rule]].
