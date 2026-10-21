// Intro: the visitor clicks a rolled blueprint; it lifts to the top of the screen and
// unrolls downward, uncovering the page. The inline script in the page head decides
// whether to show it (once per visit, not for deep links or reduced motion).

const EASE_MOVE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const EASE_ROLL = 'cubic-bezier(0.65, 0, 0.35, 1)';

export function intro() {
  window.__introReady = true;
  const root = document.documentElement;
  const el = document.querySelector('.intro');
  if (!el) return;
  if (!root.classList.contains('has-intro')) { el.remove(); return; }

  const behind = [...document.body.children].filter((n) => n !== el && n.tagName !== 'SCRIPT');
  behind.forEach((n) => n.setAttribute('inert', ''));
  const btn = el.querySelector('.intro-enter');
  const roll = el.querySelector('.intro-roll');
  const backdrop = el.querySelector('.intro-backdrop');
  const extras = [...el.querySelectorAll('.intro-stage > :not(.intro-roll)')];
  btn.focus({ preventScroll: true });

  let started = false;
  const play = () => {
    // Let the hero drawing start plotting while the sheet is still unrolling.
    root.classList.remove('intro-hold');
    window.dispatchEvent(new Event('intro:play'));
  };
  const finish = () => {
    try { sessionStorage.setItem('bm-intro', '1'); } catch (e) { /* private mode */ }
    behind.forEach((n) => n.removeAttribute('inert'));
    root.classList.remove('has-intro', 'intro-hold');
    el.remove();
    document.removeEventListener('keydown', onKey);
  };

  async function open() {
    if (started) return;
    started = true;
    el.classList.add('opening');

    // 1. Title and button step back; the roll detaches from the layout where it sits.
    extras.forEach((n, i) => n.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-14px)' }],
      { duration: 180, delay: i * 15, easing: 'ease-out', fill: 'forwards' },
    ));
    const r = roll.getBoundingClientRect();
    const h = r.height;
    Object.assign(roll.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, margin: '0' });

    // 2. The roll lifts to the top edge and widens to the full sheet.
    await roll.animate(
      [{ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` },
       { left: '0px', top: `${-h / 2}px`, width: `${window.innerWidth}px` }],
      { duration: 220, easing: EASE_MOVE, fill: 'forwards' },
    ).finished;

    // 3. It rolls down the screen; the dark cover is cut away right behind it,
    //    so the page appears as if printed on the sheet being unrolled.
    roll.classList.add('spinning');
    roll.querySelector('animateTransform')?.beginElement();
    const dur = 560; // click to fully open stays under one second (~0.8 s total)
    const travel = window.innerHeight + h;
    backdrop.animate(
      [{ clipPath: 'inset(0px 0 0 0)' }, { clipPath: `inset(${window.innerHeight + 2}px 0 0 0)` }],
      { duration: dur, easing: EASE_ROLL, fill: 'forwards' },
    );
    setTimeout(play, dur * 0.3);
    await roll.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${travel}px)` }],
      { duration: dur, easing: EASE_ROLL, fill: 'forwards' },
    ).finished;
    finish();
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  }
  el.addEventListener('click', open);
  document.addEventListener('keydown', onKey);
}
