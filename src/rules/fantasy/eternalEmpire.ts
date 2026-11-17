/** Zombicide: White Death – The Eternal Empire. Missioni del Regolamento ITA, pag. 16–26: dati, mappe, legenda (icone ufficiali) e regole speciali.
 * Le Missioni 2, 3, 7 e 9 hanno un Epilogo opzionale (pag. 26). La Scheda Campagna di questa espansione (PEC con regole proprie, pag. 13–15) non è ancora gestita dall'app. */
import type { SeriesMission } from '../missionSeries';
import type { MissionExtra } from '../moderno/missionMaps';

export const EE_TEMPLATE_ID = 'eternal-empire-missioni';

export const EE_MISSIONS: SeriesMission[] = [
  { id: 'ee-m1', code: "M1", title: "Armi meravigliose", difficulty: "Medio", survivors: "6", duration: "durata moderata", page: 16, tiles: ["26V", "32V", "34R", "35V", "36V", "38V"], objectivesInOrder: false, objectives: ["Rivendicare l’eredità. La Missione è completata con successo non appena i Sopravvissuti hanno preso tutte le Armi della Cripta disponibili. Può essere fatto prendendo Obiettivi e/o eliminando Abomini e Necromanti Profanatori."] },
  { id: 'ee-m2', code: "M2", title: "L’origine della mente", difficulty: "Medio", survivors: "6", duration: "durata breve", page: 17, tiles: ["26R", "34R", "35V", "36V", "37R", "38V"], objectivesInOrder: false, objectives: ["Salvare i Monaci. Attivare quante più Guardie possibili prendendo i segnalini Obiettivo nelle loro Zone e tenendole al sicuro per tutta la Missione. La Missione fallisce se vengono perse Guardie specifiche (vedi Regole Speciali)."] },
  { id: 'ee-m3', code: "M3", title: "Il Celestiale", difficulty: "Medio", survivors: "6", duration: "durata lunga", page: 18, tiles: ["27R", "30V", "31R", "36V", "37V", "38V"], objectivesInOrder: true, objectives: ["Salvare il Celestiale: recuperare un mandato celestiale. I luoghi dove potrebbe trovarsi sono contrassegnati sulla mappa da carte Obiettivo.", "Portare in salvo il Celestiale. Il Segnalatore rappresenta il Celestiale. La Missione è completata con successo non appena il Celestiale raggiunge la Zona di Uscita (prendere le carte Obiettivo per trovare un modo per raggiungere questo scopo)."] },
  { id: 'ee-m4', code: "M4", title: "Appello all’azione", difficulty: "Medio", survivors: "6", duration: "durata moderata", page: 19, tiles: ["31V", "32V", "35V", "36R", "37R", "38V"], objectivesInOrder: true, objectives: ["Salvare più Guardie possibili: trovare le Guardie. I luoghi dove i giocatori possono trovarle sono contrassegnati sulla mappa da carte Obiettivo.", "Condurre in salvo le Guardie. La Missione è completata con successo non appena tutte le Guardie sono nella Zona Stendardo. La Missione fallisce se una Guardia è persa."] },
  { id: 'ee-m5', code: "M5", title: "La linea del Chi", difficulty: "Difficile", survivors: "6", duration: "durata moderata", page: 20, tiles: ["28R", "31R", "35R", "36R", "37V", "38V"], objectivesInOrder: true, objectives: ["Spostare la linea del Chi: prendere le armi ancora. Prendere tutte le carte Obiettivo.", "Liberare la linea del Chi. Uscire attraverso la Zona di Uscita con tutti i Sopravvissuti e il Segnalatore (le carte Obiettivo vi mostreranno la strada). Ogni Sopravvissuto può uscire attraverso questa Zona alla fine del proprio Turno fintanto che non ci sono Zombie nella Zona. Il Segnalatore esce attraverso questa Zona insieme all’ultimo Sopravvissuto."] },
  { id: 'ee-m6', code: "M6", title: "Lo sterminio dei guardiani", difficulty: "Difficile", survivors: "6", duration: "durata moderata", page: 21, tiles: ["28R", "31R", "35R", "36V", "37V", "38R"], objectivesInOrder: false, objectives: ["Sterminare i Bruti Guardiani: prendere tutte le carte Obiettivo.", "Uccidere 4 o più Bruti Guardiani."] },
  { id: 'ee-m7', code: "M7", title: "I molti volti della morte", difficulty: "Difficile", survivors: "6", duration: "durata lunga", page: 22, tiles: ["27R", "30V", "35R", "36R", "37V", "38V"], objectivesInOrder: true, objectives: ["Sconfiggere il Necromante Profanatore e il suo esercito di Zombie: cercare sopravvissuti. Prendere tutte le carte Obiettivo.", "Estirpare i non morti. La Missione è completata non appena non ci sono più Zombie sul tabellone."] },
  { id: 'ee-m8', code: "M8", title: "Le stelle di fuoco", difficulty: "Difficile", survivors: "6", duration: "durata lunga", page: 23, tiles: ["28R", "33R", "35V", "36V", "37R", "38R"], objectivesInOrder: true, objectives: ["Respingere gli invasori zombie: trovare le Stelle di Fuoco. Le carte Obiettivo indicano dove potrebbero trovarsi.", "Scacciare gli Zombie. Usare le Stelle di Fuoco per muovere il segnalino Prima Zona di Generazione oltre le mura fino alla Zona Stendardo. La Missione è completata non appena non ci sono più Zombie sul tabellone (eccetto quelli sulle Zone di Generazione #1, #2 e #3)."] },
  { id: 'ee-m9', code: "M9", title: "Le mura interne", difficulty: "Difficile", survivors: "6", duration: "durata lunga", page: 24, tiles: ["30V", "32R", "35R", "36V", "37V", "38R"], objectivesInOrder: false, objectives: ["Evacuare! La Missione è completata con successo non appena tutte le Guardie sono nella Zona Stendardo. La Missione fallisce se una Guardia è persa."] },
  { id: 'ee-m10', code: "M10", title: "Bloccati", difficulty: "Difficile", survivors: "6", duration: "durata lunga", page: 25, tiles: ["27R", "28R", "30V", "31V", "35R", "36V", "37V", "38V"], objectivesInOrder: true, objectives: ["Intrappolare il Profanatore: trovare le protezioni magiche. Le carte Obiettivo possono contenere indizi su dove trovarle.", "Deviare i percorsi degli Zombie. Usare le protezioni per muovere il segnalino Prima Zona di Generazione nella Zona Stendardo. Lo stesso può essere fatto con il segnalino Zona di Generazione Arancione.", "Bloccare il Profanatore. La Missione è completata con successo non appena il Necromante Profanatore viene generato nella Zona Stendardo."] },
];

