import type { UniverseRules } from './types';

export const westernRules: UniverseRules = {
  universeId: 'western',
  characterKinds: [{ id: 'sopravvissuto', label: 'Sopravvissuto', playable: true }],
  progression: null,
  campaignTemplates: [],
  missingMaterials: [
    'Regolamento di Zombicide: Undead or Alive',
    'Regole di Gears & Guns e Running Wild',
    'Schede identità dei sopravvissuti western',
  ],
  sources: [],
};
