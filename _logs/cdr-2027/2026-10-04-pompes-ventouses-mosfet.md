---
title: "Pompes, ventouses et électronique de commande en 12 V"
date: 2026-10-04
project: cdr-2027
description: "Retour aux ventouses et micropompes pour prendre les pierres, passage des pompes et électrovannes en 12 V, et circuit de commande à MOSFET piloté en I2C par un PCA9685."
session: ""
state: "en cours"
next_step: "Mesurer la hauteur des cosses et du bossage, puis router la carte ronde Ø 26 mm sous KiCad."
---

## Objectif

L'[essai sur la table complète]({{ '/logs/cdr-2027/2026-09-30-premier-match-unimakers/' | relative_url }}) l'a montré : les bras ne sont pas du tout efficaces pour manipuler les pierres. Je reviens donc à ce que j'utilise dans mes robots depuis 2019 : des ventouses et des micropompes.

Ce log pose le choix des composants et de l'électronique de commande.

## Passer les pompes en 12 V

Avant, la batterie du robot était en 24 V. Je prenais des pompes en 5 V, parce que j'avais déjà une régulation de puissance en 5 V, à base de convertisseurs Traco Power qui coûtaient très cher.

Le robot est maintenant sur une batterie 12 V. Les pompes et les électrovannes peuvent donc être alimentées directement par la batterie, en 12 V : un composant en moins côté régulation.

## Les composants

**La micropompe** : le modèle que j'utilise régulièrement, mais en version 12 V. [Lien vers la pompe](https://s.click.aliexpress.com/e/_c4tD3dGh).

![Micropompe à vide à moteur à courant continu]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/micropompe.jpg' | relative_url }})
*La micropompe. Photo du vendeur : la version affichée est en 3,7 V, je prends la version 12 V.*

**L'électrovanne** : la même qu'avant, elle aussi en 12 V. Elle assure la mise à l'atmosphère du circuit pour relâcher le carton. [Lien vers l'électrovanne](https://s.click.aliexpress.com/e/_c4lnaaVJ).

![Mini électrovanne 12 V avec ses fils]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/electrovanne.jpg' | relative_url }})
*La mini électrovanne.*

**La ventouse** : une ventouse à soufflet DP-S30, de 30 mm de diamètre et 18 mm de haut. [Lien vers la ventouse](https://s.click.aliexpress.com/e/_c3VWLRtb).

![Ventouse à soufflet DP-S30 et son plan coté]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/ventouse-dp-s30.png' | relative_url }})
*La ventouse DP-S30 et ses cotes : Ø 30 mm, hauteur 18 mm.*

## Le circuit de commande

Pour piloter pompes et électrovannes, on reprend un circuit utilisé depuis longtemps dans l'équipe : un interrupteur à MOSFET côté masse.

![Schéma de commande d'une électrovanne par un MOSFET AO3400A]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/schema-mosfet.png' | relative_url }})
*Une voie de commande : le signal S_EV pilote la charge branchée sur J3.*

Comment il fonctionne :

- **La charge** (pompe ou électrovanne) est branchée sur J3, entre le 12 V et le drain du MOSFET Q1. Le MOSFET coupe ou relie le retour vers la masse : c'est une commande « côté bas ».
- **R5 (270 Ω)**, entre le signal S_EV et la grille, limite le pic de courant à chaque commutation : la grille se comporte comme un petit condensateur. Elle évite aussi les oscillations.
- **R7 (10 kΩ)**, entre la grille et la masse, maintient le MOSFET bloqué quand le signal de commande est absent ou flottant : au démarrage, pendant un reset, ou carte de commande débranchée. Pas de pompe qui démarre toute seule.
- **D4**, montée en inverse aux bornes de la charge, est la diode de roue libre. Une pompe ou une électrovanne est une bobine. Au moment où le MOSFET coupe, le courant de la bobine ne peut pas s'arrêter net, et la tension monterait très haut sur le drain. La diode offre un chemin à ce courant, qui se dissipe dans la boucle charge-diode, et protège le MOSFET.

## Le MOSFET : AO3400A

