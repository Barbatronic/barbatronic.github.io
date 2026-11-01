// Chapitre 2 : comment l'arrêt d'urgence coupe tout. Schéma de deux boucles, d'après le fichier KiCad : la puissance
// (batterie, F1, contact du relais K2, +24V) et la commande (bobine de K2, diode D4 en parallèle, bouton J21, masse).
// Boutons : appuyer sur l'arrêt d'urgence, arracher un fil du bouton.
// Sorties : bau(api) -> {mount(stage, ctrl), tick(t), parts, extracts}.
import {box, S, wire} from './svg.js';

const LEAD = `<p class="lead">L'arrêt d'urgence ne coupe pas lui-même le courant des moteurs. Il coupe le petit courant de la bobine d'un relais ; c'est le relais qui coupe la puissance.</p>`;
const KEEP = `<div class="keep"><h4>À retenir</h4><ul>
  <li>Bouton relâché : la bobine du relais K2 est alimentée, son contact est fermé, le robot est sous tension.</li>
  <li>Bouton appuyé : la bobine n'est plus alimentée, le contact s'ouvre, tout ce qui est après le relais s'éteint d'un coup.</li>
  <li>Un fil du bouton arraché fait la même chose : une panne de câblage arrête le robot au lieu de le laisser tourner.</li>
  <li>La diode D4, en parallèle de la bobine, absorbe la surtension que la bobine produit quand on la coupe.</li>
  <li>Le fusible F1 est avant le relais : il protège aussi la bobine.</li>
  <li>Contacts de K2 : le commun 11 est sur /24VD, le contact travail 14 donne +24V ; le contact repos 12 n'est pas câblé.</li>
  <li>La LED D5 s'allume dès que la batterie est branchée ; D1 seulement quand le relais est fermé.</li>
</ul></div>`;
const PARTS = ['J1', 'F1', 'K2', 'D4', 'J21', 'D5', 'R3', 'D1', 'R1'];
const EXTRACTS = [
  {t: 'Batterie, fusible, relais', block: 'Gestion Batterie'},
  {t: 'LED témoins', block: 'Indicateurs'},
];

