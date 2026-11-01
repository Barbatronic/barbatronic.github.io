---
published: false
title: "La pince à doigts souples"
project: cdr-2024
date: 2024-04-14
order: 2
description: "Simulateur 3D de la pince du Jardinier : doigts en TPU tirés par câble, bras de levage en parallélogramme."
---

Chaque face du Jardinier porte une pince à deux doigts souples. Un doigt est une seule pièce imprimée en FilaFlex 70A, un TPU très souple, avec 5 encoches en V. Un câble passe dans un canal, côté intérieur. Le servo tire le câble : les encoches se ferment et le doigt se courbe. Le servo relâche : le TPU se redresse seul.

La pince est portée par un bras en parallélogramme qui la descend au niveau des pots et la remonte. Le simulateur reprend les pièces du CAO et rejoue la prise de deux pots, du sol au transport. Laissé seul, il fait la visite. Un clic donne la main : vues, TPU transparent pour voir le câble, trajectoire du bout du doigt, frise pour se placer à un instant précis.

{% include embed-html.html src="/assets/img/projets/cdr-2024/pince-doigts-souples/simulateur.html" title="Simulateur de la pince à doigts souples" caption="Simulateur interactif : levage, enroulement, contacts, câble en direct, 5 vues." height="760px" %}

Le prototype en vrai, en janvier 2024 :

<video class="is-portrait" controls muted loop playsinline preload="metadata" poster="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/prototype-apercu.jpg' | relative_url }}">
  <source src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/prototype.webm' | relative_url }}" type="video/webm">
  <source src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/prototype.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>

*L'actionneur souple, vidéo aussi [sur YouTube](https://www.youtube.com/shorts/xEiXw7aZnqQ).*

## Comment ça marche

- **Une charnière par encoche.** Sous chaque encoche, il reste 2 mm de TPU : c'est la charnière. Le doigt est fait de 6 segments reliés par 5 charnières souples, sans axe ni pièce rapportée.
- **Le câble ferme les encoches.** Il passe à 9,7 mm au-dessus des charnières. Tirer le câble de 1 mm ferme les encoches d'un total de 5,9°. Dans la prise simulée, le doigt avale 21,5 mm de câble, soit 88° de poulie.
- **Le câble est guidé.** Le servo de câble est plus haut dans le robot. Un tube PTFE de 1 × 3 mm descend à la verticale de chaque côté du nez, puis un roulement V623ZZ renvoie le câble à l'horizontale, dans le doigt. Le tube suit la pince quand elle monte et descend.
- **Les charnières se partagent le mouvement.** Le même câble traverse 5 charnières identiques : tant que rien ne bloque, elles se ferment ensemble, du même angle.
- **Le doigt ramène le pot vers le centre.** Le pot est posé devant le doigt. En se fermant, le bout du doigt l'accroche et le pousse vers le nez de la pince, jusqu'à ce qu'il y bute.
- **Puis il le serre contre le nez.** Le pot ne peut plus reculer : quand un segment le touche, les charnières en amont s'arrêtent, celles du bout finissent de se fermer. Le pot est pris entre le doigt et le nez, sans commande supplémentaire. Un seul servo suffit pour deux doigts.
- **Le doigt se rouvre seul.** Aucun câble de rappel : l'élasticité du TPU le redresse dès que le servo relâche le câble.

## Le levage

La pince n'est pas fixée au robot : elle est au bout de deux bras parallèles de 78 mm. Le bras du haut est entraîné par un servo, celui du bas suit. Les pivots sont espacés de 43,5 mm côté robot comme côté pince : les quatre pivots forment un parallélogramme.

- **La pince reste verticale.** Un parallélogramme garde ses côtés opposés parallèles : quel que soit l'angle des bras, la pince ne bascule pas et les pots restent droits.
- **Elle monte et descend sur un arc.** Le bout des bras décrit un cercle de 78 mm de rayon. En descendant, la pince se rapproche aussi du robot ; en remontant, elle s'en écarte.
- **Une seule commande.** Le servo de levage ne fait que tourner le bras du haut ; l'arc et la verticale de la pince viennent de la géométrie.

Dans le CAO, les bras sont à 12,7° sous l'horizontale : c'est la pose haute du simulateur, doigts à 87 mm du sol. La pose basse est supposée à 80°, bras presque verticaux : doigts à 27 mm du sol, dans le haut du pot, pince reculée de 63 mm. Entre les deux, le pot est levé de 60 mm.

## Ce que montre le modèle

- **La matière compte plus que le dessin.** Si les flancs du V étaient rigides, chaque encoche s'arrêterait à 17,6° et le doigt à 88°. La vidéo montre un doigt qui s'enroule bien plus : en 70A, les flancs s'écrasent. La butée retenue est la fermeture du haut de l'encoche, 29,2°, soit 146° pour le doigt.
- **Le contact décide de la forme.** Dans la prise simulée, le doigt pousse le pot sur 44 mm vers le nez. Calé contre le nez, le pot arrête le doigt sur les segments 2 et 3 : les charnières 1 et 2 restent à 22°, la 3 va à 24°, les 4 et 5 se ferment à fond.
- **La course de câble est courte.** 21,5 mm de câble, 88° de poulie, suffisent à ramener le pot et à le serrer.

