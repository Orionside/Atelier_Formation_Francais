
import * as THREE from 'three';
import {prepareFurniture20,installFurniture20} from './furniture20.js?v=20261021-2';
import {createWardrobeController} from './wardrobe-state.js?v=20261021-2';
import {createWardrobeLearning} from './wardrobe-learning.js?v=20261021-2';
import { realism } from './realism.js?v=20261021-2';
import { createInspector } from './inspection.js?v=20261021-2';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { loadPalaceAssets, photographicMaterials, installPalace } from './palace.js?v=20261021-2';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createDiscovery } from './discovery.js?v=20261021-2';
import {preparePhotoreal,installPhotoreal,indexLightingMeshes,applyBakedLighting,finishTextiles,installMirror} from './photoreal.js?v=20261021-2';
import {exteriorLearning} from './exteriors.js?v=20261021-2';
import {prepareAtelier,installAtelier,finishAtelier} from './atelier18.js?v=20261021-2';
import {prepareReceptionist,installReceptionist} from './welcome.js?v=20261021-2';

/* ---------- données ---------- */
const DATA = JSON.parse(document.getElementById('data').textContent);
const VOC = {};
DATA.vocab.forEach(v => VOC[v.id] = v);
DATA.minibar.forEach(v => VOC[v.id] = { ...v, z: 'minibar' });
const OBJ = {};
DATA.objets.forEach(o => OBJ[o.id] = o);
const VOCAB_IDS = DATA.vocab.map(v => v.id);

const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
const LOW = IS_TOUCH || Math.min(innerWidth, innerHeight) < 600;
const V3 = THREE.Vector3;
const PI = Math.PI;
const rnd = (a, b) => a + Math.random() * (b - a);
let seed = 7;
const srand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/* ---------- moteur ---------- */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .82;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfe7f3);
scene.fog = new THREE.Fog(0xcfe5ef, 300, 4200);
const camera = new THREE.PerspectiveCamera(LOW ? 68 : 60, innerWidth / innerHeight, 0.05, 3000);
camera.rotation.order = 'YXZ';

const pmrem = new THREE.PMREMGenerator(renderer);
const ROOM_ENV = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = ROOM_ENV;

/* ---------- ciel tropical (dégradé, soleil, nuages) ---------- */
const SUN_DIR = new V3(-0.35, 0.78, -0.52).normalize();
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: true,
  uniforms: { uSun: { value: SUN_DIR }, uTime: { value: 0 } },
  vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*p; gl_Position.z = gl_Position.w; }`,
  fragmentShader: `
    varying vec3 vDir; uniform vec3 uSun; uniform float uTime;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p*=2.03; a*=.5; } return s; }
    void main(){
      vec3 d = normalize(vDir);
      float y = max(d.y, 0.);
      vec3 zen = vec3(.13,.42,.80), hor = vec3(.74,.88,.96);
      vec3 col = mix(hor, zen, pow(y, .55));
      if (d.y < 0.) col = mix(hor, vec3(.55,.72,.80), clamp(-d.y*4.,0.,1.));
      float s = max(dot(d, uSun), 0.);
      col += vec3(1.,.93,.78) * (pow(s, 900.) * 18. + pow(s, 12.) * .25);
      if (d.y > 0.01) {
        vec2 uv = d.xz / (d.y + .12) * 1.6 + vec2(uTime*.004, 0.);
        float c = smoothstep(.52, .78, fbm(uv));
        float fade = smoothstep(.0, .25, d.y);
        col = mix(col, vec3(1.) * (.92 + .08*s), c * .85 * fade);
      }
      gl_FragColor = vec4(col, 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(2600, 32, 16), skyMat);
sky.renderOrder = -1;
scene.add(sky);
sky.visible=false;

/* environnement extérieur pour l'eau */
const skyScene = new THREE.Scene();
const skyClone = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), skyMat);
skyScene.add(skyClone);
const SKY_ENV = pmrem.fromScene(skyScene, 0).texture;

/* ---------- lumières ---------- */
const hemi = new THREE.HemisphereLight(0xcfe8ff, 0xe8d6b8, .72);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1dc, 3.4);
sun.castShadow = true;
sun.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048);
const SC = sun.shadow.camera;
SC.left = -16; SC.right = 16; SC.top = 16; SC.bottom = -16; SC.near = 1; SC.far = 160;
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);

const composer=new EffectComposer(renderer);composer.setPixelRatio(LOW?1:Math.min(devicePixelRatio,1.5));
composer.addPass(new RenderPass(scene,camera));
const contactShadows=new SSAOPass(scene,camera,innerWidth,innerHeight);contactShadows.kernelRadius=.20;contactShadows.minDistance=.001;contactShadows.maxDistance=.07;contactShadows.enabled=!LOW;composer.addPass(contactShadows);
composer.addPass(new OutputPass());

/* ---------- textures procédurales ---------- */
function tileNoise(size, period, sd) {
  // bruit de valeur périodique (tuilable)
  const g = new Float32Array(period * period);
  let s = sd * 9973 + 17;
  for (let i = 0; i < g.length; i++) { s = (s * 16807) % 2147483647; g[i] = s / 2147483647; }
  return (x, y) => { // x,y en [0,1)
    const fx = x * period, fy = y * period;
    const ix = Math.floor(fx), iy = Math.floor(fy);
    let tx = fx - ix, ty = fy - iy;
    tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
    const x0 = ((ix % period) + period) % period, y0 = ((iy % period) + period) % period;
    const x1 = (x0 + 1) % period, y1 = (y0 + 1) % period;
    const a = g[y0 * period + x0], b = g[y0 * period + x1], c = g[y1 * period + x0], d = g[y1 * period + x1];
    return (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty;
  };
}
function fbmMaker(sd, base = 4, oct = 5) {
  const ns = []; for (let i = 0; i < oct; i++) ns.push(tileNoise(0, base << i, sd + i * 31));
  return (x, y) => { let s = 0, a = .5, t = 0; for (let i = 0; i < oct; i++) { s += a * ns[i](x, y); t += a; a *= .5; } return s / t; };
}
function canvasTex(w, h, paint, { repeat = [1, 1], srgb = true, aniso = 8 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  paint(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = Math.min(aniso, renderer.capabilities.getMaxAnisotropy());
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function pixelTex(w, h, fn, opt) {
  return canvasTex(w, h, (ctx) => {
    const img = ctx.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const [r, g, b, a = 255] = fn(x / w, y / h, x, y);
      const i = (y * w + x) * 4; d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = a;
    }
    ctx.putImageData(img, 0, 0);
  }, opt);
}
const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

const TEX = {};
function buildTextures() {
  const S = LOW ? 512 : 1024;
  // parquet chêne clair, lames
  {
    const f = fbmMaker(3, 4, 4), g = tileNoise(0, 64, 9);
    TEX.oak = pixelTex(S, S, (u, v) => {
      const rows = 8, row = Math.floor(v * rows), rv = srandRow(row);
      const off = rv * 0.7, len = 0.5;
      const uu = (u + off) % 1, plank = Math.floor(uu / len);
      const tone = srandRow(row * 7 + plank) * 0.16 - 0.08;
      const grain = Math.sin((v * rows * 30 + f(uu * 0.5, v) * 9) * 3.1) * 0.5 + 0.5;
      const fine = g(uu * 0.25, v * 2);
      let c = mixc([196, 160, 118], [168, 128, 88], grain * 0.45 + fine * 0.3);
      c = c.map(x => x * (1 + tone));
      const ev = (v * rows) % 1, eu = (uu % len) / len;
      if (ev < 0.012 || ev > 0.988 || eu < 0.004 || eu > 0.996) c = c.map(x => x * 0.62);
      return c;
    }, { repeat: [1, 1] });
  }
  // noyer foncé (mobilier)
  {
    const f = fbmMaker(5, 4, 4);
    TEX.walnut = pixelTex(512, 512, (u, v) => {
      const gr = Math.sin((u * 60 + f(u, v) * 14)) * 0.5 + 0.5;
      return mixc([92, 62, 42], [62, 40, 27], gr * 0.6 + f(u * 2, v * 2) * 0.4);
    });
  }
  // marbre blanc veiné
  {
    const f = fbmMaker(11, 3, 6);
    TEX.marble = pixelTex(S, S, (u, v) => {
      const t = f(u, v);
      const vein = Math.abs(Math.sin((u * 2.2 + v * 1.3 + t * 5.5) * PI));
      const fine = Math.abs(Math.sin((u * 5 - v * 3 + t * 9) * PI));
      let c = [238, 236, 232];
      c = mixc(c, [150, 148, 146], Math.pow(1 - vein, 28) * 0.8);
      c = mixc(c, [190, 188, 186], Math.pow(1 - fine, 40) * 0.6);
      return c.map(x => x - t * 10);
    });
  }
  // marbre noir (accents réception, salle de bains)
  {
    const f = fbmMaker(23, 3, 6);
    TEX.marbleDark = pixelTex(512, 512, (u, v) => {
      const t = f(u, v);
      const vein = Math.abs(Math.sin((u * 1.6 - v * 2.1 + t * 6) * PI));
      return mixc([34, 36, 38], [210, 206, 200], Math.pow(1 - vein, 30) * 0.9);
    });
  }
  // lin (literie)
  {
    const g = tileNoise(0, 128, 4);
    TEX.linen = pixelTex(256, 256, (u, v, x, y) => {
      const w = ((x + y) % 2 ? 4 : -4) + g(u, v) * 10;
      const c = 244 + w; return [c, c - 1, c - 4];
    }, { repeat: [4, 4] });
  }
  // tissu bouclé (canapé)
  {
    const g = tileNoise(0, 128, 8), h = tileNoise(0, 32, 2);
    TEX.boucle = pixelTex(256, 256, (u, v) => {
      const k = g(u, v) * 0.6 + h(u, v) * 0.4;
      return mixc([214, 202, 184], [186, 172, 152], k);
    }, { repeat: [3, 3] });
  }
  // enduit mural
  {
    const f = fbmMaker(31, 8, 4);
    TEX.plaster = pixelTex(512, 512, (u, v) => { const k = f(u, v); const c = 242 + (k - .5) * 14; return [c, c - 2, c - 6]; }, { repeat: [2, 2] });
  }
  // grandes dalles de pierre (salle de bains)
  {
    const f = fbmMaker(41, 4, 5);
    TEX.stone = pixelTex(512, 512, (u, v) => {
      const k = f(u, v);
      let c = mixc([222, 214, 200], [196, 186, 170], k);
      const eu = (u * 2) % 1, ev = v;
      if (eu < 0.006 || eu > 0.994 || ev < 0.004 || ev > 0.996) c = [170, 164, 154];
      return c;
    });
  }
  // moquette couloir à motif losange
  {
    const g = tileNoise(0, 128, 6);
    TEX.carpet = pixelTex(512, 512, (u, v) => {
      const a = Math.abs(((u * 4) % 1) - .5) + Math.abs(((v * 4) % 1) - .5);
      let c = [44, 78, 84];
      if (Math.abs(a - .35) < .02) c = [184, 150, 92];
      return c.map(x => x * (0.9 + g(u, v) * 0.2));
    }, { repeat: [1, 1] });
  }
  // tapis tissé avec bordure
  {
    const g = tileNoise(0, 256, 12);
    TEX.rug = pixelTex(512, 512, (u, v) => {
      const b = Math.min(u, v, 1 - u, 1 - v);
      let c = mixc([226, 216, 198], [210, 198, 178], g(u, v));
      if (b < .06 && b > .045) c = [120, 140, 128];
      if (b < .03) c = [196, 182, 160];
      return c;
    }, { repeat: [1, 1] });
  }
  // herbe, sable, dallage piscine
  {
    const f = fbmMaker(51, 8, 5);
    TEX.grass = pixelTex(512, 512, (u, v) => mixc([76, 128, 58], [112, 158, 74], f(u, v)), { repeat: [60, 30] });
    const s = fbmMaker(61, 16, 4);
    TEX.sand = pixelTex(512, 512, (u, v) => mixc([232, 214, 178], [214, 192, 150], s(u, v)), { repeat: [40, 20] });
    const d = fbmMaker(71, 4, 4);
    TEX.deck = pixelTex(512, 512, (u, v) => {
      let c = mixc([232, 222, 204], [214, 200, 178], d(u, v));
      const eu = (u * 2) % 1, ev = (v * 2) % 1;
      if (eu < .008 || ev < .008) c = c.map(x => x * .86);
      return c;
    }, { repeat: [14, 10] });
  }
  // normal map d'eau (tuilable)
  {
    const f = fbmMaker(81, 6, 4);
    const H = (u, v) => f(u, v);
    const e = 1 / 256;
    TEX.waterN = pixelTex(256, 256, (u, v) => {
      const dx = (H(u + e, v) - H(u - e, v)) * 40, dy = (H(u, v + e) - H(u, v - e)) * 40;
      const n = new V3(-dx, -dy, 1).normalize();
      return [(n.x * .5 + .5) * 255, (n.y * .5 + .5) * 255, (n.z * .5 + .5) * 255];
    }, { srgb: false });
  }
  // caustiques (fond de piscine)
  {
    const pts = []; for (let i = 0; i < 26; i++) pts.push([srand(), srand()]);
    TEX.caustic = pixelTex(256, 256, (u, v) => {
      let d1 = 9, d2 = 9;
      for (const [px, py] of pts) for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
        const dx = u - px - ox, dy = v - py - oy, d = dx * dx + dy * dy;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      const e = clamp(1 - (Math.sqrt(d2) - Math.sqrt(d1)) * 14);
      const c = mixc([86, 190, 210], [235, 255, 255], Math.pow(e, 3));
      return c;
    }, { repeat: [6, 3] });
  }
  // écorce de palmier
  TEX.bark = pixelTex(128, 256, (u, v) => {
    const r = (v * 24) % 1; const k = r < .2 ? .7 : 1;
    return [128 * k, 104 * k, 78 * k];
  }, { repeat: [1, 1] });
  // palme (alpha)
  TEX.frond = canvasTex(512, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#5b6b2c'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    for (let i = 4; i < w - 6; i += 7) {
      const t = i / w, L = (h / 2 - 4) * Math.sin(Math.min(1, t * 1.3) * PI * .92 + .15);
      for (const s of [-1, 1]) {
        const g = ctx.createLinearGradient(i, h / 2, i + 18, h / 2 + s * L);
        g.addColorStop(0, '#3f6b25'); g.addColorStop(1, '#6f9a3a');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(i, h / 2);
        ctx.quadraticCurveTo(i + 6, h / 2 + s * L * .5, i + 16, h / 2 + s * L);
        ctx.lineTo(i + 19, h / 2 + s * L * .96);
        ctx.quadraticCurveTo(i + 9, h / 2 + s * L * .45, i + 4, h / 2);
        ctx.fill();
      }
    }
  }, { aniso: 4 });
}
function srandRow(n) { const x = Math.sin(n * 91.7 + 13.1) * 43758.5453; return x - Math.floor(x); }

/* ---------- matériaux ---------- */
const MAT = {};
function std(p) { return new THREE.MeshStandardMaterial(p); }
function phys(p) { return new THREE.MeshPhysicalMaterial(p); }
function texClone(t, rx, ry) { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rx, ry); return c; }
function buildMaterials() {
  MAT.oak = phys({ map: TEX.oak, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35, envMapIntensity: 0.7 });
  MAT.walnut = std({ map: TEX.walnut, roughness: 0.5, envMapIntensity: 0.7 });
  MAT.oakFurn = std({ map: TEX.oak, roughness: 0.55, color: 0xf4ece2 });
  MAT.marble = phys({ map: TEX.marble, roughness: 0.12, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 0.9 });
  MAT.marbleDark = phys({ map: TEX.marbleDark, roughness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.1 });
  MAT.plaster = std({ map: TEX.plaster, roughness: 0.92, envMapIntensity: 0.6 });
  MAT.plasterWarm = std({ map: TEX.plaster, roughness: 0.92, color: 0xf3e9dc, envMapIntensity: 0.6 });
  MAT.ceiling = std({ color: 0xfbfaf7, roughness: 0.95, envMapIntensity: 0.5, emissive: 0xfff8ee, emissiveIntensity: 0.22 });
  MAT.linen = phys({map:TEX.linen,bumpMap:TEX.terryBump,bumpScale:.001,roughness:.93,sheen:.25,envMapIntensity:.65});
  MAT.boucle = phys({map:TEX.boucle,bumpMap:TEX.terryBump,bumpScale:.003,roughness:.94,sheen:.4,envMapIntensity:.6});
  MAT.velvetTeal = phys({ color: 0x1f5f63, roughness: 0.85, sheen: 1, sheenColor: new THREE.Color(0x6fb3b0), sheenRoughness: 0.5 });
  MAT.velvetMustard = phys({ color: 0xc9962e, roughness: 0.85, sheen: 1, sheenColor: new THREE.Color(0xf5d47a), sheenRoughness: 0.5 });
  MAT.leather = std({ color: 0x8a5a3a, roughness: 0.55 });
  MAT.brass = std({ color: 0xc9a25a, metalness: 1, roughness: 0.28 });
  MAT.chrome = std({color:0xe6e5e1,metalness:.88,roughness:.20,envMap:ROOM_ENV,envMapIntensity:1.55});
  MAT.blackMetal = std({ color: 0x1d1f20, metalness: 0.7, roughness: 0.4 });
  MAT.ceramic = phys({ color: 0xfbfbfa, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 });
  MAT.glass = phys({ color: 0xdff2f4, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.16, envMapIntensity: 1.2, depthWrite: false });
  MAT.glassDark = phys({ color: 0x29404a, roughness: 0.05, metalness: 0.4, envMap: SKY_ENV, envMapIntensity: 1.2 });
  MAT.mirror = std({ color: 0xe8eef0, metalness: 1, roughness: 0.02, envMapIntensity: 1.3 });
  MAT.screen = std({ color: 0x050607, roughness: 0.15, metalness: 0.3 });
  MAT.white = std({ color: 0xf6f5f1, roughness: 0.6 });
  MAT.lacquer = phys({ color: 0xf1ede6, roughness: 0.3, clearcoat: 0.5 });
  MAT.towel = phys({ color:0xfffdf8,roughness:.96,map:TEX.terry,bumpMap:TEX.terryBump,bumpScale:.006,sheen:.35,sheenColor:new THREE.Color(0xf2e8d6),side:THREE.DoubleSide });
  MAT.stone = std({ map: TEX.stone, roughness: 0.5 });
  MAT.stoneWall = std({ map: texClone(TEX.stone, 2, 2), roughness: 0.45 });
  MAT.carpet = std({ map: TEX.carpet, roughness: 1 });
  MAT.rug = std({ map: TEX.rug, roughness: 1 });
  MAT.rugBath = std({ color: 0xf0ece4, roughness: 1, map: TEX.boucle });
  MAT.grass = std({ map: TEX.grass, roughness: 1, envMapIntensity: 0.3 });
  MAT.sand = std({ map: TEX.sand, roughness: 1, envMapIntensity: 0.3 });
  MAT.deck = std({ map: TEX.deck, roughness: 0.8, envMapIntensity: 0.4 });
  MAT.render = std({ color: 0xf6f1e8, roughness: 0.9, envMapIntensity: 0.4 });
  MAT.pool = std({ map: TEX.caustic, roughness: 0.4, emissive: 0x2a8fa0, emissiveIntensity: 0.25 });
  MAT.water = phys({ color: 0x47c6d4, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.72, normalMap: TEX.waterN, normalScale: new THREE.Vector2(0.35, 0.35), envMap: SKY_ENV, envMapIntensity: 1.2 });
  MAT.sea = phys({ color: 0x0f6f8c, roughness: 0.08, metalness: 0.1, normalMap: texClone(TEX.waterN, 1, 1), normalScale: new THREE.Vector2(0.6, 0.6), envMap: SKY_ENV, envMapIntensity: 1 });
  MAT.lagoon = phys({ color: 0x2fb3b8, roughness: 0.08, transparent: true, opacity: 0.85, normalMap: texClone(TEX.waterN, 1, 1), normalScale: new THREE.Vector2(0.4, 0.4), envMap: SKY_ENV });
  MAT.bark = std({ map: TEX.bark, roughness: 0.95 });
  MAT.frond = std({ map: TEX.frond, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.75, envMapIntensity: 0.4 });
  MAT.leaf = std({ color: 0x3f7a3a, roughness: 0.6, side: THREE.DoubleSide });
  MAT.soil = std({ color: 0x3a2c22, roughness: 1 });
  MAT.pot = std({ color: 0xd8cbb7, roughness: 0.8 });
  MAT.skin = std({ color: 0xb98563, roughness: 0.6 });
  MAT.hair = std({ color: 0x1f1610, roughness: 0.7 });
  MAT.navy = std({ color: 0x1b2b44, roughness: 0.75 });
  MAT.shirt = std({ color: 0xf4f4f2, roughness: 0.8 });
  MAT.lampOn = std({ color: 0xfff3dc, emissive: 0xffd9a0, emissiveIntensity: 0, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.96 });
  MAT.spot = std({ color: 0xffffff, emissive: 0xfff4e2, emissiveIntensity: 1.6 });
  MAT.coral = std({ color: 0xd9604a, roughness: 0.7 });
  MAT.mustard = std({ color: 0xdcae44, roughness: 0.7 });
  MAT.teal = std({ color: 0x1f6f74, roughness: 0.7 });
  MAT.sail = std({ color: 0xf5f1e8, roughness: 0.9, side: THREE.DoubleSide });
  MAT.rattan = std({ color: 0xb48a58, roughness: 0.9 });
}

/* ---------- géométrie : utilitaires ---------- */
const STATIC = new THREE.Group(); scene.add(STATIC);
function setUV(geo, w, h, d, tile) {
  // BoxGeometry : px nx py ny pz nz ; ajuste les UV à la taille réelle
  const uv = geo.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i;
    uv.setXY(k, uv.getX(k) * dims[f][0] / tile, uv.getY(k) * dims[f][1] / tile);
  }
  uv.needsUpdate = true;
}
function mesh(geo, mat, { cast = true, recv = true } = {}) {
  const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = recv; return m;
}
/** boîte : x,z au centre, y = base */
function B(w, h, d, mat, x, y, z, parent = STATIC, o = {}) {
  let geo;
  if (o.r) geo = new RoundedBoxGeometry(w,h,d,o.seg || ([MAT.linen,MAT.towel,MAT.boucle,MAT.velvetTeal,MAT.velvetMustard].includes(mat)?5:3),o.r);
  else if(Math.min(w,h,d)>.018 && [MAT.walnut,MAT.oakFurn,MAT.lacquer,MAT.leather].includes(mat)) geo=new RoundedBoxGeometry(w,h,d,2,Math.min(.006,Math.min(w,h,d)*.12));
  else { geo = new THREE.BoxGeometry(w, h, d); if (o.tile) setUV(geo, w, h, d, o.tile); }
  const m = mesh(geo, mat, o);
  m.position.set(x, y + h / 2, z);
  if (o.ry) m.rotation.y = o.ry;
  parent.add(m); return m;
}
/** cylindre : y = base */
function C(rt, rb, h, mat, x, y, z, parent = STATIC, o = {}) {
  const m = mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 28, 1, !!o.open), mat, o);
  m.position.set(x, y + h / 2, z); parent.add(m); return m;
}
function S(r, mat, x, y, z, parent = STATIC, o = {}) {
  const m = mesh(new THREE.SphereGeometry(r, o.seg || 24, o.seg2 || 16), mat, o);
  m.position.set(x, y, z); if (o.sc) m.scale.set(...o.sc); parent.add(m); return m;
}
function L(points, mat, x, y, z, parent = STATIC, o = {}) {
  const m = mesh(new THREE.LatheGeometry(points.map(p => new THREE.Vector2(p[0], p[1])), o.seg || 32), mat, o);
  m.position.set(x, y, z); parent.add(m); return m;
}
/** plan horizontal (sol) : uv à l'échelle */
function floor(x1, z1, x2, z2, y, mat, tile, parent = STATIC, walk = true) {
  const w = x2 - x1, d = z2 - z1;
  const geo = new THREE.PlaneGeometry(w, d);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / tile, uv.getY(i) * d / tile);
  const m = mesh(geo, mat, { cast: false });
  m.rotation.x = -PI / 2; m.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
  parent.add(m);
  if (walk) WALK_MESHES.push(m);
  if(mat===MAT.ceiling)reg(m,'plafond');else if(walk)reg(m,'sol');
  return m;
}
/** mur entre deux points, avec ouvertures [{a,b,y0,y1}] le long du mur */
function wall(x1, z1, x2, z2, h, mat, openings = [], o = {}) {
  const t = o.t || 0.16, len = Math.hypot(x2 - x1, z2 - z1);
  const ang = Math.atan2(z2 - z1, x2 - x1);
  const g = new THREE.Group();
  g.position.set(x1, o.y || 0, z1); g.rotation.y = -ang;
  const piece = (a, b, y0, y1) => {
    if (b - a < 0.001 || y1 - y0 < 0.001) return;
    const m = B(b - a, y1 - y0, t, mat, (a + b) / 2, y0, 0, g, { tile: o.tile || 2, cast: o.cast !== false });
    return m;
  };
  const ops = [...openings].sort((p, q) => p.a - q.a);
  let cur = 0;
  for (const op of ops) {
    piece(cur, op.a, 0, h);
    piece(op.a, op.b, 0, op.y0);
    piece(op.a, op.b, op.y1, h);
    cur = op.b;
  }
  piece(cur, len, 0, h);
  (o.parent || STATIC).add(g);
  reg(g,'mur');
  return g;
}

