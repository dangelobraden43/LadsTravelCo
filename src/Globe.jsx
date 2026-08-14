import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import './Globe.css'

// Canonical spot data — derived from src/data/*.js so the Globe can't drift.
import dublinData from './data/dublin'
import spainData from './data/spain'
import romeData from './data/rome'
import australiaData from './data/australia'
import icelandData from './data/iceland'
import pragueData from './data/prague'
import munichData from './data/munich'
import polandData from './data/poland'
import michiganData from './data/michigan'

const FRAMEWORK_DATA = {
  dublin: dublinData,
  spain: spainData,
  rome: romeData,
  australia: australiaData,
  iceland: icelandData,
  prague: pragueData,
  munich: munichData,
  poland: polandData,
  michigan: michiganData,
}

const R = 1.5

/* ===== SPOT COUNTING ===== */
// Same walker as App.jsx countSpots, but bucketed by city/area.
// Any object with `name` AND (`description` || `notes`) is a spot.
// Spots inherit their parent's city when their own city field is empty.
function countSpotsByCity(data) {
  const buckets = {}
  let total = 0
  const walk = (o, parentCity) => {
    if (!o) return
    if (Array.isArray(o)) return o.forEach((x) => walk(x, parentCity))
    if (typeof o !== 'object') return
    const city = o.city || o.area || parentCity
    if (o.name && (o.description || o.notes)) {
      const bucket = city || '__primary__'
      buckets[bucket] = (buckets[bucket] || 0) + 1
      total += 1
    }
    Object.values(o).forEach((v) => walk(v, city || parentCity))
  }
  walk(data, null)
  return { buckets, total }
}

/* ===== ATTRIBUTION ===== */
// Per Brady's spec: every spot maps to exactly one pin.
// - A spot tagged to a city that has its own pin → counted on that city's pin.
// - All other spots in the framework (untagged, sub-regions without pins,
//   the framework's anchor city) → folded into the framework's PRIMARY pin.
// `subs` maps pinCity → bucket key in the data file.
const PIN_ATTRIBUTION = {
  dublin: { primary: 'Dublin', subs: { Galway: 'Galway' } },
  spain: { primary: 'Barcelona', subs: { Madrid: 'Madrid' } },
  rome: { primary: 'Rome', subs: {} },
  australia: { primary: 'Sydney', subs: { Tasmania: 'Hobart' } },
  iceland: { primary: 'Reykjavik', subs: {} },
  prague: { primary: 'Prague', subs: { Vienna: 'Vienna' } },
  munich: { primary: 'Munich', subs: {} },
  poland: { primary: 'Krakow', subs: {} },
  michigan: { primary: 'Michigan', subs: {} },
}

function derivePinCount(slug, pinCity) {
  const attr = PIN_ATTRIBUTION[slug]
  if (!attr) return 0
  const { buckets, total } = countSpotsByCity(FRAMEWORK_DATA[slug])
  if (pinCity === attr.primary) {
    let subTotal = 0
    for (const bucketKey of Object.values(attr.subs)) {
      subTotal += buckets[bucketKey] || 0
    }
    return total - subTotal
  }
  const bucketKey = attr.subs[pinCity]
  return bucketKey ? buckets[bucketKey] || 0 : 0
}

/* ===== CITIES ===== */
// Validated cities: count derived from data, validated: true, gold pin.
// Research-only: no framework yet, validated: false, copper pin, no count shown.
// Cusco: comingSoon, separate copper treatment.
const VALIDATED_PINS = [
  { city: 'Dublin', lat: 53.35, lng: -6.26, slug: 'dublin', primary: true, showLabel: true },
  { city: 'Galway', lat: 53.27, lng: -9.06, slug: 'dublin' },
  { city: 'Barcelona', lat: 41.39, lng: 2.17, slug: 'spain', primary: true, showLabel: true },
  { city: 'Madrid', lat: 40.42, lng: -3.7, slug: 'spain' },
  { city: 'Rome', lat: 41.9, lng: 12.5, slug: 'rome', primary: true, showLabel: true },
  { city: 'Sydney', lat: -33.87, lng: 151.21, slug: 'australia', primary: true, showLabel: true },
  { city: 'Tasmania', lat: -42.88, lng: 147.33, slug: 'australia' },
  { city: 'Reykjavik', lat: 64.15, lng: -21.94, slug: 'iceland', primary: true, showLabel: true },
  { city: 'Prague', lat: 50.08, lng: 14.44, slug: 'prague', primary: true, showLabel: true },
  { city: 'Vienna', lat: 48.21, lng: 16.37, slug: 'prague' },
  { city: 'Munich', lat: 48.14, lng: 11.58, slug: 'munich', primary: true },
  { city: 'Krakow', lat: 50.06, lng: 19.94, slug: 'poland', primary: true },
  // Michigan: new pin, anchored at Grand Rapids
  { city: 'Michigan', lat: 42.96, lng: -85.67, slug: 'michigan', primary: true, showLabel: true },
].map((c) => ({
  ...c,
  n: derivePinCount(c.slug, c.city),
  validated: true,
}))

