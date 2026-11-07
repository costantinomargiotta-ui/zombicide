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

  it('i sei di Rio Z Janeiro hanno la provenienza, gli altri restano da indicare', () => {
    expect(seedModernSurvivors.filter((c) => c.productId === 'rio-z-janeiro').map((c) => c.name))
      .toEqual(['Ney', 'Eliete', 'Vivi', 'Steven', 'MC Jordim', 'Dona Cacilda']);
    expect(seedModernSurvivors.filter((c) => !c.productId)).toHaveLength(18);
  });

  it('la sincronizzazione del catalogo non sovrascrive le modifiche dell\'utente', async () => {
    const db = new HubDatabase(`t-${Math.random()}`);
    await db.open();
    expect(await db.characters.count()).toBe(24);
    await db.characters.update('moderno-odin', { productId: 'zombicide-2e' });
    db.close();
    await db.open();
    expect((await db.characters.get('moderno-odin'))?.productId).toBe('zombicide-2e');
  });
});
