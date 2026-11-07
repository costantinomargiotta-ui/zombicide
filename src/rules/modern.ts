import type { UniverseRules } from './types';

export const modernRules: UniverseRules = {
  universeId: 'moderno',
  characterKinds: [{ id: 'sopravvissuto', label: 'Sopravvissuto', playable: true }],
  // Volutamente null: le regole non vengono copiate dal Fantasy.
  progression: null,
  campaignTemplates: [
    {
      id: 'rio-z-janeiro',
      name: 'Campagna Rio Z Janeiro',
      productId: 'rio-z-janeiro',
      status: 'materiali-mancanti',
      missingMaterials: [
        'Fotografia leggibile della scheda campagna ufficiale (fronte e retro)',
        'Pagine del regolamento di Rio Z Janeiro con le regole della campagna',
        'Elenco ufficiale degli scenari della campagna e loro ordine',
        'Regole di PE, Azioni bonus, Abilità della campagna e Traguardi',
      ],
    },
  ],
  missingMaterials: [
    'Regolamento di Zombicide 2ª edizione (livelli di pericolo, abilità)',
    'Regolamento di Rio Z Janeiro e scheda campagna',
    'Fotografie delle schede dei 24 sopravvissuti',
  ],
  sources: [],
};
