import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, children, action }: { icon: LucideIcon; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--line)] px-4 py-6 text-center">
      <Icon className="size-8 text-[var(--muted)]" aria-hidden />
      <p className="font-semibold">{title}</p>
      {children && <p className="max-w-md text-sm text-[var(--muted)]">{children}</p>}
      {action}
    </div>
  );
}
