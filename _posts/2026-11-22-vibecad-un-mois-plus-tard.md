---
published: true
title: "VibeCAD, un mois plus tard"
date: 2026-11-22
description: "Un mois après sa sortie, VibeCAD a beaucoup changé. Je l'utilise maintenant pour mes propres projets, à commencer par Nimbot, un petit robot compagnon. Tour des nouveautés : esquisse, assemblage, fabrication, versions, import KiCad."
tags: [logiciel, cao, impression-3d, open-source]
project: vibecad
image: "/assets/img/projets/vibecad/2026-11-22-un-mois-plus-tard/nimbot-conception.jpg"
image_caption: "Nimbot en cours de conception dans VibeCAD."
---
{% assign img = '/assets/img/projets/vibecad/2026-11-22-un-mois-plus-tard' %}

Il y a un mois, je publiais [VibeCAD]({% post_url 2026-10-21-vibecad-une-cao-dans-le-navigateur-vibe-codee %}),
avec une idée assez simple au départ, celle de faire un outil pour accompagner ma fille dans ses
premiers pas en conception mécanique, et dans mon esprit, le projet devait à peu près en rester là.

Depuis, on a commencé à l'utiliser ensemble, et je me suis aussi mis à m'en servir pour mes propres
projets, ce qui a fait pas mal bouger les choses en un mois, parce que pour améliorer un logiciel de
CAO et se rendre compte de ce qui manque ou de ce qui coince, le mieux reste encore de faire de vrais
projets avec.

