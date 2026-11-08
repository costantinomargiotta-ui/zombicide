/**
 * Copertine frontali dei giochi (public/scatole), da BoardGameGeek, su richiesta dell'utente,
 * per uso personale. No Rest for the Wicked: copertina dell'edizione italiana.
 * Una copertina caricata dall'app ha la precedenza.
 */
const AVAILABLE = new Set([
  'zombicide-1e',
  'black-plague', 'green-horde', 'wulfsburg', 'friends-and-foes', 'no-rest-for-the-wicked', 'white-death',
  'zombicide-2e', 'washington-zc', 'fort-hendrix', 'rio-z-janeiro',
  'undead-or-alive', 'gears-and-guns', 'running-wild',
  'marvel-zombies', 'x-men-resistance', 'fantastic-4-under-siege', 'clash-of-the-sinister-six', 'hydra-resurrection',
]);

export function defaultBoxImageUrl(productId?: string): string | undefined {
  return productId && AVAILABLE.has(productId) ? `/scatole/${productId}.webp` : undefined;
}
