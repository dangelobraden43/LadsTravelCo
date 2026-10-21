/* First Tee: the reusable 3D golf intro (Three.js 0.160, ES module; needs the importmap in stage.html).
 * Markup + CSS: tools/golf-intro/stage.html. Config before load: window.__INTRO_CONFIG =
 *   { mode: 'dusk' | 'dawn', eyebrow, title, sub }   (dusk is the default, ruled Oct 16 2026)
 * The course is a generic links hole built in code, not any real venue, and carries no event logo.
 * Fires 'intro:titled' on #stage when the title lands; window.__intro.stop() ends rendering.
 * Prototype and history: https://claude.ai/artifact/6rykXMrX6xiqNJ4XRP3aVn */
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const $ = (id) => document.getElementById(id);
const CFG = Object.assign({ mode: 'dusk' }, window.__INTRO_CONFIG || {});
const stage = $('stage');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = Math.min(window.innerWidth, screen.width || 9999) < 700;

// ---------- noise + course shape ----------
function hash(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}
function fbm(x, z, o = 4) { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, z * f); f *= 2.03; a *= .5; } return s; }
function ss(e0, e1, x) { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
const lerp = (a, b, t) => a + (b - a) * t;

const G = { x: 0, z: -160 };
const PIN = { x: 1.3, z: -160.9 };
const BUNKERS = [{ x: -13, z: -151, r: 6 }, { x: 12.5, z: -148, r: 5 }, { x: 8, z: -172, r: 5.5 }, { x: -9, z: -96, r: 6.5 }, { x: 12, z: -62, r: 5 }, { x: -3, z: -137, r: 3.2 }];
const CLUB = { x: -72, z: -196 };
const fairAt = (x, z) => fbm(x * .02 + 11, z * .02 + 5, 3) * 1.1;
const LIFT = 2.6;
const TEE_H = fairAt(0, 1) + .6 + LIFT, GREEN_H = fairAt(G.x, G.z) + .35 + LIFT, PAD_H = 3.2 + LIFT;
const corridorX = (z) => 6 * Math.sin(-z * Math.PI / 160);

function course(x, z) {
  const big = (1 - Math.abs(fbm(x * .011 + 3, z * .011 - 7))) * 10 - 3.2;
  let dunes = big + fbm(x * .045, z * .045, 3) * 1.6;
  dunes = lerp(dunes, dunes * .3 - .4, ss(-172, -215, z));
  const fair = fairAt(x, z);
  const inZ = ss(12, 3, z) * ss(-182, -166, z);
  const w = 13 + 5 * ss(-40, -120, z);
  const fm = (1 - ss(w * .75, w * 1.25, Math.abs(x - corridorX(z)))) * inZ;
  const dG = Math.hypot(x - G.x, z - G.z);
  const gm = 1 - ss(14, 21, dG), gmi = 1 - ss(11, 14.5, dG);
  const m = Math.max(fm, gm);
  let y = dunes * (1 - m) + fair * m + LIFT;
  const tm = (1 - ss(3.4, 5, Math.abs(x))) * (1 - ss(3, 5, Math.abs(z - 1)));
  y = lerp(y, TEE_H, tm);
  y = lerp(y, GREEN_H + .22 * Math.sin(x * .18) + .14 * Math.cos(z * .21), gmi);
  let sand = 0;
  for (const b of BUNKERS) { const k = 1 - ss(b.r * .55, b.r, Math.hypot(x - b.x, z - b.z)); y -= k * 1.15; sand = Math.max(sand, 1 - ss(b.r * .8, b.r * .95, Math.hypot(x - b.x, z - b.z))); }
  const pm = 1 - ss(10, 16, Math.hypot(x - CLUB.x, z - CLUB.z));
  y = lerp(y, PAD_H, pm);
  const zc = -262 + 18 * Math.sin(x * .013) + 10 * fbm(x * .03, 1, 2);
  const sea = ss(zc, zc - 45, z);
  y = lerp(y, -5, sea);
  return { y, fm, gm, gmi, tm, sand, sea, m, pm, dunes };
}
const yAt = (x, z) => course(x, z).y;

const C = (h) => new THREE.Color(h);
const COL = { roughA: C('#646238'), roughB: C('#8f8650'), crest: C('#b2a46b'), hollow: C('#445330'), fair1: C('#4d7f3b'), fair2: C('#447534'), green1: C('#61a04a'), green2: C('#578f42'), sand: C('#c9b48a'), beach: C('#c6b38c'), wet: C('#2f3d3c'), pad: C('#5a6a3c') };

function terrainMesh(x0, x1, z0, z1, sx, sz, yOff, skirt) {
  const g = new THREE.PlaneGeometry(x1 - x0, z0 - z1, sx, sz);
  g.rotateX(-Math.PI / 2);
  g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);
  const p = g.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), k = course(x, z);
    let y = k.y + yOff;
    if (skirt && (i % (sx + 1) === 0 || i % (sx + 1) === sx || i <= sx || i >= p.count - sx - 1)) y -= 2.5;
    p.setY(i, y);
    const n = vnoise(x * .09, z * .09) * .5 + .5;
    c.copy(COL.roughA).lerp(COL.roughB, n);
    c.lerp(COL.crest, ss(3, 7, k.dunes) * .55);
    c.lerp(COL.hollow, ss(1, -2.5, k.dunes) * .6);
    const stripe = (Math.floor((z + 1000) / 5) % 2) ? COL.fair1 : COL.fair2;
    c.lerp(stripe, Math.max(k.fm, k.gm, k.tm));
    const gs = (Math.floor((x + 1000) / 2.2) % 2) ? COL.green1 : COL.green2;
    c.lerp(gs, k.gmi);
    c.lerp(COL.pad, k.pm * .8);
    c.lerp(COL.sand, k.sand);
    const beach = ss(.02, .25, k.sea) * (1 - ss(.55, .8, k.sea));
    c.lerp(COL.beach, beach);
    c.lerp(COL.wet, ss(.7, .95, k.sea));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .96, metalness: 0 });
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = `varying vec3 vWP;
      float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
      ` + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      float camD = length(vWP - cameraPosition);
      float fine = vn(vWP.xz * 7.0) * smoothstep(2.5, 7.0, camD) * (1.0 - clamp(camD / 40.0, 0.0, 1.0));
      float mid = vn(vWP.xz * 1.3);
      float broad = vn(vWP.xz * 0.12);
      diffuseColor.rgb *= 0.78 + 0.16 * mid + 0.14 * broad + 0.16 * fine;`);
  };
  const mesh = new THREE.Mesh(g, mat);
  mesh.receiveShadow = true; mesh.castShadow = !small;
  return mesh;
}

// ---------- renderer / scene ----------
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (e) { stage.classList.add('ready', 'titled'); $('loading').textContent = ''; throw e; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .45;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(small ? 46 : 34, 16 / 9, .01, 9000);
const U = { time: { value: 0 } };

const sky = new Sky(); sky.scale.setScalar(8000); scene.add(sky);
const skyU = sky.material.uniforms;
const envScene = new THREE.Scene(); const sky2 = new Sky(); sky2.material = sky.material; envScene.add(sky2);
const pmrem = new THREE.PMREMGenerator(renderer);
let envRT = null;
function refreshEnv() { const rt = pmrem.fromScene(envScene); scene.environment = rt.texture; if (envRT) envRT.dispose(); envRT = rt; }

const sunLight = new THREE.DirectionalLight(0xffd2a0, 2);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
Object.assign(sunLight.shadow.camera, { left: -150, right: 150, top: 170, bottom: -170, near: 1, far: 900 });
sunLight.shadow.bias = -.0015; sunLight.shadow.normalBias = .9;
sunLight.target.position.set(0, 0, -90);
scene.add(sunLight, sunLight.target);
const hemi = new THREE.HemisphereLight(0xa9b6d6, 0x4a3f2c, .35); scene.add(hemi);
scene.fog = new THREE.FogExp2(0xbfae9f, .0009);

// land and sea
scene.add(terrainMesh(-900, 900, 320, -760, small ? 120 : 180, small ? 70 : 108, -.35, false));
scene.add(terrainMesh(-118, 118, 46, -248, small ? 150 : 270, small ? 190 : 340, 0, true));
const sea = new THREE.Mesh(new THREE.PlaneGeometry(16000, 16000), new THREE.MeshStandardMaterial({ color: 0x24343f, roughness: .14, metalness: .05 }));
sea.rotation.x = -Math.PI / 2; sea.position.y = -.45; sea.receiveShadow = true; scene.add(sea);

// fescue
function bladeGeo(w) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-w, 0, 0, w, 0, 0, -w * .6, .5, 0, w * .6, .5, 0, 0, 1, 0]), 3));
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0, .5, 1, .5, .5, 1]), 2));
  g.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4]);
  g.computeVertexNormals();
  return g;
}
function swayMaterial(color, strength) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = U.time;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <project_vertex>', `
      vec4 mvPosition = vec4( transformed, 1.0 );
      #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
        vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      #else
        vec3 ip = vec3(0.0);
      #endif
      float hgt = uv.y * uv.y;
      float gust = smoothstep(0.25, 1.0, sin(uTime * 0.7 - ip.x * 0.035 - ip.z * 0.02) * 0.5 + 0.5);
      float flutter = sin(uTime * 2.6 + ip.x * 0.7 + ip.z * 0.5) * 0.3;
      float w = (0.25 + gust * 0.9 + flutter) * ${strength.toFixed(3)} * hgt;
      mvPosition.x += w * 0.85; mvPosition.z += w * 0.45; mvPosition.y -= abs(w) * 0.25;
      mvPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * mvPosition;`);
  };
  return mat;
}
{
  const N = small ? 9000 : 26000;
  const mesh = new THREE.InstancedMesh(bladeGeo(.028), swayMaterial(0xffffff, .42), N);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), pos = new THREE.Vector3(), c = new THREE.Color();
  const tones = [C('#a19a5e'), C('#8a8650'), C('#b9ab72'), C('#76784a'), C('#c2b37e')];
  let n = 0, guard = 0;
  while (n < N && guard++ < N * 12) {
    const x = (Math.random() * 2 - 1) * 112, z = 40 - Math.random() * 280;
    const k = course(x, z);
    if (k.m > .12 || k.tm > .05 || k.sand > .05 || k.sea > .03 || k.pm > .2 || k.y < -.3) continue;
    const clump = vnoise(x * .16 + 4, z * .16) * .5 + .5;
    if (Math.random() > .35 + clump * .65) continue;
    pos.set(x, k.y - .02, z);
    e.set((Math.random() - .5) * .35, Math.random() * Math.PI, (Math.random() - .5) * .35); q.setFromEuler(e);
    const h = (.32 + clump * .75) * (.7 + Math.random() * .5); s.set(1, h, 1);
    m4.compose(pos, q, s); mesh.setMatrixAt(n, m4);
    c.copy(tones[(Math.random() * tones.length) | 0]).multiplyScalar(.85 + Math.random() * .3); mesh.setColorAt(n, c);
    n++;
  }
  mesh.count = n; mesh.receiveShadow = true; scene.add(mesh);
}

// tee, ball, close-up grass and dew
const R = .02135;
const TEE = new THREE.Vector3(0, TEE_H + .032 + R, 1);
{
  const N = small ? 9000 : 18000;
  const mesh = new THREE.InstancedMesh(bladeGeo(.0018), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .8, side: THREE.DoubleSide }), N);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), pos = new THREE.Vector3(), c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 1.1;
    pos.set(Math.cos(a) * r, TEE_H - .002, 1 + Math.sin(a) * r);
    e.set((Math.random() - .5) * .25, Math.random() * Math.PI, (Math.random() - .5) * .25); q.setFromEuler(e);
    s.set(1, .009 + Math.random() * .014, 1); m4.compose(pos, q, s); mesh.setMatrixAt(i, m4);
    c.copy(Math.random() > .5 ? COL.fair1 : COL.fair2).multiplyScalar(1.1 + Math.random() * .6); mesh.setColorAt(i, c);
  }
  scene.add(mesh);
}
const dewU = { uLight: { value: 0 } };
{
  const N = 420, p = new Float32Array(N * 3), ph = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, r = .04 + Math.sqrt(Math.random()) * 1.1; p[i * 3] = Math.cos(a) * r; p[i * 3 + 1] = TEE_H + .004 + Math.random() * .03; p[i * 3 + 2] = 1 + Math.sin(a) * r; ph[i] = Math.random() * 40; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.time, uLight: dewU.uLight, uScale: { value: 400 } },
    vertexShader: `attribute float phase; uniform float uTime, uLight, uScale; varying float vA;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = clamp(0.0016 * uScale / -mv.z, 0.0, 26.0);
      vA = uLight * pow(0.5 + 0.5 * sin(uTime * 2.2 + phase), 6.0); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c);
      float core = pow(max(0.0, 1.0 - d * 2.0), 3.0);
      float star = max(0.0, 1.0 - abs(c.x) * 16.0) * max(0.0, 1.0 - abs(c.y) * 2.1) + max(0.0, 1.0 - abs(c.y) * 16.0) * max(0.0, 1.0 - abs(c.x) * 2.1);
      gl_FragColor = vec4(vec3(1.0, 0.95, 0.86) * 3.0, (core + star * 0.5) * vA); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(g, mat); pts.frustumCulled = false; scene.add(pts);
  dewU.mat = mat;
}
const peg = new THREE.Group();
{
  const wood = new THREE.MeshStandardMaterial({ color: 0xe9dcc0, roughness: .5 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.0022, .0011, .05, 16), wood); stem.position.y = -.004;
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(.0058, .0024, .007, 24, 1, true), wood); cup.position.y = .0205;
  peg.add(stem, cup); peg.position.set(0, TEE_H + .007, 1); peg.traverse(o => { o.castShadow = true; }); scene.add(peg);
}
function dimpledBall() {
  const g = new THREE.SphereGeometry(R, small ? 96 : 140, small ? 64 : 96);
  const pts = [], N = 336, ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = ga * i; pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r)); }
  const p = g.attributes.position, v = new THREE.Vector3(), rad = .108;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    let best = 9; for (const q of pts) { const a = v.angleTo(q); if (a < best) best = a; }
    const d = best < rad ? .00058 * (1 - (best / rad) ** 2) : 0;
    v.multiplyScalar(R - d); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const ball = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: 0xf6f3ec, roughness: .32, clearcoat: .8, clearcoatRoughness: .12 }));
  ball.castShadow = true; return ball;
}
const ball = dimpledBall(); scene.add(ball);
function softSpot(alpha) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, `rgba(0,0,0,${alpha})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}
const contact = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: softSpot(.75), transparent: true, depthWrite: false }));
contact.rotation.x = -Math.PI / 2; scene.add(contact);

// pin, flag, cup
const PIN_Y = yAt(PIN.x, PIN.z);
{
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.0125, .0125, 2.3, 12), new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: .4 }));
  pole.position.set(PIN.x, PIN_Y + 1.15, PIN.z); pole.castShadow = true; scene.add(pole);
  const cup = new THREE.Mesh(new THREE.CircleGeometry(.054, 32), new THREE.MeshBasicMaterial({ color: 0x050605 }));
  cup.rotation.x = -Math.PI / 2; cup.position.set(PIN.x, PIN_Y + .012, PIN.z); scene.add(cup);
  const fg = new THREE.PlaneGeometry(.62, .42, 24, 12); fg.translate(.31, 0, 0);
  const fm = new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: .7, side: THREE.DoubleSide, emissive: 0x2a1c05 });
  fm.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = U.time;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      float k = position.x / 0.62;
      transformed.z += sin(uTime * 5.2 - position.x * 9.0) * 0.07 * k + sin(uTime * 2.1) * 0.04 * k;
      transformed.y -= k * k * 0.03;`);
  };
  const flag = new THREE.Mesh(fg, fm); flag.position.set(PIN.x + .012, PIN_Y + 2.06, PIN.z); flag.rotation.y = .5; flag.castShadow = true; scene.add(flag);
}

