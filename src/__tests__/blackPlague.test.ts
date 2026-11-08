import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { HubDatabase } from '../data/db';
import { createRepository } from '../data/repository';
import { createMissionRepository } from '../data/missionRepository';
import { BP_MISSIONS, bpMissionStates } from '../rules/fantasy/blackPlague';
import { seedFantasySurvivors } from '../data/seed/survivorsFantasy';

describe('Black Plague', () => {
  it('11 Missioni dal regolamento, da 0 a 10', () => {
    expect(BP_MISSIONS.map((m) => m.code)).toEqual(['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']);
    expect(BP_MISSIONS.filter((m) => m.difficulty === 'Difficile')).toHaveLength(3);
  });
  it('6 sopravvissuti senza abilità inventate', () => {
    expect(seedFantasySurvivors.map((c) => c.name)).toEqual(['Nelly', 'Ann', 'Silas', 'Clovis', 'Baldric', 'Samson']);
    expect(seedFantasySurvivors.every((c) => c.abilities.length === 0 && c.dataStatus === 'da-verificare')).toBe(true);
  });
  it('registra e corregge una partita senza duplicare i partecipanti', async () => {
    const db = new HubDatabase(`bp-${Math.random()}`);
    await db.open();
    const c = await createRepository(db).createCampaign({ universeId: 'fantasy', name: 'Serie', productId: 'black-plague', templateId: 'black-plague-missioni' });
    const repo = createMissionRepository(db);
    const input = { campaignId: c.id, missionId: 'bp-m0', missionTitle: 'M0 – Danza macabra', playedOn: '2026-11-08', outcome: 'sconfitta' as const, participants: [{ characterId: 'fantasy-nelly', playerName: 'Costantino' }, { characterId: 'fantasy-ann' }] };
    const id = await repo.saveSession(input);
    await repo.saveSession({ ...input, outcome: 'vittoria', participants: [{ characterId: 'fantasy-nelly' }] }, id);
    expect(await db.sessionParticipants.where('sessionId').equals(id).count()).toBe(1);
    const states = bpMissionStates(await db.sessions.toArray());
    expect(states[0]).toMatchObject({ wins: 1, played: 1 });
    expect((await db.campaigns.get(c.id))?.status).toBe('in-corso');
  });
});
