import { useState } from 'react';
import { AlertTriangle, BookOpen, ChevronDown, Maximize2, ScrollText } from 'lucide-react';
import { Modal } from '../ui/components/Modal';
import { ALL_MISSION_EXTRAS as MISSION_EXTRAS } from '../rules/missionExtras';
import { missionGuide, type GuideMission } from '../services/missionGuide';

/** «Come si gioca»: obiettivi e regole della Missione riscritti in passi, avvisi e consigli. */
export function HowToPlay({ m, source }: { m: GuideMission & { id: string }; source?: string }) {
  const g = missionGuide(m, MISSION_EXTRAS[m.id]);
  return (
    <details className="rounded-lg border border-[#d9a521]/60 bg-[#d9a521]/5 open:bg-[#d9a521]/10">
      <summary className="cursor-pointer list-none px-3 py-2 font-semibold text-[var(--accent-2)] [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2"><BookOpen className="size-4" /> Come si gioca <ChevronDown className="ml-auto size-4" /></span>
      </summary>
      <div className="flex flex-col gap-3 px-3 pb-3 text-sm">
        <p>{g.summary}</p>
        <div>
          <h4 className="font-semibold">Cosa dovete fare</h4>
          <ol className="mt-1 flex flex-col gap-1.5">
            {g.steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-2)] text-xs font-bold text-black">{m.objectivesInOrder || g.steps.length === 1 ? i + 1 : '•'}</span>
                <span><strong>{s.title}{/[!?]$/.test(s.title) ? '' : '.'}</strong>{s.detail ? ` ${s.detail}` : ''}</span>
              </li>
            ))}
          </ol>
        </div>
        {g.setup.length > 0 && (
          <div>
            <h4 className="font-semibold">Prima di iniziare</h4>
            <ul className="mt-1 flex flex-col gap-1">{g.setup.map((x) => <li key={x} className="whitespace-pre-line">{x}</li>)}</ul>
          </div>
        )}
        {g.watchOut.length > 0 && (
          <div className="rounded-md border border-red-800 bg-red-900/20 p-2">
            <h4 className="flex items-center gap-1 font-semibold text-red-200"><AlertTriangle className="size-4" /> Attenzione</h4>
            <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">{g.watchOut.map((x) => <li key={x} className="whitespace-pre-line">{x}</li>)}</ul>
          </div>
        )}
        {g.tips.length > 0 && (
          <div>
            <h4 className="font-semibold">Consigli</h4>
            <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">{g.tips.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        )}
        {g.materials.length > 0 && <p className="text-xs text-[var(--muted)]">Da preparare: {g.materials.join(' · ')}.</p>}
        <p className="text-xs text-[var(--muted)]">{source ?? `Ricavato dagli obiettivi e dalle regole speciali del regolamento: in caso di dubbio fa fede il libretto (pag. ${(m as { page?: number }).page ?? '–'}).`}</p>
      </div>
    </details>
  );
}

/** Mappa della Missione (dal regolamento), legenda e regole speciali. */
export function MissionMapView({ m }: { m: { id: string; code: string; title: string } }) {
  const [zoom, setZoom] = useState(false);
  const extra = MISSION_EXTRAS[m.id];
  if (!extra) return null;
  const map = { image: extra.image, elements: extra.elements };
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,420px)_1fr]">
      {(
        <button type="button" onClick={() => setZoom(true)} className="focus-ring group relative self-start overflow-hidden rounded-lg border-2 border-[#d9a521] bg-white" aria-label={`Ingrandisci la mappa di ${m.code}`}>
          <img src={map.image} alt={`Mappa della Missione ${m.code} – ${m.title}`} className="block h-auto w-full" loading="lazy" />
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs text-white"><Maximize2 className="size-3" /> Ingrandisci</span>
        </button>
      )}
      <div className="flex flex-col gap-3">
        <div>
          <h4 className="mb-1 font-semibold">Elementi della mappa</h4>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {map.elements.map((e, i) => (
              <li key={`${e.label}-${i}`} className="flex items-center gap-2 rounded border border-[var(--line)] bg-white/95 px-2 py-1 text-black">
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
                const cut = r.search(/[.!?](\s|$)|:\n/);
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

