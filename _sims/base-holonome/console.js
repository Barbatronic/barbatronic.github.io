// L'interface autour de la 3D : en-tête, carte de phase, vues et affichages, colonne de mesures, frise de la séquence.
// Chaque valeur affichée vient de kin.js (cotes, cinématique, state(t)) : rien n'est saisi à la main.
// Sorties : createConsole(app) -> {root, canvas, view, btn, track, tour, update(st, ctx), labels(list), safeTop()}.
import {DUR, G, M, PHASES, RATIO, state, WHEELS} from './kin.js';

export const VIEWS = [['iso', '3/4'], ['dessus', 'Dessus'], ['roue', 'Roue 1'], ['moteur', 'Moteur'], ['table', 'Table']];
export const DISPLAY = [['xray', 'Carters transparents'], ['vec', 'Vecteurs'], ['path', 'Trajectoire']];

const fmt = (x, d = 0) => x.toFixed(d).replace('.', ',');
const fr = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',').replace('-', '−') : '-');
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const PLAY = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
const PAUSE = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor"/></svg>';

// vue de dessus dans le repère du robot (avant en haut) : roues, vitesse de jante, roulement des galets, vitesse du robot
const SV = 300;
const SK = 0.22;   // px par mm/s
const sx = (x) => (SV / 2 + x * 0.62).toFixed(1);
const sy = (y) => (SV / 2 - y * 0.62).toFixed(1);
const D2R = Math.PI / 180;
function line(x0, y0, x1, y1, cls) {
  return `<line class="${cls}" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" marker-end="url(#${cls === 'sl' ? 'ag' : 'ah'})"/>`;
}
function topSvg(st) {
  let out = '';
  // contour : colonnes à 120°
  out += `<circle cx="${sx(0)}" cy="${sy(0)}" r="${(G.colR + G.col.d) * 0.62}" class="ol"/>`;
  WHEELS.forEach((w, i) => {
    const s = st.wheels[i];
    const cx = G.L * w.c;
    const cy = G.L * w.s;
    const px = +sx(cx);
    const py = +sy(cy);
    // roue : rectangle d'axe radial
    const ang = -w.a;
    out += `<g transform="translate(${px} ${py}) rotate(${ang})"><rect x="${-G.wheel.width * 0.31}" y="${-G.wheel.r * 0.62}" width="${G.wheel.width * 0.62}" height="${G.wheel.r * 1.24}" class="wh"/></g>`;
    out += `<text x="${(+sx(cx * 1.9)).toFixed(1)}" y="${(+sy(cy * 1.9) + 3).toFixed(1)}" text-anchor="middle">${i + 1}</text>`;
    // jante : direction t = (-sin a, cos a)
    const tx = -w.s * s.rim * SK;
    const ty = w.c * s.rim * SK;
    if (Math.abs(s.rim) > 4) out += line(px, py, px + tx, py - ty, 'dr');
    // galets : direction radiale
    const gx = w.c * s.slip * SK;
    const gy = w.s * s.slip * SK;
    if (Math.abs(s.slip) > 4) out += line(px, py, px + gx, py - gy, 'sl');
  });
  if (st.speed > 4) out += line(+sx(0), +sy(0), +sx(0) + st.vx * SK, +sy(0) - st.vy * SK, 'rv');
  if (Math.abs(st.w) > 2) {
    const r = 22;
    const a1 = (st.w > 0 ? 200 : -20) * D2R;
    const p0 = [+sx(0) + r, +sy(0)];
    const p1 = [+sx(0) + r * Math.cos(a1), +sy(0) - r * Math.sin(a1)];
    out += `<path d="M${p0[0]} ${p0[1]} A${r} ${r} 0 1 ${st.w > 0 ? 0 : 1} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" class="rv" marker-end="url(#ah)"/>`;
  }
  return `<defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8z" fill="#0e0e0e"/></marker>
    <marker id="ag" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8a8a8a"/></marker></defs>
    <text x="${SV / 2}" y="12" text-anchor="middle">avant</text>${out}`;
}
// échelle des barres : plus grande vitesse moteur de la boucle
const RPM_MAX = (() => {
  let m = 1;
  for (let t = 0; t < DUR; t += 0.02) for (const w of state(t).wheels) m = Math.max(m, Math.abs(w.motorRpm));
  return m;
})();

