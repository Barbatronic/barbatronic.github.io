// Le studio : fond papier, sol millimétré comme la grille du site, ombres douces, caméra en orbite.
// Sorties : createStage(canvas) -> {renderer, scene, camera, manip, resize(w, h, pr), frame(st, view, cam), project, setQuality}.
// cam : {tx, ty, tz, az, el, d} en mm et radians ; az = 0 regarde depuis le robot (z+).
import * as THREE from 'three';
import {buildManip} from './manip.js';

const BG = '#ffffff';
const FLOOR_VERT = /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
// grille de 10 mm, trait fort tous les 50 mm, fondue dans le blanc au loin
const FLOOR_FRAG = /* glsl */ `uniform vec3 uC; varying vec3 vW;
  float line(float x, float s, float w){ float d = abs(mod(x + s * 0.5, s) - s * 0.5); return 1.0 - smoothstep(0.0, w, d); }
  void main(){
    vec2 p = vW.xz;
    float fw = max(fwidth(p.x), fwidth(p.y));
    float minor = max(line(p.x, 10.0, fw), line(p.y, 10.0, fw)) * 0.5;
    float major = max(line(p.x, 50.0, fw * 1.4), line(p.y, 50.0, fw * 1.4));
    float g = max(minor * clamp(1.6 - fw * 0.9, 0.0, 1.0), major);
    vec3 col = mix(vec3(1.0), vec3(0.89), g);
    float d = length(p - uC.xz);
    gl_FragColor = vec4(mix(col, vec3(1.0), smoothstep(380.0, 900.0, d)), 1.0);
  }`;

export function createStage({canvas}) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(BG, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  const camera = new THREE.PerspectiveCamera(30, 16 / 9, 5, 8000);

  scene.add(new THREE.HemisphereLight('#ffffff', '#c9c9c9', 1.45));
  const sun = new THREE.DirectionalLight('#ffffff', 1.5);
  sun.position.set(380, 900, 520);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, {left: -700, right: 700, top: 700, bottom: -700, near: 100, far: 2400});
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  const floorMat = new THREE.ShaderMaterial({vertexShader: FLOOR_VERT, fragmentShader: FLOOR_FRAG, uniforms: {uC: {value: new THREE.Vector3()}}});
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const shade = new THREE.Mesh(
    new THREE.PlaneGeometry(4000, 4000),
    new THREE.ShadowMaterial({color: '#000000', opacity: 0.13, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8}),
  );
  shade.rotation.x = -Math.PI / 2;
  shade.receiveShadow = true;
  scene.add(shade);

  const manip = buildManip();
  scene.add(manip.root);

  const size = {w: 1, h: 1};
  const resize = (w, h, pr) => {
    size.w = w;
    size.h = h;
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const frame = (st, view, cam) => {
    manip.update(st, view);
    // sur écran étroit, la caméra recule pour garder le mécanisme entier
    const k = camera.aspect < 1.25 ? Math.min(1.6, 1.25 / camera.aspect) : 1;
    const d = cam.d * k;
    camera.position.set(cam.tx + d * Math.cos(cam.el) * Math.sin(cam.az), cam.ty + d * Math.sin(cam.el), cam.tz + d * Math.cos(cam.el) * Math.cos(cam.az));
    camera.lookAt(cam.tx, cam.ty, cam.tz);
    camera.updateMatrixWorld();
    floorMat.uniforms.uC.value.set(cam.tx, 0, cam.tz);
    renderer.render(scene, camera);
  };

  const pv = new THREE.Vector3();
  /** Point du monde -> px CSS dans le canvas, ou null s'il est derrière la caméra. */
  const project = (x, y, z) => {
    pv.set(x, y, z).project(camera);
    if (pv.z > 1) return null;
    return [(pv.x * 0.5 + 0.5) * size.w, (-pv.y * 0.5 + 0.5) * size.h];
  };
  const setQuality = ({shadow}) => {
    sun.shadow.mapSize.set(shadow, shadow);
    sun.shadow.map?.dispose();
    sun.shadow.map = null;
  };
  return {renderer, scene, camera, manip, resize, frame, project, size, setQuality};
}
