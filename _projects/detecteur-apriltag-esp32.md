---
# Fiche remplie à partir des dépôts GitHub. Relire, puis passer published à true.
published: false
title: "Détecteur AprilTag ESP32-S3"
code: P-08
description: "Détection de marqueurs AprilTag embarquée sur ESP32-S3, pour Eurobot."
status: en-cours
updated: 2026-05-18   # tri de /projets/ : dernier commit
tags: [robotique, esp32, karibous]
stack: [ESP32-S3, PlatformIO, AprilTag]
featured: false
featured_order: 99
repo: "https://github.com/nadarbreicq/esp32-eurobot-tag-detector"
image: ""
image_caption: ""
links: []
---

Détecteur de marqueurs AprilTag embarqué sur une carte Freenove FNK0085 (ESP32-S3-WROOM N16R8, caméra OV2640).

- Détection avec la bibliothèque AprilTag de l'université du Michigan.
- Interface web embarquée, Wi-Fi en point d'accès par défaut, identifiants modifiables et stockés en NVS.
- Résultats lus par le robot via une interface I2C esclave (adresse `0x42` par défaut).
