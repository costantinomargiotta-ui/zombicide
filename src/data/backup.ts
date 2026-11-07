import { db, DATA_TABLES, type HubDatabase } from './db';
import { nowIso } from '../lib/ids';

export const BACKUP_FORMAT = 'zombicide-hub-backup';
export const BACKUP_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  tables: Record<string, unknown[]>;
  images: { id: string; mime: string; createdAt: string; dataUrl: string }[];
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob();
}

export async function exportBackup(database: HubDatabase = db, includeImages = true): Promise<BackupFile> {
  const tables: Record<string, unknown[]> = {};
  for (const name of DATA_TABLES) tables[name] = await database.table(name).toArray();
  const images = includeImages
    ? await Promise.all((await database.images.toArray()).map(async (img) => ({
        id: img.id, mime: img.mime, createdAt: img.createdAt, dataUrl: await blobToDataUrl(img.blob),
      })))
    : [];
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: nowIso(), tables, images };
}

export function validateBackup(data: unknown): asserts data is BackupFile {
  const b = data as Partial<BackupFile>;
  if (!b || b.format !== BACKUP_FORMAT) throw new Error('Il file non è un backup di Zombicide Hub.');
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) throw new Error('Versione del backup non supportata.');
  if (!b.tables || typeof b.tables !== 'object') throw new Error('Backup privo di dati.');
}

/** Sostituisce tutti i dati con quelli del backup, in un'unica transazione. */
export async function importBackup(data: unknown, database: HubDatabase = db): Promise<void> {
  validateBackup(data);
  const images = await Promise.all((data.images ?? []).map(async (img) => ({
    id: img.id, mime: img.mime, createdAt: img.createdAt, blob: await dataUrlToBlob(img.dataUrl),
  })));
  const tables = [...DATA_TABLES.map((n) => database.table(n)), database.images];
  await database.transaction('rw', tables, async () => {
    for (const name of DATA_TABLES) {
      await database.table(name).clear();
      const rows = data.tables[name];
      if (Array.isArray(rows)) await database.table(name).bulkAdd(rows);
    }
    await database.images.clear();
    if (images.length) await database.images.bulkAdd(images);
  });
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
