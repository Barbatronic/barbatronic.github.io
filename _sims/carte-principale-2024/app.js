// La page : en-tête, chapitres (une question chacun) et, pour chaque chapitre, trois vues :
//   Principe : schéma animé et boutons pour essayer ;
//   Schéma : les extraits du vrai schéma KiCad (schema.svg) qui concernent le chapitre, composants entourés ;
//   Carte : les rendus de la carte (dessus, dessous), mêmes composants entourés.
// Colonne de droite : explication, à retenir, tableau des composants du chapitre ; un clic sur un composant le
// désigne dans le schéma et sur la carte, et liste ses broches avec leur signal.
// Sorties : runApp() ; window.EXPLAIN pour la relecture ({go(n), view(v), pick(ref), chapter}).
import {bau} from './ch-bau.js';
import {energie} from './ch-energie.js';
import {moteur} from './ch-moteur.js';
import {PARTS, ROLES} from './kin.js';
import SCH from './schema.json';
import {S} from './svg.js';

const CHAPTERS = [
  {n: '01', title: 'L\'énergie', q: 'D\'où vient l\'énergie, et pourquoi plusieurs tensions ?', make: energie},
  {n: '02', title: 'L\'arrêt d\'urgence', q: 'Comment un bouton coupe tout le robot ?', make: bau},
  {n: '03', title: 'Les moteurs', q: 'Comment le Teensy fait tourner un moteur ?', make: moteur},
  {n: '04', title: 'Les capteurs', q: 'Comment le robot perçoit la table ?', soon: true},
  {n: '05', title: 'Les actionneurs', q: 'Comment il commande la pince ?', soon: true},
  {n: '06', title: 'Le match', q: 'Comment on prépare et lance un match ?', soon: true},
];
const VIEWS = [['principe', 'Principe'], ['schema', 'Schéma KiCad'], ['carte', 'Carte']];

