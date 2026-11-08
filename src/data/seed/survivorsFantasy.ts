import type { Character } from '../../domain/types';

/**
 * I 6 sopravvissuti di Zombicide: Black Plague (Regolamento, pag. 3).
 * Le abilità sono stampate sulle schede identità e NON sono nel regolamento:
 * restano vuote finché l'utente non fornisce le fotografie delle schede.
 */
export const seedFantasySurvivors: Character[] = ['Nelly', 'Ann', 'Silas', 'Clovis', 'Baldric', 'Samson'].map((name) => ({
  id: `fantasy-${name.toLowerCase()}`,
  universeId: 'fantasy',
  productId: 'black-plague',
  name,
  kind: 'sopravvissuto',
  abilities: [],
  traits: { transcriptionNotes: 'Abilità da trascrivere: servono le fotografie della scheda identità.' },
  dataStatus: 'da-verificare',
  origin: 'base',
}));
