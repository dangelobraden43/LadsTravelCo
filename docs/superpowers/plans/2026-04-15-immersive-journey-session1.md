# Immersive Journey — Session 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the WorldManager architecture, particle system, texture system, and the first two worlds (Pub + Globe) with full environment transitions on scroll.

**Architecture:** A `WorldManager` component wraps the homepage and tracks scroll position via GSAP ScrollTrigger. Each world is a config object in `worlds.js`. A persistent Three.js canvas renders particles behind all content. World transitions crossfade backgrounds, particles, and textures. The existing App.jsx homepage content is reorganized into world containers.

**Tech Stack:** React, GSAP + ScrollTrigger (installed), Three.js + @react-three/fiber + @react-three/drei (installed), Splitting.js (installed), Cloudinary video CDN

**Spec:** `docs/superpowers/specs/2026-04-15-immersive-journey-design.md`

---

## File Structure

```
src/
├── App.jsx                          # MODIFY — refactor to use WorldManager, move content into world sections
├── worlds/
│   ├── worlds.js                    # CREATE — world config array (all 7 worlds)
│   ├── WorldManager.jsx             # CREATE — scroll tracker, world state, React context provider
│   ├── WorldBackground.jsx          # CREATE — crossfading background colors/gradients per world
│   ├── WorldParticles.jsx           # CREATE — Three.js particle system that swaps per world
│   ├── WorldTexture.jsx             # CREATE — CSS texture overlay that crossfades per world
│   ├── VideoBackground.jsx          # CREATE — Cloudinary video component with lazy load + poster
│   └── useWorldScroll.js            # CREATE — custom hook exposing active world + scroll progress
├── utils/
│   └── animations.js                # NO CHANGE — existing GSAP utilities used as-is
public/
├── textures/
│   ├── wood-grain.webp              # CREATE — subtle tileable wood texture for pub world
│   └── stone.webp                   # CREATE — subtle tileable stone texture for cities world (future)
```

---

### Task 1: World Config File

**Files:**
- Create: `src/worlds/worlds.js`

- [ ] **Step 1: Create the worlds config array**

```js
// src/worlds/worlds.js
// World configuration — add a world by adding an object. No code changes needed.

export const CLOUDINARY_CLOUD = 'doonck2rm'

export function cloudinaryVideo(publicId, transforms = 'q_auto,f_auto,w_1280') {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/${transforms}/${publicId}.mp4`
}

