/**
 * Illustrazioni delle carte fornite dall'utente (public/carte), usate quando non è stata
 * caricata una foto della carta dall'app. Una foto caricata ha sempre la precedenza.
 * Delle Armi Pimpate e dell'Equipaggiamento Avanzato si usa solo l'illustrazione: i valori stampati nell'immagine fornita
 * non coincidono tutti con le carte reali, quindi sono stati tagliati via.
 */
const AVAILABLE = new Set([
  'rio-asse-di-legno', 'rio-piede-di-porco', 'rio-ascia-antincendio', 'rio-38',
  'rio-kukri-dorato', 'rio-colt-ar-15', 'rio-amor-de-mae', 'rio-rpg', 'rio-gemelle-malvagie',
  'rio-fucile-da-cecchino-dell-esercito', 'rio-katana-pregiata', 'rio-ak-47-dorato', 'rio-shotgun-automatico', 'rio-aaahh-pimpata',
  ...['tubo-di-ferro', 'te-mate', 'molotov', 'cartucce-a-volonta', 'proiettili-a-volonta', '38', 'aaahh', 'biscoito-plano',
    'katana', 'machete', 'munizione-rpg', 'motosega', 'piede-di-porco', 'kukri', 'canne-mozze', 'lama-di-fortuna',
    'shotgun', 'fucile-da-cecchino', 'sub-mg', 'opala-78'].map((n) => `rio-av-${n}`),
]);

export function defaultCardImageUrl(cardId?: string): string | undefined {
  return cardId && AVAILABLE.has(cardId) ? `/carte/${cardId}.webp` : undefined;
}