const RESEARCH_PINS = [
  { city: 'Costa Rica', lat: 9.62, lng: -84.63 },
  { city: 'Vancouver', lat: 49.28, lng: -123.12 },
  { city: 'Chicago', lat: 41.88, lng: -87.63 },
  { city: 'San Juan', lat: 18.47, lng: -66.11 },
  { city: 'Seattle', lat: 47.61, lng: -122.33 },
  { city: 'Smoky Mtns', lat: 35.61, lng: -83.43 },
  { city: 'Phoenix', lat: 33.45, lng: -112.07 },
].map((c) => ({ ...c, validated: false }))

const COMING_SOON_PINS = [{ city: 'Cusco', lat: -13.52, lng: -71.97, comingSoon: true }]

const CITIES = [...VALIDATED_PINS, ...RESEARCH_PINS, ...COMING_SOON_PINS]

// Sizing reference: largest validated pin (currently Barcelona at 30).
const MAX_SPOTS = Math.max(...VALIDATED_PINS.map((c) => c.n))

const ARCS = [
  { from: [53.35, -6.26], to: [53.27, -9.06] }, // Dublin → Galway
  { from: [41.39, 2.17], to: [40.42, -3.7] }, // Barcelona → Madrid
  { from: [-33.87, 151.21], to: [-42.88, 147.33] }, // Sydney → Tasmania
  { from: [50.08, 14.44], to: [48.21, 16.37] }, // Prague → Vienna
]

function ll2v(lat, lng, r) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

/* ===== STARS ===== */
const STAR_POSITIONS = new Float32Array(1800 * 3)
for (let i = 0; i < 1800; i++) {
  STAR_POSITIONS[i * 3] = (Math.random() - 0.5) * 30
  STAR_POSITIONS[i * 3 + 1] = (Math.random() - 0.5) * 30
  STAR_POSITIONS[i * 3 + 2] = (Math.random() - 0.5) * 30
}

function Stars() {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(STAR_POSITIONS, 3))
    return g
  }, [])

  return (
    <points>
      <primitive object={geom} attach="geometry" />
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ===== EARTH ===== */
function Earth() {
  const earthTex = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  )
  const bumpTex = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  )

  return (
    <mesh>
      <sphereGeometry args={[R, 64, 64]} />
      <meshPhongMaterial
        map={earthTex}
        bumpMap={bumpTex}
        bumpScale={0.008}
        specular={new THREE.Color(0x222222)}
        shininess={12}
      />
    </mesh>
  )
}

/* ===== ATMOSPHERE ===== */
function Atmosphere() {
  const shaderRef = useRef()

  const uniforms = useMemo(() => ({}), [])

  const vertexShader = `
    varying float intensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
      intensity = pow(1.0 - dot(vNormal, vNormel), 2.5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    varying float intensity;
    void main() {
      vec3 gold = vec3(0.831, 0.659, 0.263);
      gl_FragColor = vec4(gold, intensity * 0.55);
    }
  `

  return (
    <mesh renderOrder={2}>
      <sphereGeometry args={[R * 1.08, 64, 64]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.NormalBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

/* ===== PIN ===== */
// Linear with high floor: smallest validated pin (Tasmania, 3) is clearly
// visible at 0.020, largest (Barcelona, 30) caps at 0.036. Research-only
// and coming-soon pins use a uniform small size, subordinate to validated.
const VALIDATED_PIN_MIN = 0.02
const VALIDATED_PIN_RANGE = 0.016
const RESEARCH_PIN_SIZE = 0.014

function pinSizeFor(city) {
  if (city.validated === false || city.comingSoon) return RESEARCH_PIN_SIZE
  return VALIDATED_PIN_MIN + (city.n / MAX_SPOTS) * VALIDATED_PIN_RANGE
}

function Pin({ city, index, entered, hovered, setHovered, onPinClick }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const pinSize = pinSizeFor(city)
  const isHovered = hovered === city.city
  const [appeared, setAppeared] = useState(false)
  const isValidated = city.validated !== false && !city.comingSoon

  const pos = useMemo(() => {
    const p = ll2v(city.lat, city.lng, R + 0.01)
    return [p.x, p.y, p.z]
  }, [city.lat, city.lng])

  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => setAppeared(true), index * 80)
    return () => clearTimeout(t)
  }, [entered, index])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const target = appeared ? (isHovered ? pinSize * 1.5 : pinSize) : 0.001
      const cur = meshRef.current.scale.x
      meshRef.current.scale.setScalar(cur + (target - cur) * 0.12)
    }
    if (ringRef.current && appeared) {
      ringRef.current.material.opacity = 0.2 + Math.sin(clock.elapsedTime * 2) * 0.2
    }
  })

  // Validated: gold. Research-only + comingSoon: copper (subordinate).
  const pinColor = isValidated ? '#d4a843' : '#b8886e'

  return (
    <group position={pos}>
      {/* Pin sphere */}
      <mesh
        ref={meshRef}
        scale={0.001}
        renderOrder={1}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(city.city)
          document.body.style.cursor = city.slug ? 'pointer' : 'default'
        }}
        onPointerOut={() => {
          setHovered(null)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (city.slug) onPinClick(city.slug)
        }}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={pinColor}
          emissive={pinColor}
          emissiveIntensity={isHovered ? 1.0 : 0.5}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Pulsing ring */}
      {appeared && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} scale={pinSize * 2}>
          <ringGeometry args={[0.8, 1.0, 24]} />
          <meshBasicMaterial color={pinColor} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Point light glow */}
      <pointLight color={pinColor} intensity={0.3} distance={0.4} />
    </group>
  )
}