Le modèle ne calcule aucun effort : sans mesure sur la pince réelle, une valeur de serrage ou de tenue ne serait pas fiable.

## Retour d'expérience

<div class="callout" markdown="1">
<p class="callout-title">En travaux</p>

Cette partie reste à écrire : la pince en match et aux essais, ce qui a marché, ce qui a cassé, ce qui a été modifié.
</div>

Ce que dit déjà le récit de la Coupe de Belgique 2024 sur [leskaribous.fr](https://leskaribous.fr/posts/belgique-2024/) :

- **Les pots en fer suivent le robot.** Le robot principal « a tendance à emmener les pots en fer avec lui ».
- **Un pot coincé gêne le calage.** En match, un pot en fer est venu se coincer dans le robot et a gêné son calage.

À compléter : [TENUE DES DOIGTS EN TPU SUR LA SAISON], [CÂBLES ET TUBES : USURE, RÉGLAGE], [ANGLES RÉELS DU SERVO DE LEVAGE], [PLANTES ET POTS PERDUS EN MATCH].

## Hypothèses

Aucune mesure n'a été faite sur la pince. Les cotes et la 3D viennent des fichiers `finger-filaflex.FCStd` et `robots_2024.FCStd` du dépôt [Karibous-2024-Hardware](https://github.com/LesKaribous/Karibous-2024-Hardware), exportés avec FreeCAD : pince, roulements, tubes, bras, berceau et servo de levage. Dans le CAO, les doigts sont modélisés fermés ; le simulateur les recalcule pour les plier. La matière et le guidage du câble viennent de la vidéo du prototype. Le reste est supposé :

- les 5 charnières sont identiques : libres, elles se ferment du même angle ;
- le pot glisse au sol sans résister jusqu'au nez ; ensuite, un segment qui le touche bloque les charnières en amont ;
- la pose du CAO est la pose haute ; la pose basse, à 80°, est supposée : les vraies butées du servo de levage ne sont pas connues ;
- un pot de ø46 à hauteur des doigts, un par doigt. La consigne du câble est ralentie à 22 °/s pour la lecture.

## En photos

Les premiers doigts, en orange, sont des prototypes : le dernier s'enroule presque en cercle. Les doigts noirs sont ceux du robot de match.

<div class="gallery">
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-01.jpg' | relative_url }}" alt="Quatre doigts imprimés en TPU orange" loading="lazy"><figcaption>Doigts imprimés, prototypes</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-02.jpg' | relative_url }}" alt="Doigt orange monté sur son servo" loading="lazy"><figcaption>Doigt monté sur son servo</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-03.jpg' | relative_url }}" alt="Doigt orange en cours de fermeture" loading="lazy"><figcaption>Le doigt se ferme</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-04.jpg' | relative_url }}" alt="Doigt orange enroulé presque en cercle" loading="lazy"><figcaption>Enroulé presque en cercle</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-05.jpg' | relative_url }}" alt="Doigt orange autour d'un pot de plante" loading="lazy"><figcaption>Premier essai sur un pot</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-06.jpg' | relative_url }}" alt="Pièces des actionneurs avant montage" loading="lazy"><figcaption>Les actionneurs avant montage</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-07.jpg' | relative_url }}" alt="Servos et poulies dans une colonne du robot" loading="lazy"><figcaption>Servos et poulies dans la colonne</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-08.jpg' | relative_url }}" alt="Pince noire au pied du robot, tubes PTFE blancs" loading="lazy"><figcaption>La pince sur le robot</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-09.jpg' | relative_url }}" alt="Doigt noir autour d'un pot" loading="lazy"><figcaption>Un pot saisi</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-10.jpg' | relative_url }}" alt="Le Jardinier portant quatre pots à la Coupe de Belgique" loading="lazy"><figcaption>Coupe de Belgique 2024</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/pince-doigts-souples/photo-11.jpg' | relative_url }}" alt="Le Jardinier portant des plantes à la Coupe de France" loading="lazy"><figcaption>Coupe de France 2024</figcaption></figure>
</div>

Photos de l'[album de préparation](https://photos.app.goo.gl/pAHjJQ31H2oJCa348) et des galeries des Karibous : [Coupe de Belgique](https://leskaribous.fr/galleries/belgique-2024/), [Coupe de France](https://leskaribous.fr/galleries/cdr-2024/).

## Fabrication de la page

La page est construite avec [teardown](https://github.com/elvarofficial/teardown) (MIT). Un seul fichier de calcul donne les cotes et l'état de la pince en fonction du temps de la séquence. La 3D, les panneaux et la coupe du doigt lisent ce même fichier. Sources dans le dépôt du site, dossier `_sims/pince-doigts-souples/`.
