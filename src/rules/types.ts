import type { UniverseId } from '../domain/types';

/** Riferimento a un materiale ufficiale da cui deriva una regola. */
export interface SourceRef {
  document: string;
  page?: number;
}

export interface DangerLevel {
  id: string;
  label: string;
  /** Colore del livello (token di tema, non logica). */
  color: 'blu' | 'giallo' | 'arancione' | 'rosso';
  /** PE minimi per raggiungere il livello. */
  minXp: number;
  /** Effetto testuale riportato dal regolamento. */
  effect: string;
}

export interface ProgressionTrack {
  maxXp: number;
  levels: DangerLevel[];
  source: SourceRef;
}

export interface CharacterKind {
  id: string;
  label: string;
  playable: boolean;
  note?: string;
}

/** Modello di campagna definito dalle regole (non è un salvataggio). */
export interface CampaignTemplate {
  id: string;
  name: string;
  productId: string;
  /** 'pronto' solo quando tutte le regole sono state ricavate da materiali ufficiali. */
  status: 'pronto' | 'materiali-mancanti';
  missingMaterials: string[];
}

/**
 * Modulo regole di un universo. È l'unico punto in cui vivono le meccaniche
 * di gioco: i componenti grafici lo interrogano, non lo reimplementano.
 */
export interface UniverseRules {
  universeId: UniverseId;
  characterKinds: CharacterKind[];
  /** null = regola non ancora documentata dai materiali forniti. */
  progression: ProgressionTrack | null;
  campaignTemplates: CampaignTemplate[];
  missingMaterials: string[];
  sources: SourceRef[];
}
