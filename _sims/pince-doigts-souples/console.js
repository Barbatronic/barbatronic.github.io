// L'interface autour de la 3D : en-tête, carte de phase, vues et affichages, colonne de mesures, frise de la séquence.
// Chaque valeur affichée vient de kin.js (cotes, modèle, state(t)) : rien n'est saisi à la main.
// Sorties : createConsole(app) -> {root, canvas, view, btn, track, tour, update(st, ctx), labels(list), safeTop()}.
import {apply, CURL, DUR, fingerPose, G, LEVER, M, PHASES, SEG, segOutline, TH_CAD, TH_MAX} from './kin.js';

export const VIEWS = [['iso', '3/4'], ['dessus', 'Dessus'], ['face', 'Face'], ['doigt', 'Doigt'], ['bras', 'Bras']];
export const DISPLAY = [['xray', 'TPU transparent'], ['trace', 'Trajectoire du bout']];

const fr = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',').replace('-', '−') : '-');
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const PLAY = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
const PAUSE = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor"/></svg>';

// coupe du doigt droit vue de dessus, en mm : u vers la droite, v vers le haut de la figure
const PV = {u0: -32, u1: 104, v0: -12, v1: 74};
const PW = 300;
const PH = Math.round((PW * (PV.v1 - PV.v0)) / (PV.u1 - PV.u0));
const px = (u) => (((u - PV.u0) / (PV.u1 - PV.u0)) * PW).toFixed(1);
const py = (v) => ((1 - (v - PV.v0) / (PV.v1 - PV.v0)) * PH).toFixed(1);
const path = (pts) => pts.map(([u, v], i) => `${i ? 'L' : 'M'}${px(u)} ${py(v)}`).join('') + 'Z';
function profileSvg(st) {
  const pose = fingerPose(st.th);
  const segs = SEG.map((_, j) => path(segOutline(j).map((p) => apply(pose[j], p)))).join('');
  const cab = SEG.flatMap(([u0, u1], j) => [j === 0 ? u0 - 6 : u0, j === 5 ? u1 - 3 : u1].map((u) => apply(pose[j], [u, G.finger.cable])))
    .map(([u, v], i) => `${i ? 'L' : 'M'}${px(u)} ${py(v)}`).join('');
  // contacts : un repère par point de contact, sans valeur d'effort
  const arrows = st.pts.map((c) => {
    const L = 9;
    const a = [c.q[0] + c.n[0] * (L + 2), c.q[1] + c.n[1] * (L + 2)];
    const b = [c.q[0] + c.n[0] * 1.5, c.q[1] + c.n[1] * 1.5];
    return `<line x1="${px(a[0])}" y1="${py(a[1])}" x2="${px(b[0])}" y2="${py(b[1])}" stroke="#0e0e0e" stroke-width="2" marker-end="url(#ah)"/>`;
  }).join('');
  const hinges = G.finger.hinges.map((h, i) => {
    const q = apply(pose[i], [h, (G.finger.spine[0] + G.finger.spine[1]) / 2]);
    const cls = st.blocked[i] === 1 ? 'hc' : st.blocked[i] === 2 ? 'hx' : 'hf';
    return `<circle class="${cls}" cx="${px(q[0])}" cy="${py(q[1])}" r="2.6"/>`;
  }).join('');
  return `<defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8z" fill="#0e0e0e"/></marker></defs>
    <rect x="${px(PV.u0)}" y="${py(44.1)}" width="${(+px(20.6 - G.rootX) - +px(PV.u0)).toFixed(1)}" height="${(+py(-6.8) - +py(44.1)).toFixed(1)}" fill="#e2e3e5" stroke="#0e0e0e" stroke-width="1"/>
    <text x="${px(-24)}" y="${py(20)}" text-anchor="middle">nez</text>
    <circle cx="${px(st.potUV.u)}" cy="${py(st.potUV.v)}" r="${((st.potUV.r / (PV.u1 - PV.u0)) * PW).toFixed(1)}" fill="#fff" stroke="#0e0e0e" stroke-width="1" stroke-dasharray="3 2"/>
    <text x="${px(st.potUV.u)}" y="${(+py(st.potUV.v) + 3).toFixed(1)}" text-anchor="middle">pot ø${fr(2 * st.potUV.r, 0)}</text>
    <path d="${segs}" fill="#f4f4f2" stroke="#0e0e0e" stroke-width="1" stroke-linejoin="round"/>
    <path d="${cab}" fill="none" stroke="#0e0e0e" stroke-width="1.4" stroke-dasharray="${st.s > 0.05 ? '0' : '2 2'}"/>
    ${hinges}${arrows}`;
}

