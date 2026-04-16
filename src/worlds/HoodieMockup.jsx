import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Canvas texture — draws the hoodie design on an off-screen canvas  */
/* ------------------------------------------------------------------ */

function createHoodieTexture(side = 'front') {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(0, 0, size, size)

  // Subtle fabric grain — tiny noise lines
  ctx.globalAlpha = 0.04
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#000000'
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.random() * 6 - 3, y + Math.random() * 6 - 3)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Center seam line
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(size / 2, 80)
  ctx.lineTo(size / 2, size - 60)
  ctx.stroke()

  if (side === 'front') {
    drawFront(ctx, size)
  } else {
    drawBack(ctx, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function drawFront(ctx, size) {
  const cx = size / 2

  // --- Pink ribbon ---
  drawRibbon(ctx, cx, 240, 60)

  // --- "THE LADS" ---
  ctx.fillStyle = '#c9a84c'
  ctx.font = 'bold 64px serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '8px'
  ctx.fillText('THE LADS', cx, 380)

  // --- "TRAVEL CO." ---
  ctx.font = 'bold 44px serif'
  ctx.fillText('TRAVEL CO.', cx, 435)

  // Decorative line under TRAVEL CO.
  ctx.strokeStyle = '#c9a84c'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx - 140, 452)
  ctx.lineTo(cx + 140, 452)
  ctx.stroke()

  // --- Lion silhouette (left of MÜNCHEN) ---
  drawLion(ctx, cx - 130, 518, 28)

  // --- "MÜNCHEN 2026" ---
  ctx.fillStyle = '#e8dcc8'
  ctx.font = '600 28px sans-serif'
  ctx.letterSpacing = '4px'
  ctx.fillText('MÜNCHEN 2026', cx + 10, 530)

  // --- Pretzel icon (right of MÜNCHEN) ---
  drawPretzel(ctx, cx + 175, 518, 18)

  // --- "100% TO CHARITY" ---
  ctx.fillStyle = '#c9a84c'
  ctx.font = '600 18px sans-serif'
  ctx.letterSpacing = '3px'
  ctx.fillText('100% TO CHARITY', cx, 620)

  // Subtle bottom border accent
  ctx.strokeStyle = 'rgba(201,168,76,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - 100, 640)
  ctx.lineTo(cx + 100, 640)
  ctx.stroke()
}

function drawBack(ctx, size) {
  const cx = size / 2

  // --- "FALL 2026" ---
  ctx.fillStyle = '#c9a84c'
  ctx.font = 'bold 56px serif'
  ctx.textAlign = 'center'
  ctx.fillText('FALL 2026', cx, 340)

  // Decorative line
  ctx.strokeStyle = '#c9a84c'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx - 120, 358)
  ctx.lineTo(cx + 120, 358)
  ctx.stroke()

  // --- Charity name ---
  ctx.fillStyle = '#e8dcc8'
  ctx.font = '600 20px sans-serif'
  ctx.fillText('GINNY L. CLEMENTS', cx, 410)
  ctx.font = '600 18px sans-serif'
  ctx.fillText('BREAST CANCER RESEARCH', cx, 440)

  // --- University ---
  ctx.fillStyle = '#8a8070'
  ctx.font = '400 15px sans-serif'
  ctx.fillText('UNIVERSITY OF ARIZONA', cx, 475)

  // --- Pink ribbon (smaller, centered) ---
  drawRibbon(ctx, cx, 540, 35)

  // --- "THE LADS TRAVEL CO." small at bottom ---
  ctx.fillStyle = 'rgba(201,168,76,0.5)'
  ctx.font = '600 14px sans-serif'
  ctx.letterSpacing = '3px'
  ctx.fillText('THE LADS TRAVEL CO.', cx, 620)
}

function drawRibbon(ctx, cx, cy, scale) {
  ctx.save()
  ctx.translate(cx, cy)

  const s = scale / 40 // normalize to a base scale

  ctx.fillStyle = '#FF69B4'
  ctx.strokeStyle = '#FF1493'
  ctx.lineWidth = 2 * s

  // Left loop
  ctx.beginPath()
  ctx.moveTo(0, -10 * s)
  ctx.bezierCurveTo(-35 * s, -55 * s, -55 * s, -10 * s, -5 * s, 20 * s)
  ctx.fill()
  ctx.stroke()

  // Right loop
  ctx.beginPath()
  ctx.moveTo(0, -10 * s)
  ctx.bezierCurveTo(35 * s, -55 * s, 55 * s, -10 * s, 5 * s, 20 * s)
  ctx.fill()
  ctx.stroke()

  // Tail left
  ctx.beginPath()
  ctx.moveTo(-5 * s, 20 * s)
  ctx.lineTo(-25 * s, 55 * s)
  ctx.lineTo(-10 * s, 40 * s)
  ctx.lineTo(0, 50 * s)
  ctx.fill()

  // Tail right
  ctx.beginPath()
  ctx.moveTo(5 * s, 20 * s)
  ctx.lineTo(25 * s, 55 * s)
  ctx.lineTo(10 * s, 40 * s)
  ctx.lineTo(0, 50 * s)
  ctx.fill()

  ctx.restore()
}

