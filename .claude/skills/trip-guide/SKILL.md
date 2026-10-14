---
name: trip-guide
description: Build a full researched road-trip or trip guide for a real trip with booked stays - every place to eat, drink, see, hike and stop along the way, verified by the Lads research agents, delivered as a private phone-friendly guide plus a walked/skipped checklist, with the research banked for the public site after the trip. Use when Brady says "trip guide", "road trip guide", "plan our trip", gives booked stay addresses and dates, or asks for a guide for a founder trip or a client trip.
---

# /trip-guide — FROM BOOKED STAYS TO A GUIDE YOU CAN USE IN THE CAR

First worked run: The Gorge & the Ridge, Oct 14 2026 (`internal/research/new-river-gorge/`,
`shenandoah/`, `gorge-ridge-drive/`, runId `2026-10-14T16-51`; setup script
`internal/research/_setup/gorge-ridge-runs.mjs`). Copy it.

## 1. The brief (ask only what is missing, in ONE AskUserQuestion round)

Needed: each stay (address + nights), dates, who is going and from where, how they travel,
hard constraints (Brady's Oct 14 example: **avoid all toll roads**), what is already booked,
and whether this is founder-only or a client guide. Any existing personal plan in
`~/Downloads` is input, never a source: its stays and drive times may be out of date.
**The booked stays are fixed. Adapt the trip to them; never suggest moving them.**

## 2. Pin every base by provenance

Geocode each address with the US Census geocoder
(`geocoding.geo.census.gov/geocoder/locations/onelineaddress`, benchmark
`Public_AR_Current`) — official, no key. Several matches → ask which. No match (rural
Airbnb numbers often fail) → ask for the listing name or a landmark and anchor to an
authoritative record for that landmark (Oct 14: the Hinton house anchored to the NPS
Richmond Hamilton Farm record). Never geocode a bare business name (the Tivoli rule).
Confirm both towns back to Brady before research starts: every drive time hangs on them.

## 3. Split the research so it can be exhaustive

One run per region the trip sleeps in, plus one run for the drive. All runs share a
`runId` and run in parallel (the stop hook reads each agent's own run since Oct 14).
RUN.json carries `brief`, `trip` (bases, nights, travellers, constraints), `roster`,
`parts`, `callBudgets`, `inputs`.

- **Region run roster:** provenance, timing-events, parks-trails (if any park/trail),
  `lads-destination-scout.eat`, `.drink`, `.see`, getting-around, bookings-tickets.
  Scout and parks budgets ~30; others 15-20; verifier ~90.
- **Drive run roster:** getting-around (route options under the constraints, per leg)
  then one `lads-destination-scout.legN` per driving day. Dispatch the leg scouts after
  getting-around so they follow the real route.
- **Parts:** one agent may run several times in a run as `lads-<agent>.<part>.json`; the
  file's `agent` field stays the base name; ids are prefixed `<agent-short>-<part>-`.
- Every dispatch prompt names the run directory AND the exact output file.
- Drive times are always from the base the traveller will actually be sleeping at.
  Day-of-week hours matter: small towns close Monday/Tuesday.

## 4. Verify, then build from verdicts only

Validate every file (`node tools/research/validate.mjs`). Dispatch `lads-verifier` per run
(it reads all part files). The guide uses ONLY findings the verifier confirmed or
corrected (a `weakened` verdict's `proposedClaim` is the wording). Unverifiable items are
either dropped or shown under a clearly labelled "unconfirmed — call ahead" flag, never
mixed in with the confirmed list.

## 5. The guide (private Artifact, phone-first)

Load the `artifact-design` skill first. One page, phone-first at 390, dark-friendly:
- **Day by day** with the drive ledger (each leg: route, distance, time range, toll-free
  note), sunrise/sunset, and the morning-of checks.
- **Near each base**, grouped Eat / Coffee / Drink / See / Hike / Viewpoints, each with drive
  time from that base, hours for the actual days, the trap, a Maps link built from the
  provenance-checked name and coordinates, and "unconfirmed" flags where earned.
- **Along the way** per leg, in driving order.
- **Every hike** filterable by park, distance, difficulty.
- **Before you go:** tickets and passes with release times (official fees exact with
  source), closures for the dates, no-signal zones, offline-map reminder.
- **Walked / skipped checklist** (artifact storage capability, so both founders' marks
  are shared and readable afterwards), with a one-line note field per place.
- **No traveller names anywhere on the guide** (Brady, Oct 14): "the two of you", never names.
- No first-person Lads voice, no ratings, no "covered by the Lads", no receipts, no
  insurance, no "free" (say "no admission charge").

## 6. After the trip

Read the checklist rows back. Places marked walked become walked-mode candidates for the
public guide (the park-guide spec: `docs/superpowers/specs/2026-10-12-park-guides-design.md`);
founder notes are `ladsTake` only when verbatim. Never flip anything to validated without
the founder's mark. Re-run `/research <slug> --mode walked --refresh` for the public build.

## 7. Bank and close

Research dirs are gitignored. Commit the setup script's RUN.json shape into the skill's
worked example if it changed, and any `.claude/agent-memory/` the agents updated. Record
the guide's artifact link in CLAUDE.md's session record.
