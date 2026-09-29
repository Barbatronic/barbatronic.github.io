---
published: true
title: "Robot RC"
code: P-05
description: "Robot radiocommandé : structure en profilé 2020, carters imprimés en 3D et carte d'interprétation iBus."
status: en-cours
updated: 2026-09-18   # tri de /projets/ : dernier commit
tags: [robotique, electronique, impression-3d]
stack: [FreeCAD, KiCad, iBus]
featured: false
featured_order: 99
repo: "https://github.com/Barbatronic/RC-Robot"
image: "/assets/img/projets/rc-robot/cover.jpg"
image_caption: "Carte iBus-interpreter, rendu KiCad"
links: []
---

Robot radiocommandé conçu sous FreeCAD et KiCad.

Le dépôt contient :

- **MCAD** : assemblage du robot et de sa structure, POC de motorisation, carters et bumpers imprimés en 3D, supports batterie et interrupteur, vérin linéaire 100 mm, clip de panneau LED.
- **ECAD** : carte `iBus-interpreter`, qui lit la sortie iBus du récepteur de radiocommande.
- **FIRMWARE** : programme de test iBus.
