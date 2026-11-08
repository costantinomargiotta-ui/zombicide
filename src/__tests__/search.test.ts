import { describe, expect, it } from 'vitest';
import { search, type SearchIndex } from '../services/search';
import { seedModernSurvivors, seedModernAbilities } from '../data/seed/survivorsModern';
import { seedRioCards } from '../data/seed/equipmentRio';
import { seedProducts } from '../data/seed/products';

const index: SearchIndex = {
  campaigns: [{ id: 'c1', universeId: 'moderno', name: 'Carnevale del giovedì', productId: 'rio-z-janeiro', status: 'in-corso', origin: 'utente', createdAt: '', updatedAt: '' }],
  characters: seedModernSurvivors, cards: seedRioCards, products: seedProducts,
  notes: [{ id: 'n1', title: 'Strategia', body: 'Tenere la Motosega per Doug', createdAt: '', updatedAt: '' }],
  abilityNames: new Map(seedModernAbilities.map((a) => [a.id, a.name])),
};

describe('ricerca', () => {
  it('ignora accenti e maiuscole', () => {
    expect(search(index, 'mae').some((r) => r.title === 'Amor de Mãe')).toBe(true);
    expect(search(index, 'GIOVEDI')[0].kind).toBe('campagna');
  });
  it('trova i sopravvissuti anche per abilità', () => {
    expect(search(index, 'capoeira').map((r) => r.title)).toContain('Eliete');
  });
  it('richiede tutte le parole', () => {
    expect(search(index, 'motosega doug').map((r) => r.kind)).toEqual(['nota']);
  });
  it('cerca nelle missioni e nelle note', () => {
    expect(search(index, 'samba').map((r) => r.title)).toContain('M1 – Sangue e samba');
    expect(search(index, '')).toEqual([]);
  });
});
