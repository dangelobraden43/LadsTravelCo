import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import './Globe.css';

const R = 1.5;

const CITIES = [
  { city: 'Sydney', n: 123, lat: -33.87, lng: 151.21, link: 'australia-nz.html' },
  { city: 'Barcelona', n: 115, lat: 41.39, lng: 2.17, link: 'spain.html' },
  { city: 'Rome', n: 43, lat: 41.90, lng: 12.50, link: 'italy.html' },
  { city: 'Dublin', n: 39, lat: 53.35, lng: -6.26, link: '/dublin' },
  { city: 'Prague', n: 38, lat: 50.08, lng: 14.44, link: 'prague-vienna.html' },
  { city: 'Vienna', n: 37, lat: 48.21, lng: 16.37, link: 'prague-vienna.html' },
  { city: 'Costa Rica', n: 28, lat: 9.62, lng: -84.63 },
  { city: 'Tasmania', n: 27, lat: -42.88, lng: 147.33, link: 'australia-nz.html' },
  { city: 'Vancouver', n: 22, lat: 49.28, lng: -123.12 },
  { city: 'Chicago', n: 15, lat: 41.88, lng: -87.63 },
  { city: 'Galway', n: 15, lat: 53.27, lng: -9.06, link: '/dublin' },
  { city: 'San Juan', n: 14, lat: 18.47, lng: -66.11 },
  { city: 'Seattle', n: 14, lat: 47.61, lng: -122.33 },
  { city: 'Smoky Mtns', n: 8, lat: 35.61, lng: -83.43 },
  { city: 'Phoenix', n: 7, lat: 33.45, lng: -112.07 },
];

const ARCS = [
  { from: [53.35, -6.26], to: [53.27, -9.06] },
  { from: [41.39, 2.17], to: [40.42, -3.70] },
  { from: [-33.87, 151.21], to: [-42.88, 147.33] },
  { from: [50.08, 14.44], to: [48.21, 16.37] },
];

function ll2v(lat, lng, r) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ===== PIN ===== */
function Pin({ city, index, entered, hovered, setHovered }) {
  const ref = useRef();
  const baseSize = Math.max(0.015, Math.sqrt(city.n) * 0.003);
  const isHovered = hovered === city.city;
  const [appeared, setAppeared] = useState(false);

  const pos = useMemo(() => {
    const p = ll2v(city.lat, city.lng, R);
    const n = p.clone().normalize();
    return p.add(n.multiplyScalar(baseSize * 0.5));
  }, [city.lat, city.lng, baseSize]);

  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setAppeared(true), index * 80);
    return () => clearTimeout(t);
  }, [entered, index]);

  useFrame(() => {
    if (!ref.current) return;
    const target = appeared ? (isHovered ? baseSize * 1.5 : baseSize) : 0.001;
    const cur = ref.current.scale.x;
    ref.current.scale.setScalar(cur + (target - cur) * 0.12);
  });

  return (
    <group position={pos}>
      <mesh
        ref={ref}
        scale={0.001}
        onPointerOver={e => { e.stopPropagation(); setHovered(city.city); document.body.style.cursor = city.link ? 'pointer' : 'default'; }}
        onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default'; }}
        onClick={e => { e.stopPropagation(); if (city.link) window.location.href = city.link; }}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color="#d4a843"
          emissive="#d4a843"
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      {isHovered && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div className="globe-tooltip">
            <div className="globe-tooltip-city">{city.city}</div>
            <div className="globe-tooltip-count">{city.n} spots</div>
            {city.link && <div className="globe-tooltip-cta">Explore &rarr;</div>}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ===== ARC ===== */
function Arc({ arc, index, entered }) {
  const ref = useRef();
  const [appeared, setAppeared] = useState(false);

  const geom = useMemo(() => {
    const p1 = ll2v(arc.from[0], arc.from[1], R);
    const p2 = ll2v(arc.to[0], arc.to[1], R);
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    const dist = p1.distanceTo(p2);
    mid.normalize().multiplyScalar(R + dist * 0.3);
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
  }, [arc]);

  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setAppeared(true), CITIES.length * 80 + 300 + index * 200);
    return () => clearTimeout(t);
  }, [entered, index]);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material;
    mat.opacity += ((appeared ? 0.6 : 0) - mat.opacity) * 0.06;
  });

  return (
    <line ref={ref}>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#d4a843" transparent opacity={0} />
    </line>
  );
}

/* ===== SCENE ===== */
function GlobeScene({ entered }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.001;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 4]} intensity={0.8} />

      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[R, 64, 64]} />
          <meshStandardMaterial color="#1c1915" roughness={0.85} metalness={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[R + 0.002, 36, 18]} />
          <meshBasicMaterial color="#3a3630" wireframe transparent opacity={0.12} />
        </mesh>
        <mesh>
          <sphereGeometry args={[R * 1.02, 64, 64]} />
          <meshBasicMaterial color="#d4a843" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>

        {CITIES.map((c, i) => (
          <Pin key={c.city} city={c} index={i} entered={entered} hovered={hovered} setHovered={setHovered} />
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
  );
}

/* ===== WRAPPER ===== */
export default function Globe() {
  const wrapRef = useRef();
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setEntered(true), 600);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div ref={wrapRef} className={`globe-wrap${inView ? ' globe-visible' : ''}`}>
      {inView && (
        <Canvas
          camera={{ position: [-2, 1.2, 3], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          style={{ background: 'transparent' }}
        >
          <GlobeScene entered={entered} />
        </Canvas>
      )}
      <div className="globe-hint">DRAG TO EXPLORE &middot; CLICK A CITY TO GO DEEPER</div>
    </div>
  );
}
