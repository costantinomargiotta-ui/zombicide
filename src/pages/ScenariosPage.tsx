import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, ChevronDown, Map, Target } from 'lucide-react';
import { db } from '../data/db';
import { RIO_MISSIONS } from '../rules/moderno/rioZJaneiro';
import { UNIVERSES } from '../domain/universes';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';

/** Catalogo degli scenari disponibili dai moduli regole. Oggi: le 10 Missioni di Rio Z Janeiro. */
export function ScenariosPage() {
  const { universeId } = useScope();
  const [open, setOpen] = useState<string | null>(null);
  const sessions = useLiveQuery(() => db.sessions.toArray());
  const show = !universeId || universeId === 'moderno';

  return (
    <div className="flex flex-col gap-5">
      {show ? (
        <Panel title="Rio Z Janeiro · Carnevale dei Morti" icon={Target}>
          <p className="mb-3 text-sm text-[var(--muted)]">10 Missioni da giocare in ordine (Rio Z Janeiro – Regole e Missioni, pag. 15–26). Mappe, carte Obiettivo e Note restano sul libretto e nelle carte: qui trovi il riepilogo.</p>
          <ol className="flex flex-col gap-2">
            {RIO_MISSIONS.map((m) => {
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
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>
      ) : (
        <EmptyState icon={Target} title={`Nessuno scenario ${UNIVERSES[universeId!].name} a catalogo`}>Gli scenari di questo universo arriveranno con i suoi regolamenti.</EmptyState>
      )}
    </div>
  );
}
