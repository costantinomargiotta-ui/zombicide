import { describe, expect, it } from 'vitest';
import { computeStats, campaignProgress } from '../services/stats';
import type { Campaign, GameSession } from '../domain/types';
import { seedProducts } from '../data/seed/products';

const T = '2026-01-01T00:00:00.000Z';
const camp = (id: string, extra: Partial<Campaign> = {}): Campaign => ({
  id, universeId: 'moderno', name: id, productId: 'rio-z-janeiro', status: 'in-corso', origin: 'utente', createdAt: T, updatedAt: T, ...extra,
});
const sess = (id: string, extra: Partial<GameSession>): GameSession => ({
  id, universeId: 'moderno', playedOn: '2026-01-02', outcome: 'vittoria', origin: 'utente', createdAt: T, updatedAt: T, ...extra,
});

describe('statistiche', () => {
  it('senza dati non inventa valori', () => {
    const s = computeStats({ products: seedProducts, collection: [], campaigns: [], sessions: [], participants: [] });
    expect(s.sessionsPlayed).toBe(0);
    expect(s.successRate).toBeNull();
    expect(s.zombiesKilled).toBeNull();
    expect(s.minutesPlayed).toBeNull();
    expect(s.averageCompletion).toBeNull();
    expect(s.ownedProducts).toBe(0);
  });

  it('conta gli scenari distinti vinti, non le vittorie ripetute', () => {
    const c = camp('c1', { plannedScenarioCount: 4 });
    const p = campaignProgress(c, [
      sess('a', { campaignId: 'c1', scenarioTitle: 'S1' }),
      sess('b', { campaignId: 'c1', scenarioTitle: 'S1' }),
      sess('c', { campaignId: 'c1', scenarioTitle: 'S2', outcome: 'sconfitta' }),
    ]);
    expect(p.completedScenarios).toBe(1);
    expect(p.ratio).toBe(0.25);
  });

  it('percentuale non disponibile se il totale scenari è ignoto', () => {
    expect(campaignProgress(camp('c2'), []).ratio).toBeNull();
  });

  it('separa gli universi e somma solo i dati registrati', () => {
    const s = computeStats({
      products: seedProducts,
      collection: [{ productId: 'rio-z-janeiro', owned: true, updatedAt: T }, { productId: 'black-plague', owned: true, updatedAt: T }],
      campaigns: [camp('c1')],
      sessions: [sess('a', { zombiesKilled: 10 }), sess('b', { outcome: 'sconfitta' }), sess('f', { universeId: 'fantasy', zombiesKilled: 99 })],
      participants: [],
    }, 'moderno');
    expect(s.ownedProducts).toBe(1);
    expect(s.zombiesKilled).toBe(10);
    expect(s.successRate).toBe(0.5);
    expect(s.activeCampaigns).toHaveLength(1);
  });
});
