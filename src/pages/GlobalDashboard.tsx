import { Link } from 'react-router-dom';
import {
  Activity as ActivityIcon, ArrowRight, BarChart3, Box, CheckCircle2, CheckSquare, ClipboardList, Dices, Flag, FlaskConical,
  Layers, Library, Package, Skull, Star, Target, Trophy, Users, Zap,
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useHasDemoData, useRecentActivities, useStatsInput } from '../data/hooks';
import { UNIVERSE_IDS } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { computeStats } from '../services/stats';
import { formatNumber, relativeTime } from '../lib/format';
import { Panel } from '../ui/components/Panel';
import { UniverseCard } from '../ui/components/UniverseCard';
import { CampaignRow } from '../ui/components/CampaignRow';
import { EmptyState } from '../ui/components/EmptyState';
import { Badge } from '../ui/components/Badge';
import { scopedPath } from '../lib/scope';

export const QUICK_ACTIONS = [
  { sub: 'partite?nuova=1', label: 'Nuova Partita', icon: Dices },
  { sub: '#universi', label: 'Scegli Universo', icon: Layers },
  { sub: 'campagne', label: 'Scegli Campagna', icon: Flag },
  { sub: 'personaggi', label: 'Archivio Sopravvissuti', icon: Users },
  { sub: 'equipaggiamento', label: 'Inventario Globale', icon: Package },
  { sub: 'carte', label: 'Cerca Carte', icon: Library },
  { sub: 'statistiche', label: 'Vedi Statistiche', icon: BarChart3 },
];

const ACT_ICON = { partita: Star, campagna: Target, collezione: CheckSquare, prodotto: Box, giocatore: Users, personaggio: Users, sistema: ActivityIcon } as const;

export function GlobalDashboard() {
  const input = useStatsInput();
  const activities = useRecentActivities(5);
  const hasDemo = useHasDemoData();
  const products = useLiveQuery(() => db.products.toArray());
  const productName = (id: string) => products?.find((p) => p.id === id)?.name;

  if (!input) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const global = computeStats(input);
  const byUniverse = Object.fromEntries(UNIVERSE_IDS.map((u) => [u, computeStats(input, u)]));

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-xl border-2 border-black/60">
        <img src="/ui/banner.webp" alt="Un'unica app per tutto l'universo Zombicide. Gestisci collezione, campagne, sopravvissuti, partite e progressi di tutti gli universi: Fantasy, Moderno, Western e Marvel." className="block h-auto w-full" />
      </div>

      {hasDemo && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-fuchsia-700 bg-fuchsia-900/20 px-4 py-2 text-sm">
          <FlaskConical className="size-5 text-fuchsia-300" aria-hidden />
          <span className="flex-1">Sono presenti dati dimostrativi, marcati con <Badge tone="demo">DEMO</Badge>. Non sono dati reali.</span>
          <Link to="/impostazioni" className="btn text-sm">Gestisci</Link>
        </div>
      )}

      <div id="universi" className="grid scroll-mt-28 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {UNIVERSE_IDS.map((id) => <UniverseCard key={id} id={id} stats={byUniverse[id]} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.9fr_1fr]">
        <div className="flex flex-col gap-5">
          <Panel title="Le mie campagne attive" icon={Target} action={<Link to="/campagne" className="flex items-center gap-1 text-sm hover:text-[var(--accent-2)]">Vedi tutte <ArrowRight className="size-4" /></Link>}>
            {global.activeCampaigns.length ? (
              <div className="flex flex-col">
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
                sub.startsWith('#')
                  ? <a key={sub} href={sub} className="btn focus-ring min-h-24 flex-col gap-1.5 py-3 text-center text-[15px] leading-tight"><Icon className="size-9 text-[var(--accent-2)]" aria-hidden />{label}</a>
                  : <Link key={sub} to={`/${sub}`} className="btn focus-ring min-h-24 flex-col gap-1.5 py-3 text-center text-[15px] leading-tight"><Icon className="size-9 text-[var(--accent-2)]" aria-hidden />{label}</Link>
              ))}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title="La mia Collezione" icon={Box} action={<Link to="/collezione" className="text-sm hover:text-[var(--accent-2)]">Modifica</Link>}>
            <ul className="flex flex-col">
              {UNIVERSE_IDS.map((id) => {
                const s = byUniverse[id];
                return (
                  <li key={id}>
                    <Link to={scopedPath(id, 'collezione')} className="flex items-center gap-3 border-b border-white/10 py-1.5 last:border-0 hover:bg-white/5">
                      <img src={`/ui/icona-${id}.webp`} alt="" className="size-7 object-contain" />
                      <span className="w-24 text-lg font-medium">{UNIVERSES[id].name}</span>
                      <span className="flex-1 text-sm">{s.ownedProducts} {s.ownedProducts === 1 ? 'gioco' : 'giochi'} / espansioni</span>
                      {s.ownedProducts > 0 ? <CheckCircle2 className="size-6 fill-[#57c02a] text-black" aria-label="Presente in collezione" /> : <span className="size-6 rounded-full border-2 border-white/30" aria-label="Nessun prodotto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Statistiche Globali" icon={Trophy}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
              {[
                { icon: Dices, label: 'Partite giocate', value: global.sessionsPlayed },
                { icon: Target, label: 'Scenari completati', value: global.scenariosCompleted },
                { icon: Users, label: 'Sopravvissuti utilizzati', value: global.distinctCharacters },
                { icon: Skull, label: 'Zombie eliminati', value: global.zombiesKilled === null ? null : formatNumber(global.zombiesKilled) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 rounded-lg border-2 border-white/15 bg-black/40 px-2 py-2 text-center">
                  <Icon className="size-6" aria-hidden />
                  <span className="text-xs leading-tight">{label}</span>
                  <span className={value === null ? 'text-xs text-[var(--muted)] italic' : 'text-2xl font-bold'}>{value ?? 'Non disponibile'}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Ultime attività" icon={ClipboardList}>
            {activities?.length ? (
              <ul className="flex flex-col">
                {activities.map((a) => {
                  const Icon = ACT_ICON[a.kind] ?? ActivityIcon;
                  return (
                    <li key={a.id} className="flex items-center gap-2.5 border-b border-white/10 py-1.5 text-sm last:border-0">
                      <Icon className={`size-5 shrink-0 ${a.kind === 'partita' ? 'fill-[#f5c518] text-[#f5c518]' : a.kind === 'collezione' ? 'text-[#57c02a]' : ''}`} aria-hidden />
                      <span className="flex-1">{a.message}</span>
                      <span className="shrink-0 text-xs text-[var(--muted)]">{relativeTime(a.at)}</span>
                    </li>
                  );
                })}
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
