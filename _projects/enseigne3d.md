---
published: true
title: "Enseigne3D"
code: P-29
description: "Générateur d'enseignes en relief à imprimer en 3D : un texte, une police, et des blocs multicolores prêts à visser."
status: open-source
updated: 2026-10-21   # tri de /projets/ : dernier commit
tags: [impression-3d, logiciel, open-source]
stack: [JavaScript, manifold-3d, three.js, opentype.js]
featured: false
featured_order: 99
repo: "https://github.com/Barbatronic/enseigne3d"
image: "/assets/img/projets/enseigne3d/cover.jpg"
image_caption: "Enseigne3D : texte, couleurs par lettre et aperçu 3D des blocs"
links:
  - { label: "Utiliser Enseigne3D", url: "https://barbatronic.fr/enseigne3d/" }
---

**Enseigne3D** génère des enseignes en relief à imprimer en 3D, directement dans le navigateur. On tape un texte, on choisit une police, et l'outil découpe l'enseigne en blocs qui tiennent sur le plateau de l'imprimante, prêts à assembler et à fixer au mur.

**[Utiliser Enseigne3D](https://barbatronic.fr/enseigne3d/)** · [code source sur GitHub](https://github.com/Barbatronic/enseigne3d)

## Ce que fait l'outil

- **Lettres multicolores** incrustées à fleur de la face, une pièce par couleur. On clique une lettre pour changer sa couleur.
- **Découpe automatique** selon la taille du plateau. La coupe contourne les lettres et ne les traverse jamais. On peut aussi couper ou joindre à la main entre deux lettres.
- **Jonctions vissées M3** avec renforts, trous et logements d'écrou.
- **Liaison entre les mots** : une plaque imprimée à plat, encastrée et vissée au dos des deux mots.
- **Fixation murale alignée** : trous de serrure, crochets ou plots double face, avec les cotes de perçage.
- **Enseigne drapeau** double face, perpendiculaire au mur, fixée par tiges filetées M6.
- **Flèche**, **chanfrein** sur la face visible, police personnalisée (`.ttf`, `.otf`, `.woff`).

Toutes les pièces s'impriment face contre le plateau, sans support.

Les réglages sont enregistrés dans le navigateur et retrouvés à la prochaine ouverture ; *Réinitialiser* revient aux valeurs par défaut. Thème clair ou sombre au choix.

## Exports

STL par pièce, 3MF par bloc et 3MF multi-plateaux, avec un filament par couleur, à ouvrir dans OrcaSlicer ou Bambu Studio (*Fichier > Ouvrir un projet*).

## Sous le capot

Pas de compilation : modules JavaScript natifs. La géométrie passe par [manifold-3d](https://github.com/elalish/manifold), les polices par opentype.js, l'aperçu par three.js. Le calcul tourne dans un Web Worker. Des tests automatiques vérifient à chaque push que chaque pièce est un solide fermé, que chaque vis a son trou et que les plateaux ne débordent pas. Licence MIT.
