import type { SeriesMission } from '../missionSeries';

/**
 * Wulfsburg (espansione di Black Plague) – Missioni aggiuntive, Regolamento ITA pag. 11–23.
 * Missioni indipendenti, da giocare con Black Plague + Wulfsburg.
 */
export const WU_TEMPLATE_ID = 'wulfsburg-missioni';

const m = (n: number, title: string, difficulty: string, duration: string, page: number, tiles: string, inOrder: boolean, objectives: string[]): SeriesMission =>
  ({ id: `wu-m${n}`, code: `M${n}`, title, difficulty, survivors: '6', duration, page, tiles: tiles.split(' '), objectivesInOrder: inOrder, objectives });

export const WU_MISSIONS: SeriesMission[] = [
  m(1, 'Benvenuti a Wulfsburg', 'Facile', '60 minuti', 11, '1V 3V 5R 6V 8V 10V', true, ['Raccogliere tutto ciò che serve per la spedizione punitiva: prendere tutti gli Obiettivi.', 'Raggiungere la città interna: raggiungere la Zona di Uscita con tutti i Sopravvissuti.']),
  m(2, 'Conosci il tuo nemico', 'Medio', '90 minuti', 12, '1R 4R 6R 9V 10V 11R', true, ['Trovare un indizio: prendere tutti gli Obiettivi.', "Raggiungere l'uscita: raggiungere la Zona di Uscita con tutti i Sopravvissuti."]),
  m(3, 'I Gemelli Malvagi', 'Medio', '120 minuti', 13, '2R 3V 4V 5V 6R 7R 9V 10V 11V', true, ['Caccia ai mostri: prendere tutti gli Obiettivi.', "Raggiungere l'uscita: raggiungere la Zona di Uscita con tutti i Sopravvissuti, senza Abomini in gioco."]),
  m(4, "L'imboscata", 'Medio', '90 minuti', 15, '3V 5R 8R 9V 10V 11V', true, ['Distruggere le esche: prendere tutti gli Obiettivi (in qualsiasi ordine con il successivo).', 'Mettere in sicurezza la via d\'uscita: rimuovere la Zona di Generazione blu uccidendo i Necromanti.', 'Poi portare almeno un Sopravvissuto in ogni torre delle tessere 10V e 11V.']),
  m(5, 'Immortale', 'Medio', 'Speciale', 16, '1V 3V 6R 8V 10V 11R', true, ['Distruggere le ancore: prendere tutti gli Obiettivi.', 'Epurare il male: nessuna Zona di Generazione colorata e nessun Necromante sul tabellone.']),
  m(6, 'Corte degli zombie', 'Difficile', 'Speciale', 17, '1R 3V 6V 9V 10V 11R', true, ['Prendere la corona e lo scettro: trovare i segnalini Obiettivo blu e verde.']),
  m(7, 'Rosso sangue', 'Medio', '180 minuti', 18, '2R 3V 6R 9V 10V 11R', true, ['Dipingilo di rosso: portare ogni Sopravvissuto ai livelli Ultrarossi (Modalità Ultrarossa, pag. 10).']),
  m(8, 'La porta fantasma', 'Difficile', '150 minuti', 19, '1R 2R 3V 5R 6V 7V 8R 9V 10R', true, ['Reclamare il potere: portare almeno un Sopravvissuto al Livello di Pericolo Rosso.', 'Attraverso la Porta Fantasma: raggiungere la Zona di Uscita con un Sopravvissuto al Livello Rosso.']),
  m(9, "L'esercito zombie", 'Difficile', '120 minuti', 21, '1V 6R 9V 10R', true, ['Affrontare un esercito di zombie: vincere quando il mazzo degli Zombie è esaurito e non resta nessuno Zombie sul tabellone.']),
  m(10, 'Una moneta per il traghettatore', 'Difficile', '180 minuti', 22, '1R 2R 3V 4R 5R 6R 7V 8R 10R', true, ['Distruggere il portale dei Necromanti: prendere il segnalino Obiettivo blu.']),
];
