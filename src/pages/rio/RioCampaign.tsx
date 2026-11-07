import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2, ClipboardList, Dices, Flag, Lock, Pencil, Play, Plus, Skull, Star, Trash2, Trophy, UserPlus, UserRound, Users,
} from 'lucide-react';
import { db } from '../../data/db';
import { rioRepo, sheetFor } from '../../data/rioRepository';
import type { Campaign, Character } from '../../domain/types';
import { missionProgress, PEC_MAX, RIO_MISSIONS } from '../../rules/moderno/rioZJaneiro';
import { formatDate, formatDuration, formatNumber } from '../../lib/format';
import { Panel } from '../../ui/components/Panel';
import { StatTile } from '../../ui/components/StatTile';
import { Badge } from '../../ui/components/Badge';
import { EmptyState } from '../../ui/components/EmptyState';
import { Field, Modal } from '../../ui/components/Modal';
import { StoredImage } from '../../ui/components/StoredImage';
import { RioSessionForm } from './RioSessionForm';

/** Tutti i dati di una campagna Rio, letti in modo reattivo. */
export function useRioData(campaignId: string) {
  return useLiveQuery(async () => {
    const [participants, progress, sessions, keptItems, characters] = await Promise.all([
      db.participants.where('campaignId').equals(campaignId).toArray(),
      db.progress.where('campaignId').equals(campaignId).toArray(),
      db.sessions.where('campaignId').equals(campaignId).toArray(),
      db.keptItems.where('campaignId').equals(campaignId).toArray(),
      db.characters.where('universeId').equals('moderno').toArray(),
    ]);
    const sessionParticipants = await db.sessionParticipants.where('sessionId').anyOf(sessions.map((s) => s.id)).toArray();
    participants.sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
    return { participants, progress, sessions, keptItems, characters, sessionParticipants };
  }, [campaignId]);
}

export function Portrait({ c, className = 'size-full' }: { c?: Character; className?: string }) {
  return (
    <StoredImage
      imageId={c?.portraitImageId}
      alt={c ? `Ritratto di ${c.name}` : ''}
      className={`${className} object-cover object-top`}
      fallback={<div className={`${className} grid place-items-center bg-gradient-to-b from-[#2a2f36] to-[#0e1013]`}><UserRound className="size-1/2 text-[var(--muted)]" /></div>}
    />
  );
}

