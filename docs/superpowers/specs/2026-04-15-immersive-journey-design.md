# Immersive Journey Homepage — Design Spec
## April 15, 2026

---

## Overview

Rebuild the Lads Travel Co homepage as a full-viewport immersive scroll experience. Each section is a distinct **world** — a complete environment shift with its own palette, textures, particle systems, ambient video, and mood. The scroll IS the journey.

The architecture is **Section-as-World**: a `WorldManager` component tracks scroll position and crossfades entire environments. Each world is defined as a config object so new worlds can be added without code changes.

**Design direction:** Immersive 3D + Living Data Particles. Not gold-and-black throughout — each section gets its own distinct atmosphere. The pub is the soul. Everything else is a journey from that basecamp.

---

## The Journey Sequence (7 Worlds)

### World 1: THE PUB — Home Base
**Scroll range:** 0vh – 100vh (landing viewport)

- **Feeling:** Warm amber light, dark wood, leather, Jameson on the shelf. An Irish pub where mates plan the next trip.
- **Palette:** Amber `#c9a84c`, dark wood `#1a1510`, leather brown `#2a1a10`, copper `#b8886e`
- **Background:** Subtle wood grain texture overlay (CSS or canvas). Warm floating dust particles — like light streaming through a pub window. Soft radial amber glow from center.
- **Video:** `IrishSong_qqxzzr` playing ambient in a portrait frame. Muted by default, unmute icon on click. The pub band, Jameson mirror, Christmas lights.
- **Content:** Hero headline (Splitting.js character animation), clarity line, scroll invitation. The globe teaser at the bottom pulling you into World 2.
- **Audio (optional):** IrishSong audio available on user opt-in.

### World 2: THE GLOBE — Where We've Been
**Scroll range:** ~100vh – 200vh

- **Feeling:** Space. Looking down at the world. Quiet awe.
- **Palette:** Deep navy `#0a0e14`, slate `#0d1117`, star white, gold pins
- **Background:** Near-black with existing Three.js globe filling the viewport. Star particles. Globe pins pulse with each destination's color.
- **Transition in:** Pub warmth fades to dark. Camera conceptually "pulls back" to reveal the globe.
- **Interaction:** Globe auto-rotates. Click a pin → navigate to that framework page via React Router. Hover shows tooltip with city name and spot count.
- **Content:** Minimal text. "21 cities. 4 continents. 285 spots." Let the globe speak.

### World 3: THE CITIES — Explore
**Scroll range:** ~200vh – 400vh

- **Feeling:** Cobblestone streets at golden hour. Warm stone. Evening in Rome, morning in Dublin.
- **Palette:** Terracotta `#c47a5a`, warm stone `#1C1510`, golden light `#d4a843`
- **Background:** Subtle stone texture. Warm directional light effect (CSS gradient simulating sunlight from one side). Golden dust particles drifting slowly.
- **Videos:** `ViennaPalace_auec7z` in portrait frame, `Montserrat_fvwtgo` in split-screen panel
- **Content:** Destination cards from current /explore. Split-screen theater — left: editorial list with Splitting.js reveals, right: photo panel crossfading on hover. Each card inherits its own city palette on hover.
- **Data-driven:** Destination list pulls from existing data modules. New destinations added to data = new cards.

### World 4: THE WILD — Adventure
**Scroll range:** ~400vh – 550vh

- **Feeling:** Forest floor. Mist. Moss on rocks. The air before a summit.
- **Palette:** Deep forest `#0e150e`, moss `#4a6741`, mist `#7a9a6a`, earth `#3a2a1a`
- **Background:** Deep greens, drifting fog/mist particles (slow, large, semi-transparent), organic shapes. Firefly-like gold specks.
- **Videos:** `CostaATVbar_rpyngq` (jungle overlook), `SmokeyNP_eewi1h` (summit panorama), `SmokeyMts_s2ijgc` (cloud forest ambient)
- **Content:** Three-rung adventure ladder (Accessible → Multi-Day → Expedition). Salkantay callout with May 2026 date. Trek cards with elevation/difficulty data.

