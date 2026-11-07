import { useState } from 'react';
import { repo } from '../data/repository';
import { PRODUCT_KIND_LABEL, UNIVERSE_IDS, type Product, type ProductKind, type UniverseId } from '../domain/types';
import { UNIVERSES } from '../domain/universes';
import { Field, Modal } from '../ui/components/Modal';
import { ImagePicker } from '../ui/components/ImagePicker';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  defaultUniverse?: UniverseId;
  allProducts: Product[];
}

/** Aggiunta o modifica di un prodotto del catalogo, senza toccare il codice. */
export function ProductForm({ open, onClose, product, defaultUniverse, allProducts }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [universeId, setUniverseId] = useState<UniverseId>(product?.universeId ?? defaultUniverse ?? 'moderno');
  const [kind, setKind] = useState<ProductKind>(product?.kind ?? 'espansione');
  const [description, setDescription] = useState(product?.description ?? '');
  const [contents, setContents] = useState((product?.contents ?? []).join('\n'));
  const [requires, setRequires] = useState<string[]>(product?.requires ?? []);
  const [verified, setVerified] = useState(product?.dataStatus === 'verificato');
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const candidates = allProducts.filter((p) => p.universeId === universeId && p.id !== product?.id);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      let coverImageId = removeImage ? undefined : product?.coverImageId;
      if (file) coverImageId = await repo.saveImage(file);
      if ((file || removeImage) && product?.coverImageId) await repo.deleteImage(product.coverImageId);
      await repo.saveProduct({
        id: product?.id,
        name: name.trim(),
        universeId,
        kind,
        description: description.trim() || undefined,
        contents: contents.split('\n').map((l) => l.trim()).filter(Boolean),
        requires: requires.filter((r) => candidates.some((c) => c.id === r)),
        coverImageId,
        dataStatus: verified ? 'verificato' : 'da-verificare',
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? 'Modifica prodotto' : 'Nuovo prodotto'}
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>Annulla</button>
          <button type="submit" form="product-form" className="btn btn-accent" disabled={saving || !name.trim()}>Salva</button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Nome"><input className="input" value={name} onChange={(e) => setName(e.target.value)} required autoFocus /></Field>
        </div>
        <Field label="Universo">
          <select className="input" value={universeId} onChange={(e) => setUniverseId(e.target.value as UniverseId)}>
            {UNIVERSE_IDS.map((u) => <option key={u} value={u}>{UNIVERSES[u].name}</option>)}
          </select>
        </Field>
        <Field label="Tipologia">
          <select className="input" value={kind} onChange={(e) => setKind(e.target.value as ProductKind)}>
            {Object.entries(PRODUCT_KIND_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Immagine della scatola">
            <ImagePicker
              imageId={removeImage ? undefined : product?.coverImageId}
              pendingFile={file}
              onPick={(f) => { setFile(f); setRemoveImage(false); }}
              onRemove={() => { setFile(null); setRemoveImage(true); }}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Descrizione"><textarea className="input min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Contenuti inclusi" hint="Uno per riga, come indicato sulla scatola o nel regolamento.">
            <textarea className="input min-h-20" value={contents} onChange={(e) => setContents(e.target.value)} />
          </Field>
        </div>
        {candidates.length > 0 && (
          <fieldset className="sm:col-span-2">
            <legend className="mb-1 text-sm text-[var(--muted)]">Richiede</legend>
            <div className="flex flex-wrap gap-2">
              {candidates.map((c) => (
                <label key={c.id} className="flex items-center gap-1.5 rounded-md border border-[var(--line)] px-2 py-1 text-sm">
                  <input type="checkbox" checked={requires.includes(c.id)} onChange={(e) => setRequires((r) => e.target.checked ? [...r, c.id] : r.filter((x) => x !== c.id))} />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          Dati verificati su materiale ufficiale
        </label>
      </form>
    </Modal>
  );
}