/* ---------- collisions : zones marchables et obstacles ---------- */
const WALK = [];      // {x1,z1,x2,z2, zone, cond?}
const OBST = [];      // {x1,z1,x2,z2, cond?}
const WALK_MESHES = [];
function walk(x1, z1, x2, z2, zone, cond) { WALK.push({ x1, z1, x2, z2, zone, cond }); }
function obst(x1, z1, x2, z2, cond) { OBST.push({ x1: Math.min(x1, x2), z1: Math.min(z1, z2), x2: Math.max(x1, x2), z2: Math.max(z1, z2), cond }); }
const RAD = 0.26;
function freeAt(x, z) {
  let inside = false;
  for (const r of WALK) {
    if (r.cond && !r.cond()) continue;
    if (x > r.x1 + RAD && x < r.x2 - RAD && z > r.z1 + RAD && z < r.z2 - RAD) { inside = true; break; }
  }
  if (!inside) return false;
  for (const r of OBST) {
    if (r.cond && !r.cond()) continue;
    if (x > r.x1 - RAD && x < r.x2 + RAD && z > r.z1 - RAD && z < r.z2 + RAD) return false;
  }
  return true;
}
function zoneAt(x, z) {
  for (const r of WALK) if (r.zone && x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2) return r.zone;
  return null;
}

/* ---------- objets interactifs ---------- */
const INTER = [];
/** reg(obj, vid, {act}) : vid = id du lexique ; act = action optionnelle */
function reg(obj, vid, o = {}) {
  obj.userData.vid = vid;
  Object.assign(obj.userData, o);
  obj.traverse(m => { if (m.isMesh && (!m.userData.root || m.userData.root===obj)) m.userData.root = obj; });
  if(!INTER.includes(obj))INTER.push(obj);
  return obj;
}
function G(parent = STATIC, x = 0, y = 0, z = 0, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g); return g;
}

/* ---------- animations simples ---------- */
const TWEENS = [];
function tween(from, to, dur, set, done) {
  TWEENS.push({ t: 0, from, to, dur, set, done });
}
function stepTweens(dt) {
  for (let i = TWEENS.length - 1; i >= 0; i--) {
    const w = TWEENS[i]; w.t = Math.min(w.dur, w.t + dt);
    const k = w.t / w.dur, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    w.set(w.from + (w.to - w.from) * e);
    if (w.t >= w.dur) { TWEENS.splice(i, 1); w.done && w.done(); }
  }
}
const UPDATERS = [];

/* =========================================================
   MONDE : réception, couloir, suite (chambre, salle de bains, balcon), extérieur
   Convention : x,z au centre ; y = base. Unités : mètres.
   ========================================================= */
const STATE_REF = { doorOpen: false, slideOpen: false, wardrobeOpen: false };
const LIGHTS = {};      // lampes commutables
const DYN = {};         // références dynamiques (TV, clim, portes…)
const wardrobeController=createWardrobeController(STATE_REF,DYN,tween,refreshWardrobeControls);
const wardrobeLearning=createWardrobeLearning({roots:INTER,vocab:VOC,state:STATE_REF,dynamic:DYN,say,markSeen});
function refreshWardrobeControls(){
 const controls=wardrobeController.controls();
 document.querySelectorAll('[data-ward-action]').forEach(b=>{const c=controls.find(c=>c.action===b.dataset.wardAction);if(c){b.textContent=c.label;b.disabled=c.disabled;}});
 const status=document.querySelector('#wardrobeStatus');if(status)status.textContent=STATE_REF.wardrobeMoving?'Les portes sont en mouvement…':STATE_REF.wardrobeOpen?'Fermez les trois tiroirs avant de fermer les portes.':'Ouvrez les portes pour accéder aux tiroirs.';
 wardrobeLearning.refresh();
}
function wardrobeButtons(){return '<div class="wardrobe-actions">'+wardrobeController.controls().map(c=>'<button class="btn" data-ward-action="'+c.action+'" '+(c.disabled?'disabled':'')+'>'+c.label+'</button>').join('')+'</div>';}
function bindWardrobeButtons(parent){parent.querySelectorAll('[data-ward-action]').forEach(b=>b.onclick=()=>doAct(b.dataset.wardAction));refreshWardrobeControls();}

/* ---------- petits objets réutilisables ---------- */
function canvasPanel(w, h, draw, pw = 512) {
  const ph = Math.round(pw * h / w);
  const t = canvasTex(pw, ph, (ctx) => draw(ctx, pw, ph), { aniso: 4 });
  return t;
}
function signMesh(w, h, draw, parent, x, y, z, ry = 0, emissive = 0) {
  const t = canvasPanel(w, h, draw);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), std({ map: t, roughness: 0.6, emissive: emissive ? 0xffffff : 0, emissiveMap: emissive ? t : null, emissiveIntensity: emissive }));
  m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
const FONT_D = '"Marcellus", Georgia, serif';
const FONT_B = '"Atkinson Hyperlegible", system-ui, sans-serif';

function pottedPlant(parent,x,z,s=1,y=0){
 const g=G(parent,x,y,z);L([[0,0],[.19*s,0],[.22*s,.02*s],[.26*s,.46*s],[.265*s,.49*s],[.245*s,.51*s],[.232*s,.49*s]],MAT.pot,0,0,0,g,{seg:40});C(.23*s,.23*s,.015,MAT.soil,0,.47*s,0,g,{cast:false});
 for(let i=0;i<9;i++){const angle=i*2.399;const h=(.72+(i%4)*.19)*s;const end=[Math.cos(angle)*.27*s,.49*s+h,Math.sin(angle)*.27*s];REAL.tube(g,[[0,.48*s,0],[end[0]*.18,.7*s, end[2]*.18],[...end]],.006*s,MAT.leaf,24);
  const leaf=G(g,...end,angle);const mat=MAT.leaf.clone();mat.color.setHSL(.28+(i%3)*.014,.38,.21+(i%3)*.025);
  REAL.cloth(leaf,.30*s,.50*s,[0,0,0],(u,v)=>[(u-.5)*.33*s*Math.sin(v*PI),Math.sin(v*PI)*.045*s-v*.09*s,-v*.54*s],mat,24,30);
  REAL.tube(leaf,[[0,0,0],[0,.02*s,-.2*s],[0,-.09*s,-.54*s]],.0013*s,MAT.leaf,20);
 }g.userData.plantScale=s;reg(g,'plante');return g;
}
function lampShade(parent, x, y, z, r1, r2, h, name) {
  const mat = MAT.lampOn.clone();
  const sh = C(r1, r2, h, mat, x, y, z, parent, { open: true, cast: false, seg: 32 });
  const light = new THREE.PointLight(0xffd6a0, 0, 5.5, 2);
  light.position.set(x, y + h * 0.4, z);
  parent.add(light);
  LIGHTS[name] = LIGHTS[name] || [];
  LIGHTS[name].push({ mat, light, max: 2.2 });
  return sh;
}
function setLamp(name, on) {
  (LIGHTS[name] || []).forEach(l => { l.mat.emissiveIntensity = on ? 1.4 : 0; l.light.intensity = on ? l.max : 0; });
}
function bookStack(parent, x, y, z, ry = 0) {
  const g = G(parent, x, y, z, ry);
  const cols = [0x1f5f63, 0xc9962e, 0xe9e2d6];
  let yy = 0;
  cols.forEach((c, i) => { B(0.3 - i * 0.03, 0.035, 0.22 - i * 0.02, std({ color: c, roughness: 0.7 }), 0, yy, 0, g); yy += 0.035; });
  reg(g,'livres');
  return g;
}
function ceilingSpot(parent,x,y,z,r=.065){
 const g=G(parent,x,y,z);C(r,r,.008,MAT.chrome,0,0,0,g,{seg:40,cast:false});C(r*.81,r*.81,.014,MAT.blackMetal,0,-.005,0,g,{seg:40,cast:false});C(r*.65,r*.65,.003,MAT.spot,0,-.008,0,g,{seg:40,cast:false});g.userData.inspectionRotationX=PI;g.userData.inspectionPitch=.7;reg(g,'spot');return g;
}
function anthurium(parent, x, y, z, s = 1) {
  const g = G(parent, x, y, z);
  C(0.06 * s, 0.05 * s, 0.32 * s, MAT.glass, 0, 0, 0, g, { cast: false });
  const red = std({ color: 0xc1121f, roughness: 0.25, side: THREE.DoubleSide });
  const yel = std({ color: 0xf2c94c, roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * PI * 2;
    const st = C(0.006, 0.006, (0.5 + i * 0.05) * s, MAT.leaf, Math.cos(a) * 0.02, 0, Math.sin(a) * 0.02, g, { seg: 5 });
    st.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3);
    const top = new V3(Math.cos(a) * 0.15 * s, (0.5 + i * 0.05) * s, Math.sin(a) * 0.15 * s);
    const sp = S(1, red, top.x, top.y, top.z, g, { sc: [0.075 * s, 0.006, 0.065 * s] });
    sp.rotation.set(0.6, a, 0.2);
    const sx = C(0.006, 0.004, 0.07 * s, yel, top.x, top.y, top.z, g, { seg: 6 });
    sx.rotation.z = 0.4;
  }
  return g;
}

/* =========================================================
   1. RÉCEPTION (hall)  x[-8,8] z[30,44]
   ========================================================= */
