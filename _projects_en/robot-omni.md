---
published: true
title: Omnidirectional RC robot
code: P-01
description: "Four-wheel omnidirectional robot, radio controlled."
status: en-cours
updated: 2026-09-18   # tri de /projets/ : dernier commit
tags: [robotique, electronique]
stack: [ESP32-S3, PlatformIO, SBUS, FreeCAD, KiCad]
featured: true
featured_order: 1
repo: https://github.com/Barbatronic/Omni-RC-Robot
image: ""
image_caption: ""
links: []
---

Radio-controlled robot with four omnidirectional wheels.

Architecture planned in the firmware specification:

- Freenove ESP32-S3 WROOM board;
- radio receiver over SBUS;
- 4 DC motors, each driven by a BTS7960 (IBT-2) driver;
- 4 omnidirectional wheels, in a roughly 60° layout that stays configurable in software;
- web interface hosted on the ESP32-S3.

Target moves: translation in any direction, rotation in place, and translation combined with rotation.

The repository holds the FreeCAD mechanics (omni wheel, motor hub, drive arm, BTS7960 mount, battery, emergency stop), the `omni-board` KiCad board and the firmware.
