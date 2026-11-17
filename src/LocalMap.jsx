/* LocalMap — the Midwest as a relief model, with the Great Lakes as water.
 *
 * Everything drawn is generated or derived, never typed:
 *   - the ground is a measured elevation grid (tools/build-local-relief.mjs), the six
 *     states inked in bands, Canada drawn quieter, the lakes as moving water
 *   - state lines are Natural Earth boundaries draped on that ground
 *   - every pin stands on its place's own recorded coordinate (see src/data/localIndex.js)
 *   - a column of light stands on each venue with something on in the chosen dates; its
 *     height is the number of dated events there
 * ONE projection (`frame.project`, lat first) places all of it.
 *
 * Stylised, and said so on the page: heights are exaggerated a great deal, because the
 * Midwest is flat and a true-scale model of it would be a sheet of paper.
 *
 * The canvas is a view, not the only way in: the lists under it reach every place and
 * every event with a 44px target and a keyboard.
 *
 * The palette is /local's own (ink, brass, lake teal). The dusk palette belongs to /outdoors.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import { MIDWEST_RELIEF } from './data/midwestRelief'

const W = 100
const RISE = 4.6 // world units at maxMetres: a large exaggeration, stated on the page
const DRAMA = 1.35
const BANDS = 18
const LAKE_T = 0.115 // the Great Lakes sit about 176-183 m above the sea
const REVEAL = { value: 1 }
const CLOCK = { value: 0 }
const PIN_U = { uPx: { value: 14 }, uDrop: { value: 0 } }

function makeFrame(r) {
  const b = r.bounds
  const midLat = (b.north + b.south) / 2
  const aspect = ((b.east - b.west) * Math.cos((midLat * Math.PI) / 180)) / (b.north - b.south)
  const D = W / aspect
  return {
    ...r,
    D,
    /** lat first. Returns [x, z] on the ground plane. */
    project: (lat, lng) => [
      ((lng - b.west) / (b.east - b.west)) * W - W / 2,
      ((b.north - lat) / (b.north - b.south)) * D - D / 2,
    ],
    contains: (lat, lng) => lng > b.west && lng < b.east && lat > b.south && lat < b.north,
  }
}
export const FRAME = makeFrame(MIDWEST_RELIEF)
const lift = (t) => Math.pow(Math.max(t, 0), DRAMA) * RISE
const LAKE_Y = lift(LAKE_T) - 0.05

/* ---------- the relief grid ---------- */
function useRelief(frame) {
  const [relief, setRelief] = useState(null)
  useEffect(() => {
    let live = true
    const { cols, rows, bounds } = frame
    const img = new window.Image()
    img.onload = () => {
      if (!live) return
      const c = document.createElement('canvas')
      c.width = cols
      c.height = rows
      const g = c.getContext('2d', { willReadFrequently: true })
      g.drawImage(img, 0, 0)
      const px = g.getImageData(0, 0, cols, rows).data
      const n = cols * rows
      const raw = new Float32Array(n)
      const ours = new Uint8Array(n)
      const canada = new Uint8Array(n)
      const lake = new Uint8Array(n)
      for (let i = 0; i < n; i++) {
        const k = px[i * 4 + 1]
        ours[i] = k > 80 && k < 150 ? 1 : 0
        canada[i] = k >= 150 ? 1 : 0
        lake[i] = k > 30 && k <= 80 ? 1 : 0
        raw[i] = ours[i] || canada[i] ? px[i * 4] / 255 : LAKE_T
      }
      // One light blur removes the terracing 256 height steps leave on a slope.
      const elev = new Float32Array(n)
      for (let r = 0; r < rows; r++) {
        for (let cx = 0; cx < cols; cx++) {
          let sum = 0
          let wsum = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const rr = r + dr
              const cc = cx + dc
              if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue
              const wgt = (dr === 0 ? 2 : 1) * (dc === 0 ? 2 : 1)
              sum += raw[rr * cols + cc] * wgt
              wsum += wgt
            }
          }
          elev[r * cols + cx] = sum / wsum
        }
      }
      const groundAt = (lat, lng) => {
        const cx = Math.round(((lng - bounds.west) / (bounds.east - bounds.west)) * (cols - 1))
        const ry = Math.round(((bounds.north - lat) / (bounds.north - bounds.south)) * (rows - 1))
        const i = Math.max(0, Math.min(rows - 1, ry)) * cols + Math.max(0, Math.min(cols - 1, cx))
        return ours[i] || canada[i] ? lift(elev[i]) : LAKE_Y
      }
      const onLand = (lat, lng) => {
        const cx = Math.round(((lng - bounds.west) / (bounds.east - bounds.west)) * (cols - 1))
        const ry = Math.round(((bounds.north - lat) / (bounds.north - bounds.south)) * (rows - 1))
        if (cx < 1 || ry < 1 || cx > cols - 2 || ry > rows - 2) return false
        // every neighbour is one of the six states: a line here lies on the model, not off its edge
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) if (!ours[(ry + dr) * cols + cx + dc]) return false
        }
        return true
      }
      setRelief({ elev, ours, canada, lake, groundAt, onLand })
    }
    img.src = frame.src
    return () => {
      live = false
    }
  }, [frame])
  return relief
}

