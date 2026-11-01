// Le calcul de la pince à doigts souples du Jardinier (CDR 2024), sans three.js.
// Rôle : cotes relevées dans le CAO, géométrie du doigt en TPU (5 charnières en série tirées par un câble), et tout
// l'état de la pince en fonction d'une seule entrée, le temps t de la séquence « prendre deux pots ».
// Géométrie et cinématique seulement : aucun effort n'est calculé, faute de mesure.
// La 3D, les panneaux et le profil du doigt lisent tous ce fichier.
// Source des cotes : LesKaribous/Karibous-2024-Hardware, MCAD/actuators-parts/finger-filaflex.FCStd
// (esquisses, sommets et placements des corps de l'assemblage, lus avec FreeCAD 1.1 sans recalcul).
// Matière et guidage du câble : vidéo du prototype (youtube.com/shorts/xEiXw7aZnqQ, janvier 2024).
// Sorties : G (cotes), M (hypothèses), CURL (table câble -> angles), PHASES, DUR, state(t), fingerPose(th).

const D2R = Math.PI / 180;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

/** Cotes du CAO, en mm. Repère du doigt : u le long du doigt (0 au milieu du talon), v vers le côté câble. */
export const G = {
  finger: {
    root: [-8.8, 8.8],                   // talon, serré dans le support
    hinges: [9, 27, 45, 63, 81],         // milieu des 5 encoches (motif répété au pas de 18 mm)
    tip: 98.8,
    v: [-6.73, 6.73],                    // hauteur de section 13,46 mm
    w: 10,                               // épaisseur (hauteur dans le robot)
    spine: [-6.73, -4.73],               // charnière : 2 mm de TPU sous le fond des encoches
    notch: {vBot: -4.73, wBot: 0.58, vMid: 2, wMid: 2.66, wTop: 6.48},
    cable: 4,                            // canal du câble ø1,4 mm, côté intérieur
    cableD: 1.4,
  },
  pulley: {r: 14, R: 15},                // poulie du servo : fond de gorge à 14 mm de l'axe
  tube: {id: 1, od: 3},                  // tube PTFE 1 × 3 mm, guide du câble
  pot: {rTop: 25, rBot: 20, h: 43},      // pot blanc de la table 2024
  rootX: 36,                             // milieu du talon / axe de la pince
  // bras de levage en parallélogramme (robots_2024.FCStd, module avant) : pivots côté robot, en mm dans le repère
  // du robot (y vers l'arrière, z au-dessus de l'origine, sol à -13,5) ; bras de 78 mm, pivots espacés de 43,5 mm
  lift: {L: 78, frameY: -79.2, upZ: 187.5, lowZ: 144, th0: 12.67, floor: -13.5},
  fingerZ: 73.4,                         // plan des doigts dans la pose du CAO (bras à 12,7° sous l'horizontale)
  fingerY: -170.4,                       // repère du doigt v = 0, dans le repère du robot
  servo: {name: 'MG996R'},
  liftServo: {name: 'MG996R'},
};

const F = G.finger;
const vN = (F.spine[0] + F.spine[1]) / 2;        // fibre neutre de la charnière
/** Bras de levier du câble autour d'une charnière. */
export const LEVER = F.cable - vN;               // 9,73 mm
/** Fermeture d'une encoche si les flancs du V étaient rigides (CAO seul). */
export const TH_CAD = (2 * Math.atan((F.notch.wMid - F.notch.wBot) / 2 / (F.notch.vMid - F.notch.vBot))) / D2R;
/**
 * Butée retenue : le haut de l'encoche (6,5 mm, côté câble) se ferme. En FilaFlex 70A les flancs du V s'écrasent
 * avant : la vidéo du prototype montre un doigt enroulé bien au-delà des 5 × TH_CAD.
 */
export const TH_MAX = (2 * Math.atan(F.notch.wTop / 2 / (F.v[1] - vN))) / D2R;