function AddParticipant({ campaign, characters, usedIds, deadParticipants, onClose }: {
  campaign: Campaign; characters: Character[]; usedIds: Set<string>;
  deadParticipants: { id: string; name: string }[]; onClose: () => void;
}) {
  const products = useLiveQuery(() => db.products.toArray());
  const [characterId, setCharacterId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [successorOf, setSuccessorOf] = useState('');
  const [error, setError] = useState<string | null>(null);
  const available = characters.filter((c) => !usedIds.has(c.id)).sort((a, b) =>
    Number(b.productId === campaign.productId) - Number(a.productId === campaign.productId) || a.name.localeCompare(b.name));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await rioRepo.addParticipant({ campaignId: campaign.id, characterId, playerName, successorOf: successorOf || undefined });
      onClose();
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <Modal open onClose={onClose} title="Aggiungi sopravvissuto" footer={<>
      <button type="button" className="btn" onClick={onClose}>Annulla</button>
      <button type="submit" form="add-part" className="btn btn-accent" disabled={!characterId}>Aggiungi</button>
    </>}>
      <form id="add-part" onSubmit={submit} className="flex flex-col gap-3">
        <Field label="Sopravvissuto" hint="Ogni Sopravvissuto riceve una Scheda Campagna nuova, indipendente dalle altre campagne.">
          <select className="input" value={characterId} onChange={(e) => setCharacterId(e.target.value)} required>
            <option value="">Seleziona…</option>
            {available.map((c) => <option key={c.id} value={c.id}>{c.name} · {products?.find((p) => p.id === c.productId)?.name ?? 'provenienza da indicare'}</option>)}
          </select>
        </Field>
        <Field label="Nome del giocatore"><input className="input" value={playerName} onChange={(e) => setPlayerName(e.target.value)} /></Field>
        {deadParticipants.length > 0 && (
          <Field label="Sostituisce un Sopravvissuto morto?" hint="Il successore parte da zero ma eredita i Traguardi della Campagna (pag. 7).">
            <select className="input" value={successorOf} onChange={(e) => setSuccessorOf(e.target.value)}>
              <option value="">No</option>
              {deadParticipants.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
        )}
        {error && <p role="alert" className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">{error}</p>}
      </form>
    </Modal>
  );
}

export function RioCampaign({ campaign }: { campaign: Campaign }) {
  const data = useRioData(campaign.id);
  const [form, setForm] = useState<{ sessionId?: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const characters = useMemo(() => new Map(data?.characters.map((c) => [c.id, c])), [data?.characters]);

  if (!data) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const { participants, progress, sessions, sessionParticipants } = data;
  const sheets = new Map(participants.map((p) => [p.id, sheetFor(p, participants, progress)]));
  const deadIds = new Set(participants.filter((p) => sheets.get(p.id)!.dead).map((p) => p.id));
  const alive = participants.filter((p) => !deadIds.has(p.id));
  const missions = missionProgress(sessions);
  const completed = missions.filter((m) => m.state === 'completata').length;
  const current = missions.find((m) => m.state === 'disponibile');
  const wins = sessions.filter((s) => s.outcome === 'vittoria').length;
  const losses = sessions.filter((s) => s.outcome === 'sconfitta').length;
  const zombieValues = sessions.map((s) => s.zombiesKilled).filter((v): v is number => typeof v === 'number');
  const minutes = sessions.map((s) => s.durationMinutes).filter((v): v is number => typeof v === 'number');
  const avgPec = alive.length ? Math.round((alive.reduce((a, p) => a + sheets.get(p.id)!.pec, 0) / alive.length) * 10) / 10 : null;
  const allTraguardi = [...new Set(participants.flatMap((p) => sheets.get(p.id)!.traguardi))];
  const campaignLost = participants.length > 0 && alive.length === 0;
  const sortedSessions = [...sessions].sort((a, b) => b.playedOn.localeCompare(a.playedOn) || b.createdAt.localeCompare(a.createdAt));
  const editing = form?.sessionId ? sessions.find((s) => s.id === form.sessionId) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <Panel title="Panoramica Campagna" icon={ClipboardList}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Progressi generali</span>
            <span>{completed} / {RIO_MISSIONS.length} missioni</span>
          </div>
          <div className="flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={RIO_MISSIONS.length} aria-valuenow={completed} aria-label="Missioni completate">
            {missions.map((m) => (
              <span key={m.mission.id} title={`${m.mission.code} – ${m.mission.title}`} className={`h-4 flex-1 rounded-sm border border-black/60 ${m.state === 'completata' ? 'bg-[var(--ok)] shadow-[0_0_8px_rgb(87_192_42/0.6)]' : m.state === 'disponibile' ? 'bg-[var(--accent-2)]/40' : 'bg-white/10'}`} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            <StatTile icon={Trophy} label="Vittorie" value={wins} />
            <StatTile icon={Skull} label="Sconfitte" value={losses} />
            <StatTile icon={Flag} label="Traguardi" value={allTraguardi.length} />
            <StatTile icon={Star} label="PEC medi" value={avgPec} />
            <StatTile icon={Dices} label="Zombie eliminati" value={zombieValues.length ? formatNumber(zombieValues.reduce((a, b) => a + b, 0)) : null} />
            <StatTile icon={Dices} label="Tempo di gioco" value={minutes.length ? formatDuration(minutes.reduce((a, b) => a + b, 0)) : null} />
          </div>
          {campaignLost && <p className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">Tutti i Sopravvissuti sono morti: secondo il regolamento la campagna è persa (pag. 7). Puoi comunque aggiungere successori se la state ancora giocando.</p>}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel title="Scenario attuale" icon={Play} className="xl:col-span-2">
          {current ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="hazard-frame shrink-0 sm:w-48"><div className="hazard-inner grid h-28 place-items-center bg-black/80"><span className="title-display text-5xl text-[var(--accent-2)]">{current.mission.code}</span></div></div>
              <div className="flex flex-1 flex-col gap-1.5">
                <h3 className="text-xl font-semibold">{current.mission.code}. {current.mission.title}</h3>
                <p className="text-sm text-[var(--muted)]">{current.mission.difficulty} · {current.mission.duration} · Tessere {current.mission.tiles.join(', ')} · pag. {current.mission.page}</p>
                <ol className="list-decimal pl-5 text-sm">{current.mission.objectives.map((o) => <li key={o}>{o}</li>)}</ol>
                {current.attempts > 0 && <p className="text-xs text-[var(--muted)]">Tentativi registrati: {current.attempts}. Il regolamento non specifica cosa accade dopo una Missione persa: la Missione resta disponibile.</p>}
                <div className="mt-1">
                  <button type="button" className="btn btn-accent" onClick={() => setForm({})} disabled={!alive.length}>
                    <Play className="size-4" /> {alive.length ? 'Registra questa missione' : 'Aggiungi prima i sopravvissuti'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState icon={Trophy} title="Campagna completata!">Tutte e 10 le Missioni del Carnevale dei Morti sono state vinte.</EmptyState>
          )}
        </Panel>

        <Panel title="Missioni" icon={Flag}>
          <ol className="flex flex-col gap-1 text-sm">
            {missions.map(({ mission, state }) => (
              <li key={mission.id} className={`flex items-center gap-2 rounded-md px-2 py-1 ${state === 'disponibile' ? 'bg-[var(--accent-2)]/15' : ''}`}>
                <span className="w-9 font-semibold">{mission.code}</span>
                <span className={`flex-1 truncate ${state === 'bloccata' ? 'text-[var(--muted)]' : ''}`}>{mission.title}</span>
                {state === 'completata' ? <CheckCircle2 className="size-4 text-[var(--ok)]" aria-label="Completata" /> : state === 'bloccata' ? <Lock className="size-4 text-[var(--muted)]" aria-label="Bloccata" /> : <Play className="size-4 text-[var(--accent-2)]" aria-label="Disponibile" />}
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel title={`Sopravvissuti (${alive.length} vivi)`} icon={Users} action={<button type="button" className="btn btn-accent text-sm" onClick={() => setAdding(true)}><UserPlus className="size-4" /> Aggiungi</button>}>
        {participants.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {participants.map((p) => {
              const c = characters.get(p.characterId);
              const s = sheets.get(p.id)!;
              return (
                <Link key={p.id} to={`/campagne/${campaign.id}/scheda/${p.id}`} className={`focus-ring flex items-center gap-3 rounded-lg border p-2 transition hover:border-[var(--accent)] ${s.dead ? 'border-red-900 bg-red-950/30 opacity-70' : 'border-[var(--line)] bg-black/30'}`}>
                  <span className="size-16 shrink-0 overflow-hidden rounded-md border border-[var(--line)]"><Portrait c={c} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-lg font-semibold">{c?.name}{s.dead && <Skull className="size-4 text-red-400" aria-label="Morto" />}</span>
                    <span className="block text-xs text-[var(--muted)]">{p.playerName ? `Giocatore: ${p.playerName}` : 'Giocatore non indicato'}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/60"><span className="block h-full bg-[var(--accent-2)]" style={{ width: `${(s.pec / PEC_MAX) * 100}%` }} /></span>
                      <span className="text-sm font-semibold">PEC {s.pec}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {s.pendingMilestones.length > 0 && <Badge tone="warn">Ricompensa da scegliere</Badge>}
                      {s.orphanRewards.length > 0 && <Badge tone="danger">Ricompensa da verificare</Badge>}
                      {s.bonusActions > 0 && <Badge>Azioni Bonus {s.bonusActions}</Badge>}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Users} title="Nessun sopravvissuto" action={<button type="button" className="btn btn-accent" onClick={() => setAdding(true)}><Plus className="size-4" /> Aggiungi il primo</button>}>
            Il Carnevale dei Morti è pensato per 6 Sopravvissuti (pag. 15).
          </EmptyState>
        )}
      </Panel>

      <Panel title="Registro partite" icon={Dices}>
        {sortedSessions.length ? (
          <ul className="flex flex-col divide-y divide-[var(--line)]">
            {sortedSessions.map((s) => {
              const sps = sessionParticipants.filter((x) => x.sessionId === s.id);
              return (
                <li key={s.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                  <span className="w-28 text-[var(--muted)]">{formatDate(s.playedOn)}</span>
                  <span className="min-w-40 flex-1 font-medium">{s.scenarioTitle}</span>
                  <span className="text-xs text-[var(--muted)]">{sps.map((x) => characters.get(x.characterId ?? '')?.name).filter(Boolean).join(', ')}</span>
                  <Badge tone={s.outcome === 'vittoria' ? 'ok' : 'danger'}>{s.outcome === 'vittoria' ? 'Vittoria' : 'Sconfitta'}</Badge>
                  <button type="button" className="btn px-2 py-1" onClick={() => setForm({ sessionId: s.id })} aria-label="Correggi partita"><Pencil className="size-4" /></button>
                  <button type="button" className="btn btn-danger px-2 py-1" onClick={() => setDeleting(s.id)} aria-label="Elimina partita"><Trash2 className="size-4" /></button>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState icon={Dices} title="Nessuna missione registrata">Registra una missione per aggiornare PEC, Traguardi e Azioni Bonus delle schede.</EmptyState>
        )}
      </Panel>

      {form && (
        <RioSessionForm
          campaignId={campaign.id}
          participants={participants}
          characters={characters}
          deadIds={deadIds}
          defaultMissionId={current?.mission.id ?? RIO_MISSIONS[RIO_MISSIONS.length - 1].id}
          session={editing}
          sessionParticipants={editing ? sessionParticipants.filter((x) => x.sessionId === editing.id) : undefined}
          onClose={() => setForm(null)}
        />
      )}
      {adding && (
        <AddParticipant
          campaign={campaign}
          characters={data.characters}
          usedIds={new Set(participants.map((p) => p.characterId))}
          deadParticipants={participants.filter((p) => deadIds.has(p.id) && !participants.some((x) => x.successorOf === p.id)).map((p) => ({ id: p.id, name: characters.get(p.characterId)?.name ?? p.characterId }))}
          onClose={() => setAdding(false)}
        />
      )}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Eliminare la partita?" footer={<>
        <button type="button" className="btn" onClick={() => setDeleting(null)}>Annulla</button>
        <button type="button" className="btn btn-danger" onClick={async () => { await rioRepo.deleteSession(deleting!); setDeleting(null); }}><Trash2 className="size-4" /> Elimina</button>
      </>}>
        <p className="text-sm">Verranno tolti anche i PEC, i Traguardi e gli esiti registrati con questa partita. Le ricompense già scelte resteranno e, se non più valide, verranno segnalate sulle schede.</p>
      </Modal>
    </div>
  );
}