function useStateLines(frame, relief) {
  const [geometry, setGeometry] = useState(null)
  useEffect(() => {
    if (!relief) return undefined
    let live = true
    window
      .fetch(frame.linesSrc)
      .then((r) => (r.ok ? r.json() : []))
      .then((runs) => {
        const pos = []
        for (const run of runs) {
          for (let i = 1; i < run.length; i++) {
            const ends = [run[i - 1], run[i]]
            if (!ends.every(([lng, lat]) => relief.onLand(lat, lng))) continue
            for (const [lng, lat] of ends) {
              const [x, z] = frame.project(lat, lng)
              pos.push(x, relief.groundAt(lat, lng) + 0.04, z)
            }
          }
        }
        if (!live || pos.length < 6 || pos.length % 6) return
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
        setGeometry(g)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [frame, relief])
  return geometry
}

/* ---------- the ink ---------- */
const INK = [
  [0.0, '#2B261F'],
  [0.16, '#3A3226'],
  [0.3, '#4B3F2D'],
  [0.46, '#665234'],
  [0.62, '#86693B'],
  [0.8, '#A98445'],
  [1.0, '#CBA65C'],
].map(([t, hex]) => [t, new THREE.Color(hex)])

function useRamp() {
  return useMemo(() => {
    const n = 128
    const data = new Uint8Array(n * 4)
    const c = new THREE.Color()
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      let k = 1
      while (k < INK.length - 1 && t > INK[k][0]) k++
      const [t0, c0] = INK[k - 1]
      const [t1, c1] = INK[k]
      c.copy(c0).lerp(c1, Math.min(1, Math.max(0, (t - t0) / (t1 - t0))))
      c.convertLinearToSRGB()
      data[i * 4] = Math.round(c.r * 255)
      data[i * 4 + 1] = Math.round(c.g * 255)
      data[i * 4 + 2] = Math.round(c.b * 255)
      data[i * 4 + 3] = 255
    }
    const tex = new THREE.DataTexture(data, n, 1, THREE.RGBAFormat)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
    return tex
  }, [])
}

/* One grid, two meshes: the land (the six states and Canada) and the water under it. */
function useGrid(frame, relief, step) {
  return useMemo(() => {
    const { cols, rows, D } = frame
    const nc = Math.floor((cols - 1) / step) + 1
    const nr = Math.floor((rows - 1) / step) + 1
    const pos = new Float32Array(nc * nr * 3)
    const flat = new Float32Array(nc * nr * 3)
    const elev = new Float32Array(nc * nr)
    const ours = new Float32Array(nc * nr)
    const land = new Float32Array(nc * nr)
    const lake = new Float32Array(nc * nr)
    for (let r = 0; r < nr; r++) {
      for (let c = 0; c < nc; c++) {
        const src = r * step * cols + c * step
        const i = r * nc + c
        const isLand = relief.ours[src] === 1 || relief.canada[src] === 1
        const t = isLand ? relief.elev[src] : LAKE_T
        const x = ((c * step) / (cols - 1)) * W - W / 2
        const z = ((r * step) / (rows - 1)) * D - D / 2
        pos[i * 3] = x
        pos[i * 3 + 1] = lift(t)
        pos[i * 3 + 2] = z
        flat[i * 3] = x
        flat[i * 3 + 1] = LAKE_Y
        flat[i * 3 + 2] = z
        elev[i] = t
        let o = 0
        let l = 0
        let k = 0
        let n = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const rr = r * step + dr
            const cc = c * step + dc
            if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue
            const j = rr * cols + cc
            o += relief.ours[j]
            l += relief.ours[j] + relief.canada[j]
            k += relief.lake[j]
            n++
          }
        }
        ours[i] = o / n // 3x3 means, so the shader's cut at 0.5 runs smoothly between cells
        land[i] = l / n
        lake[i] = k / n
      }
    }
    const landIdx = new Uint32Array((nc - 1) * (nr - 1) * 6)
    const lakeIdx = new Uint32Array((nc - 1) * (nr - 1) * 6)
    let a = 0
    let b = 0
    for (let r = 0; r < nr - 1; r++) {
      for (let c = 0; c < nc - 1; c++) {
        const p = r * nc + c
        const q = p + 1
        const s = p + nc
        const u = s + 1
        if (land[p] + land[q] + land[s] + land[u] > 0.01) {
          landIdx.set([p, s, q, q, s, u], a)
          a += 6
        }
        if (lake[p] + lake[q] + lake[s] + lake[u] > 0.01) {
          lakeIdx.set([p, s, q, q, s, u], b)
          b += 6
        }
      }
    }
    const ground = new THREE.BufferGeometry()
    ground.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    ground.setAttribute('aElev', new THREE.BufferAttribute(elev, 1))
    ground.setAttribute('aLand', new THREE.BufferAttribute(land, 1))
    ground.setAttribute('aOurs', new THREE.BufferAttribute(ours, 1))
    ground.setIndex(new THREE.BufferAttribute(landIdx.subarray(0, a), 1))
    ground.computeVertexNormals()
    const water = new THREE.BufferGeometry()
    water.setAttribute('position', new THREE.BufferAttribute(flat, 3))
    water.setAttribute('aLake', new THREE.BufferAttribute(lake, 1))
    water.setAttribute('aLand', new THREE.BufferAttribute(land, 1))
    water.setIndex(new THREE.BufferAttribute(lakeIdx.subarray(0, b), 1))
    return { ground, water }
  }, [frame, relief, step])
}

