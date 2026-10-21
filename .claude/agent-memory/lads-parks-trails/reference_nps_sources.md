---
name: reference-nps-sources
description: Which NPS / state-park / routing sources work for park research, which 404 or load empty, what each holds, and where second sources for trails come from
metadata:
  type: reference
---

NPS park pages (Pictured Rocks + New River Gorge, Oct 2026):

- `planyourvisit/hikes.htm` worked for PIRO but 404'd for NERI; NERI uses `hiking.htm`. Unit pages vary.
- **District trail pages load their trail list dynamically ("Loading results...") and fetch EMPTY.**
  Don't spend calls on them.
- **Best NPS trail source: the places API** `https://developer.nps.gov/api/v1/places?parkCode=<unit>&limit=300&api_key=DEMO_KEY`.
  Every trail/overlook/waterfall/historic site with lat/lng, one-way or round-trip length, park
  difficulty, sometimes gain/loss and slope, trailhead directions, warnings. Cite each record as
  `nps.gov/places/<slug>.htm`. It is huge (~550k chars for NERI): WebFetch reads 100k per call,
  so plan ~6 calls with `offset`. Records are alphabetical. Some coords are shared area points,
  not lots. Place records can be stale vs the closures page; the closures page governs.
- `thingstodo?parkCode=<unit>&api_key=DEMO_KEY` is small (16 items NERI) but gives durations/gain.
- `planyourvisit/road-and-trail-closures.htm` (NERI) holds all closures with dates and "last updated".
  `conditions.htm` is only links.
- NPS PDFs fetch as binary; skip. NPS rarely publishes gain.
- Second host for trail stats: earthtrekkers.com park pages (dated, read, carry gain + time); a
  gateway visitors bureau (munising.org for PIRO).

West Virginia State Parks: `wvstateparks.com/parks/<slug>/trails/` lists every trail with length,
difficulty, trailhead, closures, hours. Slugs vary (`pipestem-state-park` vs
`pipestem-resort-state-park`, `camp-creek-state-park-and-forest`); a wrong slug 404s or returns the
park page. Pages can be stale (Hawks Nest Rail Trail "closed until June 2026" months later).

Drive times: OSRM table service `router.project-osrm.org/table/v1/driving/<lng,lat;...>?sources=0&annotations=duration,distance`
returns a whole matrix in ONE fetch. `exclude=toll` returns HTTP 400 on the demo server, so it
cannot honour a no-toll brief. Free-flow; gravel roads can return absurd times.

Shenandoah (Oct 2026) additions:
- `hikes.htm` 404s and `oldrag.htm` 404s; the ticketed-trailhead page is `faqs-oldrag.htm`.
  Recreation.gov ticket facility pages fetch fine (price, release rules, cancellation, parking notices).
- `planyourvisit/hours.htm` is the one fetch for a dated trip: every facility's 2026 open/close
  dates, the only gas station, campground seasons.
- SHEN Things To Do pages DO carry gain. Without the places API, `site:nps.gov/thingstodo <park>
  "<trail>" OR "<trail>"` searches surface their stats in snippets. Try the places API first.
- gohikevirginia.com district round-ups list 10+ hikes with mileposts in one fetch, but contain
  errors (called Hightop the park high point): never copy superlatives.
- Dead ends: nationalparkstraveler.org 403s; hikingupward.com 301s to myhikes.org; "best hikes"
  blogs like hikewithryan.com carry no numbers.
- Check the memory index at run start even mid-wave: a parallel run may have added a better method.

WebFetch calls count against the budget alongside WebSearch.

See [[feedback-two-source-honesty]].
