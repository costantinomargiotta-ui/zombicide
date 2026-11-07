import type { Activity, Campaign, GameSession, SessionParticipant } from '../domain/types';
import { db, type HubDatabase } from './db';

/**
 * Dati DIMOSTRATIVI, marcati origin = 'demo' e rimovibili in blocco.
 * Servono solo a vedere le schermate popolate: non sono dati reali.
 */
const D = '2026-11-01T10:00:00.000Z';

const campaigns: Campaign[] = [
  { id: 'demo_camp_rio', universeId: 'moderno', name: '[DEMO] Rio Z Janeiro', productId: 'rio-z-janeiro', status: 'in-corso', plannedScenarioCount: 10, description: 'Campagna dimostrativa.', origin: 'demo', createdAt: D, updatedAt: D },
  { id: 'demo_camp_bp', universeId: 'fantasy', name: '[DEMO] Black Plague', productId: 'black-plague', status: 'sospesa', plannedScenarioCount: 11, description: 'Campagna dimostrativa.', origin: 'demo', createdAt: D, updatedAt: D },
];

const sessions: GameSession[] = [
  { id: 'demo_s1', universeId: 'moderno', campaignId: 'demo_camp_rio', scenarioTitle: 'Scenario dimostrativo 1', playedOn: '2026-10-20', durationMinutes: 95, outcome: 'vittoria', zombiesKilled: 64, origin: 'demo', createdAt: D, updatedAt: D },
  { id: 'demo_s2', universeId: 'moderno', campaignId: 'demo_camp_rio', scenarioTitle: 'Scenario dimostrativo 2', playedOn: '2026-10-27', durationMinutes: 120, outcome: 'sconfitta', origin: 'demo', createdAt: D, updatedAt: D },
  { id: 'demo_s3', universeId: 'fantasy', campaignId: 'demo_camp_bp', scenarioTitle: 'Scenario dimostrativo A', playedOn: '2026-10-30', outcome: 'vittoria', zombiesKilled: 41, origin: 'demo', createdAt: D, updatedAt: D },
];

const participants: SessionParticipant[] = [
  { id: 'demo_p1', sessionId: 'demo_s1', characterName: 'Personaggio demo 1' },
  { id: 'demo_p2', sessionId: 'demo_s1', characterName: 'Personaggio demo 2' },
  { id: 'demo_p3', sessionId: 'demo_s2', characterName: 'Personaggio demo 1' },
  { id: 'demo_p4', sessionId: 'demo_s3', characterName: 'Personaggio demo 3' },
];

const activities: Activity[] = [
  { id: 'demo_a1', kind: 'partita', universeId: 'moderno', message: '[DEMO] Vittoria: Scenario dimostrativo 1', origin: 'demo', at: '2026-10-20T21:00:00.000Z' },
  { id: 'demo_a2', kind: 'partita', universeId: 'fantasy', message: '[DEMO] Vittoria: Scenario dimostrativo A', origin: 'demo', at: '2026-10-30T21:00:00.000Z' },
];

export async function loadDemoData(database: HubDatabase = db) {
  await database.transaction('rw', [database.campaigns, database.sessions, database.sessionParticipants, database.activities], async () => {
    await database.campaigns.bulkPut(campaigns);
    await database.sessions.bulkPut(sessions);
    await database.sessionParticipants.bulkPut(participants);
    await database.activities.bulkPut(activities);
  });
}

export async function removeDemoData(database: HubDatabase = db) {
  await database.transaction('rw', [database.campaigns, database.sessions, database.sessionParticipants, database.activities], async () => {
    const demoSessions = await database.sessions.where('origin').equals('demo').primaryKeys();
    await database.sessionParticipants.where('sessionId').anyOf(demoSessions as string[]).delete();
    await database.sessions.where('origin').equals('demo').delete();
    await database.campaigns.where('origin').equals('demo').delete();
    await database.activities.where('origin').equals('demo').delete();
  });
}
