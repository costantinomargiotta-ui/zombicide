import { describe, expect, it } from 'vitest';
import { findSkill } from '../services/skills';
import { SKILL_SOURCES } from '../rules/skillGlossary';
import { seedFantasyAbilities } from '../data/seed/survivorsFantasy';
import { seedModernAbilities } from '../data/seed/survivorsModern';

describe('glossario delle Abilità', () => {
  it('ogni voce ha nome e descrizione', () => {
    for (const s of SKILL_SOURCES) for (const k of s.skills) { expect(k.name).toBeTruthy(); expect(k.description.length).toBeGreaterThan(20); }
  });
  it('trova le abilità generiche', () => {
    expect(findSkill('moderno', '+1 Dado: Combattimento')?.skill.name).toBe('+1 dado: [Azione]');
    expect(findSkill('moderno', 'Benedetto')?.source.productId).toBe('rio-z-janeiro');
    expect(findSkill('moderno', 'F.I.A.: +1 Dado: Combattimento')?.skill.name).toBe('Fratelli in armi: [effetto di gioco]');
  });
  it('tutte le abilità di Black Plague hanno una descrizione', () => {
    expect(seedFantasyAbilities.filter((a) => !findSkill('fantasy', a.name)).map((a) => a.name)).toEqual([]);
  });
  it('tutte le abilità Moderno hanno una descrizione', () => {
    expect(seedModernAbilities.filter((a) => !findSkill('moderno', a.name)).map((a) => a.name)).toEqual([]);
  });
});
