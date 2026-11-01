// Les données et les calculs de la page « carte principale 2024 », sans dessin.
// Rôle : tensions et consommateurs (lus dans le fichier KiCad MainBoard-2024 : signaux de chaque connecteur),
// chaîne de commande d'un moteur (cotes de la base holonome) et position des composants sur la carte (parts.json).
// Sorties : PARTS, RAILS, MOTOR (constantes), motorChain(v) (de la vitesse de roue à la fréquence des impulsions).
import PARTS_JSON from './parts.json';
import {G as BASE, RATIO} from '../base-holonome/kin.js';

/** Composants de la carte : valeur, face (F dessus, B dessous), boîte en mm (repère KiCad), signaux. */
export const PARTS = PARTS_JSON;

/**
 * Lignes d'alimentation, dans l'ordre du synoptique. reg : composant qui fabrique la tension (null : batterie après
 * le relais) ; refs : composants à montrer sur la carte ; loads : consommateurs, d'après les signaux de chaque
 * connecteur dans le fichier KiCad.
 */
export const RAILS = [
  {key: 'p24', volt: '22,2 V', name: 'Puissance', reg: null, refs: ['J5', 'J3', 'J6', 'J7', 'J16', 'J17'],
    loads: ['3 drivers moteurs (J5, J3, J6)', '3 sorties XT30 (J7, J16, J17)'],
    text: 'La tension de la batterie, après le relais, part telle quelle vers ce qui consomme le plus : les drivers des moteurs et les sorties de puissance XT30.'},
  {key: 'v5', volt: '5 V', name: '5 V', reg: 'U4', regName: 'R-78B5.0', refs: ['U4', 'U1', 'J12', 'J22', 'IHM-IO1', 'Con-TFT1'],
    loads: ['Teensy 3.5', 'lidar (J12), I2C (J22)', '3 capteurs, IHM, écran', 'logique des drivers'],
    text: 'Le régulateur U4 abaisse 22,2 V à 5 V pour l’électronique : Teensy, lidar, capteurs, IHM, écran, et la partie logique des drivers.'},
  {key: 'v12', volt: '12 V', name: '12 V', reg: 'U3', regName: 'R-78B12', refs: ['U3', 'J23', 'J28', 'J29'],
    loads: ['3 sorties 12 V (J23, J28, J29)'],
    text: 'Le régulateur U3 fournit 12 V sur trois sorties, pour des accessoires qui en ont besoin.'},
  {key: 'v33', volt: '3,3 V', name: '3,3 V', reg: 'U2', regName: 'R-78B3.3', refs: ['U2', 'J2', 'IHM-IO1', 'Con-TFT1'],
    loads: ['XBee (J2)', 'IHM, écran'],
    text: 'Le régulateur U2 fournit le 3,3 V du module radio XBee, de l’IHM et de l’écran.'},
  {key: 'v5p', volt: '5 V', name: '5 V servos', reg: 'PS1', regName: 'TEN 50-2411', refs: ['PS1', 'J20', 'J26', 'J27'],
    loads: ['servos des actionneurs (J20, J26, J27)'],
    text: 'Le convertisseur PS1 (TRACO TEN 50, 10 A) fournit un 5 V à part pour les servos. Le Teensy l’allume par le signal En5VP. Les servos appellent de fortes pointes de courant : sur leur propre alimentation, ils ne font pas chuter le 5 V du Teensy.'},
];

/** Chaîne de commande du moteur 1 : signaux du fichier KiCad, cotes du CAO de la base. */
export const MOTOR = {
  conn: 'J5', label: 'Stepper 1', step: 'STEP_1', dir: 'DIR_1', en: 'EN',
  stepsPerTurn: 200,          // NEMA 23, 1,8° par pas
  micro: 16,                  // micro-pas du driver : réglage supposé, exemple
  ratio: RATIO,               // poulies 14 / 28 dents
  wheelR: BASE.wheel.r,       // roue ø60
};

/** De la vitesse au sol d'une roue (mm/s) à la vitesse du moteur et à la fréquence des impulsions STEP. */
export function motorChain(v) {
  const wheelRps = v / (2 * Math.PI * MOTOR.wheelR);
  const motorRps = wheelRps * MOTOR.ratio;
  const pulsesPerTurn = MOTOR.stepsPerTurn * MOTOR.micro;
  return {
    v,
    wheelRpm: wheelRps * 60,
    motorRpm: motorRps * 60,
    hz: Math.abs(motorRps * pulsesPerTurn),
    dir: v >= 0 ? 1 : 0,
    degPerPulse: 360 / pulsesPerTurn,
    mmPerPulse: (2 * Math.PI * MOTOR.wheelR) / (pulsesPerTurn * MOTOR.ratio),
    pulsesPerTurn,
  };
}

/**
 * Rôle de chaque composant, écrit d'après le schéma KiCad (symbole, valeur, boîtier, broches et signaux) et la
 * sérigraphie. Une valeur absente du schéma est dite absente.
 */
