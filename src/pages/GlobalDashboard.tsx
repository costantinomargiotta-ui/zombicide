import { Link } from 'react-router-dom';
import {
  Activity as ActivityIcon, BarChart3, Box, CheckCircle2, Clock, Dices, FlaskConical, Layers,
  Library, Percent, Skull, Swords, Target, Trophy, UserRound, Users, Zap,
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useHasDemoData, useRecentActivities, useStatsInput } from '../data/hooks';
import { UNIVERSE_IDS, SESSION_OUTCOME_LABEL } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { computeStats } from '../services/stats';
import { formatDate, formatDuration, formatNumber, formatPercent, relativeTime } from '../lib/format';
import { Panel } from '../ui/components/Panel';
import { StatTile } from '../ui/components/StatTile';
import { UniverseCard } from '../ui/components/UniverseCard';
import { CampaignRow } from '../ui/components/CampaignRow';
import { EmptyState } from '../ui/components/EmptyState';
import { Badge } from '../ui/components/Badge';
import { UniverseEmblem } from '../ui/components/UniverseEmblem';
import { scopedPath } from '../lib/scope';

export const QUICK_ACTIONS = [
  { sub: 'partite?nuova=1', label: 'Nuova partita', icon: Dices },
  { sub: 'campagne?nuova=1', label: 'Nuova campagna', icon: Layers },
  { sub: 'personaggi', label: 'Seleziona personaggi', icon: Users },
  { sub: 'scenari', label: 'Sfoglia scenari', icon: Target },
  { sub: 'carte', label: 'Cerca carte', icon: Library },
  { sub: 'equipaggiamento', label: 'Gestisci equipaggiamento', icon: Swords },
  { sub: 'statistiche', label: 'Consulta statistiche', icon: BarChart3 },
];

