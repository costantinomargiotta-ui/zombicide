import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, Layers, Plus } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { useStatsInput } from '../data/hooks';
import { CAMPAIGN_STATUS_LABEL, UNIVERSE_IDS, type CampaignStatus, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { rulesFor } from '../rules';
import { RIO_MISSIONS, RIO_TEMPLATE_ID } from '../rules/moderno/rioZJaneiro';
import { BP_MISSIONS, BP_TEMPLATE_ID } from '../rules/fantasy/blackPlague';
import { computeStats } from '../services/stats';
import { useScope } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { CampaignRow } from '../ui/components/CampaignRow';
import { EmptyState } from '../ui/components/EmptyState';
import { Field, Modal } from '../ui/components/Modal';

function NewCampaignForm({ defaultUniverse, onClose }: { defaultUniverse?: UniverseId; onClose: () => void }) {
  const navigate = useNavigate();
  const [universeId, setUniverseId] = useState<UniverseId>(defaultUniverse ?? 'moderno');
  const products = useLiveQuery(() => db.products.where('universeId').equals(universeId).toArray(), [universeId]);
  const collection = useLiveQuery(() => db.collection.toArray());
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [planned, setPlanned] = useState('');
  const [description, setDescription] = useState('');

  const owned = new Set(collection?.filter((c) => c.owned).map((c) => c.productId));
  const sorted = [...(products ?? [])].sort((a, b) => Number(owned.has(b.id)) - Number(owned.has(a.id)) || a.name.localeCompare(b.name));
  const template = rulesFor(universeId).campaignTemplates.find((t) => t.productId === productId);

  useEffect(() => { setProductId(''); }, [universeId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !productId) return;
    const plannedNum = Number.parseInt(planned, 10);
    const c = await repo.createCampaign({
      universeId, productId, name: name.trim(),
      description: description.trim() || undefined,
      plannedScenarioCount: Number.isFinite(plannedNum) && plannedNum > 0 ? plannedNum : template?.id === RIO_TEMPLATE_ID ? RIO_MISSIONS.length : template?.id === BP_TEMPLATE_ID ? BP_MISSIONS.length : undefined,
      templateId: template?.id,
    });
    onClose();
    navigate(`/campagne/${c.id}`);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Nuova campagna"
      footer={<>
        <button type="button" className="btn" onClick={onClose}>Annulla</button>
        <button type="submit" form="campaign-form" className="btn btn-accent" disabled={!name.trim() || !productId}>Crea campagna</button>
      </>}
    >
      <form id="campaign-form" onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Universo">
          <select className="input" value={universeId} onChange={(e) => setUniverseId(e.target.value as UniverseId)}>
            {UNIVERSE_IDS.map((u) => <option key={u} value={u}>{UNIVERSES[u].name}</option>)}
          </select>
        </Field>
        <Field label="Gioco di riferimento">
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Seleziona…</option>
            {sorted.map((p) => <option key={p.id} value={p.id}>{p.name}{owned.has(p.id) ? ' ✓' : ''}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Nome del salvataggio" hint="Puoi avere più campagne dello stesso gioco: i salvataggi restano indipendenti.">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Es. Rio – gruppo del giovedì" />
          </Field>
        </div>
        <Field label="Scenari previsti" hint="Facoltativo: serve a calcolare la percentuale.">
          <input className="input" type="number" min={1} value={planned} onChange={(e) => setPlanned(e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Descrizione"><textarea className="input min-h-16" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        </div>
        {template?.status === 'pronto' && (
          <p className="rounded-md border border-green-700 bg-green-900/20 p-3 text-sm sm:col-span-2">
            Verrà usata la campagna ufficiale <strong>{template.name}</strong>, con schede, missioni in ordine e registro dei progressi.
          </p>
        )}
        {template?.status === 'materiali-mancanti' && (
          <div className="flex gap-2 rounded-md border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-200 sm:col-span-2">
            <AlertTriangle className="size-5 shrink-0" aria-hidden />
            <span>La scheda ufficiale di {template.name} sarà attivata quando saranno disponibili i materiali richiesti. Il salvataggio può già essere creato.</span>
          </div>
        )}
      </form>
    </Modal>
  );
}

export function CampaignsPage() {
  const { universeId } = useScope();
  const [params, setParams] = useSearchParams();
  const input = useStatsInput();
  const products = useLiveQuery(() => db.products.toArray());
  const [status, setStatus] = useState<CampaignStatus | ''>('');
  const creating = params.get('nuova') === '1';

  const stats = input ? computeStats(input, universeId) : undefined;
  const list = (stats?.allCampaigns ?? [])
    .filter((p) => !status || p.campaign.status === status)
    .sort((a, b) => b.campaign.updatedAt.localeCompare(a.campaign.updatedAt));

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title={universeId ? `Campagne ${UNIVERSES[universeId].name}` : 'Tutte le campagne'}
        icon={Layers}
        action={<button type="button" className="btn btn-accent text-sm" onClick={() => setParams({ nuova: '1' })}><Plus className="size-4" /> Nuova campagna</button>}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {(['', 'da-iniziare', 'in-corso', 'sospesa', 'completata'] as const).map((s) => (
            <button key={s || 'tutte'} type="button" className={`btn text-sm ${status === s ? 'btn-accent' : ''}`} onClick={() => setStatus(s)} aria-pressed={status === s}>
              {s ? CAMPAIGN_STATUS_LABEL[s] : 'Tutte'}
            </button>
          ))}
        </div>
        {list.length ? (
          <div className="flex flex-col gap-2">
            {list.map((p) => <CampaignRow key={p.campaign.id} progress={p} productName={products?.find((x) => x.id === p.campaign.productId)?.name} />)}
          </div>
        ) : (
          <EmptyState icon={Layers} title="Nessuna campagna" />
        )}
      </Panel>
      {creating && <NewCampaignForm defaultUniverse={universeId} onClose={() => setParams({})} />}
    </div>
  );
}
