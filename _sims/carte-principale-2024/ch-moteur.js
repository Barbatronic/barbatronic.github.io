// Chapitre 3 : comment le Teensy fait tourner un moteur. Chaîne Teensy, connecteur J5, driver, moteur, courroie, roue,
// et un oscilloscope des trois fils EN, DIR et STEP. Curseur de vitesse de roue, driver activé ou non, impulsion à la
// main. Calculs : motorChain() de kin.js (cotes de la base holonome).
// Sorties : moteur(api) -> {mount(stage, ctrl), tick(t, dt), parts, extracts}.
import {motorChain, MOTOR} from './kin.js';
import {box, fr, S, wire} from './svg.js';

const LEAD = `<p class="lead">Un moteur pas à pas ne reçoit pas une tension qui le fait tourner plus ou moins vite : il reçoit des impulsions. À chaque impulsion sur STEP, le driver fait avancer le moteur d'un cran. La vitesse, c'est le nombre d'impulsions par seconde.</p>`;
const KEEP = `<div class="keep"><h4>À retenir</h4><ul>
  <li>Trois fils par moteur depuis le Teensy : STEP, un cran par impulsion ; DIR, le sens ; EN, le driver en marche ou au repos.</li>
  <li>Le driver MKS SERVO57B transforme ces ordres en courant dans les bobines du moteur, à partir du 22,2 V.</li>
  <li>Un tour de moteur fait 200 pas ; avec 16 micro-pas, 3 200 impulsions.</li>
  <li>La courroie (14 et 28 dents) divise par 2 : un tour de roue, deux tours de moteur.</li>
  <li>Trois moteurs, trois connecteurs : J5, J3, J6, marqués Stepper 1, 2 et 3 sur la carte. Brochage : 1 DIR, 2 STEP, 3 EN, 4 GND, 5 +5V, 6 +24V.</li>
  <li>Broches du Teensy : STEP sur 5, 6 et 9 ; DIR sur 10, 11 et 12 ; EN sur 24, commun aux trois drivers.</li>
</ul><p class="hint">16 micro-pas : réglage pris pour l'exemple.</p></div>`;
const PARTS = ['U1', 'J5', 'J3', 'J6'];
const EXTRACTS = [
  {t: 'Connecteurs des drivers', block: 'Driver stepper'},
  {t: 'Teensy : STEP, DIR, EN', box: [26, 52, 112, 90], note: 'Côté gauche du Teensy : STEP_1 à STEP_3, DIR_1 à DIR_3 et EN, avec le numéro de broche Arduino.'},
];

// oscilloscope : place sur l'écran, traces
const SC = {x: 130, y: 300, w: 840, h: 190};
const TR = [{k: 'EN', y: 330}, {k: 'DIR', y: 395}, {k: 'STEP', y: 460}];
const AMP = 26;

