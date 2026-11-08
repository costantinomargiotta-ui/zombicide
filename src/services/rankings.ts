import { killsOf } from '../domain/kills';
import type { CampaignParticipant, Character, GameSession, ProgressEntry, SessionParticipant, UniverseId } from '../domain/types';

/** Classifiche e serie temporali, calcolate solo dai dati registrati. Funzioni pure. */
export interface RankingInput {
  sessions: GameSession[];
  sessionParticipants: SessionParticipant[];
  participants: CampaignParticipant[];
  progress: ProgressEntry[];
  characters: Character[];
}

export interface CharacterRank { characterId: string; name: string; played: number; victories: number; pec: number; kills: number }
export interface PlayerRank { name: string; played: number; victories: number; characters: string[]; kills: number }
export interface MonthBucket { month: string; label: string; victories: number; defeats: number }

const concluded = (s: GameSession) => s.outcome === 'vittoria' || s.outcome === 'sconfitta';

function scoped(input: RankingInput, universeId?: UniverseId) {
  const sessions = input.sessions.filter((s) => concluded(s) && (!universeId || s.universeId === universeId));
  const ids = new Set(sessions.map((s) => s.id));
  return { sessions, sps: input.sessionParticipants.filter((p) => ids.has(p.sessionId)) };
}

export function characterRanking(input: RankingInput, universeId?: UniverseId): CharacterRank[] {
  const { sessions, sps } = scoped(input, universeId);
  const byId = new Map(sessions.map((s) => [s.id, s]));
  const out = new Map<string, CharacterRank>();
  for (const sp of sps) {
    if (!sp.characterId) continue;
    const r = out.get(sp.characterId) ?? { characterId: sp.characterId, name: input.characters.find((c) => c.id === sp.characterId)?.name ?? sp.characterId, played: 0, victories: 0, pec: 0, kills: 0 };
    r.played += 1;
    r.kills += killsOf(sp.campaignData) ?? 0;
    if (byId.get(sp.sessionId)?.outcome === 'vittoria') r.victories += 1;
    out.set(sp.characterId, r);
  }
  // PEC: somma delle schede di campagna di quel personaggio.
  for (const e of input.progress) {
    if (e.payload.kind !== 'pec') continue;
    const part = input.participants.find((p) => p.id === e.participantId);
    const r = part && out.get(part.characterId);
    if (r) r.pec += Number(e.payload.amount) || 0;
  }
  return [...out.values()].sort((a, b) => b.played - a.played || b.victories - a.victories || a.name.localeCompare(b.name));
}

export function playerRanking(input: RankingInput, universeId?: UniverseId): PlayerRank[] {
  const { sessions, sps } = scoped(input, universeId);
  const byId = new Map(sessions.map((s) => [s.id, s]));
  const out = new Map<string, PlayerRank>();
  for (const sp of sps) {
    const part = input.participants.find((p) => p.id === sp.participantId);
    const fromSession = typeof sp.campaignData?.playerName === 'string' ? sp.campaignData.playerName : undefined;
    const name = (part?.playerName ?? fromSession)?.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const r = out.get(key) ?? { name, played: 0, victories: 0, characters: [], kills: 0 };
    r.played += 1;
    r.kills += killsOf(sp.campaignData) ?? 0;
    if (byId.get(sp.sessionId)?.outcome === 'vittoria') r.victories += 1;
    const cname = input.characters.find((c) => c.id === sp.characterId)?.name;
    if (cname && !r.characters.includes(cname)) r.characters.push(cname);
    out.set(key, r);
  }
  return [...out.values()].sort((a, b) => b.played - a.played || a.name.localeCompare(b.name));
}

const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

/** Vittorie e sconfitte per mese, dal primo all'ultimo mese con partite (mesi vuoti inclusi). */
export function sessionsByMonth(input: RankingInput, universeId?: UniverseId): MonthBucket[] {
  const { sessions } = scoped(input, universeId);
  if (!sessions.length) return [];
  const months = sessions.map((s) => s.playedOn.slice(0, 7)).sort();
  const out: MonthBucket[] = [];
  let [y, m] = months[0].split('-').map(Number);
  const [ly, lm] = months[months.length - 1].split('-').map(Number);
  while (y < ly || (y === ly && m <= lm)) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    const own = sessions.filter((s) => s.playedOn.startsWith(key));
    out.push({ month: key, label: `${MONTHS[m - 1]} ${String(y).slice(2)}`, victories: own.filter((s) => s.outcome === 'vittoria').length, defeats: own.filter((s) => s.outcome === 'sconfitta').length });
    m += 1; if (m > 12) { m = 1; y += 1; }
  }
  return out;
}
