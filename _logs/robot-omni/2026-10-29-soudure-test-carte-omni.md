---
title: "Soudure, test et mise en œuvre de la carte du robot omnidirectionnel RC"
date: 2026-10-29
project: robot-omni
description: "Soudure de la carte ESP32-S3 du robot omnidirectionnel avec un pochoir Stenchill imprimé en buse 0,2 mm, bien plus précis qu'en 0,4 mm, refusion à 180 °C, puis essais à la radiocommande en branchant les moteurs un par un."
image: "/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/robot-carte-montee.jpg"
session: "1 h 52"
state: "fonctionnel"
next_step: "Ajouter des carters pour protéger le câblage et l'électronique, et refaire quelques essais."
---

## Objectif

Souder la carte du robot omnidirectionnel, que j'ai conçue à la fin de l'été. Je l'avais reçue depuis longtemps, mais je n'avais pas encore pris le temps de la souder.

La carte est basée sur un ESP32-S3. Le PCB a été produit chez [AISLER](https://aisler.net).

![Routage de la carte sous KiCad : ESP32-S3 Zero, régulateur, quatre connecteurs moteur]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/kicad-pcb.jpg' | relative_url }})
*Le routage de la carte sous KiCad.*

![Schéma KiCad : alimentation, ESP32-S3 Zero, quatre drivers BTS7960, I2C, Sbus, fixations]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/kicad-schema.jpg' | relative_url }})
*Le schéma : alimentation 12 V vers 5 V, ESP32-S3 Zero, quatre connecteurs pour drivers BTS7960, I2C et Sbus.*

![La carte nue, face avant, avec ses pads CMS]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/pcb-nu.jpg' | relative_url }})
*La carte nue, à la sortie de l'emballage.*

## Le principe

J'imprime le pochoir de pâte à braser avec [Stenchill]({{ '/blog/2026/10/stenchill-pochoirs-pcb-imprimes-en-3d/' | relative_url }}), l'outil dont j'ai déjà parlé dans un précédent article. Il transforme les fichiers Gerber en pochoir imprimable en 3D. Avec ce pochoir sur mesure, j'applique la pâte à braser, puis je place les composants CMS.

![Résultat de Stenchill : aperçu 3D du pochoir face avant]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/stenchill-resultat.jpg' | relative_url }})
*Le pochoir généré par Stenchill, face avant, avec ses supports de coin pour caler la carte.*

Avant de commencer, je rassemble tous les composants CMS dont j'ai besoin.

![Les composants sur le tapis de découpe, à côté de la carte posée sur la plaque]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/composants.jpg' | relative_url }})
*Les composants préparés : résistances et LED en bande, diode SS14, régulateur R-78E5.0-1.0, connecteurs.*

![Seringue de pâte à braser sans plomb Sn42Bi58, fusion à 138 °C]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/pate-a-braser.jpg' | relative_url }})
*La pâte à braser : Sn42Bi58, point de fusion 138 °C.*

## Impression du pochoir en buse 0,2 mm

J'ai reçu une buse de 0,2 mm il y a peu, et je l'utilise pour ce pochoir. Mes précédents essais avec Stenchill étaient en buse 0,4 mm. Les composants de cette carte sont en 1206, assez gros, et la buse 0,4 mm fonctionnait déjà très bien. La buse 0,2 mm devrait quand même être plus précise.

![Tranchage du pochoir : couches de 0,1 mm, 43 min, 2,77 g de filament]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/stencil-tranchage.jpg' | relative_url }})
*Le tranchage : couches de 0,1 mm, 43 min d'impression, 2,77 g de filament.*

J'imprime sur un plateau lisse.

![Impression du pochoir sur une Bambu Lab A1 mini, plateau lisse]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/impression-stencil.jpg' | relative_url }})
*Impression en cours sur plateau lisse.*

![Le pochoir encore sur le plateau, avec ses quatre supports de coin]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/stencil-plateau.jpg' | relative_url }})
*Le pochoir sur le plateau, côté supports de coin.*

![Le pochoir retourné, face lisse, ouvertures des pads bien nettes]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/stencil-imprime.jpg' | relative_url }})
*La face lisse du pochoir : les ouvertures des pads sont nettes.*

Le résultat en buse 0,2 mm est infiniment meilleur que ce que j'avais obtenu en 0,4 mm. Je ne sais pas si l'outil a évolué entre-temps, mais en tout cas le pochoir est beaucoup plus précis.

## Pâte à braser et soudure des CMS

![Dépôts de pâte à braser sur les pads des LED, résistances et condensateur]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/pate-deposee.jpg' | relative_url }})
*La pâte déposée au pochoir sur les pads.*

Franchement, c'est pas mal. Le positionnement des dépôts est meilleur que ce que j'attendais. La buse 0,2 mm fonctionne clairement mieux que la 0,4 mm.

![La carte avec les CMS soudés : LED, résistances, condensateurs, diode]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/cms-soudes.jpg' | relative_url }})
*Les CMS soudés.*

La refusion se fait sur une plaque chauffante à refusion, chauffée à 180 °C.

Je soude ensuite les composants traversants : connecteur XT, régulateur Recom, barrettes de l'ESP32-S3 Zero, connecteurs I2C, Sbus et moteurs.

![La carte complète : connecteur XT, régulateur Recom, quatre connecteurs moteur, connecteurs I2C]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/carte-soudee.jpg' | relative_url }})
*La carte soudée.*

## Test de la carte

La carte est soudée, je passe aux tests. Sous tension, les trois LED 12 V, 5 V et 3,3 V s'allument.

![La carte alimentée, ESP32-S3 Zero en place, LED d'alimentation allumées]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/carte-alimentee.jpg' | relative_url }})
*La carte sous tension, avec l'ESP32-S3 Zero en place.*