export function moteur(api) {
  let v = 200;
  let en = true;
  let manual = 0;      // impulsions envoyées à la main
  let pulses = [];     // instants d'affichage des impulsions à la main
  let motorA = 0;
  const el = {};

  const mount = (stage, ctrl) => {
    const svg = S('svg', {viewBox: '0 0 1000 520', class: 'syn', role: 'img', 'aria-label': 'Commande d\'un moteur pas à pas'}, stage);
    // Teensy et ses trois sorties
    const tb = S('g', {class: 'bx src'}, svg);
    S('rect', {x: 20, y: 50, width: 140, height: 160}, tb);
    S('text', {x: 34, y: 76, class: 't', style: 'text-anchor: start'}, tb).textContent = 'Teensy 3.5';
    const ys = [90, 130, 170];
    const names = [`${MOTOR.step} · 5`, `${MOTOR.dir} · 10`, `${MOTOR.en} · 24`];
    el.w = names.map((n, i) => {
      S('text', {x: 150, y: ys[i] + 4, class: 'pin'}, svg).textContent = n;
      return wire(svg, [[160, ys[i]], [250, ys[i]]], i === 0 ? 'pulse' : '');
    });
    box(svg, 250, 60, 90, 140, [MOTOR.conn, MOTOR.label], '');
    el.w2 = ys.map((y, i) => wire(svg, [[340, y], [400, y]], i === 0 ? 'pulse' : ''));
    el.drv = box(svg, 400, 50, 140, 160, ['Driver', 'MKS SERVO57B', '', '22,2 V'], 'reg');
    el.ph = [0, 1, 2, 3].map((i) => wire(svg, [[540, 85 + i * 30], [600, 85 + i * 30]], 'pulse'));
    S('text', {x: 570, y: 222, class: 'lab c'}, svg).textContent = '2 bobines';
    // moteur NEMA 23 vu de face, poulie 14 dents, courroie, poulie 28 dents, roue
    S('rect', {x: 610, y: 75, width: 110, height: 110, rx: 8, class: 'mface'}, svg);
    el.rotor = S('g', {transform: 'translate(665 130)'}, svg);
    S('circle', {r: 30, class: 'rotor'}, el.rotor);
    for (let i = 0; i < 8; i++) S('line', {x1: 0, y1: -30, x2: 0, y2: -22, transform: `rotate(${i * 45})`, class: 'tick'}, el.rotor);
    S('line', {x1: 0, y1: 0, x2: 0, y2: -30, class: 'mark'}, el.rotor);
    S('circle', {cx: 665, cy: 130, r: 9, class: 'pul'}, svg);
    S('path', {d: 'M665 121L900 112M665 139L900 148', class: 'belt'}, svg);
    el.wheel = S('g', {transform: 'translate(900 130)'}, svg);
    S('circle', {r: 52, class: 'wheel'}, el.wheel);
    for (let i = 0; i < 15; i++) S('ellipse', {cx: 0, cy: -46, rx: 6, ry: 4, transform: `rotate(${i * 24})`, class: 'roller'}, el.wheel);
    S('line', {x1: 0, y1: 0, x2: 0, y2: -40, class: 'mark'}, el.wheel);
    S('circle', {cx: 900, cy: 130, r: 18, class: 'pul'}, svg);
    S('text', {x: 665, y: 210, class: 'lab c'}, svg).textContent = 'moteur NEMA 23';
    S('text', {x: 780, y: 100, class: 'lab c'}, svg).textContent = '14 → 28 dents';
    S('text', {x: 900, y: 205, class: 'lab c'}, svg).textContent = 'roue ø60';
    el.state = S('text', {x: 470, y: 240, class: 'lab c strong'}, svg);
    // oscilloscope
    S('rect', {x: SC.x - 110, y: SC.y - 20, width: SC.w + 120, height: SC.h + 30, class: 'scope'}, svg);
    for (let i = 0; i <= 12; i++) S('line', {x1: SC.x + (SC.w * i) / 12, y1: SC.y - 10, x2: SC.x + (SC.w * i) / 12, y2: SC.y + SC.h, class: 'grid'}, svg);
    el.tr = TR.map((r) => {
      S('text', {x: SC.x - 96, y: r.y - 6, class: 'pin l'}, svg).textContent = r.k;
      return S('path', {class: 'trace'}, svg);
    });
    el.win = S('text', {x: SC.x + SC.w, y: SC.y + SC.h + 2, class: 'lab r'}, svg);

    // commandes
    const lab = document.createElement('label');
    lab.className = 'rng mono';
    lab.innerHTML = '<span>Vitesse de la roue</span><input type="range" min="-400" max="400" step="10" value="200"><b></b>';
    el.range = lab.querySelector('input');
    el.rv = lab.querySelector('b');
    el.range.addEventListener('input', () => {
      v = Number(el.range.value);
      manual = 0;
      pulses = [];
    });
    const bEn = document.createElement('button');
    bEn.type = 'button';
    bEn.className = 'bt';
    bEn.addEventListener('click', () => (en = !en));
    const bP = document.createElement('button');
    bP.type = 'button';
    bP.className = 'bt';
    bP.textContent = 'Envoyer 1 impulsion';
    bP.addEventListener('click', () => {
      v = 0;
      el.range.value = 0;
      manual++;
      pulses.push(el.now || 0);
      if (en) motorA += motorChain(1).degPerPulse;
    });
    ctrl.append(lab, bEn, bP);
    el.bEn = bEn;
    el.chain = document.createElement('p');
    el.chain.className = 'chain mono';
    ctrl.after(el.chain);
    api.side(LEAD + KEEP);
  };

  const tick = (t, dt) => {
    el.now = t;
    const c = motorChain(v);
    const run = en && c.hz > 0;
    if (run) motorA += (c.motorRpm / 60) * 360 * dt;
    el.rotor.setAttribute('transform', `translate(665 130) rotate(${motorA})`);
    el.wheel.setAttribute('transform', `translate(900 130) rotate(${motorA / MOTOR.ratio})`);
    el.rv.textContent = `${fr(v, 0)} mm/s`;
    el.bEn.textContent = en ? 'EN : couper le driver' : 'EN : activer le driver';
    el.bEn.classList.toggle('on', !en);
    for (const w of [el.w[2], el.w2[2]]) w.classList.toggle('on', en);
    for (const w of [el.w[1], el.w2[1]]) w.classList.toggle('on', c.dir === 1 && (c.hz > 0 || manual > 0));
    const stepping = c.hz > 0 || (manual > 0 && t - pulses[pulses.length - 1] < 1.2);
    for (const w of [el.w[0], el.w2[0]]) w.classList.toggle('on', stepping);
    for (const w of el.ph) w.classList.toggle('on', en && stepping);
    el.drv.classList.toggle('off', !en);
    el.state.textContent = !en ? 'driver au repos : les impulsions sont ignorées' : stepping ? '' : 'pas d\'impulsion : le moteur tient sa position';

    // oscilloscope : 12 impulsions sur la fenêtre, affichage ralenti à une impulsion par seconde
    const lvl = (k, hi) => (hi ? TR[k].y - AMP : TR[k].y);
    el.tr[0].setAttribute('d', `M${SC.x} ${lvl(0, en)}H${SC.x + SC.w}`);
    el.tr[1].setAttribute('d', `M${SC.x} ${lvl(1, c.dir === 1)}H${SC.x + SC.w}`);
    let d = `M${SC.x} ${lvl(2, false)}`;
    const pw = SC.w / 12;
    if (c.hz > 0) {
      const off = ((t * 1) % 1) * pw;
      for (let x = SC.x - off; x < SC.x + SC.w; x += pw) {
        const a = Math.max(SC.x, x + pw * 0.25);
        const b = Math.min(SC.x + SC.w, x + pw * 0.5);
        if (b <= SC.x || a >= SC.x + SC.w) continue;
        d += `H${a}V${lvl(2, true)}H${b}V${lvl(2, false)}`;
      }
      el.win.textContent = `affichage ralenti : la fenêtre dure ${fr((12 / c.hz) * 1000, 2)} ms en vrai`;
    } else if (manual > 0) {
      // impulsions à la main : elles entrent à droite et défilent vers la gauche
      for (const p of pulses) {
        const x = SC.x + SC.w - (t - p) * 260;
        if (x < SC.x - pw * 0.25 || x > SC.x + SC.w) continue;
        d += `H${Math.max(SC.x, x)}V${lvl(2, true)}H${Math.min(SC.x + SC.w, x + pw * 0.25)}V${lvl(2, false)}`;
      }
      const m = motorChain(1);
      el.win.textContent = `${manual} impulsion${manual > 1 ? 's' : ''} : moteur +${fr(manual * m.degPerPulse, 3)}°, roue +${fr(manual * m.mmPerPulse, 3)} mm`;
    } else el.win.textContent = 'aucune impulsion';
    d += `H${SC.x + SC.w}`;
    el.tr[2].setAttribute('d', d);

    el.chain.innerHTML = `${fr(Math.abs(v), 0)} mm/s à la roue → ${fr(Math.abs(c.wheelRpm), 0)} tr/min de roue → ×${MOTOR.ratio} : ${fr(Math.abs(c.motorRpm), 0)} tr/min de moteur → ×${c.pulsesPerTurn} impulsions par tour : <b>${fr(c.hz / 1000, 2)} kHz sur STEP</b>`;
  };

  return {mount, tick, parts: PARTS, extracts: EXTRACTS};
}
