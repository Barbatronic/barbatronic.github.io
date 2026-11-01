// La base holonome en 3D : les vraies pièces du CAO (base.glb, exporté de robot_holonome.FCStd avec FreeCAD) et les
// profilés MakerBeam redessinés depuis leurs cotes et leur placement (beams.json). Seules les roues bougent, autour de leur axe réel.
// Repère three : mm ; X = x du robot, Z = -y (l'avant du robot vers -Z au départ), Y vertical, sol en Y = 0.
// Repère du CAO : Z vertical, roue 1 vers +Y, axes de roue à 16,5 mm au-dessus de la semelle, sol à -13,5 mm.
// Sorties : buildRobot() (promesse) -> {root, update(st, view), wheelWorld(i, st), Y}.
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {toCreasedNormals} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import modelSrc from './base.glb';
import beams from './beams.json';
import {G, PATH, WHEELS} from './kin.js';

export const INK = new THREE.Color('#0e0e0e');
const D2R = Math.PI / 180;
const FLOOR = 13.5;          // le sol est 13,5 mm sous l'origine du CAO
const AXLE = 16.5;           // hauteur des axes de roue dans le CAO
/** Hauteurs utiles, en Y three. */
export const Y = {axle: FLOOR + AXLE, top: FLOOR + 417};

// faces visibles des deux côtés : les pièces symétriques du CAO (Part::Mirroring) ont leurs triangles retournés
function mat(color, extra = {}) {
  const m = new THREE.MeshStandardMaterial({color, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide, ...extra});
  m.userData.base = new THREE.Color(color);
  return m;
}
const tint = (m, k) => m.color.copy(m.userData.base).lerp(INK, k);
function arrow(color = INK, opacity = 1) {
  const m = new THREE.MeshBasicMaterial({color, transparent: true, opacity, depthTest: false});
  const a = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 3), m);
  const head = new THREE.Mesh(new THREE.ConeGeometry(7, 16, 16), m);
  head.rotation.z = -Math.PI / 2;
  a.add(stem, head);
  stem.renderOrder = head.renderOrder = 5;
  a.userData.set = (L) => {
    const s = Math.max(0.01, L - 16);
    stem.scale.x = s;
    stem.position.x = s / 2;
    head.position.x = s + 8;
    a.visible = L > 18;
  };
  a.userData.mat = m;
  return a;
}

// matériaux par groupe du CAO, aux couleurs du robot réel (photos) : acrylique rouge, impressions et profilés noirs
const MATS = {
  acrylic: mat('#c0322a', {transparent: true, opacity: 0.45, depthWrite: false, roughness: 0.2}),
  plate: mat('#b3261e', {roughness: 0.35}),
  print: mat('#55595f', {roughness: 0.6, transparent: true}),
  beam: mat('#3a3d42', {roughness: 0.3, metalness: 0.6, transparent: true}),
  motor: mat('#c9ccd0', {roughness: 0.3, metalness: 0.7}),
  motorcap: mat('#44474c', {roughness: 0.4, metalness: 0.5}),
  driver: mat('#2f3a33', {roughness: 0.5}),
  beacon: mat('#ececea', {transparent: true}),
  beacondark: mat('#4a4d52', {transparent: true}),
  other: mat('#8d9096', {transparent: true}),
  wheel: mat('#3b3e43', {roughness: 0.55}),
  wroller: mat('#9a9ea4', {roughness: 0.8}),
  wpulley: mat('#d4d7db', {roughness: 0.25, metalness: 0.8}),
};
const EDGE = new THREE.LineBasicMaterial({color: INK, transparent: true, opacity: 0.22});

async function loadModel() {
  const loader = new GLTFLoader();
  if (modelSrc.startsWith('url:')) return loader.loadAsync(modelSrc.slice(4));
  const bin = Uint8Array.from(atob(modelSrc), (c) => c.charCodeAt(0));
  return loader.parseAsync(bin.buffer, '');
}

// maillage du CAO : normales recalculées avec arêtes vives, contour noir léger
// pièces courbes (roues, poulies, moteurs) : lissées davantage et sans contour, sinon chaque facette se voit
function cadMesh(node, material, smooth = false) {
  const g0 = node.geometry.clone();
  g0.applyMatrix4(node.matrixWorld);
  const g = toCreasedNormals(g0.toNonIndexed(), ((smooth ? 50 : 30) * Math.PI) / 180);
  const m = new THREE.Mesh(g, material);
  m.name = node.name;
  m.castShadow = !material.transparent;
  m.receiveShadow = true;
  if (!smooth) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g0, 35), EDGE));
  return m;
}