export function cloudinaryPoster(publicId, seconds = 2) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_${seconds},w_800,f_jpg/${publicId}.jpg`
}

const worlds = [
  {
    id: 'pub',
    name: 'The Pub',
    scrollRange: [0, 0.14],
    palette: {
      bg: '#1a1510',
      bgGradient: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.08) 0%, #1a1510 60%)',
      accent: '#c9a84c',
      text: '#e8dcc8',
      muted: '#b8ad9a',
    },
    texture: 'wood-grain',
    particles: {
      type: 'dust',
      count: 50,
      speed: 0.2,
      size: 2.5,
      opacity: 0.35,
      color: '#c9a84c',
    },
    video: {
      publicId: 'IrishSong_qqxzzr',
      placement: 'portrait-frame',
      posterTime: 3,
      hasAudio: true,
    },
  },
  {
    id: 'globe',
    name: 'The Globe',
    scrollRange: [0.14, 0.28],
    palette: {
      bg: '#0a0e14',
      bgGradient: 'radial-gradient(ellipse at 50% 50%, #0d1117 0%, #0a0e14 70%)',
      accent: '#6b8f9e',
      text: '#e8dcc8',
      muted: '#8a8070',
    },
    texture: null,
    particles: {
      type: 'stars',
      count: 80,
      speed: 0.05,
      size: 1.5,
      opacity: 0.6,
      color: '#ffffff',
    },
    video: null,
  },
  {
    id: 'cities',
    name: 'The Cities',
    scrollRange: [0.28, 0.46],
    palette: {
      bg: '#1C1510',
      bgGradient: 'linear-gradient(135deg, #1C1510 0%, #1a1410 100%)',
      accent: '#c47a5a',
      text: '#e8dcc8',
      muted: '#b8ad9a',
    },
    texture: 'stone',
    particles: {
      type: 'dust',
      count: 40,
      speed: 0.15,
      size: 2,
      opacity: 0.25,
      color: '#d4a843',
    },
    video: {
      publicId: 'Montserrat_fvwtgo',
      placement: 'split-screen',
      posterTime: 3,
      hasAudio: false,
    },
  },
  {
    id: 'wild',
    name: 'The Wild',
    scrollRange: [0.46, 0.60],
    palette: {
      bg: '#0e150e',
      bgGradient: 'linear-gradient(180deg, #0e150e 0%, #0a1210 100%)',
      accent: '#7a9a6a',
      text: '#e8dcc8',
      muted: '#8a8070',
    },
    texture: null,
    particles: {
      type: 'firefly',
      count: 30,
      speed: 0.1,
      size: 3,
      opacity: 0.5,
      color: '#c9a84c',
    },
    video: {
      publicId: 'SmokeyNP_eewi1h',
      placement: 'portrait-frame',
      posterTime: 3,
      hasAudio: false,
    },
  },
  {
    id: 'seasons',
    name: 'The Seasons',
    scrollRange: [0.60, 0.75],
    palette: {
      bg: '#12101a',
      bgGradient: 'linear-gradient(180deg, #12101a 0%, #0e0d14 100%)',
      accent: '#9a7ab0',
      text: '#e8dcc8',
      muted: '#8a8070',
    },
    texture: null,
    particles: {
      type: 'petals',
      count: 25,
      speed: 0.3,
      size: 4,
      opacity: 0.4,
      color: '#c4a0a0',
    },
    video: {
      publicId: 'ViennaPalace_auec7z',
      placement: 'portrait-frame',
      posterTime: 2,
      hasAudio: false,
    },
  },
  {
    id: 'system',
    name: 'The System',
    scrollRange: [0.75, 0.88],
    palette: {
      bg: '#0a0a10',
      bgGradient: 'radial-gradient(ellipse at 50% 50%, #0d0d14 0%, #0a0a10 70%)',
      accent: '#c9a84c',
      text: '#e8dcc8',
      muted: '#8a9ab0',
    },
    texture: null,
    particles: {
      type: 'constellation',
      count: 100,
      speed: 0.08,
      size: 1.8,
      opacity: 0.5,
      color: '#c9a84c',
    },
    video: null,
  },
  {
    id: 'pub-return',
    name: 'Back to the Pub',
    scrollRange: [0.88, 1.0],
    palette: {
      bg: '#1a1510',
      bgGradient: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.08) 0%, #1a1510 60%)',
      accent: '#b8886e',
      text: '#e8dcc8',
      muted: '#b8ad9a',
    },
    texture: 'wood-grain',
    particles: {
      type: 'dust',
      count: 50,
      speed: 0.2,
      size: 2.5,
      opacity: 0.35,
      color: '#c9a84c',
    },
    video: {
      publicId: 'TreviScooter_qryefo',
      placement: 'inline-clip',
      posterTime: 8,
      hasAudio: false,
    },
  },
]

export default worlds
```

- [ ] **Step 2: Commit**

```bash
git add src/worlds/worlds.js
git commit -m "feat: add world config for immersive journey (7 worlds)"
```

---

### Task 2: useWorldScroll Hook

**Files:**
- Create: `src/worlds/useWorldScroll.js`

- [ ] **Step 1: Create the scroll tracking hook**

```js
// src/worlds/useWorldScroll.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import worlds from './worlds'

const WorldContext = createContext({
  activeWorld: worlds[0],
  activeIndex: 0,
  worldProgress: 0,    // 0-1 progress within the active world
  globalProgress: 0,   // 0-1 progress across entire page
})

export function useWorld() {
  return useContext(WorldContext)
}

export function useWorldScroll(containerRef) {
  const [state, setState] = useState({
    activeWorld: worlds[0],
    activeIndex: 0,
    worldProgress: 0,
    globalProgress: 0,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        let activeIndex = 0

        for (let i = 0; i < worlds.length; i++) {
          const [start, end] = worlds[i].scrollRange
          if (progress >= start && progress < end) {
            activeIndex = i
            break
          }
          if (i === worlds.length - 1) activeIndex = i
        }

        const world = worlds[activeIndex]
        const [start, end] = world.scrollRange
        const worldProgress = Math.min(1, Math.max(0, (progress - start) / (end - start)))

        setState({
          activeWorld: world,
          activeIndex,
          worldProgress,
          globalProgress: progress,
        })
      },
    })

    return () => trigger.kill()
  }, [containerRef])

  return state
}

export { WorldContext }
```

- [ ] **Step 2: Commit**

