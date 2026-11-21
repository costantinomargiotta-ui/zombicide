/**
 * Zombicide 1ª edizione – Regolamento (ITA), Missioni pag. 20–30: Tutorial e 10 Missioni indipendenti.
 * Il regolamento non indica difficoltà né durata delle Missioni. Testi e termini come nel libretto
 * (che usa i nomi inglesi di carte e zombi: Walker, Runner, Fatty, Spawn Zone).
 */
import type { SeriesMission } from '../missionSeries';
import type { MissionExtra } from './missionMaps';

export const Z1_TEMPLATE_ID = 'zombicide-1e-missioni';

export const Z1_MISSIONS: SeriesMission[] = [
  { id: 'z1-m0', code: '00', title: "Tutorial", difficulty: 'Non indicata', duration: 'Non indicata', page: 20, tiles: ["1B", "2B"], objectivesInOrder: true, objectives: ["Recuperare il segnalino Obiettivo."] },
  { id: 'z1-m1', code: '01', title: "City Blocks", difficulty: 'Non indicata', duration: 'Non indicata', page: 21, tiles: ["2C", "1C", "4B", "5C", "7B", "5D", "6B", "5E", "1B"], objectivesInOrder: true, objectives: ["Prendi tutti i segnalini Obiettivo.", "Trova almeno una carta Canned Food, almeno una carta Rice e almeno una carta Water.", "Una volta raggiunto il precedente Obiettivo, raggiungi la Zona di Uscita indicata sulla mappa con almeno un Sopravvissuto. Raccogli le carte delle Provviste e i Sopravvissuti che sono fuggiti: vinci se hai almeno una carta Canned Food, una carta Rice e una carta Water."] },
  { id: 'z1-m2', code: '02', title: "Y-Zone", difficulty: 'Non indicata', duration: 'Non indicata', page: 22, tiles: ["4B", "4E", "1B", "7B", "5D", "6B", "3C", "4C", "2C"], objectivesInOrder: true, objectives: ["Raggiungi la Zona di Uscita indicata sulla mappa con tutti i Sopravvissuti."] },
  { id: 'z1-m3', code: '03', title: "The 24hrs Race of Zombicity", difficulty: 'Non indicata', duration: 'Non indicata', page: 23, tiles: ["2C", "4D", "4B", "5C", "6B", "5F", "1B", "3C", "4E"], objectivesInOrder: true, objectives: ["Raggiungi il Livello di Pericolo Rosso con almeno un Sopravvissuto."] },
  { id: 'z1-m4', code: '04', title: "Drive-by Shooting", difficulty: 'Non indicata', duration: 'Non indicata', page: 24, tiles: ["3C", "4D", "2C", "5F", "4E", "4B", "2B", "5C"], objectivesInOrder: true, objectives: ["Recupera tutti i segnalini Obiettivo.", "Una volta raggiunto l’obiettivo precedente, raggiungi con i Sopravvissuti ancora vivi una Spawn Zone degli zombi priva di Zombi sopra (per prevenire ulteriori generazioni di Zombi)."] },
  { id: 'z1-m5', code: '05', title: "Big W", difficulty: 'Non indicata', duration: 'Non indicata', page: 25, tiles: ["5D", "2C", "1C", "7B", "5C", "6B", "5E", "1B", "4B"], objectivesInOrder: true, objectives: ["Recupera tutti i segnalini Obiettivo."] },
  { id: 'z1-m6', code: '06', title: "The Escape", difficulty: 'Non indicata', duration: 'Non indicata', page: 26, tiles: ["4C", "2C", "7B", "3C", "1B", "5D"], objectivesInOrder: true, objectives: ["Piazza almeno sei carte Provviste sotto il segnalino della Vettura (vedi Regole speciali). Le carte Provviste sono Canned Food, Rice e Water.", "Entra nella Vettura con i Sopravvissuti rimasti vivi.", "Raggiungi la Zona di Uscita indicata sulla mappa con i Sopravvissuti a bordo della Vettura. Una Vettura che raggiunge la Zona di Uscita abbandona il gioco con i suoi occupanti e le Provviste in essa contenute. Metti da parte le carte Provvista che escono dal gioco con la Vettura: vinci se ne raccogli 6 o più."] },
  { id: 'z1-m7', code: '07', title: "Grindhouse", difficulty: 'Non indicata', duration: 'Non indicata', page: 27, tiles: ["3C", "2C", "2B", "4C"], objectivesInOrder: true, objectives: ["Neutralizzare le Spawn Zone degli Zombi (vedi Regole speciali)."] },
  { id: 'z1-m8', code: '08', title: "Zombie Police", difficulty: 'Non indicata', duration: 'Non indicata', page: 28, tiles: ["2C", "7B", "4B", "1B", "5C", "3C"], objectivesInOrder: true, objectives: ["Piazza almeno un Sopravvissuto nel Bunker indicato sulla mappa. Il Bunker deve essere ripulito da tutti gli Zombi che lo occupano."] },
  { id: 'z1-m9', code: '09', title: "Might Make Right", difficulty: 'Non indicata', duration: 'Non indicata', page: 29, tiles: ["1B", "2B", "2C", "7B"], objectivesInOrder: true, objectives: ["Rivela tutti i segnalini Obiettivo.", "Ritorna nella Zona di Partenza con almeno 4 Sopravvissuti (1 giocatore), 5 Sopravvissuti (2 giocatori) o 6 Sopravvissuti (3 giocatori). Un Sopravvissuto che ritorna sulla Zona di Partenza può lasciare il tabellone durante il suo turno di gioco. Metti il Sopravvissuto e il suo Equipaggiamento da parte. Vinci non appena il numero di Sopravvissuti messi da parte raggiunge la cifra richiesta."] },
  { id: 'z1-m10', code: '10', title: "Small Town", difficulty: 'Non indicata', duration: 'Non indicata', page: 30, tiles: ["7B", "2B", "5B", "5C"], objectivesInOrder: true, objectives: ["Raccogli tutti i segnalini Obiettivo."] },
];

