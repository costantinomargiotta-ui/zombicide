import type { UniverseRules } from './types';
import { UO_TEMPLATE_ID } from './western/undeadOrAlive';

const UOA = 'Zombicide: Undead or Alive – Regolamento (ITA)';

export const westernRules: UniverseRules = {
  universeId: 'western',
  characterKinds: [{ id: 'sopravvissuto', label: 'Sopravvissuto', playable: true }],
  progression: {
    maxXp: 43,
    source: { document: UOA, page: 18 },
    levels: [
      { id: 'blu', label: 'Blu', color: 'blu', minXp: 0, effect: "Il Sopravvissuto possiede un'Abilità di Partenza e la sua Capacità di Classe." },
      { id: 'giallo', label: 'Giallo', color: 'giallo', minXp: 7, effect: 'Il Sopravvissuto ottiene una quarta Azione.' },
      { id: 'arancione', label: 'Arancione', color: 'arancione', minXp: 19, effect: "Il Sopravvissuto sceglie un'Abilità tra le 2 indicate a questo Livello." },
      { id: 'rosso', label: 'Rosso', color: 'rosso', minXp: 43, effect: "Il Sopravvissuto sceglie un'Abilità tra le 3 indicate a questo Livello." },
    ],
  },
  campaignTemplates: [
    { id: UO_TEMPLATE_ID, name: 'Missioni di Undead or Alive', productId: 'undead-or-alive', status: 'pronto', missingMaterials: [] },
  ],
  missingMaterials: [
    'Regole di Gears & Guns e Running Wild',
    'Schede identità dei sopravvissuti western',
  ],
  sources: [{ document: UOA }],
};
