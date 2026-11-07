import { Biohazard, Crown, Star, Zap, type LucideIcon } from 'lucide-react';
import { UNIVERSES } from '../../domain/universes';
import type { UniverseId } from '../../domain/types';

const icons: Record<string, LucideIcon> = { Crown, Biohazard, Star, Zap };

export const universeIcon = (id: UniverseId): LucideIcon => icons[UNIVERSES[id].icon];

export function UniverseEmblem({ id, className = 'size-6' }: { id: UniverseId; className?: string }) {
  const Icon = universeIcon(id);
  return <Icon className={className} aria-hidden />;
}
