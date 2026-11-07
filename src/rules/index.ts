import type { UniverseId } from '../domain/types';
import type { UniverseRules } from './types';
import { fantasyRules } from './fantasy';
import { modernRules } from './modern';
import { westernRules } from './western';
import { marvelRules } from './marvel';

const registry: Record<UniverseId, UniverseRules> = {
  fantasy: fantasyRules,
  moderno: modernRules,
  western: westernRules,
  marvel: marvelRules,
};

export function rulesFor(universeId: UniverseId): UniverseRules {
  return registry[universeId];
}

export * from './types';
export * from './progression';
