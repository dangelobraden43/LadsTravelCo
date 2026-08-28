/* PERU 2026 — normalized pin intermediate (DAY ANCHORS ONLY)
 *
 * Source: Brady's own Peru trip media, May 2–11 2026 — 225 files (195 photos,
 * 30 videos) inventoried mechanically at `internal/brady/peru26-manifest.md`.
 * The raw media lives in `Peru26/`, which is gitignored and never enters git.
 *
 * COORDINATES ARE NOT GEOCODED FROM NAMES. Every lat/lng below was read out of
 * the EXIF / QuickTime location tags embedded by Brady's own camera at the
 * moment of capture. Nobody searched a place name and accepted what came back.
 * That is the same provenance standard the Bruce Peninsula list was built to
 * (`src/data/brucePeninsula.js`) — the Tivoli rule is satisfied by provenance
 * rather than by disambiguation, and it is satisfied even more strongly here,
 * because a saved Google place proves intent while a camera GPS tag proves
 * physical presence.
 *
 * WHAT THE COORDINATES PROVE, AND WHAT THEY DO NOT.
 * A GPS tag proves Brady's camera was at that location on that date. It proves
 * NOTHING about any named business, hostel, restaurant, guide, or tour
 * operator. There is therefore not a single commercial spot in this file. No
 * operator names, no hotel names, no restaurant names, no prices, no
 * `ladsRating`. We have no source for any of them and none were invented.
 *
 * LABELS ARE BEST-EFFORT. THE COORDINATES ARE THE TRUSTWORTHY PART.
 * The manifest is explicit about this: its day headings were "inferred from
 * embedded GPS coordinates, not from an itinerary document — treat day *names*
 * as best-effort and verify against the coordinates shown." That caveat is
 * inherited wholesale. Every entry carries `manifestLabel` (the manifest's own
 * day heading, verbatim, as factual provenance) alongside our shorter `name`,
 * and `labelSource: 'inferred'` on all ten. Two labels are actively disputed by
 * their own coordinates — see FLAGS below.
 *
 * PRECISION. The manifest publishes day coordinates to 2 decimal places (about
 * ±1 km at these latitudes) and marks days 4–10 with a leading `~`, meaning a
 * representative point for that day's cluster rather than a single capture.
 * These are DAY ANCHORS, not spot pins. Do not render them at a zoom level
 * that implies metre accuracy, and do not present one as "the trailhead" or
 * "the restaurant". Per-photo EXIF at full precision exists in the raw media
 * and can be re-extracted if a finer pass is ever needed.
 *
 * VALIDATION STATE — this trip genuinely happened.
 * Unlike the Bruce list (a saved list that predated its trip), every anchor
 * here is firsthand: Brady was physically at these coordinates on these dates,
 * and his camera recorded it. All ten therefore ship
 *     validated: true, validatedBy: 'Brady', visitedDate: '2026-05'
 * That flag attaches to the LOCATION AND DATE ONLY. It is not an endorsement of
 * anything, because there is nothing here to endorse yet.
 *
 * The validated prose Brady wrote after the trip lives in the SALKANTAY BLOCK
 * of `src/OutdoorsPage.jsx`: "Brady completed Salkantay to Machu Picchu in May
 * 2026. The route ran Lima to Huacachina, then five days on the Salkantay
 * trail: over the Salkantay Pass at roughly 4,600 m, past the glacial turquoise
 * of Humantay Lake, and down through cloud forest to Machu Picchu itself."
 * Note that Humantay Lake and the Salkantay Pass are named in that prose but
 * have NO coordinate of their own in the manifest, so they are not pins here.
 *
 * ── FLAGS (do not silently resolve these; they need Brady) ──
 *
 * 1. ICA / HUACACHINA / PARACAS. The manifest labels day 4 "Ica / Paracas area
 *    (Islas Ballestas boat tour, desert dune buggy)". Brady's own /outdoors
 *    prose says "Lima to Huacachina". These are not in conflict about the
 *    coordinate: Huacachina is the desert oasis immediately beside Ica, and the
 *    day-4 anchor (-14.07, -75.74) sits in that Ica/Huacachina cluster. Paracas
 *    is a different place roughly 50 km northwest on the coast, and the day-4
 *    coordinate is NOT there. So: the coordinate supports Ica/Huacachina; the
 *    "Paracas" and "Islas Ballestas" parts of the label are inference the
 *    coordinate does not carry. Both readings are recorded rather than one
 *    being quietly picked. If the Ballestas boat tour did happen it was a
 *    separate location that this day's representative point does not reflect.
 *
 *    ✅ RESOLVED IN PART — BRADY, Aug 27 2026. The boat tour DID happen: it was
 *    a day tour out of LIMA, taken BEFORE Cusco. So "Islas Ballestas" is now
 *    firsthand-confirmed by Brady rather than label inference, and may be named.
 *    It still has NO coordinate of its own — Brady's confirmation establishes
 *    the event, not a position — so it remains unpinned and is NOT a waypoint.
 *    Do not attach it to the day-4 Ica/Huacachina anchor: different place.
 *    "Huacachina" stays the label for the day-4 dune footage (Brady's own word).
 *
 * 2. DAY 6 IS A GEOGRAPHIC OUTLIER. The manifest labels day 6 "Salkantay trek,
 *    day 1 (Andes)" at -13.86, -71.30. Every other trek day sits between
 *    -72.53 and -72.66 longitude. Day 6 is about 1.28° of longitude and 0.47°
 *    of latitude away from day 7 — on the order of 150 km. A Salkantay day-1
 *    trailhead would not be there. The coordinate is recorded verbatim and the
 *    label is NOT rewritten, but it should not be drawn as "Salkantay day 1"
 *    without Brady confirming what that day actually was. One unconfirmed
 *    hypothesis worth putting to him: the site's own pre-trip copy
 *    (`src/SystemSection.jsx`) listed "Salkantay Trek, Rainbow Mountain" as the
 *    May 2026 intent, and Rainbow Mountain / Vinicunca is a day trip southeast
 *    of Cusco rather than a point on the Salkantay trail — which would make an
 *    out-and-back spur from Cusco the correct arc. That is a hypothesis only.
 *    It is not asserted, and it must not be written into copy until confirmed.
 *
 * 3. DAY 9 "AGUAS CALIENTES" IS ALSO LABEL-INFERRED. The day-9 anchor
 *    (-13.30, -72.66) is roughly 0.14° south and 0.12° west of the day-10
 *    Machu Picchu anchor. Treat "Aguas Calientes / approach" as the manifest's
 *    guess, not as established fact about where Brady slept that night.
 *
 * 4. ONE MEDIA FILE IS UNPLACEABLE. `72581579-9d47-4394-9304-fbad79f114c1.mp4`
 *    has no GPS tag, no Apple creationdate, no device tag, and a generic
 *    timestamp of 2026-05-20 — five days outside the trip cluster. It is
 *    excluded from every count in this file and is not attributed to any day.
 *
 * 5. DAYS 2 AND 3 SHARE ONE COORDINATE. Lima arrival and the Lima day both
 *    resolve to -12.15, -77.01. Both are kept as separate days because both are
 *    real days, but a map must not stack two pins on the same point — render
 *    Lima once (see `PERU_ROUTE`, which carries a single Lima waypoint) and let
 *    the card show both days.
 *
 * ── TYPE BUCKETS — READ THIS, IT IS AN EXTENSION ──
 * `brucePeninsula.js` uses view / brewery / food / gem. CLAUDE.md's Phase 4
 * pin-system note lists brewery / golf / view / event / gem. Neither vocabulary
 * has a bucket for an intercity anchor or for a segment of a multi-day trek, so
 * this file adds exactly two — `city` and `trail` — and adds nothing else. That
 * is a deliberate, flagged extension rather than a parallel taxonomy: `view`
 * still means what it means on the Bruce list. The pin component will need
 * icons for `city` and `trail`, or Brady may prefer to collapse them. His call.
 *
 * ── SCOPE — THIS IS NOT A PUBLISHED FRAMEWORK ──
 * This is a data foundation for the interactive map, nothing more. Peru is not
 * one of the 9 frameworks. Creating this file does NOT change the canonical
 * site-wide totals (219 spots · 13 validated cities · 10 countries ·
 * 3 continents), does NOT add a Globe pin, does NOT add a route, and does NOT
 * make South America a fourth continent on any counter. Those are downstream
 * decisions for Brady. Day anchors are not spots and must never be counted as
 * spots by the live-walk counter.
 *
 * ── PENDING INGESTION (next session) ──
 * Brady supplied a Google Maps list on Aug 27 and confirmed it is his MACHU
 * PICCHU list:
 *     https://maps.app.goo.gl/dkDQgdoXWFS2prtNA?g_st=i
 * It was NOT read this session — the signed-in Playwright browser was held by
 * a parallel agent, and reading it with a signed-out/isolated profile returns
 * a generic Maps shell with no place data (that is the whole reason the
 * provenance method exists). NOTHING from it is in this file yet.
 *
 * Read it with the SIGNED-IN profile (brady@ladstravel.com), open each saved
 * place, and take lat/lng from the URL's `!3d<lat>!4d<lng>` plus the stable
 * Place ID — same provenance method as brucePeninsula.js. Never resolve a
 * bare name. The list panel is in a SUBFRAME, so page-context `evaluate` is
 * blind to it; use `browser_run_code_unsafe` with Playwright-level locators.
 *
 * Scope Brady stated explicitly: this list does NOT cover Lima, Huacachina,
 * or the Islas Ballestas boat tour. Expect Machu Picchu / Aguas Calientes
 * area places only — do not expect it to fill the earlier days.
 */

