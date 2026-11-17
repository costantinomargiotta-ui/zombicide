/** Mappe delle Missioni di Wulfsburg ritagliate dal regolamento (pag. 11-23), con legenda (icone ufficiali) e regole speciali. */
import type { MissionExtra } from '../moderno/missionMaps';

export const WU_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "wu-m1": {
    image: "/mappe/wu-m1.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m1-0.webp" },
      { label: "Porta", icon: "/mappe/icone/wu-m1-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m1-2.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m1-3.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/wu-m1-4.webp" },
    ],
    specialRules: [
      "Preparazione. Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Segreti sporchi e letali. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende. Chi prende l’Obiettivo blu o quello verde ottiene anche un artefatto della Cripta casuale.",
    ],
  },
  "wu-m2": {
    image: "/mappe/wu-m2.webp",
    elements: [
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m2-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m2-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m2-2.webp" },
      { label: "Porta della Cripta", icon: "/mappe/icone/wu-m2-3.webp" },
      { label: "Porta", icon: "/mappe/icone/wu-m2-4.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/wu-m2-5.webp" },
    ],
    specialRules: [
      "Preparazione. Collocare un artefatto della Cripta casuale nella Cripta.",
      "Trovare gli indizi. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
    ],
  },
  "wu-m3": {
    image: "/mappe/wu-m3.webp",
    elements: [
      { label: "Zona di Uscita", icon: "/mappe/icone/wu-m3-0.webp" },
      { label: "Porta", icon: "/mappe/icone/wu-m3-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m3-2.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m3-3.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m3-4.webp" },
      { label: "Porta della Cripta gialla (si apre con la chiave verde)", icon: "/mappe/icone/wu-m3-5.webp" },
      { label: "Porta della Cripta viola (si apre con la chiave blu)", icon: "/mappe/icone/wu-m3-6.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Cerca, annusa e trova. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende. Quando si prende il segnalino Obiettivo blu o quello verde si genera un Abominio nella Zona. Se un Abominio è già in gioco, chi prende l’Obiettivo colorato in questione genera invece in quella Zona una carta Zombie da consultare al Livello Rosso.",
    ],
  },
  "wu-m4": {
    image: "/mappe/wu-m4.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m4-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m4-1.webp" },
      { label: "Porta", icon: "/mappe/icone/wu-m4-2.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/wu-m4-3.webp" },
    ],
    specialRules: [
      "Esche per zombie. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Sgombrare la strada! La Zona di Generazione blu rappresenta il collo di bottiglia dei Necromanti. Va bloccata una volta per tutte! È attiva all’inizio della partita e può essere rimossa come di consueto usando le regole dei Necromanti.",
    ],
  },
  "wu-m5": {
    image: "/mappe/wu-m5.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m5-0.webp" },
      { label: "Porta", icon: "/mappe/icone/wu-m5-1.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m5-2.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/wu-m5-3.webp" },
    ],
    specialRules: [
      "Le ancore. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Punti deboli. Le Zone di Generazione blu e verde sono attive all’inizio della partita. Non possono essere rimosse quando un Necromante viene ucciso (vedi sotto).",
      "Immortale (?) I Necromanti non aggiungono un segnalino Zona di Generazione del Necromante quando compaiono sul tabellone. Tuttavia, quando si generano attraverso una Zona di Generazione colorata (blu o verde), quel segnalino Zona di Generazione viene sostituito con un segnalino Zona di Generazione del Necromante.",
    ],
  },
  "wu-m6": {
    image: "/mappe/wu-m6.webp",
    elements: [
      { label: "Porta", icon: "/mappe/icone/wu-m6-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m6-1.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m6-2.webp" },
      { label: "Porta della Cripta gialla", icon: "/mappe/icone/wu-m6-3.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m6-4.webp" },
      { label: "Porta della Cripta viola", icon: "/mappe/icone/wu-m6-5.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Una missione pericolosa. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende. Ma attiva anche una Generazione di Zombie nella Zona (ad eccezione dei segnalini Obiettivo blu e verde).",
    ],
  },
  "wu-m7": {
    image: "/mappe/wu-m7.webp",
    elements: [
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m7-0.webp" },
      { label: "Porta", icon: "/mappe/icone/wu-m7-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m7-2.webp" },
      { label: "Porta della Cripta gialla", icon: "/mappe/icone/wu-m7-3.webp" },
      { label: "Porta della Cripta viola", icon: "/mappe/icone/wu-m7-4.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m7-5.webp" },
    ],
    specialRules: [
      "Preparazione. Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Un altro passo verso l’Apocalisse. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende. Chi prende l’Obiettivo blu o verde ottiene anche un artefatto della Cripta casuale.",
      "Ospiti speciali. Solo il segnalino Zona di Generazione del Necromante può essere rimosso quando un Necromante viene ucciso.",
    ],
  },
  "wu-m8": {
    image: "/mappe/wu-m8.webp",
    elements: [
      { label: "Porta", icon: "/mappe/icone/wu-m8-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m8-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m8-2.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m8-3.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/wu-m8-4.webp" },
      { label: "Porta della Cripta", icon: "/mappe/icone/wu-m8-5.webp" },
    ],
    specialRules: [
      "Preparazione. Collocare due artefatti della Cripta casuali nella Cripta.",
      "Splendidi artefatti. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende. Gli fornisce inoltre una carta Equipaggiamento di sua scelta, presa dal mazzo dell’Equipaggiamento o dal mazzo degli scarti dell’Equipaggiamento. Il Sopravvissuto può poi riorganizzare il suo inventario gratuitamente. Poi rimescolare il mazzo.",
    ],
  },
  "wu-m9": {
    image: "/mappe/wu-m9.webp",
    elements: [
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/wu-m9-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m9-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m9-2.webp" },
      { label: "Porta aperta", icon: "/mappe/icone/wu-m9-3.webp" },
    ],
    specialRules: [
      "Preparazione. Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Il tesoro del Necromante. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.\n- Prendere il segnalino Obiettivo verde o blu fornisce anche un artefatto della Cripta di scelta del giocatore.\n- Prendere un segnalino Obiettivo a due facce rosse conferisce anche al Sopravvissuto una carta Equipaggiamento di sua scelta, presa dal mazzo dell’Equipaggiamento o dal mazzo degli scarti dell’Equipaggiamento. Il Sopravvissuto può poi riorganizzare il suo inventario gratuitamente. Poi rimescolare il mazzo.",
      "L’esercito zombie. I segnalini Zona di Generazione non possono essere rimossi. Questo include le Zone di Generazione del Necromante. Una volta che la sesta Zona di Generazione è stata collocata sul tabellone, i Necromanti non compaiono più accompagnati da una Zona di Generazione del Necromante. Tuttavia, la partita è perduta se da allora in poi un Necromante esce dal tabellone!",
    ],
  },
  "wu-m10": {
    image: "/mappe/wu-m10.webp",
    elements: [
      { label: "Porta", icon: "/mappe/icone/wu-m10-0.webp" },
      { label: "Obiettivi (5 PE)", icon: "/mappe/icone/wu-m10-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/wu-m10-2.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/wu-m10-3.webp" },
      { label: "Artefatto della Cripta", icon: "/mappe/icone/wu-m10-4.webp" },
      { label: "Portale dei Necromanti", icon: "/mappe/icone/wu-m10-5.webp" },
    ],
    specialRules: [
      "Preparazione. Collocare un artefatto della Cripta casuale nella Zona indicata.",
      "Chiavi mistiche. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Il portale dei Necromanti. È consentito entrare nella Zona con il segnalino Obiettivo blu solo quando tutti i segnalini Obiettivo rossi sono stati presi.",
    ],
  },
};
