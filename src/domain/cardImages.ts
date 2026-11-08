/**
 * Illustrazioni delle carte fornite dall'utente (public/carte), usate quando non è stata
 * caricata una foto della carta dall'app. Una foto caricata ha sempre la precedenza.
 */
const AVAILABLE = new Set(['rio-asse-di-legno', 'rio-piede-di-porco', 'rio-ascia-antincendio', 'rio-38']);

export function defaultCardImageUrl(cardId?: string): string | undefined {
  return cardId && AVAILABLE.has(cardId) ? `/carte/${cardId}.webp` : undefined;
}
