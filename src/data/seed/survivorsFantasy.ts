import type { Ability, Character } from '../../domain/types';
import { slugify } from '../../lib/ids';

/**
 * I 6 sopravvissuti di Zombicide: Black Plague (Regolamento, pag. 3), trascritti
 * dalla fotografia delle schede identità fornita dall'utente (09/11/2026).
 * Ordine come sulla scheda: 1 blu, 1 gialla, 2 arancioni (colonna sinistra), 3 rosse (colonna destra).
 * equipSlot: oggetto che lo slot speciale della scheda può contenere ("Questo slot può invece contenere…").
 */
interface Row {
  name: string;
  equipSlot: string;
  blu: string;
  giallo: string;
  arancione: [string, string];
  rosso: [string, string, string];
}

const rows: Row[] = [
  { name: 'Nelly', equipSlot: 'Pugnale', blu: '+1 Azione di Movimento gratuita', giallo: '+1 Azione', arancione: ['Sete di sangue: Mischia', 'Inafferrabile'], rosso: ['+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Combattimento', 'Mordi e fuggi'] },
  { name: 'Ann', equipSlot: 'Pugnale', blu: 'Sete di sangue: Mischia', giallo: '+1 Azione', arancione: ['+1 Azione di Magia gratuita', '+1 Azione in Mischia gratuita'], rosso: ['+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Combattimento', 'Risultato 6: +1 dado in Combattimento'] },
  { name: 'Silas', equipSlot: 'Spada', blu: '+1 al risultato dei dadi: Distanza', giallo: '+1 Azione', arancione: ['+1 Azione a Distanza gratuita', 'Bruciapelo'], rosso: ['+1 dado: Distanza', '+1 Azione di Combattimento gratuita', 'Pioggia di ferro'] },
  { name: 'Clovis', equipSlot: 'Scudo', blu: '+1 dado: Mischia', giallo: '+1 Azione', arancione: ['+1 Azione in Mischia gratuita', 'Spadaccino'], rosso: ['+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Combattimento', 'Mordi e fuggi'] },
  { name: 'Baldric', equipSlot: 'Spada', blu: 'Incantatore', giallo: '+1 Azione', arancione: ['+1 Azione di Magia gratuita', 'Libro degli incantesimi'], rosso: ['+1 dado: Magia', '+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Mischia'] },
  { name: 'Samson', equipSlot: 'Scudo', blu: 'Pelle di ferro', giallo: '+1 Azione', arancione: ['+1 dado: Combattimento', '+1 al risultato dei dadi: Mischia'], rosso: ['+1 Danno: Mischia', '+1 Azione di Combattimento gratuita', 'Barbaro'] },
];

const abilityId = (name: string) => `fantasy-${slugify(name)}`;

export const seedFantasyAbilities: Ability[] = [
  ...new Set(rows.flatMap((r) => [r.blu, r.giallo, ...r.arancione, ...r.rosso])),
].map((name) => ({ id: abilityId(name), universeId: 'fantasy', name, dataStatus: 'verificato', origin: 'base' }));

export const seedFantasySurvivors: Character[] = rows.map((r) => ({
  id: `fantasy-${r.name.toLowerCase()}`,
  universeId: 'fantasy',
  productId: 'black-plague',
  name: r.name,
  kind: 'sopravvissuto',
  abilities: [
    { level: 'blu', abilityIds: [abilityId(r.blu)] },
    { level: 'giallo', abilityIds: [abilityId(r.giallo)] },
    { level: 'arancione', abilityIds: r.arancione.map(abilityId) },
    { level: 'rosso', abilityIds: r.rosso.map(abilityId) },
  ],
  traits: { equipSlot: r.equipSlot },
  dataStatus: 'verificato',
  origin: 'base',
}));

/**
 * Personaggi ThunderCats indicati dall'utente (09/11/2026), con i ritratti forniti.
 * Abilità e scatola esatta da trascrivere: servono le fotografie delle schede identità.
 */
export const seedThunderCats: Character[] = ['Lion-O', 'Slithe', 'Cheetara', 'Snarf'].map((name) => ({
  id: `fantasy-${slugify(name)}`,
  universeId: 'fantasy',
  productId: 'thundercats',
  name,
  kind: 'sopravvissuto',
  abilities: [],
  traits: { transcriptionNotes: 'Abilità da trascrivere: servono le fotografie della scheda identità.' },
  dataStatus: 'da-verificare',
  origin: 'base',
}));
