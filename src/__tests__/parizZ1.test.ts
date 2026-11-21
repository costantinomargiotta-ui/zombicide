import { describe, expect, it } from 'vitest';
import { PZ_MISSIONS } from '../rules/moderno/pariz';
import { Z1_MISSIONS } from '../rules/moderno/zombicide1e';
import { ALL_MISSION_EXTRAS } from '../rules/missionExtras';
import { SKILL_SOURCES } from '../rules/skillGlossary';
import { findSkill } from '../services/skills';

describe('Zombicide 1ª edizione e PariZ', () => {
  it('1ª edizione: Tutorial e 10 Missioni, senza difficoltà inventate', () => {
    expect(Z1_MISSIONS.map((m) => m.code)).toEqual(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    expect(Z1_MISSIONS.every((m) => m.difficulty === 'Non indicata')).toBe(true);
  });
  it('PariZ: 10 Missioni con orario di partenza e Lorànt nelle regole', () => {
    expect(PZ_MISSIONS.map((m) => m.code)).toEqual(Array.from({ length: 10 }, (_, i) => `M${i + 1}`));
    expect(PZ_MISSIONS.every((m) => m.startTime)).toBe(true);
    expect(ALL_MISSION_EXTRAS['pz-m2'].specialRules.join(' ')).toMatch(/Lorànt/);
  });
  it('ogni Missione ha mappa e legenda', () => {
    for (const m of [...Z1_MISSIONS, ...PZ_MISSIONS]) {
      const x = ALL_MISSION_EXTRAS[m.id];
      expect(x?.image, m.id).toBe(`/mappe/${m.id}.webp`);
      expect(x.elements.length, m.id).toBeGreaterThan(2);
      expect(x.specialRules.length, m.id).toBeGreaterThan(0);
    }
  });
  it('glossario: le abilità della 1ª edizione non sostituiscono quelle della 2ª', () => {
    expect(SKILL_SOURCES.find((s) => s.productId === 'zombicide-1e')?.skills).toHaveLength(33);
    expect(SKILL_SOURCES.find((s) => s.productId === 'pariz')?.skills).toHaveLength(8);
    expect(findSkill('moderno', 'Medico')?.source.productId).toBe('zombicide-2e');
    expect(findSkill('moderno', 'Colpo in parata')?.source.productId).toBe('pariz');
  });
});
