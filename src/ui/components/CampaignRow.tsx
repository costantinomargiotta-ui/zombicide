import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { CampaignProgress } from '../../services/stats';
import { CAMPAIGN_STATUS_LABEL } from '../../domain/types';
import { UNIVERSES } from '../../domain/universes';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import { StoredImage } from './StoredImage';
import { UniverseEmblem } from './UniverseEmblem';

export function CampaignRow({ progress, productName }: { progress: CampaignProgress; productName?: string }) {
  const { campaign: c, completedScenarios, ratio } = progress;
  const statusTone = c.status === 'in-corso' ? 'ok' : c.status === 'completata' ? 'accent' : 'neutral';
  return (
    <Link
      to={`/campagne/${c.id}`}
      data-universe={c.universeId}
      className="focus-ring grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-lg border border-[var(--line)] bg-black/30 p-2 transition hover:border-[var(--accent)] sm:grid-cols-[88px_1.3fr_1fr_auto]"
    >
      <div className="grid h-12 place-items-center overflow-hidden rounded-md bg-[var(--accent)]/20 text-[var(--accent)] sm:h-14">
        <StoredImage imageId={c.coverImageId} alt="" className="size-full object-cover" fallback={<UniverseEmblem id={c.universeId} className="size-7" />} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-semibold">{c.name}</span>
          {c.origin === 'demo' && <Badge tone="demo">DEMO</Badge>}
        </div>
        <div className="truncate text-xs text-[var(--muted)]">
          {productName ?? c.productId} · {UNIVERSES[c.universeId].name}
        </div>
        <div className="mt-1 sm:hidden"><ProgressBar value={ratio} /></div>
      </div>
      <div className="hidden flex-col gap-1 sm:flex">
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Scenari: {completedScenarios}{c.plannedScenarioCount ? ` / ${c.plannedScenarioCount}` : ''}</span>
          <Badge tone={statusTone}>{CAMPAIGN_STATUS_LABEL[c.status]}</Badge>
        </div>
        <ProgressBar value={ratio} />
      </div>
      <ChevronRight className="size-5 text-[var(--muted)]" aria-hidden />
    </Link>
  );
}
