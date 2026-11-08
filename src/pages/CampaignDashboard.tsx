import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, ArrowLeft, CheckCircle2, Dices, NotebookPen, Pause, Play, Target, Trash2, Trophy } from 'lucide-react';
import { db } from '../data/db';
import { repo } from '../data/repository';
import { CAMPAIGN_STATUS_LABEL, SESSION_OUTCOME_LABEL, type CampaignStatus } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { rulesFor } from '../rules';
import { campaignProgress } from '../services/stats';
import { formatDate } from '../lib/format';
import { scopedPath } from '../lib/scope';
import { Panel } from '../ui/components/Panel';
import { Badge } from '../ui/components/Badge';
import { ProgressBar } from '../ui/components/ProgressBar';
import { EmptyState } from '../ui/components/EmptyState';
import { UniverseEmblem } from '../ui/components/UniverseEmblem';
import { Modal } from '../ui/components/Modal';
import { RIO_TEMPLATE_ID } from '../rules/moderno/rioZJaneiro';
import { RioCampaign } from './rio/RioCampaign';
import { BpCampaign } from './fantasy/BpCampaign';
import { BP_TEMPLATE_ID } from '../rules/fantasy/blackPlague';

const transitions: Record<CampaignStatus, { to: CampaignStatus; label: string; icon: typeof Play }[]> = {
  'da-iniziare': [{ to: 'in-corso', label: 'Avvia', icon: Play }],
  'in-corso': [{ to: 'sospesa', label: 'Sospendi', icon: Pause }, { to: 'completata', label: 'Completa', icon: CheckCircle2 }],
  sospesa: [{ to: 'in-corso', label: 'Riprendi', icon: Play }],
  completata: [{ to: 'in-corso', label: 'Riapri', icon: Play }],
};

