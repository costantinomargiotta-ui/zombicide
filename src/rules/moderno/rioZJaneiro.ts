/**
 * Modulo regole della campagna "Carnevale dei Morti" (Zombicide: Rio Z Janeiro).
 * Fonte: Rio Z Janeiro – Regole e Missioni (ITA), pagine indicate nei commenti.
 * Funzioni pure: nessuna dipendenza da React o dal database.
 */
import type { SourceRef } from '../types';

export const RIO_TEMPLATE_ID = 'rio-z-janeiro';
const RIO = 'Zombicide: Rio Z Janeiro – Regole e Missioni (ITA)';
const Z2 = 'Zombicide 2ª Edizione – Regolamento (ITA)';

export const RIO_SOURCES: Record<string, SourceRef> = {
  scheda: { document: RIO, page: 10 },
  pec: { document: RIO, page: 11 },
  traguardi: { document: RIO, page: 12 },
  ko: { document: RIO, page: 6 },
  conservazione: { document: RIO, page: 6 },
  missioni: { document: RIO, page: 15 },
  abilita: { document: Z2, page: 63 },
};

/** Barra dei PEC: 20 caselle; Pietre Miliari stampate sulla scheda (pag. 10). */
export const PEC_MAX = 20;
export const PEC_MILESTONES = [2, 5, 8, 11, 14, 17, 20] as const;
/** PEC standard per Missione: Arancione e Rosso raggiunti per la prima volta (pag. 11). */
export const PEC_STANDARD_PER_MISSION = 2;
export const BONUS_ACTION_SLOTS = 7;

export type RewardChoice = 'azione-bonus' | 'abilita-campagna';

export interface CampaignAbility {
  id: string;
  name: string;
  note?: string;
  description: string;
  source: SourceRef;
}

const ab = (id: string, name: string, description: string, page = 64, note?: string): CampaignAbility =>
  ({ id: `rio-${id}`, name, description, note, source: { document: Z2, page } });

/** Elenco delle Abilità della Campagna, nell'ordine della scheda (pag. 10). Si ottengono a Livello Blu. */
export const CAMPAIGN_ABILITIES: CampaignAbility[] = [
  ab('riflessi-da-combattimento', 'Riflessi da combattimento', 'Ogni volta che qualsiasi Zombie viene generato entro Gittata 0-1 (e prima di qualsiasi Assalto), il Sopravvissuto può effettuare immediatamente un\'Azione di Combattimento gratuita contro di esso. Si può usare una volta per ogni carta Zombie pescata.', 66),
  ab('destino', 'Destino', 'Una volta per Turno, quando rivela una carta Equipaggiamento che ha pescato, può ignorarla e scartarla e pescare un\'altra carta Equipaggiamento dallo stesso mazzo.'),
  ab('avido', 'Avido', 'Può trasportare fino a 2 carte Equipaggiamento extra, collocate accanto alla Plancia e considerate contenute nel suo Zaino.'),
  ab('turarsi-il-naso', 'Turarsi il naso', 'Pesca una carta Equipaggiamento (solo dal mazzo dell\'Equipaggiamento Base) ogni volta che l\'ultimo Zombie nella sua Zona viene eliminato. Funziona in qualsiasi Zona e più volte per Turno. Non è un\'Azione di Cercare.', 66),
  ab('difensore-di-casa', 'Difensore di casa', 'Non è limitato a Gittata 0-1 quando traccia le Linee di Vista attraverso le Zone di edificio.'),
  ab('tutto-qui', 'Tutto qui?', 'Quando sta per ricevere dei Danni, ignora 1 Ferita per ogni carta Equipaggiamento che scarta dal proprio Inventario.', 66),
  ab('salvatore', 'Salvatore', 'Una volta per Turno, gratuitamente: sceglie una Zona a Gittata 1 con almeno 1 Zombie e 1 Sopravvissuto, con percorso sgombro e in Linea di Vista; i Sopravvissuti scelti vengono trascinati nella sua Zona senza penalità. Non è un Movimento.', 66),
  ab('basso-profilo', 'Basso profilo', 'Non può essere colpito dal Fuoco Amico (le regole delle Molotov si applicano comunque). Viene ignorato quando qualcuno tira nella sua Zona.'),
  { id: 'rio-splendere-nell-oscurita', name: 'Splendere nell\'oscurità', description: 'Ignora le Zone di Oscurità. Possiede +1 dado quando attacca in una qualsiasi Zona di Oscurità.', source: { document: RIO, page: 27 } },
  ab('scarto-laterale', 'Scarto laterale', 'Ogni volta che 1 o più Zombie si generano entro Gittata 0-1 (e prima di qualsiasi Assalto), può effettuare immediatamente un\'Azione di Movimento gratuita, senza Azioni extra se ci sono Zombie nella sua Zona. Una volta per ogni carta Zombie pescata.', 66),
  ab('parte-con-2-pa', 'Parte con 2 PA', 'Inizia la partita con 2 Punti Adrenalina.', 65),
  ab('parte-con-1-carta-munizioni', 'Parte con 1 carta Munizioni', 'Inizia la partita con l\'Equipaggiamento indicato (Proiettili a Volontà OPPURE Cartucce a Volontà), assegnato durante la Preparazione.', 65, 'Sulla scheda: "Proiettili a Volontà OPPURE Cartucce a Volontà".'),
  ab('mano-ferma', 'Mano Ferma', 'Può ignorare gli altri Sopravvissuti a sua scelta quando ottiene degli insuccessi con un\'Azione a Distanza. Non si applica agli effetti che uccidono tutto nella Zona bersaglio (es. Molotov).', 65),
  ab('cintura-portaoggetti', 'Cintura portaoggetti', 'Tutto l\'Equipaggiamento nell\'inventario è considerato equipaggiato in Mano.'),
];

