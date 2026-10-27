---
title: "Ventouse sur support souple en TPU"
date: 2026-10-27 10:00
project: cdr-2027
description: "Prototype de ventouse montée sur une pièce souple en TPU 95A, pour mieux épouser les cartons. Ça marche sur les deux premiers, mais le carton du haut n'est maintenu qu'avec un léger poids posé dessus."
image: "/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-assemblage.jpg"
session: ""
state: "à poursuivre"
next_step: "Monter trois ventouses sur une plaque complète pour prendre les trois cartons en même temps."
---

## Objectif

Suite à mes précédents essais de ventouses, j'ai réalisé un prototype avec une pièce souple imprimée en TPU. L'idée est de donner plus de liberté de mouvement à la ventouse, pour qu'en théorie elle s'adapte mieux à des surfaces qui ne sont pas parfaitement droites.

Au final, le but est de prendre les trois cartons en même temps. Pour l'instant, le prototype ne compte qu'une seule ventouse.

## Conception

J'ai modélisé l'ensemble dans FreeCAD. La pièce souple (en vert) est un disque avec des branches en spirale, qui tient la ventouse en son centre et lui laisse du jeu dans toutes les directions.

![Modèle FreeCAD vu de dessus : la couronne, la pièce souple et le raccord de la ventouse]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-modele-dessus.jpg' | relative_url }})
*Le modèle dans FreeCAD, vu de dessus.*

![Modèle FreeCAD vu de dessous : les branches en spirale de la pièce souple]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-modele-dessous.jpg' | relative_url }})
*Vu de dessous, les branches en spirale de la pièce souple.*

## La pièce en TPU

J'ai imprimé la pièce souple en TPU 95A. Ce n'est pas le TPU le plus souple, loin de là, mais ça suffit pour faire quelques tests.

![Impression de la pièce souple en TPU orange]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-impression-tpu.jpg' | relative_url }})
*La pièce souple en cours d'impression.*

J'ai essayé des branches de 3 mm, puis 2 mm, puis 1 mm d'épaisseur. Au-dessus de 1 mm, le résultat n'est clairement pas satisfaisant. Je garde donc 1 mm comme épaisseur maximale, et c'est ce que je vais tester par la suite.

![La ventouse montée sur la pièce en TPU]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-ventouse-tpu.jpg' | relative_url }})
*La ventouse montée sur la pièce en TPU.*

![La ventouse inclinée, la pièce en TPU se déforme]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-ventouse-tpu-inclinee.jpg' | relative_url }})
*La ventouse peut s'incliner : la pièce en TPU se déforme.*

## La couronne

J'ai aussi imprimé une couronne en PLA classique. Elle maintient la pièce en TPU et sert surtout d'appui autour de la ventouse : une fois le carton attrapé, elle le plaque contre la couronne.

![Tranchage de la couronne et de sa bague de maintien]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-tranchage-couronne.jpg' | relative_url }})
*La couronne et sa bague de maintien, dans le trancheur.*

![La couronne imprimée en PLA, avec ses inserts]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-couronne-inserts.jpg' | relative_url }})
*La couronne, avec ses inserts.*

Il faudrait améliorer l'espace entre la ventouse et la couronne, et augmenter un tout petit peu la hauteur de la pièce : on le voit sur les vidéos plus bas. Mais je suis quand même satisfait du résultat.

## Le montage

J'ai tout assemblé et mis les inserts. On voit que l'ensemble est assez souple.

![L'ensemble assemblé : couronne, pièce en TPU et ventouse]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-assemblage.jpg' | relative_url }})
*L'ensemble assemblé.*

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-souplesse.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*La souplesse de la pièce en TPU.*

Je l'ai branché sur une pompe 12 V. Les années précédentes, j'utilisais des pompes 3,7 V que je suralimentais en 5 V. Cette année, je passe sur des pompes 12 V branchées directement sur la batterie, ce qui économise quelques composants. Pour ces essais, j'utilise une alimentation stabilisée.

![La pompe à vide 12 V]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-pompe-12v.jpg' | relative_url }})
*La pompe 12 V.*

![La pompe reliée à la ventouse par un tuyau]({{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-montage-pompe.jpg' | relative_url }})
*Le banc d'essai : la pompe et la ventouse.*

## Essais sur les trois cartons

J'ai d'abord testé sur le carton du bas : rien de surprenant, ça fonctionne bien. Le carton du milieu fonctionne bien aussi.

Sur le carton du haut, en revanche, ça ne fonctionne plus. Si la prise n'est pas parfaitement parallèle, le carton bouge, et la pompe n'a pas assez de puissance pour l'attraper et le maintenir. Une ventouse qui s'adapte, c'est mieux, mais ce n'est malheureusement pas encore suffisant.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-essais-cartons.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Essais sur le carton du bas, celui du milieu, puis celui du haut.*

Ces tests ne sont pas très répétables : je tiens la ventouse à la main. Il faudrait monter l'ensemble, et c'est ce que je vais bientôt faire.

## Avec un poids sur le carton du haut

J'ai ensuite réessayé sur le carton du haut, mais en posant une petite brosse dessus. Il faut imaginer un servomoteur qui viendrait poser la brosse sur le carton, sans exercer beaucoup de pression. Et là, ça fonctionne beaucoup mieux.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-essai-brosse.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Le carton du haut, avec une brosse posée dessus.*

Pour vérifier que ce n'était pas moi qui appuyais trop, j'ai refait l'essai en posant seulement un roulement 608ZZ sur le carton. Ce n'est pas très lourd, ça ne rajoute que quelques grammes, mais c'est ce qui permet de maintenir le carton du haut et de le prendre plus facilement.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-ventouses-support-souple/vs-essai-roulement.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Le carton du haut, avec seulement un roulement 608ZZ posé dessus.*

## Conclusion

Ce n'est qu'un début d'expérimentation, mais ça donne déjà quelques orientations pour la suite du design :

- des branches en TPU de 1 mm d'épaisseur au maximum ;
- une couronne un peu plus haute, avec un meilleur espace autour de la ventouse ;
- un système qui applique une légère force sur le carton du haut pour le maintenir pendant la prise.

**Nota :** il manque encore l'essai où l'on attrape les trois cartons en même temps, avec l'ensemble monté et aligné sur le robot. C'est seulement là qu'on saura si c'est une solution intéressante et durable.

## Suite

- [ ] Monter trois ventouses sur une plaque complète pour prendre les trois cartons en même temps
- [ ] Augmenter la hauteur de la couronne et revoir l'espace autour de la ventouse
- [ ] Ajouter un système qui applique une légère force sur le carton du haut
