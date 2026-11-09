---
published: true
title: "Carte CDR 2027 : optimisation du routage et modèles 3D"
date: 2026-11-09
project: cdr-2027
description: "Déplacement du port USB après vérification du passage du BAU, retouches du PCB et intégration des modèles 3D avec l'aide de ChatGPT. Une première estimation de fabrication chez AISLER."
image: "/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/carte-3d-face-composants.png"
session: ""
state: "en cours"
next_step: "Poursuivre les vérifications du PCB et de l'encombrement, puis préparer la sérigraphie avec le logo AISLER."
---

## Reprendre la carte à tête reposée

Après le [schéma et le premier routage du week-end]({{ '/logs/cdr-2027/2026-11-08-schema-premier-routage-carte/' | relative_url }}), l'objectif de cette soirée est de peaufiner la carte, de chercher les erreurs évidentes et surtout d'intégrer les modèles 3D des composants pour vérifier leur encombrement.

Le schéma fourni à la fin de cette séance est identique à celui du log précédent. Il reste quelques détails de présentation à reprendre, mais les modifications de ce soir concernent le PCB et les modèles 3D.

Les [sources de la carte sont sur GitHub](https://github.com/Barbatronic/CDR-2027/tree/main/ECAD/main-board-2027). Les fichiers intégrés ici conservent l'état de la session du 9 novembre, distinct de celui du premier routage.

## Le BAU et le port USB se gênent

Je commence par le port USB. Je veux surtout vérifier son implantation par rapport au **bouton d'arrêt d'urgence**, qui doit passer dans l'encoche de la carte.

Pour cela, j'intègre le BAU un peu de force dans KiCad, comme un élément de positionnement mécanique. Il ne se monte pas électriquement sur le PCB : son raccordement passe par le connecteur latéral prévu pour lui. Je veux simplement voir où il se trouve par rapport aux composants, sans ouvrir FreeCAD ni construire tout de suite un assemblage mécanique complet.

Un simple cercle de positionnement suffit déjà à montrer un **conflit avec le port USB**. Je déplace donc le connecteur USB, puis je reprends les pistes concernées. C'est précisément le genre de problème que je voulais faire apparaître avant de considérer le placement comme figé.

![Vue 3D côté commandes, avec le bouton d'arrêt d'urgence dans l'encoche et le port USB à proximité]({{ '/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/carte-3d-bau-usb.png' | relative_url }})
*Le BAU est représenté pour contrôler son encombrement dans l'encoche. Le port USB a été repositionné après cette vérification.*

## Des retouches sur le PCB

Je profite de cette reprise pour corriger plusieurs petits détails : des espacements, des empattements de pistes et des raccordements au plan de masse.

Ce n'est pas terminé : en relisant la carte, je repère encore régulièrement des choses à améliorer. Je suis néanmoins assez satisfait de l'état du PCB en fin de séance. Le déplacement de l'USB et les premières vérifications d'encombrement ont déjà permis de corriger quelques erreurs.

{% include kicanvas.html src="/assets/files/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/main-board-2027.kicad_pcb" caption="PCB après les retouches et l'intégration des modèles 3D — session du 9 novembre 2026." %}

## Rassembler les modèles 3D

L'intégration des modèles 3D est toujours un peu laborieuse. Il faut les retrouver, vérifier qu'ils correspondent aux composants, parfois les régénérer, puis corriger leur position et leur orientation dans KiCad. Le résultat est satisfaisant, mais le temps passé me paraît souvent disproportionné.

Cette fois, **ChatGPT en ligne, avec GPT-6 et un niveau de raisonnement élevé**, m'a beaucoup aidé. Je lui ai donné les références des composants dont les modèles manquaient. Pour certains, il a trouvé rapidement des équivalents que j'ai pu importer en STEP et positionner. Pour d'autres bibliothèques qui fonctionnaient mal, il a réparé les liens et les modèles.

![Vue d'ensemble de la carte côté commandes, avec les modèles des boutons, de l'USB, du buzzer et du BAU]({{ '/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/carte-3d-face-commandes.png' | relative_url }})
*La face des commandes. Les volumes permettent de mieux voir les hauteurs et la place prise autour du BAU.*

## Générer les modèles qui manquent

Pour les composants sans modèle disponible, j'ai essayé de fournir les **fiches techniques et les représentations visuelles** à ChatGPT. J'ai été agréablement surpris par ce qu'il a réussi à reconstruire à partir de ces informations.

Le **BOB-12009**, le petit module rouge de conversion de niveaux logiques, en est un bon exemple. J'en ai déjà un monté, que je souhaite récupérer de la carte de l'année dernière. Il fallait donc représenter le module avec ses connecteurs, et pas seulement le petit circuit imprimé nu.

J'ai obtenu un modèle avec les barrettes mâles et femelles, ainsi que plusieurs variantes : avec ou sans barrettes, et avec différentes hauteurs de connecteurs. Cela permet de représenter le montage prévu et de vérifier la place qu'il prend au-dessus de la carte principale.

![Modèle STEP du module BOB-12009 rouge, monté sur ses connecteurs]({{ '/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/bob-12009-modele-headers.png' | relative_url }})
*Un exemple du travail sur le BOB-12009 : le module et ses connecteurs sont représentés ensemble, avec des variantes de hauteur.*

ChatGPT a également retrouvé un **modèle fabricant du bouton d'arrêt d'urgence** que je cherchais depuis longtemps, puis m'a aidé à l'adapter pour son positionnement dans l'assemblage de la carte. J'ai eu la même aide pour le **régulateur Pololu D36V50F5** et pour quelques connecteurs.

Le modèle du **module Ethernet W5500, de type WIZ850io**, est moins convaincant visuellement. Il a néanmoins le mérite d'exister et je pourrai l'améliorer plus tard. Je le garde pour cette première représentation d'encombrement.

## Voir enfin l'assemblage

{% include model-3d.html src="/assets/img/projets/cdr-2027/3d/main-board-2027-2026-11-09.glb" alt="Carte principale CDR 2027 avec ses composants et le bouton d'arrêt d'urgence" poster="/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/carte-3d-face-composants.png" caption="Carte principale — assemblage 3D de la session du 9 novembre 2026." orbit="-25deg 45deg auto" load_on_click=true %}

![Vue 3D côté composants : entrée batterie, relais, régulateur Pololu, module rouge BOB-12009 et connecteurs]({{ '/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/carte-3d-face-composants.png' | relative_url }})
*La face des composants, avec l'alimentation au premier plan et le BOB-12009 rouge près de l'ESP32-S3.*

![Autre vue 3D côté composants, avec le module Ethernet à gauche et les alimentations à droite]({{ '/assets/img/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/carte-3d-modules.png' | relative_url }})
*L'autre angle de vue montre le module Ethernet, les connecteurs et les modules montés en hauteur.*

L'assemblage 3D m'a permis de repérer et de corriger quelques autres petites erreurs. C'est aussi beaucoup plus facile de se représenter la carte une fois les volumes présents.

L'aide de l'IA m'a surtout libéré du temps sur la recherche et la préparation des modèles. Une étape qui n'est généralement pas la plus amusante est devenue une séance de travail assez détendue, avec un résultat concret à la fin.

## Le schéma de cette version

{% include kicanvas.html src="/assets/files/projets/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/main-board-2027.kicad_sch" caption="Schéma de la carte, inchangé par rapport à la session précédente." %}

## Première estimation de fabrication

J'ai fait une première estimation chez **[AISLER](https://aisler.net/)** : **environ 40 € pour trois cartes**. La carte est assez grande, ce qui se retrouve dans le prix.

Il me reste des crédits de leur sponsoring des années précédentes ; je prévois de les utiliser pour cette fabrication. J'ajouterai également le **logo AISLER dans la sérigraphie du PCB**.

## Suite

Je vais continuer à relire le PCB et à vérifier que je n'ai pas oublié quelque chose de classique. La sérigraphie sera le sujet d'une prochaine soirée et d'un prochain log, dont la date n'est pas encore fixée.

- [ ] Poursuivre les vérifications du PCB et des raccordements au plan de masse.
- [ ] Continuer les vérifications d'encombrement avec les modèles 3D.
- [ ] Préparer la sérigraphie des connecteurs et des fonctions.
- [ ] Ajouter le logo AISLER à la sérigraphie.
