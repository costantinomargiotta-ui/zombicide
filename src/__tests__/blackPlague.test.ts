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

import { MISSION_SERIES, seriesFor, seriesStates } from '../rules/missionSeries';
import { Z2_MISSIONS } from '../rules/moderno/zombicide2e';
describe('serie di missioni', () => {
  it('Zombicide 2ª edizione: 26 Missioni, da M0 a M25', () => {
    expect(Z2_MISSIONS.map((m) => m.code)).toEqual(Array.from({ length: 26 }, (_, i) => `M${i}`));
    expect(new Set(Z2_MISSIONS.map((m) => m.page)).size).toBe(26);
  });
  it('ogni serie ha id univoci e una difficoltà prevista', () => {
    for (const sr of MISSION_SERIES) {
      expect(new Set(sr.missions.map((m) => m.id)).size).toBe(sr.missions.length);
      expect(sr.missions.every((m) => sr.difficulties.includes(m.difficulty))).toBe(true);
    }
  });
  it('calcola lo stato senza ordine obbligato', () => {
    const sr = seriesFor('zombicide-2e-missioni')!;
    const st = seriesStates(sr, [{ scenarioId: 'z2-m10', outcome: 'vittoria' }, { scenarioId: 'z2-m10', outcome: 'sconfitta' }]);
    expect(st[10]).toMatchObject({ wins: 1, played: 2 });
    expect(st[0]).toMatchObject({ wins: 0, played: 0 });
  });
});
