import type { Transaction } from 'dexie';
import { DATA_TABLES, type HubDatabase } from './db';

/**
 * Sincronizzazione "prima in locale": l'app scrive sempre su IndexedDB, che funziona
 * anche senza rete. Ogni modifica finisce in una coda; la sincronizzazione invia la
 * coda al server e scarica le modifiche fatte dagli altri dispositivi.
 */

export interface RemoteRow {
  tbl: string;
  id: string;
  data: unknown | null;
  deleted: boolean;
  client_updated_at: string;
  server_updated_at?: string;
}

/** Il server visto dalla sincronizzazione: Supabase in produzione, una finta in memoria nei test. */
export interface RemoteStore {
  upsert(rows: RemoteRow[]): Promise<void>;
  pullSince(since: string | null): Promise<RemoteRow[]>;
  uploadImage(id: string, blob: Blob): Promise<void>;
  downloadImage(id: string): Promise<Blob | null>;
}

export const SYNCED_TABLES = [...DATA_TABLES, 'images'] as const;

export interface QueueEntry {
  key: string; // "tabella:id"
  tbl: string;
  id: string;
  deleted: boolean;
  at: string;
}

const REMOTE_FLAG = '__zhRemote';
const isRemote = (tx: Transaction | null | undefined) => !!(tx && (tx as unknown as Record<string, unknown>)[REMOTE_FLAG]);

/** Registra in coda ogni scrittura locale (non quelle che arrivano dal server). */
export function installSyncHooks(db: HubDatabase, onChange?: () => void) {
  for (const tbl of SYNCED_TABLES) {
    const table = db.table(tbl);
    const keyPath = table.schema.primKey.keyPath as string;
    const enqueue = (id: unknown, deleted: boolean, tx: Transaction) => {
      if (isRemote(tx) || id == null) return;
      const entry: QueueEntry = { key: `${tbl}:${String(id)}`, tbl, id: String(id), deleted, at: new Date().toISOString() };
      // Scritto dopo la fine della transazione, così non serve includere la coda in ogni transazione.
      tx.on('complete', () => { db.syncQueue.put(entry).then(() => onChange?.()).catch(() => undefined); });
    };
    table.hook('creating', function (primKey, obj, tx) { enqueue(primKey ?? (obj as Record<string, unknown>)[keyPath], false, tx); });
    table.hook('updating', function (_mods, primKey, _obj, tx) { enqueue(primKey, false, tx); });
    table.hook('deleting', function (primKey, _obj, tx) { enqueue(primKey, true, tx); });
  }
}

/** Mette in coda tutti i record locali: usato al primo collegamento di un dispositivo. */
export async function enqueueAll(db: HubDatabase) {
  const at = new Date().toISOString();
  for (const tbl of SYNCED_TABLES) {
    const keys = await db.table(tbl).toCollection().primaryKeys();
    await db.syncQueue.bulkPut(keys.map((k) => ({ key: `${tbl}:${String(k)}`, tbl, id: String(k), deleted: false, at })));
  }
}

export interface SyncResult { pushed: number; pulled: number; at: string }

export async function syncOnce(db: HubDatabase, remote: RemoteStore, account: string): Promise<SyncResult> {
  const initKey = `init:${account}`;
  if (!(await db.syncMeta.get(initKey))) {
    await enqueueAll(db);
    await db.syncMeta.put({ key: initKey, value: new Date().toISOString() });
  }

  // 1. Invio della coda
  const queue = await db.syncQueue.toArray();
  const rows: RemoteRow[] = [];
  for (const q of queue) {
    if (q.deleted) { rows.push({ tbl: q.tbl, id: q.id, data: null, deleted: true, client_updated_at: q.at }); continue; }
    const record = await db.table(q.tbl).get(q.id);
    if (!record) { rows.push({ tbl: q.tbl, id: q.id, data: null, deleted: true, client_updated_at: q.at }); continue; }
    if (q.tbl === 'images') {
      const { blob, ...meta } = record as { blob: Blob };
      await remote.uploadImage(q.id, blob);
      rows.push({ tbl: q.tbl, id: q.id, data: meta, deleted: false, client_updated_at: q.at });
    } else {
      rows.push({ tbl: q.tbl, id: q.id, data: record, deleted: false, client_updated_at: q.at });
    }
  }
  for (let i = 0; i < rows.length; i += 200) await remote.upsert(rows.slice(i, i + 200));
  // Toglie dalla coda solo le voci non modificate nel frattempo.
  await db.transaction('rw', db.syncQueue, async () => {
    for (const q of queue) {
      const now = await db.syncQueue.get(q.key);
      if (now && now.at === q.at) await db.syncQueue.delete(q.key);
    }
  });

  // 2. Ricezione delle modifiche degli altri dispositivi
  const pullKey = `pull:${account}`;
  const since = ((await db.syncMeta.get(pullKey))?.value as string | undefined) ?? null;
  const incoming = await remote.pullSince(since);
  const pending = new Set((await db.syncQueue.toArray()).map((q) => q.key));
  const blobs = new Map<string, Blob>();
  for (const r of incoming) {
    if (r.tbl === 'images' && !r.deleted && !pending.has(`images:${r.id}`) && !(await db.images.get(r.id))) {
      const blob = await remote.downloadImage(r.id);
      if (blob) blobs.set(r.id, blob);
    }
  }
  const known = new Set<string>(SYNCED_TABLES);
  await db.transaction('rw', SYNCED_TABLES.map((t) => db.table(t)), async (tx) => {
    (tx as unknown as Record<string, unknown>)[REMOTE_FLAG] = true;
    for (const r of incoming) {
      if (!known.has(r.tbl) || pending.has(`${r.tbl}:${r.id}`)) continue; // la modifica locale in attesa ha la precedenza
      const table = db.table(r.tbl);
      if (r.deleted || r.data == null) { await table.delete(r.id); continue; }
      if (r.tbl === 'images') {
        const blob = blobs.get(r.id) ?? (await db.images.get(r.id))?.blob;
        if (blob) await table.put({ ...(r.data as object), blob });
      } else {
        await table.put(r.data);
      }
    }
  });
  const last = incoming.reduce<string | null>((m, r) => (r.server_updated_at && (!m || r.server_updated_at > m) ? r.server_updated_at : m), since);
  if (last) await db.syncMeta.put({ key: pullKey, value: last });
  return { pushed: rows.length, pulled: incoming.length, at: new Date().toISOString() };
}
