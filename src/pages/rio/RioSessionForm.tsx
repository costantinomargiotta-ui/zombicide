import { useState } from 'react';
import { AlertTriangle, Skull } from 'lucide-react';
import type { CampaignParticipant, Character, GameSession, SessionParticipant } from '../../domain/types';
import { rioRepo, type MissionParticipantInput } from '../../data/rioRepository';
import type { SheetCampaign } from '../../rules/moderno/sheetCampaigns';
import { Field, Modal } from '../../ui/components/Modal';

interface Props {
  cfg: SheetCampaign;
  campaignId: string;
  participants: CampaignParticipant[];
  characters: Map<string, Character>;
  deadIds: Set<string>;
  defaultMissionId: string;
  /** Partita da correggere. */
  session?: GameSession;
  sessionParticipants?: SessionParticipant[];
  onClose: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function RioSessionForm({ cfg, campaignId, participants, characters, deadIds, defaultMissionId, session, sessionParticipants, onClose }: Props) {
  const editing = !!session;
  const [missionId, setMissionId] = useState(session?.scenarioId ?? defaultMissionId);
  const [playedOn, setPlayedOn] = useState(session?.playedOn ?? today());
  const [duration, setDuration] = useState(session?.durationMinutes?.toString() ?? '');
  const [outcome, setOutcome] = useState<'vittoria' | 'sconfitta'>(session?.outcome === 'sconfitta' ? 'sconfitta' : 'vittoria');
  const [zombies, setZombies] = useState(session?.zombiesKilled?.toString() ?? '');
  const [notes, setNotes] = useState(session?.notes ?? '');
  const [error, setError] = useState<string | null>(null);

  // In correzione si parte dai dati registrati; in una nuova partita dai Sopravvissuti vivi.
  const initial: Record<string, MissionParticipantInput & { played: boolean; traguardiText: string }> = {};
  for (const p of participants) {
    const sp = sessionParticipants?.find((x) => x.participantId === p.id);
    const d = (sp?.campaignData ?? {}) as Partial<MissionParticipantInput>;
    initial[p.id] = {
      participantId: p.id,
      played: editing ? !!sp : !deadIds.has(p.id),
      reachedOrange: !!d.reachedOrange,
      reachedRed: !!d.reachedRed,
      extraPec: d.extraPec ?? 0,
      traguardi: d.traguardi ?? [],
      traguardiText: (d.traguardi ?? []).join('\n'),
      died: !!d.died,
    };
  }
  const [rows, setRows] = useState(initial);
  const set = (id: string, patch: Partial<(typeof initial)[string]>) => setRows((r) => ({ ...r, [id]: { ...r[id], ...patch } }));
  const mission = cfg.missions.find((m) => m.id === missionId)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const toInt = (v: string) => (v.trim() === '' ? undefined : Math.max(0, Number.parseInt(v, 10) || 0));
      await rioRepo.saveMissionSession({
        campaignId, missionId, playedOn, outcome,
        durationMinutes: toInt(duration) || undefined,
        zombiesKilled: toInt(zombies),
        notes: notes.trim() || undefined,
        participants: Object.values(rows).filter((r) => r.played).map((r) => ({
          participantId: r.participantId, reachedOrange: r.reachedOrange, reachedRed: r.reachedRed,
          extraPec: Math.max(0, r.extraPec), died: r.died,
          traguardi: r.traguardiText.split('\n').map((t) => t.trim()).filter(Boolean),
        })),
      }, session?.id);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Correggi partita' : 'Registra missione'}
      footer={<>
        <button type="button" className="btn" onClick={onClose}>Annulla</button>
        <button type="submit" form="rio-session" className="btn btn-accent">{editing ? 'Salva correzione' : 'Registra'}</button>
      </>}
    >
      <form id="rio-session" onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Missione">
              <select className="input" value={missionId} onChange={(e) => setMissionId(e.target.value)}>
                {cfg.missions.map((m) => <option key={m.id} value={m.id}>{m.code} – {m.title} ({m.difficulty})</option>)}
              </select>
            </Field>
          </div>
          <Field label="Esito">
            <div className="flex gap-2">
              {(['vittoria', 'sconfitta'] as const).map((o) => (
                <button key={o} type="button" onClick={() => setOutcome(o)} aria-pressed={outcome === o} className={`btn flex-1 ${outcome === o ? 'btn-accent' : ''}`}>
                  {o === 'vittoria' ? 'Vittoria' : 'Sconfitta'}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Data"><input className="input" type="date" value={playedOn} onChange={(e) => setPlayedOn(e.target.value)} required /></Field>
          <Field label="Durata (minuti)" hint="Facoltativa"><input className="input" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
          <Field label="Zombie eliminati" hint="Facoltativo: se vuoto resta «non registrato»"><input className="input" type="number" min={0} value={zombies} onChange={(e) => setZombies(e.target.value)} /></Field>
        </div>

        {mission.campaignNotes && (
          <ul className="rounded-md border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-200">
            {mission.campaignNotes.map((n) => <li key={n} className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{n}</li>)}
          </ul>
        )}

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold">Sopravvissuti</legend>
          <p className="text-xs text-[var(--muted)]">PEC: 1 per il Livello Arancione e 1 per il Rosso raggiunti per la prima volta nella Missione (non in modalità Ultrarossa), più quelli assegnati dalla Missione.</p>
          {participants.map((p) => {
            const r = rows[p.id];
            const name = characters.get(p.characterId)?.name ?? p.characterId;
            const wasDead = deadIds.has(p.id) && !(sessionParticipants?.some((x) => x.participantId === p.id));
            return (
              <div key={p.id} className={`rounded-lg border p-3 ${r.played ? 'border-[var(--line-hi)] bg-black/30' : 'border-[var(--line)] opacity-60'}`}>
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" checked={r.played} disabled={wasDead} onChange={(e) => set(p.id, { played: e.target.checked })} />
                  {name}{p.playerName ? <span className="text-sm font-normal text-[var(--muted)]"> · {p.playerName}</span> : null}
                  {wasDead && <span className="text-xs text-red-300">(morto)</span>}
                </label>
                {r.played && (
                  <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={r.reachedOrange} onChange={(e) => set(p.id, { reachedOrange: e.target.checked })} /><span className="rounded px-1.5 text-black" style={{ background: 'var(--lvl-arancione)' }}>Arancione</span> raggiunto</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={r.reachedRed} onChange={(e) => set(p.id, { reachedRed: e.target.checked })} /><span className="rounded px-1.5 text-white" style={{ background: 'var(--lvl-rosso)' }}>Rosso</span> raggiunto</label>
                    <label className="flex items-center gap-2">PEC extra della Missione <input className="input w-20 py-1" type="number" min={0} value={r.extraPec} onChange={(e) => set(p.id, { extraPec: Number.parseInt(e.target.value, 10) || 0 })} /></label>
                    <label className="flex items-center gap-2 text-red-200"><input type="checkbox" checked={r.died} onChange={(e) => set(p.id, { died: e.target.checked })} /><Skull className="size-4" /> Morto (KO non salvato)</label>
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-[var(--muted)]">Traguardi ottenuti (uno per riga)</span>
                      <textarea className="input min-h-14" value={r.traguardiText} onChange={(e) => set(p.id, { traguardiText: e.target.value })} placeholder={cfg.knownMilestones.map((k) => k.name).join(', ')} />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>

        <Field label="Note ed eventi importanti"><textarea className="input min-h-16" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        {error && <p role="alert" className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">{error}</p>}
      </form>
    </Modal>
  );
}
