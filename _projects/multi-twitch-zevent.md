---
# Fiche remplie à partir des dépôts GitHub. Relire, puis passer published à true.
published: false
title: "Multi-flux ZEVENT"
code: P-15
description: "Une page pour regarder plusieurs chaînes Twitch du ZEVENT en même temps."
status: open-source
updated: 2026-09-05   # tri de /projets/ : dernier commit
tags: [logiciel, open-source]
stack: [HTML, JavaScript]
featured: false
featured_order: 99
repo: "https://github.com/Barbatronic/multi-twitch-zevent"
image: ""
image_caption: ""
links:
  - { label: "Page en ligne", url: "https://barbatronic.github.io/multi-twitch-zevent/" }
---

Page HTML unique pour suivre plusieurs streamers Twitch du ZEVENT sur une seule interface : grille de flux, mise en avant d'un flux avec son chat, son sur un seul flux à la fois, sélection mémorisée.

Version 2026 :

- données live depuis l'API publique de `zevent.fr` : cagnotte, spectateurs, streams en direct ;
- autocomplétion des participants, chaînes en direct en tête ;
- bouton « Top 4 live » ;
- lien de partage qui rejoue la grille.

Aucune dépendance ni build : un seul fichier `index.html`.
