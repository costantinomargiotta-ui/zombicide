/**
 * Ritratti illustrati forniti dall'utente (public/ritratti), usati quando non è stato
 * caricato un ritratto personale. Un ritratto caricato dall'app ha sempre la precedenza.
 */
const AVAILABLE = new Set([
  'ney', 'eliete', 'vivi', 'steven', 'mc-jordim', 'dona-cacilda', 'odin', 'amy', 'elle', 'ostara', 'angelo', 'tiger-sam',
  'lou', 'ashley', 'ned', 'doug', 'justin', 'josh', 'bunny-g', 'mindy', 'wanda', 'lili', 'tess', 'anton',
].map((n) => `moderno-${n}`).concat(['ann', 'clovis', 'silas', 'samson', 'nelly', 'baldric', 'lion-o', 'slithe', 'cheetara', 'snarf'].map((n) => `fantasy-${n}`)));

export function defaultPortraitUrl(characterId?: string): string | undefined {
  return characterId && AVAILABLE.has(characterId) ? `/ritratti/${characterId}.webp` : undefined;
}
