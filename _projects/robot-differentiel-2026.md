---
# Fiche remplie à partir des dépôts GitHub. Relire, puis passer published à true.
published: false
title: "Robot différentiel 2026"
code: P-07
description: "Robot différentiel des Karibous pour la Coupe de France de Robotique 2026, sur ESP32-S3."
status: competition
updated: 2026-06-22   # tri de /projets/ : dernier commit du firmware
tags: [robotique, electronique, esp32, karibous]
stack: [ESP32-S3, PlatformIO, FreeCAD, KiCad]
featured: false
featured_order: 99
repo: "https://github.com/LesKaribous/Karibous-2026-Differential-Robot"
image: ""
image_caption: ""
links:
  - { label: "Firmware", url: "https://github.com/nadarbreicq/Differential-Robot-Firmware" }
---

Robot à propulsion différentielle des Karibous pour la Coupe de France de Robotique 2026.
Sa base sert de point de départ au robot 2027 (voir le projet CDR 2027).

- **Mécanique et électronique** : dépôt `Karibous-2026-Differential-Robot` (structure FreeCAD, pièces imprimées et découpées au laser, carte principale KiCad).
- **Firmware** : dépôt `Differential-Robot-Firmware`. ESP32-S3, moteurs pas-à-pas, LIDAR LD06, roues codeuses, écran OLED, actionneurs I2C.

Le guide d'utilisation du firmware est dans la documentation du projet.
