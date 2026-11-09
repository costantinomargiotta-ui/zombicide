import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, Car, CheckCircle2, Crosshair, DoorOpen, Flame, ImagePlus, Library, Lock, Package, Search, Sparkles, Swords, Volume2, VolumeX, X } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { CARD_DECK_LABEL, type CardDeck, type EquipmentCard } from '../domain/types';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { StoredImage } from '../ui/components/StoredImage';
import { defaultCardImageUrl } from '../domain/cardImages';

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
      <div className="relative flex min-h-32 items-center justify-center overflow-hidden" style={{ background: DECK_STYLE[card.deck] }}>
        <StoredImage imageId={card.frontImageId} alt={card.name} className="block h-auto w-full"
          fallback={defaultCardImageUrl(card.id)
            ? <img src={defaultCardImageUrl(card.id)} alt={card.name} className="block h-auto w-full" loading="lazy" />
            : <span className="title-display px-3 text-center text-3xl text-white">{card.name.toUpperCase()}</span>} />
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

/** Copie previste dal regolamento di Rio Z Janeiro (pag. 3), per il completamento del catalogo. */
const EXPECTED: Record<CardDeck, number> = { partenza: 6, 'arma-pimpata': 12, avanzato: 47 };
/** Le carte fuori mazzo (es. Opala 78) non entrano nel conteggio dei mazzi. */
const inDeck = (c: EquipmentCard) => !c.outsideDeck;

type Cat = { id: string; label: string; icon: typeof Swords; match: (c: EquipmentCard) => boolean };

const EQUIP_CATS: Cat[] = [
  { id: 'tutti', label: 'Tutti', icon: Package, match: () => true },
  { id: 'distanza', label: 'Armi a distanza', icon: Crosshair, match: (c) => !!c.profiles?.some((p) => p.kind === 'distanza') },
  { id: 'mischia', label: 'Corpo a corpo', icon: Swords, match: (c) => !!c.profiles?.some((p) => p.kind === 'mischia') },
  { id: 'veicoli', label: 'Veicoli', icon: Car, match: (c) => !!c.profiles?.some((p) => p.kind === 'auto') },
  { id: 'oggetti', label: 'Oggetti e consumabili', icon: Sparkles, match: (c) => c.category === 'oggetto' && !c.profiles?.some((p) => p.kind === 'auto') },
  { id: 'conservabili', label: 'Conservabili', icon: Lock, match: (c) => c.conservation !== undefined },
];

const CARD_CATS: Cat[] = [
  { id: 'tutti', label: 'Tutte le carte', icon: Library, match: () => true },
  { id: 'partenza', label: 'Equipaggiamento di Partenza', icon: Package, match: (c) => c.deck === 'partenza' && inDeck(c) },
  { id: 'arma-pimpata', label: 'Armi Pimpate', icon: Flame, match: (c) => c.deck === 'arma-pimpata' && inDeck(c) },
  { id: 'avanzato', label: 'Equipaggiamento Avanzato', icon: Swords, match: (c) => c.deck === 'avanzato' && inDeck(c) },
  { id: 'veicoli', label: 'Veicoli', icon: Car, match: (c) => !!c.profiles?.some((p) => p.kind === 'auto') },
];

const copies = (list: EquipmentCard[]) => list.reduce((a, c) => a + c.quantity, 0);

