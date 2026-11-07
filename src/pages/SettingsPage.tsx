import { useRef, useState } from 'react';
import { Database, Download, FlaskConical, HardDrive, Trash2, Upload } from 'lucide-react';
import { downloadJson, exportBackup, importBackup } from '../data/backup';
import { loadDemoData, removeDemoData } from '../data/demo';
import { useHasDemoData } from '../data/hooks';
import { repo } from '../data/repository';
import { Panel } from '../ui/components/Panel';
import { Modal } from '../ui/components/Modal';

export function SettingsPage() {
  const hasDemo = useHasDemoData();
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

      <Panel title="Archiviazione" icon={HardDrive} className="lg:col-span-2">
        <p className="text-sm text-[var(--muted)]">
          In questa prima versione i dati sono salvati nel database del browser (IndexedDB) di questo dispositivo. Il collegamento a Supabase, per sincronizzare computer, iPad e smartphone, è predisposto nello schema in <code>supabase/migrations</code>. Fino ad allora esporta regolarmente un backup.
        </p>
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
