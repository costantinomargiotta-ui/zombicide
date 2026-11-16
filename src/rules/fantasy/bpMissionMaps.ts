/** Mappe delle Missioni di Black Plague ritagliate dal regolamento (pag. 38-50), con legenda (icone ufficiali) e regole speciali. */
import type { MissionExtra } from '../moderno/missionMaps';

export const BP_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "bp-m0": {
    image: "/mappe/bp-m0.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m0-0.webp" },
      { label: "Deambulante", icon: "/mappe/icone/bp-m0-1.webp" },
      { label: "Corridore", icon: "/mappe/icone/bp-m0-2.webp" },
      { label: "Grassone", icon: "/mappe/icone/bp-m0-3.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/bp-m0-4.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/bp-m0-5.webp" },
      { label: "Obiettivi (5 PE)", icon: "/mappe/icone/bp-m0-6.webp" },
      { label: "Porta aperta", icon: "/mappe/icone/bp-m0-7.webp" },
      { label: "Porte", icon: "/mappe/icone/bp-m0-8.webp" },
      { label: "Porta della Cripta", icon: "/mappe/icone/bp-m0-9.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mettere da parte le carte Zombie Necromante.\n- Mescolare il segnalino Obiettivo verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un Deambulante, un Grassone e un Corridore nelle Zone indicate.",
      "Non credo proprio. Gli Abomini sono considerati Grassoni quando si consultano le carte Zombie.",
      "Questo cos’è? Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Porte e chiavi. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
      "Noi possiamo passare. La Zona di Generazione verde rimane inattiva finché il segnalino Obiettivo verde non viene preso.",
    ],
  },
  "bp-m1": {
    image: "/mappe/bp-m1.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m1-0.webp" },
      { label: "Porte delle Cripte", icon: "/mappe/icone/bp-m1-1.webp" },
      { label: "Porta", icon: "/mappe/icone/bp-m1-2.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m1-3.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m1-4.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare il segnalino Obiettivo blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Alla ricerca del laboratorio. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Al rogo! Trovare l’Obiettivo blu significa avere scoperto l’ubicazione del laboratorio! Un Necromante viene immediatamente generato nella Zona. Se un Necromante è già presente sul tabellone, viene generato invece un Abominio. Se entrambi sono già presenti sul tabellone, non accade nulla (ma il Sopravvissuto ottiene comunque i punti esperienza).",
    ],
  },
  "bp-m2": {
    image: "/mappe/bp-m2.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m2-0.webp" },
      { label: "Porte delle Cripte", icon: "/mappe/icone/bp-m2-1.webp" },
      { label: "Porte", icon: "/mappe/icone/bp-m2-2.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/bp-m2-3.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m2-4.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Chiavi perdute che aprono porte proibite. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Ma che...? Una trappola magica! La Zona di Generazione verde rimane inattiva finché il segnalino Obiettivo verde non viene preso.",
      "Porte e chiavi. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
    ],
  },
  "bp-m3": {
    image: "/mappe/bp-m3.webp",
    elements: [
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m3-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m3-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m3-2.webp" },
      { label: "Porte delle Cripte", icon: "/mappe/icone/bp-m3-3.webp" },
      { label: "Porta", icon: "/mappe/icone/bp-m3-4.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Popolani nascosti. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Questi sono contaminati! Il segnalino Obiettivo blu e quello verde rappresentano dei popolani contaminati che sono diventati Zombie! Forniscono punti esperienza, ma poi si risolve immediatamente una generazione di Zombie nella Zona del segnalino Obiettivo.",
    ],
  },
  "bp-m4": {
    image: "/mappe/bp-m4.webp",
    elements: [
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m4-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m4-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m4-2.webp" },
      { label: "Porta della Cripta (si apre con la chiave blu)", icon: "/mappe/icone/bp-m4-3.webp" },
      { label: "Porta", icon: "/mappe/icone/bp-m4-4.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare il segnalino Obiettivo blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale nella Cripta.",
      "Candele, abiti, utensili di ferro… Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "… chiavi! Le porte della Cripta gialla non possono essere aperte finché il segnalino Obiettivo blu non è stato preso.",
    ],
  },
  "bp-m5": {
    image: "/mappe/bp-m5.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m5-0.webp" },
      { label: "Porte delle Cripte", icon: "/mappe/icone/bp-m5-1.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/bp-m5-2.webp" },
      { label: "Porte", icon: "/mappe/icone/bp-m5-3.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m5-4.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m5-5.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Indizi nascosti. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Porte rinforzate. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
    ],
  },
  "bp-m6": {
    image: "/mappe/bp-m6.webp",
    elements: [
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m6-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m6-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m6-2.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/bp-m6-3.webp" },
      { label: "Porte delle Cripte", icon: "/mappe/icone/bp-m6-4.webp" },
      { label: "Porte", icon: "/mappe/icone/bp-m6-5.webp" },
    ],
    specialRules: [
      "I Necromanti hanno allestito la scena. Molto promettente!\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare due artefatti della Cripta casuali nella Cripta gialla.",
      "Scritte in latino. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Le porte dell’oscurità e della morte. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
    ],
  },
  "bp-m7": {
    image: "/mappe/bp-m7.webp",
    elements: [
      { label: "Porta", icon: "/mappe/icone/bp-m7-0.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/bp-m7-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m7-2.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m7-3.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m7-4.webp" },
      { label: "Porta della Cripta gialla (si apre con la chiave verde)", icon: "/mappe/icone/bp-m7-5.webp" },
      { label: "Porta della Cripta viola (si apre con la chiave blu)", icon: "/mappe/icone/bp-m7-6.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare un artefatto della Cripta casuale in ogni Cripta.",
      "Scritte sacrileghe. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Porte rinforzate. Entrambe le porte della cripta Viola non possono essere aperte finché il segnalino Obiettivo blu non è stato preso. La singola porta della Cripta gialla non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
    ],
  },
  "bp-m8": {
    image: "/mappe/bp-m8.webp",
    elements: [
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m8-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m8-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m8-2.webp" },
      { label: "Abominio", icon: "/mappe/icone/bp-m8-3.webp" },
      { label: "Porta", icon: "/mappe/icone/bp-m8-4.webp" },
      { label: "Porta della Cripta viola (si apre con la chiave blu)", icon: "/mappe/icone/bp-m8-5.webp" },
      { label: "Porta della Cripta gialla (si apre con la chiave verde)", icon: "/mappe/icone/bp-m8-6.webp" },
      { label: "2 artefatti della Cripta", icon: "/mappe/icone/bp-m8-7.webp" },
      { label: "Bile di Drago + Torcia", icon: "/mappe/icone/bp-m8-8.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare i segnalini Obiettivo blu e verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Mettere da parte le carte Bile di Drago e Torcia. Mettere una carta Bile di Drago e una carta Torcia nella Cripta gialla.\n- Collocare due artefatti della Cripta casuali nella Cripta viola.",
      "Distruggere gli idoli maledetti. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Depositi delle armi. La porta della cripta Viola non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta della Cripta gialla non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
    ],
  },
  "bp-m9": {
    image: "/mappe/bp-m9.webp",
    elements: [
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m9-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m9-1.webp" },
      { label: "Porta", icon: "/mappe/icone/bp-m9-2.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m9-3.webp" },
      { label: "La Voragine Infernale", icon: "/mappe/icone/bp-m9-4.webp" },
    ],
    specialRules: [
      "Ecco a cosa serve l’alchimia. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende. Inoltre consente al giocatore di cercare una carta Bile di Drago nel mazzo dell’Equipaggiamento e di assegnarla al Sopravvissuto gratuitamente. Se non ci sono carte Bile di Drago nel mazzo dell’Equipaggiamento, cercare nel mazzo degli scarti. Poi mescolare il mazzo dell’Equipaggiamento.",
    ],
  },
  "bp-m10": {
    image: "/mappe/bp-m10.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/bp-m10-0.webp" },
      { label: "Porta della Cripta", icon: "/mappe/icone/bp-m10-1.webp" },
      { label: "Abominio", icon: "/mappe/icone/bp-m10-2.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/bp-m10-3.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/bp-m10-4.webp" },
      { label: "Porta", icon: "/mappe/icone/bp-m10-5.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare il segnalino Obiettivo blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Mettere da parte tutte le carte Bile di Drago. Collocarle nella Cripta viola.\n- Collocare un Abominio nella Zona indicata.\n- La Zona dell’edificio a nordest è volutamente priva di porte.",
      "Tre sigilli. Ogni segnalino Obiettivo fornisce 5 punti esperienza al Sopravvissuto che lo prende.",
      "Qui è morto un eroe. Il segnalino Obiettivo blu fornisce un artefatto della Cripta casuale al Sopravvissuto che lo prende.",
      "Porta sigillata. La porta della Cripta viola non può essere aperta finché tutti i segnalini Obiettivo non sono stati presi.",
    ],
  },
};
