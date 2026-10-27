---
published: true
title: "Interface flottante, une seule barre d'outils et propriétés des pièces"
date: 2026-10-24
project: vibecad
description: "La vue 3D occupe tout l'écran, avec des panneaux translucides qui flottent par-dessus. Une seule barre d'outils, des sections repliables, et un nouvel outil Propriétés pour choisir la matière d'une pièce et lire sa masse."
image: "/assets/img/projets/vibecad/2026-10-24-interface-flottante-et-proprietes/interface-flottante.jpg"
session: ""
state: "en cours"
next_step: "Publier la nouvelle version sur barbatronic.fr/VibeCAD, puis refaire les captures de la documentation avec la nouvelle interface."
---

## Objectif

Rendre l'interface de [VibeCAD](https://barbatronic.fr/VibeCAD/) plus légère : laisser toute la place au modèle 3D et ranger ce qui encombre. Au passage, sortir le volume et la masse du panneau des pièces, où ils prenaient de la place sans qu'on puisse changer la matière.

## Une interface plus aérienne

![Support de moteur NEMA 17 dans VibeCAD : platine, moteur, poulie GT2 et visserie, avec les panneaux flottants et la barre d'outils unique]({{ '/assets/img/projets/vibecad/2026-10-24-interface-flottante-et-proprietes/interface-flottante.jpg' | relative_url }})
*La nouvelle interface sur un support de moteur NEMA 17 : les quatre vis CHC M5 × 16 sont sélectionnées dans la liste de visserie, leur réglage s'affiche à droite.*

- **La vue 3D occupe tout l'écran.** Sur grand écran, les panneaux de gauche et de droite flottent au-dessus du modèle. Ils ont des coins arrondis et un fond sombre, translucide et légèrement flouté : on devine la pièce derrière eux.
- **Panneaux repliables d'un clic.** Une petite languette sur le bord de chaque panneau le replie contre le côté de l'écran, ou le rouvre. Le panneau des réglages se rouvre tout seul quand on commence une opération, pour que le bouton « Valider » ne reste pas caché.
- **Une seule barre d'outils, calée en haut à gauche.** Le logo ouvre le menu Fichier, avec le nom du projet modifiable en tête. Viennent ensuite les ateliers en icônes (Pièces, Assemblage, Fabrication, Simulation), puis les outils. Le menu et les ateliers ne bougent plus quand on change d'atelier.
- **Le cadrage tient compte des panneaux.** La pièce se centre dans la zone libre, et le cube de navigation et les boutons de vue se placent à côté des panneaux.
- **Sections Pièces et Historique repliables**, comme Paramètres. Repliées, elles ne montrent que la pièce et l'étape choisies : pratique quand un projet compte beaucoup de pièces.

![La même vue avec les deux panneaux repliés : le modèle occupe tout l'écran]({{ '/assets/img/projets/vibecad/2026-10-24-interface-flottante-et-proprietes/panneaux-replies.jpg' | relative_url }})
*Panneaux repliés d'un clic sur leur languette : toute la place pour le modèle.*

![Panneau de gauche avec les sections Pièces et Historique repliées sur le moteur et sa dernière étape]({{ '/assets/img/projets/vibecad/2026-10-24-interface-flottante-et-proprietes/sections-repliees.jpg' | relative_url }})
*Sections repliées : seules la pièce choisie et sa dernière étape restent affichées.*

## Nouveau : les propriétés de la pièce

![Panneau Propriétés de la platine : choix de la matière en boutons, volume, masse et encombrement]({{ '/assets/img/projets/vibecad/2026-10-24-interface-flottante-et-proprietes/proprietes.jpg' | relative_url }})
*Les propriétés de la platine en aluminium : 51 521 mm³, environ 139 g, 100 × 70 × 8 mm.*

- **Un bouton « Propriétés »** dans le secteur Contrôler, à côté de Mesurer. Il donne la matière, le volume, la masse, l'encombrement (X × Y × Z) et le centre de gravité.
- **La matière se choisit** parmi PLA, PETG, ABS, TPU, contreplaqué, acrylique, aluminium et acier. Elle est enregistrée avec la pièce, et l'atelier Simulation la propose par défaut. Une pièce en tôle prend d'office la matière de sa tôle.
- **Un rappel dans la barre d'état**, par exemple « Platine · 51 521 mm³ · ≈ 139 g ». Un clic dessus ouvre les propriétés.

Les anciens projets s'ouvrent sans changement : sans matière choisie, une pièce reste en PLA.

## Niveaux

**VibeCAD s'ouvre au niveau Expert.** À la première ouverture, une fenêtre demande à chacun de choisir son niveau : Débutant, Intermédiaire ou Expert.

## Corrections

- La barre d'état garde une hauteur fixe : la vue 3D ne bouge plus quand un message d'aide s'allonge.
- Les listes déroulantes restent lisibles sur les panneaux translucides.
- Les noms des pièces masquées restent lisibles dans la liste des pièces.
- La touche Échap referme bien l'éditeur des plaques de découpe laser.
- Sur très petit écran, les outils passent sur une deuxième ligne au lieu de déborder.

## Documentation

- **Nouvelles captures d'écran en thème sombre** dans la documentation. On y voit :
  - l'historique d'une pièce ;
  - la tôlerie et son développé à plat ;
  - les plaques de découpe laser optimisées ;
  - le parcours guidé.
- **Deux nouvelles captures** : un assemblage articulé avec sa visserie, et une simulation de bras en acier.
