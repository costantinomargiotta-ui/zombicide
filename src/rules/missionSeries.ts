/**
 * Serie di missioni indipendenti, senza progressione persistente (es. Black Plague e
 * Zombicide 2ª edizione, giochi base). L'app tiene traccia di cosa è stato giocato e vinto.
 */
import type { UniverseId } from '../domain/types';
import { BP_MISSIONS, BP_TEMPLATE_ID } from './fantasy/blackPlague';
import { Z2_MISSIONS, Z2_TEMPLATE_ID } from './moderno/zombicide2e';
import { WU_MISSIONS, WU_TEMPLATE_ID } from './fantasy/wulfsburg';
import { GH_MISSIONS, GH_TEMPLATE_ID } from './fantasy/greenHorde';
import { WD_MISSIONS, WD_TEMPLATE_ID } from './fantasy/whiteDeath';
import { MZ_MISSIONS, MZ_TEMPLATE_ID } from './marvel/marvelZombies';
import { XM_MISSIONS, XM_TEMPLATE_ID } from './marvel/xmenResistance';
import { HR_MISSIONS, HR_TEMPLATE_ID } from './marvel/heroesResistance';
import { UO_MISSIONS, UO_TEMPLATE_ID } from './western/undeadOrAlive';

export interface SeriesMission {
  id: string;
  code: string;
  title: string;
  difficulty: string;
  survivors?: string;
  duration: string;
  page: number;
  tiles: string[];
  objectivesInOrder: boolean;
  objectives: string[];
}

export interface MissionSeries {
  templateId: string;
  universeId: UniverseId;
  productId: string;
  gameName: string;
  source: string;
  image: string;
  /** Colore delle missioni vinte (barra e tessere). */
  color: string;
  difficulties: string[];
  missions: SeriesMission[];
}

export const MISSION_SERIES: MissionSeries[] = [
  { templateId: BP_TEMPLATE_ID, universeId: 'fantasy', productId: 'black-plague', gameName: 'Black Plague', source: 'Black Plague – Regole e Missioni, pag. 38–50', image: '/ui/universo-fantasy.webp', color: '#9b4de0', difficulties: ['Facile', 'Medio', 'Difficile'], missions: BP_MISSIONS },
  { templateId: WU_TEMPLATE_ID, universeId: 'fantasy', productId: 'wulfsburg', gameName: 'Wulfsburg', source: 'Wulfsburg – Missioni aggiuntive, pag. 11–23', image: '/ui/universo-fantasy.webp', color: '#2a9d8f', difficulties: ['Facile', 'Medio', 'Difficile'], missions: WU_MISSIONS },
  { templateId: GH_TEMPLATE_ID, universeId: 'fantasy', productId: 'green-horde', gameName: 'Green Horde', source: 'Green Horde – Regolamento, pag. 40–53', image: '/ui/universo-fantasy.webp', color: '#65a30d', difficulties: ['Facile', 'Medio', 'Difficile'], missions: GH_MISSIONS },
  { templateId: WD_TEMPLATE_ID, universeId: 'fantasy', productId: 'white-death', gameName: 'White Death', source: 'White Death – Regolamento, pag. 40–50', image: '/ui/universo-fantasy.webp', color: '#7dd3fc', difficulties: ['Facile', 'Medio', 'Difficile'], missions: WD_MISSIONS },
  { templateId: Z2_TEMPLATE_ID, universeId: 'moderno', productId: 'zombicide-2e', gameName: 'Zombicide 2ª edizione', source: 'Zombicide 2ª edizione – Regole e Missioni, pag. 36–62', image: '/ui/universo-moderno.webp', color: '#57c02a', difficulties: ['Facile', 'Medio', 'Difficile'], missions: Z2_MISSIONS },
  { templateId: MZ_TEMPLATE_ID, universeId: 'marvel', productId: 'marvel-zombies', gameName: 'Marvel Zombies', source: 'Marvel Zombies – Regolamento, pag. 23–42 (MZ: Modalità Zombie, MH: Modalità Eroe)', image: '/ui/universo-marvel.webp', color: '#3b82f6', difficulties: ['Facile', 'Medio', 'Difficile', 'Molto difficile'], missions: MZ_MISSIONS },
  { templateId: XM_TEMPLATE_ID, universeId: 'marvel', productId: 'x-men-resistance', gameName: 'X-Men Resistance', source: 'X-Men Resistance – Regolamento, pag. 26–46 (ME: Modalità Eroe, MZ: Modalità Zombie)', image: '/ui/universo-marvel.webp', color: '#eab308', difficulties: ['Facile', 'Medio', 'Difficile', 'Molto difficile'], missions: XM_MISSIONS },
  { templateId: HR_TEMPLATE_ID, universeId: 'marvel', productId: 'heroes-resistance', gameName: "Heroes' Resistance", source: "Heroes' Resistance – Regolamento, pag. 21–30", image: '/ui/universo-marvel.webp', color: '#ef4444', difficulties: ['Facile', 'Medio', 'Difficile'], missions: HR_MISSIONS },
  { templateId: UO_TEMPLATE_ID, universeId: 'western', productId: 'undead-or-alive', gameName: 'Undead or Alive', source: 'Undead or Alive – Regolamento, pag. 44–55', image: '/ui/universo-western.webp', color: '#c2410c', difficulties: ['Facile', 'Medio', 'Difficile', 'Molto difficile'], missions: UO_MISSIONS },
];

export const seriesFor = (templateId?: string) => MISSION_SERIES.find((s) => s.templateId === templateId);

export interface SeriesMissionState { mission: SeriesMission; wins: number; played: number }

/** Una Missione è «vinta» con almeno una vittoria; nessun ordine obbligato. */
export function seriesStates(series: MissionSeries, sessions: { scenarioId?: string; outcome: string }[]): SeriesMissionState[] {
  return series.missions.map((mission) => {
    const own = sessions.filter((s) => s.scenarioId === mission.id && (s.outcome === 'vittoria' || s.outcome === 'sconfitta'));
    return { mission, wins: own.filter((s) => s.outcome === 'vittoria').length, played: own.length };
  });
}
