import type { DangerLevel, ProgressionTrack } from './types';

/** Livello di pericolo raggiunto con un certo numero di PE. */
export function dangerLevelFor(track: ProgressionTrack, xp: number): DangerLevel {
  const clamped = Math.max(0, Math.min(xp, track.maxXp));
  let current = track.levels[0];
  for (const level of track.levels) {
    if (clamped >= level.minXp) current = level;
  }
  return current;
}

/** PE mancanti al livello successivo, o null se è già il massimo. */
export function xpToNextLevel(track: ProgressionTrack, xp: number): number | null {
  const next = track.levels.find((l) => l.minXp > xp);
  return next ? next.minXp - xp : null;
}
