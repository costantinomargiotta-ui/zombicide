import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { findSkill } from '../services/skills';
import { AlertTriangle, BarChart3, BookOpen, CheckCircle2, Dices, Heart, ImagePlus, Info, NotebookPen, Package, ShieldQuestion, UserRound, Users } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import type { Ability, Character, Product } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { rulesFor } from '../rules';
import { useScope } from '../lib/scope';
import { formatDate } from '../lib/format';
import { StoredImage } from '../ui/components/StoredImage';
import { EmptyState } from '../ui/components/EmptyState';
import { Badge } from '../ui/components/Badge';
import { defaultPortraitUrl } from '../domain/portraits';
import { SurvivorList } from '../ui/components/SurvivorList';

/** Colori dei livelli di pericolo stampati sulle schede. */
export const LEVEL_STYLE: Record<string, { color: string; label: string }> = {
  blu: { color: 'var(--lvl-blu)', label: 'Blu' },
  giallo: { color: 'var(--lvl-giallo)', label: 'Giallo' },
  arancione: { color: 'var(--lvl-arancione)', label: 'Arancione' },
  arancio: { color: 'var(--lvl-arancione)', label: 'Arancio' },
  rosso: { color: 'var(--lvl-rosso)', label: 'Rosso' },
};

export function LevelChip({ level }: { level: string }) {
  const s = LEVEL_STYLE[level] ?? { color: '#777', label: level };
  return (
    <span className="lvl-chip shrink-0" style={{ background: s.color }} title={`Livello ${s.label}`} aria-label={`Livello ${s.label}`}>
      <svg viewBox="0 0 16 12" className="h-3 w-4" aria-hidden><path d="M0 4h7V0l9 6-9 6V8H0z" fill="currentColor" /></svg>
    </span>
  );
}

type Tab = 'originale' | 'campagna' | 'partite' | 'note';
const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'campagna', label: 'Scheda Campagna', icon: Users },
  { id: 'originale', label: 'Scheda Originale', icon: BookOpen },
  { id: 'partite', label: 'Partite', icon: Dices },
  { id: 'note', label: 'Note', icon: NotebookPen },
];

function Portrait({ c, className = '' }: { c: Character; className?: string }) {
  return (
    <StoredImage
      imageId={c.portraitImageId}
      alt={`Ritratto di ${c.name}`}
      className={`size-full object-cover object-top ${className}`}
      fallback={defaultPortraitUrl(c.id) ? <img src={defaultPortraitUrl(c.id)} alt={`Ritratto di ${c.name}`} className={`size-full object-cover object-top ${className}`} loading="lazy" /> : (
        <div className="grid size-full place-items-center bg-gradient-to-b from-[#2a2f36] to-[#0e1013] text-[var(--muted)]">
          <UserRound className="size-1/2 opacity-60" aria-hidden />
        </div>
      )}
    />
  );
}

/** Riga abilità: un clic mostra la descrizione dal glossario del regolamento. */
function AbilityRow({ c, level, name }: { c: Character; level: string; name: string }) {
  const [open, setOpen] = useState(false);
  const match = findSkill(c.universeId, name);
  return (
    <li className="px-3 py-1.5">
      <button type="button" disabled={!match} onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 text-left disabled:cursor-default">
        <LevelChip level={level} />
        <span className="flex-1 font-medium">{name}</span>
        {match && <Info className="size-4 shrink-0 text-black/50" aria-label="Mostra descrizione" />}
      </button>
      {open && match && (
        <p className="mt-1 ml-9 text-sm text-black/80">
          {match.skill.description}
          {match.skill.name.toLowerCase() !== name.toLowerCase() && <span className="block text-xs text-black/60 italic">Abilità generica: {match.skill.name}</span>}
          <span className="block text-xs text-black/50">{match.source.source}</span>
        </p>
      )}
    </li>
  );
}

function OriginalAbilities({ c, abilities }: { c: Character; abilities: Map<string, Ability> }) {
  return (
    <div className="hazard-frame">
      <div className="hazard-inner paper">
        <h3 className="sheet-header px-3 py-1.5 text-2xl">
          Abilità Originali <span className="font-sans text-sm font-semibold italic">(dal personaggio)</span>
        </h3>
        {!c.abilities.length && <p className="px-3 py-3 text-black/70 italic">Abilità non ancora trascritte: mandami la fotografia della scheda identità di {c.name}.</p>}
        <ol className="divide-y divide-black/15">
          {c.abilities.flatMap((group) =>
            group.abilityIds.map((id) => (
              <AbilityRow key={`${group.level}-${id}`} c={c} level={group.level} name={abilities.get(id)?.name ?? id} />
            )),
          )}
        </ol>
      </div>
    </div>
  );
}

