---
title: "Prise des trois cartons avec trois ventouses"
date: 2026-10-27 13:30
project: cdr-2027
description: "Un bras d'essai à trois ventouses sur support souple, pour prendre les trois cartons d'un coup. Les deux du bas tiennent, mais celui du haut glisse : il faut le maintenir pendant la prise."
image: "/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-assemblage.jpg"
session: ""
state: "à poursuivre"
next_step: "Ajouter un petit élément qui appuie sur le dessus du carton du haut pendant la prise."
---

## Objectif

Après [les essais de ce matin]({{ '/logs/cdr-2027/2026-10-27-ventouses-support-souple/' | relative_url }}) avec une seule ventouse, je passe à trois ventouses montées sur un même bras. Le but est de prendre les trois cartons en même temps.

## Conception

Le bras n'est pas optimisé : il sert seulement à positionner trois ventouses pour prendre les trois cartons.

Les trois ventouses ne sont pas alignées : celle du milieu est décalée. J'avais expliqué ce principe dans la [simulation de la prise des cartons]({{ '/logs/cdr-2027/2026-10-06-simulation-ventouse-cartons/' | relative_url }}). Quand on prend un seul carton à l'horizontale avec trois ventouses alignées, il a tendance à basculer. Avec une prise en triangle, on limite ce basculement.

![Modèle FreeCAD du bras : trois emplacements de ventouse, celui du milieu décalé]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-modele-bras.jpg' | relative_url }})
*Le bras dans FreeCAD, avec la pièce souple en place sur l'emplacement du milieu.*

![Tranchage du bras dans Bambu Studio]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-tranchage-bras.jpg' | relative_url }})
*Le bras dans le trancheur : 62 g de PLA et un peu moins de 2 h d'impression.*

## Impression

Cet après-midi, j'ai imprimé toutes les pièces. J'ai d'abord imprimé les supports souples en TPU, avec des branches de 1 mm d'épaisseur, comme je l'avais retenu ce matin.

![Deux supports souples en TPU orange sur le plateau de l'imprimante]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-impression-tpu.jpg' | relative_url }})
*Les supports souples en TPU, avec des branches de 1 mm.*

J'ai ensuite imprimé les couronnes, qui servent d'appui autour de chaque ventouse pendant la prise.

![Deux couronnes noires sur le plateau de l'imprimante]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-impression-cylindres.jpg' | relative_url }})
*Les couronnes qui servent d'appui.*

![Le bras en PLA bleu sur le plateau de l'imprimante]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-impression-bras.jpg' | relative_url }})
*Le bras, une fois imprimé.*

## Montage

J'ai soudé les fils des trois pompes 12 V, une par ventouse, puis j'ai tout assemblé.

![Trois pompes à vide 12 V avec leurs fils soudés]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-pompes.jpg' | relative_url }})
*Les trois pompes, une par ventouse.*

![Le bras assemblé avec ses trois ventouses et leurs tuyaux]({{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-assemblage.jpg' | relative_url }})
*Le bras assemblé, avec les trois ventouses.*

## Prise des trois cartons empilés

Prendre les trois cartons en même temps pose un vrai problème : ils sont tellement légers qu'ils bougent au contact. En général, j'arrive à prendre les deux du bas, mais pas celui du haut.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-prise-verticale.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Prise des trois cartons empilés : celui du haut ne suit pas.*

Si j'appuie légèrement sur le dessus, aucun souci : les trois cartons sont bien pris. Mais le résultat reste très aléatoire. Ce n'est pas assez fiable pour la coupe, et c'est loin d'un système robuste.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-prise-verticale-appui.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*La même prise, avec une légère pression de la main sur le carton du haut.*

## Prise à l'horizontale

J'ai aussi essayé de prendre un carton à l'horizontale, et je fais le même constat. Le carton du dessus n'a rien qui pèse sur lui : il est trop léger et il glisse. Il faut appuyer un tout petit peu dessus pour le maintenir le temps de la prise.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-prise-horizontale.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Prise à l'horizontale, premier essai.*

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-10-27-prise-trois-ventouses/tp-prise-horizontale-2.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Prise à l'horizontale, second essai.*

## Conclusion

Il faut absolument maintenir le carton du haut pendant la prise. Cela limite les possibilités, à cause de la place disponible au-dessus des cartons.

En théorie, les trois cartons empilés font 33 cm de haut, ce qui laisse 2 cm pour placer un actionneur. Ce n'est pas impossible, mais ce n'est pas beaucoup. En réalité, les cartons sont gondolés et leurs faces ne sont pas bien planes, donc la pile fait plutôt 34 cm. Il ne reste alors qu'1 cm pour l'actionneur. Ça reste possible, mais c'est très juste pour une prise.

C'est encore en réflexion. Le prochain essai se fera avec un petit élément sur le dessus, pour voir si on peut prendre les cartons en appuyant sur le carton du haut.

## Suite

- [ ] Ajouter un petit élément qui appuie sur le dessus du carton du haut pendant la prise
- [ ] Voir comment loger un actionneur dans le centimètre restant au-dessus de la pile
