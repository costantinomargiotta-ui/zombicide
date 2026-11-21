/**
 * Copie locali dei regolamenti: download dal sito ufficiale o caricamento di un file,
 * estrazione del testo delle pagine (per la ricerca) e ricerca nel testo.
 * Tutto resta su questo dispositivo: le tabelle non sono sincronizzate né incluse nel backup.
 */
import { db } from '../data/db';
import { nowIso } from '../lib/ids';
import { MISSION_SERIES } from '../rules/missionSeries';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import type { Rulebook, RulebookChapter } from '../rules/rulebooks';

type PdfJs = typeof import('pdfjs-dist');
let pdfjsPromise: Promise<PdfJs> | null = null;

/** pdf.js caricato solo quando serve (è pesante). */
export function loadPdfJs(): Promise<PdfJs> {
  pdfjsPromise ??= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    return lib;
  });
  return pdfjsPromise;
}

export type Progress = (phase: 'download' | 'testo', done: number, total: number) => void;

async function requestPersistence() {
  try { await navigator.storage?.persist?.(); } catch { /* facoltativo */ }
}

/** Scarica il PDF ufficiale, lo salva sul dispositivo e ne estrae il testo. */
export async function saveOfficial(rb: Rulebook, onProgress?: Progress): Promise<void> {
  if (!rb.url) throw new Error('Questo regolamento non ha un PDF ufficiale online.');
  const res = await fetch(rb.url);
  if (!res.ok || !res.body) throw new Error(`Download non riuscito (${res.status}).`);
  const total = Number(res.headers.get('content-length')) || Math.round(rb.sizeMb * 1048576);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let done = 0;
  for (;;) {
    const { value, done: end } = await reader.read();
    if (end) break;
    chunks.push(value);
    done += value.length;
    onProgress?.('download', done, total);
  }
  const blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' });
  await store(rb, blob, 'ufficiale');
  await extractText(rb.id, blob, onProgress);
}

/** Salva un PDF scelto dall'utente; segnala se il numero di pagine non corrisponde al regolamento. */
export async function saveUploaded(rb: Rulebook, file: File, onProgress?: Progress): Promise<{ pagesMismatch?: number }> {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  if (String.fromCharCode(...head) !== '%PDF-') throw new Error('Il file scelto non è un PDF.');
  const blob = new Blob([file], { type: 'application/pdf' });
  await store(rb, blob, 'caricato', file.name);
  const pages = await extractText(rb.id, blob, onProgress);
  return pages !== rb.pages ? { pagesMismatch: pages } : {};
}

async function store(rb: Rulebook, blob: Blob, source: 'ufficiale' | 'caricato', fileName?: string) {
  await requestPersistence();
  await db.rulebookFiles.put({ id: rb.id, blob, size: blob.size, source, fileName, savedAt: nowIso() });
}

/** Estrae e salva il testo di tutte le pagine; restituisce il numero di pagine. */
async function extractText(id: string, blob: Blob, onProgress?: Progress): Promise<number> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
  try {
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((it) => ('str' in it ? it.str + (it.hasEOL ? '\n' : ' ') : '')).join('').replace(/[ \t]+/g, ' '));
      page.cleanup();
      onProgress?.('testo', i, doc.numPages);
    }
    await db.rulebookText.put({ id, pages });
    return doc.numPages;
  } finally {
    await doc.destroy();
  }
}

export async function removeLocal(id: string) {
  await db.transaction('rw', db.rulebookFiles, db.rulebookText, async () => {
    await db.rulebookFiles.delete(id);
    await db.rulebookText.delete(id);
  });
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'");

export interface SearchHit { id: string; page: number; snippet: string; count: number }

/** Cerca nelle copie locali: una riga per pagina, con un estratto attorno alla prima occorrenza. */
export async function searchRulebooks(query: string, limit = 150): Promise<SearchHit[]> {
  const q = norm(query.trim());
  if (q.length < 3) return [];
  const all = await db.rulebookText.toArray();
  const hits: SearchHit[] = [];
  for (const { id, pages } of all) {
    pages.forEach((text, i) => {
      const flat = text.replace(/\s+/g, ' ');
      const n = norm(flat);
      let at = n.indexOf(q);
      if (at < 0) return;
      let count = 0;
      for (let k = at; k >= 0; k = n.indexOf(q, k + q.length)) count++;
      const start = Math.max(0, at - 90);
      const end = Math.min(flat.length, at + q.length + 110);
      hits.push({ id, page: i + 1, count, snippet: `${start > 0 ? '…' : ''}${flat.slice(start, end).trim()}${end < flat.length ? '…' : ''}` });
    });
  }
  return hits.sort((a, b) => b.count - a.count).slice(0, limit);
}

/** Indice completo: capitoli del sommario più le Missioni della scatola (con la pagina del libretto). */
export function rulebookIndex(rb: Rulebook): (RulebookChapter & { mission?: boolean })[] {
  const missions = [
    ...SHEET_CAMPAIGNS.filter((c) => c.productId === rb.productId).flatMap((c) => c.missions),
    ...MISSION_SERIES.filter((s) => !s.web && s.productId === rb.productId).flatMap((s) => s.missions),
  ].filter((m) => m.page > 0 && m.page <= rb.pages);
  const extra = missions.map((m) => ({ title: `${m.code} – ${m.title}`, page: m.page, level: 2 as const, mission: true }));
  const seen = new Set(rb.chapters.map((c) => `${c.page}|${c.title.toLowerCase()}`));
  return [...rb.chapters, ...extra.filter((e) => !seen.has(`${e.page}|${e.title.toLowerCase()}`))].sort((a, b) => a.page - b.page || a.level - b.level);
}
