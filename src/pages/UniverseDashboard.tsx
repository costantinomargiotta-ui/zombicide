import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, BookOpen, Box, CheckCircle2, Clock, Dices, Layers, Percent, Skull, Target, Users, Zap } from 'lucide-react';
import { db } from '../data/db';
import { useStatsInput } from '../data/hooks';
import { PRODUCT_KIND_LABEL, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { rulesFor } from '../rules';
import { computeStats } from '../services/stats';
import { formatDuration, formatNumber, formatPercent } from '../lib/format';
import { scopedPath } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { StatTile } from '../ui/components/StatTile';
import { CampaignRow } from '../ui/components/CampaignRow';
import { EmptyState } from '../ui/components/EmptyState';
import { Badge } from '../ui/components/Badge';
import { UniverseEmblem } from '../ui/components/UniverseEmblem';
import { QUICK_ACTIONS } from './GlobalDashboard';

const levelColor: Record<string, string> = {
  blu: 'var(--lvl-blu)', giallo: 'var(--lvl-giallo)', arancione: 'var(--lvl-arancione)', rosso: 'var(--lvl-rosso)',
};

export function UniverseDashboard({ universeId }: { universeId: UniverseId }) {
  const u = UNIVERSES[universeId];
  const rules = rulesFor(universeId);
  const input = useStatsInput();
  const products = useLiveQuery(() => db.products.where('universeId').equals(universeId).toArray(), [universeId]);
  const owned = new Set(input?.collection.filter((c) => c.owned).map((c) => c.productId));

  if (!input || !products) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const s = computeStats(input, universeId);
  const productName = (id: string) => products.find((p) => p.id === id)?.name;
  const ownedProducts = products.filter((p) => owned.has(p.id));

  return (
    <div className="flex flex-col gap-5">
      <div className="panel relative overflow-hidden p-5">
        <div className="absolute inset-0" style={{ background: 'var(--scene), linear-gradient(90deg, color-mix(in srgb, var(--accent) 30%, #000), transparent 70%)' }} aria-hidden />
        <UniverseEmblem id={universeId} className="absolute -right-6 -bottom-8 size-48 text-[var(--accent)] opacity-15" />
        <div className="relative flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-xl border-2 border-[var(--accent)] bg-black/60 text-[var(--accent)] shadow-[0_0_24px_var(--glow)]">
            <UniverseEmblem id={universeId} className="size-9" />
          </span>
          <div className="flex-1">
            <h1 className="title-display text-4xl sm:text-5xl">{u.name}</h1>
            <p className="text-[var(--muted)]">{u.subtitle}</p>
          </div>
          <Link to={scopedPath(universeId, 'campagne?nuova=1')} className="btn btn-accent"><Layers className="size-4" /> Nuova campagna</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <StatTile icon={Box} label="Prodotti posseduti" value={`${s.ownedProducts} / ${s.catalogProducts}`} />
        <StatTile icon={Layers} label="Campagne attive" value={s.activeCampaigns.length} />
        <StatTile icon={Dices} label="Partite giocate" value={s.sessionsPlayed} />
        <StatTile icon={Percent} label="Successo" value={s.successRate === null ? null : formatPercent(s.successRate)} />
        <StatTile icon={Skull} label="Zombie eliminati" value={s.zombiesKilled === null ? null : formatNumber(s.zombiesKilled)} />
        <StatTile icon={Clock} label="Tempo di gioco" value={s.minutesPlayed === null ? null : formatDuration(s.minutesPlayed)} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <Panel title="Campagne" icon={Target} action={<Link to={scopedPath(universeId, 'campagne')} className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Vedi tutte →</Link>}>
            {s.allCampaigns.length ? (
              <div className="flex flex-col gap-2">
                {s.allCampaigns.map((p) => <CampaignRow key={p.campaign.id} progress={p} productName={productName(p.campaign.productId)} />)}
              </div>
            ) : (
              <EmptyState icon={Layers} title={`Nessuna campagna ${u.name}`} action={<Link to={scopedPath(universeId, 'campagne?nuova=1')} className="btn btn-accent">Crea una campagna</Link>} />
            )}
          </Panel>

          <Panel title="Regole dell'universo" icon={BookOpen}>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <h3 className="mb-1 font-semibold">Tipologie di personaggio</h3>
                <div className="flex flex-wrap gap-1.5">
                  {rules.characterKinds.map((k) => (
                    <Badge key={k.id} tone={k.playable ? 'accent' : 'neutral'}>{k.label}{k.playable ? '' : ' (non giocabile)'}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Esperienza e livelli di pericolo</h3>
                {rules.progression ? (
                  <>
                    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {rules.progression.levels.map((l) => (
                        <li key={l.id} className="rounded-md border-l-4 bg-black/30 px-3 py-2" style={{ borderColor: levelColor[l.color] }}>
                          <div className="font-semibold" style={{ color: levelColor[l.color] }}>{l.label} · da {l.minXp} PE</div>
                          <div className="text-[var(--muted)]">{l.effect}</div>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Fonte: {rules.progression.source.document}{rules.progression.source.page ? `, pag. ${rules.progression.source.page}` : ''}.
                    </p>
                  </>
                ) : (
                  <div className="flex gap-2 rounded-md border border-amber-700 bg-amber-900/20 p-3 text-amber-200">
                    <AlertTriangle className="size-5 shrink-0" aria-hidden />
                    <span>Regole non ancora documentate: non vengono applicate quelle di altri universi. Servono i materiali indicati qui accanto.</span>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title="Giochi ed espansioni" icon={Box} action={<Link to={scopedPath(universeId, 'collezione')} className="text-sm text-[var(--muted)] hover:text-[var(--text)]">Collezione →</Link>}>
            <ul className="flex flex-col gap-1.5 text-sm">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  {owned.has(p.id) ? <CheckCircle2 className="size-4 text-[var(--ok)]" aria-label="Posseduto" /> : <span className="size-4 rounded-full border border-[var(--line)]" aria-label="Non posseduto" />}
                  <span className={owned.has(p.id) ? 'flex-1' : 'flex-1 text-[var(--muted)]'}>{p.name}</span>
                  <span className="text-xs text-[var(--muted)]">{PRODUCT_KIND_LABEL[p.kind]}</span>
                </li>
              ))}
            </ul>
            {!ownedProducts.length && <p className="mt-3 text-xs text-[var(--muted)]">Non hai ancora segnato prodotti come posseduti.</p>}
          </Panel>

          <Panel title="Accesso rapido" icon={Zap}>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ sub, label, icon: Icon }) => (
                <Link key={sub} to={scopedPath(universeId, sub)} className="btn justify-start text-sm">
                  <Icon className="size-4 text-[var(--accent-2)]" aria-hidden /> {label}
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Materiali mancanti" icon={AlertTriangle}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
              {rules.missingMaterials.map((m) => <li key={m}>{m}</li>)}
            </ul>
            <p className="mt-3 flex items-center gap-1 text-xs text-[var(--muted)]"><Users className="size-3" /> Le regole verranno implementate solo da materiali ufficiali.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