/* ===== ARC ===== */
function Arc({ arc, index, entered }) {
  const ref = useRef()
  const [appeared, setAppeared] = useState(false)

  const geom = useMemo(() => {
    const p1 = ll2v(arc.from[0], arc.from[1], R + 0.02)
    const p2 = ll2v(arc.to[0], arc.to[1], R + 0.02)
    const mid = p1.clone().add(p2).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(R * 1.25)
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(40))
  }, [arc])

  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => setAppeared(true), CITIES.length * 80 + 300 + index * 200)
    return () => clearTimeout(t)
  }, [entered, index])

  useFrame(() => {
    if (!ref.current) return
    ref.current.material.opacity += ((appeared ? 0.45 : 0) - ref.current.material.opacity) * 0.06
  })

  return (
    <line ref={ref}>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#d4a843" transparent opacity={0} />
    </line>
  )
}

/* ===== HOVER LABEL (drei Html) ===== */
function CityLabel({ city, hovered }) {
  const isHovered = hovered === city.city
  const pos = useMemo(() => {
    const p = ll2v(city.lat, city.lng, R + 0.05)
    return [p.x, p.y, p.z]
  }, [city.lat, city.lng])

  if (!isHovered && !city.showLabel) return null

  return (
    <group position={pos}>
      {/* Use drei Html for labels — separate from pin raycasting */}
      <mesh visible={false}>
        <boxGeometry args={[0.001, 0.001, 0.001]} />
        <meshBasicMaterial />
      </mesh>
      {isHovered ? <group>{/* Tooltip rendered via CSS class */}</group> : <></>}
    </group>
  )
}

/* ===== SCENE ===== */
function GlobeScene({ entered, onNavigate, onHover }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    if (onHover) onHover(hovered)
  }, [hovered, onHover])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.001
  })

  return (
    <>
      {/* Lighting — balanced day/night so earth stays visible at all rotations */}
      <ambientLight color="#b8c4d4" intensity={0.9} />
      <directionalLight color="#ffffff" intensity={1.4} position={[3, 2, 6]} />
      <directionalLight color="#4a6080" intensity={0.5} position={[-4, -1, 2]} />

      <Stars />

      <group ref={groupRef}>
        <Earth />
        <Atmosphere />

        {CITIES.map((c, i) => (
          <Pin
            key={c.city}
            city={c}
            index={i}
            entered={entered}
            hovered={hovered}
            setHovered={setHovered}
            onPinClick={onNavigate}
          />
        ))}

        {ARCS.map((a, i) => (
          <Arc key={i} arc={a} index={i} entered={entered} />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        minDistance={2.5}
        maxDistance={5}
      />
    </>
  )
}

/* ===== TOOLTIP OVERLAY ===== */
function TooltipOverlay({ hovered }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const city = hovered ? CITIES.find((c) => c.city === hovered) : null

  useEffect(() => {
    const handler = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  if (!city) return null

  let label
  if (city.comingSoon) label = 'Coming soon'
  else if (city.validated === false) label = 'Explored · framework coming'
  else label = `${city.n} validated spots`

  return (
    <div className="globe-tooltip-fixed" style={{ left: mouse.x + 14, top: mouse.y - 10 }}>
      <div className="globe-tooltip-city">{city.city}</div>
      <div className="globe-tooltip-count">{label}</div>
      {city.slug && <div className="globe-tooltip-cta">Click to explore &rarr;</div>}
    </div>
  )
}

/* ===== WRAPPER ===== */
export default function Globe() {
  const wrapRef = useRef()
  const navigate = useNavigate()
  const [inView, setInView] = useState(false)
  const [entered, setEntered] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setEntered(true), 600)
    return () => clearTimeout(t)
  }, [inView])

  const handleNavigate = useCallback(
    (slug) => {
      navigate('/' + slug)
    },
    [navigate]
  )

  return (
    <div ref={wrapRef} className={`globe-wrap${inView ? ' globe-visible' : ''}`}>
      {inView && (
        <Canvas
          camera={{ position: [-2, 1.2, 3], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          style={{ background: 'transparent' }}
        >
          <GlobeScene entered={entered} onNavigate={handleNavigate} onHover={setHovered} />
        </Canvas>
      )}
      <TooltipOverlay hovered={hovered} />
      <div className="globe-hint">DRAG TO EXPLORE &middot; CLICK A CITY TO GO DEEPER</div>
    </div>
  )
}