export const ROLES = {
  J1: 'Entrée batterie, XT60 mâle. Broche 2 : +BATT ; broche 1 : masse.',
  F1: 'Fusible lame mini sur porte-fusible Keystone 3568, 5 A d\'après la sérigraphie. Entre +BATT et /24VD.',
  K2: 'Relais Finder 36.11 à un inverseur. Bobine entre A1 et A2 ; commun 11 sur /24VD ; contact travail 14 vers +24V ; contact repos 12 non câblé.',
  D4: 'Diode de roue libre de la bobine de K2 : cathode sur /24VD, anode sur A1.',
  J21: 'Connecteur du bouton d\'arrêt d\'urgence (Molex KK 396, 2 broches) : borne A1 de la bobine et masse.',
  U4: 'Régulateur à découpage Recom R-78B5.0-2.0 : de +24V à +5V, 2 A. Broches : 1 IN, 2 GND, 3 OUT.',
  U3: 'Régulateur à découpage Recom R-78B12-2.0 : de +24V à +12V, 2 A. Broches : 1 IN, 2 GND, 3 OUT.',
  U2: 'Régulateur à découpage Recom R-78B3.3-2.0 : de +24V à +3V3, 2 A. Broches : 1 IN, 2 GND, 3 OUT.',
  C1: 'Condensateur électrolytique 22 µF à l\'entrée de U4 (5 V).',
  C2: 'Condensateur électrolytique 22 µF à l\'entrée de U3 (12 V).',
  C7: 'Condensateur électrolytique 22 µF à l\'entrée de U2 (3,3 V).',
  D2: 'Diode entre la sortie et l\'entrée de U4, cathode sur +24V : si l\'entrée tombe plus vite que la sortie, le courant contourne le régulateur au lieu de le traverser à l\'envers.',
  D9: 'Diode entre la sortie et l\'entrée de U3, cathode sur +24V : même protection que D2.',
  D7: 'Diode entre la sortie et l\'entrée de U2, cathode sur +24V : même protection que D2.',
  PS1: 'Convertisseur TRACO TEN 50-2411 : de +24V à +5VP, 10 A (50 W). +VIN, −VIN ; ON/OFF sur En5VP (broche 13 du Teensy) ; +VOUT sur +5VP ; TRIM non câblé.',
  C6: 'Condensateur électrolytique 220 µF en sortie du 5 V servos (+5VP).',
  J20: 'Sortie 5 V servos (+5VP), Molex KK 396.', J26: 'Sortie 5 V servos (+5VP), Molex KK 396.', J27: 'Sortie 5 V servos (+5VP), Molex KK 396.',
  J7: 'Sortie de puissance +24V, XT30.', J16: 'Sortie de puissance +24V, XT30.', J17: 'Sortie de puissance +24V, XT30.',
  J4: 'Sortie +5V, Molex KK 254.', J9: 'Sortie +5V, Molex KK 254.', J10: 'Sortie +5V, Molex KK 254.',
  J23: 'Sortie +12V, Molex KK 254.', J28: 'Sortie +12V, Molex KK 254.', J29: 'Sortie +12V, Molex KK 254.',
  D5: 'LED témoin de +BATT, en série avec R3.', D1: 'LED témoin de +24V (relais fermé), en série avec R1.',
  D3: 'LED témoin de +5V, en série avec R2.', D10: 'LED témoin de +12V, en série avec R5.',
  D8: 'LED témoin de +3V3, en série avec R17.', D6: 'LED témoin de +5VP, en série avec R4.',
  R3: 'Résistance de la LED D5 ; valeur non renseignée dans le schéma.', R1: 'Résistance de la LED D1 ; valeur non renseignée dans le schéma.',
  R2: 'Résistance de la LED D3 ; valeur non renseignée dans le schéma.', R5: 'Résistance de la LED D10 ; valeur non renseignée dans le schéma.',
  R17: 'Résistance de la LED D8 ; valeur non renseignée dans le schéma.', R4: 'Résistance de la LED D6 ; valeur non renseignée dans le schéma.',
  U1: 'Teensy 3.5, enfiché sur la carte. Il reçoit +5V sur Vin et génère tous les signaux de commande.',
  J5: 'Driver du moteur 1 (Stepper 1), Molex KK 254 à 6 broches : 1 DIR_1, 2 STEP_1, 3 EN, 4 GND, 5 +5V, 6 +24V.',
  J3: 'Driver du moteur 2 (Stepper 2), Molex KK 254 à 6 broches : 1 DIR_2, 2 STEP_2, 3 EN, 4 GND, 5 +5V, 6 +24V.',
  J6: 'Driver du moteur 3 (Stepper 3), Molex KK 254 à 6 broches : 1 DIR_3, 2 STEP_3, 3 EN, 4 GND, 5 +5V, 6 +24V.',
};
