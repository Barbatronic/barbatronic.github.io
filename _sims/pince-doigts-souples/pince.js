// La pince, son bras de levage et les pots en 3D. Pièces du CAO (pince.glb, module avant de robots_2024.FCStd exporté
// avec FreeCAD) ; doigts construits par le code depuis le profil de kin.js, pour pouvoir les plier segment par segment.
// Repère three : mm ; X latéral, Y vertical (sol en 0), Z vers l'avant (vers les pots). Repère du CAO : X, Y vers
// l'arrière du robot, Z vertical, sol à -13,5 : (x, y, z) -> (x, z + 13,5, -y).
// Mouvements : le robot avance de st.z ; les deux bras tournent autour de leur pivot côté robot ; la pince translate
// sans tourner (parallélogramme) ; les doigts se plient selon st.th.
// Sorties : buildPince() (promesse) -> {root, update(st, view), fingerWorld(side, p, st), potWorld(side, st),
// armWorld(st), tubeWorld(side, st), Y, ZF}.
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {toCreasedNormals} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {apply, CURL, fingerPose, G, SEG, segOutline} from './kin.js';
import modelSrc from './pince.glb';

export const INK = new THREE.Color('#0e0e0e');
const D2R = Math.PI / 180;
const F = G.finger;
const FLOOR = -G.lift.floor;
/** Hauteur du plan des doigts dans la pose du CAO, et position avant du repère des doigts (v = 0). */
export const Y = {finger: G.fingerZ + FLOOR};
const ZF = -G.fingerY;
const PIV = {up: new THREE.Vector3(0, G.lift.upZ + FLOOR, -G.lift.frameY), low: new THREE.Vector3(0, G.lift.lowZ + FLOOR, -G.lift.frameY)};

// faces visibles des deux côtés : les pièces symétriques du CAO ont leurs triangles retournés
function mat(color, extra = {}) {
  const m = new THREE.MeshStandardMaterial({color, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide, ...extra});
  m.userData.base = new THREE.Color(color);
  return m;
}
const tint = (m, k) => m.color.copy(m.userData.base).lerp(INK, k);
const EDGE = new THREE.LineBasicMaterial({color: INK, transparent: true, opacity: 0.25});

// couleurs du robot réel (photos) : pièces imprimées noires, plaques et bras en acrylique rouge
const MATS = {
  frame: mat('#55595f', {roughness: 0.6}),
  frame_plate: mat('#c0322a', {transparent: true, opacity: 0.55, depthWrite: false, roughness: 0.2}),
  servo: mat('#26272a', {roughness: 0.45}),
  other: mat('#e9e9e7'),
  arm_up: mat('#b3261e', {roughness: 0.3}),
  arm_low: mat('#b3261e', {roughness: 0.3}),
  arm_up_bearing: mat('#c9ccd0', {roughness: 0.3, metalness: 0.7}),
  arm_low_bearing: mat('#c9ccd0', {roughness: 0.3, metalness: 0.7}),
  pince: mat('#55595f', {roughness: 0.6, transparent: true}),
  pince_plate: mat('#b3261e', {roughness: 0.3, transparent: true}),
  pince_bearing: mat('#c9ccd0', {roughness: 0.3, metalness: 0.7}),
  pince_tube: mat('#ffffff', {roughness: 0.4, transparent: true, opacity: 0.9}),
};
const SMOOTH = /bearing|tube|servo|other/;

async function loadModel() {
  const loader = new GLTFLoader();
  if (modelSrc.startsWith('url:')) return loader.loadAsync(modelSrc.slice(4));
  const bin = Uint8Array.from(atob(modelSrc), (c) => c.charCodeAt(0));
  return loader.parseAsync(bin.buffer, '');
}
function cadMesh(node, material, smooth) {
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
// groupe dans le repère du CAO, ramené dans le repère three
function cadFrame() {
  const g = new THREE.Group();
  g.matrixAutoUpdate = false;
  g.matrix.set(1, 0, 0, 0, 0, 0, 1, FLOOR, 0, -1, 0, 0, 0, 0, 0, 1);
  return g;
}
function segShape(j) {
  const s = new THREE.Shape();
  segOutline(j).forEach(([u, v], i) => (i ? s.lineTo(u, v) : s.moveTo(u, v)));
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: F.w, bevelEnabled: false});
  g.translate(0, 0, -F.w / 2);
  return g;
}