export type MissionDifficulty = 'Medio' | 'Difficile' | 'Molto Difficile';

export interface RioMission {
  id: string;
  code: string;
  title: string;
  difficulty: MissionDifficulty;
  duration: string;
  page: number;
  tiles: string[];
  objectivesInOrder: boolean;
  objectives: string[];
  /** Riferimenti a PEC extra o Traguardi stampati nel testo della Missione. */
  campaignNotes?: string[];
}

/** Le 10 Missioni vanno giocate in ordine (pag. 15). */
export const RIO_MISSIONS: RioMission[] = [
  { id: 'rio-m1', code: 'M1', title: 'Sangue e samba', difficulty: 'Medio', duration: '45 minuti', page: 15, tiles: ['6R', '7V', '23R', '24V', '25R', '28R'], objectivesInOrder: true, objectives: ['Radunare le scorte: prendere tutte le carte Obiettivo.', 'Dirigersi a Rocinha: raggiungere l\'Uscita.'] },
  { id: 'rio-m2', code: 'M2', title: 'Rocinha, il posto più sicuro sulla Terra!', difficulty: 'Medio', duration: '60 minuti', page: 16, tiles: ['22R', '23R', '24R', '25R', '26R', '27R'], objectivesInOrder: true, objectives: ['Esplorare Rocinha: prendere tutte le carte Obiettivo.', 'Fuori! Raggiungere l\'Uscita.'] },
  { id: 'rio-m3', code: 'M3', title: 'Professoressa Luana?', difficulty: 'Medio', duration: '60 minuti', page: 17, tiles: ['6R', '23R', '24R', '25R', '26R', '27R'], objectivesInOrder: false, objectives: ['Rallentarli: portare l\'Opala al luogo contrassegnato e darle fuoco.', 'Ogni Carnevale deve finire! Distruggere la Zona di Generazione di Partenza.', 'Una cura, davvero? Trovare la Professoressa Luana.'], campaignNotes: ['Preparazione: se nessun Sopravvissuto possiede il Traguardo "Rallentare l\'Invasione", pescare 1 carta Zombie per ogni Zona di Generazione.'] },
  { id: 'rio-m4', code: 'M4', title: 'Ora si balla!', difficulty: 'Medio', duration: '120 minuti', page: 18, tiles: ['2V', '3V', '6R', '9R', '22R', '23R', '26R', '27R'], objectivesInOrder: true, objectives: ['In tenuta da professionisti: raggiungere l\'Uscita con tutti i Sopravvissuti, la Professoressa Luana e l\'Opala.'], campaignNotes: ['Se i Sopravvissuti nell\'Opala possiedono almeno 4 Armi Pimpate, tutti i Sopravvissuti ottengono 1 PEC e il Traguardo "Opala Nera".', 'Invasione in corso: chi possiede "Rallentare l\'Invasione" pesca 6 carte Zombie e ne sceglie 1 per Zona di Generazione.'] },
  { id: 'rio-m5', code: 'M5', title: 'Una notte allo stadio', difficulty: 'Medio', duration: '60-90 minuti', page: 20, tiles: ['2V', '7R', '23R', '25V', '26R'], objectivesInOrder: true, objectives: ['Trovare la Tessera di Accesso per aprire il Cancello.', 'Volere è potere: raggiungere l\'Uscita con tutti i Sopravvissuti.'] },
  { id: 'rio-m6', code: 'M6', title: 'La prossima volta, meglio avere un piano di riserva!', difficulty: 'Medio', duration: '90 minuti', page: 21, tiles: ['25V', '26V', '27V', '28V'], objectivesInOrder: false, objectives: ['Copiare i dati: trovare il computer della Professoressa Luana e recuperare i Dati.', 'Ripulire lo Stadio: bloccare le entrate, rimuovere i segnalini Generazione ed eliminare tutti gli Zombie nello Stadio.'] },
  { id: 'rio-m7', code: 'M7', title: 'S.O.S.! S.O.S.!', difficulty: 'Difficile', duration: '90 minuti', page: 22, tiles: ['5V', '23R', '25V', '26V', '27V', '28V'], objectivesInOrder: true, objectives: ['Riattivare l\'energia: prendere le carte Obiettivo #01 e #02.', 'Trovare la radio: scoprire la Sala Radio e permettere alla Professoressa Luana di chiamare Ilha Grande.'] },
  { id: 'rio-m8', code: 'M8', title: 'Road Movie', difficulty: 'Difficile', duration: '60 minuti', page: 23, tiles: ['1V', '2V', '3V', '4V', '6R', '23V'], objectivesInOrder: true, objectives: ['Preparare l\'auto: trovare le Chiavi dell\'Opala e un Gallone di Carburante (vedi Note).', 'Si torna alla spiaggia: raggiungere l\'Uscita con tutti i Sopravvissuti, la Professoressa Luana e l\'Opala.'], campaignNotes: ['Se un Sopravvissuto possiede il Traguardo "Opala Nera", leggere subito la Nota #4; altrimenti la Nota #5.'] },
  { id: 'rio-m9', code: 'M9', title: 'Copa, Copacabana', difficulty: 'Difficile', duration: '90 minuti', page: 24, tiles: ['3R', '4R', '5V', '6V', '22V', '28R'], objectivesInOrder: true, objectives: ['Raggiungere il luogo di incontro: prendere la carta Obiettivo #06.'] },
  { id: 'rio-m10', code: 'M10', title: 'Nessuno resta indietro', difficulty: 'Molto Difficile', duration: '120 minuti', page: 25, tiles: ['1V', '3V', '5V', '6V', '8R', '22V', '23V', '24V', '28R'], objectivesInOrder: true, objectives: ['Trovare il Tenente Francisca.', 'Trovare quella dannata barca: raggiungere Ilha Grande con la Professoressa Luana e il Tenente Francisca.'] },
];