### World 5: THE SEASONS — When & Giving Back
**Scroll range:** ~550vh – 750vh

- **Feeling:** Four micro-environments within one world. Each season is its own sub-world.
- **Sub-palettes:**
  - Spring: soft green `#2a3a2a`, bloom pink `#c4a0a0`, fresh `#e8f0e8`
  - Summer: warm gold `#3a2a10`, heat `#c47a3a`, bright `#f0e0c0`
  - Fall: amber `#2a1a10`, rust `#a05a30`, deep orange `#c47a3a`
  - Winter: slate `#1a1e24`, frost `#a0b0c0`, ice `#d0dce8`
- **Background:** Shifts per season as user scrolls through. Particle system changes — floating pollen/petals (spring), warm dust (summer), falling leaves (fall), snow (winter).
- **Video:** `ViennaPalace_auec7z` for spring. Photo backgrounds for other seasons until more video is available.
- **Content:** Charity window per season with personal stories. Destination picks with prices. Donate buttons. Each charity cause panel takes on the emotional tone of its season.
- **Data-driven:** Charity windows and season destinations from config. New season/charity = new config entry.

### World 6: THE SYSTEM — Data & Intelligence
**Scroll range:** ~750vh – 950vh

- **Feeling:** Mission control. Clean. Precise. This is the tech flex — after the emotional journey, you see the engine.
- **Palette:** Near-black `#0a0a10`, gold `#c9a84c`, cool steel `#8a9ab0`
- **Background:** Dark with gold particle constellation. 285 Airtable spots visualized — each spot is a particle, clustered by city, connected by travel route lines. The constellation breathes and drifts.
- **Interaction:** Hover a cluster → city name and spot count tooltip. Particles rearrange when filtering (by tier, by country, by category). Count-up animations on data points.
- **Content:** Travel windows, flight intelligence, the quiz, "how we do it" reveal. The system section content adapted to this environment.
- **Data-driven from Airtable:** Particle count and cluster sizes automatically reflect the synced database. Add spots in Airtable → particles appear on next sync.

### World 7: BACK TO THE PUB — The Lads / Contact
**Scroll range:** ~950vh – end

- **Feeling:** You're back where you started. The warmth returns. But now you've seen the world.
- **Palette:** Same as World 1. The return home.
- **Background:** Pub warmth fades back in. Same amber glow, wood texture, warm particles.
- **Video:** `TreviScooter_qryefo` as small inline personality clip. The lads being the lads.
- **Content:** Team bios, intake form (Formspree), Cal.com booking widget, contact. The CTA after the journey.
- **Closing beat:** "You've seen where we've been. Let's plan where you're going."

---

## Technical Architecture

### WorldManager Component
- Root-level component wrapping the entire homepage
- Tracks scroll position via GSAP ScrollTrigger (already installed)
- Maintains `activeWorld` state based on scroll ranges
- Crossfades between world backgrounds with configurable transition duration (default: 0.8s)
- Provides world context to child components via React Context

### World Config Schema
```js
{
  id: 'pub',
  name: 'The Pub',
  scrollRange: [0, 1],           // Normalized 0-1 of total scroll
  palette: {
    bg: '#1a1510',
    accent: '#c9a84c',
    text: '#e8dcc8',
    particle: '#c9a84c',
  },
  texture: 'wood-grain',          // Key into texture map
  particles: {
    type: 'dust',                  // dust | fog | firefly | constellation | snow | leaves | petals
    count: 60,
    speed: 0.3,
    opacity: 0.4,
    color: '#c9a84c',
  },
  video: {
    id: 'IrishSong_qqxzzr',
    placement: 'portrait-frame',   // portrait-frame | split-screen | ambient-bg | inline-clip
    hasAudio: true,
  },
}
```
Each world is one of these objects in a `worlds.js` config array. Add a world = add a config.

