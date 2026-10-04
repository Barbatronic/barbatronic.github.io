---
published: true
title: "Guide de conversion au 1,75 mm"
project: umo-1-75mm
order: 1
date: 2025-05-16
description: "Démontage, câblage, résistance sur la carte, firmware Marlin et calibration pour passer l'Ultimaker Original au 1,75 mm avec des pièces d'Ender 3."
---

Source : [README du dépôt UMO-1.75mm](https://github.com/Barbatronic/UMO-1.75mm), traduit de l'anglais.
Projet en cours : certaines étapes seront complétées.

## Pourquoi cette conversion

L'Ultimaker Original (2011) a été ma première imprimante 3D personnelle. Reçue fin 2012, elle a tourné sans souci majeur jusqu'en 2020. Ensuite :

- toutes mes autres imprimantes utilisaient du 1,75 mm, et je ne voulais plus gérer deux stocks de filament ;
- la tête d'impression vieillissait, et les pièces de rechange de qualité étaient introuvables ou trop chères ;
- l'extrudeur était devenu presque inutilisable, avec les mêmes problèmes d'approvisionnement.

Plutôt que de laisser dormir une machine encore capable de belles impressions, je l'ai modifiée pour utiliser des pièces standard d'Ender 3 et passer au 1,75 mm.

## Nomenclature

Des pièces courantes, faciles à trouver en ligne :

- **Extrudeur** : [lien produit](https://www.amazon.fr/dp/B09H6T3NNT) ;
- **Tête d'impression (hotend)** : [lien produit](https://www.amazon.fr/dp/B09RXRQ5HM) ;
- **Ventilateur 40 × 40 mm 24 V** pour refroidir la tête et éviter les bouchons dans le tube PTFE. J'ai réutilisé celui d'une Ender 2 Pro, n'importe quel modèle équivalent convient ;
- **Résistance 4,7 kΩ**, à souder sur la carte mère, et un fer à souder ;
- **Connecteurs Molex KK254**, si vous ne voulez pas couper et modifier le câble de sonde existant.

![La tête Ender 3 neuve et son faisceau de câbles]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_10.jpg' | relative_url }})
*La tête d'impression neuve, avec son faisceau.*

Pour la résistance, une résistance de précision améliore la justesse de la mesure de température. Pour les premiers essais, une 5 % suffit. Elle se soude à l'emplacement **R23** de la carte mère.

![Schéma de la carte mère Ultimaker Original]({{ '/assets/img/projets/umo-1-75mm/doc/umboard.jpg' | relative_url }})
*La carte mère de l'Ultimaker Original.*

La nomenclature d'origine d'Ultimaker peut aussi aider : [dépôt UltimakerOriginal](https://github.com/Ultimaker/UltimakerOriginal/tree/master).

## Démonter la tête et l'extrudeur d'origine

J'avais déjà modifié l'extrudeur par le passé : ma version est donc un peu différente de l'originale. Je m'en sers pour fixer provisoirement le nouvel extrudeur, en attendant de dessiner un remplaçant « façon Ultimaker ».

![L'extrudeur d'origine, déjà modifié]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_08.jpg' | relative_url }})
*Mon extrudeur, déjà modifié avant la conversion.*

### 1. Débrancher la cartouche chauffante

Dévisser les fils de la cartouche chauffante sur la carte mère. Garder le câble de sonde existant intact : il servira plus tard pour le ventilateur de tête. Débrancher aussi les fils de la sonde de température.

![Les fils de la tête sur la carte mère]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_18.jpg' | relative_url }})
![Les borniers de la cartouche chauffante]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_17.jpg' | relative_url }})
*Les connexions de la tête sur la carte mère.*

### 2. Retirer la tête avec précaution

La tête se démonte ensuite. Garder toutes les pièces : vous voudrez peut-être la remonter un jour. J'ai tout démonté pièce par pièce, sans savoir comment le remontage se passerait, en pensant réutiliser la cartouche et la sonde d'origine.

La tête était malheureusement en trop mauvais état, et son connecteur s'est cassé en deux.

**Conseil** : soyez plus soigneux que moi au démontage. 😊

![La tête d'origine démontée]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_31.jpg' | relative_url }})
![Détail de la tête démontée]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_27.jpg' | relative_url }})
![Pièces de la tête d'origine]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_30.jpg' | relative_url }})
![Le bloc chauffant d'origine]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_28.jpg' | relative_url }})
![Le connecteur de tête cassé]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_20.jpg' | relative_url }})
*Démontage de la tête d'origine, jusqu'au connecteur cassé.*

