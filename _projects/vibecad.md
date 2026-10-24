---
published: true
title: "VibeCAD"
code: P-28
description: "CAO 3D paramétrique dans le navigateur, pensée pour apprendre la conception mécanique, avec export vers FreeCAD."
status: en-cours
updated: 2026-10-24   # dernière activité : ordre de /projets/
tags: [logiciel, impression-3d, open-source]
stack: [TypeScript, Open CASCADE (WASM), three.js, Preact]
featured: true
featured_order: 1
repo: "https://github.com/Barbatronic/VibeCAD"
image: "/assets/img/projets/vibecad/simulation-bras.jpg"
image_caption: "Simulation d'un bras en acier : 4 kg au bout, la pièce tient"
links:
  - { label: "Ouvrir VibeCAD", url: "https://barbatronic.fr/VibeCAD/" }
  - { label: "Documentation", url: "https://github.com/Barbatronic/VibeCAD/tree/main/docs" }
---

**VibeCAD** est un logiciel de **CAO 3D paramétrique** qui tourne entièrement dans le navigateur. Il sert à apprendre les vraies bases de la conception mécanique : choisir un plan, dessiner une esquisse cotée, créer un volume, retirer de la matière, revenir modifier une étape antérieure. L'interface est en français, sérieuse mais rassurante.

**[Ouvrir VibeCAD](https://barbatronic.fr/VibeCAD/)** · [code source sur GitHub](https://github.com/Barbatronic/VibeCAD)

Aucun compte, aucun serveur de calcul : les modèles restent dans le navigateur. Après la première visite, l'application s'installe et fonctionne hors ligne.

## Pourquoi VibeCAD ?

Au départ, je voulais initier ma fille à la conception assistée par ordinateur. Les logiciels pour enfants, comme Tinkercad, restent très basiques et peu tournés vers l'ingénierie. À l'inverse, FreeCAD et les logiciels de CAO classiques sont bien trop complexes pour un enfant de moins de 10 ans. Je cherchais un outil entre les deux : proche de FreeCAD dans sa logique, mais simple à prendre en main.

Le projet a ensuite dépassé ce que j'imaginais au début, et c'est devenu le VibeCAD d'aujourd'hui. Le mode Débutant reste là, et c'est son usage premier : initier ma fille.

Le nom vient de la façon dont il a été fait : VibeCAD a été entièrement **vibe-codé** avec Claude. Il me semblait honnête de le dire dans le nom. Le « vibe » concerne la création de l'application, pas son usage : il n'y a **aucune fonctionnalité d'IA** à l'intérieur, les pièces se conçoivent à la main, comme dans n'importe quel logiciel de CAO.

Vous pouvez l'utiliser en connaissance de cause : VibeCAD n'a pas vocation à être autre chose que cette expérience.

## Apprendre la CAO

Trois niveaux (Débutant, Intermédiaire, Expert) dévoilent les outils progressivement. Des parcours guidés (« la plaque percée », « assembler et faire bouger », « préparer la fabrication ») se valident tout seuls en observant le modèle. Chaque outil a sa bulle d'explication, et les erreurs sont expliquées avec un moyen de les réparer.

![Parcours guidé de VibeCAD]({{ '/assets/img/projets/vibecad/parcours-guide.jpg' | relative_url }})
*Parcours guidé « la plaque percée » : chaque étape se valide toute seule.*

## Ce que l'on peut faire

- **Esquisses cotées et contraintes** : segments, arcs, cercles, polygones, oblongs, splines ; cotes, paramètres nommés et équations (`largeur = ep*12`).
- **Volumes** : extrusion, poche, révolution, lissage, balayage, perçages normalisés M2 à M12, répétitions, symétrie, coque, congés et chanfreins.
- **Historique modifiable** : double-clic sur une étape pour la reprendre, frise pour rejouer la construction pas à pas.
- **Générateurs** : roues dentées, crémaillères, poulies GT2 et T.
- **Assemblage** : liaisons pivot, glissière, pivot glissant, rotule, boucles fermées, engrenages, vue éclatée, détection des collisions.
- **Visserie normalisée** : vis CHC, BHC, FHC, H, écrous et rondelles de M2 à M12, posés d'un clic dans un trou. La taille est déduite du diamètre du trou, la longueur choisie parmi celles de la norme, et tout part dans la nomenclature.
- **Fabrication** : plateau d'impression 3D en 3MF, découpe laser avec imbrication (SVG, DXF), mise en plan cotée en PDF, nomenclature.
- **Simulation** : calcul par éléments finis indicatif (« la pièce tient », « risque de casser ») et allègement par optimisation topologique.
- **Tôlerie** : plis, bords pliés et développé à plat.

![Esquisse cotée dans VibeCAD]({{ '/assets/img/projets/vibecad/esquisse-cote.jpg' | relative_url }})
*Esquisse sur une face : saisie d'une cote, degrés de liberté restants affichés à droite.*

![Pièce Roue et son historique]({{ '/assets/img/projets/vibecad/roue-historique.jpg' | relative_url }})
*Pièce « Roue » isolée avec son historique : esquisse, extrusion, trou d'allègement répété cinq fois.*

![Quadrilatère articulé avec sa visserie]({{ '/assets/img/projets/vibecad/assemblage-visserie.jpg' | relative_url }})
*Assemblage : quadrilatère articulé en liaisons pivot, avec la visserie normalisée posée dans les trous.*

![Simulation d'un bras en acier]({{ '/assets/img/projets/vibecad/simulation-bras.jpg' | relative_url }})
*Simulation : bras en acier fixé d'un côté, 4 kg au bout. La pièce tient, marge × 9,9.*

![Carrosserie en tôle dépliée]({{ '/assets/img/projets/vibecad/tolerie-deplie.jpg' | relative_url }})
*Tôlerie : carrosserie en acrylique 3 mm, dépliée avec ses lignes de pli.*

![Plaque de découpe laser]({{ '/assets/img/projets/vibecad/laser-plaques.jpg' | relative_url }})
*Découpe laser : roues et châssis placés sur une plaque de contreplaqué 5 mm.*

## Passer à FreeCAD

Le travail ne reste pas enfermé dans VibeCAD. L'export **STEP** donne des solides exacts en millimètres, avec le nom et la couleur de chaque pièce. L'export **FreeCAD** produit un script qui reconstruit le projet avec son historique : esquisses cotées, étapes Part Design, paramètres. Exports STL, 3MF et GLB également.

## Sous le capot

Le noyau géométrique est **Open CASCADE** compilé en WebAssembly, le même que FreeCAD, exécuté dans un worker pour garder l'interface fluide. Vue 3D en three.js, interface en Preact, application PWA. Code sous licence MIT (Open CASCADE : LGPL 2.1).

Version 0.1, en développement actif.
