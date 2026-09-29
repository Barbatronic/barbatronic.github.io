---
published: true
title: "Robot 2025 : cartes électroniques"
project: karibous-2025-technicien-de-scene
order: 1
description: "Carte principale, adaptation écran, IHM et carte Lidar du robot 2025"
---

L'ensemble des fichiers peut être trouvé sur [notre repo GitHub 2025.](https://github.com/LesKaribous/Karibous-2025-Hardware/tree/main/ECAD)

## Carte principale : évolution de la carte 2024

Cette nouvelle version de la carte est toujours pilotée par un **Teensy 3.5** mais reste compatible avec un **Teensy 4.1**. Elle assure le contrôle du robot principal. En tant qu'évolution de la carte 2024, et avec l'ajout de la compatibilité avec le Teensy 4.1, elle présente quelques connecteurs redondants.

Les cartes externes sont connectées via des connecteurs à nappe pour accéder directement aux entrées/sorties du microcontrôleur lorsque nécessaire. Pour les autres communications, l'interface se fait via des connexions série ou I2C.

### Caractéristiques Principales

- **Compatibilité** : Teensy 3.5 et 4.1
- **Interfaces externes** :
  - Cartes moteur, interface homme-machine (IHM) et adaptation d'écran
- **Connecteurs dédiés** :
  - Carte de gestion LiDAR
  - Capteur **Otos de Sparkfun**
  - Adaptation pour module XBee
- **Connecteur d'extension** : I2C pour cartes supplémentaires
- **Connecteur nappe** : Accès à 9 entrées/sorties pour actionneurs ou capteurs
- **Buzzer**

### Gestion de l'Alimentation et de la Puissance

La carte gère également les différents niveaux de tension nécessaires au fonctionnement du robot, grâce aux éléments suivants :

- **Régulateurs Recom 78Bxx** : pour des tensions de 5V, 3,3V et 12V logiques
- **Régulateur Traco TEN50-2411** : pour la gestion de l'alimentation en 5V pour les besoins de puissance
- **Relais avec fusible** : pour la gestion de l'arrêt d'urgence du robot

## Carte d'adaptation écran

C'est exactement la même carte qu'en 2024. Le but est d'adapter le connecteur droit à un connecteur nappe compatible avec nos cartes, afin de gagner de la place dans l'intégration des écrans.

## Carte IHM

Cette carte permet l'interaction entre l'utilisateur et le robot. Auparavant, les fonctionnalités ci-dessous étaient réparties sur plusieurs cartes ou directement montées sous forme de boutons à visser. Dans une démarche de simplification, l'idée est désormais de centraliser toutes ces fonctions sur une seule carte.

Les éléments intégrés à cette carte incluent :

- Capteur pour la tirette
- Bouton d'initialisation
- Interrupteur de sélection d'équipe
- Interrupteur de sélection de comportement (ou de stratégie, selon les années)
- Potentiomètre de sélection
- Deux LED multicolores indicatrices pour chaque interrupteur

La grande nouveauté cette année est l'utilisation d'un capteur Hall **DRV5023** pour la tirette, en remplacement des capteurs REED utilisés les années précédentes. Nous allons tester son fonctionnement, et en fonction des résultats, nous pourrons revenir à un capteur REED comme auparavant, grâce à un connecteur prévu sur la carte principale en attendant nos conclusions.

## Carte Lidar

La carte Lidar permet, grâce à un microcontrôleur Teensy 3.2 ou 4.0, d'interfacer un lidar de type LD06 (ou équivalent) avec notre carte principale. Le microcontrôleur récupère les informations du lidar, les traite, puis renvoie les données nécessaires à la carte principale pour localiser les adversaires autour du robot. La communication s'effectue via une simple liaison série.

Cette carte dispose également d'un connecteur pour brancher un anneau de LEDs autour du mât de balise, ce qui permet de visualiser facilement les points et les détections. Un connecteur I2C est également présent pour connecter un écran OLED à des fins de débogage.

Cette carte est la même depuis 2023. Initialement utilisée avec un Teensy 3.2, nous passons sur un Teensy 4.0 cette année.
