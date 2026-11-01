---
published: false
title: "La carte principale"
project: cdr-2024
date: 2023-08-02
order: 3
description: "Simulateur 3D de la carte principale du Jardinier : alimentation, Teensy 3.5, moteurs et capteurs, signal par signal."
---

La carte principale est le cœur électronique du Jardinier. Elle reçoit la batterie, coupe tout quand on appuie sur l'arrêt d'urgence, fabrique les tensions dont le robot a besoin et porte le Teensy 3.5 qui pilote les moteurs, lit le lidar et commande les actionneurs.

La page ci-dessous l'explique en six questions, une par chapitre : un schéma animé, un ou deux boutons pour essayer, l'essentiel à retenir, et les composants concernés entourés sur la vraie carte, dessus et dessous. Les trois premiers chapitres sont prêts : l'énergie, l'arrêt d'urgence, les moteurs.

{% include embed-html.html src="/assets/img/projets/cdr-2024/carte-principale/simulateur.html" title="La carte principale 2024 en six questions" caption="Page interactive : énergie, arrêt d'urgence et commande des moteurs, schémas animés et vraie carte." height="760px" %}

## Comment ça marche

- **La batterie et le fusible.** La batterie LiPo 6S arrive par un connecteur XT60. Un fusible de 5 A protège tout ce qui suit.
- **L'arrêt d'urgence passe par un relais.** Le bouton d'arrêt d'urgence ne coupe pas la puissance lui-même : il alimente la bobine d'un relais Finder. Bouton relâché, le relais colle et laisse passer la batterie vers le reste de la carte. Bouton appuyé, la bobine n'est plus alimentée et le relais coupe tout d'un coup : moteurs, régulateurs, Teensy et servos.
- **Quatre tensions.** Trois régulateurs Recom R-78B fabriquent le 5 V, le 12 V et le 3,3 V, 2 A chacun. Un convertisseur TRACO TEN 50 fournit à part le 5 V des servos, jusqu'à 10 A : les servos des actionneurs tirent beaucoup de courant d'un coup, ils ne doivent pas faire chuter l'alimentation du Teensy. Une LED témoin par tension.
- **Le Teensy commande les moteurs par impulsions.** Chaque driver MKS SERVO57B reçoit trois fils : STEP, une impulsion par pas ; DIR, le sens ; EN, la mise en marche. La vitesse du moteur, c'est la fréquence des impulsions.
- **Tout le reste passe par des connecteurs dédiés.** Lidar LD06 en série, capteurs en I2C, trois capteurs de distance, XBee pour parler aux autres robots, nappe vers la carte IHM (boutons, couleur d'équipe, LED), nappe vers l'écran TFT, et trois nappes de 9 fils vers les cartes des actionneurs.
- **La tirette lance le match.** Le robot attend, tirette en place ; quand on la retire, le Teensy démarre le match.

## Retour d'expérience

<div class="callout" markdown="1">
<p class="callout-title">En travaux</p>

Cette partie reste à écrire : la carte en match, les pannes, ce qui a été corrigé dans la version 2025.
</div>

La carte principale 2025 est une évolution directe de celle-ci : voir [les cartes électroniques 2025]({{ '/projets/cdr-2025/cartes-electroniques-2025/' | relative_url }}).

À compléter : [PANNES OU FAIBLESSES VUES EN MATCH], [CHOIX CHANGÉS EN 2025], [RÉGLAGES DES DRIVERS].

## Hypothèses

Les pistes, les composants et leurs liaisons viennent du fichier KiCad `MainBoard-2024` du dépôt [Karibous-2024-Hardware](https://github.com/LesKaribous/Karibous-2024-Hardware) ; les composants en 3D, de son fichier STEP. Les caractéristiques (6S, 5 A, 10 A, écran 320 × 240) viennent de la sérigraphie de la carte et du CAO du robot. Le reste est supposé :

- ce que fait le programme du robot (ordre des étapes, contenu des échanges) n'est pas décrit : il n'est pas publié ;
- les 16 micro-pas des drivers sont un réglage pris pour l'exemple ; la correspondance J5, J3, J6 et Stepper 1, 2, 3 vient de la sérigraphie de la carte ;
- la page ne montre que des états (présent, coupé, actif) : aucune tension ni aucun courant n'est mesuré.

## À propos de la page

La page est assemblée avec le build de [teardown](https://github.com/elvarofficial/teardown) (MIT). Les liaisons et les composants viennent du fichier KiCad de la carte, les vues de la carte de `kicad-cli pcb render`, la chaîne du moteur des mêmes calculs que la page de la base holonome. Sources dans le dépôt du site, dossier `_sims/carte-principale-2024/`.