function drawLion(ctx, cx, cy, scale) {
  ctx.save()
  ctx.translate(cx, cy)
  const s = scale / 24

  ctx.fillStyle = '#0076B6'
  ctx.strokeStyle = '#0076B6'
  ctx.lineWidth = 1.5 * s

  // Mane (circle)
  ctx.beginPath()
  ctx.arc(0, -4 * s, 16 * s, 0, Math.PI * 2)
  ctx.fill()

  // Head (smaller circle)
  ctx.fillStyle = '#0090d8'
  ctx.beginPath()
  ctx.arc(0, -4 * s, 10 * s, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  ctx.fillStyle = '#2a2a2a'
  ctx.beginPath()
  ctx.arc(-4 * s, -6 * s, 1.5 * s, 0, Math.PI * 2)
  ctx.arc(4 * s, -6 * s, 1.5 * s, 0, Math.PI * 2)
  ctx.fill()

  // Nose
  ctx.fillStyle = '#2a2a2a'
  ctx.beginPath()
  ctx.moveTo(-2 * s, -1 * s)
  ctx.lineTo(2 * s, -1 * s)
  ctx.lineTo(0, 2 * s)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

function drawPretzel(ctx, cx, cy, scale) {
  ctx.save()
  ctx.translate(cx, cy)
  const s = scale / 16

  ctx.strokeStyle = '#b8886e'
  ctx.lineWidth = 2.5 * s
  ctx.lineCap = 'round'

  // Left loop
  ctx.beginPath()
  ctx.arc(-6 * s, -2 * s, 8 * s, 0.3, Math.PI + 0.3)
  ctx.stroke()

  // Right loop
  ctx.beginPath()
  ctx.arc(6 * s, -2 * s, 8 * s, -0.3, Math.PI - 0.3)
  ctx.stroke()

  // Cross bars
  ctx.beginPath()
  ctx.moveTo(-8 * s, 8 * s)
  ctx.lineTo(4 * s, -10 * s)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(8 * s, 8 * s)
  ctx.lineTo(-4 * s, -10 * s)
  ctx.stroke()

  // Salt dots
  ctx.fillStyle = '#e8dcc8'
  ctx.globalAlpha = 0.5
  ;[
    [-3, -6],
    [3, -6],
    [0, 2],
    [-6, 4],
    [6, 4],
  ].forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x * s, y * s, 1.2 * s, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1

  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Hoodie 3D mesh — curved plane with hood geometry                  */
/* ------------------------------------------------------------------ */

function HoodieBody({ frontTexture, backTexture }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const baseSpeed = 0.3
  const hoverSpeed = 0.7

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const speed = hovered ? hoverSpeed : baseSpeed
    groupRef.current.rotation.y += delta * speed
  })

  // Curved plane geometry for the hoodie body
  const bodyGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.4, 3, 32, 32)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      // Curve outward slightly — like fabric on a form
      const z = Math.sin(x * 0.8) * 0.15 + Math.cos(y * 0.3) * 0.05
      pos.setZ(i, z)
      // Slight flare at the bottom
      const flare = Math.max(0, -y - 0.8) * 0.08
      pos.setX(i, x + Math.sign(x) * flare)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  const backGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.4, 3, 32, 32)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = -(Math.sin(x * 0.8) * 0.15 + Math.cos(y * 0.3) * 0.05)
      pos.setZ(i, z)
      const flare = Math.max(0, -y - 0.8) * 0.08
      pos.setX(i, x + Math.sign(x) * flare)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Hood shape
  const hoodGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.9, 0)
    shape.quadraticCurveTo(-1.0, 0.7, -0.4, 1.1)
    shape.quadraticCurveTo(0, 1.3, 0.4, 1.1)
    shape.quadraticCurveTo(1.0, 0.7, 0.9, 0)

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Sleeve stubs
  const sleeveGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.28, 0.35, 1.0, 12, 1, true)
  }, [])

  const fabricMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      roughness: 0.85,
      metalness: 0.05,
    })
  }, [])

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Front face */}
      <mesh geometry={bodyGeometry} position={[0, -0.2, 0]}>
        <meshStandardMaterial
          map={frontTexture}
          roughness={0.82}
          metalness={0.05}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back face */}
      <mesh geometry={backGeometry} position={[0, -0.2, 0]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial
          map={backTexture}
          roughness={0.82}
          metalness={0.05}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Hood */}
      <mesh geometry={hoodGeometry} position={[0, 1.25, -0.175]} material={fabricMaterial} />

      {/* Left sleeve */}
      <mesh
        geometry={sleeveGeo}
        position={[-1.4, 0.4, 0]}
        rotation={[0, 0, -0.6]}
        material={fabricMaterial}
      />

      {/* Right sleeve */}
      <mesh
        geometry={sleeveGeo}
        position={[1.4, 0.4, 0]}
        rotation={[0, 0, 0.6]}
        material={fabricMaterial}
      />

      {/* Glow on hover */}
      {hovered && <pointLight position={[0, 0, 2]} intensity={0.6} color="#c9a84c" distance={5} />}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Gold particles                                                     */
