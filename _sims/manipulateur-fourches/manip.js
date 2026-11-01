// La géométrie du manipulateur et du mur, construite par le code depuis les cotes de kin.js.
// Repère : mm ; x latéral (+ = gauche vu face aux pierres), y vertical, z vers le robot. Face avant du mur
// d'origine en z = 0, le mur s'étend vers z < 0.
// Sorties : buildManip() -> {root, update(st, view)} ; update pose tout depuis l'état de kin.state(t) et l'affichage.
import * as THREE from 'three';
import {contact, fingerXY, G, servoXY} from './kin.js';

export const INK = new THREE.Color('#0e0e0e');
const PAPER = '#f4f4f2';
const D2R = Math.PI / 180;

// matériau à teinte réglable : sa couleur de repos glisse vers l'encre quand la pièce travaille
function mat(color, extra = {}) {
  const m = new THREE.MeshStandardMaterial({color, roughness: 0.72, metalness: 0.02, ...extra});
  m.userData.base = new THREE.Color(color);
  m.userData.opacity = m.opacity;
  return m;
}
const tint = (m, k) => m.color.copy(m.userData.base).lerp(INK, k);

// arêtes noires façon dessin technique
function edged(mesh, opacity = 0.9) {
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), new THREE.LineBasicMaterial({color: INK, transparent: true, opacity}));
  e.userData.opacity = opacity;
  mesh.add(e);
  mesh.userData.edges = e;
  return mesh;
}
const zcyl = (r, h, m, seg = 32) => {
  const g = new THREE.CylinderGeometry(r, r, h, seg);
  g.rotateX(Math.PI / 2);
  return new THREE.Mesh(g, m);
};

