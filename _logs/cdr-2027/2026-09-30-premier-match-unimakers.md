---
title: "Première séquence de match sur une table complète"
date: 2026-09-30
project: cdr-2027
description: "Test rapide d'un premier scénario de match sur la table complète d'UniMakers (UniLaSalle Amiens) : le système fonctionne, reste à optimiser l'actionneur, l'angle de tir et les trajectoires."
session: ""
state: "à optimiser"
next_step: "Changer de type d'actionneur pour les pierres, baisser le canon, accélérer les trajectoires."
---

## Objectif

Log rapide. Je suis allé tester une première séquence de match dans les locaux d'UniMakers, l'association
de makers d'UniLaSalle Amiens, qui dispose d'une table de match complète.

Le but était simple : enchaîner un petit match très rapidement, avec un actionneur très simple pour les
pierres, puis lancer les boulets avec le canon.

## La séquence

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ '/assets/img/projets/cdr-2027/2026-09-30-premier-match-unimakers/pm-sequence-match.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*Première séquence de match sur la table d'UniMakers.*

## Ce qui ressort

Globalement, le système fonctionne bien. On est maintenant sur de l'optimisation.

- **Actionneur des pierres** : j'aurais voulu l'optimiser, mais les quelques essais faits ne donnent pas
  de résultat pour manipuler les blocs. Il va probablement falloir changer de type d'actionneur.
- **Angle de tir** : même après quelques réglages, les boulets partent au centre du terrain, ce qui n'est
  pas idéal. Il faut sans doute baisser le canon.
- **Trajectoires** : il y a beaucoup d'attente, et des décélérations très douces à l'approche des points
  d'arrivée. Il faudra les rendre plus nerveuses.

## Suite

- [ ] Changer de type d'actionneur pour manipuler les pierres
- [ ] Baisser le canon pour corriger l'angle de tir
- [ ] Optimiser les trajectoires : moins d'attente, décélération plus courte