/** Hypothèses de la séquence, affichées comme telles. */
export const M = {
  shore: 70,          // FilaFlex 70A (vidéo du prototype)
  thHigh: 12.67,      // bras en haut : pose du CAO (°, sous l'horizontale)
  thLow: 80,          // bras en bas : supposé, bras presque vertical, doigts à mi-hauteur haute du pot
  rate: 22,           // vitesse de consigne choisie pour la séquence, °/s (ralentie pour la lecture)
};
/** Décalage de la pince (mm, repère three : dy vers le haut, dz vers l'avant) pour un angle de bras (°). */
export const liftOff = (deg) => {
  const {L, th0} = G.lift;
  return {dy: -L * (Math.sin(deg * D2R) - Math.sin(th0 * D2R)), dz: L * (Math.cos(deg * D2R) - Math.cos(th0 * D2R))};
};
/** Hauteur des doigts au-dessus du sol, bras en bas : le pot est pris à cette hauteur. */
M.gripH = G.fingerZ - G.lift.floor + liftOff(M.thLow).dy;
const potR = G.pot.rBot + ((G.pot.rTop - G.pot.rBot) * M.gripH) / G.pot.h;

/**
 * Pot, dans le repère d'un doigt : posé devant le doigt (POT), le bout du doigt l'accroche et le pousse vers le nez
 * de la pince jusqu'à ce qu'il y bute (POT_END) ; le doigt serre alors le pot contre le nez.
 * Bord du nez : x = 20,6 mm, soit u = 20,6 - 36 = -15,4 dans le repère du doigt.
 */
const NOSE_U = 20.6 - G.rootX;
export const POT = {u: 52, v: F.v[1] + potR + 10, r: potR};
export const POT_END = {u: NOSE_U + potR + 0.5, v: F.v[1] + potR + 4, r: potR};
const potAt = (k) => ({u: POT.u + (POT_END.u - POT.u) * k, v: POT.v + (POT_END.v - POT.v) * k, r: potR});

// ------------------------------------------------------------------ pose du doigt
/** Pivot de la charnière i (sur la fibre neutre). */
const pivot = (i) => [F.hinges[i], vN];
/**
 * Pose de chaque segment pour 5 angles (°) : segment 0 = talon fixe, segment i tourné par les charnières 1..i.
 * Renvoie [{a (rad, cumulé), o: [u, v] origine de la transformation}] ; un point p du segment s'écrit o + R(a)·p.
 */
export function fingerPose(th) {
  const out = [{a: 0, o: [0, 0]}];
  let a = 0;
  let o = [0, 0];
  for (let i = 0; i < 5; i++) {
    const p = pivot(i);
    // le pivot i, transporté par la pose courante
    const c = Math.cos(a);
    const s = Math.sin(a);
    const pw = [o[0] + c * p[0] - s * p[1], o[1] + s * p[0] + c * p[1]];
    a += th[i] * D2R;
    const c2 = Math.cos(a);
    const s2 = Math.sin(a);
    o = [pw[0] - (c2 * p[0] - s2 * p[1]), pw[1] - (s2 * p[0] + c2 * p[1])];
    out.push({a, o});
  }
  return out;
}
export const apply = (pose, p) => {
  const c = Math.cos(pose.a);
  const s = Math.sin(pose.a);
  return [pose.o[0] + c * p[0] - s * p[1], pose.o[1] + s * p[0] + c * p[1]];
};
/** Bornes en u de chaque segment, de milieu d'encoche à milieu d'encoche. */
export const SEG = [[F.root[0], F.hinges[0]], ...F.hinges.map((h, i) => [h, F.hinges[i + 1] ?? F.tip])];

