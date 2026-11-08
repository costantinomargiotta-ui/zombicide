import type { Ability, Character } from '../../domain/types';
import { slugify } from '../../lib/ids';

/**
 * 24 sopravvissuti Moderno, trascritti dalle fotografie delle schede fornite
 * dall'utente (novembre 2026). Ordine e colore delle abilità come sulle schede:
 * 1 blu, 1 gialla, 2 arancioni, 3 rosse.
 *
 * - woundTrack: valore più alto del tracciato ferite stampato (3-2-1 o 2-1).
 * - capIcon: la scheda mostra l'icona della faccina col cappellino. Il suo
 *   significato regolamentare non è ancora documentato.
 * - productId assente = scatola di provenienza da indicare.
 * Trascrizione verificata dall'utente il 07/11/2026 (unica correzione: Ney, abilità gialla).
 */
interface Row {
  name: string;
  productId?: string;
  woundTrack: 2 | 3;
  capIcon?: boolean;
  blu: string;
  giallo: string;
  arancione: [string, string];
  rosso: [string, string, string];
  notes?: string;
}

const R = 'rio-z-janeiro';
/** I 12 sopravvissuti della scatola base, da Zombicide 2ª Edizione – Regolamento, pag. 3. */
const Z2 = 'zombicide-2e';
/** I 6 sopravvissuti di Washington Z.C. (Regolamento di Washington Z.C., pag. 3). */
const W = 'washington-zc';

