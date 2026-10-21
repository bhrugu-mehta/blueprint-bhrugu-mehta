// Ambient drafting in the background: faint construction lines, compass arcs and
// dimension marks sketch themselves onto the blueprint, hold, then get erased.
// It sits behind all content (z-index -1 inside the page), never takes pointer
// events, pauses when the tab is hidden and is skipped under reduced motion.

const SVG = 'http://www.w3.org/2000/svg';
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const ANGLES = [0, 0, 90, 90, 30, 45, 60, -30, -45, -60]; // drafting-triangle angles

export function startSketches(host) {
  const layer = document.createElementNS(SVG, 'svg');
  layer.setAttribute('class', 'sketch-layer');
  layer.setAttribute('aria-hidden', 'true');
  host.prepend(layer);

  let W = 0, H = 0;
  const size = () => {
    W = window.innerWidth; H = window.innerHeight;
    layer.setAttribute('viewBox', `0 0 ${W} ${H}`);
  };
  size();
  window.addEventListener('resize', size, { passive: true });

  const small = () => W < 820;
  const maxLive = () => (small() ? 2 : 5);
  let live = 0;

  const el = (tag, attrs) => {
    const n = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };
  const stroke = (d, extra = {}) => el('path', { d, pathLength: 1, class: 'sk-line', ...extra });
  const label = (x, y, text, rot = 0) => el('text', { x, y, class: 'sk-text', transform: rot ? `rotate(${rot} ${x} ${y})` : '' , 'text-anchor': 'middle' }).appendChild(document.createTextNode(text)).parentNode;

  // Each generator returns a <g> of strokes (drawn in order) and optional labels.
  const shapes = {
    construction() {
      const g = el('g', {});
      const a = (pick(ANGLES) * Math.PI) / 180, len = rand(220, small() ? 360 : 640);
      const x = rand(0, W), y = rand(0, H);
      const dx = Math.cos(a) * len, dy = Math.sin(a) * len;
      g.append(stroke(`M${x} ${y} L${x + dx} ${y + dy}`));
      // a short perpendicular tick at each end, like a projection line
      const px = -Math.sin(a) * 9, py = Math.cos(a) * 9;
      g.append(stroke(`M${x - px} ${y - py} L${x + px} ${y + py} M${x + dx - px} ${y + dy - py} L${x + dx + px} ${y + dy + py}`));
      return g;
    },
    compass() {
      const g = el('g', {});
      const r = rand(28, small() ? 80 : 150), cx = rand(r, W - r), cy = rand(r, H - r);
      const a0 = rand(0, Math.PI * 2), sweep = rand(Math.PI * 0.6, Math.PI * 1.7);
      const p = (t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)];
      const [x0, y0] = p(a0), [x1, y1] = p(a0 + sweep);
      g.append(stroke(`M${cx - 7} ${cy} L${cx + 7} ${cy} M${cx} ${cy - 7} L${cx} ${cy + 7}`)); // centre mark
      g.append(stroke(`M${x0} ${y0} A${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x1} ${y1}`));
      g.append(stroke(`M${cx} ${cy} L${x0} ${y0}`, { class: 'sk-line sk-faint' }));
      g.append(label((cx + x0) / 2, (cy + y0) / 2 - 6, `R ${(r / 4).toFixed(0)}`));
      return g;
    },
    dimension() {
      const g = el('g', {});
      const vertical = Math.random() < 0.35;
      const len = rand(90, small() ? 200 : 320);
      const x = rand(40, W - (vertical ? 40 : len + 40)), y = rand(40, H - (vertical ? len + 40 : 40));
      const [x1, y1] = vertical ? [x, y + len] : [x + len, y];
      const e = 14; // extension lines
      g.append(stroke(vertical
        ? `M${x - e} ${y} L${x + e} ${y} M${x - e} ${y1} L${x + e} ${y1}`
        : `M${x} ${y - e} L${x} ${y + e} M${x1} ${y - e} L${x1} ${y + e}`));
      g.append(stroke(`M${x} ${y} L${x1} ${y1}`));
      // small arrowheads
      g.append(stroke(vertical
        ? `M${x - 4} ${y + 9} L${x} ${y} L${x + 4} ${y + 9} M${x - 4} ${y1 - 9} L${x} ${y1} L${x + 4} ${y1 - 9}`
        : `M${x + 9} ${y - 4} L${x} ${y} L${x + 9} ${y + 4} M${x1 - 9} ${y - 4} L${x1} ${y} L${x1 - 9} ${y + 4}`));
      const value = pick([`${(len / 4).toFixed(1)}`, `${(len / 4).toFixed(0)}`, `Ø ${(len / 9).toFixed(0)}`]);
      g.append(vertical ? label(x - 12, (y + y1) / 2, value, -90) : label((x + x1) / 2, y - 8, value));
      return g;
    },
    box() {
      const g = el('g', {});
      const w = rand(70, small() ? 140 : 240), h = rand(50, small() ? 110 : 170);
      const x = rand(0, W - w), y = rand(0, H - h), d = rand(16, 40); // oblique depth
      g.append(stroke(`M${x} ${y} H${x + w} V${y + h} H${x} Z`));
      g.append(stroke(`M${x} ${y} L${x + d} ${y - d} H${x + w + d} V${y + h - d} L${x + w} ${y + h} M${x + w} ${y} L${x + w + d} ${y - d}`, { class: 'sk-line sk-faint' }));
      return g;
    },
    hatch() {
      const g = el('g', {});
      const w = rand(60, 150), h = rand(40, 90), x = rand(0, W - w), y = rand(0, H - h);
      let d = '';
      for (let i = -h; i < w; i += 11) d += `M${x + Math.max(i, 0)} ${y + Math.max(0, -i)} L${x + Math.min(i + h, w)} ${y + Math.min(h, w - i)} `;
      g.append(stroke(`M${x} ${y} H${x + w} V${y + h} H${x} Z`, { class: 'sk-line sk-faint' }));
      g.append(stroke(d));
      return g;
    },
    curve() {
      const g = el('g', {});
      const x = rand(0, W * 0.8), y = rand(0, H), len = rand(200, small() ? 300 : 520);
      const c1 = [x + len * 0.3, y + rand(-120, 120)], c2 = [x + len * 0.7, y + rand(-120, 120)];
      g.append(stroke(`M${x} ${y} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${x + len} ${y + rand(-60, 60)}`));
      return g;
    },
  };
  const kinds = ['construction', 'construction', 'compass', 'dimension', 'dimension', 'box', 'hatch', 'curve'];

  const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';
  function spawn() {
    if (document.hidden || live >= maxLive()) return;
    live++;
    const g = shapes[pick(kinds)]();
    layer.append(g);
    const strokes = [...g.querySelectorAll('path')];
    const texts = [...g.querySelectorAll('text')];
    const drawEach = rand(700, 1300), hold = rand(2200, 4200), eraseEach = rand(500, 900);
    // draw: strokes one after another, like a pencil
    strokes.forEach((p, i) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: drawEach, delay: i * drawEach * 0.55, easing: ease, fill: 'both' }));
    const drawn = (strokes.length - 1) * drawEach * 0.55 + drawEach;
    texts.forEach((t) => t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: drawn - 200, fill: 'both' }));
    // erase: strokes retract in the same order, labels fade
    const eraseAt = drawn + hold;
    strokes.forEach((p, i) => p.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }], { duration: eraseEach, delay: eraseAt + i * eraseEach * 0.4, easing: ease, fill: 'forwards', composite: 'replace' }));
    texts.forEach((t) => t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: eraseAt, fill: 'forwards' }));
    const done = eraseAt + (strokes.length - 1) * eraseEach * 0.4 + eraseEach + 100;
    setTimeout(() => { g.remove(); live--; }, done);
  }

  let timer = 0;
  const tick = () => {
    spawn();
    timer = setTimeout(tick, rand(small() ? 1600 : 900, small() ? 3200 : 2000));
  };
  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer);
    if (!document.hidden) tick();
  });
  tick();
}
