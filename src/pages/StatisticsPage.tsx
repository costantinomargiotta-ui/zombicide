import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3, Clock, Dices, Layers, Percent, Skull, Star, Target, Trophy, UserRound, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { db } from '../data/db';
import { useStatsInput } from '../data/hooks';
import { UNIVERSES } from '../domain/universes';
import { defaultPortraitUrl } from '../domain/portraits';
import { computeStats } from '../services/stats';
import { characterRanking, playerRanking, sessionsByMonth, type CharacterRank, type MonthBucket } from '../services/rankings';
import { PEC_MAX, RIO_MISSIONS } from '../rules/moderno/rioZJaneiro';
import { formatDuration, formatNumber, formatPercent } from '../lib/format';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { EmptyState } from '../ui/components/EmptyState';
import { StoredImage } from '../ui/components/StoredImage';
import type { Character } from '../domain/types';

// Colori validati con lo strumento dataviz sul fondo scuro (CVD ΔE 8,3); le sconfitte hanno anche il tratteggio.
const WIN = '#52b526';
const LOSS = '#e3262e';
const LOSS_FILL = `repeating-linear-gradient(45deg, ${LOSS} 0 3px, #7a1418 3px 5px)`;
const n = (v: number, one: string, many: string) => `${v} ${v === 1 ? one : many}`;

function KpiRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number | null }) {
  return (
    <li className="flex items-center gap-3 border-b border-[var(--line)] py-2.5 last:border-0">
      <Icon className="size-8 shrink-0 text-[var(--accent-2)]" aria-hidden />
      <div className="flex-1 text-center">
        <div className="text-sm text-[var(--muted)]">{label}</div>
        <div className={value === null ? 'text-sm text-[var(--muted)] italic' : 'text-2xl leading-tight font-semibold'}>{value ?? 'Non disponibile'}</div>
      </div>
    </li>
  );
}

function Portrait({ c }: { c?: Character }) {
  const url = defaultPortraitUrl(c?.id);
  return (
    <StoredImage imageId={c?.portraitImageId} alt="" className="size-full object-cover object-top"
      fallback={url ? <img src={url} alt="" className="size-full object-cover object-top" loading="lazy" /> : <div className="grid size-full place-items-center bg-black/40"><UserRound className="size-1/2 text-[var(--muted)]" /></div>} />
  );
}

/** Barra a 10 segmenti: ogni segmento vale 2 PEC, come la barra dei mockup. */
function SegmentBar({ value, max }: { value: number; max: number }) {
  const segs = 10;
  const filled = Math.round((value / max) * segs);
  return (
    <span className="flex gap-[2px]" role="img" aria-label={`${value} su ${max}`}>
      {Array.from({ length: segs }, (_, i) => (
        <span key={i} className="h-3 flex-1 rounded-[2px]" style={{ background: i < filled ? (i >= segs - 2 ? '#f07d1a' : '#e3262e') : 'rgb(255 255 255 / 0.12)' }} />
      ))}
    </span>
  );
}

function TopSurvivor({ r, c }: { r: CharacterRank; c?: Character }) {
  return (
    <li className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-[var(--line)] py-2 last:border-0">
      <span className="size-14 overflow-hidden rounded-md border border-[var(--line)]"><Portrait c={c} /></span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-xl font-semibold">{r.name}</span>
          <span className="flex shrink-0 items-center gap-1 text-sm text-[var(--muted)]"><Trophy className="size-4 text-[var(--accent-2)]" />{n(r.victories, 'vittoria', 'vittorie')}</span>
        </span>
        <SegmentBar value={Math.min(r.pec, PEC_MAX)} max={PEC_MAX} />
        <span className="text-xs text-[var(--muted)]">{n(r.played, 'partita', 'partite')}</span>
      </span>
      <span className="text-right"><span className="block text-xs text-[var(--muted)]">PEC</span><span className="text-2xl font-bold text-[var(--accent-2)]">{r.pec}</span></span>
    </li>
  );
}

function Ring({ ratio }: { ratio: number | null }) {
  const R = 52; const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 130 130" className="size-36 shrink-0" role="img" aria-label={ratio === null ? 'Percentuale non disponibile' : `${formatPercent(ratio)} vittorie`}>
      <circle cx="65" cy="65" r={R} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="12" />
      {ratio !== null && ratio < 1 && <circle cx="65" cy="65" r={R} fill="none" stroke={LOSS} strokeWidth="12" />}
      {ratio !== null && ratio > 0 && <circle cx="65" cy="65" r={R} fill="none" stroke={WIN} strokeWidth="12" strokeDasharray={`${ratio * C} ${C}`} transform="rotate(-90 65 65)" strokeLinecap={ratio < 1 ? 'round' : 'butt'} />}
      <text x="65" y="64" textAnchor="middle" fill="currentColor" fontSize="26" fontWeight="700">{ratio === null ? '–' : formatPercent(ratio)}</text>
      <text x="65" y="84" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.7">vittorie</text>
    </svg>
  );
}

