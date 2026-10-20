// Build-time HTML rendering. Turns content.js into static markup so every page
// is complete without JavaScript (fast first paint, readable by link previews).
import { site, projects, experience, education, skills } from './content.js';
import fs from 'node:fs';

// Read fresh on every render so new images show up without restarting the dev server.
const loadJSON = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const loadManifest = () => loadJSON('./generated/images.json');

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** <picture> with AVIF + WebP srcsets. `sizes` describes the rendered width. */
export function picture(root, src, alt, { sizes = '100vw', eager = false, cls = '' } = {}) {
  const m = loadManifest()[src];
  if (!m) return `<!-- missing image ${esc(src)} -->`;
  const set = (fmt) => m.widths.map((w) => `${root}${m.base}-${w}.${fmt} ${w}w`).join(', ');
  const fallback = `${root}${m.base}-${m.widths.at(-1)}.webp`;
  const transparent = /-(solid|lines)\.png$/i.test(src);
  return `<picture${cls ? ` class="${cls}"` : ''}${transparent ? '' : ` style="--ph:${m.bg}"`}>` +
    `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">` +
    `<img src="${fallback}" alt="${esc(alt)}" width="${m.w}" height="${m.h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">` +
    `</picture>`;
}

/** A photo drawn as a line frame on the blueprint, which it lifts out of when it scrolls in. */
function pop(root, image, alt, { sizes, eager = false, caption = '', tag = '', cls = '', ratio = '' } = {}) {
  return `<figure class="pop${cls ? ` ${cls}` : ''}" data-reveal data-tilt${ratio ? ` style="--ratio:${ratio}"` : ''}>
    <div class="pop-stage">
      <span class="pop-frame" aria-hidden="true"></span>
      <div class="pop-img">${picture(root, image, alt, { sizes, eager })}</div>
    </div>
    ${caption || tag ? `<figcaption>${tag ? `<span class="tag">${esc(tag)}</span>` : ''}${esc(caption)}</figcaption>` : ''}
  </figure>`;
}

/** Wraps the leading number of a value so it can count up ("−63%", "2.13", "24 mph", "9th"). */
function countable(value) {
  const m = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  // Ordinals ("9th") don't count up: the suffix would read "3th" mid-count.
  if (!m || /^(st|nd|rd|th)\b/.test(m[3])) return esc(value);
  return `${esc(m[1])}<span data-count="${m[2]}">${m[2]}</span>${esc(m[3])}`;
}

const projectHref = (root, p) => `${root}projects/${p.slug}.html`;

