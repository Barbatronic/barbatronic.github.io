# barbatronic.fr

Site d'Adrien Bracq (Barbatronic) : projets, logs, documentation et blog.
Jekyll servi par GitHub Pages sur le domaine `barbatronic.fr` (fichier `CNAME`).

## Stack

| Élément | Choix | Remarque |
|---|---|---|
| Générateur | Jekyll 3.10 via la gem `github-pages` | Build natif GitHub Pages, pas de GitHub Actions |
| Plugins | `jekyll-seo-tag`, `jekyll-feed`, `jekyll-sitemap` | Liste blanche GitHub Pages uniquement |
| CSS | Bulma 0.9.4 (Sass, modules choisis) + styles maison | Bulma vendorisé dans `_sass/vendor/bulma` |
| JS | `assets/js/main.js`, vanilla, sans build | Menu mobile, filtres projets, langue, sommaire |
| Polices | Barlow Condensed, Barlow, JetBrains Mono | Google Fonts, chargées dans `_includes/head.html` |

Bulma est en 0.9.4 car le Sass de GitHub Pages (libsass) ne compile pas Bulma 1.x.

## Lancer en local

```sh
bundle install
bundle exec jekyll serve --livereload              # contenus publiés
bundle exec jekyll serve --livereload --unpublished  # + contenus en published: false
```

Site sur http://localhost:4000. Relancer après toute modification de `_config.yml`.

## Arborescence

```
_config.yml            configuration, collections, valeurs par défaut
_data/
  i18n.yml             libellés d'interface FR / EN, statuts de projet
  tags.yml             tags de projets et leurs libellés (ordre = ordre des filtres)
  social.yml           liens réseaux
  contact.yml          e-mail public (vide = pas de lien)
  stack.yml            grille Stack de la page À propos, reliée au champ `stack` des projets
  atelier.yml          machines de la grille Atelier (page À propos)
_layouts/              un layout par type de page (voir ci-dessous)
_includes/             composants ; i18n/ = logique de langue
_sass/barbatronic/     styles du site ; _tokens.scss = couleurs, polices, espacements
_projects/ _projects_en/   projets
_logs/ _logs_en/           logs, un dossier par projet
_docs/ _docs_en/           documentation, un dossier par projet
_posts/ _posts/en/         articles de blog
_sims/                 sources des simulateurs 3D (non publiées)
index.html, projets/, blog/, logs/, a-propos.md    pages FR
en/                                                 pages EN
assets/                css, js, images
```

## Modèle de contenu

Tout est relié par le **slug** du projet (nom du fichier dans `_projects/`, sans extension).

### Projet : `_projects/<slug>.md`

```yaml
title: Robot omnidirectionnel RC
code: P-01                 # identifiant affiché, incrémental
description: "Une phrase."
status: en-cours           # en-cours | termine | archive | abandonne ; les deux derniers sont masqués de /projets/ par défaut
updated: 2026-09-27        # dernière activité : ordre de /projets/ (le plus récent en premier)
tags: [robotique, esp32]   # clés de _data/tags.yml
stack: [C++, ESP32]        # optionnel
featured: true             # affiché "À la une" sur l'accueil (3 max)
featured_order: 1
repo: https://github.com/...   # optionnel : un seul dépôt
repos: [{ label: PAMI, url: "https://..." }]   # optionnel : plusieurs dépôts, remplace `repo`
results: [{ event: Coupe de France 2025, result: "15e" }]   # optionnel, bandeau de droite
poster: { image: /assets/img/projets/<slug>/poster.jpg, pdf: /assets/img/projets/<slug>/poster.pdf }   # optionnel, grand aperçu sous l'en-tête de la fiche
rules: https://...         # optionnel : lien vers le règlement
image: /assets/img/projets/<slug>/cover.jpg   # optionnel
image_caption: ""
links: [{ label: Site, url: "https://..." }]  # optionnel
external_url: /CDR-2027/   # optionnel : la carte pointe ailleurs que la fiche
redirect_from: [/projets/ancien-slug/]   # optionnel : ancienne URL après renommage ou fusion
```

URL : `/projets/<slug>/`. Le corps Markdown (optionnel) s'affiche sous la photo.
La fiche liste automatiquement docs, logs et articles du projet.

