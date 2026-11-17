import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, CircleDashed, LayoutDashboard, Map, XCircle } from 'lucide-react';
import { db } from '../data/db';
import { PRODUCT_KIND_LABEL, UNIVERSE_IDS, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { coverage, universeTotals, type CoverageRow } from '../services/coverage';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';

type Filter = 'tutte' | 'con' | 'senza';

function MissionCell({ r }: { r: CoverageRow }) {
  if (!r.missions) return <span className="flex items-center gap-1.5 text-red-300"><XCircle className="size-4" /> Assenti</span>;
  const full = r.withMap === r.missions;
  return (
    <span className={`flex items-center gap-1.5 ${full ? 'text-[var(--ok)]' : 'text-amber-300'}`}>
      <CheckCircle2 className="size-4" /> {r.missions} {r.missions === 1 ? 'missione' : 'missioni'}
      <span className="flex items-center gap-0.5 text-xs text-[var(--muted)]"><Map className="size-3" />{r.withMap}/{r.missions}</span>
    </span>
  );
}

/** Rendiconto: per ogni universo, le scatole a catalogo e cosa la web app contiene di ciascuna. */
export function CoveragePage() {
  const { universeId: scoped, path } = useScope();
  const products = useLiveQuery(() => db.products.toArray());
  const characters = useLiveQuery(() => db.characters.toArray());
  const [filter, setFilter] = useState<Filter>('tutte');
  const rows = useMemo(() => (products && characters ? coverage(products, characters) : []), [products, characters]);
  if (!products || !characters) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const universes: UniverseId[] = scoped ? [scoped] : [...UNIVERSE_IDS];
  const all = rows.filter((r) => universes.includes(r.product.universeId));
  const totalMissions = all.reduce((a, r) => a + r.missions, 0);
  const totalMap = all.reduce((a, r) => a + r.withMap, 0);
  const withMissions = all.filter((r) => r.missions > 0).length;
  const match = (r: CoverageRow) => filter === 'tutte' || (filter === 'con' ? r.missions > 0 : r.missions === 0);
  const kindOrder = { 'gioco-base': 0, espansione: 1, campagna: 2, 'contenuto-aggiuntivo': 3 } as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex flex-wrap items-center gap-3 px-4 py-2.5">
        <LayoutDashboard className="size-8 text-[var(--accent-2)]" aria-hidden />
        <h1 className="title-display flex-1 text-3xl">Copertura</h1>
        <div className="flex gap-2" role="group" aria-label="Filtro">
          {([['tutte', 'Tutte'], ['con', 'Con missioni'], ['senza', 'Senza missioni']] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id} className={`btn text-sm ${filter === id ? 'btn-accent' : ''}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Scatole a catalogo', all.length],
          ['Scatole con missioni', `${withMissions} / ${all.length}`],
          ['Missioni', totalMissions],
          ['Missioni con mappa', `${totalMap} / ${totalMissions}`],
        ].map(([label, value]) => (
          <div key={label} className="panel px-4 py-3">
            <div className="text-sm text-[var(--muted)]">{label}</div>
            <div className="title-display text-3xl">{value}</div>
          </div>
        ))}
      </div>

      {!scoped && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {universes.map((u) => {
            const t = universeTotals(rows, u);
            const pct = t.boxes ? Math.round((t.withMissions / t.boxes) * 100) : 0;
            return (
              <Link key={u} to={`/u/${u}/copertura`} className="panel focus-ring flex items-center gap-3 px-4 py-3 hover:brightness-110">
                <img src={`/ui/icona-${u}.webp`} alt="" className="size-10 object-contain" />
                <div className="min-w-0 flex-1">
                  <div className="title-display text-xl">{UNIVERSES[u].name}</div>
                  <div className="text-xs text-[var(--muted)]">{t.withMissions}/{t.boxes} scatole · {t.missions} missioni · {t.survivors} sopravvissuti</div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/60"><div className="h-full rounded-full bg-gradient-to-r from-[#57c02a] to-[#f5c518]" style={{ width: `${pct}%` }} /></div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {universes.map((u) => {
        const own = all.filter((r) => r.product.universeId === u && match(r)).sort((a, b) => kindOrder[a.product.kind] - kindOrder[b.product.kind] || a.product.name.localeCompare(b.product.name));
        if (!own.length) return null;
        return (
          <Panel key={u} title={UNIVERSES[u].name} icon={LayoutDashboard} bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-xs text-[var(--muted)]">
                  <tr className="border-b border-[var(--line)]">
                    <th className="px-4 py-2 font-medium">Scatola</th>
                    <th className="px-2 py-2 font-medium">Tipo</th>
                    <th className="px-2 py-2 font-medium">Missioni</th>
                    <th className="px-2 py-2 font-medium">Registro partite</th>
                    <th className="px-2 py-2 font-medium">Sopravvissuti</th>
                    <th className="px-2 py-2 font-medium">Abilità</th>
                    <th className="px-4 py-2 font-medium">Dati</th>
                  </tr>
                </thead>
                <tbody>
                  {own.map((r) => (
                    <tr key={r.product.id} className="border-b border-[var(--line)] last:border-0" title={r.source}>
                      <td className="px-4 py-2 font-semibold">{r.product.name}</td>
                      <td className="px-2 py-2 text-[var(--muted)]">{PRODUCT_KIND_LABEL[r.product.kind]}</td>
                      <td className="px-2 py-2">{r.missions ? <Link to={path('scenari')} className="hover:underline"><MissionCell r={r} /></Link> : <MissionCell r={r} />}</td>
                      <td className="px-2 py-2">{r.kind === 'campagna' ? <Badge tone="accent">Campagna con scheda</Badge> : r.kind === 'serie' ? <Badge tone="ok">Serie di missioni</Badge> : <span className="text-[var(--muted)]">–</span>}</td>
                      <td className="px-2 py-2">{r.survivors ? <span className={r.survivorsWithAbilities === r.survivors ? '' : 'text-amber-300'}>{r.survivors}{r.survivorsWithAbilities < r.survivors ? ` (${r.survivors - r.survivorsWithAbilities} senza abilità)` : ''}</span> : <span className="text-[var(--muted)]">–</span>}</td>
                      <td className="px-2 py-2">{r.skills || <span className="text-[var(--muted)]">–</span>}</td>
                      <td className="px-4 py-2">{r.product.dataStatus === 'verificato' ? <Badge tone="ok"><CheckCircle2 className="size-3" /> Verificati</Badge> : <Badge tone="warn"><CircleDashed className="size-3" /> Da verificare</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        );
      })}
      <p className="text-xs text-[var(--muted)]">"Verificati": scatola confermata da un regolamento o da materiale ufficiale. Le abilità sono quelle del glossario introdotte da quella scatola.</p>
    </div>
  );
}
