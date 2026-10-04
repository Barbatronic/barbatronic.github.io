// Frise du parcours (page À propos) : axe horizontal, un point par date de début, un trait vertical
// vers le libellé. Les traits s'étagent en hauteur pour que les libellés ne se chevauchent pas.
// Entrée : <figure data-timeline> + <script data-timeline-data> (include parcours.html).
// Survol / focus : détail dans la zone .tl-info sous la frise (rien ne masque la frise),
// durée surlignée sur l'axe.
// Animation : traits qui montent un par un, dans l'ordre chronologique, à l'apparition de la frise.
// Sans JS, la figure reste masquée : les tableaux repliés restent la référence.
(function () {
  var fig = document.querySelector("[data-timeline]");
  var src = document.querySelector("[data-timeline-data]");
  if (!fig || !src) return;

  var data = JSON.parse(src.textContent);
  var lang = fig.dataset.lang;
  var since = fig.dataset.since;
  var names = JSON.parse(fig.dataset.sections);
  var root = fig.querySelector(".tl");

  var now = new Date();
  var nowY = now.getFullYear() + now.getMonth() / 12;
  // "AAAA" ou "AAAA-MM" -> année décimale. Une fin "AAAA" couvre toute l'année.
  function toYear(s, isEnd) {
    if (!s) return nowY;
    var p = String(s).split("-");
    var y = +p[0];
    if (p.length < 2) return isEnd ? y + 1 : y;
    return y + (+p[1] - (isEnd ? 0 : 1)) / 12;
  }
  function period(s, e) {
    var a = String(s).slice(0, 4);
    if (!e) return since + " " + a;
    var b = String(e).slice(0, 4);
    return a === b ? a : a + " - " + b;
  }
  function loc(o) { return o[lang] || o.fr; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  // Un événement par poste (les sous-rôles comptent chacun pour un).
  var events = [];
  ["pro", "asso", "formation"].forEach(function (type) {
    (data[type] || []).forEach(function (e) {
      var parent = loc(e);
      var rows = e.roles ? e.roles.map(function (r) { return { item: r, parent: parent }; }) : [{ item: e, parent: null }];
      rows.forEach(function (row) {
        var x = loc(row.item);
        events.push({
          type: type,
          x0: toYear(row.item.start),
          x1: toYear(row.item.end, true),
          ongoing: !row.item.end,
          label: x.short || x.title,
          title: x.title,
          period: period(row.item.start, row.item.end),
          org: row.parent ? row.parent.title + (row.parent.org ? ", " + row.parent.org : "") : x.org,
          detail: x.detail
        });
      });
    });
  });
  events.sort(function (a, b) { return a.x0 - b.x0; });

  var min = Math.floor(events[0].x0);
  var max = Math.ceil(nowY);

  // Construction du DOM.
  var axis = el("div", "tl-axis");
  var band = el("span", "tl-band");
  axis.appendChild(band);
  root.appendChild(axis);
  var ticks = [];
  for (var y = min; y <= max; y++) {
    var tk = el("span", "tl-tick" + (y % 2 === 0 ? " is-major" : ""));
    if (y % 2 === 0) tk.appendChild(el("span", "tl-year", String(y)));
    axis.appendChild(tk);
    ticks.push({ y: y, n: tk });
  }
  var info = fig.querySelector(".tl-info");
  var hint = info.innerHTML;

  events.forEach(function (ev, i) {
    var b = el("button", "tl-ev is-" + ev.type);
    b.type = "button";
    b.style.setProperty("--i", i);
    b.setAttribute("aria-label", [ev.title, ev.period, ev.org, ev.detail, names[ev.type]].filter(Boolean).join(", "));
    b.setAttribute("aria-controls", "tl-info");
    b.appendChild(el("span", "tl-stem"));
    b.appendChild(el("span", "tl-dot"));
    var lab = el("span", "tl-label");
    lab.appendChild(el("b", null, ev.label));
    lab.appendChild(el("span", null, ev.period));
    b.appendChild(lab);
    b.addEventListener("mouseenter", function () { show(ev); });
    b.addEventListener("focus", function () { show(ev); });
    b.addEventListener("mouseleave", hide);
    b.addEventListener("blur", hide);
    root.appendChild(b);
    ev.node = b;
    ev.lab = lab;
  });

  var PAD = 24, BASE = 34, ROW = 46, AXIS = 44;
  var W = 0;
  function px(x) { return PAD + (x - min) / (max - min) * (W - 2 * PAD); }

  // Placement : niveau le plus bas où le libellé ne chevauche aucun autre.
  function layout() {
    W = root.clientWidth;
    var levels = [];
    var top = 0;
    events.forEach(function (ev) {
      var x = px(ev.x0);
      var w = ev.lab.offsetWidth;
      var flip = x + w > W - 4; // trop près du bord droit : libellé à gauche du trait
      var a = flip ? x - w : x, b = flip ? x : x + w;
      var l = 0;
      while (levels[l] && levels[l].some(function (r) { return a < r[1] + 14 && b > r[0] - 14; })) l++;
      (levels[l] = levels[l] || []).push([a, b]);
      var h = BASE + l * ROW;
      ev.node.style.left = x + "px";
      ev.node.style.setProperty("--h", h + "px");
      ev.node.classList.toggle("is-flip", flip);
      top = Math.max(top, h + ev.lab.offsetHeight);
    });
    root.style.height = (top + AXIS + 16) + "px";
    ticks.forEach(function (t) { t.n.style.left = px(t.y) + "px"; });
  }

  function show(ev) {
    info.textContent = "";
    info.appendChild(el("span", "tl-info-meta", names[ev.type].toUpperCase() + " · " + ev.period));
    info.appendChild(el("b", null, ev.title));
    var more = [ev.org, ev.detail].filter(Boolean).join(" · ");
    if (more) info.appendChild(el("span", null, more));
    info.classList.add("is-on");
    var a = px(ev.x0), b = px(ev.x1);
    band.style.left = a + "px";
    band.style.width = Math.max(b - a, 3) + "px";
    band.classList.toggle("is-ongoing", ev.ongoing);
    band.classList.add("is-on");
    ev.node.classList.add("is-hot");
  }
  function hide() {
    info.innerHTML = hint;
    info.classList.remove("is-on");
    band.classList.remove("is-on");
    events.forEach(function (ev) { ev.node.classList.remove("is-hot"); });
  }

  fig.hidden = false;
  layout();
  window.addEventListener("resize", layout);

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { root.classList.add("is-in"); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { io.disconnect(); root.classList.add("is-in"); }
  }, { threshold: 0.3 });
  io.observe(fig);
})();
