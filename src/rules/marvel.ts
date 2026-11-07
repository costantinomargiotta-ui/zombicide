import type { UniverseRules } from './types';

const MARVEL = 'Marvel Zombies – Un gioco Zombicide – Regolamento (ITA)';

export const marvelRules: UniverseRules = {
  universeId: 'marvel',
  characterKinds: [
    { id: 'eroe-zombie', label: 'Eroe Zombie', playable: true, note: 'Modalità Zombie (Marvel Zombies).' },
    { id: 'supereroe', label: 'Supereroe', playable: true, note: 'Nemico in Modalità Zombie; giocabile in Modalità Eroe (X-Men Resistance).' },
    { id: 'passante', label: 'Passante', playable: false },
  ],
  progression: {
    maxXp: 43,
    source: { document: MARVEL, page: 11 },
    levels: [
      { id: 'blu', label: 'Blu', color: 'blu', minXp: 0, effect: "L'Eroe Zombie inizia con 0 PE e una singola Abilità." },
      { id: 'giallo', label: 'Giallo', color: 'giallo', minXp: 7, effect: 'Ottiene una quarta Azione da usare a ogni Turno.' },
      { id: 'arancione', label: 'Arancione', color: 'arancione', minXp: 19, effect: "Sblocca un'altra Abilità." },
      { id: 'rosso', label: 'Rosso', color: 'rosso', minXp: 43, effect: 'Tutte le Abilità sono a sua disposizione.' },
    ],
  },
  campaignTemplates: [],
  missingMaterials: [
    'Regolamento di X-Men Resistance (Modalità Eroe)',
    'Regole delle espansioni: Fantastic 4: Under Siege, Clash of the Sinister Six, Hydra Resurrection',
    'Schede identità degli Eroi Zombie e dei Supereroi',
  ],
  sources: [{ document: MARVEL }],
};