![La plaque de tête vide]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_29.jpg' | relative_url }})
*La plaque de tête une fois vidée.*

## Monter le nouvel extrudeur

Peu à dire ici : le moteur est compatible avec l'extrudeur, la modification est simple. Il faut juste une plaque pour fixer l'ensemble. La plaque d'origine fait l'affaire si vous l'avez encore.

![Le nouvel extrudeur en place]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_09.jpg' | relative_url }})
![L'extrudeur sur son moteur]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_07.jpg' | relative_url }})
*Le nouvel extrudeur monté sur le moteur d'origine.*

## Passer les câbles

Faire passer tous les câbles de la nouvelle tête par le chemin d'origine : deux fils pour la cartouche chauffante, deux pour la sonde de température.

![Le faisceau de la nouvelle tête]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_06.jpg' | relative_url }})
*Le faisceau de la nouvelle tête.*

J'ai toujours trouvé la gestion des câbles de cette machine discutable. La gaine textile autour du faisceau est une bonne idée, mais dessous, c'est un vrai bazar. 😅 Il faudra que je m'en occupe un jour.

![Les câbles sous la machine]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_26.jpg' | relative_url }})
![Le faisceau sous la machine]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_25.jpg' | relative_url }})
*Sous la machine.*

Brancher les fils de la cartouche chauffante au même endroit que l'ancienne. La polarité n'a pas d'importance.

![La cartouche chauffante branchée sur la carte]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_11.jpg' | relative_url }})
*La nouvelle cartouche branchée sur la carte.*

![Vue d'ensemble de la carte mère]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_19.jpg' | relative_url }})
*Vue d'ensemble de la carte mère.*

## Souder la résistance de 4,7 kΩ

Si vous êtes motivé, vous pouvez tout débrancher, sortir la carte et souder la résistance « proprement », à travers le circuit. Pour les premiers essais, on peut aussi la plier comme sur la photo et la souder en surface. C'est suffisant pour l'instant, surtout avec une résistance 5 % à remplacer plus tard par une plus précise.

![La résistance pliée avant soudure]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_13.jpg' | relative_url }})
![La résistance soudée en R23]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_14.jpg' | relative_url }})
![Détail de la soudure]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_12.jpg' | relative_url }})
*La résistance de 4,7 kΩ soudée en surface sur R23.*

## Faire un connecteur pour la sonde

Sertir un connecteur Molex KK254 sur la sonde de température, en utilisant les broches **GND** et **SIG** aux extrémités. Le brancher ensuite sur l'emplacement **TEMP1** de la carte.

![Le connecteur Molex KK254 serti]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_16.jpg' | relative_url }})
![Le connecteur de sonde]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_15.jpg' | relative_url }})
![La sonde branchée sur TEMP1]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_24.jpg' | relative_url }})
*Le connecteur de sonde, puis branché sur TEMP1.*

## Ajouter le ventilateur de tête

Les machines d'origine n'en avaient pas, mais refroidir la tête est vite devenu indispensable pour éviter les bouchons. Un ventilateur 40 × 40 mm 24 V se branche sur la sortie ventilateur de la carte. Il doit tourner en permanence : pas besoin d'entrée dédiée.

Profitez d'avoir la carte accessible pour faire ce branchement et passer les câbles du ventilateur.

Je n'ai pas pris de photo de cette étape, je les ajouterai plus tard.

## Montage de test

Avec des pièces de récupération, on peut faire un montage provisoire pour tester les branchements. J'ai utilisé de vieilles pièces d'Ender 2 Pro pour fixer le ventilateur et la tête.

