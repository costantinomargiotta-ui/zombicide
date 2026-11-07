const dateFmt = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
const numFmt = new Intl.NumberFormat('it-IT');

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatNumber = (n: number) => numFmt.format(n);
export const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`;

/** "ieri", "3 giorni fa", ecc. */
export function relativeTime(iso: string, now = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'oggi';
  if (days === 1) return 'ieri';
  if (days < 30) return `${days} giorni fa`;
  return formatDate(iso);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} h ${m.toString().padStart(2, '0')} min` : `${m} min`;
}
