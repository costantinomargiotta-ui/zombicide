import { describe, expect, it } from 'vitest';
// @ts-ignore: modulo Node disponibile solo nei test
import { existsSync } from 'node:fs';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { MISSION_EXTRAS } from '../rules/moderno/missionMaps';

describe('mappe delle Missioni', () => {
  it('ogni Missione di Rio e Washington ha mappa, legenda con icone e regole speciali', () => {
    for (const sc of SHEET_CAMPAIGNS) for (const m of sc.missions) {
      const x = MISSION_EXTRAS[m.id];
      expect(x, m.id).toBeDefined();
      expect(existsSync(`public${x.image}`), x.image).toBe(true);
      expect(x.elements.length).toBeGreaterThan(3);
      for (const e of x.elements) expect(e.icon && existsSync(`public${e.icon}`), `${m.id} ${e.label}`).toBe(true);
      expect(x.specialRules.length).toBeGreaterThan(0);
    }
  });
});