![Le montage de test avec des pièces d'Ender 2 Pro]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_05.jpg' | relative_url }})
![Le montage de test sur la machine]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_23.jpg' | relative_url }})
*Montage provisoire pour les premiers essais.*

## Support de tête imprimé

Pour remplacer le montage de test, je dessine un support de tête dans FreeCAD. Les fichiers sont dans le dossier [`hotend/`](https://github.com/Barbatronic/UMO-1.75mm/tree/main/hotend) du dépôt : STEP, STL, projet 3MF et sources FreeCAD. Une version V2 est en cours (`hotend-UMO-1_75-V2.FCStd`).

{% include model-3d.html src="/assets/img/projets/umo-1-75mm/3d/support-tete.glb" alt="Support de tête imprimé pour Ultimaker Original 1,75 mm" caption="Support de tête, version 1 (hotend-UMO-1_75.stl)" %}

![Le support de tête imprimé, tenu en main]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_01.jpg' | relative_url }})
![Le support de tête sur le plateau]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_04.jpg' | relative_url }})
*Le support de tête imprimé.*

Le dossier contient aussi, pour référence, le [support E3D pour Ultimaker](https://www.thingiverse.com/thing:94678) de am001 (licence Creative Commons Attribution).

## Compiler le firmware Marlin

Utiliser **Arduino IDE 1.x** pour compiler et téléverser Marlin. Le firmware est dans le dossier [`firmware/`](https://github.com/Barbatronic/UMO-1.75mm/tree/main/firmware) du dépôt.

Dans `Configuration.h`, déclarer la sonde de température :

```c
#define TEMP_SENSOR_0 1
// 1 : thermistance 100k, idéale pour une EPCOS 100k (avec résistance de tirage de 4,7k)
```

## Tester la température

Avant d'aller plus loin, vérifier que la sonde fonctionne :

1. envoyer cette commande depuis un terminal G-code :
   ```gcode
   M109 S50
   ```
2. vérifier que la température monte quand la tête chauffe.

## Calibrer le PID de la tête

Lancer le réglage automatique du PID pour optimiser la chauffe :

1. lancer la commande :
   ```gcode
   M303 E0 S200 C8
   ```
2. noter les résultats (Kp, Ki, Kd). Par exemple :
   ```
   Kp: 47.02
   Ki: 5.48
   Kd: 100.91
   ```
3. reporter ces valeurs dans `Configuration.h` :
   ```c
   #define DEFAULT_Kp 47.02
   #define DEFAULT_Ki 5.48
   #define DEFAULT_Kd 100.91
   ```

## Régler les pas par mm de l'extrudeur (e-steps)

Calibrer l'extrudeur pour extruder la bonne quantité de filament :

1. régler la valeur des e-steps. Chez moi, c'était :
   ```gcode
   M92 E140
   M500
   ```
   Adaptez cette valeur à votre montage si besoin.
2. tester le mouvement de l'extrudeur :
   - extruder 10 mm de filament :
     ```gcode
     G1 E10 F100
     ```
   - rétracter 10 mm :
     ```gcode
     G1 E-10 F800
     ```

![L'écran du contrôleur avec les pas par mm]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_21.jpg' | relative_url }})
![L'écran du contrôleur, machine prête]({{ '/assets/img/projets/umo-1-75mm/doc/IMG_22.jpg' | relative_url }})
*Le contrôleur Ultimaker : E-steps à 140, machine prête.*

La tête doit être chaude avant d'extruder ou de rétracter du filament.

## Profil OrcaSlicer

Le dépôt fournit un profil d'imprimante pour OrcaSlicer, buse 0,4 mm et filament 1,75 mm : [`Ultimaker Original 0.4 nozzle - 1.75mm.orca_printer`](https://github.com/Barbatronic/UMO-1.75mm/tree/main/orca%20presets).

## Et ensuite

Avec ces étapes, l'Ultimaker Original imprime en 1,75 mm. Restent à faire : la V2 du support de tête, le remplaçant de l'extrudeur « façon Ultimaker », le rangement des câbles et les photos du ventilateur.