Je branche ensuite le récepteur de radiocommande, un FlySky FS-iA6B.

![La carte reliée au récepteur FlySky FS-iA6B]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/recepteur-fs-ia6b.jpg' | relative_url }})
*Le récepteur FS-iA6B branché sur la carte.*

L'interface web du robot reçoit bien la radio : protocole iBUS, liaison connectée, 0 trame perdue, 0 erreur. Les commandes des manches remontent dans le mixeur des quatre moteurs.

![Interface web Omni-RC-Robot avec la radiocommande au premier plan]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/interface-radio.jpg' | relative_url }})
*L'interface web : radio connectée, commandes vx et vy, valeurs du mixeur par moteur.*

## Essais sur le robot

Je relie la carte au robot, câblé avec ses quatre drivers BTS7960. Pour les liaisons vers les drivers, je fabrique quatre câbles en nappe, avec des connecteurs de nappe standard.

![Le châssis du robot avec ses quatre drivers BTS7960 sur dissipateurs et son câblage]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/robot-cablage.jpg' | relative_url }})
*Le câblage du robot : quatre drivers BTS7960 sur dissipateurs.*

Je fais le branchement petit à petit : un premier moteur, je vérifie que tout fonctionne, puis un deuxième, nouvelle vérification, et enfin les quatre moteurs. Je contrôle ainsi au fur et à mesure qu'il n'y a pas de problème, que je n'ai rien oublié et que mes câbles fonctionnent, sans avoir à chercher la panne après coup.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/essai-radio-1.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Premier essai à la radiocommande : un seul moteur branché.*

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/essai-radio-2.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Deuxième essai : deux moteurs branchés.*

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/essai-radio-3.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Troisième essai : les quatre moteurs branchés.*

## Le support de la carte

Pour fixer la carte sur le châssis, je dessine un support sous FreeCAD.

![Modèle FreeCAD du support : plateau avec quatre plots pour la carte et une partie surélevée percée de trous fraisés]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/support-freecad.png' | relative_url }})
*Le support de la carte dans FreeCAD.*

![Le support rouge en cours d'impression sur la Bambu Lab, plateau texturé]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/support-impression.jpg' | relative_url }})
*Le support en cours d'impression.*

Le support se visse sur un profilé aluminium du châssis, et la carte se visse sur le support.

![La carte vissée sur son support rouge, lui-même fixé sur le profilé aluminium, nappes et récepteur branchés]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/carte-montee.jpg' | relative_url }})
*La carte en place sur son support, nappes moteur et récepteur branchés.*

![Vue d'ensemble du robot avec la carte montée sur le châssis, à côté du récepteur FS-iA6B]({{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/robot-carte-montee.jpg' | relative_url }})
*Le robot avec sa carte montée.*

## Essai final

Une fois la carte montée, je fais rouler le robot au sol, à la radiocommande.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/robot-omni/2026-10-29-soudure-test-carte-omni/essai-final.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*L'essai final : le robot roule au sol, piloté à la radiocommande.*

## Conclusion

Avec une buse de 0,2 mm, le pochoir imprimé en 3D avec Stenchill est nettement plus précis qu'en 0,4 mm, même pour des composants en 1206. La carte est soudée et tout fonctionne correctement : elle s'allume, reçoit la radiocommande et pilote les quatre moteurs. Elle s'intègre bien au robot.

## Suite

- [x] Fixer la carte sur le châssis avec le support imprimé
- [ ] Ajouter des carters pour protéger le câblage et l'électronique
- [ ] Refaire quelques essais