export const Z1_MISSION_EXTRAS: Record<string, MissionExtra> = {
  'z1-m0': {
    image: '/mappe/z1-m0.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m0-0.webp" },
      { label: "1 Walker", icon: "/mappe/icone/z1-m0-1.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m1-1.webp" },
      { label: "Obiettivo", icon: "/mappe/icone/z1-m0-3.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m0-4.webp" },
    ],
    specialRules: [
      "Mazzo delle carte Zombi ridotto. Usa solo le carte Zombi numerate 1, 2, 3, 4, e 41 per comporre il mazzo delle carte Zombi. Rimetti le altre nella scatola.",
      "Equipaggiamento Iniziale Speciale. Non distribuire le carte Pistol, Fire Axe, e Crowbar come equipaggiamento iniziale. Invece, metti queste carte in cima al mazzo delle carte Equipaggiamento. Esse saranno quindi le prime tre carte che il Sopravvissuto trova effettuando una Azione Cercare in una Zona. Le carte Pan sono tolte come al solito."
    ],
  },
  'z1-m1': {
    image: '/mappe/z1-m1.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m1-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m1-1.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/z1-m1-2.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m1-3.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m1-4.webp" },
    ],
    specialRules: [
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo recupera."
    ],
  },
  'z1-m2': {
    image: '/mappe/z1-m2.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m2-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m1-1.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/z1-m2-2.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m2-3.webp" },
      { label: "Armadietto dei Medicinali", icon: "/mappe/icone/z1-m2-4.webp" },
    ],
    specialRules: [
      "Armadietto dei medicinali. Il segnalino Obiettivo rappresenta un armadietto di medicinali. Il Sopravvissuto che lo recupera può immediatamente scartare una carta Ferita."
    ],
  },
  'z1-m3': {
    image: '/mappe/z1-m3.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m3-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m1-1.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m3-2.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m3-3.webp" },
      { label: "Vetture che puoi guidare", icon: "/mappe/icone/z1-cars.webp" },
    ],
    specialRules: [
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo raccoglie.",
      "Vetture. Puoi usare le Vetture.",
      "Vetture Pimp. Puoi cercare nelle Vetture Pimp solo una volta. Essa contiene sia il Ma’s Shotgun che le Evil Twins (da scegliere a caso). Alcune Missioni possono contenere diverse Vetture Pimp. In questo caso, puoi solo ricevere le armi che non sono state ancora trovate. Quando non ce ne sono più… non ce ne sono davvero più.",
      "Vettura della Polizia. Puoi cercare in una Vettura della Polizia più di una volta. Pesca le carte finché non trovi un’arma. Scarta le altre carte. La carta “Aaahh!” attiva la comparsa di Zombi come al solito e interrompe la ricerca."
    ],
  },
  'z1-m4': {
    image: '/mappe/z1-m4.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m4-0.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m4-1.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m1-1.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m4-3.webp" },
      { label: "Vetture che puoi guidare", icon: "/mappe/icone/z1-cars.webp" },
    ],
    specialRules: [
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 4 punti esperienza a chi lo raccoglie.",
      "Vetture. Puoi usare le Vetture.",
      "Vettura Pimp. Puoi cercare nella Vettura Pimp solo una volta. Essa contiene o il Ma’s Shotgun o le Evil Twins (scegli a caso).",
      "Vettura della Polizia. Puoi cercare in una Vettura della Polizia più di una volta. Pesca le carte finché non trovi un’arma. Scarta le altre carte. La carta “Aaahh!” attiva la comparsa di Zombi come al solito e interrompe la ricerca."
    ],
  },
  'z1-m5': {
    image: '/mappe/z1-m5.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m5-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m5-1.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m0-4.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m5-3.webp" },
    ],
    specialRules: [
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo raccoglie."
    ],
  },
  'z1-m6': {
    image: '/mappe/z1-m6.webp',
    elements: [
      { label: "Zona di Uscita", icon: "/mappe/icone/z1-m6-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m6-1.webp" },
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m6-2.webp" },
      { label: "Porta Sfondata", icon: "/mappe/icone/z1-m6-3.webp" },
      { label: "Vietato Cercare in questa Zona", icon: "/mappe/icone/z1-m6-4.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m6-5.webp" },
      { label: "Vetture che puoi guidare", icon: "/mappe/icone/z1-cars.webp" },
    ],
    specialRules: [
      "Zona di Partenza. Non puoi cercare nella Zona di Partenza dei Sopravvissuti.",
      "Piazzare le Provviste nella Vettura: Al costo di una Azione, un Sopravvissuto può piazzare (o prendere) una carta Canned Food, Rice o Water sotto il segnalino della Vettura se questa si trova nella stessa Zona in cui si trova il Sopravvissuto.",
      "Vetture. Puoi usare le Vetture.",
      "Vettura Pimp. Puoi cercare nella Vettura Pimp solo una volta. Essa contiene o il Ma’s Shotgun o le Evil Twins (scegli a caso).",
      "Vettura della Polizia. Puoi cercare in una Vettura della Polizia più di una volta. Pesca le carte finché non trovi un’arma. Scarta le altre carte. La carta “Aaahh!” attiva la comparsa di Zombi come al solito e interrompe la ricerca."
    ],
  },
  'z1-m7': {
    image: '/mappe/z1-m7.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m7-0.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m7-1.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m7-2.webp" },
      { label: "Segnalini Rumore Permanenti", icon: "/mappe/icone/z1-m7-3.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m7-4.webp" },
      { label: "Un Singolo Zombi", icon: "/mappe/icone/z1-m7-5.webp" },
    ],
    specialRules: [
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo raccoglie.",
      "Apertura Combinata delle Porte: Aprire una porta di un edificio comporta l’apertura anche della seconda porta del medesimo edificio.",
      "Occupazione degli Zombi: All’inizio del gioco, ogni Zona all’interno degli edifici contiene uno Walker. Risolvete la Generazione degli Zombi come al solito quando aprite la porta di un edificio per la prima volta.",
      "Uscita degli Zombi: Due Zone indicate sulla mappa contengono sette segnalini Rumore permanenti. Queste Zone rappresentano le uscite attraverso le quali gli Zombi possono fuggire. Se uno Zombi raggiunge una di queste Zone, rimuovilo dal tabellone e mettilo da parte. Se 4 Zombi lasciano il tabellone in questo modo, la partita è immediatamente persa.",
      "Neutralizzare le Spawn Zone degli Zombi: Un Sopravvissuto può neutralizzare una Spawn Zone degli Zombi al costo di una Azione se si trova nella medesima Zona. La Zona per essere neutralizzata non deve contenere Zombi. Nota che le Spawn Zone degli Zombi sono attive anche se le porte sono chiuse."
    ],
  },
  'z1-m8': {
    image: '/mappe/z1-m8.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m8-0.webp" },
      { label: "Spawn Zone Rossa degli Zombi", icon: "/mappe/icone/z1-m8-1.webp" },
      { label: "Spawn Zone Blu degli Zombi", icon: "/mappe/icone/z1-m8-2.webp" },
      { label: "Obiettivo Rosso (5 xp)", icon: "/mappe/icone/z1-m8-3.webp" },
      { label: "Obiettivo Verde (5 xp)", icon: "/mappe/icone/z1-m8-4.webp" },
      { label: "Obiettivo Blu (5 xp)", icon: "/mappe/icone/z1-m8-5.webp" },
      { label: "Vetture che puoi guidare", icon: "/mappe/icone/z1-cars.webp" },
      { label: "Porta Rossa", icon: "/mappe/icone/z1-m8-7.webp" },
      { label: "Porta Verde", icon: "/mappe/icone/z1-m8-8.webp" },
      { label: "Porta Blu", icon: "/mappe/icone/z1-m8-9.webp" },
    ],
    specialRules: [
      "Porta Blu. La porta Blu non può essere aperta fino a che non è stato raccolto il segnalino Obiettivo di colore Blu.",
      "Spawn Zone Blu. La Spawn Zone degli Zombi di colore Blu viene attivata quando il segnalino Obiettivo di colore Blu è stato raccolto.",
      "Porta Verde. La porta Verde non può essere aperta fino a che non è stato raccolto il segnalino Obiettivo di colore Verde.",
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo raccoglie.",
      "Vetture. Puoi usare le Vetture.",
      "Vettura Pimp. Puoi cercare nella Vettura Pimp solo una volta. Essa contiene o il Ma’s Shotgun o le Evil Twins (scegli a caso).",
      "Vettura della Polizia. Puoi cercare in una Vettura della Polizia più di una volta. Pesca le carte finché non trovi un’arma. Scarta le altre carte. La carta “Aaahh!” attiva la comparsa di Zombi come al solito e interrompe la ricerca."
    ],
  },
  'z1-m9': {
    image: '/mappe/z1-m9.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m9-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m9-1.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m9-2.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m9-3.webp" },
      { label: "Vettura della Polizia (non si può usare)", icon: "/mappe/icone/z1-m9-4.webp" },
    ],
    specialRules: [
      "Un solo Sopravvissuto. Ogni giocatore inizia il gioco con un solo Sopravvissuto.",
      "Segnalini Obiettivo. Quattro segnalini Obiettivo sono visibili sulla mappa. Tre di essi sono neutrali con identiche facciate. Il quarto ha un lato standard ed un lato Blu. Piazza i segnalini a faccia in giù e mescolali in modo che nessuno sappia dove si trovi quello diverso.",
      "Nuovi Sopravvissuti. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo raccoglie. Ogni volta che viene raccolto un segnalino neutrale, il giocatore che controlla meno Sopravvissuti prende un nuovo Sopravvissuto a caso (in caso di pareggio decide il giocatore che ha raccolto il segnalino). Il nuovo Sopravvissuto viene rivelato e piazzato senza Equipaggiamento nella Zona dove è stato raccolto il segnalino Obiettivo. Egli da adesso può essere controllato come di solito. Se viene rivelato il segnalino Obiettivo di colore Blu, questo non fa guadagnare un nuovo Sopravvissuto, ma fa guadagnare comunque 5 punti esperienza.",
      "Vetture. Non puoi usare le Vetture.",
      "Vettura della Polizia. Puoi cercare in una Vettura della Polizia più di una volta. Pesca le carte finché non trovi un’arma. Scarta le altre carte. La carta “Aaahh!” attiva la comparsa di Zombi come al solito e interrompe la ricerca.",
      "Attenzione. Questo Scenario è stato creato per essere giocato da 1 a 3 giocatori."
    ],
  },
  'z1-m10': {
    image: '/mappe/z1-m10.webp',
    elements: [
      { label: "Zona di Partenza dei Giocatori", icon: "/mappe/icone/z1-m10-0.webp" },
      { label: "Spawn Zone degli Zombi", icon: "/mappe/icone/z1-m10-1.webp" },
      { label: "Obiettivo (5 XP)", icon: "/mappe/icone/z1-m10-2.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/z1-m10-3.webp" },
    ],
    specialRules: [
      "Obiettivi. Ogni segnalino Obiettivo fa guadagnare 5 punti esperienza al Sopravvissuto che lo raccoglie."
    ],
  },
};
