---
published: true
title: "Manipulateur à fourches : idée abandonnée"
date: 2026-11-26
project: cdr-2027
description: "En septembre, j'ai imaginé et prototypé un manipulateur à servos qui saisit le mur de pierres par les bouts, sans ventouses. Après les essais, je l'abandonne : peu efficace, trop encombrant, glissement aléatoire. Les fichiers restent disponibles pour qui veut reprendre l'idée."
session: ""
state: "abandonné"
---

## L'idée

En septembre, juste après la sortie du [règlement bêta]({{ '/blog/2026/09/reglement-beta-cdr-2027/' | relative_url }}), j'ai cherché comment prendre le mur de 3 pierres (cartons de 320 × 110 × 110 mm empilés à plat) d'un seul coup. Mon idée : ne pas prendre les pierres par le dessus ou par la face, mais **par les bouts**, avec des doigts qui viennent se refermer de chaque côté du mur, comme une fourche. Et surtout, sans ventouses.

## Le principe

Un servo par pierre et par côté. Chaque servo fait tourner un bras avec un doigt au bout. Bras ouverts, le robot avance autour du mur, puis les bras se referment et les doigts serrent les pierres par les bouts.

## Le prototype

J'ai prototypé un premier étage : bras, doigts et supports de servo imprimés en 3D, plaques des bras découpées au laser dans du 5 mm. Les fichiers sont dans le dépôt du robot, sous le nom `box-manipulator` :

- [CAO FreeCAD](https://github.com/Barbatronic/CDR-2027/blob/main/MCAD/actuator-parts/box-manipulator.FCStd)
- [Pièces à imprimer (3MF)](https://github.com/Barbatronic/CDR-2027/tree/main/MCAD/3d-print) : bras, doigt et support de servo
- [Plaques des bras à découper (SVG, 5 mm)](https://github.com/Barbatronic/CDR-2027/blob/main/MCAD/laser-cutting/box-manipulator_laser-cut-5mm.svg)

Vous avez déjà vu ce manipulateur en action, enfin une partie : c'est lui qui est monté sur le robot dans la vidéo du [log du 30/09/2026]({{ '/logs/cdr-2027/2026-09-30-premier-match-unimakers/' | relative_url }}), sur la table d'UniMakers.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-09-30-premier-match-unimakers/pm-sequence-match.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Essai du premier étage sur la table d'UniMakers.*

## Le simulateur

En plus des essais réels, j'ai utilisé Claude pour générer un simulateur de l'actionneur, afin de le tester. En mode bac à sable, j'ai pu tester la faisabilité des mouvements, et obtenir une séquence qui peut même positionner une pierre en tour.

{% include embed-html.html src="/assets/img/projets/cdr-2027/2026-11-26-manipulateur-a-fourches-idee-abandonnee/simulateur.html" title="Simulateur du manipulateur à fourches" caption="Simulateur du manipulateur à fourches." height="820px" %}

## Un actionneur trop aléatoire

Le principe a l'air de fonctionner, et j'aimais bien l'idée de ne pas avoir de ventouses. Mais :

- **Après les essais en vrai, ce n'est pas si efficace.**
- **Ça prend une place folle.** Impossible de mettre ce système des deux côtés du robot.
- **Le glissement est très aléatoire.**

J'ai donc abandonné l'idée, et je suis revenu aux [ventouses]({{ '/logs/cdr-2027/2026-10-04-pompes-ventouses-mosfet/' | relative_url }}).

## Si vous voulez continuer

Les fichiers restent en ligne. Si quelqu'un veut reprendre l'idée, je la donne : CAO du prototype (liens plus haut) et simulateur, en un seul fichier HTML à [ouvrir seul]({{ '/assets/img/projets/cdr-2027/2026-11-26-manipulateur-a-fourches-idee-abandonnee/simulateur.html' | relative_url }}) puis enregistrer depuis le navigateur.

Une seule demande : citez l'équipe, ou tenez-nous au courant de l'avancée de vos tests :)
