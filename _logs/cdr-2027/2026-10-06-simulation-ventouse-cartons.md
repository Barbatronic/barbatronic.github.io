---
title: "Simulation de la prise des cubes en carton avec des ventouses"
date: 2026-10-06
project: cdr-2027
description: "Un préhenseur à ventouses sur support souple, pour attraper des cartons dont on ne connaît pas l'orientation, testé d'abord en simulation faute d'imprimante assez grande."
session: ""
state: "validé en simulation"
next_step: "Imprimer le support en TPU et tester le préhenseur sur de vrais cartons."
---

## Le problème

J'ai déjà fait des essais avec une ventouse maintenue fermement. Ça ne marche pas : soit la ventouse ne se plie pas assez, soit la succion de ma pompe n'est pas suffisante pour prendre un carton posé sur un autre carton. Le carton est trop léger : il bouge au contact, et je n'arrive jamais à le prendre.

Il faudrait orienter la ventouse vers le carton. Mais je ne connais pas sa position. Je veux donc une solution mécanique, qui s'adapte toute seule : un mécanisme souple, ou « compliant mechanism ».

## L'idée : trois principes

![Croquis des principes de l'actionneur au tableau blanc]({{ '/assets/img/projets/cdr-2027/2026-10-06-simulation-ventouse-cartons/tableau-principes.jpg' | relative_url }})
*Les principes de l'actionneur, au tableau blanc.*

1. **Une ventouse libre** : chaque ventouse peut bouger, rotuler et avancer ou reculer. Elle est fixée sur un support plan et souple, découpé ou imprimé en TPU.
2. **Un appui autour de la ventouse** : une fois la succion établie, il plaque le carton contre le bloc et le maintient.
3. **Des ventouses en triangle** : la ventouse centrale est décalée des deux autres. Lors d'une prise à l'horizontale, le bloc ne pend pas et ne se met pas dans une position inconnue.

## Pourquoi une simulation

Pour tester le bras complet, je voulais imprimer les pièces sur ma Bambu Lab A2L. Elle n'est pas encore arrivée : pas de quoi imprimer une grande pièce ni faire un assemblage en une soirée.

J'ai donc demandé à Claude, un outil d'IA, de construire une simulation physique paramétrable de mon idée. Je lui ai donné tous mes paramètres : ma modélisation de ventouse, celle du connecteur, et ce que je voulais vérifier.

## La simulation

Le banc d'essai reproduit un mur de 3 pierres (cartons de 320 × 110 × 110 mm) et une plaque qui porte 3 ventouses. On y retrouve les trois principes :

1. chaque ventouse est montée sur un ressort plat en TPU à trois bras en spirale ;
2. un appui rigide en PLA entoure chaque ventouse : sous vide, la pierre vient s'y poser ;
3. la ventouse du milieu peut être décalée sur le côté, pour une prise en triangle quand les 3 ventouses tiennent la même pierre.

On peut avancer la plaque, activer le vide ventouse par ventouse, lever, tourner, et voir les cartons bouger avec le frottement sur la table, entre cartons et sur le PLA. Tout est réglable : épaisseur et module du TPU, largeur et angle des bras, taille et retrait de l'appui, raideur et écrasement de la ventouse, dépression, masse des cartons. Trois séquences sont prêtes : prendre la pierre du haut à 3 ventouses, prendre le mur entier, dresser la pierre du haut.

{% include embed-html.html src="/assets/img/projets/cdr-2027/2026-10-06-simulation-ventouse-cartons/simulation.html" title="Banc d'essai : mur de 3 pierres et plaque à 3 ventouses" caption="Simulation interactive : faites tourner la vue, réglez les paramètres, lancez une séquence." height="720px" %}

Le résultat est très proche de ce que j'avais en tête, et le dépasse même sur certains points. J'ai pu tester beaucoup d'alignements et de réglages en peu de temps. Toute la simulation tient dans une seule page HTML d'environ 70 Ko, et elle fait exactement ce que je voulais.

## Ce que ça montre

L'idée fonctionne, au moins en simulation : en ajustant les paramètres autour de la ventouse, le préhenseur attrape le carton. Ça me laisse plus de marge pour explorer avant de fabriquer et de mettre en place la solution.

## Un regard critique sur l'outil

C'est impressionnant, et je n'aurais pas su faire ça moi-même en aussi peu de temps. Mais ça pose des questions.

- **Une simulation reste un modèle.** Elle valide l'idée dans un monde où le frottement, la raideur du TPU et la force de succion sont des valeurs que j'ai choisies. La page le dit elle-même, dans « Ce que le calcul suppose » : la raideur de la ventouse et le module du TPU sont des estimations à mesurer. Elle ne remplace pas l'essai réel : elle me dit quoi tester en premier.
- **Je n'ai pas écrit le moteur physique.** Je peux vérifier que le comportement est cohérent, pas que chaque calcul est juste. Il faut garder ça en tête avant de lui faire confiance.
- **Ça change la façon de travailler.** Avant, j'aurais soit prototypé directement, soit dû apprendre à monter le problème dans un moteur physique, un workflow que je n'ai pas. Ici, l'outil comble l'étape entre la validation théorique et la validation pratique. C'est un vrai gain, mais c'est aussi une compétence que je n'ai pas acquise moi-même.

Je l'ai utilisé parce que j'avais une idée précise et que je voulais la valider vite, sur un cas assez complexe pour voir où étaient les limites. Chacun est libre de réfléchir à l'usage de ces outils et à la place qu'on leur donne. La suite se joue sur la table, avec de vrais cartons.

## Prochaine étape

Imprimer le support souple en TPU, monter les ventouses en triangle et tester la prise sur de vrais cartons.
