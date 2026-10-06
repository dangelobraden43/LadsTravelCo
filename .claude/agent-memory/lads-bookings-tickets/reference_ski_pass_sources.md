---
name: ski-pass-and-resort-booking-sources
description: Which ski pass and resort booking pages fetch cleanly (Indy, Ikon, Vail hill sites) and which fail (epicpass.com queue, Boyne lessons 404); learned on the Oct 2026 Midwest skiing run
metadata:
  type: reference
---

**Fetch cleanly (one call each, high yield)**
- `indyskipass.com/our-resorts`: returns the full partner list grouped by state/province. Summary may add out-of-region resorts; filter by state.
- `indyskipass.com/this-is-indy/how-it-works`: blackout rules by pass tier, reservation caveat, window redemption with ID.
- `ikonpass.com/en/reservations`: script-heavy; fetch surfaces only some reservation flags. Treat "not flagged" as medium confidence.
- Vail hill sites (`wilmotmountain.com/explore-the-resort/about-the-resort/wilmot-basecamp.aspx`-style Pre-Arrival pages) loaded fine and carry the lesson/rental advance-booking rules.

**Fail**
- `epicpass.com` and some Vail pages redirect to `waitingroom.snow.com` (queue). Use the hill's own Pre-Arrival page or OnTheSnow's Epic buyer's guide instead.
- `boynemountain.com/lessons` returns 404; Boyne lesson URL unknown.

**Pass facts go stale fast:** Indy blackout dates are published in the fall; Epic/Ikon go off sale in December. Every pass finding needs a datedUntil re-check date.

**Viator for ski regions:** lift tickets are sold by resorts, not Viator. The only plausible products are city-to-resort day trips (e.g. Toronto to Blue Mountain). AAA "tripcanvas" listings expose Viator product codes; still confirm on viator.com before recording a product.

Related: [[booking-sources-and-viator-matching]]
