import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { CampaignProgress } from '../../services/stats';
import { CAMPAIGN_STATUS_LABEL } from '../../domain/types';
import { UNIVERSES } from '../../domain/universes';
import { formatPercent } from '../../lib/format';
import { Badge } from './Badge';
import { StoredImage } from './StoredImage';

/** Riga campagna come nel mockup: miniatura, nome, stato, scenari con barra, percentuale, «Apri». */
export function CampaignRow({ progress, productName }: { progress: CampaignProgress; productName?: string }) {
  const { campaign: c, completedScenarios, ratio } = progress;
  const statusCls = c.status === 'in-corso' ? 'bg-[#57c02a] text-black border-green-900' : c.status === 'completata' ? 'bg-[#2f8fd8] text-white border-blue-900' : 'bg-white/15 text-white border-white/20';
  return (
    <div className="grid grid-cols-[88px_1fr_auto] items-center gap-3 border-b border-white/10 py-2 last:border-0 sm:grid-cols-[132px_1.3fr_auto_1.2fr_auto_auto]">
      <Link to={`/campagne/${c.id}`} className="block h-12 overflow-hidden rounded-md border border-white/20">
        <StoredImage imageId={c.coverImageId} alt="" className="size-full object-cover" fallback={<img src={`/ui/miniatura-${c.universeId}.webp`} alt="" className="size-full object-cover" />} />
      </Link>
      <div className="min-w-0 leading-tight">
        <div className="flex items-center gap-1.5"><span className="truncate text-lg font-semibold">{c.name}</span>{c.origin === 'demo' && <Badge tone="demo">DEMO</Badge>}</div>
        <div className="truncate text-sm text-[var(--muted)]">({productName ?? UNIVERSES[c.universeId].name})</div>
      </div>
      <span className={`hidden rounded-md border-2 px-3 py-1 text-sm font-semibold sm:inline ${statusCls}`}>{CAMPAIGN_STATUS_LABEL[c.status]}</span>
      <div className="hidden flex-col gap-1 sm:flex">
        <span className="text-sm">Scenari: {completedScenarios}{c.plannedScenarioCount ? ` / ${c.plannedScenarioCount}` : ''}</span>
        <div className="h-2.5 overflow-hidden rounded-full bg-black/60"><div className="h-full rounded-full bg-[#57c02a]" style={{ width: `${(ratio ?? 0) * 100}%` }} /></div>
      </div>
      <span className="hidden w-12 text-right text-lg font-bold sm:block">{ratio === null ? '–' : formatPercent(ratio)}</span>
      <Link to={`/campagne/${c.id}`} className="flex items-center gap-1 rounded-md border-2 border-[#8a4a00] bg-gradient-to-b from-[#ffb21e] to-[#e88a00] px-3 py-1 font-semibold text-black shadow hover:brightness-110">
        <Play className="size-4 fill-black" /> Apri
      </Link>
    </div>
  );
}
