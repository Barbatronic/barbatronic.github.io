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
