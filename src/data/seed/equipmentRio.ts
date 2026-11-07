import type { EquipmentCard, WeaponProfile } from '../../domain/types';

/**
 * Carte di Rio Z Janeiro trascritte dalle fotografie dell'utente (07/11/2026):
 * 6 Equipaggiamento di Partenza Avanzato e 12 Armi Pimpate Avanzate.
 * Simboli letti come nel regolamento di Rio (pag. 5-7): "+N" = dadi Al Massimo,
 * lucchetto = Conservazione, cerchio con zombie = Generazione a Sorpresa.
 */
const m = (range: string, dice: number, accuracy: string, damage: number, noisy: boolean): WeaponProfile => ({ kind: 'mischia', range, dice, accuracy, damage, noisy });
const d = (range: string, dice: number, accuracy: string, damage: number, noisy: boolean): WeaponProfile => ({ kind: 'distanza', range, dice, accuracy, damage, noisy });

type Row = Omit<EquipmentCard, 'universeId' | 'productId' | 'dataStatus' | 'origin' | 'quantity'> & { quantity?: number };

const PIMP_NOTE = 'Valore di Conservazione 6 stampato in rosso sbiadito: da confermare.';

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
  { id: 'rio-gemelle-malvagie', deck: 'arma-pimpata', category: 'arma', name: 'Gemelle malvagie', maxDice: 1, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', profiles: [d('0-1', 2, '3+', 1, true)], transcriptionNotes: 'Non ho visto il simbolo "Doppia" sulla carta: da confermare.' },
  { id: 'rio-fucile-da-cecchino-dell-esercito', deck: 'arma-pimpata', category: 'arma', name: "Fucile da cecchino dell'esercito", maxDice: 1, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', text: 'Cecchino.', profiles: [d('1-4', 2, '3+', 2, true)] },
  { id: 'rio-katana-pregiata', deck: 'arma-pimpata', category: 'arma', name: 'Katana pregiata', maxDice: 2, conservation: 6, surpriseSpawn: true, profiles: [m('0', 2, '3+', 2, false)] },
  { id: 'rio-ak-47-dorato', deck: 'arma-pimpata', category: 'arma', name: 'AK-47 dorato', maxDice: 3, conservation: 6, surpriseSpawn: true, ammo: 'proiettili', profiles: [d('1-2', 3, '4+', 2, true)] },
  { id: 'rio-shotgun-automatico', deck: 'arma-pimpata', category: 'arma', name: 'Shotgun automatico', maxDice: 3, conservation: 6, surpriseSpawn: true, ammo: 'cartucce', profiles: [d('0-1', 3, '4+', 2, true)] },
  { id: 'rio-aaahh-pimpata', deck: 'arma-pimpata', category: 'aaahh', name: 'Aaahh!!', quantity: 3, text: 'Colloca 1 Deambulante nella Zona. Poi scarta questa carta.' },
];

export const seedRioCards: EquipmentCard[] = rows.map((r) => ({
  quantity: 1,
  ...r,
  transcriptionNotes: r.transcriptionNotes ?? (r.conservation ? PIMP_NOTE : undefined),
  universeId: 'moderno',
  productId: 'rio-z-janeiro',
  dataStatus: 'da-verificare',
  origin: 'base',
}));
