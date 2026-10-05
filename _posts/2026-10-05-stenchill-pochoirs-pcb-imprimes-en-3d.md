---
title: "Stenchill : des pochoirs PCB imprimés en 3D, nés dans le chat du live"
date: 2026-10-05
description: "Stenchill transforme vos fichiers Gerber en pochoir de pâte à braser imprimable en 3D. Un outil gratuit développé par A·D·C studio, né d'une discussion sur mon live, et qui ne cesse de s'enrichir."
tags: [electronique, pcb, impression-3d, outils, communaute]
project: 
image: ""
image_caption: ""
---

Il y a quelques mois, on parlait de pochoirs pour la pâte à braser dans le chat du live. Un pochoir pro
coûte entre 15 et 30 € par face, et on oublie souvent de le commander avec les cartes. Pourquoi ne pas
l'imprimer en 3D ? Un des viewers s'est dit que l'idée était bonne et qu'il avait les compétences pour
la concrétiser. Il l'a fait : ça s'appelle [Stenchill](https://www.stenchill.com/fr/), développé par
[A·D·C studio](https://www.adcstudio.fr).

## Le principe

Un pochoir, ou stencil en anglais, est une fine plaque percée aux endroits des pads. On le pose sur la
carte, on étale la pâte à braser à la raclette, on place les composants CMS, puis on passe au four. Le
dépôt est précis et régulier, et bien plus rapide qu'à la seringue.

Avec Stenchill :

1. vous déposez le ZIP de vos Gerber (KiCad, Eagle, Altium, EasyEDA…) ;
2. vous voyez le pochoir en 3D et ajustez les paramètres si besoin (épaisseur, épaulements, buse) ;
3. vous téléchargez un STL ou un 3MF, et vous l'imprimez.

C'est gratuit, sans compte, sans pub. Et ça marche aussi pour les anciennes cartes : vous pouvez faire
un pochoir après coup, sans rien recommander.

## Je l'ai testé

Je l'ai intégré à mon workflow de fabrication, et j'ai fait une vidéo de mes premières impressions.

<iframe src="https://www.youtube-nocookie.com/embed/M8u--M0dwfc" title="Stenchill : pochoir PCB imprimé en 3D" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>

[Voir la vidéo sur YouTube](https://www.youtube.com/watch?v=M8u--M0dwfc)

## Ce qui a été ajouté depuis

Depuis cette vidéo, le projet a bien avancé. Les nouveautés principales :

- **Retirer des pads.** Un composant que vous ne montez pas, un connecteur soudé au fer, un fiducial ?
  Ouvrez « Retirer des pads » sous la vue 3D, sélectionnez-les, et le pochoir est recalculé autour.
- **Plugin KiCad.** Il s'installe depuis le Gestionnaire de Plugin et de Contenu (KiCad 8 ou plus). On
  génère le pochoir directement depuis le PCB Editor, sans exporter les Gerber à la main.
  [Page du plugin](https://www.stenchill.com/fr/kicad-plugin).
- **Extension EasyEDA Pro.** Même chose pour EasyEDA Pro (client de bureau), depuis l'Extension Manager.
  [Page de l'extension](https://www.stenchill.com/fr/easyeda-extension).
- **Une galerie.** Les derniers pochoirs générés par les utilisateurs, plus de 300 à ce jour.
  [Voir la galerie](https://www.stenchill.com/fr/galerie).
- **Le site en 17 langues.**

## Le moteur, la partie invisible

Un pochoir, ce n'est pas une simple extrusion du calque de pâte. La page
[Le moteur](https://www.stenchill.com/fr/comment-ca-marche) détaille tous les pièges traités
automatiquement. Quelques exemples :

- des pads à pas fin séparés par 0,1 mm de plaque, qu'une buse de 0,4 mm ne sait pas imprimer : ils
  sont fusionnés en une seule ouverture qui porte la même quantité de pâte ;
- les pastilles thermiques découpées en damier, remplacées par une ouverture unique ;
- les petits pads (0402) légèrement élargis pour compenser la buse ;
- les îlots détachés (une couronne de pâte autour d'un via) retenus par de petits ponts, pour que le
  pochoir sorte d'un seul morceau ;
- la face arrière mise en miroir automatiquement ;
- les panels : une plaque par carte, chacune avec ses épaulements de calage ;
- pas de calque de pâte dans l'export ? Les ouvertures sont déduites du masque de soudure, avec un
  avertissement.

Chaque modification du moteur est rejouée sur 70 cartes réelles. C'est ce genre de travail qui fait
qu'on dépose son fichier et que ça marche.

## Quelques conseils d'impression

Ceux du site, que je confirme :

- PLA ou PETG, sur un plateau lisse (verre, PEI lisse) ;
- buse de 0,2 mm idéalement, 0,4 mm reste acceptable ;
- couches de 0,1 mm, pochoir de 0,3 à 0,4 mm d'épaisseur ;
- remplissage 100 %, générateur de parois Arachne, 30 à 40 mm/s.

Côté composants, c'est fait pour le prototypage : passifs 0603 et plus, circuits intégrés à pas large.
Pour du 0402 ou du BGA à pas fin, un pochoir découpé au laser reste plus adapté.

## Soutenir le projet

Derrière Stenchill, il n'y a qu'une seule personne. Elle développe le générateur, le site, le plugin
KiCad et l'extension EasyEDA le soir et le week-end, et répond elle-même au support. Le site est
gratuit, mais le serveur ne l'est pas. C'est expliqué dans
[The other side of the upload button](https://www.stenchill.com/en/blog/the-other-side-of-the-upload-button) :
des pochoirs sont générés tous les jours, mais très peu de dons arrivent.

Si l'outil vous a servi, vous pouvez :

- faire un petit don, de préférence par PayPal (sans frais) ou sur Ko-fi, via les liens en bas du
  [site](https://www.stenchill.com/fr/) ;
- créer votre compte JLCPCB via la bannière du site si vous y commandez vos cartes ;
- en parler autour de vous.

Merci pour le travail, et pour avoir transformé une discussion de live en vrai outil.

- Le site : [stenchill.com](https://www.stenchill.com/fr/)
- Le guide complet : [stenchill.com/fr/guide](https://www.stenchill.com/fr/guide)
- Le studio : [A·D·C studio](https://www.adcstudio.fr)
- Instagram : [@stenchill.adc](https://www.instagram.com/stenchill.adc/)
