---
published: false
title: Premiers essais en radiocommande
date: 2026-09-27
project: robot-omni
session: "2 h"
state: "à corriger"
next_step: "Calibrer chaque moteur, puis ajouter une courbe d'expo sur la rotation."
---

## Objectifs de la session

- [x] Lire les voies du récepteur RC
- [x] Appliquer le mixage sur les 4 moteurs
- [ ] Rouler en diagonale sans dériver

## Mixage des roues

```cpp
// x : latéral, y : avant, r : rotation (-1..1)
avantGauche   = y + x + r;
avantDroit    = y - x - r;
arriereGauche = y - x + r;
arriereDroit  = y + x - r;
```

## Problèmes relevés

1. Dérive en diagonale : un moteur tourne plus vite que les autres.
2. Rotation trop nerveuse autour du neutre.
