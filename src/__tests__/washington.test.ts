import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { HubDatabase } from '../data/db';
import { createRepository } from '../data/repository';
import { createRioRepository, sheetFor } from '../data/rioRepository';
import { WZC_ABILITIES, WZC_MISSIONS } from '../rules/moderno/washingtonZC';
import { SHEET_CAMPAIGNS, sheetCampaignFor } from '../rules/moderno/sheetCampaigns';
import { missionProgress } from '../rules/moderno/rioZJaneiro';

describe('Washington Z.C. – Stato Infetto', () => {
  it('riproduce la scheda e la campagna del regolamento', () => {
    expect(WZC_ABILITIES.map((a) => a.name)).toEqual([
      'Riflessi da combattimento', 'Destino', 'Avido', 'Turarsi il naso', 'Difensore di casa', 'Salvatore', 'Basso profilo',
      'Guerriero notturno', 'Scarto laterale', 'Parte con 2 PA', 'Parte con 1 Kit di Riparazione', 'Parte con 1 carta Munizioni', 'Mano Ferma', 'Cintura portaoggetti',
    ]);
    expect(WZC_MISSIONS.map((m) => m.code)).toEqual(['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']);
    expect(WZC_MISSIONS.filter((m) => m.difficulty === 'Molto Difficile').map((m) => m.code)).toEqual(['M9', 'M10']);
    expect(SHEET_CAMPAIGNS.map((c) => c.templateId)).toEqual(['rio-z-janeiro', 'washington-zc']);
  });

  it('le missioni si sbloccano in ordine', () => {
    const p = missionProgress([{ scenarioId: 'wzc-m1', outcome: 'vittoria' }], WZC_MISSIONS);
    expect(p.slice(0, 3).map((x) => x.state)).toEqual(['completata', 'disponibile', 'bloccata']);
  });

  it("accetta solo le abilità della propria campagna", async () => {
    const db = new HubDatabase(`wzc-${Math.random()}`);
    await db.open();
    const c = await createRepository(db).createCampaign({ universeId: 'moderno', name: 'Stato Infetto', productId: 'washington-zc', templateId: 'washington-zc' });
    const rio = createRioRepository(db);
    const tess = await rio.addParticipant({ campaignId: c.id, characterId: 'moderno-tess' });
    await rio.saveMissionSession({ campaignId: c.id, missionId: 'wzc-m1', playedOn: '2026-11-08', outcome: 'vittoria', participants: [{ participantId: tess.id, reachedOrange: true, reachedRed: true, extraPec: 3, traguardi: ['Pretoriano'], died: false }] });
    await expect(rio.chooseReward(tess.id, 2, 'abilita-campagna', 'rio-tutto-qui')).rejects.toThrow();
    await rio.chooseReward(tess.id, 2, 'abilita-campagna', 'wzc-guerriero-notturno');
    const all = await db.participants.toArray();
    const s = sheetFor(all[0], all, await db.progress.toArray());
    expect(s.pec).toBe(5);
    expect(s.campaignAbilityIds).toEqual(['wzc-guerriero-notturno']);
    expect(s.traguardi).toEqual(['Pretoriano']);
    expect(sheetCampaignFor('washington-zc')?.knownMilestones.map((k) => k.name)).toContain('Rifugiato nei Tunnel');
  });
});
