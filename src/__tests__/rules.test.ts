import { describe, expect, it } from 'vitest';
import { dangerLevelFor, rulesFor, xpToNextLevel } from '../rules';

describe('moduli regole', () => {
  it('Black Plague: soglie di pericolo da regolamento (pag. 16)', () => {
    const t = rulesFor('fantasy').progression!;
    expect(dangerLevelFor(t, 6).id).toBe('blu');
    expect(dangerLevelFor(t, 7).id).toBe('giallo');
    expect(dangerLevelFor(t, 19).id).toBe('arancio');
    expect(dangerLevelFor(t, 43).id).toBe('rosso');
    expect(xpToNextLevel(t, 10)).toBe(9);
    expect(xpToNextLevel(t, 43)).toBeNull();
  });

  it('Marvel ha un modulo proprio con tipologie distinte', () => {
    const m = rulesFor('marvel');
    expect(m.characterKinds.map((k) => k.id)).toEqual(['eroe-zombie', 'supereroe', 'passante']);
    expect(m.progression?.levels.find((l) => l.id === 'rosso')?.effect).toMatch(/Tutte le Abilità/);
  });

  it('Moderno usa le soglie della 2ª edizione (pag. 15), Western resta non documentato', () => {
    const t = rulesFor('moderno').progression!;
    expect(t.source.page).toBe(15);
    expect(dangerLevelFor(t, 18).id).toBe('giallo');
    expect(dangerLevelFor(t, 19).id).toBe('arancione');
    expect(rulesFor('western').progression).toBeNull();
    expect(rulesFor('moderno').campaignTemplates[0].status).toBe('pronto');
  });
});
