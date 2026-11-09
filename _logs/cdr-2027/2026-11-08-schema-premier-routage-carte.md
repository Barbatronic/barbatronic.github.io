---
published: false
title: "Carte CDR 2027 : schéma et premier routage"
date: 2026-11-08
project: cdr-2027
description: "Une carte principale sur ESP32-S3-WROOM-1U-N16R2, issue des robots et PAMI précédents : alimentations, interfaces du robot et ajout de l'Ethernet avec un W5500. Schéma et premier routage du week-end."
session: ""
state: "premier routage"
next_step: "Optimiser le routage."
---

## Repartir des cartes existantes

Ce week-end des 7 et 8 novembre, j'ai travaillé sur la carte principale du robot pour la Coupe de France de Robotique 2027. Le schéma et le premier routage présentés ici sont le résultat de ces deux jours.

Je repars de la carte que j'avais faite un peu à l'arrache pour le [robot différentiel de la Coupe 2026]({{ '/projets/cdr-2026/' | relative_url }}), avec des composants un peu différents. Cette carte utilisait déjà un ESP32-S3, mais sur une carte de développement au format Arduino Uno.

Cette fois, je mélange les éléments qui ont déjà servi sur nos robots : la carte du différentiel 2026, celles des robots holonomes des années précédentes, et celles des PAMI, nos petits robots, qui utilisaient déjà des modules ESP32-S3-WROOM-1U. L'objectif est de retrouver une base commune, avec du matériel et du logiciel plus faciles à réutiliser d'un robot à l'autre.

