import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3, Clock, Dices, Layers, Percent, Skull, Target, Trophy, UserRound, Users } from 'lucide-react';
import { db } from '../data/db';
import { useStatsInput } from '../data/hooks';
import { UNIVERSES } from '../domain/universes';
import { computeStats } from '../services/stats';
import { characterRanking, playerRanking, sessionsByMonth, type MonthBucket } from '../services/rankings';
import { formatDuration, formatNumber, formatPercent } from '../lib/format';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { StatTile } from '../ui/components/StatTile';
import { EmptyState } from '../ui/components/EmptyState';

// Colori validati con lo strumento dataviz sul fondo scuro (CVD ΔE 8,3); le sconfitte hanno anche il tratteggio.
const WIN = '#52b526';
const LOSS = '#e3262e';

function MonthChart({ data }: { data: MonthBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.victories + d.defeats));
  const H = 160;
  return (
    <div>
      <div className="mb-2 flex gap-4 text-xs text-[var(--muted)]" aria-hidden>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: WIN }} /> Vittorie</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: `repeating-linear-gradient(45deg, ${LOSS} 0 3px, #7a1418 3px 5px)` }} /> Sconfitte</span>
      </div>
      <div className="flex items-end gap-2 overflow-x-auto pb-1" style={{ height: H + 44 }} role="img" aria-label="Partite per mese">
        {data.map((d) => {
          const total = d.victories + d.defeats;
          const hv = (d.victories / max) * H;
          const hd = (d.defeats / max) * H;
          return (
            <div key={d.month} className="group relative flex min-w-10 flex-1 flex-col items-center justify-end" title={`${d.label}: ${d.victories} vittorie, ${d.defeats} sconfitte`}>
              {total > 0 && <span className="mb-1 text-xs text-[var(--muted)]">{total}</span>}
              <div className="flex w-full max-w-10 flex-col justify-end gap-[2px] border-b border-[var(--line)]">
                {d.defeats > 0 && <div className="rounded-t-[4px]" style={{ height: hd, background: `repeating-linear-gradient(45deg, ${LOSS} 0 3px, #7a1418 3px 5px)` }} />}
                {d.victories > 0 && <div className={d.defeats ? '' : 'rounded-t-[4px]'} style={{ height: hv, background: WIN }} />}
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

function RankBar({ label, value, max, detail }: { label: string; value: number; max: number; detail: string }) {
  return (
    <li className="grid grid-cols-[minmax(6rem,9rem)_1fr_auto] items-center gap-3 py-1" title={detail}>
      <span className="truncate font-medium">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-black/50"><span className="block h-full rounded-full bg-[var(--accent-2)]" style={{ width: `${(value / max) * 100}%` }} /></span>
      <span className="text-sm text-[var(--muted)]">{detail}</span>
    </li>
  );
}

const n = (v: number, one: string, many: string) => `${v} ${v === 1 ? one : many}`;

export function StatisticsPage() {
  const { universeId } = useScope();
  const input = useStatsInput();
  const extra = useLiveQuery(async () => ({
    participants: await db.participants.toArray(),
    progress: await db.progress.toArray(),
    characters: await db.characters.toArray(),
  }));
  if (!input || !extra) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const s = computeStats(input, universeId);
  const rankInput = { sessions: input.sessions, sessionParticipants: input.participants, ...extra };
  const chars = characterRanking(rankInput, universeId).slice(0, 10);
  const players = playerRanking(rankInput, universeId);
  const months = sessionsByMonth(rankInput, universeId);
  const maxChar = Math.max(1, ...chars.map((c) => c.played));
  const maxPlayer = Math.max(1, ...players.map((p) => p.played));

  return (
    <div className="flex flex-col gap-5">
      <Panel title={universeId ? `Statistiche ${UNIVERSES[universeId].name}` : 'Statistiche globali'} icon={BarChart3}>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 2xl:grid-cols-8">
          <StatTile icon={Dices} label="Partite giocate" value={s.sessionsPlayed} />
          <StatTile icon={Trophy} label="Vittorie" value={s.victories} />
          <StatTile icon={Skull} label="Sconfitte" value={s.defeats} />
          <StatTile icon={Percent} label="Successo" value={s.successRate === null ? null : formatPercent(s.successRate)} />
          <StatTile icon={Target} label="Scenari completati" value={s.scenariosCompleted} />
          <StatTile icon={Layers} label="Campagne completate" value={s.completedCampaigns} />
          <StatTile icon={Skull} label="Zombie eliminati" value={s.zombiesKilled === null ? null : formatNumber(s.zombiesKilled)} hint="Somma delle sole partite in cui è stato registrato" />
          <StatTile icon={Clock} label="Tempo di gioco" value={s.minutesPlayed === null ? null : formatDuration(s.minutesPlayed)} hint="Somma delle sole partite in cui è stata registrata la durata" />
        </div>
      </Panel>

      <Panel title="Partite per mese" icon={BarChart3}>
        {months.length ? <MonthChart data={months} /> : <EmptyState icon={BarChart3} title="Nessuna partita conclusa">Il grafico comparirà dopo la prima partita registrata.</EmptyState>}
      </Panel>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Sopravvissuti più usati" icon={Users}>
          {chars.length ? (
            <ol className="flex flex-col">
              {chars.map((c) => <RankBar key={c.characterId} label={c.name} value={c.played} max={maxChar} detail={`${n(c.played, 'partita', 'partite')} · ${n(c.victories, 'vittoria', 'vittorie')} · PEC ${c.pec}`} />)}
            </ol>
          ) : <EmptyState icon={Users} title="Nessun dato" />}
        </Panel>
        <Panel title="Giocatori" icon={UserRound}>
          {players.length ? (
            <ol className="flex flex-col">
              {players.map((p) => <RankBar key={p.name} label={p.name} value={p.played} max={maxPlayer} detail={`${n(p.played, 'partita', 'partite')} · ${n(p.victories, 'vittoria', 'vittorie')} · ${p.characters.join(', ')}`} />)}
            </ol>
          ) : <EmptyState icon={UserRound} title="Nessun giocatore registrato">Indica il nome del giocatore quando aggiungi un sopravvissuto a una campagna.</EmptyState>}
        </Panel>
      </div>
    </div>
  );
}