function buildLobby() {
  const g = G(STATIC);
  const H = 4.6;
  floor(-8, 30, 8, 44, 0, MAT.marble, 1.6, g);
  const ceil = floor(-8, 30, 8, 44, H, MAT.ceiling, 4, g, false); ceil.rotation.x = PI / 2; ceil.castShadow = true;
  // murs
  wall(-8, 44, 8, 44, H, MAT.plasterWarm);
  wall(-8, 30, -8, 44, H, MAT.plasterWarm);
  wall(8, 30, 8, 44, H, MAT.plasterWarm);
  // façade vitrée nord (entrée)
  for (let x = -8; x < 8; x += 2) {
    B(0.06, H, 0.1, MAT.blackMetal, x, 0, 30, g);
    const gl = B(2, H, 0.03, MAT.glass, x + 1, 0, 30, g, { cast: false });
    gl.userData.pass = true;
  }
  B(16, 0.08, 0.12, MAT.blackMetal, 0, 2.9, 30, g);
  // Pierre claire mate : un fond continu et calme pour lire le nom de l'hôtel.
  const backdrop=std({color:0xe6ded0,roughness:.94,normalMap:MAT.plasterWarm.normalMap,normalScale:new THREE.Vector2(.025,.025)});
  B(12, H-.2, .12, backdrop, 0, .1, 43.88, g, {cast:false});
  for(const x of [-6,6])B(.016,H-.2,.014,MAT.brass,x,.1,43.809,g,{cast:false});
  const logo = signMesh(5.2, 1.3, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#94703d'; ctx.textAlign = 'center';
    ctx.font = `${h * 0.18}px ${FONT_D}`; ctx.fillText('★ ★ ★ ★', w / 2, h * 0.24);
    ctx.fillStyle = '#263b39';
    ctx.font = `${h * 0.42}px ${FONT_D}`; ctx.fillText('PALACE HÔTEL', w / 2, h * 0.68);
    ctx.fillStyle = '#465650';
    ctx.font = `${h * 0.14}px ${FONT_D}`; ctx.fillText('HÔTEL · FORT-DE-FRANCE', w / 2, h * 0.92);
  }, g, 0, 2.95, 43.8, PI);
  logo.material.transparent = true;
  reg(logo, 'reception');

  // comptoir de réception
  const desk = G(g, 0, 0, 41);
  B(6.2, 1.05, 0.7, MAT.marbleDark, 0, 0, 0, desk, { tile: 1.2 });
  B(6.5, 0.05, 0.95, MAT.marble, 0, 1.05, -0.05, desk);
  B(6.1, 0.06, 0.04, MAT.brass, 0, 0.1, -0.36, desk);
  B(6.0, 0.75, 0.6, MAT.walnut, 0, 0, 0.9, desk);
  reg(desk, 'comptoir');
  obst(-3.3, 40.5, 3.3, 44);
  // sonnette
  const bell = G(g, -1.6, 1.1, 40.75);
  C(0.07, 0.075, 0.02, MAT.blackMetal, 0, 0, 0, bell);
  S(0.06, MAT.brass, 0, 0.02, 0, bell, { sc: [1, 0.75, 1] });
  C(0.008, 0.008, 0.03, MAT.brass, 0, 0.065, 0, bell, { seg: 8 });
  reg(bell, 'sonnette', { act: 'dialogue' });
  // ordinateur (écran tourné vers la réceptionniste)
  const pc = G(g, 1.5, 1.1, 41.15, PI + 0.3);
  B(0.62, 0.38, 0.03, MAT.blackMetal, 0, 0.16, 0, pc);
  B(0.04, 0.16, 0.04, MAT.chrome, 0, 0, 0.04, pc);
  B(0.22, 0.01, 0.16, MAT.chrome, 0, 0, 0.04, pc);
  reg(pc, 'ordinateur');
  // formulaire + stylo
  const form = G(g, -0.3, 1.105, 40.72, 0.15);
  const paper = signMesh(0.21, 0.297, (ctx, w, h) => {
    ctx.fillStyle = '#fbfbf8'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#8f8f8f'; ctx.fillRect(0, 0, w, h * 0.09);
    ctx.fillStyle = '#fff'; ctx.font = `bold ${h * 0.05}px ${FONT_B}`; ctx.fillText('Réservation', w * 0.06, h * 0.065);
    ctx.strokeStyle = '#bbb'; ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) { ctx.strokeRect(w * 0.06, h * (0.13 + i * 0.12), w * 0.88, h * 0.09); }
  }, form, 0, 0, 0);
  paper.rotation.x = -PI / 2;
  C(0.004, 0.004, 0.14, MAT.blackMetal, 0.15, 0.005, 0, form, { seg: 6 }).rotation.z = PI / 2;
  reg(form, 'formulaire', { act: 'form' });
  // passeport, carte d'identité
  const pass = B(0.09, 0.012, 0.125, std({ color: 0x1d2c55, roughness: 0.6 }), 0.45, 1.105, 40.7, g, { ry: -0.3 });
  reg(pass, 'passeport');
  const idc = B(0.085, 0.004, 0.054, std({ color: 0xc9d8e8, roughness: 0.4 }), 0.7, 1.105, 40.62, g, { ry: 0.2 });
  reg(idc, 'carte_identite');
  // carte-clé (apparaît à la fin du dialogue)
  const key = G(g, 0.15, 1.11, 40.62, 0.4);
  B(0.12, 0.006, 0.075, std({ color: 0x0e7c86, roughness: 0.35 }), 0, 0, 0, key);
  signMesh(0.1, 0.06, (ctx, w, h) => { ctx.fillStyle = '#0e7c86'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#f4dfa8'; ctx.font = `${h * 0.42}px ${FONT_D}`; ctx.fillText('14', w * 0.08, h * 0.6); ctx.font = `${h * 0.16}px ${FONT_D}`; ctx.fillText('PALACE HÔTEL', w * 0.08, h * 0.88); }, key, 0, 0.0035, 0).rotation.x = -PI / 2;
  key.visible = false;
  reg(key, 'cle', { act: 'takeKey' });
  DYN.keyCard = key;
  // panneau wifi sur le comptoir
  const wifiT = G(g, 2.6, 1.1, 40.78);
  B(0.03, 0.02, 0.12, MAT.brass, 0, 0, 0, wifiT);
  signMesh(0.26, 0.18, (ctx, w, h) => {
    ctx.fillStyle = '#12343b'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f2d48a'; ctx.textAlign = 'center';
    ctx.font = `${h * 0.22}px ${FONT_D}`; ctx.fillText('WIFI', w / 2, h * 0.38);
    ctx.font = `${h * 0.15}px ${FONT_B}`; ctx.fillText('gratuit', w / 2, h * 0.62);
    ctx.font = `${h * 0.11}px ${FONT_B}`; ctx.fillText('code : PALACE HÔTEL', w / 2, h * 0.84);
  }, wifiT, 0, 0.11, 0, PI);
  reg(wifiT, 'wifi');

  // réceptionniste
  DYN.recep = buildPerson(g, 0.6, 0, 42.05);
  reg(DYN.recep, 'receptionniste', { act: 'dialogue' });

  // ascenseurs (mur est)
  [35, 37.6].forEach((z, i) => {
    const e = G(g, 7.86, 0, z, PI / 2);
    B(1.5, 2.6, 0.08, MAT.brass, 0, 0, 0.02, e);
    const dl = B(0.6, 2.35, 0.04, MAT.chrome, -0.305, 0, -0.04, e); const dr = B(0.6, 2.35, 0.04, MAT.chrome, 0.305, 0, -0.04, e);
    dl.material = dr.material = std({ color: 0xd9d6cf, metalness: 1, roughness: 0.22 });
    signMesh(0.3, 0.14, (ctx, w, h) => { ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#ff9d3c'; ctx.font = `bold ${h * 0.7}px ${FONT_B}`; ctx.textAlign = 'center'; ctx.fillText('▲ 0', w / 2, h * 0.75); }, e, 0, 2.48, -0.07, PI, 0.8);
    const btn = G(e, 0.95, 1.1, -0.06);
    B(0.12, 0.26, 0.02, MAT.chrome, 0, 0, 0, btn);
    S(0.025, std({ color: 0xffffff, emissive: 0xffc98a, emissiveIntensity: 1.2 }), 0, 0.17, -0.012, btn);
    reg(e, 'ascenseur', { act: 'liftUp' });
  });
  // salon du hall
  const lounge = G(g, -5.6, 0, 36);
  WALK_MESHES.push(B(3.4, 0.01, 4.4, MAT.rug, 0, 0.005, 0, lounge, { cast: false }));
  [[-1.6, PI], [1.6, 0]].forEach(([dz, ry]) => {
    const so = G(lounge, 0, 0, dz, ry);
    sofa(so, 2.4, MAT.velvetTeal);
  });
  B(1.3, 0.04, 0.7, MAT.marble, 0, 0.4, 0, lounge, { r: 0.02 });
  B(1.1, 0.4, 0.5, MAT.brass, 0, 0, 0, lounge);
  bookStack(lounge, -0.3, 0.44, 0, 0.3);
  reg(lounge, 'canape_hall');
  obst(-7.3, 33.8, -3.9, 38.2);
  // plantes
  [[-7.2, 31], [7.2, 31.2], [-7.2, 43], [4.3, 43.2], [-3.7, 43.2]].forEach(([x, z]) => {
    reg(pottedPlant(g, x, z, 1.5), 'plante'); obst(x - 0.4, z - 0.4, x + 0.4, z + 0.4);
  });
  // lustre
  const lus = G(g, -5.6, H, 36);
  C(0.006, 0.006, 0.9, MAT.brass, 0, -0.9, 0, lus, { seg: 6 });
  const ringGeo = new THREE.TorusGeometry(0.75, 0.02, 8, 48);
  [0, 0.25].forEach((dy, i) => { const r = mesh(ringGeo, MAT.brass); r.rotation.x = PI / 2; r.position.y = -0.95 - dy; r.scale.setScalar(1 - i * 0.3); lus.add(r); });
  const globe = std({ color: 0xffffff, emissive: 0xfff0d0, emissiveIntensity: 1.5, roughness: 0.3 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; S(0.07, globe, Math.cos(a) * 0.75, -0.88, Math.sin(a) * 0.75, lus, { cast: false }); }
  for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2 + 0.2; S(0.06, globe, Math.cos(a) * 0.52, -1.13, Math.sin(a) * 0.52, lus, { cast: false }); }
  const ll = new THREE.PointLight(0xffe2b8, 6, 9, 2); ll.position.set(0, -1.1, 0); lus.add(ll);
  reg(lus, 'lustre');
  // chariot à bagages
  const cart = G(g, 4.7, 0, 39.6, 0.3);
  B(1.0, 0.1, 0.6, std({ color: 0x7a1f2b, roughness: 0.9 }), 0, 0.12, 0, cart);
  B(1.04, 0.03, 0.64, MAT.brass, 0, 0.09, 0, cart);
  [-0.48, 0.48].forEach(x => { C(0.018, 0.018, 1.7, MAT.brass, x, 0.2, 0, cart, { seg: 10 }); });
  const bar = C(0.018, 0.018, 0.98, MAT.brass, 0, 1.88, 0, cart, { seg: 10 }); bar.rotation.z = PI / 2; bar.position.y = 1.9;
  [[-0.42, -0.22], [0.42, -0.22], [-0.42, 0.22], [0.42, 0.22]].forEach(([x, z]) => S(0.05, MAT.blackMetal, x, 0.05, z, cart));
  const val = suitcase(cart, -0.2, 0.22, 0, std({ color: 0x2c6e8f, metalness: 0.3, roughness: 0.35 }), PI / 2);
  reg(val, 'valise');
  const bags = G(cart, 0.25, 0.22, 0);
  B(0.42, 0.3, 0.26, MAT.leather, 0, 0, 0, bags, { r: 0.05 });
  B(0.36, 0.22, 0.22, std({ color: 0x3e4a3a, roughness: 0.9 }), 0.05, 0.3, 0, bags, { r: 0.05 });
  const strap = mesh(new THREE.TorusGeometry(0.12, 0.012, 6, 16, PI), MAT.leather); strap.position.set(0, 0.3, 0); bags.add(strap);
  reg(bags, 'bagages');
  reg(cart, 'chariot');
  obst(4.0, 39.0, 5.4, 40.2);
  // panneaux
  signMesh(1.0, 0.7, (ctx, w, h) => {
    ctx.fillStyle = '#12343b'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(w * 0.08, h * 0.15, h * 0.7, h * 0.7);
    ctx.fillStyle = '#1f5fb0'; ctx.font = `bold ${h * 0.6}px ${FONT_B}`; ctx.textAlign = 'center'; ctx.fillText('P', w * 0.08 + h * 0.35, h * 0.72);
    ctx.fillStyle = '#f2d48a'; ctx.font = `${h * 0.24}px ${FONT_D}`; ctx.textAlign = 'left'; ctx.fillText('Parking', w * 0.5, h * 0.48);
    ctx.font = `${h * 0.17}px ${FONT_B}`; ctx.fillStyle = '#fff'; ctx.fillText('gratuit  →', w * 0.5, h * 0.75);
  }, g, -7.9, 1.9, 32.5, PI / 2).userData.vid = null;
  reg(g.children[g.children.length - 1], 'parking');
  const rest = signMesh(1.5, 0.8, (ctx, w, h) => {
    ctx.fillStyle = '#12343b'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f2d48a'; ctx.font = `${h * 0.2}px ${FONT_D}`; ctx.fillText('Restaurant', w * 0.08, h * 0.3);
    ctx.fillStyle = '#fff'; ctx.font = `${h * 0.12}px ${FONT_B}`;
    ctx.fillText('Petit déjeuner : 7 h – 10 h 30', w * 0.08, h * 0.55);
    ctx.fillText('Piscine · Plage  →', w * 0.08, h * 0.78);
  }, g, -7.9, 1.9, 40.2, PI / 2);
  reg(rest, 'restaurant');
  // spots au plafond
  for (let x = -6; x <= 6; x += 3) for (let z = 32; z <= 42; z += 3.3) ceilingSpot(g,x,H-.015,z,.075);
  const fill = new THREE.PointLight(0xfff0dc, 8, 14, 2); fill.position.set(1, 3.6, 39); g.add(fill);

  // jardin devant la façade
  floor(-60, 10.3, 60, 29.9, -0.02, MAT.grass, 4, g, false);
  floor(-2, 14, 2, 29.9, 0.0, MAT.deck, 2, g, false);
  walk(-7.85, 30.15, 7.85, 43.85, 'reception');
}
function sofa(g, w, mat) {
  B(w, 0.42, 0.9, mat, 0, 0.1, 0, g, { r: 0.06 });
  B(w, 0.5, 0.22, mat, 0, 0.42, 0.34, g, { r: 0.08 });
  B(0.2, 0.32, 0.9, mat, -w / 2 + 0.1, 0.42, 0, g, { r: 0.08 });
  B(0.2, 0.32, 0.9, mat, w / 2 - 0.1, 0.42, 0, g, { r: 0.08 });
  const n = Math.round((w - 0.4) / 0.95);
  for (let i = 0; i < n; i++) B((w - 0.42) / n - 0.02, 0.14, 0.66, mat, -w / 2 + 0.21 + (i + 0.5) * (w - 0.42) / n, 0.5, -0.08, g, { r: 0.06 });
  [[-w / 2 + 0.1, -0.38], [w / 2 - 0.1, -0.38], [-w / 2 + 0.1, 0.38], [w / 2 - 0.1, 0.38]].forEach(([x, z]) => C(0.022, 0.016, 0.1, MAT.brass, x, 0, z, g, { seg: 10 }));
}
function suitcase(parent, x, y, z, mat, ry = 0) {
  const g = G(parent, x, y, z, ry);
  B(0.46, 0.68, 0.26, mat, 0, 0.04, 0, g, { r: 0.04 });
  for (let i = -2; i <= 2; i++) B(0.012, 0.6, 0.27, mat, i * 0.07, 0.08, 0, g);
  B(0.16, 0.03, 0.03, MAT.blackMetal, 0, 0.73, 0, g, { r: 0.012 });
  [-0.17, 0.17].forEach(dx => S(0.025, MAT.blackMetal, dx, 0.03, 0.09, g));
  return g;
}
function buildPerson(parent, x, y, z) {
  const p = G(parent, x, y, z, 0);
  const torso = L([[0, 0], [0.17, 0], [0.19, 0.25], [0.21, 0.45], [0.2, 0.55], [0.12, 0.62], [0, 0.63]], MAT.navy, 0, 0.85, 0, p);
  torso.scale.set(1, 1, 0.62);
  L([[0, 0], [0.19, 0], [0.24, 0.5], [0.25, 0.86], [0, 0.86]], MAT.navy, 0, 0, 0, p).scale.set(1, 1, 0.7);
  B(0.12, 0.16, 0.02, MAT.shirt, 0, 1.33, -0.115, p);
  C(0.05, 0.055, 0.1, MAT.skin, 0, 1.46, 0, p);
  const head = G(p, 0, 1.6, 0);
  S(0.105, MAT.skin, 0, 0, 0, head, { sc: [0.9, 1.12, 0.98] });
  S(0.112, MAT.hair, 0, 0.03, 0.02, head, { sc: [0.93, 1.06, 1.0] }).scale.set(0.96, 1.05, 1.02);
  S(0.07, MAT.hair, 0, 0.06, 0.12, head);
  const eye = std({ color: 0x1a120c, roughness: 0.2 });
  S(0.011, eye, -0.035, 0.01, -0.095, head); S(0.011, eye, 0.035, 0.01, -0.095, head);
  S(0.012, std({ color: 0xa0524a, roughness: 0.5 }), 0, -0.05, -0.1, head, { sc: [2.2, 0.6, 1] });
  // bras
  [-1, 1].forEach(s => {
    const arm = C(0.045, 0.04, 0.6, MAT.navy, s * 0.22, 0.85, 0.02, p, { seg: 12 });
    arm.rotation.z = s * 0.08; arm.rotation.x = -0.35;
    S(0.04, MAT.skin, s * 0.24, 0.84, -0.14, p);
  });
  // badge
  B(0.06, 0.02, 0.005, MAT.brass, 0.1, 1.32, -0.13, p);
  p.userData.head = head;
  obst(x - 0.3, z - 0.3, x + 0.3, z + 0.3);
  return p;
}

/* =========================================================
   2. COULOIR  x[-3,10] z[3.5,5.5]
   ========================================================= */
function buildCorridor() {
  const g = G(STATIC);
  const H = 2.8;
  const carpet = floor(-3, 3.5, 10, 5.5, 0, MAT.carpet, 1.2, g);
  const ceil = floor(-3, 3.5, 10, 5.5, H, MAT.ceiling, 3, g, false); ceil.rotation.x = PI / 2; ceil.castShadow = true;
  // mur sud (portes 13, 15, ascenseur)
  wall(-3, 5.5, 10, 5.5, H, MAT.plasterWarm);
  wall(-3, 3.5, -3, 5.5, H, MAT.plasterWarm);
  wall(10, 3.5, 10, 5.5, H, MAT.plasterWarm);
  // plinthe noyer
  B(13, 0.12, 0.02, MAT.walnut, 3.5, 0, 5.41, g, { cast: false });
  // porte 13 / 15
  [[0, '13'], [6.5, '15']].forEach(([x, n]) => {
    const d = G(g, x, 0, 5.42);
    B(1.0, 2.25, 0.05, MAT.walnut, 0, 0, 0, d, { tile: 1 });
    B(0.14, 0.02, 0.03, MAT.brass, 0.38, 1.0, -0.04, d);
    signMesh(0.16, 0.1, (ctx, w, h) => { ctx.fillStyle = '#c9a25a'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#12343b'; ctx.font = `${h * 0.7}px ${FONT_D}`; ctx.textAlign = 'center'; ctx.fillText(n, w / 2, h * 0.78); }, d, 0, 1.6, -0.03, PI);
    reg(d,'porte');
  });
  // ascenseur (étage 1) au mur sud
  const e = G(g, 8.2, 0, 5.38, 0);
  B(1.5, 2.6, 0.06, MAT.brass, 0, 0, 0, e);
  B(1.2, 2.35, 0.04, std({ color: 0xd9d6cf, metalness: 1, roughness: 0.22 }), 0, 0, -0.04, e);
  B(0.004, 2.35, 0.05, MAT.blackMetal, 0, 0, -0.045, e);
  signMesh(0.3, 0.14, (ctx, w, h) => { ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#ff9d3c'; ctx.font = `bold ${h * 0.7}px ${FONT_B}`; ctx.textAlign = 'center'; ctx.fillText('▼ 1', w / 2, h * 0.75); }, e, 0, 2.48, -0.06, PI, 0.8);
  reg(e, 'ascenseur', { act: 'liftDown' });
  // appliques
  for (let x = -1.5; x <= 9; x += 3) {
    const a = G(g, x, 1.75, 5.4);
    B(0.06, 0.25, 0.04, MAT.brass, 0, 0, 0, a);
    C(0.07, 0.07, 0.22, std({ color: 0xfff6e8, emissive: 0xffdcae, emissiveIntensity: 1.3 }), 0, 0.02, -0.07, a, { cast: false });
    reg(a,'applique');
  }
  for (let x = -2; x <= 9; x += 2.2) ceilingSpot(g,x,H-.015,4.5);
  const l1 = new THREE.PointLight(0xffe2b8, 3, 8, 2); l1.position.set(1, 2.5, 4.5); g.add(l1);
  const l2 = new THREE.PointLight(0xffe2b8, 3, 8, 2); l2.position.set(7, 2.5, 4.5); g.add(l2);
  // console + miroir au fond
  B(0.35, 0.85, 1.2, MAT.walnut, 9.8, 0, 4.5, g);
  B(0.04, 1.0, 0.8, MAT.mirror, 9.9, 1.15, 4.5, g, { cast: false });
  anthurium(g, 9.78, 0.85, 4.5, 1);
  obst(9.6, 3.9, 10, 5.1);
  // tableau à l'ouest
  paintingMesh(g, -2.92, 1.5, 4.5, -PI / 2, 1.0, 0.75, 3);
  reg(carpet, 'couloir');
  walk(-2.95, 3.5, 9.95, 5.5, 'couloir');
}
function paintingMesh(parent, x, y, z, ry, w, h, sd) {
  const g = G(parent, x, y, z, ry);
  B(w + 0.06, h + 0.06, 0.03, MAT.brass, 0, -h / 2 - 0.03, 0, g, { cast: false });
  const t = canvasPanel(w, h, (ctx, W, Hh) => {
    let s = sd * 101;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    ctx.fillStyle = '#efe6d6'; ctx.fillRect(0, 0, W, Hh);
    const pal = ['#0e7c86', '#d9604a', '#e9b949', '#2f5d3a', '#7fb7b2', '#f1c8a8'];
    // feuilles et soleil abstraits (œuvre originale)
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = pal[2]; ctx.beginPath(); ctx.arc(W * (0.3 + r() * 0.4), Hh * 0.35, Hh * 0.16, 0, PI * 2); ctx.fill();
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = pal[[0, 3, 4, 1][i % 4]];
      ctx.save(); ctx.translate(W * r(), Hh * (0.5 + r() * 0.5)); ctx.rotate(r() * 2 - 1);
      ctx.beginPath(); ctx.ellipse(0, 0, W * (0.06 + r() * 0.12), Hh * (0.2 + r() * 0.25), 0, 0, PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.globalAlpha = 1; ctx.strokeStyle = '#12343b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, Hh * 0.62); ctx.bezierCurveTo(W * 0.3, Hh * 0.55, W * 0.6, Hh * 0.7, W, Hh * 0.6); ctx.stroke();
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), std({ map: t, roughness: 0.8 }));
  m.position.set(0, 0, -0.02); m.rotation.y = PI; g.add(m);
  // Caisse, baguettes, passe-partout et vitrage : un tableau matériel, distinct du mur.
  for(const dx of [-w/2-.022,w/2+.022])B(.035,h+.09,.055,MAT.walnut,dx,-h/2-.045,-.012,g,{r:.003});
  for(const dy of [-h/2-.025,h/2+.025])B(w+.075,.035,.055,MAT.walnut,0,dy,-.012,g,{r:.003});
  m.material.bumpMap=TEX.linen;m.material.bumpScale=.001;m.material.roughness=.87;
  const cover=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.035,roughness:.06,metalness:.12,envMapIntensity:.4,depthWrite:false}));cover.position.z=-.025;cover.rotation.y=PI;cover.userData.pass=true;g.add(cover);reg(g,'tableau');
  return g;
}

/* =========================================================
   3. LA SUITE : chambre x[-4.5,4.5] z[-3,3.5] ; salle de bains x[4.5,8.5] ; balcon z[-5.3,-3]
   ========================================================= */
function buildSuite() {
  const g = G(STATIC);
  const H = 3.0;
  floor(-4.5, -3, 4.5, 3.5, 0, MAT.oak, 2.4, g);
  const ceil = floor(-4.5, -3, 8.5, 3.5, H, MAT.ceiling, 3, g, false); ceil.rotation.x = PI / 2; ceil.castShadow = true;
  // murs
  wall(-4.5, -3, -4.5, 3.5, H, MAT.plaster);
  wall(-4.5, 3.5, 8.5, 3.5, H, MAT.plaster, [{ a: 7.1, b: 8.1, y0: 0, y1: 2.25 }]);
  wall(4.5, -3, 4.5, 3.5, H, MAT.plaster, [{ a: 4.7, b: 5.6, y0: 0, y1: 2.3 }]);
  wall(8.5, -3, 8.5, 3.5, H, MAT.plaster);
  wall(4.5, -3, 8.5, -3, H, MAT.plaster, [{ a: 2.1, b: 3.7, y0: 1.05, y1: 2.4 }]);
  // corniche + plinthes
  B(9, 0.1, 0.02, MAT.white, 0, 0, 3.41, g, { cast: false });
  B(0.02, 0.1, 6.5, MAT.white, -4.41, 0, 0.25, g, { cast: false });

  // --- baie vitrée nord + porte-fenêtre coulissante
  const win = G(g, 0, 0, -3);
  for (let x = -4.5; x <= 4.5; x += 1.8) B(0.07, H, 0.12, MAT.blackMetal, x, 0, 0, win);
  B(9, 0.07, 0.12, MAT.blackMetal, 0, 0, 0, win); B(9, 0.07, 0.12, MAT.blackMetal, 0, H - 0.07, 0, win);
  const fixed = [[-4.5, -2.7], [-2.7, -0.9], [2.7, 4.5]];
  const glassGroup = G(win);
  fixed.forEach(([a, b]) => { const p = B(b - a, H, 0.02, MAT.glass, (a + b) / 2, 0, 0.02, glassGroup, { cast: false }); p.userData.pass = true; });
  const fixed2 = B(1.8, H, 0.02, MAT.glass, 1.8, 0, 0.02, glassGroup, { cast: false }); fixed2.userData.pass = true;
  reg(glassGroup, 'fenetre');
  const slide = G(win, -0.0, 0, -0.06);
  const sp = B(1.8, H - 0.06, 0.03, MAT.glass, 0, 0.03, 0, slide, { cast: false }); sp.userData.pass = true;
  B(0.06, H - 0.06, 0.07, MAT.blackMetal, -0.9, 0.03, 0, slide); B(0.06, H - 0.06, 0.07, MAT.blackMetal, 0.9, 0.03, 0, slide);
  B(0.03, 0.4, 0.05, MAT.brass, 0.8, 0.95, 0.05, slide);
  slide.position.x = 0;  // panneau mobile x[-0.9,0.9]
  reg(slide, 'porte_fenetre', { act: 'slide' });
  DYN.slide = slide;
  obst(-0.9, -3.08, 0.9, -2.92, () => !STATE_REF.slideOpen);
  obst(-4.5, -3.08, -0.9, -2.92); obst(0.9, -3.08, 4.5, -2.92);

  // --- rideaux (voilage + lin)
  DYN.curtains = [];
  const pleat = (w, h) => {
    const geo = new THREE.PlaneGeometry(w,h,LOW?48:80,LOW?16:32);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {const x=p.getX(i),y=p.getY(i);p.setZ(i,Math.sin(x/w*PI*38+y*.18)*.032+Math.sin(y*2)*.009);p.setY(i,y+Math.cos(x/w*PI*38)*.007);}
    geo.computeVertexNormals();
    return geo;
  };
  const sheer = std({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
  const linenC = std({ color: 0xd8cbb4, roughness: 1, side: THREE.DoubleSide, map: TEX.linen });
  const curtGroup = G(g);
  [[-4.45, 1, sheer, -2.8], [4.45, -1, sheer, -2.8], [-4.45, 1, linenC, -2.68], [4.45, -1, linenC, -2.68]].forEach(([x0, dir, mat, z]) => {
    const w = 4.5;
    const m = new THREE.Mesh(pleat(w, H - 0.12), mat);
    m.castShadow = mat === linenC;
    m.geometry.translate(dir * w / 2, (H - 0.12) / 2, 0);
    m.position.set(x0, 0.02, z);
    curtGroup.add(m);
    DYN.curtains.push({ m, open: mat === sheer ? 0.16 : 0.12 });
    m.scale.x = mat === sheer ? 0.16 : 0.12;
  });
  B(9, 0.04, 0.04, MAT.brass, 0, H - 0.1, -2.74, g, { cast: false });
  reg(curtGroup, 'rideaux', { act: 'curtains' });

  // --- lit
  const bedG = G(g, -3.3, 0, -0.3);
  B(0.05, 2.5, 3.8, MAT.walnut, -1.095, 0, 0, bedG, { tile: 1.2 });
  reg(bedG.children[bedG.children.length-1],'tete_lit');
  for (let i = 0; i < 6; i++) B(0.12, 1.3, 0.42, MAT.boucle, -1.01, 0.38, -1.05 + i * 0.42, bedG, { r: 0.05 });
  const base = G(bedG);
  B(2.1, 0.34, 2.0, MAT.boucle, 0, 0.08, 0, base, { r: 0.05 });
  [[-0.95, -0.9], [0.95, -0.9], [-0.95, 0.9], [0.95, 0.9]].forEach(([x, z]) => B(0.06, 0.08, 0.06, MAT.blackMetal, x, 0, z, base));
  B(2.04, 0.24, 1.96, MAT.linen, 0, 0.42, 0, base, { r: 0.08, seg: 4 });
  reg(base, 'lit');
  const duvet = G(bedG);
  B(1.52, 0.36, 2.12, MAT.linen, 0.3, 0.37, 0, duvet, { r: 0.09, seg: 4 });
  B(0.2, 0.05, 2.0, MAT.linen, -0.42, 0.68, 0, duvet, { r: 0.025 });
  reg(duvet, 'couette');
  const runner = B(0.5, 0.37, 2.16, MAT.velvetMustard, 0.72, 0.375, 0, bedG, { r: 0.03 });
  reg(runner, 'couette');
  const pillows = G(bedG);
  [[-0.78, -0.45, 0.42], [-0.78, 0.45, 0.42], [-0.6, -0.42, 0.25], [-0.6, 0.42, 0.25]].forEach(([x, z, tilt]) => {
    const p = B(0.18, 0.5, 0.78, MAT.linen, x, 0.66, z, pillows, { r: 0.08, seg: 4 });
    p.rotation.z = tilt;
  });
  reg(pillows, 'oreillers');
  const cush = G(bedG);
  [[-0.42, -0.3, MAT.velvetMustard], [-0.42, 0.3, MAT.velvetMustard], [-0.32, 0, MAT.velvetTeal]].forEach(([x, z, m], i) => {
    const c = B(0.14, i == 2 ? 0.28 : 0.4, i == 2 ? 0.5 : 0.4, m, x, 0.7, z, cush, { r: 0.06, seg: 4 }); c.rotation.z = 0.32;
  });
  reg(cush, 'coussins');
  obst(-4.45, -1.35, -2.2, 0.75);
  // tables de nuit + lampes
  const nts = G(g);
  [-1.67, 1.07].forEach((z, i) => {
    const n = G(nts, -4.12, 0, z);
    B(0.5, 0.5, 0.55, MAT.walnut, 0, 0.05, 0, n);
    B(0.02, 0.01, 0.5, MAT.blackMetal, 0.255, 0.3, 0, n);
    B(0.015, 0.015, 0.12, MAT.brass, 0.26, 0.38, 0, n);
    [[-0.2, -0.22], [0.2, -0.22], [-0.2, 0.22], [0.2, 0.22]].forEach(([x, zz]) => C(0.012, 0.012, 0.06, MAT.brass, x, 0, zz, n, { seg: 6 }));
    obst(-4.4, z - 0.3, -3.85, z + 0.3);
  });
  reg(nts, 'table_nuit');
  const lamps = G(g);
  [-1.67, 1.07].forEach(z => {
    const l = G(lamps, -4.15, 0.55, z);
    L([[0, 0], [0.08, 0], [0.11, 0.08], [0.1, 0.2], [0.05, 0.3], [0.02, 0.34], [0, 0.34]], MAT.ceramic, 0, 0, 0, l);
    lampShade(l, 0, 0.32, 0, 0.12, 0.16, 0.2, 'chevet');
  });
  reg(lamps, 'lampe_chevet', { act: 'lamp:chevet' });
  const remote = B(0.05, 0.02, 0.17, MAT.blackMetal, -4.0, 0.55, -1.55, g, { r: 0.008, ry: 0.2 });
  reg(remote, 'telecommande', { act: 'tv' });
  // banc en bout de lit
  const bench = G(g, -1.95, 0, -0.3);
  B(0.42, 0.1, 1.5, MAT.leather, 0, 0.36, 0, bench, { r: 0.04 });
  [[-0.17, -0.68], [0.17, -0.68], [-0.17, 0.68], [0.17, 0.68]].forEach(([x, z]) => C(0.014, 0.014, 0.36, MAT.brass, x, 0, z, bench, { seg: 8 }));
  reg(bench, 'banc');
  obst(-2.17, -1.06, -1.73, 0.46);
  const rug1 = B(2.9, 0.012, 3.5, MAT.rug, -2.4, 0.003, -0.3, g, { cast: false }); reg(rug1, 'tapis'); WALK_MESHES.push(rug1);
  // plante d'angle
  reg(pottedPlant(g, -4.0, -2.55, 1.35), 'plante');
  obst(-4.45, -2.95, -3.6, -2.15);

  // --- meuble TV + minibar (mur est)
  const tvc = G(g, 4.22, 0, -0.5);
  B(0.45, 0.5, 2.1, MAT.walnut, 0, 0.05, -0.35, tvc, { tile: 1 });
  B(0.45, 0.5, 0.03, MAT.walnut, 0, 0.05, 1.385, tvc);
  B(0.03, 0.5, 0.7, MAT.walnut, 0.21, 0.05, 1.05, tvc);
  B(0.45, 0.06, 0.7, MAT.walnut, 0, 0.0, 1.05, tvc);
  B(0.47, 0.03, 2.82, MAT.marble, 0, 0.55, 0, tvc);
  B(0.02, 0.4, 0.01, MAT.blackMetal, -0.226, 0.1, -0.35, tvc);
  obst(3.97, -1.92, 4.5, 0.92);
  // minibar : porte pivotante sur charnière (z = 0.88)
  const mbInside = G(g, 4.24, 0.07, 0.56);
  B(0.38, 0.44, 0.58, std({ color: 0xf2f4f5, roughness: 0.4, side: THREE.BackSide }), 0, 0, 0, mbInside, { cast: false });
  const glow = std({ color: 0xffffff, emissive: 0xdff4ff, emissiveIntensity: 0, roughness: 0.4 });
  B(0.3, 0.01, 0.5, glow, 0, 0.42, 0, mbInside, { cast: false });
  B(0.32, 0.01, 0.52, MAT.glass, 0, 0.22, 0, mbInside, { cast: false });
  const bottleCols = [0x2b6f3a, 0xc9a25a, 0xe48a2a, 0x9b1d20, 0xdfe9ee];
  bottleCols.forEach((c, i) => {
    L([[0, 0], [0.028, 0], [0.03, 0.12], [0.012, 0.17], [0.01, 0.2], [0, 0.2]], phys({ color: c, roughness: 0.15, transparent: c === 0xdfe9ee, opacity: 0.8 }), -0.08, 0.005, -0.2 + i * 0.1, mbInside);
  });
  [0xd9604a, 0x1f6f74, 0xe9b949].forEach((c, i) => B(0.1, 0.12, 0.06, std({ color: c, roughness: 0.6 }), 0.05, 0.235, -0.15 + i * 0.13, mbInside));
  DYN.mbGlow = glow;
  const mbHinge = G(g, 3.995, 0.07, 0.86);
  const mbDoor = B(0.03, 0.46, 0.6, MAT.walnut, 0, 0, -0.3, mbHinge);
  B(0.015, 0.12, 0.015, MAT.brass, -0.02, 0.16, -0.54, mbHinge);
  DYN.mbHinge = mbHinge;
  const mbGroup = G(g); mbGroup.add(mbInside); mbGroup.add(mbHinge);
  mbInside.position.set(4.24, 0.07, 0.56); mbHinge.position.set(3.995, 0.07, 0.86);
  reg(mbGroup, 'minibar', { act: 'minibar' });
  // machine à café, bouilloire, tasses
  const cm = G(g, 4.25, 0.585, 0.45);
  B(0.24, 0.3, 0.32, MAT.blackMetal, 0, 0, 0, cm, { r: 0.03 });
  B(0.12, 0.02, 0.1, MAT.chrome, -0.08, 0.06, 0, cm);
  C(0.015, 0.015, 0.05, MAT.chrome, -0.1, 0.22, 0, cm, { seg: 8 });
  reg(cm, 'machine_cafe');
  const kettle = L([[0, 0], [0.07, 0], [0.08, 0.06], [0.075, 0.16], [0.05, 0.2], [0, 0.21]], MAT.chrome, 4.25, 0.585, 0.05, g);
  reg(kettle,'bouilloire');
  const cups = G(g, 4.22, 0.585, -0.3);
  B(0.28, 0.015, 0.2, MAT.walnut, 0, 0, 0, cups, { r: 0.006 });
  [-0.07, 0.07].forEach(dz => { L([[0, 0], [0.025, 0], [0.04, 0.06], [0.037, 0.06], [0.022, 0.006], [0, 0.006]], MAT.ceramic, 0, 0.015, dz, cups); });
  reg(cups, 'tasses');
  bookStack(g, 4.22, 0.585, -1.4, 0.4);
  // télévision murale
  const tv = G(g, 4.39, 1.55, -0.5, PI / 2);
  B(1.66, 0.95, 0.035, MAT.blackMetal, 0, -0.475, 0, tv);
  const tvCanvas = document.createElement('canvas'); tvCanvas.width = 768; tvCanvas.height = 432;
  const tvTex = new THREE.CanvasTexture(tvCanvas); tvTex.colorSpace = THREE.SRGBColorSpace;
  const tvMat = std({ color: 0x000000, emissive: 0xffffff, emissiveMap: tvTex, emissiveIntensity: 0, roughness: 0.18, metalness: 0.2 });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), tvMat);
  scr.position.set(0, 0, -0.02); scr.rotation.y = PI; tv.add(scr);
  reg(tv, 'television', { act: 'tv' });
  DYN.tv = { canvas: tvCanvas, tex: tvTex, mat: tvMat, on: false, t: 0, n: null, hist: [] };
  // tableau
  reg(paintingMesh(g, 4.4, 2.1, -2.35, PI / 2, 0.65, 0.85, 7), 'tableau');

  // --- salon : canapé face à la mer, table basse, fauteuils, lampadaire
  const sof = G(g, 2.1, 0, 0.15);
  sofa(sof, 2.3, MAT.boucle);
  B(0.42, 0.42, 0.14, MAT.velvetTeal, -0.75, 0.6, 0.18, sof, { r: 0.06 }).rotation.x = 0.25;
  B(0.42, 0.42, 0.14, MAT.velvetMustard, 0.75, 0.6, 0.18, sof, { r: 0.06 }).rotation.x = 0.25;
  reg(sof, 'canape');
  obst(0.95, -0.3, 3.25, 0.6);
  const ct = G(g, 2.1, 0, -1.25);
  C(0.5, 0.5, 0.035, MAT.marble, 0, 0.4, 0, ct, { seg: 48 });
  L([[0, 0], [0.32, 0], [0.32, 0.01], [0.08, 0.05], [0.06, 0.35], [0.12, 0.4], [0, 0.4]], MAT.brass, 0, 0, 0, ct);
  reg(ct, 'table_basse');
  obst(1.6, -1.75, 2.6, -0.75);
  const fr = G(g, 2.05, 0.435, -1.2);
  L([[0, 0], [0.09, 0], [0.17, 0.05], [0.19, 0.08], [0.18, 0.085], [0.08, 0.02], [0, 0.02]], MAT.ceramic, 0, 0, 0, fr);
  const mango = std({ color: 0xe0782f, roughness: 0.45 }), mangoG = std({ color: 0x9fb33d, roughness: 0.45 });
  S(0.055, mango, -0.05, 0.08, 0.02, fr, { sc: [1.3, 0.9, 1] }); S(0.055, mangoG, 0.06, 0.08, -0.04, fr, { sc: [1.3, 0.9, 1] });
  const banana = std({ color: 0xf0cf45, roughness: 0.5 });
  [0, 0.25, 0.5].forEach(a => { const b = mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 16, PI * 0.7), banana); b.position.set(0.02, 0.1, 0.06); b.rotation.set(PI / 2 + a * 0.3, a, 0.3); fr.add(b); });
  const pine = G(fr, -0.1, 0.06, -0.08);
  S(0.07, std({ color: 0xb3772c, roughness: 0.8 }), 0, 0.08, 0, pine, { sc: [1, 1.4, 1] });
  for (let i = 0; i < 7; i++) { const c = mesh(new THREE.ConeGeometry(0.015, 0.14, 4), MAT.leaf); c.position.set(0, 0.22, 0); c.rotation.set(Math.cos(i) * 0.5, 0, Math.sin(i) * 0.5); pine.add(c); }
  reg(fr, 'fruits');
  [[3.65, -1.25, PI / 2], [0.5, -1.25, -PI / 2]].forEach(([x, z, ry]) => {
    const a = G(g, x, 0, z, ry);
    B(0.8, 0.36, 0.8, MAT.velvetTeal, 0, 0.12, 0, a, { r: 0.12, seg: 4 });
    B(0.8, 0.42, 0.2, MAT.velvetTeal, 0, 0.42, 0.32, a, { r: 0.1, seg: 4 });
    B(0.16, 0.26, 0.74, MAT.velvetTeal, -0.34, 0.42, 0.02, a, { r: 0.07 });
    B(0.16, 0.26, 0.74, MAT.velvetTeal, 0.34, 0.42, 0.02, a, { r: 0.07 });
    [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([xx, zz]) => C(0.02, 0.014, 0.12, MAT.brass, xx, 0, zz, a, { seg: 8 }));
    reg(a, 'fauteuil');
    obst(x - 0.42, z - 0.42, x + 0.42, z + 0.42);
  });
  const fl = G(g, 0.7, 0, 0.6);
  C(0.16, 0.16, 0.02, MAT.blackMetal, 0, 0, 0, fl);
  C(0.012, 0.012, 1.45, MAT.brass, 0, 0.02, 0, fl, { seg: 8 });
  lampShade(fl, 0, 1.45, 0, 0.19, 0.22, 0.3, 'lampadaire');
  reg(fl, 'lampadaire', { act: 'lamp:lampadaire' });
  obst(0.5, 0.4, 0.9, 0.8);
  const rug2 = B(3.6, 0.012, 2.9, MAT.rug, 2.1, 0.003, -0.8, g, { cast: false }); reg(rug2, 'tapis'); WALK_MESHES.push(rug2);

  // --- bureau, chaise, lampe, téléphone, carte wifi
  const desk = G(g, 0, 0, 3.18);
  B(1.8, 0.04, 0.55, MAT.walnut, 0, 0.72, 0, desk, { tile: 1 });
  B(0.5, 0.18, 0.5, MAT.walnut, -0.62, 0.54, 0, desk);
  B(0.18, 0.012, 0.012, MAT.brass, -0.62, 0.63, -0.256, desk);
  [[-0.86, -0.24], [0.86, -0.24], [-0.86, 0.24], [0.86, 0.24]].forEach(([x, z]) => C(0.016, 0.016, 0.72, MAT.brass, x, 0, z, desk, { seg: 8 }));
  reg(desk, 'bureau');
  obst(-0.92, 2.9, 0.92, 3.48);
  const chair = G(g, 0, 0, 2.55, PI);
  B(0.5, 0.1, 0.48, MAT.velvetMustard, 0, 0.42, 0, chair, { r: 0.04 });
  B(0.5, 0.42, 0.08, MAT.velvetMustard, 0, 0.5, 0.22, chair, { r: 0.04 }).rotation.x = -0.1;
  [[-0.21, -0.2], [0.21, -0.2], [-0.21, 0.2], [0.21, 0.2]].forEach(([x, z]) => C(0.013, 0.01, 0.42, MAT.brass, x, 0, z, chair, { seg: 8 }));
  reg(chair, 'chaise');
  obst(-0.3, 2.3, 0.3, 2.8);
  const dl = G(g, 0.7, 0.76, 3.3);
  C(0.08, 0.09, 0.02, MAT.brass, 0, 0, 0, dl);
  const arm = C(0.008, 0.008, 0.42, MAT.brass, 0, 0.02, 0, dl, { seg: 6 }); arm.rotation.x = -0.25;
  lampShade(dl, 0, 0.36, -0.12, 0.05, 0.11, 0.1, 'bureau');
  reg(dl, 'lampe_bureau', { act: 'lamp:bureau' });
  const ph = G(g, -0.6, 0.76, 3.25, 0.2);
  B(0.2, 0.05, 0.18, std({ color: 0x2b2d30, roughness: 0.35 }), 0, 0, 0, ph, { r: 0.02 });
  B(0.05, 0.035, 0.2, std({ color: 0x2b2d30, roughness: 0.35 }), -0.06, 0.05, 0, ph, { r: 0.015 });
  for (let i = 0; i < 9; i++) B(0.018, 0.006, 0.018, MAT.chrome, 0.02 + (i % 3) * 0.028, 0.05, -0.04 + Math.floor(i / 3) * 0.028, ph);
  reg(ph, 'telephone');
  const wifiCard = G(g, 0.25, 0.76, 3.32, PI);
  const tc1 = signMesh(0.14, 0.09, (ctx, w, h) => { ctx.fillStyle = '#fbfaf6'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#12343b'; ctx.textAlign = 'center'; ctx.font = `${h * 0.25}px ${FONT_D}`; ctx.fillText('WIFI gratuit', w / 2, h * 0.42); ctx.font = `${h * 0.17}px ${FONT_B}`; ctx.fillText('PALACE HÔTEL', w / 2, h * 0.75); }, wifiCard, 0, 0.04, 0.02);
  tc1.rotation.x = -0.35;
  reg(wifiCard, 'wifi');
  // climatisation murale au-dessus du bureau
  const ac = G(g, 0, 2.45, 3.32, 0);
  B(1.0, 0.3, 0.2, std({ color: 0xf7f7f5, roughness: 0.35 }), 0, 0, 0, ac, { r: 0.05 });
  const flap = G(ac, 0, 0.04, -0.1);
  B(0.9, 0.012, 0.08, std({ color: 0xe8e8e5, roughness: 0.4 }), 0, 0, -0.04, flap);
  const acCanvas = document.createElement('canvas'); acCanvas.width = 128; acCanvas.height = 48;
  const acTex = new THREE.CanvasTexture(acCanvas); acTex.colorSpace = THREE.SRGBColorSpace;
  const acDisp = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.045), std({ color: 0x000000, emissive: 0xffffff, emissiveMap: acTex, emissiveIntensity: 0 }));
  acDisp.position.set(0.32, 0.2, -0.102); acDisp.rotation.y = PI; ac.add(acDisp);
  reg(ac, 'climatisation', { act: 'clim' });
  DYN.ac = { flap, canvas: acCanvas, tex: acTex, disp: acDisp, on: false, parts: null };
  // thermostat près de la porte
  const th = G(g, 2.45, 1.35, 3.41, PI);
  B(0.09, 0.09, 0.015, std({ color: 0xf7f7f5 }), 0, 0, 0, th);
  reg(th, 'climatisation', { act: 'clim' });

  // --- armoire (portes battantes), cintres, coffre-fort
  const ward = G(g, -3.2, 0, 3.15);
  B(2.4, 2.6, 0.03, MAT.lacquer, 0, 0, 0.285, ward);
  B(0.03, 2.6, 0.6, MAT.lacquer, -1.185, 0, 0, ward); B(0.03, 2.6, 0.6, MAT.lacquer, 1.185, 0, 0, ward);
  B(2.4, 0.04, 0.6, MAT.lacquer, 0, 2.56, 0, ward); B(2.4, 0.08, 0.6, MAT.lacquer, 0, 0, 0, ward);
  B(2.34, 2.46, 0.01, std({ color: 0xe9e1d4, roughness: 0.8 }), 0, 0.08, 0.26, ward, { cast: false });
  const rail = C(0.012, 0.012, 2.2, MAT.chrome, 0, 2.15, 0.0, ward, { seg: 8 }); rail.rotation.z = PI / 2; rail.position.y = 2.15;
  const hangers = G(ward, 0, 0, 0);
  for (let i = 0; i < 6; i++) {
    const h = G(hangers, -0.6 + i * 0.22, 2.0, 0.0);
    const hb = mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 20, PI * 0.9), MAT.walnut); hb.rotation.set(0, PI / 2, PI * 0.55); hb.position.y = -0.04; hb.scale.set(1, 0.4, 1); h.add(hb);
    const hk = mesh(new THREE.TorusGeometry(0.025, 0.004, 6, 12, PI * 1.4), MAT.chrome); hk.rotation.y = PI / 2; hk.position.y = 0.11; h.add(hk);
  }
  hangers.position.z = 0.02;
  reg(hangers, 'cintres');
  // Peignoir de rechange : même silhouette reconnaissable que dans la salle de bains.
  const spare=REAL.bathrobe(ward,.85,.08,0,PI,.75);reg(spare,'peignoir');
  const safe = G(ward, -0.6, 0.08, 0.02);
  B(0.42, 0.3, 0.36, std({ color: 0x2b2d30, metalness: 0.5, roughness: 0.45 }), 0, 0, 0, safe, { r: 0.015 });
  B(0.1, 0.12, 0.01, MAT.blackMetal, 0.12, 0.09, -0.185, safe);
  B(0.07, 0.025, 0.012, std({ color: 0x0b2b10, emissive: 0x2aff5a, emissiveIntensity: 0.6 }), 0.12, 0.2, -0.186, safe);
  C(0.02, 0.02, 0.02, MAT.chrome, -0.08, 0.15, -0.19, safe, { seg: 12 }).rotation.x = PI / 2;
  reg(safe, 'coffre');
  DYN.wardDoors = [];
  [[-1.2, 1], [1.2, -1]].forEach(([hx, s]) => {
    const hinge = G(ward, hx, 0.04, -0.31);
    B(1.18, 2.52, 0.03, MAT.lacquer, s * 0.59, 0, 0, hinge);
    B(0.002, 2.3, 0.032, MAT.brass, s * 0.59, 0.11, 0, hinge);
    B(0.015, 0.5, 0.025, MAT.brass, s * 1.1, 0.95, -0.03, hinge);
    B(0.015, 0.5, 0.025, MAT.brass, s * 1.1, 0.95, -0.03, hinge).position.x = s * 1.1;
    DYN.wardDoors.push({ hinge, s });
  });
  reg(ward, 'armoire', { act: 'wardrobe' });
  obst(-4.4, 2.83, -1.5, 3.48);
  obst(-4.48, 1.35, -4.28, 2.88, () => STATE_REF.wardrobeOpen);
  obst(-1.62, 1.35, -1.42, 2.88, () => STATE_REF.wardrobeOpen);
  obst(-4.34, 2.43, -3.62, 2.90, () => DYN.wardDrawers?.some(d=>d.open||d.moving));
  // porte-bagages + valise
  const rack = G(g, -1.4, 0, 3.08);
  [[-0.32, -0.2], [0.32, -0.2], [-0.32, 0.2], [0.32, 0.2]].forEach(([x, z]) => C(0.015, 0.015, 0.5, MAT.walnut, x, 0, z, rack, { seg: 8 }));
  [-0.12, 0.12].forEach(z => B(0.7, 0.02, 0.05, MAT.leather, 0, 0.5, z, rack));
  reg(rack, 'porte_bagages');
  reg(suitcase(g, -1.4, 0.52, 3.08, std({ color: 0xd9604a, metalness: 0.2, roughness: 0.4 }), PI / 2 + 0.05), 'valise');
  obst(-1.46, 2.82, -.65, 3.35);
  // console d'entrée + fleurs
  const ec = G(g, 1.95, 0, 3.3);
  B(0.9, 0.82, 0.3, MAT.walnut, 0, 0, 0, ec);
  B(0.92, 0.03, 0.32, MAT.marble, 0, 0.82, 0, ec);
  reg(anthurium(g, 1.7, 0.85, 3.3, 1), 'fleurs');
  L([[0, 0], [0.06, 0], [0.12, 0.04], [0.13, 0.05], [0.06, 0.012], [0, 0.012]], MAT.brass, 2.15, 0.85, 3.3, g);
  obst(1.48, 3.12, 2.42, 3.48);
  // porte d'entrée (charnière x = 3.6)
  const door = G(g, 3.6, 0, 3.47);
  B(1.0, 2.24, 0.05, MAT.walnut, -0.5, 0, 0, door, { tile: 1 });
  B(0.14, 0.02, 0.03, MAT.brass, -0.88, 1.0, -0.04, door);
  B(0.14, 0.02, 0.03, MAT.brass, -0.88, 1.0, 0.04, door);
  signMesh(0.16, 0.1, (ctx, w, h) => { ctx.fillStyle = '#c9a25a'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#12343b'; ctx.font = `${h * 0.7}px ${FONT_D}`; ctx.textAlign = 'center'; ctx.fillText('14', w / 2, h * 0.78); }, door, -0.5, 1.6, 0.03, 0);
  reg(door, 'porte', { act: 'door' });
  DYN.door = door;
  const plate = signMesh(0.22, 0.14, (ctx, w, h) => { ctx.fillStyle = '#c9a25a'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#12343b'; ctx.font = `${h * 0.72}px ${FONT_D}`; ctx.textAlign = 'center'; ctx.fillText('14', w / 2, h * 0.8); }, g, 2.4, 1.6, 3.6, 0);
  reg(plate, 'numero');
  obst(2.6, 3.42, 3.6, 3.58, () => !STATE_REF.doorOpen);
  // spots + suspension
  for (let x = -3.5; x <= 3.5; x += 1.75) for (let z = -2; z <= 2.5; z += 2.25) ceilingSpot(g,x,H-.015,z);
  const pend = G(g, 2.1, H, -1.25);
  C(0.004, 0.004, 0.9, MAT.blackMetal, 0, -0.9, 0, pend, { seg: 4 });
  L([[0, 0], [0.32, 0], [0.3, 0.06], [0.08, 0.2], [0, 0.22]], MAT.brass, 0, -1.12, 0, pend, { seg: 40 });
  reg(pend,'suspension');
  const fillR = new THREE.PointLight(0xfff1dc, 5, 10, 2); fillR.position.set(0, 2.6, 0.5); g.add(fillR);

  // --- salle de bains
  buildBathroom(g);
  // --- balcon
  buildBalcony(g);

  walk(-4.5, -3, 4.5, 3.5, 'chambre');
  walk(4.5, -3, 8.5, 3.5, 'sdb');
  walk(3.9, 1.7, 5.1, 2.6, 'sdb');
  walk(-4.5, -5.3, 4.5, -3, 'balcon');
  walk(-0.85, -3.65, 0.85, -2.35, 'chambre', () => STATE_REF.slideOpen);
  walk(2.65, 2.9, 3.55, 4.1, 'couloir', () => STATE_REF.doorOpen);
}

function buildBathroom(parent) {
  const g = G(parent);
  const sdbFloor = floor(4.5, -3, 8.5, 3.5, 0.0, MAT.stone, 1.2, g);
  // parement pierre (douche) et marbre (vasques)
  B(0.02, 2.6, 1.6, MAT.stoneWall, 4.6, 0, -2.2, g, { cast: false, tile: 1.2 });
  B(1.6, 2.6, 0.02, MAT.stoneWall, 5.4, 0, -2.9, g, { cast: false, tile: 1.2 });
  B(0.02, 2.9, 2.5, MAT.marble, 8.4, 0, 0.35, g, { cast: false });
  // douche à l'italienne
  B(1.6, 0.012, 1.55, std({ color: 0x8c857a, roughness: 0.6, map: TEX.stone }), 5.4, 0, -2.18, g, { cast: false });
  const glassS = B(1.0, 2.1, 0.012, MAT.glass, 5.1, 0, -1.4, g, { cast: false }); glassS.userData.pass = true;
  B(0.012, 2.1, 0.012, MAT.chrome, 5.6, 0, -1.4, g);
  obst(4.6, -1.43, 5.6, -1.37);
  const sh = G(g, 5.35, 0, -2.25);
  B(0.3, 0.012, 0.3, MAT.chrome, 0, 2.55, 0, sh);
  C(0.012, 0.012, 0.45, MAT.chrome, 0, 2.56, 0, sh, { seg: 8 });
  B(0.14, 0.2, 0.04, MAT.chrome, -0.7, 1.05, 0, sh);
  C(0.02, 0.02, 0.04, MAT.chrome, -0.67, 1.12, 0, sh, { seg: 12 }).rotation.z = PI / 2;
  // niche + flacons
  [0, 1, 2].forEach(i => L([[0, 0], [0.03, 0], [0.032, 0.14], [0.012, 0.17], [0, 0.17]], std({ color: [0xe9e1d4, 0x12343b, 0xc9a25a][i], roughness: 0.3 }), 4.66, 1.3, -2.55 + i * 0.09, g));
  // eau de la douche
  const dropsGeo = new THREE.BufferGeometry();
  const N = 260, pos = new Float32Array(N * 6);
  for (let i = 0; i < N; i++) { const x = rnd(-0.14, 0.14), z = rnd(-0.14, 0.14), y = rnd(0, 2.5); pos.set([x, y, z, x, y - 0.12, z], i * 6); }
  dropsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const drops = new THREE.LineSegments(dropsGeo, new THREE.LineBasicMaterial({ color: 0xcfefff, transparent: true, opacity: 0.55 }));
  drops.position.set(5.35, 0, -2.25); drops.visible = false; g.add(drops);
  DYN.shower = { drops, on: false };
  reg(sh, 'douche', { act: 'shower' });
  // baignoire îlot
  const tub = G(g, 7.45, 0, -2.0);
  const tubMesh = L([[0, 0], [0.7, 0], [0.8, 0.3], [0.84, 0.58], [0.85, 0.6], [0.8, 0.6], [0.72, 0.3], [0.62, 0.12], [0, 0.12]], MAT.ceramic, 0, 0, 0, tub, { seg: 48 });
  tubMesh.scale.set(1, 1, 0.5);
  const tf = G(g, 6.45, 0, -2.0);
  C(0.025, 0.03, 0.95, MAT.chrome, 0, 0, 0, tf, { seg: 12 });
  const spout = mesh(new THREE.TorusGeometry(0.14, 0.018, 8, 16, PI), MAT.chrome); spout.position.set(0.14, 0.95, 0); tf.add(spout);
  reg(tub, 'baignoire');
  obst(6.55, -2.45, 8.35, -1.55);
  WALK_MESHES.push(B(0.9, 0.012, 0.55, MAT.rugBath, 7.4, 0, -1.25, g, { cast: false }));
  // fenêtre de la salle de bains (vitre)
  const bw = B(1.6, 1.35, 0.02, MAT.glass, 7.4, 1.05, -3.0, g, { cast: false }); bw.userData.pass = true;
  reg(G(g).add(bw) && bw, 'fenetre');
  // meuble double vasque (mur est)
  const van = G(g, 8.2, 0, 0.35);
  B(0.55, 0.45, 2.2, MAT.walnut, 0, 0.38, 0, van, { tile: 1 });
  B(0.58, 0.04, 2.3, MAT.marble, 0, 0.83, 0, van);
  B(0.5, 0.02, 2.1, MAT.walnut, 0, 0.12, 0, van);
  reg(van,'meuble_vasque');
  const basins = G(van);
  [-0.55, 0.55].forEach(z => {
    L([[0, 0], [0.11, 0], [0.2, 0.06], [0.22, 0.14], [0.205, 0.14], [0.17, 0.06], [0.03, 0.02], [0, 0.02]], MAT.ceramic, -0.05, 0.87, z, basins, { seg: 40 });
  });
  reg(basins, 'lavabo');
  const taps = G(van);
  [-0.55, 0.55].forEach(z => {
    const t = G(taps, 0.24, 1.15, z);
    const sp = C(0.014, 0.014, 0.2, MAT.chrome, 0, 0, 0, t, { seg: 10 }); sp.rotation.z = PI / 2; sp.position.set(-0.1, 0, 0);
    C(0.018, 0.018, 0.05, MAT.chrome, 0, 0.06, 0.1, t, { seg: 10 }).rotation.z = PI / 2;
  });
  const stream = C(0.008, 0.008, 0.25, std({ color: 0xcfefff, transparent: true, opacity: 0.6, roughness: 0 }), 0.04, 0.9, -0.55, van, { cast: false, seg: 8 });
  stream.visible = false;
  DYN.tap = { stream, on: false };
  reg(taps, 'robinet', { act: 'tap' });
  // miroir rétroéclairé
  const mir = G(g, 8.38, 1.65, 0.35);
  DYN.mirror = mir;
  B(0.02, 1.2, 2.1, std({ color: 0xffffff, emissive: 0xfff2dd, emissiveIntensity: 1.2 }), 0.0, -0.6, 0, mir, { cast: false });
  B(0.03, 1.12, 2.02, MAT.mirror, -0.01, -0.56, 0, mir, { cast: false });
  reg(mir, 'miroir');
  const bl = new THREE.PointLight(0xfff0dc, 3, 6, 2); bl.position.set(7.3, 2.4, 0.4); g.add(bl);
  // savon, shampooing, mouchoirs, sèche-cheveux, serviettes
  const soap = G(g, 8.3, 0.87, 0.0);
  C(0.05, 0.045, 0.015, MAT.marbleDark, 0, 0, 0, soap, { seg: 16 });
  B(0.07, 0.025, 0.045, std({ color: 0xf2e6c8, roughness: 0.5 }), 0, 0.015, 0, soap, { r: 0.01 });
  L([[0, 0], [0.03, 0], [0.032, 0.13], [0.012, 0.16], [0.006, 0.2], [0, 0.2]], phys({ color: 0x12343b, roughness: 0.2, clearcoat: 1 }), 0.02, 0, 0.12, soap);
  L([[0, 0], [0.03, 0], [0.032, 0.13], [0.012, 0.16], [0.006, 0.2], [0, 0.2]], phys({ color: 0xc9a25a, roughness: 0.2, clearcoat: 1 }), 0.02, 0, 0.2, soap);
  reg(soap, 'savon');
  const towels = G(g, 8.2, 0.14, 0.35);
  [-0.6, 0, 0.6].forEach(z => { B(0.4, 0.09, 0.4, MAT.towel, 0, 0, z, towels, { r: 0.04 }); B(0.4, 0.09, 0.4, MAT.towel, 0, 0.1, z, towels, { r: 0.04 }); });
  reg(towels, 'serviettes');
  obst(7.88, -0.8, 8.5, 1.5);
  const dryer = G(g, 8.42, 1.3, 1.62);
  B(0.03, 0.08, 0.08, MAT.chrome, 0, 0, 0, dryer);
  const db = C(0.04, 0.045, 0.2, MAT.white, -0.12, 0.0, 0, dryer, { seg: 16 }); db.rotation.z = PI / 2;
  C(0.02, 0.02, 0.16, MAT.white, -0.1, -0.16, 0, dryer, { seg: 12 });
  reg(dryer, 'seche_cheveux');
  // sèche-serviettes + serviettes suspendues (mur ouest)
  const rack = G(g, 4.58, 0.25, -0.3);
  [-0.3, 0.3].forEach(z => C(0.012, 0.012, 1.2, MAT.chrome, 0, 0, z, rack, { seg: 8 }));
  for (let i = 0; i < 7; i++) { const r = C(0.01, 0.01, 0.6, MAT.chrome, 0.02, 0.1 + i * 0.16, 0, rack, { seg: 6 }); r.rotation.x = PI / 2; r.position.y = 0.1 + i * 0.16; }
  B(0.06, 0.75, 0.5, MAT.towel, 0.06, 0.35, 0, rack, { r: 0.02 });
  reg(rack, 'serviettes');
  // peignoir + chaussons près de la porte
  const robe = G(g, 4.62, 0, 1.15);
  B(0.03, 0.05, 0.05, MAT.chrome, -0.02, 1.85, 0, robe);
  const rb = L([[0, 0], [0.24, 0], [0.22, 0.6], [0.2, 0.95], [0.12, 1.05], [0, 1.06]], MAT.towel, 0.12, 0.78, 0, robe);
  rb.scale.set(0.45, 1, 1);
  reg(robe, 'peignoir');
  const slip = G(g, 4.85, 0, 0.75);
  [-0.08, 0.08].forEach(z => B(0.27, 0.035, 0.1, MAT.towel, 0, 0, z, slip, { r: 0.015 }));
  [-0.08, 0.08].forEach(z => B(0.09, 0.04, 0.1, MAT.towel, -0.07, 0.03, z, slip, { r: 0.02 }));
  reg(slip, 'chaussons');
  // toilettes (coin sud-est) + paroi
  const part = B(0.02, 2.0, 1.3, std({ color: 0xeef3f3, transparent: true, opacity: 0.6, roughness: 0.6 }), 7.1, 0, 2.85, g, { cast: false });
  obst(7.05, 2.2, 7.15, 3.5);
  const wc = G(g, 7.85, 0, 3.15, 0);
  B(0.5, 0.75, 0.12, std({ color: 0xf2f1ee, roughness: 0.4 }), 0, 0.8, 0.3, wc, { r: 0.02 });
  B(0.2, 0.13, 0.01, MAT.chrome, 0, 1.15, 0.23, wc, { r: 0.01 });
  const bowl = L([[0, 0], [0.15, 0], [0.19, 0.12], [0.2, 0.25], [0, 0.25]], MAT.ceramic, 0, 0.18, 0, wc, { seg: 32 });
  bowl.scale.set(1, 1, 1.35);
  B(0.38, 0.03, 0.52, MAT.ceramic, 0, 0.43, -0.02, wc, { r: 0.012 });
  reg(wc, 'toilettes');
  obst(7.55, 2.7, 8.4, 3.5);
  const tp = G(g, 8.37, 0.75, 2.8);
  C(0.05, 0.05, 0.1, MAT.white, -0.05, -0.05, 0, tp, { seg: 18 }).rotation.x = PI / 2;
  B(0.02, 0.02, 0.14, MAT.chrome, 0.01, 0, 0, tp);
  reg(tp, 'papier_toilette');
  // orchidée sur la vasque
  pottedPlant(g, 8.25, 1.25, 0.32, 0.87);
  for (let x = 5.2; x <= 8; x += 1.4) for (let z = -2.2; z <= 2.6; z += 1.6) ceilingSpot(g,x,2.982,z,.055);
  const doorLabel = signMesh(0.6, 0.08, (ctx, w, h) => { ctx.fillStyle = '#c9a25a'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#12343b'; ctx.font = `${h * 0.6}px ${FONT_D}`; ctx.textAlign = 'center'; ctx.fillText('SALLE DE BAINS', w / 2, h * 0.72); }, g, 4.42, 2.42, 2.15, -PI / 2);
  reg(doorLabel, 'salle_bains');
  reg(sdbFloor, 'salle_bains');
}

function buildBalcony(parent) {
  const g = G(parent);
  const teak = MAT.oak.clone();teak.color.set(0xa87c56);teak.roughness=.72;
  floor(-4.5, -5.3, 4.5, -3, 0.0, teak, 1.6, g);
  // garde-corps vitré
  const rail = G(g);
  const gp = B(9, 1.0, 0.02, MAT.glass, 0, 0.05, -5.25, rail, { cast: false }); gp.userData.pass = true;
  B(9.04, 0.05, 0.08, MAT.walnut, 0, 1.05, -5.25, rail);
  B(9, 0.05, 0.04, MAT.blackMetal, 0, 0, -5.25, rail);
  reg(rail, 'balcon');
  obst(-4.5, -5.35, 4.5, -5.15);
  // séparations latérales
  B(0.2, 3, 2.3, MAT.render, -4.6, 0, -4.15, g); B(0.2, 3, 2.3, MAT.render, 4.6, 0, -4.15, g);
  B(0.18, 0.02, 2.25, std({ color: 0xffffff, emissive: 0xfff0dc, emissiveIntensity: 0.6 }), 0, 2.97, -4.15, g, { cast: false });
  // transats
  const lng = G(g);
  [-3.75, -4.65].forEach(z => {
    const l = G(lng, -3.3, 0, z);
    B(1.9, 0.25, 0.7, teak, 0, 0.08, 0, l);
    B(1.3, 0.08, 0.64, MAT.sail, 0.25, 0.33, 0, l, { r: 0.03 });
    const back = B(0.6, 0.08, 0.64, MAT.sail, -0.62, 0.48, 0, l, { r: 0.03 }); back.rotation.z = -0.55;
    B(0.25, 0.12, 0.4, MAT.velvetMustard, -0.82, 0.64, 0, l, { r: 0.05 }).rotation.z = -0.55;
  });
  reg(lng, 'transats');
  obst(-4.3, -5.05, -2.3, -3.35);
  // table + chaises + petit déjeuner
  const tb = G(g, 2.8, 0, -4.2);
  C(0.45, 0.45, 0.03, teak, 0, 0.72, 0, tb, { seg: 40 });
  C(0.03, 0.03, 0.72, MAT.blackMetal, 0, 0, 0, tb, { seg: 10 });
  C(0.25, 0.25, 0.02, MAT.blackMetal, 0, 0, 0, tb, { seg: 24 });
  [[1.85, -4.25, -PI / 2], [3.75, -4.25, PI / 2]].forEach(([x, z, ry]) => {
    const ch = G(g, x, 0, z, ry);
    B(0.46, 0.05, 0.44, MAT.rattan, 0, 0.44, 0, ch, { r: 0.02 });
    B(0.46, 0.5, 0.05, MAT.rattan, 0, 0.47, 0.2, ch, { r: 0.02 });
    [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]].forEach(([xx, zz]) => C(0.012, 0.012, 0.44, MAT.blackMetal, xx, 0, zz, ch, { seg: 6 }));
    reg(ch,'chaise');ch.userData.outdoor=true;
    obst(x - 0.28, z - 0.28, x + 0.28, z + 0.28);
  });
  obst(2.3, -4.7, 3.3, -3.7);
  const bk = G(g, 2.8, 0.75, -4.2);
  const tray = B(0.5, 0.02, 0.34, MAT.walnut, 0, 0, 0, bk, { r: 0.008 });
  reg(bk, 'petit_dejeuner');
  const cr = G(bk, -0.12, 0.02, 0.0);
  C(0.1, 0.09, 0.012, MAT.ceramic, 0, 0, 0, cr, { seg: 32 });
  const crois = std({ color: 0xc9842f, roughness: 0.55 });
  [[0, -0.03, 0.2], [0.02, 0.04, -0.4]].forEach(([x, z, r]) => { const c = mesh(new THREE.TorusGeometry(0.045, 0.024, 10, 18, PI * 1.1), crois); c.rotation.set(PI / 2, 0, r); c.position.set(x, 0.03, z); c.scale.set(1, 1, 0.8); cr.add(c); });
  reg(cr, 'croissants');
  const js = G(bk, 0.1, 0.02, -0.08);
  C(0.032, 0.028, 0.12, MAT.glass, 0, 0, 0, js, { cast: false, seg: 20 });
  C(0.029, 0.026, 0.095, std({ color: 0xf29a1d, roughness: 0.3, transparent: true, opacity: 0.9 }), 0, 0.005, 0, js, { cast: false, seg: 20 });
  reg(js, 'jus_orange');
  const cf = G(bk, 0.13, 0.02, 0.09);
  C(0.06, 0.06, 0.008, MAT.ceramic, 0, 0, 0, cf, { seg: 24 });
  L([[0, 0], [0.025, 0], [0.038, 0.055], [0.035, 0.055], [0.022, 0.006], [0, 0.006]], MAT.ceramic, 0, 0.008, 0, cf);
  C(0.033, 0.033, 0.002, std({ color: 0x3a2214, roughness: 0.2 }), 0, 0.05, 0, cf, { seg: 20 });
  reg(cf, 'cafe');
  // jardinières
  [[4.0, -5.0], [-1.5, -5.0]].forEach(([x, z]) => { B(0.7, 0.5, 0.4, MAT.render, x, 0, z, g); pottedPlant(g, x, z, 0.8, 0.3); obst(x - 0.38, z - 0.24, x + 0.38, z + 0.24); });
  // dalle sous le balcon
  B(9.2, 0.3, 2.35, MAT.render, 0, -0.3, -4.15, g);
}

/* =========================================================
   4. EXTÉRIEUR : façade, piscine, palmiers, plage, mer, montagne
   ========================================================= */
function buildExterior() {
  const g = G(STATIC);
  // façade : modules de 13 m, 4 niveaux
  const floors = [-4, 0, 3.3, 6.6];
  const mods = [-3, -2, -1, 0, 1, 2, 3];
  const list = [];
  mods.forEach(k => floors.forEach(f => { if (!(k === 0 && f === 0)) list.push([k * 13, f]); }));
  const inst = (geo, mat, fn, cast = true) => {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    const m4 = new THREE.Matrix4();
    list.forEach(([x, f], i) => { m4.makeTranslation(...fn(x, f)); im.setMatrixAt(i, m4); });
    im.castShadow = cast; im.receiveShadow = true; g.add(im); return im;
  };
  inst(new THREE.BoxGeometry(9, 3, 0.05), MAT.glassDark, (x, f) => [x, f + 1.5, -3.0]);
  inst(new THREE.BoxGeometry(4, 3.3, 0.2), MAT.render, (x, f) => [x + 6.5, f + 1.5, -3.05]);
  inst(new THREE.BoxGeometry(1.6, 1.3, 0.05), MAT.glassDark, (x, f) => [x + 6.9, f + 1.7, -3.17]);
  inst(new THREE.BoxGeometry(9.2, 0.3, 2.35), MAT.render, (x, f) => [x, f - 0.15, -4.15]);
  inst(new THREE.BoxGeometry(9, 1.0, 0.02), MAT.glass, (x, f) => [x, f + 0.55, -5.25], false);
  inst(new THREE.BoxGeometry(9.04, 0.05, 0.08), MAT.walnut, (x, f) => [x, f + 1.075, -5.25]);
  inst(new THREE.BoxGeometry(0.2, 3, 2.3), MAT.render, (x, f) => [x - 4.6, f + 1.5, -4.15]);
  // bandeaux, toit, pignons
  B(92, 0.6, 0.4, MAT.render, 2, 9.9, -3.1, g);
  B(92, 0.3, 13.4, MAT.render, 2, 9.9, 3.5, g);
  B(0.4, 13.9, 13, MAT.render, -43.7, -4, 3.5, g);
  B(0.4, 13.9, 13, MAT.render, 47.7, -4, 3.5, g);
  B(92, 13.9, 0.3, MAT.render, 2, -4, 10.15, g, { cast: false });
  // fenêtres de la façade arrière (vue depuis le jardin du hall)
  const backWin = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 1.6, 0.05), MAT.glassDark, 60);
  let bi = 0; const m4 = new THREE.Matrix4();
  for (let row = 0; row < 3; row++) for (let c = 0; c < 20; c++) { m4.makeTranslation(-40 + c * 4.3, 1.2 + row * 3.3, 10.33); backWin.setMatrixAt(bi++, m4); }
  g.add(backWin);
  // sols : pelouse, terrasse, piscine
  floor(-320, -48, 320, -27, -4.03, MAT.grass, 4, g, false);
  floor(-320, -27, -17, -2.9, -4.03, MAT.grass, 4, g, false);
  floor(17, -27, 320, -2.9, -4.03, MAT.grass, 4, g, false);
  const dk = (x1, z1, x2, z2) => floor(x1, z1, x2, z2, -4.0, MAT.deck, 1.2, g, false);
  dk(-17, -27, 17, -20.4); dk(-17, -11.6, 17, -2.9); dk(-17, -20.4, -9.4, -11.6); dk(9.4, -20.4, 17, -11.6);
  dk(-1.2, -44, 1.2, -27);
  // margelle
  const cop = std({ color: 0xf4f0e8, roughness: 0.55 });
  B(19.2, 0.08, 0.4, cop, 0, -4.0, -20.2, g); B(19.2, 0.08, 0.4, cop, 0, -4.0, -11.8, g);
  B(0.4, 0.08, 8.8, cop, -9.4, -4.0, -16, g); B(0.4, 0.08, 8.8, cop, 9.4, -4.0, -16, g);
  // bassin
  floor(-9.2, -20, 9.2, -12, -5.4, MAT.pool, 1, g, false);
  B(18.4, 1.4, 0.05, MAT.pool, 0, -5.4, -20.02, g, { cast: false }); B(18.4, 1.4, 0.05, MAT.pool, 0, -5.4, -11.98, g, { cast: false });
  B(0.05, 1.4, 8, MAT.pool, -9.22, -5.4, -16, g, { cast: false }); B(0.05, 1.4, 8, MAT.pool, 9.22, -5.4, -16, g, { cast: false });
  const water = floor(-9.2, -20, 9.2, -12, -4.12, MAT.water, 6, g, false);
  water.receiveShadow = false;
  reg(water, 'piscine');
  // transats et parasols de la piscine
  const lounger = mergeGeometries([
    new THREE.BoxGeometry(0.7, 0.3, 1.9).translate(0, 0.15, 0),
    new THREE.BoxGeometry(0.66, 0.6, 0.1).rotateX(-0.9).translate(0, 0.45, 0.75)
  ]);
  const lpos = [];
  for (let x = -13; x <= 13; x += 2.2) { if (Math.abs(x) < 1.6) continue; lpos.push([x, -24.5, 0]); }
  for (let x = -14; x <= 14; x += 2.4) { if (Math.abs(x) < 2) continue; lpos.push([x, -8.4, PI]); }
  const lm = new THREE.InstancedMesh(lounger, MAT.sail, lpos.length);
  lpos.forEach(([x, z, r], i) => { m4.makeRotationY(r); m4.setPosition(x, -4.0, z); lm.setMatrixAt(i, m4); });
  lm.castShadow = lm.receiveShadow = true; g.add(lm);
  reg(lm, 'transats');
  const ppos = [[-12, -24.5], [-6.5, -24.5], [6.5, -24.5], [12, -24.5], [-10, -8.4], [-3.5, -8.4], [3.5, -8.4], [10, -8.4]];
  const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8).translate(0, 1.25, 0), MAT.walnut, ppos.length);
  const canopyGeo = new THREE.ConeGeometry(1.5, 0.5, 8, 1, true).translate(0, 2.55, 0);
  const canopy = new THREE.InstancedMesh(canopyGeo, std({ color: 0xf2ece0, roughness: 0.9, side: THREE.DoubleSide }), ppos.length);
  ppos.forEach(([x, z], i) => { m4.makeTranslation(x, -4.0, z); pole.setMatrixAt(i, m4); canopy.setMatrixAt(i, m4); });
  canopy.castShadow = pole.castShadow = true; g.add(pole, canopy);
  reg(canopy, 'parasol');
  // palmiers (instanciés)
  const palmA = palmGeometry(0), palmB = palmGeometry(1);
  const spots = [[-12, -7], [12.5, -6.5], [-15.5, -15], [15.5, -17], [-11, -26.5], [11.5, -27], [-20, -10], [21, -22], [-6, -31], [5, -33], [16, -34], [-16, -36], [27, -38], [-28, -37], [0, -39], [-35, -18], [36, -12], [-24, -27], [23, -29], [8, -46], [-9, -47], [32, -48], [-40, -46]];
  const pT = [], pB = [];
  spots.forEach((p, i) => (i % 2 ? pB : pT).push(p));
  [[palmA, pT], [palmB, pB]].forEach(([geo, ps]) => {
    const tr = new THREE.InstancedMesh(geo.trunk, MAT.bark, ps.length);
    const cr = new THREE.InstancedMesh(geo.crown, MAT.leaf, ps.length);
    ps.forEach(([x, z], i) => {
      const s = 0.85 + srand() * 0.35;
      m4.compose(new V3(x, z < -40 ? -4.3 : -4.02, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, srand() * PI * 2, 0)), new V3(s, s, s));
      tr.setMatrixAt(i, m4); cr.setMatrixAt(i, m4);
    });
    tr.castShadow = cr.castShadow = true; tr.receiveShadow = true;
    g.add(tr, cr);
    reg(tr, 'palmiers'); reg(cr, 'palmiers');
  });
  // palmiers du jardin (côté hall)
  const gp = [[-6, 24], [6, 23], [-12, 18], [13, 17], [-20, 25], [20, 26]];
  const tr2 = new THREE.InstancedMesh(palmA.trunk, MAT.bark, gp.length), cr2 = new THREE.InstancedMesh(palmA.crown, MAT.leaf, gp.length);
  gp.forEach(([x, z], i) => { m4.compose(new V3(x, 0, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, i * 1.7, 0)), new V3(1, 1, 1)); tr2.setMatrixAt(i, m4); cr2.setMatrixAt(i, m4); });
  tr2.castShadow = cr2.castShadow = true; g.add(tr2, cr2);
  reg(tr2,'palmiers');reg(cr2,'palmiers');
  // plage (pente douce), lagon, mer
  const sandGeo = new THREE.PlaneGeometry(640, 60, 1, 1);
  const sandM = mesh(sandGeo, MAT.sand, { cast: false });
  sandM.rotation.x = -PI / 2 + Math.atan(1.1 / 60); sandM.position.set(0, -4.6, -76);
  g.add(sandM);
  reg(sandM, 'plage');
  floor(-320, -48, 320, -45.5, -4.05, MAT.sand, 4, g, false);
  const lag = floor(-1500, -125, 1500, -62, -4.86, MAT.lagoon, 10, g, false);
  lag.receiveShadow = false;
  reg(lag, 'mer');
  const sea = floor(-2400, -2400, 2400, -62, -4.9, MAT.sea, 40, g, false);
  sea.receiveShadow = false;
  reg(sea, 'mer');
  // voiliers
  [[-120, -420], [90, -650], [260, -380]].forEach(([x, z], i) => {
    const b = G(g, x, -4.9, z, i);
    B(6, 0.8, 1.8, MAT.white, 0, 0, 0, b, { cast: false });
    const sail = mesh(new THREE.ConeGeometry(2.4, 9, 3, 1), MAT.sail, { cast: false }); sail.scale.z = 0.06; sail.position.set(0.5, 5.3, 0); b.add(sail);
  });
  // montagne (silhouette de la montagne Pelée, au nord-ouest)
  const mg = new THREE.PlaneGeometry(1600, 700, 96, 40);
  mg.rotateX(-PI / 2);
  const f = fbmMaker(91, 4, 5);
  const p = mg.attributes.position, cols = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const u = (x + 800) / 1600, v = (z + 350) / 700;
    const peak = Math.exp(-(((u - 0.32) / 0.24) ** 2 + ((v - 0.35) / 0.32) ** 2)) * 250;
    const ridge = Math.exp(-(((v - 0.4) / 0.35) ** 2)) * (f(u * 2 % 1, v) * 170);
    const edge = Math.min(1, Math.min(v, 1 - v, u, 1 - u) * 6);
    const y = (peak + ridge) * edge - 6;
    p.setY(i, y);
    const c = new THREE.Color().setHSL(0.31, 0.38, 0.16 + Math.min(0.12, y / 2400));
    cols.push(c.r, c.g, c.b);
  }
  mg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  mg.computeVertexNormals();
  const mt = new THREE.Mesh(mg, std({ vertexColors: true, roughness: 1 }));
  mt.position.set(-650, -5, -1450);
  g.add(mt);
  reg(mt, 'montagne');
}
function palmGeometry(variant) {
  const H = 7.5 + variant * 1.6, lean = 1.0 + variant * 0.9;
  const curve = new THREE.CatmullRomCurve3([new V3(0, 0, 0), new V3(lean * 0.15, H * 0.35, 0), new V3(lean * 0.55, H * 0.72, 0), new V3(lean, H, 0)]);
  const TS = 24, RS = 10;
  const trunk = new THREE.TubeGeometry(curve, TS, 0.2, RS, false);
  const pos = trunk.attributes.position;
  for (let s = 0; s <= TS; s++) {
    const t = s / TS, c = curve.getPointAt(t), k = 1.3 - 0.55 * t;
    for (let r = 0; r <= RS; r++) {
      const i = s * (RS + 1) + r;
      pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * k, c.y + (pos.getY(i) - c.y) * k, c.z + (pos.getZ(i) - c.z) * k);
    }
  }
  trunk.computeVertexNormals();
  const uv = trunk.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getY(i), uv.getX(i) * 6);
  const fronds = [];
  const top = curve.getPointAt(1);
  for (let k = 0; k < 13; k++) {
    const len = 3.6 + (k % 3) * 0.4;
    const parts=[],sag=1.4+(k%4)*.22;const mid=t=>new V3(t*len,Math.sin(t*PI)*.32-t*t*sag,0);
    parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({length:17},(_,i)=>mid(i/16))),24,.017,5,false));
    for(let j=2;j<(LOW?22:31);j++)for(const side of [-1,1]){const t=j/(LOW?23:32),c=mid(t),span=Math.sin(t*PI)*(.60+(k%3)*.05),blade=new THREE.PlaneGeometry(1,1,LOW?3:5,2),p=blade.attributes.position;for(let i=0;i<p.count;i++){const v=p.getX(i)+.5,u=p.getY(i)*2;p.setXYZ(i,c.x+v*.25+u*.035*Math.sin(v*PI),c.y-v*v*.22+Math.sin(v*PI)*.05-Math.abs(u)*.012,c.z+side*v*span+u*.035*Math.sin(v*PI));}blade.computeVertexNormals();parts.push(blade);}
    const fg=mergeGeometries(parts.map(p=>p.toNonIndexed()));
    fg.rotateZ(0.45 - (k % 3) * 0.28);
    fg.rotateY(k / 13 * PI * 2 + (k % 2) * 0.2);
    fg.translate(top.x, top.y, top.z);
    fronds.push(fg);
  }
  // noix de coco
  for (let i = 0; i < 4; i++) fronds.push(new THREE.SphereGeometry(0.13, 8, 6).translate(top.x + Math.cos(i * 1.6) * 0.22, top.y - 0.25, top.z + Math.sin(i * 1.6) * 0.22));
  return { trunk, crown: mergeGeometries(fronds.map(f => f.toNonIndexed ? f.toNonIndexed() : f)) };
}