Un MOSFET canal N en boîtier SOT-23, très courant et peu cher. Ses caractéristiques, d'après la [fiche technique d'Alpha & Omega](https://www.aosmd.com/res/datasheets/AO3400A.pdf) :

| Caractéristique | Valeur |
|---|---|
| Tension drain-source maximale (VDS) | 30 V |
| Tension grille-source maximale (VGS) | ±12 V |
| Courant continu (ID) à 25 °C / 70 °C | 5,7 A / 4,7 A |
| Courant impulsionnel (IDM) | 30 A |
| Seuil de grille (VGS(th)) | 0,65 à 1,45 V, typique 1,05 V |
| Résistance à l'état passant, VGS = 4,5 V | 19 mΩ typique, 32 mΩ maximum |
| Résistance à l'état passant, VGS = 2,5 V | 24 mΩ typique, 48 mΩ maximum |
| Charge totale de grille (Qg) | environ 6 nC |
| Puissance dissipable à 25 °C | 1,4 W |
| Boîtier | SOT-23 |

Le point clé : c'est un MOSFET « logique ». Il est déjà presque complètement passant avec 2,5 V sur la grille. Une sortie en 3,3 V ou en 5 V suffit donc à le commander directement, sans étage intermédiaire.

## Pourquoi ça marche aussi avec les moteurs du lanceur

Le même circuit peut piloter les moteurs à courant continu des roues à inertie du [lanceur]({{ '/logs/cdr-2027/2026-09-29-canon-pilote-robot/' | relative_url }}), pas seulement les pompes et les électrovannes.

- **Un moteur est aussi une bobine.** Comme pour la pompe, la diode de roue libre absorbe la surtension à la coupure.
- **Le PWM fonctionne.** Pendant les phases où le MOSFET est bloqué, le courant du moteur continue à circuler dans la diode : le moteur tourne régulièrement, et sa vitesse suit le rapport cyclique. Avec 6 nC de charge de grille et 270 Ω, le MOSFET commute en bien moins d'une microseconde, alors que le PCA9685 génère des PWM entre 24 Hz et environ 1,5 kHz : les pertes de commutation sont négligeables.
- **Il y a de la marge en tension et en courant.** 30 V maximum pour une batterie 12 V. Côté chaleur, à 3 A et 32 mΩ, le MOSFET dissipe 3² × 0,032, soit environ 0,3 W, loin des 1,4 W admissibles. Les 30 A impulsionnels couvrent le pic de courant au démarrage d'un moteur.
- **Un seul sens de rotation**, mais c'est suffisant pour des roues à inertie, qui tournent toujours dans le même sens. On n'a pas besoin d'un pont en H.

Deux points à vérifier avant de généraliser : la diode D4 doit supporter le courant du moteur, et il faut mesurer le courant de démarrage réel des moteurs du lanceur.

## Piloter tout ça en I2C

Je risque d'avoir beaucoup de pompes, d'électrovannes et de moteurs. Or il ne me reste plus de GPIO libres sur la carte du robot. Par contre, j'ai de l'I2C.

L'idée : un PCA9685 dédié aux pompes, aux électrovannes et aux moteurs, à côté de celui qui pilote déjà les servomoteurs. Chaque sortie PWM du PCA9685 commande une voie à MOSFET.

Trois options, pas encore tranchées :

1. **Des cartes à double MOSFET séparées**, comme ce qu'on faisait avant, câblées sur les sorties du PCA9685.
2. **Les drivers intégrés directement sur la carte du PCA9685** : une seule carte, moins de câbles.
3. **Une petite carte ronde soudée directement sur chaque moteur**, détaillée ci-dessous.

## Une carte ronde commune, soudée sur le moteur

En y réfléchissant, à part les électrovannes, je pilote des moteurs dans les deux cas : une pompe, c'est un moteur à courant continu qui entraîne une membrane, et le lanceur, ce sont deux moteurs à courant continu. Même tension (12 V), même besoin : allumer, éteindre, régler la vitesse en PWM, dans un seul sens.

Reste à vérifier qu'ils partagent le même encombrement. J'ai mesuré au pied à coulisse la face arrière des deux moteurs.

![Face arrière du moteur de la pompe et d'un moteur MF360S du lanceur]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/faces-arriere-moteurs.jpg' | relative_url }})
*À gauche, le moteur de la pompe ; à droite, un MF360S du lanceur.*

