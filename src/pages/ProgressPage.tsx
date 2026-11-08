import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3, Skull, Star, UserRound } from 'lucide-react';
import { db } from '../data/db';
import { sheetFor } from '../data/rioRepository';
import type { Character } from '../domain/types';
import { defaultPortraitUrl } from '../domain/portraits';
import { PEC_MAX, PEC_MILESTONES, missionProgress } from '../rules/moderno/rioZJaneiro';
import { sheetCampaignFor } from '../rules/moderno/sheetCampaigns';
import { seriesFor, seriesStates } from '../rules/missionSeries';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { EmptyState } from '../ui/components/EmptyState';
import { StoredImage } from '../ui/components/StoredImage';

function Portrait({ c }: { c?: Character }) {
  const url = defaultPortraitUrl(c?.id);
  return <StoredImage imageId={c?.portraitImageId} alt="" className="size-full object-cover object-top"
    fallback={url ? <img src={url} alt="" className="size-full object-cover object-top" loading="lazy" /> : <span className="grid size-full place-items-center"><UserRound className="size-6 text-[var(--muted)]" /></span>} />;
}

/** Avanzamento di tutte le campagne attive: PEC e ricompense per sopravvissuto, missioni per le serie. */
export function ProgressPage() {
  const { universeId } = useScope();
  const data = useLiveQuery(async () => ({
    campaigns: await db.campaigns.toArray(),
    participants: await db.participants.toArray(),
    progress: await db.progress.toArray(),
    sessions: await db.sessions.toArray(),
    characters: await db.characters.toArray(),
  }));
  if (!data) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const active = data.campaigns.filter((c) => c.status !== 'completata' && (!universeId || c.universeId === universeId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex items-center gap-3 px-4 py-2.5">
        <BarChart3 className="size-8 text-[var(--accent-2)]" aria-hidden />
        <h1 className="title-display flex-1 text-3xl">Progressi</h1>
      </div>
      {!active.length && <EmptyState icon={BarChart3} title="Nessuna campagna attiva">I progressi dei sopravvissuti compariranno qui quando inizierai una campagna.</EmptyState>}
      {active.map((camp) => {
        const sc = sheetCampaignFor(camp.templateId);
        const sr = seriesFor(camp.templateId);
        const sessions = data.sessions.filter((s) => s.campaignId === camp.id);
        const total = sc?.missions.length ?? sr?.missions.length ?? camp.plannedScenarioCount;
        const done = sc ? missionProgress(sessions, sc.missions).filter((m) => m.state === 'completata').length
          : sr ? seriesStates(sr, sessions).filter((m) => m.wins > 0).length : sessions.filter((s) => s.outcome === 'vittoria').length;
        const parts = data.participants.filter((p) => p.campaignId === camp.id).sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
        return (
          <Panel key={camp.id} title={camp.name} action={<Link to={`/campagne/${camp.id}`} className="text-sm hover:text-[var(--accent-2)]">Apri →</Link>}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-sm text-[var(--muted)]">{sc?.gameName ?? sr?.gameName ?? camp.productId}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/60"><div className="h-full rounded-full bg-[#57c02a]" style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
              <span className="font-semibold">{done}{total ? ` / ${total}` : ''} missioni</span>
            </div>
            {sc ? (
              parts.length ? (
                <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
                  {parts.map((p) => {
                    const c = data.characters.find((x) => x.id === p.characterId);
                    const s = sheetFor(p, data.participants, data.progress);
                    const next = PEC_MILESTONES.find((m) => m > s.pec);
                    return (
                      <li key={p.id}>
                        <Link to={`/campagne/${camp.id}/scheda/${p.id}`} className={`flex items-center gap-3 rounded-lg border-2 p-2 transition hover:border-[var(--accent)] ${s.dead ? 'border-red-900 opacity-60' : 'border-white/15 bg-black/30'}`}>
                          <span className="size-14 shrink-0 overflow-hidden rounded-md"><Portrait c={c} /></span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2 text-lg font-semibold">{c?.name}{s.dead && <Skull className="size-4 text-red-400" aria-label="Morto" />}<span className="ml-auto text-sm font-normal text-[var(--muted)]">{p.playerName}</span></span>
                            <span className="flex gap-[2px]" role="img" aria-label={`${s.pec} PEC su ${PEC_MAX}`}>
                              {Array.from({ length: PEC_MAX }, (_, i) => <span key={i} className="h-2.5 flex-1 rounded-[2px]" style={{ background: i < s.pec ? ((PEC_MILESTONES as readonly number[]).includes(i + 1) ? '#f5c518' : '#e3262e') : 'rgb(255 255 255 / 0.12)' }} />)}
                            </span>
                            <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-[var(--muted)]">
                              <span><Star className="inline size-3 fill-[#f5c518] text-[#f5c518]" /> PEC {s.pec}</span>
                              <span>Azioni Bonus {s.bonusActions}</span>
                              <span>Abilità {s.campaignAbilityIds.length}</span>
                              <span>Traguardi {s.traguardi.length}</span>
                              {s.pendingMilestones.length > 0 ? <span className="text-amber-300">Ricompensa da scegliere</span> : next ? <span>prossima a {next}</span> : null}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : <p className="text-sm text-[var(--muted)]">Nessun sopravvissuto aggiunto.</p>
            ) : <p className="text-sm text-[var(--muted)]">Missioni indipendenti: nessuna progressione dei sopravvissuti da una partita all'altra.</p>}
          </Panel>
        );
      })}
    </div>
  );
}