/* =========================================================
   APPLICATION : état, audio, contrôles, interactions, activités, fiche
   ========================================================= */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- état et sauvegarde (navigateur de l'apprenant) ---------- */
const SAVE_KEY = 'suite14-caribeach-a1-v1';
const ST = { seen: {}, found: {}, key: false, form: null, dlg: 0, quiz: null, mb: null, bilan: null, voice: 'reference-a1', slow: false, mute: false, auto: true, fiche: null };
let hadSave = false;
function load() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (s) { Object.assign(ST, s); hadSave = true; } } catch (e) { } }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(ST)); } catch (e) { } }

/* ---------- audios Qwen3-TTS : références A1 explicites, sans voix système ---------- */
const CLIPS = {};
(function buildClips() {
  DATA.vocab.concat(DATA.minibar).forEach(it => { CLIPS['w_' + it.id] = { t: it.w, v: 'F' }; CLIPS['e_' + it.id] = { t: it.ex, v: 'F' }; });
  DATA.objets.forEach(o => {
    CLIPS['ow_' + o.id] = { t: o.w, v: 'F' }; CLIPS['o_' + o.id] = { t: "J'ai " + o.w + '.', v: 'M' };
    CLIPS['on_' + o.id] = { t: "Je n'ai pas " + o.neg + '.', v: 'M' }; CLIPS['oq_' + o.id] = { t: 'Est-ce que vous avez ' + o.w + ' ?', v: 'F' };
  });
  DATA.quiz.forEach((q, n) => { CLIPS['q_' + n] = { t: q.q, v: 'F' }; CLIPS['qo_' + n] = { t: q.oui, v: 'M' }; CLIPS['qn_' + n] = { t: q.non, v: 'M' }; });
  DATA.dialogue.forEach(s => { CLIPS['d_' + s.id] = { t: s.r, v: 'F' }; (s.choix || []).forEach(c => { if (c.ok) CLIPS['dc_' + s.id] = { t: c.t, v: 'M' }; }); });
  DATA.loto.forEach(n => CLIPS['num_' + n] = { t: String(n), v: 'M' }); // secours seulement
  Object.entries(DATA.ui).forEach(([k, t]) => CLIPS['ui_' + k] = { t, v: 'F' });
})();

