import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, ChevronDown, Download, ExternalLink, FileUp, HardDrive, Library, Loader2, Search, Trash2 } from 'lucide-react';
import { db } from '../data/db';
import { useScope } from '../lib/scope';
import { UNIVERSES } from '../domain/universes';
import { defaultBoxImageUrl } from '../domain/boxImages';
import { RULEBOOKS, rulebookById, type Rulebook } from '../rules/rulebooks';
import { removeLocal, rulebookIndex, saveOfficial, saveUploaded, searchRulebooks, type SearchHit } from '../services/rulebookStore';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';

const mb = (bytes: number) => `${(bytes / 1048576).toFixed(bytes > 10485760 ? 0 : 1)} MB`;
const viewer = (id: string, page = 1) => `/regolamenti/${id}?p=${page}`;

function RulebookCard({ rb, saved }: { rb: Rulebook; saved?: { size: number; source: string } }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const index = useMemo(() => rulebookIndex(rb), [rb]);
  const cover = defaultBoxImageUrl(rb.productId);
  const onProgress = (phase: 'download' | 'testo', done: number, total: number) =>
    setBusy(phase === 'download' ? `Download ${Math.round((done / total) * 100)}%` : `Preparo la ricerca: pagina ${done} di ${total}`);

  async function run(fn: () => Promise<string | void>) {
    setMsg(null); setBusy('Avvio…');
    try { const text = await fn(); setMsg({ ok: true, text: text ?? 'Salvato sul dispositivo: ora si apre anche senza connessione.' }); }
    catch (e) { setMsg({ ok: false, text: e instanceof Error ? e.message : 'Operazione non riuscita.' }); }
    finally { setBusy(null); }
  }
  const btn = 'focus-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm disabled:opacity-50';

  return (
    <li className="rounded-lg border border-[var(--line)] bg-black/30">
      <div className="flex gap-3 p-3">
        {cover ? <img src={cover} alt="" className="size-16 shrink-0 rounded-md object-cover sm:size-20" loading="lazy" /> : <div className="grid size-16 shrink-0 place-items-center rounded-md bg-white/5 sm:size-20"><BookOpen className="size-7 text-[var(--muted)]" /></div>}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <h3 className="font-semibold leading-tight">{rb.title}</h3>
            <p className="text-xs text-[var(--muted)]">{rb.pages} pagine · PDF ufficiale {rb.url ? `${rb.sizeMb} MB` : 'non disponibile online'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to={viewer(rb.id)} className={`${btn} border-[var(--accent-2)] bg-[var(--accent-2)] font-semibold text-black`}><BookOpen className="size-4" /> Leggi</Link>
            {saved ? (
              <>
                <Badge tone="ok"><HardDrive className="size-3" /> Sul dispositivo · {mb(saved.size)}</Badge>
                <button type="button" disabled={!!busy} onClick={() => run(async () => { await removeLocal(rb.id); return 'Copia rimossa dal dispositivo.'; })} className={`${btn} border-[var(--line)]`}><Trash2 className="size-4" /> Rimuovi copia</button>
              </>
            ) : (
              <>
                {rb.url && <button type="button" disabled={!!busy} onClick={() => run(() => saveOfficial(rb, onProgress))} className={`${btn} border-white/50`}><Download className="size-4" /> Salva sul dispositivo</button>}
                <button type="button" disabled={!!busy} onClick={() => fileRef.current?.click()} className={`${btn} border-[var(--line)]`}><FileUp className="size-4" /> Carica il tuo PDF</button>
              </>
            )}
            {rb.url && <a href={rb.url} target="_blank" rel="noreferrer" className={`${btn} border-[var(--line)]`}><ExternalLink className="size-4" /> PDF ufficiale</a>}
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; e.target.value = '';
              if (f) void run(async () => {
                const r = await saveUploaded(rb, f, onProgress);
                return r.pagesMismatch ? `Salvato, ma il file ha ${r.pagesMismatch} pagine invece di ${rb.pages}: potrebbe essere un'altra edizione e i numeri di pagina dell'indice potrebbero non corrispondere.` : undefined;
              });
            }} />
          </div>
          {busy && <p role="status" className="flex items-center gap-2 text-sm text-[var(--accent-2)]"><Loader2 className="size-4 animate-spin" /> {busy}</p>}
          {msg && <p role="status" className={`text-sm ${msg.ok ? 'text-green-300' : 'text-red-300'}`}>{msg.text}</p>}
        </div>
      </div>
      {index.length > 0 && (
        <details className="border-t border-[var(--line)]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">Indice dei capitoli <span className="font-normal text-[var(--muted)]">({index.length})</span><ChevronDown className="ml-auto size-4" /></summary>
          <ol className="grid grid-cols-1 gap-x-6 px-3 pb-3 text-sm sm:grid-cols-2">
            {index.map((c) => (
              <li key={`${c.page}|${c.title}`} className={c.level === 2 ? 'pl-4' : 'mt-1 font-semibold'}>
                <Link to={viewer(rb.id, c.page)} className="flex gap-2 rounded px-1 py-0.5 hover:bg-white/5">
                  <span className={`min-w-0 flex-1 truncate ${c.mission ? 'text-[var(--accent-2)]' : ''}`}>{c.title}</span>
                  <span className="text-[var(--muted)] tabular-nums">{c.page}</span>
                </Link>
              </li>
            ))}
          </ol>
        </details>
      )}
    </li>
  );
}