/** Traguardi nominati nel regolamento. Gli altri arrivano dalle carte Obiettivo e si scrivono a mano. */
export const KNOWN_MILESTONES = [
  { name: 'Rallentare l\'Invasione', missions: ['rio-m3', 'rio-m4'] },
  { name: 'Opala Nera', missions: ['rio-m4', 'rio-m8'] },
];

// ---------------------------------------------------------------------------
// Stato della scheda, derivato dal registro dei progressi
// ---------------------------------------------------------------------------

export type ProgressPayload =
  | { kind: 'pec'; amount: number; reason: 'arancione' | 'rosso' | 'missione' | 'manuale' }
  | { kind: 'ricompensa'; milestone: number; choice: RewardChoice; abilityId?: string }
  | { kind: 'traguardo'; text: string }
  | { kind: 'stato'; status: 'morto' };

export interface ProgressRow {
  id: string;
  participantId: string;
  sessionId?: string;
  payload: ProgressPayload;
}

export interface SheetState {
  pec: number;
  /** Pietre Miliari raggiunte con i PEC attuali. */
  milestonesReached: number[];
  /** Pietre Miliari raggiunte senza una ricompensa scelta. */
  pendingMilestones: number[];
  /** Ricompense che non corrispondono più a una Pietra Miliare (es. dopo una correzione). */
  orphanRewards: number[];
  bonusActions: number;
  campaignAbilityIds: string[];
  traguardi: string[];
  dead: boolean;
}