### Canvas Layer
- Single persistent Three.js `<Canvas>` behind all content (z-index: 0)
- Particle systems swap based on active world
- Performance: only the active world's particles render. Previous/next world preloaded.
- Uses existing `@react-three/fiber` and `@react-three/drei` dependencies

### Texture System
- CSS-based texture overlays (background-image with mix-blend-mode)
- Textures: wood grain (pub), stone (cities), moss/earth (adventure), clean/none (data)
- Stored as subtle tileable images in `/public/textures/`
- Applied via a `<WorldTexture>` component that crossfades opacity

### Video Integration
- `<VideoBackground>` component wrapping Cloudinary URLs
- Cloudinary transforms: `q_auto,f_auto,w_1280` for landscape, `w_720` for portrait
- Poster frame via Cloudinary `so_{seconds},w_800,f_jpg` transform (no separate image file needed)
- Lazy load: video element created when world is 1 viewport away, plays when active, pauses when offscreen
- Progressive enhancement: poster image on slow connections, video on fast

### Scroll Behavior
- GSAP ScrollTrigger pins and triggers world transitions
- Each world transition: background crossfade (0.8s), particle system swap (fade out old, fade in new), texture overlay blend
- Content within each world uses existing reveal animations (revealOnScroll, staggerReveal)
- Mobile: reduced particle counts, simpler transitions, no texture overlays

### Performance Budget
- Target: 60fps scroll on mid-range devices
- Max active particles: 100 per world
- Videos: only active world's video plays, all others paused
- Three.js canvas: requestAnimationFrame paused when tab not visible
- Lazy load worlds: only active + adjacent worlds have full resources loaded
- Total bundle increase target: <200KB JS (world configs + WorldManager + particle presets)

---

## Data-Driven Design

Everything that can come from data, does:

| Element | Data Source | Auto-updates? |
|---------|-----------|---------------|
| Destination cards | `src/data/*.js` modules | Yes, on build |
| Data constellation particles | `src/data/airtable-*.js` (285 spots) | Yes, on Airtable sync |
| Charity windows | `worlds.js` config | Manual config update |
| Season destinations | `worlds.js` config | Manual config update |
| Globe pins | `Globe.jsx` city array | Manual (could wire to Airtable) |
| Videos | Cloudinary cloud `doonck2rm` | Add URL to world config |

---

## What's NOT in This Spec

- 3D hoodie mockups (future build — parked in CLAUDE.md)
- "Built With AI" story page (last build before Peru)
- New video uploads (build with current 8 videos)
- Framework page redesigns (this spec is homepage only)
- Audio system beyond IrishSong unmute

---

## Migration Path

The current homepage content all survives — it gets reorganized into worlds:

| Current Section | New World |
|----------------|-----------|
| Hero + headline | World 1 (Pub) |
| Globe | World 2 (Globe) |
| Data Spectacle + photo strips | Split across World 3 (Cities) and World 6 (System) |
| Four-path CTA | World 3 (Cities) — becomes navigation within the journey |
| /explore content | World 3 (Cities) |
| /adventure content | World 4 (Wild) |
| /when content | World 5 (Seasons) |
| SystemSection + quiz | World 6 (System) |
| LadsSection + GivingBack | World 7 (Pub Return) |

No content is deleted. It's reorganized into immersive containers.

---

## Success Criteria

1. Scrolling the homepage feels like traveling through distinct environments
2. Each world has a clearly different atmosphere (palette, particles, texture, mood)
3. Videos play in context within their worlds
4. Adding a new world requires only a config object, not new components
5. 60fps on mid-range devices (throttle particles and transitions on low-end)
6. The pub bookends feel like home — warm, inviting, the place you want to return to
7. Data constellation in World 6 reflects actual Airtable spot count
8. Mobile experience is functional (reduced effects, no texture overlays, fewer particles)
