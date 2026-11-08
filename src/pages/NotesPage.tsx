import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { NotebookPen, Pin, PinOff, Plus, Trash2 } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { UNIVERSE_IDS, type FreeNote, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { formatDate } from '../lib/format';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { EmptyState } from '../ui/components/EmptyState';
import { Modal } from '../ui/components/Modal';

/** Una nota sparsa nell'app (campagna, scheda, personaggio, collezione, partita), raccolta qui. */
interface LinkedNote { key: string; source: string; title: string; body: string; to: string; universeId?: UniverseId }

function NoteEditor({ note, defaultUniverse, onClose }: { note?: FreeNote; defaultUniverse?: UniverseId; onClose: () => void }) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const [universeId, setUniverseId] = useState<UniverseId | ''>(note?.universeId ?? defaultUniverse ?? '');
  return (
    <div className="hazard-frame">
      <div className="hazard-inner paper flex flex-col gap-2 p-3">
        <input className="rounded border border-black/30 bg-white px-2 py-1 text-lg font-semibold text-black" placeholder="Titolo" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Titolo della nota" autoFocus />
        <textarea className="min-h-40 rounded border border-black/30 bg-white/70 p-2 text-black italic" placeholder="Scrivi qui…" value={body} onChange={(e) => setBody(e.target.value)} aria-label="Testo della nota" />
        <div className="flex flex-wrap items-center gap-2">
          <select className="rounded border border-black/30 bg-white px-2 py-1 text-black" value={universeId} onChange={(e) => setUniverseId(e.target.value as UniverseId | '')} aria-label="Universo">
            <option value="">Tutti gli universi</option>
            {UNIVERSE_IDS.map((u) => <option key={u} value={u}>{UNIVERSES[u].name}</option>)}
          </select>
          <span className="flex-1" />
          <button type="button" className="rounded border border-black/40 px-3 py-1 text-black" onClick={onClose}>Annulla</button>
          <button type="button" className="rounded bg-black px-3 py-1 font-semibold text-white disabled:opacity-40" disabled={!title.trim() && !body.trim()}
            onClick={async () => { await repo.saveNote({ id: note?.id, title: title.trim(), body, universeId: universeId || undefined, pinned: note?.pinned }); onClose(); }}>Salva</button>
        </div>
      </div>
    </div>
  );
}