Les sources de la carte sont disponibles dans le [dossier main-board-2027 sur GitHub](https://github.com/Barbatronic/CDR-2027/tree/main/ECAD/main-board-2027). Les fichiers intégrés à ce log conservent la version du 8 novembre.

## Schéma d'ensemble

{% include kicanvas.html src="/assets/files/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/main-board-2027.kicad_sch" caption="Schéma de la carte principale — version du 8 novembre 2026." %}

Le schéma est découpé en blocs fonctionnels. On peut les explorer dans KiCanvas ci-dessus, ou ouvrir la [vue complète du schéma]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/schema-complet.png' | relative_url }}). Les vues ci-dessous reprennent ces blocs pour expliquer les choix du circuit.

## Un ESP32-S3 commun aux robots et aux PAMI

Au centre de la carte, je place un **ESP32-S3-WROOM-1U-N16R2** pour piloter l'ensemble du robot. Je reste donc sur la famille déjà utilisée sur le différentiel et sur nos PAMI.

La variante N16R2 possède 16 Mo de mémoire flash et 2 Mo de PSRAM en Quad SPI. Ce choix est aussi une question de broches disponibles : les années précédentes, il m'en manquait parfois, parce que je n'avais pas suffisamment vérifié celles qui étaient réservées à la mémoire.

Avec la PSRAM Quad SPI du R2, les **GPIO35, GPIO36 et GPIO37 restent disponibles**. Sur les variantes à PSRAM Octal SPI, ces trois GPIO sont utilisés par la mémoire et ne peuvent plus servir aux périphériques du robot. C'est bien le gain recherché ici. La [fiche technique Espressif](https://documentation.espressif.com/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) détaille les variantes et ces restrictions.

![ESP32-S3-WROOM-1U-N16R2, affectation des GPIO et connexion USB native]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/esp32-s3.png' | relative_url }})
*L'ESP32-S3, les signaux du robot et l'USB natif. Les GPIO35 à 37 servent ici à STEP_3, DIR_3 et à l'activation du 5 V puissance.*

Une précision sur les annotations de cette première version du schéma : les GPIO47 et GPIO48 ne sont pas réservés à la PSRAM sur les variantes R8. La particularité signalée par Espressif concerne les variantes à ESP32-S3R16V, où ces deux GPIO fonctionnent sous 1,8 V. L'annotation qui les limite aux modules sans PSRAM ou R2 est donc à corriger.

## Garder un connecteur USB-B robuste

J'utilise l'USB intégré à l'ESP32-S3 : **GPIO19 pour D− et GPIO20 pour D+**. Il n'y a donc pas besoin d'un convertisseur USB-série pour cette liaison.

Comme d'habitude dans l'équipe, je garde un connecteur **USB type B**. Il prend de la place, mais nous avons l'habitude de ces connecteurs sur nos robots et de leur résistance mécanique. Les câbles sont parfois malmenés, notamment lorsqu'un robot part alors qu'il est encore branché : je préfère garder ce connecteur que l'on connaît bien.

Une LED bleue indique la présence du VBUS USB. **Le VBUS n'alimente que cette LED**, pas le robot ni l'ESP32-S3. Brancher le câble permet donc de voir que l'USB est présent, mais ne remplace pas l'alimentation de la carte.

## Entrée batterie et arrêt d'urgence

La batterie 12 V arrive sur un **XT60**, puis passe par un mini-fusible monté dans un porte-fusible Keystone, avec l'empreinte 3568.

Le relais **Finder 36.11** distribue ensuite le 12 V au reste de la carte. Sa bobine est commandée par le **BAU**, le bouton d'arrêt d'urgence : l'ouverture de ce circuit fait retomber le relais et coupe le 12 V distribué. Le repère `+BATT` est situé en amont du fusible et du relais ; le réseau `+12V` est situé en aval.

![Entrée batterie XT60, fusible F1, relais Finder 36.11 et connecteur du bouton d'arrêt d'urgence]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/batterie-bau.png' | relative_url }})
*L'arrivée batterie et le relais commandé par le BAU. D19 est placée aux bornes de la bobine.*

## Trois alimentations régulées

À partir du 12 V distribué, je sépare les besoins en trois rails :

| Rail | Régulateur | Utilisation prévue |
|---|---|---|
| 3,3 V | Recom R-78B3.3-2.0, 2 A | ESP32-S3 et logique en 3,3 V |
| 5 V | Recom R-78B5.0-2.0, 2 A | Encodeurs, LIDAR et éventuellement un ou deux ventilateurs |
| 5 V puissance, noté `+5VP` | Pololu D36V50F5 | Principalement les servomoteurs, ainsi que le rail de NeoPixel |

Les deux Recom sont des [régulateurs à découpage de la série R-78B-2.0](https://recom-power.com/pdf/Innoline/R-78B-2.0.pdf), donnés pour 2 A en sortie.

Pour le **D36V50F5**, le courant disponible dépend de la tension d'entrée et des conditions thermiques. [Pololu annonce 3,5 à 8 A continus typiques suivant les conditions](https://www.pololu.com/product/4091), avec 5,5 A comme valeur de référence à 36 V d'entrée. Pour notre batterie 12 V, il faudra se baser sur la courbe constructeur et sur la charge réelle des servomoteurs.

Les pompes et les électrovannes restent alimentées en **12 V**, via leurs cartes de commande. Elles ne chargent donc pas le régulateur 5 V puissance.

![Régulateurs Recom 3,3 V et 5 V, Pololu D36V50F5 et sorties d'alimentation]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/regulateurs.png' | relative_url }})
*En haut, les deux Recom et les sorties 3,3 V et 5 V. En bas, le Pololu, sa commande En5VP, les sorties 5 V puissance et les deux XT30 en 12 V.*

Des connecteurs permettent de récupérer le 3,3 V, le 5 V et le 5 V puissance sur des cartes extérieures. Deux sorties XT30 distribuent également le 12 V aux cartes intermédiaires.

## Indicateurs et commandes sur la carte

Les différents rails ont leurs LED de présence : batterie, 12 V distribué, 5 V, 5 V puissance et 3,3 V. Elles seront placées sur le côté du PCB pour pouvoir les voir facilement.