// clubhouse
const windows = [];
{
  const grp = new THREE.Group(), y0 = PAD_H;
  const white = new THREE.MeshStandardMaterial({ color: 0xb3ab9c, roughness: .95 });
  const slate = new THREE.MeshStandardMaterial({ color: 0x2e3338, roughness: .7 });
  const gable = (w, h, len) => {
    const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false }); g.translate(0, 0, -len / 2); g.rotateY(Math.PI / 2); return g;
  };
  const body = new THREE.Mesh(new THREE.BoxGeometry(12, 3.6, 6), white); body.position.y = 1.8;
  const roof = new THREE.Mesh(gable(6.8, 2.5, 12.8), slate); roof.position.y = 3.6;
  const wing = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 5), white); wing.position.set(7.5, 1.5, 1.2);
  const wroof = new THREE.Mesh(gable(5.6, 1.8, 5.6), slate); wroof.rotation.y = Math.PI / 2; wroof.position.set(7.5, 3, 1.2);
  const ch1 = new THREE.Mesh(new THREE.BoxGeometry(.7, 1.6, .7), white); ch1.position.set(-4.8, 5.4, 0);
  const ch2 = ch1.clone(); ch2.position.x = 4.8;
  grp.add(body, roof, wing, wroof, ch1, ch2);
  for (let i = 0; i < 5; i++) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffc777).multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: 0 }));
    w.position.set(-4.6 + i * 2.3, 2, 3.02); grp.add(w); windows.push(w);
  }
  grp.traverse(o => { if (o.isMesh && o.material !== undefined && !windows.includes(o)) { o.castShadow = true; o.receiveShadow = true; } });
  grp.position.set(CLUB.x, y0, CLUB.z); grp.rotation.y = .9; scene.add(grp);
}

