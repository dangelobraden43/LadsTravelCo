---
name: event-booking-sources
description: Lessons from event-driven runs (2027 Spain eclipse, Oct 2026) - shared WebSearch cap, fetch-first fallback, which eclipse/ferry booking pages fetch or block
metadata:
  type: reference
---

**Shared search cap (Oct 14 2026)**
- WebSearch has a session-wide limit (200) shared by every agent in the run. A late-wave agent can find it already spent before its first search. WebFetch still works.
- Fallback that worked: read the earlier-wave agents' JSON first and fetch the URLs they cite (and the source lists inside good guides) instead of searching. Do not query search engines through fetch.

**Pages that fetch cleanly**
- spainsolareclipse.com (home, /travel-eclipse-2027/, /events/): quotable booking advice, no lead times in months.
- tripprof.com Gibraltar eclipse guide: long cited-source list (gov.gi, FCDO, Balearia, Proteccion Civil, INE) - a good index for further fetches.
- proteccioncivil.es Operacion Paso del Estrecho page: government "closed ticket, buy early" advice for summer Strait ferries.
- colorado.edu alumni trip pages: sold-out status for eclipse tour packages (evidence of sell-out pace; never name as a pick).

**Pages that block**
- balearia.com returns 403. Operator sale horizon and change rules need another route (port authority apba.es, or snippets).

**Pattern**
- Event pages carry archived prior-event listings (2026 eclipse) beside empty current ones: check the year on every event item.
- Press reports of hotels "pausing" bookings are usually unattributed inside the article; record as low-confidence booking-state with an end-of-year expiry.
- Empty scope.places means no Viator matching is owed; record a gap rather than searching Viator by event name.

Related: [[booking-sources-and-viator-matching]], [[research-contract]]
