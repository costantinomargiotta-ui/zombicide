import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { UNIVERSES } from '../../domain/universes';
import type { UniverseId } from '../../domain/types';
import type { ScopeStats } from '../../services/stats';
import { scopedPath } from '../../lib/scope';
import { formatPercent } from '../../lib/format';

/** Stile delle card universo come nel mockup: illustrazione in alto, fascia colorata con dati reali. */
const STYLE: Record<UniverseId, { border: string; band: string; bar: string; solid: string }> = {
  fantasy: { border: '#b06cf0', band: '', bar: '#f5c518', solid: '#3a1358' },
  moderno: { border: '#8fd12a', band: '', bar: '#57c02a', solid: '#1f4a0c' },
  western: { border: '#f08a2c', band: '', bar: '#f5a218', solid: '#5a250a' },
  marvel: { border: '#3b9cf0', band: '', bar: '#2f8fd8', solid: '#0d2d58' },
};

export function UniverseCard({ id, stats }: { id: UniverseId; stats?: ScopeStats }) {
  const u = UNIVERSES[id];
  const st = STYLE[id];
  const active = stats?.activeCampaigns.length ?? 0;
  const ratio = stats?.averageCompletion ?? null;
  return (
    <Link to={scopedPath(id)} className="group focus-ring flex flex-col overflow-hidden rounded-xl border-[3px] shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1 hover:brightness-110"
      style={{ borderColor: st.border, boxShadow: `0 0 18px ${st.border}55` }}>
      <img src={`/ui/universo-${id}.webp`} alt="" className="block aspect-[5/3] w-full object-cover" />
      <div className="relative -mt-12 flex flex-col gap-1.5 px-3 pt-8 pb-3" style={{ background: `linear-gradient(180deg, transparent 0, ${st.solid}cc 36px, ${st.solid} 64px)` }}>
        <div className="flex items-center gap-2">
          <img src={`/ui/icona-${id}.webp`} alt="" className="size-10 shrink-0 object-contain" />
          <div className="min-w-0 leading-tight">
            <h3 className="text-2xl font-semibold text-white [text-shadow:0_2px_3px_#000]">{u.name}</h3>
            <p className="truncate text-xs text-white/80">({u.subtitle})</p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm text-white"><Layers className="size-4" aria-hidden />{active === 1 ? '1 campagna attiva' : `${active} campagne attive`}</p>
        <div className="flex items-center gap-2">
          <div className="h-3.5 flex-1 overflow-hidden rounded-full border border-black/60 bg-black/60" role="progressbar" aria-label={`Completamento campagne ${u.name}`} aria-valuenow={ratio === null ? undefined : Math.round(ratio * 100)}>
            <div className="h-full rounded-full" style={{ width: `${(ratio ?? 0) * 100}%`, background: st.bar }} />
          </div>
          <span className={ratio === null ? 'text-xs text-white/70 italic' : 'text-xl font-bold text-white'}>{ratio === null ? 'n.d.' : formatPercent(ratio)}</span>
        </div>
      </div>
    </Link>
  );
}