/** Tessera compatta come nel mockup: illustrazione, nome, copie e valori principali. */
function GridTile({ card, onOpen }: { card: EquipmentCard; onOpen: () => void }) {
  const p = card.profiles?.[0];
  return (
    <button type="button" onClick={onOpen} className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-lg border-[3px] border-[#d9a521] bg-gradient-to-b from-[#3a2a10] to-[#120d06] text-left shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 hover:brightness-110">
      <div className="relative grid min-h-28 place-items-center bg-black/40">
        <StoredImage imageId={card.frontImageId} alt={card.name} className="block h-auto w-full"
          fallback={defaultCardImageUrl(card.id) ? <img src={defaultCardImageUrl(card.id)} alt={card.name} className="block h-auto w-full" loading="lazy" /> : <Swords className="size-10 text-[#f2c418]" />} />
        {card.quantity > 1 && <span className="absolute top-1.5 right-1.5 rounded-md border border-white/40 bg-black/80 px-2 text-sm font-bold text-white">×{card.quantity}</span>}
        {card.conservation !== undefined && <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-md bg-black/80 px-1.5 text-sm font-bold text-white"><Lock className="size-3" />{card.conservation}</span>}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-gradient-to-b from-[#f3e7c4] to-[#d8c493] px-2 py-1.5 text-center text-black">
        <span className="text-lg leading-tight font-semibold">{card.name}</span>
        <span className="text-xs text-black/70">
          {p && p.dice !== undefined ? `${p.dice} ${p.dice === 1 ? 'dado' : 'dadi'} · ${p.accuracy} · ${p.damage} ${p.damage === 1 ? 'Danno' : 'Danni'}` : card.category === 'aaahh' ? 'Genera 1 Deambulante' : card.profiles?.some((x) => x.kind === 'auto') ? 'Veicolo' : card.outsideDeck ? 'Fuori mazzo' : CARD_DECK_LABEL[card.deck].replace(' Avanzato', '').replace(' Avanzate', '')}
        </span>
      </div>
    </button>
  );
}

/** Pagine Equipaggiamento e Carte, come nei mockup: categorie a sinistra, griglia a destra. */
export function EquipmentPage({ onlyEquipment = false }: { onlyEquipment?: boolean }) {
  const { universeId } = useScope();
  const cards = useLiveQuery(() => db.cards.toArray());
  const products = useLiveQuery(() => db.products.toArray());
  const kept = useLiveQuery(async () => {
    const items = await db.keptItems.toArray();
    const parts = await db.participants.bulkGet(items.map((i) => i.participantId));
    const camps = await db.campaigns.bulkGet(items.map((i) => i.campaignId));
    const chars = await db.characters.bulkGet(parts.map((p) => p?.characterId ?? ''));
    return items.map((i, k) => ({ item: i, campaign: camps[k], character: chars[k] }));
  });
  const [tab, setTab] = useState<'catalogo' | 'conservato'>('catalogo');
  const [cat, setCat] = useState('tutti');
  const [productId, setProductId] = useState('');
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const [onlyKeepable, setOnlyKeepable] = useState(false);
  const [open, setOpen] = useState<EquipmentCard | null>(null);
  if (!cards || !products) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const cats = onlyEquipment ? EQUIP_CATS : CARD_CATS;
  const base = cards.filter((c) => (!universeId || c.universeId === universeId) && (!onlyEquipment || c.category !== 'aaahh') && (!productId || c.productId === productId));
  const active = cats.find((c) => c.id === cat) ?? cats[0];
  const list = base.filter((c) => active.match(c) && (!onlyKeepable || c.conservation !== undefined) && c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const cardProducts = products.filter((p) => cards.some((c) => c.productId === p.id));
  const catalogued = copies(cards.filter((c) => c.productId === 'rio-z-janeiro' && inDeck(c)));
  const expected = Object.values(EXPECTED).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex flex-wrap items-center gap-3 px-4 py-2.5">
        {onlyEquipment ? <Package className="size-8 text-[var(--accent-2)]" aria-hidden /> : <Library className="size-8 text-[var(--accent-2)]" aria-hidden />}
        <h1 className="title-display flex-1 text-3xl">{onlyEquipment ? 'Equipaggiamento' : 'Collezione Carte'}</h1>
        {onlyEquipment ? (
          <div className="flex gap-2" role="group" aria-label="Vista">
            <button type="button" onClick={() => setTab('catalogo')} aria-pressed={tab === 'catalogo'} className={`btn text-sm ${tab === 'catalogo' ? 'btn-accent' : ''}`}><Package className="size-4" /> Catalogo</button>
            <button type="button" onClick={() => setTab('conservato')} aria-pressed={tab === 'conservato'} className={`btn text-sm ${tab === 'conservato' ? 'btn-accent' : ''}`}><Lock className="size-4" /> Conservato</button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg">Totale carte: <strong>{copies(base)}</strong></span>
            <div className="w-56" title="Copie catalogate rispetto al contenuto della scatola indicato dal regolamento di Rio Z Janeiro">
              <div className="flex justify-between text-sm"><span>Catalogate (Rio):</span><span className="font-bold text-[var(--ok)]">{Math.round((catalogued / expected) * 100)}%</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-black/60"><div className="h-full rounded-full bg-gradient-to-r from-[#57c02a] to-[#f5c518]" style={{ width: `${Math.min(100, (catalogued / expected) * 100)}%` }} /></div>
            </div>
          </div>
        )}
      </div>

      {onlyEquipment && tab === 'conservato' ? (
        <Panel title="Equipaggiamento conservato nelle campagne" icon={Lock}>
          {kept?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
              {kept.map(({ item, campaign, character }) => {
                const card = cards.find((c) => c.id === item.cardId);
                return (
                  <div key={item.id} className="flex flex-col overflow-hidden rounded-lg border-[3px] border-[#d9a521] bg-black/40">
                    {card ? <GridTile card={card} onOpen={() => setOpen(card)} /> : <div className="grid min-h-28 place-items-center"><Swords className="size-10 text-[#f2c418]" /></div>}
                    <div className="px-2 py-1.5 text-xs">
                      {!card && <div className="text-base font-semibold">{item.name}</div>}
                      <div>{character?.name ?? '–'}</div>
                      <div className="truncate text-[var(--muted)]">{campaign?.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <EmptyState icon={Lock} title="Nessun oggetto conservato">Gli oggetti si aggiungono dalla Scheda Campagna di ogni sopravvissuto.</EmptyState>}
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[250px_1fr]">
          <div className="flex flex-col gap-4">
            <Panel title="Categorie" bodyClassName="p-2">
              <ul className="flex flex-col gap-1">
                {cats.map((c) => {
                  const n = copies(base.filter(c.match));
                  const Icon = c.icon;
                  return (
                    <li key={c.id}>
                      <button type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id}
                        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition ${cat === c.id ? 'bg-gradient-to-b from-[#ffb21e] to-[#e88a00] font-semibold text-black' : 'hover:bg-white/5'}`}>
                        <Icon className="size-5 shrink-0" aria-hidden /><span className="flex-1">{c.label}</span><span>({n})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <Panel title="Filtri" bodyClassName="flex flex-col gap-2 p-3">
              <select className="input text-sm" value={productId} onChange={(e) => setProductId(e.target.value)} aria-label="Gioco">
                <option value="">Tutti i giochi</option>
                {cardProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <label className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
                <input className="input pl-8 text-sm" placeholder={onlyEquipment ? 'Cerca equipaggiamento…' : 'Cerca carta…'} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cerca" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="peer sr-only" checked={onlyKeepable} onChange={(e) => setOnlyKeepable(e.target.checked)} />
                <span className="relative h-5 w-9 rounded-full bg-white/20 transition peer-checked:bg-[var(--ok)] after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
                Solo conservabili
              </label>
            </Panel>
          </div>

          {list.length ? (
            <div className="grid grid-cols-2 content-start gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {list.map((c) => <GridTile key={c.id} card={c} onOpen={() => setOpen(c)} />)}
            </div>
          ) : <EmptyState icon={Library} title="Nessuna carta">Nessuna carta corrisponde ai filtri.</EmptyState>}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label={open.name} onClick={() => setOpen(null)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end"><button type="button" className="btn px-2" onClick={() => setOpen(null)} aria-label="Chiudi"><X className="size-5" /></button></div>
            <CardTile card={cards.find((c) => c.id === open.id) ?? open} />
          </div>
        </div>
      )}
    </div>
  );
}
