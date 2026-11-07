import { useSyncExternalStore } from 'react';
import { db } from './db';
import { supabase, supabaseRemote } from './supabase';
import { installSyncHooks, syncOnce } from './sync';

export type SyncStatus = 'disattivata' | 'in-attesa' | 'in-corso' | 'sincronizzato' | 'non-in-linea' | 'errore';

interface State { status: SyncStatus; lastSync?: string; error?: string; email?: string }

let state: State = { status: supabase ? 'in-attesa' : 'disattivata' };
const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };

let uid: string | null = null;
let hooksInstalled = false;
let running: Promise<void> | null = null;
let again = false;
let debounce: ReturnType<typeof setTimeout> | undefined;
let interval: ReturnType<typeof setInterval> | undefined;

export async function syncNow(): Promise<void> {
  if (!supabase || !uid) return;
  if (running) { again = true; return running; }
  if (typeof navigator !== 'undefined' && !navigator.onLine) { set({ status: 'non-in-linea' }); return; }
  set({ status: 'in-corso', error: undefined });
  running = (async () => {
    try {
      const r = await syncOnce(db, supabaseRemote(supabase!, uid!), uid!);
      set({ status: 'sincronizzato', lastSync: r.at });
    } catch (e) {
      set({ status: navigator.onLine ? 'errore' : 'non-in-linea', error: (e as Error).message });
    } finally {
      running = null;
      if (again) { again = false; void syncNow(); }
    }
  })();
  return running;
}

const schedule = () => { clearTimeout(debounce); debounce = setTimeout(() => void syncNow(), 2000); };

export function startSync(userId: string, email?: string) {
  uid = userId;
  set({ email });
  if (!hooksInstalled) { installSyncHooks(db, schedule); hooksInstalled = true; }
  clearInterval(interval);
  interval = setInterval(() => void syncNow(), 60_000);
  window.addEventListener('online', schedule);
  window.addEventListener('focus', schedule);
  void syncNow();
}

export function stopSync() {
  uid = null;
  clearInterval(interval);
  window.removeEventListener('online', schedule);
  window.removeEventListener('focus', schedule);
  set({ status: supabase ? 'in-attesa' : 'disattivata', email: undefined });
}

export function useSyncStatus(): State {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state);
}
