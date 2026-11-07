import type { EquipmentCard, WeaponProfile } from '../../domain/types';

/**
 * Carte di Rio Z Janeiro trascritte dalle fotografie dell'utente (07/11/2026):
 * 6 Equipaggiamento di Partenza Avanzato e 12 Armi Pimpate Avanzate.
 * Simboli letti come nel regolamento di Rio (pag. 5-7): "+N" = dadi Al Massimo,
 * lucchetto = Conservazione, cerchio con zombie = Generazione a Sorpresa.
 */
const m = (range: string, dice: number, accuracy: string, damage: number, noisy: boolean): WeaponProfile => ({ kind: 'mischia', range, dice, accuracy, damage, noisy });
const auto = (range: string, dice: number, accuracy: string, damage: number, noisy: boolean): WeaponProfile => ({ kind: 'auto', range, dice, accuracy, damage, noisy });
const d = (range: string, dice: number, accuracy: string, damage: number, noisy: boolean): WeaponProfile => ({ kind: 'distanza', range, dice, accuracy, damage, noisy });

type Row = Omit<EquipmentCard, 'universeId' | 'productId' | 'dataStatus' | 'origin' | 'quantity'> & { quantity?: number };

const rows: Row[] = [
  // Equipaggiamento di Partenza Avanzato (retro grigio): nessun valore di Conservazione.
  { id: 'rio-asse-di-legno', deck: 'partenza', category: 'arma', name: 'Asse di legno', maxDice: 1, profiles: [m('0', 2, '3+', 1, true)] },
  { id: 'rio-piede-di-porco', deck: 'partenza', category: 'arma', name: 'Piede di porco', maxDice: 1, opensDoors: 'silenziosa', profiles: [m('0', 1, '4+', 1, false)] },
  { id: 'rio-ascia-antincendio', deck: 'partenza', category: 'arma', name: 'Ascia antincendio', maxDice: 1, opensDoors: 'rumorosa', profiles: [m('0', 1, '4+', 2, false)] },
  { id: 'rio-38', deck: 'partenza', category: 'arma', name: '.38', quantity: 3, maxDice: 1, dual: true, ammo: 'proiettili', profiles: [d('0-1', 2, '5+', 1, true)] },

  // Armi Pimpate Avanzate (retro rosso)
  { id: 'rio-kukri-dorato', deck: 'arma-pimpata', category: 'arma', name: 'Kukri dorato', maxDice: 2, conservation: 6, surpriseSpawn: true, profiles: [m('0', 4, '4+', 2, false)] },
  { id: 'rio-colt-ar-15', deck: 'arma-pimpata', category: 'arma', name: 'Colt AR-15', maxDice: 2, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', profiles: [d('1-2', 3, '3+', 1, true)] },
  { id: 'rio-amor-de-mae', deck: 'arma-pimpata', category: 'arma', name: 'Amor de Mãe', maxDice: 3, conservation: 6, surpriseSpawn: true, ammo: 'cartucce', text: 'Colpo Doppio. Ricarica.', profiles: [d('0-1', 2, '3+', 2, true), m('0', 1, '3+', 2, false)] },
  { id: 'rio-rpg', deck: 'arma-pimpata', category: 'arma', name: 'RPG', maxDice: 3, conservation: 6, surpriseSpawn: true, text: 'Devi scartare 1 Munizione RPG per ogni Attacco.', profiles: [d('1-3', 3, '2+', 4, true)] },
  { id: 'rio-gemelle-malvagie', deck: 'arma-pimpata', category: 'arma', name: 'Gemelle malvagie', maxDice: 1, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', profiles: [d('0-1', 2, '3+', 1, true)] },
  { id: 'rio-fucile-da-cecchino-dell-esercito', deck: 'arma-pimpata', category: 'arma', name: "Fucile da cecchino dell'esercito", maxDice: 1, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', text: 'Cecchino.', profiles: [d('1-4', 2, '3+', 2, true)] },
  { id: 'rio-katana-pregiata', deck: 'arma-pimpata', category: 'arma', name: 'Katana pregiata', maxDice: 2, conservation: 6, surpriseSpawn: true, profiles: [m('0', 2, '3+', 2, false)] },
  { id: 'rio-ak-47-dorato', deck: 'arma-pimpata', category: 'arma', name: 'AK-47 dorato', maxDice: 3, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', profiles: [d('1-2', 3, '4+', 2, true)] },
  { id: 'rio-shotgun-automatico', deck: 'arma-pimpata', category: 'arma', name: 'Shotgun automatico', maxDice: 3, conservation: 6, surpriseSpawn: true, ammo: 'cartucce', profiles: [d('0-1', 3, '4+', 2, true)] },
  // Equipaggiamento Avanzato (retro azzurro): prima foto, 20 carte diverse, verificate dall'utente. Copie da indicare.
  { id: 'rio-av-tubo-di-ferro', deck: 'avanzato', category: 'arma', name: 'Tubo di ferro', maxDice: 1, conservation: 3, surpriseSpawn: true, profiles: [m('0', 1, '2+', 1, false)] },
  { id: 'rio-av-te-mate', deck: 'avanzato', category: 'oggetto', name: 'Tè mate', text: 'Scarta questa carta per ottenere 2 Azioni extra. Può essere usata nello Zaino.' },
  { id: 'rio-av-molotov', deck: 'avanzato', category: 'arma', name: 'Molotov', conservation: 5, surpriseSpawn: true, profiles: [{ kind: 'distanza', range: '1-1', noisy: true }], text: 'Scarta dalla Mano: Elimina tutti i Personaggi nella Zona bersagliata.' },
  { id: 'rio-av-cartucce-a-volonta', deck: 'avanzato', category: 'oggetto', name: 'Cartucce a volontà', text: 'Puoi ripetere una volta il tiro di tutti gli attacchi con le armi a cartucce. Il nuovo risultato sostituisce il precedente. Può essere usata nello Zaino.' },
  { id: 'rio-av-proiettili-a-volonta', deck: 'avanzato', category: 'oggetto', name: 'Proiettili a volontà', text: 'Puoi ripetere una volta il tiro di tutti gli attacchi con le armi a proiettili. Il nuovo risultato sostituisce il precedente. Può essere usata nello Zaino.' },
  { id: 'rio-av-38', deck: 'avanzato', category: 'arma', name: '.38', maxDice: 1, conservation: 3, dual: true, ammo: 'proiettili', profiles: [d('0-1', 2, '5+', 1, true)] },
  { id: 'rio-av-biscoito-plano', deck: 'avanzato', category: 'oggetto', name: 'Biscoito Plano', text: 'Scarta questa carta: Ottieni 3 PA OPPURE Cura 1 e scarta una carta Ferita. Può essere usata nello Zaino.' },
  { id: 'rio-av-katana', deck: 'avanzato', category: 'arma', name: 'Katana', maxDice: 2, conservation: 3, dual: true, profiles: [m('0', 2, '4+', 1, false)] },
  { id: 'rio-av-machete', deck: 'avanzato', category: 'arma', name: 'Machete', maxDice: 1, conservation: 3, dual: true, profiles: [m('0', 1, '3+', 2, false)] },
  { id: 'rio-av-munizione-rpg', deck: 'avanzato', category: 'oggetto', name: 'Munizione RPG', text: "Munizione per l'RPG. Si applica il Fuoco Amico. Dopo l'uso, rimescola questa carta nel mazzo Equipaggiamento. Può essere usata nello Zaino." },
  { id: 'rio-av-motosega', deck: 'avanzato', category: 'arma', name: 'Motosega', maxDice: 3, conservation: 5, surpriseSpawn: true, opensDoors: 'rumorosa', profiles: [m('0', 5, '5+', 2, true)] },
  { id: 'rio-av-piede-di-porco', deck: 'avanzato', category: 'arma', name: 'Piede di porco', maxDice: 1, conservation: 3, opensDoors: 'silenziosa', profiles: [m('0', 1, '4+', 1, false)] },
  { id: 'rio-av-kukri', deck: 'avanzato', category: 'arma', name: 'Kukri', maxDice: 2, conservation: 4, profiles: [m('0', 2, '4+', 2, false)] },
  { id: 'rio-av-canne-mozze', deck: 'avanzato', category: 'arma', name: 'Canne mozze', maxDice: 2, conservation: 4, dual: true, ammo: 'cartucce', text: 'Ricarica.', profiles: [d('0-1', 2, '3+', 1, true)] },
  { id: 'rio-av-lama-di-fortuna', deck: 'avanzato', category: 'arma', name: 'Lama di fortuna', maxDice: 1, conservation: 4, profiles: [m('0', 2, '3+', 1, false)] },
  { id: 'rio-av-shotgun', deck: 'avanzato', category: 'arma', name: 'Shotgun', maxDice: 2, conservation: 5, surpriseSpawn: true, ammo: 'cartucce', profiles: [d('0-1', 2, '4+', 2, true)] },
  { id: 'rio-av-fucile-da-cecchino', deck: 'avanzato', category: 'arma', name: 'Fucile da cecchino', maxDice: 1, conservation: 4, surpriseSpawn: true, ammo: 'proiettili', text: 'Cecchino.', profiles: [d('1-3', 1, '3+', 2, true)] },
  { id: 'rio-av-sub-mg', deck: 'avanzato', category: 'arma', name: 'Sub-MG', maxDice: 3, conservation: 4, dual: true, ammo: 'proiettili', profiles: [d('0-1', 3, '5+', 1, true)] },
  { id: 'rio-av-opala-78', deck: 'avanzato', category: 'oggetto', name: 'Opala 78', profiles: [auto('0', 3, '4+', 2, false)], text: "Azioni con l'Auto: Entrare o Uscire da un'Auto; Cambiare Posto in un'Auto; Guidare Lentamente (1 Zona, nessun Attacco); Guidare Velocemente (2 Zone, Attacco in ogni Zona con Zombie, applicare Fuoco Amico e Priorità dei Bersagli)." },
  { id: 'rio-av-aaahh', deck: 'avanzato', category: 'aaahh', name: 'Aaahh!!', text: 'Colloca 1 Deambulante nella Zona. Poi scarta questa carta.' },
  { id: 'rio-aaahh-pimpata', deck: 'arma-pimpata', category: 'aaahh', name: 'Aaahh!!', quantity: 3, text: 'Colloca 1 Deambulante nella Zona. Poi scarta questa carta.' },
];

export const seedRioCards: EquipmentCard[] = rows.map((r) => ({
  quantity: 1,
  ...r,
  universeId: 'moderno',
  productId: 'rio-z-janeiro',
  dataStatus: 'verificato',
  origin: 'base',
}));