let playTok=0,speaking=false,pendingAudio=null;
const PLAYER=document.createElement('audio');PLAYER.id='modele-audio';PLAYER.preload='none';PLAYER.hidden=true;document.body.append(PLAYER);
const AUDIO_STATUS=document.createElement('p');AUDIO_STATUS.id='audioStatus';AUDIO_STATUS.className='audio-status';AUDIO_STATUS.setAttribute('role','status');AUDIO_STATUS.hidden=true;document.body.append(AUDIO_STATUS);
let audioManifest=null;const manifestPromise=fetch('audio/manifest.json?v=20261021-2',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('manifest');return r.json();}).then(m=>audioManifest=m).catch(()=>null);
function loadPack(){return manifestPromise;}
function unlockAudio(){} // La première parole est déclenchée par le clic explicite de l'apprenant.
function stopAudio(){playTok++;PLAYER.pause();PLAYER.onended=PLAYER.onerror=PLAYER.onplaying=null;if(pendingAudio){pendingAudio(false);pendingAudio=null;}speaking=false;AUDIO_STATUS.hidden=true;}
async function playOne(id,tok){
 if(ST.mute||tok!==playTok)return false;const manifest=await manifestPromise;if(tok!==playTok)return false;
 const c=manifest?.clips?.[id];if(!c){toast('Ce son ne se charge pas. Réessayez.');return false;}
 speaking=true;AUDIO_STATUS.textContent='Chargement du son…';AUDIO_STATUS.hidden=false;
 const ok=await new Promise(resolve=>{const finish=ok=>{if(pendingAudio!==finish)return;pendingAudio=null;PLAYER.onended=PLAYER.onerror=PLAYER.onplaying=null;resolve(ok);};pendingAudio=finish;
 PLAYER.onplaying=()=>{if(tok===playTok){AUDIO_STATUS.textContent='Écoute en cours';AUDIO_STATUS.title=c.text;}};
 PLAYER.onended=()=>finish(true);PLAYER.onerror=()=>{if(tok===playTok)toast('Ce son ne se charge pas. Réessayez.');finish(false);};PLAYER.src=c.file+'?v='+encodeURIComponent(manifest.version);PLAYER.playbackRate=ST.slow?.9:1;PLAYER.preservesPitch=true;
 PLAYER.play().catch(()=>{if(tok===playTok)toast('Appuyez sur Écouter pour lancer le son.');finish(false);});});if(tok===playTok){speaking=false;AUDIO_STATUS.hidden=true;}return ok;
}
async function say(...ids){stopAudio();if(ST.mute){toast('Le son est coupé. Activez-le en haut de l’écran.');return;}const tok=playTok;for(const id of ids){if(tok!==playTok)return;const ok=await playOne(id,tok);if(!ok||tok!==playTok)return;await wait(200);}}