function SearchBox({ savedIds }: { savedIds: string[] }) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (q.trim().length < 3) { setHits(null); return; }
    setLoading(true);
    const t = setTimeout(() => { void searchRulebooks(q).then((h) => { setHits(h); setLoading(false); }); }, 250);
    return () => clearTimeout(t);
  }, [q, savedIds.join()]);
  const mark = (s: string) => {
    const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const i = norm(s).indexOf(norm(q.trim()));
    return i < 0 ? s : <>{s.slice(0, i)}<mark className="rounded bg-[var(--accent-2)] px-0.5 text-black">{s.slice(i, i + q.trim().length)}</mark>{s.slice(i + q.trim().length)}</>;
  };
  return (
    <Panel title="Cerca nei regolamenti" icon={Search}>
      <label className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-black/40 px-2">
        <Search className="size-4 text-[var(--muted)]" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Es. Fuoco Amico, Conservazione, Zona di Oscurità…" aria-label="Cerca nei regolamenti" className="w-full bg-transparent py-2 text-sm outline-none" />
      </label>
      <p className="mt-2 text-xs text-[var(--muted)]">La ricerca usa i regolamenti salvati su questo dispositivo ({savedIds.length} di {RULEBOOKS.length}). Per cercare in un regolamento, salvalo prima con «Salva sul dispositivo».</p>
      {loading && <p className="mt-3 flex items-center gap-2 text-sm"><Loader2 className="size-4 animate-spin" /> Cerco…</p>}
      {hits && !loading && (
        hits.length === 0 ? <p className="mt-3 text-sm">Nessun risultato{savedIds.length === 0 ? ': non hai ancora salvato nessun regolamento.' : '.'}</p> : (
          <ol className="mt-3 flex max-h-[28rem] flex-col gap-2 overflow-y-auto">
            {hits.map((h) => (
              <li key={`${h.id}-${h.page}`}>
                <Link to={viewer(h.id, h.page)} className="block rounded-md border border-[var(--line)] bg-black/30 p-2 hover:border-[var(--accent-2)]">
                  <span className="flex flex-wrap items-baseline gap-2 text-sm font-semibold">{rulebookById(h.id)?.title}<span className="text-xs font-normal text-[var(--muted)]">pag. {h.page}{h.count > 1 ? ` · ${h.count} volte` : ''}</span></span>
                  <span className="block text-sm text-[var(--muted)]">{mark(h.snippet)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )
      )}
    </Panel>
  );
}

/** Regolamenti: link ufficiali, copie salvate sul dispositivo, indice dei capitoli e ricerca nel testo. */
export function RulebooksPage() {
  const { universeId } = useScope();
  const files = useLiveQuery(() => db.rulebookFiles.toArray().then((fs) => fs.map(({ id, size, source }) => ({ id, size, source }))), [], []);
  const [usage, setUsage] = useState<string | null>(null);
  useEffect(() => { void navigator.storage?.estimate?.().then((e) => e.usage != null && setUsage(mb(e.usage))).catch(() => undefined); }, [files.length]);
  const list = RULEBOOKS.filter((r) => !universeId || r.universeId === universeId);
  const groups = (Object.keys(UNIVERSES) as (keyof typeof UNIVERSES)[]).map((u) => ({ u, books: list.filter((r) => r.universeId === u) })).filter((g) => g.books.length);
  const saved = new Map(files.map((f) => [f.id, f]));
  return (
    <div className="flex flex-col gap-5">
      <Panel title="Regolamenti" icon={Library}>
        <p className="text-sm text-[var(--muted)]">I regolamenti si leggono dal PDF ufficiale di Asmodee Italia. Con «Salva sul dispositivo» ne tieni una copia solo su questo telefono o computer: si apre anche offline e si può cercare nel testo. Le copie non vengono caricate online né sincronizzate.{usage ? ` Spazio usato dall'app su questo dispositivo: ${usage}.` : ''}</p>
      </Panel>
      <SearchBox savedIds={files.map((f) => f.id)} />
      {groups.map(({ u, books }) => (
        <Panel key={u} title={UNIVERSES[u].name} icon={BookOpen}>
          <ul className="flex flex-col gap-2">{books.map((rb) => <RulebookCard key={rb.id} rb={rb} saved={saved.get(rb.id)} />)}</ul>
        </Panel>
      ))}
    </div>
  );
}