/** Contour d'un segment dans le plan (u, v) : flancs en V des encoches relevés dans le CAO, bout chanfreiné. */
const flankL = (c) => {
  const N = F.notch;
  return [[c, F.v[0]], [c + N.wBot / 2, N.vBot], [c + N.wMid / 2, N.vMid], [c + (N.wMid + N.wTop) / 4 + 0.4, 5.2], [c + N.wTop / 2, F.v[1]]];
};
export function segOutline(j) {
  const [u0, u1] = SEG[j];
  const rightUp = j === 5 ? [[u1 - 0.6, F.v[0]], [u1, F.notch.vBot], [u1, 4], [u1 - 2.2, F.v[1]]] : flankL(0).map(([u, v]) => [u1 - u, v]);
  const leftDown = j === 0 ? [[u0, F.v[1]]] : flankL(u0).slice(1).reverse();
  return [[u0, F.v[0]], ...rightUp, ...leftDown];
}

// face intérieure d'un segment (côté câble) : point le plus proche du centre du pot
const nearest = (a, b, p) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const k = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
  return [a[0] + k * dx, a[1] + k * dy];
};
function contactOf(pose, j, pot) {
  const [u0, u1] = SEG[j];
  const inset = j === 0 ? 0 : F.notch.wTop / 2;
  const a = apply(pose[j], [u0 + inset, F.v[1]]);
  const b = apply(pose[j], [j === 5 ? u1 - 2 : u1 - F.notch.wTop / 2, F.v[1]]);
  let q = nearest(a, b, [pot.u, pot.v]);
  if (j === 5) {
    // bout du doigt : sa face d'extrémité accroche aussi le pot
    const qe = nearest(apply(pose[5], [u1, F.notch.vBot]), apply(pose[5], [u1 - 2.2, F.v[1]]), [pot.u, pot.v]);
    if (Math.hypot(qe[0] - pot.u, qe[1] - pot.v) < Math.hypot(q[0] - pot.u, q[1] - pot.v)) q = qe;
  }
  return {q, d: Math.hypot(q[0] - pot.u, q[1] - pot.v) - pot.r};
}
const minGap = (pose, pot) => Math.min(...[1, 2, 3, 4, 5].map((j) => contactOf(pose, j, pot).d));

// ------------------------------------------------------------------ enroulement
// Le câble raccourcit de LEVER·θ à chaque charnière. Les 5 charnières sont identiques et le câble les traverse toutes :
// les charnières libres se ferment ensemble, du même angle.
// 1. Poussée : le pot glisse au sol sans résister ; le doigt se ferme librement et repousse le pot vers le nez.
// 2. Serrage : le pot bute contre le nez. Un segment qui le touche bloque les charnières en amont, les suivantes
//    continuent : le doigt s'enroule jusqu'au blocage. Une encoche fermée bloque sa charnière.
// Table calculée une fois, au pas de 0,02 mm de câble ; chaque ligne garde la position du pot (k : 0 posé, 1 au nez).
const DS = 0.02;
function buildCurl() {
  const th = [0, 0, 0, 0, 0];
  const blocked = [0, 0, 0, 0, 0];   // 0 libre, 1 contact, 2 encoche fermée
  const touch = [0, 0, 0, 0, 0, 0];
  let k = 0;
  let pushing = false;
  const rows = [{th: [...th], blocked: [...blocked], touch: [...touch], k}];
  // 1. poussée
  let guard = 0;
  while (guard++ < 20000 && k < 1) {
    const next = th.map((x) => Math.min(TH_MAX, x + DS / (LEVER * D2R) / 5));
    const pose = fingerPose(next);
    let k2 = k;
    while (k2 < 1 && minGap(pose, potAt(k2)) < 0) k2 = Math.min(1, k2 + 0.001);
    if (k2 >= 1 && minGap(pose, potAt(1)) < 0) break;
    if (k2 > k) pushing = true;
    k = k2;
    for (let i = 0; i < 5; i++) th[i] = next[i];
    rows.push({th: [...th], blocked: [...blocked], touch: [...touch], k, pushing});
    if (th[0] >= TH_MAX - 1e-9) break;
  }
  k = 1;
  const pot = potAt(1);
  // 2. serrage contre le nez
  guard = 0;
  while (guard++ < 20000) {
    const free = blocked.map((b, i) => (b ? -1 : i)).filter((i) => i >= 0);
    if (!free.length) break;
    const dth = DS / (LEVER * D2R) / free.length;
    const next = [...th];
    for (const i of free) next[i] = Math.min(TH_MAX, th[i] + dth);
    const pose = fingerPose(next);
    let hit = -1;
    for (let j = 5; j >= 1; j--) if (!touch[j] && contactOf(pose, j, pot).d < 0) hit = Math.max(hit, j);
    if (hit > 0) {
      touch[hit] = 1;
      for (let i = 0; i < hit; i++) if (!blocked[i]) blocked[i] = 1;
      continue;
    }
    for (let i = 0; i < 5; i++) {
      th[i] = next[i];
      if (!blocked[i] && th[i] >= TH_MAX - 1e-9) blocked[i] = 2;
    }
    rows.push({th: [...th], blocked: [...blocked], touch: [...touch], k});
  }
  // dernier contact trouvé : même pose, contacts à jour
  rows.push({...rows[rows.length - 1], blocked: [...blocked], touch: [...touch], k});
  return rows;
}
const ROWS = buildCurl();
/** Câble tiré quand tout est bloqué, en mm, et angle servo correspondant. */
export const CURL = {rows: ROWS, ds: DS, sEnd: (ROWS.length - 1) * DS};
CURL.phiEnd = CURL.sEnd / G.pulley.r / D2R;
const rowAt = (s) => ROWS[clamp(Math.round(s / DS), 0, ROWS.length - 1)];