#### Saisons de compétition (Karibous)

Une fiche par saison et par compétition, pas une par robot :

- Coupe de France : slug `cdr-<année>`, titre `CDR <année> - <thème Eurobot>`.
- MakerFight : slug `mkf-<année>`, titre `MKF <année> - <nom du robot>`.
- Corps : une phrase d'intro, puis une section `## <robot>` par robot, PAMI ou firmware.
- Bandeau : `results` (une ligne par épreuve), `rules`, `repos` (un dépôt par robot ou firmware).
- Images : `/assets/img/projets/<slug>/`, avec un sous-dossier par robot si la saison en a plusieurs.
- Règlements et archives des coupes : dépôt séparé `Barbatronic/archives-coupes`, un dossier `<année>-<thème>` par édition. `rules` pointe vers ce dossier.

### Log : `_logs/<slug-projet>/AAAA-MM-JJ-<titre>.md`

```yaml
title: Premiers essais en radiocommande
date: 2026-09-27
project: robot-omni
session: "2 h"        # optionnel
state: "à corriger"   # optionnel
next_step: "..."      # optionnel, affiché dans la colonne de droite
```

URL : `/logs/<slug-projet>/<nom-du-fichier>/`. Le numéro (L01, L02...) est calculé par date
dans le projet, à partir de la version FR. Les cases `- [ ]` / `- [x]` sont rendues.

### Doc : `_docs/<slug-projet>/<nom>.md`

```yaml
title: Nomenclature
project: robot-omni
order: 1              # ordre dans le menu latéral (D1, D2...)
date: 2026-09-27      # dernière mise à jour
description: "..."    # optionnel, affiché dans la fiche projet
```

URL : `/projets/<slug-projet>/<nom>/`.

### Article : `_posts/AAAA-MM-JJ-<titre>.md`

```yaml
title: "..."
date: 2026-09-27
description: "..."
tags: [robotique]
project: robot-omni   # optionnel, relie l'article à la fiche projet
image: ""             # optionnel
comments: false       # optionnel, masque les commentaires
```

URL : `/blog/AAAA/MM/<titre>/`.

Flux Atom : `/feed.xml`, articles et logs mélangés (30 entrées), langue par défaut. Gabarit à la
racine (`feed.xml`) : il remplace la génération de `jekyll-feed`, dont `{% feed_meta %}` reste utilisé
dans le `<head>`. Lié aussi dans le pied de page et en tête des pages Blog et Logs.

Commentaires (articles et logs) : giscus, stockés dans les GitHub Discussions du dépôt (une discussion
par URL). `comments: false` dans le front matter les masque.
Réglages dans `_config.yml > giscus`. Rien ne s'affiche tant que `category_id` est vide.

### Brouillons

`published: false` dans le front matter : le contenu n'est pas publié mais reste visible
avec `--unpublished`. Les skills `nouveau-post`, `nouveau-log` et `nouveau-projet` créent leurs
fichiers dans cet état.

### Modèle 3D (log, doc, article)

Fichier `.glb` rangé dans `assets/img/projets/<slug>/3d/`, puis dans le Markdown :

```liquid
{% include model-3d.html src="/assets/img/projets/<slug>/3d/piece.glb" alt="Description"
   poster="/assets/img/projets/<slug>/piece.jpg" caption="Légende" %}
```

`poster` et `caption` sont optionnels. Le script model-viewer (`assets/js/vendor/`, Apache-2.0)
n'est chargé que sur les pages qui contiennent un modèle.
Pour un modèle lourd, ajouter `load_on_click=true` avec un `poster` : l'aperçu reste visible
et la 3D n'est téléchargée qu'après un clic sur « Explorer en 3D ».
Les modèles compressés avec Draco utilisent le décodeur local dans `assets/js/vendor/draco/`.

### Schéma et PCB interactifs (log, doc, article)

Conserver les fichiers KiCad dans `assets/files/projets/<slug>/<date-session>/` pour garder
une version distincte à chaque étape, puis intégrer un schéma ou un PCB :

```liquid
{% include kicanvas.html src="/assets/files/projets/<slug>/<date-session>/carte.kicad_sch" caption="Schéma de la carte." %}
{% include kicanvas.html src="/assets/files/projets/<slug>/<date-session>/carte.kicad_pcb" caption="Implantation et routage." %}
```

