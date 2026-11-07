import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Dices, Play } from 'lucide-react';
import { db } from '../data/db';
import { SESSION_OUTCOME_LABEL, type SessionOutcome } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { rulesFor } from '../rules';
import { formatDate, formatDuration } from '../lib/format';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { EmptyState } from '../ui/components/EmptyState';
import { Field, Modal } from '../ui/components/Modal';
import { UniverseEmblem } from '../ui/components/UniverseEmblem';

/** Registro di tutte le partite. Le nuove partite si registrano dentro una campagna con un modulo regole. */
export function SessionsPage() {
  const { universeId, path } = useScope();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [outcome, setOutcome] = useState<SessionOutcome | ''>('');
  const [campaignId, setCampaignId] = useState('');
  const data = useLiveQuery(async () => ({
    sessions: await db.sessions.toArray(),
    campaigns: await db.campaigns.toArray(),
    sps: await db.sessionParticipants.toArray(),
    characters: await db.characters.toArray(),
  }));
  if (!data) return <p className="text-[var(--muted)]">Caricamento…</p>;

  const playable = data.campaigns.filter((c) => (!universeId || c.universeId === universeId) && c.status !== 'completata'
    && rulesFor(c.universeId).campaignTemplates.some((t) => t.id === c.templateId && t.status === 'pronto'));
  const list = data.sessions
    .filter((s) => (!universeId || s.universeId === universeId) && (!outcome || s.outcome === outcome))
    .sort((a, b) => b.playedOn.localeCompare(a.playedOn) || b.createdAt.localeCompare(a.createdAt));
  const name = (id?: string) => data.characters.find((c) => c.id === id)?.name;

  return (
    <div className="flex flex-col gap-5">
      <Panel title={universeId ? `Partite ${UNIVERSES[universeId].name}` : 'Registro partite'} icon={Dices}
        action={<button type="button" className="btn btn-accent text-sm" onClick={() => setParams({ nuova: '1' })}><Play className="size-4" /> Nuova partita</button>}>
        <div className="mb-3 flex flex-wrap gap-2">
          {(['', 'vittoria', 'sconfitta'] as const).map((o) => (
            <button key={o || 'tutte'} type="button" className={`btn text-sm ${outcome === o ? 'btn-accent' : ''}`} onClick={() => setOutcome(o)} aria-pressed={outcome === o}>{o ? SESSION_OUTCOME_LABEL[o] : 'Tutte'}</button>
          ))}
        </div>
        {list.length ? (
          <ul className="flex flex-col divide-y divide-[var(--line)]">
            {list.map((s) => {
              const c = data.campaigns.find((x) => x.id === s.campaignId);
              return (
                <li key={s.id} data-universe={s.universeId} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                  <UniverseEmblem id={s.universeId} className="size-4 text-[var(--accent)]" />
                  <span className="w-24 text-[var(--muted)]">{formatDate(s.playedOn)}</span>
                  <span className="min-w-40 flex-1 font-medium">{s.scenarioTitle ?? 'Scenario'}</span>
                  {c && <Link to={`/campagne/${c.id}`} className="text-xs text-[var(--muted)] underline-offset-2 hover:underline">{c.name}</Link>}
                  <span className="text-xs text-[var(--muted)]">{data.sps.filter((p) => p.sessionId === s.id).map((p) => name(p.characterId) ?? p.characterName).filter(Boolean).join(', ')}</span>
                  {s.durationMinutes && <span className="text-xs text-[var(--muted)]">{formatDuration(s.durationMinutes)}</span>}
                  <Badge tone={s.outcome === 'vittoria' ? 'ok' : s.outcome === 'sconfitta' ? 'danger' : 'neutral'}>{SESSION_OUTCOME_LABEL[s.outcome]}</Badge>
                  {s.origin === 'demo' && <Badge tone="demo">DEMO</Badge>}
                </li>
              );
            })}
          </ul>
        ) : <EmptyState icon={Dices} title="Nessuna partita registrata" />}
      </Panel>

      {params.get('nuova') === '1' && (
        <Modal open onClose={() => setParams({})} title="Nuova partita" footer={<>
          <button type="button" className="btn" onClick={() => setParams({})}>Annulla</button>
          <button type="button" className="btn btn-accent" disabled={!campaignId} onClick={() => navigate(`/campagne/${campaignId}?registra=1`)}>Continua</button>
        </>}>
          {playable.length ? (
            <Field label="In quale campagna?" hint="Per ora le partite si registrano nelle campagne con un modulo regole completo (Rio Z Janeiro).">
              <select className="input" value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
                <option value="">Seleziona…</option>
                {playable.map((c) => <option key={c.id} value={c.id}>{c.name} · {UNIVERSES[c.universeId].name}</option>)}
              </select>
            </Field>
          ) : (
            <EmptyState icon={Dices} title="Nessuna campagna disponibile" action={<Link to={path('campagne?nuova=1')} className="btn btn-accent">Crea una campagna</Link>}>
              Crea prima una campagna Rio Z Janeiro: le partite libere arriveranno insieme ai moduli regole degli altri giochi.
            </EmptyState>
          )}
        </Modal>
      )}
    </div>
  );
}
