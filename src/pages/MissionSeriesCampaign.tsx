import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, ClipboardList, Dices, Pencil, Play, Skull, Target, Trash2, Trophy, UserRound, Users } from 'lucide-react';
import { db } from '../data/db';
import { missionRepo } from '../data/missionRepository';
import { rioRepo } from '../data/rioRepository';
import type { Campaign, GameSession } from '../domain/types';
import { CAMPAIGN_STATUS_LABEL } from '../domain/types';
import { seriesFor, seriesStates, type MissionSeries, type SeriesMission } from '../rules/missionSeries';
import { formatDate, formatDuration, formatNumber } from '../lib/format';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { Field, Modal } from '../ui/components/Modal';

const DIFF_CLS: Record<string, string> = { Facile: 'bg-[#57c02a] text-black', Medio: 'bg-[#f5a218] text-black', Difficile: 'bg-[#d8232a] text-white', 'Molto Difficile': 'bg-black text-white' };
const today = () => new Date().toISOString().slice(0, 10);

function SessionForm({ series, campaign, mission, session, onClose }: { series: MissionSeries; campaign: Campaign; mission?: SeriesMission; session?: GameSession; onClose: () => void }) {
  const MISSIONS = series.missions;
  const survivors = useLiveQuery(() => db.characters.where('universeId').equals(campaign.universeId).toArray(), [campaign.universeId]);
  const previous = useLiveQuery(() => (session ? db.sessionParticipants.where('sessionId').equals(session.id).toArray() : []), [session?.id]);
  const [missionId, setMissionId] = useState(session?.scenarioId ?? mission?.id ?? MISSIONS[0].id);
  const [outcome, setOutcome] = useState<'vittoria' | 'sconfitta'>(session?.outcome === 'sconfitta' ? 'sconfitta' : 'vittoria');
  const [playedOn, setPlayedOn] = useState(session?.playedOn ?? today());
  const [duration, setDuration] = useState(session?.durationMinutes?.toString() ?? '');
  const [zombies, setZombies] = useState(session?.zombiesKilled?.toString() ?? '');
  const [notes, setNotes] = useState(session?.notes ?? '');
  const [picked, setPicked] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chosen = picked ?? Object.fromEntries((previous ?? []).filter((p) => p.characterId).map((p) => [p.characterId!, String(p.campaignData?.playerName ?? '')]));
  const m = MISSIONS.find((x) => x.id === missionId)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const n = (v: string) => (v.trim() === '' ? undefined : Math.max(0, Number.parseInt(v, 10) || 0));
      await missionRepo.saveSession({
        campaignId: campaign.id, missionId, missionTitle: `${m.code} – ${m.title}`, playedOn, outcome,
        durationMinutes: n(duration) || undefined, zombiesKilled: n(zombies), notes: notes.trim() || undefined,
        participants: Object.entries(chosen).map(([characterId, playerName]) => ({ characterId, playerName })),
      }, session?.id);
      onClose();
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <Modal open onClose={onClose} title={session ? 'Correggi partita' : 'Registra partita'} footer={<>
      <button type="button" className="btn" onClick={onClose}>Annulla</button>
      <button type="submit" form="bp-session" className="btn btn-accent">{session ? 'Salva correzione' : 'Registra'}</button>
    </>}>
      <form id="bp-session" onSubmit={submit} className="flex flex-col gap-3">
        <Field label="Missione">
          <select className="input" value={missionId} onChange={(e) => setMissionId(e.target.value)}>
            {MISSIONS.map((x) => <option key={x.id} value={x.id}>{x.code} – {x.title} ({x.difficulty})</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Esito">
            <div className="flex gap-2">{(['vittoria', 'sconfitta'] as const).map((o) => <button key={o} type="button" onClick={() => setOutcome(o)} aria-pressed={outcome === o} className={`btn flex-1 ${outcome === o ? 'btn-accent' : ''}`}>{o === 'vittoria' ? 'Vittoria' : 'Sconfitta'}</button>)}</div>
          </Field>
          <Field label="Data"><input className="input" type="date" value={playedOn} onChange={(e) => setPlayedOn(e.target.value)} required /></Field>
          <Field label="Durata (minuti)" hint="Facoltativa"><input className="input" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
          <Field label="Zombie eliminati" hint="Facoltativo"><input className="input" type="number" min={0} value={zombies} onChange={(e) => setZombies(e.target.value)} /></Field>
        </div>
        <fieldset>
          <legend className="mb-1 font-semibold">Sopravvissuti{m.survivors ? ` (${m.survivors} consigliati)` : ''}</legend>
          <div className="flex flex-col gap-1.5">
            {survivors?.map((c) => {
              const on = c.id in chosen;
              return (
                <div key={c.id} className={`flex flex-wrap items-center gap-2 rounded-md border px-2 py-1.5 ${on ? 'border-[var(--line-hi)] bg-black/30' : 'border-[var(--line)]'}`}>
                  <label className="flex flex-1 items-center gap-2 font-medium">
                    <input type="checkbox" checked={on} onChange={(e) => { const next = { ...chosen }; if (e.target.checked) next[c.id] = ''; else delete next[c.id]; setPicked(next); }} />{c.name}
                  </label>
                  {on && <input className="input w-44 py-1 text-sm" placeholder="Giocatore" value={chosen[c.id]} onChange={(e) => setPicked({ ...chosen, [c.id]: e.target.value })} aria-label={`Giocatore di ${c.name}`} />}
                </div>
              );
            })}
          </div>
        </fieldset>
        <Field label="Note ed eventi importanti"><textarea className="input min-h-16" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        {error && <p role="alert" className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">{error}</p>}
      </form>
    </Modal>
  );
}

/** Serie di Missioni indipendenti (Black Plague, Zombicide 2ª edizione): nessuna progressione persistente, ordine libero. */
export function MissionSeriesCampaign({ campaign }: { campaign: Campaign }) {
  const series = seriesFor(campaign.templateId)!;
  const MISSIONS = series.missions;
  const data = useLiveQuery(async () => {
    const sessions = await db.sessions.where('campaignId').equals(campaign.id).toArray();
    const sps = await db.sessionParticipants.where('sessionId').anyOf(sessions.map((s) => s.id)).toArray();
    const characters = await db.characters.where('universeId').equals(campaign.universeId).toArray();
    return { sessions, sps, characters };
  }, [campaign.id]);
  const [params, setParams] = useSearchParams();
  const [form, setFormState] = useState<{ mission?: SeriesMission; session?: GameSession } | null>(params.get('registra') === '1' ? {} : null);
  const setForm = (v: { mission?: SeriesMission; session?: GameSession } | null) => { setFormState(v); if (!v && params.get('registra')) setParams({}, { replace: true }); };
  const [deleting, setDeleting] = useState<string | null>(null);
  if (!data) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const states = seriesStates(series, data.sessions);
  const won = states.filter((s) => s.wins > 0).length;
  const wins = data.sessions.filter((s) => s.outcome === 'vittoria').length;
  const losses = data.sessions.filter((s) => s.outcome === 'sconfitta').length;
  const zombies = data.sessions.map((s) => s.zombiesKilled).filter((v): v is number => typeof v === 'number');
  const minutes = data.sessions.map((s) => s.durationMinutes).filter((v): v is number => typeof v === 'number');
  const usedChars = new Set(data.sps.map((p) => p.characterId).filter(Boolean));
  const next = states.find((s) => s.wins === 0);
  const sorted = [...data.sessions].sort((a, b) => b.playedOn.localeCompare(a.playedOn) || b.createdAt.localeCompare(a.createdAt));
  const name = (id?: string) => data.characters.find((c) => c.id === id)?.name;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[230px_1fr] xl:grid-cols-[250px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border-2 border-black/70 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
            <img src={series.image} alt={series.gameName} className="block h-auto w-full" />
          </div>
          <Panel title="Modalità" bodyClassName="p-3">
            <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 text-sm">
              <dt className="flex items-center gap-2 text-[var(--muted)]"><UserRound className="size-4" />Gioco:</dt><dd>{series.gameName}</dd>
              <dt className="text-[var(--muted)]">Stato:</dt><dd className={campaign.status === 'in-corso' ? 'font-semibold text-[var(--ok)]' : ''}>{CAMPAIGN_STATUS_LABEL[campaign.status]}</dd>
              <dt className="text-[var(--muted)]">Tipo:</dt><dd>Missioni indipendenti<span className="block text-[10px] text-[var(--muted)]">nessuna esperienza conservata (regolamento)</span></dd>
            </dl>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Panoramica" icon={ClipboardList}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-lg"><span className="font-semibold">Missioni vinte</span><span>{won} / {MISSIONS.length}</span></div>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1 rounded-full border-2 border-black/70 bg-black/60 p-1" role="progressbar" aria-valuemin={0} aria-valuemax={MISSIONS.length} aria-valuenow={won} aria-label="Missioni vinte">
                  {states.map((s) => <span key={s.mission.id} title={`${s.mission.code} – ${s.mission.title}`} className="h-4 flex-1 rounded-full" style={{ background: s.wins ? series.color : 'rgb(255 255 255 / 0.1)' }} />)}
                </div>
                <span className="w-14 text-right text-2xl font-bold text-[var(--accent-2)]">{Math.round((won / MISSIONS.length) * 100)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  { icon: Trophy, label: 'Vittorie', value: wins },
                  { icon: Skull, label: 'Sconfitte', value: losses },
                  { icon: Users, label: 'Sopravvissuti usati', value: usedChars.size },
                  { icon: Dices, label: 'Zombie eliminati', value: zombies.length ? formatNumber(zombies.reduce((a, b) => a + b, 0)) : '–' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border-2 border-white/15 bg-black/40 px-3 py-2">
                    <Icon className="size-8 shrink-0 text-[var(--accent-2)]" aria-hidden />
                    <span className="flex-1 text-center leading-tight"><span className="block text-sm">{label}</span><span className="text-2xl font-bold text-[var(--accent-2)]">{value}</span></span>
                  </div>
                ))}
              </div>
              {minutes.length > 0 && <p className="text-sm text-[var(--muted)]">Tempo di gioco: <strong className="text-[var(--text)]">{formatDuration(minutes.reduce((a, b) => a + b, 0))}</strong></p>}
            </div>
          </Panel>

          {next && (
            <Panel title="Prossima missione da vincere" icon={Target}>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-semibold">{next.mission.code}. {next.mission.title}</h3>
                <p className="text-sm">{next.mission.objectives[0]}</p>
                <p className="text-xs text-[var(--muted)]">{next.mission.difficulty} · {next.mission.survivors ? `${next.mission.survivors} sopravvissuti · ` : ''}{next.mission.duration} · pag. {next.mission.page}</p>
                <div className="mt-1">
                  <button type="button" onClick={() => setForm({ mission: next.mission })} className="flex items-center gap-2 rounded-md border-2 border-[#8a4a00] bg-gradient-to-b from-[#ffb21e] to-[#e88a00] px-4 py-1.5 font-semibold text-black shadow hover:brightness-110">
                    <Play className="size-4 fill-black" /> Gioca missione
                  </button>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>

      <Panel title={`Le ${MISSIONS.length} missioni`} icon={Target}>
        <p className="mb-3 text-xs text-[var(--muted)]">Fonte: {series.source}.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {states.map(({ mission, wins: w, played }) => (
            <div key={mission.id} className="flex flex-col gap-2 rounded-lg border-2 bg-black/40 p-3" style={w ? { borderColor: series.color, background: `${series.color}22` } : { borderColor: 'rgb(255 255 255 / 0.15)' }}>
              <div className="flex items-start gap-2">
                <span className="title-display text-3xl text-[var(--accent-2)]">{mission.code.replace('M', '')}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg leading-tight font-semibold">{mission.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{mission.survivors ? `${mission.survivors} sopravvissuti · ` : ''}{mission.duration} · pag. {mission.page}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${DIFF_CLS[mission.difficulty]}`}>{mission.difficulty}</span>
              </div>
              <ul className="list-disc pl-5 text-sm">{mission.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
              {mission.tiles.length > 0 && <p className="text-xs text-[var(--muted)]">Tessere: {mission.tiles.join(', ')}</p>}
              <div className="mt-auto flex items-center gap-2">
                {w ? <Badge tone="ok"><CheckCircle2 className="size-3" /> Vinta {w > 1 ? `×${w}` : ''}</Badge> : <span className="text-xs text-[var(--muted)]">{played ? `${played} tentativi` : 'Mai giocata'}</span>}
                <button type="button" className="btn ml-auto px-3 py-1 text-sm" onClick={() => setForm({ mission })}><Play className="size-3" /> Registra</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Registro partite" icon={Dices}>
        {sorted.length ? (
          <ul className="flex flex-col divide-y divide-[var(--line)]">
            {sorted.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                <span className="w-28 text-[var(--muted)]">{formatDate(s.playedOn)}</span>
                <span className="min-w-40 flex-1 font-medium">{s.scenarioTitle}</span>
                <span className="text-xs text-[var(--muted)]">{data.sps.filter((p) => p.sessionId === s.id).map((p) => name(p.characterId)).filter(Boolean).join(', ')}</span>
                <Badge tone={s.outcome === 'vittoria' ? 'ok' : 'danger'}>{s.outcome === 'vittoria' ? 'Vittoria' : 'Sconfitta'}</Badge>
                <button type="button" className="btn px-2 py-1" onClick={() => setForm({ session: s })} aria-label="Correggi partita"><Pencil className="size-4" /></button>
                <button type="button" className="btn btn-danger px-2 py-1" onClick={() => setDeleting(s.id)} aria-label="Elimina partita"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
        ) : <EmptyState icon={Dices} title="Nessuna partita registrata">Scegli una missione e registra com'è andata.</EmptyState>}
      </Panel>

      {form && <SessionForm series={series} campaign={campaign} mission={form.mission} session={form.session} onClose={() => setForm(null)} />}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Eliminare la partita?" footer={<>
        <button type="button" className="btn" onClick={() => setDeleting(null)}>Annulla</button>
        <button type="button" className="btn btn-danger" onClick={async () => { await rioRepo.deleteSession(deleting!); setDeleting(null); }}><Trash2 className="size-4" /> Elimina</button>
      </>}>
        <p className="text-sm">La partita e i suoi partecipanti verranno eliminati.</p>
      </Modal>
    </div>
  );
}
