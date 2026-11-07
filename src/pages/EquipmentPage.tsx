import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, CheckCircle2, DoorOpen, ImagePlus, Library, Lock, Search, Swords, Volume2, VolumeX } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { CARD_DECK_LABEL, type CardDeck, type EquipmentCard } from '../domain/types';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { StoredImage } from '../ui/components/StoredImage';

const DECK_STYLE: Record<CardDeck, string> = {
  partenza: 'linear-gradient(180deg,#6b625a,#2a2623)',
  'arma-pimpata': 'linear-gradient(180deg,#e2452c,#7a1418)',
  avanzato: 'linear-gradient(180deg,#3a8fd0,#123a5c)',
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="flex flex-col items-center rounded border border-black/30 bg-[#efeae0] px-1.5 py-0.5 text-black">
      <span className="text-[9px] uppercase tracking-wide text-black/60">{label}</span>
      <span className="text-base leading-tight font-bold">{value}</span>
    </span>
  );
}

export function CardTile({ card }: { card: EquipmentCard }) {
  async function upload(file?: File) {
    if (!file) return;
    const id = await repo.saveImage(file);
    const old = card.frontImageId;
    await repo.updateCard(card.id, { frontImageId: id });
    if (old) await repo.deleteImage(old);
  }
  return (
    <article className="panel flex flex-col overflow-hidden">
      <div className="relative flex h-32 items-center justify-center" style={{ background: DECK_STYLE[card.deck] }}>
        <StoredImage imageId={card.frontImageId} alt={card.name} className="size-full object-cover"
          fallback={<span className="title-display px-3 text-center text-3xl text-white">{card.name.toUpperCase()}</span>} />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {card.conservation !== undefined && <span className="flex items-center gap-1 rounded bg-black/70 px-1.5 text-sm font-bold text-white" title="Conservazione"><Lock className="size-3" />{card.conservation}</span>}
          {card.maxDice !== undefined && <span className="rounded bg-white px-1.5 text-sm font-bold text-red-700" title="Dadi Al Massimo">+{card.maxDice}</span>}
        </div>
        {card.quantity > 1 && <span className="absolute top-2 right-2 rounded bg-black/70 px-2 text-sm font-bold text-white">×{card.quantity}</span>}
        <label className="btn absolute right-2 bottom-2 cursor-pointer px-2 py-0.5 text-xs">
          <ImagePlus className="size-3" /> {card.frontImageId ? 'Sostituisci' : 'Foto'}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
        </label>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 text-sm">
        <h3 className="text-lg leading-tight font-semibold">{card.name}</h3>
        <div className="flex flex-wrap gap-1">
          {card.dual && <Badge tone="accent">Doppia</Badge>}
          {card.ammo && <Badge>{card.ammo === 'proiettili' ? 'Proiettili' : 'Cartucce'}</Badge>}
          {card.opensDoors && <Badge><DoorOpen className="size-3" /> Apre le porte ({card.opensDoors})</Badge>}
          {card.surpriseSpawn && <Badge tone="warn">Generazione a Sorpresa</Badge>}
        </div>
        {card.profiles?.map((p, i) => (
          <div key={i} className="flex flex-wrap items-center gap-1">
            <span className="w-16 text-xs font-semibold text-[var(--muted)] uppercase">{p.kind}</span>
            <Stat label="Gittata" value={p.range} />
            <Stat label="Dadi" value={p.dice ?? '–'} />
            <Stat label="Precis." value={p.accuracy ?? '–'} />
            <Stat label="Danni" value={p.damage ?? '–'} />
            {p.noisy ? <Volume2 className="size-5 text-amber-400" aria-label="Rumorosa" /> : <VolumeX className="size-5 text-sky-400" aria-label="Silenziosa" />}
          </div>
        ))}
        {card.text && <p className="italic">{card.text}</p>}
        {card.transcriptionNotes && card.dataStatus !== 'verificato' && <p className="flex gap-1 text-xs text-amber-300"><AlertTriangle className="size-4 shrink-0" />{card.transcriptionNotes}</p>}
        <div className="mt-auto pt-1">
          {card.dataStatus === 'verificato'
            ? <Badge tone="ok"><CheckCircle2 className="size-3" /> Verificata</Badge>
            : <button type="button" className="btn px-2 py-0.5 text-xs" onClick={() => repo.updateCard(card.id, { dataStatus: 'verificato' })}>Da verificare · segna come verificata</button>}
        </div>
      </div>
    </article>
  );
}

/** Catalogo delle carte. `onlyEquipment` mostra solo armi e oggetti (pagina Equipaggiamento). */
export function EquipmentPage({ onlyEquipment = false }: { onlyEquipment?: boolean }) {
  const { universeId } = useScope();
  const cards = useLiveQuery(() => db.cards.toArray());
  const products = useLiveQuery(() => db.products.toArray());
  const [deck, setDeck] = useState<CardDeck | ''>('');
  const [query, setQuery] = useState('');
  if (!cards || !products) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const list = cards
    .filter((c) => (!universeId || c.universeId === universeId) && (!onlyEquipment || c.category !== 'aaahh'))
    .filter((c) => (!deck || c.deck === deck) && c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const decks = [...new Set(cards.map((c) => c.deck))];
  const groups = [...new Set(list.map((c) => `${c.productId}|${c.deck}`))];
  const total = list.reduce((a, c) => a + c.quantity, 0);

  return (
    <div className="flex flex-col gap-5">
      <Panel title={onlyEquipment ? 'Equipaggiamento' : 'Archivio carte'} icon={onlyEquipment ? Swords : Library}>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--muted)]">{total} carte ({list.length} diverse). Dati trascritti dalle tue foto: verifica ogni carta e carica la sua immagine se vuoi.</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={`btn text-sm ${deck === '' ? 'btn-accent' : ''}`} onClick={() => setDeck('')}>Tutti i mazzi</button>
            {decks.map((d) => <button key={d} type="button" className={`btn text-sm ${deck === d ? 'btn-accent' : ''}`} onClick={() => setDeck(d)}>{CARD_DECK_LABEL[d]}</button>)}
            <label className="relative ml-auto w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
              <input className="input pl-8 text-sm" placeholder="Cerca carta…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cerca carta" />
            </label>
          </div>
        </div>
      </Panel>
      {groups.length ? groups.map((g) => {
        const [productId, d] = g.split('|') as [string, CardDeck];
        const own = list.filter((c) => c.productId === productId && c.deck === d);
        return (
          <section key={g} className="flex flex-col gap-3">
            <h2 className="title-display text-2xl">{products.find((p) => p.id === productId)?.name} · {CARD_DECK_LABEL[d]}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{own.map((c) => <CardTile key={c.id} card={c} />)}</div>
          </section>
        );
      }) : <EmptyState icon={Library} title="Nessuna carta">Le carte degli altri giochi arriveranno con le loro foto.</EmptyState>}
    </div>
  );
}
