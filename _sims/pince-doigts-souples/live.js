// La page que l'on pilote : séquence en temps réel, frise, vues, affichages, orbite et zoom.
// Laissée seule, elle joue la visite (TOUR) avec un curseur ; un clic, un glisser, la molette ou une touche donnent
// la main au visiteur, 25 s sans rien la rendent à la visite. La visite agit sur le même état que les boutons.
// Sorties : runLive() ; window.LIVE pour la relecture (seek de la visite, état courant).
import {createConsole, DISPLAY, VIEWS} from './console.js';
import {CURL, DUR, FADE, G, PHASES, state} from './kin.js';
import {createStage} from './stage.js';

const IDLE = 25;
const D2R = Math.PI / 180;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (x) => {
  const u = clamp(x, 0, 1);
  return u * u * (3 - 2 * u);
};
const fr = (x, d = 1) => x.toFixed(d).replace('.', ',');
// fenêtre douce : 0 hors de [a, b], 1 dedans, rampes de r secondes
const win = (t, a, b, r = 0.25) => smooth((t - a + r) / r) * (1 - smooth((t - b) / r));
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;

// vues : cible (mm), azimut et élévation (°), distance (mm) ; az = 0 regarde la pince de face, depuis les pots ;
// follow : part du déplacement du robot suivie
const CAM = {
  iso: {tx: 0, ty: 95, tz: 150, az: 40, el: 22, d: 820, follow: 0.6},
  dessus: {tx: 30, ty: 30, tz: 190, az: 0, el: 84, d: 640, follow: 0.6},
  face: {tx: 0, ty: 95, tz: 180, az: 0, el: 8, d: 760, follow: 0.6},
  doigt: {tx: 66, ty: 87, tz: 215, az: 8, el: 64, d: 360, follow: 1, lift: 1},
  bras: {tx: 0, ty: 120, tz: 140, az: 90, el: 4, d: 600, follow: 1},
};
const HOLD = PHASES[3].t + 0.7;

// la visite : morceaux de séquence (durée, temps de séquence de début et de fin, fondu d'entrée)
const SEGS = [
  {d: DUR, s0: 0, s1: DUR, fade: true},
  {d: DUR, s0: 0, s1: DUR, fade: true},
  {d: 4.2, s0: HOLD, s1: HOLD, fade: true},
  {d: DUR - HOLD, s0: HOLD, s1: DUR, fade: false},
];
const TOUR_DUR = SEGS.reduce((a, s) => a + s.d, 0);
// actions de la visite, au temps de visite : un bouton pressé par le curseur
const TOUR = [
  [0.4, 'bras'], [2.6, 'iso'], [3.6, 'doigt'], [7.4, 'bras'], [10.4, 'iso'], [12.8, 'dessus'],
  [16.0, 'xray'], [18.6, 'doigt'], [19.6, 'trace'], [22.6, 'trace'], [23.0, 'xray'], [23.4, 'bras'], [26.4, 'face'],
  [29.4, 'iso'], [31.6, 'dessus'], [34.0, 'iso'],
];
const tourSeq = (tau) => {
  let a = 0;
  for (const s of SEGS) {
    if (tau < a + s.d) {
      const u = tau - a;
      return {t: s.s0 + (s.s1 - s.s0) * (u / s.d), fadeIn: s.fade ? 1 - smooth(u / 0.3) : 0};
    }
    a += s.d;
  }
  return {t: DUR, fadeIn: 0};
};
// état des boutons à un instant de la visite : on rejoue les actions passées
const tourState = (tau) => {
  const s = {view: 'iso', display: {xray: 0, trace: 0}, since: 0};
  for (const [at, k] of TOUR) {
    if (at > tau) break;
    if (CAM[k]) {
      s.view = k;
      s.since = at;
    } else s.display[k] = s.display[k] ? 0 : 1;
  }
  return s;
};

// ce qui travaille à chaque instant de la séquence, pour la teinte d'accent
const accentAt = (t) => {
  const P = Object.fromEntries(PHASES.map((p) => [p.key, p.t]));
  return {
    fingers: Math.max(win(t, P.curl, P.lift), win(t, P.release, P.leave)),
    arm: Math.max(win(t, P.lower, P.approach), win(t, P.lift, P.carry), win(t, P.place, P.release), win(t, P.leave, DUR - FADE)),
    pots: win(t, P.lift, P.release),
  };
};