export function createConsole(app) {
  const root = el('div', 'sim');
  app.appendChild(root);

  // ------------------------------------------------------------- en-tête
  const hd = el('header', 'hd');
  hd.appendChild(el('div', '', `<div class="mono kicker">CDR 2024 · Farming Mars · le Jardinier</div>
    <h1>Pince à doigts souples</h1>
    <p class="mono">Doigts en TPU tirés par câble · bras de levage en parallélogramme · une seule entrée : le temps de la séquence</p>`));
  const tour = el('button', 'tour mono');
  tour.type = 'button';
  hd.appendChild(tour);
  root.appendChild(hd);

  // ------------------------------------------------------------- vue 3D
  const body = el('div', 'body');
  root.appendChild(body);
  const view = el('section', 'view');
  view.setAttribute('aria-label', 'Vue 3D de la pince');
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
  const pServo = pn('Servo et câble', '01', `<div class="big"><b class="phi">0,0</b><small class="mono">° de poulie</small></div><div class="meter"><i></i></div>
    <dl class="kv"><dt>Câble tiré</dt><dd class="s"></dd><dt>Rayon de la poulie</dt><dd>${G.pulley.r} mm</dd><dt>1 mm de câble</dt><dd>${fr(1 / (LEVER * Math.PI / 180), 1)}° d'encoches</dd><dt>Servo</dt><dd class="sv"></dd></dl>`);
  const pLift = pn('Levage', '02', `<div class="big"><b class="arm">0</b><small class="mono">° sous l'horizontale</small></div><div class="meter"><i></i></div>
    <dl class="kv"><dt>Doigts au-dessus du sol</dt><dd class="hgt"></dd><dt>Recul vers le robot</dt><dd class="adv"></dd><dt>Pot levé de</dt><dd class="pot"></dd><dt>Bras</dt><dd>2 × ${G.lift.L} mm, ${fr(G.lift.upZ - G.lift.lowZ)} mm d'écart</dd></dl>`);
  const pFinger = pn('Le doigt, vu de dessus', '03', `<div class="chart prof"><svg viewBox="0 0 ${PW} ${PH}" role="img" aria-label="Coupe du doigt droit et du pot, vue de dessus"></svg></div>
    <div class="hinges mono">${G.finger.hinges.map((_, i) => `<div class="hg" data-i="${i}"><span>C${i + 1}</span><b>0°</b><i><u></u></i></div>`).join('')}</div>
    <p class="note legend mono"><span class="k hf"></span>libre <span class="k hc"></span>bloquée par le pot <span class="k hx"></span>encoche fermée</p>`);
  const pGrip = pn('Contact', '04', `<div class="big"><b class="g">0°</b><small class="mono">courbure totale du doigt</small></div>
    <dl class="kv"><dt>Segments au contact</dt><dd class="nc"></dd><dt>Fermeture maxi du doigt</dt><dd>5 × ${fr(TH_MAX)}° = ${fr(5 * TH_MAX, 0)}°</dd><dt>Bras de levier du câble</dt><dd>${fr(LEVER)} mm</dd></dl>`);
  pn('Hypothèses', '05', `<p class="note">Cotes du CAO (finger-filaflex.FCStd, robots_2024.FCStd) : 6 segments au pas de 18 mm, charnière de 2 mm, câble à ${fr(LEVER, 2)} mm de la charnière, poulie de rayon ${G.pulley.r} mm ; bras de levage de ${G.lift.L} mm, pivots espacés de ${fr(G.lift.upZ - G.lift.lowZ)} mm, pose du CAO à ${fr(M.thHigh)}°. Matière : FilaFlex ${M.shore}A (vidéo du prototype). Butée d'une encoche : son haut se ferme, ${fr(TH_MAX)}° (flancs rigides : ${fr(TH_CAD)}°, démenti par la vidéo). Charnières identiques ; le pot glisse au sol sans résister jusqu'au nez, puis un segment qui le touche bloque les charnières en amont. Supposé : bras en bas à ${M.thLow}°, pose du CAO = bras en haut. Aucun effort calculé. Consigne du câble ralentie à ${M.rate} °/s. Pots et doigts du CAO (modélisés fermés) remplacés par le calcul.</p>`);

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
  const prof = q(pFinger, 'svg');
  const hgEls = [...pFinger.querySelectorAll('.hg')];
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

    set('phi', q(pServo, '.phi'), fr(st.phi));
    q(pServo, '.meter i').style.width = `${(st.phi / CURL.phiEnd) * 100}%`;
    set('s', q(pServo, '.s'), `${fr(st.s)} mm sur ${fr(CURL.sEnd)}`);
    set('sv', q(pServo, '.sv'), `${G.servo.name}${st.held ? ', arrêté' : ''}`);
    set('arm', q(pLift, '.arm'), fr(st.arm, 0));
    q(pLift, '.meter i').style.width = `${((st.arm - M.thHigh) / (M.thLow - M.thHigh)) * 100}%`;
    set('hgt', q(pLift, '.hgt'), `${fr(st.height, 0)} mm`);
    set('adv', q(pLift, '.adv'), `${fr(-st.lift.dz, 0)} mm`);
    set('pot', q(pLift, '.pot'), st.pot.dy > 0.5 ? `${fr(st.pot.dy, 0)} mm` : '-');

    const key = st.th.map((x) => x.toFixed(2)).join() + st.pts.length + (st.s > 0.05) + st.potUV.u.toFixed(1);
    if (last.prof !== key) {
      last.prof = key;
      prof.innerHTML = profileSvg(st);
    }
    hgEls.forEach((h, i) => {
      set('hg' + i, q(h, 'b'), `${fr(st.th[i])}°`);
      q(h, 'u').style.width = `${(st.th[i] / TH_MAX) * 100}%`;
      h.dataset.s = ['f', 'c', 'x'][st.blocked[i]];
    });

    set('g', q(pGrip, '.g'), `${fr(st.th.reduce((a, b) => a + b, 0), 0)}°`);
    const nc = st.touch.filter(Boolean).length;
    set('nc', q(pGrip, '.nc'), nc ? st.touch.map((x, j) => (x ? `S${j}` : '')).filter(Boolean).join(', ') : 'aucun');

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
