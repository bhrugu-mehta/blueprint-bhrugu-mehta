// Client-side behaviour: scroll entrances, count-up numbers, cursor tilt, the hero
// drawing's parallax and coordinate readout, and the lazy 3D viewer.
// Everything here is progressive: the pages are complete without it.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Count a number up from zero, keeping its decimals ("2.13", "63", "4.0"). */
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  if (reduce || !target) return;
  const dur = 1100, t0 = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  const step = (now) => {
    const t = Math.min(1, (now - t0) / dur);
    el.textContent = (target * ease(t)).toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Entrances. Only elements still below the fold are hidden, so nothing visible
   on load ever blinks, and a script failure leaves the page fully readable. */
function reveals() {
  if (!('IntersectionObserver' in window)) return;
  const els = [...document.querySelectorAll('[data-reveal]')];
  const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
  below.forEach((el) => el.classList.add('pending'));
  const io = new IntersectionObserver((entries) => {
    const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    entering.forEach((el, i) => {
      io.unobserve(el);
      el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
      el.classList.add('revealing');
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('pending')));
      el.querySelectorAll('[data-count]').forEach((c) => setTimeout(() => countUp(c), 250 + i * 80));
      setTimeout(() => { el.classList.remove('revealing'); el.style.transitionDelay = ''; }, 2200 + i * 80);
    });
  }, { rootMargin: '0px', threshold: 0 });
  below.forEach((el) => io.observe(el));
  // Safety net: a fast fling can carry an element past the screen between two frames,
  // so the observer never sees it. Anything scrolled above the fold is revealed too.
  let ticking = false;
  const sweep = () => {
    ticking = false;
    const left = document.querySelectorAll('.pending');
    if (!left.length) { window.removeEventListener('scroll', onScroll); return; }
    left.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        io.unobserve(el);
        el.classList.add('revealing');
        el.classList.remove('pending');
        el.querySelectorAll('[data-count]').forEach((c) => countUp(c));
        setTimeout(() => el.classList.remove('revealing'), 2200);
      }
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => setTimeout(sweep, 120)); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  // Numbers already on screen (the hero) count up on load.
  document.querySelectorAll('[data-count]').forEach((c) => {
    if (!c.closest('.pending')) setTimeout(() => countUp(c), 600);
  });
}

/* Photos tilt a few degrees toward the cursor, as if lifted off the sheet. */
function tilt() {
  if (reduce || !finePointer) return;
  document.querySelectorAll('[data-tilt]').forEach((fig) => {
    const stage = fig.querySelector('.pop-stage');
    if (!stage) return;
    let raf = 0;
    fig.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stage.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
        stage.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
      });
    });
    fig.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      stage.style.removeProperty('--rx');
      stage.style.removeProperty('--ry');
    });
  });
}

/* Hero drawing: layers separate with the cursor (depth), and a readout shows the
   cursor position on the sheet in millimetres, like a CAD status bar. */
function heroDrawing() {
  const scene = document.querySelector('[data-tilt-scene]');
  if (!scene) return;
  const readout = scene.querySelector('[data-readout]');
  const art = scene.querySelector('.drawing-art');
  const MM_PER_PX = 0.2; // sheet scale: the 1600px drawing spans 320 mm
  const fmt = (v) => v.toFixed(1).padStart(5, '0');
  let raf = 0;
  scene.addEventListener('pointermove', (e) => {
    const r = art.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (readout) {
        readout.textContent = `X ${fmt(Math.max(0, fx) * 1600 * MM_PER_PX)}  Y ${fmt(Math.max(0, 1 - fy) * 1400 * MM_PER_PX)} mm`;
        readout.classList.add('live');
      }
      if (!reduce && finePointer) {
        scene.style.setProperty('--px', (fx - 0.5).toFixed(3));
        scene.style.setProperty('--py', (fy - 0.5).toFixed(3));
      }
    });
  });
  scene.addEventListener('pointerleave', () => {
    scene.style.setProperty('--px', 0);
    scene.style.setProperty('--py', 0);
    if (readout) readout.classList.remove('live');
  });
}

/* 3D viewer: three.js loads only once the page is idle and the viewer is on screen. */
function viewers() {
  document.querySelectorAll('.viewer[data-model]').forEach((host) => {
    const status = host.querySelector('.viewer-pct');
    const fill = host.querySelector('.viewer-fill');
    const resetBtn = host.querySelector('.viewer-reset');
    const buttons = [...document.querySelectorAll('.bom-list [data-part]')];
    const label = document.createElement('div');
    label.className = 'viewer-label';
    label.setAttribute('aria-live', 'polite');
    label.innerHTML = '<b></b><span></span>';
    host.appendChild(label);

    const start = async () => {
      status.textContent = 'Loading model 0%';
      try {
        const [{ createViewer }, { projects }] = await Promise.all([import('./viewer.js'), import('./content.js')]);
        const project = projects.find((p) => p.slug === host.dataset.slug);
        const v = await createViewer(host.querySelector('.viewer-canvas'), {
          src: host.dataset.model,
          decoderPath: host.dataset.decoder,
          parts: project.parts || [],
          highlight: '#ffb547',
          view: [1.1, 0.45, 0.9],
          materialize: true,
          onProgress: (p) => {
            status.textContent = `Loading model ${Math.round(p * 100)}%`;
            fill.style.transform = `scaleX(${p})`;
          },
          onSelect: (part) => {
            label.classList.toggle('on', !!part);
            if (part) { label.querySelector('b').textContent = part.label; label.querySelector('span').textContent = part.detail || ''; }
            buttons.forEach((b) => b.setAttribute('aria-pressed', String(!!part && b.dataset.part === part.label)));
          },
        });
        host.classList.add('ready');
        host.viewer = v; // handy for debugging in the console
        resetBtn.hidden = false;
        resetBtn.addEventListener('click', () => v.reset());
        buttons.forEach((b) => b.addEventListener('click', () => {
          v.select(b.getAttribute('aria-pressed') === 'true' ? null : b.dataset.part);
        }));
      } catch (err) {
        console.error(err);
        host.classList.add('failed');
        status.textContent = 'The 3D model could not load. The figures below show the same assembly.';
      }
    };

    const watch = () => {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { io.disconnect(); start(); }
      }, { threshold: 0.15 });
      io.observe(host);
    };
    if (document.readyState === 'complete') watch();
    else window.addEventListener('load', watch, { once: true });
  });
}

reveals();
tilt();
heroDrawing();
viewers();

/* Ambient background sketching, loaded after the page is done so it never slows first paint. */
function backgroundSketches() {
  const host = document.querySelector('main.table');
  if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const go = () => setTimeout(() => import('./sketch.js').then((m) => m.startSketches(host)), 1200);
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
}
backgroundSketches();