```bash
git add src/worlds/useWorldScroll.js
git commit -m "feat: add useWorldScroll hook + WorldContext"
```

---

### Task 3: WorldBackground Component

**Files:**
- Create: `src/worlds/WorldBackground.jsx`

- [ ] **Step 1: Create the crossfading background component**

```jsx
// src/worlds/WorldBackground.jsx
import React, { useRef, useEffect } from 'react'
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

export default function WorldBackground() {
  const { activeIndex } = useWorld()
  const layersRef = useRef([])

  useEffect(() => {
    layersRef.current.forEach((layer, i) => {
      if (!layer) return
      layer.style.opacity = i === activeIndex ? '1' : '0'
    })
  }, [activeIndex])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      {worlds.map((world, i) => (
        <div
          key={world.id}
          ref={el => layersRef.current[i] = el}
          style={{
            position: 'absolute',
            inset: 0,
            background: world.palette.bgGradient || world.palette.bg,
            opacity: i === 0 ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/worlds/WorldBackground.jsx
git commit -m "feat: add WorldBackground with crossfading layers"
```

---

### Task 4: WorldParticles Component

**Files:**
- Create: `src/worlds/WorldParticles.jsx`

- [ ] **Step 1: Create the Three.js particle system**

```jsx
// src/worlds/WorldParticles.jsx
import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

function ParticleField() {
  const { activeWorld, worldProgress } = useWorld()
  const meshRef = useRef()
  const prevWorldRef = useRef(activeWorld.id)
  const opacityRef = useRef(1)

  // Pre-generate positions for max particle count across all worlds
  const maxCount = Math.max(...worlds.map(w => w.particles.count))
  const positions = useMemo(() => {
    const arr = new Float32Array(maxCount * 3)
    for (let i = 0; i < maxCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [maxCount])

  const velocities = useMemo(() => {
    const arr = []
    for (let i = 0; i < maxCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.005,
      })
    }
    return arr
  }, [maxCount])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry
    const pos = geo.attributes.position.array
    const { particles } = activeWorld
    const speed = particles.speed

    // Fade in/out on world change
    if (prevWorldRef.current !== activeWorld.id) {
      opacityRef.current = 0
      prevWorldRef.current = activeWorld.id
    }
    opacityRef.current = Math.min(1, opacityRef.current + delta * 2)

    for (let i = 0; i < maxCount; i++) {
      if (i < particles.count) {
        pos[i * 3] += velocities[i].x * speed * 60 * delta
        pos[i * 3 + 1] += velocities[i].y * speed * 60 * delta
        pos[i * 3 + 2] += velocities[i].z * speed * 60 * delta

        // Wrap around bounds
        if (Math.abs(pos[i * 3]) > 5) pos[i * 3] *= -0.9
        if (Math.abs(pos[i * 3 + 1]) > 3) pos[i * 3 + 1] *= -0.9
        if (Math.abs(pos[i * 3 + 2]) > 2) pos[i * 3 + 2] *= -0.9

        // Particle type behaviors
        if (particles.type === 'firefly') {
          pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
        }
        if (particles.type === 'petals' || particles.type === 'snow' || particles.type === 'leaves') {
          pos[i * 3 + 1] -= 0.003 * speed * 60 * delta
          pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001
          if (pos[i * 3 + 1] < -3) pos[i * 3 + 1] = 3
        }
      } else {
        // Hide excess particles by moving offscreen
        pos[i * 3 + 2] = -100
      }
    }
    geo.attributes.position.needsUpdate = true

    // Update color and opacity
    const mat = meshRef.current.material
    mat.color.set(particles.color)
    mat.opacity = particles.opacity * opacityRef.current
    mat.size = particles.size * 0.02
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={maxCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        size={0.05}
        opacity={0.35}
        color="#c9a84c"
      />
    </points>
  )
}

export default function WorldParticles() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <ParticleField />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/worlds/WorldParticles.jsx
git commit -m "feat: add WorldParticles — Three.js particle system per world"
```

---

### Task 5: WorldTexture Component

**Files:**
- Create: `src/worlds/WorldTexture.jsx`

- [ ] **Step 1: Create the texture overlay component**

