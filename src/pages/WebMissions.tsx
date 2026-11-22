import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, ChevronDown, ExternalLink, FileText, Globe, Layers, Map, Search, Target } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { AND_MISSIONS, WEB_MISSIONS, WEB_PAGE_ONLY, type WebMission } from '../rules/moderno/webMissions';
import { HowToPlay, MissionMapView } from './missionViews';

const PRODUCT_NAME: Record<string, string> = { 'rio-z-janeiro': 'Rio Z Janeiro', 'washington-zc': 'Washington Z.C.', 'fort-hendrix': 'Fort Hendrix', pariz: 'PariZ' };
const ALL: WebMission[] = [...WEB_MISSIONS, ...WEB_PAGE_ONLY];
const minutes = (m: WebMission) => Number.parseInt(m.duration, 10) || 0;
const needs = (m: WebMission) => [...(m.requires ?? []).map((p) => PRODUCT_NAME[p] ?? p), ...(m.requiresOther ?? [])];
const SOURCE = 'Ricavato dagli obiettivi e dalle regole speciali del PDF ufficiale (in inglese, testo tradotto): in caso di dubbio fa fede il PDF.';

type Tab = 'tutte' | 'base' | 'espansioni';
type Session = { scenarioId?: string; outcome: string };

function played(sessions: Session[] | undefined, id: string) {
  const own = (sessions ?? []).filter((s) => s.scenarioId === id && (s.outcome === 'vittoria' || s.outcome === 'sconfitta'));
  return { played: own.length, wins: own.filter((s) => s.outcome === 'vittoria').length };
}

function diffTone(d: string) {
  return d === 'Medio' ? 'neutral' : d === 'Speciale' ? 'accent' : d === 'Molto difficile' ? 'danger' : 'warn';
}

/** Dettaglio di una Missione web: mappa, scenario, obiettivi, regole e azioni. */
function WebMissionDetail({ m }: { m: WebMission }) {
  const [asking, setAsking] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const extra = needs(m);
  async function mark(outcome: 'vittoria' | 'sconfitta') {
    await repo.recordQuickSession({ universeId: 'moderno', scenarioId: m.id, scenarioTitle: `${m.code} – ${m.title}`, outcome });
    setAsking(false);
    setSaved(outcome === 'vittoria' ? 'Partita registrata come vittoria.' : 'Partita registrata come sconfitta.');
  }
  if (m.pending) {
    return (
      <div className="flex flex-col gap-3 border-t border-[var(--line)] px-3 py-3 text-sm">
        <p>Questa Missione è pubblicata solo come pagina sul sito ufficiale, senza PDF scaricabile. Mappa, obiettivi e regole verranno aggiunti quando avremo il testo (anche una schermata della pagina va bene).</p>
        {extra.length > 0 && <p className="text-[var(--muted)]">Richiede anche: {extra.join(', ')}.</p>}
        <a href={m.web} target="_blank" rel="noreferrer" className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--accent-2)] px-4 py-2 font-semibold text-black"><Globe className="size-4" /> Apri la scheda ufficiale</a>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--line)] px-3 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2 text-[var(--muted)]">
        <Badge tone={extra.length ? 'danger' : 'accent'}>{extra.length ? `Serve ${extra.join(' + ')}` : 'Scatola base'}</Badge>
        <span className="flex items-center gap-1"><Map className="size-4" /> Tessere {m.tiles.join(', ')}</span>
      </div>
      {m.intro && (
        <div>
          <h4 className="title-display text-xl text-[var(--accent-2)]">Scenario</h4>
          <p className="italic">{m.intro}</p>
        </div>
      )}
      <div>
        <h4 className="title-display text-xl text-[var(--accent-2)]">Obiettivi {m.objectivesInOrder ? '(in questo ordine)' : ''}</h4>
        <ol className="list-decimal pl-5">{m.objectives.map((o) => <li key={o}>{o}</li>)}</ol>
      </div>
      <HowToPlay m={m} source={SOURCE} />
      <MissionMapView m={m} />
      <p className="border-l-4 border-[var(--accent-2)] pl-2 text-xs text-[var(--muted)]">Titolo originale; testo tradotto dal PDF ufficiale in inglese con i termini del regolamento italiano (le «Epic Weapon» sono le Armi Pimpate). In caso di dubbio fa fede il PDF.</p>
      <div className="flex flex-wrap gap-2">
        <a href={m.pdf} target="_blank" rel="noreferrer" className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--accent-2)] px-4 py-2.5 font-bold text-black"><FileText className="size-4" /> Apri PDF ufficiale</a>
        {!asking ? (
          <button type="button" onClick={() => { setAsking(true); setSaved(null); }} className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/60 px-4 py-2.5 font-bold"><CheckCircle2 className="size-4" /> Segna come giocata</button>
        ) : (
          <div className="flex flex-1 gap-2">
            <button type="button" onClick={() => mark('vittoria')} className="focus-ring flex-1 rounded-lg bg-green-700 px-3 py-2.5 font-bold text-white">Vinta</button>
            <button type="button" onClick={() => mark('sconfitta')} className="focus-ring flex-1 rounded-lg bg-red-800 px-3 py-2.5 font-bold text-white">Persa</button>
            <button type="button" onClick={() => setAsking(false)} className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2.5">Annulla</button>
          </div>
        )}
      </div>
      {saved && <p role="status" className="text-green-300">{saved} La trovi anche in Statistiche e nelle attività recenti.</p>}
    </div>
  );
}