// gulls
const gulls = [];
{
  const mat = new THREE.MeshStandardMaterial({ color: 0x3b3e45, roughness: .9, side: THREE.DoubleSide });
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group();
    const wl = new THREE.Mesh(new THREE.PlaneGeometry(.55, .14), mat); wl.geometry.translate(-.28, 0, 0);
    const wr = new THREE.Mesh(new THREE.PlaneGeometry(.55, .14), mat); wr.geometry.translate(.28, 0, 0);
    wl.rotation.x = wr.rotation.x = -Math.PI / 2;
    const l = new THREE.Group(); l.add(wl); const r = new THREE.Group(); r.add(wr);
    g.add(l, r); g.userData = { l, r, rad: 22 + i * 9, h: 16 + i * 3.5, sp: .12 + i * .025, ph: i * 1.7 };
    scene.add(g); gulls.push(g);
  }
}

// mist
const mists = [];
{
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d');
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(cv);
  for (let i = 0; i < 16; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xf3e6d6, transparent: true, depthWrite: false, opacity: 0 }));
    const px = (Math.random() * 2 - 1) * 90, pz = -30 - Math.random() * 220;
    sp.position.set(px, yAt(px, pz) + 1.4, pz); sp.scale.set(38 + Math.random() * 30, 6 + Math.random() * 3, 1);
    sp.userData.x = px; sp.userData.ph = Math.random() * 6; scene.add(sp); mists.push(sp);
  }
}

