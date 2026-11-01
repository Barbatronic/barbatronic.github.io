// Chapitre 1 : d'où vient l'énergie. Synoptique de l'alimentation : batterie, fusible, relais, puis une ligne par
// tension avec son régulateur et ses consommateurs. Un clic sur une ligne l'explique et la montre sur la carte.
// Sorties : energie(api) -> {mount(stage, ctrl), tick(t)} ; api : {side(html), show(refs, note)}.
import {RAILS} from './kin.js';
import {box, S, wire} from './svg.js';

const LEAD = `<p class="lead">La carte reçoit une seule source d'énergie, la batterie, et en tire quatre tensions. Chaque composant n'accepte que la sienne : le Teensy vit en 5 V, le module radio en 3,3 V, les moteurs prennent la batterie directement.</p>`;
const KEEP = `<div class="keep"><h4>À retenir</h4><ul>
  <li>Une seule entrée : la batterie 6S, 22,2 V, par le connecteur XT60 J1.</li>
  <li>Le fusible F1 (5 A) protège tout ce qui suit.</li>
  <li>Le relais K2 laisse passer ou coupe toute la puissance : c'est l'arrêt d'urgence (chapitre 2).</li>
  <li>Trois régulateurs Recom fabriquent le 5, le 12 et le 3,3 V (2 A chacun) ; un convertisseur TRACO de 10 A sert les servos.</li>
  <li>Une LED témoin par tension montre qu'elle est présente.</li>
</ul><p class="hint">Cliquer une ligne pour la détailler.</p></div>`;
const BASE_REFS = ['J1', 'F1', 'K2', 'U4', 'U3', 'U2', 'PS1'];

export function energie(api) {
  let sel = null;
  let servoOn = true;
  let estop = false;
  let rows = [];
  let wIn = [];

  const showSide = () => {
    const r = RAILS.find((x) => x.key === sel);
    if (!r) {
      api.side(LEAD + KEEP);
      api.show(BASE_REFS, 'Alimentation : entrée, fusible, relais et régulateurs');
      return;
    }
    api.side(`<p class="kick mono">${r.name === r.volt ? r.volt : r.volt + ' · ' + r.name}</p><p class="lead">${r.text}</p>
      <div class="keep"><h4>Alimente</h4><ul>${r.loads.map((l) => `<li>${l}</li>`).join('')}</ul>
      <p class="hint">Cliquer à nouveau pour revenir à l'ensemble.</p></div>`);
    api.show(r.refs, `${r.volt} : ${r.reg ? r.reg + ' et ' : ''}consommateurs`);
  };

  const mount = (stage, ctrl) => {
    const svg = S('svg', {viewBox: '0 0 1000 520', class: 'syn', role: 'img', 'aria-label': 'Synoptique de l\'alimentation'}, stage);
    // entrée : batterie, fusible, relais, bus
    const Y = 250;
    box(svg, 20, Y - 40, 140, 80, ['Batterie 6S', '22,2 V', 'J1 · XT60'], 'src');
    wIn.push(wire(svg, [[160, Y], [200, Y]]));
    box(svg, 200, Y - 30, 100, 60, ['Fusible F1', '5 A']);
    wIn.push(wire(svg, [[300, Y], [335, Y]]));
    box(svg, 335, Y - 30, 110, 60, ['Relais K2', 'arrêt d\'urgence']);
    const ys = RAILS.map((_, i) => 50 + i * 105);
    wIn.push(wire(svg, [[445, Y], [480, Y]]));
    const bus = wire(svg, [[480, ys[0]], [480, ys[ys.length - 1]]], 'bus');
    S('text', {x: 488, y: ys[0] - 14, class: 'lab'}, svg).textContent = '22,2 V';
    rows = RAILS.map((r, i) => {
      const y = ys[i];
      const g = S('g', {class: 'row', tabindex: 0, role: 'button', 'aria-label': `Ligne ${r.name}`}, svg);
      S('rect', {x: 484, y: y - 46, width: 506, height: 92, class: 'hit'}, g);
      const w1 = wire(g, r.reg ? [[480, y], [530, y]] : [[480, y], [700, y]]);
      let w2 = null;
      if (r.reg) {
        box(g, 530, y - 28, 140, 56, [r.reg, r.regName], 'reg');
        w2 = wire(g, [[670, y], [700, y]]);
      } else {
        S('text', {x: 590, y: y - 8, class: 'lab c'}, g).textContent = 'direct';
      }
      const lb = box(g, 700, y - 38, 290, 76, [r.name === r.volt ? r.volt : `${r.volt} · ${r.name}`, ...r.loads.slice(0, 3)], 'load');
      const led = S('circle', {cx: 985, cy: y - 30, r: 5, class: 'led'}, g);
      if (r.key === 'v5p') {
        S('text', {x: 600, y: y + 46, class: 'lab c'}, g).textContent = 'allumé par le Teensy (En5VP)';
      }
      const pick = () => {
        sel = sel === r.key ? null : r.key;
        showSide();
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick()));
      return {r, g, w: [w1, w2, bus].filter(Boolean), lb, led};
    });

    const b1 = document.createElement('button');
    b1.className = 'bt';
    b1.type = 'button';
    b1.addEventListener('click', () => (servoOn = !servoOn));
    const b2 = document.createElement('button');
    b2.className = 'bt';
    b2.type = 'button';
    b2.addEventListener('click', () => (estop = !estop));
    ctrl.append(b1, b2);
    mount.b1 = b1;
    mount.b2 = b2;
    showSide();
  };

  const tick = () => {
    for (const w of wIn.slice(0, 2)) w.classList.add('on');
    wIn[2].classList.toggle('on', !estop);
    for (const x of rows) {
      const live = !estop && (x.r.key !== 'v5p' || servoOn);
      for (const w of x.w) w.classList.toggle('on', live && (w.classList.contains('bus') ? !estop : true));
      x.lb.classList.toggle('off', !live);
      x.led.classList.toggle('on', live);
      x.g.classList.toggle('sel', sel === x.r.key);
      x.g.classList.toggle('dim', !!sel && sel !== x.r.key);
    }
    mount.b1.textContent = servoOn ? 'Teensy : couper le 5 V servos' : 'Teensy : allumer le 5 V servos';
    mount.b1.classList.toggle('on', !servoOn);
    mount.b2.textContent = estop ? 'Relâcher l\'arrêt d\'urgence' : 'Appuyer sur l\'arrêt d\'urgence';
    mount.b2.classList.toggle('on', estop);
  };

  return {mount, tick};
}