KiCanvas est conservé dans `assets/js/vendor/` avec sa licence MIT et chargé uniquement
sur les pages concernées. Les fichiers restent téléchargeables sans JavaScript.
Source : [documentation d'intégration KiCanvas](https://kicanvas.org/embedding/).

### Page HTML autonome : simulation, simulateur 3D (log, doc, article)

Page rangée à côté des images du contenu, puis intégrée dans un cadre isolé :

```liquid
{% include embed-html.html src="/assets/img/projets/<slug>/<dossier>/simulation.html"
   title="Titre du cadre" caption="Légende" height="720px" %}
```

Les simulateurs 3D construits avec le skill teardown gardent leurs sources dans
`_sims/<nom>/` (ignoré par Jekyll : dossier en `_`). Le build produit un seul HTML, three.js
et polices compris, à copier dans `assets/img/projets/<slug>/<nom>/` :

```sh
node .claude/skills/teardown/sims/build.mjs _sims/<nom>     # -> teardown-out/dist/<nom>.html
```

Un simulateur qui affiche les pièces d'une CAO charge un modèle `.glb` placé à côté de sa page (même
dossier d'assets) : copier aussi ce fichier, la commande exacte est en tête du `main.js` du simulateur.
Une telle page se teste servie en http (site local), pas ouverte en `file://`.

`teardown-out/` est un dossier de travail : ne pas le committer.

## Langues

- FR par défaut, EN sous `/en/`. Une collection par langue : `_projects` / `_projects_en`, etc.
  Les articles EN vont dans `_posts/en/`.
- Une traduction porte **le même nom de fichier** (et le même `project` pour logs et docs)
  dans la collection EN. Pages simples : même valeur de `ref` dans le front matter.
- Sans traduction, les listes EN affichent la version FR avec la marque `FR`.
  Sur une page non traduite, un bandeau s'affiche si le visiteur a choisi l'autre langue
  (choix mémorisé dans `localStorage`).
- Logique dans `_includes/i18n/` : `init.html` (variables), `items.html` (listes avec repli),
  `translation.html` (page équivalente), `localize.html` (version localisée d'un contenu).
- Le site gère deux langues. En ajouter une demande de revoir `init.html` et `translation.html`.

## Layouts

| Layout | Utilisé par |
|---|---|
| `default` | base HTML, en-tête, pied de page |
| `home` | `index.html`, `en/index.html` |
| `projects` | liste filtrable `/projets/` |
| `project`, `log`, `doc`, `post` | contenus des collections (via `defaults`) |
| `list` | `/blog/`, `/logs/` (paramètre `list_type`) |
| `about` | `a-propos.md`, `en/about.md` |
| `page` | pages simples, 404 |

## Styles

Couleurs, polices et marges dans `_sass/barbatronic/_tokens.scss` (variables CSS).
Modules Bulma importés : voir `assets/css/main.scss`. Pour en ajouter un, ajouter la ligne
`@import "vendor/bulma/..."` correspondante.

Coloration du code : `_sass/barbatronic/_code.scss` habille le balisage produit par Rouge
(kramdown GFM). Les couleurs sont les variables `--code-*` de `_tokens.scss`.

Logo : déposer `assets/img/logo.png` (carré). Sans fichier, un carré hachuré le remplace.

## Déploiement

Push sur `main` : GitHub Pages construit et publie. Pas de fichier `.nojekyll` à la racine
(il désactiverait Jekyll). `/CDR-2027/` est servi par le dépôt `Barbatronic/CDR-2027` :
ne pas créer de page à ce chemin.

Tout ce qui n'est pas exclu dans `_config.yml` est publié : garder la racine propre et ajouter
à `exclude` (et à `.gitignore`) tout dossier de travail local.

GitHub Pages applique `theme: jekyll-theme-primer` par défaut quand aucun thème n'est déclaré.
Les layouts et includes du dépôt le masquent entièrement. Seule trace : la feuille du thème,
publiée en `/assets/css/style.css`, qu'aucune page ne charge. Sans effet sur le rendu.
Le CSS du site est `/assets/css/main.css`.

L'outillage d'édition (`.claude/`) est volontairement hors de ce dépôt public.
