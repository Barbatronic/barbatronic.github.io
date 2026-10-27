---
title: "Un doigt de maintien pour prendre les trois cartons"
date: 2026-10-27 19:30
project: cdr-2027
description: "Un doigt souple en TPU, posé sur le carton du haut pendant l'approche, le maintient de façon passive. La prise des trois cartons devient beaucoup plus fiable."
image: "/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-doigt-monte.jpg"
session: ""
state: "validé à la main"
next_step: "Motoriser le bras sur un rail prismatique, puis le monter sur le robot pour un essai complet."
---

## Objectif

[Les essais de ce midi]({{ '/logs/cdr-2027/2026-10-27-prise-trois-ventouses/' | relative_url }}) l'ont montré : aligner les trois ventouses sur leurs supports souples orange ne suffit pas. Le carton du haut glisse, et il faut le maintenir pendant la prise.

J'ai donc modifié un peu le prototype, avec deux changements :

- rigidifier un tout petit peu plus les ventouses ;
- ajouter un doigt qui maintient le carton du haut.

## Démontage et remontage des ventouses

Pour cette étape, ma fille est venue me donner un coup de main pour démonter et remonter le prototype.

![Démontage du bras à la visseuse]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-demontage.jpg' | relative_url }})
*Le démontage du bras.*

![Le bras démonté, avec une couronne, un support souple et le support du doigt]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-pieces.jpg' | relative_url }})
*Les pièces démontées.*

![Remontage d'une couronne sur le bras]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-remontage.jpg' | relative_url }})
*Le remontage, couronne par couronne.*

## L'idée du doigt

En regardant les essais de ce midi avec ma fille, on a vu que tout marchait dès que j'appuyais du doigt sur le carton du haut. Elle m'a proposé : si ça marche avec un doigt, pourquoi pas un doigt robotique ? Elle a de bonnes idées, alors on a fait exactement ce qu'elle proposait.

![Modèle FreeCAD du bras avec le doigt de maintien au bout]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-modele.jpg' | relative_url }})
*Le bras dans FreeCAD, avec le doigt de maintien au bout.*

Le doigt est monté sur le dessus du prototype. Il se compose de trois pièces :

- un support en PLA, fixé au bout du bras ;
- un doigt en plastique souple, en TPU ;
- un patin en PETG à l'avant, imprimé sur plateau lisse pour bien glisser sur le carton.

![Le support du doigt, en PLA noir]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-support-doigt.jpg' | relative_url }})
*Le support du doigt, avec son insert.*

![Le bras remonté, avec le support du doigt au bout]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-bras-remonte.jpg' | relative_url }})
*Le bras remonté, avec le support du doigt au bout.*

![Le doigt en TPU orange sur le plateau de l'imprimante]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-impression-doigt.jpg' | relative_url }})
*Le doigt en TPU, à la sortie de l'imprimante.*

![Le patin en PETG blanc, avec son insert, sur le plateau lisse]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-patin-petg.jpg' | relative_url }})
*Le patin en PETG, imprimé sur plateau lisse.*

![Le doigt monté sur le bras, à côté des ventouses]({{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-doigt-monte.jpg' | relative_url }})
*Le doigt de maintien, monté sur le bras.*

## Le principe

Le bras arrive au-dessus de la pile de cartons. Pendant l'approche, il descend un tout petit peu pour que le doigt vienne en appui sur le carton du haut. L'appui est très léger, pour que le patin puisse glisser dessus. Le bras avance ensuite jusqu'aux cartons, et les ventouses prennent les trois cartons en même temps.

## Les essais

Ça fonctionne vraiment beaucoup mieux : je n'ai quasiment pas eu de soucis avec cette technique. Le doigt maintient l'ensemble de façon passive, sans moteur.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-prise-1.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Prise des trois cartons avec le doigt de maintien, premier essai.*

Pour le second essai, je simule une pile calée contre la bordure de la table : je tiens le carton du bas avec ma main, à la place de la bordure.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-doigt-de-maintien/dm-prise-2.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Second essai : ma main joue le rôle de la bordure.*

## Suite

- [ ] Motoriser le bras sur un rail prismatique
- [ ] Monter l'ensemble sur le robot pour un essai complet
