/**
 * Campagna «Catacombe dei Non Morti» (Zombicide: PariZ, espansione a campagna per Zombicide 2ª edizione).
 * Fonte: PariZ – Regole e Missioni (ITA), Missioni pag. 21–34. 10 Missioni per 6 Sopravvissuti, da giocare in ordine,
 * con una scelta tra M4 e M5 nel Primo Interludio. Compagno della campagna: Lorànt Béarn (se muore la campagna è persa).
 * Gli Interludi e l’Epilogo non sono trascritti per non rovinare la storia: si leggono sul libretto.
 * Abilità della Campagna: l’elenco è solo sulla Scheda Campagna (illeggibile nel PDF), quindi resta da inserire.
 */
import type { CampaignAbility, RioMission } from './rioZJaneiro';
import type { MissionExtra } from './missionMaps';

export const PZ_TEMPLATE_ID = 'pariz';

/** Da completare con una foto della Scheda Campagna di PariZ. */
export const PZ_ABILITIES: CampaignAbility[] = [];

export const PZ_MISSIONS: (RioMission & { startTime?: string })[] = [
  { id: 'pz-m1', code: 'M1', title: "Liberté, égalité, fraternité!", difficulty: 'Medio', duration: '90 minuti', page: 21, tiles: ["8R", "31R", "32R", "33R", "34R", "35V"], objectivesInOrder: true, objectives: ["Buon anniversario della Presa della Bastiglia. Prendere tutte le carte Obiettivo.", "Raggiungere la Zona di Uscita con tutti i Sopravvissuti. Un Sopravvissuto può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."], startTime: '7 am' },
  { id: 'pz-m2', code: 'M2', title: "Lorànt, il grande", difficulty: 'Medio', duration: '75 minuti', page: 22, tiles: ["5R", "9R", "29V", "30V", "34V", "35R"], objectivesInOrder: true, objectives: ["Lo so per certo. Portare Lorànt alla vecchia chiesa."], startTime: '1 pm', campaignNotes: ["Sviluppi della storia: se i Sopravvissuti non possiedono il Traguardo BAMBINO PREFERITO, collocare 1 Abominio nella Zona di Generazione di Partenza."] },
  { id: 'pz-m3', code: 'M3', title: "I predatori del… libro perduto!", difficulty: 'Molto Difficile', duration: '90 minuti', page: 23, tiles: ["31V", "32V", "33V"], objectivesInOrder: true, objectives: ["Il sentiero segreto. Trovare 3 simboli Ankh e la Zona di Uscita dalle Catacombe.", "Raggiungere la Zona di Uscita con tutti i Sopravvissuti. Un Sopravvissuto può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."], startTime: '7 pm', campaignNotes: ["Dopo la Missione leggere il Primo Interludio, «La biblioteca nascosta» (pag. 24): se i Sopravvissuti possiedono il Traguardo TOMO ANTICO, tutti ottengono 1 PEC; poi si sceglie se giocare la Missione 4 o la Missione 5."] },
  { id: 'pz-m4', code: 'M4', title: "Inseguite i vostri sogni", difficulty: 'Difficile', duration: '90 minuti', page: 24, tiles: ["9R", "31V", "32V", "33V", "34V", "35R"], objectivesInOrder: true, objectives: ["Raggiungere Villa Delamarre. Trovare un modo per distruggere la Ghigliottina. Dopo aver distrutto la Ghigliottina, TUTTI i Sopravvissuti ottengono 1 PEC.", "Raggiungere la Zona di Uscita con tutti i Sopravvissuti. Un Sopravvissuto può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."], startTime: '1 pm', campaignNotes: ["Si gioca se, nel Primo Interludio, i giocatori scelgono di proseguire nelle Catacombe per raggiungere Villa Delamarre (in alternativa alla Missione 5).", "Distruggere la Ghigliottina: TUTTI i Sopravvissuti ottengono 1 PEC."] },
  { id: 'pz-m5', code: 'M5', title: "I giardini del Lussemburgo", difficulty: 'Difficile', duration: '90 minuti', page: 26, tiles: ["2R", "3V", "31R", "32R", "33R", "35V"], objectivesInOrder: true, objectives: ["Raggiungere Villa Delamarre. Trovare un modo per aprire la Porta Verde.", "Raggiungere la Zona di Uscita con tutti i Sopravvissuti. Un Sopravvissuto può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona. Quando un Sopravvissuto raggiunge la Zona di Uscita, ottiene 1 PEC."], startTime: '2 pm', campaignNotes: ["Si gioca se, nel Primo Interludio, i giocatori scelgono di tornare in superficie e raggiungere Villa Delamarre dalla strada (in alternativa alla Missione 4).", "Ogni Sopravvissuto che raggiunge la Zona di Uscita ottiene 1 PEC."] },
  { id: 'pz-m6', code: 'M6', title: "Ma è tutto vero?", difficulty: 'Difficile', duration: '90 minuti', page: 27, tiles: ["3V", "4V", "9V", "31R", "32R", "35V"], objectivesInOrder: true, objectives: ["Il collezionista. Trovare Delamarre."], startTime: '4 pm', campaignNotes: ["Dopo la Missione leggere il Secondo Interludio, «Cosa fare ora?» (pag. 28)."] },
  { id: 'pz-m7', code: 'M7', title: "Lorànt, l’eroe", difficulty: 'Molto Difficile', duration: '90 minuti', page: 28, tiles: ["31V", "32V", "33V"], objectivesInOrder: false, objectives: ["Sconfiggere i generali. In qualsiasi ordine: trovare Delamarre; eliminare tutti gli Abomini.", "Poi raggiungere la Zona di Uscita con tutti i Sopravvissuti. Un Sopravvissuto può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."], startTime: '7 pm', campaignNotes: ["Sviluppi della storia: se i Sopravvissuti hanno il Traguardo GEMME NASCOSTE, leggere la Nota #1; altrimenti rimuovere Lorànt dalla partita."] },
  { id: 'pz-m8', code: 'M8', title: "La Résistance", difficulty: 'Molto Difficile', duration: '120 minuti', page: 30, tiles: ["1R", "2R", "3R", "29V", "31R", "32R", "33R", "34V", "35R"], objectivesInOrder: false, objectives: ["Cronache di zombie affamati. In qualsiasi ordine: trovare il professor Surat; trovare il laboratorio improvvisato del professore.", "Poi trovare la Zona di Uscita e raggiungerla con tutti i Sopravvissuti. Un Sopravvissuto può fuggire gratuitamente attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."], startTime: '2 pm' },
  { id: 'pz-m9', code: 'M9', title: "Turisti a PariZ", difficulty: 'Molto Difficile', duration: '120 minuti', page: 32, tiles: ["6R", "7R", "29R", "30R", "31R", "32R", "33R", "34R"], objectivesInOrder: true, objectives: ["Vive la Révolution! Trovare un modo per eliminare le Zone di Generazione Blu e Verde.", "Trovare Delamarre."], startTime: '2 pm' },
  { id: 'pz-m10', code: 'M10', title: "Difesa della Torre Eiffel", difficulty: 'Molto Difficile', duration: '90 minuti', page: 33, tiles: ["29R", "30R", "31R", "32R", "33R", "34R"], objectivesInOrder: true, objectives: ["Mantenete la calma e continuate a sparare! Sopravvivere finché non arrivano i rinforzi."], startTime: '1 pm', campaignNotes: ["Al termine della campagna leggere l’Epilogo (pag. 34)."] },
];