// flight
const LAND = new THREE.Vector3(-.7, yAt(-.7, -157.4) + R, -157.4);
const REST = new THREE.Vector3(PIN.x - .62, yAt(PIN.x - .62, PIN.z + .5) + R, PIN.z + .5);
const curve = new THREE.CatmullRomCurve3([
  TEE.clone(), new THREE.Vector3(.5, TEE.y + 9, -22), new THREE.Vector3(1.8, TEE.y + 31, -78),
  new THREE.Vector3(1.1, TEE.y + 27, -122), new THREE.Vector3(0, LAND.y + 8.5, -148), LAND.clone(),
], false, 'centripetal');
const SEG = 240, RADIAL = 8;
const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, .045, RADIAL, false), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xd4a843).multiplyScalar(2.4), toneMapped: false, transparent: true, opacity: .95, depthWrite: false }));
tube.geometry.setDrawRange(0, 0); tube.frustumCulled = false; scene.add(tube);
let apexY = 0; for (let i = 0; i <= 200; i++) apexY = Math.max(apexY, curve.getPoint(i / 200).y);

// ---------- light presets ----------
const LIGHT = {
  dawn: { az: .3, e0: .4, e1: 3.6, eMax: 7, turb: 4.5, ray: 2.2, mie: .005, exp0: .42, exp1: .48, sun: [0xffb98a, 0xffe0b8], int: [.6, 2.8], fog: [0x7f8394, 0xd6c0a6], mist: [.26, .07], win: [1, 0], dew: [.7, 1] },
  dusk: { az: Math.PI + .6, e0: 9, e1: 1.2, eMax: -1.2, turb: 8.5, ray: 3.2, mie: .008, exp0: .36, exp1: .28, sun: [0xffd4a0, 0xff9a5c], int: [2.4, 1], fog: [0xc9a284, 0x8f6c70], mist: [.08, .1], win: [0, 1], dew: [.6, .2] },
};
let mode = CFG.mode === 'dawn' ? 'dawn' : 'dusk';
const sunDir = new THREE.Vector3(), tmpC = new THREE.Color(), tmpC2 = new THREE.Color();

