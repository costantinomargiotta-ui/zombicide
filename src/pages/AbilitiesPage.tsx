import { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { UNIVERSE_IDS, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { SKILL_SOURCES } from '../rules/skillGlossary';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { EmptyState } from '../ui/components/EmptyState';

/** Perché un universo non ha ancora un glossario. */
const MISSING: Partial<Record<UniverseId, string>> = {
  western: 'Regolamento di Zombicide: Undead or Alive non ancora disponibile: mandamelo e trascrivo le Abilità.',
  marvel: 'Marvel Zombies non ha un elenco di Abilità nel regolamento: ogni Eroe Zombie ha Abilità uniche stampate sulla sua scheda (Regolamento, pag. 11).',
};

/** Come nel regolamento: prima le Abilità che iniziano con simboli o numeri, poi in ordine alfabetico. */
const bySkillName = (a: { name: string }, b: { name: string }) => Number(/^[A-Za-zÀ-ú]/.test(a.name)) - Number(/^[A-Za-zÀ-ú]/.test(b.name)) || a.name.localeCompare(b.name, 'it');

/** Glossario delle Abilità di ogni ambientazione: nome e descrizione dal regolamento. */
export function AbilitiesPage() {
  const { universeId: scoped } = useScope();
  const [universe, setUniverse] = useState<UniverseId>(scoped ?? 'moderno');
  const [query, setQuery] = useState('');
  const current = scoped ?? universe;
  const q = query.trim().toLowerCase();
  const sources = useMemo(() => SKILL_SOURCES.filter((s) => s.universeId === current).map((s) => ({
    ...s,
    skills: s.skills.filter((k) => !q || k.name.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)).sort(bySkillName),
  })), [current, q]);
  const total = sources.reduce((a, s) => a + s.skills.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex flex-wrap items-center gap-3 px-4 py-2.5">
        <BookOpen className="size-8 text-[var(--accent-2)]" aria-hidden />
        <h1 className="title-display flex-1 text-3xl">Abilità</h1>
        {!scoped && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Ambientazione">
            {UNIVERSE_IDS.map((u) => (
              <button key={u} type="button" onClick={() => setUniverse(u)} aria-pressed={universe === u} className={`btn text-sm ${universe === u ? 'btn-accent' : ''}`}>{UNIVERSES[u].name}</button>
            ))}
          </div>
        )}
        <label className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
          <input className="input pl-8" placeholder="Cerca per nome o testo…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cerca abilità" />
        </label>
      </div>

      {MISSING[current] && !sources.length ? (
        <Panel><EmptyState icon={BookOpen} title={`Nessun glossario per ${UNIVERSES[current].name}`}>{MISSING[current]}</EmptyState></Panel>
      ) : !total ? (
        <Panel><EmptyState icon={Search} title="Nessuna abilità trovata">Prova con un'altra parola.</EmptyState></Panel>
      ) : sources.filter((s) => s.skills.length).map((s) => (
        <Panel key={s.productId} title={`${s.source.split(' – ')[0]} (${s.skills.length})`} icon={BookOpen}>
          <p className="mb-3 text-xs text-[var(--muted)]">Fonte: {s.source}. Nomi tra parentesi quadre: Abilità generiche, valide per il tipo indicato.</p>
          <dl className="grid grid-cols-1 gap-2 xl:grid-cols-2">
            {s.skills.map((k) => (
              <div key={k.name} className="rounded-lg border border-[var(--line)] bg-black/30 px-3 py-2">
                <dt className="font-semibold text-[var(--accent-2)]">{k.name}</dt>
                <dd className="text-sm leading-snug">{k.description}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ))}
    </div>
  );
}
