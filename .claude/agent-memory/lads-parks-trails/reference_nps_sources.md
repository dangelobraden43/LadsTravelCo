---
name: reference-nps-sources
description: Which NPS page patterns work for park research, which 404, what each holds, and where second sources for trails come from
metadata:
  type: reference
---

NPS park pages (learned on Pictured Rocks, Oct 2026; pattern likely holds for other units):

- `nps.gov/<unit>/planyourvisit/hikes.htm` is the day-hike master page: distance, park difficulty
  rating, typical time, trailhead, pets, warnings. One fetch covers most trails. `hiking.htm` 404'd.
- `nps.gov/thingstodo/hikes-over-mile-<unit>.htm` is a second NPS page with the same trails
  (same host, so it does NOT count as an independent source).
- `planyourvisit/fees.htm`, `camping.htm`, `backcountry.htm` each answer their topic in one fetch
  (fees incl. no-entrance-fee days; campground site counts, season, Recreation.gov window;
  permit rules, group sizes, night caps, water, fires, cell coverage).
- `planyourvisit/kayaking.htm` 404'd. Search for the paddling page URL before fetching.
- NPS PDFs (travel planners, maps) fetch as binary and cannot be read: the local Read tool has
  no PDF renderer. Do not spend a call on them.
- NPS never publishes elevation gain. Gain only comes from aggregators (AllTrails, The Outbound,
  onX), and they disagree badly (757 vs 1,306 ft on one loop). Ship gain as a range or null.
- Independent second host for trail stats: the gateway town's visitors bureau (e.g. munising.org)
  often reprints AllTrails figures for top hikes. One fetch, several trails.
- WebFetch calls count against the call budget alongside WebSearch; plan ~6 fetches + ~4 searches.

See [[feedback-two-source-honesty]].
