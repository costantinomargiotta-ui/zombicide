import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Box, CheckCircle2, Circle, Pencil, Plus, Search } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { PRODUCT_KIND_LABEL, UNIVERSE_IDS, type Product, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { StoredImage } from '../ui/components/StoredImage';
import { UniverseEmblem } from '../ui/components/UniverseEmblem';
import { ProductForm } from './ProductForm';
import { defaultBoxImageUrl } from '../domain/boxImages';

type OwnFilter = 'tutti' | 'posseduti' | 'mancanti';

export function CollectionPage() {
  const { universeId } = useScope();
  const products = useLiveQuery(() => db.products.toArray());
  const collection = useLiveQuery(() => db.collection.toArray());
  const [own, setOwn] = useState<OwnFilter>('tutti');
  const [query, setQuery] = useState('');
  const [universeFilter, setUniverseFilter] = useState<UniverseId | ''>('');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);

  const scopeUniverse = universeId ?? (universeFilter || undefined);
  const byId = useMemo(() => new Map(collection?.map((c) => [c.productId, c])), [collection]);

  const visible = (products ?? [])
    .filter((p) => !scopeUniverse || p.universeId === scopeUniverse)
    .filter((p) => (own === 'tutti' ? true : own === 'posseduti' ? byId.get(p.id)?.owned : !byId.get(p.id)?.owned))
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => UNIVERSE_IDS.indexOf(a.universeId) - UNIVERSE_IDS.indexOf(b.universeId) || a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));

  const ownedCount = (products ?? []).filter((p) => (!scopeUniverse || p.universeId === scopeUniverse) && byId.get(p.id)?.owned).length;
  const total = (products ?? []).filter((p) => !scopeUniverse || p.universeId === scopeUniverse).length;

  const tab = (value: OwnFilter, label: string) => (
    <button type="button" onClick={() => setOwn(value)} className={`btn text-sm ${own === value ? 'btn-accent' : ''}`} aria-pressed={own === value}>{label}</button>
  );

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title={universeId ? `Collezione ${UNIVERSES[universeId].name}` : 'La mia collezione'}
        icon={Box}
        action={<button type="button" className="btn btn-accent text-sm" onClick={() => setEditing('new')}><Plus className="size-4" /> Aggiungi prodotto</button>}
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--muted)]">
            Possiedi <strong className="text-[var(--text)]">{ownedCount}</strong> prodotti su {total} presenti nel catalogo. Il catalogo è condiviso; la collezione registra solo cosa possiedi.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {tab('tutti', 'Catalogo completo')}
            {tab('posseduti', 'Posseduti')}
            {tab('mancanti', 'Non posseduti')}
            {!universeId && (
              <select className="input w-auto text-sm" value={universeFilter} onChange={(e) => setUniverseFilter(e.target.value as UniverseId | '')} aria-label="Filtra per universo">
                <option value="">Tutti gli universi</option>
                {UNIVERSE_IDS.map((u) => <option key={u} value={u}>{UNIVERSES[u].name}</option>)}
              </select>
            )}
            <label className="relative ml-auto w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
              <input className="input pl-8 text-sm" placeholder="Cerca prodotto…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cerca prodotto" />
            </label>
          </div>
        </div>
      </Panel>

      {visible.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((p) => {
            const entry = byId.get(p.id);
            const isOwned = !!entry?.owned;
            const requires = (p.requires ?? []).map((r) => products?.find((x) => x.id === r)?.name ?? r);
            return (
              <article key={p.id} data-universe={p.universeId} className={`panel flex flex-col overflow-hidden transition ${isOwned ? 'shadow-[0_0_18px_var(--glow)]' : 'opacity-80 hover:opacity-100'}`} style={isOwned ? { borderColor: 'var(--accent)' } : undefined}>
                <div className="relative grid h-56 place-items-center overflow-hidden p-3" style={{ background: 'linear-gradient(160deg, color-mix(in srgb, var(--accent) 30%, #000), #0b0b0d)' }}>
                  <StoredImage imageId={p.coverImageId} alt={`Scatola di ${p.name}`} className="size-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)]" fallback={defaultBoxImageUrl(p.id) ? <img src={defaultBoxImageUrl(p.id)} alt={`Scatola di ${p.name}`} className="size-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)]" loading="lazy" /> : <UniverseEmblem id={p.universeId} className="size-16 text-[var(--accent)] opacity-60" />} />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge tone="accent">{PRODUCT_KIND_LABEL[p.kind]}</Badge>
                  </div>
                  {p.dataStatus === 'da-verificare' && <div className="absolute top-2 right-2"><Badge tone="warn">Da verificare</Badge></div>}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <div>
                    <h3 className="font-semibold leading-tight">{p.name}</h3>
                    <p className="text-xs text-[var(--muted)]">{UNIVERSES[p.universeId].name}{p.origin === 'utente' ? ' · aggiunto da te' : ''}</p>
                  </div>
                  {p.description && <p className="line-clamp-3 text-sm text-[var(--muted)]">{p.description}</p>}
                  {requires.length > 0 && <p className="text-xs text-[var(--muted)]">Richiede: {requires.join(', ')}</p>}
                  <textarea
                    className="input min-h-10 text-xs"
                    placeholder="Note personali…"
                    defaultValue={entry?.notes ?? ''}
                    onBlur={(e) => { if (e.target.value !== (entry?.notes ?? '')) repo.setCollectionNotes(p.id, e.target.value); }}
                    aria-label={`Note su ${p.name}`}
                  />
                  <div className="mt-auto flex gap-2">
                    <button type="button" onClick={() => repo.setOwned(p.id, !isOwned)} className={`btn flex-1 text-sm ${isOwned ? 'btn-accent' : ''}`} aria-pressed={isOwned}>
                      {isOwned ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                      {isOwned ? 'Posseduto' : 'Non posseduto'}
                    </button>
                    <button type="button" className="btn px-2.5" onClick={() => setEditing(p)} aria-label={`Modifica ${p.name}`}><Pencil className="size-4" /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Box} title="Nessun prodotto corrisponde ai filtri" />
      )}

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          open
          onClose={() => setEditing(null)}
          product={editing === 'new' ? undefined : editing}
          defaultUniverse={scopeUniverse}
          allProducts={products ?? []}
        />
      )}
    </div>
  );
}
