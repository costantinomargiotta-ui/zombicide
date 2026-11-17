/**
 * Campagna «Bandiera a Stelle e Strisce» (Zombicide: Fort Hendrix).
 * Fonte: Fort Hendrix – Regolamento (ITA), Missioni pag. 19–33. Stessa scheda campagna di Washington Z.C.
 * (stesso elenco di Abilità della Campagna, pag. 14). Compagno della campagna: Penny.
 */
import type { RioMission } from './rioZJaneiro';
import type { MissionExtra } from './missionMaps';

export const FH_TEMPLATE_ID = 'fort-hendrix';

export const FH_MISSIONS: (RioMission & { startTime?: string })[] = [
  { id: 'fh-m1', code: "M1", title: "L’adunanza dei coraggiosi", difficulty: "Medio", duration: "60 minuti", page: 19, tiles: ["1R", "2R", "3V", "6V", "7R", "9V"], objectivesInOrder: true, objectives: ["Sopravvissuti, uniti! Radunare tutti i Sopravvissuti nella stessa Zona. Non appena è stato fatto, leggere la Nota #1."], startTime: "10 am" },
  { id: 'fh-m2', code: "M2", title: "Indizi digitali", difficulty: "Medio", duration: "60 minuti", page: 21, tiles: ["1R", "2R", "17R", "18R", "19R", "20R"], objectivesInOrder: true, objectives: ["Controllare l’ufficio. Raggiungere l’Ufficio di Comando (prendere la carta obiettivo “Ufficio di Comando”) sulla tessera 19R."], startTime: "7 am" },
  { id: 'fh-m3', code: "M3", title: "Portate i miei saluti a Linda", difficulty: "Medio", duration: "90 minuti", page: 22, tiles: ["4V", "9R", "17R", "18V", "19V", "21R"], objectivesInOrder: true, objectives: ["Salvare la Dottoressa Linda Kirkland. Prendere carte Obiettivo finché non si trova una traccia per la madre di Penny."], startTime: "9 am" },
  { id: 'fh-m4', code: "M4", title: "Laboratorio segreto", difficulty: "Medio", duration: "60 minuti", page: 23, tiles: ["16R", "17R", "19V", "20V"], objectivesInOrder: true, objectives: ["Mettere in sicurezza il laboratorio segreto. Prendere carte Obiettivo finché non viene trovato un modo per impedire agli zombie di diffondere le varie epidemie."], startTime: "4 am" },
  { id: 'fh-m5', code: "M5", title: "Eden patogeno", difficulty: "Medio", duration: "45 minuti", page: 24, tiles: ["4R", "6R", "7R", "16R", "17V", "19V"], objectivesInOrder: true, objectives: ["Distruggere i laboratori (e gli eventuali Zombie al loro interno). Prendere la carta Obiettivo “Celle Frigorifere” sulla tessera 19V."], startTime: "8 pm" },
  { id: 'fh-m6', code: "M6", title: "Area Romero", difficulty: "Medio", duration: "120 minuti", page: 25, tiles: ["2V", "16V", "17R", "18R", "19V", "21V"], objectivesInOrder: true, objectives: ["Hanno fatto degli esperimenti sui soldati? Controllare la Sala degli Ufficiali (sulla tessera 16V)."], startTime: "10 pm" },
  { id: 'fh-m7', code: "M7", title: "Il quartier generale", difficulty: "Medio", duration: "120 minuti", page: 26, tiles: ["9R", "16V", "17V", "18V", "20R", "21V"], objectivesInOrder: true, objectives: ["Avviare i protocolli di decontaminazione. Si trovano nel QG di Fort Hendrix. Prendere la carta Obiettivo corrispondente sulla tessera 16V."], startTime: "11 am" },
  { id: 'fh-m8', code: "M8", title: "Siete nell’esercito ora", difficulty: "Molto Difficile", duration: "120 minuti", page: 28, tiles: ["7R", "8R", "9V", "16R", "17R", "18V", "19V", "20R", "21V"], objectivesInOrder: true, objectives: ["Rivelare il segreto di Fort Hendrix. Prendere carte Obiettivo fino a scoprire cosa è successo a Fort Hendrix."], startTime: "4 am" },
  { id: 'fh-m9', code: "M9", title: "Il vaso di Pandora", difficulty: "Speciale", duration: "Durata speciale", page: 30, tiles: ["3V", "5V", "7R", "9V", "16V", "17V"], objectivesInOrder: true, objectives: ["Recuperare il Retaggio di Hendrix. Sulla tessera 16V."], startTime: "5 am" },
  { id: 'fh-m10', code: "M10", title: "Foschia viola", difficulty: "Molto Difficile", duration: "90 minuti", page: 32, tiles: ["2V", "3R", "4R", "16R", "18R", "19R", "20R", "21R"], objectivesInOrder: true, objectives: ["Impedire agli zombie all’esterno di entrare a Fort Hendrix. Trovare un modo per distruggere la Zona di Generazione verde e bloccare gli accessi a Fort Hendrix."], startTime: "1 am" },
];

