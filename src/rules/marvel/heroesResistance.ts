/** Marvel Zombies: Heroes' Resistance – Regolamento ITA, pag. 21–30: missioni, mappe ritagliate dal regolamento, legenda (icone ufficiali) e regole speciali. */
import type { SeriesMission } from '../missionSeries';
import type { MissionExtra } from '../moderno/missionMaps';

export const HR_TEMPLATE_ID = "heroes-resistance-missioni";

export const HR_MISSIONS: SeriesMission[] = [
  { id: "hr-m0", code: "M0", title: "Missione introduttiva: l’inizio", difficulty: "Facile", duration: "30 minuti", page: 21, tiles: ["2V", "4V"], objectivesInOrder: false, objectives: ["Cercare e mettere in sicurezza: prendere tutti gli Obiettivi.", "Salvare almeno 1 Passante.", "Poi: Fuggire attraverso l’Uscita con tutti i Supereroi. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
  { id: "hr-m1", code: "M1", title: "Epidemia", difficulty: "Facile", duration: "45 minuti", page: 22, tiles: ["1R", "2R", "3R", "4V"], objectivesInOrder: false, objectives: ["Operazione di salvataggio: prendere tutti gli Obiettivi.", "Trovare e salvare Pepper Potts.", "Poi: Fuggire attraverso l’Uscita con tutti i Supereroi e Pepper Potts. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
  { id: "hr-m2", code: "M2", title: "Fuga attraverso la Oscorp", difficulty: "Facile", duration: "45 minuti", page: 23, tiles: ["1V", "2V", "3V", "4V"], objectivesInOrder: false, objectives: ["Fuga. Fuggire attraverso l’Uscita con tutti i Supereroi. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
  { id: "hr-m3", code: "M3", title: "Zona sicura", difficulty: "Medio", duration: "60 minuti", page: 25, tiles: ["1R", "2R", "3R", "4R"], objectivesInOrder: false, objectives: ["Annientamento: prendere tutti gli Obiettivi.", "Eliminare tutti i Nemici sia sul tabellone che nella riserva (vedi la pagina successiva)."] },
  { id: "hr-m4", code: "M4", title: "Scorta", difficulty: "Difficile", duration: "45 minuti", page: 26, tiles: ["1V", "2R", "3V", "4R"], objectivesInOrder: false, objectives: ["Rendez-vous. Fuggire attraverso l’Uscita con tutti i Supereroi, Pepper Potts e J. Jonah Jameson. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
  { id: "hr-m5", code: "M5", title: "Don’t Worry, Be Happy", difficulty: "Medio", duration: "60 minuti", page: 27, tiles: ["1R", "2V", "3R", "4V"], objectivesInOrder: true, objectives: ["Tutto è bene quel che finisce bene: salvare Happy Hogan.", "Fuggire attraverso l’Uscita con tutti i Supereroi e Happy Hogan. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
  { id: "hr-m6", code: "M6", title: "Piano di contenimento", difficulty: "Medio", duration: "60 minuti", page: 28, tiles: ["1V", "2V", "3V", "4V"], objectivesInOrder: true, objectives: ["Sconfiggere la nemesi: muovere entrambi i segnalini Generazione rossi fino alla Zona di Generazione verde (vedi le Regole Speciali).", "Far saltare in aria i Punti di Generazione (vedi le Regole Speciali)."] },
  { id: "hr-m7", code: "M7", title: "La trappola", difficulty: "Difficile", duration: "45 minuti", page: 29, tiles: ["1R", "2R", "3R", "4R"], objectivesInOrder: true, objectives: ["Raccogliere materiale: prendere tutti gli Obiettivi.", "Fuggire attraverso l’Uscita con tutti i Supereroi. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
  { id: "hr-m8", code: "M8", title: "Supporto tecnico", difficulty: "Difficile", duration: "60 minuti", page: 30, tiles: ["1R", "2R", "3R", "4R"], objectivesInOrder: true, objectives: ["Teletrasportatori, uniti!: prendere tutti gli Obiettivi.", "Fuggire attraverso l’Uscita con tutti i Supereroi. Ogni Supereroe può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Nemici nella Zona."] },
];

export const HR_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "hr-m0": {
    image: "/mappe/hr-m0.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m0-0.webp" },
      { label: "Eroe Zombie", icon: "/mappe/icone/hr-m0-1.webp" },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m0-2.webp", count: 2 },
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m0-3.webp" },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m0-4.webp", count: 2 },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m0-5.webp", count: 2 },
    ],
    specialRules: [
      "Le voci erano vere. Generare 1 Eroe Zombie casuale nella Zona di Uscita.",
      "Mettere in sicurezza le risorse. Ogni Obiettivo fornisce 5 PE al Supereroe che lo prende.",
    ],
  },
  "hr-m1": {
    image: "/mappe/hr-m1.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m1-0.webp" },
      { label: "Simbolo degli Avengers", icon: "/mappe/icone/hr-m1-1.webp" },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m1-2.webp", count: 4 },
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m1-3.webp" },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m1-4.webp", count: 3 },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m1-5.webp", count: 4 },
    ],
    specialRules: [
      "Civili minacciati. Mescolare la carta Passante Pepper Potts con altre 3 carte Passante casuali e collocarle a faccia in giù nelle Zone dove compare il simbolo Passante.",
      "Attrezzarsi per la Missione. Ogni Obiettivo fornisce 5 PE al Supereroe che lo prende.",
    ],
  },
  "hr-m2": {
    image: "/mappe/hr-m2.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m2-0.webp" },
      { label: "Porte Sigillate", icon: "/mappe/icone/hr-m2-1.webp", count: 2 },
      { label: "Porte Chiuse a Chiave", icon: "/mappe/icone/hr-m2-2.webp", count: 2 },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m2-3.webp", count: 2 },
      { label: "Simbolo degli Avengers", icon: "/mappe/icone/hr-m2-4.webp" },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m2-5.webp", count: 3 },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m2-6.webp", count: 4 },
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m2-7.webp" },
    ],
    specialRules: [
      "Sigillate. Le porte rosse non possono essere aperte.",
      "La chiave giusta per la porta giusta. La porta blu non può essere aperta finché il segnalino Obiettivo blu non viene preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non viene preso.",
      "Lavoro da detective. Ogni Obiettivo fornisce 5 PE al Supereroe che lo prende.",
    ],
  },
  "hr-m3": {
    image: "/mappe/hr-m3.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m3-0.webp" },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m3-1.webp", count: 4 },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m3-2.webp", count: 4 },
      { label: "Simbolo degli Avengers", icon: "/mappe/icone/hr-m3-3.webp" },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m3-4.webp", count: 4 },
    ],
    specialRules: [
      "Sorpresa! Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Arcinemici. Il mazzo degli Eroi Zombie non deve contenere più di 4 carte (nel caso in cui ne abbiate di extra).",
      "Attrezzarsi per la Missione. Ogni Obiettivo rosso fornisce 5 PE al Supereroe che lo prende.",
      "Un istante di respiro. Una volta che i 2 segnalini Obiettivo rossi sono stati presi, i Nemici eliminati NON ritornano nella riserva. Vengono invece rimossi interamente dal gioco. Ogni volta che si pesca una carta Generazione, se non ci sono più Nemici del tipo indicato sul tabellone e nella riserva, ignorare quella carta e continuare a pescare carte Generazione finché non se ne trova una applicabile a un Nemico nella riserva (generandolo) o sul tabellone (conferendogli un’Attivazione extra).",
      "Souvenir delle Stark Industries. I segnalini Obiettivo blu e verde sono Esplosivi delle Stark Industries. Il Supereroe che ne prende uno guadagna 5 PE e lo tiene accanto alla sua Scheda Identità. Un Supereroe con un Esplosivo può spendere 1 Azione per collocarlo nella sua Zona. Nella Fase Finale, gli Esplosivi collocati vengono scartati, eliminando tutti i Nemici, i Supereroi e i Passanti nella loro Zona. Non si guadagnano PE.",
      "Fatevi sotto! Il Punto di Generazione verde diventa attivo una volta che il segnalino Obiettivo verde è stato preso. Il Punto di Generazione blu diventa attivo una volta che il segnalino Obiettivo blu è stato preso.",
    ],
  },
  "hr-m4": {
    image: "/mappe/hr-m4.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m4-0.webp" },
      { label: "Zona di Partenza Speciale", icon: "/mappe/icone/hr-m4-1.webp" },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m4-2.webp", count: 4 },
      { label: "Porte Chiuse", icon: "/mappe/icone/hr-m4-3.webp", count: 2 },
      { label: "Porta Sigillata", icon: "/mappe/icone/hr-m4-4.webp" },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m4-5.webp", count: 5 },
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m4-6.webp" },
    ],
    specialRules: [
      "Sorpreso allo scoperto. Uno dei Supereroi deve essere scelto casualmente e iniziare la partita nella Zona evidenziata in giallo.",
      "Mansioni di scorta. Altri due Supereroi iniziano la partita con le carte Passante Pepper Potts e J. Jonah Jameson in loro possesso. Il segnapunti sulla loro Barra della Potenza parte comunque da 0.",
      "Dobbiamo proteggerli! Se in qualsiasi momento, per qualsiasi motivo, Pepper Potts o J. Jonah Jameson vengono scartati, i giocatori perdono immediatamente.",
      "Ingresso sbarrato. La porta blu non può essere aperta.",
    ],
  },
  "hr-m5": {
    image: "/mappe/hr-m5.webp",
    elements: [
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m5-0.webp" },
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m5-1.webp" },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m5-2.webp", count: 4 },
      { label: "Porte Aperte", icon: "/mappe/icone/hr-m5-3.webp", count: 2 },
      { label: "Porte Chiuse a Chiave", icon: "/mappe/icone/hr-m5-4.webp", count: 2 },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m5-5.webp", count: 4 },
      { label: "Happy Hogan", icon: "/mappe/icone/hr-m5-6.webp" },
      { label: "Simbolo degli Avengers", icon: "/mappe/icone/hr-m5-7.webp" },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m5-8.webp", count: 2 },
    ],
    specialRules: [
      "Chiave elettronica. Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Saccheggiato. All’inizio della Missione entrambe le porte dell’edificio con il Punto di Generazione blu sono già aperte. Non collocare una carta Passante e non pescare carte Generazione per questo edificio.",
      "Segnale di soccorso. Il Passante nella Zona indicata deve essere Happy Hogan. All’inizio della partita Happy è già rivelato, ma non si muove finché l’edificio in cui si trova non viene aperto.",
      "La chiave! Quando un Supereroe prende il segnalino Obiettivo blu, aprire la porta blu e la porta verde. Non generare Nemici nell’edificio di Happy Hogan.",
      "Sorpresa! Quando un Supereroe prende il segnalino Obiettivo verde, ottiene una carta Passante dal relativo mazzo, come se avesse salvato quel Passante.",
      "Quello prima non c’era. Il Punto di Generazione blu diventa attivo una volta che il segnalino Obiettivo blu è stato preso.",
      "Questo cos’è? Ogni Obiettivo fornisce 5 PE al Supereroe che lo prende.",
      "Il beniamino di tutti. I giocatori perdono la partita se Happy Hogan viene eliminato o scartato.",
    ],
  },
  "hr-m6": {
    image: "/mappe/hr-m6.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m6-0.webp" },
      { label: "Porte Aperte", icon: "/mappe/icone/hr-m6-1.webp", count: 2 },
      { label: "Pedine Passante", icon: "/mappe/icone/hr-m6-2.webp", count: 2 },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m6-3.webp", count: 3 },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m6-4.webp", count: 4 },
    ],
    specialRules: [
      "Passanti nelle strade. Rimuovere 2 carte Passante in Pericolo dal mazzo di Generazione. Collocare 2 pedine Passante come indicato dalla mappa.",
      "Tecnologia Oscorp. Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Qualcuno è stato qui. Alla fine della preparazione, generare Nemici in tutti gli edifici come se le relative porte fossero appena state aperte. Non pescare carte Passante per gli edifici.",
      "Civili in pericolo. I Passanti non possono muoversi, essere mossi, essere salvati o attaccati. Quando i Nemici si muovono, se non ci sono Supereroi in Linea di Vista, cercheranno sempre di muoversi verso il Passante più vicino.",
      "Proteggere i civili. I giocatori perdono non appena un Nemico entra nella Zona di un Passante.",
      "Il laboratorio di Norman. Il Punto di Generazione verde è attivo dall’inizio della partita.",
      "Meglio di niente. Ogni segnalino Obiettivo rosso fornisce 5 PE al Supereroe che lo prende.",
      "Segreti della Oscorp. Il segnalino Obiettivo blu fornisce 5 PE a TUTTI i Supereroi quando viene preso.",
      "Console di Comando della Oscorp. Il segnalino Obiettivo verde fornisce 5 PE al Supereroe che lo prende. Dovrà tenere il segnalino accanto alla sua Scheda Identità.",
      "Raduniamoli tutti. Un Supereroe in una Zona di Generazione rossa priva di Nemici può spendere 1 Azione per spostare quel segnalino Punto di Generazione nella Zona di Generazione verde (il segnalino continua a generare dopo essere stato spostato).",
      "Sovraccarico! Il Supereroe che possiede il segnalino Obiettivo verde può spendere 1 Azione mentre si trova nella Zona contenente tutti e 3 i segnalini Punto di Generazione per farli detonare e vincere la partita.",
    ],
  },
  "hr-m7": {
    image: "/mappe/hr-m7.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m7-0.webp" },
      { label: "Simbolo degli Avengers", icon: "/mappe/icone/hr-m7-1.webp" },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m7-2.webp", count: 4 },
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m7-3.webp" },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m7-4.webp", count: 5 },
      { label: "Porte Chiuse a Chiave", icon: "/mappe/icone/hr-m7-5.webp", count: 2 },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m7-6.webp", count: 4 },
    ],
    specialRules: [
      "Manomesso. Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Attrezzarsi per la Missione. Ogni Obiettivo fornisce 5 PE al Supereroe che lo prende.",
      "Non si muove. La porta blu e la porta verde non possono essere aperte dai Supereroi.",
      "Era tutto predisposto! Quando il segnalino Obiettivo verde viene preso, aprire immediatamente la porta verde e generare 1 Eroe Zombie sul Punto di Generazione verde. Questo Punto di Generazione diventa attivo.",
      "Ci hanno incastrati! Quando il segnalino Obiettivo blu viene preso, aprire immediatamente la porta blu e generare 1 Eroe Zombie sul Punto di Generazione blu. Questo Punto di Generazione diventa attivo.",
    ],
  },
  "hr-m8": {
    image: "/mappe/hr-m8.webp",
    elements: [
      { label: "Zona di Partenza dei Supereroi", icon: "/mappe/icone/hr-m8-0.webp" },
      { label: "Carte Passante", icon: "/mappe/icone/hr-m8-1.webp", count: 4 },
      { label: "Zona di Uscita", icon: "/mappe/icone/hr-m8-2.webp" },
      { label: "Obiettivi", icon: "/mappe/icone/hr-m8-3.webp", count: 3 },
      { label: "Punti di Generazione", icon: "/mappe/icone/hr-m8-4.webp", count: 4 },
    ],
    specialRules: [
      "Tecnologia sperimentale. Ogni Obiettivo fornisce 5 PE al Supereroe che lo prende.",
      "Attirare troppa attenzione. Quando il segnalino Obiettivo verde viene preso, il Punto di Generazione verde diventa attivo. Quando il segnalino Obiettivo blu viene preso, il Punto di Generazione blu diventa attivo.",
    ],
  },
};