const VERT_HEAD =
  'attribute float aElev;\nattribute float aLand;\nattribute float aOurs;\nvarying float vElev;\nvarying float vLand;\nvarying float vOurs;'
const FRAG_HEAD =
  'uniform sampler2D uRamp;\nuniform float uBands;\nuniform float uReveal;\nvarying float vElev;\nvarying float vLand;\nvarying float vOurs;'
const FRAG_INK = [
  'if (vLand < 0.5) discard;',
  // the Midwest lives between about 180 and 450 m: spread that range across the bands
  'float t = clamp((vElev - 0.1) / 0.62, 0.0, 1.0);',
  'float e = pow(t, 0.72) * uBands + 0.5;',
  'float band = floor(e) / uBands;',
  'vec3 ink = texture2D(uRamp, vec2(clamp(band, 0.004, 0.996), 0.5)).rgb;',
  'float f = fract(e);',
  'float w = max(fwidth(e), 0.00001);',
  'float line = 1.0 - smoothstep(w * 0.6, w * 1.6, min(f, 1.0 - f));',
  'line *= 1.0 - smoothstep(0.3, 0.95, w);',
  'vec3 col = mix(ink, ink * 0.5, line * 0.55);',
  // Canada is context, not the subject: the same ground, drawn quieter
  'float grey = dot(col, vec3(0.3, 0.55, 0.15));',
  'float ours = smoothstep(0.42, 0.58, vOurs / max(vLand, 0.001));',
  'col = mix(vec3(grey) * vec3(0.5, 0.56, 0.62), col, ours);',
  'float laid = smoothstep(0.0, 0.07, uReveal * 1.12 - band);',
  'vec3 paper = texture2D(uRamp, vec2(0.004, 0.5)).rgb * 0.8;',
  'diffuseColor.rgb = mix(paper, col, laid);',
].join('\n')

const WATER_VERT = `
attribute float aLake;
attribute float aLand;
varying float vLake;
varying float vLand;
varying vec3 vAt;
void main() {
  vLake = aLake;
  vLand = aLand;
  vAt = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const WATER_FRAG = `
