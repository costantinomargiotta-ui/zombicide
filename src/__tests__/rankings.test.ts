import { describe, expect, it } from 'vitest';
import { characterRanking, playerRanking, sessionsByMonth } from '../services/rankings';
import type { GameSession } from '../domain/types';

const T = '2026-01-01T00:00:00.000Z';
const s = (id: string, playedOn: string, outcome: GameSession['outcome']): GameSession => ({ id, universeId: 'moderno', playedOn, outcome, origin: 'utente', createdAt: T, updatedAt: T });
const input = {
  sessions: [s('a', '2026-09-10', 'vittoria'), s('b', '2026-11-02', 'sconfitta'), s('c', '2026-11-05', 'in-corso')],
  sessionParticipants: [
    { id: '1', sessionId: 'a', characterId: 'ney', participantId: 'p1' },
    { id: '2', sessionId: 'b', characterId: 'ney', participantId: 'p1' },
    { id: '3', sessionId: 'b', characterId: 'vivi', participantId: 'p2' },
  ],
  participants: [
    { id: 'p1', campaignId: 'c', characterId: 'ney', playerName: 'Costantino', joinedAt: T },
    { id: 'p2', campaignId: 'c', characterId: 'vivi', joinedAt: T },
  ],
  progress: [{ id: 'x', campaignId: 'c', participantId: 'p1', payload: { kind: 'pec', amount: 2 }, createdAt: T }],
  characters: [{ id: 'ney', name: 'Ney' }, { id: 'vivi', name: 'Vivi' }] as never,
};

describe('classifiche', () => {
  it('conta partite, vittorie e PEC per sopravvissuto, ignorando le partite in corso', () => {
    expect(characterRanking(input)[0]).toEqual({ characterId: 'ney', name: 'Ney', played: 2, victories: 1, pec: 2 });
  });
  it('i giocatori senza nome non entrano in classifica', () => {
    expect(playerRanking(input).map((p) => p.name)).toEqual(['Costantino']);
  });
  it('i mesi senza partite compaiono a zero', () => {
    expect(sessionsByMonth(input).map((m) => [m.month, m.victories, m.defeats])).toEqual([['2026-09', 1, 0], ['2026-10', 0, 0], ['2026-11', 0, 1]]);
  });
});
