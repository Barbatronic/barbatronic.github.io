---
published: true
title: "Ender 2 Pocket Edition"
code: P-30
description: "Une Ender 2 Pro reconditionnée dans un boîtier plus compact : une imprimante 3D transportable."
status: termine
updated: 2024-04-01   # tri de /projets/ : dernier commit
tags: [impression-3d, open-source]
stack: [FreeCAD, impression 3D, découpe laser]
featured: false
featured_order: 99
repo: "https://github.com/Barbatronic/Ender2-Pocket-Edition"
image: "/assets/img/projets/ender2-pocket-edition/finie-4.jpg"
image_caption: "L'Ender 2 Pocket Edition terminée"
links: []
---

Une Creality Ender 2 Pro démontée puis remontée dans un boîtier plus compact, pour l'emporter facilement et l'installer sur un petit bureau.

## Ce qui change

- **L'électronique passe sous le plateau**, dans un boîtier imprimé en 3D.
- **Des carters et une façade en découpe laser** (3 mm) habillent le boîtier.
- **Des chaînes porte-câbles** guident les faisceaux des axes.
- **Un adaptateur de carte SD** ramène le lecteur en façade, et un support de bobine se fixe sur la machine.

<div class="gallery">
  <figure><img src="{{ '/assets/img/projets/ender2-pocket-edition/finie-1.jpg' | relative_url }}" alt="Ender 2 Pocket Edition vue de face" loading="lazy"><figcaption>De face</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/ender2-pocket-edition/ventilateur-k.jpg' | relative_url }}" alt="Carter de ventilateur rouge au logo K" loading="lazy"><figcaption>Carter de ventilateur</figcaption></figure>
  <figure><img src="{{ '/assets/img/projets/ender2-pocket-edition/chaine.jpg' | relative_url }}" alt="Chaîne porte-câbles de l'axe Z" loading="lazy"><figcaption>Chaîne porte-câbles</figcaption></figure>
</div>

Les étapes de la transformation sont dans la documentation du projet : [la transformation en photos]({{ '/projets/ender2-pocket-edition/transformation/' | relative_url }}).

## Dans le dépôt

- `Ender2-Pocket-Edition.FCStd` : le modèle FreeCAD complet ;
- `3d-print/` : boîtier, rallonge, adaptateur SD, support de bobine, glissière de chaîne ;
- `laser/` : façade et carters à découper en 3 mm ;
- `firmware/` : le firmware Creality Ender 2 Pro utilisé.

![Modèle FreeCAD de l'Ender 2 Pocket Edition]({{ '/assets/img/projets/ender2-pocket-edition/modele-3d.png' | relative_url }})
*Le modèle FreeCAD.*
