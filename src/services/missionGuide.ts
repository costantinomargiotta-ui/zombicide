import type { MissionExtra } from '../rules/moderno/missionMaps';

/**
 * «Come si gioca»: spiegazione della Missione ricavata SOLO dai dati trascritti dal regolamento
 * (obiettivi, regole speciali, legenda). Nessuna informazione inventata: i consigli scattano
 * soltanto quando il testo delle regole contiene l'elemento a cui si riferiscono.
 */
export interface GuideMission {
  code: string;
  title: string;
  difficulty: string;
  duration: string;
  objectives: string[];
  objectivesInOrder: boolean;
  startTime?: string;
  campaignNotes?: string[];
}

export interface MissionGuide {
  summary: string;
  steps: { title: string; detail?: string }[];
  setup: string[];
  watchOut: string[];
  tips: string[];
  materials: string[];
}

/** Divide "Titolo. Dettaglio" o "Titolo: dettaglio" in due parti. */
function split(text: string) {
  const m = text.match(/^(.{2,90}?[.!?:])\s+(.*)$/s);
  if (!m) return { title: text.trim().replace(/[.]$/, '') };
  const t = m[1].replace(/[.:]$/, '').trim();
  const d = m[2].trim();
  return { title: t, detail: d.charAt(0).toUpperCase() + d.slice(1) };
}

const has = (all: string, re: RegExp) => re.test(all);

export function missionGuide(m: GuideMission, extra?: MissionExtra): MissionGuide {
  const rules = extra?.specialRules ?? [];
  const all = [...m.objectives, ...rules, ...(m.campaignNotes ?? [])].join('\n');
  const steps = m.objectives.map(split);

  const n = m.objectives.length;
  const order = n <= 1 ? 'Un solo obiettivo' : m.objectivesInOrder ? `${n} obiettivi da completare in questo ordine` : `${n} obiettivi da completare in qualsiasi ordine`;
  const LEVEL: Record<string, string> = { Facile: 'facile', Medio: 'media', Media: 'media', Difficile: 'difficile', 'Molto Difficile': 'molto difficile', 'Molto difficile': 'molto difficile', Speciale: 'di difficoltà speciale' };
  const known = (v: string) => !/^(non indicata|–)$/i.test(v.trim());
  const facts = [
    known(m.difficulty) ? `Missione ${LEVEL[m.difficulty] ?? m.difficulty.toLowerCase()}` : '',
    known(m.duration) ? `durata ${m.duration.replace(/^durata /, '')}` : '',
    m.startTime ? `si parte alle ${m.startTime}` : '',
  ].filter(Boolean).join(', ');
  const summary = `${order}.${facts ? ` ${facts.charAt(0).toUpperCase()}${facts.slice(1)}.` : ''}`;

  const setup: string[] = [];
  const watchOut: string[] = [];
  const tips: string[] = [];

  for (const r of rules) {
    const { title, detail } = split(r);
    const body = (detail ?? '').trim();
    if (/^Preparazione/i.test(title)) { setup.push(body || r); continue; }
    if (/elimina(re|ti)? tutti i Personaggi|eliminat[oi]? .*\(nessun tiro Armatura\)/i.test(r)) watchOut.push(`${title}: ${body}`);
    else if (/partita è persa|Missione è persa|Missione fallisce|perdono( immediatamente)? la partita|giocatori perdono/i.test(r)) watchOut.push(`${title}: ${body}`);
    else if (/non (può|possono) essere (apert[ae]|pres[oa]|distrutt[ae]|rimoss[ae])|non può essere aperta|perdono|non (può|possono) muoversi|blocca la Zona/i.test(r) && !/Fintanto che su una (Zona|tessera)/i.test(r)) watchOut.push(`${title}: ${body}`);
  }
  // Condizioni di sconfitta scritte negli obiettivi.
  for (const o of m.objectives) {
    const lose = o.match(/(La partita è persa[^.]*\.|La Missione fallisce[^.]*\.|NOTA: La Missione fallisce[^.]*\.)/);
    if (lose) watchOut.push(lose[1].replace(/^NOTA: /, ''));
  }

  if (has(all, /Molotov/) && has(all, /(distrutt|distrugger|lanciare|usando) una Molotov|con una Molotov|una Molotov su/i)) tips.push('Serve almeno una Molotov: cercatela presto e tenetela da parte per l’obiettivo che la richiede.');
  if (has(all, /Dinamite/)) tips.push('Alcuni obiettivi si completano lanciando Dinamite: procuratevela prima di avvicinarvi.');
  if (has(all, /Bile di Drago/) && has(all, /Fuoco di Drago|Torcia/)) tips.push('Il Fuoco di Drago richiede Bile di Drago e una Torcia: raccoglietele entrambe.');
  if (has(all, /(guidare|guidarla|guidarle|essere guidat)/i) && !has(all, /NON (è|È) consentito guidare|non può essere guidat|Non è consentito guidare/i)) tips.push('Un veicolo si può guidare: usatelo per spostarvi più in fretta, seguendo le regole delle Auto del regolamento base.');
  if (has(all, /(Non è possibile|non è consentito|Non è consentito) Cercare in quella Zona|non è consentito cercare nelle sue Zone|Non è possibile Cercare in quella Zona/i)) tips.push('Finché una carta o un segnalino Obiettivo è in una Zona, lì non si cerca: prendete prima l’Obiettivo, poi cercate e aprite la cassa.');
  if (has(all, /Cass[ae] di Armi Pimpate/) && !tips.some((t) => t.includes('cassa'))) tips.push('Le Casse di Armi Pimpate danno un’Arma Pimpata casuale: sono il modo più rapido per armarsi.');
  if (has(all, /segnalini? Rumore permanent|non vanno rimossi|Non vanno rimossi/i)) tips.push('I segnalini Rumore permanenti attirano gli zombie per tutta la partita: sfruttateli per tenerli lontani dal vostro percorso.');
  if (has(all, /Traguard/)) tips.push('Questa Missione dipende dai Traguardi della campagna: controllate le Schede Campagna prima di preparare il tabellone.');
  if (has(all, /\bNot[ae]\b/) && (extra?.elements ?? []).some((e) => /^Not[ae]|Carte Nota/.test(e.label))) tips.push('Leggete le Note quando la Missione lo chiede: spesso cambiano gli obiettivi o la mappa.');
  if (has(all, /Compagn/)) tips.push('Ci sono Compagni da reclutare o proteggere: teneteli vicini ai Sopravvissuti più forti.');
  if (has(all, /Guardie/) && has(all, /Guardi[ae] (vengono )?eliminat|Guardia è persa|tutte le Guardie/i)) tips.push('Le Guardie vanno protette: tenetele lontane dalle Zone con molti zombie.');
  if (has(all, /Ultrarosso|Ultrarossi|Ultrarossa/)) tips.push('Serve la Modalità Ultrarossa: continuate a uccidere zombie anche dopo il Livello Rosso.');
  if (has(all, /non ci sono (Zombie|Nemici) nella Zona/i)) tips.push('Per fuggire, nella Zona di Uscita non devono esserci nemici alla fine del Turno: ripulitela prima di arrivarci.');

  const materials = (extra?.elements ?? []).filter((e) => e.count).map((e) => `${e.count}× ${e.label}`);

  return { summary, steps, setup, watchOut: [...new Set(watchOut)], tips, materials };
}
