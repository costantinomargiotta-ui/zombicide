import type { UniverseRules } from './types';
import { RIO_TEMPLATE_ID } from './moderno/rioZJaneiro';
import { Z2_TEMPLATE_ID } from './moderno/zombicide2e';
import { WZC_TEMPLATE_ID } from './moderno/washingtonZC';

const Z2 = 'Zombicide 2ª Edizione – Regolamento (ITA)';

export const modernRules: UniverseRules = {
  universeId: 'moderno',
  characterKinds: [{ id: 'sopravvissuto', label: 'Sopravvissuto', playable: true }],
  // Punti Adrenalina (PA) e Livelli di Pericolo della 2ª edizione.
  progression: {
    maxXp: 43,
    source: { document: Z2, page: 15 },
    levels: [
      { id: 'blu', label: 'Blu', color: 'blu', minXp: 0, effect: 'Inizia con 0 Punti Adrenalina e una singola Abilità.' },
      { id: 'giallo', label: 'Giallo', color: 'giallo', minXp: 7, effect: 'Ottiene una quarta Azione.' },
      { id: 'arancione', label: 'Arancione', color: 'arancione', minXp: 19, effect: "Sceglie un'Abilità tra le 2 indicate a questo Livello." },
      { id: 'rosso', label: 'Rosso', color: 'rosso', minXp: 43, effect: "Sceglie un'Abilità tra le 3 indicate a questo Livello." },
    ],
  },
  campaignTemplates: [
    {
      id: RIO_TEMPLATE_ID,
      name: 'Carnevale dei Morti (Rio Z Janeiro)',
      productId: 'rio-z-janeiro',
      status: 'pronto',
      missingMaterials: [],
    },
    { id: WZC_TEMPLATE_ID, name: 'Stato Infetto (Washington Z.C.)', productId: 'washington-zc', status: 'pronto', missingMaterials: [] },
    { id: Z2_TEMPLATE_ID, name: 'Missioni di Zombicide 2ª edizione', productId: 'zombicide-2e', status: 'pronto', missingMaterials: [] },
  ],
  missingMaterials: [
    'Regole di Fort Hendrix e di Zombicide 1ª edizione',
    'Carte Equipaggiamento Avanzato di Rio Z Janeiro (per collegare l\'equipaggiamento conservato al catalogo)',
    'Fotografie delle carte Equipaggiamento di Washington Z.C. (95 carte, di cui 33 dei Servizi Segreti)',
  ],
  sources: [{ document: Z2 }, { document: 'Zombicide: Rio Z Janeiro – Regole e Missioni (ITA)' }, { document: 'Zombicide: Washington Z.C. – Regole e Missioni (ITA)' }],
};
