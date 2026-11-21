import { describe, expect, it } from 'vitest';
import { AND_MISSIONS, WEB_MISSIONS, WEB_PAGE_ONLY } from '../rules/moderno/webMissions';
import { ALL_MISSION_EXTRAS } from '../rules/missionExtras';
import { MISSION_SERIES } from '../rules/missionSeries';

describe('Missioni web', () => {
  it('41 missioni con PDF, 3 solo pagina web e i 6 capitoli di A New Dawn', () => {
    expect(WEB_MISSIONS).toHaveLength(41);
    expect(WEB_PAGE_ONLY).toHaveLength(3);
    expect(AND_MISSIONS.map((m) => m.code)).toEqual(['WM19', 'WM20', 'WM21', 'WM30', 'WM31', 'WM32']);
  });
  it('ogni missione con PDF ha mappa, legenda, regole e link ufficiale', () => {
    for (const m of [...WEB_MISSIONS, ...AND_MISSIONS]) {
      const x = ALL_MISSION_EXTRAS[m.id];
      expect(x?.image, m.id).toMatch(/^\/mappe\/wm\d+\.webp$/);
      expect(x.elements.length, m.id).toBeGreaterThan(2);
      expect(m.rules.length, m.id).toBeGreaterThan(0);
      expect(m.pdf, m.id).toMatch(/^https:\/\/cdn\.svc\.asmodee\.net\/production-zombicide\/uploads\/.+\.pdf$/);
      expect(m.intro, m.id).toBeTruthy();
    }
  });
  it('le missioni con espansione indicano la scatola richiesta', () => {
    const req = Object.fromEntries(WEB_MISSIONS.filter((m) => m.requires).map((m) => [m.code, m.requires]));
    expect(req).toEqual({ WM27: ['fort-hendrix'], WM28: ['washington-zc'], WM38: ['rio-z-janeiro'], WM39: ['rio-z-janeiro'], WM46: ['rio-z-janeiro'] });
  });
  it('codici e id unici, serie registrate', () => {
    const ids = [...WEB_MISSIONS, ...WEB_PAGE_ONLY, ...AND_MISSIONS].map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(MISSION_SERIES.filter((s) => s.web).map((s) => s.gameName)).toEqual(['Missioni web', 'A New Dawn']);
  });
});
