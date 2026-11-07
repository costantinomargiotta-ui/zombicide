import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { RemoteRow, RemoteStore } from './sync';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Client Supabase, presente solo se l'app è configurata (variabili d'ambiente su Netlify).
 * La chiave pubblicabile può stare nel browser: i dati sono protetti dalle regole RLS.
 */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

const BUCKET = 'zh-immagini';
const PAGE = 1000;

export function supabaseRemote(client: SupabaseClient, uid: string): RemoteStore {
  return {
    async upsert(rows) {
      const { error } = await client.from('zh_records').upsert(rows.map((r) => ({ owner_id: uid, tbl: r.tbl, id: r.id, data: r.data, deleted: r.deleted, client_updated_at: r.client_updated_at })), { onConflict: 'owner_id,tbl,id' });
      if (error) throw new Error(error.message);
    },
    async pullSince(since) {
      const out: RemoteRow[] = [];
      for (let from = 0; ; from += PAGE) {
        let q = client.from('zh_records').select('tbl,id,data,deleted,client_updated_at,server_updated_at').order('server_updated_at').range(from, from + PAGE - 1);
        if (since) q = q.gt('server_updated_at', since);
        const { data, error } = await q;
        if (error) throw new Error(error.message);
        out.push(...(data as RemoteRow[]));
        if (!data || data.length < PAGE) break;
      }
      return out;
    },
    async uploadImage(id, blob) {
      const { error } = await client.storage.from(BUCKET).upload(`${uid}/${id}`, blob, { upsert: true, contentType: blob.type || 'application/octet-stream' });
      if (error) throw new Error(error.message);
    },
    async downloadImage(id) {
      const { data, error } = await client.storage.from(BUCKET).download(`${uid}/${id}`);
      return error ? null : data;
    },
  };
}
