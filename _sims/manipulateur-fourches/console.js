// L'interface autour de la 3D : en-tête, carte de phase, vues et affichages, colonne de mesures, frise de la séquence.
// Chaque valeur affichée vient de kin.js (contact, state(t)) : rien n'est saisi à la main.
// Sorties : createConsole(app) -> {root, canvas, view, btn, track, update(st, ctx), labels(list)}.
import {contact, DUR, G, gapAt, PHASES} from './kin.js';

export const VIEWS = [['iso', '3/4'], ['face', 'Face'], ['dessus', 'Dessus'], ['cote', 'Côté'], ['doigt', 'Doigt']];
export const DISPLAY = [['arcs', 'Trajectoires'], ['xray', 'Pierres transparentes'], ['explode', 'Vue éclatée']];

const fr = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',').replace('-', '−') : '-');
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const PLAY = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
const PAUSE = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor"/></svg>';

// courbe du jeu doigt / pierre en fonction de l'angle servo, dessinée depuis gapAt()
const CH = {w: 300, h: 132, l: 30, r: 10, t: 12, b: 24, a0: -5, a1: 70, g0: -4, g1: 24};
const cx = (a) => CH.l + ((a - CH.a0) / (CH.a1 - CH.a0)) * (CH.w - CH.l - CH.r);
const cy = (g) => CH.t + (1 - (g - CH.g0) / (CH.g1 - CH.g0)) * (CH.h - CH.t - CH.b);
function chartSvg() {
  const pts = (a0, a1) => {
    const p = [];
    for (let a = a0; a <= a1 + 1e-9; a += 0.5) p.push(`${cx(a).toFixed(1)},${cy(gapAt(a)).toFixed(1)}`);
    return p.join(' ');
  };
  const ac = contact.angle;
  const grid = [0, 10, 20].map((g) => `<line x1="${CH.l}" x2="${CH.w - CH.r}" y1="${cy(g)}" y2="${cy(g)}" stroke="#ededed"/><text x="${CH.l - 5}" y="${cy(g) + 3}" text-anchor="end">${g}</text>`).join('');
  const ax = [0, 15, 30, 45, 60].map((a) => `<text x="${cx(a)}" y="${CH.h - 8}" text-anchor="middle">${a}°</text>`).join('');
  return `<svg viewBox="0 0 ${CH.w} ${CH.h}" role="img" aria-label="Jeu entre le doigt et la pierre selon l'angle du servo">
    ${grid}${ax}
    <line x1="${CH.l}" x2="${CH.w - CH.r}" y1="${cy(0)}" y2="${cy(0)}" stroke="#0e0e0e" stroke-width="1"/>
    <polyline points="${pts(ac, 56)}" fill="none" stroke="#9a9a9a" stroke-width="1.2" stroke-dasharray="3 3"/>
    <polyline points="${pts(-5, ac)}" fill="none" stroke="#0e0e0e" stroke-width="2"/>
    <line x1="${cx(ac)}" x2="${cx(ac)}" y1="${CH.t}" y2="${cy(0)}" stroke="#0e0e0e" stroke-dasharray="2 2"/>
    <text x="${cx(ac) - 4}" y="${CH.t + 8}" text-anchor="end" fill="#0e0e0e">contact ${fr(ac)}°</text>
    <line x1="${cx(contact.cmd)}" x2="${cx(contact.cmd)}" y1="${cy(0) - 5}" y2="${cy(0) + 5}" stroke="#0e0e0e" stroke-width="2"/>
    <text x="${cx(contact.cmd) + 4}" y="${cy(0) + 13}">consigne ${fr(contact.cmd)}°</text>
    <text x="${CH.l + 2}" y="${CH.t + 2}">mm</text>
    <line class="cmdline" x1="0" x2="0" y1="${cy(0) - 9}" y2="${cy(0)}" stroke="#0e0e0e" stroke-width="1.5" opacity="0"/>
    <circle class="dot" r="4.5" fill="#0e0e0e" stroke="#fff" stroke-width="1.5"/>
  </svg>`;
}

