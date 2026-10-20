// Interactive GLB viewer: orbit/zoom/pan, gentle auto-rotate until the user
// interacts, reset view, load progress, and click-a-part to highlight + label.
import {
  WebGLRenderer, Scene, PerspectiveCamera, PMREMGenerator, DirectionalLight,
  HemisphereLight, Box3, Vector3, Vector2, Raycaster, Color, ACESFilmicToneMapping,
  SRGBColorSpace, EdgesGeometry, LineSegments, LineBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let draco;
function dracoLoader(path) {
  if (!draco) {
    draco = new DRACOLoader();
    draco.setDecoderPath(path || `${import.meta.env.BASE_URL}draco/`);
  }
  return draco;
}

/**
 * @param {HTMLElement} canvasHost element the canvas is appended to
 * @param {object} opts
 * @param {string} opts.src GLB url
 * @param {string} [opts.decoderPath] folder holding the Draco decoder
 * @param {Array<{match: RegExp, label: string, detail?: string}>} [opts.parts]
 * @param {(p: number) => void} [opts.onProgress] 0..1
 * @param {(part: {label: string, detail?: string} | null) => void} [opts.onSelect]
 * @param {number[]} [opts.view] camera direction from the model centre, e.g. [1, 0.5, 1]
 * @param {string} [opts.highlight] css colour for the selected part
 * @param {boolean} [opts.materialize] start as white linework and fade the solid model in
 */
export async function createViewer(canvasHost, opts) {
  const { src, decoderPath, parts = [], onProgress = () => {}, onSelect = () => {}, view = [1, 0.55, 1.1] } = opts;
  const highlight = new Color(opts.highlight || '#ff6a3d');

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.outputColorSpace = SRGBColorSpace;
  canvasHost.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new DirectionalLight(0xffffff, 2.2);
  const fill = new HemisphereLight(0xffffff, 0x30343a, 0.6);
  scene.add(key, fill);

  const camera = new PerspectiveCamera(32, 1, 0.001, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduceMotion();
  controls.autoRotateSpeed = 0.9;
  controls.enablePan = true;
  controls.screenSpacePanning = true;

  const loader = new GLTFLoader().setDRACOLoader(dracoLoader(decoderPath));
  const gltf = await loader.loadAsync(src, (e) => {
    if (e.total) onProgress(e.loaded / e.total);
  });
  onProgress(1);
  const model = gltf.scene;
  scene.add(model);

  // Each mesh gets its own material copy so highlighting one part never tints another.
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = o.material.clone();
      o.userData.baseEmissive = o.material.emissive ? o.material.emissive.clone() : null;
    }
  });

  // Blueprint linework: every mesh gets its crease edges as white lines. With
  // materialize on, the solid surfaces then fade in and the lines settle back.
  const edges = [];
  if (opts.materialize) {
    const lineMat = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false });
    model.traverse((o) => {
      if (!o.isMesh) return;
      const l = new LineSegments(new EdgesGeometry(o.geometry, 30), lineMat);
      l.raycast = () => {}; // lines never steal clicks from the part
      o.add(l);
      o.userData.base = { transparent: o.material.transparent, opacity: o.material.opacity };
      o.material.transparent = true;
      o.material.opacity = 0;
    });
    edges.push(lineMat);
  }
  let fadeStart = null;
  const FADE_DELAY = 350, FADE = 1600, LINES_REST = 0.14;
  const materialize = (now) => {
    if (!edges.length) return;
    if (fadeStart === null) fadeStart = now;
    const t = reduceMotion() ? 1 : Math.min(1, Math.max(0, (now - fadeStart - FADE_DELAY) / FADE));
    const k = t * t * (3 - 2 * t);
    model.traverse((o) => {
      if (!o.isMesh || !o.userData.base) return;
      o.material.opacity = o.userData.base.opacity * k;
      if (t === 1) o.material.transparent = o.userData.base.transparent;
    });
    edges[0].opacity = 0.9 + (LINES_REST - 0.9) * k;
    if (t === 1) edges.length = 0; // done; leave the faint construction lines
  };

  // Frame the model.
  const box = new Box3().setFromObject(model);
  const size = box.getSize(new Vector3());
  const centre = box.getCenter(new Vector3());
  const radius = size.length() / 2;
  const dir = new Vector3(...view).normalize();
  const home = { pos: new Vector3(), target: centre.clone() };
  // Distance that fits the bounding sphere in the narrower of the two fields of view.
  const fitDistance = () => {
    const v = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(v / 2) * camera.aspect);
    return (radius / Math.sin(Math.min(v, hfov) / 2)) * 0.92;
  };
  let touched = false;
  const frame = () => {
    const dist = fitDistance();
    home.pos.copy(centre).addScaledVector(dir, dist);
    camera.near = dist / 100;
    camera.far = dist * 20;
    camera.updateProjectionMatrix();
    controls.maxDistance = dist * 3;
    if (!touched) { camera.position.copy(home.pos); controls.target.copy(home.target); }
  };
  controls.minDistance = radius * 0.6;
  key.position.copy(centre).add(new Vector3(radius * 2, radius * 4, radius * 3));
  key.target.position.copy(centre);
  scene.add(key.target);

  // Stop auto-rotate for good once the visitor takes over.
  controls.addEventListener('start', () => { controls.autoRotate = false; touched = true; });

  // Resize to host; re-frame until the visitor has moved the camera.
  const resize = () => {
    const w = canvasHost.clientWidth, h = canvasHost.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    frame();
    controls.update();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvasHost);
  resize();

  // Part picking.
  const ray = new Raycaster();
  const pointer = new Vector2();
  let selected = null;
  function partFor(obj) {
    for (let o = obj; o && o !== model; o = o.parent) {
      const def = parts.find((p) => p.match.test(o.userData.name || '') || p.match.test(o.name || ''));
      if (def) return { node: o, def };
    }
    return null;
  }
  function setTint(node, on) {
    node.traverse((o) => {
      if (!o.isMesh || !o.material.emissive) return;
      if (on) { o.material.emissive.copy(highlight); o.material.emissiveIntensity = 0.55; }
      else { o.material.emissive.copy(o.userData.baseEmissive || new Color(0)); o.material.emissiveIntensity = 1; }
    });
  }
  // Every node belonging to each part definition, so a selection lights all
  // instances (both master cylinders, every locknut).
  const groups = new Map();
  model.traverse((o) => {
    if (!o.isMesh) return;
    const p = partFor(o);
    if (!p) return;
    if (!groups.has(p.def)) groups.set(p.def, new Set());
    groups.get(p.def).add(p.node);
  });
  function select(def) {
    if (selected) groups.get(selected).forEach((n) => setTint(n, false));
    selected = def && def !== selected ? def : null;
    if (selected) groups.get(selected).forEach((n) => setTint(n, true));
    onSelect(selected);
  }
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return; // a drag, not a click
    const r = renderer.domElement.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObject(model, true);
    const hit = hits.length ? partFor(hits[0].object) : null;
    select(hit ? hit.def : null);
  });
  if (parts.length) renderer.domElement.style.cursor = 'pointer';

  // Render only while visible.
  let running = false;
  const loop = (now) => { materialize(now); controls.update(); renderer.render(scene, camera); };
  const io = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    renderer.setAnimationLoop(running ? loop : null);
  });
  io.observe(canvasHost);

  // Reset: ease the camera home.
  function reset() {
    const fromP = camera.position.clone(), fromT = controls.target.clone();
    if (reduceMotion()) { camera.position.copy(home.pos); controls.target.copy(home.target); return; }
    const t0 = performance.now(), dur = 600;
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur), k = ease(t);
      camera.position.lerpVectors(fromP, home.pos, k);
      controls.target.lerpVectors(fromT, home.target, k);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return {
    reset,
    select: (label) => {
      const def = label == null ? null : [...groups.keys()].find((d) => d.label === label);
      if (label == null || (def && def !== selected)) select(def || null);
    },
    dispose() { io.disconnect(); ro.disconnect(); renderer.setAnimationLoop(null); renderer.dispose(); pmrem.dispose(); },
    model,
    controls,
  };
}
