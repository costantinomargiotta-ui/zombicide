import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SurvivorList } from '../../ui/components/SurvivorList';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, ArrowLeft, Check, Minus, Plus, Skull, Star, Swords, Trash2, X } from 'lucide-react';
import { StoredImage } from '../../ui/components/StoredImage';
import { defaultPortraitUrl } from '../../domain/portraits';
import { db } from '../../data/db';
import { bonusSpent, rioRepo, sheetFor } from '../../data/rioRepository';
import {
  BONUS_ACTION_SLOTS, CAMPAIGN_ABILITIES, KNOWN_MILESTONES, PEC_MAX, PEC_MILESTONES, RIO_SOURCES, type RewardChoice,
} from '../../rules/moderno/rioZJaneiro';
import { EmptyState } from '../../ui/components/EmptyState';
import { LevelChip } from '../CharactersPage';
import { Portrait, useRioData } from './RioCampaign';

const REWARD_TEXT = '+1 Azione Bonus OPPURE +1 Abilità della Campagna';

function SheetBox({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`hazard-frame ${className}`}>
      <div className="hazard-inner paper flex h-full flex-col">
        <h2 className="sheet-header px-3 py-1.5 text-center text-2xl leading-tight">
          {title}{subtitle && <span className="block font-sans text-xs font-semibold">{subtitle}</span>}
        </h2>
        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}

