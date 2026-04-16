// src/worlds/WorldParticles.jsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

// Generate random data once at module level to satisfy react-hooks/purity
const MAX_COUNT = Math.max(...worlds.map((w) => w.particles.count))

const _positions = new Float32Array(MAX_COUNT * 3)
const _velocities = []
for (let i = 0; i < MAX_COUNT; i++) {
  _positions[i * 3] = (Math.random() - 0.5) * 10
  _positions[i * 3 + 1] = (Math.random() - 0.5) * 6
  _positions[i * 3 + 2] = (Math.random() - 0.5) * 4
  _velocities.push({
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.01,
    z: (Math.random() - 0.5) * 0.005,
  })
}

function ParticleField() {
  const { activeWorld } = useWorld()
  const meshRef = useRef()
  const prevWorldRef = useRef(activeWorld.id)
  const opacityRef = useRef(1)

  const positions = useMemo(() => _positions.slice(), [])
  const velocities = useMemo(() => _velocities, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry
    const pos = geo.attributes.position.array
    const { particles } = activeWorld
    const speed = particles.speed

    if (prevWorldRef.current !== activeWorld.id) {
      opacityRef.current = 0
      prevWorldRef.current = activeWorld.id
    }
    opacityRef.current = Math.min(1, opacityRef.current + delta * 2)

    for (let i = 0; i < MAX_COUNT; i++) {
      if (i < particles.count) {
        pos[i * 3] += velocities[i].x * speed * 60 * delta
        pos[i * 3 + 1] += velocities[i].y * speed * 60 * delta
        pos[i * 3 + 2] += velocities[i].z * speed * 60 * delta

        if (Math.abs(pos[i * 3]) > 5) pos[i * 3] *= -0.9
        if (Math.abs(pos[i * 3 + 1]) > 3) pos[i * 3 + 1] *= -0.9
        if (Math.abs(pos[i * 3 + 2]) > 2) pos[i * 3 + 2] *= -0.9

        if (particles.type === 'firefly') {
          pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
        }
        if (
          particles.type === 'petals' ||
          particles.type === 'snow' ||
          particles.type === 'leaves'
        ) {
          pos[i * 3 + 1] -= 0.003 * speed * 60 * delta
          pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001
          if (pos[i * 3 + 1] < -3) pos[i * 3 + 1] = 3
        }
      } else {
        pos[i * 3 + 2] = -100
      }
    }
    geo.attributes.position.needsUpdate = true

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
          count={MAX_COUNT}
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
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