Je prévois aussi un bouton d'initialisation avec un **interrupteur de clavier Cherry**, et un **interrupteur à glissière** pour sélectionner l'équipe, donc la couleur de départ. Les boutons Boot et EN de l'ESP32-S3 sont également présents dans leur bloc dédié.

![LED de présence des alimentations, connecteur série, bouton Init et sélecteur Team]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/indicateurs-commandes.png' | relative_url }})
*Les cinq indicateurs d'alimentation et les commandes Init et Team, à côté du connecteur série.*

## Une tirette magnétique

Pour démarrer le robot, je reprends la tirette magnétique utilisée sur la majorité de nos robots récents. Elle repose sur un **DRV5033**, un [capteur à effet Hall à sortie numérique](https://www.ti.com/product/DRV5033) qui détecte la présence d'un aimant. Le retrait de l'aimant sert de signal de départ au programme du robot.

![Capteur Hall DRV5033 alimenté en 3,3 V et signal Tirette avec résistance de rappel]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/tirette.png' | relative_url }})
*Le DRV5033, son condensateur de découplage et la résistance de rappel de 10 kΩ sur le signal Tirette.*

## Les encodeurs en quadrature

Nos encodeurs sont des **AMT102-V**, alimentés en 5 V. Je récupère les voies A et B des encodeurs gauche et droit pour l'odométrie.

Le module de conversion de niveaux **BOB-12009** adapte leurs quatre signaux vers la logique 3,3 V de l'ESP32-S3. Dans ce cas, le sens utile est bien **5 V vers 3,3 V**, des sorties des encodeurs vers les entrées du microcontrôleur. Les sorties d'index ne sont pas utilisées sur ce schéma.

![Connecteurs des encodeurs gauche et droit et adaptation des quatre voies A et B de 5 V vers 3,3 V]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/encodeurs.png' | relative_url }})
*Les deux connecteurs d'encodeur et le convertisseur de niveaux à quatre voies.*

## LIDAR, NeoPixel et moteurs pas à pas

Un connecteur est dédié au **LIDAR LD06**, avec son alimentation 5 V, la réception des données et le signal PWM. Un autre permet de brancher un rail de **NeoPixel**, alimenté cette fois par le 5 V puissance.

![Connecteur LIDAR LD06 et sortie NeoPixel avec alimentation 5 V puissance]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/lidar-neopixel.png' | relative_url }})
*Le LD06 sur le 5 V et les NeoPixel sur le 5 V puissance.*

La carte fournit les signaux de commande de **trois drivers de moteurs pas à pas** : une paire STEP/DIR par moteur et une activation commune. Le robot différentiel n'en utilise que deux, mais garder la troisième voie permettrait de reprendre cette carte sur un robot holonome.

![Connecteur des trois voies STEP et DIR et du signal d'activation commun des drivers]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/steppers.png' | relative_url }})
*Les signaux vers les drivers externes. Les étages de puissance des moteurs ne sont pas intégrés à cette carte.*

## Buzzer et extensions I2C

Un **MOSFET AO3400A** commande le buzzer alimenté en 5 V.

![Commande du buzzer 5 V par un MOSFET AO3400A]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/buzzer.png' | relative_url }})
*Le buzzer et son transistor de commande.*

Je garde **quatre connecteurs sur le même bus I2C** pour les cartes supplémentaires. L'utilisation prévue est un **PCA9685 pour les servomoteurs**, un second pour les commandes des pompes et des électrovannes, puis un écran I2C. Cela laisse un connecteur disponible pour une autre extension.

Le [PCA9685](https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf) est un contrôleur à 16 sorties PWM, dont la fréquence est réglable. Pour les pompes et les électrovannes, il fournit les signaux aux étages de puissance, comme dans le [circuit de commande décrit précédemment]({{ '/logs/cdr-2027/2026-10-04-pompes-ventouses-mosfet/' | relative_url }}).

![Quatre connecteurs I2C partageant SCL, SDA, le 3,3 V et la masse]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/i2c.png' | relative_url }})
*Les quatre prises du même bus I2C, avec les résistances de rappel de SCL et SDA au 3,3 V.*