uniform float uTime;
uniform float uReveal;
varying float vLake;
varying float vLand;
varying vec3 vAt;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main() {
  if (vLake + vLand < 0.04) discard;
  vec2 p = vAt.xz;
  // open water: slow swell, two scales, drifting east
  float swell = noise(p * 0.55 + vec2(uTime * 0.05, uTime * 0.02)) * 0.6 + noise(p * 1.7 - vec2(uTime * 0.07, 0.0)) * 0.4;
  vec3 deep = vec3(0.006, 0.030, 0.046);
  vec3 mid = vec3(0.018, 0.078, 0.105);
  vec3 col = mix(deep, mid, swell * 0.7);
  // the shallows: water lightens toward the shore
  float shore = smoothstep(0.02, 0.5, vLand);
  col = mix(col, vec3(0.055, 0.19, 0.22), shore * 0.6);
  // thin moving glints, like low sun on a chop
  float g = noise(vec2(p.x * 2.6 - uTime * 0.22, p.y * 9.0));
  float glint = smoothstep(0.80, 0.9, g) * (0.35 + 0.65 * swell);
  col += vec3(0.95, 0.80, 0.55) * glint * 0.07;
  float a = smoothstep(0.0, 0.25, uReveal);
  gl_FragColor = vec4(col * a, 1.0);
  #include <colorspace_fragment>
}`

function Ground({ frame, relief, step, still, lines }) {
  const { ground, water } = useGrid(frame, relief, step)
  const ramp = useRamp()
  const ref = useRef()
  const t0 = useRef(null)
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, color: '#ffffff' })
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uRamp = { value: ramp }
      shader.uniforms.uBands = { value: BANDS }
      shader.uniforms.uReveal = REVEAL
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\n' + VERT_HEAD)
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvElev = aElev;\nvLand = aLand;\nvOurs = aOurs;'
        )
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\n' + FRAG_HEAD)
        .replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_INK)
    }
    return m
  }, [ramp])
  const waterMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: WATER_VERT,
        fragmentShader: WATER_FRAG,
        uniforms: { uTime: CLOCK, uReveal: REVEAL },
      }),
    []
  )
  useFrame(({ clock }) => {
    CLOCK.value = still ? 0 : clock.elapsedTime
    if (!ref.current || still) return
    if (t0.current === null) t0.current = clock.elapsedTime
    const p = Math.min(1, (clock.elapsedTime - t0.current) / 2.2)
    ref.current.scale.y = 0.02 + 0.98 * (1 - Math.pow(1 - p, 3)) // the land rises, once
    const q = Math.min(1, Math.max(0, (clock.elapsedTime - t0.current - 0.4) / 2.6))
    REVEAL.value = q * q * (3 - 2 * q)
  })
  return (
    <>
      <mesh geometry={water} material={waterMaterial} />
      <group ref={ref} scale={[1, still ? 1 : 0.02, 1]}>
        <mesh geometry={ground} material={material} castShadow receiveShadow />
        {lines && (
          <lineSegments geometry={lines}>
            <lineBasicMaterial color="#E8DCC8" transparent opacity={0.2} depthWrite={false} />
          </lineSegments>
        )}
      </group>
    </>
  )
}

/* ---------- the light: one fixed evening ---------- */
function Lights({ coarse }) {
  const sun = useRef()
  const size = coarse ? 1024 : 2048
  useEffect(() => {
    if (!sun.current) return
    sun.current.position.set(-120, 62, 46)
    sun.current.target.position.set(0, 0, 0)
    sun.current.target.updateMatrixWorld()
  }, [])
  return (
    <>
      <hemisphereLight args={['#9FB2C8', '#17130F', 0.85]} />
      <directionalLight
        ref={sun}
        color="#FFD3A0"
        intensity={2.9}
        castShadow
        shadow-mapSize={[size, size]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.3}
      >
        <orthographicCamera attach="shadow-camera" args={[-75, 75, 75, -75, 20, 360]} />
      </directionalLight>
      {/* the table: invisible but for the shadow the model throws on it */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[420, 420]} />
        <shadowMaterial transparent opacity={0.55} />
      </mesh>
    </>
  )
}

function makeBackdrop() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 512
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#0B1118')
  grad.addColorStop(0.55, '#10100F')
  grad.addColorStop(1, '#141210')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 512)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
function Backdrop() {
  const [tex] = useState(makeBackdrop)
  return <primitive attach="background" object={tex} />
}

/* ---------- the pins: one draw call, the same size on screen at any zoom ---------- */
const GOLD = new THREE.Color('#E2B549')
const COPPER = new THREE.Color('#C98F6B')
const PIN_VERT = `
attribute vec3 aColor;
attribute float aSolid;
attribute float aShow;
uniform float uPx;
uniform float uDrop;
varying vec3 vColor;
varying float vSolid;
varying float vShow;
void main() {
  vColor = aColor;
  vSolid = aSolid;
  vShow = aShow;
  vec3 p = position;
  p.y += (1.0 - uDrop) * 4.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPx * (aSolid > 0.5 ? 1.0 : 0.86) * aShow;
}`
const PIN_FRAG = `
varying vec3 vColor;
varying float vSolid;
varying float vShow;
uniform float uDrop;
void main() {
  if (vShow < 0.01) discard;
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float edge = smoothstep(1.0, 0.86, d);
  // gold is a filled mark; copper is a ring around a dark centre
  float fill = vSolid > 0.5 ? smoothstep(0.74, 0.62, d) : smoothstep(0.34, 0.46, d) * smoothstep(0.78, 0.66, d);
  vec3 col = mix(vec3(0.07, 0.06, 0.05), vColor, fill);
  gl_FragColor = vec4(col, edge * uDrop);
  #include <colorspace_fragment>
}`

function Pins({ frame, places, shown, groundAt, still }) {
  const { size, gl } = useThree()
  const t0 = useRef(null)
  const geometry = useMemo(() => {
    const n = places.length
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const solid = new Float32Array(n)
    places.forEach((p, i) => {
      const [x, z] = frame.project(p.lat, p.lng)
      pos.set([x, groundAt(p.lat, p.lng) + 0.1, z], i * 3)
      const c = p.tier === 'walked' ? GOLD : COPPER
      col.set([c.r, c.g, c.b], i * 3)
      solid[i] = p.tier === 'walked' ? 1 : 0
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSolid', new THREE.BufferAttribute(solid, 1))
    g.setAttribute('aShow', new THREE.BufferAttribute(new Float32Array(n), 1))
    return g
  }, [frame, places, groundAt])
  useEffect(() => {
    const a = geometry.getAttribute('aShow')
    places.forEach((p, i) => a.setX(i, shown.has(p.id) ? 1 : 0))
    a.needsUpdate = true
  }, [geometry, places, shown])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PIN_VERT,
        fragmentShader: PIN_FRAG,
        uniforms: PIN_U, // one map per page, so one shared set of uniforms (like REVEAL)
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    []
  )
  useEffect(() => {
    const k = Math.min(1, Math.max(0.72, size.width / 900))
    PIN_U.uPx.value = 15 * k * gl.getPixelRatio()
    if (still) PIN_U.uDrop.value = 1
  }, [size, gl, still])
  useFrame(({ clock }) => {
    if (still) return
    if (t0.current === null) t0.current = clock.elapsedTime
    const p = Math.min(1, Math.max(0, (clock.elapsedTime - t0.current - 2.2) / 0.9))
    PIN_U.uDrop.value = 1 - Math.pow(1 - p, 3)
  })
  return <points geometry={geometry} material={material} renderOrder={8} frustumCulled={false} />
}

/* ---------- what is on: a column of light on each venue with dated events ---------- */
const BEAM_VERT = `
varying float vH;
void main() {
  vH = position.y + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
const BEAM_FRAG = `
uniform float uTime;
uniform float uPhase;
varying float vH;
void main() {
  float fade = pow(1.0 - vH, 1.6);
  float pulse = 0.82 + 0.18 * sin(uTime * 1.3 + uPhase);
  gl_FragColor = vec4(vec3(1.0, 0.84, 0.5) * (0.6 + 2.2 * fade) * pulse, fade * 0.9);
}`
function Beam({ x, y, z, count, index, homeDist, still }) {
  const ref = useRef()
  const { camera } = useThree()
  const t0 = useRef(null)
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BEAM_VERT,
        fragmentShader: BEAM_FRAG,
        uniforms: { uTime: CLOCK, uPhase: { value: index * 1.7 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [index]
  )
  const height = 2.6 + Math.min(count, 14) * 0.55
  useFrame(({ clock }) => {
    if (!ref.current) return
    // a beam keeps its place on screen as the camera closes in on a city
    const k = Math.min(
      1,
      Math.max(0.05, camera.position.distanceTo(ref.current.position) / homeDist)
    )
    let grow = 1
    if (!still) {
      if (t0.current === null) t0.current = clock.elapsedTime
      const p = Math.min(
        1,
        Math.max(0, (clock.elapsedTime - t0.current - 0.15 - index * 0.02) / 0.8)
      )
      grow = 1 - Math.pow(1 - p, 3)
    }
    const h = Math.max(0.001, height * k * grow)
    ref.current.scale.set(k, h, k)
    ref.current.position.y = y + h / 2
  })
  return (
    <mesh ref={ref} position={[x, y, z]} material={material} renderOrder={6}>
      <cylinderGeometry args={[0.16, 0.42, 1, 12, 1, true]} />
    </mesh>
  )
}
function Beams({ frame, beams, groundAt, homeDist, still }) {
  return beams.map((b, i) => {
    const [x, z] = frame.project(b.lat, b.lng)
    return (
      <Beam
        key={b.id}
        x={x}
        y={groundAt(b.lat, b.lng)}
        z={z}
        count={b.count}
        index={i}
        homeDist={homeDist}
        still={still}
      />
    )
  })
}

/* ---------- camera ---------- */
const HOME_DIR = new THREE.Vector3(0, 0.76, 0.65).normalize()
function clearance(canvas) {
  const stage = canvas.closest('.lm-stage')
  const title = stage && stage.querySelector('.lm-title')
  const controls = stage && stage.querySelector('.lm-dock')
  if (!title || !controls) return null
  const box = canvas.getBoundingClientRect()
  // hidden (the poster render): no text to clear, so the model takes the whole canvas
  if (!title.getBoundingClientRect().height || !controls.getBoundingClientRect().height) return null
  return {
    top: title.getBoundingClientRect().bottom - box.top + 12,
    bottom: box.bottom - controls.getBoundingClientRect().top + 12,
  }
}
function homeView(camera, size, frame, clear) {
  const half = Math.tan((camera.fov * Math.PI) / 360)
  const aspect = size.width / size.height
  const wide = aspect > 1.25
  if (!wide && clear) {
    const band = Math.max(160, size.height - clear.top - clear.bottom)
    const tall = frame.D * HOME_DIR.y + RISE * HOME_DIR.z
    const dist = Math.max(W / (2 * half * aspect * 0.98), (tall * size.height) / (2 * half * band))
    const centre = (clear.top + band / 2) / size.height - 0.5
    return { dist, x: 0, z: (-centre * 2 * half * dist) / HOME_DIR.y }
  }
  if (!wide) {
    // tall with nothing to clear: centred
    const dist = Math.max(W / (2 * half * aspect * 0.94), (frame.D * 1.25) / (2 * half))
    return { dist, x: 0, z: -dist * 0.03 }
  }
  // wide: the model takes the right-hand side, the title the left
  const dist = Math.max(W / (2 * half * aspect * 0.5), (frame.D * 1.3) / (2 * half))
  const visibleW = 2 * half * aspect * dist
  return { dist, x: -visibleW * 0.2, z: -dist * 0.045 }
}

function Rig({ frame, focus, still, coarse, groundAt, onHome }) {
  const controls = useRef()
  const { camera, size, gl } = useThree()
  const want = useRef({
    target: new THREE.Vector3(),
    offset: new THREE.Vector3(),
    moving: true,
    first: true,
    slow: false,
  })
  useEffect(() => {
    const w = want.current
    const home = homeView(camera, size, frame, clearance(gl.domElement))
    onHome(home.dist)
    if (focus) {
      w.slow = false
      const [x, z] = frame.project(focus.lat, focus.lng)
      const dist = focus.dist
      w.offset.copy(new THREE.Vector3(0, 0.72, 0.7).normalize()).multiplyScalar(dist)
      const aspect = size.width / size.height
      const wide = aspect > 1.25
      const half = Math.tan((camera.fov * Math.PI) / 360)
      const visibleW = 2 * half * aspect * dist
      const visibleH = 2 * half * dist
      // the card covers the right side on a wide screen, and the lower half on a tall one
      w.target.set(
        x + (wide ? visibleW * 0.17 : 0),
        groundAt(focus.lat, focus.lng),
        z + (wide ? 0 : visibleH * 0.1)
      )
    } else {
      w.target.set(home.x, 0, home.z)
      w.offset.copy(HOME_DIR).multiplyScalar(home.dist)
    }
    w.moving = true
  }, [frame, focus, camera, size, gl, groundAt, onHome])
  useFrame((_, dt) => {
    const c = controls.current
    if (!c) return
    const w = want.current
    if (w.moving) {
      if (w.first && !still && !focus) {
        const d = w.offset.length() * 1.3
        c.target.copy(w.target)
        camera.position.copy(w.target).add(new THREE.Vector3(0, 0.995, 0.1).multiplyScalar(d))
        w.first = false
        w.slow = true
      }
      const k = still || w.first ? 1 : 1 - Math.exp(-Math.min(dt, 0.25) * (w.slow ? 1.3 : 3.2))
      w.first = false
      c.target.lerp(w.target, k)
      const goal = w.target.clone().add(w.offset)
      camera.position.lerp(goal, k)
      if (camera.position.distanceTo(goal) < 0.01) {
        w.moving = false
        w.slow = false
      }
    }
    c.update()
  })
  return (
    <OrbitControls
      ref={controls}
      enabled={!coarse}
      enablePan={false}
      enableZoom={false} /* the page must keep its scroll wheel */
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.3}
      maxPolarAngle={1.15}
      minAzimuthAngle={-0.7}
      maxAzimuthAngle={0.7}
      onStart={() => {
        want.current.moving = false
      }}
    />
  )
}

/* One picker for the whole canvas: the pin nearest the pointer in SCREEN space wins.
 * A drag never selects. */
function Picker({ frame, places, shown, onHover, onSelect, groundAt }) {
  const { camera, gl, size } = useThree()
  useEffect(() => {
    const el = gl.domElement
    const v = new THREE.Vector3()
    const nearest = (e, reach) => {
      const r = el.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      let best = null
      let bestD = reach
      for (const p of places) {
        if (!shown.has(p.id)) continue
        const [x, z] = frame.project(p.lat, p.lng)
        v.set(x, groundAt(p.lat, p.lng) + 0.1, z).project(camera)
        if (v.z > 1) continue
        const d = Math.hypot(((v.x + 1) / 2) * size.width - px, ((1 - v.y) / 2) * size.height - py)
        if (d < bestD) {
          bestD = d
          best = p.id
        }
      }
      return best
    }
    let down = null
    const move = (e) => onHover(e.pointerType === 'touch' ? null : nearest(e, 16))
    const leave = () => onHover(null)
    const press = (e) => {
      down = [e.clientX, e.clientY]
    }
    const release = (e) => {
      if (!down) return
      const dragged = Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6
      down = null
      if (dragged) return
      const hit = nearest(e, e.pointerType === 'touch' ? 26 : 18)
      if (hit) onSelect(hit)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', press)
    el.addEventListener('pointerup', release)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointerdown', press)
      el.removeEventListener('pointerup', release)
    }
  }, [frame, camera, gl, size, places, shown, onHover, onSelect, groundAt])
  return null
}

/* ?debug exposes each pin's and hub's screen position so a browser test can click the real thing. */
function DebugProbe({ frame, places, hubs, groundAt }) {
  const { camera, size } = useThree()
  useEffect(() => {
    if (!/[?&]debug\b/.test(window.location.search)) return undefined
    window.__localScreen = (id) => {
      const p = places.find((q) => q.id === id) || hubs.find((h) => h.id === id)
      if (!p) return null
      const [x, z] = frame.project(p.lat, p.lng)
      const v = new THREE.Vector3(x, groundAt(p.lat, p.lng) + 0.1, z).project(camera)
      return { x: ((v.x + 1) / 2) * size.width, y: ((1 - v.y) / 2) * size.height }
    }
    return () => {
      delete window.__localScreen
    }
  }, [frame, camera, size, places, hubs, groundAt])
  return null
}

/* City labels, with the pile-up solved on screen: each frame the hubs are projected, and a
 * label whose box would overlap a bigger city's is hidden until the view moves apart. */
function HubLabels({ frame, hubs, groundAt, onHub, still }) {
  const { camera, size } = useThree()
  const [ready, setReady] = useState(still)
  const [visible, setVisible] = useState(() => new Map()) // id -> '' | 'left' | 'right'
  const last = useRef('')
  useEffect(() => {
    if (still) return undefined
    const t = window.setTimeout(() => setReady(true), 2600)
    return () => window.clearTimeout(t)
  }, [still])
  const ranked = useMemo(
    () => hubs.slice().sort((a, b) => b.count + b.events * 2 - (a.count + a.events * 2)),
    [hubs]
  )
  useFrame(() => {
    const v = new THREE.Vector3()
    const w = size.width < 700 ? 150 : 170 // a label's footprint in pixels
    const h = size.width < 700 ? 40 : 44
    const boxes = []
    const keep = []
    for (const hub of ranked) {
      const [x, z] = frame.project(hub.lat, hub.lng)
      v.set(x, groundAt(hub.lat, hub.lng) + 0.2, z).project(camera)
      const px = ((v.x + 1) / 2) * size.width
      const py = ((1 - v.y) / 2) * size.height
      const hit = boxes.some((b) => Math.abs(b[0] - px) < w && Math.abs(b[1] - py) < h)
      if (hit) continue
      boxes.push([px, py])
      // a label near the edge of the canvas hangs inward from its point instead of being cut off
      const edge = px > size.width - w * 0.55 ? 'right' : px < w * 0.55 ? 'left' : ''
      keep.push([hub.id, edge])
    }
    const key = keep.map((k) => k.join(':')).join('|')
    if (key !== last.current) {
      last.current = key
      setVisible(new Map(keep))
    }
  })
  if (!ready) return null
  return hubs.map((h) => {
    if (!visible.has(h.id)) return null
    const edge = visible.get(h.id)
    const [x, z] = frame.project(h.lat, h.lng)
    return (
      <Html key={h.id} position={[x, groundAt(h.lat, h.lng) + 0.2, z]} center zIndexRange={[18, 0]}>
        <button
          type="button"
          className={`lm-hub${h.walked ? ' has-walked' : ''}${edge ? ` at-${edge}` : ''}`}
          onClick={() => onHub(h.id)}
          aria-label={`${h.name}: ${h.count} places${h.events ? `, ${h.events} events in these dates` : ''}. Fly in.`}
        >
          <span className="lm-hub-name">{h.name}</span>
          <span className="lm-hub-n">{h.count}</span>
          {h.events > 0 && <span className="lm-hub-on">{h.events} on</span>}
        </button>
      </Html>
    )
  })
}

function PinLabel({ frame, place, groundAt, active }) {
  const [x, z] = frame.project(place.lat, place.lng)
  return (
    <Html
      position={[x, groundAt(place.lat, place.lng) + 0.1, z]}
      zIndexRange={[30, 20]}
      style={{ pointerEvents: 'none' }}
    >
      <span className={`lm-label${active ? ' is-active' : ''}`}>{place.name}</span>
    </Html>
  )
}

function Scene(props) {
  const { frame, places, shown, hubs, beams, focus, selected, hover } = props
  const { still, coarse, onHover, onSelect, onHub } = props
  const relief = useRelief(frame)
  const lines = useStateLines(frame, relief)
  const [homeDist, setHomeDist] = useState(150)
  if (!relief) return null
  const byId = (id) => places.find((p) => p.id === id)
  const sel = selected ? byId(selected) : null
  const hov = hover && hover !== selected ? byId(hover) : null
  return (
    <>
      <Ground frame={frame} relief={relief} step={coarse ? 2 : 1} still={still} lines={lines} />
      <Beams
        frame={frame}
        beams={beams}
        groundAt={relief.groundAt}
        homeDist={homeDist}
        still={still}
      />
      <Pins frame={frame} places={places} shown={shown} groundAt={relief.groundAt} still={still} />
      {!focus && (
        <HubLabels
          frame={frame}
          hubs={hubs}
          groundAt={relief.groundAt}
          onHub={onHub}
          still={still}
        />
      )}
      {sel && <PinLabel frame={frame} place={sel} groundAt={relief.groundAt} active />}
      {hov && <PinLabel frame={frame} place={hov} groundAt={relief.groundAt} />}
      <Rig
        frame={frame}
        focus={focus}
        still={still}
        coarse={coarse}
        groundAt={relief.groundAt}
        onHome={setHomeDist}
      />
      <Picker
        frame={frame}
        places={places}
        shown={shown}
        onHover={onHover}
        onSelect={onSelect}
        groundAt={relief.groundAt}
      />
      <DebugProbe frame={frame} places={places} hubs={hubs} groundAt={relief.groundAt} />
    </>
  )
}

function canWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) return false
    const lose = gl.getExtension('WEBGL_lose_context')
    if (lose) lose.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * places  every pinnable place: { id, name, lat, lng, tier: 'walked' | other }
 * shown   Set of place ids to draw now (the page decides: layer filters, hub or home view)
 * hubs    cities to offer as fly-ins on the home view: { id, name, lat, lng, count, events, walked }
 * beams   venues with dated events in the chosen dates: { id, lat, lng, count }
 * focus   null for the whole Midwest, or { lat, lng, dist } to fly to
 */
