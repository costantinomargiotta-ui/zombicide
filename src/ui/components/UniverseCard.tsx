import { Link } from 'react-router-dom';
import { Box, Layers } from 'lucide-react';
import { UNIVERSES } from '../../domain/universes';
import type { UniverseId } from '../../domain/types';
import type { ScopeStats } from '../../services/stats';
import { scopedPath } from '../../lib/scope';
import { ProgressBar } from './ProgressBar';
import { UniverseEmblem } from './UniverseEmblem';

/** Sagome decorative per l'identità visiva di ogni universo (nessuna grafica ufficiale). */
const silhouettes: Record<UniverseId, string> = {
  fantasy: 'M0 80 V52 h10 V40 l6-8 6 8 v12 h12 V30 l8-12 8 12 v22 h14 V44 h6 v-8 h4 v8 h6 v16 h18 V24 l10-14 10 14 v28 h16 V48 h20 v32 Z',
  moderno: 'M0 80 V46 h14 V30 h16 v16 h8 V14 h18 v32 h10 V36 h12 v-8 h10 v18 h14 V22 h16 v24 h10 V40 h12 v40 Z',
  western: 'M0 80 V60 h16 V48 l14-8 14 8 v12 h10 V54 h4 V36 l3-4 3 4 v18 h4 v6 h22 V46 h24 v14 h10 l8-10 8 10 v20 Z',
  marvel: 'M0 80 V40 h10 V20 h10 v20 h8 V8 h12 v32 h10 V28 h14 v12 h8 V16 l6-10 6 10 v24 h12 V30 h14 v50 Z',
};

export function UniverseCard({ id, stats }: { id: UniverseId; stats?: ScopeStats }) {
  const u = UNIVERSES[id];
  const active = stats?.activeCampaigns.length ?? 0;
  return (
    <Link
      to={scopedPath(id)}
      data-universe={id}
      className="panel group focus-ring relative flex min-h-64 flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_28px_var(--glow)]"
      style={{ borderColor: 'color-mix(in srgb, var(--accent) 60%, #000)' }}
    >
      <div className="absolute inset-0" style={{ background: 'var(--scene), linear-gradient(180deg, color-mix(in srgb, var(--accent) 35%, #000) 0%, #0b0b0d 85%)' }} aria-hidden />
      <UniverseEmblem id={id} className="absolute -top-4 -right-4 size-40 rotate-12 text-[var(--accent)] opacity-20 transition duration-500 group-hover:rotate-0 group-hover:opacity-30" />
      <svg viewBox="0 0 160 80" preserveAspectRatio="none" className="absolute inset-x-0 top-16 h-28 w-full text-black/70" aria-hidden>
        <path d={silhouettes[id]} fill="currentColor" />
      </svg>

      <div className="relative mt-auto flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-lg border border-[var(--accent)] bg-black/60 text-[var(--accent)]">
            <UniverseEmblem id={id} className="size-6" />
          </span>
          <div>
            <h3 className="title-display text-3xl leading-none">{u.name}</h3>
            <p className="text-xs text-[var(--muted)]">{u.subtitle}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-1 text-sm">
          <li className="flex items-center gap-2">
            <Box className="size-4 text-[var(--accent-2)]" aria-hidden />
            {stats ? `${stats.ownedProducts} di ${stats.catalogProducts} prodotti posseduti` : '…'}
          </li>
          <li className="flex items-center gap-2">
            <Layers className="size-4 text-[var(--accent-2)]" aria-hidden />
            {active === 1 ? '1 campagna attiva' : `${active} campagne attive`}
          </li>
        </ul>
        <ProgressBar value={stats?.averageCompletion ?? null} label={`Completamento campagne ${u.name}`} />
      </div>
    </Link>
  );
}