/* petits effets sonores synthétisés */
let AC = null;
function actx() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
function tone(freq, dur = 1, vol = 0.2, type = 'sine', delay = 0) {
  const c = actx(); if (!c || ST.mute) return;
  const t0 = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.05);
}
const fx = {
  bell() { tone(2093, 1.6, 0.22); tone(4186, 0.8, 0.05); },
  chime() { tone(880, 0.7, 0.15); tone(1318.5, 1.0, 0.15, 'sine', 0.18); },
  pick() { tone(660, 0.18, 0.12, 'triangle'); tone(990, 0.3, 0.1, 'triangle', 0.08); },
  ok() { tone(784, 0.25, 0.1, 'triangle'); tone(1175, 0.4, 0.1, 'triangle', 0.1); },
  no() { tone(220, 0.3, 0.12, 'triangle'); },
  click() { tone(1800, 0.05, 0.05, 'square'); },
};
const LOOPS = {};
function noiseLoop(name, on, kind) {
  if (!on) { if (LOOPS[name]) { try { LOOPS[name].stop(); } catch (e) { } delete LOOPS[name]; } return; }
  const c = actx(); if (!c || LOOPS[name]) return;
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = c.createBiquadFilter(); f.type = kind === 'water' ? 'bandpass' : 'lowpass'; f.frequency.value = kind === 'water' ? 1800 : 500; f.Q.value = 0.6;
  const g = c.createGain(); g.gain.value = ST.mute ? 0 : (kind === 'water' ? 0.07 : 0.035);
  src.connect(f).connect(g).connect(c.destination); src.start();
  LOOPS[name] = { stop: () => src.stop(), g };
}

/* ---------- joueur et contrôles ---------- */
const P = { x: 0, z: 35.4, yaw: PI, pitch: -0.04, eye: 1.62, target: null, route:[], bob: 0 };
const SPOTS = {
  reception: { x: 0, z: 35.4, yaw: PI, pitch: -0.04 },
  couloir: { x: 6.2, z: 4.6, yaw: 1.23, pitch: -0.02 },
  chambre: { x: 2.0, z: 2.3, yaw: 0.72, pitch: -0.12 },
  salon: { x: 1.45, z: 1.25, yaw: -1.1, pitch: -0.14 },
  bureau: { x: 0, z: 1.6, yaw: PI, pitch: -0.3 },
  sdb: { x: 5.5, z: 1.9, yaw: -0.95, pitch: -0.12 },
  balcon: { x: 0.6, z: -4.1, yaw: 0.42, pitch: -0.1 },
};
const keys = {};
const JOY = { active: false, x: 0, y: 0 };
let drag = null, lastHover = 0, hovered = null, uiReady = false, started = false;

addEventListener('keydown', e => {
  if(!$('#modalWrap').hidden){if(e.code==='Escape'){e.preventDefault();closeModal();}return;}
  if (e.target.closest && e.target.closest('input,textarea,select')) return;
  keys[e.code] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Escape') { closeCard(); closeModal(); }
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('pointerdown', e => {
  actx();
  if (drag) return;
  canvas.setPointerCapture(e.pointerId);
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false, type: e.pointerType };
});
canvas.addEventListener('pointermove', e => {
  if (drag && e.pointerId === drag.id) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) { drag.moved = true; canvas.classList.add('dragging'); hideTip(); }
    if (drag.moved) {
      const k = drag.type === 'touch' ? 0.0058 : 0.0042;
      P.yaw += dx * k; P.pitch = clamp(P.pitch + dy * k, -1.25, 1.1);
    }
  } else if (e.pointerType === 'mouse') {
    const now = performance.now();
    if (now - lastHover > 70) { lastHover = now; hoverAt(e.clientX, e.clientY); }
  }
});
const endDrag = e => {
  if (!drag || e.pointerId !== drag.id) return;
  const d = drag; drag = null; canvas.classList.remove('dragging');
  if (!d.moved && performance.now() - d.t < 650 && e.type === 'pointerup') clickAt(e.clientX, e.clientY);
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => { if (!drag) { setHover(null); hideTip(); } });

// joystick tactile
const joy = $('#joy'), knob = $('#joyKnob');
if (IS_TOUCH) joy.hidden = false;
let joyId = null;
joy.addEventListener('pointerdown', e => { actx(); joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyMove(e); e.stopPropagation(); });
joy.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyMove(e); });
const joyEnd = e => { if (e.pointerId !== joyId) return; joyId = null; JOY.active = false; JOY.x = JOY.y = 0; knob.style.transform = ''; };
joy.addEventListener('pointerup', joyEnd); joy.addEventListener('pointercancel', joyEnd);
function joyMove(e) {
  const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let dx = e.clientX - cx, dy = e.clientY - cy; const m = Math.hypot(dx, dy), R = r.width / 2 - 10;
  if (m > R) { dx *= R / m; dy *= R / m; }
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
  JOY.active = true; JOY.x = dx / R; JOY.y = dy / R;
}

function tryMove(dx, dz) {
  const nx = P.x + dx, nz = P.z + dz;
  if (freeAt(nx, nz)) { P.x = nx; P.z = nz; return true; }
  if (Math.abs(dx) > 1e-5 && freeAt(nx, P.z)) { P.x = nx; return true; }
  if (Math.abs(dz) > 1e-5 && freeAt(P.x, nz)) { P.z = nz; return true; }
  return false;
}
function updateMove(dt) {
  let f = 0, s = 0, turn = 0;
  if (keys.KeyW || keys.ArrowUp) f += 1;
  if (keys.KeyS || keys.ArrowDown) f -= 1;
  if (keys.KeyA) s -= 1;
  if (keys.KeyD) s += 1;
  if (keys.ArrowLeft) turn += 1;
  if (keys.ArrowRight) turn -= 1;
  if (JOY.active) { f += -JOY.y; s += JOY.x; }
  P.yaw += turn * 1.9 * dt;
  const sp = (keys.ShiftLeft || keys.ShiftRight) ? 3.4 : 2.1;
  let moving = false;
  if (Math.abs(f) > 0.05 || Math.abs(s) > 0.05) {
    P.target = null; P.route=[]; marker.visible = false;
    const fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw), rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw);
    const n = Math.max(1, Math.hypot(f, s));
    moving = tryMove((fx * f + rx * s) / n * sp * dt, (fz * f + rz * s) / n * sp * dt);
  } else if (P.target) {
    const dx = P.target.x - P.x, dz = P.target.z - P.z, d = Math.hypot(dx, dz);
    if (d < 0.08) { P.target = P.route.shift() || null; if(!P.target)marker.visible = false; }
    else {
      const st = Math.min(d, sp * dt);
      if(P.route.length || P.target.guided){const desired=Math.atan2(-dx,-dz);P.yaw+=Math.atan2(Math.sin(desired-P.yaw),Math.cos(desired-P.yaw))*Math.min(1,dt*5);P.pitch*=.94;}
      moving = tryMove(dx / d * st, dz / d * st);
      if (!moving) { P.target = null; marker.visible = false; }
    }
  }
  if (moving) P.bob += dt * 9; else P.bob *= 0.9;
}
function teleport(name, instant) {
  stopAudio();
  const s = SPOTS[name]; if (!s) return;
  if (['balcon'].includes(name) && !STATE_REF.slideOpen) doAct('slide', true);
  const go = () => { P.x = s.x; P.z = s.z; P.yaw = s.yaw; P.pitch = s.pitch; P.target = null; P.route=[]; marker.visible = false; };
  if (instant) return go();
  const f = $('#fade'); f.classList.add('on');
  setTimeout(() => { go(); f.classList.remove('on'); }, 420);
  closeCard();
  if (['chambre', 'salon', 'bureau', 'sdb', 'balcon'].includes(name) && !ST.key) setTimeout(() => toast("Conseil : allez d'abord à la réception pour prendre la clé."), 900);
}

/* marqueur de destination au sol */
const marker = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false }));
marker.rotation.x = -PI / 2; marker.visible = false; scene.add(marker);

/* ---------- sélection d'objets ---------- */
const ray = new THREE.Raycaster(); ray.far = 3200; ray.params.Line.threshold = 0.01;
const ndc = new THREE.Vector2();
function visibleChain(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
function pickAt(cx, cy) {
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObject(STATIC, true);
  let pass = null;
  for (const h of hits) {
    if (h.object.isLine || h.object.isPoints) continue;
    if (!visibleChain(h.object)) continue;
    if (h.object.userData.pass) { if (!pass) pass = h; continue; }
    return h;
  }
  return pass;
}
function rootOf(h) { return h && h.object.userData.root ? h.object.userData.root : null; }
function easyPick(x,y){
 const direct=pickAt(x,y),r=rootOf(direct),background=new Set(['mur','sol','plafond','couloir']);if(r&&!background.has(r.userData.vid))return direct;
 const radius=IS_TOUCH?20:12;for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]]){const h=pickAt(x+dx*radius,y+dy*radius),root=rootOf(h);if(root&&!background.has(root.userData.vid))return h;}return direct;
}
function labelOf(root) {
  if (!root) return null;
  if (root.userData.obj) return ST.found[root.userData.obj] ? null : "Qu'est-ce que c'est ?";
  const v = VOC[root.userData.vid]; return v ? v.w : null;
}
const HL = new Map();
const NO_HL = new Set(['miroir','mur','sol','plafond','mer', 'montagne', 'plage', 'piscine', 'couloir', 'salle_bains', 'palmiers', 'transats', 'parasol', 'balcon', 'fenetre', 'rideaux']);
function hlMat(m) {
  if (Array.isArray(m)) return m;
  let h = HL.get(m);
  if (!h) { h = m.clone();h.onBeforeCompile=m.onBeforeCompile;h.customProgramCacheKey=m.customProgramCacheKey;h.unbakedMaterial=m.unbakedMaterial;if (h.emissive) { h.emissive = new THREE.Color(0x3fb6bd); h.emissiveIntensity = 0.32; h.emissiveMap = null; } HL.set(m, h); }
  return h;
}
function setHover(root) {
  if (hovered === root) return;
  if (hovered) hovered.traverse(m => { if (m.isMesh && m.userData.baseMat) { m.material = m.userData.baseMat; delete m.userData.baseMat; } });
  hovered = root;
  canvas.classList.toggle('hover', !!root);
  if (root && !root.isInstancedMesh && !NO_HL.has(root.userData.vid)) root.traverse(m => { if (m.isMesh && !m.userData.baseMat && !m.userData.pass) { m.userData.baseMat = m.material; m.material = hlMat(m.material); } });
}
function hoverAt(x, y) {
  if (!started) return;
  const h = easyPick(x, y), r = rootOf(h), lab = labelOf(r);
  if (r && lab) { setHover(r); showTip(x, y, lab); }
  else { setHover(null); hideTip(); canvas.classList.toggle('hover', !!(h && WALK_MESHES.includes(h.object))); }
}
const tip = $('#tip');
function showTip(x, y, t) { tip.textContent = t; tip.hidden = false; tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
function hideTip() { tip.hidden = true; }
function clickAt(x, y) {
  if (!started) return;
  const h = easyPick(x, y); if (!h) return;
  const r = rootOf(h);
  const isFloor = WALK_MESHES.includes(h.object);
  if (isFloor) {
    const p = h.point;
    if (Math.hypot(p.x - P.x, p.z - P.z) < 14) { P.route=[];P.target = { x: p.x, z: p.z }; marker.position.set(p.x, p.y + 0.01, p.z); marker.visible = true; }
    if (r && r.userData.vid && !ST.seen[r.userData.vid]) select(r);
    return;
  }
  if (r) select(r);
}

/* ---------- étiquettes ---------- */
const ZONE_NAME = DATA.zones;
const GENDER = { m: 'masculin', f: 'féminin', pl: 'pluriel' };
function artHTML(w, g) {
  const m = w.match(/^(le |la |les |un |une |des |l['’])(.*)$/);
  if (!m) return esc(w);
  const a = m[1].trim(), sep = /['’]$/.test(m[1]) ? '' : ' ';
  return `<span class="art g-${g}">${esc(a)}</span>${sep}${esc(m[2])}`;
}
function genderLine(w, g) {
  const elided = /^l['’]/.test(w);
  return `<span class="dot bg-${g}"></span>${GENDER[g]}${elided ? " · l' devant une voyelle" : ''}`;
}
let cardVid = null, cardRoot = null;
function markSeen(vid) {
  if (!vid || !VOC[vid] || ST.seen[vid]) return;
  ST.seen[vid] = 1; save(); updateChips(true);
  if (Object.keys(ST.seen).filter(k => VOCAB_IDS.includes(k)).length === VOCAB_IDS.length) toast('Bravo ! Vous avez découvert tous les mots.');
  if (fichePane === 'lexique' || fichePane === 'missions') renderFiche();
}
function select(root) {
  if (root.userData.obj) return collect(root);
  const vid = root.userData.vid, act = root.userData.act;
  if (!vid) return;
  fx.click();
  markSeen(vid);
  if (act && ['dialogue', 'liftUp', 'liftDown', 'form', 'minibar'].includes(act)) { doAct(act); if (act === 'minibar' && ST.auto) say('w_minibar'); return; }
  if (act === 'takeKey') { takeKey(); return; }
  if (act) doAct(act);
  showCard(vid, act, root);
  if (ST.auto) say('w_' + vid, 'e_' + vid);
}
function showCard(vid, act, root) {
  const v = VOC[vid]; if (!v) return;
  cardVid = vid; cardRoot = root || null;
  const c = $('#card'); c.classList.remove('found');
  $('#cardZone').textContent = ZONE_NAME[v.z] || '';
  $('#cardWord').innerHTML = artHTML(v.w, v.g);
  $('#cardGender').innerHTML = genderLine(v.w, v.g);
  $('#cardEx').textContent = v.ex || '';
  $('#cardSayE').hidden = !v.ex;
  const b = $('#cardAct');
  if (act && actLabel(act)) { b.hidden = false; b.textContent = actLabel(act); b.dataset.act = act; } else b.hidden = true;
  let controls=$('#cardWardrobe');if(!controls){controls=document.createElement('div');controls.id='cardWardrobe';c.append(controls);}
  controls.hidden=vid!=='armoire'&&vid!=='tiroirs';
  if(!controls.hidden){controls.innerHTML='<p id="wardrobeStatus" class="wardrobe-status" role="status"></p>'+wardrobeButtons()+wardrobeLearning.html(wardrobeLearning.wardrobe());b.hidden=true;bindWardrobeButtons(controls);wardrobeLearning.bind(controls,wardrobeLearning.wardrobe(),inspectObject);}
  c.hidden = false;
  $('#cardCloseup').onclick=()=>inspectObject(root || INTER.find(r=>r.userData.vid===vid),v);
}
function closeCard() { $('#card').hidden = true; cardVid = null; }
$('#cardX').onclick = closeCard;
$('#cardSayW').onclick = () => { if (cardVid) say((cardVid.startsWith('obj:') ? 'ow_' + cardVid.slice(4) : 'w_' + cardVid)); };
$('#cardSayE').onclick = () => { if (cardVid) say(cardVid.startsWith('obj:') ? 'o_' + cardVid.slice(4) : 'e_' + cardVid); };
$('#cardAct').onclick = () => { const a = $('#cardAct').dataset.act; doAct(a); if (cardVid && !cardVid.startsWith('obj:')) showCard(cardVid, a, cardRoot); };

/* ---------- objets personnels (chasse) ---------- */
function buildHunt() {
  const H = {};
  const PROXY = new THREE.MeshBasicMaterial({ visible: false });
  const mk = (id, x, y, z, ry, build) => { const g = G(STATIC, x, y, z, ry); build(g); B(0.26, 0.16, 0.26, PROXY, 0, -0.01, 0, g, { cast: false, recv: false }); reg(g, null, { obj: id }); H[id] = g; if (ST.found[id]) g.visible = false; };
  mk('portefeuille', -4.08, 0.55, 1.15, 0.5, g => { B(0.12, 0.022, 0.095, std({ color: 0x6b3a22, roughness: 0.55 }), 0, 0, 0, g, { r: 0.008 }); B(0.121, 0.003, 0.002, MAT.brass, 0, 0.012, 0.03, g); });
  mk('lunettes', 0.42, 0.765, 3.08, 0.35, g => {
    const rim = new THREE.TorusGeometry(0.025, 0.003, 6, 24);
    [-0.032, 0.032].forEach(x => { const r = mesh(rim, MAT.blackMetal); r.position.set(x, 0.025, 0); g.add(r); const l = mesh(new THREE.CircleGeometry(0.024, 20), MAT.glass); l.position.set(x, 0.025, 0.001); l.userData.pass = false; g.add(l); });
    B(0.016, 0.003, 0.003, MAT.blackMetal, 0, 0.033, 0, g);
    [-0.058, 0.058].forEach(x => { const t = B(0.003, 0.003, 0.12, MAT.blackMetal, x, 0.028, 0.06, g); });
  });
  mk('chargeur', -0.32, 0.76, 3.32, -0.4, g => {
    B(0.045, 0.03, 0.045, MAT.white, 0, 0, 0, g, { r: 0.006 });
    const cv = new THREE.CatmullRomCurve3([new V3(0, 0.015, -0.023), new V3(0.05, 0.004, -0.09), new V3(0.15, 0.004, -0.05), new V3(0.22, 0.004, -0.12)]);
    g.add(mesh(new THREE.TubeGeometry(cv, 20, 0.003, 6), MAT.white));
  });
  mk('portable', 2.7, 0.645, 0.02, 0.6, g => { B(0.075, 0.008, 0.155, MAT.blackMetal, 0, 0, 0, g, { r: 0.003 }); B(0.068, 0.001, 0.145, std({ color: 0x0b1620, roughness: 0.1, metalness: 0.4 }), 0, 0.008, 0, g); });
  mk('cles', 2.15, 0.87, 3.3, 0.8, g => {
    const ring = mesh(new THREE.TorusGeometry(0.02, 0.002, 6, 20), MAT.chrome); ring.rotation.x = PI / 2; ring.position.y = 0.004; g.add(ring);
    [[0.03, 0.4], [0.028, -0.5]].forEach(([d, a]) => { const k = G(g, Math.cos(a) * d, 0.004, Math.sin(a) * d, -a); B(0.05, 0.003, 0.012, MAT.brass, 0.03, 0, 0, k); C(0.012, 0.012, 0.003, MAT.brass, 0, 0, 0, k, { seg: 14 }); });
    B(0.035, 0.012, 0.03, std({ color: 0x3a8fd6, roughness: 0.4 }), -0.035, 0, 0.01, g, { r: 0.004 });
  });
  mk('mouchoirs', 8.2, 0.87, 0.35, PI / 2, g => {
    B(0.24, 0.09, 0.12, std({ color: 0xffffff, roughness: 0.6 }), 0, 0, 0, g, { r: 0.008 });
    B(0.1, 0.002, 0.03, std({ color: 0x7fb7b2 }), 0, 0.09, 0, g);
    const t = mesh(new THREE.ConeGeometry(0.03, 0.05, 5), std({ color: 0xffffff, roughness: 1 })); t.position.set(0, 0.11, 0); g.add(t);
  });
  mk('bouteille', 3.02, 0.75, -4.02, 0, g => {
    L([[0, 0], [0.035, 0], [0.036, 0.16], [0.03, 0.19], [0.014, 0.22], [0.013, 0.24], [0, 0.24]], phys({ color: 0xbfe4f2, roughness: 0.05, transparent: true, opacity: 0.55, depthWrite: false }), 0, 0, 0, g);
    C(0.015, 0.015, 0.025, std({ color: 0x1f6fd0, roughness: 0.4 }), 0, 0.235, 0, g, { seg: 12 });
    C(0.0365, 0.0365, 0.06, std({ color: 0x1f6fd0, roughness: 0.5 }), 0, 0.07, 0, g, { open: true, seg: 20 });
  });
  return H;
}
function collect(root) {
  const id = root.userData.obj; if (ST.found[id]) return;
  ST.found[id] = true; save();
  root.visible = false; setHover(null); hideTip();
  fx.pick();
  const o = OBJ[id];
  cardVid = 'obj:' + id;
  const c = $('#card'); c.classList.add('found');
  if($('#cardWardrobe'))$('#cardWardrobe').hidden=true;
  $('#cardCloseup').onclick=()=>inspectObject(root,{id,w:OBJ[id].w,ex:"J’ai "+OBJ[id].w+' !'});
  $('#cardZone').textContent = 'Objet trouvé';
  $('#cardWord').innerHTML = artHTML(o.w, o.g);
  $('#cardGender').innerHTML = genderLine(o.w, o.g);
  $('#cardEx').textContent = "J'ai " + o.w + ' !';
  $('#cardSayE').hidden = false; $('#cardAct').hidden = true; c.hidden = false;
  say('ow_' + id, 'o_' + id);
  updateChips(false, true);
  const n = DATA.objets.filter(o => o.cache && ST.found[o.id]).length;
  if (n === 7) setTimeout(() => toast('Bravo ! Vous avez les 7 objets. Faites le bilan dans la fiche.'), 1200);
  renderFiche();
}

/* ---------- actions ---------- */
const ON = { chevet: false, lampadaire: false, bureau: false };
function actLabel(act) {
  if(act.startsWith('drawer:')){const d=DYN.wardDrawers?.[Number(act.split(':')[1])];return (d?.open?'Fermer':'Ouvrir')+' le tiroir';}
  if (act.startsWith('lamp:')) return ON[act.slice(5)] ? 'Éteindre' : 'Allumer';
  return ({
    tv: DYN.tv.on ? 'Éteindre la télé' : 'Allumer la télé',
    clim: DYN.ac.on ? 'Arrêter la clim' : 'Allumer la clim',
    curtains: curtainsClosed ? 'Ouvrir les rideaux' : 'Fermer les rideaux',
    wardrobe: STATE_REF.wardrobeOpen ? 'Fermer l’armoire' : 'Ouvrir l’armoire',
    slide: STATE_REF.slideOpen ? 'Fermer la porte-fenêtre' : 'Ouvrir la porte-fenêtre',
    door: STATE_REF.doorOpen ? 'Fermer la porte' : 'Ouvrir la porte',
    shower: DYN.shower.on ? "Fermer l'eau" : "Ouvrir l'eau",
    tap: DYN.tap.on ? "Fermer l'eau" : "Ouvrir l'eau",
    minibar: 'Voir le minibar',
  })[act] || null;
}
let curtainsClosed = false;
function doAct(act, silent) {
  if(act==='wardrobe'||act.startsWith('drawer:')){const message=wardrobeController.act(act);if(message)toast(message);return;}
  if (act.startsWith('lamp:')) { const n = act.slice(5); ON[n] = !ON[n]; setLamp(n, ON[n]); fx.click(); return; }
  switch (act) {
    case 'tv': DYN.tv.on = !DYN.tv.on; DYN.tv.t = 99; DYN.tv.mat.emissiveIntensity = DYN.tv.on ? 1 : 0; drawTV(); if (DYN.tv.on) setTimeout(() => say('ui_loto'), 900); break;
    case 'clim': {
      const a = DYN.ac; a.on = !a.on; drawAC();
      tween(a.flap.rotation.x, a.on ? -0.9 : 0, 0.8, v => a.flap.rotation.x = v);
      a.disp.material.emissiveIntensity = a.on ? 1 : 0; acParts.visible = a.on;
      noiseLoop('ac', a.on, 'air'); break;
    }
    case 'curtains': curtainsClosed = !curtainsClosed;
      DYN.curtains.forEach(c => tween(c.m.scale.x, curtainsClosed ? 1 : c.open, 1.4, v => c.m.scale.x = v)); break;
    case 'slide': {
      if (STATE_REF.slideOpen && Math.abs(P.z + 3) < 0.6 && Math.abs(P.x) < 1) return;
      STATE_REF.slideOpen = !STATE_REF.slideOpen;
      tween(DYN.slide.position.x, STATE_REF.slideOpen ? -1.75 : 0, silent ? 0.01 : 1.1, v => DYN.slide.position.x = v); break;
    }
    case 'door': {
      if (!ST.key) { toast("Vous n'avez pas de clé. Allez à la réception."); say('ui_pas_cle'); return; }
      if (STATE_REF.doorOpen && P.z > 2.4 && P.z < 4.4 && Math.abs(P.x - 3.1) < 0.7) return;
      STATE_REF.doorOpen = !STATE_REF.doorOpen; fx.click();
      tween(DYN.door.rotation.y, STATE_REF.doorOpen ? -1.55 : 0, 0.9, v => DYN.door.rotation.y = v); break;
    }
    case 'shower': DYN.shower.on = !DYN.shower.on; DYN.shower.drops.visible = DYN.shower.on; noiseLoop('shower', DYN.shower.on, 'water'); break;
    case 'tap': DYN.tap.on = !DYN.tap.on; DYN.tap.stream.visible = DYN.tap.on; noiseLoop('tap', DYN.tap.on, 'water'); break;
    case 'minibar': openMinibar(); break;
    case 'liftUp': case 'liftDown': {
      closeCard(); fx.chime(); say('ui_ascenseur');
      const f = $('#fade'); f.classList.add('on');
      setTimeout(() => {
        const s = act === 'liftUp' ? { x: 7.6, z: 4.6, yaw: 1.4, pitch: 0 } : { x: 6.6, z: 36.3, yaw: PI / 2 + 0.6, pitch: 0 };
        Object.assign(P, s); P.target = null; marker.visible = false;
        setTimeout(() => { f.classList.remove('on'); fx.chime(); }, 700);
      }, 500);
      break;
    }
    case 'dialogue': fx.bell(); openDialogue(); break;
    case 'form': if (ST.dlg === 2) openForm(); else openDialogue(); break;
    case 'takeKey': takeKey(); break;
  }
}
const OBST_DOOR = obst(3.5, 2.45, 3.7, 3.47, () => STATE_REF.doorOpen);

/* télévision : le loto */
const lotoBag = shuffle(DATA.loto);
function drawTV() {
  const t = DYN.tv, c = t.canvas.getContext('2d'), W = c.canvas.width, H = c.canvas.height;
  if (!t.on) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); t.tex.needsUpdate = true; return; }
  const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0b4a78'); g.addColorStop(1, '#06203a');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.fillStyle = '#f2d48a'; c.font = `44px ${FONT_D}`; c.textAlign = 'left'; c.fillText('LE LOTO', 40, 70);
  c.font = `20px ${FONT_B}`; c.fillStyle = '#cfe3f1'; c.fillText('Palace Hôtel TV · tirage du jour', 40, 102);
  if (t.n != null) {
    c.fillStyle = '#fff'; c.beginPath(); c.arc(W * 0.72, H * 0.46, 105, 0, PI * 2); c.fill();
    c.strokeStyle = '#d9604a'; c.lineWidth = 14; c.beginPath(); c.arc(W * 0.72, H * 0.46, 82, 0, PI * 2); c.stroke();
    c.fillStyle = '#12343b'; c.textAlign = 'center'; c.font = `bold 92px ${FONT_B}`; c.fillText(String(t.n), W * 0.72, H * 0.46 + 32);
  }
  c.textAlign = 'center';
  t.hist.slice(-6).forEach((n, i) => {
    const x = 70 + i * 62, y = H - 70;
    c.fillStyle = '#f2d48a'; c.beginPath(); c.arc(x, y, 26, 0, PI * 2); c.fill();
    c.fillStyle = '#12343b'; c.font = `bold 24px ${FONT_B}`; c.fillText(String(n), x, y + 8);
  });
  t.tex.needsUpdate = true;
}
function stepTV(dt) {
  const t = DYN.tv; if (!t.on) return;
  t.t += dt;
  if (t.t > 5) {
    t.t = 0;
    if (!lotoBag.length) lotoBag.push(...shuffle(DATA.loto));
    t.n = lotoBag.pop(); t.hist.push(t.n); drawTV();
    const z = zoneAt(P.x, P.z);
    if (z === 'chambre' && !speaking && $('#modalWrap').hidden) say('num_' + t.n);
  }
}
function drawAC() {
  const a = DYN.ac, c = a.canvas.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, 128, 48);
  if (a.on) { c.fillStyle = '#7fe0ff'; c.font = `bold 30px ${FONT_B}`; c.textAlign = 'center'; c.fillText('20 °C', 64, 35); }
  a.tex.needsUpdate = true;
}
let acParts;
function buildACParticles() {
  const n = 70, geo = new THREE.BufferGeometry(), p = new Float32Array(n * 3), life = new Float32Array(n);
  for (let i = 0; i < n; i++) { p[i * 3] = rnd(-0.4, 0.4); p[i * 3 + 1] = 2.4; p[i * 3 + 2] = 3.2; life[i] = Math.random(); }
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  acParts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.45, depthWrite: false }));
  acParts.userData.life = life; acParts.visible = false; scene.add(acParts);
}
function stepAC(dt) {
  if (!acParts.visible) return;
  const p = acParts.geometry.attributes.position, life = acParts.userData.life;
  for (let i = 0; i < life.length; i++) {
    life[i] += dt * 0.5;
    if (life[i] > 1) { life[i] = 0; p.setXYZ(i, rnd(-0.42, 0.42), 2.42, 3.18); }
    p.setXYZ(i, p.getX(i), p.getY(i) - dt * 0.35, p.getZ(i) - dt * 0.9);
  }
  p.needsUpdate = true;
}

