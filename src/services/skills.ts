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
  // Moderno: prima le espansioni (Abilità nuove), poi la 2ª edizione, per ultima la 1ª (testi diversi). Fantasy: Black Plague ha la precedenza su Green Horde.
  const rank = (id: string) => (id === 'zombicide-1e' ? 3 : id === 'zombicide-2e' ? 2 : id === 'green-horde' || id === 'white-death' ? 1 : 0);
  const sources = SKILL_SOURCES.filter((s) => s.universeId === universeId).sort((a, b) => rank(a.productId) - rank(b.productId));
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

/** Abilità «contenitore» che richiamano un'altra Abilità (es. «Al Massimo: +1 Dado: Mischia»). */
const WRAPPERS = [/^al massimo:\s*/i];

/** Per un'Abilità che ne richiama un'altra, restituisce l'Abilità richiamata con la sua descrizione. */
export function referencedSkill(universeId: UniverseId, name: string): (SkillMatch & { name: string }) | undefined {
  for (const re of WRAPPERS) {
    if (!re.test(name)) continue;
    const inner = name.replace(re, '').trim();
    const match = findSkill(universeId, inner);
    return match ? { ...match, name: inner } : undefined;
  }
  return undefined;
}
