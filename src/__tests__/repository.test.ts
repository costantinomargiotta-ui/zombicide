import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { HubDatabase } from '../data/db';
import { createRepository } from '../data/repository';
import { exportBackup, importBackup } from '../data/backup';
import { loadDemoData, removeDemoData } from '../data/demo';

const fresh = async () => {
  const db = new HubDatabase(`test-${Math.random()}`);
  await db.open();
  return { db, repo: createRepository(db) };
};

describe('repository', () => {
  it('popola il catalogo e separa la collezione', async () => {
    const { db, repo } = await fresh();
    expect(await db.products.count()).toBe(19);
    await repo.setOwned('rio-z-janeiro', true);
    expect((await db.collection.get('rio-z-janeiro'))?.owned).toBe(true);
    expect(await db.activities.count()).toBe(1);
  });

  it('aggiunge un prodotto senza modificare il codice', async () => {
    const { db, repo } = await fresh();
    const p = await repo.saveProduct({ name: 'Nuova espansione', universeId: 'western', kind: 'espansione' });
    expect(p.origin).toBe('utente');
    expect((await db.products.get(p.id))?.dataStatus).toBe('da-verificare');
  });

  it('gestisce il ciclo di vita della campagna', async () => {
    const { db, repo } = await fresh();
    const c = await repo.createCampaign({ universeId: 'moderno', name: 'A', productId: 'rio-z-janeiro' });
    const c2 = await repo.createCampaign({ universeId: 'moderno', name: 'B', productId: 'rio-z-janeiro' });
    await repo.setCampaignStatus(c.id, 'in-corso');
    await repo.setCampaignStatus(c.id, 'sospesa');
    expect((await db.campaigns.get(c.id))?.status).toBe('sospesa');
    expect((await db.campaigns.get(c2.id))?.status).toBe('da-iniziare');
  });

  it('i dati demo si rimuovono senza toccare quelli reali', async () => {
    const { db, repo } = await fresh();
    await repo.createCampaign({ universeId: 'moderno', name: 'Reale', productId: 'rio-z-janeiro' });
    await loadDemoData(db);
    expect(await db.campaigns.count()).toBe(3);
    await removeDemoData(db);
    expect(await db.campaigns.count()).toBe(1);
    expect(await db.sessions.count()).toBe(0);
  });

  it('esporta e ripristina un backup', async () => {
    const { db, repo } = await fresh();
    await repo.setOwned('black-plague', true);
    const backup = await exportBackup(db, false);
    const { db: other } = await fresh();
    await importBackup(JSON.parse(JSON.stringify(backup)), other);
    expect((await other.collection.get('black-plague'))?.owned).toBe(true);
    await expect(importBackup({ format: 'altro' }, other)).rejects.toThrow();
  });
});
