---
published: false
title: "La base holonome"
project: cdr-2024
date: 2024-05-06
order: 1
description: "Simulateur 3D de la base du Jardinier : trois roues omnidirectionnelles à 120°, cinématique de chaque roue."
---

Le Jardinier se déplace sur trois roues omnidirectionnelles placées à 120°. Chaque roue est motorisée et ne pousse que dans une direction : celle de sa jante. Sur son pourtour, des galets libres roulent dans l'autre direction, le long de l'axe. En dosant la vitesse des trois roues, le robot avance, glisse de côté ou tourne sur place, et peut faire tout cela à la fois.

Le simulateur reprend les cotes du CAO et joue une boucle : avance, crabe, rotation sur place, puis translation en tournant, avec retour au point de départ. Laissé seul, il fait la visite. Un clic donne la main : vues, carters transparents, vecteurs de vitesse, trajectoire, frise pour se placer à un instant précis.

{% include embed-html.html src="/assets/img/projets/cdr-2024/base-holonome/simulateur.html" title="Simulateur de la base holonome" caption="Simulateur interactif : vitesse de chaque roue et de chaque moteur, en direct, 5 vues." height="760px" %}

## Comment ça marche

- **Une roue, une direction.** La roue motrice pousse le long de sa jante. Ses galets, libres, la laissent glisser le long de son axe sans frotter. Une roue omnidirectionnelle ne contraint donc qu'une composante de la vitesse.
- **Trois roues, trois équations.** Pour une roue placée à l'angle α, la vitesse de jante vaut v = −sin α·vx + cos α·vy + L·ω, avec L = 82 mm du centre aux galets qui touchent le sol. Trois roues donnent trois équations pour trois inconnues : vx, vy et ω. Toute combinaison est possible.
- **Avancer vers une roue l'arrête.** Le robot avance vers la colonne 1 : sa roue ne tourne pas, seuls ses galets roulent. Les deux autres roues tournent en sens opposés, chacune à 0,87 fois la vitesse du robot.
- **En crabe, une roue travaille double.** Le robot glisse à droite : la roue 1 tourne à la vitesse du robot, les deux autres à la moitié.
- **En rotation, aucun galet ne roule.** Les trois roues tournent à la même vitesse, L·ω, dans le même sens.
- **Translation et rotation s'additionnent.** Le robot peut filer en ligne droite sur la table en tournant sur lui-même. Dans son propre repère, la direction du mouvement tourne en continu : la vitesse de chaque roue varie sans cesse.

## La transmission

Chaque roue est entraînée par un moteur pas à pas NEMA 23 (23HS16-0884S, 1,8° par pas), piloté par un driver MKS SERVO57B monté à son dos. Une courroie T5 relie une poulie de 14 dents sur le moteur à une poulie de 28 dents sur la roue : le moteur fait 2 tours par tour de roue. Une roue de ø60 mm avance de 94,2 mm par tour de moteur, soit 0,47 mm par pas complet.

La roue est faite de trois disques de 5 galets, décalés de 24°. Un galet est toujours en contact avec le sol, ce qui évite les à-coups d'une roue à un seul rang.

## Retour d'expérience

<div class="callout" markdown="1">
<p class="callout-title">En travaux</p>

Cette partie reste à écrire : ce que la base a donné en match et aux essais, ce qui a été changé pour 2025.
</div>

Ce que disent déjà les récits des coupes 2024 sur leskaribous.fr :

- **Un robot fiable mais lent.** Le robot et la stratégie étaient assez fiables pour finir 9e au général de la Coupe de France, malgré une vitesse faible ([récit de la Coupe de France](https://leskaribous.fr/posts/coupe-de-robotique-2024/)).
- **Un décalage de position connu.** Un décalage, déjà vu aux essais, a fait manquer 2 plantes au premier match de la Coupe de Belgique ([récit de la Coupe de Belgique](https://leskaribous.fr/posts/belgique-2024/)).
- **Une base en fin de vie.** Après trois saisons, la base avait « besoin d'un coup de neuf » : elle a été remise à plat pour 2025.

À compléter : [VITESSE ET ACCÉLÉRATION RÉGLÉES EN MATCH], [ORIGINE DU DÉCALAGE DE POSITION], [USURE DES GALETS ET DES COURROIES], [CE QUI A CHANGÉ EN 2025].

## Hypothèses

Les cotes et la 3D viennent des fichiers `robot_holonome.FCStd`, `colonne-moteur.FCStd`, `omniwheel.FCStd` et `generic-hardware.FCStd` du dépôt [Karibous-2024-Hardware](https://github.com/LesKaribous/Karibous-2024-Hardware), exportés avec FreeCAD. Le reste est supposé :

- la consigne de la boucle est un exemple : 300 mm/s et 90 °/s au plus. Ce ne sont pas les réglages du match ;
- la fréquence de pas affichée suppose 16 micro-pas ;
- les roues roulent sans glisser ;
- la 3D reprend les pièces du CAO aux couleurs du robot réel ; la visserie, les câbles, les carters latéraux et la batterie sont omis, et les profilés MakerBeam sont redessinés en barres pleines.

Le simulateur ne calcule aucun effort ni couple.

## En photos

La base est née en 2022, sur des roues omnidirectionnelles du commerce. Elle a été reprise en 2023 puis en 2024, avec des roues imprimées à trois disques de galets.

<div class="gallery">
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2022-roues-commerce.jpg' | relative_url }}" alt="Roues omnidirectionnelles en aluminium et poulies, en vrac sur l'établi" loading="lazy"><figcaption>2022 : roues du commerce et poulies</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2022-module-moteur.jpg' | relative_url }}" alt="Premier module moteur monté sur profilés, avec sa roue" loading="lazy"><figcaption>2022 : premier module moteur</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2022-driver.jpg' | relative_url }}" alt="Driver MKS Servo57 monté au dos d'un moteur pas à pas" loading="lazy"><figcaption>2022 : driver en boucle fermée</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2022-trois-modules.jpg' | relative_url }}" alt="Trois modules moteur côte à côte" loading="lazy"><figcaption>2022 : les trois modules</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2022-premiere-colonne.jpg' | relative_url }}" alt="Première colonne du robot montée sur l'établi" loading="lazy"><figcaption>2022 : première colonne</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2024-base-montage.jpg' | relative_url }}" alt="Base triangulaire 2024 en cours de montage" loading="lazy"><figcaption>2024 : la base en montage</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/cdr-2024/base-holonome/2024-cao-perimetres.jpg' | relative_url }}" alt="Capture du CAO de la base 2024 avec ses périmètres" loading="lazy"><figcaption>2024 : périmètres dans le CAO</figcaption></figure>
</div>

Photos des albums de préparation [2022](https://photos.app.goo.gl/jg3NgF4W8UGjeSXU9) et [2024](https://photos.app.goo.gl/pAHjJQ31H2oJCa348).

## À propos du simulateur

La page est construite avec [teardown](https://github.com/elvarofficial/teardown) (MIT). Un seul fichier de calcul donne les cotes et l'état de la base en fonction du temps de la boucle. La 3D, les panneaux et la vue de dessus lisent ce même fichier. Sources dans le dépôt du site, dossier `_sims/base-holonome/`.
