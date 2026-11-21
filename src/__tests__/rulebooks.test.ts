import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { RULEBOOKS, rulebookForProduct } from '../rules/rulebooks';
import { MISSION_SERIES } from '../rules/missionSeries';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { db } from '../data/db';
import { SYNCED_TABLES } from '../data/sync';
import { rulebookIndex, searchRulebooks } from '../services/rulebookStore';

describe('Regolamenti', () => {
  it('17 regolamenti, id unici, link solo al sito ufficiale', () => {
    expect(RULEBOOKS).toHaveLength(17);
    expect(new Set(RULEBOOKS.map((r) => r.id)).size).toBe(17);
    for (const r of RULEBOOKS) if (r.url) expect(r.url).toMatch(/^https:\/\/cdn\.svc\.asmodee\.net\/production-asmodeeit\/uploads\/.+\.pdf$/);
    expect(RULEBOOKS.filter((r) => !r.url).map((r) => r.id)).toEqual(['z1']);
  });
  it('ogni scatola con missioni ha il suo regolamento e le pagine delle missioni esistono', () => {
    const products = [...SHEET_CAMPAIGNS.map((c) => c.productId), ...MISSION_SERIES.filter((s) => !s.web).map((s) => s.productId)];
    for (const p of products) expect(rulebookForProduct(p), p).toBeTruthy();
    for (const s of MISSION_SERIES.filter((x) => !x.web)) for (const m of s.missions) expect(m.page, m.id).toBeLessThanOrEqual(rulebookForProduct(s.productId)!.pages);
  });
  it('l’indice unisce capitoli e missioni, in ordine di pagina', () => {
    const idx = rulebookIndex(RULEBOOKS.find((r) => r.id === 'rio')!);
    expect(idx.some((c) => c.mission && c.title.startsWith('M4'))).toBe(true);
    expect(idx.map((c) => c.page)).toEqual([...idx.map((c) => c.page)].sort((a, b) => a - b));
  });
  it('le copie locali non sono sincronizzate', () => {
    expect(SYNCED_TABLES as readonly string[]).not.toContain('rulebookFiles');
    expect(SYNCED_TABLES as readonly string[]).not.toContain('rulebookText');
  });
  it('la ricerca trova la pagina ignorando maiuscole e accenti', async () => {
    await db.rulebookText.put({ id: 'rio', pages: ['Niente qui', 'Il Fuoco Amico infligge Ferite. Più avanti: fuoco amico ancora.'] });
    const hits = await searchRulebooks('fuoco amico');
    expect(hits[0]).toMatchObject({ id: 'rio', page: 2, count: 2 });
    expect(await searchRulebooks('piu avanti')).toHaveLength(1);
    expect(await searchRulebooks('ab')).toEqual([]);
  });
});
