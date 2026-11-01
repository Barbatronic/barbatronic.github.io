// Base holonome du Jardinier (CDR 2024) : page interactive pour le site, construite avec le skill teardown.
// Build (depuis n'importe quel dossier, le HTML sort dans ./teardown-out/dist/) :
//   node .claude/skills/teardown/sims/build.mjs _sims/base-holonome
//   cp teardown-out/dist/base-holonome.html assets/img/projets/cdr-2024/base-holonome/simulateur.html
//   cp teardown-out/dist/base.glb assets/img/projets/cdr-2024/base-holonome/base.glb   (modèle CAO, chargé à côté de la page)
// Polices du site embarquées (OFL) : la page marche hors ligne et dans son cadre sans charger Google Fonts.
import barlowCondensed700 from './fonts/barlow-condensed-latin-700-normal.woff2';
import barlow400 from './fonts/barlow-latin-400-normal.woff2';
import barlow600 from './fonts/barlow-latin-600-normal.woff2';
import {runLive} from './live.js';

const face = (family, weight, b64) => new FontFace(family, `url(data:font/woff2;base64,${b64})`, {weight: String(weight)});
const fonts = [face('Barlow Condensed', 700, barlowCondensed700), face('Barlow', 400, barlow400), face('Barlow', 600, barlow600)];
for (const f of fonts) document.fonts.add(f);
document.title = 'Base holonome · Barbatronic';
document.documentElement.lang = 'fr';
// dans le cadre d'une page du site, le titre est déjà au-dessus : on le masque
if (window.self !== window.top) document.documentElement.classList.add('embedded');
Promise.all(fonts.map((f) => f.load()))
  .catch(() => {})
  .then(runLive);