// ---------- post ----------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bokeh = new BokehPass(scene, camera, { focus: .19, aperture: .0035, maxblur: .013 });
composer.addPass(bokeh);
const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), .5, .55, .9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false); composer.setSize(w, h);
  camera.aspect = w / h; camera.fov = (w / h < 1) ? 52 : (small ? 46 : 34); camera.updateProjectionMatrix();
  bokeh.uniforms.aspect.value = camera.aspect;
  dewU.mat.uniforms.uScale.value = h * renderer.getPixelRatio();
}
new ResizeObserver(resize).observe(stage);

// ---------- choreography ----------
const T_LAUNCH = 2.5, T_CUT = 2.66, T_FLY = 3.1, T_LAND = T_LAUNCH + T_FLY, T_HERO0 = 4.9, T_HERO1 = 6.9, T_TITLE = 6.4;
const easeOut = (x, p) => 1 - Math.pow(1 - x, p);
const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);
const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3(), v4 = new THREE.Vector3();

function flightU(t) { return easeOut(Math.min(1, Math.max(0, (t - T_LAUNCH) / T_FLY)), 1.65); }
function ballAt(t, out) {
  if (t < T_LAUNCH) return out.copy(TEE);
  if (t < T_LAND) return curve.getPoint(flightU(t), out);
  const dir = v4.copy(REST).sub(LAND); dir.y = 0;
  const b = Math.min(1, (t - T_LAND) / .34);
  if (b < 1) { out.copy(LAND).addScaledVector(dir, .32 * b); out.y = LAND.y + .2 * Math.sin(Math.PI * b); return out; }
  const r = easeOut(Math.min(1, (t - T_LAND - .34) / 1.3), 3);
  out.copy(LAND).addScaledVector(dir, .32 + .68 * r); out.y = yAt(out.x, out.z) + R; return out;
}
function shotMacro(t, pos, tgt) {
  const s = Math.min(1, t / T_LAUNCH);
  pos.set(TEE.x + .07 + .035 * s, TEE.y + .006 + .012 * s, TEE.z + .19 - .03 * s);
  tgt.set(TEE.x - .004, TEE.y + .002, TEE.z - .1);
}
function shotChase(t, pos, tgt) {
  const u = flightU(Math.max(t, T_CUT));
  curve.getPoint(Math.max(0, u - .075), pos);
  pos.add(v3.set(2.2 + 1.5 * u, 1.4 + 4.2 * u, 6 + 7 * u));
  curve.getPoint(u, tgt); tgt.lerp(v3.set(G.x, GREEN_H, G.z), u * u * .4);
}
function shotHero(t, pos, tgt) {
  const d = Math.max(0, t - T_HERO1);
  const a = .82 + d * .008, r = 38 - Math.min(6, d * .2);
  pos.set(G.x + Math.sin(a) * r, GREEN_H + 13 + Math.sin(d * .2) * .2, G.z + Math.cos(a) * r);
  tgt.set(G.x - 28, GREEN_H - .5, G.z - 30);
}
const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(), hp = new THREE.Vector3(), ht = new THREE.Vector3();

