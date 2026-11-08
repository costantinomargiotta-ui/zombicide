import type { DataStatus, Product, ProductKind, UniverseId } from '../../domain/types';

/**
 * Catalogo di partenza. Contiene solo nome, universo e tipologia dei prodotti
 * indicati dall'utente. "verificato" solo per ciò che è confermato dai
 * materiali forniti; il resto è "da-verificare" e modificabile dall'app.
 */
type SeedRow = [id: string, universe: UniverseId, name: string, kind: ProductKind, status: DataStatus, requires?: string[]];

const rows: SeedRow[] = [
  ['black-plague', 'fantasy', 'Zombicide: Black Plague', 'gioco-base', 'verificato'],
  ['green-horde', 'fantasy', 'Zombicide: Green Horde', 'gioco-base', 'da-verificare'],
  ['wulfsburg', 'fantasy', 'Wulfsburg', 'espansione', 'da-verificare'],
  ['friends-and-foes', 'fantasy', 'Friends and Foes', 'espansione', 'da-verificare'],
  ['no-rest-for-the-wicked', 'fantasy', 'No Rest for the Wicked', 'espansione', 'da-verificare'],
  ['white-death', 'fantasy', 'White Death', 'gioco-base', 'da-verificare'],

  ['zombicide-1e', 'moderno', 'Zombicide 1ª edizione', 'gioco-base', 'da-verificare'],
  ['zombicide-2e', 'moderno', 'Zombicide 2ª edizione', 'gioco-base', 'verificato'],
  ['washington-zc', 'moderno', 'Washington Z.C.', 'espansione', 'verificato', ['zombicide-2e']],
  ['fort-hendrix', 'moderno', 'Fort Hendrix', 'espansione', 'da-verificare'],
  ['rio-z-janeiro', 'moderno', 'Rio Z Janeiro', 'espansione', 'verificato', ['zombicide-2e']],

  ['undead-or-alive', 'western', 'Zombicide: Undead or Alive', 'gioco-base', 'da-verificare'],
  ['gears-and-guns', 'western', 'Gears & Guns', 'espansione', 'da-verificare'],
  ['running-wild', 'western', 'Running Wild', 'espansione', 'da-verificare'],

  ['marvel-zombies', 'marvel', 'Marvel Zombies', 'gioco-base', 'verificato'],
  ['x-men-resistance', 'marvel', 'X-Men Resistance', 'gioco-base', 'verificato'],
  ['fantastic-4-under-siege', 'marvel', 'Fantastic 4: Under Siege', 'espansione', 'da-verificare'],
  ['clash-of-the-sinister-six', 'marvel', 'Clash of the Sinister Six', 'espansione', 'da-verificare'],
  ['hydra-resurrection', 'marvel', 'Hydra Resurrection', 'espansione', 'da-verificare'],
];

const SEED_DATE = '2026-11-07T00:00:00.000Z';

export const seedProducts: Product[] = rows.map(([id, universeId, name, kind, dataStatus, requires]) => ({
  id,
  universeId,
  name,
  kind,
  requires,
  dataStatus,
  origin: 'base',
  createdAt: SEED_DATE,
  updatedAt: SEED_DATE,
}));