/** Points de contact (repère du doigt) et normales, du bout vers le talon. */
function contactPoints(r, k = r.k) {
  const pose = fingerPose(r.th);
  const pot = potAt(k);
  const pts = [];
  for (let j = 5; j >= 1; j--) {
    // pendant la poussée, le segment au contact du pot ; ensuite, les segments bloqués par le pot
    if (k < 1 ? contactOf(pose, j, pot).d > 0.3 : !r.touch[j] && contactOf(pose, j, pot).d > 0.3) continue;
    const {q} = contactOf(pose, j, pot);
    const n = [q[0] - pot.u, q[1] - pot.v];
    const nl = Math.hypot(n[0], n[1]);
    pts.push({j, q, n: [n[0] / nl, n[1] / nl]});
  }
  return pts;
}

// ------------------------------------------------------------------ séquence
const T_CURL = 4.0;
const T_GRIP = Math.round((T_CURL + CURL.phiEnd / M.rate) * 10) / 10;
export const PHASES = [
  {key: 'rest', t: 0, name: 'Repos', text: 'Pince en haut, doigts droits. Le TPU n’a besoin d’aucun effort pour rester ouvert.'},
  {key: 'lower', t: 0.8, name: 'Descente', text: 'Le servo de levage tourne le bras supérieur. Le parallélogramme garde la pince verticale : elle descend en reculant vers le robot.'},
  {key: 'approach', t: 2.3, name: 'Approche', text: 'Le robot avance. Les pots passent devant les doigts, sans les toucher.'},
  {key: 'curl', t: T_CURL, name: 'Enroulement', text: 'Le servo enroule le câble, les 5 encoches se ferment ensemble. Le bout du doigt accroche le pot et le pousse vers le nez de la pince, jusqu’à ce qu’il y bute.'},
  {key: 'grip', t: T_GRIP, name: 'Serrage', text: 'Le pot est calé contre le nez. Les charnières qui le touchent s’arrêtent, celles du bout finissent de se fermer : le doigt serre le pot contre le nez.'},
  {key: 'lift', t: T_GRIP + 1.1, name: 'Levée', text: 'Le bras remonte. La pince reste verticale et s’écarte du robot sur un arc : le pot quitte le sol.'},
  {key: 'carry', t: T_GRIP + 2.7, name: 'Transport', text: 'Le robot recule, les pots en l’air.'},
  {key: 'place', t: T_GRIP + 4.7, name: 'Dépose', text: 'Le bras redescend et pose les pots.'},
  {key: 'release', t: T_GRIP + 6.1, name: 'Ouverture', text: 'Le servo relâche le câble. Le TPU se redresse seul, par élasticité.'},
  {key: 'leave', t: T_GRIP + 7.3, name: 'Dégagement', text: 'Le robot se retire et remonte la pince, les pots restent posés.'},
];
export const DUR = T_GRIP + 9.1;
export const FADE = 0.45;