let clock0 = performance.now(), offset = 0, titled = false, lastEnv = -1, running = true;

function update(t) {
  const L = LIGHT[mode];
  U.time.value = t;
  // sun and sky
  const prog = smoother(Math.min(1, t / 10));
  let elev = lerp(L.e0, L.e1, prog);
  if (t > 10) elev = lerp(L.e1, L.eMax, Math.min(1, (t - 10) / 60));
  sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), L.az);
  skyU.sunPosition.value.copy(sunDir);
  skyU.turbidity.value = L.turb; skyU.rayleigh.value = L.ray; skyU.mieCoefficient.value = L.mie; skyU.mieDirectionalG.value = .86;
  renderer.toneMappingExposure = lerp(L.exp0, L.exp1, prog);
  sunLight.position.copy(sunLight.target.position).addScaledVector(sunDir, 400);
  sunLight.color.copy(tmpC.setHex(L.sun[0])).lerp(tmpC2.setHex(L.sun[1]), prog);
  sunLight.intensity = lerp(L.int[0], L.int[1], prog) * ss(-1.5, 1.5, elev);
  hemi.intensity = .2 + .25 * ss(-1, 8, elev);
  scene.fog.color.copy(tmpC.setHex(L.fog[0])).lerp(tmpC2.setHex(L.fog[1]), prog);
  const envTick = Math.floor(t * 2);
  if (envTick !== lastEnv && (t < 12 || envTick % 4 === 0)) { refreshEnv(); lastEnv = envTick; }
  // atmosphere details
  mists.forEach((m, i) => { m.material.opacity = lerp(L.mist[0], L.mist[1], prog) * (.7 + .3 * Math.sin(t * .2 + m.userData.ph)); m.position.x = m.userData.x + Math.sin(t * .05 + m.userData.ph) * 8; m.position.y += 0; });
  windows.forEach((w, i) => { const k = ss(0, .25, prog * 1.25 - [.2, .45, .3, .7, .55, .85][i] * .9 + .05); w.material.opacity = lerp(L.win[0], L.win[1], k) * .9; });
  dewU.uLight.value = lerp(L.dew[0], L.dew[1], ss(.2, .6, prog)) * (1 - ss(T_CUT, T_CUT + .1, t) * .0);
  gulls.forEach((g) => { const d = g.userData, a = t * d.sp + d.ph; g.position.set(-25 + Math.cos(a) * d.rad, d.h + Math.sin(a * 1.7) * 1.2, -175 + Math.sin(a) * d.rad * .6); g.rotation.y = -a; const f = Math.sin(t * 9 + d.ph) * .55; d.l.rotation.z = f; d.r.rotation.z = -f; });
  // ball, tracer, readout
  ballAt(t, v1); ball.position.copy(v1);
  if (t > T_LAUNCH && t < T_LAND + 1.6) ball.rotation.x -= .5;
  const onGround = t < T_LAUNCH || t > T_LAND;
  contact.position.set(v1.x, (onGround ? (t < T_LAUNCH ? TEE_H : yAt(v1.x, v1.z)) : yAt(v1.x, v1.z)) + .004, v1.z);
  const lift = onGround ? 0 : v1.y - yAt(v1.x, v1.z);
  const cs = t < T_LAUNCH ? .05 : .07 + lift * .02; contact.scale.set(cs, cs, 1); contact.material.opacity = t < T_LAUNCH ? .8 : Math.max(0, .55 - lift * .05);
  const u = flightU(t);
  tube.geometry.setDrawRange(0, Math.floor(u * SEG) * RADIAL * 6);
  tube.material.opacity = .95 * (1 - ss(T_HERO0, T_HERO0 + 1.2, t));
  tube.visible = tube.material.opacity > .01;
  const flying = t > T_LAUNCH + .05 && t < T_LAND + 1.6;
  stage.classList.toggle('flying', flying);
  if (flying || t < T_LAUNCH) {
    curve.getPoint(u, v2);
    $('tCarry').textContent = Math.round(Math.hypot(v2.x - TEE.x, v2.z - TEE.z) * 1.0936);
    $('tApex').textContent = Math.round(Math.max(0, (t > T_LAUNCH ? Math.min(apexY, Math.max(v2.y, (u > .5 ? apexY : v2.y))) : TEE.y) - TEE.y) * 1.0936);
    $('tHang').textContent = Math.max(0, Math.min(T_FLY, t - T_LAUNCH)).toFixed(1);
  }
  // camera
  if (t < T_CUT) { shotMacro(t, camPos, camTgt); camera.near = .006; bokeh.enabled = true; }
  else {
    camera.near = .25; bokeh.enabled = false;
    shotChase(t, camPos, camTgt);
    if (t > T_HERO0) { shotHero(t, hp, ht); const k = smoother(Math.min(1, (t - T_HERO0) / (T_HERO1 - T_HERO0))); camPos.lerp(hp, k); camTgt.lerp(ht, k); }
  }
  camera.updateProjectionMatrix();
  camera.position.copy(camPos); camera.lookAt(camTgt);
  bokeh.uniforms.nearClip.value = camera.near; bokeh.uniforms.farClip.value = camera.far;
  bokeh.uniforms.focus.value = camera.position.distanceTo(ball.position);
  bloom.strength = lerp(.4, .7, ss(T_LAUNCH, T_LAUNCH + .8, t)) * (t > T_HERO1 ? .85 : 1);
  if (!titled && t >= T_TITLE) { titled = true; stage.classList.add('titled'); stage.dispatchEvent(new CustomEvent('intro:titled')); }
}

