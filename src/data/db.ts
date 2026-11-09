import Dexie, { type EntityTable } from 'dexie';
import type {
  Ability, Activity, Campaign, CampaignParticipant, Character, CharacterNote, CollectionEntry, EquipmentCard, FreeNote, KeptItem, ProgressEntry, GameSession,
  Player, Product, Scenario, SessionParticipant, StoredImage,
} from '../domain/types';
import { seedProducts } from './seed/products';
import type { QueueEntry } from './sync';
import { seedRioCards } from './seed/equipmentRio';
import { seedFantasyAbilities, seedFantasySurvivors } from './seed/survivorsFantasy';
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
  cards!: EntityTable<EquipmentCard, 'id'>;
  notes!: EntityTable<FreeNote, 'id'>;
  sessions!: EntityTable<GameSession, 'id'>;
  sessionParticipants!: EntityTable<SessionParticipant, 'id'>;
  activities!: EntityTable<Activity, 'id'>;
  images!: EntityTable<StoredImage, 'id'>;
  syncQueue!: EntityTable<QueueEntry, 'key'>;
  syncMeta!: EntityTable<{ key: string; value: unknown }, 'key'>;

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
    // Revisione 5: coda e stato della sincronizzazione con Supabase.
    this.version(5).stores({ syncQueue: 'key', syncMeta: 'key' });
    // Revisione 6: catalogo delle carte Equipaggiamento.
    this.version(6).stores({ cards: 'id, universeId, productId, deck, category' });
    // Revisione 7: carte di Rio verificate dall'utente.
    this.version(7).upgrade(async (tx) => {
      await tx.table('cards').where('productId').equals('rio-z-janeiro').modify((c: { productId: string; dataStatus: string; transcriptionNotes?: string }) => {
        if ((c as { origin?: string }).origin === 'base') { c.dataStatus = 'verificato'; delete c.transcriptionNotes; }
      });
    });
    // Revisione 8: Equipaggiamento Avanzato verificato (Sub-MG Conservazione 4).
    this.version(8).upgrade(async (tx) => {
      await tx.table('cards').where('deck').equals('avanzato').modify((c: { origin?: string; id: string; dataStatus: string; conservation?: number; transcriptionNotes?: string }) => {
        if (c.origin !== 'base') return;
        c.dataStatus = 'verificato';
        delete c.transcriptionNotes;
        if (c.id === 'rio-av-sub-mg') c.conservation = 4;
      });
    });
    // Revisione 12: abilità dei sopravvissuti di Black Plague dalle schede identità.
    this.version(12).upgrade(async (tx) => {
      await tx.table('abilities').bulkPut(seedFantasyAbilities);
      for (const c of seedFantasySurvivors) {
        const existing = await tx.table('characters').get(c.id);
        if (existing && !existing.abilities?.length) {
          const traits = { ...(existing.traits ?? {}), ...c.traits };
          delete traits.transcriptionNotes;
          await tx.table('characters').update(c.id, { abilities: c.abilities, traits, dataStatus: c.dataStatus });
        }
      }
    });
    // Revisione 11: quantità delle carte di Rio secondo la lista dell'utente; Opala 78 fuori dal mazzo.
    this.version(11).upgrade(async (tx) => {
      const byId = new Map(seedRioCards.map((c) => [c.id, c]));
      await tx.table('cards').where('productId').equals('rio-z-janeiro').modify((c: EquipmentCard) => {
        const seed = byId.get(c.id);
        if (!seed) return;
        c.quantity = seed.quantity;
        if (seed.outsideDeck) c.outsideDeck = true;
      });
    });
    // Revisione 10: Washington Z.C. (provenienza dei 6 sopravvissuti e prodotto verificato).
    this.version(10).upgrade(async (tx) => {
      const w = seedProducts.find((x) => x.id === 'washington-zc')!;
      await tx.table('products').update(w.id, { kind: w.kind, requires: w.requires, dataStatus: w.dataStatus });
      for (const c of seedModernSurvivors.filter((x) => x.productId === 'washington-zc')) {
        const existing = await tx.table('characters').get(c.id);
        if (existing && !existing.productId) await tx.table('characters').update(c.id, { productId: c.productId });
      }
    });
    // Revisione 9: note libere.
    this.version(9).stores({ notes: 'id, universeId, updatedAt' });
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
  await database.transaction('rw', [database.products, database.abilities, database.characters, database.cards], async () => {
    await addMissing(database.products, seedProducts);
    await addMissing(database.abilities, seedModernAbilities);
    await addMissing(database.abilities, seedFantasyAbilities);
    await addMissing(database.characters, seedModernSurvivors);
    await addMissing(database.characters, seedFantasySurvivors);
    await addMissing(database.cards, seedRioCards);
  });
}

export const db = new HubDatabase();

/** Tabelle incluse nel backup (le immagini sono gestite a parte). */
export const DATA_TABLES = [
  'products', 'collection', 'players', 'cards', 'characters', 'characterNotes', 'abilities', 'scenarios',
  'campaigns', 'participants', 'progress', 'keptItems', 'sessions', 'sessionParticipants', 'activities', 'notes',
] as const;
export type DataTable = (typeof DATA_TABLES)[number];
