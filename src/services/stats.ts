import type {
  Campaign, CollectionEntry, GameSession, Product, SessionParticipant, UniverseId,
} from '../domain/types';

/** Istantanea dei dati necessari alle statistiche. Funzioni pure, testabili. */
export interface StatsInput {
  products: Product[];
  collection: CollectionEntry[];
  campaigns: Campaign[];
  sessions: GameSession[];
  participants: SessionParticipant[];
}

export interface CampaignProgress {
  campaign: Campaign;
  completedScenarios: number;
  /** null se il numero di scenari previsti non è noto. */
  ratio: number | null;
  lastSession?: GameSession;
}

/** Scenari completati = scenari distinti con almeno una vittoria. */
export function campaignProgress(campaign: Campaign, sessions: GameSession[]): CampaignProgress {
  const own = sessions.filter((s) => s.campaignId === campaign.id);
  const won = new Set(
    own.filter((s) => s.outcome === 'vittoria').map((s) => s.scenarioId ?? s.scenarioTitle ?? s.id),
  );
  const completedScenarios = won.size;
  const planned = campaign.plannedScenarioCount;
  const ratio = planned && planned > 0 ? Math.min(1, completedScenarios / planned) : null;
  const lastSession = [...own].sort((a, b) => b.playedOn.localeCompare(a.playedOn))[0];
  return { campaign, completedScenarios, ratio, lastSession };
}

/** Media dei completamenti noti; null se nessuna campagna ha un totale noto. */
export function averageCompletion(progress: CampaignProgress[]): number | null {
  const known = progress.map((p) => p.ratio).filter((r): r is number => r !== null);
  if (!known.length) return null;
  return known.reduce((a, b) => a + b, 0) / known.length;
}

export interface ScopeStats {
  ownedProducts: number;
  ownedBaseGames: number;
  ownedExpansions: number;
  catalogProducts: number;
  activeCampaigns: CampaignProgress[];
  allCampaigns: CampaignProgress[];
  completedCampaigns: number;
  averageCompletion: number | null;
  sessionsPlayed: number;
  victories: number;
  defeats: number;
  /** null se nessuna partita conclusa. */
  successRate: number | null;
  scenariosCompleted: number;
  /** null se nessuna partita ha registrato gli zombie eliminati. */
  zombiesKilled: number | null;
  /** null se nessuna partita ha registrato la durata. */
  minutesPlayed: number | null;
  distinctCharacters: number;
  lastSession?: GameSession;
  recentCharacters: string[];
}

function sumKnown(values: (number | undefined)[]): number | null {
  const known = values.filter((v): v is number => typeof v === 'number');
  return known.length ? known.reduce((a, b) => a + b, 0) : null;
}

export function computeStats(input: StatsInput, universeId?: UniverseId): ScopeStats {
  const inScope = <T extends { universeId: UniverseId }>(rows: T[]) =>
    universeId ? rows.filter((r) => r.universeId === universeId) : rows;

  const products = inScope(input.products);
  const ownedIds = new Set(input.collection.filter((c) => c.owned).map((c) => c.productId));
  const owned = products.filter((p) => ownedIds.has(p.id));
  const campaigns = inScope(input.campaigns);
  const sessions = inScope(input.sessions);
  const sessionIds = new Set(sessions.map((s) => s.id));
  const participants = input.participants.filter((p) => sessionIds.has(p.sessionId));

  const allCampaigns = campaigns.map((c) => campaignProgress(c, sessions));
  const activeCampaigns = allCampaigns.filter((p) => p.campaign.status === 'in-corso' || p.campaign.status === 'da-iniziare' || p.campaign.status === 'sospesa');
  const victories = sessions.filter((s) => s.outcome === 'vittoria').length;
  const defeats = sessions.filter((s) => s.outcome === 'sconfitta').length;
  const concluded = victories + defeats;

  const sortedSessions = [...sessions].sort((a, b) => b.playedOn.localeCompare(a.playedOn) || b.createdAt.localeCompare(a.createdAt));
  const characterKey = (p: SessionParticipant) => p.characterId ?? p.characterName?.trim().toLowerCase();
  const recentCharacters: string[] = [];
  for (const s of sortedSessions) {
    for (const p of participants.filter((x) => x.sessionId === s.id)) {
      const label = p.characterName ?? p.characterId;
      if (label && !recentCharacters.includes(label)) recentCharacters.push(label);
    }
    if (recentCharacters.length >= 6) break;
  }

  return {
    ownedProducts: owned.length,
    ownedBaseGames: owned.filter((p) => p.kind === 'gioco-base').length,
    ownedExpansions: owned.filter((p) => p.kind !== 'gioco-base').length,
    catalogProducts: products.length,
    activeCampaigns: activeCampaigns.filter((p) => p.campaign.status !== 'completata'),
    allCampaigns,
    completedCampaigns: campaigns.filter((c) => c.status === 'completata').length,
    averageCompletion: averageCompletion(allCampaigns.filter((p) => p.campaign.status !== 'completata')),
    sessionsPlayed: sessions.filter((s) => s.outcome !== 'in-corso').length,
    victories,
    defeats,
    successRate: concluded ? victories / concluded : null,
    scenariosCompleted: allCampaigns.reduce((a, p) => a + p.completedScenarios, 0),
    zombiesKilled: sumKnown(sessions.map((s) => s.zombiesKilled)),
    minutesPlayed: sumKnown(sessions.map((s) => s.durationMinutes)),
    distinctCharacters: new Set(participants.map(characterKey).filter(Boolean)).size,
    lastSession: sortedSessions[0],
    recentCharacters: recentCharacters.slice(0, 6),
  };
}