function MonthChart({ data }: { data: MonthBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.victories + d.defeats));
  const H = 140;
  return (
    <div>
      <div className="mb-2 flex gap-4 text-xs text-[var(--muted)]" aria-hidden>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: WIN }} /> Vittorie</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: LOSS_FILL }} /> Sconfitte</span>
      </div>
      <div className="flex items-end gap-2 overflow-x-auto pb-1" style={{ height: H + 44 }} role="img" aria-label="Partite per mese">
        {data.map((d) => {
          const total = d.victories + d.defeats;
          return (
            <div key={d.month} className="flex min-w-10 flex-1 flex-col items-center justify-end" title={`${d.label}: ${n(d.victories, 'vittoria', 'vittorie')}, ${n(d.defeats, 'sconfitta', 'sconfitte')}`}>
              {total > 0 && <span className="mb-1 text-xs text-[var(--muted)]">{total}</span>}
              <div className="flex w-full max-w-10 flex-col justify-end gap-[2px] border-b border-[var(--line)]">
                {d.defeats > 0 && <div className="rounded-t-[4px]" style={{ height: (d.defeats / max) * H, background: LOSS_FILL }} />}
                {d.victories > 0 && <div className={d.defeats ? '' : 'rounded-t-[4px]'} style={{ height: (d.victories / max) * H, background: WIN }} />}
              </div>
              <span className="mt-1 h-4 text-[10px] whitespace-nowrap text-[var(--muted)]">{d.label}</span>
            </div>
          );
        })}
      </div>
      <table className="sr-only">
        <caption>Partite per mese</caption>
        <thead><tr><th>Mese</th><th>Vittorie</th><th>Sconfitte</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.month}><td>{d.label}</td><td>{d.victories}</td><td>{d.defeats}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

type Tab = 'generali' | 'giocatori' | 'grafici';