export function buildManip() {
  const root = new THREE.Group();
  const S = G.stone;

  // ---------------------------------------------------------------- le mur : 3 pierres
  const wall = new THREE.Group();
  root.add(wall);
  const stoneMat = mat('#e4d2ae', {transparent: true});
  const stones = [];
  for (let r = 0; r < G.rows; r++) {
    const m = edged(new THREE.Mesh(new THREE.BoxGeometry(S.L, S.H - 0.6, S.D), stoneMat), 0.75);
    m.position.set(0, S.H * (r + 0.5), -S.D / 2);
    m.castShadow = true;
    m.receiveShadow = true;
    wall.add(m);
    stones.push(m);
  }

  // ---------------------------------------------------------------- le robot
  const robot = new THREE.Group();
  root.add(robot);
  const xs = S.L / 2 - G.inset;
  const topY = S.H * 2.5 + G.dy + 40;
  const W = 2 * (xs + G.arm + G.finger.d / 2 + 14);
  const zPlate = G.armT + G.plateGap;
  const back = new THREE.Group();   // façade, servos, base : reculent en vue éclatée
  robot.add(back);

  const plateMat = mat('#cfd2d4', {transparent: true, opacity: 0.38, depthWrite: false});
  const plate = edged(new THREE.Mesh(new THREE.BoxGeometry(W, topY - 8, 4), plateMat), 0.55);
  plate.position.set(0, (topY + 8) / 2, zPlate + 2);
  back.add(plate);
  const baseMat = mat('#cfd2d4', {transparent: true, opacity: 0.3, depthWrite: false});
  const base = edged(new THREE.Mesh(new THREE.BoxGeometry(W, 30, 260), baseMat), 0.45);
  base.position.set(0, 23, zPlate + 4 + 130);
  back.add(base);

  const servoMat = mat('#a9acaf');
  const hornMat = mat('#c3c5c7', {metalness: 0.5, roughness: 0.4});
  const armMat = mat(PAPER);
  const fingerMat = mat(PAPER);
  const arms = [];
  const arcMat = new THREE.LineDashedMaterial({color: INK, dashSize: 5, gapSize: 4, transparent: true, opacity: 0});
  const arcs = [];
  for (let row = 0; row < G.rows; row++) {
    for (const side of [1, -1]) {
      const c = servoXY(row, side);
      const inward = -side;
      const SV = G.servo;
      const sv = new THREE.Group();
      back.add(sv);
      const body = edged(new THREE.Mesh(new THREE.BoxGeometry(SV.len, SV.w, SV.depth), servoMat), 0.7);
      body.position.set(c.x + inward * 10.35, c.y, zPlate + 4 + SV.earT + SV.depth / 2);
      body.castShadow = true;
      const ears = edged(new THREE.Mesh(new THREE.BoxGeometry(SV.ear, SV.w, SV.earT), servoMat), 0.7);
      ears.position.set(c.x + inward * 7.25, c.y, zPlate + 4 + SV.earT / 2);
      sv.add(body, ears);

      // le bras pivote autour de l'axe du servo, dans son plan
      const pivot = new THREE.Group();
      pivot.position.set(c.x, c.y, 0);
      robot.add(pivot);
      const shaft = zcyl(3, 1, hornMat, 16);
      robot.add(shaft);
      const bar = edged(new THREE.Mesh(new THREE.BoxGeometry(G.arm, 16, G.armT), armMat));
      bar.position.x = G.arm / 2;
      bar.castShadow = true;
      const hub = edged(zcyl(8, G.armT, armMat, 28));
      const boss = edged(zcyl(G.finger.d / 2 + 1, G.armT, armMat, 28));
      boss.position.x = G.arm;
      const r = G.finger.d / 2;
      const fing = edged(zcyl(r, 1, fingerMat, 28), 0.5);
      fing.castShadow = true;
      const cap = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), fingerMat);
      cap.castShadow = true;
      pivot.add(bar, hub, boss, fing, cap);

      // trajectoire du centre du doigt sur toute la course du servo
      const pts = [];
      for (let a = SV.min; a <= SV.max; a += 3) {
        const q = fingerXY(row, side, a);
        pts.push(new THREE.Vector3(q.x, q.y, 0));
      }
      const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat);
      arc.computeLineDistances();
      robot.add(arc);
      arcs.push({arc, row});

      // flèche d'effort : du doigt vers la pierre
      const arrow = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.BoxGeometry(1, 2.4, 2.4), new THREE.MeshBasicMaterial({color: INK}));
      const head = new THREE.Mesh(new THREE.ConeGeometry(5, 12, 16), new THREE.MeshBasicMaterial({color: INK}));
      head.rotation.z = side > 0 ? Math.PI / 2 : -Math.PI / 2;  // pointe vers l'intérieur
      arrow.add(stem, head);
      robot.add(arrow);
      arms.push({row, side, c, pivot, shaft, fing, cap, arrow, stem, head, sv});
    }
  }

  // ---------------------------------------------------------------- pose
  const armZ = (row, spread) => G.armT / 2 - row * spread;
  /**
   * st : état de kin.state(t). view : {xray, arcs, explode, hi: {robot, fingers, servos, wall}} (0..1 chacun).
   */
  const update = (st, view) => {
    const e = view.explode;
    const spread = G.layer + 38 * e;
    robot.position.z = st.gap;
    wall.position.z = st.wall;
    back.position.z = 70 * e;
    for (const a of arms) {
      const z = armZ(a.row, spread);
      a.pivot.position.z = z;
      // angle positif : le doigt descend vers l'intérieur
      a.pivot.rotation.z = a.side > 0 ? -st.angle * D2R : Math.PI + st.angle * D2R;
      const tipZ = -G.finger.len - z;
      const len = G.armT / 2 - tipZ - G.finger.d / 2;
      a.fing.scale.z = len;
      a.fing.position.set(G.arm, 0, (G.armT / 2 + tipZ + G.finger.d / 2) / 2);
      a.cap.position.set(G.arm, 0, tipZ + G.finger.d / 2);
      const zs = zPlate + 4 + 70 * e;
      a.shaft.scale.z = zs - (z + G.armT / 2);
      a.shaft.position.set(a.c.x, a.c.y, (zs + z + G.armT / 2) / 2);
      // contact : repère de longueur fixe, du doigt vers la pierre, à mi-profondeur de la pierre ; aucune valeur d'effort
      const k = st.held ? 1 : 0;
      a.arrow.visible = st.held;
      if (a.arrow.visible) {
        const p = fingerXY(a.row, a.side, st.angle);
        const L = 16 + 54 * k;
        a.arrow.position.set(p.x + a.side * (G.finger.d / 2 + 3), p.y, st.wall - st.gap - S.D / 2);
        a.head.position.x = a.side * 6;
        a.stem.scale.x = L;
        a.stem.position.x = a.side * (12 + L / 2);
      }
    }
    for (const {arc, row} of arcs) arc.position.z = armZ(row, spread);
    arcMat.opacity = 0.55 * view.arcs;

    // pierres translucides pour voir les doigts derrière
    stoneMat.opacity = 1 - 0.78 * view.xray;
    stoneMat.depthWrite = view.xray < 0.5;
    // la pièce qui travaille passe à l'encre ; les pièces translucides ne foncent que par leurs arêtes
    for (const s of stones) s.userData.edges.material.opacity = 0.55 - 0.2 * view.xray + 0.45 * view.hi.wall;
    tint(stoneMat, 0.08 * view.hi.wall);
    tint(armMat, 0.92 * view.hi.fingers);
    tint(fingerMat, 0.92 * view.hi.fingers);
    tint(servoMat, 0.9 * view.hi.servos);
    tint(plateMat, 0.2 * view.hi.robot);
    tint(baseMat, 0.2 * view.hi.robot);
    plateMat.opacity = 0.2 * (1 - 0.5 * view.fade);
    baseMat.opacity = 0.12 * (1 - 0.5 * view.fade);
    plate.userData.edges.material.opacity = 0.4 + 0.6 * view.hi.robot;
    base.userData.edges.material.opacity = 0.3 + 0.7 * view.hi.robot;
  };

  return {root, update, stones, arms, robot, wall, W, topY};
}
