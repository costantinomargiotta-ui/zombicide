/** Zombicide: Undead or Alive – Regolamento ITA, pag. 44–55: missioni, mappe ritagliate dal regolamento, legenda (icone ufficiali) e regole speciali. */
import type { SeriesMission } from '../missionSeries';
import type { MissionExtra } from '../moderno/missionMaps';

export const UO_TEMPLATE_ID = "undead-or-alive-missioni";

export const UO_MISSIONS: SeriesMission[] = [
  { id: "uo-m0", code: "M0", title: "Faccia a faccia con gli zombie (partita introduttiva)", difficulty: "Facile", duration: "10 minuti", page: 44, tiles: ["2R", "3R"], objectivesInOrder: false, objectives: ["I vostri primi Zombie. Prendere tutti gli Obiettivi, poi raggiungere l’Uscita con tutti i Sopravvissuti. Un Sopravvissuto può fuggire attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."] },
  { id: "uo-m1", code: "M1", title: "Tutti in carrozza", difficulty: "Facile", duration: "25 minuti", page: 45, tiles: ["1R", "2R", "5V", "8V", "10V", "12V"], objectivesInOrder: true, objectives: ["Dimostrare il proprio valore e salire sul Treno!: prendere 1 Arma Taglia per Ogni Sopravvissuto. Alcune si trovano in città, ma dovrete completare qualche Impresa per completare la raccolta.", "Uscire con Tutti i Sopravvissuti sul Treno. Non devono esserci Zombie sul tabellone."] },
  { id: "uo-m2", code: "M2", title: "Treno zombie", difficulty: "Facile", duration: "35 minuti", page: 46, tiles: ["1R", "2V", "3R", "4R", "5V", "9V", "10R", "11R", "12R"], objectivesInOrder: false, objectives: ["Radunare la banda e far saltare in aria il Treno Zombie: radunare la banda. Reclutare tutti i Compagni e mantenerli in vita.", "Fare saltare in aria il Treno Zombie. Lanciare Dinamite su ogni Zona di Generazione Mobile.", "Mettere l’area in sicurezza. Rendere sicuri tutti i Cumuli di Cadaveri."] },
  { id: "uo-m3", code: "M3", title: "Affari di famiglia", difficulty: "Facile", duration: "35 minuti", page: 47, tiles: ["1V", "3R", "4R", "5V", "6R", "7V", "10R", "11V", "12V"], objectivesInOrder: false, objectives: ["Radunare la banda e schiacciare gli Zombie: radunare la banda. Reclutare tutti i Compagni.", "Schiacciare gli Zombie. Radunare tutti i segnalini Generazione Mobili nella Zona di Generazione di Partenza.", "Poi: Uscire con tutti i Sopravvissuti (e i Compagni) sul Treno. Il Treno non deve uscire dal tabellone avendo Zombie a bordo."] },
  { id: "uo-m4", code: "M4", title: "Pronti a morire", difficulty: "Medio", duration: "45 minuti", page: 48, tiles: ["1R", "2R", "3R", "4R", "5V", "7R", "8V", "9R"], objectivesInOrder: false, objectives: ["Pronti a fare fuoco: guadagnarsi la fiducia dei cittadini. Reclutare i Compagni Cittadini consegnando loro delle munizioni (vedi Regole Speciali).", "Radunare il branco di Zombie. Radunare tutti i segnalini Generazione Mobili nella Zona di Generazione di Partenza.", "Poi: Evacuare. Raggiungere l’Uscita con tutti i Sopravvissuti e tutti i Compagni. Un Sopravvissuto può fuggire attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."] },
  { id: "uo-m5", code: "M5", title: "Uscire dalla città", difficulty: "Medio", duration: "25 minuti", page: 49, tiles: ["1R", "3R", "4R", "5R", "6R", "8V", "10R", "12R"], objectivesInOrder: true, objectives: ["Salvare i cittadini!: salvare 4 Cittadini. 2 di essi si trovano già sul tabellone. Gli altri 2 sono nascosti tra gli Obiettivi rossi. Prendere gli Obiettivi finché non vengono trovati.", "Salire sul Treno! Raggiungere l’Uscita con tutti i Sopravvissuti e tutti i Compagni. Un Sopravvissuto può fuggire attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."] },
  { id: "uo-m6", code: "M6", title: "Far saltare la miniera", difficulty: "Medio", duration: "35 minuti", page: 50, tiles: ["1R", "2R", "3R", "5R", "7R", "8V"], objectivesInOrder: true, objectives: ["Fare saltare la miniera!: distruggere il Carro che blocca il passaggio. Lanciare Dinamite nella Zona del Carro per rimuoverlo.", "Salvare i Pistoleri. Reclutare tutti i Compagni Pistoleri.", "Fare saltare la miniera. Trovare il detonatore (l’Obiettivo blu) e i cavi (l’Obiettivo verde), se non sono già stati trovati. Da quel momento in poi, la banda può far saltare la miniera in qualsiasi momento e vincere la Missione!"] },
  { id: "uo-m7", code: "M7", title: "L’ultima stazione", difficulty: "Difficile", duration: "50 minuti", page: 51, tiles: ["1V", "2V", "3R", "5R", "7V", "9V", "10R", "11R", "12R"], objectivesInOrder: true, objectives: ["Prepararsi a un nuovo viaggio: radunare le scorte nel Carro. Prendere tutti gli Obiettivi e collocarli nel Carro.", "Andarsene da questo posto. Raggiungere l’Uscita con tutti i Sopravvissuti e il Carro. Un Sopravvissuto (assieme al Carro) può fuggire attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."] },
  { id: "uo-m8", code: "M8", title: "I guardiani del fratello", difficulty: "Difficile", duration: "35 minuti", page: 52, tiles: ["1R", "2R", "3R", "4R", "8V", "9V", "10V", "11V", "12V"], objectivesInOrder: false, objectives: ["Presto! Il Treno non aspetta!: caccia al tesoro. Prendere le 3 Armi Taglia nascoste. Possono essere acquisite soltanto prendendo gli Obiettivi.", "Oh-Issa! Muovere il Carro fuori dai binari.", "Un raduno di fedeli. Reclutare i 2 Compagni Fedeli.", "Poi: Non perdere il Treno! Restare a bordo del Treno con tutti i Sopravvissuti e i Compagni finché non esce dal tabellone. Il Treno deve uscire dal tabellone senza nessuno Zombie a bordo, altrimenti la partita è persa."] },
  { id: "uo-m9", code: "M9", title: "Rimboccarsi le maniche", difficulty: "Molto difficile", duration: "50 minuti", page: 54, tiles: ["1R", "2R", "4V", "6R", "8V", "9V", "10R", "11R", "12R"], objectivesInOrder: false, objectives: ["Tutti a bordo del Treno perduto!: radunare qualche anima coraggiosa. Reclutare i Compagni Fedeli e i Compagni Lottatori.", "Ripulire il Treno. Spostare il segnalino Generazione Mobile dal Treno alla Zona di Generazione di Partenza (tessera 9V).", "Rifornire il tender. Prendere i 6 Obiettivi rossi nella Miniera (tessera 8V) e lasciarli cadere nel tender. Vedere le Regole Speciali.", "Poi: Andarsene dalla città. Salire a bordo del Treno con tutti i Sopravvissuti e i Compagni e far partire il Treno. Il Treno deve uscire dal tabellone senza nessuno Zombie a bordo, altrimenti la partita è persa."] },
  { id: "uo-m10", code: "M10", title: "Le colonne della fede", difficulty: "Molto difficile", duration: "35 minuti", page: 55, tiles: ["2R", "3R", "5R", "6R", "8V", "9V"], objectivesInOrder: true, objectives: ["Restaurare la chiesa: trovare il calice e la croce consacrata. Prendere gli Obiettivi blu e verde.", "Dare una mano. Reclutare i 2 Compagni Fedeli.", "Raggiungere l’Uscita con tutti i Sopravvissuti. Un Sopravvissuto, insieme ai suoi Compagni, può fuggire attraverso questa Zona alla fine del suo Turno, fintanto che non ci sono Zombie nella Zona."] },
];

