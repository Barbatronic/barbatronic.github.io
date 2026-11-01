---
published: true
title: "Guide de montage"
project: mini-robotic-table
date: 2024-05-07
order: 1
description: "Imprimer les pièces, monter coins et pieds, percer et poser les bordures, ranger pour le transport"
---
{%- assign i = '/assets/img/projets/mini-robotic-table/' | relative_url -%}

La table se monte en quatre temps : les coins, les pieds, le rangement sous le plateau, puis les bordures.
Tous les fichiers sont dans le dépôt [MiniRoboticTable](https://github.com/Barbatronic/MiniRoboticTable) :
pièces imprimées dans `3DPrint/`, gabarits de perçage dans `drawings/`, modèle complet dans `MiniRoboticTable.FCStd`.

![Toutes les pièces : quatre coins imprimés, pieds en tourillons et leurs bagues]({{ i }}pieces-et-pieds.jpg)
*Le kit avant montage : quatre coins, les pieds en tourillons et leurs bagues.*

## Ce qu'il faut

| Pièce | Fichier | Rôle |
|---|---|---|
| Coin (×4) | `Coin.3mf` | Bloc d'angle serré sur le plateau, reçoit le pied |
| Jonction de pied | `JonctionPied_27mm.3mf`, `JonctionPied_39mm.3mf` | Bagues qui tiennent les tourillons dans les coins |
| Clip de pied | `ClipPied_27mm.3mf` | Range les pieds sous le plateau |
| Clip de sangle | `ClipSangle.3mf` | Attache d'une sangle de transport |
| Clip de bordure | `ClipBordure_18mm.3mf` | Tient les bordures de 18 mm |
| Côté | `Side.3mf` | Pièce latérale, voir le modèle FreeCAD |

À côté des pièces imprimées :

- un plateau en contreplaqué ;
- des tourillons en bois pour les pieds ;
- des planches de pin de 18 mm pour les bordures ;
- de la visserie, avec des inserts filetés dans les coins ;
- un vinyle de jeu : ceux des éditions passées sont dans les [archives des coupes](https://github.com/Barbatronic/archives-coupes).

Outils : imprimante 3D, perceuse, foret et fraise conique, pointeau et marteau, colle en bâton.

## Montage

<ol class="steps">
<li>
  <div class="step-text">
    <h3>Imprimer les pièces</h3>
    <p>Imprimer les fichiers du dossier <code>3DPrint/</code>.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}impression-1.jpg"><img src="{{ i }}impression-1.jpg" alt="Impression 3D d'une pièce" loading="lazy"></a>
    <a href="{{ i }}impression-2.jpg"><img src="{{ i }}impression-2.jpg" alt="Pièce en cours d'impression sur le plateau de l'imprimante" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Serrer les coins sur le plateau</h3>
    <p>Chaque coin vient pincer un angle du plateau : le bloc dessus, la semelle dessous, et des vis de serrage sur les côtés.</p>
    <p>Le trou central reçoit le pied.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}coin-gris.jpg"><img src="{{ i }}coin-gris.jpg" alt="Coin gris serré sur un angle du plateau" loading="lazy"></a>
    <a href="{{ i }}coin-jaune.jpg"><img src="{{ i }}coin-jaune.jpg" alt="Coin jaune serré sur un angle du plateau, vis de serrage visibles" loading="lazy"></a>
    <a href="{{ i }}coin-dessus.jpg"><img src="{{ i }}coin-dessus.jpg" alt="Coin vu de dessus, inserts filetés visibles" loading="lazy"></a>
    <a href="{{ i }}plateau-coins.jpg"><img src="{{ i }}plateau-coins.jpg" alt="Plateau avec ses quatre coins" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Poser les pieds</h3>
    <p>Glisser la bague de jonction sur le tourillon, puis emboîter le pied dans le trou du coin.</p>
    <p>Retourner la table : elle tient sur ses quatre pieds.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}coin-pied-1.jpg"><img src="{{ i }}coin-pied-1.jpg" alt="Coin et son pied, vus de côté" loading="lazy"></a>
    <a href="{{ i }}coin-pied-2.jpg"><img src="{{ i }}coin-pied-2.jpg" alt="Pied emboîté dans un coin, bague de jonction visible" loading="lazy"></a>
    <a href="{{ i }}coin-pied-3.jpg"><img src="{{ i }}coin-pied-3.jpg" alt="Pieds en place dans les coins gris et jaune" loading="lazy"></a>
    <a href="{{ i }}coin-dessous.jpg"><img src="{{ i }}coin-dessous.jpg" alt="Dessous d'un coin : semelle jaune et passages de sangle" loading="lazy"></a>
    <a href="{{ i }}table-debout.jpg"><img src="{{ i }}table-debout.jpg" alt="Table montée sur ses quatre pieds" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Ranger les pieds sous le plateau</h3>
    <p>Pour le transport, les pieds se démontent et se clipsent sous le plateau, deux par deux, dans les clips de pied.</p>
    <p>Le plateau part ensuite à plat dans le coffre, coins et pieds compris.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}rangement-pied.jpg"><img src="{{ i }}rangement-pied.jpg" alt="Deux tourillons clipsés sous le plateau" loading="lazy"></a>
    <a href="{{ i }}rangement-2.jpg"><img src="{{ i }}rangement-2.jpg" alt="Pieds rangés dans leurs clips, vus de dessus" loading="lazy"></a>
    <a href="{{ i }}rangement-complet.jpg"><img src="{{ i }}rangement-complet.jpg" alt="Dessous du plateau avec tous les pieds et clips en place" loading="lazy"></a>
    <a href="{{ i }}coffre.jpg"><img src="{{ i }}coffre.jpg" alt="Plateau à plat dans le coffre d'une voiture" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Coller les gabarits sur les bordures</h3>
    <p>Imprimer les gabarits <code>Bordure-100</code> et <code>Bordure-70</code> du dossier <code>drawings/</code> à l'échelle 1, sans ajustement à la page. Chaque longueur a deux gabarits, <code>-01</code> et <code>-02</code>.</p>
    <p>Les coller au bout de chaque planche, bord du gabarit aligné sur le bord de la planche.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}bordures.jpg"><img src="{{ i }}bordures.jpg" alt="Planches de pin posées sur le plateau" loading="lazy"></a>
    <a href="{{ i }}gabarits.jpg"><img src="{{ i }}gabarits.jpg" alt="Gabarits de perçage imprimés" loading="lazy"></a>
    <a href="{{ i }}gabarits-colles.jpg"><img src="{{ i }}gabarits-colles.jpg" alt="Gabarits et colle en bâton sur une planche" loading="lazy"></a>
    <a href="{{ i }}gabarit-colle.jpg"><img src="{{ i }}gabarit-colle.jpg" alt="Gabarits collés aux extrémités des planches" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Pointer, percer, fraiser</h3>
    <p>Marquer chaque croix au pointeau, percer, puis fraiser l'entrée du trou pour noyer la tête de vis.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}pointage.jpg"><img src="{{ i }}pointage.jpg" alt="Pointage d'une croix du gabarit au pointeau" loading="lazy"></a>
    <a href="{{ i }}percage.jpg"><img src="{{ i }}percage.jpg" alt="Perçage d'une bordure" loading="lazy"></a>
    <a href="{{ i }}percage-fini.jpg"><img src="{{ i }}percage-fini.jpg" alt="Bordures percées" loading="lazy"></a>
    <a href="{{ i }}fraisage.jpg"><img src="{{ i }}fraisage.jpg" alt="Fraisage d'un trou à la perceuse" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Poser le vinyle et les bordures</h3>
    <p>Dérouler le vinyle de jeu sur le plateau, puis fixer les quatre bordures. La table est prête.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}vinyle.jpg"><img src="{{ i }}vinyle.jpg" alt="Vinyle de jeu déroulé sur le plateau" loading="lazy"></a>
    <a href="{{ i }}table-finie.jpg"><img src="{{ i }}table-finie.jpg" alt="Table finie : bordures en pin et vinyle 2024" loading="lazy"></a>
    <a href="{{ i }}coffre-vinyle.jpg"><img src="{{ i }}coffre-vinyle.jpg" alt="Plateau et vinyle à plat dans le coffre" loading="lazy"></a>
  </div>
</li>
</ol>
