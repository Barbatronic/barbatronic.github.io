---
published: true
title: Robot omnidirectionnel RC
code: P-01
description: "Robot 4 roues omnidirectionnel, piloté en radiocommande."
status: en-cours
updated: 2026-10-29   # tri de /projets/ : dernier commit
tags: [robotique, electronique]
stack: [ESP32-S3, PlatformIO, SBUS, FreeCAD, KiCad]
featured: true
featured_order: 2
repo: https://github.com/Barbatronic/Omni-RC-Robot
image: "/assets/img/projets/robot-omni/robot-complet.jpg"
image_caption: "Le robot câblé : quatre modules moteur, drivers sur dissipateurs, coupe-batterie"
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

## Montage

Le châssis est fait de profilés aluminium, avec des pièces imprimées en 3D pour les moteurs, les angles et la pièce centrale.

<div class="gallery">
  <figure><img src="{{ '/assets/img/projets/robot-omni/profiles-alu.jpg' | relative_url }}" alt="Profilés aluminium noirs coupés à longueur" loading="lazy"><figcaption>Les profilés aluminium</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/modules-moteur.jpg' | relative_url }}" alt="Quatre moteurs avec roue omni et support imprimé rouge" loading="lazy"><figcaption>Les quatre modules moteur</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/inserts-filetes.jpg' | relative_url }}" alt="Support moteur rouge avec inserts filetés en laiton" loading="lazy"><figcaption>Supports moteur avec inserts filetés</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/module-moteur-roue.jpg' | relative_url }}" alt="Module moteur et roue omni fixé sur un profilé" loading="lazy"><figcaption>Un module moteur fixé sur son profilé</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/module-sur-profile.jpg' | relative_url }}" alt="Module moteur dans un angle du châssis, coupe-batterie à côté" loading="lazy"><figcaption>Le module dans un angle du châssis</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/piece-centrale.jpg' | relative_url }}" alt="Pièce centrale rouge avec logement noir" loading="lazy"><figcaption>La pièce centrale</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/chassis-assemble.jpg' | relative_url }}" alt="Châssis assemblé avec les quatre modules moteur" loading="lazy"><figcaption>Le châssis assemblé</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/robot-omni/chassis-dessus.jpg' | relative_url }}" alt="Châssis assemblé vu de dessus" loading="lazy"><figcaption>Vu de dessus, avant câblage</figcaption></figure>
</div>

## Premiers essais

Le 18/09/2026 : l'interface web servie par l'ESP32-S3, puis le pilotage à la radiocommande.

<video controls preload="metadata" playsinline width="100%" poster="{{ '/assets/img/projets/robot-omni/interface-web-et-pilotage.jpg' | relative_url }}">
  <source src="{{ '/assets/img/projets/robot-omni/interface-web-et-pilotage.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*L'interface web (radio, commandes, vue du robot) et la prise en main à la radiocommande.*

<video controls preload="metadata" playsinline width="100%" poster="{{ '/assets/img/projets/robot-omni/essai-roulage.jpg' | relative_url }}">
  <source src="{{ '/assets/img/projets/robot-omni/essai-roulage.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Essai de roulage au sol.*