export function computeSheet(rows: ProgressRow[], inheritedTraguardi: string[] = []): SheetState {
  let pec = 0;
  const rewards = new Map<number, { choice: RewardChoice; abilityId?: string }>();
  const traguardi = [...inheritedTraguardi];
  let dead = false;
  for (const r of rows) {
    const p = r.payload;
    if (p.kind === 'pec') pec += p.amount;
    else if (p.kind === 'ricompensa') rewards.set(p.milestone, { choice: p.choice, abilityId: p.abilityId });
    else if (p.kind === 'traguardo' && p.text.trim() && !traguardi.includes(p.text.trim())) traguardi.push(p.text.trim());
    else if (p.kind === 'stato') dead = true;
  }
  pec = Math.max(0, Math.min(PEC_MAX, pec));
  const milestonesReached = PEC_MILESTONES.filter((m) => pec >= m);
  const valid = [...rewards.entries()].filter(([m]) => milestonesReached.includes(m as never));
  return {
    pec,
    milestonesReached,
    pendingMilestones: milestonesReached.filter((m) => !rewards.has(m)),
    orphanRewards: [...rewards.keys()].filter((m) => !milestonesReached.includes(m as never)),
    bonusActions: valid.filter(([, r]) => r.choice === 'azione-bonus').length,
    campaignAbilityIds: valid.filter(([, r]) => r.choice === 'abilita-campagna' && r.abilityId).map(([, r]) => r.abilityId!),
    traguardi,
    dead,
  };
}

/** Verifica una scelta di ricompensa prima di salvarla. Restituisce un messaggio d'errore o null. */
export function validateReward(state: SheetState, milestone: number, choice: RewardChoice, abilityId?: string, abilities: CampaignAbility[] = CAMPAIGN_ABILITIES): string | null {
  if (!state.pendingMilestones.includes(milestone)) return 'Questa Pietra Miliare non è raggiunta o ha già una ricompensa.';
  if (choice === 'abilita-campagna') {
    if (!abilityId || !abilities.some((a) => a.id === abilityId)) return 'Scegli un\'Abilità della Campagna dalla lista.';
    if (state.campaignAbilityIds.includes(abilityId)) return 'Questa Abilità della Campagna è già stata spuntata.';
  }
  return null;
}

/** PEC di una Missione per un Sopravvissuto: al massimo 1 per l'Arancione e 1 per il Rosso, più quelli della Missione. */
export function missionPec(input: { reachedOrange: boolean; reachedRed: boolean; extra: number }): ProgressPayload[] {
  const out: ProgressPayload[] = [];
  if (input.reachedOrange) out.push({ kind: 'pec', amount: 1, reason: 'arancione' });
  if (input.reachedRed) out.push({ kind: 'pec', amount: 1, reason: 'rosso' });
  if (input.extra > 0) out.push({ kind: 'pec', amount: Math.floor(input.extra), reason: 'missione' });
  return out;
}

export interface MissionProgress {
  mission: RioMission;
  state: 'completata' | 'disponibile' | 'bloccata';
  attempts: number;
}

/** Ordine lineare: è disponibile la prima Missione non ancora vinta. */
export function missionProgress(sessions: { scenarioId?: string; outcome: string }[], missions: RioMission[] = RIO_MISSIONS): MissionProgress[] {
  let unlockedNext = true;
  return missions.map((mission) => {
    const own = sessions.filter((s) => s.scenarioId === mission.id);
    const won = own.some((s) => s.outcome === 'vittoria');
    let state: MissionProgress['state'];
    if (won) state = 'completata';
    else if (unlockedNext) { state = 'disponibile'; unlockedNext = false; }
    else state = 'bloccata';
    return { mission, state, attempts: own.filter((s) => s.outcome === 'vittoria' || s.outcome === 'sconfitta').length };
  });
}
