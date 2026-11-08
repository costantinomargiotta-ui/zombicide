import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2, ClipboardList, Dices, Lock, Pencil, Play, Plus, Skull, Star, Package, Target, Trash2, Trophy, UserPlus, UserRound, Users,
} from 'lucide-react';
import { db } from '../../data/db';
import { rioRepo, sheetFor } from '../../data/rioRepository';
import type { Campaign, Character } from '../../domain/types';
import { missionProgress, PEC_MAX } from '../../rules/moderno/rioZJaneiro';
import { sheetCampaignFor } from '../../rules/moderno/sheetCampaigns';
import { formatDate, formatDuration, formatNumber } from '../../lib/format';
import { Panel } from '../../ui/components/Panel';
import { Badge } from '../../ui/components/Badge';
import { EmptyState } from '../../ui/components/EmptyState';
import { Field, Modal } from '../../ui/components/Modal';
import { StoredImage } from '../../ui/components/StoredImage';
import { RioSessionForm } from './RioSessionForm';
import { KillCounter } from './KillCounter';
import { killsOf } from '../../domain/kills';
import { defaultPortraitUrl } from '../../domain/portraits';
import { CAMPAIGN_STATUS_LABEL } from '../../domain/types';

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
      fallback={defaultPortraitUrl(c?.id) ? <img src={defaultPortraitUrl(c?.id)} alt={c ? `Ritratto di ${c.name}` : ''} className={`${className} object-cover object-top`} loading="lazy" />
        : <div className={`${className} grid place-items-center bg-gradient-to-b from-[#2a2f36] to-[#0e1013]`}><UserRound className="size-1/2 text-[var(--muted)]" /></div>}
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
  const cfg = sheetCampaignFor(campaign.templateId)!;
  const data = useRioData(campaign.id);
  const [params, setParams] = useSearchParams();
  const [form, setFormState] = useState<{ sessionId?: string } | null>(params.get('registra') === '1' ? {} : null);
  const setForm = (v: { sessionId?: string } | null) => { setFormState(v); if (!v && params.get('registra')) setParams({}, { replace: true }); };
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const characters = useMemo(() => new Map(data?.characters.map((c) => [c.id, c])), [data?.characters]);

  if (!data) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const { participants, progress, sessions, sessionParticipants } = data;
  const sheets = new Map(participants.map((p) => [p.id, sheetFor(p, participants, progress)]));
  const deadIds = new Set(participants.filter((p) => sheets.get(p.id)!.dead).map((p) => p.id));
  const alive = participants.filter((p) => !deadIds.has(p.id));
  const missions = missionProgress(sessions, cfg.missions);
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[230px_1fr] xl:grid-cols-[250px_1fr]">
        {/* Colonna sinistra: illustrazione e modalità, come nel mockup */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border-2 border-black/70 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
            <img src={cfg.image} alt={`Campagna ${cfg.gameName}`} className="block h-auto w-full" />
          </div>
          <Panel title="Modalità Campagna" bodyClassName="p-3">
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 text-sm">
              <dt className="flex items-center gap-2 text-[var(--muted)]"><UserRound className="size-4" />Gioco:</dt><dd>{cfg.gameName}<span className="block text-[10px] text-[var(--muted)]">{cfg.campaignName}</span></dd>
              <dt className="flex items-center gap-2 text-[var(--muted)]"><Package className="size-4" />Stato:</dt>
              <dd className={`font-semibold ${campaign.status === 'in-corso' ? 'text-[var(--ok)]' : ''}`}>{CAMPAIGN_STATUS_LABEL[campaign.status]}</dd>
              <dt className="flex items-center gap-2 text-[var(--muted)]"><Package className="size-4" />Difficoltà:</dt>
              <dd>{current ? current.mission.difficulty : '–'}<span className="block text-[10px] text-[var(--muted)]">della missione attuale</span></dd>
              <dt className="flex items-center gap-2 text-[var(--muted)]"><Users className="size-4" />Sopravvissuti:</dt><dd>{alive.length} vivi su {participants.length}</dd>
            </dl>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Panoramica Campagna" icon={ClipboardList}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Progressi generali</span>
                <span className="text-lg">{completed} / {cfg.missions.length} scenari</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1 rounded-full border-2 border-black/70 bg-black/60 p-1" role="progressbar" aria-valuemin={0} aria-valuemax={cfg.missions.length} aria-valuenow={completed} aria-label="Missioni completate">
                  {missions.map((m) => (
                    <span key={m.mission.id} title={`${m.mission.code} – ${m.mission.title}`} className={`h-4 flex-1 rounded-full ${m.state === 'completata' ? 'bg-gradient-to-b from-[#8ff04a] to-[#3f9a1c] shadow-[0_0_8px_rgb(87_192_42/0.6)]' : 'bg-white/10'}`} />
                  ))}
                </div>
                <span className="w-14 text-right text-2xl font-bold text-[var(--accent-2)]">{Math.round((completed / cfg.missions.length) * 100)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  { icon: Trophy, label: 'Vittorie', value: wins },
                  { icon: Skull, label: 'Sconfitte', value: losses },
                  { icon: Target, label: 'Traguardi', value: allTraguardi.length },
                  { icon: Star, label: 'PEC medi', value: avgPec ?? '–' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border-2 border-white/15 bg-black/40 px-3 py-2">
                    <Icon className={`size-8 shrink-0 ${label === 'PEC medi' ? 'fill-[#f5c518] text-[#f5c518]' : label === 'Vittorie' ? 'text-[#f5c518]' : ''}`} aria-hidden />
                    <span className="flex-1 text-center leading-tight"><span className="block text-sm">{label}</span><span className="text-2xl font-bold text-[var(--accent-2)]">{value}</span></span>
                  </div>
                ))}
              </div>
              {(zombieValues.length > 0 || minutes.length > 0) && (
                <p className="text-sm text-[var(--muted)]">
                  {zombieValues.length > 0 && <>Zombie eliminati: <strong className="text-[var(--text)]">{formatNumber(zombieValues.reduce((x, y) => x + y, 0))}</strong> · </>}
                  {minutes.length > 0 && <>Tempo di gioco: <strong className="text-[var(--text)]">{formatDuration(minutes.reduce((x, y) => x + y, 0))}</strong></>}
                </p>
              )}
              {campaignLost && <p className="rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">Tutti i Sopravvissuti sono morti: secondo il regolamento la campagna è persa (pag. 7). Puoi comunque aggiungere successori se la state ancora giocando.</p>}
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Panel title="Scenario attuale">
              {current ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <img src={cfg.scenarioImage} alt="" className="h-28 w-full shrink-0 rounded-md border-2 border-white/20 object-cover sm:w-44" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <h3 className="text-xl font-semibold">{current.mission.code.replace('M', '')}. {current.mission.title}</h3>
                    <p className="text-sm">{current.mission.objectives[0]}</p>
                    <p className="text-xs text-[var(--muted)]">{current.mission.difficulty} · {current.mission.duration}{'startTime' in current.mission ? ` · partenza ${(current.mission as { startTime: string }).startTime}` : ''} · pag. {current.mission.page}{current.attempts > 0 ? ` · tentativi: ${current.attempts}` : ''}</p>
                    <div className="mt-1">
                      <button type="button" onClick={() => setForm({})} disabled={!alive.length}
                        className="flex items-center gap-2 rounded-md border-2 border-[#8a4a00] bg-gradient-to-b from-[#ffb21e] to-[#e88a00] px-4 py-1.5 font-semibold text-black shadow hover:brightness-110 disabled:opacity-50">
                        <Play className="size-4 fill-black" /> {alive.length ? 'Gioca scenario' : 'Aggiungi prima i sopravvissuti'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState icon={Trophy} title="Campagna completata!">Tutte le Missioni di {cfg.campaignName} sono state vinte.</EmptyState>
              )}
            </Panel>

            <Panel title="Prossimi scenari">
              <ol className="flex flex-col gap-1.5">
                {missions.filter((m) => m.state === 'bloccata').slice(0, 3).map(({ mission }) => (
                  <li key={mission.id} className="flex items-center gap-2 rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-sm">
                    <span className="w-6 font-semibold">{mission.code.replace('M', '')}.</span>
                    <span className="flex-1 truncate">{mission.title}</span>
                    <Lock className="size-4 text-[var(--muted)]" aria-label="Bloccato" />
                  </li>
                ))}
                {!missions.some((m) => m.state === 'bloccata') && <li className="text-sm text-[var(--muted)]">Nessuno scenario bloccato.</li>}
              </ol>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-[var(--muted)]">Tutte le missioni</summary>
                <ol className="mt-1 flex flex-col gap-0.5">
                  {missions.map(({ mission, state }) => (
                    <li key={mission.id} className="flex items-center gap-2">
                      <span className="w-8 font-semibold">{mission.code}</span>
                      <span className={`flex-1 truncate ${state === 'bloccata' ? 'text-[var(--muted)]' : ''}`}>{mission.title}</span>
                      {state === 'completata' ? <CheckCircle2 className="size-4 text-[var(--ok)]" aria-label="Completata" /> : state === 'bloccata' ? <Lock className="size-4 text-[var(--muted)]" aria-label="Bloccata" /> : <Play className="size-4 text-[var(--accent-2)]" aria-label="Disponibile" />}
                    </li>
                  ))}
                </ol>
              </details>
            </Panel>
          </div>

          {current && alive.length > 0 && campaign.status !== 'completata' && <KillCounter campaignId={campaign.id} participants={alive} characters={characters} />}

          <Panel title="Traguardi della Campagna">
            {(() => {
              const locked = cfg.knownMilestones.map((k) => k.name).filter((n) => !allTraguardi.includes(n));
              return allTraguardi.length + locked.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
                  {allTraguardi.map((t) => (
                    <div key={t} className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-[#57c02a] bg-gradient-to-b from-[#2c6410] to-[#112a06] px-2 py-2 text-center font-semibold">
                      <CheckCircle2 className="size-7 fill-[#57c02a] text-black" />{t}
                    </div>
                  ))}
                  {locked.map((t) => (
                    <div key={t} className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-white/25 bg-black/40 px-2 py-2 text-center text-[var(--muted)]">
                      <Lock className="size-6" />{t}
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-[var(--muted)]">Nessun Traguardo.</p>;
            })()}
            <p className="mt-2 text-xs text-[var(--muted)]">Lucchetto: Traguardi citati dal regolamento non ancora ottenuti. Gli altri arrivano dalle carte Obiettivo e si aggiungono dalle schede.</p>
          </Panel>
        </div>
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
                      {(() => { const n = sessionParticipants.filter((x) => x.participantId === p.id).reduce((a, x) => a + (killsOf(x.campaignData) ?? 0), 0); return n ? <Badge><Skull className="size-3" /> {n} zombie</Badge> : null; })()}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Users} title="Nessun sopravvissuto" action={<button type="button" className="btn btn-accent" onClick={() => setAdding(true)}><Plus className="size-4" /> Aggiungi il primo</button>}>
            {cfg.survivorsAdvice}
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
          cfg={cfg}
          campaignId={campaign.id}
          participants={participants}
          characters={characters}
          deadIds={deadIds}
          defaultMissionId={current?.mission.id ?? cfg.missions[cfg.missions.length - 1].id}
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
