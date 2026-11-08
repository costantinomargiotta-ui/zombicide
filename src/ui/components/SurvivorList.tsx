import { useState, type ReactNode } from 'react';
import { Filter, Search, Skull, UserRound } from 'lucide-react';
import type { Character } from '../../domain/types';
import { defaultPortraitUrl } from '../../domain/portraits';
import { StoredImage } from './StoredImage';

export interface SurvivorListItem {
  key: string;
  character: Character;
  subtitle?: string;
  badge?: ReactNode;
  dead?: boolean;
}

interface Props {
  title: string;
  items: SurvivorListItem[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  /** Gruppi di filtro facoltativi (es. per scatola di provenienza). */
  groups?: { id: string; label: string; match: (i: SurvivorListItem) => boolean }[];
  action?: ReactNode;
}

function Thumb({ c }: { c: Character }) {
  const url = defaultPortraitUrl(c.id);
  return (
    <StoredImage imageId={c.portraitImageId} alt="" className="size-full object-cover object-top"
      fallback={url ? <img src={url} alt="" className="size-full object-cover object-[50%_20%]" loading="lazy" /> : <span className="grid size-full place-items-center"><UserRound className="size-5 text-[var(--muted)]" /></span>} />
  );
}

/** Elenco scuro dei sopravvissuti, come nei mockup: ritratto, nome, selezione evidenziata. */
export function SurvivorList({ title, items, selectedKey, onSelect, groups, action }: Props) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const active = groups?.find((g) => g.id === group);
  const list = items.filter((i) => i.character.name.toLowerCase().includes(query.trim().toLowerCase()) && (!active || active.match(i)));

  return (
    <aside className="panel flex max-h-[calc(100dvh-8rem)] flex-col overflow-hidden md:sticky md:top-24" aria-label={title}>
      <div className="flex items-center gap-2 border-b-2 border-black/60 bg-gradient-to-b from-white/10 to-transparent px-3 py-2">
        <h2 className="title-display flex-1 text-2xl">{title} ({items.length})</h2>
        {action}
      </div>
      <div className="flex gap-1.5 p-2">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
          <input className="input py-1.5 pl-8 text-sm" placeholder="Cerca sopravvissuto…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cerca sopravvissuto" />
        </label>
        {groups && groups.length > 1 && (
          <button type="button" className={`btn px-2 ${group ? 'btn-accent' : ''}`} onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} aria-label="Filtri"><Filter className="size-4" /></button>
        )}
      </div>
      {showFilters && groups && (
        <div className="flex flex-wrap gap-1 px-2 pb-2">
          <button type="button" className={`btn px-2 py-0.5 text-xs ${!group ? 'btn-accent' : ''}`} onClick={() => setGroup('')}>Tutti</button>
          {groups.map((g) => <button key={g.id} type="button" className={`btn px-2 py-0.5 text-xs ${group === g.id ? 'btn-accent' : ''}`} onClick={() => setGroup(g.id)}>{g.label}</button>)}
        </div>
      )}
      {list.length ? (
        <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-x-visible md:overflow-y-auto">
          {list.map((i) => {
            const isActive = i.key === selectedKey;
            return (
              <li key={i.key} className="shrink-0">
                <button type="button" onClick={() => onSelect(i.key)} aria-current={isActive || undefined}
                  className={`focus-ring relative flex w-full items-center gap-2.5 overflow-hidden rounded-md border-2 py-0.5 pr-2 pl-0.5 text-left transition ${isActive ? 'border-[var(--ok)] bg-gradient-to-r from-[#1f4a10] to-[#0f2208] shadow-[0_0_14px_rgb(87_192_42/0.45)]' : 'border-transparent bg-black/30 hover:border-[var(--line-hi)] hover:bg-white/5'} ${i.dead ? 'opacity-60' : ''}`}>
                  <span className="h-10 w-11 shrink-0 overflow-hidden rounded-[4px] bg-black/50"><Thumb c={i.character} /></span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="flex items-center gap-1.5 truncate text-lg font-semibold">{i.character.name}{i.dead && <Skull className="size-4 text-red-400" aria-label="Morto" />}</span>
                    {i.subtitle && <span className="block truncate text-[11px] text-[var(--muted)]">{i.subtitle}</span>}
                  </span>
                  {i.badge}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-3 pb-3 text-sm text-[var(--muted)]">{items.length ? 'Nessun risultato.' : 'Nessun sopravvissuto.'}</p>
      )}
    </aside>
  );
}
