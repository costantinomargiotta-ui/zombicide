import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db } from './db';
import type { StatsInput } from '../services/stats';

/** Istantanea reattiva dei dati per le statistiche. */
export function useStatsInput(): StatsInput | undefined {
  return useLiveQuery(async () => ({
    products: await db.products.toArray(),
    collection: await db.collection.toArray(),
    campaigns: await db.campaigns.toArray(),
    sessions: await db.sessions.toArray(),
    participants: await db.sessionParticipants.toArray(),
  }));
}

export function useRecentActivities(limit = 6) {
  return useLiveQuery(() => db.activities.orderBy('at').reverse().limit(limit).toArray(), [limit]);
}

export function useHasDemoData() {
  return useLiveQuery(async () => (await db.campaigns.where('origin').equals('demo').count()) > 0);
}

/** URL temporaneo per un'immagine salvata. */
export function useImageUrl(imageId?: string) {
  const image = useLiveQuery(() => (imageId ? db.images.get(imageId) : undefined), [imageId]);
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!image) { setUrl(undefined); return; }
    const u = URL.createObjectURL(image.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [image]);
  return url;
}
