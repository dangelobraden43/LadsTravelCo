# Framework Engine Pass B — Specification

**Status:** Draft for Brady review · Phase 4 deliverable · No code yet
**Date:** 2026-05-22
**Quality benchmarks:** `public/jordi.html` (story pattern), `public/vegas-zion-rise.html` (client-grade pattern)

---

## Context

The 11 React destination routes (`/dublin`, `/rome`, `/spain`, `/australia`, `/iceland`, `/prague`, `/munich`, `/poland`, `/thailand`, `/charleston`, `/michigan`) all render through one `FrameworkPage.jsx` that loads `src/data/{slug}.js`. After Phase 1, the legacy static HTML duplicates are gone — `FrameworkPage.jsx` is now the only thing serving those URLs.

Pass B rebuilds `FrameworkPage.jsx` into a **cultural immersive experience** per destination, while keeping the one-engine-many-frameworks model. The two static flagships (Jordi, Vegas-Zion-Rise) stay as v1 references and the quality bar to beat.

**Non-goal:** a per-destination three.js scene. That's overkill, kills perf, and dilutes the Globe as the singular 3D moment. Atmosphere = 2D canvas particles (Vegas-proven). The Globe is the one 3D scene; everything downstream is canvas + DOM.

---

## 1. What "Cultural Immersive Experience" Means — Concrete Components

Every framework page in Pass B is composed of these named components. Some are required, some are per-destination opt-in.

