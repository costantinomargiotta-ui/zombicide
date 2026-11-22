import type { Campaign, Character, EquipmentCard, FreeNote, Product } from '../domain/types';
import { SHEET_CAMPAIGNS, allCampaignAbilities } from '../rules/moderno/sheetCampaigns';
import { MISSION_SERIES } from '../rules/missionSeries';
import { SKILL_SOURCES } from '../rules/skillGlossary';

export type ResultKind = 'campagna' | 'sopravvissuto' | 'carta' | 'scenario' | 'prodotto' | 'abilita' | 'nota';

export interface SearchResult { kind: ResultKind; id: string; title: string; subtitle?: string; to: string }

export interface SearchIndex {
  campaigns: Campaign[];
  characters: Character[];
  cards: EquipmentCard[];
  products: Product[];
  notes: FreeNote[];
  abilityNames: Map<string, string>;
}

/** Testo senza accenti e in minuscolo, così «tè» trova «Tè mate» e «mae» trova «Mãe». */
export const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Ricerca pura su catalogo e salvataggi. Ogni parola della ricerca deve comparire. */
export function search(index: SearchIndex, query: string, limit = 60): SearchResult[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const hit = (...fields: (string | undefined)[]) => {
    const text = normalize(fields.filter(Boolean).join(' '));
    return words.every((w) => text.includes(w));
  };
  const productName = (id?: string) => index.products.find((p) => p.id === id)?.name;
  const out: SearchResult[] = [];

  for (const c of index.campaigns) if (hit(c.name, c.description, c.notes, productName(c.productId)))
    out.push({ kind: 'campagna', id: c.id, title: c.name, subtitle: productName(c.productId), to: `/campagne/${c.id}` });
  for (const c of index.characters) {
    const abilities = c.abilities.flatMap((g) => g.abilityIds.map((a) => index.abilityNames.get(a)));
    if (hit(c.name, productName(c.productId), ...abilities))
      out.push({ kind: 'sopravvissuto', id: c.id, title: c.name, subtitle: productName(c.productId), to: `/u/${c.universeId}/personaggi?p=${c.id}` });
  }
  for (const c of index.cards) if (hit(c.name, c.text))
    out.push({ kind: 'carta', id: c.id, title: c.name, subtitle: productName(c.productId), to: `/u/${c.universeId}/carte?q=${encodeURIComponent(c.name)}` });
  for (const sc of SHEET_CAMPAIGNS) for (const m of sc.missions) if (hit(m.code, m.title, ...m.objectives))
    out.push({ kind: 'scenario', id: m.id, title: `${m.code} – ${m.title}`, subtitle: sc.gameName, to: `/u/moderno/scenari?m=${m.id}` });
  for (const sr of MISSION_SERIES) for (const m of sr.missions) if (hit(m.code, m.title, ...m.objectives))
    out.push({ kind: 'scenario', id: m.id, title: `${m.code} – ${m.title}`, subtitle: sr.gameName, to: `/u/${sr.universeId}/scenari?m=${m.id}` });
  for (const p of index.products) if (hit(p.name, p.description))
    out.push({ kind: 'prodotto', id: p.id, title: p.name, subtitle: 'Collezione', to: `/u/${p.universeId}/collezione` });
  for (const a of allCampaignAbilities()) if (hit(a.name, a.description))
    out.push({ kind: 'abilita', id: a.id, title: a.name, subtitle: `Abilità della Campagna (${SHEET_CAMPAIGNS.filter((c) => c.abilities.some((x) => x.id === a.id)).map((c) => c.gameName).join(', ')})`, to: '/u/moderno/personaggi' });
  const seenSkill = new Set<string>();
  // La 1ª edizione per ultima: a parità di nome vale il testo delle edizioni correnti.
  const skillSources = [...SKILL_SOURCES].sort((a, b) => Number(a.productId === 'zombicide-1e') - Number(b.productId === 'zombicide-1e'));
  for (const src of skillSources) for (const k of src.skills) {
    const key = `${src.universeId}|${normalize(k.name)}`;
    if (seenSkill.has(key) || !hit(k.name, k.description)) continue;
    seenSkill.add(key);
    out.push({ kind: 'abilita', id: `${src.productId}-${k.name}`, title: k.name, subtitle: `Abilità · ${src.source.split(' – ')[0]}`, to: `/u/${src.universeId}/abilita?q=${encodeURIComponent(k.name)}` });
  }
  for (const n of index.notes) if (hit(n.title, n.body))
    out.push({ kind: 'nota', id: n.id, title: n.title || 'Nota senza titolo', subtitle: n.body.slice(0, 80), to: `/note?n=${n.id}` });

  // I risultati che iniziano con la ricerca vengono prima.
  const first = words.join(' ');
  return out.sort((a, b) => Number(normalize(b.title).startsWith(first)) - Number(normalize(a.title).startsWith(first))).slice(0, limit);
}