export function head(root, { title, description, path = '' }) {
  const abs = site.url ? site.url.replace(/\/?$/, '/') : '';
  const og = abs ? `${abs}og.png` : `${root}og.png`;
  return `
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0c3a78">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Bhrugu Mehta, mechanical engineering portfolio">
${abs ? `<meta property="og:url" content="${abs}${path}">\n<link rel="canonical" href="${abs}${path}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}fonts/plex-mono-400.woff2" as="font" type="font/woff2" crossorigin>`;
}

function header(root, current) {
  const link = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
  <a class="wordmark" href="${root}index.html"><span class="mark" aria-hidden="true">BM</span><span>${esc(site.name)}</span></a>
  <nav aria-label="Main">
    ${link(`${root}index.html#projects`, 'Projects', 'projects')}
    ${link(`${root}index.html#experience`, 'Experience')}
    ${link(`${root}index.html#skills`, 'Skills')}
    ${link(`${root}index.html#contact`, 'Contact')}
  </nav>
  <a class="btn ghost small" href="${root}${site.resume}" download>Resume <span class="sr">(PDF)</span><span aria-hidden="true">↓</span></a>
</header>`;
}

function sectionHead(id, title, note) {
  return `<div class="sec-head" data-reveal>
      <h2 id="${id}">${esc(title)}</h2>
      <span class="sec-rule" aria-hidden="true"></span>
      ${note ? `<span class="sec-note">${esc(note)}</span>` : ''}
    </div>`;
}

function footer(root) {
  return `
<footer class="curtain" id="footer">
  <div class="curtain-inner">
    <p class="sign" data-reveal><span>${esc(site.name)}</span></p>
    <div class="foot-row" data-reveal>
      <ul class="foot-links">
        <li><a href="mailto:${site.email}">${site.email}</a></li>
        <li><a href="${site.linkedin}" rel="me noopener">LinkedIn</a></li>
        <li><a href="${root}${site.resume}" download>Resume (PDF)</a></li>
      </ul>
      <p class="imprint">Rev. ${esc(site.revised)} · Drawn in Vite and three.js</p>
    </div>
  </div>
</footer>`;
}

/* ───────────────────────────── Home ───────────────────────────── */

function heroDrawing(root) {
  const { anchors: a, size: [W, H] } = loadJSON('./hero-anchors.json');
  const P = (k) => [a[k][0] * W, a[k][1] * H];
  const pad = P('pad'), pivot = P('pivot'), bar = P('balanceBar'), mc = P('masterCylinder'), sw = P('switch'), mid = P('armMid');
  const dimX = Math.min(pad[0], pivot[0]) - 230;
  const n = (v) => v.toFixed(0);
  // Each annotation is a path that "plots" in, plus a label.
  const leader = (from, to, labelAt, anchor, lines, cls = '') => `
      <g class="note${cls ? ` ${cls}` : ''}">
        <circle cx="${n(from[0])}" cy="${n(from[1])}" r="7" pathLength="1" />
        <path d="M${n(from[0])} ${n(from[1])} L${n(to[0])} ${n(to[1])} L${n(labelAt[0])} ${n(to[1])}" pathLength="1" />
        <text x="${n(labelAt[0] + (anchor === 'end' ? -14 : 14))}" y="${n(to[1] - 14)}" text-anchor="${anchor}">${lines.map((l, i) => `<tspan x="${n(labelAt[0] + (anchor === 'end' ? -14 : 14))}" dy="${i ? 38 : 0}"${i ? ' class="sub"' : ''}>${esc(l)}</tspan>`).join('')}</text>
      </g>`;
  return `
    <div class="drawing" data-tilt-scene aria-hidden="true">
      <div class="drawing-frame"><span></span></div>
      <div class="drawing-art" style="--ar:${W} / ${H}">
        <div class="layer lines">${picture(root, site.heroArt.lines, '', { sizes: '(min-width: 1000px) 58vw, 100vw', eager: true })}</div>
        <div class="layer solid">${picture(root, site.heroArt.solid, '', { sizes: '(min-width: 1000px) 58vw, 100vw', eager: true })}</div>
        <svg class="layer notes" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
          <g class="dim">
            <path d="M${n(pad[0] - 30)} ${n(pad[1])} H${n(dimX - 24)} M${n(pivot[0] - 30)} ${n(pivot[1])} H${n(dimX - 24)} M${n(bar[0] - 30)} ${n(bar[1])} H${n(dimX + 70)}" pathLength="1" />
            <path d="M${n(dimX)} ${n(pad[1])} V${n(pivot[1])} M${n(dimX + 46)} ${n(bar[1])} V${n(pivot[1])}" pathLength="1" class="dim-line" />
            <text x="${n(dimX - 18)}" y="${n((pad[1] + pivot[1]) / 2)}" transform="rotate(-90 ${n(dimX - 18)} ${n((pad[1] + pivot[1]) / 2)})" text-anchor="middle">180</text>
            <text x="${n(dimX + 28)}" y="${n((bar[1] + pivot[1]) / 2)}" transform="rotate(-90 ${n(dimX + 28)} ${n((bar[1] + pivot[1]) / 2)})" text-anchor="middle">45</text>
          </g>
          <g class="force">
            <path d="M${n(pad[0] - 300)} ${n(pad[1] - 10)} H${n(pad[0] - 40)}" pathLength="1" />
            <path d="M${n(pad[0] - 66)} ${n(pad[1] - 26)} L${n(pad[0] - 40)} ${n(pad[1] - 10)} L${n(pad[0] - 66)} ${n(pad[1] + 6)}" pathLength="1" />
            <text x="${n(pad[0] - 300)}" y="${n(pad[1] - 34)}">F = 2 kN</text>
          </g>
          ${leader(mid, [mid[0] + 260, mid[1] - 210], [mid[0] + 560, 0], 'start', ['FOS 2.13', 'at 2 kN, 6061-T6'])}
          ${leader(mc, [mc[0] + 260, mc[1] - 150], [mc[0] + 520, 0], 'start', ['2× Tilton 78-700', 'independent circuits'])}
          ${leader(sw, [sw[0] + 120, sw[1] + 210], [sw[0] + 360, 0], 'start', ['Over-travel switch', 'trips at 36°'])}
          <text class="ratio" x="${n(dimX + 23)}" y="${n(pivot[1] + 58)}" text-anchor="middle">4 : 1</text>
        </svg>
      </div>
      <p class="readout" data-readout>X 000.0 &nbsp;Y 000.0</p>
    </div>`;
}

export function renderHome() {
  const root = '';
  const fig = site.heroFigure;
  const figProject = projects.find((p) => p.slug === fig.project);
  const [lead, ...rest] = projects;

  const plate = (p, big, i) => `
    <article class="plate${big ? ' main' : ''}">
      <a class="plate-link" href="${projectHref(root, p)}">
        ${pop(root, p.cover.image, p.cover.alt, {
          sizes: big ? '(min-width: 1080px) 56vw, 100vw' : '(min-width: 1080px) 20vw, 100vw',
          tag: `View ${String.fromCharCode(65 + i)}`,
          caption: p.context,
          cls: p.cover.image.includes('-solid') ? 'cutout' : '',
        })}
        <h3 data-reveal>${esc(p.title)}<span class="arrow" aria-hidden="true">→</span></h3>
      </a>
      <p class="plate-sum" data-reveal>${esc(p.summary)}</p>
      <dl class="plate-meta" data-reveal>
        ${p.showResultOnHome === false ? '' : `<div><dt>Result</dt><dd><b>${countable(p.headline.value)}</b> ${esc(p.headline.label)}</dd></div>`}
        <div><dt>Dates</dt><dd>${esc(p.dates)}</dd></div>
        ${p.model ? '<div><dt>Model</dt><dd>Interactive 3D</dd></div>' : ''}
      </dl>
    </article>`;

  return {
    head: head(root, { title: `${site.name}: Mechanical Engineering Portfolio`, description: site.description }),
    body: `
${header(root, 'home')}
<main id="main" class="table">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-title">
      ${site.headshot ? picture(root, site.headshot, `Portrait of ${site.name}`, { sizes: '96px', eager: true, cls: 'headshot' }) : ''}
      <h1 id="hero-title">${esc(site.name)}</h1>
      <p class="role">${esc(site.title)}</p>
      <p class="hook">${esc(site.hook)}</p>
      <div class="actions">
        <a class="btn" href="#projects">See the projects</a>
        <a class="btn ghost" href="mailto:${site.email}">${site.email}</a>
      </div>
      <dl class="readouts">
        ${site.facts.map((f) => `<div><dd>${countable(f.value)}</dd><dt>${esc(f.label)}</dt></div>`).join('')}
      </dl>
    </div>
    <figure class="hero-fig">
      ${heroDrawing(root)}
      <figcaption><a href="${projectHref(root, figProject)}">${esc(fig.caption)}</a>. Linework rendered from the CAD model. <a href="${projectHref(root, figProject)}">Open it in 3D →</a></figcaption>
    </figure>
    <p class="sr">${esc(fig.alt)}</p>
  </section>

  <section class="sec projects" id="projects" aria-labelledby="projects-title">
    ${sectionHead('projects-title', 'Projects', 'Each opens to the full write-up')}
    <div class="plates">
      ${plate(lead, true, 0)}
      <div class="plates-aux">${rest.map((p, i) => plate(p, false, i + 1)).join('')}</div>
    </div>
  </section>

  <section class="sec experience" id="experience" aria-labelledby="experience-title">
    ${sectionHead('experience-title', 'Experience', 'Revision history')}
    <ol class="revs">
      ${experience.map((e) => `
      <li class="rev" data-reveal>
        <div class="rev-when"><p class="rev-dates">${esc(e.dates)}</p><p class="rev-org">${esc(e.org)}</p></div>
        <div class="rev-what">
          <h3>${esc(e.role)}</h3>
          <ul>${e.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
          ${e.project ? `<a class="text-link" href="${projectHref(root, projects.find((p) => p.slug === e.project))}">See the car →</a>` : ''}
        </div>
      </li>`).join('')}
    </ol>
  </section>

  <section class="sec skills" id="skills" aria-labelledby="skills-title">
    ${sectionHead('skills-title', 'Education and skills', 'Bill of materials')}
    <div class="skills-grid">
      <div class="edu" data-reveal>
        <table class="title-block">
          <caption class="sr">Education</caption>
          <tbody>
            <tr><td><span>University</span><b>${esc(education.school)}</b></td><td><span>Class</span><b>${esc(education.year.replace('Class of ', ''))}</b></td></tr>
            <tr><td colspan="2"><span>Program</span><b>${esc(education.degree)}, ${esc(education.college)}</b></td></tr>
            <tr><td><span>GPA</span><b>${countable(education.gpa)}</b></td><td><span>Relevant coursework</span><b>${education.coursework.map(esc).join(', ')}</b></td></tr>
          </tbody>
        </table>
      </div>
      <table class="bom-table" data-reveal>
        <caption class="sr">Skills</caption>
        <thead><tr><th scope="col">Item</th><th scope="col">Skill</th><th scope="col">Experience</th></tr></thead>
        ${skills.map((g, gi) => `
        <tbody>
          <tr class="grp"><th colspan="3" scope="rowgroup">${esc(g.group)}</th></tr>
          ${g.items.map((it, ii) => `<tr><td class="num">${gi + 1}.${ii + 1}</td><td><b>${esc(it.name)}</b>${it.note ? `<small>${esc(it.note)}</small>` : ''}</td><td class="qty">${esc(it.value)}</td></tr>`).join('')}
        </tbody>`).join('')}
      </table>
    </div>
  </section>

  <section class="sec contact" id="contact" aria-labelledby="contact-title">
    ${sectionHead('contact-title', 'Get in touch', 'Summer 2027')}
    <div class="contact-grid">
      ${pop(root, 'gokart/IMG_0519.JPG', 'The finished wood go-kart parked in the garage, seen from the side', { sizes: '(min-width: 1000px) 55vw, 100vw', tag: 'Detail C', caption: 'Wood go-kart: 24 mph, 175 lb, 12 hp', cls: 'contact-pop' })}
      <div class="card" data-reveal>
        <p class="card-lead">Always open to gain more experience.</p>
        <a class="big-mail" href="mailto:${site.email}">${site.email}</a>
        <ul class="card-rows">
          <li><span>Also</span><a href="mailto:${site.emailSecondary}">${site.emailSecondary}</a></li>
          <li><span>LinkedIn</span><a href="${site.linkedin}" rel="me noopener">in/bhrugu-mehta</a></li>
        </ul>
        <a class="btn wide" href="${site.resume}" download>Download resume (PDF) <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  </section>
</main>
${footer(root)}`,
  };
}

/* ─────────────────────────── Project page ─────────────────────────── */

export function renderProject(slug) {
  const root = '../';
  const i = projects.findIndex((p) => p.slug === slug);
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  let n = 0;
  const fig = (f, sizes) => pop(root, f.image, f.alt, { sizes, tag: `Fig. ${++n}`, caption: f.caption });

  const model = p.model ? `
  <section class="sec viewer-sec" aria-labelledby="model-title">
    ${sectionHead('model-title', 'The assembly in 3D', 'Live model')}
    <div class="viewer-grid">
      <div class="viewer" data-model="${root}models/${p.model.split('/').pop().replace(/\.stl$/i, '.glb')}" data-decoder="${root}draco/" data-slug="${p.slug}">
        <span class="pop-frame" aria-hidden="true"></span>
        <div class="viewer-canvas"></div>
        <p class="viewer-status" role="status"><span class="viewer-pct">Loads when you scroll here</span><span class="viewer-track"><span class="viewer-fill"></span></span></p>
        <noscript><p class="viewer-status">Turn on JavaScript to explore the 3D model.</p></noscript>
        <button class="btn ghost small viewer-reset" type="button" hidden>Reset view</button>
        <p class="viewer-hint">Drag to orbit · scroll or pinch to zoom · right-drag to pan</p>
      </div>
      <div class="bom">
        <p class="bom-help">Click a part on the model, or pick it from the parts list.</p>
        ${p.parts ? `<ol class="bom-list">${p.parts.map((pt) => `<li><button type="button" data-part="${esc(pt.label)}" aria-pressed="false"><b>${esc(pt.label)}</b><small>${esc(pt.detail || '')}</small></button></li>`).join('')}</ol>` : ''}
      </div>
    </div>
  </section>` : '';

  return {
    head: head(root, { title: `${p.title}: ${site.name}`, description: p.summary, path: `projects/${p.slug}.html` }),
    body: `
${header(root, 'projects')}
<main id="main" class="table project">
  <section class="p-hero" aria-labelledby="p-title">
    <div class="p-title">
      <h1 id="p-title">${esc(p.short)}</h1>
      <p class="hook">${esc(p.summary)}</p>
      <p class="p-headline"><b>${countable(p.headline.value)}</b><span>${esc(p.headline.label)}</span></p>
    </div>
    ${pop(root, p.cover.image, p.cover.alt, { sizes: '(min-width: 1000px) 55vw, 100vw', eager: true, tag: 'View A', caption: p.title, cls: `p-cover${p.cover.image.includes('-solid') ? ' cutout' : ''}` })}
    <table class="title-block">
      <caption class="sr">Project details</caption>
      <tbody>
        <tr><td colspan="2"><span>Role</span><b>${esc(p.role)}</b></td><td><span>Dates</span><b>${esc(p.dates)}</b></td></tr>
        <tr><td><span>Context</span><b>${esc(p.context)}</b></td><td colspan="2"><span>Tools</span><b>${p.tools.map(esc).join(', ')}</b></td></tr>
      </tbody>
    </table>
  </section>
  ${model}
  ${p.sections.map((s) => `
  <section class="sec p-section${s.figures.length ? '' : ' no-figs'}" aria-labelledby="s-${slugify(s.heading)}">
    ${sectionHead(`s-${slugify(s.heading)}`, s.heading, '')}
    <div class="p-cols">
      <div class="p-text" data-reveal>
        ${s.body.map((b) => `<p>${esc(b)}</p>`).join('')}
      </div>
      ${s.figures.length ? `<div class="p-figs count-${Math.min(s.figures.length, 4)}">${s.figures.map((f) => fig(f, s.figures.length === 1 ? '(min-width: 1080px) 55vw, 100vw' : '(min-width: 1080px) 28vw, (min-width: 820px) 45vw, 100vw')).join('')}</div>` : ''}
      ${!s.figures.length && s.callout ? `<dl class="callout">${s.callout.map((c) => `<div data-reveal><dd>${esc(c.value)}</dd><dt>${esc(c.label)}</dt>${c.note ? `<dd class="note">${esc(c.note)}</dd>` : ''}</div>`).join('')}</dl>` : ''}
    </div>
  </section>`).join('')}
  <section class="sec results" aria-labelledby="results-title">
    ${sectionHead('results-title', 'Results', '')}
    <dl class="spec">
      ${p.results.map((r) => `<div data-reveal><dd>${countable(r.value)}</dd><dt>${esc(r.label)}</dt></div>`).join('')}
    </dl>
    ${p.note ? `<p class="results-note" data-reveal>${esc(p.note)}</p>` : ''}
  </section>
  <nav class="next" aria-label="Next project">
    <a class="next-link" href="${projectHref(root, next)}" data-reveal>
      <span class="next-label">Next project</span>
      <span class="next-title">${esc(next.short)} <span class="arrow" aria-hidden="true">→</span></span>
    </a>
    <a class="all text-link" href="${root}index.html#projects">All projects</a>
  </nav>
</main>
${footer(root)}`,
  };
}

export const projectSlugs = projects.map((p) => p.slug);