| # | Component | Required | What it is | Vegas/Jordi parallel |
|---|---|---|---|---|
| 1 | **Cinematic Hero** | ✓ | Full-viewport bg (video/image/AI-art) + mono kicker + display headline + scroll cue | both have this |
| 2 | **Atmospheric Layer** | ✓ | Persistent fixed-position canvas particle system (drifting embers / petals / lanterns / snow / fireflies / mist / rain) | Vegas lantern engine |
| 3 | **Sticky Nav Bar** | ✓ | Back-to-globe link · framework name · audio toggle · scroll progress bar | Neither flagship; new for engine |
| 4 | **Palette + Type Lock** | ✓ | Per-destination CSS custom props (bg / surface / accent / glow / mist) | both have this in `:root` |
| 5 | **Ambient Audio Loop** | optional | Single looped track at low volume, muted by default | neither has this yet |
| 6 | **Acts (scroll sections)** | ✓ | Up to 6 acts; subset chosen per framework | Jordi: 3 acts, Vegas: all 6 |
| 7 | **Scene-Aware Dispatch** | ✓ | `data-scene` attribute on each section drives atmospheric layer density + audio gain + palette tint | Vegas's `currentScene` mechanic |
| 8 | **Cross-Framework Footer Strip** | ✓ | 3 related framework cards at page bottom (Jordi's "MORE FRAMEWORKS" pattern) | both flagships have this |

---

## 2. Data Structure — New Fields in `src/data/{slug}.js`

Existing fields stay (id, name, region, route, tagline, palette, overview, spots, dayTrips, mapsLinks, logistics, costModel, ladsTake). Pass B adds optional fields. Anything absent falls back to engine defaults.

```js
export default {
  // ===== EXISTING (kept, unchanged) =====
  id, name, region, route, tagline, palette, overview,
  spots, dayTrips, mapsLinks, logistics, costModel, ladsTake,

  // ===== NEW for Pass B =====

  // 2a. Per-destination vibe + palette extension
  vibe: {
    oneLiner: 'A whisky-warmed week in slate-grey Ireland.',   // Brady writes
    sceneKey: 'pub-trad-music',  // semantic tag, drives audio + atmosphere preset
    paletteExt: {
      glow: '#4a8c6f',                       // bright accent for particles, audio bar
      mist: 'rgba(74,140,111,0.06)',         // tint behind text
      kicker: '#8db0a0',                     // mono label color
    },
  },

  // 2b. Hero media — engine picks renderer based on type
  heroMedia: {
    type: 'video' | 'image' | 'ai-art',
    src: 'cloudinary-public-id OR /ai-art/dublin/hero.webp OR full URL',
    poster: '/ai-art/dublin/hero-poster.jpg',  // video fallback
    focal: { x: 0.5, y: 0.4 },                 // object-position normalized
    overlayDark: 0.45,                         // bg dim 0-1
  },

  // 2c. Ambient audio — null = no audio for this destination
  ambient: {
    audioUrl: '/audio/dublin-trad-loop.mp3',   // or Cloudinary URL
    license: 'CC0-Pixabay',
    credit: 'Pixabay user xyz',
    defaultVolume: 0.15,                       // 0-1
  } | null,

  // 2d. Atmospheric layer preset
  atmosphere: {
    preset: 'embers' | 'petals' | 'lanterns' | 'snow' | 'mist' | 'fireflies' | 'rain' | 'none',
    intensityByScene: {                        // override per-scene; defaults provided
      arrival: 0.4,
      feel: 0.6,
      spots: 0.2,
      days: 0.3,
      logistics: 0.15,
      signoff: 0.5,
    },
  },

  // 2e. Act enable flags + content
  acts: {
    arrival: { enabled: true },  // always true

    feel: {
      enabled: true,             // story moments — true for most, false for sparse destinations
      moments: [
        {
          mediaSrc: '/ai-art/dublin/snug.webp',
          mediaType: 'image' | 'video',
          kicker: 'THE PUB',
          copy: 'Two stools, two pints, an open snug, a fire that has been burning since 1820.',
        },
        // 1-3 moments per framework
      ],
    },

    spots: {
      enabled: true,             // always true if data.spots[].length > 0
      defaultFilter: 'All',
      featuredFirst: true,
    },

    days: {
      enabled: false,            // true only if itinerary detailed AND days copy written
      structure: 'vegas-style',  // or 'jordi-style' for prose-driven
      itinerary: [               // expanded from existing data.itinerary
        {
          day: 'Day 1',
          label: 'ARRIVAL',
          sub: 'Land, check in, walk to the first pint.',
          spots: ['Lark Inn', 'Ginger Man'],     // refs to data.spots[].name
          bradysNote: 'Stay close to Trinity. You will not have your bearings yet.',
        },
      ],
    },

    logistics: { enabled: true },  // true if data.logistics is populated

    signoff: {
      enabled: true,
      kicker: 'WHEN YOU GO',
      copy: 'Take the train to Galway. Walk the cliffs. Find a snug. Order the Guinness.',
      ctas: [
        { label: 'Plan with us', href: '/plan', primary: true },
        { label: 'Back to the globe', href: '/#globe' },
      ],
    },
  },

  // 2f. Related frameworks for the footer strip
  related: ['rome', 'iceland', 'prague'],  // slugs; engine resolves to names + accent colors
}
```

**Backward compatibility:** every new field is optional. Engine reads `data.acts?.feel?.enabled ?? false` style. A framework that adds none of these renders as today's `FrameworkPage` does.

---

## 3. Hero Treatment — Per Destination

| Slug | Hero type | Source | Why |
|---|---|---|---|
| **dublin** | Video | `DublinPubFire_x.mp4` (Brady uploads to Cloudinary) | Trad-music fire-lit pub is the iconic vibe; static photos undersell it |
| **rome** | Image | Existing `IMAGES.colosseum` (dusk) | Strong photo, no video advantage |
| **spain** | Image | `/images/jordi/best-sagrada.webp` (already loaded for homepage card) | Best-validated photo in the library |
| **australia** | Video | Existing `IMAGES.opera` + Vivid Harbour drone Cloudinary asset | Existing video, dramatic motion |
| **iceland** | Video | Brady sources from Pexels/Pixabay (waterfall or aurora) | Iceland is a motion-sells destination |
| **prague** | AI-art | Claude generates: "Old Town Square at 6am, mist, gold light, EB Garamond mood" | No good existing photo; AI nails atmospheric cities |
| **munich** | AI-art | Claude generates: "Bavarian beer hall interior, warm amber light, wood beams" | Same reason |
| **poland** | AI-art | Claude generates: "Krakow Old Town golden hour, low fog, market square" | Same |
| **thailand** | Video | Brady uploads night-market or longtail-boat footage | Motion-led culture |
| **charleston** | Image | Rainbow Row warm late-light shot (Brady has) | Strong existing imagery |
| **michigan** | Image | UP autumn forest road or Sleeping Bear shot (Brady has) | Local intel, image is enough |

**Defaults if asset missing:** AI-art placeholder generated from `data.tagline + data.palette` (engine renders a CSS gradient + noise + tagline overlay so the page always looks intentional).

---

## 4. Audio Strategy

**Principle:** ambient, not soundtrack. One loop per destination, low volume, muted by default. The visitor opts in.

**UX:**
- Audio toggle lives in the sticky nav top-right: `[♪ Sound: off]` → on click → `[♪ Sound: on]`
- Default: **muted** (audio loaded, gain = 0, plays on first user gesture per browser autoplay policy)
- Toggle state persists per-session via `sessionStorage`
- Crossfade between destinations on navigation (3s fade-out → 3s fade-in)
- Scene-aware gain: `data-scene="feel"` boosts volume +20%, `data-scene="logistics"` drops -50%

**Tech:** Web Audio API (one `AudioContext` + `GainNode` per page; loop via `<audio loop>` element source). Howler.js not needed — overkill for one loop. ~2KB of code.

**File spec:** MP3, 64-96kbps mono, 30-90s loop, ≤300KB. Hosted in `/public/audio/{slug}-loop.mp3`.

**Source library (Brady picks one of each):**

| Slug | Vibe | Search terms (Pixabay / Freesound) |
|---|---|---|
| dublin | Trad pub | "irish fiddle session quiet", "pub murmur" — layer at 50/50 |
| rome | Cafe + Vespa | "italian cafe espresso", "vespa distant" |
| spain | Park Güell breeze | "spanish guitar acoustic", "barcelona birds" |
| australia | Surf + cicada | "ocean waves gentle", "cicada australian" |
| iceland | Wind | "icelandic wind lava field", "glacier creek" |
| prague | Bells + rain | "cathedral bells distant", "light rain prague" |
| munich | Brass quiet | "oompah brass background", "beer hall ambience" |
| poland | Piano cold | "chopin piano slow", "winter wind" |
| thailand | Tropical rain | "rain banana leaves", "tuktuk distant" |
| charleston | Porch | "crickets summer evening", "church bell distant" |
| michigan | Lake + loon | "lake water lapping", "loon call northern" |

All sources must be CC0 / CC-BY / royalty-free. Credit shown in framework footer per `ambient.credit`.

---

## 5. 3D Scene Strategy

**Hard decision: the framework page does NOT render a three.js scene.**

Why:
- The Globe is the singular 3D wow-moment. If every framework also boots three.js, the Globe stops feeling special and we pay 250KB+ of bundle per route.
- The Vegas-Zion-Rise lantern engine is a pure 2D `<canvas>` particle system — runs at 60fps on a 2019 phone, ships in ~10KB. That's the right abstraction for "atmospheric depth."
- Per-destination three.js scenes would each need their own assets, shaders, perf tuning. Cost is too high for the marginal win.

**What we build instead — `src/atmosphere/`:**

A library of named canvas presets. Each export this shape:

```js
// src/atmosphere/embers.js
export default {
  name: 'embers',
  defaultPalette: { hue: 22, sat: 80, lit: 55 },
  init(canvas, opts) { /* sets up particle pool, returns handle */ },
  setScene(sceneKey, intensity) { /* spawn rate, palette shift, max particles */ },
  destroy() { /* cleanup */ },
}
```

Initial preset library (~7 files, each 100-200 lines):
- `embers.js` — Vegas's lantern engine, generalized
- `petals.js` — falling cherry blossoms / leaves (spring/fall)
- `lanterns.js` — alias of embers with bigger particles
- `snow.js` — slow downward drift
- `mist.js` — soft slow-moving gradient blobs (no individual particles)
- `fireflies.js` — small bright dots with random jitter
- `rain.js` — diagonal streaks

Each preset reads CSS custom properties from `:root` so palette changes per destination automatically. Total atmosphere code: ~1.5KB gzip per preset, lazy-loaded.

**Globe → Framework transition (NEW, optional Pass B v2):**

Today: click pin → instant route change → framework hero loads. Functional but jarring.

Phase B target:
1. Click pin
2. Globe rotates 800ms to center the city
3. Globe scales up briefly (1.0 → 1.4 over 600ms)
4. Black-screen hold (150ms) — masks the route change
5. Framework hero crossfade-in (400ms)

Total cost: ~1.5s perceived smoothness. Implementation: pure CSS animation on a wrapper div, no three.js handoff needed. **Defer to Pass B v2** unless Brady wants it in v1.

---

## 6. Scroll Architecture — Acts Inside `FrameworkPage.jsx`

The page is a linear scroll through up to 6 acts. Each act is a `<section data-scene="...">`. The atmospheric layer + audio gain react to whichever section is centered in the viewport.

```
┌───────────────────────────────────────────────┐
│ STICKY NAV                                    │
│ ← Back to globe   Dublin + Galway   ♪ off     │
│ ════════════════════ scroll progress ─────────│
└───────────────────────────────────────────────┘

┌─ ACT 1: ARRIVAL  data-scene="arrival" ────────┐
│ HERO                                          │
│ Full-viewport hero media (video / img / AI)   │
│ Kicker · Headline · Scroll cue                │
└───────────────────────────────────────────────┘

┌─ ACT 2: WHAT IT FEELS LIKE  data-scene="feel" ┐
│ Vibe one-liner (large serif italic)           │
│ Moment 1: full-bleed photo + kicker + caption │
│ Editorial paragraph (narrow column)           │
│ Moment 2: photo or video                      │
│ Editorial paragraph                           │
│ Moment 3 (optional)                           │
└───────────────────────────────────────────────┘

┌─ ACT 3: THE SPOTS  data-scene="spots" ────────┐
│ Section label · "WHAT WE'D HAVE YOU SEE"      │
│ Filter pills: All · Pubs · Food · Sights ...  │
│ Spot cards grid (featured cards larger)       │
│   - Cards reuse the current V2 card           │
│   - Happy Hour + Way to Save preserved        │
└───────────────────────────────────────────────┘

┌─ ACT 4: THE DAYS  data-scene="days" ──────────┐
│ (Renders only if acts.days.enabled)           │
│ DAY 01 · ARRIVAL                              │
│   Spot card · Spot card · Spot card           │
│   ▎Brady's Note (amber side-border, italic)   │
│ DAY 02 · CITY                                 │
│   ...                                         │
└───────────────────────────────────────────────┘

┌─ ACT 5: LOGISTICS  data-scene="logistics" ────┐
│ Flights · In-Country · Around · Tipping cards │
│ Cost model table                              │
│ Day trips grid (existing)                     │
└───────────────────────────────────────────────┘

┌─ ACT 6: SIGN-OFF  data-scene="signoff" ───────┐
│ Closing serif sentence                        │
│ CTAs: Plan with us · Back to globe            │
│ "MORE FRAMEWORKS" — 3 related cards           │
│ Brand footer + audio credit                   │
└───────────────────────────────────────────────┘
```

**Scene dispatch logic** (port from Vegas):

```js
useEffect(() => {
  const sections = document.querySelectorAll('[data-scene]')
  const onScroll = () => {
    const mid = window.scrollY + window.innerHeight * 0.5
    let active = 'arrival'
    sections.forEach((s) => {
      const t = s.offsetTop
      const b = t + s.offsetHeight
      if (mid >= t && mid <= b) active = s.dataset.scene
    })
    if (active !== currentScene) {
      atmosphere.setScene(active, data.atmosphere.intensityByScene[active])
      audio.setGain(audio.baseGain * SCENE_GAIN_MULT[active])
      setCurrentScene(active)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [currentScene])
```

---

## 7. Jordi-Style vs Vegas-Style — Pattern Selection

These are not two engines. They are two **opinionated subsets** of the one engine, chosen by which acts are enabled in `data`.

| Pattern | What it is | Acts on | Acts off | Typical length |
|---|---|---|---|---|
| **STORY** (Jordi) | Founding-narrative or thank-you. One subject, one trip, prose-led, photo-heavy. No itinerary, no spot grid. | arrival, feel (heavy, 5-8 moments), signoff | spots, days, logistics | 600-900 words, 8-15 photos |
| **CLIENT** (Vegas) | A real itinerary built for a named human. Day-by-day with Brady's Notes. | arrival, feel (light, 1-2 moments), days (heavy), logistics, signoff | spots (or compressed) | Day-by-day, 3-6 spots/day, full logistics |
| **ENGINE** (default for 11 destinations) | A city's full validated intelligence library. The "library" view. | arrival, feel (1 moment), spots (full, filtered), days (loose), logistics, signoff | none | Full spot list with day-trips |

**Decision rule (codified in the engine):**

```js
function selectPattern(data) {
  if (data.namedClient) return 'CLIENT'
  if (data.acts?.feel?.enabled && !data.spots?.length) return 'STORY'
  return 'ENGINE'
}
```

**Migration of the two existing flagships:** they stay as `public/jordi.html` and `public/vegas-zion-rise.html` for v1. Once the Engine is stable (Pass B v1 complete), rebuild both inside the engine using STORY / CLIENT patterns. They gain the sticky nav, audio toggle, and shared atmosphere — without losing what makes them work today. Until then, the engine respects the v1 versions and the homepage cards link to them as-is.

---

## 8. What Brady Provides

Pass B has two phases of Brady input.

### Phase B-engine (week 1, while engine is being built)

| Item | Quantity | Time est |
|---|---|---|
| Approval on this spec | 1 | 30 min reading + comments |
| Hero kicker line per destination | 11 | 1 hour total |
| Vibe one-liner per destination | 11 | 2 hours total |
| Sign-off copy per destination | 11 | 2 hours total |
| Pick 3 destinations to ship first | — | 5 min |

### Phase B-assets (rolling, week 2 onward)

Per destination (multiply by 11 for total):

| Asset | Source | Time per destination |
|---|---|---|
| Hero media (video/image/AI prompt approval) | Brady curates or Claude generates | 30 min |
| Ambient audio loop (.mp3) | Brady picks from Pixabay/Freesound | 20 min |
| 1-3 "Feel" moments (photo + 1-2 sentence caption) | Brady writes | 1 hour |
| Brady's Notes (if Days act enabled) | Brady writes 1 per day | 30 min/day |
| Atmosphere preset choice | Brady picks from list | 5 min |

**Total Brady time, fully-fleshed 11 destinations: ~50 hours.** Phased over weeks alongside Ford schedule; not all at once.

---

## 9. What Claude Code Generates

- **Engine rewrite** — `FrameworkPage.jsx`, the sticky nav, scene dispatcher, audio module, layout CSS
- **Atmosphere preset library** — 7 files in `src/atmosphere/`, each ~150 LOC
- **AI art prompts** — written for Brady to run in Midjourney/DALL-E (or Claude can generate via API if we wire it up); files dropped into `/public/ai-art/{slug}/`
- **Scroll choreography** — IntersectionObserver fade-ins, scene dispatch
- **Data migration script** — one-time pass over `src/data/*.js` to add the new optional fields with sensible defaults
- **Per-destination CSS module** — palette injection via custom props, no per-route stylesheet
- **Cost model rendering** when `data.costModel` exists
- **Default fallbacks** so destinations without ambient audio or hero video still look intentional
- **Per-destination accessibility** — `prefers-reduced-motion` disables atmosphere + autoplay video, audio stays muted

Claude does **not** generate:
- Brady's prose (vibe lines, Notes, sign-offs) — these must be human
- Real photos and videos — assets only
- Ambient audio loop selection — Brady curates

---

## 10. Build Complexity Per Destination

Effort = Brady time + Claude time per destination, assuming engine + presets exist.

| Slug | Hero source | Atmosphere | Acts on | Brady time | Claude time | Tier |
|---|---|---|---|---:|---:|---|
| **dublin** | Video (Brady upload) | mist + fireflies | All 6 | 6h | 2h | **Complex** — both Lads validated, deep copy |
| **spain** | Image (existing) | petals | A1 / A2 / A3 / A5 / A6 | 4h | 1.5h | Medium |
| **rome** | Image (existing) | embers | A1 / A3 / A5 / A6 | 3h | 1h | Simple |
| **iceland** | Video (Brady sources) | snow + aurora tint | All 6 | 5h | 2h | Complex (video sourcing) |
| **australia** | Video (existing) | mist | A1 / A2 / A3 / A5 / A6 | 4h | 1.5h | Medium |
| **prague** | AI-art | rain + mist | A1 / A3 / A5 / A6 | 3h | 1.5h | Simple (AI does heavy lift) |
| **munich** | AI-art | fireflies (warm) | A1 / A3 / A5 / A6 | 3h | 1h | Simple |
| **poland** | AI-art | snow | A1 / A3 / A4 (Krakow + Auschwitz day) / A5 / A6 | 4h | 1.5h | Medium — Auschwitz needs tone care |
| **thailand** | Video (Brady upload) | rain | A1 / A3 / A4 / A5 / A6 | 5h | 2h | Complex (video upload + day breakdown) |
| **charleston** | Image (existing) | fireflies | A1 / A3 / A5 / A6 | 3h | 1h | Simple |
| **michigan** | Image (existing) | mist (lake) | A1 / A3 / A6 (no Logistics) | 2h | 1h | Simple — local intel |
| **Totals** | | | | **42h** | **16h** | |

**Phasing recommendation:**
1. **Engine + 3 proof destinations** (Pass B v1, ~3 weeks): pick Dublin (complex), Rome (simple), Spain (medium) so the engine is exercised across the full pattern range.
2. **Remaining 8 destinations** (Pass B v2, rolling): tackle simples first to build momentum, then complexes.
3. **Globe-zoom transition + flagship migration** (Pass B v3, post-Ford onboarding): polish layer once everything else is stable.

---

## Open Questions for Brady

Before Pass B implementation starts:

1. **Audio default — muted vs auto-play?**
   Recommended: muted. Auto-play violates user expectations and most browsers block it without gesture. But it means most visitors will never hear it. Worth testing both, A/B.

2. **Globe-zoom transition in Pass B v1 or v2?**
   v1 = nice from day one but adds 1-2 days of polish. v2 = ship the engine sooner, add transition later.

3. **Migrate Jordi + Vegas off static HTML into the engine?**
   Pro: shared nav, audio toggle, future tweaks happen once. Con: rebuild risk. Recommended: defer to Pass B v3 (don't touch what's working).

4. **`prefers-reduced-motion` default behavior?**
   Recommended: atmosphere disabled, hero video paused, ambient audio still load-but-muted. Page degrades to "static premium magazine" feel.

5. **Which 3 destinations to ship first?**
   Recommendation: Dublin (both Lads validated, will exercise every act), Rome (simple, fast proof), Spain (medium, ties into Jordi's Sagrada hero).

6. **Audio file hosting — `/public/audio/` or Cloudinary?**
   Cloudinary adds CDN + format conversion. `/public/audio/` is simpler but doesn't gzip. Recommended: Cloudinary for all flagship destinations, `/public/audio/` for the rest.

7. **AI-art tool — Midjourney, DALL-E, or Claude image API?**
   Midjourney quality is highest; Claude API is integrated. Recommendation: Brady runs Midjourney for the 4 destinations that need AI hero (Prague, Munich, Poland), saves to `/public/ai-art/{slug}/`, documents prompt in sidecar `.md`.

---

## Out of Scope for Pass B

These are tempting and explicitly excluded to keep Pass B shippable:

- Per-destination three.js geometry (defer or never)
- Real-time weather / time-of-day shading (defer)
- User-pickable atmosphere presets (defer)
- In-page booking widgets beyond existing affiliate links (defer)
- A separate STORY-pattern builder UI for Brady to compose narratives (post-engine)
- Multi-language support (post-engine)

---

## Success Criteria for Pass B v1

The engine is "done" for v1 when:

1. The 3 proof destinations render with hero, atmosphere, audio (if provided), all enabled acts, scene dispatch working
2. A visitor on a 2019 mid-range Android can scroll a framework page at 50+ fps with atmosphere on
3. Initial bundle for a framework route stays under 50KB gzip (excludes Cloudinary assets)
4. `prefers-reduced-motion` users see a clean static magazine layout with zero performance cost
5. Brady can add a new destination in <2 hours by filling in the data file + dropping in assets — no engine changes required
6. The 8 destinations that don't get full Pass B treatment still render correctly via default fallbacks
7. Jordi and Vegas-Zion-Rise remain reachable at their original URLs, untouched

---

## Estimate Summary

| Bucket | Time |
|---|---|
| Engine code (Claude) | ~20h |
| Atmosphere preset library (Claude) | ~10h |
| 3 proof destinations content (Brady) | ~13h |
| 3 proof destinations Claude integration | ~4.5h |
| **Pass B v1 total** | **~47h** spread over 3 weeks |
| Remaining 8 destinations | Brady ~29h, Claude ~11.5h |
| **Pass B fully complete** | **~88h** |

This is a Brady-paced project. Engine work happens in focused sessions; content fill-in happens in chunks alongside Ford schedule.