function frame() {
  if (!running) return;
  const t = (performance.now() - clock0) / 1000 + offset;
  update(t); composer.render();
  stage.classList.add('ready');
  requestAnimationFrame(frame);
}
function restart(at = 0) {
  clock0 = performance.now(); offset = at; titled = false; lastEnv = -1;
  stage.classList.remove('titled', 'flying');
  if (reduce) { offset = 0; update(14); composer.render(); stage.classList.add('ready'); return; }
}
function setMode(m) { mode = m; $('mDawn')?.setAttribute('aria-pressed', m === 'dawn'); $('mDusk')?.setAttribute('aria-pressed', m === 'dusk'); restart(0); }
$('mDawn')?.addEventListener('click', () => setMode('dawn'));
$('mDusk')?.addEventListener('click', () => setMode('dusk'));
$('replay')?.addEventListener('click', () => restart(0));
$('skip')?.addEventListener('click', () => { if (reduce) return; clock0 = performance.now(); offset = T_HERO1 + .2; });
[['cfgEyebrow', 'eyebrow'], ['cfgTitle', 'title'], ['cfgSub', 'sub']].forEach(([i, o]) => $(i)?.addEventListener('input', (e) => { $(o).textContent = e.target.value; }));
for (const k of ['eyebrow', 'title', 'sub']) if (CFG[k] && $(k)) $(k).textContent = CFG[k];
document.addEventListener('visibilitychange', () => { if (document.hidden) { running = false; offset += (performance.now() - clock0) / 1000; } else if (!running && !reduce) { running = true; clock0 = performance.now(); requestAnimationFrame(frame); } });

resize();
window.__intro = { scene, THREE, bokeh, seek: (t) => { offset = t; clock0 = performance.now(); }, setMode, render: (t) => { update(t); composer.render(); }, stop: () => { running = false; }, freeze: (m, t) => { running = false; mode = m; titled = false; stage.classList.remove('titled'); lastEnv = -1; update(t); composer.render(); } };
if (reduce) { update(14); composer.render(); stage.classList.add('ready', 'titled'); running = false; }
else requestAnimationFrame(frame);