![Mesures au pied à coulisse des deux moteurs]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/mesures-moteurs.jpg' | relative_url }})
*En haut, le MF360S : carter, écartement des cosses, bossage, largeur d'une cosse. En bas, la pompe : les mêmes cotes.*

| Cote | MF360S (lanceur) | Moteur de pompe |
|---|---|---|
| Diamètre du carter | 27,68 mm | 24,13 mm |
| Écartement extérieur des cosses | 22,80 mm | 20,33 mm |
| Largeur d'une cosse | 3,04 mm | 1,88 mm |
| Diamètre du bossage central | 9,89 mm | 6,39 mm |
| Flasque arrière | plastique, à larges ouïes d'aération | métal, fermé |

Sur les deux moteurs, les cosses sont à peu près diamétralement opposées. Avec une épaisseur de cosse d'environ 0,4 mm (pas encore mesurée), leur axe est à environ 11,2 mm du centre sur le MF360S, et à 10,0 mm sur la pompe : 1,2 mm d'écart seulement.

## Le format de la carte

Une seule empreinte peut accueillir les deux moteurs :

- **Une carte ronde de Ø 26 mm.** C'est le plus petit diamètre qui laisse une couronne de cuivre suffisante autour des fentes. Elle reste dans le carter du MF360S (Ø 27,7) et dépasse d'un millimètre de chaque côté du moteur de la pompe (Ø 24,1), sans dépasser la tête de pompe, plus large que le moteur.
- **Un trou central de Ø 11 mm**, pour laisser passer le bossage du MF360S (Ø 9,9) et, à plus forte raison, celui de la pompe (Ø 6,4).
- **Deux fentes métallisées de 3,6 × 2,2 mm**, diamétralement opposées, centrées à 10,6 mm du centre. Dans la longueur, elles acceptent la cosse la plus large (3,0 mm) ; dans la largeur, elles couvrent les deux positions de cosse, de 10,0 à 11,2 mm. La cosse traverse la fente et se soude sur la couronne de cuivre.
- **Les composants côté extérieur**, dans la couronne libre entre le trou et le bord : l'AO3400A en SOT-23, deux résistances en 0603, la diode en boîtier SMA, et trois pastilles à souder pour les fils 12 V, masse et signal.

![Plan coté de la carte ronde, avec les contours des deux moteurs]({{ '/assets/img/projets/cdr-2027/2026-10-04-pompes-ventouses-mosfet/carte-ronde-plan.svg' | relative_url }})
*Le tracé mécanique de la carte, à l'échelle. Tirets : MF360S ; pointillés : moteur de pompe.*

Pour la diode, un boîtier SMA permet de prendre une Schottky de 3 A (type SS34), à valider selon le courant réel des moteurs.

- **Un seul circuit dans tous les cas** : le même pour chaque pompe et chaque moteur du lanceur.
- **La diode au plus près de la bobine** : la surtension de coupure est absorbée à la source, au lieu de circuler dans les câbles.
- **Un câblage plus simple** : chaque moteur reçoit trois fils et devient un module autonome, facile à remplacer.
- **Les électrovannes** gardent leur commande à MOSFET classique, sur une carte à part ou avec la même carte ronde montée sur fils.

Points encore ouverts avant de router la carte :

- **La hauteur des cosses et du bossage** au-dessus du flasque : elle fixe la hauteur à laquelle la carte se pose.
- **Les ouïes du MF360S** : la carte en couvre une partie. Le perçage central en dégage le centre ; si le moteur chauffe trop, on pourra ajouter des découpes en face des ouïes.
- **L'épaisseur des cosses**, pour ajuster la largeur des fentes.

## Suite

- [x] Mesurer la face arrière des moteurs de pompe et du lanceur
- [ ] Mesurer la hauteur des cosses et du bossage, et l'épaisseur des cosses
- [ ] Router la carte ronde Ø 26 mm sous KiCad
- [ ] Vérifier le calibre de la diode de roue libre pour les moteurs du lanceur
- [ ] Tester pompe 12 V, électrovanne et ventouse DP-S30 sur un carton
