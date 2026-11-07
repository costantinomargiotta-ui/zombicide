import type { LucideIcon } from 'lucide-react';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  /** null = dato non registrato. */
  value: string | number | null;
  hint?: string;
}

export function StatTile({ icon: Icon, label, value, hint }: StatTileProps) {
  const missing = value === null;
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--line)] bg-black/30 px-3 py-2.5">
      <Icon className="size-7 shrink-0 text-[var(--accent-2)]" aria-hidden />
      <div className="min-w-0">
        <div className="truncate text-xs uppercase tracking-wide text-[var(--muted)]">{label}</div>
        <div className={missing ? 'text-sm text-[var(--muted)] italic' : 'text-2xl leading-tight font-semibold'} title={hint}>
          {missing ? 'Non disponibile' : value}
        </div>
      </div>
    </div>
  );
}