/** Traguardi nominati nel regolamento; gli altri arrivano dalle carte Obiettivo e dalle Note. */
export const PZ_KNOWN_MILESTONES = [
  { name: 'BAMBINO PREFERITO', missions: ['pz-m2'] },
  { name: 'TOMO ANTICO', missions: ['pz-m3'] },
  { name: 'GEMME NASCOSTE', missions: ['pz-m7'] },
];

export const PZ_MISSION_EXTRAS: Record<string, MissionExtra> = {
  'pz-m1': {
    image: '/mappe/pz-m1.webp',
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m1-0.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m1-1.webp", count: 6 },
      { label: "Porta Chiusa", icon: "/mappe/icone/pz-m1-2.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/pz-m1-3.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m1-4.webp" },
      { label: "Segnalini Albero", icon: "/mappe/icone/pz-m1-5.webp", count: 6 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m1-6.webp", count: 6 },
      { label: "Note", icon: "/mappe/icone/pz-m1-7.webp", count: 3 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare in modo casuale 6 segnalini Albero come indicato sulla mappa.\n- Collocare 6 Casse di Armi Pimpate come indicato sulla mappa.",
      "Bloccata! La Porta Rossa non può essere aperta.",
      "Procediamo con ordine. Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m2': {
    image: '/mappe/pz-m2.webp',
    elements: [
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m2-0.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m2-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m1-4.webp" },
      { label: "Porte Chiuse", icon: "/mappe/icone/pz-m2-3.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m2-4.webp", count: 6 },
      { label: "Note", icon: "/mappe/icone/pz-m2-5.webp", count: 6 },
    ],
    specialRules: [
      "Preparazione. Collocare 6 Casse di Armi Pimpate come indicato sulla mappa.",
      "Sviluppi della storia. Se i Sopravvissuti non possiedono il Traguardo BAMBINO PREFERITO, collocare 1 Abominio nella Zona di Generazione di Partenza.",
      "Entrate bloccate. Le Porte Rosse non possono essere aperte in alcun modo.",
      "Curiosità scientifica. Lorànt inizia la Missione come un Compagno. Possiede l’Abilità Blu Basso profilo. Deve sopravvivere. Se Lorànt muore, la Missione è persa.",
      "Attenzione! Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m3': {
    image: '/mappe/pz-m3.webp',
    elements: [
      { label: "Zona di Generazione", icon: "/mappe/icone/pz-m3-0.webp" },
      { label: "Cassa di Armi Pimpate", icon: "/mappe/icone/pz-m3-1.webp", count: 1 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m3-2.webp" },
      { label: "Deambulante", icon: "/mappe/icone/pz-m3-3.webp" },
      { label: "Segnalini Esplorazione", icon: "/mappe/icone/pz-m3-4.webp", count: 4 },
      { label: "Note", icon: "/mappe/icone/pz-m3-5.webp", count: 5 },
      { label: "Carte Catacomba", icon: "/mappe/icone/pz-m3-6.webp", count: 6 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m3-7.webp", count: 4 },
    ],
    specialRules: [
      "Preparazione.\n- Mescolare le carte Obiettivo #1-#3 e collocarle sopra la carta Obiettivo #4. Questo è il mazzo degli Obiettivi per questa Missione.\n- Pescare una carta dal mazzo degli Obiettivi e collocarla a faccia in giù nella Zona indicata sulla mappa.\n- Pescare una carta Zombie per la Zona di Generazione di Partenza.\n- Collocare 4 segnalini Esplorazione come indicato sulla mappa.\n- Collocare 3 Deambulanti come indicato sulla mappa.",
      "Caso Studio. Lorànt inizia la Missione come un Compagno. Possiede l’Abilità Blu Basso profilo. Deve sopravvivere. Se Lorànt muore, la Missione è persa.",
      "Come Indy. Quando viene scoperta una nuova tessera, pescare 1 carta Obiettivo dal mazzo degli Obiettivi e collocarla come indicato sulla carta Catacomba.",
      "Luci accese! Applicare le regole del giorno per tutti i fini fino a quando non viene pescata una carta Catacomba.",
      "Lieto fine? Alla fine della Missione, leggere la Nota #5.",
      "Cosa succede qui? Fintanto che in una Zona c’è una carta Obiettivo, non è consentito Cercare in quella Zona."
    ],
  },
  'pz-m4': {
    image: '/mappe/pz-m4.webp',
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m4-0.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m4-1.webp", count: 5 },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m4-2.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/pz-m4-3.webp" },
      { label: "Botole", icon: "/mappe/icone/pz-m4-4.webp", count: 2 },
      { label: "Segnalino Ghigliottina", icon: "/mappe/icone/pz-m4-5.webp" },
      { label: "Porta Aperta", icon: "/mappe/icone/pz-m4-6.webp" },
      { label: "Deambulante", icon: "/mappe/icone/pz-m4-7.webp" },
      { label: "Bruto", icon: "/mappe/icone/pz-m4-8.webp" },
      { label: "Abominio", icon: "/mappe/icone/pz-m4-9.webp" },
      { label: "Maria Antonietta Zombie", icon: "/mappe/icone/pz-m4-10.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m4-11.webp", count: 5 },
      { label: "Note", icon: "/mappe/icone/pz-m4-12.webp", count: 4 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 5 Casse di Armi Pimpate come indicato sulla mappa.\n- Collocare Maria Antonietta Zombie, 1 Abominio e 4 Deambulanti nella stessa Zona in cui si trova il segnalino Ghigliottina.",
      "Teoria e pratica. Lorànt inizia la Missione come un Compagno. Possiede l’Abilità Blu Basso profilo. Deve sopravvivere. Se Lorànt muore, la Missione è persa.",
      "Ghigliottina robusta. La Ghigliottina non può essere eliminata come di consueto. I Sopravvissuti devono trovare un modo per distruggerla.",
      "Mondi diversi. Questa Missione contiene due tabelloni separati. Solo i tabelloni con i Sopravvissuti sono considerati in gioco. Non pescare carte Zombie per le Zone di Generazione o Attivare Zombie su un tabellone senza Sopravvissuti.",
      "Edificio aperto. Non pescare una carta Zombie per la Zona di Oscurità (con la Botola) sulla tessera 34V.",
      "Visuale chiara. Le tessere Catacomba sono considerate diurne a prescindere dall’Orologio.",
      "Controlla prima questo! Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m5': {
    image: '/mappe/pz-m5.webp',
    elements: [
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m5-0.webp", count: 5 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m5-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m1-4.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/pz-m5-3.webp" },
      { label: "Porte Chiuse", icon: "/mappe/icone/pz-m5-4.webp" },
      { label: "Deambulante", icon: "/mappe/icone/pz-m5-5.webp" },
      { label: "Bruto", icon: "/mappe/icone/pz-m5-6.webp" },
      { label: "Segnalini Albero", icon: "/mappe/icone/pz-m5-7.webp", count: 5 },
      { label: "Note", icon: "/mappe/icone/pz-m5-8.webp", count: 4 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m5-9.webp", count: 5 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare in modo casuale 5 segnalini Albero come indicato sulla mappa.\n- Collocare 6 Deambulanti e 2 Bruti come indicato sulla mappa.\n- Collocare 5 Casse di Armi Pimpate come indicato sulla mappa.",
      "Prove ed errori. Lorànt inizia la Missione come un Compagno. Possiede l’Abilità Blu Basso profilo. Deve sopravvivere. Se Lorànt muore, la Missione è persa.",
      "Cancello bloccato. La Porta Verde non può essere aperta.",
      "Una questione di priorità. Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m6': {
    image: '/mappe/pz-m6.webp',
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m6-0.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m6-1.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m6-2.webp", count: 5 },
      { label: "Segnalini Albero", icon: "/mappe/icone/pz-m6-3.webp", count: 5 },
      { label: "Porte Chiuse", icon: "/mappe/icone/pz-m6-4.webp" },
      { label: "Deambulante", icon: "/mappe/icone/pz-m6-5.webp" },
      { label: "Bruto", icon: "/mappe/icone/pz-m6-6.webp" },
      { label: "Note", icon: "/mappe/icone/pz-m6-7.webp", count: 4 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m6-8.webp", count: 5 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare in modo casuale 5 segnalini Albero come indicato sulla mappa.\n- Collocare 3 Deambulanti e 3 Bruti come indicato sulla mappa.\n- Collocare 5 Casse di Armi Pimpate come indicato sulla mappa.",
      "Valutazione dei colleghi. Lorànt inizia la Missione come un Compagno. Possiede l’Abilità Blu Basso profilo. Deve sopravvivere. Se Lorànt muore, la Missione è persa.",
      "Bloccata. La Porta Verde non può essere aperta.",
      "Ospiti di lusso. La Zona di Generazione Blu è attiva dall’inizio della Missione. Ogni volta che viene pescata una carta Zombie per la Zona di Generazione Blu, risolverla a 1 Livello di Pericolo superiore (massimo: Rosso).",
      "I segreti di Delamarre. Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m7': {
    image: '/mappe/pz-m7.webp',
    elements: [
      { label: "Cassa di Armi Pimpate", icon: "/mappe/icone/pz-m7-0.webp", count: 1 },
      { label: "Zona di Generazione", icon: "/mappe/icone/pz-m7-1.webp" },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m7-2.webp" },
      { label: "Segnalini Esplorazione", icon: "/mappe/icone/pz-m7-3.webp", count: 3 },
      { label: "Deambulante", icon: "/mappe/icone/pz-m7-4.webp" },
      { label: "Abominio", icon: "/mappe/icone/pz-m7-5.webp" },
      { label: "Bruto", icon: "/mappe/icone/pz-m7-6.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m7-7.webp", count: 4 },
      { label: "Note", icon: "/mappe/icone/pz-m7-8.webp", count: 4 },
      { label: "Carte Catacomba", icon: "/mappe/icone/pz-m7-9.webp", count: 6 },
    ],
    specialRules: [
      "Preparazione.\n- Mescolare le carte Obiettivo #1-#3 e collocarle sopra la carta Obiettivo #4. Questo è il mazzo degli Obiettivi per questa Missione.\n- Pescare una carta dal mazzo degli Obiettivi e collocarla nella Zona indicata sulla mappa.\n- Collocare 3 segnalini Esplorazione come indicato sulla mappa.\n- Collocare 3 Deambulanti, 4 Bruti e 1 Abominio come indicato sulla mappa.\n- Collocare 1 Cassa di Armi Pimpate come indicato sulla mappa.",
      "Sviluppi della storia. Se i Sopravvissuti hanno il Traguardo GEMME NASCOSTE, leggere la Nota #1. Altrimenti, rimuovere Lorànt dalla partita.",
      "Il primo generale. L’Abominio che inizia la Missione sul tabellone non può essere eliminato in alcun modo. Possiede le seguenti capacità speciali:\n- È considerato una Zona di Generazione.\n- All’inizio di ogni Fase degli Zombie, tutti gli altri Zombie nella sua Zona ottengono 1 Attivazione extra.",
      "Rango elevato. Quando viene pescata una carta Zombie Abominio, non viene generato alcun Abominio. Queste carte forniscono Attivazioni Extra solo per gli Abomini già in gioco. Se non ci sono Abomini sul tabellone quando viene pescata una carta Zombie Abominio, non succede niente.",
      "Il mio tesoro. Se il Sopravvissuto che impugna la Sciabola di Napoleone muore, la Missione è persa.",
      "È sicuro? Fintanto che in una Zona c’è una carta Obiettivo, non è consentito cercare in quella Zona."
    ],
  },
  'pz-m8': {
    image: '/mappe/pz-m8.webp',
    elements: [
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m8-0.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m8-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m8-2.webp" },
      { label: "Porta Chiusa", icon: "/mappe/icone/pz-m8-3.webp" },
      { label: "Segnalini Albero", icon: "/mappe/icone/pz-m8-4.webp", count: 5 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m8-5.webp", count: 6 },
      { label: "Note", icon: "/mappe/icone/pz-m8-6.webp", count: 6 },
    ],
    specialRules: [
      "Preparazione.\n- Mescolare questi 5 segnalini Albero: 1 Corridore, 1 Bruto, 1 Deambulante, 1 Equipaggiamento e 1 Arma Pimpata. Collocarli casualmente nelle Zone indicate sulla mappa.\n- Mettere da parte la miniatura del Bruto con la fisarmonica.\n- Collocare 6 Casse di Armi Pimpate come indicato sulla mappa.",
      "Oltre la barricata. Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m9': {
    image: '/mappe/pz-m9.webp',
    elements: [
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m9-0.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m9-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m1-4.webp" },
      { label: "Porte Chiuse", icon: "/mappe/icone/pz-m9-3.webp" },
      { label: "Segnalini Albero", icon: "/mappe/icone/pz-m9-4.webp", count: 7 },
      { label: "Note", icon: "/mappe/icone/pz-m9-5.webp", count: 3 },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m9-6.webp", count: 6 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare in modo casuale 7 segnalini Albero come indicato sulla mappa.\n- Collocare 6 Casse di Armi Pimpate come indicato sulla mappa.",
      "Linea di zombie. Le Zone di Generazione Blu e Verde sono attive dall’inizio della Missione.",
      "Porte bloccate. La Porta Verde non può essere aperta fino a quando la Zona di Generazione Verde non viene eliminata. La Porta Blu non può essere aperta fino a quando la Zona di Generazione Blu non viene eliminata.",
      "Segreti della Résistance. Fintanto che su una Zona è presente una carta Obiettivo, si applicano le regole seguenti:\n- Non è possibile Cercare in quella Zona.\n- Non è possibile prendere la sua Cassa di Armi Pimpate."
    ],
  },
  'pz-m10': {
    image: '/mappe/pz-m10.webp',
    elements: [
      { label: "Zone di Partenza dei Sopravvissuti", icon: "/mappe/icone/pz-m10-0.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/pz-m10-1.webp" },
      { label: "Casse di Armi Pimpate", icon: "/mappe/icone/pz-m10-2.webp", count: 4 },
      { label: "Porte Aperte", icon: "/mappe/icone/pz-m10-3.webp" },
      { label: "Segnalini Albero", icon: "/mappe/icone/pz-m10-4.webp", count: 8 },
      { label: "Maria Antonietta Zombie", icon: "/mappe/icone/pz-m10-5.webp" },
      { label: "Corridore", icon: "/mappe/icone/pz-m10-6.webp" },
      { label: "Deambulante", icon: "/mappe/icone/pz-m10-7.webp" },
      { label: "Bruto", icon: "/mappe/icone/pz-m10-8.webp" },
      { label: "Zona evidenziata con segnalini Rumore permanenti", icon: "/mappe/icone/pz-m10-9.webp" },
      { label: "Segnalino Ghigliottina", icon: "/mappe/icone/pz-m10-10.webp" },
      { label: "Carte Obiettivo", icon: "/mappe/icone/pz-m10-11.webp", count: 6 },
      { label: "Note", icon: "/mappe/icone/pz-m10-12.webp", count: 8 },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 3 Sopravvissuti in ogni Zona di Partenza dei Sopravvissuti.\n- Collocare in modo casuale 8 segnalini Albero come indicato sulla mappa.\n- Collocare 4 Casse di Armi Pimpate come indicato sulla mappa.\n- Collocare Maria Antonietta Zombie e 7 Deambulanti, 2 Corridori e 1 Bruto come indicato sulla mappa.\n- Collocare 3 segnalini Rumore in ogni Zona evidenziata. Essi sono permanenti e non possono essere rimossi durante la Fase Finale.",
      "Sirena di emergenza. Le Zone evidenziate sono sempre considerate le Zone più rumorose sulla mappa.",
      "Turisti zombie. Alla fine di ogni Fase degli Zombie, collocare 1 Deambulante in ogni Zona di Oscurità all’interno della Torre Eiffel.",
      "Conscience de Classe. Ogni volta che una carta Obiettivo viene rivelata, il Sopravvissuto con meno PA ottiene 5 PA.",
      "Ultima risorsa. Alla fine della Fase dei Giocatori, se ci sono 8 o più Zombie all’interno delle Zone della Torre Eiffel, la Missione è persa."
    ],
  },
};
