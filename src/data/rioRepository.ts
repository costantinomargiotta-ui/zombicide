import type { CampaignParticipant, GameSession, ProgressEntry, SessionOutcome, SessionParticipant } from '../domain/types';
import {
  BONUS_ACTION_SLOTS, RIO_MISSIONS, computeSheet, missionPec, validateReward,
  type ProgressPayload, type ProgressRow, type RewardChoice, type SheetState,
} from '../rules/moderno/rioZJaneiro';
import { newId, nowIso } from '../lib/ids';
import { db, type HubDatabase } from './db';
import { createRepository } from './repository';

export interface MissionParticipantInput {
  participantId: string;
  reachedOrange: boolean;
  reachedRed: boolean;
  extraPec: number;
  traguardi: string[];
  died: boolean;
}

export interface MissionSessionInput {
  campaignId: string;
  missionId: string;
  playedOn: string;
  durationMinutes?: number;
  outcome: Exclude<SessionOutcome, 'in-corso'>;
  zombiesKilled?: number;
  notes?: string;
  participants: MissionParticipantInput[];
}

/** Stato della scheda di un partecipante, con i Traguardi ereditati dai predecessori morti. */
export function sheetFor(participant: CampaignParticipant, all: CampaignParticipant[], progress: ProgressEntry[]): SheetState {
  const rowsOf = (id: string) => progress.filter((p) => p.participantId === id) as unknown as ProgressRow[];
  const inherited: string[] = [];
  const seen = new Set<string>();
  let prev = participant.successorOf ? all.find((p) => p.id === participant.successorOf) : undefined;
  const chain: CampaignParticipant[] = [];
  while (prev && !seen.has(prev.id)) { seen.add(prev.id); chain.unshift(prev); prev = prev.successorOf ? all.find((p) => p.id === prev!.successorOf) : undefined; }
  for (const p of chain) for (const t of computeSheet(rowsOf(p.id)).traguardi) if (!inherited.includes(t)) inherited.push(t);
  return computeSheet(rowsOf(participant.id), inherited);
}

export function bonusSpent(p: CampaignParticipant): number {
  const v = p.missionState?.bonusSpent;
  return typeof v === 'number' ? v : 0;
}