const h = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Zone d'un extrait du schéma : cadre donné, sinon bloc titré du schéma, sinon les symboles listés avec une marge. */
function extractBox(ex) {
  if (ex.box) return ex.box;
  if (ex.block) {
    const b = SCH.blocks.find((x) => x.title.startsWith(ex.block));
    if (b) return [b.box[0] - 1, b.box[1] - 1, b.box[2] + 1, b.box[3] + 1];
  }
  const bs = ex.refs.map((r) => SCH.sym[r].b);
  return [Math.min(...bs.map((b) => b[0])) - 8, Math.min(...bs.map((b) => b[1])) - 6, Math.max(...bs.map((b) => b[2])) + 8, Math.max(...bs.map((b) => b[3])) + 6];
}

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
  const vbar = h('div', 'vbar mono');
  const pPrin = h('div', 'pane prin');
  const stage = h('div', 'stage');
  const ctrl = h('div', 'ctrl');
  pPrin.append(stage, ctrl);
  const pSch = h('div', 'pane sch', '<div class="chips mono"></div><div class="schv"></div><p class="note snote"></p>');
  const pCar = h('div', 'pane car', '<div class="faces"></div>');
  stageCol.append(q, vbar, pPrin, pSch, pCar);
  const side = h('aside', 'expl');
  const text = h('div', 'txt');
  const parts = h('div', 'parts', '<h4 class="mono">Composants</h4><table><thead><tr><th>Réf.</th><th>Valeur</th><th>Rôle</th></tr></thead><tbody></tbody></table><div class="pins"></div>');
  side.append(text, parts);
  main.append(stageCol, side);

  // ---------------------------------------------------------------- état partagé
  let view = 'principe';
  let chap = null;
  let idx = -1;
  let refs = [];      // composants du chapitre (ou de la ligne choisie)
  let sel = null;     // composant désigné
  let exIdx = 0;

  const vbtn = VIEWS.map(([k, label]) => {
    const b = h('button', 'tab', label);
    b.type = 'button';
    b.addEventListener('click', () => setView(k));
    vbar.appendChild(b);
    return [k, b];
  });
  const setView = (k) => {
    view = k;
    for (const [kk, b] of vbtn) b.classList.toggle('on', kk === k);
    pPrin.hidden = k !== 'principe';
    pSch.hidden = k !== 'schema';
    pCar.hidden = k !== 'carte';
    render();
  };

  // ---------------------------------------------------------------- schéma : extrait du SVG KiCad, recadré
  const chips = pSch.querySelector('.chips');
  const schv = pSch.querySelector('.schv');
  const snote = pSch.querySelector('.snote');
  const schSvg = S('svg', {class: 'schsvg', preserveAspectRatio: 'xMidYMid meet'}, schv);
  S('rect', {x: 0, y: 0, width: 297, height: 210, fill: '#fff'}, schSvg);
  S('image', {href: 'schema.svg', x: 0, y: 0, width: 297, height: 210}, schSvg);
  const schHl = S('g', {}, schSvg);
  const renderSch = () => {
    const exs = chap?.extracts || [];
    chips.innerHTML = '';
    exs.forEach((ex, i) => {
      const b = h('button', `chip${i === exIdx ? ' on' : ''}`, ex.t);
      b.type = 'button';
      b.addEventListener('click', () => {
        exIdx = i;
        render();
      });
      chips.appendChild(b);
    });
    const ex = exs[exIdx];
    if (!ex) return;
    const [x0, y0, x1, y1] = extractBox(ex);
    schSvg.setAttribute('viewBox', `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    schv.style.aspectRatio = `${x1 - x0} / ${y1 - y0}`;
    schHl.innerHTML = '';
    // tout symbole de l'extrait se clique, même hors de la liste du chapitre
    for (const [r, sy] of Object.entries(SCH.sym)) {
      const [a, b, c, d] = sy.b;
      if (c < x0 || a > x1 || d < y0 || b > y1) continue;
      const hit = S('rect', {x: a - 0.8, y: b - 0.8, width: c - a + 1.6, height: d - b + 1.6, class: 'shit'}, schHl);
      hit.addEventListener('click', () => pick(r === sel ? null : r));
      S('title', {}, hit).textContent = `${r} · ${sy.v}`;
    }
    for (const r of refs) {
      const s = SCH.sym[r];
      if (!s) continue;
      const [a, b, c, d] = s.b;
      const m = S('rect', {x: a - 0.8, y: b - 0.8, width: c - a + 1.6, height: d - b + 1.6, class: r === sel ? 'shl on' : 'shl'}, schHl);
      m.addEventListener('click', () => pick(r === sel ? null : r));
    }
    snote.textContent = ex.note || '';
  };

  // ---------------------------------------------------------------- carte : rendus dessus et dessous
  const faces = pCar.querySelector('.faces');
  const face = (img, label, mirror) => {
    const f = h('div', 'cface', `<img src="${img}" alt="Carte principale, ${label}"><span class="mono">${label}</span>`);
    const svg = S('svg', {viewBox: '100 50 100 100', preserveAspectRatio: 'none'}, f);
    faces.appendChild(f);
    return {svg, mirror};
  };
  const top = face('carte-dessus.jpg', 'dessus', false);
  const bot = face('carte-dessous.jpg', 'dessous', true);
  const renderCar = () => {
    for (const F of [top, bot]) {
      F.svg.innerHTML = '';
      const placed = [];
      for (const ref of refs) {
        const p = PARTS[ref];
        if (!p || (p.s === 'B') !== F.mirror) continue;
        let [x0, y0, x1, y1] = p.b;
        if (F.mirror) [x0, x1] = [300 - x1, 300 - x0];
        S('rect', {x: x0 - 1, y: y0 - 1, width: x1 - x0 + 2, height: y1 - y0 + 2, class: ref === sel ? 'hl on' : 'hl'}, F.svg);
        const cx = (x0 + x1) / 2;
        const w = ref.length * 2.2;
        let y = y0 - 2.5;
        if (placed.some((q2) => Math.abs(q2.x - cx) < (q2.w + w) / 2 && Math.abs(q2.y - y) < 4)) y = y1 + 5;
        placed.push({x: cx, y, w});
        S('text', {x: cx, y, class: 'hlt'}, F.svg).textContent = ref;
      }
    }
  };

  // ---------------------------------------------------------------- tableau des composants et broches
  const tbody = parts.querySelector('tbody');
  const pinsBox = parts.querySelector('.pins');
  const renderParts = () => {
    tbody.innerHTML = '';
    for (const r of refs) {
      const s = SCH.sym[r];
      if (!s) continue;
      const tr = h('tr', r === sel ? 'on' : '', `<td class="mono">${r}</td><td>${esc(s.v)}</td><td>${esc(ROLES[r] || '')}</td>`);
      tr.addEventListener('click', () => pick(r === sel ? null : r));
      tbody.appendChild(tr);
    }
    if (sel && SCH.sym[sel]) {
      const s = SCH.sym[sel];
      pinsBox.innerHTML = `<h4 class="mono">${sel} · broches</h4><p class="note">Boîtier : ${esc(s.fp)}</p><table class="pt"><tr><th>Broche</th><th>Fonction</th><th>Signal</th></tr>${s.p
        .map((p) => `<tr><td class="mono">${p[0]}</td><td class="mono">${esc(p[1])}</td><td class="mono">${esc(p[2])}</td></tr>`)
        .join('')}</table>`;
    } else pinsBox.innerHTML = '<p class="note">Cliquer un composant pour voir ses broches et le désigner dans le schéma et sur la carte.</p>';
  };
  const pick = (r) => {
    sel = r;
    if (r && !refs.includes(r)) refs = [...refs, r];
    render();
  };

  const render = () => {
    renderSch();
    renderCar();
    renderParts();
  };

  // ---------------------------------------------------------------- api des chapitres
  const api = {
    side: (html) => (text.innerHTML = html),
    /** Composants à montrer et extrait du schéma à ouvrir (indice), après un clic dans le principe. */
    focus: (list, ex = null) => {
      refs = list || chap.parts;
      if (ex !== null) exIdx = ex;
      if (sel && !refs.includes(sel)) sel = null;
      render();
    },
  };

  // ---------------------------------------------------------------- chapitres
  const btns = CHAPTERS.map((c, i) => {
    const b = h('button', 'tab', `<span>${c.n}</span> ${c.title}${c.soon ? ' <i>bientôt</i>' : ''}`);
    b.type = 'button';
    b.disabled = !!c.soon;
    b.addEventListener('click', () => go(i));
    nav.appendChild(b);
    return b;
  });
  let cur = null;
  const go = (i) => {
    const c = CHAPTERS[i];
    if (!c || c.soon || i === idx) return;
    idx = i;
    btns.forEach((b, k) => b.classList.toggle('on', k === i));
    q.innerHTML = `<span class="mono">${c.n}</span> ${c.q}`;
    stage.innerHTML = '';
    ctrl.innerHTML = '';
    pPrin.querySelectorAll('.chain').forEach((e) => e.remove());
    cur = c.make(api);
    chap = cur;
    refs = cur.parts;
    sel = null;
    exIdx = 0;
    cur.mount(stage, ctrl);
    render();
  };
  go(0);
  setView('principe');

  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (view === 'principe') cur?.tick(now / 1000, dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.EXPLAIN = {go, view: setView, pick, get chapter() {
    return idx;
  }};
}
