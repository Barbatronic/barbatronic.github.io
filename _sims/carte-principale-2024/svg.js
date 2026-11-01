// Petits outils de dessin SVG partagés par les chapitres : création d'éléments, boîtes légendées, fils animés.
// Sorties : S(tag, attrs, parent), box(parent, x, y, w, h, lines, cls), wire(parent, points, cls), fr(x, d).
const NS = 'http://www.w3.org/2000/svg';

/** Élément SVG avec ses attributs, ajouté à parent s'il est donné. */
export function S(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

/** Boîte légendée : première ligne en titre, les suivantes en petit. Renvoie le groupe. */
export function box(parent, x, y, w, h, lines, cls = '') {
  const g = S('g', {class: `bx ${cls}`}, parent);
  S('rect', {x, y, width: w, height: h}, g);
  const [title, ...rest] = lines;
  const n = rest.length;
  const y0 = y + h / 2 - (n * 15) / 2 + 5;
  S('text', {x: x + w / 2, y: y0, class: 't'}, g).textContent = title;
  rest.forEach((l, i) => {
    S('text', {x: x + w / 2, y: y0 + 17 + i * 15, class: 's'}, g).textContent = l;
  });
  return g;
}

/** Fil : un trait fixe et, par-dessus, un trait pointillé qui défile quand le fil est actif (classe .on). */
export function wire(parent, pts, cls = '') {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
  const g = S('g', {class: `wr ${cls}`}, parent);
  S('path', {d, class: 'base'}, g);
  S('path', {d, class: 'flow'}, g);
  return g;
}

export const fr = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',').replace('-', '−') : '-');