export default function LocalMap(props) {
  const { places, shown, hubs, beams, focus, selected, onSelect, onHub } = props
  const [hover, setHover] = useState(null)
  const [ok, setOk] = useState(canWebGL)
  const [attempt, setAttempt] = useState(0)
  const still = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )
  const coarse = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    []
  )
  const retry = useCallback(() => {
    setAttempt((n) => n + 1)
    setOk(canWebGL())
  }, [])

  if (!ok) {
    return (
      <div className="localmap localmap--flat">
        <img
          src="/local/poster-midwest.jpg"
          alt="Relief model of the Midwest and the Great Lakes with the places on this page marked on it"
        />
        <p role="status">
          This browser couldn&rsquo;t start the 3D map, so this is a still picture of it. Every
          place and event is in the lists below.{' '}
          <button type="button" onClick={retry}>
            Try the 3D map again
          </button>
        </p>
      </div>
    )
  }
  return (
    <div className={`localmap${hover ? ' is-hovering' : ''}`}>
      <Canvas
        key={attempt}
        shadows="soft"
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setOk(false)
          })
        }}
        camera={{ fov: 32, near: 0.5, far: 1200, position: [0, 150, 120] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        aria-label="Relief model of the Midwest and the Great Lakes, with a pin on every place and a column of light on each venue with something on. The lists below the map reach everything on it."
        role="img"
      >
        <Backdrop />
        <Lights coarse={coarse} />
        <Scene
          frame={FRAME}
          places={places}
          shown={shown}
          hubs={hubs}
          beams={beams}
          focus={focus}
          selected={selected}
          hover={hover}
          still={still}
          coarse={coarse}
          onHover={setHover}
          onSelect={onSelect}
          onHub={onHub}
        />
        {!coarse && (
          <EffectComposer multisampling={4}>
            <N8AO
              aoRadius={1.2}
              intensity={1.3}
              distanceFalloff={1.2}
              quality="performance"
              halfRes
            />
            <Bloom intensity={0.55} luminanceThreshold={1.0} luminanceSmoothing={0.2} mipmapBlur />
            <Vignette offset={0.3} darkness={0.5} />
            <Noise opacity={0.025} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