/* ---------- dialogue à la réception ---------- */
const dlg = $('#dlg');
function openDialogue() {
  closeCard(); closeModal();
  dlg.hidden = false;
  if (ST.dlg >= DATA.dialogue.length) {
    const last = DATA.dialogue[DATA.dialogue.length - 1];
    renderStep(last, true); return;
  }
  renderStep(DATA.dialogue[ST.dlg]);
}
function renderStep(s, replay) {
  $('#dlgLine').textContent = s.r;
  $('#dlgFb').hidden = true;
  const box = $('#dlgChoices'); box.innerHTML = '';
  $('#dlgReplay').onclick = () => say('d_' + s.id);
  say('d_' + s.id);
  if (s.choix) {
    shuffle(s.choix).forEach(c => {
      const b = document.createElement('button'); b.className = 'choice'; b.textContent = c.t;
      b.onclick = async () => {
        if (b.classList.contains('ok')) return;
        if (c.ok) {
          box.querySelectorAll('.choice').forEach(x => x.disabled = true);
          b.classList.add('ok'); fx.ok(); $('#dlgFb').hidden = true;
          await say('dc_' + s.id);
          ST.dlg++; save(); renderFiche();
          openDialogue();
        } else {
          b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); fx.no();
          const fb = $('#dlgFb'); fb.textContent = c.fb || 'Essayez encore.'; fb.hidden = false;
        }
      };
      box.appendChild(b);
    });
  } else if (s.form) {
    const b = document.createElement('button'); b.className = 'btn btn-main'; b.textContent = 'Remplir le formulaire';
    b.onclick = () => openForm(); box.appendChild(b);
  } else if (s.fin) {
    DYN.keyCard.visible = !ST.key;
    const b = document.createElement('button'); b.className = 'btn btn-main';
    b.innerHTML = ST.key ? 'Merci, au revoir !' : '<svg class="ic"><use href="#i-key"/></svg> Prendre la clé';
    b.onclick = () => { if (!ST.key) takeKey(); else closeDialogue(); };
    box.appendChild(b);
    if (!ST.key && ST.dlg < DATA.dialogue.length) { ST.dlg = DATA.dialogue.length; save(); }
  }
}
function closeDialogue() { dlg.hidden = true; stopAudio(); }
$('#dlgX').onclick = closeDialogue;
function takeKey() {
  if (ST.key) return;
  if (ST.dlg < DATA.dialogue.length) { openDialogue(); return; }
  ST.key = true; save();
  DYN.keyCard.visible = false;
  markSeen('cle'); fx.ok();
  closeDialogue();
  showCard('cle', null, null);
  say('w_cle', 'e_cle');
  updateChips(false, false, true);
  toast("Vous avez la clé de la chambre 14 ! Prenez l'ascenseur.");
  renderFiche();
}

/* ---------- formulaire de réservation (activité 7) ---------- */
function openForm() {
  const f = ST.form || {};
  const today = new Date(), iso = d => d.toISOString().slice(0, 10);
  const v = (k, d = '') => esc(f[k] != null ? f[k] : d);
  openModal(`
    <h2>Réservation</h2>
    <p class="lead">Remplissez le formulaire pour la réceptionniste. Utilisez un nom et des coordonnées imaginaires.</p>
    <form id="resaForm" novalidate>
      <div class="resa-wrap"><table class="resa">
        <tr><th colspan="4">Réservation · Palace Hôtel</th></tr>
        <tr><td class="lab"><label for="f-nom">Nom</label></td><td><input id="f-nom" name="nom" autocomplete="off" value="${v('nom')}"></td>
            <td class="lab"><label for="f-email">E-mail</label></td><td><input id="f-email" name="email" type="email" autocomplete="off" value="${v('email')}"></td></tr>
        <tr><td class="lab"><label for="f-prenom">Prénom</label></td><td><input id="f-prenom" name="prenom" autocomplete="off" value="${v('prenom')}"></td>
            <td class="lab"><label for="f-arrivee">Date d'arrivée</label></td><td><input id="f-arrivee" name="arrivee" type="date" value="${v('arrivee', iso(today))}"></td></tr>
        <tr><td class="lab"><label for="f-adresse">Adresse</label></td><td><input id="f-adresse" name="adresse" autocomplete="off" value="${v('adresse')}"></td>
            <td class="lab"><label for="f-depart">Date de départ</label></td><td><input id="f-depart" name="depart" type="date" value="${v('depart', iso(new Date(today.getTime() + 2 * 864e5)))}"></td></tr>
        <tr><td class="lab"><label for="f-tel">Téléphone</label></td><td><input id="f-tel" name="tel" type="tel" autocomplete="off" value="${v('tel')}"></td>
            <td class="lab"><label for="f-pers">Nombre de personnes</label></td><td><select id="f-pers" name="pers">${[1, 2, 3, 4].map(n => `<option ${String(f.pers || 2) === String(n) ? 'selected' : ''}>${n}</option>`).join('')}</select></td></tr>
        <tr><td class="lab"><label for="f-type">Chambre</label></td><td colspan="3"><select id="f-type" name="type">${['une chambre simple', 'une chambre double', 'une suite'].map(t => `<option ${(f.type || 'une suite') === t ? 'selected' : ''}>${t}</option>`).join('')}</select></td></tr>
        <tr><th colspan="4">Demandes particulières</th></tr>
        <tr><td colspan="4"><textarea id="f-dem" name="dem" placeholder="Exemple : une chambre avec vue sur la mer.">${v('dem')}</textarea></td></tr>
      </table></div>
      <div class="form-row"><span class="form-msg" id="formMsg"></span><button class="btn btn-main" type="submit">Valider l’exercice</button></div>
    </form>`);
  $('#resaForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    const errs = [];
    const bad = (id, ok, msg) => { const el = document.getElementById(id); el.closest('td').classList.toggle('bad', !ok); if (!ok) errs.push(msg); };
    bad('f-nom', fd.nom.trim().length > 1, 'Écrivez votre nom.');
    bad('f-prenom', fd.prenom.trim().length > 1, 'Écrivez votre prénom.');
    bad('f-email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fd.email.trim()), "Vérifiez l'e-mail (exemple : nom@mail.com).");
    bad('f-tel', fd.tel.replace(/\D/g, '').length >= 6, 'Écrivez votre numéro de téléphone.');
    bad('f-depart', fd.depart && fd.arrivee && fd.depart > fd.arrivee, "La date de départ est après la date d'arrivée.");
    if (errs.length) { $('#formMsg').textContent = errs[0]; fx.no(); return; }
    ST.form = fd; if (ST.dlg === 2) ST.dlg = 3; save(); fx.ok();
    closeModal(); openDialogue(); renderFiche();
  });
}

