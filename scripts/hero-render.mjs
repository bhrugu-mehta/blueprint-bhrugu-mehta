// Regenerates the hero artwork from the brake pedal CAD model.
// Needs the dev server running (npm run dev) and Playwright's Chromium:
//   npm i -D playwright && npx playwright install chromium   (once)
//   node scripts/hero-render.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const { chromium } = await import('playwright').catch(() => {
  console.error('Install Playwright first: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
});

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = process.argv[2] || 'http://localhost:5173/scripts/hero-render.html';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error(e));
await page.goto(url);
await page.waitForFunction(() => window.__out, null, { timeout: 120000 });
const { solid, lines, anchors, size } = await page.evaluate(() => window.__out);
const dir = path.join(root, 'images', 'pedal');
const save = (name, dataUrl) => fs.writeFileSync(path.join(dir, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
save('hero-solid.png', solid);
save('hero-lines.png', lines);
// Trimmed cut-out used as the project cover.
await sharp(path.join(dir, 'hero-solid.png')).trim({ threshold: 1 }).extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(dir, 'cover-solid.png'));
fs.writeFileSync(path.join(root, 'src', 'hero-anchors.json'), JSON.stringify({ size, anchors }, null, 1));
console.log('hero artwork written', anchors);
await browser.close();
