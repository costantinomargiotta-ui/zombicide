/**
 * Zombicide: Black Plague – Missioni del regolamento (ITA), pag. 38–50.
 * Il gioco base NON ha una modalità campagna: le 11 Missioni sono indipendenti,
 * l'esperienza non si conserva tra una partita e l'altra. L'app le raccoglie in una
 * "serie di missioni" solo per tenere traccia di cosa è stato giocato e vinto.
 */
export const BP_TEMPLATE_ID = 'black-plague-missioni';

export type BpDifficulty = 'Facile' | 'Medio' | 'Difficile';

export interface BpMission {
  id: string;
  code: string;
  title: string;
  difficulty: BpDifficulty;
  survivors: string;
  duration: string;
  page: number;
  tiles: string[];
  objectivesInOrder: boolean;
  objectives: string[];
}

const m = (n: number, title: string, difficulty: BpDifficulty, survivors: string, duration: string, page: number, tiles: string, inOrder: boolean, objectives: string[]): BpMission =>
  ({ id: `bp-m${n}`, code: `M${n}`, title, difficulty, survivors, duration, page, tiles: tiles.split(' '), objectivesInOrder: inOrder, objectives });

export const BP_MISSIONS: BpMission[] = [
  m(0, 'Danza macabra', 'Facile', '4+', '45 minuti', 38, '4V 9R', true, ['Usare il cerchio magico: raggiungere la Zona di Uscita con tutti i Sopravvissuti.']),
  m(1, 'Caccia grossa', 'Facile', '6+', '60 minuti', 40, '1V 2R 8V 9V', false, ['Uccidere almeno un Abominio e un Necromante.', 'Razziare il laboratorio: prendere tutti gli Obiettivi.']),
  m(2, 'Il Libro Nero', 'Facile', '6+', '60 minuti', 41, '4V 5R 7V 8R', false, ["Rubare il Libro Nero: prendere l'Obiettivo nell'edificio centrale (8R).", 'Prendere entrambi gli artefatti delle Cripte.', 'Arrivare al Livello di Pericolo Rosso con almeno un Sopravvissuto.']),
  m(3, 'I pastori', 'Medio', '6+', '90 minuti', 42, '1R 2R 3V 4V 5R 9V', true, ['Salvare i popolani: prendere tutti i segnalini Obiettivo.']),
  m(4, 'Carestia', 'Medio', '6', 'Variabile', 43, '1R 2R 3R 5R 6R 8R', true, ['Raccogliere Mele ×2, Carne Salata ×2 e Acqua ×2 nella squadra.', 'Chiudersi nella Cripta gialla con tutti i Sopravvissuti iniziali, senza Zombie.']),
  m(5, 'Sala delle guardie', 'Medio', '6+', '120 minuti', 44, '', true, ['Usare il passaggio segreto: raggiungere la Zona di Uscita con tutti i Sopravvissuti.']),
  m(6, 'In caligine abditus', 'Medio', '6+', '120 minuti', 45, '2R 3R 5R 6R 8R 9V', true, ['Raggiungere la Zona di Uscita con tutti i Sopravvissuti.']),
  m(7, 'La pista dei morti', 'Medio', '6+', '150 minuti', 46, '1R 2R 3V 4R 5V 6V', true, ['Prendere tutti i segnalini Obiettivo e entrambi gli artefatti delle Cripte (in qualsiasi ordine).', 'Poi raggiungere la Zona di Uscita con tutti i Sopravvissuti.']),
  m(8, 'Il tempio maledetto', 'Difficile', '6+', '120 minuti', 47, '1V 2R 4R 5R 8R 9V', false, ["Prendere entrambe le armi della Cripta e uccidere l'Abominio."]),
  m(9, 'La voragine infernale', 'Difficile', '6+', '150 minuti', 48, '1V 2R 6V 7R 8V 9R', true, ['Radunare tutte le Zone di Generazione nella Voragine Infernale (tessera 1V).', 'Creare un Fuoco di Drago nella Voragine Infernale.']),
  m(10, 'La prova del fuoco', 'Difficile', '6+', '180 minuti', 49, '1V 2R 3R 4V 5R 6R 7R 8V 9V', true, ["Uccidere l'Abominio collocato sulla tessera 1V."]),
].map((x) => ({ ...x, tiles: x.tiles.filter(Boolean) }));

export interface BpMissionState { mission: BpMission; wins: number; played: number }

/** Missioni indipendenti: nessun ordine obbligato, una Missione è «vinta» con almeno una vittoria. */
export function bpMissionStates(sessions: { scenarioId?: string; outcome: string }[]): BpMissionState[] {
  return BP_MISSIONS.map((mission) => {
    const own = sessions.filter((s) => s.scenarioId === mission.id && (s.outcome === 'vittoria' || s.outcome === 'sconfitta'));
    return { mission, wins: own.filter((s) => s.outcome === 'vittoria').length, played: own.length };
  });
}