export function GlobalDashboard() {
  const input = useStatsInput();
  const activities = useRecentActivities(6);
  const hasDemo = useHasDemoData();
  const products = useLiveQuery(() => db.products.toArray());
  const productName = (id: string) => products?.find((p) => p.id === id)?.name;

  if (!input) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const global = computeStats(input);
  const byUniverse = Object.fromEntries(UNIVERSE_IDS.map((u) => [u, computeStats(input, u)]));
  const last = global.lastSession;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="title-display text-3xl sm:text-5xl">Un'unica app per tutto l'universo Zombicide</h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          Collezione, campagne, personaggi, partite e progressi di Fantasy, Moderno, Western e Marvel.
        </p>
      </div>

      {hasDemo && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-fuchsia-700 bg-fuchsia-900/20 px-4 py-2 text-sm">
          <FlaskConical className="size-5 text-fuchsia-300" aria-hidden />
          <span className="flex-1">Sono presenti dati dimostrativi, marcati con <Badge tone="demo">DEMO</Badge>. Non sono dati reali.</span>
          <Link to="/impostazioni" className="btn text-sm">Gestisci</Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {UNIVERSE_IDS.map((id) => <UniverseCard key={id} id={id} stats={byUniverse[id]} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <Panel title="Le mie campagne attive" icon={Target} action={<Link to="/campagne" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Vedi tutte →</Link>}>
            {global.activeCampaigns.length ? (
              <div className="flex flex-col gap-2">
                {global.activeCampaigns.slice(0, 6).map((p) => <CampaignRow key={p.campaign.id} progress={p} productName={productName(p.campaign.productId)} />)}
              </div>
            ) : (
              <EmptyState icon={Layers} title="Nessuna campagna attiva" action={<Link to="/campagne?nuova=1" className="btn btn-accent">Crea una campagna</Link>}>
                Le campagne che crei compariranno qui, con l'avanzamento calcolato dalle partite registrate.
              </EmptyState>
            )}
          </Panel>

          <Panel title="Accesso rapido" icon={Zap}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {QUICK_ACTIONS.map(({ sub, label, icon: Icon }) => (
                <Link key={sub} to={`/${sub}`} className="btn focus-ring flex-col gap-1 py-3 text-center text-sm">
                  <Icon className="size-7 text-[var(--accent-2)]" aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title="La mia collezione" icon={Box} action={<Link to="/collezione" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Modifica</Link>}>
            <ul className="flex flex-col gap-2">
              {UNIVERSE_IDS.map((id) => {
                const s = byUniverse[id];
                return (
                  <li key={id} data-universe={id}>
                    <Link to={scopedPath(id, 'collezione')} className="flex items-center gap-3 rounded-md px-1 py-1 hover:bg-white/5">
                      <UniverseEmblem id={id} className="size-5 text-[var(--accent)]" />
                      <span className="flex-1 font-medium">{UNIVERSES[id].name}</span>
                      <span className="text-sm text-[var(--muted)]">
                        {s.ownedBaseGames} giochi · {s.ownedExpansions} espansioni
                      </span>
                      {s.ownedProducts > 0 && <CheckCircle2 className="size-5 text-[var(--ok)]" aria-label="Presente in collezione" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Statistiche globali" icon={Trophy}>
            <div className="grid grid-cols-2 gap-2">
              <StatTile icon={Dices} label="Partite giocate" value={global.sessionsPlayed} />
              <StatTile icon={Target} label="Scenari completati" value={global.scenariosCompleted} />
              <StatTile icon={Percent} label="Successo" value={global.successRate === null ? null : formatPercent(global.successRate)} />
              <StatTile icon={Skull} label="Zombie eliminati" value={global.zombiesKilled === null ? null : formatNumber(global.zombiesKilled)} />
              <StatTile icon={Users} label="Personaggi usati" value={global.distinctCharacters} />
              <StatTile icon={Clock} label="Tempo di gioco" value={global.minutesPlayed === null ? null : formatDuration(global.minutesPlayed)} />
            </div>
          </Panel>

          <Panel title="Ultima partita" icon={Dices}>
            {last ? (
              <div className="flex flex-col gap-2 text-sm" data-universe={last.universeId}>
                <div className="flex flex-wrap items-center gap-2">
                  <UniverseEmblem id={last.universeId} className="size-5 text-[var(--accent)]" />
                  <span className="font-semibold">{last.scenarioTitle ?? 'Scenario senza titolo'}</span>
                  <Badge tone={last.outcome === 'vittoria' ? 'ok' : last.outcome === 'sconfitta' ? 'danger' : 'neutral'}>{SESSION_OUTCOME_LABEL[last.outcome]}</Badge>
                  {last.origin === 'demo' && <Badge tone="demo">DEMO</Badge>}
                </div>
                <span className="text-[var(--muted)]">{formatDate(last.playedOn)}</span>
                {global.recentCharacters.length > 0 && (
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wide text-[var(--muted)]">Ultimi personaggi utilizzati</div>
                    <div className="flex flex-wrap gap-1.5">
                      {global.recentCharacters.map((c) => <Badge key={c}><UserRound className="size-3" />{c}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState icon={Dices} title="Nessuna partita registrata">La registrazione delle partite arriva con la Fase 3.</EmptyState>
            )}
          </Panel>

          <Panel title="Ultime attività" icon={ActivityIcon}>
            {activities?.length ? (
              <ul className="flex flex-col divide-y divide-[var(--line)] text-sm">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 py-1.5">
                    {a.universeId ? <span data-universe={a.universeId}><UniverseEmblem id={a.universeId} className="size-4 text-[var(--accent)]" /></span> : <ActivityIcon className="size-4" />}
                    <span className="flex-1">{a.message}</span>
                    <span className="shrink-0 text-xs text-[var(--muted)]">{relativeTime(a.at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={ActivityIcon} title="Nessuna attività">Le modifiche alla collezione e alle campagne verranno registrate qui.</EmptyState>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