export const UO_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "uo-m0": {
    image: "/mappe/uo-m0.webp",
    elements: [
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m0-0.webp" },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m0-1.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m0-2.webp", count: 2 },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m0-3.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/uo-m0-4.webp" },
      { label: "Bruto", icon: "/mappe/icone/uo-m0-5.webp" },
      { label: "Corridore", icon: "/mappe/icone/uo-m0-6.webp" },
      { label: "Deambulante", icon: "/mappe/icone/uo-m0-7.webp", count: 2 },
    ],
    specialRules: [
      "Preparazione.\n- Il giocatore che ha ricevuto il segnalino Primo Giocatore durante la Preparazione prende una carta Acqua Santa dal mazzo dell’Equipaggiamento, nonché un Equipaggiamento di Partenza aggiuntivo. Può assegnare la carta a qualsiasi Sopravvissuto che controlla.\n- Collocare un Bruto, un Corridore e 2 Deambulanti nelle Zone Indicate.",
      "Quello che Serve. Ogni Obiettivo fornisce 5 PA e l’Arma Taglia in cima al mazzo (se ne rimangono) al Sopravvissuto che lo prende. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "uo-m1": {
    image: "/mappe/uo-m1.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m1-0.webp" },
      { label: "Mitragliatrice Gatling", icon: "/mappe/icone/uo-m1-1.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m1-2.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m1-3.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m1-4.webp", count: 5 },
      { label: "Carro", icon: "/mappe/icone/uo-m1-5.webp" },
    ],
    specialRules: [
      "Preparazione. Collocare l’Obiettivo blu nella Zona indicata.",
      "Arriva il Treno! L’Obiettivo blu non può essere preso. Durante ogni Fase Finale, farlo avanzare di 1 Zona lungo i binari. Una volta uscito dal tabellone, il Treno entra da quello stesso punto (vedi pagina 40).",
      "Che arma! Ogni Obiettivo fornisce 5 PA e l’Arma Taglia in cima al mazzo (se ne rimangono) al Sopravvissuto che lo prende. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
    ],
  },
  "uo-m2": {
    image: "/mappe/uo-m2.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m2-0.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m2-1.webp", count: 4 },
      { label: "Compagni Lottatori", icon: "/mappe/icone/uo-m2-2.webp", count: 4 },
      { label: "Mitragliatrice Gatling", icon: "/mappe/icone/uo-m2-3.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m2-4.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m2-5.webp" },
      { label: "Carro", icon: "/mappe/icone/uo-m2-6.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 4 Compagni Lottatori nella Zona indicata.\n- In questa Missione, il Treno è immobile.",
      "Armi abbandonate. Ogni Obiettivo fornisce 5 PA e l’Arma Taglia in cima al mazzo (se ne rimangono) al Sopravvissuto che lo prende. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
      "Un’arma più grossa! La Mitragliatrice Gatling può essere utilizzata, ma non può essere mossa.",
      "Fare saltare in aria il Treno Zombie. Entrambi i segnalini Generazione Mobili non possono essere spostati utilizzando l’Acqua Santa (o l’Acqua, nel caso dei Sopravvissuti Fedeli). L’unico modo per spostarli sulla Zona di Generazione di Partenza è lanciando la Dinamite nella loro Zona. In quel caso, spostare il segnalino Generazione Mobile sulla Zona di Generazione di Partenza e girare la tessera Treno sul suo lato binari. Ogni Zombie sulla tessera Treno viene eliminato (il Sopravvissuto guadagna i PA corrispondenti). I Sopravvissuti sulla tessera Treno vengono spostati sulla Zona di strada più vicina prima che la tessera venga ricollocata.",
    ],
  },
  "uo-m3": {
    image: "/mappe/uo-m3.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m3-0.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m3-1.webp", count: 6 },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m3-2.webp" },
      { label: "Compagni Fedeli", icon: "/mappe/icone/uo-m3-3.webp", count: 2 },
      { label: "Compagni Pistoleri", icon: "/mappe/icone/uo-m3-4.webp", count: 4 },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m3-5.webp" },
    ],
    specialRules: [
      "Preparazione. Collocare 2 Compagni Fedeli e 4 Compagni Pistoleri nelle Zone indicate.",
      "Bella arma! Ogni Obiettivo fornisce 5 PA e l’Arma Taglia in cima al mazzo (se ne rimangono) al Sopravvissuto che lo prende. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
      "Il Treno aspetta. Non appena tutti i Sopravvissuti (e i Compagni) sono a bordo, il Treno inizia a muoversi (vedi pagina 40). Non si ferma in nessuna circostanza, nemmeno quando un Sopravvissuto scende dal Treno. Non appena raggiunge la Zona di Generazione di Partenza, tutti i segnalini Generazione che essa contiene sono distrutti e rimossi dal gioco.",
    ],
  },
  "uo-m4": {
    image: "/mappe/uo-m4.webp",
    elements: [
      { label: "Zona di Uscita", icon: "/mappe/icone/uo-m4-0.webp" },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m4-1.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m4-2.webp", count: 7 },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m4-3.webp" },
      { label: "Compagni Cittadini", icon: "/mappe/icone/uo-m4-4.webp", count: 4 },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m4-5.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 4 Compagni Cittadini nelle Zone indicate.\n- Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Ricarica! Per reclutare un Cittadino (vedi pagina 42) è necessario anche scartare una carta Munizioni a Volontà (di qualsiasi tipo), oppure l'Obiettivo blu o l’Obiettivo verde.",
      "Munizioni? Ogni Obiettivo fornisce 5 Punti Adrenalina al Sopravvissuto che lo prende.\n- Gli Obiettivi rossi conferiscono anche l’Arma Taglia in cima al mazzo (se ne rimangono). Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.\n- L’Obiettivo blu e l’Obiettivo verde sono considerati munizioni con cui reclutare il Cittadino. Collocare il segnalino Obiettivo sulla Plancia del Sopravvissuto. Non occupa uno slot inventario e può essere scambiato come una carta Equipaggiamento.",
    ],
  },
  "uo-m5": {
    image: "/mappe/uo-m5.webp",
    elements: [
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m5-0.webp", count: 6 },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m5-1.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m5-2.webp" },
      { label: "Mitragliatrice Gatling", icon: "/mappe/icone/uo-m5-3.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m5-4.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/uo-m5-5.webp" },
      { label: "Compagni Cittadini distribuiti tra 3 Balconate", icon: "/mappe/icone/uo-m5-6.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Distribuire 2 Cittadini casuali tra le 3 Balconate. Scegliere le Balconate casualmente. Mettere da parte le Schede Identità corrispondenti.",
      "Eccoli lì! Ogni Obiettivo fornisce 5 PA al Sopravvissuto che lo prende. Se il Sopravvissuto prende l’Obiettivo blu o verde, ottiene anche un Compagno Cittadino (vedi pagina 42). Prendere la Scheda Identità corrispondente. Il Sopravvissuto diventa il suo Leader.",
      "Un Treno immobile, armato. La Mitragliatrice Gatling può essere utilizzata ma non può essere mossa. Il Treno è immobile.",
    ],
  },
  "uo-m6": {
    image: "/mappe/uo-m6.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m6-0.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m6-1.webp", count: 5 },
      { label: "Compagni Pistoleri", icon: "/mappe/icone/uo-m6-2.webp", count: 4 },
      { label: "Nessun Segnalino Obiettivo", icon: "/mappe/icone/uo-m6-3.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m6-4.webp" },
      { label: "Carro", icon: "/mappe/icone/uo-m6-5.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m6-6.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 4 Compagni Pistoleri nella Zona indicata.\n- Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- NON collocare nessun segnalino Obiettivo nella Miniera (tessera 8V).",
      "Guardate cosa ho trovato! Ogni Obiettivo fornisce 5 PA e l’Arma Taglia in cima al mazzo (se ne rimangono) al Sopravvissuto che lo prende. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
      "Mantenere la posizione! La Zona di Generazione Abominio resta inattiva fintanto che i Pistoleri si trovano nella Zona della miniera (anche se viene generato un Abominio). Non appena un singolo Pistolero è stato reclutato, la Zona di Generazione Abominio torna a funzionare normalmente (diventa attiva se un Abominio si trova già sul tabellone).",
      "Il Carro è incastrato. Non è possibile entrare nella Zona che contiene il Carro e il Carro non può essere mosso. Il Carro può essere distrutto lanciando Dinamite nella sua Zona. In quel caso, il Carro viene rimosso e la Zona torna a funzionare normalmente.",
    ],
  },
  "uo-m7": {
    image: "/mappe/uo-m7.webp",
    elements: [
      { label: "Zone di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m7-0.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m7-1.webp", count: 8 },
      { label: "Compagni Fedeli", icon: "/mappe/icone/uo-m7-2.webp", count: 2 },
      { label: "Compagni Cittadini", icon: "/mappe/icone/uo-m7-3.webp", count: 4 },
      { label: "Zona di Uscita", icon: "/mappe/icone/uo-m7-4.webp" },
      { label: "Carro", icon: "/mappe/icone/uo-m7-5.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m7-6.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m7-7.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Suddividere i Sopravvissuti nel modo più uniforme possibile tra le 3 Zone di Partenza.\n- Collocare 2 Compagni Fedeli e 4 Compagni Cittadini nelle Zone indicate.\n- Ogni Zona Obiettivo riceve 2 segnalini Obiettivo casuali. Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- In questa Missione, il Treno è immobile.",
      "Abiti, attrezzatura da viaggio e armi. Ogni Obiettivo fornisce 5 PA al Sopravvissuto che lo prende. Collocare il segnalino Obiettivo sulla Plancia del Sopravvissuto. Occupa uno slot nell’inventario e può essere scambiato come una carta Equipaggiamento. Gli Obiettivi rossi forniscono anche l’Arma Taglia in cima al mazzo (se ne rimangono). Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
      "Carro itinerante. Un Sopravvissuto che si trova nella Zona del Carro può spendere 1 Azione per collocare tutti gli Obiettivi nel suo inventario sul Carro. Collocare i segnalini Obiettivo sul Carro. Si muovono assieme al Carro e non possono essere ripresi.",
    ],
  },
  "uo-m8": {
    image: "/mappe/uo-m8.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m8-0.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m8-1.webp", count: 5 },
      { label: "Compagni Fedeli", icon: "/mappe/icone/uo-m8-2.webp", count: 2 },
      { label: "Carro", icon: "/mappe/icone/uo-m8-3.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m8-4.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m8-5.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 2 Compagni Fedeli casuali nelle Zone indicate. Mettere da parte le Schede Identità corrispondenti.\n- Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Mettere da parte 3 Armi Taglia casuali. Non possono essere acquisite tramite le Imprese.",
      "Setacciare il vicinato. Ogni Obiettivo fornisce 5 PA al Sopravvissuto che lo prende. Ogni Obiettivo rosso fornisce 1 Arma Taglia casuale delle 3 messe da parte durante la Preparazione. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
      "Togliere il Carro dai binari prima che arrivi il Treno! Non appena gli Obiettivi blu E verde sono stati presi, il Treno entra sul tabellone (vedi pagina 40). Se il Carro si trova ancora sui binari in quel momento, la partita è persa.",
    ],
  },
  "uo-m9": {
    image: "/mappe/uo-m9.webp",
    elements: [
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m9-0.webp", count: 9 },
      { label: "Compagni Fedeli", icon: "/mappe/icone/uo-m9-1.webp", count: 2 },
      { label: "Compagni Lottatori", icon: "/mappe/icone/uo-m9-2.webp", count: 4 },
      { label: "Mitragliatrice Gatling", icon: "/mappe/icone/uo-m9-3.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m9-4.webp" },
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m9-5.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m9-6.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 2 Compagni Fedeli e 4 Compagni Lottatori nella Zona indicata.\n- Collocare 6 segnalini Obiettivo nella Miniera sulla tessera 8V. Rappresentano i sacchi di carbone con cui riempire il tender.",
      "Armerie private. Ogni Obiettivo, tranne i sacchi di carbone, fornisce 5 PA e l’Arma Taglia in cima al mazzo (se ne rimangono) al Sopravvissuto che lo prende. Il Sopravvissuto può riorganizzare il suo inventario gratuitamente.",
      "La MIA Gatl… La nostra Gatling, volevo dire. La Mitragliatrice Gatling può essere utilizzata, ma si muove soltanto assieme al Treno.",
      "Sacchi di carbone. Gli Obiettivi rossi nella Miniera (tessera 8V) sono grossi e pesanti sacchi di carbone.\n- I sacchi di carbone possono essere presi soltanto dai Sopravvissuti che hanno almeno 1 Compagno Lottatore. Non forniscono PA quando vengono presi. Ogni Compagno Lottatore può trasportare solo un singolo sacco di carbone alla volta, che sarà collocato sulla Scheda Identità del Compagno. Questi segnalini possono essere scambiati assieme al relativo Compagno Lottatore.\n- Non è consentito prendere un sacco di carbone se c'è una Zona di Generazione Abominio attiva e/o Zombie nella miniera.",
      "Attizza la fiamma. Un Sopravvissuto che si trova nella Zona del tender o in una qualsiasi Zona adiacente può spendere 1 Azione per collocare TUTTI gli Obiettivi trasportati dai suoi Compagni Lottatori nel tender. Non possono essere ripresi. Il Sopravvissuto guadagna 5 PA per ogni Obiettivo che lascia cadere nel tender.",
      "Il Treno è pronto! Una volta che i 6 sacchi di carbone sono nel tender, un qualsiasi Sopravvissuto che si trovi nella cabina della locomotiva può spendere 1 Azione per far partire il Treno (vedi pagina 40). Una volta partito, il Treno non può più essere fermato e si muove normalmente.",
    ],
  },
  "uo-m10": {
    image: "/mappe/uo-m10.webp",
    elements: [
      { label: "Zona di Partenza dei Sopravvissuti", icon: "/mappe/icone/uo-m10-0.webp" },
      { label: "Obiettivi (5 PA)", icon: "/mappe/icone/uo-m10-1.webp", count: 4 },
      { label: "Zone di Generazione", icon: "/mappe/icone/uo-m10-2.webp" },
      { label: "Compagni Fedeli", icon: "/mappe/icone/uo-m10-3.webp", count: 2 },
      { label: "Nessun Segnalino Obiettivo", icon: "/mappe/icone/uo-m10-4.webp" },
      { label: "Segnalino Rumore", icon: "/mappe/icone/uo-m10-5.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare 2 Compagni Fedeli nella Zona indicata.\n- Mescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- NON collocare nessun segnalino Obiettivo nella Miniera (tessera 8V).",
      "Questo ci procurerà una ricompensa nell’aldilà? Ogni Obiettivo fornisce 5 PA al Sopravvissuto che lo prende. Importante! I Fedeli non possono essere reclutati finché gli Obiettivi blu e verde non sono stati presi.",
    ],
  },
};
