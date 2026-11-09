import { SKILL_SOURCES, type SkillEntry, type SkillSource } from '../rules/skillGlossary';
import type { UniverseId } from '../domain/types';

/** Ricerca della descrizione di un'Abilità nel glossario del suo universo. */
const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[!]/g, '').replace(/\s+/g, ' ').trim();
const ALIASES: [RegExp, string][] = [
  [/^f\.i\.a\.:/, 'fratelli in armi:'],
  // Scheda di Vivi: "al tiro dei dadi" invece di "al risultato dei dadi".
  [/^\+1 al tiro dei dadi:/, '+1 al risultato dei dadi:'],
  // Schede ThunderCats: "+1 dado Combattimento" senza "in".
  [/^risultato 6: \+1 dado combattimento$/, 'risultato 6: +1 dado in combattimento'],
];

export interface SkillMatch { skill: SkillEntry; source: SkillSource }

export function findSkill(universeId: UniverseId, name: string): SkillMatch | undefined {
  let n = norm(name);
  for (const [re, to] of ALIASES) n = n.replace(re, to);
  // Prima le espansioni (Abilità nuove), poi la scatola base.
  const sources = SKILL_SOURCES.filter((s) => s.universeId === universeId).sort((a, b) => Number(a.productId === 'zombicide-2e') - Number(b.productId === 'zombicide-2e'));
  for (const source of sources) {
    const skill = source.skills.find((k) => norm(k.name) === n);
    if (skill) return { skill, source };
  }
  for (const source of sources) {
    for (const skill of source.skills) {
      if (!skill.name.includes('[')) continue;
      const pattern = norm(skill.name).split(/\[[^\]]*\]/).map((p) => p.replace(/[.*+?^${}()|\\]/g, '\\$&')).join('(.+)');
      if (new RegExp(`^${pattern}$`).test(n)) return { skill, source };
    }
  }
  return undefined;
}