export const PERU_SOURCE = {
  label: "Brady's Peru trip media — EXIF GPS day anchors",
  capturedAt: '2026-05-02 to 2026-05-11 (media); manifest generated 2026-08-25',
  tripDates: 'May 2–11, 2026',
  note:
    'Coordinates read from camera EXIF/QuickTime GPS tags, not geocoded from names. ' +
    'Day labels are inferred from those coordinates, not from an itinerary — labels are ' +
    'best-effort, coordinates are trustworthy. Day anchors only: no businesses, operators, ' +
    'prices, or ratings, because the media proves location and date and nothing else.',
  manifest: 'internal/brady/peru26-manifest.md',
  media: '225 files (195 photos, 30 videos); 1 video unplaceable and excluded',
}

/* Ten day anchors, chronological. `manifestLabel` is the manifest's own day
 * heading recorded verbatim as provenance; `name` is our shorter display name.
 * `photos` / `videos` are mechanical counts from the manifest tables. */
export const PERU_PLACES = [
  // ── DEPARTURE DAY (USA — not part of the Peru arc) ──
  {
    name: 'Miami',
    lat: 25.78,
    lng: -80.13,
    type: 'city',
    country: 'USA',
    day: 1,
    date: '2026-05-02',
    manifestLabel: 'Day 1 — May 2 · Miami (Miami GP beach activation; departure day)',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp',
    photos: 8,
    videos: 0,
    inPeruArc: false,
    note:
      'Departure day, United States — outside Peru. Excluded from PERU_ROUTE. The manifest ' +
      'reads the day as a Miami GP beach activation; that read comes from the photos, and ' +
      'no event, venue, or brand is claimed here.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },

  // ── LIMA ──
  {
    name: 'Lima — arrival',
    lat: -12.15,
    lng: -77.01,
    type: 'city',
    country: 'Peru',
    day: 2,
    date: '2026-05-03',
    manifestLabel: 'Day 2 — May 3 · Lima arrival',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp',
    photos: 2,
    videos: 0,
    inPeruArc: true,
    note:
      'Shares an identical coordinate with day 3 — render Lima once. The point falls in ' +
      'the southern Lima metro area; no district is claimed, because 2dp cannot support one.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },
  {
    name: 'Lima',
    lat: -12.15,
    lng: -77.01,
    type: 'city',
    country: 'Peru',
    day: 3,
    date: '2026-05-04',
    manifestLabel: 'Day 3 — May 4 · Lima',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp',
    photos: 10,
    videos: 0,
    inPeruArc: true,
    note: 'Full day in Lima. Same coordinate as day 2.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },

  // ── THE DESERT ──
  {
    name: 'Ica / Huacachina',
    lat: -14.07,
    lng: -75.74,
    type: 'view',
    country: 'Peru',
    day: 4,
    date: '2026-05-05',
    manifestLabel:
      'Day 4 — May 5 · Ica / Paracas area (Islas Ballestas boat tour, desert dune buggy)',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 33,
    videos: 3,
    inPeruArc: true,
    note:
      'FLAG 1. Brady’s /outdoors prose says "Lima to Huacachina"; the manifest label says ' +
      '"Ica / Paracas". The coordinate is in the Ica/Huacachina cluster — Huacachina is the ' +
      'oasis beside Ica, so prose and coordinate agree. Paracas is ~50 km northwest on the ' +
      'coast and is NOT where this coordinate is, so the Paracas / Islas Ballestas part of ' +
      'the label is unsupported inference. Both readings recorded; neither silently dropped. ' +
      'The manifest separately confirms dune-buggy footage on this date (IMG_1944.MOV).',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },

  // ── CUSCO ──
  {
    name: 'Cusco',
    lat: -13.52,
    lng: -71.98,
    type: 'city',
    country: 'Peru',
    day: 5,
    date: '2026-05-06',
    manifestLabel: 'Day 5 — May 6 · Cusco',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 20,
    videos: 0,
    inPeruArc: true,
    note:
      'The one label with independent corroboration inside this repo: Globe.jsx already ' +
      'carries a Cusco comingSoon pin at -13.52, -71.97, which this EXIF anchor matches to ' +
      '0.01°. That agreement is not a licence to promote the Globe pin — Peru is still not ' +
      'a framework.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },

  // ── THE TREK ──
  {
    name: 'Day 6 anchor — label disputed',
    lat: -13.86,
    lng: -71.3,
    type: 'trail',
    country: 'Peru',
    day: 6,
    date: '2026-05-07',
    manifestLabel: 'Day 6 — May 7 · Salkantay trek, day 1 (Andes)',
    labelSource: 'inferred — DISPUTED BY ITS OWN COORDINATE',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 20,
    videos: 5,
    inPeruArc: true,
    flagged: true,
    note:
      'FLAG 2. This is the outlier. Every other trek day sits between -72.53 and -72.66 ' +
      'longitude; this one is ~1.28° east and ~0.47° north of day 7, on the order of 150 km ' +
      'away. A Salkantay day-1 trailhead would not be here, so the name is deliberately left ' +
      'neutral rather than repeating a label the coordinate contradicts. Needs Brady. Do not ' +
      'render trek-day-1 copy against this point until he confirms what the day was.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },
  {
    name: 'Salkantay trail — day 2 camp/section',
    lat: -13.39,
    lng: -72.58,
    type: 'trail',
    country: 'Peru',
    day: 7,
    date: '2026-05-08',
    manifestLabel: 'Day 7 — May 8 · Salkantay trek, day 2',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 22,
    videos: 3,
    inPeruArc: true,
    note:
      'On the Salkantay corridor and consistent with the trek label. The Salkantay Pass and ' +
      'Humantay Lake are both named in Brady’s validated /outdoors prose but have no ' +
      'coordinate of their own in the manifest, so neither is pinned to this day.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },
  {
    name: 'Salkantay trail — day 3 camp/section',
    lat: -13.35,
    lng: -72.58,
    type: 'trail',
    country: 'Peru',
    day: 8,
    date: '2026-05-09',
    manifestLabel: 'Day 8 — May 9 · Salkantay trek, day 3 (approaching Machu Picchu region)',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 33,
    videos: 9,
    inPeruArc: true,
    note:
      'The heaviest capture day of the trip (33 photos, 9 clips) and the earliest start ' +
      '(first frame 05:03). Only 0.04° from the day-7 anchor at 2dp, so days 7 and 8 will ' +
      'render close together — a map may need to offset the labels.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },
  {
    name: 'Day 9 anchor — approach to Machu Picchu',
    lat: -13.3,
    lng: -72.66,
    type: 'trail',
    country: 'Peru',
    day: 9,
    date: '2026-05-10',
    manifestLabel: 'Day 9 — May 10 · Aguas Calientes / approach',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 17,
    videos: 5,
    inPeruArc: true,
    flagged: true,
    note:
      'FLAG 3. Named for the approach rather than for Aguas Calientes, because the ' +
      'coordinate sits ~0.14° south and ~0.12° west of the day-10 Machu Picchu anchor. ' +
      '"Aguas Calientes" is the manifest’s inference and is preserved in manifestLabel, ' +
      'but is not repeated as fact. Also the day of IMG_2760.JPG, the one non-HEIC photo the ' +
      'manifest flags as possibly not raw camera output.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },

  // ── THE WONDER ──
  {
    name: 'Machu Picchu',
    lat: -13.17,
    lng: -72.53,
    type: 'view',
    country: 'Peru',
    day: 10,
    date: '2026-05-11',
    manifestLabel: 'Day 10 — May 11 · Machu Picchu',
    labelSource: 'inferred',
    coordSource: 'EXIF GPS',
    coordPrecision: '2dp, day-cluster (~)',
    photos: 30,
    videos: 4,
    inPeruArc: true,
    note:
      'The terminus, and the strongest label in the set: the coordinate lands on the citadel ' +
      'and matches the endpoint of Brady’s validated /outdoors prose. 30 photos across a ' +
      'single day, first frame 07:26.',
    validated: true,
    validatedBy: 'Brady',
    visitedDate: '2026-05',
  },
]

/* PERU_ROUTE — the trip arc as ordered REAL lat/lng waypoints.
 *
 * Per CLAUDE.md, routes are built from real waypoints and smoothed downstream
 * (Catmull-Rom), never from hand-tuned SVG control points. These are the same
 * EXIF coordinates as above — nothing here is drawn by eye.
 *
 * Miami (day 1) is excluded: it is a US departure day, and stretching the arc
 * to Florida would make a Peru map unreadable and would imply a leg that is a
 * flight, not ground travel. Lima appears ONCE (days 2–3 share a coordinate).
 * That leaves 8 waypoints.
 *
 * `flagged: true` marks a waypoint whose place is real but whose LABEL is
 * disputed. Renderers should still draw the point — Brady was there — but must
 * not caption it with the manifest's inferred name. The day-6 spur in
 * particular will look like a detour, because at these coordinates it is one;
 * do not "smooth it away" to make the line prettier. If it turns out to be a
 * day trip out of Cusco, the spur is the honest shape of the trip.
 */
export const PERU_ROUTE = [
  { day: 2, days: [2, 3], name: 'Lima', lat: -12.15, lng: -77.01, flagged: false },
  { day: 4, days: [4], name: 'Ica / Huacachina', lat: -14.07, lng: -75.74, flagged: false },
  { day: 5, days: [5], name: 'Cusco', lat: -13.52, lng: -71.98, flagged: false },
  { day: 6, days: [6], name: 'Day 6 anchor', lat: -13.86, lng: -71.3, flagged: true },
  { day: 7, days: [7], name: 'Salkantay trail — day 2', lat: -13.39, lng: -72.58, flagged: false },
  { day: 8, days: [8], name: 'Salkantay trail — day 3', lat: -13.35, lng: -72.58, flagged: false },
  { day: 9, days: [9], name: 'Approach', lat: -13.3, lng: -72.66, flagged: true },
  { day: 10, days: [10], name: 'Machu Picchu', lat: -13.17, lng: -72.53, flagged: false },
]

/* Convenience bounds for fitting a projection, derived from PERU_ROUTE only
 * (Miami excluded, or the box would span two continents). Computed from the
 * data above rather than typed by hand, so it cannot drift out of sync. */
export const PERU_BOUNDS = PERU_ROUTE.reduce(
  (b, p) => ({
    minLat: Math.min(b.minLat, p.lat),
    maxLat: Math.max(b.maxLat, p.lat),
    minLng: Math.min(b.minLng, p.lng),
    maxLng: Math.max(b.maxLng, p.lng),
  }),
  { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity }
)

/* ────────────────────────────────────────────────────────────────────────────
 * PERU_SAVED_PLACES — Brady's "Machu" Google Maps list, 22 places
 *
 * Source: Brady supplied https://maps.app.goo.gl/7N98pQtXNVr2R1Xy7 on Aug 28
 * 2026 and confirmed it is his Machu Picchu list. Google's own header reads
 * "Machu · Brady D'Angelo · 22 places". All 22 were read Aug 28.
 *
 * COORDINATES ARE NOT GEOCODED FROM NAMES. Each place was opened from Brady's
 * own saved list in a browser signed in as brady@ladstravel.com and its
 * lat/lng read straight off Google's place record in the URL (!3d/!4d), along
 * with the stable Place ID. Same provenance method as brucePeninsula.js, so
 * generically-named entries are safe: we never resolved a string.
 *
 * VALIDATION STATE — READ BEFORE RENDERING.
 * Every entry ships `validated: false` and renders RESEARCH TIER (copper, no
 * claim). Brady's Peru trip is firsthand, but a saved list is a SUPERSET of
 * what was actually visited — the exact lesson the Bruce list taught, where 17
 * places still sit unflipped for want of a visited-split. Do NOT flip these
 * wholesale. When Brady supplies the split, flip only the visited ones to
 * `validated: true, validatedBy: 'Brady', visitedDate: '2026-05'`.
 *
 * A SAVED COORDINATE IS WHERE GOOGLE'S RECORD SITS, NOT WHERE THE EXPERIENCE
 * HAPPENS. Two entries here are tour-operator records in central Cusco, NOT
 * the attractions they are named after:
 *   - 'Salkantay Trek'   -13.5167, -71.9798 — Plaza de Armas block, Cusco.
 *     The actual trek is ~100 km away.
 *   - 'Red Valley Cusco' -13.5142, -71.9667 — Cusco city. The real Valle Rojo
 *     sits beside Vinicunca at roughly -13.87, -71.30.
 * Both carry `recordIsOffice: true`. Pin them at face value and the map will
 * imply Brady hiked Salkantay in downtown Cusco. Never draw them as features.
 *
 * VINICUNCA CLOSES THE DAY-6 QUESTION. This list contains Vinicunca at
 * -13.8701658, -71.3029901. The manifest's day-6 EXIF anchor is -13.86,
 * -71.30 — the same place. With the "Rainbow Mountain" sign photographed in
 * IMG_2212.HEIC and the trip intent in SystemSection.jsx:436, the May 7 =
 * Rainbow Mountain reading is settled from four independent directions, and
 * the manifest's trek day labels are confirmed off by one.
 *
 * SCOPE NOTE: on Aug 27 Brady said this list does not cover Lima. It does —
 * three Miraflores places (Ambra Rooftop Bar, Canos del Santero, Sol Coffee)
 * sit at about -12.13, -77.03. Recorded as found, not as remembered. It
 * carries no Ica/Huacachina place and nothing for the Ballestas boat tour.
 *
 * `googleCategory` is Google's own category string, verbatim as provenance.
 * `type` is our icon bucket, derived from it. Adds `stay` and `shop` to the
 * vocabulary — deliberate extensions, flagged like `city`/`trail` above.
 * ──────────────────────────────────────────────────────────────────────── */

export const PERU_SAVED_SOURCE = {
  label: 'Brady’s Google Maps list — "Machu"',
  url: 'https://maps.app.goo.gl/7N98pQtXNVr2R1Xy7',
  owner: "Brady D'Angelo",
  capturedAt: '2026-08-28',
  tripDates: 'May 2–11, 2026',
  count: 22,
  note: 'Saved list; visited/not-visited split not yet supplied. All entries research tier.',
}

const saved = (name, lat, lng, type, googleCategory, area, extra = {}) => ({
  name,
  lat,
  lng,
  type,
  googleCategory,
  area,
  source: 'maps-list:Machu',
  validated: false,
  ...extra,
})

export const PERU_SAVED_PLACES = [
  // ── LIMA / MIRAFLORES (~-12.13, -77.03) ──
  saved('Ambra Rooftop Bar', -12.1296777, -77.0296405, 'food', 'Bar', 'Lima — Miraflores', {
    placeId: '0x9105c9b7351218b3:0xe5e35f8b3a416144',
  }),
  saved(
    'Caños del Santero Miraflores',
    -12.1296194,
    -77.0299098,
    'brewery',
    'Craft beer & burgers',
    'Lima — Miraflores',
    {
      placeId: '0x9105c99bb93d38af:0xc9f0399cfd9bacbe',
      fullName: 'Caños del Santero Miraflores - Craft beer & burgers - Cerveza artesanal',
    }
  ),
  saved(
    'Sol Coffee — Cafecito Here',
    -12.1299101,
    -77.029215,
    'food',
    'Coffee shop',
    'Lima — Miraflores',
    {
      placeId: '0x9105c99a09db25df:0x9745400969b74283',
    }
  ),

  // ── CUSCO (~-13.51 to -13.52, -71.97 to -71.99) ──
  saved('Plaza de Armas', -13.5167567, -71.9788134, 'gem', 'Plaza', 'Cusco', {
    placeId: '0x916dd6739cd7f175:0x27c9a9082fc6343',
    note:
      'Cusco’s main square. The May 7 media ends here at 16:37 local, which is what ' +
      'proves that day was a Rainbow Mountain day trip rather than trek day 1.',
  }),
  saved('7 Vidas Taproom Cusco', -13.5164598, -71.9756759, 'brewery', 'Gastropub', 'Cusco', {
    placeId: '0x916dd7d7147a2611:0x2e36ccc8734be690',
  }),
  saved('LLAMA CAFÉ I', -13.5165406, -71.974113, 'food', 'Cafe', 'Cusco', {
    placeId: '0x916dd7c1099faa1f:0xd5d735debfb698b8',
  }),
  saved('ARTESANÍAS ASUNTA', -13.5160324, -71.9758829, 'shop', 'Handicraft', 'Cusco', {
    placeId: '0x916dd6734b05a28d:0x8e5de2f7deb5d650',
  }),
  saved('Wild Rover Cusco', -13.5143269, -71.9852479, 'stay', '2-star hotel', 'Cusco', {
    placeId: '0x916dd675b47561ab:0xc555ecc7bdfbfbe1',
  }),
  saved('Magicpacker hostel', -13.5218665, -71.9864214, 'stay', '2-star hotel', 'Cusco', {
    placeId: '0x916dd677b1eba443:0xfbee812c6db3b2ac',
  }),
  saved('KUSYKAY Peruvian Craft Food', -13.5165588, -71.9772618, 'food', 'Restaurant', 'Cusco', {
    placeId: '0x916e7f3a2235fbcf:0xae765f540c8eeae8',
  }),
  saved(
    'Cervecería Del Valle Sagrado Cusco Centro',
    -13.5166129,
    -71.9800146,
    'brewery',
    'Brewery',
    'Cusco',
    { placeId: '0x916dd7ee1c5d2e0b:0x556cd706211fce46' }
  ),
  saved('Yaku Restaurant', -13.5167753, -71.9809574, 'food', 'Restaurant', 'Cusco', {
    placeId: '0x916dd7c619ddc2ff:0x6275addeac59957a',
  }),
  saved('Moray Peruvian Cuisine', -13.5195018, -71.9816068, 'food', 'Restaurant', 'Cusco', {
    placeId: '0x916dd7c91315a7dd:0xb6d26b168d83e3cd',
  }),
  saved('Restobar by Viajero Cusco', -13.5198087, -71.9786581, 'food', 'Restobar', 'Cusco', {
    placeId: '0x916dd70a114fa749:0x7193a33289094738',
  }),
  saved('Black Llama Coffee', -13.519981, -71.9804106, 'food', 'Coffee shop', 'Cusco', {
    placeId: '0x916dd770416c97df:0xe8a684f293a54e85',
  }),

  // ── OPERATOR RECORDS IN CUSCO — NOT the attractions they name ──
  saved(
    'Salkantay Trek (Cusco operator record)',
    -13.5166606,
    -71.9797794,
    'gem',
    'Tourist attraction',
    'Cusco',
    {
      placeId: '0x916dd67344da9265:0x1d547786216fd1e8',
      recordIsOffice: true,
      note:
        'Google’s record sits on the Plaza de Armas block in Cusco. The trek itself is ' +
        '~100 km away. Do NOT render this as the trek’s location.',
    }
  ),
  saved(
    'Red Valley Cusco (Cusco operator record)',
    -13.5141596,
    -71.966743,
    'gem',
    'Outdoor',
    'Cusco',
    {
      placeId: '0x916dd7144b848a29:0x421940b6215f93e',
      recordIsOffice: true,
      note:
        'Google’s record is in Cusco city. The real Valle Rojo sits beside Vinicunca at ' +
        'roughly -13.87, -71.30. Do NOT render this as the valley’s location.',
    }
  ),

  // ── VINICUNCA / RAINBOW MOUNTAIN ──
  saved('Vinicunca', -13.8701658, -71.3029901, 'view', 'Mountain peak', 'Vinicunca', {
    placeId: '0x916ee6d8f2a9511b:0x1999fa34ef3c2636',
    note:
      'Rainbow Mountain. Matches the manifest’s May 7 EXIF anchor (-13.86, -71.30) — ' +
      'the fourth independent confirmation that May 7 was a day trip here, not trek day 1.',
  }),

  // ── MACHU PICCHU / AGUAS CALIENTES ──
  saved(
    'Historic Sanctuary of Machu Picchu',
    -13.1631988,
    -72.5452621,
    'gem',
    'Historical place',
    'Machu Picchu',
    { placeId: '0x916d9a5f89555555:0x3a10370ea4a01a27' }
  ),
  saved('Huayna Picchu', -13.1562092, -72.5464495, 'view', 'Mountain peak', 'Machu Picchu', {
    placeId: '0x916d9af39d171929:0x1a0650ff9fea69d6',
  }),
  saved('Avenida Hermanos Ayar', -13.155341, -72.5296569, 'city', 'Street', 'Aguas Calientes', {
    placeId: '0x916d9a8429f5580b:0x7ca3790ddee16b8f',
  }),
  saved(
    'Salkantay zipline',
    -13.2101962,
    -72.6166989,
    'gem',
    'Tourist attraction',
    'Santa Teresa area',
    {
      placeId: '0x916d9df14a2c9b91:0x24f2146f877afe6b',
      note:
        'Unlike the two operator records above, this coordinate is out in the Santa Teresa ' +
        'area, consistent with an actual zipline site rather than a Cusco office.',
    }
  ),
]
