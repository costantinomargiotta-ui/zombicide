import type { UniverseRules } from './types';

const BLACK_PLAGUE = 'Zombicide: Black Plague – Regolamento (ITA)';

export const fantasyRules: UniverseRules = {
  universeId: 'fantasy',
  characterKinds: [{ id: 'sopravvissuto', label: 'Sopravvissuto', playable: true }],
  progression: {
    maxXp: 43,
    source: { document: BLACK_PLAGUE, page: 16 },
    levels: [
      { id: 'blu', label: 'Blu', color: 'blu', minXp: 0, effect: "Il Sopravvissuto possiede un'Abilità di partenza." },
      { id: 'giallo', label: 'Giallo', color: 'giallo', minXp: 7, effect: 'Il Sopravvissuto ottiene una quarta Azione.' },
      { id: 'arancio', label: 'Arancio', color: 'arancione', minXp: 19, effect: "Il Sopravvissuto sceglie un'Abilità tra le due disponibili." },
      { id: 'rosso', label: 'Rosso', color: 'rosso', minXp: 43, effect: "Il Sopravvissuto sceglie un'Abilità tra le tre disponibili." },
    ],
  },
  campaignTemplates: [],
  missingMaterials: [
    'Regolamenti di Green Horde, Wulfsburg, Friends and Foes, No Rest for the Wicked, White Death',
    'Eventuali regole di campagna fantasy (es. libretti di campagna)',
    'Schede identità dei sopravvissuti fantasy',
  ],
  sources: [{ document: BLACK_PLAGUE }],
};