function CharacterSheet({ c, abilities, products }: { c: Character; abilities: Map<string, Ability>; products: Product[] }) {
  const [tab, setTab] = useState<Tab>('originale');
  const note = useLiveQuery(() => db.characterNotes.get(c.id), [c.id]);
  const participations = useLiveQuery(
    async () => {
      const rows = await db.sessionParticipants.where('characterId').equals(c.id).toArray();
      const sessions = await db.sessions.bulkGet(rows.map((r) => r.sessionId));
      return sessions.filter((s) => !!s);
    },
    [c.id],
  );
  const campaignsOf = useLiveQuery(async () => {
    const parts = await db.participants.where('characterId').equals(c.id).toArray();
    const camps = await db.campaigns.bulkGet(parts.map((p) => p.campaignId));
    return parts.map((p, i) => ({ participant: p, campaign: camps[i] })).filter((x) => x.campaign);
  }, [c.id]);
  const product = products.find((p) => p.id === c.productId);
  const universeProducts = products.filter((p) => p.universeId === c.universeId);
  const kindLabel = rulesFor(c.universeId).characterKinds.find((k) => k.id === c.kind)?.label ?? c.kind;
  const woundTrack = typeof c.traits?.woundTrack === 'number' ? c.traits.woundTrack : undefined;
  const transcriptionNotes = typeof c.traits?.transcriptionNotes === 'string' ? c.traits.transcriptionNotes : undefined;

  async function uploadPortrait(file?: File) {
    if (!file) return;
    const id = await repo.saveImage(file);
    const old = c.portraitImageId;
    await repo.updateCharacter(c.id, { portraitImageId: id });
    if (old) await repo.deleteImage(old);
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div role="tablist" aria-label="Schede del personaggio" className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)} className={`btn text-base ${tab === id ? 'btn-accent' : ''}`}>
            <Icon className="size-5" aria-hidden /> {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(240px,320px)_1fr]">
        {/* Colonna ritratto, come nei mockup */}
        <div className="flex flex-col gap-3">
          <div className="panel relative aspect-square overflow-hidden">
            <Portrait c={c} />
            <div className={`absolute inset-x-0 bottom-6 justify-center ${!c.portraitImageId && defaultPortraitUrl(c.id) ? 'hidden' : 'flex'}`}>
              <span className="brush-banner px-6 py-1 text-4xl sm:text-5xl">{c.name.toUpperCase()}</span>
            </div>
            <label className="btn absolute top-2 right-2 cursor-pointer px-2 py-1 text-xs">
              <ImagePlus className="size-4" /> {c.portraitImageId ? 'Sostituisci' : 'Carica ritratto'}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadPortrait(e.target.files?.[0])} />
            </label>
          </div>
          <dl className="panel grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 p-3 text-sm">
            <dt className="flex items-center gap-2 text-[var(--muted)]"><Package className="size-4" /> Gioco:</dt>
            <dd>
              <select
                className="input py-1 text-sm"
                value={c.productId ?? ''}
                onChange={(e) => repo.updateCharacter(c.id, { productId: e.target.value || undefined })}
                aria-label="Gioco di provenienza"
              >
                <option value="">Da indicare</option>
                {universeProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </dd>
            <dt className="flex items-center gap-2 text-[var(--muted)]"><Users className="size-4" /> Tipo:</dt>
            <dd>{kindLabel}</dd>
            {woundTrack && (
              <>
                <dt className="flex items-center gap-2 text-[var(--muted)]"><Heart className="size-4" /> Ferite:</dt>
                <dd>Tracciato {Array.from({ length: woundTrack }, (_, i) => woundTrack - i).join('-')}</dd>
              </>
            )}
            {typeof c.traits?.equipSlot === 'string' && (
              <>
                <dt className="flex items-center gap-2 text-[var(--muted)]"><Package className="size-4" /> Slot speciale:</dt>
                <dd>Può contenere {c.traits.equipSlot}</dd>
              </>
            )}
            <dt className="flex items-center gap-2 text-[var(--muted)]"><ShieldQuestion className="size-4" /> Dati:</dt>
            <dd>
              {c.dataStatus === 'verificato' ? (
                <Badge tone="ok"><CheckCircle2 className="size-3" /> Verificati</Badge>
              ) : (
                <button type="button" className="btn px-2 py-0.5 text-xs" onClick={() => repo.updateCharacter(c.id, { dataStatus: 'verificato' })}>
                  Da verificare · segna come verificati
                </button>
              )}
            </dd>
          </dl>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {tab === 'originale' && (
            <>
              <OriginalAbilities c={c} abilities={abilities} />
              {(transcriptionNotes || c.traits?.capIcon === true) && (
                <div className="flex gap-2 rounded-md border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-200">
                  <AlertTriangle className="size-5 shrink-0" aria-hidden />
                  <div className="flex flex-col gap-1">
                    {transcriptionNotes && <span>{transcriptionNotes}</span>}
                    {c.traits?.capIcon === true && <span>La scheda mostra l'icona della faccina col cappellino: il suo effetto verrà gestito quando avrò il regolamento.</span>}
                  </div>
                </div>
              )}
              <p className="text-xs text-[var(--muted)]">
                {product ? `Provenienza: ${product.name}. ` : ''}{c.abilities.length ? 'Trascrizione dalle fotografie delle schede originali.' : 'Dati dal regolamento: nome e scatola di provenienza.'}
              </p>
            </>
          )}

          {tab === 'campagna' && (
            <div className="hazard-frame">
              <div className="hazard-inner paper flex flex-col gap-2 p-4">
                <h3 className="title-display text-2xl text-black" style={{ textShadow: 'none' }}>Scheda Campagna</h3>
                {campaignsOf?.length ? (
                  <ul className="flex flex-col gap-2">
                    {campaignsOf.map(({ participant, campaign }) => (
                      <li key={participant.id}>
                        <Link to={`/campagne/${campaign!.id}/scheda/${participant.id}`} className="flex items-center justify-between rounded border border-black/20 bg-white/60 px-3 py-2 font-semibold text-black hover:bg-white">
                          {campaign!.name}<span className="text-sm font-normal">Apri la scheda →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{c.name} non partecipa ancora a nessuna campagna. Aggiungilo a una campagna dalla sua pagina.</p>
                )}
                <p className="text-sm text-black/60">Ogni campagna avrà la sua scheda: i progressi non si condividono tra salvataggi diversi.</p>
              </div>
            </div>
          )}

          {tab === 'partite' && (
            participations?.length ? (
              <ul className="panel divide-y divide-[var(--line)] p-2 text-sm">
                {participations.map((s) => (
                  <li key={s!.id} className="flex items-center gap-2 px-2 py-1.5">
                    <span className="w-28 text-[var(--muted)]">{formatDate(s!.playedOn)}</span>
                    <span className="flex-1">{s!.scenarioTitle ?? s!.scenarioId}</span>
                    <Badge tone={s!.outcome === 'vittoria' ? 'ok' : 'neutral'}>{s!.outcome}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={BarChart3} title="Nessuna partita registrata">Lo storico e le statistiche personali compariranno dopo la prima partita registrata.</EmptyState>
            )
          )}

          {tab === 'note' && (
            <div className="hazard-frame">
              <div className="hazard-inner paper p-3">
                <label className="flex flex-col gap-1">
                  <span className="sheet-header -mx-3 -mt-3 mb-2 px-3 py-1.5 text-2xl">Note</span>
                  <textarea
                    key={c.id}
                    className="min-h-48 w-full resize-y rounded border border-black/20 bg-white/50 p-2 text-black italic outline-none focus:border-black/50"
                    defaultValue={note?.notes ?? ''}
                    placeholder="Strategie, combinazioni utili, ricordi delle partite…"
                    onBlur={(e) => { if (e.target.value !== (note?.notes ?? '')) repo.setCharacterNotes(c.id, e.target.value); }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CharactersPage() {
  const { universeId } = useScope();
  const [params, setParams] = useSearchParams();
  const characters = useLiveQuery(() => db.characters.toArray());
  const abilityList = useLiveQuery(() => db.abilities.toArray());
  const products = useLiveQuery(() => db.products.toArray());
  const abilities = useMemo(() => new Map(abilityList?.map((a) => [a.id, a])), [abilityList]);

  if (!characters || !products) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const inScope = characters.filter((c) => !universeId || c.universeId === universeId);
  const sorted = [...inScope].sort((a, b) => a.name.localeCompare(b.name));
  const selected = inScope.find((c) => c.id === params.get('p')) ?? sorted[0];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr]">
      <SurvivorList
        title="Sopravvissuti"
        items={inScope.map((c) => ({ key: c.id, character: c, subtitle: products.find((p) => p.id === c.productId)?.name ?? (universeId ? 'Provenienza da indicare' : UNIVERSES[c.universeId].name) }))}
        selectedKey={selected?.id}
        onSelect={(id) => setParams({ p: id })}
        groups={[...new Set(inScope.map((c) => c.productId ?? ''))].map((pid) => ({ id: pid || 'nessuno', label: products.find((p) => p.id === pid)?.name ?? 'Da indicare', match: (i) => (i.character.productId ?? '') === pid }))}
      />

      {selected ? (
        <CharacterSheet key={selected.id} c={selected} abilities={abilities} products={products} />
      ) : (
        <EmptyState icon={Users} title="Nessun personaggio">I personaggi di questo universo verranno importati quando avrò le fotografie delle loro schede.</EmptyState>
      )}
    </div>
  );
}
