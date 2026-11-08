import type { GameSession, SessionOutcome } from '../domain/types';
import { newId, nowIso } from '../lib/ids';
import { db, type HubDatabase } from './db';
import { createRepository } from './repository';

export interface SimpleSessionInput {
  campaignId: string;
  missionId: string;
  missionTitle: string;
  playedOn: string;
  outcome: Exclude<SessionOutcome, 'in-corso'>;
  durationMinutes?: number;
  zombiesKilled?: number;
  notes?: string;
  participants: { characterId: string; playerName?: string }[];
}

/**
 * Partite di una serie di missioni senza progressione (es. Black Plague base).
 * Correggere una partita sostituisce i suoi partecipanti: nessun dato duplicato.
 */
export function createMissionRepository(database: HubDatabase = db) {
  const base = createRepository(database);
  return {
    async saveSession(input: SimpleSessionInput, sessionId?: string): Promise<string> {
      const campaign = await database.campaigns.get(input.campaignId);
      if (!campaign) throw new Error('Campagna inesistente.');
      if (!input.participants.length) throw new Error('Indica almeno un Sopravvissuto.');
      const now = nowIso();
      const existing = sessionId ? await database.sessions.get(sessionId) : undefined;
      const id = existing?.id ?? newId('sess');
      const session: GameSession = {
        id, universeId: campaign.universeId, campaignId: campaign.id, scenarioId: input.missionId, scenarioTitle: input.missionTitle,
        playedOn: input.playedOn, durationMinutes: input.durationMinutes, outcome: input.outcome, zombiesKilled: input.zombiesKilled,
        notes: input.notes, origin: campaign.origin, createdAt: existing?.createdAt ?? now, updatedAt: now,
      };
      await database.transaction('rw', [database.sessions, database.sessionParticipants, database.campaigns, database.activities], async () => {
        await database.sessions.put(session);
        await database.sessionParticipants.where('sessionId').equals(id).delete();
        for (const p of input.participants) {
          await database.sessionParticipants.add({ id: newId('sp'), sessionId: id, characterId: p.characterId, campaignData: p.playerName?.trim() ? { playerName: p.playerName.trim() } : undefined });
        }
        await database.campaigns.update(campaign.id, { status: campaign.status === 'da-iniziare' ? 'in-corso' : campaign.status, updatedAt: now });
        const verb = existing ? 'Partita corretta' : input.outcome === 'vittoria' ? 'Vittoria' : 'Sconfitta';
        await base.log('partita', `${verb}: ${input.missionTitle} (${campaign.name})`, { universeId: campaign.universeId, refId: id, origin: campaign.origin });
      });
      return id;
    },
  };
}

export const missionRepo = createMissionRepository();