## La nouveauté : un accès Ethernet

Le reste de la carte reprend surtout des circuits que l'on utilise déjà. La nouveauté de cette année est l'ajout d'un **module Ethernet à base de W5500**, relié à l'ESP32-S3 en SPI. Le [W5500 de WIZnet](https://docs.wiznet.io/Product/Chip/Ethernet/W5500) apporte une interface Ethernet 10/100 Mbit/s au microcontrôleur.

À la Coupe 2026, nous avons eu beaucoup de mal à nous connecter au robot pour déboguer. La bande Wi-Fi 2,4 GHz était très utilisée, et l'accès à l'interface du robot n'était pas assez fiable.

L'idée est de pouvoir **brancher directement le robot au PC en Ethernet**, ou de relier son port Ethernet à un **routeur ou un pont Wi-Fi externe en 5 GHz**. Le W5500 fournit la liaison filaire ; c'est cet équipement externe qui assurerait la liaison radio en 5 GHz. Je garde ainsi une autre façon d'accéder à l'interface du robot pour le débogage.

![Module Ethernet W5500, liaison SPI et signaux de reset et d'interruption]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/ethernet-w5500.png' | relative_url }})
*Le module Ethernet, représenté par le symbole WIZ850io compatible W5500, avec les lignes SPI, reset et interruption.*

## Une carte adaptée à l'emplacement dans le robot

La carte prend place **sur le dessus du robot**, dans un emplacement de **200 × 60 mm**. Je pars sur un PCB de **198 × 59 mm** : cela laisse 2 mm de marge sur la longueur et 1 mm sur l'autre dimension, au total, pour l'intégration mécanique et d'éventuels ajustements.

Elle est fixée par **quatre perçages pour des vis M3**. Une **encoche en haut à gauche** laisse passer le bouton d'arrêt d'urgence. Le BAU sera fixé au carter qui porte la carte, et non au PCB lui-même. Il faudra vérifier ce passage lors de l'intégration 3D.

Je répartis les fonctions en **trois grandes zones**, de gauche à droite sur la vue du PCB :

| Zone | Fonctions principales | Contrainte de placement |
|---|---|---|
| À gauche | Interface homme-machine, commandes et tirette | Les éléments doivent tomber aux endroits prévus sur le robot et son carter. |
| Au centre | ESP32-S3, connecteurs de périphériques, sorties LIDAR et NeoPixel | Les câbles du LIDAR et des NeoPixel remonteront dans le mât de balise. |
| À droite | Gestion d'énergie et sorties de puissance | La batterie sera a priori de ce côté du robot. |

![Placement des composants sur la carte, encoche du BAU et dimension de 198 mm dans KiCad]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/routage-placement-general.png' | relative_url }})
*Le placement pendant le routage : l'encoche du BAU en haut à gauche, l'ESP32-S3 au centre et la partie alimentation à droite, partiellement hors champ.*

## Figer les contraintes mécaniques avant de router

Je commence par placer les composants dont la position est imposée par la mécanique. La tirette et les éléments d'IHM sont figés assez rapidement : ils doivent rester accessibles et correspondre aux emplacements prévus dans le carter.

Je place ensuite les autres éléments autour de ces contraintes. La partie alimentation, à droite, se route assez vite : il y a finalement pas mal de place sur cette carte. Une fois ses pistes tracées et les bus d'alimentation amenés vers le centre et la gauche, je peux me concentrer sur le microcontrôleur.

De l'autre côté, les signaux des IHM et les liaisons des périphériques arrivent également vers cette zone centrale. Le placement est déjà bien défini, mais il reste à organiser leur arrivée sur l'ESP32-S3.

![Pistes d'alimentation déjà tracées et nombreuses liaisons du chevelu autour de l'ESP32-S3]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/routage-centre-chevelu.png' | relative_url }})
*Les alimentations et plusieurs faisceaux de pistes sont déjà routés. Les lignes fines du chevelu montrent les connexions qui restent à réaliser autour de l'ESP32-S3.*

