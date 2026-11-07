import { useRef, useState } from 'react';
import { Cloud, Database, Download, FlaskConical, HardDrive, LogOut, RefreshCw, Trash2, Upload } from 'lucide-react';
import { supabase } from '../data/supabase';
import { syncNow, useSyncStatus } from '../data/syncController';
import { formatDate } from '../lib/format';
import { downloadJson, exportBackup, importBackup } from '../data/backup';
import { loadDemoData, removeDemoData } from '../data/demo';
import { useHasDemoData } from '../data/hooks';
import { repo } from '../data/repository';
import { Panel } from '../ui/components/Panel';
import { Modal } from '../ui/components/Modal';

export function SettingsPage() {
  const hasDemo = useHasDemoData();
  const sync = useSyncStatus();
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const [pending, setPending] = useState<unknown>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function doExport() {
    const data = await exportBackup();
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    downloadJson(data, `zombicide-hub-backup-${stamp}.json`);
    await repo.log('sistema', 'Backup esportato');
    setMessage({ tone: 'ok', text: 'Backup esportato.' });
  }

  async function pickFile(file?: File) {
    if (!file) return;
    try {
      setPending(JSON.parse(await file.text()));
    } catch {
      setMessage({ tone: 'err', text: 'Il file non è un JSON valido.' });
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  async function confirmImport() {
    try {
      await importBackup(pending);
      await repo.log('sistema', 'Backup ripristinato');
      setMessage({ tone: 'ok', text: 'Backup ripristinato correttamente.' });
    } catch (e) {
      setMessage({ tone: 'err', text: (e as Error).message });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {message && (
        <p role="status" className={`rounded-md border px-3 py-2 text-sm lg:col-span-2 ${message.tone === 'ok' ? 'border-green-700 bg-green-900/30' : 'border-red-700 bg-red-900/30'}`}>
          {message.text}
        </p>
      )}
      <Panel title="Backup ed esportazione" icon={Database}>
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-[var(--muted)]">Esporta tutti i dati (catalogo, collezione, campagne, partite e immagini) in un file JSON. Il ripristino sostituisce i dati attuali.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-accent" onClick={doExport}><Download className="size-4" /> Esporta backup</button>
            <label className="btn cursor-pointer">
              <Upload className="size-4" /> Ripristina da file
              <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
            </label>
          </div>
        </div>
      </Panel>

      <Panel title="Dati dimostrativi" icon={FlaskConical}>
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-[var(--muted)]">Campagne e partite di esempio per vedere le schermate popolate. Sono marcate DEMO e si rimuovono in blocco senza toccare i dati reali.</p>
          <div className="flex flex-wrap gap-2">
            {hasDemo ? (
              <button type="button" className="btn btn-danger" onClick={() => removeDemoData()}><Trash2 className="size-4" /> Rimuovi dati dimostrativi</button>
            ) : (
              <button type="button" className="btn" onClick={() => loadDemoData()}><FlaskConical className="size-4" /> Carica dati dimostrativi</button>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="Account e sincronizzazione" icon={supabase ? Cloud : HardDrive} className="lg:col-span-2">
        {supabase ? (
          <div className="flex flex-col gap-3 text-sm">
            <p>Accesso come <strong>{sync.email ?? '…'}</strong>. I dati vengono salvati su questo dispositivo e sincronizzati con Supabase: li ritrovi su computer, iPad e smartphone. Senza rete l'app continua a funzionare e invia le modifiche al ritorno della connessione.</p>
            <p className="text-[var(--muted)]">
              Stato: {sync.status === 'sincronizzato' ? 'sincronizzato' : sync.status === 'in-corso' ? 'sincronizzazione in corso' : sync.status === 'non-in-linea' ? 'non in linea' : sync.status === 'errore' ? `errore (${sync.error})` : 'in attesa'}
              {sync.lastSync ? ` · ultima sincronizzazione ${formatDate(sync.lastSync)} alle ${new Date(sync.lastSync).toLocaleTimeString('it-IT')}` : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-accent" onClick={() => void syncNow()}><RefreshCw className="size-4" /> Sincronizza ora</button>
              <button type="button" className="btn" onClick={() => void supabase!.auth.signOut()}><LogOut className="size-4" /> Esci</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Modalità locale: i dati sono salvati solo nel browser di questo dispositivo (IndexedDB). Esporta regolarmente un backup. La sincronizzazione si attiva quando l'app viene collegata a Supabase.
          </p>
        )}
      </Panel>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Ripristinare il backup?"
        footer={<>
          <button type="button" className="btn" onClick={() => setPending(null)}>Annulla</button>
          <button type="button" className="btn btn-danger" onClick={confirmImport}>Sostituisci i dati</button>
        </>}
      >
        <p className="text-sm">Tutti i dati attuali verranno sostituiti con quelli del file. Ti consiglio di esportare prima un backup dello stato attuale.</p>
      </Modal>
    </div>
  );
}