export function CampaignDashboard() {
  const { campaignId = '' } = useParams();
  const navigate = useNavigate();
  const campaign = useLiveQuery(() => db.campaigns.get(campaignId), [campaignId]);
  const sessions = useLiveQuery(() => db.sessions.where('campaignId').equals(campaignId).toArray(), [campaignId]);
  const product = useLiveQuery(() => (campaign ? db.products.get(campaign.productId) : undefined), [campaign?.productId]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (campaign === undefined || sessions === undefined) return <p className="text-[var(--muted)]">Caricamento…</p>;
  if (!campaign) return <EmptyState icon={Target} title="Campagna non trovata" action={<Link to="/campagne" className="btn">Torna alle campagne</Link>} />;

  const progress = campaignProgress(campaign, sessions);
  const template = campaign.templateId ? rulesFor(campaign.universeId).campaignTemplates.find((t) => t.id === campaign.templateId) : undefined;
  const hasModule = campaign.templateId === RIO_TEMPLATE_ID || campaign.templateId === BP_TEMPLATE_ID;
  const sorted = [...sessions].sort((a, b) => b.playedOn.localeCompare(a.playedOn));

  return (
    <div data-universe={campaign.universeId} className="flex flex-col gap-5">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]" aria-label="Percorso">
        <Link to="/" className="hover:text-[var(--text)]">Dashboard</Link> /
        <Link to={scopedPath(campaign.universeId)} className="hover:text-[var(--text)]">{UNIVERSES[campaign.universeId].name}</Link> /
        <Link to={scopedPath(campaign.universeId, 'campagne')} className="hover:text-[var(--text)]">Campagne</Link> /
        <span className="text-[var(--text)]">{campaign.name}</span>
      </nav>

      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn px-2.5" aria-label="Indietro"><ArrowLeft className="size-5" /></button>
          <span className="grid size-14 place-items-center rounded-xl border-2 border-[var(--accent)] bg-black/60 text-[var(--accent)]">
            <UniverseEmblem id={campaign.universeId} className="size-8" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="title-display text-3xl sm:text-4xl">{campaign.name}</h1>
              {campaign.origin === 'demo' && <Badge tone="demo">DEMO</Badge>}
            </div>
            <p className="text-sm text-[var(--muted)]">{product?.name ?? campaign.productId} · Stato: <strong className="text-[var(--text)]">{CAMPAIGN_STATUS_LABEL[campaign.status]}</strong></p>
          </div>
          <div className="flex flex-wrap gap-2">
            {transitions[campaign.status].map(({ to, label, icon: Icon }) => (
              <button key={to} type="button" className="btn btn-accent" onClick={() => repo.setCampaignStatus(campaign.id, to)}>
                <Icon className="size-4" /> {label}
              </button>
            ))}
            <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)} aria-label="Elimina campagna"><Trash2 className="size-4" /></button>
          </div>
        </div>
        {!hasModule && <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm text-[var(--muted)]">
            <span>Progressi generali</span>
            <span>{progress.completedScenarios}{campaign.plannedScenarioCount ? ` / ${campaign.plannedScenarioCount}` : ''} scenari</span>
          </div>
          <ProgressBar value={progress.ratio} label="Progressi della campagna" />
        </div>}
      </div>

      {campaign.templateId === RIO_TEMPLATE_ID && <RioCampaign campaign={campaign} />}
      {campaign.templateId === BP_TEMPLATE_ID && <BpCampaign campaign={campaign} />}

      {template?.status === 'materiali-mancanti' && (
        <Panel title={`Scheda ${template.name}: materiali mancanti`} icon={AlertTriangle}>
          <p className="mb-2 text-sm text-[var(--muted)]">La scheda progressione verrà implementata nella Fase 3, solo sulla base del regolamento e della scheda ufficiale. Servono:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">{template.missingMaterials.map((m) => <li key={m}>{m}</li>)}</ul>
        </Panel>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {!hasModule && <Panel title="Registro partite" icon={Dices} className="xl:col-span-2">
          {sorted.length ? (
            <ul className="flex flex-col divide-y divide-[var(--line)]">
              {sorted.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                  <span className="w-28 text-[var(--muted)]">{formatDate(s.playedOn)}</span>
                  <span className="flex-1 font-medium">{s.scenarioTitle ?? s.scenarioId ?? 'Scenario'}</span>
                  <Badge tone={s.outcome === 'vittoria' ? 'ok' : s.outcome === 'sconfitta' ? 'danger' : 'neutral'}>{SESSION_OUTCOME_LABEL[s.outcome]}</Badge>
                  {s.origin === 'demo' && <Badge tone="demo">DEMO</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Dices} title="Nessuna partita registrata">La registrazione delle partite per questo tipo di campagna arriverà con il suo modulo regole.</EmptyState>
          )}
        </Panel>}
        <div className={`flex flex-col gap-5 ${hasModule ? 'xl:col-span-3 md:grid md:grid-cols-2' : ''}`}>
          <Panel title="Descrizione" icon={Trophy}>
            <p className="text-sm text-[var(--muted)]">{campaign.description || 'Nessuna descrizione.'}</p>
          </Panel>
          <Panel title="Note" icon={NotebookPen}>
            <textarea
              className="input min-h-28 text-sm"
              defaultValue={campaign.notes ?? ''}
              placeholder="Strategie, decisioni, promemoria…"
              onBlur={(e) => { if (e.target.value !== (campaign.notes ?? '')) repo.updateCampaign(campaign.id, { notes: e.target.value }); }}
              aria-label="Note della campagna"
            />
          </Panel>
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Eliminare la campagna?"
        footer={<>
          <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>Annulla</button>
          <button type="button" className="btn btn-danger" onClick={async () => { await repo.deleteCampaign(campaign.id); navigate(scopedPath(campaign.universeId, 'campagne')); }}>
            <Trash2 className="size-4" /> Elimina definitivamente
          </button>
        </>}
      >
        <p className="text-sm">Verranno eliminate anche le partite registrate in questa campagna. Prima di procedere puoi esportare un backup da Impostazioni.</p>
      </Modal>
    </div>
  );
}
