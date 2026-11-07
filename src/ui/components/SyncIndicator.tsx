import { AlertTriangle, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { syncNow, useSyncStatus } from '../../data/syncController';
import { relativeTime } from '../../lib/format';

const LABEL = {
  'in-attesa': 'In attesa di accesso',
  'in-corso': 'Sincronizzazione in corso…',
  sincronizzato: 'Sincronizzato',
  'non-in-linea': 'Non in linea: le modifiche verranno inviate al ritorno della rete',
  errore: 'Errore di sincronizzazione',
} as const;

export function SyncIndicator() {
  const s = useSyncStatus();
  if (s.status === 'disattivata') return null;
  const Icon = s.status === 'in-corso' ? RefreshCw : s.status === 'errore' ? AlertTriangle : s.status === 'non-in-linea' ? CloudOff : Cloud;
  const color = s.status === 'sincronizzato' ? 'text-[var(--ok)]' : s.status === 'errore' ? 'text-red-400' : 'text-[var(--muted)]';
  const title = `${LABEL[s.status]}${s.lastSync ? ` · ultima: ${relativeTime(s.lastSync)} ${new Date(s.lastSync).toLocaleTimeString('it-IT')}` : ''}${s.error ? ` · ${s.error}` : ''}`;
  return (
    <button type="button" onClick={() => void syncNow()} className="btn px-2.5" title={title} aria-label={title}>
      <Icon className={`size-5 ${color} ${s.status === 'in-corso' ? 'animate-spin' : ''}`} />
    </button>
  );
}
