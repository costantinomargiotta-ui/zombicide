import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, ChevronDown, Map, Maximize2, ScrollText, Target } from 'lucide-react';
import { db } from '../data/db';
import { SHEET_CAMPAIGNS } from '../rules/moderno/sheetCampaigns';
import { MISSION_SERIES } from '../rules/missionSeries';
import { UNIVERSES } from '../domain/universes';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { Modal } from '../ui/components/Modal';
import { MISSION_EXTRAS } from '../rules/moderno/missionMaps';

/** Mappa della Missione (dal regolamento), legenda e regole speciali. */
function MissionMapView({ m }: { m: { id: string; code: string; title: string } }) {
  const [zoom, setZoom] = useState(false);
  const extra = MISSION_EXTRAS[m.id];
  if (!extra) return null;
  const map = { image: extra.image, elements: extra.elements };
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,420px)_1fr]">
      {(
        <button type="button" onClick={() => setZoom(true)} className="focus-ring group relative overflow-hidden rounded-lg border-2 border-[#d9a521] bg-white" aria-label={`Ingrandisci la mappa di ${m.code}`}>
          <img src={map.image} alt={`Mappa della Missione ${m.code} – ${m.title}`} className="block h-auto w-full" loading="lazy" />
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs text-white"><Maximize2 className="size-3" /> Ingrandisci</span>
        </button>
      )}
      <div className="flex flex-col gap-3">
        <div>
          <h4 className="mb-1 font-semibold">Elementi della mappa</h4>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {map.elements.map((e) => (
              <li key={e.label} className="flex items-center gap-2 rounded border border-[var(--line)] bg-white/95 px-2 py-1 text-black">
                <span className="grid h-11 w-16 shrink-0 place-items-center">{e.icon && <img src={e.icon} alt="" className="max-h-11 max-w-16 object-contain" loading="lazy" />}</span>
                <span className="flex-1 leading-tight font-medium">{e.label}</span>
                {e.count && <span className="text-lg font-bold">{e.count}×</span>}
              </li>
            ))}
          </ul>
        </div>
        {extra.specialRules.length > 0 && (
          <div>
            <h4 className="mb-1 flex items-center gap-1 font-semibold"><ScrollText className="size-4" /> Regole speciali</h4>
            <ul className="flex flex-col gap-1.5">
              {extra.specialRules.map((r) => {
                const cut = r.search(/[.!?](\s|$)/);
                const title = cut > 0 ? r.slice(0, cut + 1) : r;
                return <li key={r} className="whitespace-pre-line"><strong>{title}</strong>{r.slice(title.length)}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
      {zoom && (
        <Modal open onClose={() => setZoom(false)} title={`${m.code} – ${m.title}`}>
          <img src={map.image} alt={`Mappa della Missione ${m.code}`} className="mx-auto block h-auto max-h-[80vh] w-auto bg-white" />
        </Modal>
      )}
    </div>
  );
}

/** Catalogo degli scenari disponibili dai moduli regole. Oggi: le 10 Missioni di Rio Z Janeiro. */
export function ScenariosPage() {
  const { universeId } = useScope();
  const [open, setOpen] = useState<string | null>(null);
  const sessions = useLiveQuery(() => db.sessions.toArray());
  const show = !universeId || universeId === 'moderno';

  return (
    <div className="flex flex-col gap-5">
      {show && SHEET_CAMPAIGNS.map((sc) => (
        <Panel key={sc.templateId} title={`${sc.gameName} · ${sc.campaignName}`} icon={Target}>
          <p className="mb-3 text-sm text-[var(--muted)]">Campagna di {sc.missions.length} Missioni da giocare in ordine ({sc.rulebook}). Mappe, carte Obiettivo e Note restano sul libretto e nelle carte: qui trovi il riepilogo.</p>
          <ol className="flex flex-col gap-2">
            {sc.missions.map((m) => {
              const own = (sessions ?? []).filter((s) => s.scenarioId === m.id);
              const wins = own.filter((s) => s.outcome === 'vittoria').length;
              const isOpen = open === m.id;
              return (
                <li key={m.id} className="rounded-lg border border-[var(--line)] bg-black/30">
                  <button type="button" onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen} className="flex w-full flex-wrap items-center gap-3 px-3 py-2 text-left">
                    <span className="title-display w-12 text-2xl text-[var(--accent-2)]">{m.code}</span>
                    <span className="min-w-40 flex-1 font-semibold">{m.title}</span>
                    <Badge tone={m.difficulty === 'Medio' ? 'neutral' : 'warn'}>{m.difficulty}</Badge>
                    <span className="text-xs text-[var(--muted)]">{m.duration}</span>
                    <span className="text-xs text-[var(--muted)]">{own.length ? `${own.length} partite · ${wins} vittorie` : 'mai giocata'}</span>
                    <ChevronDown className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-2 border-t border-[var(--line)] px-3 py-3 text-sm">
                      <p className="flex items-center gap-2 text-[var(--muted)]"><Map className="size-4" /> Tessere: {m.tiles.join(', ')} · pag. {m.page}</p>
                      <div>
                        <h4 className="font-semibold">Obiettivi {m.objectivesInOrder ? '(in questo ordine)' : '(in qualsiasi ordine)'}</h4>
                        <ol className="list-decimal pl-5">{m.objectives.map((o) => <li key={o}>{o}</li>)}</ol>
                      </div>
                      {m.campaignNotes && (
                        <ul className="rounded-md border border-amber-700 bg-amber-900/20 p-2 text-amber-200">
                          {m.campaignNotes.map((n) => <li key={n} className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{n}</li>)}
                        </ul>
                      )}
                      <MissionMapView m={m} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>
      ))}

      {MISSION_SERIES.filter((sr) => !universeId || sr.universeId === universeId).map((sr) => (
        <Panel key={sr.templateId} title={`${sr.gameName} · Missioni`} icon={Target}>
          <p className="mb-3 text-sm text-[var(--muted)]">{sr.missions.length} Missioni indipendenti, da giocare in qualsiasi ordine ({sr.source}).</p>
          <ol className="flex flex-col gap-2">
            {sr.missions.map((m) => {
              const own = (sessions ?? []).filter((s) => s.scenarioId === m.id);
              const isOpen = open === m.id;
              return (
                <li key={m.id} className="rounded-lg border border-[var(--line)] bg-black/30">
                  <button type="button" onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen} className="flex w-full flex-wrap items-center gap-3 px-3 py-2 text-left">
                    <span className="title-display w-12 text-2xl text-[var(--accent-2)]">{m.code}</span>
                    <span className="min-w-40 flex-1 font-semibold">{m.title}</span>
                    <Badge tone={m.difficulty === 'Facile' ? 'ok' : m.difficulty === 'Medio' ? 'neutral' : 'warn'}>{m.difficulty}</Badge>
                    <span className="text-xs text-[var(--muted)]">{m.survivors ? `${m.survivors} · ` : ''}{m.duration}</span>
                    <span className="text-xs text-[var(--muted)]">{own.length ? `${own.length} partite · ${own.filter((s) => s.outcome === 'vittoria').length} vittorie` : 'mai giocata'}</span>
                    <ChevronDown className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-2 border-t border-[var(--line)] px-3 py-3 text-sm">
                      {m.tiles.length > 0 && <p className="flex items-center gap-2 text-[var(--muted)]"><Map className="size-4" /> Tessere: {m.tiles.join(', ')} · pag. {m.page}</p>}
                      <div><h4 className="font-semibold">Obiettivi {m.objectivesInOrder ? '' : '(in qualsiasi ordine)'}</h4><ol className="list-decimal pl-5">{m.objectives.map((o) => <li key={o}>{o}</li>)}</ol></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>
      ))}
      {!show && !MISSION_SERIES.some((sr) => sr.universeId === universeId) && (
        <EmptyState icon={Target} title={`Nessuno scenario ${UNIVERSES[universeId!].name} a catalogo`}>Gli scenari di questo universo arriveranno con i suoi regolamenti.</EmptyState>
      )}
    </div>
  );
}