export const EE_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "ee-m1": {
    image: "/mappe/ee-m1.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m1-0.webp" },
      { label: "Corruzione", icon: "/mappe/icone/ee-m1-1.webp", count: 4 },
      { label: "Guardie", icon: "/mappe/icone/ee-m1-2.webp", count: 12 },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m1-3.webp", count: 3 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m1-4.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m1-5.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m1-6.webp", count: 7 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m1-7.webp", count: 6 },
    ],
    specialRules: [
      "Nessuna regola speciale in questa Missione.",
    ],
  },
  "ee-m2": {
    image: "/mappe/ee-m2.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m2-0.webp" },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m2-1.webp", count: 3 },
      { label: "Corruzione", icon: "/mappe/icone/ee-m2-2.webp", count: 3 },
      { label: "Guardie", icon: "/mappe/icone/ee-m2-3.webp", count: 12 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m2-4.webp" },
      { label: "Obiettivi", icon: "/mappe/icone/ee-m2-5.webp", count: 7 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m2-6.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m2-7.webp", count: 6 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m2-8.webp", count: 6 },
    ],
    specialRules: [
      "Preparazione. Mescolare tutte le Note Casuali e collocare il mazzo vicino all’area di gioco. Quando un Obiettivo Rosso viene preso, pescare da questo mazzo e leggere la carta. La carta Obiettivo collocata nella Prima Zona di Generazione è in una Zona di Corruzione di proposito. Non può essere distrutta.",
      "Monaci in Meditazione. Le Guardie rappresentano i Monaci. Ogni coppia non può effettuare Azioni delle Guardie finché il segnalino Obiettivo Rosso nella loro Zona non viene preso. La Nota pescata dal mazzo indica come si comportano le Guardie corrispondenti. Ogni volta che uno Zombie uccide una Guardia in una Zona che contiene un Obiettivo Rosso, rivelare una Nota dal mazzo e leggerla. Dirà se la partita è persa oppure no. Poi, scartare la Nota senza alcun effetto aggiuntivo. L’altra Guardia, se è ancora viva, ora viene giocata come una Guardia standard.",
      "Epilogo. L’Obiettivo Verde viene collocato solo quando si gioca l’Epilogo (pag. 26). In quel caso, dopo gli Obiettivi principali e in ordine: 1. Deviare i percorsi degli Zombie: usare la Ruota Imperiale della Preghiera e/o la Tavola di Giada Incisa per spostare il segnalino Prima Zona di Generazione fino alla Zona dell’Obiettivo Verde. 2. Bloccare il Profanatore: la Missione è completata non appena il Necromante Profanatore viene generato nella Zona dell’Obiettivo Verde.",
    ],
  },
  "ee-m3": {
    image: "/mappe/ee-m3.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m3-0.webp" },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m3-1.webp", count: 3 },
      { label: "Corruzione", icon: "/mappe/icone/ee-m3-2.webp", count: 4 },
      { label: "Obiettivo", icon: "/mappe/icone/ee-m3-3.webp", count: 1 },
      { label: "Guardie", icon: "/mappe/icone/ee-m3-4.webp", count: 12 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m3-5.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/ee-m3-6.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m3-7.webp", count: 7 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m3-8.webp", count: 10 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m3-9.webp" },
    ],
    specialRules: [
      "Preparazione. La carta Obiettivo collocata nella Prima Zona di Generazione è in una Zona di Corruzione di proposito. Non può essere distrutta.",
      "Epilogo. L’Obiettivo Verde viene collocato solo quando si gioca l’Epilogo (pag. 26). In quel caso, dopo gli Obiettivi principali e in ordine: 1. Deviare i percorsi degli Zombie: usare la Ruota Imperiale della Preghiera e/o la Tavola di Giada Incisa per spostare il segnalino Prima Zona di Generazione fino alla Zona dell’Obiettivo Verde. 2. Bloccare il Profanatore: la Missione è completata non appena il Necromante Profanatore viene generato nella Zona dell’Obiettivo Verde.",
    ],
  },
  "ee-m4": {
    image: "/mappe/ee-m4.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m4-0.webp" },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m4-1.webp", count: 3 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m4-2.webp" },
      { label: "Corruzione", icon: "/mappe/icone/ee-m4-3.webp", count: 4 },
      { label: "Zona Stendardo", icon: "/mappe/icone/ee-m4-4.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m4-5.webp", count: 3 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m4-6.webp", count: 9 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m4-7.webp" },
    ],
    specialRules: [
      "Nessuna regola speciale in questa Missione.",
    ],
  },
  "ee-m5": {
    image: "/mappe/ee-m5.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m5-0.webp" },
      { label: "Corruzione", icon: "/mappe/icone/ee-m5-1.webp", count: 4 },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m5-2.webp", count: 3 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m5-3.webp" },
      { label: "Calderoni", icon: "/mappe/icone/ee-m5-4.webp", count: 3 },
      { label: "Zona di Uscita", icon: "/mappe/icone/ee-m5-5.webp" },
      { label: "Guardie", icon: "/mappe/icone/ee-m5-6.webp", count: 12 },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m5-7.webp", count: 6 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m5-8.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m5-9.webp", count: 10 },
    ],
    specialRules: [
      "Preparazione. Mettere da parte 4 Armi della Cripta casuali in un mazzo da cui pescare. Possono essere acquisite solo tramite le carte Obiettivo. Le nostre difese sono state scardinate! La Missione è persa se un segnalino Corruzione distrugge una carta Obiettivo o viene collocato su un Cammino di Ronda.",
    ],
  },
  "ee-m6": {
    image: "/mappe/ee-m6.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m6-0.webp" },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m6-1.webp" },
      { label: "Calderoni", icon: "/mappe/icone/ee-m6-2.webp", count: 3 },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m6-3.webp", count: 3 },
      { label: "Corruzione", icon: "/mappe/icone/ee-m6-4.webp", count: 4 },
      { label: "Guardie", icon: "/mappe/icone/ee-m6-5.webp", count: 12 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m6-6.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m6-7.webp", count: 2 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m6-8.webp", count: 10 },
      { label: "Scala di Corda", icon: "/mappe/icone/ee-m6-9.webp", count: 1 },
      { label: "Obiettivo", icon: "/mappe/icone/ee-m6-10.webp", count: 1 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare una Scala di Corda nella Zona indicata sulla tessera 28R.\n- Collocare l’Obiettivo Verde nella Zona indicata sulla tessera 31R.",
      "Guardie nei guai. Le Guardie con una carta Obiettivo nella loro Zona non possono effettuare Azioni delle Guardie finché la carta non è stata presa.",
      "Giù le mani! L’Obiettivo Verde non può essere preso.",
    ],
  },
  "ee-m7": {
    image: "/mappe/ee-m7.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m7-0.webp" },
      { label: "Corruzione", icon: "/mappe/icone/ee-m7-1.webp", count: 4 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m7-2.webp" },
      { label: "Scale di Corda", icon: "/mappe/icone/ee-m7-3.webp", count: 2 },
      { label: "Guardie", icon: "/mappe/icone/ee-m7-4.webp", count: 12 },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m7-5.webp", count: 3 },
      { label: "Necromante Profanatore", icon: "/mappe/icone/ee-m7-6.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m7-7.webp", count: 5 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m7-8.webp", count: 7 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m7-9.webp" },
      { label: "Obiettivo", icon: "/mappe/icone/ee-m7-10.webp", count: 1 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare un Necromante Profanatore (e il suo segnalino Zona di Generazione di Profanatori) sulla tessera 27R.\n- Collocare le Scale di Corda nella Zona indicata sulla tessera 35R.",
      "Epilogo. L’Obiettivo Verde viene collocato solo quando si gioca l’Epilogo (pag. 26). In quel caso, dopo gli Obiettivi principali e in ordine: 1. Deviare i percorsi degli Zombie: usare la Ruota Imperiale della Preghiera e/o la Tavola di Giada Incisa per spostare il segnalino Prima Zona di Generazione fino alla Zona dell’Obiettivo Verde. 2. Bloccare il Profanatore: la Missione è completata non appena il Necromante Profanatore viene generato nella Zona dell’Obiettivo Verde.",
    ],
  },
  "ee-m8": {
    image: "/mappe/ee-m8.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m8-0.webp" },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m8-1.webp", count: 3 },
      { label: "Corruzione", icon: "/mappe/icone/ee-m8-2.webp", count: 5 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m8-3.webp" },
      { label: "Calderoni", icon: "/mappe/icone/ee-m8-4.webp", count: 2 },
      { label: "Zona Stendardo", icon: "/mappe/icone/ee-m8-5.webp" },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m8-6.webp", count: 6 },
      { label: "Guardie", icon: "/mappe/icone/ee-m8-7.webp", count: 12 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m8-8.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m8-9.webp", count: 8 },
    ],
    specialRules: [
      "Nessuna regola speciale in questa Missione.",
    ],
  },
  "ee-m9": {
    image: "/mappe/ee-m9.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m9-0.webp" },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m9-1.webp", count: 3 },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m9-2.webp", count: 5 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m9-3.webp", count: 9 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m9-4.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m9-5.webp" },
      { label: "Calderoni", icon: "/mappe/icone/ee-m9-6.webp", count: 2 },
      { label: "Guardie", icon: "/mappe/icone/ee-m9-7.webp", count: 12 },
      { label: "Corruzione", icon: "/mappe/icone/ee-m9-8.webp", count: 4 },
      { label: "Zona Stendardo", icon: "/mappe/icone/ee-m9-9.webp" },
      { label: "Obiettivo", icon: "/mappe/icone/ee-m9-10.webp", count: 1 },
      { label: "Scale di Corda", icon: "/mappe/icone/ee-m9-11.webp", count: 2 },
    ],
    specialRules: [
      "Preparazione. Collocare le Scale di Corda nelle Zone indicate sulle tessere 32R e 37V.",
      "Epilogo. L’Obiettivo Verde viene collocato solo quando si gioca l’Epilogo (pag. 26). In quel caso, dopo gli Obiettivi principali e in ordine: 1. Deviare i percorsi degli Zombie: usare la Ruota Imperiale della Preghiera e/o la Tavola di Giada Incisa per spostare il segnalino Prima Zona di Generazione fino alla Zona dell’Obiettivo Verde. 2. Bloccare il Profanatore: la Missione è completata non appena il Necromante Profanatore viene generato nella Zona dell’Obiettivo Verde.",
    ],
  },
  "ee-m10": {
    image: "/mappe/ee-m10.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/ee-m10-0.webp" },
      { label: "Statue Chi", icon: "/mappe/icone/ee-m10-1.webp", count: 3 },
      { label: "Calderoni", icon: "/mappe/icone/ee-m10-2.webp", count: 2 },
      { label: "Segnalatore", icon: "/mappe/icone/ee-m10-3.webp" },
      { label: "Zona Stendardo", icon: "/mappe/icone/ee-m10-4.webp" },
      { label: "Guardie", icon: "/mappe/icone/ee-m10-5.webp", count: 12 },
      { label: "Corruzione", icon: "/mappe/icone/ee-m10-6.webp", count: 6 },
      { label: "Scale di Corda", icon: "/mappe/icone/ee-m10-7.webp", count: 2 },
      { label: "Obiettivo", icon: "/mappe/icone/ee-m10-8.webp", count: 1 },
      { label: "Carte Nota", icon: "/mappe/icone/ee-m10-9.webp", count: 4 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/ee-m10-10.webp", count: 10 },
      { label: "Zone di Generazione", icon: "/mappe/icone/ee-m10-11.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare le Scale di Corda nelle Zone indicate sulle tessere 36V e 38V.\n- Collocare l’Obiettivo Verde sulla tessera 37V. Non può essere preso.",
      "Corruzione filtrante. Rivelare ogni carta Obiettivo distrutta dalla Corruzione. Potrebbe menzionare conseguenze spiacevoli.",
    ],
  },
};