export function createConsole(app) {
  const root = el('div', 'sim');
  app.appendChild(root);

  // ------------------------------------------------------------- en-tête
  const hd = el('header', 'hd');
  hd.appendChild(el('div', '', `<div class="mono kicker">CDR 2027 · The Legend of Camelot · étude d'actionneur</div>
    <h1>Manipulateur à fourches</h1>
    <p class="mono">Mur de 3 pierres · 6 servos · une seule entrée : le temps de la séquence</p>`));
  const tour = el('button', 'tour mono');
  tour.type = 'button';
  hd.appendChild(tour);
  root.appendChild(hd);

  // ------------------------------------------------------------- vue 3D
  const body = el('div', 'body');
  root.appendChild(body);
  const view = el('section', 'view');
  view.setAttribute('aria-label', 'Vue 3D du manipulateur');
  body.appendChild(view);
  const canvas = el('canvas');
  canvas.id = 'gl';
  view.appendChild(canvas);
  const lay = el('div', 'lay', '<svg></svg>');
  view.appendChild(lay);
  const annSvg = lay.firstChild;
  const phase = el('div', 'phase', '<div class="n mono"><span class="i"></span><span class="tt"></span></div><h2></h2><p></p>');
  view.appendChild(phase);
  const tools = el('div', 'tools');
  view.appendChild(tools);
  const btn = {};
  const grp = (cap, items) => {
    const g = el('div', 'grp mono');
    g.appendChild(el('span', 'gcap', cap));
    for (const [k, label] of items) {
      const b = el('button', 'bt', label);
      b.type = 'button';
      g.appendChild(b);
      btn[k] = b;
    }
    tools.appendChild(g);
  };
  grp('Vue', VIEWS);
  grp('Afficher', DISPLAY);
  view.appendChild(el('div', 'hint mono', 'Glisser : tourner · molette : zoom · espace : pause'));
  const veil = el('div', 'veil');
  view.appendChild(veil);
  const cur = el('div', 'cur', '<svg width="18" height="18" viewBox="0 0 18 18"><path d="M1 1l6 15 2-6 6-2z" fill="#0e0e0e" stroke="#fff" stroke-width="1.2"/></svg>');
  const ring = el('div', 'ring');
  root.appendChild(cur);
  root.appendChild(ring);

  // ------------------------------------------------------------- mesures
  const col = el('aside', 'col');
  body.appendChild(col);
  const pn = (title, n, html) => {
    const p = el('section', 'pn', `<h3>${title}<span>${n}</span></h3>${html}`);
    col.appendChild(p);
    return p;
  };
  const rowsHtml = [2, 1, 0]
    .map((r) => `<span class="h mono">R${r + 1}</span>` + [1, -1].map((s) => `<div class="sv" data-r="${r}" data-s="${s}"><div class="top"><span class="mono">${s > 0 ? 'G' : 'D'}${r + 1}</span><b>0°</b></div><div class="st mono">libre</div><div class="gauge"><i></i><u></u></div></div>`).join(''))
    .join('');
  const pServo = pn('Servos', '01', `<div class="servos"><span></span><span class="h mono">Gauche</span><span class="h mono">Droite</span>${rowsHtml}</div>`);
  const pGrip = pn('Serrage', '02', `<div class="big"><b class="f">0,0</b><small class="mono">° de calage</small></div><div class="meter"><i></i></div>
    <dl class="kv"><dt>Angle de contact</dt><dd>${fr(contact.angle)}°</dd><dt>Bras de levier</dt><dd>${fr(contact.lever, 0)} mm</dd>
    <dt>Consigne de serrage</dt><dd>${fr(contact.cmd)}°</dd><dt>Doigt sur la pierre</dt><dd class="hold">-</dd></dl>`);
  const pChart = pn('Jeu doigt / pierre', '03', `<div class="chart">${chartSvg()}</div>`);
  const pPos = pn('Position', '04', `<dl class="kv"><dt>Façade / mur</dt><dd class="gap"></dd><dt>Vitesse du robot</dt><dd class="spd"></dd><dt>Déplacement du mur</dt><dd class="wall"></dd></dl>`);
  pn('Hypothèses', '05', `<p class="note">Prototype à l'étude, pas encore fabriqué. Cotes de l'étude du 24/09/2026. Servo à ${G.speed} °/s, consigne ${G.overtravel}° au-delà du contact pour caler. Aucun effort calculé. Le châssis est schématique.</p>`);

  // ------------------------------------------------------------- frise
  const tl = el('footer', 'tl');
  root.appendChild(tl);
  const play = el('button', 'play', PAUSE);
  play.type = 'button';
  play.setAttribute('aria-label', 'Lecture / pause');
  tl.appendChild(play);
  btn.play = play;
  const track = el('div', 'track');
  track.setAttribute('role', 'slider');
  track.setAttribute('aria-label', 'Temps de la séquence');
  track.innerHTML = '<div class="rail"></div><div class="fill"></div><div class="knob"></div>' + PHASES.map((p, i) => `<div class="tick mono" style="left:${(p.t / DUR) * 100}%">${String(i + 1).padStart(2, '0')}<span> ${p.name}</span></div>`).join('');
  tl.appendChild(track);
  const time = el('div', 'clock mono');
  tl.appendChild(time);
  const speedG = el('div', 'speed mono');
  for (const [k, v] of [['s05', '×0,5'], ['s1', '×1'], ['s2', '×2']]) {
    const b = el('button', 'bt', v);
    b.type = 'button';
    speedG.appendChild(b);
    btn[k] = b;
  }
  tl.appendChild(speedG);

  // ------------------------------------------------------------- mise à jour
  const q = (p, s) => p.querySelector(s);
  const svEls = [...pServo.querySelectorAll('.sv')];
  const dot = q(pChart, '.dot');
  const cmdLine = q(pChart, '.cmdline');
  const ticks = [...track.querySelectorAll('.tick')];
  const span = (a) => ((a - G.servo.min) / (G.servo.max - G.servo.min)) * 100;
  for (const s of svEls) q(s, 'u').style.left = `${span(contact.angle)}%`;
  const last = {};
  const set = (key, node, text) => {
    if (last[key] !== text) {
      last[key] = text;
      node.textContent = text;
    }
  };

  /** st : kin.state(t). ctx : {tourOn, paused, view, display, speed, veil, cursor}. */
  const update = (st, ctx) => {
    const P = PHASES[st.phase];
    set('pi', q(phase, '.i'), `Phase ${String(st.phase + 1).padStart(2, '0')} / ${String(PHASES.length).padStart(2, '0')}`);
    set('pt', q(phase, '.tt'), `t = ${fr(st.t)} s`);
    set('ph', q(phase, 'h2'), P.name);
    set('pp', q(phase, 'p'), P.text);
    const stTxt = st.held ? (st.stall >= 1 ? 'calé' : 'serre') : st.cmd > 0.05 ? 'tourne' : 'libre';
    for (const s of svEls) {
      set('sva' + s.dataset.r + s.dataset.s, q(s, 'b'), `${fr(st.angle)}°`);
      set('svs' + s.dataset.r + s.dataset.s, q(s, '.st'), stTxt);
      s.classList.toggle('held', st.held);
      const g = q(s, 'i');
      const a0 = span(0);
      const a1 = span(st.angle);
      g.style.left = `${Math.min(a0, a1)}%`;
      g.style.width = `${Math.abs(a1 - a0)}%`;
    }
    set('f', q(pGrip, '.f'), fr(st.over));
    q(pGrip, '.meter i').style.width = `${st.stall * 100}%`;
    set('hold', q(pGrip, '.hold'), st.held ? (st.stall >= 1 ? 'calé' : 'au contact') : '-');
    dot.setAttribute('cx', cx(st.angle));
    dot.setAttribute('cy', cy(st.clear));
    cmdLine.setAttribute('x1', cx(Math.max(st.cmd, CH.a0)));
    cmdLine.setAttribute('x2', cx(Math.max(st.cmd, CH.a0)));
    cmdLine.setAttribute('opacity', st.held ? 1 : 0);
    set('gap', q(pPos, '.gap'), `${fr(st.gap - st.wall, 0)} mm`);
    set('spd', q(pPos, '.spd'), `${fr(Math.abs(st.speed), 0)} mm/s ${st.speed > 1 ? 'recule' : st.speed < -1 ? 'avance' : ''}`.trim());
    set('wall', q(pPos, '.wall'), `${fr(st.wall, 0)} mm`);

    const k = st.t / DUR;
    q(track, '.fill').style.width = `${k * 100}%`;
    q(track, '.knob').style.left = `${k * 100}%`;
    track.setAttribute('aria-valuenow', st.t.toFixed(1));
    ticks.forEach((tk, i) => tk.classList.toggle('on', i === st.phase));
    set('time', time, `${fr(st.t)} / ${fr(DUR)} s`);
    if (last.playIcon !== ctx.paused) {
      last.playIcon = ctx.paused;
      play.innerHTML = ctx.paused ? PLAY : PAUSE;
    }
    for (const [k2] of VIEWS) btn[k2].classList.toggle('on', ctx.view === k2);
    for (const [k2] of DISPLAY) btn[k2].classList.toggle('on', !!ctx.display[k2]);
    btn.s05.classList.toggle('on', ctx.speed === 0.5);
    btn.s1.classList.toggle('on', ctx.speed === 1);
    btn.s2.classList.toggle('on', ctx.speed === 2);
    if (last.tour !== ctx.tourOn) {
      last.tour = ctx.tourOn;
      tour.classList.toggle('on', ctx.tourOn);
      tour.innerHTML = ctx.tourOn ? '<i></i>Visite auto · cliquer pour prendre la main' : '<i></i>Reprendre la visite';
    }
    veil.style.opacity = ctx.veil;
    // curseur de la visite, en coordonnées de la page
    const c = ctx.cursor;
    cur.style.display = c ? 'block' : 'none';
    if (c) cur.style.transform = `translate(${c.x}px, ${c.y}px)`;
    ring.style.opacity = c && c.ring > 0 ? c.ring : 0;
    if (c && c.ring > 0) {
      ring.style.left = `${c.rx}px`;
      ring.style.top = `${c.ry}px`;
      ring.style.transform = `scale(${1.6 - 0.6 * c.ring})`;
    }
  };

  // étiquettes reliées à un point de la 3D : [{x, y, ax, ay, text}] en px du canvas
  const pool = [];
  const labels = (list) => {
    let svg = '';
    list.forEach((L, i) => {
      if (!pool[i]) {
        pool[i] = el('div', 'lb mono');
        lay.appendChild(pool[i]);
      }
      const d = pool[i];
      d.style.display = 'block';
      d.style.left = `${L.x}px`;
      d.style.top = `${L.y}px`;
      d.style.opacity = L.o;
      if (d.textContent !== L.text) d.textContent = L.text;
      svg += `<g opacity="${L.o}"><line x1="${L.ax}" y1="${L.ay}" x2="${L.x}" y2="${L.y}" stroke="#0e0e0e" stroke-width="1"/><circle cx="${L.ax}" cy="${L.ay}" r="3" fill="#0e0e0e"/></g>`;
    });
    for (let i = list.length; i < pool.length; i++) pool[i].style.display = 'none';
    annSvg.innerHTML = svg;
  };

  // haut libre de la vue pour les étiquettes : sous la carte de phase et les boutons
  const safeTop = () => {
    const v = view.getBoundingClientRect();
    const tb = tools.getBoundingClientRect();
    const top = tb.top < v.top + v.height / 2 ? tb.bottom : 0;
    return Math.max(phase.getBoundingClientRect().bottom, top) - v.top + 34;
  };

  return {root, canvas, view, btn, track, tour, update, labels, safeTop};
}