const rows: Row[] = [
  { name: 'Ney', productId: R, woundTrack: 3, blu: 'Scatto', giallo: '+1 Azione', arancione: ['+1 Dado: Combattimento', '+1 Azione in Mischia gratuita'], rosso: ['Spingere', 'Scarto laterale', 'Inafferrabile'], notes: 'Sulla scheda è stampato "AZIONE": refuso, confermato dall\'utente come "+1 Azione".' },
  { name: 'Eliete', productId: R, woundTrack: 3, blu: 'Capoeira', giallo: '+1 Azione', arancione: ['Escalation: Mischia', 'Risultato 6: +1 Danno in Mischia'], rosso: ['Risultato 6: +1 Dado in Combattimento', 'Coriaceo', 'Caricare'] },
  { name: 'Vivi', productId: R, woundTrack: 3, blu: 'Vista acuta', giallo: '+1 Azione', arancione: ['+1 al tiro dei dadi: Combattimento', '+1 Azione in Mischia gratuita'], rosso: ['Avido', '2 Cocktail sono meglio di 1', 'Mordi e fuggi'] },
  { name: 'Steven', productId: R, woundTrack: 3, blu: 'Grande pianificatore', giallo: '+1 Azione', arancione: ['Sete di sangue: Combattimento', 'Risultato 6: +1 Dado in Combattimento'], rosso: ['Distributore', 'Salvatore', 'Legame con gli zombie'] },
  { name: 'MC Jordim', productId: R, woundTrack: 3, blu: "Splendere nell'oscurità", giallo: '+1 Azione', arancione: ['+1 Dado: Distanza', 'Risultato 6: +1 Danno in Mischia'], rosso: ['Fortunato', 'Provocare', 'Mordi e fuggi'] },
  { name: 'Dona Cacilda', productId: R, woundTrack: 3, blu: 'Benedetto', giallo: '+1 Azione', arancione: ['Mietitore: Distanza', '+1 Danno: Distanza'], rosso: ['Medico da campo', 'Turarsi il naso', 'Basso profilo'] },

  { name: 'Odin', productId: Z2, woundTrack: 2, capIcon: true, blu: '+1 Dado: Mischia', giallo: '+1 Azione', arancione: ['+1 Azione in Mischia gratuita', '+1 Azione di Movimento gratuita'], rosso: ['+1 Dado: Mischia', '+1 Dado: Distanza', '+1 Azione di Combattimento gratuita'] },
  { name: 'Amy', productId: Z2, woundTrack: 3, blu: '+1 Azione di Movimento gratuita', giallo: '+1 Azione', arancione: ['+1 Azione in Mischia gratuita', '+1 Azione a Distanza gratuita'], rosso: ['+1 Dado: Combattimento', '+1 al risultato dei dadi: Combattimento', 'Medico'] },
  { name: 'Elle', productId: Z2, woundTrack: 3, blu: 'Cecchino', giallo: '+1 Azione', arancione: ['+1 Dado: Combattimento', '+1 Azione a Distanza gratuita'], rosso: ['+1 Dado: Distanza', '+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Distanza'] },
  { name: 'Ostara', productId: Z2, woundTrack: 2, capIcon: true, blu: 'Cercatore attento', giallo: '+1 Azione', arancione: ['+1 Dado: Distanza', '+1 Azione di Movimento gratuita'], rosso: ['+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Distanza', 'Inafferrabile'] },
  { name: 'Angelo', productId: W, woundTrack: 3, blu: '+1 Azione a Distanza al massimo gratuita', giallo: '+1 Azione', arancione: ['+1 Azione a Distanza gratuita', 'F.I.A.: +1 Azione di Combattimento gratuita'], rosso: ['+1 al risultato dei dadi: Combattimento', 'F.I.A.: +1 Dado: Combattimento', 'Cecchino'] },
  { name: 'Tiger Sam', productId: Z2, woundTrack: 2, capIcon: true, blu: '+1 Dado: Distanza', giallo: '+1 Azione', arancione: ['+1 Azione di Movimento gratuita', 'Cecchino'], rosso: ['+1 Danno: Distanza', '+1 Azione di Combattimento gratuita', 'Spingere'] },
  { name: 'Lou', productId: Z2, woundTrack: 2, capIcon: true, blu: 'Caricare', giallo: '+1 Azione', arancione: ['+1 Dado: Combattimento', '+1 Azione in Mischia gratuita'], rosso: ['+1 Azione di Movimento gratuita', '+1 Azione a Distanza gratuita', 'Medico'] },
  { name: 'Ashley', productId: W, woundTrack: 3, blu: 'Al massimo: +1 Dado: Mischia', giallo: '+1 Azione', arancione: ['+1 Azione di Movimento gratuita', 'Spingere'], rosso: ['+1 Azione di Combattimento gratuita', '+1 al risultato dei dadi: Mischia', 'Mordi e fuggi'] },
  { name: 'Ned', productId: Z2, woundTrack: 3, blu: '+1 Azione di Cercare gratuita', giallo: '+1 Azione', arancione: ['+1 Dado: Distanza', '+1 Azione di Combattimento gratuita'], rosso: ['+1 Dado: Combattimento', '+1 al risultato dei dadi: Combattimento', 'Spingere'] },
  { name: 'Doug', productId: Z2, woundTrack: 3, blu: 'Coppia perfetta', giallo: '+1 Azione', arancione: ['+1 Dado: Distanza', '+1 Azione di Combattimento gratuita'], rosso: ['+1 al risultato dei dadi: Combattimento', 'Ambidestro', 'Inafferrabile'] },
  { name: 'Justin', productId: W, woundTrack: 3, blu: 'Factotum', giallo: '+1 Azione', arancione: ['+1 Azione in Mischia gratuita', 'Al massimo: +1 Dado: Combattimento'], rosso: ['Al massimo: +1 al risultato dei dadi: Combattimento', 'Sete di sangue: Mischia', 'Fortunato'] },
  { name: 'Josh', productId: Z2, woundTrack: 3, blu: 'Inafferrabile', giallo: '+1 Azione', arancione: ['+1 Dado: Mischia', '+1 Azione di Combattimento gratuita'], rosso: ['+1 Azione di Movimento gratuita', '+1 al risultato dei dadi: Combattimento', 'Fortunato'] },
  { name: 'Bunny G', productId: Z2, woundTrack: 2, capIcon: true, blu: 'Fortunato', giallo: '+1 Azione', arancione: ['+1 al risultato dei dadi: Mischia', 'Saltare'], rosso: ['+1 Danno: Mischia', '+1 Azione di Combattimento gratuita', 'Risultato 6: +1 Dado in Combattimento'] },
  { name: 'Mindy', productId: W, woundTrack: 3, blu: '+1 Azione in Mischia al massimo gratuita', giallo: '+1 Azione', arancione: ['+1 Azione in Mischia gratuita', 'Dadi al massimo raddoppiati'], rosso: ['+1 Azione di Movimento gratuita', 'Al massimo: Sete di sangue: Mischia', 'Mischia: 2 Danni'], notes: 'Sulla scheda l\'abilità blu riporta "GRATUTA" (refuso di stampa).' },
  { name: 'Wanda', productId: Z2, woundTrack: 3, blu: 'Scatto', giallo: '+1 Azione', arancione: ['+1 al risultato dei dadi: Mischia', 'Inafferrabile'], rosso: ['+1 Dado: Combattimento', '+1 Azione in Mischia gratuita', '+1 Azione di Movimento gratuita'] },
  { name: 'Lili', productId: Z2, woundTrack: 2, capIcon: true, blu: '+1 Gittata massima', giallo: '+1 Azione', arancione: ['+1 Dado: Distanza', 'Scatto'], rosso: ['+1 Azione di Combattimento gratuita', '+1 Azione di Movimento gratuita', '+1 al risultato dei dadi: Combattimento'] },
  { name: 'Tess', productId: W, woundTrack: 3, blu: 'Al massimo: Sete di sangue: Mischia', giallo: '+1 Azione', arancione: ['+1 Dado: Combattimento', 'Scatto'], rosso: ['+1 Azione in Mischia gratuita', '+1 Azione a Distanza gratuita', 'Al massimo: +1 Azione di Combattimento gratuita'] },
  { name: 'Anton', productId: W, woundTrack: 3, blu: 'Al massimo: +1 Dado: Distanza', giallo: '+1 Azione', arancione: ['+1 Azione di Movimento gratuita', 'Al massimo: +1 Danno: Distanza'], rosso: ['+1 Azione di Combattimento al massimo gratuita', 'Al massimo: +1 Azione di Combattimento gratuita', 'Spingere'] },
];

const abilityId = (name: string) => `moderno-${slugify(name)}`;

export const seedModernAbilities: Ability[] = [
  ...new Set(rows.flatMap((r) => [r.blu, r.giallo, ...r.arancione, ...r.rosso])),
].map((name) => ({ id: abilityId(name), universeId: 'moderno', name, dataStatus: 'verificato', origin: 'base' }));

export const seedModernSurvivors: Character[] = rows.map((r) => ({
  id: `moderno-${slugify(r.name)}`,
  universeId: 'moderno',
  productId: r.productId,
  name: r.name,
  kind: 'sopravvissuto',
  abilities: [
    { level: 'blu', abilityIds: [abilityId(r.blu)] },
    { level: 'giallo', abilityIds: [abilityId(r.giallo)] },
    { level: 'arancione', abilityIds: r.arancione.map(abilityId) },
    { level: 'rosso', abilityIds: r.rosso.map(abilityId) },
  ],
  traits: { woundTrack: r.woundTrack, capIcon: !!r.capIcon, transcriptionNotes: r.notes },
  dataStatus: 'verificato',
  origin: 'base',
}));
