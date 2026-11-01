---
published: true
title: "La transformation en photos"
project: ender2-pocket-edition
date: 2024-04-01
order: 1
description: "Démontage de l'Ender 2 Pro, électronique sous le plateau, carters laser et chaînes porte-câbles"
---
{%- assign i = '/assets/img/projets/ender2-pocket-edition/' | relative_url -%}

La base est une Creality Ender 2 Pro. Les fichiers sont dans le dépôt
[Ender2-Pocket-Edition](https://github.com/Barbatronic/Ender2-Pocket-Edition) :
pièces imprimées dans `3d-print/`, découpe laser dans `laser/`, modèle complet dans `Ender2-Pocket-Edition.FCStd`.

![L'imprimante en cours de transformation sur l'établi]({{ i }}etabli.jpg)
*En cours de transformation sur l'établi.*

<ol class="steps">
<li>
  <div class="step-text">
    <h3>Démonter l'électronique d'origine</h3>
    <p>Libérer les faisceaux gainés, sortir la carte mère de son boîtier et récupérer le ventilateur.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}faisceau-1.jpg"><img src="{{ i }}faisceau-1.jpg" alt="Faisceaux gainés le long du boîtier d'origine" loading="lazy"></a>
    <a href="{{ i }}faisceau-2.jpg"><img src="{{ i }}faisceau-2.jpg" alt="Collier et passage de faisceau" loading="lazy"></a>
    <a href="{{ i }}carte-sortie.jpg"><img src="{{ i }}carte-sortie.jpg" alt="Carte mère sortie de son boîtier" loading="lazy"></a>
    <a href="{{ i }}ventilateur.jpg"><img src="{{ i }}ventilateur.jpg" alt="Ventilateur dans le fond du boîtier" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Loger l'électronique sous le plateau</h3>
    <p>La carte mère prend place dans le nouveau boîtier imprimé (<code>MainBox</code>), sous le plateau chauffant.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}carte-cablage.jpg"><img src="{{ i }}carte-cablage.jpg" alt="Carte mère et câblage avant intégration" loading="lazy"></a>
    <a href="{{ i }}carte-base.jpg"><img src="{{ i }}carte-base.jpg" alt="Carte mère installée dans la base, sous le plateau" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Habiller avec la façade et les carters</h3>
    <p>Façade, carters et caches découpés au laser dans du 3 mm. L'écran et le bouton de commande restent en façade.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}facade.jpg"><img src="{{ i }}facade.jpg" alt="Façade rouge avec écran et bouton de commande" loading="lazy"></a>
    <a href="{{ i }}bobine.jpg"><img src="{{ i }}bobine.jpg" alt="Imprimante avec façade et support de bobine" loading="lazy"></a>
  </div>
</li>
<li>
  <div class="step-text">
    <h3>Guider les câbles et finir</h3>
    <p>Des chaînes porte-câbles guident les faisceaux. Le carter du ventilateur, au logo K, termine la tête.</p>
  </div>
  <div class="step-media">
    <a href="{{ i }}chaine.jpg"><img src="{{ i }}chaine.jpg" alt="Chaîne porte-câbles de l'axe Z" loading="lazy"></a>
    <a href="{{ i }}ventilateur-k.jpg"><img src="{{ i }}ventilateur-k.jpg" alt="Carter de ventilateur au logo K" loading="lazy"></a>
    <a href="{{ i }}finie-2.jpg"><img src="{{ i }}finie-2.jpg" alt="Imprimante terminée, vue de face" loading="lazy"></a>
    <a href="{{ i }}finie-3.jpg"><img src="{{ i }}finie-3.jpg" alt="Imprimante terminée sur l'établi" loading="lazy"></a>
    <a href="{{ i }}finie-5.jpg"><img src="{{ i }}finie-5.jpg" alt="Imprimante terminée, vue de trois quarts" loading="lazy"></a>
  </div>
</li>
</ol>
