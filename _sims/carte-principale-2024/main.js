// Carte principale du Jardinier (CDR 2024) : page explicative pour le site, assemblée avec le build du skill teardown.
// Build (depuis n'importe quel dossier, le HTML sort dans ./teardown-out/dist/) :
//   node .claude/skills/teardown/sims/build.mjs _sims/carte-principale-2024
//   cp teardown-out/dist/carte-principale-2024.html assets/img/projets/cdr-2024/carte-principale/simulateur.html
//   cp _sims/carte-principale-2024/carte-*.jpg assets/img/projets/cdr-2024/carte-principale/
//   (rendus de la carte par kicad-cli pcb render, chargés à côté de la page)
// Polices du site embarquées (OFL) : la page marche dans son cadre sans charger Google Fonts.
import barlowCondensed700 from './fonts/barlow-condensed-latin-700-normal.woff2';
import barlow400 from './fonts/barlow-latin-400-normal.woff2';
import barlow600 from './fonts/barlow-latin-600-normal.woff2';
import {runApp} from './app.js';

const face = (family, weight, b64) => new FontFace(family, `url(data:font/woff2;base64,${b64})`, {weight: String(weight)});
const fonts = [face('Barlow Condensed', 700, barlowCondensed700), face('Barlow', 400, barlow400), face('Barlow', 600, barlow600)];
for (const f of fonts) document.fonts.add(f);
document.title = 'Carte principale 2024 · Barbatronic';
document.documentElement.lang = 'fr';
// dans le cadre d'une page du site, le titre est déjà au-dessus : on le masque
if (window.self !== window.top) document.documentElement.classList.add('embedded');
Promise.all(fonts.map((f) => f.load()))
  .catch(() => {})
  .then(runApp);
