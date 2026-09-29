---
# Fiche remplie à partir des dépôts GitHub. Relire, puis passer published à true.
published: false
title: "KiCad Toolkit"
code: P-09
description: "Mes librairies, blocs de conception et réglages KiCad, installables depuis le gestionnaire de contenu de KiCad."
status: open-source
updated: 2026-09-13   # tri de /projets/ : dernier commit
tags: [electronique, open-source]
stack: [KiCad, Python]
featured: false
featured_order: 99
repo: "https://github.com/Barbatronic/kicad-toolkit"
image: ""
image_caption: ""
links:
  - { label: "Documentation", url: "https://barbatronic.github.io/kicad-toolkit/" }
---

Librairies, blocs de conception et réglages KiCad rassemblés au même endroit, installables depuis le **Plugin and Content Manager** de KiCad. Compatible KiCad 10.0 et plus récent.

| Paquet | Contenu |
|---|---|
| **Barbatronic Toolkit** | Symboles, empreintes et modèles 3D par thème, blocs de conception, cartouche, règles de conception, modèle de projet |
| **Librairies tierces** | SparkFun, Teensy, Digi-Key, Seeed XIAO, TMC SilentStepStick, DFRobot, sous leur licence d'origine |
| **Thème sombre** | Thème de couleurs pour le schéma et le routage |

Publication automatisée : un tag Git déclenche la construction des archives, leur validation contre le schéma officiel de KiCad, la release GitHub et la mise à jour du catalogue.
Licence MIT pour mes éléments.
