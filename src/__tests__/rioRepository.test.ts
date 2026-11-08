import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { HubDatabase } from '../data/db';
import { createRepository } from '../data/repository';
import { createRioRepository, sheetFor, bonusSpent } from '../data/rioRepository';

async function setup() {
  const db = new HubDatabase(`rio-${Math.random()}`);
  await db.open();
  const repo = createRepository(db);
  const rio = createRioRepository(db);
  const c = await repo.createCampaign({ universeId: 'moderno', name: 'Carnevale', productId: 'rio-z-janeiro', templateId: 'rio-z-janeiro' });
  const ney = await rio.addParticipant({ campaignId: c.id, characterId: 'moderno-ney', playerName: 'Costantino' });
  const vivi = await rio.addParticipant({ campaignId: c.id, characterId: 'moderno-vivi' });
  const sheet = async (id: string) => {
    const all = await db.participants.toArray();
    return sheetFor(all.find((p) => p.id === id)!, all, await db.progress.toArray());
  };
  return { db, repo, rio, c, ney, vivi, sheet };
}

const base = { playedOn: '2026-11-07', outcome: 'vittoria' as const };
const part = (participantId: string, o: Partial<{ reachedOrange: boolean; reachedRed: boolean; extraPec: number; traguardi: string[]; died: boolean; kills: Record<string, number> }> = {}) =>
  ({ participantId, reachedOrange: false, reachedRed: false, extraPec: 0, traguardi: [], died: false, ...o });

describe('campagna Rio Z Janeiro collegata a partite e schede', () => {
  it('una partita aggiorna le schede e avvia la campagna', async () => {
    const { db, rio, c, ney, vivi, sheet } = await setup();
    await rio.saveMissionSession({ ...base, campaignId: c.id, missionId: 'rio-m1', participants: [part(ney.id, { reachedOrange: true, reachedRed: true }), part(vivi.id, { reachedOrange: true })] });
    expect((await sheet(ney.id)).pec).toBe(2);
    expect((await sheet(ney.id)).pendingMilestones).toEqual([2]);
    expect((await sheet(vivi.id)).pec).toBe(1);
    expect((await db.campaigns.get(c.id))?.status).toBe('in-corso');
  });

  it('correggere la partita non duplica i PEC', async () => {
    const { rio, c, ney, sheet } = await setup();
    const input = { ...base, campaignId: c.id, missionId: 'rio-m1', participants: [part(ney.id, { reachedOrange: true, reachedRed: true })] };
    const id = await rio.saveMissionSession(input);
    await rio.chooseReward(ney.id, 2, 'azione-bonus');
    await rio.saveMissionSession(input, id);
    expect((await sheet(ney.id)).pec).toBe(2);
    await rio.saveMissionSession({ ...input, participants: [part(ney.id, { reachedOrange: true })] }, id);
    const s = await sheet(ney.id);
    expect(s.pec).toBe(1);
    expect(s.orphanRewards).toEqual([2]);
  });

  it('le Azioni Bonus spese si azzerano alla fine della Missione successiva', async () => {
    const { db, rio, c, ney } = await setup();
    await rio.saveMissionSession({ ...base, campaignId: c.id, missionId: 'rio-m1', participants: [part(ney.id, { extraPec: 2 })] });
    await rio.chooseReward(ney.id, 2, 'azione-bonus');
    await rio.setBonusSpent(ney.id, 5);
    expect(bonusSpent((await db.participants.get(ney.id))!)).toBe(1);
    await rio.saveMissionSession({ ...base, campaignId: c.id, missionId: 'rio-m2', participants: [part(ney.id)] });
    expect(bonusSpent((await db.participants.get(ney.id))!)).toBe(0);
  });

  it('un Sopravvissuto morto non torna e il successore eredita i Traguardi', async () => {
    const { rio, c, ney, sheet } = await setup();
    await rio.saveMissionSession({ ...base, campaignId: c.id, missionId: 'rio-m1', participants: [part(ney.id, { traguardi: ['Opala Nera'], died: true, extraPec: 3 })] });
    await expect(rio.addParticipant({ campaignId: c.id, characterId: 'moderno-ney' })).rejects.toThrow();
    const heir = await rio.addParticipant({ campaignId: c.id, characterId: 'moderno-steven', successorOf: ney.id });
    const s = await sheet(heir.id);
    expect(s.traguardi).toEqual(['Opala Nera']);
    expect(s.pec).toBe(0);
  });

  it('due campagne dello stesso gioco restano indipendenti', async () => {
    const { repo, rio, c, ney, sheet } = await setup();
    const c2 = await repo.createCampaign({ universeId: 'moderno', name: 'Seconda', productId: 'rio-z-janeiro', templateId: 'rio-z-janeiro' });
    const ney2 = await rio.addParticipant({ campaignId: c2.id, characterId: 'moderno-ney' });
    await rio.saveMissionSession({ ...base, campaignId: c.id, missionId: 'rio-m1', participants: [part(ney.id, { extraPec: 4 })] });
    expect((await sheet(ney.id)).pec).toBe(4);
    expect((await sheet(ney2.id)).pec).toBe(0);
  });
});

describe('contatore zombie', () => {
  it('il contatore passa nella partita, somma il totale e si azzera', async () => {
    const { db, rio, c, ney, vivi } = await setup();
    await rio.addLiveKill(ney.id, 'deambulante', 1);
    await rio.addLiveKill(ney.id, 'deambulante', 1);
    await rio.addLiveKill(ney.id, 'corridore', 1);
    await rio.addLiveKill(ney.id, 'corridore', -1);
    await rio.addLiveKill(vivi.id, 'abominio', 1);
    const { liveKills } = await import('../data/rioRepository');
    const n = await db.participants.get(ney.id);
    expect(liveKills(n!)).toEqual({ deambulante: 2, corridore: 0 });
    const id = await rio.saveMissionSession({ ...base, campaignId: c.id, missionId: 'rio-m1', participants: [
      part(ney.id, { kills: liveKills(n!) } as never), part(vivi.id, { kills: { abominio: 1 } } as never)] });
    expect((await db.sessions.get(id))?.zombiesKilled).toBe(3);
    expect(liveKills((await db.participants.get(ney.id))!)).toEqual({});
  });
});
