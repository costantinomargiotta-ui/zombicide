import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { UNIVERSES } from '../../domain/universes';
import type { UniverseId } from '../../domain/types';
import type { ScopeStats } from '../../services/stats';
import { scopedPath } from '../../lib/scope';
import { formatPercent } from '../../lib/format';

/** Stile delle card universo come nel mockup: illustrazione in alto, fascia colorata con dati reali. */
const STYLE: Record<UniverseId, { border: string; band: string; bar: string }> = {
  fantasy: { border: '#b06cf0', band: 'linear-gradient(180deg,#4a1a70,#24093a)', bar: '#f5c518' },
  moderno: { border: '#8fd12a', band: 'linear-gradient(180deg,#2c6410,#112a06)', bar: '#57c02a' },
  western: { border: '#f08a2c', band: 'linear-gradient(180deg,#7a3410,#341405)', bar: '#f5a218' },
  marvel: { border: '#3b9cf0', band: 'linear-gradient(180deg,#123c74,#071a36)', bar: '#2f8fd8' },
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
      <div className="flex flex-col gap-1.5 px-3 pt-2 pb-3" style={{ background: st.band }}>
        <div className="flex items-center gap-2">
          <img src={`/ui/icona-${id}.webp`} alt="" className="size-10 shrink-0 object-contain" />
          <div className="min-w-0 leading-tight">
            <h3 className="text-2xl font-semibold text-white">{u.name}</h3>
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
