---
# Fiche remplie à partir des dépôts GitHub. Relire, puis passer published à true.
published: false
title: "CollectIO"
code: P-17
description: "Catalogue personnel de films, BD et mangas : scan de codes-barres, métadonnées automatiques, export."
status: en-cours
updated: 2026-07-28   # tri de /projets/ : dernier commit
tags: [logiciel]
stack: [Node.js, Express, SQLite, Docker]
featured: false
featured_order: 99
repo: "https://github.com/nadarbreicq/collect-io"
image: ""
image_caption: ""
links: []
---

Catalogue personnel de collection physique : films, séries, documentaires, spectacles, concerts, BD, mangas et artbooks.

- Saisie au lecteur de codes-barres, en masse puis traitement par lot.
- Métadonnées récupérées automatiquement (titre, année, jaquette, auteurs), dont le catalogue de la BnF.
- Recherche, filtres, suivi des doublons, des prêts et des tomes manquants.
- Export CSV et sauvegardes automatiques.

Principe : un objet physique = une ligne dans la base. Auto-hébergé, fonctionnel en réseau local.
