// Le calcul du manipulateur à fourches, sans three.js.
// Rôle : cotes réelles (mm, degrés, N), et tout l'état de la machine en fonction d'une seule entrée, le temps t
// de la séquence « saisir le mur ». La 3D, les panneaux et la courbe lisent tous ce fichier.
// Source des cotes : étude « Manipulateur à fourches » (artifact du 24/09/2026), règlement CDR 2027.
// Géométrie et cinématique seulement : aucun effort n'est calculé.
// Sorties : G (cotes), contact (géométrie du serrage), PHASES, DUR, state(t).

const D2R = Math.PI / 180;

/** Cotes, en mm. */
export const G = {
  stone: {L: 320, H: 110, D: 110},  // pierre en carton
  rows: 3,
  arm: 100,        // entraxe axe servo / axe doigt
  inset: 70,       // axe servo à 70 mm du bout de la pierre
  dy: 60,          // axe servo 60 mm au-dessus du centre de sa pierre
  finger: {d: 20, len: 150},
  armT: 6,         // épaisseur des bras
  layer: 10,       // décalage en Z entre les plans des bras (rangée 1 contre la façade)
  plateGap: 8,     // jeu bras / façade
  servo: {len: 40.7, w: 19.7, depth: 36.5, ear: 54.5, earT: 2.5, min: -75, max: 105},
  speed: 75,       // vitesse servo dans la séquence, °/s
  overtravel: 8,   // consigne au-delà du contact, pour serrer
};

/** Axe du servo d'une rangée (0 en bas) et d'un côté (+1 gauche, -1 droite vus face aux pierres). */
export const servoXY = (row, side) => ({x: side * (G.stone.L / 2 - G.inset), y: G.stone.H * (row + 0.5) + G.dy});

/** Centre du doigt pour un angle (0 : bras horizontal vers l'extérieur ; positif : le doigt descend vers l'intérieur). */
export const fingerXY = (row, side, deg) => {
  const c = servoXY(row, side);
  const a = deg * D2R;
  return {x: c.x + side * G.arm * Math.cos(a), y: c.y - G.arm * Math.sin(a)};
};

/** Jeu entre le doigt et le bout de la pierre, en mm (négatif : interpénétration, jamais atteinte). */
export const gapAt = (deg) => G.stone.L / 2 - G.inset + G.arm * Math.cos(deg * D2R) - G.finger.d / 2 - G.stone.L / 2;

// Serrage : le doigt touche quand son bord intérieur atteint le bout de la pierre.
const cosC = (G.inset + G.finger.d / 2) / G.arm;
const ac = Math.acos(cosC) / D2R;
const lever = G.arm * Math.sin(ac * D2R);          // bras de levier au contact (distance axe servo / contact)
export const contact = {
  angle: ac,                                // 36,87°
  cmd: ac + G.overtravel,                   // consigne de serrage
  lever,                                    // 60 mm
  height: servoXY(0, 1).y - lever,          // hauteur du point de contact sur la pierre (= son centre)
  open: gapAt(0),                           // jeu bras ouverts
};

// Séquence 1 de l'étude : approcher, serrer, reculer en traînant le mur, ouvrir, se dégager.
const GAP_FAR = 150;
const GAP_NEAR = 25;
const GAP_PULL = 155;
const GAP_OUT = 300;
export const PHASES = [
  {key: 'open', t: 0, name: 'Bras ouverts', text: `Doigts écartés : ${contact.open.toFixed(0)} mm de jeu de chaque côté de la pierre.`},
  {key: 'approach', t: 1.0, name: 'Approche', text: 'Le robot avance. Les doigts passent de part et d’autre du mur, sans le toucher.'},
  {key: 'close', t: 3.2, name: 'Serrage', text: 'Les 6 servos tournent ensemble. Contact à 36,9°, puis calage : la consigne est 8° plus loin.'},
  {key: 'pull', t: 4.4, name: 'Recul', text: 'Le robot recule. Les 3 pierres suivent, tenues par frottement, le mur glisse au sol.'},
  {key: 'release', t: 6.9, name: 'Ouverture', text: 'Retour à 0°. Les doigts quittent la pierre dès que la consigne repasse sous l’angle de contact.'},
  {key: 'leave', t: 7.7, name: 'Dégagement', text: 'Le robot se retire. Le mur reste en place, déplacé de 130 mm.'},
];
export const DUR = 9.6;
export const FADE = 0.45;

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const ease = (x) => {
  const u = clamp(x, 0, 1);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
const span = (t, a, b) => ease((t - a) / (b - a));

/** Phase courante (index) au temps t. */
export const phaseAt = (t) => {
  let i = 0;
  for (let k = 0; k < PHASES.length; k++) if (t >= PHASES[k].t) i = k;
  return i;
};

/** Distance façade du robot / face avant du mur d'origine (mm) : approche, recul en tirant le mur, dégagement. */
export function robotGap(t) {
  const P = PHASES;
  let gap = GAP_FAR;
  if (t >= P[1].t) gap = GAP_FAR + (GAP_NEAR - GAP_FAR) * span(t, P[1].t, P[2].t - 0.2);
  if (t >= P[3].t) gap = GAP_NEAR + (GAP_PULL - GAP_NEAR) * span(t, P[3].t, P[4].t - 0.4);
  if (t >= P[5].t) gap = GAP_PULL + (GAP_OUT - GAP_PULL) * span(t, P[5].t, DUR - FADE - 0.3);
  return gap;
}

/**
 * Tout l'état au temps t (s), pur : aucune mémoire entre deux appels.
 * gap : façade du robot / face avant du mur d'origine ; wall : déplacement du mur ; cmd et angle : servo (°).
 */
export function state(t) {
  t = clamp(t, 0, DUR);
  const P = PHASES;
  const tc = P[2].t;
  const tr = P[4].t;
  // consigne servo : rampe à vitesse constante vers la consigne de serrage, puis retour à 0
  let cmd = 0;
  if (t >= tc && t < tr) cmd = Math.min(contact.cmd, G.speed * (t - tc));
  else if (t >= tr) cmd = Math.max(0, contact.cmd - G.speed * (t - tr));
  // le servo suit la consigne, sauf la pierre qui l'arrête à l'angle de contact
  const angle = Math.min(cmd, contact.angle);
  const held = cmd > contact.angle + 1e-6;
  const stall = held ? clamp((cmd - contact.angle) / G.overtravel, 0, 1) : 0;
  const gap = robotGap(t);
  const wall = t >= P[3].t ? Math.min(gap, GAP_PULL) - GAP_NEAR : 0;
  // vitesse du robot, par différence finie sur la même fonction (mm/s)
  const v = t > 0.02 && t < DUR - 0.02 ? (robotGap(t + 0.01) - robotGap(t - 0.01)) / 0.02 : 0;
  const phase = phaseAt(t);
  return {t, phase, cmd, angle, held, stall, over: Math.max(0, cmd - angle), gap, wall, speed: v, clear: gapAt(angle)};
}
