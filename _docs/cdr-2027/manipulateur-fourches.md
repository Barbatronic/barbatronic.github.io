---
published: true
title: "Manipulateur à fourches"
project: cdr-2027
date: 2026-11-01
order: 1
description: "Simulateur 3D du manipulateur à 6 servos : approche, serrage et recul avec le mur de 3 pierres."
---

<div class="callout" markdown="1">
<p class="callout-title">Prototype à l'étude</p>

Ce manipulateur n'est pour l'instant qu'une idée pour la CDR 2027. Il n'est ni fabriqué ni testé. Les cotes viennent d'une étude sur papier, et le simulateur sert à vérifier la géométrie et le mouvement, pas à valider la solution.
</div>

Le manipulateur saisit le mur de 3 pierres par les bouts. Il porte six servos, un par rangée et par côté. Chaque servo entraîne un bras de 100 mm terminé par un doigt de ø20 × 150 mm. Bras ouverts, les doigts passent de part et d'autre du mur. En tournant, ils descendent vers l'intérieur et serrent les bouts de la pierre.

Le simulateur rejoue la séquence « saisir le mur » de l'étude. Laissé seul, il fait la visite. Un clic donne la main : vues, trajectoires, pierres transparentes, vue éclatée, frise pour se placer à un instant précis.

{% include embed-html.html src="/assets/img/projets/cdr-2027/manipulateur-fourches/simulateur.html" title="Simulateur du manipulateur à fourches" caption="Simulateur interactif : séquence complète, mesures en direct, 5 vues." height="760px" %}

## Ce qu'il faut regarder

- **Le contact.** À 36,9°, le bord du doigt touche le bout de la pierre. Le servo reçoit une consigne 8° plus loin et cale : c'est ce qui serre.
- **La hauteur du contact.** L'axe du servo est 60 mm au-dessus du centre de la pierre, et le bras de levier au contact vaut aussi 60 mm : le doigt appuie à mi-hauteur de la pierre.
- **Les trois plans de bras.** Les bras sont décalés de 10 mm en profondeur d'une rangée à l'autre. Sans ce décalage, le doigt du servo 2 percute le moyeu du servo 1 en passant à 90°. La vue éclatée l'exagère.

## Hypothèses

Cotes de l'étude du 24/09/2026 : pierres 320 × 110 × 110 mm, axes des servos à 70 mm du bout des pierres. Servo à 75 °/s, consigne 8° au-delà du contact pour caler. Aucun effort n'est calculé : sans mesure sur un prototype, une valeur de serrage ou de tenue ne serait pas fiable. Le châssis du robot est schématique.

## À propos du simulateur

La page est construite avec [teardown](https://github.com/elvarofficial/teardown) (MIT). Un seul fichier de calcul donne les cotes et l'état de la machine en fonction du temps de la séquence. La 3D, les panneaux et la courbe lisent ce même fichier : aucun chiffre affiché ne peut contredire le mouvement. Sources dans le dépôt du site, dossier `_sims/manipulateur-fourches/`.
