import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, ChevronDown, ChevronsDownUp, ChevronsUpDown, Globe, ListTree, Map, Target } from 'lucide-react';
import { db } from '../data/db';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { MISSION_SERIES } from '../rules/missionSeries';
import { UNIVERSES } from '../domain/universes';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { HowToPlay, MissionMapView } from './missionViews';
import { RulebookPageLink as PageLink } from '../ui/components/RulebookPageLink';
import { WebMissionsSection } from './WebMissions';
import { AND_MISSIONS, WEB_MISSIONS, WEB_PAGE_ONLY } from '../rules/moderno/webMissions';
import type { UniverseId } from '../domain/types';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface BoxInfo { id: string; title: string; universeId: UniverseId; count: number; missionIds: string[] }

/** Scatola richiudibile: intestazione come i pannelli, contenuto solo se aperta. */
function Box({ info, open, onToggle, icon: Icon = Target, children }: { info: BoxInfo; open: boolean; onToggle: () => void; icon?: LucideIcon; children: ReactNode }) {
  return (
    <section id={`scatola-${info.id}`} className="panel scroll-mt-28" data-universe={info.universeId} style={{ order: (Object.keys(UNIVERSES).indexOf(info.universeId) + 1) * 100 }}>
      <h2>
        <button type="button" onClick={onToggle} aria-expanded={open} className={`flex w-full items-center gap-2 rounded-t-[10px] bg-gradient-to-b from-white/10 to-transparent px-4 py-2.5 text-left ${open ? 'border-b-2 border-black/60' : 'rounded-b-[10px]'}`}>
          <Icon className="size-6 shrink-0 text-[var(--accent-2)]" aria-hidden />
          <span className="title-display min-w-0 flex-1 truncate text-xl sm:text-2xl">{info.title}</span>
          <span className="shrink-0 text-sm text-[var(--muted)]">{info.count} missioni</span>
          <ChevronDown className={`size-5 shrink-0 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </h2>
      {open && <div className="p-4">{children}</div>}
    </section>
  );
}

/** Catalogo degli scenari dai moduli regole, con mappe e regole speciali dove trascritte. */
export function ScenariosPage() {
  const { universeId } = useScope();
  const [params] = useSearchParams();
  const [open, setOpen] = useState<string | null>(() => params.get('m'));
  // Arrivo da ricerca o link diretto (?m=id): apre la missione e la porta in vista.
  useEffect(() => {
    const id = params.get('m');
    if (!id) return;
    setOpen(id);
    const t = setTimeout(() => document.getElementById(`missione-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    return () => clearTimeout(t);
  }, [params]);
  const sessions = useLiveQuery(() => db.sessions.toArray());
  const show = !universeId || universeId === 'moderno';
  const series = MISSION_SERIES.filter((sr) => !sr.web && (!universeId || sr.universeId === universeId));
  const boxes: BoxInfo[] = [
    ...(show ? SHEET_CAMPAIGNS.map((sc) => ({ id: sc.templateId, title: `${sc.gameName} · ${sc.campaignName}`, universeId: 'moderno' as UniverseId, count: sc.missions.length, missionIds: sc.missions.map((m) => m.id) })) : []),
    ...(show ? [{ id: 'web', title: 'Missioni web · Zombicide 2ª edizione', universeId: 'moderno' as UniverseId, count: WEB_MISSIONS.length + WEB_PAGE_ONLY.length + AND_MISSIONS.length, missionIds: [...WEB_MISSIONS, ...WEB_PAGE_ONLY, ...AND_MISSIONS].map((m) => m.id) }] : []),
    ...series.map((sr) => ({ id: sr.templateId, title: `${sr.gameName} · Missioni`, universeId: sr.universeId, count: sr.missions.length, missionIds: sr.missions.map((m) => m.id) })),
  ];
  const linked = params.get('m');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(boxes.filter((b) => boxes.length === 1 || (linked && b.missionIds.includes(linked))).map((b) => b.id)));
  useEffect(() => {
    if (linked) { const b = boxes.find((x) => x.missionIds.includes(linked)); if (b) setExpanded((e) => new Set(e).add(b.id)); }
  }, [linked]); // eslint-disable-line react-hooks/exhaustive-deps
  const isOpen = (id: string) => expanded.has(id);
  const toggle = (id: string) => setExpanded((e) => { const n = new Set(e); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const jump = (id: string) => {
    setExpanded((e) => new Set(e).add(id));
    setTimeout(() => document.getElementById(`scatola-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const box = (id: string) => boxes.find((b) => b.id === id)!;
  const byUniverse = (Object.keys(UNIVERSES) as UniverseId[]).map((u) => ({ u, items: boxes.filter((b) => b.universeId === u) })).filter((g) => g.items.length);

  return (
    <div className="flex flex-col gap-5">
      {boxes.length > 1 && (
        <Panel title="Indice delle scatole" icon={ListTree} action={
          <span className="flex gap-1.5">
            <button type="button" className="btn px-2 py-1 text-xs" onClick={() => setExpanded(new Set(boxes.map((b) => b.id)))}><ChevronsUpDown className="size-4" /> Apri tutte</button>
            <button type="button" className="btn px-2 py-1 text-xs" onClick={() => setExpanded(new Set())}><ChevronsDownUp className="size-4" /> Chiudi tutte</button>
          </span>}>
          <div className="flex flex-col gap-2">
            {byUniverse.map(({ u, items }) => (
              <div key={u} data-universe={u} className="flex flex-wrap items-center gap-1.5">
                {!universeId && <span className="w-20 shrink-0 text-xs tracking-widest text-[var(--accent)] uppercase">{UNIVERSES[u].name}</span>}
                {items.map((b) => (
                  <button key={b.id} type="button" onClick={() => jump(b.id)} className={`btn px-2.5 py-1 text-sm ${isOpen(b.id) ? 'btn-accent' : ''}`}>
                    {b.title.replace(' · Missioni', '').replace(' · Zombicide 2ª edizione', '')} <span className="opacity-70">{b.count}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Panel>
      )}
      {show && SHEET_CAMPAIGNS.map((sc) => (
        <Box key={sc.templateId} info={box(sc.templateId)} open={isOpen(sc.templateId)} onToggle={() => toggle(sc.templateId)}>
          <p className="mb-3 text-sm text-[var(--muted)]">Campagna di {sc.missions.length} Missioni da giocare in ordine ({sc.rulebook}). Le carte Obiettivo e le Note restano nelle carte, da leggere solo quando le prendete.</p>
          <ol className="flex flex-col gap-2">
            {sc.missions.map((m) => {
              const own = (sessions ?? []).filter((s) => s.scenarioId === m.id);
              const wins = own.filter((s) => s.outcome === 'vittoria').length;
              const mOpen = open === m.id;
              return (
                <li key={m.id} id={`missione-${m.id}`} className="scroll-mt-28 rounded-lg border border-[var(--line)] bg-black/30">
                  <button type="button" onClick={() => setOpen(mOpen ? null : m.id)} aria-expanded={mOpen} className="flex w-full flex-wrap items-center gap-3 px-3 py-2 text-left">
                    <span className="title-display min-w-12 text-2xl text-[var(--accent-2)]">{m.code}</span>
                    <span className="min-w-40 flex-1 font-semibold">{m.title}</span>
                    <Badge tone={m.difficulty === 'Medio' ? 'neutral' : 'warn'}>{m.difficulty}</Badge>
                    <span className="text-xs text-[var(--muted)]">{m.duration}</span>
                    <span className="text-xs text-[var(--muted)]">{own.length ? `${own.length} partite · ${wins} vittorie` : 'mai giocata'}</span>
                    <ChevronDown className={`size-4 transition ${mOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mOpen && (
                    <div className="flex flex-col gap-2 border-t border-[var(--line)] px-3 py-3 text-sm">
                      <p className="flex flex-wrap items-center gap-2 text-[var(--muted)]"><Map className="size-4" /> Tessere: {m.tiles.join(', ')} · <PageLink productId={sc.productId} page={m.page} /></p>
                      <div>
                        <h4 className="font-semibold">Obiettivi {m.objectivesInOrder ? '(in questo ordine)' : '(in qualsiasi ordine)'}</h4>
                        <ol className="list-decimal pl-5">{m.objectives.map((o) => <li key={o}>{o}</li>)}</ol>
                      </div>
                      {m.campaignNotes && (
                        <ul className="rounded-md border border-amber-700 bg-amber-900/20 p-2 text-amber-200">
                          {m.campaignNotes.map((n) => <li key={n} className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{n}</li>)}
                        </ul>
                      )}
                      <HowToPlay m={m} />
                      <MissionMapView m={m} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Box>
      ))}

      {show && <Box info={box('web')} open={isOpen('web')} onToggle={() => toggle('web')} icon={Globe}><WebMissionsSection bare /></Box>}

      {series.map((sr) => (
        <Box key={sr.templateId} info={box(sr.templateId)} open={isOpen(sr.templateId)} onToggle={() => toggle(sr.templateId)}>
          <p className="mb-3 text-sm text-[var(--muted)]">{sr.missions.length} Missioni indipendenti, da giocare in qualsiasi ordine ({sr.source}).</p>
          <ol className="flex flex-col gap-2">
            {sr.missions.map((m) => {
              const own = (sessions ?? []).filter((s) => s.scenarioId === m.id);
              const mOpen = open === m.id;
              return (
                <li key={m.id} id={`missione-${m.id}`} className="scroll-mt-28 rounded-lg border border-[var(--line)] bg-black/30">
                  <button type="button" onClick={() => setOpen(mOpen ? null : m.id)} aria-expanded={mOpen} className="flex w-full flex-wrap items-center gap-3 px-3 py-2 text-left">
                    <span className="title-display min-w-12 text-2xl text-[var(--accent-2)]">{m.code}</span>
                    <span className="min-w-40 flex-1 font-semibold">{m.title}</span>
                    <Badge tone={m.difficulty === 'Facile' ? 'ok' : m.difficulty === 'Medio' || m.difficulty === 'Non indicata' ? 'neutral' : 'warn'}>{m.difficulty === 'Non indicata' ? 'Difficoltà non indicata' : m.difficulty}</Badge>
                    {m.duration !== 'Non indicata' && <span className="text-xs text-[var(--muted)]">{m.survivors ? `${m.survivors} · ` : ''}{m.duration}</span>}
                    <span className="text-xs text-[var(--muted)]">{own.length ? `${own.length} partite · ${own.filter((s) => s.outcome === 'vittoria').length} vittorie` : 'mai giocata'}</span>
                    <ChevronDown className={`size-4 transition ${mOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mOpen && (
                    <div className="flex flex-col gap-2 border-t border-[var(--line)] px-3 py-3 text-sm">
                      {m.tiles.length > 0 && <p className="flex flex-wrap items-center gap-2 text-[var(--muted)]"><Map className="size-4" /> Tessere: {m.tiles.join(', ')} · <PageLink productId={sr.productId} page={m.page} /></p>}
                      <div><h4 className="font-semibold">Obiettivi {m.objectivesInOrder ? '' : '(in qualsiasi ordine)'}</h4><ol className="list-decimal pl-5">{m.objectives.map((o) => <li key={o}>{o}</li>)}</ol></div>
                      <HowToPlay m={m} />
                      <MissionMapView m={m} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Box>
      ))}
      {!show && !MISSION_SERIES.some((sr) => sr.universeId === universeId) && (
        <EmptyState icon={Target} title={`Nessuno scenario ${UNIVERSES[universeId!].name} a catalogo`}>Gli scenari di questo universo arriveranno con i suoi regolamenti.</EmptyState>
      )}
    </div>
  );
}
