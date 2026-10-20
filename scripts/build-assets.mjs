// Prepares images and 3D models for the site. Runs before `vite` and `vite build`.
//   images/**  -> public/img/**  (AVIF + WebP at several widths) + src/generated/images.json
//   models/*.stl -> models/*.glb (converted once, kept next to the STL)
//   GLBs referenced in src/content.js -> public/models/ (Draco-compressed if over 3 MB)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as content from '../src/content.js';
const { projects } = content;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(root, 'images');
const OUT_IMG = path.join(root, 'public', 'img');
const OUT_MODELS = path.join(root, 'public', 'models');
const MANIFEST = path.join(root, 'src', 'generated', 'images.json');
const WIDTHS = [480, 960, 1600];

// Outputs are rebuilt when their source's content changes (not its timestamp, which a
// fresh git checkout resets). The record lives next to the outputs so CI can cache both.
const hashes = new Map();
const hashOf = (file) => {
  if (!hashes.has(file)) hashes.set(file, createHash('sha1').update(fs.readFileSync(file)).digest('hex'));
  return hashes.get(file);
};
const STAMPS = path.join(root, 'src', 'generated', 'asset-stamps.json');
const stamps = fs.existsSync(STAMPS) ? JSON.parse(fs.readFileSync(STAMPS, 'utf8')) : {};
const key = (out) => path.relative(root, out).split(path.sep).join('/');
const stale = (src, out) => !fs.existsSync(out) || stamps[key(out)] !== hashOf(src);
const stamp = (src, out) => { stamps[key(out)] = hashOf(src); };
// STL -> GLB conversion only needs a timestamp check: both files live in models/.
const newer = (a, b) => !fs.existsSync(b) || fs.statSync(a).mtimeMs > fs.statSync(b).mtimeMs;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : /\.(jpe?g|png|webp|avif|tiff?)$/i.test(d.name) ? [p] : [];
  });
}

async function images() {
  const manifest = {};
  // Only images that content.js actually uses (anything under images/ can sit there unused).
  const used = new Set();
  const collect = (v) => {
    if (typeof v === 'string' && /\.(jpe?g|png|webp|avif|tiff?)$/i.test(v)) used.add(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(collect);
  };
  collect(content);
  const files = walk(IMAGES).filter((f) => used.has(path.relative(IMAGES, f).split(path.sep).join('/')));
  for (const u of used) if (!fs.existsSync(path.join(IMAGES, u))) console.warn(`images: ${u} is referenced in content.js but missing`);
  let made = 0;
  for (const file of files) {
    const rel = path.relative(IMAGES, file).split(path.sep).join('/');
    const base = rel.replace(/\.[^.]+$/, '');
    const meta = await sharp(file).rotate().metadata();
    // .rotate() applies EXIF orientation; metadata() reports pre-rotation size.
    const swap = (meta.orientation || 1) >= 5;
    const w = swap ? meta.height : meta.width;
    const h = swap ? meta.width : meta.height;
    const widths = WIDTHS.filter((x) => x < w);
    widths.push(Math.min(w, WIDTHS.at(-1)));
    const uniq = [...new Set(widths)].sort((a, b) => a - b);
    for (const width of uniq) {
      for (const fmt of ['avif', 'webp']) {
        const out = path.join(OUT_IMG, `${base}-${width}.${fmt}`);
        if (!stale(file, out)) continue;
        fs.mkdirSync(path.dirname(out), { recursive: true });
        const img = sharp(file).rotate().resize({ width, withoutEnlargement: true });
        await (fmt === 'avif' ? img.avif({ quality: 52, effort: 4 }) : img.webp({ quality: 74 })).toFile(out);
        stamp(file, out);
        made++;
      }
    }
    const { dominant } = await sharp(file).resize(32).stats();
    manifest[rel] = {
      base: `img/${base}`,
      w,
      h,
      widths: uniq,
      bg: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    };
  }
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log(`images: ${files.length} sources, ${made} files written`);
}

// Minimal STL (binary or ASCII) -> GLB, written next to the source.
async function stlToGlb(stlPath, glbPath) {
  const { Document, NodeIO } = await import('@gltf-transform/core');
  const buf = fs.readFileSync(stlPath);
  const positions = [];
  const isAscii = buf.slice(0, 5).toString() === 'solid' && buf.toString('utf8', 0, 512).includes('facet');
  if (isAscii) {
    const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
    for (const m of buf.toString('utf8').matchAll(re)) positions.push(+m[1], +m[2], +m[3]);
  } else {
    const n = buf.readUInt32LE(80);
    for (let i = 0; i < n; i++) {
      const o = 84 + i * 50 + 12;
      for (let v = 0; v < 9; v++) positions.push(buf.readFloatLE(o + v * 4));
    }
  }
  // STL is usually in millimetres; glTF is metres.
  const pos = new Float32Array(positions.map((x) => x / 1000));
  const doc = new Document();
  const b = doc.createBuffer();
  const acc = doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(b);
  const mat = doc.createMaterial('part').setBaseColorFactor([0.78, 0.8, 0.82, 1]).setMetallicFactor(0.4).setRoughnessFactor(0.45);
  const prim = doc.createPrimitive().setAttribute('POSITION', acc).setMaterial(mat);
  const mesh = doc.createMesh(path.basename(stlPath, '.stl')).addPrimitive(prim);
  const node = doc.createNode(path.basename(stlPath, '.stl')).setMesh(mesh);
  doc.createScene().addChild(node);
  await new NodeIO().write(glbPath, doc);
}

async function models() {
  const dir = path.join(root, 'models');
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir).filter((f) => /\.stl$/i.test(f))) {
    const stl = path.join(dir, f);
    const glb = stl.replace(/\.stl$/i, '.glb');
    if (newer(stl, glb)) { await stlToGlb(stl, glb); console.log(`models: converted ${f} -> ${path.basename(glb)}`); }
  }
  fs.mkdirSync(OUT_MODELS, { recursive: true });
  const cli = path.join(root, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
  for (const p of projects.filter((p) => p.model)) {
    const src = path.join(root, p.model.replace(/\.stl$/i, '.glb'));
    if (!fs.existsSync(src)) { console.warn(`models: ${p.model} not found (project ${p.slug})`); continue; }
    const out = path.join(OUT_MODELS, path.basename(src));
    if (!stale(src, out)) continue;
    if (fs.statSync(src).size > 3 * 1024 * 1024) {
      // Keep the part hierarchy (no join/flatten) so click-to-label keeps working.
      execFileSync(process.execPath, [cli, 'optimize', src, out, '--compress', 'draco', '--flatten', 'false', '--join', 'false',
        '--instance', 'false', '--palette', 'false', '--texture-compress', 'webp', '--texture-size', '1024', '--simplify-error', '0.0005'], { stdio: 'inherit' });
    } else {
      fs.copyFileSync(src, out);
    }
    stamp(src, out);
    console.log(`models: ${path.basename(src)} -> public/models (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
  }
}

await images();
await models();
fs.writeFileSync(STAMPS, JSON.stringify(stamps, null, 1));