export function bau(api) {
  let pressed = false;
  let broken = false;
  let tOff = -9;
  let was = true;
  const el = {};

  const mount = (stage, ctrl) => {
    const svg = S('svg', {viewBox: '0 0 1000 520', class: 'syn sch', role: 'img', 'aria-label': 'Schéma de l\'arrêt d\'urgence'}, stage);
    S('text', {x: 20, y: 34, class: 'capt'}, svg).textContent = 'PUISSANCE';
    S('text', {x: 20, y: 300, class: 'capt'}, svg).textContent = 'COMMANDE';
    // boucle de puissance
    const Y = 110;
    box(svg, 20, Y - 40, 130, 80, ['Batterie 6S', '+BATT', 'J1'], 'src');
    el.p1 = wire(svg, [[150, Y], [200, Y]]);
    box(svg, 200, Y - 28, 100, 56, ['Fusible F1', '5 A']);
    el.p2 = wire(svg, [[300, Y], [470, Y]]);
    S('circle', {cx: 360, cy: Y, r: 5, class: 'node'}, svg);
    S('text', {x: 360, y: Y - 14, class: 'lab c'}, svg).textContent = '/24VD';
    // contact du relais : deux bornes et un levier
    S('circle', {cx: 470, cy: Y, r: 5, class: 'term'}, svg);
    S('circle', {cx: 560, cy: Y, r: 5, class: 'term'}, svg);
    el.lever = S('line', {x1: 470, y1: Y, x2: 556, y2: Y - 3, class: 'lever'}, svg);
    S('text', {x: 515, y: Y + 34, class: 'lab c'}, svg).textContent = 'contact de K2';
    el.p3 = wire(svg, [[560, Y], [650, Y]]);
    S('text', {x: 605, y: Y - 14, class: 'lab c'}, svg).textContent = '+24V';
    el.out = box(svg, 650, Y - 50, 330, 100, ['Tout le robot', 'régulateurs 5, 12, 3,3 V', 'drivers des moteurs', 'Teensy, servos, capteurs'], 'load');
    // boucle de commande : /24VD -> bobine -> bouton -> masse ; D4 en parallèle de la bobine
    el.c1 = wire(svg, [[360, Y], [360, 230]]);
    S('rect', {x: 335, y: 230, width: 50, height: 90, class: 'coil'}, svg);
    for (let i = 0; i < 4; i++) S('path', {d: `M345 ${244 + i * 18}q15 9 0 18`, class: 'turn'}, svg);
    S('text', {x: 395, y: 270, class: 'lab'}, svg).textContent = 'bobine de K2';
    el.mech = S('line', {x1: 385, y1: 245, x2: 515, y2: Y + 6, class: 'mech'}, svg);
    S('text', {x: 455, y: 205, class: 'lab'}, svg).textContent = 'attire le levier';
    // diode D4 : cathode côté /24VD
    el.d1 = wire(svg, [[360, 200], [250, 200], [250, 240]]);
    // triangle pointe en haut, barre en haut : cathode côté /24VD, la diode ne conduit qu'à la coupure
    S('path', {d: 'M235 276h30l-15 -26z', class: 'diode'}, svg);
    S('line', {x1: 235, y1: 249, x2: 265, y2: 249, class: 'diode-k'}, svg);
    el.d2 = wire(svg, [[250, 276], [250, 350], [360, 350]]);
    S('text', {x: 200, y: 268, class: 'lab c'}, svg).textContent = 'D4';
    el.c2 = wire(svg, [[360, 320], [360, 420], [470, 420]]);
    // bouton d'arrêt d'urgence, contact normalement fermé
    S('circle', {cx: 470, cy: 420, r: 5, class: 'term'}, svg);
    S('circle', {cx: 560, cy: 420, r: 5, class: 'term'}, svg);
    el.btnBar = S('line', {x1: 462, y1: 414, x2: 568, y2: 414, class: 'lever'}, svg);
    el.btnStem = S('line', {x1: 515, y1: 414, x2: 515, y2: 380, class: 'lever'}, svg);
    el.btnCap = S('rect', {x: 490, y: 364, width: 50, height: 16, rx: 8, class: 'cap-btn'}, svg);
    S('text', {x: 515, y: 456, class: 'lab c'}, svg).textContent = 'bouton d\'arrêt d\'urgence (J21)';
    el.c3 = wire(svg, [[560, 420], [680, 420], [680, 440]]);
    el.cut = S('g', {class: 'cut'}, svg);
    S('path', {d: 'M610 406l12 28M626 406l12 28', class: 'cutmark'}, el.cut);
    S('path', {d: 'M665 448h30M671 456h18M677 464h6', class: 'gnd'}, svg);
    S('text', {x: 700, y: 452, class: 'lab'}, svg).textContent = 'masse';

    const b1 = document.createElement('button');
    b1.type = 'button';
    b1.className = 'bt big';
    b1.addEventListener('click', () => (pressed = !pressed));
    const b2 = document.createElement('button');
    b2.type = 'button';
    b2.className = 'bt';
    b2.addEventListener('click', () => (broken = !broken));
    ctrl.append(b1, b2);
    el.b1 = b1;
    el.b2 = b2;
    api.side(LEAD + KEEP);
  };

  const tick = (t) => {
    const coil = !pressed && !broken;
    if (was && !coil) tOff = t;
    was = coil;
    // le contact retombe un peu après la coupure de la bobine ; la diode conduit un court instant
    const closed = coil || t - tOff < 0.08;
    const flyback = !coil && t - tOff < 0.6;
    const Y = 110;
    el.lever.setAttribute('y2', closed ? Y - 3 : Y - 42);
    el.lever.setAttribute('x2', closed ? 556 : 545);
    el.mech.classList.toggle('on', coil);
    el.p1.classList.add('on');
    el.p2.classList.add('on');
    el.p3.classList.toggle('on', closed);
    el.out.classList.toggle('off', !closed);
    for (const w of [el.c1, el.c2]) w.classList.toggle('on', coil || flyback);
    el.c3.classList.toggle('on', coil);
    for (const w of [el.d1, el.d2]) w.classList.toggle('on', flyback);
    el.c1.classList.toggle('rev', flyback);
    const dy = pressed ? -22 : 0;
    el.btnBar.setAttribute('y1', 414 + dy);
    el.btnBar.setAttribute('y2', 414 + dy);
    el.btnStem.setAttribute('y1', 414 + dy);
    el.btnStem.setAttribute('y2', 380 + dy);
    el.btnCap.setAttribute('y', 364 + dy);
    el.cut.style.display = broken ? '' : 'none';
    el.c3.style.opacity = broken ? 0.25 : 1;
    el.b1.textContent = pressed ? 'Relâcher l\'arrêt d\'urgence' : 'Appuyer sur l\'arrêt d\'urgence';
    el.b1.classList.toggle('on', pressed);
    el.b2.textContent = broken ? 'Rebrancher le fil du bouton' : 'Arracher un fil du bouton';
    el.b2.classList.toggle('on', broken);
  };

  return {mount, tick, parts: PARTS, extracts: EXTRACTS};
}