function MissionRow({ m, sessions, open, onToggle, num, state }: { m: WebMission; sessions?: Session[]; open: boolean; onToggle: () => void; num?: number; state?: 'fatto' | 'prossimo' }) {
  const st = played(sessions, m.id);
  const extra = needs(m);
  return (
    <li id={`missione-${m.id}`} className={`scroll-mt-28 rounded-lg border bg-black/30 ${state === 'prossimo' ? 'border-[var(--accent-2)]' : 'border-[var(--line)]'}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
        <button type="button" onClick={onToggle} aria-expanded={open} className="focus-ring flex min-w-0 basis-full items-center gap-3 text-left sm:basis-0 sm:flex-1">
          {num ? (
            <span className={`title-display grid size-9 shrink-0 place-items-center rounded-full text-lg ${state === 'fatto' ? 'bg-green-700 text-white' : state === 'prossimo' ? 'bg-[var(--accent-2)] text-black' : 'bg-white/10'}`}>{num}</span>
          ) : (
            <span className="title-display min-w-16 shrink-0 rounded-md bg-[var(--accent-2)] px-2 py-0.5 text-center text-lg text-black">{m.code}</span>
          )}
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 font-semibold">
              {m.title}
              {extra.map((x) => <Badge key={x} tone="danger">{x}</Badge>)}
              {m.pending && <Badge>solo pagina web</Badge>}
            </span>
            <span className="block text-xs text-[var(--muted)]">
              {m.pending ? 'Dati da inserire · link alla scheda ufficiale' : [m.difficulty, m.duration, m.survivors].filter(Boolean).join(' · ')}
              {num ? ` · ${m.code}` : ''}
              {' · '}{st.played ? `${st.played} partite, ${st.wins} vittorie` : 'mai giocata'}
            </span>
          </span>
          <ChevronDown className={`size-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        <span className="ml-auto flex items-center gap-2 sm:ml-0">
        {!m.pending && m.difficulty && <span className="hidden sm:inline-flex"><Badge tone={diffTone(m.difficulty)}>{m.difficulty}</Badge></span>}
        <a href={m.pdf ?? m.web} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-1 rounded-md border border-white/50 px-2.5 py-1 text-sm">
          {m.pdf ? <FileText className="size-4" /> : <ExternalLink className="size-4" />} {m.pdf ? 'Apri PDF' : 'Apri scheda'}
        </a>
        </span>
      </div>
      {open && <WebMissionDetail m={m} />}
    </li>
  );
}

/** Campagna A New Dawn: capitoli in ordine con avanzamento (un capitolo conta come superato con almeno una vittoria). */
function NewDawn({ sessions, open, setOpen }: { sessions?: Session[]; open: string | null; setOpen: (id: string | null) => void }) {
  const done = AND_MISSIONS.map((m) => played(sessions, m.id).wins > 0);
  const next = done.findIndex((d) => !d);
  const count = done.filter(Boolean).length;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">Un sopravvissuto rimasto solo cerca altri vivi e sogna di fondare una piccola comunità: il gruppo cresce capitolo dopo capitolo, fino alla resa dei conti con Rod e le Locuste. Da 1 a 6 Sopravvissuti, da giocare in ordine.</p>
      <p className="text-xs tracking-widest text-[var(--muted)] uppercase">Avanzamento · {count} di {AND_MISSIONS.length}</p>
      <div className="h-2 rounded bg-white/10"><div className="h-full rounded bg-[var(--accent-2)]" style={{ width: `${(count / AND_MISSIONS.length) * 100}%` }} /></div>
      <ol className="mt-1 flex flex-col gap-2">
        {AND_MISSIONS.map((m, i) => (
          <MissionRow key={m.id} m={{ ...m, title: m.title.replace('A New Dawn – ', 'Parte ').replace('Part ', '') }} sessions={sessions} num={i + 1} state={done[i] ? 'fatto' : i === next ? 'prossimo' : undefined} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} />
        ))}
      </ol>
    </div>
  );
}

