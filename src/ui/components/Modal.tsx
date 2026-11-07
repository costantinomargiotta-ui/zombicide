import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="panel m-auto w-[min(640px,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] p-0 text-[var(--text)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <header className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
            <h2 className="title-display flex-1 text-2xl">{title}</h2>
            <button type="button" className="btn px-2 py-1" onClick={onClose} aria-label="Chiudi">
              <X className="size-4" />
            </button>
          </header>
          <div className="overflow-y-auto p-4">{children}</div>
          {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-[var(--line)] px-4 py-3">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      {children}
      {hint && <span className="text-xs text-[var(--muted)]">{hint}</span>}
    </label>
  );
}