export function StatisticsPage() {
  const { universeId } = useScope();
  const [tab, setTab] = useState<Tab>('generali');
  const input = useStatsInput();
  const extra = useLiveQuery(async () => ({
    participants: await db.participants.toArray(),
    progress: await db.progress.toArray(),
    characters: await db.characters.toArray(),
  }));
  if (!input || !extra) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const s = computeStats(input, universeId);
  const rankInput = { sessions: input.sessions, sessionParticipants: input.participants, ...extra };
  const chars = characterRanking(rankInput, universeId).sort((a, b) => b.pec - a.pec || b.victories - a.victories || b.played - a.played);
  const players = playerRanking(rankInput, universeId);
  const months = sessionsByMonth(rankInput, universeId);
  const totalChars = extra.characters.filter((c) => !universeId || c.universeId === universeId).length;
  const totalPec = chars.reduce((a, c) => a + c.pec, 0);
  const charById = new Map(extra.characters.map((c) => [c.id, c]));

  // Vittorie per difficoltà delle Missioni (solo dove la difficoltà è nota: Rio Z Janeiro).
  const sessions = input.sessions.filter((x) => !universeId || x.universeId === universeId);
  const byDifficulty = (['Medio', 'Difficile', 'Molto Difficile'] as const).map((d) => {
    const ids = new Set(RIO_MISSIONS.filter((m) => m.difficulty === d).map((m) => m.id));
    return { label: d, value: sessions.filter((x) => x.outcome === 'vittoria' && x.scenarioId && ids.has(x.scenarioId)).length };
  });
  const maxDiff = Math.max(1, ...byDifficulty.map((d) => d.value));

  const tabBtn = (id: Tab, label: string) => (
    <button type="button" onClick={() => setTab(id)} aria-pressed={tab === id} className={`btn text-sm ${tab === id ? 'btn-accent' : ''}`}>{label}</button>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="panel flex flex-wrap items-center gap-3 px-4 py-2.5">
        <Users className="size-6 text-[var(--accent-2)]" aria-hidden />
        <h1 className="title-display flex-1 text-2xl sm:text-3xl">{universeId ? `Statistiche ${UNIVERSES[universeId].name}` : 'Statistiche sopravvissuti'}</h1>
        <div className="flex gap-2" role="group" aria-label="Vista">{tabBtn('generali', 'Generali')}{tabBtn('giocatori', 'Giocatori')}{tabBtn('grafici', 'Grafici')}</div>
      </div>

      {tab === 'generali' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr] 2xl:grid-cols-[260px_1fr_340px]">
          <Panel>
            <ul>
              <KpiRow icon={Users} label="Sopravvissuti usati" value={`${s.distinctCharacters} / ${totalChars}`} />
              <KpiRow icon={Dices} label="Partite giocate" value={s.sessionsPlayed} />
              <KpiRow icon={Skull} label="Zombie eliminati" value={s.zombiesKilled === null ? null : formatNumber(s.zombiesKilled)} />
              <KpiRow icon={Star} label="PEC totali" value={totalPec} />
              <KpiRow icon={Target} label="Scenari completati" value={s.scenariosCompleted} />
              <KpiRow icon={Clock} label="Tempo di gioco" value={s.minutesPlayed === null ? null : formatDuration(s.minutesPlayed)} />
            </ul>
          </Panel>

          <Panel title="Top sopravvissuti" icon={Trophy}>
            {chars.length ? <ol>{chars.slice(0, 8).map((r) => <TopSurvivor key={r.characterId} r={r} c={charById.get(r.characterId)} />)}</ol>
              : <EmptyState icon={Users} title="Nessuna partita registrata">La classifica comparirà dopo la prima missione.</EmptyState>}
          </Panel>

          <Panel title="Statistiche di campagna" icon={BarChart3} className="lg:col-span-2 2xl:col-span-1">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-1">
              <div>
                <h3 className="mb-2 font-semibold">Esito scenari</h3>
                <div className="flex items-center gap-4">
                  <Ring ratio={s.successRate} />
                  <ul className="flex flex-col gap-2 text-sm">
                    <li className="flex items-center gap-2"><span className="size-3 rounded-sm" style={{ background: WIN }} />Vittorie: <strong>{s.victories}</strong></li>
                    <li className="flex items-center gap-2"><span className="size-3 rounded-sm" style={{ background: LOSS_FILL }} />Sconfitte: <strong>{s.defeats}</strong></li>
                    <li className="flex items-center gap-2"><Layers className="size-3" />Campagne completate: <strong>{s.completedCampaigns}</strong></li>
                    <li className="flex items-center gap-2"><Percent className="size-3" />Successo: <strong>{s.successRate === null ? 'Non disponibile' : formatPercent(s.successRate)}</strong></li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Vittorie per difficoltà</h3>
                <div className="flex h-36 items-end gap-4 border-b border-[var(--line)] px-2" role="img" aria-label={byDifficulty.map((d) => `${d.label}: ${d.value}`).join(', ')}>
                  {byDifficulty.map((d) => (
                    <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1">
                      <span className="text-lg font-semibold">{d.value}</span>
                      <span className="w-full max-w-12 rounded-t-[4px]" style={{ height: Math.max(3, (d.value / maxDiff) * 90), background: d.value ? WIN : 'rgb(255 255 255 / 0.15)' }} />
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex gap-4 px-2 text-center text-xs text-[var(--muted)]">{byDifficulty.map((d) => <span key={d.label} className="flex-1">{d.label}</span>)}</div>
                <p className="mt-2 text-xs text-[var(--muted)]">Difficoltà indicate nel libretto delle Missioni di Rio Z Janeiro.</p>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === 'giocatori' && (
        <Panel title="Giocatori" icon={UserRound}>
          {players.length ? (
            <ol className="flex flex-col">
              {players.map((p) => (
                <li key={p.name} className="grid grid-cols-[minmax(6rem,10rem)_1fr_auto] items-center gap-3 border-b border-[var(--line)] py-2 last:border-0">
                  <span className="truncate text-lg font-semibold">{p.name}</span>
                  <span className="truncate text-sm text-[var(--muted)]">{p.characters.join(', ')}</span>
                  <span className="text-sm">{n(p.played, 'partita', 'partite')} · {n(p.victories, 'vittoria', 'vittorie')}</span>
                </li>
              ))}
            </ol>
          ) : <EmptyState icon={UserRound} title="Nessun giocatore registrato">Indica il nome del giocatore quando aggiungi un sopravvissuto a una campagna.</EmptyState>}
        </Panel>
      )}

      {tab === 'grafici' && (
        <Panel title="Partite per mese" icon={BarChart3}>
          {months.length ? <MonthChart data={months} /> : <EmptyState icon={BarChart3} title="Nessuna partita conclusa">Il grafico comparirà dopo la prima partita registrata.</EmptyState>}
        </Panel>
      )}
    </div>
  );
}