```jsx
// src/worlds/WorldTexture.jsx
import React from 'react'
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

const TEXTURE_MAP = {
  'wood-grain': '/textures/wood-grain.webp',
  'stone': '/textures/stone.webp',
}

export default function WorldTexture() {
  const { activeWorld } = useWorld()

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      {worlds.map((world) => {
        if (!world.texture) return null
        const src = TEXTURE_MAP[world.texture]
        if (!src) return null

        return (
          <div
            key={world.id}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '400px',
              mixBlendMode: 'overlay',
              opacity: activeWorld.id === world.id ? 0.06 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Create a placeholder wood texture**

We need a subtle wood grain texture. For now, generate a minimal one with a canvas script. Run this once:

```bash
node -e "
import { writeFileSync, mkdirSync } from 'fs';
mkdirSync('public/textures', { recursive: true });

// Create a minimal 1x1 transparent placeholder — replace with real texture
// For now the texture overlay will be invisible, which is fine
import { createCanvas } from 'canvas';
// Skip canvas generation — just create the directory
console.log('Created public/textures/ directory. Add wood-grain.webp manually or via AI image generation.');
"
```

Create the directory manually:

```bash
mkdir -p public/textures
```

Note: A real wood grain texture should be added later (a subtle, dark, tileable image around 400x400px). The component works without it — texture just won't be visible until the file exists.

- [ ] **Step 3: Commit**

```bash
git add src/worlds/WorldTexture.jsx
git commit -m "feat: add WorldTexture overlay component"
```

---

### Task 6: VideoBackground Component

**Files:**
- Create: `src/worlds/VideoBackground.jsx`

- [ ] **Step 1: Create the Cloudinary video component**

```jsx
// src/worlds/VideoBackground.jsx
import React, { useRef, useEffect, useState } from 'react'
import { cloudinaryVideo, cloudinaryPoster } from './worlds'

