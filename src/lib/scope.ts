import { useParams } from 'react-router-dom';
import { isUniverseId } from '../domain/universes';
import type { UniverseId } from '../domain/types';

/** Percorso relativo all'ambito: globale ("/x") o universo ("/u/fantasy/x"). */
export function scopedPath(universeId: UniverseId | undefined, sub = ''): string {
  const base = universeId ? `/u/${universeId}` : '';
  const tail = sub ? `/${sub.replace(/^\//, '')}` : '';
  return base + tail || '/';
}

export function useScope() {
  const { universeId } = useParams();
  const scope = isUniverseId(universeId) ? universeId : undefined;
  return { universeId: scope, path: (sub = '') => scopedPath(scope, sub) };
}
