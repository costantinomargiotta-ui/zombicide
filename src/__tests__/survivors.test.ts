import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { seedModernAbilities, seedModernSurvivors } from '../data/seed/survivorsModern';
import { HubDatabase } from '../data/db';

describe('sopravvissuti Moderno', () => {
  it('importa 24 schede con 7 abilità ciascuna (1 blu, 1 gialla, 2 arancioni, 3 rosse)', () => {
    expect(seedModernSurvivors).toHaveLength(24);
    for (const c of seedModernSurvivors) {
      expect(c.abilities.map((g) => g.abilityIds.length)).toEqual([1, 1, 2, 3]);
    }
    expect(new Set(seedModernSurvivors.map((c) => c.id)).size).toBe(24);
  });

  it('ogni abilità citata esiste nel catalogo abilità', () => {
    const ids = new Set(seedModernAbilities.map((a) => a.id));
    for (const c of seedModernSurvivors) for (const g of c.abilities) for (const id of g.abilityIds) expect(ids.has(id)).toBe(true);
  });

  it('provenienze: 6 Rio Z Janeiro, 12 Zombicide 2ª edizione, 6 Washington Z.C.', () => {
    expect(seedModernSurvivors.filter((c) => c.productId === 'rio-z-janeiro').map((c) => c.name))
      .toEqual(['Ney', 'Eliete', 'Vivi', 'Steven', 'MC Jordim', 'Dona Cacilda']);
    expect(seedModernSurvivors.filter((c) => c.productId === 'zombicide-2e')).toHaveLength(12);
    expect(seedModernSurvivors.filter((c) => c.productId === 'washington-zc').map((c) => c.name)).toEqual(['Angelo', 'Ashley', 'Justin', 'Mindy', 'Tess', 'Anton']);
    expect(seedModernSurvivors.filter((c) => !c.productId)).toHaveLength(0);
  });

  it('la sincronizzazione del catalogo non sovrascrive le modifiche dell\'utente', async () => {
    const db = new HubDatabase(`t-${Math.random()}`);
    await db.open();
    expect(await db.characters.where('universeId').equals('moderno').count()).toBe(24);
    await db.characters.update('moderno-odin', { productId: 'zombicide-2e' });
    db.close();
    await db.open();
    expect((await db.characters.get('moderno-odin'))?.productId).toBe('zombicide-2e');
  });
});

import Dexie from 'dexie';

describe('correzione di Ney', () => {
  it('nel catalogo di base l\'abilità gialla è +1 Azione e i dati sono verificati', () => {
    const ney = seedModernSurvivors.find((c) => c.id === 'moderno-ney')!;
    expect(ney.abilities[1].abilityIds).toEqual(['moderno-1-azione']);
    expect(seedModernSurvivors.every((c) => c.dataStatus === 'verificato')).toBe(true);
    expect(seedModernAbilities.some((a) => a.id === 'moderno-azione')).toBe(false);
  });

  it('aggiorna i database già esistenti senza perdere il ritratto', async () => {
    const name = `old-${Math.random()}`;
    const old = new Dexie(name);
    old.version(2).stores({
      products: 'id, universeId, kind, origin', collection: 'productId, owned', players: 'id, name, origin',
      characters: 'id, universeId, productId, kind, origin', abilities: 'id, universeId, origin',
      scenarios: 'id, universeId, productId, origin', campaigns: 'id, universeId, productId, status, origin, updatedAt',
      sessions: 'id, universeId, campaignId, playedOn, outcome, origin', sessionParticipants: 'id, sessionId, playerId, characterId',
      activities: 'id, at, universeId, origin', images: 'id', characterNotes: 'characterId',
    });
    const ney = structuredClone(seedModernSurvivors[0]);
    ney.abilities[1] = { level: 'giallo', abilityIds: ['moderno-azione'] };
    ney.dataStatus = 'da-verificare';
    ney.portraitImageId = 'img_ney';
    await old.table('characters').put(ney);
    await old.table('abilities').put({ id: 'moderno-azione', universeId: 'moderno', name: 'Azione', dataStatus: 'verificato', origin: 'base' });
    old.close();

    const db = new HubDatabase(name);
    await db.open();
    const updated = await db.characters.get('moderno-ney');
    expect(updated?.abilities[1].abilityIds).toEqual(['moderno-1-azione']);
    expect(updated?.dataStatus).toBe('verificato');
    expect(updated?.portraitImageId).toBe('img_ney');
    expect(await db.abilities.get('moderno-azione')).toBeUndefined();
  });
});

import { seedRioCards } from '../data/seed/equipmentRio';
describe('carte di Rio Z Janeiro', () => {
  it('6 carte di partenza e 12 Armi Pimpate, conteggiando le copie', () => {
    const count = (deck: string) => seedRioCards.filter((c) => c.deck === deck).reduce((a, c) => a + c.quantity, 0);
    expect(count('partenza')).toBe(6);
    expect(count('arma-pimpata')).toBe(12);
    expect(seedRioCards.filter((c) => c.deck === 'avanzato')).toHaveLength(20);
    expect(seedRioCards.filter((c) => c.deck === 'partenza').every((c) => c.conservation === undefined)).toBe(true);
  });
});
