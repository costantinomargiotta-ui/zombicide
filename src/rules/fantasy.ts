import type { UniverseRules } from './types';
import { BP_TEMPLATE_ID } from './fantasy/blackPlague';
import { WU_TEMPLATE_ID } from './fantasy/wulfsburg';
import { GH_TEMPLATE_ID } from './fantasy/greenHorde';
import { WD_TEMPLATE_ID } from './fantasy/whiteDeath';
import { EE_TEMPLATE_ID } from './fantasy/eternalEmpire';

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
  campaignTemplates: [
    { id: BP_TEMPLATE_ID, name: 'Missioni di Black Plague', productId: 'black-plague', status: 'pronto', missingMaterials: [] },
    { id: WU_TEMPLATE_ID, name: 'Missioni di Wulfsburg', productId: 'wulfsburg', status: 'pronto', missingMaterials: [] },
    { id: GH_TEMPLATE_ID, name: 'Missioni di Green Horde', productId: 'green-horde', status: 'pronto', missingMaterials: [] },
    { id: WD_TEMPLATE_ID, name: 'Missioni di White Death', productId: 'white-death', status: 'pronto', missingMaterials: [] },
    { id: EE_TEMPLATE_ID, name: 'Missioni di The Eternal Empire', productId: 'eternal-empire', status: 'pronto', missingMaterials: [] },
  ],
  missingMaterials: [
    'Fotografie delle carte Equipaggiamento di Black Plague (71 carte)',
    'Pagine delle Missioni di Friends and Foes (pag. 12–23, assenti nel PDF ufficiale)',
    'Scheda Campagna di The Eternal Empire (PEC, Abilità della Campagna, Azioni Bonus)',
  ],
  sources: [{ document: BLACK_PLAGUE }],
};
