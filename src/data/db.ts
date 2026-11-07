import Dexie, { type EntityTable } from 'dexie';
import type {
  Ability, Activity, Campaign, CampaignParticipant, Character, CharacterNote, CollectionEntry, KeptItem, ProgressEntry, GameSession,
  Player, Product, Scenario, SessionParticipant, StoredImage,
} from '../domain/types';
import { seedProducts } from './seed/products';
import { seedModernAbilities, seedModernSurvivors } from './seed/survivorsModern';

/**
 * Database locale (IndexedDB). Le tabelle rispecchiano lo schema SQL in
 * supabase/migrations: il passaggio a Supabase sostituirà solo l'adattatore.
 */
export class HubDatabase extends Dexie {
  products!: EntityTable<Product, 'id'>;
  collection!: EntityTable<CollectionEntry, 'productId'>;
  players!: EntityTable<Player, 'id'>;
  characters!: EntityTable<Character, 'id'>;
  characterNotes!: EntityTable<CharacterNote, 'characterId'>;
  abilities!: EntityTable<Ability, 'id'>;
  scenarios!: EntityTable<Scenario, 'id'>;
  campaigns!: EntityTable<Campaign, 'id'>;
  participants!: EntityTable<CampaignParticipant, 'id'>;
  progress!: EntityTable<ProgressEntry, 'id'>;
  keptItems!: EntityTable<KeptItem, 'id'>;
  sessions!: EntityTable<GameSession, 'id'>;
  sessionParticipants!: EntityTable<SessionParticipant, 'id'>;
  activities!: EntityTable<Activity, 'id'>;
  images!: EntityTable<StoredImage, 'id'>;

  constructor(name = 'zombicide-hub') {
    super(name);
    this.version(1).stores({
      products: 'id, universeId, kind, origin',
      collection: 'productId, owned',
      players: 'id, name, origin',
      characters: 'id, universeId, productId, kind, origin',
      abilities: 'id, universeId, origin',
      scenarios: 'id, universeId, productId, origin',
      campaigns: 'id, universeId, productId, status, origin, updatedAt',
      sessions: 'id, universeId, campaignId, playedOn, outcome, origin',
      sessionParticipants: 'id, sessionId, playerId, characterId',
      activities: 'id, at, universeId, origin',
      images: 'id',
    });
    this.version(2).stores({ characterNotes: 'characterId' });
    // Revisione 3: trascrizione dei 24 sopravvissuti verificata dall'utente; correzione di Ney.
    this.version(3).upgrade(async (tx) => {
      const ney = await tx.table('characters').get('moderno-ney');
      if (ney) {
        ney.abilities = ney.abilities.map((g: { level: string; abilityIds: string[] }) =>
          g.level === 'giallo' ? { ...g, abilityIds: ['moderno-1-azione'] } : g);
        ney.traits = { ...ney.traits, transcriptionNotes: seedModernSurvivors.find((c) => c.id === 'moderno-ney')?.traits?.transcriptionNotes };
        await tx.table('characters').put(ney);
      }
      await tx.table('abilities').delete('moderno-azione');
      await tx.table('characters').where('origin').equals('base').modify((c: { universeId: string; dataStatus: string }) => {
        if (c.universeId === 'moderno') c.dataStatus = 'verificato';
      });
    });
    // Revisione 4: campagne con schede (Rio Z Janeiro) e provenienze dal regolamento 2ª edizione.
    this.version(4).stores({
      participants: 'id, campaignId, characterId',
      progress: 'id, campaignId, participantId, sessionId',
      keptItems: 'id, campaignId, participantId',
    }).upgrade(async (tx) => {
      for (const p of seedProducts.filter((x) => x.id === 'rio-z-janeiro' || x.id === 'zombicide-2e')) {
        await tx.table('products').update(p.id, { kind: p.kind, requires: p.requires, dataStatus: p.dataStatus });
      }
      for (const c of seedModernSurvivors.filter((x) => x.productId)) {
        const existing = await tx.table('characters').get(c.id);
        if (existing && !existing.productId) await tx.table('characters').update(c.id, { productId: c.productId });
      }
    });
    // Aggiunge i record di base mancanti senza toccare quelli esistenti (anche se modificati dall'utente).
    this.on('ready', () => syncBaseCatalog(this));
  }
}

async function addMissing<T extends { id: string }>(table: EntityTable<T, 'id'>, rows: T[]) {
  const existing = new Set((await table.bulkGet(rows.map((r) => r.id) as never)).filter(Boolean).map((r) => (r as T).id));
  const missing = rows.filter((r) => !existing.has(r.id));
  if (missing.length) await table.bulkAdd(missing as never);
}

export async function syncBaseCatalog(database: HubDatabase) {
  await database.transaction('rw', database.products, database.abilities, database.characters, async () => {
    await addMissing(database.products, seedProducts);
    await addMissing(database.abilities, seedModernAbilities);
    await addMissing(database.characters, seedModernSurvivors);
  });
}

export const db = new HubDatabase();

/** Tabelle incluse nel backup (le immagini sono gestite a parte). */
export const DATA_TABLES = [
  'products', 'collection', 'players', 'characters', 'characterNotes', 'abilities', 'scenarios',
  'campaigns', 'participants', 'progress', 'keptItems', 'sessions', 'sessionParticipants', 'activities',
] as const;
export type DataTable = (typeof DATA_TABLES)[number];
