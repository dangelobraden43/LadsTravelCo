import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './Globe.css';

const R = 1.5;

const CITIES = [
  { city: 'Sydney', n: 123, lat: -33.87, lng: 151.21 },
  { city: 'Barcelona', n: 115, lat: 41.39, lng: 2.17 },
  { city: 'Rome', n: 43, lat: 41.90, lng: 12.50 },
  { city: 'Dublin', n: 39, lat: 53.35, lng: -6.26 },
  { city: 'Prague', n: 38, lat: 50.08, lng: 14.44 },
  { city: 'Vienna', n: 37, lat: 48.21, lng: 16.37 },
  { city: 'Costa Rica', n: 28, lat: 9.62, lng: -84.63 },
  { city: 'Tasmania', n: 27, lat: -42.88, lng: 147.33 },
  { city: 'Vancouver', n: 22, lat: 49.28, lng: -123.12 },
  { city: 'Chicago', n: 15, lat: 41.88, lng: -87.63 },
  { city: 'Galway', n: 15, lat: 53.27, lng: -9.06 },
  { city: 'San Juan', n: 14, lat: 18.47, lng: -66.11 },
  { city: 'Seattle', n: 14, lat: 47.61, lng: -122.33 },
  { city: 'Smoky Mtns', n: 8, lat: 35.61, lng: -83.43 },
  { city: 'Phoenix', n: 7, lat: 33.45, lng: -112.07 },
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

function Pin({ lat, lng, size }) {
  const pos = useMemo(() => {
    const p = ll2v(lat, lng, R);
    const n = p.clone().normalize();
    return p.add(n.multiplyScalar(size * 0.5));
  }, [lat, lng, size]);

  return (
    <mesh position={pos}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color="#d4a843"
        emissive="#d4a843"
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
}

function GlobeScene() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.001;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 4]} intensity={0.8} />

      <group ref={groupRef}>
        {/* Dark earth sphere */}
        <mesh>
          <sphereGeometry args={[R, 64, 64]} />
          <meshStandardMaterial color="#1c1915" roughness={0.85} metalness={0.1} />
        </mesh>

        {/* Wireframe grid overlay */}
        <mesh>
          <sphereGeometry args={[R + 0.002, 36, 18]} />
          <meshBasicMaterial color="#3a3630" wireframe transparent opacity={0.12} />
        </mesh>

        {/* Atmosphere rim */}
        <mesh>
          <sphereGeometry args={[R * 1.02, 64, 64]} />
          <meshBasicMaterial color="#d4a843" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>

        {/* City pins */}
        {CITIES.map(c => (
          <Pin
            key={c.city}
            lat={c.lat}
            lng={c.lng}
            size={Math.max(0.015, Math.sqrt(c.n) * 0.003)}
          />
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

export default function Globe() {
  return (
    <div className="globe-wrap">
      <Canvas
        camera={{ position: [-2, 1.2, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene />
      </Canvas>
      <div className="globe-hint">DRAG TO EXPLORE</div>
    </div>
  );
}
