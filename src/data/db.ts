import Dexie, { type EntityTable } from 'dexie';
import type {
  Ability, Activity, Campaign, Character, CollectionEntry, GameSession,
  Player, Product, Scenario, SessionParticipant, StoredImage,
} from '../domain/types';
import { seedProducts } from './seed/products';

/**
 * Database locale (IndexedDB). Le tabelle rispecchiano lo schema SQL in
 * supabase/migrations: il passaggio a Supabase sostituirà solo l'adattatore.
 */
export class HubDatabase extends Dexie {
  products!: EntityTable<Product, 'id'>;
  collection!: EntityTable<CollectionEntry, 'productId'>;
  players!: EntityTable<Player, 'id'>;
  characters!: EntityTable<Character, 'id'>;
  abilities!: EntityTable<Ability, 'id'>;
  scenarios!: EntityTable<Scenario, 'id'>;
  campaigns!: EntityTable<Campaign, 'id'>;
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
    this.on('populate', (tx) => {
      tx.table('products').bulkAdd(seedProducts);
    });
  }
}

export const db = new HubDatabase();

/** Tabelle incluse nel backup (le immagini sono gestite a parte). */
export const DATA_TABLES = [
  'products', 'collection', 'players', 'characters', 'abilities', 'scenarios',
  'campaigns', 'sessions', 'sessionParticipants', 'activities',
] as const;
export type DataTable = (typeof DATA_TABLES)[number];
