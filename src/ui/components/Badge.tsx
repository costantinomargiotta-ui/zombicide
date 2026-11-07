import type { ReactNode } from 'react';

const tones = {
  neutral: 'border-[var(--line)] bg-white/5 text-[var(--muted)]',
  ok: 'border-green-700 bg-green-600/90 text-white',
  warn: 'border-amber-600 bg-amber-500/15 text-amber-300',
  demo: 'border-fuchsia-600 bg-fuchsia-600/20 text-fuchsia-300',
  accent: 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]',
  danger: 'border-red-800 bg-red-700/30 text-red-200',
};

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}
