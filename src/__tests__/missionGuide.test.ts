import { describe, expect, it } from 'vitest';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { MISSION_SERIES } from '../rules/missionSeries';
import { ALL_MISSION_EXTRAS } from '../rules/missionExtras';
import { missionGuide } from '../services/missionGuide';

describe('Come si gioca', () => {
  const ms = [...SHEET_CAMPAIGNS.flatMap((c) => c.missions), ...MISSION_SERIES.flatMap((s) => s.missions)];
  it('ogni Missione ha riassunto e almeno un passo', () => {
    for (const m of ms) {
      const g = missionGuide(m as never, ALL_MISSION_EXTRAS[m.id]);
      expect(g.summary, m.id).toMatch(/obiettiv/);
      expect(g.steps.length, m.id).toBeGreaterThan(0);
    }
  });
  it('Rio M3: Molotov, Traguardo e avviso sull’Opala che brucia', () => {
    const m = SHEET_CAMPAIGNS[0].missions.find((x) => x.id === 'rio-m3')!;
    const g = missionGuide(m, ALL_MISSION_EXTRAS[m.id]);
    expect(g.tips.join(' ')).toMatch(/Molotov/);
    expect(g.setup.join(' ')).toMatch(/Rallentare l’Invasione/);
    expect(g.watchOut.join(' ')).toMatch(/Brucia, bellezza, brucia/);
  });
});