/** Traguardi nominati nel regolamento; gli altri arrivano dalle carte Obiettivo e dalle Note. */
export const FH_KNOWN_MILESTONES = [
  { name: 'Contaminato', missions: ['fh-m9', 'fh-m10'] },
];

export const FH_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "fh-m1": {
    image: "/mappe/fh-m1.webp",
    elements: [
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m1-0.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m1-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m1-2.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m1-3.webp", count: 6 },
      { label: "Note", icon: "/mappe/icone/fh-m1-4.webp", count: 2 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare Javier, Karl e Riley sulla Zona di Partenza dei Sopravvissuti #1 (Tessera 1R/3V).\n- Collocare Marian, Michelle, Penny e Wayne sulla Zona di Partenza dei Sopravvissuti #2 (Tessera 7R).\n- Se si gioca questa Missione con altri Sopravvissuti, distribuirli in modo uniforme (a scelta dei giocatori) nelle Zone di Partenza. Il Leader di Penny deve trovarsi nella Zona di Partenza #2.\n- Prima del primo Round di Gioco, risolvere una Fase degli Zombie.",
      "Prima salvate loro. Finché l’Obiettivo della Missione non viene soddisfatto, la carta Obiettivo #7 “Scorte di Materiale Elettronico” è l’unica carta che i Sopravvissuti possono prendere.",
      "La ricerca di Penny. I Sopravvissuti ricevono l’Abilità Basso profilo fintanto che si trovano nella Zona di Penny. Questo include la stessa Penny e il suo Leader.\nBasso profilo – Il Sopravvissuto non può essere colpito dal Fuoco Amico (le regole relative alle Molotov si applicano comunque). Viene ignorato quando qualcuno tira nella Zona in cui egli si trova.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m2": {
    image: "/mappe/fh-m2.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m2-0.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m2-1.webp", count: 6 },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m2-2.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m2-3.webp", count: 6 },
      { label: "Note", icon: "/mappe/icone/fh-m2-4.webp", count: 1 },
    ],
    specialRules: [
      "Centro dati chiuso a chiave. L’edificio sulla tessera 20R non può essere aperto.",
      "Sviluppo degli eventi. Prima visitate la Guardiola e l’Ufficio di Comando (è consentito prendere soltanto le carte Obiettivo “Guardiola” e “Ufficio di Comando”).",
      "La ricerca di Penny. I Sopravvissuti ricevono l’Abilità Basso profilo fintanto che si trovano nella Zona di Penny. Questo include la stessa Penny e il suo Leader.\nBasso profilo – Il Sopravvissuto non può essere colpito dal Fuoco Amico (le regole relative alle Molotov si applicano comunque). Viene ignorato quando qualcuno tira nella Zona in cui egli si trova.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m3": {
    image: "/mappe/fh-m3.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m3-0.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m3-1.webp", count: 6 },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m3-2.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m3-3.webp", count: 6 },
      { label: "Nota", icon: "/mappe/icone/fh-m3-4.webp", count: 1 },
    ],
    specialRules: [
      "La ricerca di Penny. I Sopravvissuti ricevono l’Abilità Basso profilo fintanto che si trovano nella Zona di Penny. Questo include la stessa Penny e il suo Leader.\nBasso profilo – Il Sopravvissuto non può essere colpito dal Fuoco Amico (le regole relative alle Molotov si applicano comunque). Viene ignorato quando qualcuno tira nella Zona in cui egli si trova.",
      "Non c’è tempo da perdere. L’edificio a cavallo delle tessere 17R e 21R non può essere aperto.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m4": {
    image: "/mappe/fh-m4.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m4-0.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m4-1.webp", count: 8 },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m4-2.webp" },
      { label: "Note", icon: "/mappe/icone/fh-m4-3.webp", count: 3 },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m4-4.webp", count: 4 },
      { label: "Porte Chiuse", icon: "/mappe/icone/fh-m4-5.webp" },
      { label: "Pimpmobile (può essere guidata)", icon: "/mappe/icone/fh-m4-6.webp" },
    ],
    specialRules: [
      "Porte bloccate. Le porte rosse non possono essere aperte dalle Zone di strada. Possono essere aperte soltanto dall’interno dell’edificio.",
      "Auto carica. Non è consentito guidare la Pimpmobile o Cercare al suo interno finché non viene dichiarato che è consentito.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m5": {
    image: "/mappe/fh-m5.webp",
    elements: [
      { label: "Porta Chiusa", icon: "/mappe/icone/fh-m5-0.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m5-1.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m5-2.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m5-3.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m5-4.webp", count: 8 },
      { label: "Note", icon: "/mappe/icone/fh-m5-5.webp", count: 2 },
    ],
    specialRules: [
      "Incastrata. La porta verde non può essere aperta.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m6": {
    image: "/mappe/fh-m6.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m6-0.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m6-1.webp", count: 8 },
      { label: "Note", icon: "/mappe/icone/fh-m6-2.webp", count: 2 },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m6-3.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m6-4.webp", count: 6 },
      { label: "Porte Chiuse", icon: "/mappe/icone/fh-m6-5.webp" },
    ],
    specialRules: [
      "Preparazione.\n- La Zona di Generazione verde non è attiva all’inizio della partita.\n- La Porta verde e la Porta blu non possono essere aperte finché la carta Obiettivo “Porta di Metallo” non è stata presa.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m7": {
    image: "/mappe/fh-m7.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m7-0.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m7-1.webp", count: 6 },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m7-2.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m7-3.webp", count: 6 },
    ],
    specialRules: [
      "Avanguardia Zombie. Questa regola speciale si applica solo se la Missione M6 - Area Romero non è ancora stata giocata. La Zona di Generazione verde è attiva fin dall’inizio della Missione. La carta Obiettivo QG di Fort Hendrix non può essere presa (e quindi non è possibile vincere la Missione) finché la Zona di Generazione verde non è stata disattivata (vedi sotto).",
      "Elicottero Precipitato. La Zona centrale della tessera 21V, che rappresenta un elicottero precipitato, è in fiamme. Non è possibile Cercare al suo interno. Tirate un dado ogni volta che un Sopravvissuto entra in questa Zona o effettua un’Azione in questa Zona: con 4+, il Sopravvissuto subisce 1 Ferita. PROMEMORIA: Non fare niente è un’Azione. La Cassa di Armi Pimpate non può essere presa prima della carta Obiettivo “Elicottero precipitato”. Applicare l’effetto di una Molotov in quella Zona rimuove la Zona di Generazione verde. La Cassa di Armi Pimpate e la carta Obiettivo in quella Zona vengono rimosse se non erano state prese in precedenza.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m8": {
    image: "/mappe/fh-m8.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m8-0.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m8-1.webp", count: 9 },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m8-2.webp" },
      { label: "Zombie", icon: "/mappe/icone/fh-m8-3.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m8-4.webp", count: 9 },
      { label: "Note", icon: "/mappe/icone/fh-m8-5.webp", count: 2 },
    ],
    specialRules: [
      "Preparazione. Collocare gli Zombie seguenti nella Zona centrale della tessera 21V:\n- 20 Deambulanti\n- 8 Bruti\n- 8 Corridori\n- 1 Deambulante Tiratore",
      "Guai in arrivo. La Zona di Generazione verde non è attiva all’inizio della partita.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m9": {
    image: "/mappe/fh-m9.webp",
    elements: [
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m9-0.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m9-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m9-2.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m9-3.webp", count: 8 },
      { label: "Note", icon: "/mappe/icone/fh-m9-4.webp", count: 1 },
    ],
    specialRules: [
      "Tutte le malattie del mondo. I Sopravvissuti con Traguardi Contaminato non possono usare le Abilità ottenute tramite i Livelli di Pericolo. Più un Sopravvissuto è Contaminato, più sono le Abilità che non può usare.\n- Contaminato x1: Non può usare le Abilità di Livello Rosso.\n- Contaminato x2: Non può usare le Abilità di Livello Arancione e Rosso.\n- Contaminato x3: Non può usare le Abilità di Livello Giallo o superiore.\n- Contaminato x4 (o più): Non può usare le Abilità di Livello Blu o superiore. I punti adrenalina si ottengono normalmente per scegliere le Abilità (anche se non possono essere usate) e per determinare il Livello di Pericolo attuale. I Sopravvissuti che perdono Traguardi Contaminato recuperano l’uso delle Abilità corrispondenti.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "fh-m10": {
    image: "/mappe/fh-m10.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/fh-m10-0.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/fh-m10-1.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/fh-m10-2.webp", count: 8 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/fh-m10-3.webp", count: 8 },
      { label: "Note", icon: "/mappe/icone/fh-m10-4.webp", count: 4 },
    ],
    specialRules: [
      "Invasione dall’esterno. La Zona di Generazione verde è attiva dall’inizio della partita. Durante la loro attivazione, nel caso non ci siano percorsi sgombri fino alla Zona più rumorosa, gli Zombie si muovono verso di essa come se tutte le porte fossero aperte, anche se le porte chiuse a chiave li fermano ancora.",
      "Attraversare il confine. Le porte dell’edificio a cavallo tra le tessere 3R e 4R possono essere sfondate se 1 o più Zombie che si trovano in quelle Zone ricevono un’Attivazione extra mentre cercano di entrare nell’edificio. Aprire la porta e generare gli Zombie nell’edificio se era la prima porta a venire aperta. Se 2 o più porte sono state forzate dagli Zombie in questo modo (le porte aperte dai Sopravvissuti non contano), prendere la Nota #1.",
      "È il domani o è la fine dei tempi? I Sopravvissuti con Traguardi Contaminato non possono usare le Abilità ottenute tramite i Livelli di Pericolo. Più un Sopravvissuto è contaminato, più sono le Abilità che non può usare.\n- Contaminato x1: Non può usare le Abilità di Livello Rosso.\n- Contaminato x2: Non può usare le Abilità di Livello Arancione e Rosso.\n- Contaminato x3: Non può usare le Abilità di Livello Giallo o superiore.\n- Contaminato x4 (o più): Non può usare le Abilità di Livello Blu o superiore. I punti adrenalina si ottengono normalmente per scegliere le Abilità (anche se non possono essere usate) e per determinare il Livello di Pericolo attuale. I Sopravvissuti che perdono Traguardi Contaminato recuperano l’uso delle Abilità corrispondenti. SPECIALE: Alla fine della campagna, a prescindere dall’esito, i Sopravvissuti con 1 o più Traguardi Contaminato muoiono. Il loro viaggio finisce qui.",
      "L’Ira di Penny. Il Leader di Penny riceve l’Abilità +1 Azione in Combattimento gratuita. Questa Azione in Combattimento gratuita può essere effettuata solo con un’arma nello Zaino del Leader.",
      "Armi Pimpate. Ogni Cassa di Armi Pimpate fornisce un’Arma Pimpata casuale al Sopravvissuto che la prende, che poi può riorganizzare il suo inventario gratuitamente.",
    ],
  },
};
