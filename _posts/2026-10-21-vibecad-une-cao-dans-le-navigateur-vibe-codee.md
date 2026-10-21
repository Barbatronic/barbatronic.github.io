---
published: true
title: "VibeCAD : une CAO dans le navigateur, vibe-codée"
date: 2026-10-21
description: "VibeCAD est un logiciel de CAO 3D paramétrique qui tourne dans le navigateur, entre Tinkercad et FreeCAD. Né pour initier ma fille à la conception mécanique, il est entièrement vibe-codé. Il est en ligne, gratuit et open source."
tags: [logiciel, cao, impression-3d, open-source]
project: vibecad
image: "/assets/img/projets/vibecad/simulation-bras.jpg"
image_caption: "Simulation d'un bras en acier dans VibeCAD : 4 kg au bout, la pièce tient."
---

VibeCAD est en ligne. C'est un logiciel de **CAO 3D paramétrique** qui tourne entièrement dans le
navigateur : esquisses cotées, extrusions, poches, historique modifiable, assemblage, fabrication.
Pas de compte, pas d'installation, et les modèles restent sur votre machine.

**[Ouvrir VibeCAD](https://barbatronic.fr/VibeCAD/)** · [la fiche projet]({{ '/projets/vibecad/' | relative_url }}) · [le code source](https://github.com/Barbatronic/VibeCAD)

## Au départ : initier ma fille

Je voulais faire découvrir la conception mécanique à ma fille. Pas juste empiler des formes : la
vraie démarche. Choisir un plan, dessiner une esquisse, la coter, en faire un volume, retirer de la
matière, revenir corriger une étape.

Le problème, c'est l'offre. Les logiciels pour enfants, comme Tinkercad, restent très basiques et peu
tournés vers l'ingénierie. FreeCAD et les CAO classiques font tout cela, mais sont beaucoup trop
complexes pour un enfant de moins de 10 ans. Il manquait quelque chose entre les deux : la logique de
FreeCAD, avec une prise en main simple.

## Ce que c'est devenu

Le projet a dépassé l'idée de départ. Au-delà de la pièce seule, VibeCAD sait assembler, vérifier
qu'une pièce tient, et préparer la fabrication : plateau d'impression 3D, découpe laser, mise en
plan, nomenclature.

### Assembler et visser

L'onglet Assemblage insère les pièces du projet et les relie par des **liaisons** : fixe, pivot,
glissière, pivot glissant, rotule. On attrape ensuite une pièce à la souris, et elle ne suit que le
mouvement permis. Les boucles fermées fonctionnent : sur un quadrilatère articulé, quand une barre
tourne, les autres suivent.

![Quadrilatère articulé avec sa visserie dans VibeCAD]({{ '/assets/img/projets/vibecad/assemblage-visserie.jpg' | relative_url }})
*Quadrilatère articulé : liaisons pivot, pièce fixe en orange, visserie posée dans les trous.*

Le module de **visserie** pose de vraies pièces normalisées d'un clic sur le bord d'un trou : vis
CHC, BHC, FHC et H, écrous et rondelles, de M2 à M12 (ISO 4762, 7380, 10642, 4017, 4032, 7089).
Le but est pédagogique autant que pratique :

- **pas de vis de mauvaise taille** : la taille est déduite du diamètre du trou (passage ISO 273
  ou perçage avant taraudage). Un trou qui ne correspond à aucune vis est refusé, avec des exemples
  de bons diamètres ;
- **pas de longueur fantaisiste** : seules les longueurs de la norme sont proposées, et la pose
  choisit la plus courte qui traverse et dépasse assez pour prendre un écrou ;
- **un empilement logique** : rondelle contre la pièce, puis écrou ou tête de vis, quel que soit
  l'ordre des clics ;
- **elle suit la pièce** quand le mécanisme bouge, et se retrouve dans la **nomenclature** CSV,
  regroupée par désignation (« Vis CHC ISO 4762 M3 × 12 »).

Si la pièce change et que le trou disparaît, la vis est signalée au lieu d'être déplacée au hasard.

### Vérifier que ça tient

L'onglet Simulation répond à une question simple : est-ce que ma pièce va casser ? On choisit le
matériau, on clique les faces fixées et celle où appuie la charge, on lance le calcul. La pièce se
colore du bleu (tranquille) au rouge (très sollicitée), et un verdict tombe : « La pièce tient »,
« C'est juste » ou « Risque de casser ».

![Simulation d'un bras en acier dans VibeCAD]({{ '/assets/img/projets/vibecad/simulation-bras.jpg' | relative_url }})
*Un bras en acier fixé d'un côté, 4 kg posés au bout : la pièce tient, avec une marge de 9,9.*

C'est un calcul par éléments finis, indicatif, mais suffisant pour comprendre où une pièce travaille
et pourquoi on renforce à tel endroit. Le même outil peut aussi alléger la pièce en ne gardant que
la matière utile.

<div class="gallery">
  <figure><img src="{{ '/assets/img/projets/vibecad/roue-historique.jpg' | relative_url }}" alt="Pièce Roue avec son historique de construction" loading="lazy"><figcaption>Une pièce et son historique</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/vibecad/tolerie-deplie.jpg' | relative_url }}" alt="Carrosserie en tôle dépliée avec ses lignes de pli" loading="lazy"><figcaption>Tôlerie : le développé à plat</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/vibecad/laser-plaques.jpg' | relative_url }}" alt="Roues et châssis placés sur une plaque de découpe laser" loading="lazy"><figcaption>Préparation de la découpe laser</figcaption></figure>
</div>

## Le mode Débutant reste le cœur

L'usage premier n'a pas bougé. Trois niveaux (Débutant, Intermédiaire, Expert) montrent les
outils progressivement. En mode Débutant, l'interface reste courte, des parcours guidés se valident
tout seuls en observant le modèle, et chaque erreur est expliquée avec un moyen de la réparer.

![Parcours guidé « la plaque percée »]({{ '/assets/img/projets/vibecad/parcours-guide.jpg' | relative_url }})
*Le parcours guidé « la plaque percée » : la première pièce, étape par étape.*

Et rien ne reste enfermé dedans : le travail se reprend dans **FreeCAD**, en STEP ou via un script
qui reconstruit l'historique. C'est l'idée : apprendre ici, continuer avec les vrais outils.

## Pourquoi « Vibe » ?

VibeCAD a été entièrement **vibe-codé** avec Claude. Il me semblait honnête de le dire dans le nom.

Le « vibe » concerne la fabrication de l'application, pas son usage. Il n'y a **aucune
fonctionnalité d'IA** dans le logiciel : les pièces se conçoivent à la main, comme dans n'importe
quelle CAO.

Sous le capot, c'est quand même du sérieux : le noyau géométrique est Open CASCADE, le même que
FreeCAD, compilé en WebAssembly. L'application s'installe et fonctionne ensuite hors ligne.

## À utiliser en connaissance de cause

VibeCAD est en version 0.1. Il est gratuit, open source (MIT), et n'a pas vocation à devenir autre
chose que cette expérience : un outil pour apprendre la CAO, et pour l'apprendre à ma fille.

Si vous avez des enfants curieux, ou si vous voulez simplement découvrir la CAO paramétrique sans
installer quoi que ce soit, essayez-le : [barbatronic.fr/VibeCAD](https://barbatronic.fr/VibeCAD/).
