import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import './Globe.css'

const R = 1.5
const MAX_SPOTS = 123

const CITIES = [
  { city: 'Sydney', n: 123, lat: -33.87, lng: 151.21, slug: 'australia', showLabel: true },
  { city: 'Barcelona', n: 115, lat: 41.39, lng: 2.17, slug: 'spain', showLabel: true },
  { city: 'Rome', n: 43, lat: 41.9, lng: 12.5, slug: 'rome', showLabel: true },
  { city: 'Dublin', n: 39, lat: 53.35, lng: -6.26, slug: 'dublin', showLabel: true },
  { city: 'Prague', n: 38, lat: 50.08, lng: 14.44, slug: 'prague', showLabel: true },
  { city: 'Vienna', n: 37, lat: 48.21, lng: 16.37, slug: 'prague' },
  { city: 'Costa Rica', n: 28, lat: 9.62, lng: -84.63 },
  { city: 'Tasmania', n: 27, lat: -42.88, lng: 147.33, slug: 'australia' },
  { city: 'Vancouver', n: 22, lat: 49.28, lng: -123.12 },
  { city: 'Chicago', n: 15, lat: 41.88, lng: -87.63 },
  { city: 'Galway', n: 15, lat: 53.27, lng: -9.06, slug: 'dublin' },
  { city: 'San Juan', n: 14, lat: 18.47, lng: -66.11 },
  { city: 'Seattle', n: 14, lat: 47.61, lng: -122.33 },
  { city: 'Smoky Mtns', n: 8, lat: 35.61, lng: -83.43 },
  { city: 'Phoenix', n: 7, lat: 33.45, lng: -112.07 },
  { city: 'Reykjavik', n: 0, lat: 64.15, lng: -21.94, slug: 'iceland' },
  { city: 'Munich', n: 0, lat: 48.14, lng: 11.58, slug: 'munich' },
  { city: 'Krakow', n: 0, lat: 50.06, lng: 19.94, slug: 'poland' },
  { city: 'Bangkok', n: 0, lat: 13.76, lng: 100.5, slug: 'thailand' },
  { city: 'Charleston', n: 0, lat: 32.78, lng: -79.93, slug: 'charleston' },
  { city: 'Cusco', n: 0, lat: -13.52, lng: -71.97, comingSoon: true },
]

const ARCS = [
  { from: [53.35, -6.26], to: [53.27, -9.06] },
  { from: [41.39, 2.17], to: [40.42, -3.7] },
  { from: [-33.87, 151.21], to: [-42.88, 147.33] },
  { from: [50.08, 14.44], to: [48.21, 16.37] },
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
function Stars() {
  const geom = useMemo(() => {
    const positions = new Float32Array(1800 * 3)
    for (let i = 0; i < 1800; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
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
      intensity = pow(0.75 - dot(vNormal, vNormel), 3.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    varying float intensity;
    void main() {
      vec3 gold = vec3(0.831, 0.659, 0.263);
      gl_FragColor = vec4(gold * intensity * 0.5, intensity * 0.45);
    }
  `

  return (
    <mesh>
      <sphereGeometry args={[R * 1.06, 64, 64]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </mesh>
  )
}

/* ===== PIN ===== */
function Pin({ city, index, entered, hovered, setHovered, onPinClick }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const pinSize = 0.012 + (city.n / MAX_SPOTS) * 0.022
  const isHovered = hovered === city.city
  const [appeared, setAppeared] = useState(false)
  const isComingSoon = city.comingSoon

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

  const pinColor = isComingSoon ? '#b8886e' : '#d4a843'

  return (
    <group position={pos}>
      {/* Pin sphere */}
      <mesh
        ref={meshRef}
        scale={0.001}
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
      {isHovered ? (
        <group>
          {/* Tooltip rendered via CSS class */}
        </group>
      ) : (
        <></>
      )}
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
      {/* Lighting */}
      <ambientLight color="#ffffff" intensity={0.3} />
      <directionalLight color="#fff5e0" intensity={1.4} position={[5, 3, 5]} />
      <directionalLight color="#4466aa" intensity={0.25} position={[-5, -2, -3]} />

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

  return (
    <div
      className="globe-tooltip-fixed"
      style={{ left: mouse.x + 14, top: mouse.y - 10 }}
    >
      <div className="globe-tooltip-city">{city.city}</div>
      <div className="globe-tooltip-count">
        {city.comingSoon ? 'Coming May 2026' : `${city.n} validated spots`}
      </div>
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