export function createRioRepository(database: HubDatabase = db) {
  const base = createRepository(database);

  async function campaignOf(id: string) {
    const c = await database.campaigns.get(id);
    if (!c) throw new Error('Campagna inesistente.');
    return c;
  }

  async function stateOf(participantId: string) {
    const p = await database.participants.get(participantId);
    if (!p) throw new Error('Partecipante inesistente.');
    const all = await database.participants.where('campaignId').equals(p.campaignId).toArray();
    const progress = await database.progress.where('campaignId').equals(p.campaignId).toArray();
    return { participant: p, state: sheetFor(p, all, progress) };
  }

  async function addEntry(campaignId: string, participantId: string, payload: ProgressPayload, sessionId?: string) {
    await database.progress.add({ id: newId('prog'), campaignId, participantId, sessionId, payload, createdAt: nowIso() });
  }

  return {
    async addParticipant(input: { campaignId: string; characterId: string; playerName?: string; successorOf?: string }) {
      const campaign = await campaignOf(input.campaignId);
      const character = await database.characters.get(input.characterId);
      if (!character) throw new Error('Personaggio inesistente.');
      const existing = await database.participants.where('campaignId').equals(input.campaignId).toArray();
      if (existing.some((p) => p.characterId === input.characterId)) {
        throw new Error(`${character.name} fa già parte di questa campagna (anche un Sopravvissuto morto non può tornare).`);
      }
      const participant: CampaignParticipant = {
        id: newId('part'), campaignId: input.campaignId, characterId: input.characterId,
        playerName: input.playerName?.trim() || undefined, successorOf: input.successorOf, joinedAt: nowIso(),
      };
      await database.transaction('rw', database.participants, database.activities, async () => {
        await database.participants.add(participant);
        await base.log('campagna', `${character.name} si unisce a ${campaign.name}`, { universeId: campaign.universeId, refId: campaign.id, origin: campaign.origin });
      });
      return participant;
    },

    async removeParticipant(id: string) {
      const used = (await database.progress.where('participantId').equals(id).count()) + (await database.sessionParticipants.where('participantId').equals(id).count());
      if (used) throw new Error('Questo Sopravvissuto ha già partite o progressi registrati: non può essere rimosso.');
      await database.participants.delete(id);
    },

    async updateParticipant(id: string, patch: Partial<Pick<CampaignParticipant, 'playerName' | 'notes'>>) {
      await database.participants.update(id, patch);
    },

    async chooseReward(participantId: string, milestone: number, choice: RewardChoice, abilityId?: string) {
      const { participant, state } = await stateOf(participantId);
      const error = validateReward(state, milestone, choice, abilityId);
      if (error) throw new Error(error);
      await addEntry(participant.campaignId, participantId, { kind: 'ricompensa', milestone, choice, abilityId: choice === 'abilita-campagna' ? abilityId : undefined });
    },

    /** Annulla una ricompensa (es. scelta per errore o rimasta senza Pietra Miliare dopo una correzione). */
    async undoReward(participantId: string, milestone: number) {
      const rows = await database.progress.where('participantId').equals(participantId).toArray();
      const ids = rows.filter((r) => r.payload.kind === 'ricompensa' && r.payload.milestone === milestone).map((r) => r.id);
      await database.progress.bulkDelete(ids);
    },

    async setBonusSpent(participantId: string, spent: number) {
      const { participant, state } = await stateOf(participantId);
      const value = Math.max(0, Math.min(spent, state.bonusActions, BONUS_ACTION_SLOTS));
      await database.participants.update(participantId, { missionState: { ...participant.missionState, bonusSpent: value } });
    },

    async addManualTraguardo(participantId: string, text: string) {
      if (!text.trim()) return;
      const { participant } = await stateOf(participantId);
      await addEntry(participant.campaignId, participantId, { kind: 'traguardo', text: text.trim() });
    },

    /** Rimuove un Traguardo aggiunto a mano (quelli nati da una partita si correggono modificando la partita). */
    async removeManualTraguardo(participantId: string, text: string) {
      const rows = await database.progress.where('participantId').equals(participantId).toArray();
      await database.progress.bulkDelete(rows.filter((r) => !r.sessionId && r.payload.kind === 'traguardo' && r.payload.text === text).map((r) => r.id));
    },

    async adjustPecManually(participantId: string, amount: number) {
      const { participant } = await stateOf(participantId);
      await addEntry(participant.campaignId, participantId, { kind: 'pec', amount, reason: 'manuale' });
    },

    async addKeptItem(participantId: string, name: string) {
      if (!name.trim()) return;
      const p = await database.participants.get(participantId);
      if (!p) return;
      await database.keptItems.add({ id: newId('kept'), campaignId: p.campaignId, participantId, name: name.trim(), createdAt: nowIso() });
    },

    async removeKeptItem(id: string) {
      await database.keptItems.delete(id);
    },

    /**
     * Registra o corregge una Missione. Le righe di registro della partita vengono
     * cancellate e rigenerate in un'unica transazione: nessun PEC duplicato.
     */
    async saveMissionSession(input: MissionSessionInput, sessionId?: string): Promise<string> {
      const campaign = await campaignOf(input.campaignId);
      const mission = RIO_MISSIONS.find((m) => m.id === input.missionId);
      if (!mission) throw new Error('Missione sconosciuta.');
      if (!input.participants.length) throw new Error('Indica almeno un Sopravvissuto.');
      const now = nowIso();
      const existing = sessionId ? await database.sessions.get(sessionId) : undefined;
      const id = existing?.id ?? newId('sess');
      const session: GameSession = {
        id, universeId: campaign.universeId, campaignId: campaign.id, scenarioId: mission.id,
        scenarioTitle: `${mission.code} – ${mission.title}`, playedOn: input.playedOn,
        durationMinutes: input.durationMinutes, outcome: input.outcome, zombiesKilled: input.zombiesKilled,
        notes: input.notes, origin: campaign.origin, createdAt: existing?.createdAt ?? now, updatedAt: now,
      };
      const participants = await database.participants.where('campaignId').equals(campaign.id).toArray();
      const tables = [database.sessions, database.sessionParticipants, database.progress, database.participants, database.campaigns, database.activities];
      await database.transaction('rw', tables, async () => {
        await database.sessions.put(session);
        await database.sessionParticipants.where('sessionId').equals(id).delete();
        await database.progress.where('sessionId').equals(id).delete();
        for (const p of input.participants) {
          const participant = participants.find((x) => x.id === p.participantId);
          if (!participant) throw new Error('Partecipante non valido.');
          const sp: SessionParticipant = {
            id: newId('sp'), sessionId: id, participantId: participant.id, characterId: participant.characterId,
            campaignData: { reachedOrange: p.reachedOrange, reachedRed: p.reachedRed, extraPec: p.extraPec, traguardi: p.traguardi, died: p.died },
          };
          await database.sessionParticipants.add(sp);
          for (const payload of missionPec({ reachedOrange: p.reachedOrange, reachedRed: p.reachedRed, extra: p.extraPec })) await addEntry(campaign.id, participant.id, payload, id);
          for (const t of p.traguardi.map((x) => x.trim()).filter(Boolean)) await addEntry(campaign.id, participant.id, { kind: 'traguardo', text: t }, id);
          if (p.died) await addEntry(campaign.id, participant.id, { kind: 'stato', status: 'morto' }, id);
        }
        if (!existing) {
          // La Riserva di Azioni Bonus si rifornisce alla fine di ogni Missione (pag. 11).
          for (const p of participants) await database.participants.update(p.id, { missionState: { ...p.missionState, bonusSpent: 0 } });
        }
        if (campaign.status === 'da-iniziare') await database.campaigns.update(campaign.id, { status: 'in-corso', updatedAt: now });
        else await database.campaigns.update(campaign.id, { updatedAt: now });
        const verb = existing ? 'Partita corretta' : input.outcome === 'vittoria' ? 'Vittoria' : 'Sconfitta';
        await base.log('partita', `${verb}: ${mission.code} – ${mission.title} (${campaign.name})`, { universeId: campaign.universeId, refId: id, origin: campaign.origin });
      });
      return id;
    },

    async deleteSession(sessionId: string) {
      const s = await database.sessions.get(sessionId);
      if (!s) return;
      await database.transaction('rw', [database.sessions, database.sessionParticipants, database.progress, database.activities], async () => {
        await database.sessionParticipants.where('sessionId').equals(sessionId).delete();
        await database.progress.where('sessionId').equals(sessionId).delete();
        await database.sessions.delete(sessionId);
        await base.log('partita', `Partita eliminata: ${s.scenarioTitle ?? ''}`, { universeId: s.universeId, refId: s.campaignId, origin: s.origin });
      });
    },
  };
}

export const rioRepo = createRioRepository();
