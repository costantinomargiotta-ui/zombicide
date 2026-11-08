/**
 * Zombicide 2ª edizione – Missioni del regolamento (ITA), pag. 36–62.
 * Il gioco base non ha una modalità campagna: le 26 Missioni sono indipendenti.
 * Obiettivi riassunti dal testo delle Missioni; i dettagli sono nelle Regole Speciali.
 */
import type { SeriesMission } from '../missionSeries';

export const Z2_TEMPLATE_ID = 'zombicide-2e-missioni';

const m = (n: number, title: string, difficulty: string, duration: string, page: number, tiles: string, inOrder: boolean, objectives: string[]): SeriesMission =>
  ({ id: `z2-m${n}`, code: `M${n}`, title, difficulty, duration, page, tiles: tiles.split(' '), objectivesInOrder: inOrder, objectives });

export const Z2_MISSIONS: SeriesMission[] = [
  m(0, 'Vita da Zombicide (partita introduttiva)', 'Facile', '30 minuti', 36, '1V 3V', true, ["Prendere tutti gli Obiettivi e le Casse di Armi Pimpate, poi raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(1, 'Cittadini isolati', 'Medio', '45 minuti', 37, '1V 2V 3R 4V 5R 6R 7R 8V 9R', true, ['Prendere 1 segnalino Obiettivo con ogni Sopravvissuto.', 'Prendere 3 carte cibo (Sacco di Riso, Cibo in Scatola o Acqua).', "Poi raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(2, 'Zona Y', 'Difficile', '60 minuti', 38, '1V 2V 3V 4R 5V 6R 7V 8V 9R', true, ['Fornire alla squadra tante Armi Pimpate quanti sono i Sopravvissuti.', "Raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(3, 'La 24 ore di Zombie City', 'Medio', '90 minuti', 39, '1V 2V 3R 4V 5V 6R 7R 8V 9V', true, ['Raggiungere il Livello di Pericolo Rosso con almeno 1 Sopravvissuto.']),
  m(4, 'Guida e spara', 'Medio', '90 minuti', 40, '3V 4V 5R 6V 7R 8V', true, ['Usare le Auto per fare esplodere le Zone di Generazione rosse (vedi Regole Speciali).', 'Lanciare una Molotov sulla Zona di Generazione di Partenza.']),
  m(5, 'Colpo grosso', 'Difficile', '90 minuti', 41, '1V 2V 3V 4R 5R 6R 7R 8V 9R', true, ['Aprire tutti gli edifici e prendere almeno 5 Obiettivi, di cui almeno 1 colorato.', "Poi raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(6, 'La fuga', 'Difficile', '90 minuti', 42, '1V 4V 5R 6V 8V 9R', true, ['Radunare 6 carte cibo (Cibo in Scatola, Riso o Acqua).', "Raggiungere l'Uscita con tutti i Sopravvissuti nelle Auto."]),
  m(7, 'Il mattatoio', 'Difficile', '45 minuti', 43, '3V 4V 6V 8V', true, ['Radunare tutti i segnalini di Generazione sulla Zona di Generazione di Partenza.', 'Lanciare una Molotov sulla Zona di Generazione di Partenza.']),
  m(8, 'Polizia zombie', 'Difficile', '30 minuti', 44, '3V 4V 5V 6R 8V 9R', true, ['Prendere gli Obiettivi blu e verde.', "Raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(9, "L'unione fa la forza", 'Medio', '60 minuti', 45, '2V 3V 4V 9R', true, ['Trovare i 3 Compagni.']),
  m(10, 'Il paese è piccolo...', 'Facile', '30 minuti', 46, '1R 2V 5R 7R', false, ['Prendere i 4 Obiettivi.', 'Prendere le 4 Casse di Armi Pimpate.', 'Prendere una Molotov.']),
  m(11, 'Il canale', 'Medio', '30 minuti', 47, '2R 4R 7V 9V', true, ["Raggiungere l'Uscita con tutti i Sopravvissuti, senza Abomini sul tabellone."]),
  m(12, "Incidente d'auto", 'Medio', '60 minuti', 48, '1R 2R 6R 7V 8R 9V', true, ['Portare 6 kit di pronto soccorso ai Sopravvissuti feriti sulla tessera 8R e trasformarli in Compagni.']),
  m(13, 'Strade di fuoco', 'Medio', '45 minuti', 49, '1R 2V 3V 4V 6R 7V', true, ['Lanciare una Molotov su ogni Zona di Generazione rossa.', 'Guidare entrambe le Auto fino alla Zona indicata e bruciarle.']),
  m(14, 'Colazione da Jesse', 'Medio', '45 minuti', 50, '2V 4R 6R 7V 8R 9V', true, ["Reclutare tutti i Compagni e radunare tutti i Sopravvissuti sull'Uscita, senza Zombie."]),
  m(15, 'Difesa comune', 'Medio', '45 minuti', 51, '1R 2R 3V 4R 5R 6R 7R 8V 9R', false, ['Reclutare tutti i Compagni.', "Prendere tutti gli Obiettivi e le Casse di Armi Pimpate nell'edificio tra le tessere 3V e 8V."]),
  m(16, 'Un nuovo rifugio', 'Medio', '45 minuti', 52, '1V 2V 3V 4V', true, ['Barricare le porte sfondate.', "Eliminare gli Zombie rimasti nell'edificio."]),
  m(17, 'La piaga', 'Difficile', '60 minuti', 53, '1R 2R 3R 4V 5V 6R 7V 8R 9R', true, ["Aprire la Piaga (edificio tra 7V, 5V e 4V) e non lasciarvi nessuno Zombie."]),
  m(18, 'La fine della strada', 'Difficile', '60 minuti', 54, '1R 2R 3V 4R 6V 7R', true, ['Prendere tutti gli Obiettivi.']),
  m(19, 'Migliori amici per sempre', 'Difficile', '45 minuti', 55, '2R 3V 4R 6V 7R 9V', false, ['Ogni coppia di Sopravvissuti si è scambiata di ruolo.', 'Un\'Arma Pimpata su ogni Plancia del Sopravvissuto.']),
  m(20, 'Il festival degli zombie', 'Difficile', '45 minuti', 56, '1R 3V 5V 6V 7R 8R', false, ['Prendere tutti gli Obiettivi.', 'Svuotare la riserva di Zombie.']),
  m(21, 'Carico pesante', 'Difficile', '60 minuti', 57, '1V 2V 3V 7R 8R 9R', true, ['Accumulare tutti gli Obiettivi nella Pimpmobile.', "Raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(22, 'Ad alto volume', 'Difficile', '45 minuti', 58, '1R 3R 4R 5V 8V 9V', true, ['Prendere tutti gli Obiettivi.', "Raggiungere l'Uscita con tutti i Sopravvissuti."]),
  m(23, 'Mercy Street', 'Medio', '45 minuti', 59, '1R 2R 3R 6R 7V 9V', true, ['Trovare 4 Compagni.']),
  m(24, 'Velocità di speronamento', 'Difficile', '60 minuti', 60, '1R 2R 3V 4R 5R 6R 7R 8R 9R', true, ['Ottenere tante Armi Pimpate quanti sono i Sopravvissuti.', 'In un solo Round, lanciare Molotov su entrambe le Zone di Generazione non di Partenza e fuggire da lì con tutti i Sopravvissuti nelle Auto.']),
  m(25, 'La Turbomolotov di Ned', 'Difficile', '90 minuti', 62, '1R 2R 4V 7R 8R 9R', true, ["Portare una Molotov, l'Obiettivo blu e l'Obiettivo verde a Ned (tessera 9R).", 'Uccidere il Supabominio con la Turbomolotov di Ned.']),
];
