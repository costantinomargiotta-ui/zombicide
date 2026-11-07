import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { HubDatabase } from '../data/db';
import { createRepository } from '../data/repository';
import { installSyncHooks, syncOnce, type RemoteRow, type RemoteStore } from '../data/sync';

/** Server finto in memoria con orologio crescente, come la tabella zh_records. */
function fakeRemote(): RemoteStore & { rows: Map<string, RemoteRow> } {
  const rows = new Map<string, RemoteRow>();
  const images = new Map<string, Blob>();
  let clock = 0;
  return {
    rows,
    async upsert(list) { for (const r of list) rows.set(`${r.tbl}:${r.id}`, { ...r, server_updated_at: `2026-01-01T00:00:${String(++clock).padStart(6, '0')}` }); },
    async pullSince(since) { return [...rows.values()].filter((r) => !since || r.server_updated_at! > since).sort((a, b) => a.server_updated_at!.localeCompare(b.server_updated_at!)); },
    async uploadImage(id, blob) { images.set(id, blob); },
    async downloadImage(id) { return images.get(id) ?? null; },
  };
}

async function device() {
  const db = new HubDatabase(`sync-${Math.random()}`);
  installSyncHooks(db);
  await db.open();
  return { db, repo: createRepository(db) };
}
const settle = () => new Promise((r) => setTimeout(r, 20));

describe('sincronizzazione tra dispositivi', () => {
  it('una campagna creata sul computer compare sul telefono', async () => {
    const remote = fakeRemote();
    const pc = await device();
    const phone = await device();
    const c = await pc.repo.createCampaign({ universeId: 'moderno', name: 'Carnevale', productId: 'rio-z-janeiro' });
    await pc.repo.setOwned('rio-z-janeiro', true);
    await settle();
    await syncOnce(pc.db, remote, 'u1');
    await syncOnce(phone.db, remote, 'u1');
    expect((await phone.db.campaigns.get(c.id))?.name).toBe('Carnevale');
    expect((await phone.db.collection.get('rio-z-janeiro'))?.owned).toBe(true);
  });

  it('le eliminazioni si propagano e i dati scaricati non tornano in coda', async () => {
    const remote = fakeRemote();
    const pc = await device();
    const phone = await device();
    const c = await pc.repo.createCampaign({ universeId: 'moderno', name: 'Da eliminare', productId: 'rio-z-janeiro' });
    await settle();
    await syncOnce(pc.db, remote, 'u1');
    await syncOnce(phone.db, remote, 'u1');
    await settle();
    expect(await phone.db.syncQueue.count()).toBe(0);
    await pc.repo.deleteCampaign(c.id);
    await settle();
    await syncOnce(pc.db, remote, 'u1');
    await syncOnce(phone.db, remote, 'u1');
    expect(await phone.db.campaigns.get(c.id)).toBeUndefined();
  });

  it('una modifica locale non ancora inviata non viene sovrascritta', async () => {
    const remote = fakeRemote();
    const pc = await device();
    const phone = await device();
    const c = await pc.repo.createCampaign({ universeId: 'moderno', name: 'Originale', productId: 'rio-z-janeiro' });
    await settle();
    await syncOnce(pc.db, remote, 'u1');
    await syncOnce(phone.db, remote, 'u1');
    await pc.repo.updateCampaign(c.id, { name: 'Dal computer' });
    await settle();
    await syncOnce(pc.db, remote, 'u1');
    await phone.repo.updateCampaign(c.id, { name: 'Dal telefono' });
    await settle();
    await syncOnce(phone.db, remote, 'u1');
    expect((await phone.db.campaigns.get(c.id))?.name).toBe('Dal telefono');
    await syncOnce(pc.db, remote, 'u1');
    expect((await pc.db.campaigns.get(c.id))?.name).toBe('Dal telefono');
  });

  it('i ritratti viaggiano con il loro file', async () => {
    const remote = fakeRemote();
    const pc = await device();
    const phone = await device();
    const id = await pc.repo.saveImage(new Blob(['ritratto'], { type: 'image/png' }));
    await settle();
    await syncOnce(pc.db, remote, 'u1');
    await syncOnce(phone.db, remote, 'u1');
    const img = await phone.db.images.get(id);
    expect(img?.mime).toBe('image/png');
    expect(await img!.blob.text()).toBe('ritratto');
  });
});
