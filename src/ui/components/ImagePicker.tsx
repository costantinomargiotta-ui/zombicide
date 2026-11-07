import { useEffect, useMemo } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useImageUrl } from '../../data/hooks';

interface ImagePickerProps {
  imageId?: string;
  pendingFile?: File | null;
  onPick: (file: File | null) => void;
  onRemove: () => void;
}

/** Selettore di immagine: l'immagine viene salvata solo alla conferma del modulo. */
export function ImagePicker({ imageId, pendingFile, onPick, onRemove }: ImagePickerProps) {
  const storedUrl = useImageUrl(imageId);
  const pendingUrl = useMemo(() => (pendingFile ? URL.createObjectURL(pendingFile) : undefined), [pendingFile]);
  useEffect(() => () => { if (pendingUrl) URL.revokeObjectURL(pendingUrl); }, [pendingUrl]);
  const previewUrl = pendingUrl ?? storedUrl;
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-[var(--line)] bg-black/40">
        {previewUrl ? <img src={previewUrl} alt="Anteprima" className="size-full object-cover" /> : <ImagePlus className="size-8 text-[var(--muted)]" />}
      </div>
      <div className="flex flex-col gap-2">
        <label className="btn cursor-pointer">
          <ImagePlus className="size-4" /> Carica immagine
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
        </label>
        {previewUrl && (
          <button type="button" className="btn btn-danger" onClick={onRemove}>
            <Trash2 className="size-4" /> Rimuovi
          </button>
        )}
      </div>
    </div>
  );
}
