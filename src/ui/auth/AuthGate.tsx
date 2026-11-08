import { useEffect, useState, type ReactNode } from 'react';
import { Lock, LogIn } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../data/supabase';
import { startSync, stopSync } from '../../data/syncController';

/** App privata: con Supabase configurato serve l'accesso; senza, l'app resta in modalità locale. */
export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) startSync(session.user.id, session.user.email);
    else stopSync();
  }, [session?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!supabase) return <>{children}</>;
  if (session === undefined) return <div className="app-bg grid min-h-dvh place-items-center text-[var(--muted)]">Caricamento…</div>;
  if (recovering && session) return <NewPasswordScreen onDone={() => setRecovering(false)} />;
  if (!session) return <LoginScreen />;
  return <>{children}</>;
}

function Frame({ children, onSubmit }: { children: ReactNode; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="app-bg grid min-h-dvh place-items-center px-4">
      <form onSubmit={onSubmit} className="hazard-frame w-full max-w-sm">
        <div className="hazard-inner flex flex-col gap-4 bg-[var(--panel)] p-6">
          <img src="/ui/logo.webp" alt="Zombicide Hub" className="mx-auto h-24 w-auto" />
          {children}
        </div>
      </form>
    </div>
  );
}

/** Dopo il clic sul link dell'email di recupero: scelta della nuova password. */
function NewPasswordScreen({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError('La password deve avere almeno 8 caratteri.');
    if (password !== confirm) return setError('Le due password non coincidono.');
    setBusy(true); setError(null);
    const { error } = await supabase!.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message); else onDone();
  }
  return (
    <Frame onSubmit={submit}>
      <p className="text-center font-semibold">Scegli una nuova password</p>
      <label className="flex flex-col gap-1 text-sm">Nuova password<input className="input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <label className="flex flex-col gap-1 text-sm">Ripeti la password<input className="input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></label>
      {error && <p role="alert" className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">{error}</p>}
      <button type="submit" className="btn btn-accent" disabled={busy}>{busy ? 'Salvataggio…' : 'Salva e entra'}</button>
    </Frame>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function forgot() {
    if (!email.trim()) return setError('Scrivi prima la tua email, poi clicca «Password dimenticata?».');
    setBusy(true); setError(null);
    const { error } = await supabase!.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    setBusy(false);
    if (error) setError(error.message); else setSent(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError(error.message === 'Invalid login credentials' ? 'Email o password non corrette.' : error.message);
    setBusy(false);
  }

  return (
    <div className="app-bg grid min-h-dvh place-items-center px-4">
      <form onSubmit={submit} className="hazard-frame w-full max-w-sm">
        <div className="hazard-inner flex flex-col gap-4 bg-[var(--panel)] p-6">
          <div className="text-center">
            <div className="title-display text-5xl">ZOMBICIDE</div>
            <div className="title-display -mt-1 text-3xl text-[var(--accent-2)]">HUB</div>
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]"><Lock className="size-4" /> Area privata</p>
          <label className="flex flex-col gap-1 text-sm">Email<input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="flex flex-col gap-1 text-sm">Password<input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {error && <p role="alert" className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">{error}</p>}
          <button type="submit" className="btn btn-accent" disabled={busy}><LogIn className="size-4" /> {busy ? 'Accesso…' : 'Accedi'}</button>
          <button type="button" className="text-sm text-[var(--muted)] underline-offset-2 hover:text-[var(--text)] hover:underline" onClick={forgot} disabled={busy}>Password dimenticata?</button>
          {sent && <p role="status" className="rounded-md border border-green-700 bg-green-900/30 px-3 py-2 text-sm">Ti ho inviato un'email: apri il link e scegli la nuova password.</p>}
        </div>
      </form>
    </div>
  );
}