export function createConsole(app) {
  const root = el('div', 'sim');
  app.appendChild(root);

  // ------------------------------------------------------------- en-tête
  const hd = el('header', 'hd');
  hd.appendChild(el('div', '', `<div class="mono kicker">CDR 2024 · Farming Mars · le Jardinier</div>
    <h1>Base holonome</h1>
    <p class="mono">3 roues omnidirectionnelles à 120° · 3 moteurs pas à pas · une seule entrée : le temps de la boucle</p>`));
  const tour = el('button', 'tour mono');
  tour.type = 'button';
  hd.appendChild(tour);
  root.appendChild(hd);

  // ------------------------------------------------------------- vue 3D
  const body = el('div', 'body');
  root.appendChild(body);
  const view = el('section', 'view');
  view.setAttribute('aria-label', 'Vue 3D de la base holonome');
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
  const pCmd = pn('Consigne, repère du robot', '01', `<div class="big"><b class="v">0</b><small class="mono">mm/s</small></div>
    <dl class="kv"><dt>vx, vers la droite</dt><dd class="vx"></dd><dt>vy, vers l'avant</dt><dd class="vy"></dd><dt>ω, rotation</dt><dd class="w"></dd></dl>`);
  const pTop = pn('Vue de dessus', '02', `<div class="chart top"><svg viewBox="0 0 ${SV} ${SV}" role="img" aria-label="Vitesses des roues, vue de dessus"></svg></div>
    <p class="note legend mono"><span class="k dr"></span>jante <span class="k sl"></span>galets <span class="k rv"></span>robot</p>`);
  const pWheels = pn('Roues et moteurs', '03', `<div class="wrows">${WHEELS.map((w, i) => `<div class="wr" data-i="${i}"><span class="mono">R${i + 1} · ${w.a}°</span><b class="mono rim"></b><span class="mono rpm"></span><i><u></u></i></div>`).join('')}</div>
    <p class="note">v<sub>i</sub> = −sin α<sub>i</sub>·vx + cos α<sub>i</sub>·vy + L·ω, L = ${G.L} mm. Moteur : ${fmt(RATIO)} tours par tour de roue (poulies ${G.belt.motor} et ${G.belt.wheel} dents).</p>`);
  pn('Hypothèses', '04', `<p class="note">Cotes du CAO (robot_holonome, colonne-moteur, omniwheel) : roues ø${2 * G.wheel.r} mm, 3 disques de ${G.wheel.rollers} galets, axes à 120°, ${G.L} mm du centre aux galets au sol, courroie T5 ${G.belt.motor} / ${G.belt.wheel} dents, moteurs ${G.motor.name} (${G.motor.step}° par pas). Exemple de consigne : ${M.v} mm/s et ${M.w} °/s au plus, ${M.micro} micro-pas : ce ne sont pas les réglages du match. Roues sans glissement, aucun effort calculé. 3D : pièces du CAO, couleurs du robot réel ; visserie, câbles, carters latéraux et batterie omis, profilés redessinés.</p>`);

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
  const top = q(pTop, 'svg');
  const wrEls = [...pWheels.querySelectorAll('.wr')];
  const ticks = [...track.querySelectorAll('.tick')];
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

    set('v', q(pCmd, '.v'), fr(st.speed, 0));
    set('vx', q(pCmd, '.vx'), `${fr(st.vx, 0)} mm/s`);
    set('vy', q(pCmd, '.vy'), `${fr(st.vy, 0)} mm/s`);
    set('w', q(pCmd, '.w'), `${fr(st.w, 0)} °/s`);
    const key = st.wheels.map((w) => w.rim.toFixed(0) + w.slip.toFixed(0)).join() + st.vx.toFixed(0) + st.vy.toFixed(0) + st.w.toFixed(0);
    if (last.top !== key) {
      last.top = key;
      top.innerHTML = topSvg(st);
    }
    wrEls.forEach((r, i) => {
      const w = st.wheels[i];
      set('rim' + i, q(r, '.rim'), `${fr(w.rim, 0)} mm/s`);
      set('rpm' + i, q(r, '.rpm'), `${fr(w.motorRpm, 0)} tr/min · ${fr(w.steps / 1000, 1)} kHz`);
      const u = q(r, 'u');
      const x = (w.motorRpm / RPM_MAX) * 50;
      u.style.left = `${50 + Math.min(0, x)}%`;
      u.style.width = `${Math.abs(x)}%`;
      r.classList.toggle('idle', Math.abs(w.rim) < 1 && st.speed + Math.abs(st.w) > 5);
    });

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

  const safeTop = () => {
    const v = view.getBoundingClientRect();
    const tb = tools.getBoundingClientRect();
    const top = tb.top < v.top + v.height / 2 ? tb.bottom : 0;
    return Math.max(phase.getBoundingClientRect().bottom, top) - v.top + 34;
  };

  return {root, canvas, view, btn, track, tour, update, labels, safeTop};
}
