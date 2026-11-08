/**
 * Conteggio degli zombie eliminati. Tipi base di Zombicide 2ª edizione (Regolamento, pag. 17):
 * Deambulante, Bruto, Corridore, Abominio. Il regolamento non chiede di contarli:
 * è un dato facoltativo dell'utente.
 */
export const ZOMBIE_TYPES = [
  { id: 'deambulante', label: 'Deambulante', short: 'Deamb.' },
  { id: 'corridore', label: 'Corridore', short: 'Corr.' },
  { id: 'bruto', label: 'Bruto', short: 'Bruto' },
  { id: 'abominio', label: 'Abominio', short: 'Abom.' },
] as const;

export type ZombieType = (typeof ZOMBIE_TYPES)[number]['id'];
export type KillCount = Partial<Record<ZombieType, number>>;

export const totalKills = (k?: KillCount) => Object.values(k ?? {}).reduce((a, b) => a + (b ?? 0), 0);

/** Uccisioni registrate in un partecipante di partita (campaignData.kills o campaignData.killsTotal). */
export function killsOf(campaignData?: Record<string, unknown>): number | undefined {
  const k = campaignData?.kills as KillCount | undefined;
  if (k && Object.keys(k).length) return totalKills(k);
  return typeof campaignData?.killsTotal === 'number' ? campaignData.killsTotal : undefined;
}