export async function runLive() {
  const app = document.getElementById('app');
  const ui = createConsole(app);
  const st3 = await createStage({canvas: ui.canvas});

  // ------------------------------------------------------------ qualité
  const TIERS = [{pr: 2, shadow: 2048}, {pr: 1.25, shadow: 1024}, {pr: 1, shadow: 1024}];
  let tier = matchMedia('(pointer: coarse)').matches ? 1 : 0;
  const fit = () => {
    const r = ui.view.getBoundingClientRect();
    st3.resize(Math.max(1, r.width), Math.max(1, r.height), Math.min(devicePixelRatio || 1, TIERS[tier].pr));
  };
  st3.setQuality(TIERS[tier]);
  fit();
  new ResizeObserver(fit).observe(ui.view);

  // ------------------------------------------------------------ état
  let T = 0;
  let seq = 0;
  let speed = 1;
  let paused = false;
  let view = 'iso';
  const disp = Object.fromEntries(DISPLAY.map(([k]) => [k, {on: 0, t: -9}]));
  const off = {az: 0, el: 0, k: 1};
  const cam = {...CAM.iso};
  let wrapT = -9;
  let ring = {t: -9, x: 0, y: 0};
  const eased = (k, dur = 0.6) => {
    const d = disp[k];
    const x = smooth((T - d.t) / dur);
    return d.on ? x : 1 - x;
  };

  // ------------------------------------------------------------ la visite
  const AP = {on: true, t0: 0};
  let lastInput = 0;
  const startTour = () => {
    AP.on = true;
    AP.t0 = T;
    paused = false;
    speed = 1;
    Object.assign(off, {az: 0, el: 0, k: 1});
  };
  const takeOver = () => {
    lastInput = T;
    if (!AP.on) return;
    AP.on = false;
  };
  ui.tour.addEventListener('click', (e) => {
    e.stopPropagation();
    lastInput = T;
    if (AP.on) takeOver();
    else startTour();
  });
  addEventListener('pointerdown', (e) => {
    if (e.target !== ui.tour && !ui.tour.contains(e.target)) takeOver();
  });
  const setDisp = (k, on) => {
    if (disp[k].on !== on) {
      disp[k].on = on;
      disp[k].t = T;
    }
  };
  const center = (b) => {
    const r = b.getBoundingClientRect();
    const o = ui.root.getBoundingClientRect();
    return [r.left - o.left + r.width / 2, r.top - o.top + r.height / 2];
  };
  const press = (b) => {
    const [x, y] = center(b);
    ring = {t: T, x, y};
  };
  // curseur de la visite : glisse vers le prochain bouton, clique à l'heure
  const tourCursor = (tau) => {
    const i = TOUR.findIndex(([at]) => at > tau);
    const prev = TOUR[i - 1] || (i === -1 ? TOUR[TOUR.length - 1] : null);
    const next = i >= 0 ? TOUR[i] : null;
    const vr = ui.view.getBoundingClientRect();
    const o = ui.root.getBoundingClientRect();
    const rest = [vr.left - o.left + vr.width * 0.62, vr.top - o.top + vr.height * 0.55];
    const p0 = prev ? center(ui.btn[prev[1]]) : rest;
    let x = p0[0];
    let y = p0[1];
    if (next) {
      const p1 = center(ui.btn[next[1]]);
      const k = smooth((tau - (next[0] - 0.9)) / 0.75);
      x += (p1[0] - x) * k;
      y += (p1[1] - y) * k;
    }
    const rk = prev ? Math.max(0, 1 - (tau - prev[0]) / 0.5) : 0;
    const rp = prev ? center(ui.btn[prev[1]]) : rest;
    return {x, y, ring: rk, rx: rp[0], ry: rp[1]};
  };

  // ------------------------------------------------------------ commandes
  for (const [k] of VIEWS)
    ui.btn[k].addEventListener('click', () => {
      takeOver();
      press(ui.btn[k]);
      view = k;
      Object.assign(off, {az: 0, el: 0, k: 1});
    });
  for (const [k] of DISPLAY)
    ui.btn[k].addEventListener('click', () => {
      takeOver();
      press(ui.btn[k]);
      setDisp(k, disp[k].on ? 0 : 1);
    });
  ui.btn.play.addEventListener('click', () => {
    takeOver();
    if (seq >= DUR - 1e-3) seq = 0;
    paused = !paused;
  });
  for (const [k, v] of [['s05', 0.5], ['s1', 1], ['s2', 2]])
    ui.btn[k].addEventListener('click', () => {
      takeOver();
      speed = v;
    });
  const scrub = (e) => {
    const r = ui.track.getBoundingClientRect();
    seq = clamp((e.clientX - r.left) / r.width, 0, 1) * DUR;
    paused = true;
    lastInput = T;
  };
  ui.track.addEventListener('pointerdown', (e) => {
    takeOver();
    ui.track.setPointerCapture(e.pointerId);
    scrub(e);
    const move = (ev) => scrub(ev);
    const up = () => {
      ui.track.removeEventListener('pointermove', move);
      ui.track.removeEventListener('pointerup', up);
    };
    ui.track.addEventListener('pointermove', move);
    ui.track.addEventListener('pointerup', up);
  });
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const v = VIEWS[Number(e.key) - 1];
    if (v) ui.btn[v[0]].click();
    else if (e.key === ' ') ui.btn.play.click();
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      takeOver();
      paused = true;
      seq = clamp(seq + (e.key === 'ArrowRight' ? 0.1 : -0.1), 0, DUR);
    } else return;
    e.preventDefault();
  });
  let drag = null;
  const cv = ui.canvas;
  cv.addEventListener('pointerdown', (e) => {
    drag = {x: e.clientX, y: e.clientY};
    cv.setPointerCapture(e.pointerId);
    cv.classList.add('drag');
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drag) return;
    off.az -= (e.clientX - drag.x) * 0.3;
    off.el = clamp(off.el + (e.clientY - drag.y) * 0.2, -30, 70);
    drag = {x: e.clientX, y: e.clientY};
    lastInput = T;
  });
  const endDrag = () => {
    drag = null;
    cv.classList.remove('drag');
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  cv.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      takeOver();
      off.k = clamp(off.k * Math.exp(e.deltaY * 0.0012), 0.35, 2.4);
    },
    {passive: false},
  );

  // ------------------------------------------------------------ étiquettes
  const P = PHASES.map((p) => p.t);
  const pc = st3.pince;
  const F = G.finger;
  const Q = Object.fromEntries(PHASES.map((p) => [p.key, p.t]));
  const LABELS = [
    // [visibilité(t), ancre(s), texte(s)]
    [(t) => win(t, 0.2, Q.lower - 0.05), (s) => pc.fingerWorld(1, [62, F.v[0]], s), () => `Doigt TPU ${fr(F.tip - F.root[0])} mm, 5 encoches`],
    [(t) => win(t, Q.lower + 0.1, Q.approach - 0.1), (s) => pc.armWorld(s), (s) => `Bras parallèles ${G.lift.L} mm : ${fr(s.arm, 0)}°`],
    [(t) => win(t, Q.approach, Q.curl - 0.05), (s) => pc.tubeWorld(-1, s), () => `Câble dans tube PTFE ${G.tube.id} × ${G.tube.od}`],
    [(t) => win(t, Q.curl + 0.1, Q.grip - 0.6), (s) => pc.tubeWorld(1, s), (s) => `${fr(s.s)} mm de câble tirés`],
    [(t) => win(t, Q.grip - 0.5, Q.lift + 0.1), (s) => (s.pts[0] ? pc.fingerWorld(1, s.pts[0].q, s) : null), (s) => `Contact : ${s.pts.map((c) => 'S' + c.j).reverse().join(', ')}`],
    [(t) => win(t, Q.lift + 0.2, Q.place), (s) => pc.potWorld(-1, s).setY(G.pot.h + s.pot.dy), (s) => `Pot levé de ${fr(s.pot.dy, 0)} mm`],
    [(t) => win(t, Q.place + 0.2, Q.release + 0.4), (s) => pc.armWorld(s), (s) => `Bras à ${fr(s.arm, 0)}°`],
  ];
  const placeLabels = (s, vis) => {
    const out = [];
    const w = st3.size.w;
    const top = ui.safeTop();
    for (const [v, anchor, text] of LABELS) {
      const o = v(s.t) * vis;
      if (o < 0.02) continue;
      const a0 = anchor(s);
      if (!a0) continue;
      const a = Array.isArray(a0) ? a0 : [a0.x, a0.y, a0.z];
      const p = st3.project(a[0], a[1], a[2]);
      if (!p) continue;
      const dx = p[0] > w * 0.72 ? -90 : 34;
      out.push({ax: p[0], ay: p[1], x: clamp(p[0] + dx, 8, w - 150), y: Math.max(top, p[1] - 30), text: text(s), o});
    }
    // deux étiquettes qui se recouvrent : la plus basse descend
    out.sort((a, b) => a.y - b.y);
    for (let i = 1; i < out.length; i++)
      for (let j = 0; j < i; j++) {
        const a = out[j];
        const b = out[i];
        const wa = a.text.length * 7.6 + 16;
        const wb = b.text.length * 7.6 + 16;
        if (b.y - a.y < 30 && b.x < a.x + wa && a.x < b.x + wb) b.y = a.y + 30;
      }
    ui.labels(out);
  };

  // ------------------------------------------------------------ boucle
  startTour();
  let last = performance.now();
  const perf = {n: 0, sum: 0, age: 0};
  let current = state(0);
  const frame = (now) => {
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    T += dt;
    // qualité : on descend d'un cran si l'image dépasse 22 ms en moyenne
    if (tier < TIERS.length - 1) {
      perf.age += dt;
      if (perf.age > 1) {
        perf.sum += dt;
        perf.n++;
        if (perf.n >= 30) {
          if (perf.sum / perf.n > 0.022) {
            tier++;
            st3.setQuality(TIERS[tier]);
            fit();
          }
          Object.assign(perf, {n: 0, sum: 0, age: 0});
        }
      }
    }

    let tgt;
    let cursor = null;
    let fadeIn = 0;
    if (AP.on) {
      const tau = AP.frozen ?? (T - AP.t0) % TOUR_DUR;
      const ts = tourSeq(tau);
      seq = ts.t;
      fadeIn = ts.fadeIn;
      const s = tourState(tau);
      view = s.view;
      for (const [k] of DISPLAY) setDisp(k, s.display[k]);
      tgt = {...CAM[view]};
      cursor = tourCursor(tau);
    } else {
      if (T - lastInput > IDLE) startTour();
      if (!paused) {
        seq += dt * speed;
        if (seq >= DUR) {
          seq -= DUR;
          wrapT = T;
        }
      }
      fadeIn = 1 - smooth((T - wrapT) / 0.3);
      tgt = {...CAM[view]};
      tgt.az += off.az;
      tgt.el = clamp(tgt.el + off.el, -10, 88);
      tgt.d *= off.k;
      const rk = Math.max(0, 1 - (T - ring.t) / 0.5);
      if (rk > 0) cursor = {x: -99, y: -99, ring: rk, rx: ring.x, ry: ring.y};
    }
    const s = state(seq);
    current = s;
    tgt.tz += s.z * tgt.follow;
    if (tgt.lift) {
      tgt.ty += s.lift.dy;
      tgt.tz += s.lift.dz;
    }
    const k = 1 - Math.exp(-dt / (AP.on ? 0.22 : 0.3));
    cam.az += wrap(tgt.az - cam.az) * k;
    for (const key of ['tx', 'ty', 'tz', 'el', 'd']) cam[key] += (tgt[key] - cam[key]) * k;

    const v3 = {xray: eased('xray'), trace: eased('trace'), hi: accentAt(s.t)};
    st3.frame(s, v3, {...cam, az: cam.az * D2R, el: cam.el * D2R});
    const veil = Math.max(fadeIn, smooth((s.t - (DUR - FADE)) / FADE));
    placeLabels(s, 1 - veil);
    ui.update(s, {tourOn: AP.on, paused: AP.on ? false : paused, view, display: Object.fromEntries(DISPLAY.map(([x]) => [x, disp[x].on])), speed: AP.on ? 1 : speed, veil, cursor});
    requestAnimationFrame(frame);
  };
  st3.renderer.compileAsync(st3.scene, st3.camera).then(() => requestAnimationFrame(frame));

  // relecture : LIVE.at(tau) place la visite à tau secondes
  window.LIVE = {
    at(tau) {
      AP.on = true;
      AP.t0 = T - tau;
    },
    freeze(tau) {
      AP.on = true;
      AP.frozen = tau;
    },
    get state() {
      return current;
    },
    CURL,
    TOUR_DUR,
    scene: st3.scene,
  };
}