export default function VideoBackground({ publicId, posterTime = 2, placement = 'portrait-frame', hasAudio = false, isActive = false }) {
  const videoRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [muted, setMuted] = useState(true)

  const videoUrl = cloudinaryVideo(publicId, placement === 'ambient-bg' ? 'q_auto,f_auto,w_1280' : 'q_auto,f_auto,w_720')
  const posterUrl = cloudinaryPoster(publicId, posterTime)

  useEffect(() => {
    if (!videoRef.current) return
    if (isActive) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isActive])

  const containerStyles = {
    'portrait-frame': {
      width: 280,
      maxWidth: '80vw',
      aspectRatio: '9/16',
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      position: 'relative',
    },
    'split-screen': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    'ambient-bg': {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    },
    'inline-clip': {
      width: 200,
      maxWidth: '60vw',
      aspectRatio: '9/16',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
    },
  }

  return (
    <div style={containerStyles[placement] || containerStyles['portrait-frame']}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        loop
        muted={muted}
        playsInline
        preload="none"
        onLoadedData={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
      {!loaded && (
        <img
          src={posterUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {hasAudio && (
        <button
          onClick={() => setMuted(!muted)}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/worlds/VideoBackground.jsx
git commit -m "feat: add VideoBackground component with Cloudinary integration"
```

---

### Task 7: WorldManager Component

**Files:**
- Create: `src/worlds/WorldManager.jsx`

- [ ] **Step 1: Create the WorldManager wrapper**

```jsx
// src/worlds/WorldManager.jsx
import React, { useRef } from 'react'
import { WorldContext, useWorldScroll } from './useWorldScroll'
import WorldBackground from './WorldBackground'
import WorldParticles from './WorldParticles'
import WorldTexture from './WorldTexture'

export default function WorldManager({ children }) {
  const containerRef = useRef(null)
  const worldState = useWorldScroll(containerRef)

  return (
    <WorldContext.Provider value={worldState}>
      <div ref={containerRef} style={{ position: 'relative', zIndex: 0 }}>
        <WorldBackground />
        <WorldParticles />
        <WorldTexture />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    </WorldContext.Provider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/worlds/WorldManager.jsx
git commit -m "feat: add WorldManager — orchestrates backgrounds, particles, textures"
```

---

### Task 8: Refactor App.jsx to Use WorldManager (Pub + Globe Worlds)

**Files:**
- Modify: `src/App.jsx`

This is the integration task. We wrap the existing homepage in WorldManager and organize the hero + globe sections into their world containers. The content stays the same — it just lives inside world-aware wrappers now.

- [ ] **Step 1: Update App.jsx imports and add WorldManager wrapper**

At the top of `src/App.jsx`, add the new imports:

```jsx
import WorldManager from './worlds/WorldManager'
import { useWorld } from './worlds/useWorldScroll'
import VideoBackground from './worlds/VideoBackground'
```

- [ ] **Step 2: Create WorldSection helper component**

Add this inside `App.jsx` after the existing `Reveal` component (around line 30):

```jsx
function WorldSection({ worldId, children, style = {} }) {
  const { activeWorld } = useWorld()
  const isActive = activeWorld.id === worldId
  return (
    <section
      data-world={worldId}
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        ...style,
      }}
    >
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Wrap the App return in WorldManager**

Replace the return statement in the `App` component. The existing hero section becomes World 1 (pub), the globe section becomes World 2 (globe). Remove hardcoded background colors since WorldBackground handles that now.

The full updated return:

```jsx
return (
  <WorldManager>
    <CursorGlow />
    <Nav scrolled={scrolled} />

    {/* ===== WORLD 1: THE PUB ===== */}
    <WorldSection worldId="pub" style={{ minHeight: '100vh' }}>
      <div style={{
        position: 'relative', height: '100vh', minHeight: 700,
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {heroImages.map((src, i) => (
          <div key={i} className="hero-bg" style={{
            position: 'absolute', inset: 0, opacity: heroImg === i ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out', zIndex: 0,
          }}>
            <img src={src} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(26,21,16,0.45) 0%, rgba(26,21,16,0.25) 40%, rgba(26,21,16,0.75) 70%, transparent 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 700, padding: '0 32px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: 4, marginBottom: 24, textTransform: 'uppercase' }}>
            FREE PERSONAL TRAVEL CONSULTING THROUGH 2026
          </div>
          <h1 style={{ margin: 0, lineHeight: 1.1, marginBottom: 20 }}>
            <span ref={heroLine1} data-splitting="" style={{ fontFamily: "'Space Grotesk', var(--sans)", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: '#fff', display: 'block' }}>Travel Like</span>
            <span ref={heroLine2} data-splitting="" style={{ fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 400, fontStyle: 'italic', color: 'var(--gold)', display: 'block' }}>You Know Someone</span>
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 18, color: '#b8ad9a', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            Free trip planning from two guys who've actually been there.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2, animation: 'float 2s ease-in-out infinite', opacity: 0.5, color: 'var(--cream2, #b8ad9a)' }}>
          <IconChevron />
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 32, zIndex: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
          {heroImages.map((_, i) => (
            <div key={i} onClick={() => setHeroImg(i)} style={{
              width: heroImg === i ? 24 : 8, height: 8, borderRadius: 4,
              background: heroImg === i ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </WorldSection>

    {/* ===== WORLD 2: THE GLOBE ===== */}
    <WorldSection worldId="globe">
      <div style={{ padding: '60px 0 0', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Suspense fallback={<div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8a8070', letterSpacing: 2 }}>LOADING GLOBE...</span></div>}>
            <Globe />
          </Suspense>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '40px 32px 80px' }}>
        <Reveal>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#8a8070', letterSpacing: 3 }}>
            21 CITIES · 4 CONTINENTS · 285 SPOTS
          </div>
        </Reveal>
      </div>
    </WorldSection>

    {/* ===== REMAINING WORLDS (placeholder sections for scroll height) ===== */}
    <WorldSection worldId="cities">
      <DataSpectacle />
      <PhotoStrip images={strip1} height={220} />
      <section style={{ padding: '80px 0 100px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400, fontStyle: 'italic', color: 'var(--cream, #e8dcc8)', lineHeight: 1.2, marginBottom: 40,
            }}>Where do you want to go?</h2>
          </Reveal>
          <div ref={ctaRef} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            {[
              { label: 'Browse Destinations', path: '/explore' },
              { label: 'Adventure & Treks', path: '/adventure' },
              { label: 'When to Travel', path: '/when' },
              { label: 'Start Planning', path: '/plan', primary: true },
            ].map((btn) => (
              <button key={btn.path} className="cta-pill" onClick={() => navigate(btn.path)} style={{
                width: '100%', padding: '16px 28px', borderRadius: 28,
                border: btn.primary ? 'none' : '1px solid rgba(201,168,76,0.25)',
                background: btn.primary ? 'var(--gold, #d4a843)' : 'transparent',
                color: btn.primary ? '#141210' : 'var(--cream, #e8dcc8)',
                fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.3,
                opacity: 0, transform: 'translateY(20px)',
              }}>{btn.label}</button>
            ))}
          </div>
        </div>
      </section>
      <PhotoStrip images={strip3} height={280} />
    </WorldSection>

    <WorldSection worldId="wild" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h2 style={{ fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--cream, #e8dcc8)' }}>The Wild</h2>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#8a8070', marginTop: 12 }}>Adventure content — Session 2</p>
      </div>
    </WorldSection>

    <WorldSection worldId="seasons" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h2 style={{ fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--cream, #e8dcc8)' }}>The Seasons</h2>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#8a8070', marginTop: 12 }}>When & Giving Back — Session 2</p>
      </div>
    </WorldSection>

    <WorldSection worldId="system" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h2 style={{ fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--cream, #e8dcc8)' }}>The System</h2>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#8a8070', marginTop: 12 }}>Data & Intelligence — Session 2</p>
      </div>
    </WorldSection>

    <WorldSection worldId="pub-return" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h2 style={{ fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--cream, #e8dcc8)' }}>Back to the Pub</h2>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#8a8070', marginTop: 12 }}>The Lads & Contact — Session 2</p>
      </div>
    </WorldSection>

    {/* Float animation + nav styles */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(8px); }
      }
      .nav-label-short { display: none; }
      [data-splitting] .char { display: inline-block; }
      @media(max-width:640px) {
        .nav-label-full { display: none; }
        .nav-label-short { display: inline; }
      }
      @media(max-width:768px) {
        .photo-strip-responsive { grid-template-columns: repeat(3, 1fr) !important; }
      }
    `}</style>
  </WorldManager>
)
```

- [ ] **Step 4: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds with no errors. Warnings about unused vars are OK.

- [ ] **Step 5: Start dev server and test in browser**

```bash
npm run dev
```

Open the site. Verify:
1. Homepage loads with pub world (warm background)
2. Scrolling transitions background from pub → globe → cities → wild → seasons → system → pub return
3. Particles float and change color/behavior per world
4. Globe still renders and is interactive
5. Hero carousel still works
6. No console errors

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx
git commit -m "feat: integrate WorldManager into homepage — pub and globe worlds live"
```

---

### Task 9: Add IrishSong Video to Pub World

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the video to the pub world section**

In the pub WorldSection in App.jsx, add the video component. Place it after the hero text content, positioned to the right side of the viewport:

Add this inside the pub `WorldSection`, after the hero `</div>` that contains the carousel, and before the closing `</WorldSection>`:

```jsx
{/* Pub ambient video */}
<div style={{
  position: 'absolute',
  bottom: '10%',
  right: '5%',
  zIndex: 3,
  opacity: 0.85,
}}>
  <VideoBackground
    publicId="IrishSong_qqxzzr"
    posterTime={3}
    placement="portrait-frame"
    hasAudio={true}
    isActive={true}
  />
</div>
```

Note: The `isActive` prop should later be wired to the world context so the video pauses when scrolled past. For now, `isActive={true}` works since it's the first section.

- [ ] **Step 2: Test in browser**

Verify:
1. Video poster loads on the right side of the hero
2. Video plays when visible
3. Mute/unmute button works
4. Video is in a phone-shaped portrait frame

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add IrishSong video to pub world hero"
```

---

### Task 10: Dev Server Smoke Test + Deploy

- [ ] **Step 1: Full scroll test**

Start dev server, open browser, scroll the entire page top to bottom. Check:
- [ ] Pub world: warm amber background, dust particles, hero carousel, Irish pub video
- [ ] Globe world: dark navy background, star particles, globe renders
- [ ] Cities world: terracotta tone, dust particles
- [ ] Wild world: forest green, firefly particles
- [ ] Seasons world: purple-ish tone, petal particles
- [ ] System world: near-black, gold constellation particles
- [ ] Pub return: warm amber returns

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: Build succeeds. Check bundle size hasn't blown past budget:

```bash
ls -la dist/assets/*.js | awk '{sum += $5} END {printf "Total JS: %.1f MB\n", sum/1024/1024}'
```

Expected: Under 2MB total JS.

- [ ] **Step 3: Commit all remaining changes and deploy**

```bash
git add -A
git status
git diff --cached --stat
```

Review the diff, then:

```bash
git commit -m "feat: immersive journey session 1 — WorldManager, 7 worlds, particles, video

Pub and Globe worlds fully implemented. Remaining worlds have
placeholder content for Session 2. Full environment transitions
on scroll with crossfading backgrounds, Three.js particles,
and Cloudinary video integration."

git push origin main
```

Vercel auto-deploys on push.