/** Sezione «Missioni web»: missioni gratuite ufficiali di Zombicide 2ª edizione e la campagna A New Dawn. */
export function WebMissionsSection() {
  const sessions = useLiveQuery(() => db.sessions.toArray());
  const linked = new URLSearchParams(window.location.search).get('m');
  const [open, setOpen] = useState<string | null>(linked);
  const [q, setQ] = useState('');
  const [mat, setMat] = useState('');
  const [diff, setDiff] = useState('');
  const [dur, setDur] = useState('');
  const [tab, setTab] = useState<Tab>('tutte');
  const [campaign, setCampaign] = useState(() => AND_MISSIONS.some((m) => m.id === linked));

  const counts = { tutte: ALL.length, base: ALL.filter((m) => !needs(m).length).length, espansioni: ALL.filter((m) => needs(m).length).length };
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return ALL.filter((m) => {
      const ex = needs(m);
      if (tab === 'base' && ex.length) return false;
      if (tab === 'espansioni' && !ex.length) return false;
      if (mat === 'base' && ex.length) return false;
      if (mat && mat !== 'base' && !ex.includes(mat)) return false;
      if (diff && m.difficulty !== diff) return false;
      const n = minutes(m);
      if (dur === 'breve' && !(n > 0 && n <= 45)) return false;
      if (dur === 'media' && n !== 60) return false;
      if (dur === 'lunga' && n < 75) return false;
      if (t && ![m.code, m.title, m.intro ?? '', ...m.objectives].some((x) => x.toLowerCase().includes(t))) return false;
      return true;
    }).sort((a, b) => (Number(b.code.slice(2)) || -1) - (Number(a.code.slice(2)) || -1));
  }, [q, mat, diff, dur, tab]);

  const sel = 'focus-ring rounded-md border border-[var(--line)] bg-black/40 px-2 py-1.5 text-sm';
  return (
    <Panel title="Missioni web · Zombicide 2ª edizione" icon={Globe}>
      <p className="mb-3 text-sm text-[var(--muted)]">Missioni gratuite ufficiali pubblicate su zombicide.com. I PDF sono in inglese: qui trovi mappa, legenda e regole tradotte, con il link al PDF originale.</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <label className="flex min-w-48 flex-1 items-center gap-2 rounded-md border border-[var(--line)] bg-black/40 px-2">
          <Search className="size-4 text-[var(--muted)]" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca una missione…" aria-label="Cerca una missione" className="w-full bg-transparent py-1.5 text-sm outline-none" />
        </label>
        <select value={mat} onChange={(e) => setMat(e.target.value)} aria-label="Materiale" className={sel}>
          <option value="">Materiale</option><option value="base">Solo scatola base</option>
          {['Rio Z Janeiro', 'Washington Z.C.', 'Fort Hendrix', 'PariZ', 'Urban Legends Abomination Pack'].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Difficoltà" className={sel}>
          <option value="">Difficoltà</option>{['Medio', 'Difficile', 'Molto difficile', 'Speciale'].map((x) => <option key={x}>{x}</option>)}
        </select>
        <select value={dur} onChange={(e) => setDur(e.target.value)} aria-label="Durata" className={sel}>
          <option value="">Durata</option><option value="breve">Fino a 45 min</option><option value="media">60 min</option><option value="lunga">75 min e oltre</option>
        </select>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5" role="tablist">
        {([['tutte', `Tutte · ${counts.tutte}`], ['base', `Scatola base · ${counts.base}`], ['espansioni', `Con espansioni · ${counts.espansioni}`]] as [Tab, string][]).map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k && !campaign} onClick={() => { setTab(k); setCampaign(false); }} className={`focus-ring rounded-full border px-3 py-1 text-sm ${tab === k && !campaign ? 'border-[var(--accent-2)] bg-[var(--accent-2)] font-semibold text-black' : 'border-[var(--line)] text-[var(--muted)]'}`}>{label}</button>
        ))}
        <button type="button" role="tab" aria-selected={campaign} onClick={() => setCampaign(true)} className={`focus-ring rounded-full border px-3 py-1 text-sm ${campaign ? 'border-[var(--accent-2)] bg-[var(--accent-2)] font-semibold text-black' : 'border-[var(--line)] text-[var(--muted)]'}`}>A New Dawn · {AND_MISSIONS.length}</button>
      </div>

      {campaign ? (
        <NewDawn sessions={sessions} open={open} setOpen={setOpen} />
      ) : (
        <>
          <ol className="flex flex-col gap-2">
            {list.map((m) => <MissionRow key={m.id} m={m} sessions={sessions} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} />)}
          </ol>
          {list.length === 0 && <p className="py-4 text-center text-sm text-[var(--muted)]">Nessuna missione con questi filtri.</p>}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3 rounded-xl border border-[var(--line)] bg-gradient-to-r from-amber-900/30 to-transparent p-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-[var(--muted)]">CAMPAGNA IN EVIDENZA</p>
              <p className="title-display text-4xl text-[var(--accent-2)]">A New Dawn</p>
              <p className="flex items-center gap-2 text-sm"><Layers className="size-4" /> {AND_MISSIONS.length} capitoli · da 1 a 6 Sopravvissuti</p>
            </div>
            <button type="button" onClick={() => setCampaign(true)} className="focus-ring inline-flex items-center gap-1 rounded-lg bg-[var(--accent-2)] px-4 py-2 font-bold text-black"><Target className="size-4" /> Apri campagna ›</button>
          </div>
        </>
      )}
    </Panel>
  );
}