/* ------------------------------------------------------------------ */

// Pre-generated particle data (module-level, avoids React purity rules)
const PARTICLE_COUNT = 24
const PARTICLE_DATA = Array.from({ length: PARTICLE_COUNT }, () => ({
  position: [(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4],
  speed: 0.2 + Math.random() * 0.4,
  offset: Math.random() * Math.PI * 2,
  size: 0.02 + Math.random() * 0.03,
}))
const PARTICLE_POSITIONS = new Float32Array(PARTICLE_DATA.flatMap((p) => p.position))
const PARTICLE_SIZES = new Float32Array(PARTICLE_DATA.map((p) => p.size))

function GoldParticles() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = PARTICLE_DATA[i]
      const i3 = i * 3
      pos[i3] = p.position[0] + Math.sin(t * p.speed + p.offset) * 0.5
      pos[i3 + 1] = p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.3
      pos[i3 + 2] = p.position[2] + Math.sin(t * p.speed * 0.5 + p.offset * 2) * 0.3
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={PARTICLE_POSITIONS}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={PARTICLE_SIZES}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c9a84c"
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene — composes hoodie + lights + particles                      */
/* ------------------------------------------------------------------ */

function Scene() {
  const frontTexture = useMemo(() => createHoodieTexture('front'), [])
  const backTexture = useMemo(() => createHoodieTexture('back'), [])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#c9a84c" />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#FF69B4" distance={8} />

      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
        <HoodieBody frontTexture={frontTexture} backTexture={backTexture} />
      </Float>

      <GoldParticles />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Presentation wrapper                                               */
/* ------------------------------------------------------------------ */

const wrapperStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '2rem 0',
}

const canvasContainerStyle = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: '20px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, rgba(20,18,16,0.9) 0%, rgba(28,25,21,0.95) 100%)',
  border: '1px solid rgba(201,168,76,0.12)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
}

const badgeStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'rgba(201,168,76,0.15)',
  border: '1px solid rgba(201,168,76,0.3)',
  color: '#c9a84c',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '2px',
  padding: '6px 14px',
  borderRadius: '100px',
  zIndex: 10,
}

const labelStyle = {
  textAlign: 'center',
  marginTop: '1.5rem',
  fontFamily: "'EB Garamond', serif",
  fontSize: '1.4rem',
  color: '#c9a84c',
  letterSpacing: '3px',
  fontWeight: 600,
}

const subtitleStyle = {
  textAlign: 'center',
  marginTop: '0.5rem',
  fontFamily: "'Outfit', sans-serif",
  fontSize: '0.85rem',
  color: '#8a8070',
  lineHeight: 1.5,
  maxWidth: '400px',
  margin: '0.5rem auto 0',
}

export default function HoodieMockup() {
  return (
    <div style={wrapperStyle}>
      <div style={canvasContainerStyle}>
        <div style={badgeStyle}>COMING SOON</div>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </div>
      <div style={labelStyle}>FALL 2026 — LIMITED EDITION</div>
      <div style={subtitleStyle}>100% of proceeds to Ginny L. Clements Breast Cancer Research</div>
    </div>
  )
}