const ease = (x) => {
  const u = clamp(x, 0, 1);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
const span = (t, a, b) => ease((t - a) / (b - a));
export const phaseAt = (t) => {
  let i = 0;
  for (let k = 0; k < PHASES.length; k++) if (t >= PHASES[k].t) i = k;
  return i;
};
const P_ = Object.fromEntries(PHASES.map((p) => [p.key, p.t]));

// position du robot (mm, avance positive) : loin, contre les pots, recule avec eux, se retire
const Z_FAR = -120;
const Z_CARRY = -110;
const Z_OUT = -240;
export function robotZ(t) {
  let z = Z_FAR;
  if (t >= P_.approach) z = Z_FAR * (1 - span(t, P_.approach, P_.curl - 0.15));
  if (t >= P_.carry) z = Z_CARRY * span(t, P_.carry, P_.place - 0.2);
  if (t >= P_.leave) z = Z_CARRY + (Z_OUT - Z_CARRY) * span(t, P_.leave, DUR - FADE - 0.2);
  return z;
}

/** Angle du bras de levage (° sous l'horizontale) au temps t. */
export function armDeg(t) {
  const {thHigh: hi, thLow: lo} = M;
  let a = hi;
  if (t >= P_.lower) a = hi + (lo - hi) * span(t, P_.lower, P_.lower + 1.3);
  if (t >= P_.lift) a = lo + (hi - lo) * span(t, P_.lift, P_.lift + 1.4);
  if (t >= P_.place) a = hi + (lo - hi) * span(t, P_.place, P_.place + 1.3);
  if (t >= P_.leave) a = lo + (hi - lo) * span(t, P_.leave + 0.3, DUR - FADE - 0.3);
  return a;
}

/**
 * Tout l'état au temps t (s), pur.
 * cmd / phi : consigne et position du servo de câble (°) ; s : câble tiré (mm) ; th : angles des 5 charnières (°) ;
 * blocked : état des charnières ; touch : segments au contact ; pts : points de contact ;
 * arm : angle du bras de levage (°) ; lift : décalage de la pince ; pot : décalage du pot (dy, dz) ; z : robot.
 */
export function state(t) {
  t = clamp(t, 0, DUR);
  const tc = P_.curl;
  const tr = P_.release;
  let cmd = 0;
  if (t >= tc && t < tr) cmd = Math.min(CURL.phiEnd, M.rate * (t - tc));
  else if (t >= tr) cmd = Math.max(0, CURL.phiEnd - M.rate * 2.5 * (t - tr));
  const phi = cmd;
  const s = phi * D2R * G.pulley.r;
  const r = rowAt(s);
  const held = phi >= CURL.phiEnd - 1e-6;
  const z = robotZ(t);
  const arm = armDeg(t);
  const lift = liftOff(arm);
  const low = liftOff(M.thLow);
  // le pot suit la pince de la levée à l'ouverture ; avant, il attend au sol, après, il reste où il a été posé
  const carried = t >= P_.lift && t < tr + 0.3;
  const pot = carried ? {dy: lift.dy - low.dy, dz: lift.dz + z} : {dy: 0, dz: low.dz + (t >= tr ? Z_CARRY : 0)};
  const height = G.fingerZ - G.lift.floor + lift.dy;
  const phase = phaseAt(t);
  // une fois poussé contre le nez, le pot y reste : il ne ressort pas quand le doigt s'ouvre
  const k = t >= tr ? 1 : r.k;
  const potUV = potAt(k);
  return {t, phase, cmd, phi, s, th: r.th, blocked: r.blocked, touch: r.touch, held, pts: contactPoints(r, k), potUV, z, arm, lift, pot, height};
}