export async function buildRobot() {
  const gltf = await loadModel();
  gltf.scene.updateMatrixWorld(true);
  const nodes = {};
  gltf.scene.traverse((o) => {
    if (o.isMesh) nodes[o.name || o.parent.name] = o;
  });

  const root = new THREE.Group();
  const pathMat = new THREE.LineDashedMaterial({color: INK, dashSize: 8, gapSize: 6, transparent: true, opacity: 0});
  const path = new THREE.Line(new THREE.BufferGeometry().setFromPoints(PATH.map(([x, y]) => new THREE.Vector3(x, 0.6, -y))), pathMat);
  path.computeLineDistances();
  root.add(path);

  const robot = new THREE.Group();
  root.add(robot);
  // passage CAO -> three : (x, y, z) -> (x, z + sol, -y)
  const cad = new THREE.Group();
  cad.matrixAutoUpdate = false;
  cad.matrix.set(1, 0, 0, 0, 0, 0, 1, FLOOR, 0, -1, 0, 0, 0, 0, 0, 1);
  robot.add(cad);

  for (const [name, node] of Object.entries(nodes)) {
    if (/^(wheel|wroller|wpulley|mpulley)/.test(name)) continue;
    cad.add(cadMesh(node, MATS[name] || MATS.other, /^motor/.test(name)));
  }
  // profilés MakerBeam 10 × 10 : une barre pleine par profilé, dans son repère (boîte locale + placement du CAO)
  for (const {b, m: pl} of beams.beams) {
    const g = new THREE.BoxGeometry(b[3] - b[0], b[4] - b[1], b[5] - b[2]);
    g.translate((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2);
    const m = new THREE.Mesh(g, MATS.beam);
    m.matrixAutoUpdate = false;
    m.matrix.set(...pl);
    m.castShadow = true;
    cad.add(m);
  }

  // roues : la roue 1 du CAO, copiée à 120° ; chacune tourne autour de son axe radial (Y local), à 16,5 mm de haut
  const wheelMesh = new THREE.Group();
  for (const k of ['wheel', 'wroller', 'wpulley']) if (nodes[k + '0']) wheelMesh.add(cadMesh(nodes[k + '0'], MATS[k], true));
  const wheels = WHEELS.map((wd) => {
    const turn = new THREE.Group();
    turn.rotation.z = (wd.a - 90) * D2R;
    cad.add(turn);
    const spin = new THREE.Group();
    spin.position.z = AXLE;
    turn.add(spin);
    const m = wd.i === 0 ? wheelMesh : wheelMesh.clone();
    m.position.z = -AXLE;
    spin.add(m);
    // flèches au sol sous la roue : jante (tangente) et galets (radial), dans le repère three de la colonne
    const col = new THREE.Group();
    col.rotation.y = wd.a * D2R;
    robot.add(col);
    const drive = arrow(INK);
    drive.position.set(G.L, 2, 0);
    col.add(drive);
    const slip = arrow(new THREE.Color('#8a8a8a'), 0.9);
    slip.position.set(G.L, 2.5, 0);
    col.add(slip);
    return {wd, spin, drive, slip};
  });

  // vitesse du robot et rotation, au sol
  const vel = arrow(INK);
  vel.position.y = 3;
  robot.add(vel);
  const arcPts = [];
  for (let k = 0; k <= 40; k++) {
    const a = (k / 40) * 1.5 * Math.PI;
    arcPts.push(new THREE.Vector3(Math.cos(a) * 40, 3, Math.sin(a) * 40));
  }
  const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), new THREE.LineBasicMaterial({color: INK, transparent: true, depthTest: false}));
  arc.renderOrder = 5;
  robot.add(arc);
  const arcHead = new THREE.Mesh(new THREE.ConeGeometry(6, 13, 14), new THREE.MeshBasicMaterial({color: INK, transparent: true, depthTest: false}));
  arcHead.renderOrder = 5;
  robot.add(arcHead);

  /** Point monde au niveau de l'axe de la roue i, pour les étiquettes. */
  const wheelWorld = (i, st) => {
    const a = WHEELS[i].a * D2R + st.th * D2R;
    return new THREE.Vector3(st.x + Math.cos(a) * G.L, Y.axle, -(st.y + Math.sin(a) * G.L));
  };

  const K = 0.42; // mm de flèche par mm/s
  /** st : kin.state(t). view : {xray, vec, path, hi: {motors, rollers}}. */
  const update = (st, view) => {
    robot.position.set(st.x, 0, -st.y);
    robot.rotation.y = st.th * D2R;
    wheels.forEach((w, i) => {
      const s = st.wheels[i];
      // jante dans le sens t = (-sin a, cos a) : la roue tourne en sens inverse autour de son axe radial
      w.spin.rotation.y = -s.ang;
      w.drive.userData.set(Math.abs(s.rim) * K);
      w.drive.rotation.y = s.rim >= 0 ? Math.PI / 2 : -Math.PI / 2;
      w.drive.visible = w.drive.visible && view.vec > 0.02;
      w.drive.userData.mat.opacity = view.vec;
      w.slip.userData.set(Math.abs(s.slip) * K);
      w.slip.rotation.y = s.slip >= 0 ? 0 : Math.PI;
      w.slip.visible = w.slip.visible && view.vec > 0.02;
      w.slip.userData.mat.opacity = 0.85 * view.vec;
    });
    vel.userData.set(st.speed * K);
    vel.rotation.y = Math.atan2(st.vy, st.vx);
    vel.visible = vel.visible && view.vec > 0.02;
    vel.userData.mat.opacity = view.vec;
    const wk = Math.min(1, Math.abs(st.w) / 30) * view.vec;
    arc.material.opacity = wk;
    arcHead.material.opacity = wk;
    arc.scale.z = st.w >= 0 ? -1 : 1;
    const ea = 1.5 * Math.PI;
    arcHead.position.set(Math.cos(ea) * 40, 3, (st.w >= 0 ? -1 : 1) * Math.sin(ea) * 40);
    arcHead.rotation.set(0, 0, st.w >= 0 ? -Math.PI / 2 : Math.PI / 2);
    arcHead.visible = wk > 0.05;
    // carters, balise et électronique s'effacent pour voir les roues
    MATS.acrylic.opacity = 0.45 * (1 - 0.75 * view.xray);
    for (const m of [MATS.beacon, MATS.beacondark, MATS.other, MATS.print, MATS.beam]) {
      m.opacity = 1 - 0.85 * view.xray;
      m.depthWrite = view.xray < 0.5;
    }
    pathMat.opacity = 0.55 * view.path;
  };

  return {root, update, wheelWorld, Y};
}
