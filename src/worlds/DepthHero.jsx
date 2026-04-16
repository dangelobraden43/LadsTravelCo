// src/worlds/DepthHero.jsx
// Living 3D photo hero — parallax depth effect with mouse tracking and particles
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const HERO_PHOTOS = [
  '/images/hero-enhanced/colosseum.webp',
  '/images/hero-enhanced/opera.webp',
  '/images/hero-enhanced/iceland.webp',
  '/images/hero-enhanced/cliffs.webp',
]

const CYCLE_INTERVAL = 7000 // ms between photo transitions

// Vertex shader — creates depth displacement based on luminance
const vertexShader = `
  varying vec2 vUv;
  varying float vDepth;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDepthScale;

  void main() {
    vUv = uv;

    // Create subtle wave displacement
    vec3 pos = position;
    float wave = sin(pos.x * 2.0 + uTime * 0.3) * cos(pos.y * 2.0 + uTime * 0.2) * 0.02;
    pos.z += wave;

    // Mouse-reactive parallax — displace based on UV distance from mouse
    vec2 mouseOffset = (uMouse - 0.5) * 2.0;
    float dist = length(uv - 0.5);
    pos.x += mouseOffset.x * dist * 0.08 * uDepthScale;
    pos.y += mouseOffset.y * dist * 0.08 * uDepthScale;

    vDepth = dist;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Fragment shader — renders image with depth-based effects
const fragmentShader = `
  varying vec2 vUv;
  varying float vDepth;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec2 uMouse;

  void main() {
    // Subtle UV distortion based on mouse for parallax feel
    vec2 uv = vUv;
    vec2 mouseOffset = (uMouse - 0.5) * 0.015;
    float centerDist = length(uv - 0.5);
    uv += mouseOffset * (1.0 - centerDist);

    vec4 color = texture2D(uTexture, uv);

    // Subtle vignette
    float vignette = 1.0 - centerDist * 0.4;
    color.rgb *= vignette;

    // Slight chromatic shift at edges for depth feel
    float shift = centerDist * 0.002;
    float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
    float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
    color.r = mix(color.r, r, 0.3);
    color.b = mix(color.b, b, 0.3);

    color.a *= uOpacity;
    gl_FragColor = color;
  }
`

function DepthImage({ textureUrl, isActive, mousePos }) {
  const meshRef = useRef()
  const opacityRef = useRef(isActive ? 1 : 0)
  const texture = useLoader(THREE.TextureLoader, textureUrl)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uOpacity: { value: isActive ? 1 : 0 },
      uDepthScale: { value: 1.0 },
    }),
    [texture]
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material

    // Smooth opacity transition
    const target = isActive ? 1 : 0
    opacityRef.current += (target - opacityRef.current) * 0.03
    mat.uniforms.uOpacity.value = opacityRef.current

    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uMouse.value.lerp(new THREE.Vector2(mousePos.current.x, mousePos.current.y), 0.05)
  })

  // Scale plane to fill viewport while maintaining aspect ratio
  const aspect = texture.image ? texture.image.width / texture.image.height : 16 / 9
  const viewAspect = viewport.width / viewport.height
  let planeW, planeH
  if (aspect > viewAspect) {
    planeH = viewport.height * 1.15
    planeW = planeH * aspect
  } else {
    planeW = viewport.width * 1.15
    planeH = planeW / aspect
  }

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[planeW, planeH, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// Pre-generate particle data outside component (satisfies react-hooks/purity)
const HERO_PARTICLE_COUNT = 60
const HERO_PARTICLE_POSITIONS = new Float32Array(HERO_PARTICLE_COUNT * 3)
const HERO_PARTICLE_VELOCITIES = []
for (let i = 0; i < HERO_PARTICLE_COUNT; i++) {
  HERO_PARTICLE_POSITIONS[i * 3] = (Math.random() - 0.5) * 8
  HERO_PARTICLE_POSITIONS[i * 3 + 1] = (Math.random() - 0.5) * 5
  HERO_PARTICLE_POSITIONS[i * 3 + 2] = Math.random() * 2 + 0.5
  HERO_PARTICLE_VELOCITIES.push({
    x: (Math.random() - 0.5) * 0.005,
    y: (Math.random() - 0.5) * 0.005 + 0.002,
    z: (Math.random() - 0.5) * 0.002,
  })
}

// Floating particles that emanate from the scene
function HeroParticles({ mousePos }) {
  const pointsRef = useRef()
  const positions = HERO_PARTICLE_POSITIONS
  const velocities = HERO_PARTICLE_VELOCITIES

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < HERO_PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i].x
      pos[i * 3 + 1] += velocities[i].y
      pos[i * 3 + 2] += velocities[i].z

      // Gentle mouse influence
      const mx = (mousePos.current.x - 0.5) * 0.002
      const my = (mousePos.current.y - 0.5) * 0.002
      pos[i * 3] += mx
      pos[i * 3 + 1] += my

      // Reset particles that drift too far
      if (pos[i * 3 + 1] > 3.5) {
        pos[i * 3] = (Math.random() - 0.5) * 8
        pos[i * 3 + 1] = -3
        pos[i * 3 + 2] = Math.random() * 2 + 0.5
      }
      if (Math.abs(pos[i * 3]) > 5) {
        pos[i * 3] *= -0.5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Pulse opacity
    pointsRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={HERO_PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c9a84c"
        size={0.04}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function Scene({ activeIndex, mousePos }) {
  return (
    <>
      {HERO_PHOTOS.map((url, i) => (
        <DepthImage key={url} textureUrl={url} isActive={i === activeIndex} mousePos={mousePos} />
      ))}
      <HeroParticles mousePos={mousePos} />
    </>
  )
}

export default function DepthHero({ children }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mousePos = useRef({ x: 0.5, y: 0.5 })

  // Cycle through photos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_PHOTOS.length)
    }, CYCLE_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Track mouse position (normalized 0-1)
  const handleMouseMove = useCallback((e) => {
    mousePos.current.x = e.clientX / window.innerWidth
    mousePos.current.y = 1 - e.clientY / window.innerHeight
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 700,
        overflow: 'hidden',
      }}
    >
      {/* Three.js depth canvas */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          style={{ background: '#141210' }}
        >
          <Scene activeIndex={activeIndex} mousePos={mousePos} />
        </Canvas>
      </div>

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(20,18,16,0.3) 0%, rgba(20,18,16,0.1) 30%, rgba(20,18,16,0.15) 60%, rgba(20,18,16,0.7) 85%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>

      {/* Photo indicator dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 32,
          zIndex: 3,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {HERO_PHOTOS.map((_, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              width: activeIndex === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: activeIndex === i ? '#c9a84c' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
            }}
          />
        ))}
      </div>
    </div>
  )
}
