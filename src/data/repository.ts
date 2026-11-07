import type {
  Activity, ActivityKind, Campaign, Character, CampaignStatus, CollectionEntry, Product,
  RecordOrigin, UniverseId,
} from '../domain/types';
import { CAMPAIGN_STATUS_LABEL } from '../domain/types';
import { newId, nowIso, slugify } from '../lib/ids';
import { db, type HubDatabase } from './db';

/**
 * Logica applicativa di scrittura. Ogni operazione importante registra
 * un'attività, così da avere uno storico e poter correggere gli errori.
 */
export function createRepository(database: HubDatabase = db) {
  async function log(kind: ActivityKind, message: string, opts: { universeId?: UniverseId; refId?: string; origin?: RecordOrigin } = {}) {
    const entry: Activity = { id: newId('act'), kind, message, at: nowIso(), origin: opts.origin ?? 'utente', ...opts };
    await database.activities.add(entry);
  }

  return {
    log,

    async setOwned(productId: string, owned: boolean) {
      const product = await database.products.get(productId);
      if (!product) throw new Error(`Prodotto inesistente: ${productId}`);
      const existing = await database.collection.get(productId);
      const entry: CollectionEntry = { ...existing, productId, owned, updatedAt: nowIso() };
      await database.transaction('rw', database.collection, database.activities, async () => {
        await database.collection.put(entry);
        await log('collezione', `${product.name} ${owned ? 'aggiunto alla' : 'rimosso dalla'} collezione`, { universeId: product.universeId, refId: productId });
      });
    },

    async setCollectionNotes(productId: string, notes: string) {
      const existing = await database.collection.get(productId);
      await database.collection.put({ owned: false, ...existing, productId, notes, updatedAt: nowIso() });
    },

    async saveProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'origin' | 'dataStatus'> & { id?: string; dataStatus?: Product['dataStatus'] }) {
      const now = nowIso();
      const existing = input.id ? await database.products.get(input.id) : undefined;
      let id = input.id ?? slugify(input.name);
      if (!existing && (await database.products.get(id))) id = `${id}-${newId('p').slice(-6)}`;
      const product: Product = {
        ...existing,
        ...input,
        id,
        dataStatus: input.dataStatus ?? existing?.dataStatus ?? 'da-verificare',
        origin: existing?.origin ?? 'utente',
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      await database.transaction('rw', database.products, database.activities, async () => {
        await database.products.put(product);
        await log('prodotto', `${existing ? 'Aggiornato' : 'Aggiunto al catalogo'}: ${product.name}`, { universeId: product.universeId, refId: id });
      });
      return product;
    },

    async createCampaign(input: { universeId: UniverseId; name: string; productId: string; description?: string; plannedScenarioCount?: number; templateId?: string }) {
      const now = nowIso();
      const campaign: Campaign = { ...input, id: newId('camp'), status: 'da-iniziare', origin: 'utente', createdAt: now, updatedAt: now };
      await database.transaction('rw', database.campaigns, database.activities, async () => {
        await database.campaigns.add(campaign);
        await log('campagna', `Nuova campagna: ${campaign.name}`, { universeId: campaign.universeId, refId: campaign.id });
      });
      return campaign;
    },

    async setCampaignStatus(id: string, status: CampaignStatus) {
      const campaign = await database.campaigns.get(id);
      if (!campaign) throw new Error(`Campagna inesistente: ${id}`);
      await database.transaction('rw', database.campaigns, database.activities, async () => {
        await database.campaigns.update(id, { status, updatedAt: nowIso() });
        await log('campagna', `${campaign.name}: stato "${CAMPAIGN_STATUS_LABEL[status]}"`, { universeId: campaign.universeId, refId: id, origin: campaign.origin });
      });
    },

    async updateCampaign(id: string, patch: Partial<Pick<Campaign, 'name' | 'description' | 'notes' | 'plannedScenarioCount'>>) {
      await database.campaigns.update(id, { ...patch, updatedAt: nowIso() });
    },

    async deleteCampaign(id: string) {
      const campaign = await database.campaigns.get(id);
      if (!campaign) return;
      await database.transaction('rw', [database.campaigns, database.sessions, database.sessionParticipants, database.participants, database.progress, database.keptItems, database.activities], async () => {
        await database.participants.where('campaignId').equals(id).delete();
        await database.progress.where('campaignId').equals(id).delete();
        await database.keptItems.where('campaignId').equals(id).delete();
        const sessionIds = (await database.sessions.where('campaignId').equals(id).toArray()).map((s) => s.id);
        await database.sessionParticipants.where('sessionId').anyOf(sessionIds).delete();
        await database.sessions.bulkDelete(sessionIds);
        await database.campaigns.delete(id);
        await log('campagna', `Campagna eliminata: ${campaign.name}`, { universeId: campaign.universeId });
      });
    },

    async setCharacterNotes(characterId: string, notes: string) {
      await database.characterNotes.put({ characterId, notes, updatedAt: nowIso() });
    },

    /** Modifiche dell'utente a un personaggio di catalogo (ritratto, provenienza, verifica). */
    async updateCharacter(id: string, patch: Partial<Pick<Character, 'portraitImageId' | 'productId' | 'dataStatus'>>) {
      const character = await database.characters.get(id);
      if (!character) throw new Error(`Personaggio inesistente: ${id}`);
      await database.transaction('rw', database.characters, database.activities, async () => {
        await database.characters.update(id, patch);
        await log('personaggio', `Scheda aggiornata: ${character.name}`, { universeId: character.universeId, refId: id });
      });
    },

    async saveImage(file: Blob): Promise<string> {
      const id = newId('img');
      await database.images.add({ id, blob: file, mime: file.type, createdAt: nowIso() });
      return id;
    },

    async deleteImage(id: string) {
      await database.images.delete(id);
    },
  };
}

export const repo = createRepository();
export type Repository = ReturnType<typeof createRepository>;
