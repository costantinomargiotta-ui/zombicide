import type { Character, Product, UniverseId } from '../domain/types';
import { MISSION_SERIES } from '../rules/missionSeries';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { ALL_MISSION_EXTRAS } from '../rules/missionExtras';
import { SKILL_SOURCES } from '../rules/skillGlossary';

/** Riga del rendiconto: cosa la web app contiene per ogni scatola. */
export interface CoverageRow {
  product: Product;
  missions: number;
  withMap: number;
  kind: 'campagna' | 'serie' | null;
  source?: string;
  survivors: number;
  survivorsWithAbilities: number;
  skills: number;
}

export function coverage(products: Product[], characters: Character[]): CoverageRow[] {
  return products.map((product) => {
    const sheet = SHEET_CAMPAIGNS.find((c) => c.productId === product.id);
    const series = MISSION_SERIES.find((s) => s.productId === product.id);
    const missions = sheet?.missions ?? series?.missions ?? [];
    const chars = characters.filter((c) => c.productId === product.id);
    return {
      product,
      missions: missions.length,
      withMap: missions.filter((m) => ALL_MISSION_EXTRAS[m.id]).length,
      kind: sheet ? 'campagna' : series ? 'serie' : null,
      source: sheet?.rulebook ?? series?.source,
      survivors: chars.length,
      survivorsWithAbilities: chars.filter((c) => c.abilities.length > 0).length,
      skills: SKILL_SOURCES.filter((s) => s.productId === product.id).reduce((a, s) => a + s.skills.length, 0),
    };
  });
}

export function universeTotals(rows: CoverageRow[], universeId: UniverseId) {
  const own = rows.filter((r) => r.product.universeId === universeId);
  return {
    boxes: own.length,
    withMissions: own.filter((r) => r.missions > 0).length,
    missions: own.reduce((a, r) => a + r.missions, 0),
    withMap: own.reduce((a, r) => a + r.withMap, 0),
    survivors: own.reduce((a, r) => a + r.survivors, 0),
  };
}