export async function buildPince() {
  const gltf = await loadModel();
  gltf.scene.updateMatrixWorld(true);
  const nodes = {};
  gltf.scene.traverse((o) => {
    if (o.isMesh) nodes[o.name || o.parent.name] = o;
  });

  const root = new THREE.Group();
  const robot = new THREE.Group();
  root.add(robot);
  const fixed = cadFrame();
  robot.add(fixed);
  // bras : pivot côté robot ; le groupe interne ramène le pivot à l'origine pour tourner autour
  const arm = (p) => {
    const pivot = new THREE.Group();
    pivot.position.copy(p);
    const inner = new THREE.Group();
    inner.position.copy(p).multiplyScalar(-1);
    pivot.add(inner);
    const cad = cadFrame();
    inner.add(cad);
    robot.add(pivot);
    return {pivot, cad};
  };
  const armUp = arm(PIV.up);
  const armLow = arm(PIV.low);
  const pinceG = new THREE.Group();
  robot.add(pinceG);
  const pinceCad = cadFrame();
  pinceG.add(pinceCad);
  for (const [name, node] of Object.entries(nodes)) {
    const m = cadMesh(node, MATS[name] || MATS.frame, SMOOTH.test(name));
    if (name.startsWith('arm_up') || name === 'other') armUp.cad.add(m);
    else if (name.startsWith('arm_low')) armLow.cad.add(m);
    else if (name.startsWith('pince')) pinceCad.add(m);
    else fixed.add(m);
  }

  // ---------------------------------------------------------------- doigts, sur la pince mobile
  const tpuMat = mat('#f6f6f4', {transparent: true});
  const cableMat = new THREE.LineBasicMaterial({color: INK});
  const segGeo = SEG.map((_, j) => segShape(j));
  const fingers = [];
  for (const side of [1, -1]) {
    // repère du doigt : u vers l'extérieur (X), v vers l'avant (Z), épaisseur vers le haut (Y)
    const fr = new THREE.Group();
    fr.matrixAutoUpdate = false;
    fr.matrix.set(side, 0, 0, side * G.rootX, 0, 0, 1, Y.finger, 0, 1, 0, ZF, 0, 0, 0, 1);
    pinceG.add(fr);
    const segs = segGeo.map((g) => {
      const m = new THREE.Mesh(g, tpuMat);
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), new THREE.LineBasicMaterial({color: INK, transparent: true, opacity: 0.5})));
      m.castShadow = true;
      m.renderOrder = 2;
      fr.add(m);
      return m;
    });
    const cpts = new Float32Array(3 * SEG.length * 2);
    const cgeo = new THREE.BufferGeometry();
    cgeo.setAttribute('position', new THREE.BufferAttribute(cpts, 3));
    const cable = new THREE.Line(cgeo, cableMat);
    cable.renderOrder = 3;
    fr.add(cable);
    const tp = CURL.rows.filter((_, i) => i % 8 === 0).map((r) => {
      const q = apply(fingerPose(r.th)[5], [F.tip, 0]);
      return new THREE.Vector3(q[0], q[1], 0);
    });
    const trace = new THREE.Line(new THREE.BufferGeometry().setFromPoints(tp), new THREE.LineDashedMaterial({color: INK, dashSize: 3, gapSize: 2.5, transparent: true, opacity: 0}));
    trace.computeLineDistances();
    fr.add(trace);
    // repères de contact (un par segment), sans valeur d'effort
    const arrows = SEG.map(() => {
      const a = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.BoxGeometry(1, 1.6, 1.6), new THREE.MeshBasicMaterial({color: INK}));
      const head = new THREE.Mesh(new THREE.ConeGeometry(3.2, 8, 14), new THREE.MeshBasicMaterial({color: INK}));
      a.add(stem, head);
      a.visible = false;
      fr.add(a);
      return {a, stem, head};
    });
    fingers.push({side, segs, cable, cpts, trace, arrows});
  }

  // ---------------------------------------------------------------- pots
  const potMat = mat('#ffffff', {transparent: true});
  const leafMat = mat('#b9bdb4');
  const pots = [1, -1].map((side) => {
    const g = new THREE.CylinderGeometry(G.pot.rTop, G.pot.rBot, G.pot.h, 48);
    const m = new THREE.Mesh(g, potMat);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 40), new THREE.LineBasicMaterial({color: INK, transparent: true, opacity: 0.6})));
    m.castShadow = true;
    m.receiveShadow = true;
    for (let i = 0; i < 3; i++) {
      const l = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), leafMat);
      l.scale.set(9, 22, 4);
      l.position.set(Math.cos(i * 2.1) * 7, G.pot.h / 2 + 18, Math.sin(i * 2.1) * 7);
      l.rotation.set(0.3 * Math.sin(i * 2.1), i * 2.1, 0.35 * Math.cos(i * 2.1));
      l.castShadow = true;
      m.add(l);
    }
    root.add(m);
    return {side, m};
  });

  /** Point (u, v) du doigt d'un côté -> monde, avec la pince levée et le robot avancé. */
  const fingerWorld = (side, p, st) => new THREE.Vector3(side * (G.rootX + p[0]), Y.finger + st.lift.dy, ZF + p[1] + st.lift.dz + st.z);
  const potWorld = (side, st) => new THREE.Vector3(side * (G.rootX + st.potUV.u), G.pot.h / 2 + st.pot.dy, ZF + st.potUV.v + st.pot.dz);
  /** Milieu du bras supérieur, et haut du tube PTFE d'un côté. */
  const armWorld = (st) => {
    const a = st.arm * D2R;
    return new THREE.Vector3(-21.5, PIV.up.y - (G.lift.L / 2) * Math.sin(a), PIV.up.z + (G.lift.L / 2) * Math.cos(a) + st.z);
  };
  const tubeWorld = (side, st) => new THREE.Vector3(side * 12, 125.4 + FLOOR + st.lift.dy, 174.3 + st.lift.dz + st.z);

  /** st : kin.state(t). view : {xray, trace, hi: {fingers, arm, pots}} (0..1 chacun). */
  const update = (st, view) => {
    robot.position.z = st.z;
    const da = (st.arm - G.lift.th0) * D2R;
    armUp.pivot.rotation.x = da;
    armLow.pivot.rotation.x = da;
    pinceG.position.set(0, st.lift.dy, st.lift.dz);
    const pose = fingerPose(st.th);
    for (const f of fingers) {
      f.segs.forEach((m, j) => {
        m.position.set(pose[j].o[0], pose[j].o[1], 0);
        m.rotation.z = pose[j].a;
      });
      let k = 0;
      SEG.forEach(([u0, u1], j) => {
        for (const u of [j === 0 ? u0 - 1 : u0, j === 5 ? u1 - 3 : u1]) {
          const q = apply(pose[j], [u, F.cable]);
          f.cpts[k++] = q[0];
          f.cpts[k++] = q[1];
          f.cpts[k++] = 0;
        }
      });
      f.cable.geometry.attributes.position.needsUpdate = true;
      f.trace.material.opacity = 0.6 * view.trace;
      f.arrows.forEach((ar) => (ar.a.visible = false));
      st.pts.forEach((c, i) => {
        const ar = f.arrows[i];
        ar.a.visible = true;
        ar.a.position.set(c.q[0], c.q[1], F.w / 2 + 2);
        ar.a.rotation.z = Math.atan2(-c.n[1], -c.n[0]);
        ar.head.rotation.z = -Math.PI / 2;
        ar.head.position.x = -4;
        ar.stem.scale.x = 12;
        ar.stem.position.x = -14;
      });
    }
    for (const p of pots) p.m.position.copy(potWorld(p.side, st));
    tpuMat.opacity = 1 - 0.72 * view.xray;
    tpuMat.depthWrite = view.xray < 0.5;
    for (const m of [MATS.pince, MATS.pince_plate]) {
      m.opacity = 1 - 0.75 * view.xray;
      m.depthWrite = view.xray < 0.5;
    }
    tint(tpuMat, 0.85 * view.hi.fingers);
    tint(MATS.arm_up, 0.6 * view.hi.arm);
    tint(MATS.arm_low, 0.6 * view.hi.arm);
    tint(potMat, 0.12 * view.hi.pots);
  };

  return {root, update, fingerWorld, potWorld, armWorld, tubeWorld, Y, ZF};
}