export function NotesPage() {
  const { universeId } = useScope();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<FreeNote | 'new' | null>(null);
  const [deleting, setDeleting] = useState<FreeNote | null>(null);
  const data = useLiveQuery(async () => {
    const [notes, campaigns, participants, characters, characterNotes, collection, products, sessions] = await Promise.all([
      db.notes.toArray(), db.campaigns.toArray(), db.participants.toArray(), db.characters.toArray(),
      db.characterNotes.toArray(), db.collection.toArray(), db.products.toArray(), db.sessions.toArray(),
    ]);
    const linked: LinkedNote[] = [];
    for (const c of campaigns) if (c.notes?.trim()) linked.push({ key: `c${c.id}`, source: 'Campagna', title: c.name, body: c.notes, to: `/campagne/${c.id}`, universeId: c.universeId });
    for (const p of participants) if (p.notes?.trim()) {
      const ch = characters.find((x) => x.id === p.characterId); const c = campaigns.find((x) => x.id === p.campaignId);
      linked.push({ key: `p${p.id}`, source: 'Scheda campagna', title: `${ch?.name ?? ''} · ${c?.name ?? ''}`, body: p.notes, to: `/campagne/${p.campaignId}/scheda/${p.id}`, universeId: c?.universeId });
    }
    for (const n of characterNotes) if (n.notes?.trim()) {
      const ch = characters.find((x) => x.id === n.characterId);
      linked.push({ key: `n${n.characterId}`, source: 'Sopravvissuto', title: ch?.name ?? n.characterId, body: n.notes, to: `/u/${ch?.universeId ?? 'moderno'}/personaggi?p=${n.characterId}`, universeId: ch?.universeId });
    }
    for (const e of collection) if (e.notes?.trim()) {
      const pr = products.find((x) => x.id === e.productId);
      linked.push({ key: `k${e.productId}`, source: 'Collezione', title: pr?.name ?? e.productId, body: e.notes, to: `/u/${pr?.universeId ?? 'moderno'}/collezione`, universeId: pr?.universeId });
    }
    for (const s of sessions) if (s.notes?.trim()) linked.push({ key: `s${s.id}`, source: 'Partita', title: `${s.scenarioTitle ?? 'Partita'} · ${formatDate(s.playedOn)}`, body: s.notes, to: s.campaignId ? `/campagne/${s.campaignId}` : '/partite', universeId: s.universeId });
    return { notes, linked };
  });
  if (!data) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const inScope = <T extends { universeId?: UniverseId }>(x: T) => !universeId || !x.universeId || x.universeId === universeId;
  const notes = data.notes.filter(inScope).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
  const linked = data.linked.filter(inScope);
  const highlighted = params.get('n');

  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex flex-wrap items-center gap-3 px-4 py-2.5">
        <NotebookPen className="size-8 text-[var(--accent-2)]" aria-hidden />
        <h1 className="title-display flex-1 text-3xl">{universeId ? `Note ${UNIVERSES[universeId].name}` : 'Note'}</h1>
        <button type="button" className="btn btn-accent" onClick={() => setEditing('new')}><Plus className="size-4" /> Nuova nota</button>
      </div>

      {editing && <NoteEditor key={editing === 'new' ? 'new' : editing.id} note={editing === 'new' ? undefined : editing} defaultUniverse={universeId} onClose={() => setEditing(null)} />}

      <Panel title={`Le mie note (${notes.length})`} icon={NotebookPen}>
        {notes.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {notes.map((n) => (
              <article key={n.id} className={`hazard-frame ${highlighted === n.id ? 'ring-4 ring-[var(--accent-2)]' : ''}`}>
                <div className="hazard-inner paper flex h-full flex-col gap-1 p-3">
                  <div className="flex items-start gap-2">
                    <h3 className="flex-1 text-lg font-semibold">{n.title || 'Nota senza titolo'}</h3>
                    <button type="button" onClick={() => repo.saveNote({ ...n, pinned: !n.pinned })} aria-label={n.pinned ? 'Togli in evidenza' : 'Metti in evidenza'} className="text-black/60 hover:text-black">{n.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}</button>
                    <button type="button" onClick={() => setDeleting(n)} aria-label="Elimina nota" className="text-black/60 hover:text-red-700"><Trash2 className="size-4" /></button>
                  </div>
                  <button type="button" onClick={() => setEditing(n)} className="flex-1 text-left whitespace-pre-wrap text-black/80 italic">{n.body || '…'}</button>
                  <p className="text-[11px] text-black/50">{n.pinned ? 'In evidenza · ' : ''}{n.universeId ? `${UNIVERSES[n.universeId].name} · ` : ''}aggiornata il {formatDate(n.updatedAt)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : <EmptyState icon={NotebookPen} title="Nessuna nota" action={<button type="button" className="btn btn-accent" onClick={() => setEditing('new')}><Plus className="size-4" /> Scrivi la prima</button>}>Strategie, regole da ricordare, idee per le prossime partite.</EmptyState>}
      </Panel>

      <Panel title={`Note nelle schede (${linked.length})`} icon={NotebookPen}>
        {linked.length ? (
          <ul className="flex flex-col">
            {linked.map((l) => (
              <li key={l.key}>
                <Link to={l.to} className="flex flex-col gap-0.5 border-b border-white/10 py-2 last:border-0 hover:bg-white/5">
                  <span className="flex items-center gap-2"><span className="rounded bg-white/10 px-1.5 text-xs">{l.source}</span><span className="font-semibold">{l.title}</span></span>
                  <span className="line-clamp-2 text-sm text-[var(--muted)] italic">{l.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-[var(--muted)]">Le note scritte in campagne, schede, sopravvissuti, collezione e partite compariranno qui.</p>}
      </Panel>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Eliminare la nota?" footer={<>
        <button type="button" className="btn" onClick={() => setDeleting(null)}>Annulla</button>
        <button type="button" className="btn btn-danger" onClick={async () => { await repo.deleteNote(deleting!.id); setDeleting(null); if (highlighted) setParams({}); }}><Trash2 className="size-4" /> Elimina</button>
      </>}>
        <p className="text-sm">«{deleting?.title || 'Nota senza titolo'}» verrà eliminata da tutti i dispositivi.</p>
      </Modal>
    </div>
  );
}
