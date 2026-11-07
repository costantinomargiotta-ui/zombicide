import { formatPercent } from '../../lib/format';

interface ProgressBarProps {
  /** Valore tra 0 e 1; null = non calcolabile. */
  value: number | null;
  label?: string;
  showValue?: boolean;
  color?: string;
}

export function ProgressBar({ value, label, showValue = true, color }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="progress-track flex-1"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value === null ? undefined : Math.round(value * 100)}
      >
        <div className="progress-fill" style={{ width: `${(value ?? 0) * 100}%`, ['--bar' as string]: color }} />
      </div>
      {showValue && (
        <span className={value === null ? 'w-24 text-right text-xs text-[var(--muted)] italic' : 'w-12 text-right font-semibold'}>
          {value === null ? 'Non disponibile' : formatPercent(value)}
        </span>
      )}
    </div>
  );
}
