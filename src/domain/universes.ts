import type { UniverseId } from './types';

export interface UniverseInfo {
  id: UniverseId;
  name: string;
  subtitle: string;
  /** Nome dell'icona lucide usata come emblema. */
  icon: 'Crown' | 'Biohazard' | 'Star' | 'Zap';
}

export const UNIVERSES: Record<UniverseId, UniverseInfo> = {
  fantasy: { id: 'fantasy', name: 'Fantasy', subtitle: 'Black Plague e espansioni', icon: 'Crown' },
  moderno: { id: 'moderno', name: 'Moderno', subtitle: 'Zombicide e espansioni', icon: 'Biohazard' },
  western: { id: 'western', name: 'Western', subtitle: 'Undead or Alive e espansioni', icon: 'Star' },
  marvel: { id: 'marvel', name: 'Marvel', subtitle: 'Marvel Zombies e espansioni', icon: 'Zap' },
};

export function isUniverseId(value: string | undefined): value is UniverseId {
  return value === 'fantasy' || value === 'moderno' || value === 'western' || value === 'marvel';
}
