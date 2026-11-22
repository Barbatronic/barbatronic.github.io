// Scripts du site. Vanilla JS, sans dépendance. Chaque bloc est indépendant :
// il ne fait rien si les éléments qu'il cible sont absents de la page.
(function () {
  "use strict";

  // Modèles 3D chargés à la demande : garder l'aperçu pendant le chargement.
  document.querySelectorAll("[data-load-model]").forEach(function (button) {
    var viewer = button.closest("model-viewer");
    viewer.addEventListener("error", function () {
      viewer.dataset.modelFailed = "true";
      button.disabled = false;
      button.textContent = "Réessayer la 3D";
      button.removeAttribute("aria-busy");
    });
    button.addEventListener("click", async function () {
      button.disabled = true;
      button.textContent = "Chargement de la 3D…";
      button.setAttribute("aria-busy", "true");
      await customElements.whenDefined("model-viewer");
      // Un nouvel essai doit relancer la requête après une erreur réseau.
      if (viewer.dataset.modelFailed) {
        var source = new URL(viewer.getAttribute("src"), document.baseURI);
        source.searchParams.set("retry", Date.now());
        viewer.setAttribute("src", source.href);
      }
      viewer.dismissPoster();
    });
    viewer.addEventListener("load", function () { delete viewer.dataset.modelFailed; });
  });

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
    var hidden = (grid.dataset.hiddenStatuses || "").split(" "); // statuts masqués de "Tous"
    var hiddenLinks = Array.prototype.slice.call(document.querySelectorAll("[data-show-hidden]"));

    var apply = function () {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!state.tag || (" " + c.dataset.tags + " ").indexOf(" " + state.tag + " ") !== -1)
          && (state.status ? c.dataset.status === state.status : hidden.indexOf(c.dataset.status) === -1)
          && (!state.q || c.dataset.search.indexOf(state.q) !== -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      hiddenLinks.forEach(function (l) { l.hidden = state.status === l.dataset.showHidden; });
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

    // Filtre initial par URL : /projets/?tag=esp32, ?q=freecad (liens de la grille Stack), ?status=archive
    var params = new URLSearchParams(location.search);
    var q = params.get("q");
    if (q && search) {
      search.value = q;
      state.q = q.trim().toLowerCase();
    }
    apply(); // masque les projets archivés et abandonnés par défaut
    ["tag", "status"].forEach(function (key) {
      var initial = params.get(key);
      if (!initial) return;
      var b = filters.querySelector('[data-filter-group="' + key + '"] [data-value="' + CSS.escape(initial) + '"]');
      if (b) b.click();
    });
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
    // Texte de la barre : valeur de data-scroll-title si renseignée, sinon le texte du titre.
    if (bar && title) bar.querySelector(".scroll-title-text").textContent = (title.dataset.scrollTitle || title.textContent).replace(/\s+/g, " ").trim();
    // Flèche de retour en haut (défilement doux sauf préférence "réduire les animations").
    var topLink = bar && bar.querySelector("[data-scroll-top]");
    if (topLink) topLink.addEventListener("click", function (e) {
      e.preventDefault();
      var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    });
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

  // 6. Agrandir les images des articles ------------------------------------
  // Un clic sur une image du contenu l'ouvre en entier (les vignettes de .gallery
  // sont recadrées), avec sa légende. Flèches : image précédente / suivante.
  // Fermeture : Échap, bouton, ou clic hors de l'image.
  var zoomable = Array.prototype.slice.call(document.querySelectorAll(".prose img"))
    .filter(function (img) { return !img.closest("a"); });
  if (zoomable.length && window.HTMLDialogElement) {
    var box = document.createElement("dialog");
    box.className = "lightbox";
    box.setAttribute("aria-label", "Image agrandie");
    box.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>'
      + '<button type="button" class="lightbox-close" aria-label="Fermer">×</button>'
      + '<button type="button" class="lightbox-prev" aria-label="Image précédente">‹</button>'
      + '<button type="button" class="lightbox-next" aria-label="Image suivante">›</button>';
    document.body.appendChild(box);
    var boxImg = box.querySelector("img");
    var boxCaption = box.querySelector("figcaption");
    var current = 0;

    // Légende : figcaption d'une galerie, sinon l'italique qui suit l'image, sinon le texte alternatif.
    var captionOf = function (img) {
      var fig = img.closest("figure");
      if (fig && fig.querySelector("figcaption")) return fig.querySelector("figcaption").textContent;
      var em = img.parentElement && img.parentElement.querySelector("em");
      return em ? em.textContent : img.alt;
    };
    var show = function (i) {
      current = (i + zoomable.length) % zoomable.length;
      var img = zoomable[current];
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      boxCaption.textContent = captionOf(img);
    };
    var several = zoomable.length > 1;
    box.querySelector(".lightbox-prev").hidden = !several;
    box.querySelector(".lightbox-next").hidden = !several;

    zoomable.forEach(function (img, i) {
      img.classList.add("is-zoomable");
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      var open = function () { show(i); box.showModal(); };
      img.addEventListener("click", open);
      img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.tagName === "FIGURE") box.close(); });
    box.addEventListener("keydown", function (e) {
      if (!several) return;
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    box.addEventListener("close", function () { zoomable[current].focus({ preventScroll: true }); });
  }
})();
