---
published: true
title: Robot omnidirectionnel RC
code: P-01
description: "Robot 4 roues omnidirectionnel, piloté en radiocommande."
status: en-cours
updated: 2026-09-18   # tri de /projets/ : dernier commit
tags: [robotique, electronique]
stack: [ESP32-S3, PlatformIO, SBUS, FreeCAD, KiCad]
featured: true
featured_order: 1
repo: https://github.com/Barbatronic/Omni-RC-Robot
image: ""
image_caption: ""
links: []
---

Robot radiocommandé à quatre roues omnidirectionnelles.

Architecture prévue par la spécification du firmware :

- carte Freenove ESP32-S3 WROOM ;
- récepteur de radiocommande en SBUS ;
- 4 moteurs DC, chacun piloté par un driver BTS7960 (IBT-2) ;
- 4 roues omnidirectionnelles, géométrie d'environ 60° paramétrable dans le logiciel ;
- interface web hébergée sur l'ESP32-S3.

Mouvements visés : translations dans toutes les directions, rotation sur place, et translation combinée à la rotation.

Le dépôt contient la mécanique FreeCAD (roue omni, moyeu moteur, bras de propulsion, support BTS7960, batterie, arrêt d'urgence), la carte `omni-board` sous KiCad et le firmware.
