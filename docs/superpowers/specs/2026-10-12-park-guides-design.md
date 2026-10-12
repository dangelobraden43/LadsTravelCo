# National park guides — design (the Dusk Field Guide, Phase A)

Approved in chat by Brady, Oct 12 2026: "two park guides + a road-trip route", built from his
personal guide *The Gorge & the Ridge: Fall Break 2026* (`~/Downloads/The Gorge & the Ridge_
Fall Break 2026.html`), then Pictured Rocks second on the same template. Design system and
legal/motion rules are the ones locked in CLAUDE.md `THE SEPTEMBER 8 QUEUE` item 3.

## Why this park first

Brady, Dawson and Lukas walk New River Gorge and Shenandoah **Oct 23–27, 2026**. The trip
turns both into the first **walked (gold)** park guides — the one thing an AI planner cannot
copy. Pictured Rocks follows as the proof that a researched-only (copper) park works.

## Routes

- `/outdoors/new-river-gorge` and `/outdoors/shenandoah` — standalone park guides. This is
  the template every future park copies.
- `/outdoors/gorge-and-ridge` — the 5-day route linking both, with the drive ledger.

## A park guide, top to bottom

1. **Poster hero** — an original WPA-genre SVG generated from the park's real geography
   (gorge + bridge; ridge silhouettes + haze), name, state, a walked/researched mark, a
   one-line hook. ⛔ Nothing referenced from modern poster recreations.
2. **Know before you go** — the facts that shape a visit: timed tickets and release times
   (Old Rag: $2, 800/day, half 30 days out, half 5 days out, 10 am ET — official fee, shown
   exactly per Brady's Oct 12 ruling), the vehicle pass, closures, no signal at trailheads.
3. **When to go** — travel windows by driver, every one sourced: fall colour by elevation,
   sunrise/sunset, lodge and service closing dates.
4. **Every hike** — a filterable table (park area, distance, gain, difficulty, time), each
   row marked walked or researched; the trail draws itself on scroll (GSAP, no WebGL,
   reduced-motion static, smooth at 390).
5. **Day plans** — versions, not our itinerary: the classic day, the hard day, the
   bad-weather or no-ticket backup.
6. **Where to stay** — gateway towns compared (Fayetteville vs Hinton; Luray/Sperryville vs
   Basye) with lodging tiers as sourced ranges. Only places a founder stayed are named as ours.
7. **Along the way + eat and drink** — kept with honest flags ("hours unconfirmed").
8. **Getting there** — origin-neutral: nearest airports and drive times; the Midwest drive is
   one labelled panel.
9. **Field notes** — founder words after the trip. Empty sections are omitted, never announced.

## Data

`src/data/parks/<slug>.js` per park, schema `parkData`: `windows` (driver-typed, sourced),
`trails` (miles, gain, difficulty, time, why, walked, sources), `airports`, `access`,
`permits`, `camping`, `lodging` (town tiers), `stops`, `theTrap`, `sources`, `checkedOn`.
Gain may use a labelled aggregator (AllTrails) as the second source (Brady, Oct 12).

## Stripped from the personal guide

Names, receipts, "covered by the Lads", the booking checklist's personal tasks, and specific
Airbnb listings nobody stayed in.

## Sequence

1. **Before Oct 23:** a phone checklist of the guide's places so each founder can mark
   walked / skipped in seconds and add a line where one is earned.
2. **Phase A (now):** mockup at 1440 + 390 — poster hero, one park page, the route page.
   Brady approves before any build.
3. **After Oct 27:** research pass on both parks (`/research new-river-gorge`,
   `/research shenandoah`), then build with the founders' notes.
4. **Then:** Pictured Rocks on the same template (its research run exists; Brady's Oct 12
   rulings on official fees and NPS-authorised operators apply).
