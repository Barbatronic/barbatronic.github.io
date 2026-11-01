// Le calcul de la base holonome du Jardinier (CDR 2024), sans three.js.
// Rôle : cotes relevées dans le CAO et cinématique d'une base à trois roues omnidirectionnelles à 120°, en fonction
// d'une seule entrée, le temps t d'une boucle de démonstration (avance, crabe, rotation, translation en tournant).
// Géométrie et cinématique seulement : aucun effort ni couple n'est calculé.
// Source des cotes : LesKaribous/Karibous-2024-Hardware, MCAD/robot_holonome.FCStd, mechanical-parts/colonne-moteur
// et omniwheel, mechanical-parts/generic-hardware (poulie T5 14 dents), lus avec FreeCAD 1.1 sans recalcul.
// Sorties : G (cotes), WHEELS, M (hypothèses), wheelSpeeds(vx, vy, w), PHASES, DUR, state(t).

const D2R = Math.PI / 180;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

/** Cotes du CAO, en mm. Repère du robot : x à droite, y vers l'avant (vers la colonne 1), rotation positive à gauche. */
export const G = {
  wheel: {r: 30, discs: 3, rollers: 5, rollerD: 13, width: 40},  // roue ø60 : 3 disques de 5 galets décalés
  L: 82,                    // centre du robot / milieu des 3 rangs de galets au sol (66 à 97 mm, mesuré sur le CAO)
  colR: 45,                 // centre du robot / face intérieure de la colonne moteur
  col: {w: 80, d: 78, h: 323},  // colonne moteur : profilés 10 mm, carters
  belt: {motor: 14, wheel: 28, pitch: 5},  // courroie T5 : poulie moteur 14 dents, poulie roue 28 dents
  motorZ: 80, wheelZ: 16.5, // hauteur des axes moteur et roue dans la colonne
  motor: {name: '23HS16-0884S', size: 56.4, len: 41, step: 1.8},  // NEMA 23, 200 pas par tour
  driver: 'MKS SERVO57B',
  base: {w: 275, d: 240},   // semelle
  beacon: {r: 58, z: [320, 417]},
};
/** Rapport de réduction moteur / roue. */
export const RATIO = G.belt.wheel / G.belt.motor;
/** Les trois roues : angle de la colonne autour du centre (° depuis l'axe x). */
export const WHEELS = [90, 210, 330].map((a, i) => ({i, a, c: Math.cos(a * D2R), s: Math.sin(a * D2R)}));

/** Hypothèses de la démonstration, affichées comme telles. */
export const M = {
  v: 300,        // vitesse de translation de l'exemple, mm/s
  w: 90,         // vitesse de rotation de l'exemple, °/s
  micro: 16,     // micro-pas du driver (réglage supposé)
};

/**
 * Cinématique inverse : vitesse du robot (mm/s, mm/s, °/s, repère du robot) -> pour chaque roue, vitesse de jante
 * (mm/s, sens de la rotation positive du robot), vitesse de glissement des galets le long de l'axe (mm/s),
 * vitesse du moteur (tr/min) et fréquence de pas (Hz).
 * Roue i à l'angle a : direction motrice t = (-sin a, cos a), axe radial n = (cos a, sin a).
 * v_i = -sin a · vx + cos a · vy + L · w ; galets : g_i = cos a · vx + sin a · vy.
 */
export function wheelSpeeds(vx, vy, wd) {
  const w = wd * D2R;
  return WHEELS.map(({c, s}) => {
    const rim = -s * vx + c * vy + G.L * w;
    const slip = c * vx + s * vy;
    const wheelRpm = (rim / (2 * Math.PI * G.wheel.r)) * 60;
    const motorRpm = wheelRpm * RATIO;
    const steps = (Math.abs(motorRpm) / 60) * (360 / G.motor.step) * M.micro;
    return {rim, slip, wheelRpm, motorRpm, steps};
  });
}

