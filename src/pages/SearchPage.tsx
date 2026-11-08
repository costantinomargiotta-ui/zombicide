import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, Box, Library, Map, NotebookPen, Search, Sparkles, Target, Users } from 'lucide-react';
import { db } from '../data/db';
import { search, type ResultKind } from '../services/search';
import { Panel } from '../ui/components/Panel';
import { EmptyState } from '../ui/components/EmptyState';

const KIND: Record<ResultKind, { label: string; icon: typeof Search }> = {
  campagna: { label: 'Campagne', icon: Target },
  sopravvissuto: { label: 'Sopravvissuti', icon: Users },
  carta: { label: 'Carte', icon: Library },
  scenario: { label: 'Scenari', icon: Map },
  prodotto: { label: 'Collezione', icon: Box },
  abilita: { label: 'Abilità', icon: Sparkles },
  nota: { label: 'Note', icon: NotebookPen },
};

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const index = useLiveQuery(async () => ({
    campaigns: await db.campaigns.toArray(),
    characters: await db.characters.toArray(),
    cards: await db.cards.toArray(),
    products: await db.products.toArray(),
    notes: await db.notes.toArray(),
    abilityNames: new globalThis.Map((await db.abilities.toArray()).map((a) => [a.id, a.name] as [string, string])),
  }));
  const results = useMemo(() => (index ? search(index, q) : []), [index, q]);
  const groups = (Object.keys(KIND) as ResultKind[]).map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) })).filter((g) => g.items.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <Search className="size-7 text-[var(--accent-2)]" aria-hidden />
        <input autoFocus className="input flex-1 text-lg" placeholder="Cerca campagne, sopravvissuti, carte, scenari, abilità, note…" value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} aria-label="Cerca" />
      </div>
      {!q.trim() ? (
        <EmptyState icon={BookOpen} title="Cosa cerchi?">Scrivi un nome o una parola: la ricerca ignora maiuscole e accenti e trova anche i sopravvissuti per abilità.</EmptyState>
      ) : groups.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {groups.map(({ kind, items }) => (
            <Panel key={kind} title={`${KIND[kind].label} (${items.length})`} icon={KIND[kind].icon}>
              <ul className="flex flex-col">
                {items.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    <Link to={r.to} className="flex flex-col border-b border-white/10 px-1 py-2 last:border-0 hover:bg-white/5">
                      <span className="font-semibold">{r.title}</span>
                      {r.subtitle && <span className="truncate text-xs text-[var(--muted)]">{r.subtitle}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState icon={Search} title={`Nessun risultato per «${q}»`} />
      )}
    </div>
  );
}
