---
published: true
title: "Kairn"
code: P-16
description: "Application de suivi sportif open source, locale : pas de compte, pas de télémétrie."
status: en-cours
updated: 2026-10-05   # tri de /projets/ : dernier commit
tags: [logiciel, open-source]
stack: [TypeScript, Expo, Node.js]
featured: false
featured_order: 99
repo: "https://github.com/nadarbreicq/kairn"
image: "/assets/img/projets/kairn/cover.jpg"
image_caption: "Kairn sur Android : accueil, enregistrement, analyse, progression"
links:
  - { label: "Télécharger (Releases)", url: "https://github.com/nadarbreicq/kairn/releases" }
  - { label: "Kairn en images", url: "https://github.com/nadarbreicq/kairn/blob/main/docs/captures.md" }
---

Un cairn est un tas de pierres posé sur un chemin pour indiquer la voie. **Kairn** est une application de suivi sportif (course, vélo, randonnée, trail, marche) qui garde les séances sur le téléphone : pas de compte à créer, pas de télémétrie, pas de serveur qui reçoit les données.

**Kairn Desk** est le complément sur ordinateur : il affiche les séances en grand en lisant le dossier où le téléphone les a écrites.

## Ce que Kairn garantit

- **Rien ne quitte le téléphone sans un geste explicite.** Les séances sont écrites en local ; les exporter est toujours une action volontaire.
- **Le GPS fonctionne hors ligne.** L'enregistrement n'ouvre aucune connexion. Seul le fond de carte (OpenStreetMap) se télécharge, puis reste en cache ; il se désactive dans les réglages.
- **Tout est open source**, sans Google Play Services : le GPS passe par un petit module natif propre au projet.
- **Un fichier GPX par séance.** C'est la seule « base de données » : on peut lire, copier ou sauvegarder ses séances avec n'importe quel outil.

![Les trois écrans de bienvenue de Kairn]({{ '/assets/img/projets/kairn/premier-lancement.jpg' | relative_url }})
*Au premier lancement : les données restent sur le téléphone, le GPS fonctionne hors ligne, on choisit où ranger les séances.*

## Enregistrer une sortie

L'accueil résume la semaine (distance, temps, dénivelé) et liste les séances avec leur tracé. On choisit l'activité, on démarre : l'enregistrement continue écran verrouillé, avec une vue chiffres et une vue carte.

![Accueil, nouvelle séance et enregistrement en cours]({{ '/assets/img/projets/kairn/enregistrement.jpg' | relative_url }})
*Accueil, préparation de la séance, enregistrement en cours (chiffres et carte).*

## Analyser et suivre sa progression

Après la sortie, l'analyse découpe la séance en segments (pas automatique ou choisi), trace le profil d'altitude et la répartition du temps par zone de vitesse. L'historique montre les semaines, la tendance du volume et la progression par sport avec les meilleures performances.

![Résumé de séance, allure par segment, altitude et vitesse]({{ '/assets/img/projets/kairn/analyse.jpg' | relative_url }})
*Résumé de la séance, allure par segment, altitude et zones de vitesse.*

![Historique par semaines, tendance et progression]({{ '/assets/img/projets/kairn/historique.jpg' | relative_url }})
*Historique : semaines, tendance du volume, progression.*

## Kairn Desk

Un petit serveur local (Node.js) et une page web sur `localhost` : liste des séances par semaine, trace sur fond de carte, allure par segment, altitude, export GPX, GeoJSON ou CSV. Rien n'est envoyé sur Internet, et fermer le terminal l'arrête.

![Kairn Desk : liste des séances et détail d'un trail]({{ '/assets/img/projets/kairn/kairn-desk.jpg' | relative_url }})
*Kairn Desk : la liste des séances et le détail d'un trail.*

## Installer

Kairn n'est pas sur le Play Store. L'APK de chaque version est publié sur la [page des Releases](https://github.com/nadarbreicq/kairn/releases) ; les versions suivantes se proposent ensuite d'elles-mêmes dans l'app, sans perdre les séances. Kairn Desk se lance depuis le dépôt avec `npm install` puis `npm run desk:dev`.

Les séances visibles sur les captures sont synthétiques : des boucles calculées autour d'un point fictif, jamais une vraie sortie.
