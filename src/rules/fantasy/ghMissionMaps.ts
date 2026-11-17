/** Mappe delle Missioni di Green Horde ritagliate dal regolamento (pag. 40-53), con legenda (icone ufficiali) e regole speciali. */
import type { MissionExtra } from '../moderno/missionMaps';

export const GH_MISSION_EXTRAS: Record<string, MissionExtra> = {
  "gh-m0": {
    image: "/mappe/gh-m0.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m0-0.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/gh-m0-1.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/gh-m0-2.webp" },
      { label: "Porta", icon: "/mappe/icone/gh-m0-3.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m0-4.webp" },
      { label: "Obiettivi (5 PE)", icon: "/mappe/icone/gh-m0-5.webp" },
    ],
    specialRules: [
      "Preparazione:\nMescolare il segnalino Obiettivo verde a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Fari necromantici: Le Zone di Generazione blu e verde sono attive all’inizio della partita. La Zona di Generazione blu è rimossa non appena l’Obiettivo blu viene preso. La Zona di Generazione verde è rimossa non appena l’Obiettivo verde viene preso.",
      "Distruggere il santuario corrotto: Qualsiasi arma d’Assedio (come il Trabucco) può essere usata per bersagliare il segnalino Zona di Generazione rosso, fare fuoco su di esso e rimuoverlo. È considerato all’ultimo posto nell’Ordine di Priorità dei Bersagli e viene rimosso con 1 Danno.",
    ],
  },
  "gh-m1": {
    image: "/mappe/gh-m1.webp",
    elements: [
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m1-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m1-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/gh-m1-2.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m1-3.webp" },
      { label: "Bile di Drago o arma della Cripta", icon: "/mappe/icone/gh-m1-4.webp" },
      { label: "Porta", icon: "/mappe/icone/gh-m1-5.webp" },
    ],
    specialRules: [
      "Preparazione:\nPrendere 4 carte Bile di Drago e mescolarle assieme a 3 carte arma della Cripta casuali. Collocare queste carte a faccia in giù nelle zone indicate. Le carte dal dorso di colore diverso non sono un problema: sta ai Sopravvissuti scegliere!",
      "Componenti alchemiche. Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende.",
      "Quello per cui siamo venuti. Un Sopravvissuto può spendere 1 Azione per prendere una carta nella sua Zona (nello stesso modo in cui prenderebbe un Obiettivo). Poi può riorganizzare gratuitamente il suo inventario.",
    ],
  },
  "gh-m2": {
    image: "/mappe/gh-m2.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m2-0.webp" },
      { label: "Porte", icon: "/mappe/icone/gh-m2-1.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m2-2.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m2-3.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/gh-m2-4.webp" },
    ],
    specialRules: [
      "Preparazione:\nMescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù (per un totale di 7 segnalini Obiettivo). Mescolarli e collocarne 3 sul tabellone, sulle Zone corrispondenti. Mettere da parte i 4 restanti in una pila degli Obiettivi senza rivelarli.",
      "Feticci dell’Orco Necromante. A cosa serviranno? Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende.",
      "Questo sarebbe un Orco Necromante? Ogni volta che un Sopravvissuto uccide un Necromante prende un segnalino Obiettivo dalla pila laterale. Il Sopravvissuto ottiene 5 Punti Esperienza e l’Obiettivo viene rivelato.",
      "La chiave del Necromante. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso.",
      "Uh-oh. I Servitori del Necromante! Quando l’Obiettivo verde viene preso, la Zona di Generazione verde si attiva.",
    ],
  },
  "gh-m3": {
    image: "/mappe/gh-m3.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m3-0.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m3-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/gh-m3-2.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m3-3.webp" },
      { label: "Porte", icon: "/mappe/icone/gh-m3-4.webp" },
    ],
    specialRules: [
      "Preparazione:\nPrendere 10 segnalini Obiettivo, tra cui uno blu e uno verde.\n- Mettere 2 Obiettivi rossi negli edifici chiusi rispettivamente dalle porte blu e verde, come mostrato sulla mappa.\n- Mescolare gli altri Obiettivi a faccia in giù. Metterne 4 a caso nelle altre Zone contrassegnate e formare con gli ultimi 4 una pila speciale a faccia in giù accanto al tabellone.",
      "Forzieri del tesoro. Ogni segnalino Obiettivo fornisce 5 Punti Esperienza e un’arma della Cripta casuale al Sopravvissuto che lo prende.",
      "Riprendiamoci quello che è nostro. Un Sopravvissuto che uccide un Necromante prende un Obiettivo dalla pila, con i benefici corrispondenti (5 Punti Esperienza e un’arma della Cripta casuale).",
      "Porte sigillate. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
    ],
  },
  "gh-m4": {
    image: "/mappe/gh-m4.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m4-0.webp" },
      { label: "Zona della Corrente Fluviale", icon: "/mappe/icone/gh-m4-1.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m4-2.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m4-3.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/gh-m4-4.webp" },
      { label: "Porta", icon: "/mappe/icone/gh-m4-5.webp" },
    ],
    specialRules: [
      "Preparazione:\nMescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù. Poi distribuirli nelle Zone corrispondenti.",
      "Distruggere le esche per gli zombie. Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende.",
      "Interrompere la catena di rifornimento! Quando il segnalino Obiettivo blu o verde viene preso, un segnalino di Generazione di Zombie può essere mosso sulla Zona indicata.",
    ],
  },
  "gh-m5": {
    image: "/mappe/gh-m5.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m5-0.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m5-1.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/gh-m5-2.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m5-3.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/gh-m5-4.webp" },
      { label: "Porte", icon: "/mappe/icone/gh-m5-5.webp" },
    ],
    specialRules: [
      "Preparazione:\nMescolare i segnalini Obiettivo verde e blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.",
      "Scoperta fortunata. Ogni segnalino Obiettivo fornisce 5 Punti Esperienza e un’arma della Cripta casuale al Sopravvissuto che lo prende.",
      "Porte della fortezza. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
      "Allagare il paese. Un qualsiasi Sopravvissuto può usare 3 Azioni per fare fuoco con il Trabucco (senza scegliere nessun bersaglio) e innescare l’inondazione. Per completare la Missione:\n- Tutti gli altri Sopravvissuti devono trovarsi sull’Uscita senza che ci sia nessuno Zombie con loro.\n- Il Sopravvissuto che fa fuoco con il Trabucco deve riuscire a raggiungere la Zona di Uscita nello stesso Turno.",
    ],
  },
  "gh-m6": {
    image: "/mappe/gh-m6.webp",
    elements: [
      { label: "Porta", icon: "/mappe/icone/gh-m6-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m6-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m6-2.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m6-3.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/gh-m6-4.webp" },
    ],
    specialRules: [
      "Preparazione:\nCollocare il segnalino Obiettivo verde a caso tra 4 segnalini Obiettivo rossi, a faccia in giù. Poi rivelare tutti gli Obiettivi.",
      "Munizioni. Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende.",
      "Solo perché sei paranoico… Il segnalino Zona di Generazione verde non può essere rimosso uccidendo un Necromante.",
      "…non significa che non ti diano la caccia. Quando l’Obiettivo verde è preso, la Zona di Generazione verde si attiva.",
      "Allenamento d'assedio. Una volta che tutti gli Obiettivi sono stati presi, qualsiasi Macchina d’Assedio (come il Trabucco) può essere usata per bersagliare i segnalini Zona di Generazione, fare fuoco su di essi e rimuoverli. I segnalini Zona di Generazione sono considerati all’ultimo posto nell’Ordine di Priorità dei Bersagli e vengono rimossi con 1 Danno.",
    ],
  },
  "gh-m7": {
    image: "/mappe/gh-m7.webp",
    elements: [
      { label: "Sito di costruzione del Trabucco", icon: "/mappe/icone/gh-m7-0.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m7-1.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m7-2.webp" },
      { label: "Porta", icon: "/mappe/icone/gh-m7-3.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/gh-m7-4.webp" },
      { label: "Barriera", icon: "/mappe/icone/gh-m7-5.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare il segnalino Obiettivo blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Mettere il segnalino Obiettivo verde nella Zona indicata.",
      "Pezzi del Trabucco (O forse no). Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende. Il segnalino Obiettivo verde non può essere preso.",
      "Che vista! Ricordare che il segnalino Obiettivo verde non può essere preso. Quando tutti e 3 i segnalini Obiettivo rossi (su entrambi i lati) sono stati presi, un Sopravvissuto nella Zona del segnalino Obiettivo verde può spendere un’Azione per costruire un Trabucco (purché la Zona sia priva di Zombie). Poi si sostituisce il segnalino Obiettivo verde con la miniatura di un Trabucco. Il Sopravvissuto ottiene 5 Punti Esperienza.",
      "Oooh come luccica! Oooh, aspetta. Il Sopravvissuto che prende il segnalino Obiettivo blu riceve 2 armi della Cripta casuali (oltre ai 5 Punti Esperienza) e può subito riorganizzare gratuitamente il suo inventario. Inoltre, la Zona di Generazione blu diventa attiva.",
      "Fortificazioni. Le Barriere non possono essere mosse o distrutte tramite mezzi normali. Gli Zombie che beneficiano di Attivazioni Extra in una Zona contenente una Barriera distruggono invece la Barriera (non eseguono un Passo di Movimento o di Attacco). Rimuovere il segnalino.",
    ],
  },
  "gh-m8": {
    image: "/mappe/gh-m8.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m8-0.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m8-1.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m8-2.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/gh-m8-3.webp" },
      { label: "Barriera", icon: "/mappe/icone/gh-m8-4.webp" },
      { label: "Porte", icon: "/mappe/icone/gh-m8-5.webp" },
    ],
    specialRules: [
      "Preparazione:\n- Mescolare il segnalino Obiettivo blu a caso tra i segnalini Obiettivo rossi, a faccia in giù.\n- Collocare 2 Orchi Grassoni, 2 Orchi Corridori e 4 Orchi Deambulanti nella Zona del Trabucco. Questi Zombie vanno ignorati durante il Passo di Attivazione nella Fase degli Zombie finché la porta blu non viene aperta.",
      "Accesso degli Zombie: La Zona di Generazione blu è attiva fin dall’inizio. Soltanto i segnalini Generazione Necromante possono essere rimossi quando un Necromante viene ucciso.",
      "È chiusa a chiave! La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso.",
      "Qui ha combattuto un eroe. Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende. Il Sopravvissuto che prende l’Obiettivo ottiene anche un’arma della Cripta (a sua scelta) e può subito riorganizzare l’inventario gratuitamente.",
      "Spostare le Barriere. Se un Sopravvissuto si trova nella stessa Zona di una Barriera, può spendere 1 Azione per prenderla. La mette sulla sua plancia, ma non occupa uno slot inventario. Alla fine di un’Azione, il Sopravvissuto può posizionare gratuitamente una Barriera in suo possesso lungo un bordo della sua Zona. Alla fine del suo Turno, tutte le Barriere in possesso di un Sopravvissuto devono essere disposte in questo modo.",
      "Bloccare la strada. Le Barriere non possono essere distrutte. Una Zona di Generazione è disattivata quando tutti i suoi accessi sono bloccati dalle Barriere e/o dai muri. Spostare il segnalino Zona di Generazione sulla Zona di Generazione blu. Gli Zombie intrappolati rimangono laggiù finché la via non è di nuovo libera o finché non sono eliminati.",
    ],
  },
  "gh-m9": {
    image: "/mappe/gh-m9.webp",
    elements: [
      { label: "Barriera", icon: "/mappe/icone/gh-m9-0.webp" },
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m9-1.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m9-2.webp" },
      { label: "Porte", icon: "/mappe/icone/gh-m9-3.webp" },
      { label: "Zona di Uscita", icon: "/mappe/icone/gh-m9-4.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m9-5.webp" },
      { label: "Zone di Generazione", icon: "/mappe/icone/gh-m9-6.webp" },
    ],
    specialRules: [
      "Preparazione.\n- Collocare i segnalini Obiettivi verde e blu a caso, a faccia in giù.\n- Mettere 6 armi della Cripta a caso nelle zone contrassegnate, a faccia in giù. Spendere 1 Azione nella Zona per raccogliere la carta.",
      "Scoperta fortunata! Ogni segnalino Obiettivo fornisce 5 Punti Esperienza al Sopravvissuto che lo prende.",
      "Porte barricate. La porta blu non può essere aperta finché il segnalino Obiettivo blu non è stato preso. La porta verde non può essere aperta finché il segnalino Obiettivo verde non è stato preso.",
      "Attirare attenzioni indesiderate. La Zona di Generazione verde rimane inattiva finché l’Obiettivo verde non viene preso.",
      "Barriere massicce. Le Barriere non possono essere distrutte.",
    ],
  },
  "gh-m10": {
    image: "/mappe/gh-m10.webp",
    elements: [
      { label: "Area di partenza dei giocatori", icon: "/mappe/icone/gh-m10-0.webp" },
      { label: "Zona di Generazione", icon: "/mappe/icone/gh-m10-1.webp" },
      { label: "Trabucco", icon: "/mappe/icone/gh-m10-2.webp" },
      { label: "Obiettivo (5 PE)", icon: "/mappe/icone/gh-m10-3.webp" },
      { label: "Dove collocare le Barriere", icon: "/mappe/icone/gh-m10-4.webp" },
      { label: "Porta", icon: "/mappe/icone/gh-m10-5.webp" },
    ],
    specialRules: [
      "Preparazione:\nCollocare un’arma della Cripta a caso a faccia in giù sotto ogni Obiettivo.",
      "Giorno fortunato! Ogni segnalino Obiettivo fornisce al Sopravvissuto che lo prende:\n- 5 Punti Esperienza.\n- La carta arma della Cripta collocata sotto di esso. Il Sopravvissuto può riorganizzare gratuitamente il suo inventario.\n- Una Barriera (vedi “Barriere Mobili”, di seguito).",
      "Barriere Mobili.\n- Le Barriere non possono essere distrutte.\n- Se un Sopravvissuto si trova nella stessa Zona di una Barriera, può spendere 1 Azione per prenderla. La mette sulla sua plancia, ma non occupa uno slot inventario. Alla fine di un’Azione, il Sopravvissuto può posizionare gratuitamente una Barriera in suo possesso lungo un bordo della sua Zona. Alla fine del suo Turno, tutte le Barriere in possesso di un Sopravvissuto devono essere disposte in questo modo.",
    ],
  },
};