**[Ouvrir VibeCAD](https://barbatronic.fr/VibeCAD/)** · [la fiche projet]({{ '/projets/vibecad/' | relative_url }}) · [le code source](https://github.com/Barbatronic/VibeCAD)

## Nimbot, le projet qui sert de banc d'essai

J'avais depuis longtemps dans les cartons un projet de petit robot compagnon qui me tenait à cœur,
mais que je n'avais jamais vraiment commencé, et je me suis dit que c'était le moment de m'y mettre,
puisqu'avec les servos, les roulements, la visserie et les pièces imprimées, il y avait de quoi tester
VibeCAD en conditions réelles.

Ce petit robot s'appelle **Nimbot**, et j'en parlerai ici en temps et en heure ; pour l'instant, je
passe surtout du temps à le développer, et même si ça avance bien, comme vous allez le voir sur les
quelques captures de cet article, je n'ai pas encore eu le temps de documenter l'ensemble.

![La tête de Nimbot sur son support, dans VibeCAD]({{ img | append: '/nimbot-conception.jpg' | relative_url }})
*Nimbot en cours de conception : la tête, les oreilles et le support, animés par des servos.*

Ce projet m'a permis de tester énormément de choses, avec des allers-retours où, chaque fois que je
butais sur un problème avec Nimbot, je le résolvais dans VibeCAD avant de reprendre là où j'en étais,
et c'est de cette façon que sont arrivées la plupart des nouveautés dont je parle ici.

## Et ma fille, dans tout ça ?

Je me suis aussi rendu compte que ma fille n'avait pas forcément besoin d'une interface simplifiée,
et je lui ai finalement remis l'interface Expert, avec laquelle elle est très contente de travailler.
Ça m'a permis de l'initier à un certain nombre de choses sans que l'interface la gêne, sachant qu'elle
reste quand même plus simple que celle de beaucoup d'autres logiciels.

![Ma fille, de dos, en train de dessiner une pièce de jeu en forme de poisson dans VibeCAD]({{ img | append: '/ma-fille-vibecad.jpg' | relative_url }})
*Ma fille au travail sur VibeCAD : une pièce en forme de poisson pour son jeu de société.*

Elle a commencé par un dé tout simple, puis un dé personnalisé et des petites pièces pour un jeu
de société qu'elle est en train d'imaginer, et comme elle a montré ses impressions 3D à ses copines,
elle s'est aussi mise à leur faire des badges, directement dans VibeCAD.

<div class="gallery">
  <figure><img src="{{ img | append: '/fille-de.jpg' | relative_url }}" alt="Un dé à six faces avec ses points creusés et ses arêtes arrondies" loading="lazy"><figcaption>Son premier dé, tout simple</figcaption></figure>
  <figure><img src="{{ img | append: '/fille-cube-figurines.jpg' | relative_url }}" alt="Un dé décoré de tampons, et deux pièces de jeu en forme de chat et d'oiseau" loading="lazy"><figcaption>Le dé personnalisé et les pièces de son jeu de société</figcaption></figure>
  <figure><img src="{{ img | append: '/fille-pendentif.jpg' | relative_url }}" alt="Un badge rond avec un dessin gravé et un anneau d'attache" loading="lazy"><figcaption>Un badge pour une copine</figcaption></figure>
</div>

De ce côté-là, je suis donc ravi, et pour ce qui est du logiciel lui-même, il y a eu pas mal
d'améliorations dont je vais essayer de faire le tour.

## L'esquisse

Tout commence par l'esquisse, et c'est là que Nimbot m'a fait le plus travailler.

- **Du texte et des tampons** : l'outil Texte crée de vraies lettres que l'on peut utiliser comme
  n'importe quel profil, pour les extruder ou les graver, tandis que l'outil Tampon permet de piocher
  dans une galerie de formes, d'importer un dessin SVG ou DXF à la bonne échelle, ou encore de
  vectoriser une image.
- **Projeter une pièce** permet de reprendre tout le contour d'une face d'un clic, trous compris,
  y compris depuis une autre pièce du projet, avec des arrondis qui reviennent sous forme d'arcs
  plutôt que de cercles complets, et des arêtes projetées qui peuvent servir directement au volume
  ou être détachées de la pièce.
- **De nouveaux outils** sont arrivés, comme l'arc par trois points, la contrainte de symétrie par
  rapport à un point ou un axe, et les splines avec poignées de tangence, auxquels s'ajoutent les
  axes X et Y comme références pour les contraintes, ainsi que les raccourcis E, M et X pour
  l'égalité, le milieu et la symétrie.
- **L'accroche** se fait maintenant aussi sur les milieux et sur les courbes, avec un bouton aimant
  pour la couper.
- On peut aussi **copier-coller une esquisse** d'une pièce à l'autre et **changer son support** à
  tout moment depuis l'historique.

<div class="gallery">
  <figure><img src="{{ img | append: '/esquisse-tampon-etoile.jpg' | relative_url }}" alt="Outil Tampon avec la galerie de formes, une étoile posée sur un disque" loading="lazy"><figcaption>Le Tampon et sa galerie de formes</figcaption></figure>
  <figure><img src="{{ img | append: '/import-dessin.jpg' | relative_url }}" alt="Fenêtre d'import d'un dessin : l'image d'origine et le contour vectorisé" loading="lazy"><figcaption>Une image vectorisée en contour</figcaption></figure>
  <figure><img src="{{ img | append: '/gravure-dessin.jpg' | relative_url }}" alt="Le dessin vectorisé gravé sur un disque en contreplaqué" loading="lazy"><figcaption>Le même dessin, gravé</figcaption></figure>
</div>

![Texte NimBOT V0.1 sur la crête du robot]({{ img | append: '/nimbot-texte.jpg' | relative_url }})
*L'outil Texte sur Nimbot : « NimBOT V0.1 » sur la crête du robot, modifiée au milieu de l'assemblage.*

![Outil Projeter sur l'oreille de Nimbot]({{ img | append: '/projeter-face.jpg' | relative_url }})
*Projeter sur l'oreille : un clic dans une face reprend tout son contour, en violet, et le cercle de Ø 8 mm se cale dessus.*

Pour les pièces achetées, j'ai beaucoup utilisé les [images de référence]({{ '/projets/vibecad/images-reference/' | relative_url }}),
en posant une photo dans l'esquisse et en la mettant à l'échelle avec une règle pour pouvoir dessiner
par-dessus, ce qui m'a notamment permis de modéliser le palonnier métal des servos de Nimbot.

<div class="gallery">
  <figure><img src="{{ img | append: '/palonnier-photo.jpg' | relative_url }}" alt="Palonnier métal photographié à côté d'une règle" loading="lazy"><figcaption>La photo, avec une règle pour l'échelle</figcaption></figure>
  <figure><img src="{{ img | append: '/palonnier-calque.jpg' | relative_url }}" alt="L'esquisse du palonnier dessinée par-dessus la photo" loading="lazy"><figcaption>L'esquisse, dessinée par-dessus</figcaption></figure>
  <figure><img src="{{ img | append: '/palonnier-modele.jpg' | relative_url }}" alt="Le palonnier métal modélisé en 3D" loading="lazy"><figcaption>Le palonnier modélisé</figcaption></figure>
</div>

## Les volumes

- **De nouvelles formes toutes prêtes** : cône, pyramide, prisme et rampe, rangées avec les
  engrenages et les profilés dans un nouveau secteur « Générer » de la barre d'outils.
- Du côté des **profilés et courroies**, le profilé aluminium existe en V-slot, T-slot et MakerBeam
  10 × 10, et les courroies crantées ont maintenant leurs dents, calées sur les gorges de la poulie.
- **Répéter ou symétriser plusieurs étapes d'un coup**, au lieu d'une seule ou de toute la pièce.
- **Des chanfreins asymétriques**, avec deux longueurs ou une longueur et un angle, et pour choisir
  les arêtes, celles qui sont cachées s'affichent en pointillés et peuvent être cliquées à travers
  la pièce.
- **Des plans de référence** construits comme dans les autres CAO : à mi-distance de deux faces,
  par trois points, normal à une arête, tangent à un cylindre, ou appuyé sur un élément
  d'esquisse.
- **Une révolution qui démarre à un angle** donné, et une barre de retour en arrière qu'on fait
  glisser dans l'historique pour voir la pièce à une étape antérieure.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ img | append: '/axe-courroie-parametre.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>
*Un axe linéaire en profilés, avec son moteur NEMA 17 et sa courroie : on change la longueur dans les paramètres, et tout suit.*

Quand une opération enlève de la matière (poche, perçage, gravure), la pièce devient translucide
pendant l'aperçu : on voit ce qui va partir.

## Conception et assemblage

Les onglets Pièces et Assemblage sont maintenant réunis dans **Conception**, avec deux modes,
Modéliser et Assembler, entre lesquels on passe en gardant la même scène et la même caméra, et un
double-clic sur une pièce de l'assemblage permet de la modifier sur place, en voyant les pièces
voisines, ce qui est indispensable quand un support doit épouser un servo.

![L'oreille de Nimbot modifiée au milieu de l'assemblage]({{ img | append: '/edition-en-contexte.jpg' | relative_url }})
*L'oreille modifiée sur place : le reste de la tête reste visible en transparence autour.*

- **Une liste des pièces lisible sur un gros projet** : dossiers, ensembles, copies liées
  regroupées (« RodArm ×2 », « Roulement MF83ZZ ×6 »), champ de filtre.
- **Une liaison plane** en plus des autres, un manipulateur visuel pour bouger les pièces, et
  « Définir comme zéro » pour fixer la position de repos d'une liaison.
- **Des inserts filetés à chaud**, en laiton, se posent comme une vis, et on peut maintenant forcer
  une taille de vis à la main, avec une petite icône orange qui prévient si elle ne correspond pas
  au trou.
- **Mesurer dans l'assemblage**, centre à centre ou axe à axe.
- **La bibliothèque s'étoffe** : servos MG996R, SG90 et MG90S modélisés d'après leurs vrais modèles,
  moteurs NEMA 17, roulement à collerette MF83ZZ, palonniers 25 dents et cube d'angle MakerBeam,
  sachant qu'un composant inséré est verrouillé, mais qu'on peut le rendre modifiable ou le remplacer.

<video controls preload="metadata" playsinline width="100%">
  <source src="{{ img | append: '/nimbot-liaison.mp4' | relative_url }}" type="video/mp4">
  Votre navigateur ne sait pas lire cette vidéo.
</video>
*On fait varier l'angle d'une liaison pivot, et la tête de Nimbot suit, avec toute la tringlerie.*

![Bibliothèque de composants : roulements, accouplements, palonniers]({{ img | append: '/bibliotheque-composants.jpg' | relative_url }})
*La bibliothèque de composants : roulements, accouplements, palonniers, LED, moteurs, poulies, servos.*

## Simulation

L'étude de mécanisme calcule le **couple nécessaire** sur une liaison motrice, en tenant compte de
l'inertie des pièces et des masses portées, et donne la courbe sur toute la course, ce qui permet de
savoir si un SG90 suffit ou s'il faut passer au MG996R.

Elle sait aussi faire l'inverse, en partant des positions voulues pour donner les **consignes à
envoyer aux servos**, autrement dit ce que le microcontrôleur aura à appliquer pour obtenir le
mouvement demandé.

![Scénario de mouvement sur la tête de Nimbot]({{ img | append: '/scenario-mouvement.jpg' | relative_url }})
*Un scénario de mouvement : deux liaisons pilotantes font bouger la tête de Nimbot.*

Au passage, j'ai simplifié l'étude de résistance : il n'y a plus de précision à choisir, elle
s'adapte toute seule à la pièce.

## Fabrication

C'est la partie que j'utilise le plus sur Nimbot, notamment avec les **séries de tests**, qui
permettent d'imprimer une pièce une fois par valeur d'un paramètre, en gravant cette valeur dessus,
et de ne garder que la zone utile autour d'une face, par exemple juste le logement d'un roulement,
pour éviter de faire les ajustements à l'aveugle.

![Série de tests sur le diamètre d'une biellette]({{ img | append: '/serie-de-tests.jpg' | relative_url }})
*Une série de tests sur la biellette de Nimbot : cinq diamètres de 7,89 à 8,29 mm, chacun gravé sur sa pièce.*

<div class="gallery">
  <figure><img src="{{ img | append: '/biellettes-imprimees.jpg' | relative_url }}" alt="Six biellettes rouges imprimées, chacune avec son diamètre gravé" loading="lazy"><figcaption>Une série imprimée : chaque biellette porte sa valeur</figcaption></figure>
  <figure><img src="{{ img | append: '/biellette-roulements.jpg' | relative_url }}" alt="Biellette 8,09 tenue entre deux doigts, avec ses billes en place" loading="lazy"><figcaption>La version retenue, 8,09 mm, avec ses billes en place</figcaption></figure>
</div>

- **Des plateaux d'impression**, et l'envoi au trancheur en un clic.
- **Des feuilles matière** décrivent le procédé (impression, découpe laser, usinage, achat), avec un
  pinceau qui permet de peindre des faces d'une autre couleur, chaque couleur partant ensuite sur
  son emplacement AMS.
- **Un atelier laser 2D**, avec les plaques dans la vue principale.
- **Des mises en plan modifiables** : on déplace les vues, on ajoute des cotes, on remplit le
  cartouche, et on exporte en PDF, SVG ou DXF.
- **Une nomenclature qui distingue les pièces achetées** : profilés, courroies, composants de
  bibliothèque, avec leur désignation commerciale (« Courroie GT2, pas 2 mm, 120 dents, largeur
  6 mm »).

<div class="gallery">
  <figure><img src="{{ img | append: '/plateau-impression.jpg' | relative_url }}" alt="Plateau d'impression avec trois pièces en PLA rouge" loading="lazy"><figcaption>Un plateau, prêt à partir au trancheur</figcaption></figure>
  <figure><img src="{{ img | append: '/peinture-matieres.jpg' | relative_url }}" alt="L'oreille de Nimbot en PLA blanc, peinte en rouge sur une face" loading="lazy"><figcaption>Matières et pinceau</figcaption></figure>
  <figure><img src="{{ img | append: '/laser-etoiles.jpg' | relative_url }}" alt="Deux disques gravés d'une étoile sur une plaque de contreplaqué" loading="lazy"><figcaption>L'atelier de découpe laser</figcaption></figure>
</div>

![Mise en plan de l'oreille de Nimbot]({{ img | append: '/mise-en-plan.jpg' | relative_url }})
*La mise en plan de l'oreille, avec ses cotes, son cartouche et la nomenclature du projet à gauche.*

Dans la vue 3D, les pièces s'affichent dans leur vraie matière, et les pièces imprimées montrent
même leurs lignes de couche.

![Lignes de couche et texte en relief sur la crête]({{ img | append: '/lignes-de-couche.jpg' | relative_url }})
*De près, on voit les lignes de couche de l'impression, et le texte « NimBOT V0.1 » en relief sur la crête.*

## Versions

Il y a aussi un nouvel atelier, **Versions**, qui garde l'historique du projet dans le fichier
lui-même, et dans lequel on peut enregistrer une version, revenir à une ancienne et voir dans la
vue 3D ce qui a changé, pièce par pièce, qu'elle ait été ajoutée, modifiée ou supprimée. On peut
également travailler sur une branche et la fusionner ensuite, VibeCAD demandant quelle pièce garder
si la même a été modifiée des deux côtés.

![Atelier Versions sur le projet Nimbot]({{ img | append: '/versions.jpg' | relative_url }})
*Les versions de Nimbot : en orange, les pièces modifiées depuis « Ear design », et le détail des étapes à droite.*

## Importer une carte KiCad

Il faut aussi faire rentrer l'électronique dans le robot, et même si KiCad sait exporter toute la
carte en 3D, en STEP, ça reste relativement lourd et très lent, parce que chaque résistance, chaque
connecteur arrive avec tous ses détails, et le modèle finit par se traîner.

J'ai donc choisi de récupérer les informations du projet KiCad pour n'en garder que des volumes
synthétiques, en ouvrant directement le dossier du projet pour que VibeCAD reprenne le contour de
la carte, son épaisseur, ses trous de fixation et un bloc par composant, avec sa **vraie hauteur**,
lue dans son modèle 3D, ce qui suffit pour dessiner un boîtier ou un support autour.

Si on veut malgré tout la carte complète, on peut toujours importer le STEP exporté par KiCad,
en gardant à l'esprit que ça peut alourdir le modèle.

![Carte principale du robot CDR 2027 importée dans VibeCAD]({{ img | append: '/import-kicad.jpg' | relative_url }})
*La carte principale de notre robot pour la [Coupe de France de Robotique 2027]({{ '/projets/cdr-2027/' | relative_url }}), importée depuis KiCad avec la hauteur réelle des composants.*

## Et le reste

VibeCAD s'utilise maintenant au doigt sur une tablette, s'installe comme une application depuis la
barre d'état, et ouvre les gros projets plus vite grâce à un cache des formes. Il y a aussi un
moniteur de charge qui montre, étape par étape, ce qui ralentit, et Nimbot a bien profité de toutes
ces améliorations.

## Les limites du moteur

En travaillant sur tout ça, j'ai aussi touché du doigt les limites du moteur, puisque VibeCAD repose
sur **Open CASCADE**, le même noyau géométrique que FreeCAD, et que j'ai retrouvé dans FreeCAD un
certain nombre de soucis que je rencontrais dans VibeCAD.

Quelques exemples :

- **Un calcul lancé ne s'arrête pas**, parce qu'Open CASCADE ne sait pas interrompre une opération
  en cours, ce qui faisait qu'un aperçu un peu lourd bloquait tout ce qui venait après ; VibeCAD
  abandonne maintenant le calcul et repart en récupérant les formes déjà calculées.
- **Les coques capricieuses**, avec des cas où évider une pièce de révolution coupée par un plan
  pouvait échouer au bout d'une minute, alors que VibeCAD essaie maintenant plusieurs méthodes et
  vérifie chaque résultat.
- **Les faces qui changent**, un problème que les habitués de FreeCAD connaissent bien : quand une
  pièce est modifiée, le moteur peut renuméroter ses faces et faire perdre son support à une
  esquisse posée dessus, ce que VibeCAD traite en donnant à chaque face une étiquette qui la suit
  d'une étape à l'autre.
- **Les gravures à plat** se faisaient avaler par les opérations suivantes, et cassaient les
  chanfreins posés après, raison pour laquelle elles sont maintenant appliquées tout à la fin.

<div class="gallery">
  <figure><img src="{{ img | append: '/gravure-apercu.jpg' | relative_url }}" alt="Aperçu d'une gravure de profondeur 0 : le contour de l'étoile sur le disque" loading="lazy"><figcaption>Gravure à plat (profondeur 0) : l'aperçu</figcaption></figure>
  <figure><img src="{{ img | append: '/gravure-etoile.jpg' | relative_url }}" alt="L'étoile marquée en surface sur le disque" loading="lazy"><figcaption>Le marquage, appliqué en fin d'historique</figcaption></figure>
</div>

J'ai trouvé ça intéressant : le moteur impose les mêmes contraintes aux deux logiciels, mais je
n'ai pas toujours abordé les problèmes de la même façon que dans FreeCAD, en les contournant parfois,
ou en faisant simplement en sorte qu'on comprenne pourquoi ça bloque.

## Une note sur la façon dont c'est fait

Je le rappelle, parce que c'est important : ce n'est pas moi qui code VibeCAD. Je ne saurais pas
développer un logiciel de ce type. Il est développé quasi entièrement avec l'IA, avec **Claude Opus
5.5**, et **Claude Fable** quand une nouvelle version sort.

C'est aussi pour moi une façon de regarder ce que savent faire ces nouveaux modèles, et la puissance
qu'on peut en tirer. Ce sont des outils à la fois formidables et un peu terrifiants : d'une
efficacité redoutable quand on sait bien s'en servir, et de plus en plus pertinents. Il faut donc
toujours garder ça en tête : VibeCAD est une expérimentation faite avec ces outils.

Et elle pose des questions sur le futur des logiciels. Depuis un mois, on voit des outils et des
copies d'outils exploser un peu partout, en CAO notamment. Essayer de développer le sien fait
prendre pas mal de recul : on se rend compte à quel point c'est devenu facile.

Je me demande si on ne va pas aller vers des logiciels développés plus spécifiquement pour chacun,
qui se construiraient à la demande, au fur et à mesure des besoins et des projets. Si chacun peut
faire évoluer son outil dans son coin, la question sera aussi de savoir comment on continue à
travailler ensemble, à se passer un projet, à reprendre ce que quelqu'un d'autre a commencé sans
devoir utiliser exactement le même logiciel. Les fichiers d'échange prendraient peut-être une place
beaucoup plus importante, avec la question de ce qu'on pourrait réellement transmettre d'un outil
à l'autre : est-ce qu'on partagerait seulement le résultat, ou aussi ce qui permet de reprendre et
de modifier le travail ?

J'ai l'impression qu'on va voir de plus en plus de logiciels, de copies et d'expérimentations venant
de personnes qui n'auraient pas forcément pu développer leur propre outil auparavant, mais qui
avaient pourtant une idée assez précise de ce qu'elles attendaient d'une fonctionnalité et de la
façon dont elles voulaient s'en servir. Pouvoir la faire, la tester et la mettre en application
elles-mêmes change pas mal de choses, et je me demande aussi ce que ça pourrait donner à l'échelle
d'une communauté, avec des besoins et des idées qu'on pourrait mettre en commun.

Mais tout ça reste des réflexions, et pour l'instant, je n'ai vraiment aucune idée de ce qui va se
passer ni de la place que ces outils vont prendre. Ce qui me semble déjà évident, c'est que ça
chamboule beaucoup de choses dans nos habitudes, et je pense qu'on a besoin de prendre conscience
de ce que ça représente, de ce que ça rend possible et de ce que ça change dans nos façons de
travailler, pour pouvoir ensuite prendre des décisions sur ce qu'on veut en faire.

D'autant que les réticents d'hier s'y mettent, même les plus grands. Le noyau Linux a adopté, avec
sa version 7.0 au printemps, des [règles officielles pour le code écrit avec l'IA](https://itsfoss.com/news/linux-ai-coding-assistants-policy/) :
un humain signe et répond de chaque ligne, et le patch indique l'outil utilisé par une mention
« Assisted-by ». Six mois plus tard, cette mention est déjà en passe de disparaître : la
modification est acceptée dans la branche de la documentation, en attendant le noyau principal. Et
Linus Torvalds lui-même a [publié du code écrit avec Claude Code](https://www.heise.de/en/news/Linux-may-drop-AI-code-labels-Torvalds-uses-LLMs-too-11490773.html),
sous sa direction.

## La suite

Pour la documentation, je suis en retard, je le sais, et je mettrai les pages à jour au fur et à
mesure dans la [documentation de VibeCAD]({{ '/projets/vibecad/' | relative_url }}), tandis que Nimbot
aura bientôt sa propre page.

En attendant, VibeCAD est toujours gratuit, open source, et en ligne :
[barbatronic.fr/VibeCAD](https://barbatronic.fr/VibeCAD/).