function PendingReward({ participantId, milestone, ownedAbilities }: { participantId: string; milestone: number; ownedAbilities: string[] }) {
  const [abilityId, setAbilityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const choose = async (choice: RewardChoice) => {
    try { await rioRepo.chooseReward(participantId, milestone, choice, abilityId || undefined); } catch (e) { setError((e as Error).message); }
  };
  return (
    <div className="flex flex-col gap-2 rounded-lg border-2 border-[var(--accent-2)] bg-black/60 p-3 shadow-[0_0_18px_var(--glow)]">
      <p className="flex items-center gap-2 font-semibold"><Star className="size-5 text-[var(--accent-2)]" /> Pietra Miliare {milestone} PEC raggiunta: scegli la ricompensa</p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-accent" onClick={() => choose('azione-bonus')}>+1 Azione Bonus</button>
        <span className="text-sm text-[var(--muted)]">oppure</span>
        <select className="input w-auto" value={abilityId} onChange={(e) => setAbilityId(e.target.value)} aria-label="Abilità della Campagna">
          <option value="">Abilità della Campagna…</option>
          {CAMPAIGN_ABILITIES.filter((a) => !ownedAbilities.includes(a.id)).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <button type="button" className="btn" disabled={!abilityId} onClick={() => choose('abilita-campagna')}>Conferma Abilità</button>
      </div>
      {abilityId && <p className="text-xs text-[var(--muted)]">{CAMPAIGN_ABILITIES.find((a) => a.id === abilityId)?.description}</p>}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    </div>
  );
}

export function RioSheet() {
  const { campaignId = '', participantId = '' } = useParams();
  const navigate = useNavigate();
  const campaign = useLiveQuery(() => db.campaigns.get(campaignId), [campaignId]);
  const data = useRioData(campaignId);
  const products = useLiveQuery(() => db.products.toArray());
  const abilities = useLiveQuery(() => db.abilities.toArray());
  const abilityName = useMemo(() => new Map(abilities?.map((a) => [a.id, a.name])), [abilities]);
  const [newItem, setNewItem] = useState('');
  const [newCardId, setNewCardId] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const keepable = useLiveQuery(() => db.cards.filter((c) => c.conservation !== undefined).toArray());
  const [newTraguardo, setNewTraguardo] = useState('');

  if (campaign === undefined || !data) return <p className="text-[var(--muted)]">Caricamento…</p>;
  const participant = data.participants.find((p) => p.id === participantId);
  if (!campaign || !participant) return <EmptyState icon={X} title="Scheda non trovata" action={<Link to="/campagne" className="btn">Torna alle campagne</Link>} />;

  const c = data.characters.find((x) => x.id === participant.characterId);
  const s = sheetFor(participant, data.participants, data.progress);
  const spent = bonusSpent(participant);
  const kept = data.keptItems.filter((k) => k.participantId === participant.id);
  const sessionTraguardi = new Set(data.progress.filter((r) => r.participantId === participant.id && r.sessionId && r.payload.kind === 'traguardo').map((r) => r.payload.text as string));
  const ownTraguardi = new Set(data.progress.filter((r) => r.participantId === participant.id && r.payload.kind === 'traguardo').map((r) => r.payload.text as string));
  const predecessor = participant.successorOf ? data.participants.find((p) => p.id === participant.successorOf) : undefined;
  const missionsPlayed = data.sessionParticipants.filter((x) => x.participantId === participant.id).length;

  return (
    <div data-universe="moderno" className="grid grid-cols-1 gap-4 lg:grid-cols-[250px_1fr]">
      <SurvivorList
        title="Sopravvissuti"
        items={data.participants.map((p) => {
          const ch = data.characters.find((x) => x.id === p.characterId)!;
          const sh = sheetFor(p, data.participants, data.progress);
          return {
            key: p.id, character: ch, dead: sh.dead,
            subtitle: p.playerName ? `Giocatore: ${p.playerName}` : undefined,
            badge: <span className="flex shrink-0 flex-col items-end leading-none">
              <span className="text-[10px] text-[var(--muted)]">PEC</span><span className="text-lg font-bold text-[var(--accent-2)]">{sh.pec}</span>
              {sh.pendingMilestones.length > 0 && <span className="mt-0.5 size-2 rounded-full bg-amber-400" title="Ricompensa da scegliere" />}
            </span>,
          };
        }).filter((i) => i.character)}
        selectedKey={participant.id}
        onSelect={(id) => navigate(`/campagne/${campaign.id}/scheda/${id}`)}
      />
      <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link to={`/campagne/${campaign.id}`} className="btn"><ArrowLeft className="size-4" /> {campaign.name}</Link>
        <h1 className="title-display -rotate-1 bg-[#f2c418] px-4 py-1 text-3xl text-black sm:text-4xl" style={{ textShadow: 'none' }}>Scheda Campagna</h1>
        <span className="text-xs text-[var(--muted)]">Fonte: {RIO_SOURCES.scheda.document}, pag. 10–12</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="panel flex items-center gap-3 px-3 py-2">
          <span className="title-display text-lg whitespace-nowrap">Nome del sopravvissuto:</span>
          <span className="flex-1 rounded border border-[var(--line)] bg-white px-3 py-1 text-xl font-semibold text-black uppercase">{c?.name}</span>
        </div>
        <label className="panel flex items-center gap-3 px-3 py-2">
          <span className="title-display text-lg whitespace-nowrap">Nome del giocatore:</span>
          <input className="flex-1 rounded border border-[var(--line)] bg-white px-3 py-1 text-xl text-black outline-none focus:ring-2 focus:ring-[var(--accent-2)]" defaultValue={participant.playerName ?? ''} key={participant.id}
            onBlur={(e) => rioRepo.updateParticipant(participant.id, { playerName: e.target.value.trim() || undefined })} />
        </label>
      </div>

      {s.dead && <p className="flex items-center gap-2 rounded-md border border-red-700 bg-red-900/40 px-3 py-2"><Skull className="size-5" /> {c?.name} è morto e non può più essere giocato in questa campagna. Un successore erediterà i Traguardi.</p>}
      {predecessor && <p className="text-sm text-[var(--muted)]">Successore di {data.characters.find((x) => x.id === predecessor.characterId)?.name}: ne eredita i Traguardi della Campagna.</p>}
      {s.pendingMilestones.map((m) => <PendingReward key={m} participantId={participant.id} milestone={m} ownedAbilities={s.campaignAbilityIds} />)}
      {s.orphanRewards.map((m) => (
        <div key={m} className="flex flex-wrap items-center gap-2 rounded-md border border-red-700 bg-red-900/30 px-3 py-2 text-sm">
          <AlertTriangle className="size-5" /> La ricompensa della Pietra Miliare {m} non è più valida: i PEC attuali ({s.pec}) non la raggiungono, probabilmente per una partita corretta.
          <button type="button" className="btn btn-danger ml-auto px-2 py-1 text-xs" onClick={() => rioRepo.undoReward(participant.id, m)}>Annulla ricompensa</button>
        </div>
      ))}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_1fr] 2xl:grid-cols-[250px_1fr]">
        {/* Ritratto e informazioni */}
        <div className="flex flex-col gap-3">
          <div className="hazard-frame"><div className="hazard-inner relative aspect-square">
            <Portrait c={c} />
            {(c?.portraitImageId || !defaultPortraitUrl(c?.id)) && <span className="brush-banner absolute inset-x-3 bottom-4 py-0.5 text-center text-4xl">{c?.name.toUpperCase()}</span>}
          </div></div>
          <dl className="panel grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 p-3 text-sm">
            <dt className="text-[var(--muted)]">Gioco:</dt><dd>{products?.find((p) => p.id === c?.productId)?.name ?? 'Da indicare'}</dd>
            <dt className="text-[var(--muted)]">Tipo:</dt><dd>Sopravvissuto</dd>
            <dt className="text-[var(--muted)]">Missioni:</dt><dd>{missionsPlayed}</dd>
            <dt className="text-[var(--muted)]">Stato:</dt><dd>{s.dead ? <span className="rounded bg-red-700 px-2 text-white">Morto</span> : <span className="rounded bg-[var(--ok)] px-2 text-black">Attivo in campagna</span>}</dd>
          </dl>
          <div className="panel p-3 text-sm">
            <h3 className="title-display mb-1 text-lg">Abilità originali</h3>
            <ul className="flex flex-col gap-1">
              {c?.abilities.flatMap((g) => g.abilityIds.map((id) => (
                <li key={`${g.level}-${id}`} className="flex items-center gap-2"><LevelChip level={g.level} /><span>{abilityName.get(id) ?? id}</span></li>
              )))}
              {s.campaignAbilityIds.map((id) => (
                <li key={id} className="flex items-center gap-2"><LevelChip level="blu" /><span className="font-semibold text-[var(--accent-2)]">{CAMPAIGN_ABILITIES.find((a) => a.id === id)?.name}</span><span className="text-xs text-[var(--muted)]">(campagna)</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col gap-4">
            {/* PE della campagna: griglia 1-20 come nei mockup; Pietre Miliari dalla scheda ufficiale */}
            <SheetBox title={`PEC · Progressione campagna (1–${PEC_MAX})`}>
              <div className="grid grid-cols-10 gap-1 p-3">
                {Array.from({ length: PEC_MAX }, (_, i) => i + 1).map((n) => {
                  const milestone = (PEC_MILESTONES as readonly number[]).includes(n);
                  const reached = n <= s.pec;
                  const cls = reached && milestone ? 'border-green-800 bg-[var(--ok)] text-black' : reached ? 'border-black bg-black text-[#f2c418]' : milestone ? 'border-black/50 bg-[#f2c418] text-black' : 'border-black/30 bg-white text-black';
                  return <span key={n} title={milestone ? REWARD_TEXT : undefined} className={`grid aspect-square place-items-center rounded-sm border-2 text-base font-bold sm:text-lg ${cls}`}>{n}</span>;
                })}
              </div>
              {(() => { const next = PEC_MILESTONES.find((m) => m > s.pec); return (
                <p className="flex items-center gap-2 border-t border-black/15 px-3 py-2 text-sm"><Star className="size-4 shrink-0 fill-[#f2c418] text-black" />
                  {next ? <span>Prossimo PEC speciale: <strong>{next}</strong> <span className="text-black/60">({REWARD_TEXT})</span></span> : <span>Tutte le Pietre Miliari raggiunte.</span>}
                </p>); })()}
              <div className="flex items-center justify-end gap-2 px-3 pb-2 text-xs text-black/60">
                Correzione manuale
                <button type="button" className="grid size-6 place-items-center rounded bg-black text-white" onClick={() => rioRepo.adjustPecManually(participant.id, -1)} aria-label="Togli 1 PEC" disabled={s.pec === 0}><Minus className="size-3" /></button>
                <button type="button" className="grid size-6 place-items-center rounded bg-black text-white" onClick={() => rioRepo.adjustPecManually(participant.id, 1)} aria-label="Aggiungi 1 PEC" disabled={s.pec >= PEC_MAX}><Plus className="size-3" /></button>
              </div>
            </SheetBox>

            <SheetBox title="Abilità della Campagna" subtitle="(Livello Blu)">
              <ul className="flex flex-col">
                {CAMPAIGN_ABILITIES.map((a) => {
                  const owned = s.campaignAbilityIds.includes(a.id);
                  return (
                    <li key={a.id} className="flex items-center gap-3 border-b border-black/10 px-3 py-1.5" title={a.description}>
                      <LevelChip level="blu" />
                      <span className={`flex-1 text-base ${owned ? 'font-bold' : ''}`}>{a.name}{a.note && <span className="block text-[10px] text-black/60">{a.note}</span>}</span>
                      <span className="grid size-6 shrink-0 place-items-center border-2 border-black bg-white" aria-label={owned ? 'Acquisita' : 'Non acquisita'}>{owned && <Check className="size-5 text-green-700" strokeWidth={4} />}</span>
                    </li>
                  );
                })}
              </ul>
            </SheetBox>
          </div>

          <div className="flex flex-col gap-4">
            <SheetBox title="Azioni Bonus" subtitle="(una volta per Missione)">
              <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] items-center gap-1 p-3 text-sm">
                <span />
                {Array.from({ length: BONUS_ACTION_SLOTS }, (_, i) => <span key={i} className="grid h-8 place-items-center rounded-sm bg-[#f2c418] text-lg font-bold">{i + 1}</span>)}
                <span className="pr-1 text-xs font-semibold">Riserva</span>
                {Array.from({ length: BONUS_ACTION_SLOTS }, (_, i) => i + 1).map((n) => (
                  <span key={n} className="grid place-items-center"><span className="grid size-7 place-items-center border-2 border-black bg-white">{n <= s.bonusActions && <Check className="size-5 text-green-700" strokeWidth={4} />}</span></span>
                ))}
                <span className="pr-1 text-xs font-semibold">Spesa</span>
                {Array.from({ length: BONUS_ACTION_SLOTS }, (_, i) => i + 1).map((n) => {
                  const inReserve = n <= s.bonusActions;
                  const isSpent = n <= spent;
                  return (
                    <span key={n} className="grid place-items-center">
                      <button type="button" disabled={!inReserve || s.dead} onClick={() => rioRepo.setBonusSpent(participant.id, isSpent ? n - 1 : n)}
                        className="grid size-7 place-items-center border-2 border-black bg-white disabled:opacity-30" aria-label={`Azione Bonus ${n}: ${isSpent ? 'spesa' : 'disponibile'}`} aria-pressed={isSpent}>
                        {isSpent && <Check className="size-5 text-green-700" strokeWidth={4} />}
                      </button>
                    </span>
                  );
                })}
              </div>
              <p className="px-3 pb-2 text-[11px] text-black/60">Le spunte «Spesa» si cancellano alla registrazione della Missione successiva.</p>
            </SheetBox>

            <SheetBox title="Equipaggiamento Conservato">
              <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                {kept.map((k) => {
                  const card = keepable?.find((c) => c.id === k.cardId);
                  return (
                    <div key={k.id} className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-md border-2 border-[#f2c418] bg-gradient-to-b from-[#3a2a10] to-[#120d06] text-white shadow">
                      <div className="grid flex-1 place-items-center p-1">
                        <StoredImage imageId={card?.frontImageId} alt={k.name} className="size-full object-cover" fallback={<Swords className="size-8 text-[#f2c418]" />} />
                      </div>
                      <span className="bg-black/80 px-1 py-0.5 text-center text-xs leading-tight font-semibold">{k.name}</span>
                      {card && <span className="absolute top-1 left-1 rounded bg-black/80 px-1 text-[11px] font-bold" title="Conservazione">🔒{card.conservation}</span>}
                      <button type="button" onClick={() => rioRepo.removeKeptItem(k.id)} aria-label={`Rimuovi ${k.name}`} className="absolute top-1 right-1 rounded bg-black/70 p-0.5 hover:bg-red-700"><Trash2 className="size-3" /></button>
                    </div>
                  );
                })}
                <button type="button" onClick={() => setAddingItem(true)} className="grid aspect-[3/4] place-items-center rounded-md border-2 border-dashed border-black/50 bg-black/10 text-black/70 hover:bg-black/20" aria-label="Aggiungi oggetto conservato"><Plus className="size-8" /></button>
              </div>
              {addingItem && (
                <form className="flex flex-col gap-1 px-3 pb-2" onSubmit={(e) => { e.preventDefault(); rioRepo.addKeptItem(participant.id, newItem, newCardId || undefined); setNewItem(''); setNewCardId(''); setAddingItem(false); }}>
                  <select className="rounded border border-black/30 bg-white px-2 py-1 text-black" value={newCardId} onChange={(e) => setNewCardId(e.target.value)} aria-label="Carta dal catalogo">
                    <option value="">Carta dal catalogo…</option>
                    {keepable?.map((c) => <option key={c.id} value={c.id}>{c.name} (Conservazione {c.conservation})</option>)}
                  </select>
                  <div className="flex gap-1">
                    <input className="min-w-0 flex-1 rounded border border-black/30 bg-white px-2 py-1 text-black" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="…oppure scrivi il nome" aria-label="Nuovo oggetto conservato" disabled={!!newCardId} />
                    <button type="submit" className="rounded bg-black px-3 text-white">Aggiungi</button>
                  </div>
                </form>
              )}
              <p className="px-3 pb-2 text-[11px] text-black/60">A fine Missione tira i dadi Al Massimo pari alla Conservazione di ogni carta: con 1+ Rottura la carta è persa (pag. 6).</p>
            </SheetBox>

            <SheetBox title="Traguardi della Campagna">
              <ul className="flex flex-col gap-1 p-3">
                {s.traguardi.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-lg">
                    <span className="grid size-6 place-items-center border-2 border-black bg-white"><Check className="size-5 text-green-700" strokeWidth={4} /></span>
                    <span className="flex-1 font-medium">{t}</span>
                    {!ownTraguardi.has(t) && <span className="text-xs text-black/60">ereditato</span>}
                    {ownTraguardi.has(t) && !sessionTraguardi.has(t) && (
                      <button type="button" onClick={() => rioRepo.removeManualTraguardo(participant.id, t)} aria-label={`Rimuovi ${t}`} className="text-black/60 hover:text-red-700"><Trash2 className="size-4" /></button>
                    )}
                  </li>
                ))}
                {!s.traguardi.length && <li className="text-black/60 italic">Nessun Traguardo.</li>}
              </ul>
              <form className="flex gap-1 px-3 pb-3" onSubmit={(e) => { e.preventDefault(); rioRepo.addManualTraguardo(participant.id, newTraguardo); setNewTraguardo(''); }}>
                <input className="min-w-0 flex-1 rounded border border-black/30 bg-white px-2 py-1 text-black" list="rio-traguardi" value={newTraguardo} onChange={(e) => setNewTraguardo(e.target.value)} placeholder="Parola chiave del Traguardo" aria-label="Nuovo Traguardo" />
                <datalist id="rio-traguardi">{KNOWN_MILESTONES.map((k) => <option key={k.name} value={k.name} />)}</datalist>
                <button type="submit" className="grid size-8 place-items-center rounded bg-black text-white" aria-label="Aggiungi Traguardo"><Plus className="size-4" /></button>
              </form>
            </SheetBox>

            <SheetBox title="Note">
              <textarea key={participant.id} className="m-3 min-h-32 w-[calc(100%-1.5rem)] resize-y rounded border border-black/20 bg-white/50 p-2 text-black italic outline-none focus:border-black/50"
                defaultValue={participant.notes ?? ''} placeholder="Storia del sopravvissuto, scelte, strategie…"
                onBlur={(e) => rioRepo.updateParticipant(participant.id, { notes: e.target.value })} aria-label="Note della scheda" />
            </SheetBox>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}