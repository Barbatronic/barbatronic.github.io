---
published: true
title: "Mary and Dary"
code: P-23
description: "Deux robots holonomes quasi identiques pour la Coupe de France de Robotique 2023."
status: termine
updated: 2023-05-20   # tri de /projets/ : fin de la Coupe de France 2023
tags: [robotique, electronique, karibous]
stack: [MakerBeam, NEMA 23, MKS Servo 57B, découpe laser, impression 3D]
featured: false
featured_order: 99
repo: "https://github.com/LesKaribous/Karibous-2023-Hardware"
image: "/assets/img/projets/karibous-2023-mary-and-dary/cover.jpg"
image_caption: "Mary and Dary, 2023"
links:
  - { label: "Vidéo", url: "https://www.youtube.com/watch?v=-e_zRItAMJg" }
  - { label: "Les Karibous", url: "https://leskaribous.fr/robots/" }
---

Deux robots holonomes quasiment identiques. Le code est partagé entre les deux robots, ainsi que toute l'architecture logicielle et matérielle.

Les deux bases holonomes de 2022 ont été reprises et améliorées. Structure et motorisation restent proches de 2022. L'électronique et la détection ont été entièrement repensées, avec une carte principale plus compacte et une meilleure intégration du lidar. De nouveaux actionneurs permettent de saisir et manipuler les éléments de jeu 2023 (gâteaux et cerises).

La conception de la base est détaillée dans la documentation du projet.

| Compétition | Résultat |
|---|---|
| Coupe de Belgique 2023 | 3e des équipes étrangères, 6e toutes équipes confondues, prix de la communication |
| Coupe de France de Robotique 2023 | 22e sur 90 équipes |

## Sous-ensembles

![Modèle 3D du robot]({{ '/assets/img/projets/karibous-2023-mary-and-dary/modele-3d.jpg' | relative_url }})

| | |
|---|---|
| ![Balise]({{ '/assets/img/projets/karibous-2023-mary-and-dary/beacon.jpg' | relative_url }}) | ![Caisse batterie]({{ '/assets/img/projets/karibous-2023-mary-and-dary/battery-box.jpg' | relative_url }}) |
| Balise | Caisse batterie |
| ![Actionneur à gâteaux]({{ '/assets/img/projets/karibous-2023-mary-and-dary/cake-actuator.jpg' | relative_url }}) | ![Actionneur à balles]({{ '/assets/img/projets/karibous-2023-mary-and-dary/vacuum-ball.jpg' | relative_url }}) |
| Actionneur à gâteaux | Actionneur à balles, par aspiration |

## Ce que les matchs ont appris

- Un robot qui dépasse de quelques millimètres dans une zone de dépose annule les points de ses gâteaux. Le retour en zone de fin de match était aussi annulé tant que l'adversaire restait détecté en face : un cas non testé.
- Les éléments de jeu et les tables de la scène différaient légèrement de ceux utilisés en test. Les prises trop justes ont échoué : il faut prévoir de la tolérance.
- Cette année, la stratégie à deux robots mobiles rapportait moins qu'un robot qui remplit son panier de cerises puis sort de sa zone.

Le récit complet des matchs est sur [leskaribous.fr](https://leskaribous.fr/posts/matchs-2023/).

## Photos

![Mary and Dary sur la table]({{ '/assets/img/projets/karibous-2023-mary-and-dary/cdr-2023-1.jpg' | relative_url }})

![Un des robots]({{ '/assets/img/projets/karibous-2023-mary-and-dary/cdr-2023-14.jpg' | relative_url }})

![Un des robots et le panier à cerises]({{ '/assets/img/projets/karibous-2023-mary-and-dary/cdr-2023-16.jpg' | relative_url }})

![Le panier à cerises des Karibous]({{ '/assets/img/projets/karibous-2023-mary-and-dary/cdr-2023-20.jpg' | relative_url }})
*Photo : Coupe de France de Robotique.*
