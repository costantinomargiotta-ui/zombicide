import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PanelProps {
  title?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, icon: Icon, action, children, className = '', bodyClassName = '' }: PanelProps) {
  return (
    <section className={`panel animate-rise ${className}`}>
      {title && (
        <header className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-2.5">
          {Icon && <Icon className="size-5 shrink-0 text-[var(--accent-2)]" aria-hidden />}
          <h2 className="title-display flex-1 truncate text-xl sm:text-2xl">{title}</h2>
          {action}
        </header>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
