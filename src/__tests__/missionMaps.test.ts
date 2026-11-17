import { describe, expect, it } from 'vitest';
// @ts-ignore: modulo Node disponibile solo nei test
import { existsSync } from 'node:fs';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { MISSION_EXTRAS } from '../rules/moderno/missionMaps';
import { BP_MISSIONS } from '../rules/fantasy/blackPlague';
import { BP_MISSION_EXTRAS } from '../rules/fantasy/bpMissionMaps';
import { Z2_MISSIONS } from '../rules/moderno/zombicide2e';
import { Z2_MISSION_EXTRAS } from '../rules/moderno/z2MissionMaps';
import { WU_MISSIONS } from '../rules/fantasy/wulfsburg';
import { WU_MISSION_EXTRAS } from '../rules/fantasy/wuMissionMaps';

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
  it('ogni Missione di Black Plague e Zombicide 2ª edizione ha mappa, legenda con icone e regole speciali', () => {
    for (const m of [...BP_MISSIONS, ...Z2_MISSIONS, ...WU_MISSIONS]) {
      const x = BP_MISSION_EXTRAS[m.id] ?? Z2_MISSION_EXTRAS[m.id] ?? WU_MISSION_EXTRAS[m.id];
      expect(x, m.id).toBeDefined();
      expect(existsSync(`public${x.image}`), x.image).toBe(true);
      for (const e of x.elements) expect(e.icon && existsSync(`public${e.icon}`), `${m.id} ${e.label}`).toBe(true);
      expect(x.specialRules.length).toBeGreaterThan(0);
    }
  });
});
