import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, HardDrive, Loader2, Minus, Plus, Wifi } from 'lucide-react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { db } from '../data/db';
import { rulebookById } from '../rules/rulebooks';
import { loadPdfJs, rulebookIndex } from '../services/rulebookStore';
import { EmptyState } from '../ui/components/EmptyState';

/** Visualizzatore di un regolamento: copia locale se c'è, altrimenti il PDF ufficiale online. */
export function RulebookViewer() {
  const { rulebookId } = useParams();
  const rb = rulebookById(rulebookId);
  const [params, setParams] = useSearchParams();
  const local = useLiveQuery(() => (rb ? db.rulebookFiles.get(rb.id) : undefined), [rb?.id], null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rendering, setRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const index = useMemo(() => (rb ? rulebookIndex(rb) : []), [rb]);
  const pages = doc?.numPages ?? rb?.pages ?? 1;
  const page = Math.min(Math.max(1, Number(params.get('p')) || 1), pages);
  const go = (p: number) => setParams({ p: String(Math.min(Math.max(1, p), pages)) }, { replace: true });

  // Apertura del documento (una volta che si sa se c'è la copia locale).
  useEffect(() => {
    if (!rb || local === null) return;
    let cancelled = false;
    let opened: PDFDocumentProxy | null = null;
    setDoc(null); setError(null);
    (async () => {
      try {
        const pdfjs = await loadPdfJs();
        const src = local ? { data: new Uint8Array(await local.blob.arrayBuffer()) } : rb.url ? { url: rb.url } : null;
        if (!src) { setError('Questo regolamento non è disponibile online: carica il tuo PDF dalla pagina Regolamenti.'); return; }
        opened = await pdfjs.getDocument(src).promise;
        if (cancelled) { await opened.destroy(); return; }
        setDoc(opened);
      } catch {
        if (!cancelled) setError(local ? 'Non riesco ad aprire la copia salvata: prova a rimuoverla e salvarla di nuovo.' : 'Non riesco ad aprire il PDF ufficiale: controlla la connessione, oppure aprilo nel browser con il pulsante qui sopra.');
      }
    })();
    return () => { cancelled = true; void opened?.destroy(); };
  }, [rb, local]);

  // Disegno della pagina, adattata alla larghezza disponibile.
  useEffect(() => {
    if (!doc || !canvasRef.current || !boxRef.current) return;
    let task: RenderTask | null = null;
    let cancelled = false;
    setRendering(true);
    (async () => {
      const p = await doc.getPage(page);
      if (cancelled) return;
      const base = p.getViewport({ scale: 1 });
      const width = Math.max(280, boxRef.current!.clientWidth - 2);
      const scale = (width / base.width) * zoom;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const vp = p.getViewport({ scale: scale * dpr });
      const canvas = canvasRef.current!;
      canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
      canvas.style.width = `${Math.floor(vp.width / dpr)}px`; canvas.style.height = `${Math.floor(vp.height / dpr)}px`;
      task = p.render({ canvasContext: canvas.getContext('2d')!, viewport: vp });
      try { await task.promise; } catch { /* annullato */ }
      if (!cancelled) setRendering(false);
    })();
    return () => { cancelled = true; task?.cancel(); };
  }, [doc, page, zoom]);

  // Frecce della tastiera per sfogliare.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight') go(page + 1);
      if (e.key === 'ArrowLeft') go(page - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!rb) return <EmptyState icon={ArrowLeft} title="Regolamento non trovato"><Link to="/regolamenti" className="underline">Torna ai regolamenti</Link></EmptyState>;
  const chapter = [...index].reverse().find((c) => c.page <= page);
  const btn = 'focus-ring inline-flex items-center justify-center gap-1 rounded-md border border-[var(--line)] bg-black/40 px-2.5 py-1.5 text-sm disabled:opacity-40';

  return (
    <div className="flex flex-col gap-3">
      <div className="panel z-10 flex flex-wrap items-center gap-2 p-2 sm:sticky sm:top-2">
        <Link to="/regolamenti" className={btn} aria-label="Torna ai regolamenti"><ArrowLeft className="size-4" /></Link>
        <h1 className="title-display min-w-0 flex-1 truncate text-lg sm:text-xl">{rb.title}</h1>
        <span className="flex items-center gap-1 text-xs text-[var(--muted)]">{local ? <><HardDrive className="size-3.5" /> Copia sul dispositivo</> : <><Wifi className="size-3.5" /> Online</>}</span>
        {rb.url && <a href={`${rb.url}#page=${page}`} target="_blank" rel="noreferrer" className={btn}><ExternalLink className="size-4" /> <span className="hidden sm:inline">Apri nel browser</span></a>}
        <div className="flex basis-full flex-wrap items-center gap-2">
          <button type="button" className={btn} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Pagina precedente"><ChevronLeft className="size-4" /></button>
          <label className="flex items-center gap-1 text-sm">Pag.
            <input type="number" min={1} max={pages} value={page} onChange={(e) => go(Number(e.target.value))} className="focus-ring w-16 rounded-md border border-[var(--line)] bg-black/40 px-2 py-1 text-center" aria-label="Numero di pagina" />
            <span className="text-[var(--muted)]">di {pages}</span>
          </label>
          <button type="button" className={btn} onClick={() => go(page + 1)} disabled={page >= pages} aria-label="Pagina successiva"><ChevronRight className="size-4" /></button>
          <span className="ml-auto flex items-center gap-2">
          <button type="button" className={btn} onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} aria-label="Riduci"><Minus className="size-4" /></button>
          <button type="button" className={btn} onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          <button type="button" className={btn} onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} aria-label="Ingrandisci"><Plus className="size-4" /></button>
          </span>
        </div>
          <select value={chapter ? `${chapter.page}|${chapter.title}` : ''} onChange={(e) => go(Number(e.target.value.split('|')[0]))} aria-label="Vai al capitolo" className="focus-ring w-full min-w-0 basis-full rounded-md border border-[var(--line)] bg-black/40 px-2 py-1.5 text-sm">
            <option value="" disabled>Indice…</option>
            {index.map((c) => <option key={`${c.page}|${c.title}`} value={`${c.page}|${c.title}`}>{c.level === 2 ? '   ' : ''}{c.title} · pag. {c.page}</option>)}
          </select>
      </div>
      <div ref={boxRef} className="relative overflow-auto rounded-lg border border-[var(--line)] bg-neutral-800 p-0">
        {error ? <p className="p-6 text-center">{error}</p> : (
          <>
            {(!doc || rendering) && <div className="absolute inset-0 grid place-items-center"><Loader2 className="size-8 animate-spin text-[var(--accent-2)]" aria-label="Caricamento" /></div>}
            <canvas ref={canvasRef} className="mx-auto block bg-white" />
          </>
        )}
      </div>
      <div className="flex justify-between">
        <button type="button" className={btn} onClick={() => go(page - 1)} disabled={page <= 1}><ChevronLeft className="size-4" /> Precedente</button>
        <button type="button" className={btn} onClick={() => go(page + 1)} disabled={page >= pages}>Successiva <ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}
