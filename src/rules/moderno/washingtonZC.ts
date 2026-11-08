/**
 * Campagna «Stato Infetto» (Zombicide: Washington Z.C.).
 * Fonte: Washington Z.C. – Regole e Missioni (ITA). Stessa scheda campagna di Rio Z Janeiro
 * (pag. 13–15: PEC, Pietre Miliari, Azioni Bonus, Equipaggiamento Conservato, Traguardi)
 * e stesse regole di KO / R.I.P. (pag. 7). Cambia l'elenco delle Abilità della Campagna.
 */
import { CAMPAIGN_ABILITIES as RIO_ABILITIES, type CampaignAbility, type RioMission } from './rioZJaneiro';

export const WZC_TEMPLATE_ID = 'washington-zc';
const WZC = 'Zombicide: Washington Z.C. – Regole e Missioni (ITA)';

const rio = (id: string) => RIO_ABILITIES.find((a) => a.id === `rio-${id}`)!;

/** Abilità della Campagna nell'ordine della scheda (pag. 13). Le comuni con Rio mantengono lo stesso id. */
export const WZC_ABILITIES: CampaignAbility[] = [
  rio('riflessi-da-combattimento'), rio('destino'), rio('avido'), rio('turarsi-il-naso'), rio('difensore-di-casa'),
  rio('salvatore'), rio('basso-profilo'),
  { id: 'wzc-guerriero-notturno', name: 'Guerriero notturno', description: 'Gli Attacchi a Distanza effettuati durante le ore notturne hanno Precisione 5+. Gli effetti che alterano la Precisione si applicano comunque, così come i successi automatici (es. Molotov).', source: { document: WZC, page: 31 } },
  rio('scarto-laterale'), rio('parte-con-2-pa'),
  { id: 'wzc-parte-con-1-kit-di-riparazione', name: 'Parte con 1 Kit di Riparazione', description: "Inizia la partita con l'Equipaggiamento indicato, assegnato durante la Preparazione.", source: { document: WZC, page: 13 } },
  rio('parte-con-1-carta-munizioni'), rio('mano-ferma'), rio('cintura-portaoggetti'),
];

const m = (n: number, title: string, difficulty: RioMission['difficulty'], duration: string, page: number, tiles: string, startTime: string, inOrder: boolean, objectives: string[], campaignNotes?: string[]): RioMission & { startTime: string } =>
  ({ id: `wzc-m${n}`, code: `M${n}`, title, difficulty, duration, page, tiles: tiles.split(' '), objectivesInOrder: inOrder, objectives, campaignNotes, startTime });

/** Le 10 Missioni vanno giocate in ordine (pag. 18). */
export const WZC_MISSIONS = [
  m(1, "Affrontare l'impossibile", 'Medio', '45 minuti', 18, '2V 3R 4R 5R 7R 8R', '12 pm', false, ['Aprire tutte le porte della tavola calda (tessere 3R e 4R).', 'Prendere tutte le carte Obiettivo.']),
  m(2, 'Nessuno resta indietro', 'Medio', '60 minuti', 20, '1R 2R 4V 6R 7V 8R', '12 pm', true, ['Salvare più persone possibili: prendere tutte le carte Obiettivo.']),
  m(3, 'DEFCON 5: Sparire', 'Medio', '45 minuti', 21, '1V 2V 3V 4V 6V 8V', '11 am', true, ['Esplorare l\'area: prendere tutte le carte Obiettivo (quella «alle 7 pm» si rivela da sola).']),
  m(4, 'Zona di guerra', 'Medio', '60 minuti', 22, '1R 3R 6R 9R 10V 11V', '12 am', false, ['Spegnere il faro proiettore.', "Raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(5, 'DEFCON 4: Reazione ritardata', 'Medio', '90 minuti', 24, '10R 11R 12R 13V 14R 15R', '3 pm', true, ["Cercare un posto sicuro nell'ala della Casa Bianca."]),
  m(6, 'DEFCON 3: Esplorando la casa', 'Medio', '90 minuti', 25, '10R 11R 12R 13R 14R 15R', '3 pm', true, ["Trovare l'entrata del bunker."]),
  m(7, 'Trovare la tessera elettronica', 'Difficile', '45 minuti', 26, '10R 11R 12R 13V 14V 15V', '4 am', true, ["Prendere la tessera elettronica che un Abominio porta al collo, senza usare Molotov."], ['Preparazione: i Traguardi «Rifugiato nei Tunnel», «Che Luce Sia» e «Pretoriano» sbloccano effetti di gioco (pag. 26).']),
  m(8, "Riparare l'ascensore", 'Difficile', '60 minuti', 27, '11R 12V 13V 14V 15V', '10 am', true, ['Trovare il generatore di energia e accenderlo.'], ['Le porte blu e verde si aprono solo se i Sopravvissuti possiedono il Traguardo «Rifugiato nei Tunnel».']),
  m(9, 'DEFCON 2: Ritmo frenetico', 'Molto Difficile', '45 minuti', 28, '10R 11R 12R 13R 14R 15R', '3 pm', true, ["Raggiungere l'entrata del bunker presidenziale (carta Obiettivo sulla tessera 13R) e leggerla."]),
  m(10, 'DEFCON 1: Pronti a fare fuoco', 'Molto Difficile', '60 minuti', 29, '1R 2V 7R 8V 10V 11V', '10 pm', true, ["Trovare una via d'uscita dall'area."]),
];

/** Traguardi nominati nel regolamento; gli altri arrivano dalle carte Obiettivo. */
export const WZC_KNOWN_MILESTONES = [
  { name: 'Rifugiato nei Tunnel', missions: ['wzc-m7', 'wzc-m8'] },
  { name: 'Che Luce Sia', missions: ['wzc-m7'] },
  { name: 'Pretoriano', missions: ['wzc-m7'] },
];