## Réaffecter les GPIO pour simplifier les pistes

Lors de ce premier placement, je n'ai pas encore optimisé l'affectation des GPIO dans le schéma. Les composants sont là où je souhaite les mettre, mais les liaisons se croisent beaucoup dans le chevelu.

Habituellement, je reprends alors les signaux un par un : dans quel ordre arrivent-ils au module ? Sur quelles broches serait-il plus facile de les router ? Est-ce que déplacer une fonction vers un autre GPIO pose un problème dans le programme ?

La [matrice GPIO de l'ESP32-S3](https://docs.espressif.com/projects/esp-idf/en/v6.0.2/esp32s3/api-reference/peripherals/gpio.html) laisse beaucoup de liberté pour affecter les signaux numériques aux broches. Il faut tout de même tenir compte des fonctions particulières, des broches utilisées par la mémoire, de l'USB et des contraintes de démarrage. Ce travail reste donc assez long lorsqu'on vérifie chaque choix à la main.

![Détail des connexions qui se croisent entre les pistes déjà routées et les broches de l'ESP32-S3]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/routage-detail-nets.png' | relative_url }})
*Les signaux arrivent dans un ordre qui complique le routage.*

![Placement de l'ESP32-S3 et des quatre connecteurs I2C sous le module, avec les connexions restant à router]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/routage-detail-esp32-i2c.png' | relative_url }})
*Le placement du module et des connecteurs sert de point de départ à la réaffectation des GPIO.*

Pour accélérer cette étape, je donne à **Claude** des captures du PCB avec le placement figé et le chevelu, ainsi qu'un accès au **PCB et au firmware**. Je lui demande de regarder dans quel ordre les signaux arrivent, de proposer une affectation des GPIO qui simplifie les pistes, et de vérifier que le firmware pourra suivre avec une adaptation de sa configuration des broches.

L'idée est de conserver le placement choisi, puis d'adapter l'affectation des signaux autour de l'ESP32-S3. J'estime que cela m'a fait gagner **une heure et demie à deux heures** de vérifications et d'hésitations. J'ai contrôlé les propositions à la fin, puis terminé ce premier routage, qui est devenu beaucoup plus simple.

![Routage en cours autour de l'ESP32-S3, entre la zone IHM et les connecteurs des périphériques]({{ '/assets/img/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/routage-esp32-en-cours.png' | relative_url }})
*Une autre vue de l'étape de routage autour du module. Ces captures montrent le travail en cours ; la version de fin de séance est consultable dans KiCanvas ci-dessous.*

## Un premier routage à laisser reposer

À la fin de ce week-end, j'ai un **premier routage que je trouve globalement propre**, mais c'est encore une première version. J'ai besoin de dormir dessus : certains éléments vont probablement bouger après une nouvelle relecture.

{% include kicanvas.html src="/assets/files/projets/cdr-2027/2026-11-08-schema-premier-routage-carte/main-board-2027.kicad_pcb" caption="Implantation et premier routage — version du 8 novembre 2026." %}

Je n'ai pas encore intégré les modèles 3D des composants ni placé la carte dans son environnement mécanique. Cette étape devra permettre de vérifier les encombrements, le passage du BAU dans l'encoche et les éventuels composants à déplacer. Il reste aussi à travailler la **sérigraphie** pour rendre les connecteurs et les fonctions lisibles.

## Suite

- [ ] Reprendre le routage après une nouvelle relecture.
- [ ] Intégrer les modèles 3D des composants et vérifier l'encombrement dans le robot.
- [ ] Vérifier le passage du BAU dans l'encoche et les fixations.
- [ ] Travailler la sérigraphie de la carte.

L'[optimisation du routage et le début de l'intégration des modèles 3D]({{ '/logs/cdr-2027/2026-11-09-optimisation-routage-modeles-3d/' | relative_url }}) se poursuivent le lendemain.
