// Scripts du site. Vanilla JS, sans dépendance. Chaque bloc est indépendant :
// il ne fait rien si les éléments qu'il cible sont absents de la page.
(function () {
  "use strict";

  // 1. Menu mobile (burger Bulma) ------------------------------------------
  document.querySelectorAll(".navbar-burger").forEach(function (burger) {
    var menu = document.getElementById(burger.dataset.target);
    if (!menu) return;
    burger.addEventListener("click", function () {
      var open = burger.classList.toggle("is-active");
      menu.classList.toggle("is-active", open);
      burger.setAttribute("aria-expanded", String(open));
    });
  });

  // 2. Langue préférée + bandeau "pas encore traduit" ------------------------
  // La langue choisie via le sélecteur FR/EN est mémorisée. Sur une page sans
  // traduction, si la langue mémorisée est l'autre langue, on affiche le bandeau.
  function readLang() { try { return localStorage.getItem("lang"); } catch (e) { return null; } }
  function saveLang(l) { try { localStorage.setItem("lang", l); } catch (e) { /* stockage indisponible */ } }

  document.querySelectorAll("[data-set-lang]").forEach(function (a) {
    a.addEventListener("click", function () { saveLang(a.dataset.setLang); });
  });

  var banner = document.querySelector(".untranslated-banner");
  if (banner && document.body.dataset.hasTranslation === "false" && readLang() === banner.dataset.forLang) {
    banner.hidden = false;
  }

  // 3. Filtres de la page Projets ------------------------------------------
  var filters = document.querySelector("[data-filters]");
  var grid = document.querySelector("[data-project-grid]");
  if (filters && grid) {
    filters.hidden = false; // masqués sans JS
    var state = { tag: "", status: "", q: "" };
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".project-card"));
    var empty = document.querySelector("[data-no-result]");

    var apply = function () {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!state.tag || (" " + c.dataset.tags + " ").indexOf(" " + state.tag + " ") !== -1)
          && (!state.status || c.dataset.status === state.status)
          && (!state.q || c.dataset.search.indexOf(state.q) !== -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    };

    filters.querySelectorAll("[data-filter-group]").forEach(function (group) {
      var key = group.dataset.filterGroup;
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        group.querySelectorAll("button").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        state[key] = btn.dataset.value;
        apply();
      });
    });

    var search = filters.querySelector("[data-filter-search]");
    if (search) search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); apply(); });

    // Filtre initial par URL : /projets/?tag=esp32
    var initial = new URLSearchParams(location.search).get("tag");
    if (initial) {
      var b = filters.querySelector('[data-filter-group="tag"] [data-value="' + CSS.escape(initial) + '"]');
      if (b) b.click();
    }
  }

  // 4. Sommaire des articles (titres h2) ------------------------------------
  var toc = document.querySelector("[data-toc]");
  var source = document.querySelector("[data-toc-source]");
  if (toc && source) {
    var heads = source.querySelectorAll("h2[id]");
    if (heads.length > 1) {
      heads.forEach(function (h, i) {
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.innerHTML = '<span class="mono">' + String(i + 1).padStart(2, "0") + "</span> ";
        a.appendChild(document.createTextNode(h.textContent));
        toc.appendChild(a);
      });
      toc.hidden = false;
    }
  }

  // 5. En-tête collant + titre réduit ---------------------------------------
  // --sticky-top = hauteur visible de l'en-tête (+ barre de titre si affichée),
  // utilisée par les colonnes collantes (.side, .toc) et le scroll-padding.
  var header = document.querySelector(".site-header");
  if (header) {
    var bar = header.querySelector("[data-scroll-bar]");
    var title = document.querySelector("[data-scroll-title]");
    if (bar && title) bar.querySelector(".scroll-title-text").textContent = title.textContent.replace(/\s+/g, " ").trim();
    var ticking = false;
    var update = function () {
      ticking = false;
      var h = header.offsetHeight;
      var show = !!(bar && title) && title.getBoundingClientRect().bottom < h;
      if (bar) bar.classList.toggle("is-visible", show);
      document.documentElement.style.setProperty("--sticky-top", (h + (show ? bar.offsetHeight : 0)) + "px");
    };
    var request = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }
})();
