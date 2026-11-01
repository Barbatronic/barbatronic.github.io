// La page : en-tête, chapitres (une question chacun), scène animée, colonne d'explication et vignette « Sur la carte »
// qui entoure sur les rendus de la vraie carte (dessus, dessous) les composants dont parle le chapitre.
// Sorties : runApp() ; window.EXPLAIN pour la relecture ({go(n), chapter}).
import {bau} from './ch-bau.js';
import {energie} from './ch-energie.js';
import {moteur} from './ch-moteur.js';
import {PARTS} from './kin.js';
import {S} from './svg.js';

const CHAPTERS = [
  {n: '01', title: 'L\'énergie', q: 'D\'où vient l\'énergie, et pourquoi plusieurs tensions ?', make: energie},
  {n: '02', title: 'L\'arrêt d\'urgence', q: 'Comment un bouton coupe tout le robot ?', make: bau},
  {n: '03', title: 'Les moteurs', q: 'Comment le Teensy fait tourner un moteur ?', make: moteur},
  {n: '04', title: 'Les capteurs', q: 'Comment le robot perçoit la table ?', soon: true},
  {n: '05', title: 'Les actionneurs', q: 'Comment il commande la pince ?', soon: true},
  {n: '06', title: 'Le match', q: 'Comment on prépare et lance un match ?', soon: true},
];

// nom court des composants pour les étiquettes de la vignette
const SHORT = {J1: 'batterie', F1: 'fusible', K2: 'relais', U4: '5 V', U3: '12 V', U2: '3,3 V', PS1: '5 V servos', U1: 'Teensy',
  J5: 'Stepper 1', J3: 'Stepper 2', J6: 'Stepper 3', D4: 'diode', J21: 'arrêt d\'urgence', J12: 'lidar', J22: 'I2C',
  'IHM-IO1': 'IHM', 'Con-TFT1': 'écran', J2: 'XBee', J7: 'XT30', J16: 'XT30', J17: 'XT30', J23: '12 V', J28: '12 V',
  J29: '12 V', J20: 'servos', J26: 'servos', J27: 'servos'};

const h = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

export function runApp() {
  const app = document.getElementById('app');
  const root = h('div', 'ex');
  app.appendChild(root);
  root.appendChild(h('header', 'hd', `<div><div class="mono kicker">CDR 2024 · Farming Mars · le Jardinier</div>
    <h1>La carte principale</h1><p class="mono">MainBoard 2024 V3.0 · Teensy 3.5 · comprendre la carte en six questions</p></div>`));
  const nav = h('nav', 'chap mono');
  nav.setAttribute('aria-label', 'Chapitres');
  root.appendChild(nav);
  const main = h('div', 'main');
  root.appendChild(main);
  const stageCol = h('section', 'stagecol');
  const q = h('h2', 'q');
  const stage = h('div', 'stage');
  const ctrl = h('div', 'ctrl');
  stageCol.append(q, stage, ctrl);
  const side = h('aside', 'expl');
  const text = h('div', 'txt');
  const fig = h('figure', 'oncard', `<figcaption class="mono"><b>Sur la carte</b><span class="note"></span></figcaption><div class="faces"></div>`);
  side.append(text, fig);
  main.append(stageCol, side);

  // ---------------------------------------------------------------- vignette : dessus et dessous de la vraie carte
  const faces = fig.querySelector('.faces');
  const face = (img, label, mirror) => {
    const f = h('div', 'cface', `<img src="${img}" alt="Carte principale, ${label}" loading="lazy"><span class="mono">${label}</span>`);
    // repère KiCad 100..200 × 50..150 mm ; vue de dessous : x retourné
    const svg = S('svg', {viewBox: '100 50 100 100', preserveAspectRatio: 'none'}, f);
    faces.appendChild(f);
    return {svg, mirror};
  };
  const top = face('carte-dessus.jpg', 'dessus', false);
  const bot = face('carte-dessous.jpg', 'dessous', true);
  const show = (refs, note) => {
    fig.querySelector('.note').textContent = note || '';
    for (const F of [top, bot]) {
      F.svg.innerHTML = '';
      const placed = [];
      // une face sans composant concerné est masquée
      F.svg.parentNode.classList.toggle('empty', !refs.some((r) => PARTS[r] && (PARTS[r].s === 'B') === F.mirror));
      for (const ref of refs) {
        const p = PARTS[ref];
        if (!p || (p.s === 'B') !== F.mirror) continue;
        let [x0, y0, x1, y1] = p.b;
        if (F.mirror) [x0, x1] = [300 - x1, 300 - x0];
        S('rect', {x: x0 - 1, y: y0 - 1, width: x1 - x0 + 2, height: y1 - y0 + 2, class: 'hl'}, F.svg);
        const txt = `${ref}${SHORT[ref] ? ' · ' + SHORT[ref] : ''}`;
        // étiquette au-dessus du composant, en dessous si elle chevauche une étiquette déjà posée
        const cx = (x0 + x1) / 2;
        const w = txt.length * 2.1;
        let y = y0 - 2.5;
        if (placed.some((p) => Math.abs(p.x - cx) < (p.w + w) / 2 && Math.abs(p.y - y) < 4)) y = y1 + 5;
        placed.push({x: cx, y, w});
        S('text', {x: cx, y, class: 'hlt'}, F.svg).textContent = txt;
      }
    }
  };
  const api = {side: (html) => (text.innerHTML = html), show};

  // ---------------------------------------------------------------- chapitres
  let cur = null;
  let idx = -1;
  const btns = CHAPTERS.map((c, i) => {
    const b = h('button', 'tab', `<span>${c.n}</span> ${c.title}${c.soon ? ' <i>bientôt</i>' : ''}`);
    b.type = 'button';
    b.disabled = !!c.soon;
    b.addEventListener('click', () => go(i));
    nav.appendChild(b);
    return b;
  });
  const go = (i) => {
    const c = CHAPTERS[i];
    if (!c || c.soon || i === idx) return;
    idx = i;
    btns.forEach((b, k) => b.classList.toggle('on', k === i));
    q.innerHTML = `<span class="mono">${c.n}</span> ${c.q}`;
    stage.innerHTML = '';
    ctrl.innerHTML = '';
    stageCol.querySelectorAll('.chain').forEach((e) => e.remove());
    cur = c.make(api);
    cur.mount(stage, ctrl);
  };
  go(0);

  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    cur?.tick(now / 1000, dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.EXPLAIN = {go, get chapter() {
    return idx;
  }};
}