/* ---------- fenêtre modale ---------- */
let onModalClose = null,modalReturnFocus=null;
function openModal(html, onClose) {
  const returnFocus=$('#modalWrap').hidden?document.activeElement:modalReturnFocus;
  if(!$('#modalWrap').hidden)closeModal();
  modalReturnFocus=returnFocus;
  $('#modalBody').innerHTML = html; $('#modalWrap').hidden = false; onModalClose = onClose || null;
  const heading=$('#modalBody').querySelector('h2');if(heading){heading.id='modalTitle';$('#modal').setAttribute('aria-labelledby','modalTitle');}else $('#modal').setAttribute('aria-label','Activité');
  if($('#objectLabels'))$('#objectLabels').hidden=true;
  hideTip(); setHover(null);
  const first = $('#modal').querySelector('input,button.btn,button.choice'); if (first && !IS_TOUCH) first.focus({ preventScroll: true });
}
function closeModal() { if ($('#modalWrap').hidden) return;stopAudio(); $('#modalWrap').hidden = true; $('#modalBody').innerHTML = ''; const f = onModalClose; onModalClose = null; f && f();if(modalReturnFocus&&document.contains(modalReturnFocus))modalReturnFocus.focus({preventScroll:true});modalReturnFocus=null; }
$('#modal').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const targets=[...$('#modal').querySelectorAll('button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!targets.length)return;const first=targets[0],last=targets[targets.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
$('#modalX').onclick = closeModal;
$('#modalWrap').addEventListener('pointerdown', e => { if (e.target.id === 'modalWrap') closeModal(); });

/* ---------- minibar (nombres) ---------- */
function openMinibar() {
  closeCard();
  STATE_REF.mbOpen = true; DYN.mbGlow.emissiveIntensity = 1.2;
  tween(DYN.mbHinge.rotation.y, 1.75, 0.6, v => DYN.mbHinge.rotation.y = v);
  setTimeout(() => {
    const best = ST.mb ? ` · meilleur score : ${ST.mb.best}/5` : '';
    openModal(`
      <h2>Le minibar</h2>
      <p class="lead">Cliquez sur une boisson ou un snack : écoutez le prix. Puis faites le quiz des prix.${best}</p>
      <div class="mb-grid">${DATA.minibar.map(m => `<button class="mb-item" data-id="${m.id}"><b>${artHTML(m.w, m.g)}</b><span class="mb-price">${m.p} €</span></button>`).join('')}</div>
      <div id="mbQuiz"><button class="btn btn-main" id="mbStart"><svg class="ic"><use href="#i-play"/></svg>Quiz des prix</button></div>`,
      () => { DYN.mbGlow.emissiveIntensity = 0; tween(DYN.mbHinge.rotation.y, 0, 0.6, v => DYN.mbHinge.rotation.y = v); });
    $('#modalBody').querySelectorAll('.mb-item').forEach(b => b.onclick = () => say('w_' + b.dataset.id, 'e_' + b.dataset.id));
    $('#mbStart').onclick = () => mbQuiz(0, shuffle(DATA.minibar).slice(0, 5), 0);
  }, 450);
}
function mbQuiz(i, items, score) {
  const box = $('#mbQuiz'); if (!box) return;
  if (i >= items.length) {
    ST.mb = { best: Math.max(score, ST.mb ? ST.mb.best : 0), last: score }; save(); renderFiche();
    box.innerHTML = `<div class="q-card"><p class="q-text">Résultat : <span class="score">${score} / 5</span></p><div class="q-next"><button class="btn" id="mbAgain">Recommencer</button></div></div>`;
    $('#mbAgain').onclick = () => mbQuiz(0, shuffle(DATA.minibar).slice(0, 5), 0);
    if (score === 5) fx.ok();
    return;
  }
  const it = items[i];
  const others = shuffle(DATA.minibar.filter(m => m.p !== it.p)).slice(0, 2).map(m => m.p);
  const opts = shuffle([it.p, ...others]);
  box.innerHTML = `<div class="q-card"><div class="q-top"><span class="q-n">Question ${i + 1} / ${items.length}</span><button class="btn btn-ghost" id="mbPlay"><svg class="ic"><use href="#i-sound"/></svg>Écouter</button></div>
    <p class="q-text">Combien coûte ${artHTML(it.w, it.g)} ?</p>
    <div class="prices">${opts.map(p => `<button class="choice" data-p="${p}">${p} €</button>`).join('')}</div>
    <div class="q-next" id="mbNext" hidden><button class="btn btn-main">Suivant</button></div></div>`;
  $('#mbPlay').onclick = () => say('e_' + it.id);
  say('e_' + it.id);
  let answered = false;
  box.querySelectorAll('.prices .choice').forEach(b => b.onclick = () => {
    if (answered) return; answered = true;
    const ok = +b.dataset.p === it.p;
    b.classList.add(ok ? 'ok' : 'bad'); (ok ? fx.ok : fx.no)();
    if (!ok) box.querySelector(`.choice[data-p="${it.p}"]`).classList.add('ok');
    const n = $('#mbNext'); n.hidden = false; n.querySelector('button').onclick = () => mbQuiz(i + 1, items, score + (ok ? 1 : 0));
  });
}

/* ---------- quiz « Est-ce qu'il y a… ? » ---------- */
function openQuiz() { openModal(`<h2>Est-ce qu'il y a… ?</h2><p class="lead">Écoutez la question. Regardez dans la suite si vous voulez. Choisissez la bonne réponse. Puis dites la phrase à voix haute.</p><div id="qz"></div>`); quizStep(0, 0); }
function quizStep(i, score) {
  const box = $('#qz'); if (!box) return;
  if (i >= DATA.quiz.length) {
    ST.quiz = { score, done: true }; save(); renderFiche();
    box.innerHTML = `<div class="q-card"><p class="q-text">Résultat : <span class="score">${score} / ${DATA.quiz.length}</span></p><p>Rappel : <b>il y a un / une / des</b> → <b>il n'y a pas de</b> (ou <b>d'</b> devant une voyelle).</p><div class="q-next"><button class="btn" id="qAgain">Recommencer</button></div></div>`;
    $('#qAgain').onclick = () => quizStep(0, 0); return;
  }
  const q = DATA.quiz[i];
  box.innerHTML = `<div class="q-card"><div class="q-top"><span class="q-n">Question ${i + 1} / ${DATA.quiz.length}</span><button class="btn btn-ghost" id="qPlay"><svg class="ic"><use href="#i-sound"/></svg>Écouter</button></div>
    <p class="q-text">${esc(q.q)}</p>
    <div class="q-opts"><button class="choice" data-r="oui">${esc(q.oui)}</button><button class="choice" data-r="non">${esc(q.non)}</button></div>
    <div class="q-next" id="qNext" hidden><button class="btn btn-main">Suivant</button></div></div>`;
  $('#qPlay').onclick = () => say('q_' + i);
  say('q_' + i);
  let done = false;
  box.querySelectorAll('.q-opts .choice').forEach(b => b.onclick = () => {
    if (done) return; done = true;
    const ok = b.dataset.r === q.r;
    b.classList.add(ok ? 'ok' : 'bad'); (ok ? fx.ok : fx.no)();
    if (!ok) box.querySelector(`.choice[data-r="${q.r}"]`).classList.add('ok');
    say((q.r === 'oui' ? 'qo_' : 'qn_') + i);
    const n = $('#qNext'); n.hidden = false; n.querySelector('button').onclick = () => quizStep(i + 1, score + (ok ? 1 : 0));
  });
}

/* ---------- bilan « j'ai / je n'ai pas de » ---------- */
function openBilan() {
  const bag = DATA.objets.map(o => `<span class="${ST.found[o.id] ? '' : 'no'}">${esc(o.w)}</span>`).join('');
  openModal(`<h2>Mon sac</h2><p class="lead">Regardez vos objets. Répondez avec <b>j'ai</b> ou <b>je n'ai pas de</b>.</p><div class="bag">${bag}</div><div id="bz"></div>`);
  bilanStep(0, 0, shuffle(DATA.objets));
}
function bilanStep(i, score, list) {
  const box = $('#bz'); if (!box) return;
  if (i >= list.length) {
    ST.bilan = { score, done: true }; save(); renderFiche();
    box.innerHTML = `<div class="q-card"><p class="q-text">Résultat : <span class="score">${score} / ${list.length}</span></p><p>Rappel : <b>j'ai un / une / des</b> → <b>je n'ai pas de</b>.</p><div class="q-next"><button class="btn" id="bAgain">Recommencer</button></div></div>`;
    $('#bAgain').onclick = () => bilanStep(0, 0, shuffle(DATA.objets)); return;
  }
  const o = list[i], has = !!ST.found[o.id];
  const yes = "Oui, j'ai " + o.w + '.', no = "Non, je n'ai pas " + o.neg + '.';
  box.innerHTML = `<div class="q-card"><div class="q-top"><span class="q-n">Question ${i + 1} / ${list.length}</span><button class="btn btn-ghost" id="bPlay"><svg class="ic"><use href="#i-sound"/></svg>Écouter</button></div>
    <p class="q-text">Est-ce que vous avez ${esc(o.w)} ?</p>
    <div class="q-opts">${shuffle([['y', yes], ['n', no]]).map(([k, t]) => `<button class="choice" data-k="${k}">${esc(t)}</button>`).join('')}</div>
    <div class="q-next" id="bNext" hidden><button class="btn btn-main">Suivant</button></div></div>`;
  $('#bPlay').onclick = () => say('oq_' + o.id);
  say('oq_' + o.id);
  let done = false;
  box.querySelectorAll('.q-opts .choice').forEach(b => b.onclick = () => {
    if (done) return; done = true;
    const ok = (b.dataset.k === 'y') === has;
    b.classList.add(ok ? 'ok' : 'bad'); (ok ? fx.ok : fx.no)();
    if (!ok) box.querySelector(`.choice[data-k="${has ? 'y' : 'n'}"]`).classList.add('ok');
    say((has ? 'o_' : 'on_') + o.id);
    const n = $('#bNext'); n.hidden = false; n.querySelector('button').onclick = () => bilanStep(i + 1, score + (ok ? 1 : 0), list);
  });
}

/* ---------- export du bilan ---------- */
function summaryText() {
  const f = ST.form || {};
  const words = Object.keys(ST.seen).filter(k => VOCAB_IDS.includes(k)).length;
  const objs = DATA.objets.filter(o => o.cache && ST.found[o.id]).map(o => o.w);
  return [
    'Atelier « Suite 14 » · Palace Hôtel · français A1',
    'Apprenant·e : ' + (((f.prenom || '') + ' ' + (f.nom || '')).trim() || '—'),
    'Date : ' + new Date().toLocaleDateString('fr-FR'),
    '',
    '1. Réception : ' + (ST.key ? 'clé obtenue (dialogue terminé)' : `en cours (étape ${Math.min(ST.dlg + 1, DATA.dialogue.length)} / ${DATA.dialogue.length})`),
    '   Formulaire : ' + (ST.form ? `${f.type || ''}, ${f.pers || '?'} personne(s), du ${f.arrivee || '?'} au ${f.depart || '?'}` : 'non rempli'),
    '   Demandes particulières : ' + (f.dem ? f.dem : '—'),
    `2. Mots découverts : ${words} / ${VOCAB_IDS.length}`,
    `3. Objets trouvés : ${objs.length} / 7` + (objs.length ? ' (' + objs.join(', ') + ')' : ''),
    '4. Quiz du minibar : ' + (ST.mb ? `${ST.mb.last} / 5 (meilleur : ${ST.mb.best} / 5)` : 'pas fait'),
    "5. Quiz « Est-ce qu'il y a… ? » : " + (ST.quiz ? `${ST.quiz.score} / ${DATA.quiz.length}` : 'pas fait'),
    "6. Bilan « j'ai / je n'ai pas de » : " + (ST.bilan ? `${ST.bilan.score} / ${DATA.objets.length}` : 'pas fait'),
  ].join('\n');
}
function openExport() {
  openModal(`<h2>Mon bilan</h2><p class="lead">Copiez ce texte et envoyez-le à votre formateur.</p>
    <textarea class="export" id="exp" readonly>${esc(summaryText())}</textarea>
    <div class="form-row"><span class="form-msg" id="expMsg" style="color:var(--ok)"></span><button class="btn btn-main" id="expCopy">Copier</button></div>`);
  $('#expCopy').onclick = () => {
    const t = $('#exp'); const done = () => { $('#expMsg').textContent = 'Copié !'; };
    try { navigator.clipboard.writeText(t.value).then(done, () => { t.select(); $('#expMsg').textContent = 'Texte sélectionné : faites Ctrl+C.'; }); }
    catch (e) { t.select(); $('#expMsg').textContent = 'Texte sélectionné : faites Ctrl+C.'; }
  };
}

/* ---------- fiche repliable ---------- */
let fichePane = 'missions';
const fiche = $('#fiche'), ficheTab = $('#ficheTab');
function setFiche(open) {
  fiche.hidden = !open; ficheTab.hidden = open; ST.fiche = open; save();
  $('#btnFiche').title = open ? 'Réduire la fiche' : 'Afficher la fiche';
}
$('#ficheFold').onclick = () => setFiche(false);
ficheTab.onclick = () => setFiche(true);
$('#btnFiche').onclick = () => setFiche(fiche.hidden);
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
  fichePane = b.dataset.tab;
  document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  renderFiche();
});
function mission(n, title, state, txt, extra, btns) {
  const lab = { done: 'Fait', going: 'En cours', todo: 'À faire' }[state];
  return `<div class="mission ${state}"><span class="m-num">${state === 'done' ? '<svg class="ic"><use href="#i-check"/></svg>' : n}</span><div>
    <div class="m-title">${title}<span class="m-state">${lab}</span></div><p class="m-txt">${txt}</p>${extra || ''}<div class="m-btns">${btns}</div></div></div>`;
}
function renderFiche() {
  if (!uiReady) return;
  const body = $('#tabBody');
  const words = Object.keys(ST.seen).filter(k => VOCAB_IDS.includes(k)).length;
  const objs = DATA.objets.filter(o => o.cache && ST.found[o.id]).length;
  if (fichePane === 'missions') {
    body.innerHTML =
      mission(1, 'À la réception', ST.key ? 'done' : ST.dlg > 0 ? 'going' : 'todo', 'Parlez avec Louise, la réceptionniste. Remplissez le formulaire. Prenez la clé.', '', `<button class="btn" data-go="reception">Aller à la réception</button>`) +
      mission(2, 'Découvrir la suite', words >= VOCAB_IDS.length ? 'done' : words > 0 ? 'going' : 'todo', 'Cliquez sur les objets. Écoutez le mot et la phrase.', `<div class="bar"><i style="width:${words / VOCAB_IDS.length * 100}%"></i></div><small>${words} / ${VOCAB_IDS.length} mots</small>`, `<button class="btn" data-go="chambre">Aller dans la chambre</button>`) +
      mission(3, 'La chasse aux objets', objs === 7 ? 'done' : objs ? 'going' : 'todo', "Trouvez 7 objets personnels dans la suite : un portefeuille, des lunettes… Dites : « J'ai des lunettes ! »", `<div class="bar"><i style="width:${objs / 7 * 100}%"></i></div><small>${objs} / 7 objets</small>`, '') +
      mission(4, 'Le minibar', ST.mb ? 'done' : 'todo', 'Écoutez les prix des boissons et des snacks. Faites le quiz des nombres.', ST.mb ? `<small>Meilleur score : ${ST.mb.best} / 5</small>` : '', `<button class="btn" data-run="minibar">Ouvrir le minibar</button>`) +
      mission(5, "Est-ce qu'il y a… ?", ST.quiz ? 'done' : 'todo', "Répondez : « Oui, il y a… » ou « Non, il n'y a pas de… ».", ST.quiz ? `<small>Score : ${ST.quiz.score} / ${DATA.quiz.length}</small>` : '', `<button class="btn" data-run="quiz">Commencer</button>`) +
      mission(6, "Bilan : j'ai / je n'ai pas de", ST.bilan ? 'done' : 'todo', 'Regardez votre sac. Répondez aux questions de la réceptionniste.', ST.bilan ? `<small>Score : ${ST.bilan.score} / ${DATA.objets.length}</small>` : '', `<button class="btn" data-run="bilan">Commencer</button>`) +
      `<div class="m-btns" style="margin-top:12px"><button class="btn btn-main" data-run="export">Mon bilan à envoyer</button></div>`;
  } else if (fichePane === 'grammaire') {
    body.innerHTML = `
      <h3>Le verbe avoir</h3>
      <div class="gram"><table>
        <tr><td>j'<span class="hl">ai</span></td><td>nous <span class="hl">avons</span></td></tr>
        <tr><td>tu <span class="hl">as</span></td><td>vous <span class="hl">avez</span></td></tr>
        <tr><td>il / elle / on <span class="hl">a</span></td><td>ils / elles <span class="hl">ont</span></td></tr></table></div>
      <h3>J'ai / je n'ai pas de</h3>
      <div class="gram"><p>J'ai <b>un</b> portefeuille. → Je n'ai <span class="neg">pas de</span> portefeuille.</p>
        <p>J'ai <b>une</b> valise. → Je n'ai <span class="neg">pas de</span> valise.</p>
        <p>J'ai <b>des</b> lunettes. → Je n'ai <span class="neg">pas de</span> lunettes.</p></div>
      <h3>Il y a / il n'y a pas de</h3>
      <div class="gram"><p>Il y a <b>un</b> minibar. Il y a <b>une</b> baignoire. Il y a <b>des</b> serviettes.</p>
        <p>Il n'y a <span class="neg">pas de</span> salle de sport.</p>
        <p>Il n'y a <span class="neg">pas d'</span>ordinateur. <small>(voyelle → d')</small></p></div>
      <h3>La question avec est-ce que</h3>
      <div class="gram"><p><b>Est-ce que</b> le petit déjeuner est compris ?</p><p><b>Est-ce qu'</b>il y a un parking ? <small>(que + il → qu'il)</small></p><p>Écoutez la mélodie du modèle, puis posez votre propre question.</p></div>
      <h3>Les articles</h3>
      <div class="gram"><div class="legend"><span><i class="dot bg-m"></i><b class="g-m">le</b> · un · masculin</span><span><i class="dot bg-f"></i><b class="g-f">la</b> · une · féminin</span><span><i class="dot bg-pl"></i><b class="g-pl">les</b> · des · pluriel</span></div>
        <p style="margin-top:8px"><b>l'</b> devant une voyelle ou un h : l'ascenseur, l'eau, l'hôtel.</p></div>`;
  } else if (fichePane === 'lexique') {
    const zones = ['reception', 'couloir', 'chambre', 'sdb', 'balcon'];
    body.innerHTML = zones.map(z => {
      const items = DATA.vocab.filter(v => v.z === z);
      const n = items.filter(v => ST.seen[v.id]).length;
      return `<div class="lex-zone"><h3>${esc(ZONE_NAME[z])}<small>${n} / ${items.length}</small></h3><div class="lex">${items.map(v=>`<button data-view="${v.id}" aria-label="Voir de près : ${esc(v.w)}">${artHTML(v.w,v.g)}${ST.seen[v.id]?' ✓':''}</button>`).join('')}</div></div>`;
    }).join('')+`<p class="lead">Touchez un mot pour voir l’objet de près et l’écouter. Choisissez cinq mots, puis dites une phrase avec chaque mot.</p><div class="lex-zone"><h3>${esc(ZONE_NAME.minibar)}</h3><div class="lex">${DATA.minibar.map(v=>`<button data-say="${v.id}">${artHTML(v.w,v.g)} · ${v.p} €</button>`).join('')}</div></div>`;
  } else if (fichePane === 'aide') {
    body.innerHTML = `
      <h3>Se déplacer</h3>
      <div class="keys">
        <span><kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd></span><span>marcher (ou <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>)</span>
        <span><kbd>↑</kbd><kbd>↓</kbd></span><span>avancer, reculer</span>
        <span><kbd>←</kbd><kbd>→</kbd></span><span>tourner</span>
        <span><kbd>Maj</kbd></span><span>marcher vite</span>
        <span>Glisser</span><span>regarder autour</span>
        <span>Clic sur le sol</span><span>aller à cet endroit</span>
        <span>Clic sur un objet</span><span>voir et écouter le mot</span>
      </div>
      <p style="margin-top:8px">Sur téléphone : le joystick en bas à gauche pour marcher, un doigt sur l'écran pour regarder.</p>
      <h3>Les voix</h3>
      <p>Voix féminine pour la réception et les mots ; voix masculine pour le client et les nombres.</p>
      <label class="voice-pick"><span><input type="checkbox" id="optSlow" ${ST.slow?'checked':''}> Un peu plus lent (0,9×)</span></label>
      <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="optAuto" ${ST.auto ? 'checked' : ''}> Lire le mot et la phrase automatiquement</label>
      <h3>Progression</h3>
      <p>Votre progression reste dans ce navigateur. Un mot découvert au clic n’est pas encore un mot maîtrisé à l’oral.</p>
      <button class="btn" id="resetBtn">Recommencer à zéro</button>`;
    $('#optSlow').onchange=e=>{stopAudio();ST.slow=e.target.checked;save();};
    $('#optAuto').onchange = e => { ST.auto = e.target.checked; save(); };
    const rb = $('#resetBtn'); let armed = false;
    rb.onclick = () => { if (!armed) { armed = true; rb.textContent = 'Confirmer : tout effacer'; rb.classList.add('btn-main'); return; } resetAll(); };
  } else if (fichePane === 'formateur') {
    body.innerHTML = `
      <h3>Objectifs (A1)</h3>
      <ul><li>Se présenter à la réception, donner ses coordonnées.</li><li>Nommer les pièces, le mobilier et les services d'un hôtel, avec l'article.</li><li>Dire ce qu'il y a / ce qu'il n'y a pas : <i>il y a / il n'y a pas de</i>.</li><li>Dire ce qu'on a / ce qu'on n'a pas : <i>j'ai / je n'ai pas de</i>.</li><li>Poser une question avec <i>est-ce que</i>. Comprendre des prix (nombres 0 à 99).</li></ul>
      <h3>Lien avec le manuel</h3>
      <p>Cette suite est une situation fictive enrichie ; ses équipements ne décrivent pas tous le document d’origine. Unité 2 « Bon séjour ! » : act. 2 (prestations de l’hôtel du manuel), act. 3 (arrivée à la réception, chambre 14), act. 6 (objets personnels, j'ai / je n'ai pas de), act. 7 (formulaire de réservation). Le minibar et le loto reprennent les nombres.</p>
      <h3>Choisir une petite séance</h3><p>La banque de 93 mots ne s’apprend pas en une fois. Choisissez cinq objets dans une pièce ; nommez-les, écoutez et dites une phrase. Reprenez cinq autres mots lors de la séance suivante.</p><h3>Parcours complet (à répartir sur plusieurs jours)</h3>
      <ul><li>Missions 1 à 3 : réception, découverte libre, chasse aux objets (25 min).</li><li>Missions 4 à 6 : minibar, quiz <i>il y a</i>, bilan <i>j'ai</i> (15 min).</li><li>L'apprenant copie « Mon bilan » et vous l'envoie.</li></ul>
      <h3>Prolongement en séance</h3>
      <ul><li>Oral : décrire la suite (« Dans la chambre, il y a… »). Comparer avec l’hôtel du manuel.</li><li>Jeu de rôle réception à deux, sans le support.</li><li>Écrit : un avis client de 3 phrases, comme celui de Louane.</li></ul>
      <h3>Corrigés</h3>
      <p><b>Dialogue :</b> ${DATA.dialogue.filter(s => s.choix).map(s => esc(s.choix.find(c => c.ok).t)).join(' / ')}</p>
      <p><b>Il y a :</b> ${DATA.quiz.map((q, i) => `${i + 1}. ${q.r}`).join(' · ')}</p>
      <p><b>Minibar :</b> ${DATA.minibar.map(m => `${esc(m.w)} ${m.p} €`).join(' · ')}</p>
      <p><b>Objets cachés :</b> ${DATA.objets.filter(o => o.cache).map(o => esc(o.w)).join(', ')}. Absents : ${DATA.objets.filter(o => !o.cache).map(o => esc(o.w)).join(', ')}.</p>
      <h3>Note sur les voix</h3><p><a href="guide-audio.html" target="_blank" rel="noopener">Écouter les deux voix et quelques modèles</a></p>
      <p>Tous les modèles parlés sont générés directement avec Qwen3-TTS à partir de « voix de référence A1 femme.mp4 » et « voix de référence homme A1.mp4 ». Aucune voix du navigateur ne les remplace. La liste des textes et les empreintes des références figurent dans audio/provenance.json. Le ralentissement facultatif à 0,9× préserve la hauteur de la voix.</p>`;
  }
  body.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const id=b.dataset.view;inspectObject(INTER.find(r=>r.userData.vid===id),VOC[id]);});
  body.querySelectorAll('[data-go]').forEach(b => b.onclick = () => teleport(b.dataset.go));
  body.querySelectorAll('[data-say]').forEach(b => b.onclick = () => say('w_' + b.dataset.say, 'e_' + b.dataset.say));
  body.querySelectorAll('[data-run]').forEach(b => b.onclick = () => {
    const r = b.dataset.run;
    if (r === 'minibar') { teleport('salon'); setTimeout(openMinibar, 600); }
    if (r === 'quiz') openQuiz();
    if (r === 'bilan') openBilan();
    if (r === 'export') openExport();
  });
}
function resetAll() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
  location.reload();
}

/* ---------- chips, toast, dock ---------- */
function updateChips(bw, bo, bk) {
  const words = Object.keys(ST.seen).filter(k => VOCAB_IDS.includes(k)).length;
  $('#cWords').textContent = words; $('#cWordsT').textContent = VOCAB_IDS.length;
  $('#cObj').textContent = DATA.objets.filter(o => o.cache && ST.found[o.id]).length;
  const k = $('#chipKey'); k.classList.toggle('has', ST.key); $('#cKey').textContent = ST.key ? 'chambre 14' : 'pas de clé';
  const bump = el => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
  if (bw) bump($('#chipWords')); if (bo) bump($('#chipObj')); if (bk) bump(k);
}
$('#chipWords').onclick = () => { setFiche(true); document.querySelector('.tabs [data-tab=lexique]').click(); };
$('#chipObj').onclick = () => openBilan();
$('#chipKey').onclick = () => { if (ST.key) { showCard('cle'); say('w_cle', 'e_cle'); } };
$('#btnSound').onclick = () => {
  ST.mute = !ST.mute; save();
  $('#btnSound').innerHTML = `<svg class="ic"><use href="#i-${ST.mute ? 'mute' : 'sound'}"/></svg>`;
  $('#btnSound').setAttribute('aria-pressed', ST.mute);
  if (ST.mute) stopAudio();
  Object.values(LOOPS).forEach(l => l.g.gain.value = ST.mute ? 0 : 0.05);
};
let toastT = null;
function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 3800); }
document.querySelectorAll('#dock button').forEach(b => b.onclick = () => teleport(b.dataset.go));
$('#enterRoom').onclick=()=>{if(!STATE_REF.doorOpen)return;closeCard();setFiche(false);P.route=[{x:3.1,z:3.95,guided:true},{x:3.1,z:3.2,guided:true},{x:3.1,z:2.75,guided:true}];P.target={x:3.1,z:P.z,guided:true};marker.visible=false;};
let lastZone = null;
let updateExterior=()=>{};
function updateZone() {
  const z = zoneAt(P.x, P.z);
  updateExterior(z);
  if (z && z !== lastZone) {
    lastZone = z; $('#place').textContent = ZONE_NAME[z];
    document.querySelectorAll('#dock button').forEach(b => b.classList.toggle('here', b.dataset.go === z));
  }
}

/* ---------- boucle ---------- */
const clock = new THREE.Clock();
const camDir = new V3();
let lastRender=0;
let updateDiscovery=()=>{};
function loop() {
  const now=performance.now();if(now-lastRender<(LOW?50:33)){requestAnimationFrame(loop);return;}lastRender=now;
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  if(document.hidden){requestAnimationFrame(loop);return;}
  stepTweens(dt);
  if(document.querySelector('#objectView')){requestAnimationFrame(loop);return;}
  if (started) updateMove(dt);
  camera.position.set(P.x, P.eye + Math.sin(P.bob) * 0.018, P.z);
  camera.rotation.set(P.pitch, P.yaw, 0);
  // ombre du soleil centrée sur le joueur
  const sx = Math.round(P.x * 2) / 2, sz = Math.round(P.z * 2) / 2;
  sun.target.position.set(sx, 0, sz); sun.position.set(sx + SUN_DIR.x * 70, SUN_DIR.y * 70, sz + SUN_DIR.z * 70);
  sky.position.copy(camera.position);
  skyMat.uniforms.uTime.value = t;
  MAT.water.normalMap.offset.set(t * 0.012, t * 0.008);
  MAT.pool.map.offset.set(Math.sin(t * 0.3) * 0.05, t * 0.01);
  MAT.sea.normalMap.offset.set(t * 0.004, t * 0.006);
  MAT.lagoon.normalMap.offset.set(-t * 0.003, t * 0.005);
  if (DYN.recep) {
    const r = DYN.recep, h = r.userData.head;
    const a = Math.atan2(P.x - r.position.x, -(P.z - r.position.z));
    if(r.userData.photographic)r.rotation.y=PI-clamp(a,-.65,.65);
    else if(h){r.position.y = Math.sin(t * 1.4) * 0.004;h.rotation.y += (clamp(-a, -0.7, 0.7) - h.rotation.y) * 0.05;}
  }
  if (DYN.shower.on) { const p = DYN.shower.drops.geometry.attributes.position; for (let i = 0; i < p.count; i += 2) { let y = p.getY(i) - dt * 5; if (y < 0.12) y = 2.5; p.setY(i, y); p.setY(i + 1, y - 0.12); } p.needsUpdate = true; }
  stepTV(dt); stepAC(dt);
  updateZone();
  $('#doorInvitation').hidden=!(started&&STATE_REF.doorOpen&&P.z>3.62&&P.z<5.5);
  updateDiscovery(now);
  if (marker.visible) marker.material.opacity = 0.55 + Math.sin(t * 6) * 0.3;
  composer.render();
  requestAnimationFrame(loop);
}
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false);
  composer.setSize(innerWidth,innerHeight);
});

/* ---------- démarrage ---------- */
async function init() {
  const btn = $('#btnStart');
  if (IS_TOUCH) { document.querySelectorAll('.how[data-dev=desktop]').forEach(e => e.hidden = true); document.querySelectorAll('.how .verb').forEach(e => e.textContent = 'Toucher'); }
  else document.querySelectorAll('.how[data-dev=touch]').forEach(e => e.hidden = true);
  load();
  if(ST.seen.placard)ST.seen.armoire=1;
  ST.voice='reference-a1';loadPack();
  try { await Promise.race([Promise.all([document.fonts.load('40px Marcellus'), document.fonts.load('20px "Atkinson Hyperlegible"')]), wait(2500)]); } catch (e) { }
  await wait(30);
  buildTextures();REAL.prepareTextures();buildMaterials();
  btn.textContent='Préparer les matières…';
  await photographicMaterials(MAT,renderer);
  const preparedPhoto=await preparePhotoreal(MAT,renderer,scene,pmrem,LOW);
  const atelierMaterials=await prepareAtelier(MAT,renderer,LOW);
  const furniture20=await prepareFurniture20();
  const receptionist=await prepareReceptionist(renderer);
  const assetResult=await loadPalaceAssets((n,total)=>btn.textContent=`Préparer le mobilier… ${n}/${total}`);
  if(assetResult.failures.length)throw new Error('Le mobilier ne se charge pas : '+assetResult.failures.join(', '));
  buildLobby(); buildCorridor(); buildSuite();
  buildHunt();REAL.details(INTER,STATIC);buildACParticles();drawTV();drawAC();
  installPalace({INTER,STATIC,MAT,B,C,L,G,REAL,reg,DYN,LOW});
  installPhotoreal({INTER,STATIC,MAT,B,C,L,G,REAL,reg,DYN,LOW},preparedPhoto);
  installAtelier({INTER,STATIC,MAT,B,C,L,S,G,REAL,reg,DYN,LIGHTS,LOW},atelierMaterials);
  installReceptionist(DYN.recep,receptionist);
  indexLightingMeshes(STATIC);
  updateExterior=exteriorLearning({STATIC,INTER,MAT,G,B,C,REAL,reg,openModal,closeModal,inspectObject,VOC,say,stopAudio});
  hemi.intensity=.20;
  STATIC.traverse(o=>{if(o.isRectAreaLight)o.intensity=1.8;if(o.isPointLight&&o.intensity>0)o.intensity*=.12;});
  finishTextiles(INTER,MAT);
  await applyBakedLighting(STATIC,LOW);
  installMirror(DYN,MAT,LOW);
  finishAtelier({INTER,MAT,LOW},atelierMaterials);
  installFurniture20({INTER,MAT,B,C,L,G,REAL,reg,DYN,ST},furniture20);
  updateDiscovery=createDiscovery({scene:STATIC,camera,roots:INTER,vocab:VOC,select,visible:visibleChain,blocked:()=>!started||!$('#modalWrap').hidden||!$('#dlg').hidden});
  if (ST.key || ST.dlg >= DATA.dialogue.length) DYN.keyCard.visible = !ST.key;
  uiReady = true;
  updateChips(); renderFiche();
  if (ST.mute) { ST.mute = false; $('#btnSound').click(); }
  setFiche(ST.fiche != null ? ST.fiche : innerWidth > 900);
  try { renderer.compile(scene, camera); } catch (e) { }
  requestAnimationFrame(loop);
  btn.disabled = false;
  btn.textContent = hadSave ? 'Continuer la visite' : "Entrer dans l'hôtel";
  if (hadSave) $('#btnReset').hidden = false;
  window.__suite = { P, ST, teleport, doAct, select, INTER, scene, camera, renderer, pickAt, freeAt, STATE_REF, PLAYER, say };
}
$('#btnStart').onclick = () => {
  actx(); unlockAudio(); started = true;
  $('#intro').hidden = true;
  if (!ST.key) { setTimeout(() => say('ui_bienvenue'), 400); setTimeout(() => toast('Cliquez sur la réceptionniste pour commencer.'), 600); }
};
$('#btnReset').onclick = resetAll;
const inspectObject=createInspector(THREE,{openModal,closeModal,say,stopAudio,markSeen,env:ROOM_ENV,teleport,setFiche,wardrobeButtons,bindWardrobeButtons,wardrobeLearning,getExamples:id=>INTER.filter(r=>r.userData.vid===id)});
const REAL=realism(THREE,{B,C,L,S,G,mesh,MAT,TEX,LOW});
init().catch(e => { console.error(e); const el = $('#introErr'); el.hidden = false; el.textContent = 'Erreur au chargement de la 3D : ' + e.message; });


window.addEventListener('pagehide',stopAudio);