// ------------------------------------------------------------------ boucle de démonstration
// Chaque segment déplace le robot d'une quantité exacte avec un profil de vitesse en cloche (1 - cos) : départ et
// arrivée à vitesse nulle. La boucle revient au point de départ, orientation comprise.
const SEGS = [
  {key: 'forward', name: 'Avance', d: [0, 300], rot: 0, frame: 'robot',
    text: 'Le robot avance vers la colonne 1. Sa roue ne tourne pas : ses galets roulent au sol. Les deux autres tournent en sens opposés.'},
  {key: 'crab', name: 'Crabe', d: [300, 0], rot: 0, frame: 'robot',
    text: 'Le robot glisse à droite sans tourner. La roue 1 tourne deux fois plus vite que les deux autres.'},
  {key: 'spin', name: 'Rotation', d: [0, 0], rot: 180, frame: 'robot',
    text: 'Rotation sur place : les trois roues tournent à la même vitesse, dans le même sens. Aucun galet ne roule.'},
  {key: 'combo', name: 'Translation en tournant', d: [-300, -300], rot: 180, frame: 'world',
    text: 'Le robot file en diagonale en faisant un demi-tour. La vitesse de chaque roue change en continu.'},
];
const PAUSE = 0.7;
// durée de chaque mouvement : déplacement à la vitesse moyenne choisie, ou rotation à la vitesse choisie
for (const s of SEGS) {
  const tl = Math.hypot(s.d[0], s.d[1]) / (M.v / 2);
  const tr = Math.abs(s.rot) / (M.w / 2);
  s.T = Math.max(tl, tr, 1.6);
}
export const PHASES = [];
{
  let t = 0.8;
  for (const s of SEGS) {
    PHASES.push({...s, t, t1: t + s.T});
    t += s.T + PAUSE;
  }
  PHASES.unshift({key: 'rest', name: 'Repos', t: 0, t1: 0.8, text: 'Trois roues omnidirectionnelles à 120°, à 82 mm du centre. Chacune ne pousse que dans une direction.'});
}
export const DUR = PHASES[PHASES.length - 1].t1 + PAUSE + 0.4;
export const FADE = 0.45;

export const phaseAt = (t) => {
  let i = 0;
  for (let k = 0; k < PHASES.length; k++) if (t >= PHASES[k].t) i = k;
  return i;
};

// profil en cloche : fraction parcourue et vitesse normalisée
const prog = (u) => u - Math.sin(2 * Math.PI * u) / (2 * Math.PI);
const rate = (u) => 1 - Math.cos(2 * Math.PI * u);

/** Pose du robot dans la table (x, y en mm, th en °) et vitesse dans son propre repère, au temps t. */
function pose(t) {
  let x = 0;
  let y = 0;
  let th = 0;
  let vx = 0;
  let vy = 0;
  let w = 0;
  for (const p of PHASES) {
    if (p.key === 'rest' || t < p.t) continue;
    const u = clamp((t - p.t) / p.T, 0, 1);
    const k = prog(u);
    const kr = t < p.t1 ? rate(u) / p.T : 0;
    const th0 = th;
    th = th0 + p.rot * k;
    w = p.rot * kr;
    if (p.frame === 'robot') {
      // déplacement exprimé dans le repère du robot, orientation constante pendant le segment
      const c = Math.cos(th0 * D2R);
      const s = Math.sin(th0 * D2R);
      x += (c * p.d[0] - s * p.d[1]) * k;
      y += (s * p.d[0] + c * p.d[1]) * k;
      vx = p.d[0] * kr;
      vy = p.d[1] * kr;
    } else {
      // déplacement exprimé dans la table : on ramène la vitesse dans le repère du robot qui tourne
      x += p.d[0] * k;
      y += p.d[1] * k;
      const c = Math.cos(th * D2R);
      const s = Math.sin(th * D2R);
      const gx = p.d[0] * kr;
      const gy = p.d[1] * kr;
      vx = c * gx + s * gy;
      vy = -s * gx + c * gy;
    }
    if (t < p.t1) break;
    vx = vy = w = 0;
  }
  return {x, y, th, vx, vy, w};
}

// angles des roues et des galets : intégrés une fois sur toute la boucle (pas de 1/240 s)
const DT = 1 / 240;
const N = Math.ceil(DUR / DT) + 1;
const WA = WHEELS.map(() => new Float32Array(N));
const GA = WHEELS.map(() => new Float32Array(N));
{
  const a = [0, 0, 0];
  const g = [0, 0, 0];
  for (let k = 0; k < N; k++) {
    const p = pose(k * DT);
    const sp = wheelSpeeds(p.vx, p.vy, p.w);
    for (let i = 0; i < 3; i++) {
      WA[i][k] = a[i];
      GA[i][k] = g[i];
      a[i] += (sp[i].rim / G.wheel.r) * DT;
      g[i] += (sp[i].slip / (G.wheel.rollerD / 2)) * DT;
    }
  }
}
const sample = (arr, t) => {
  const f = clamp(t / DT, 0, N - 1);
  const k = Math.floor(f);
  const r = f - k;
  return arr[k] + (arr[Math.min(N - 1, k + 1)] - arr[k]) * r;
};

/** Tout l'état au temps t (s), pur. wheels[i] : vitesses de wheelSpeeds, angle de roue et de galet (rad). */
export function state(t) {
  t = clamp(t, 0, DUR);
  const p = pose(t);
  const sp = wheelSpeeds(p.vx, p.vy, p.w);
  const wheels = sp.map((s, i) => ({...s, ang: sample(WA[i], t), gang: sample(GA[i], t)}));
  const speed = Math.hypot(p.vx, p.vy);
  return {t, phase: phaseAt(t), ...p, speed, wheels};
}

/** Trace du centre du robot sur la boucle, pour le dessin au sol. */
export const PATH = Array.from({length: 241}, (_, k) => {
  const p = pose((k / 240) * DUR);
  return [p.x, p.y];
});
