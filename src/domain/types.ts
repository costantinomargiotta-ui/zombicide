/**
 * Modello di dominio di Zombicide Hub.
 *
 * Regola guida: il CATALOGO (prodotti, personaggi, abilità, carte, scenari)
 * è condiviso e non viene mai copiato nei salvataggi. I SALVATAGGI
 * (campagne, partecipazioni, partite, progressi, inventari) fanno sempre
 * riferimento al catalogo tramite identificativi stabili.
 */

export type UniverseId = 'fantasy' | 'moderno' | 'western' | 'marvel';

export const UNIVERSE_IDS: UniverseId[] = ['fantasy', 'moderno', 'western', 'marvel'];

/** Affidabilità di un dato di catalogo. */
export type DataStatus = 'verificato' | 'da-verificare';

/** Provenienza di un record: dati di base, inseriti dall'utente o dimostrativi. */
export type RecordOrigin = 'base' | 'utente' | 'demo';

export type ProductKind = 'gioco-base' | 'espansione' | 'campagna' | 'contenuto-aggiuntivo';

export const PRODUCT_KIND_LABEL: Record<ProductKind, string> = {
  'gioco-base': 'Gioco base',
  espansione: 'Espansione',
  campagna: 'Campagna',
  'contenuto-aggiuntivo': 'Contenuto aggiuntivo',
};

export interface Product {
  id: string;
  universeId: UniverseId;
  name: string;
  kind: ProductKind;
  description?: string;
  /** Riferimento a un'immagine salvata nell'archivio immagini. */
  coverImageId?: string;
  /** Contenuti inclusi (testo libero, uno per riga). */
  contents?: string[];
  /** Id dei prodotti richiesti per giocare questo prodotto. */
  requires?: string[];
  dataStatus: DataStatus;
  origin: RecordOrigin;
  createdAt: string;
  updatedAt: string;
}

/** Collezione personale: separata dal catalogo. Una riga per prodotto. */
export interface CollectionEntry {
  productId: string;
  owned: boolean;
  notes?: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  notes?: string;
  origin: RecordOrigin;
  createdAt: string;
}

/**
 * Personaggio di catalogo. I campi specifici di ogni universo stanno in
 * `traits`, interpretato dal modulo regole dell'universo.
 */
export interface Character {
  id: string;
  universeId: UniverseId;
  productId: string;
  name: string;
  /** Tipologia definita dal modulo regole (es. 'sopravvissuto', 'eroe-zombie', 'supereroe'). */
  kind: string;
  portraitImageId?: string;
  /** Abilità originali per livello di pericolo, come id di abilità. */
  abilities: { level: string; abilityIds: string[] }[];
  traits?: Record<string, unknown>;
  dataStatus: DataStatus;
  origin: RecordOrigin;
}

export interface Ability {
  id: string;
  universeId: UniverseId;
  name: string;
  description?: string;
  dataStatus: DataStatus;
  origin: RecordOrigin;
}

export interface Scenario {
  id: string;
  universeId: UniverseId;
  productId: string;
  code: string;
  title: string;
  description?: string;
  dataStatus: DataStatus;
  origin: RecordOrigin;
}

export type CampaignStatus = 'da-iniziare' | 'in-corso' | 'sospesa' | 'completata';

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  'da-iniziare': 'Da iniziare',
  'in-corso': 'In corso',
  sospesa: 'Sospesa',
  completata: 'Completata',
};

/** Salvataggio di campagna. Più salvataggi possono riferirsi allo stesso gioco. */
export interface Campaign {
  id: string;
  universeId: UniverseId;
  name: string;
  /** Prodotto (gioco o espansione) di riferimento. */
  productId: string;
  /** Id del modello di campagna definito nei moduli regole, se esiste. */
  templateId?: string;
  description?: string;
  coverImageId?: string;
  status: CampaignStatus;
  /** Numero totale di scenari previsti, quando noto. */
  plannedScenarioCount?: number;
  notes?: string;
  origin: RecordOrigin;
  createdAt: string;
  updatedAt: string;
}

export type SessionOutcome = 'vittoria' | 'sconfitta' | 'in-corso' | 'abbandonata';

export const SESSION_OUTCOME_LABEL: Record<SessionOutcome, string> = {
  vittoria: 'Vittoria',
  sconfitta: 'Sconfitta',
  'in-corso': 'In corso',
  abbandonata: 'Abbandonata',
};

/** Partita giocata (sessione). Può appartenere o meno a una campagna. */
export interface GameSession {
  id: string;
  universeId: UniverseId;
  campaignId?: string;
  scenarioId?: string;
  /** Titolo libero se lo scenario non è ancora a catalogo. */
  scenarioTitle?: string;
  playedOn: string; // AAAA-MM-GG
  durationMinutes?: number;
  outcome: SessionOutcome;
  /** Zombie eliminati: assente = non registrato (non zero!). */
  zombiesKilled?: number;
  notes?: string;
  origin: RecordOrigin;
  createdAt: string;
  updatedAt: string;
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  playerId?: string;
  characterId?: string;
  /** Nome libero se il personaggio non è ancora a catalogo. */
  characterName?: string;
  experienceGained?: number;
}

export type ActivityKind =
  | 'collezione'
  | 'prodotto'
  | 'campagna'
  | 'partita'
  | 'giocatore'
  | 'sistema';

export interface Activity {
  id: string;
  kind: ActivityKind;
  universeId?: UniverseId;
  message: string;
  refId?: string;
  origin: RecordOrigin;
  at: string;
}

export interface StoredImage {
  id: string;
  blob: Blob;
  mime: string;
  createdAt: string;
}
