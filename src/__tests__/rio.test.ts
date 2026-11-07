import { describe, expect, it } from 'vitest';
import {
  CAMPAIGN_ABILITIES, PEC_MILESTONES, RIO_MISSIONS, computeSheet, missionPec, missionProgress, validateReward,
  type ProgressRow,
} from '../rules/moderno/rioZJaneiro';

let n = 0;
const row = (payload: ProgressRow['payload'], sessionId?: string): ProgressRow => ({ id: `r${n++}`, participantId: 'p1', sessionId, payload });
const pec = (amount: number, sessionId = 's') => row({ kind: 'pec', amount, reason: 'manuale' }, sessionId);

describe('Rio Z Janeiro: scheda campagna', () => {
  it('riproduce la struttura della scheda ufficiale', () => {
    expect(PEC_MILESTONES).toEqual([2, 5, 8, 11, 14, 17, 20]);
    expect(CAMPAIGN_ABILITIES).toHaveLength(14);
    expect(RIO_MISSIONS.map((m) => m.code)).toEqual(['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']);
  });

  it('al massimo 2 PEC standard per Missione, più quelli della Missione', () => {
    expect(missionPec({ reachedOrange: true, reachedRed: true, extra: 0 })).toHaveLength(2);
    expect(missionPec({ reachedOrange: false, reachedRed: false, extra: 1 })).toEqual([{ kind: 'pec', amount: 1, reason: 'missione' }]);
  });

  it('le Pietre Miliari raggiunte chiedono una ricompensa', () => {
    const s = computeSheet([pec(2), pec(3)]);
    expect(s.pec).toBe(5);
    expect(s.pendingMilestones).toEqual([2, 5]);
  });

  it('Azioni Bonus cumulative e Abilità della Campagna uniche', () => {
    const rows = [pec(8),
      row({ kind: 'ricompensa', milestone: 2, choice: 'azione-bonus' }),
      row({ kind: 'ricompensa', milestone: 5, choice: 'azione-bonus' }),
      row({ kind: 'ricompensa', milestone: 8, choice: 'abilita-campagna', abilityId: 'rio-salvatore' })];
    const s = computeSheet(rows);
    expect(s.bonusActions).toBe(2);
    expect(s.campaignAbilityIds).toEqual(['rio-salvatore']);
    expect(s.pendingMilestones).toEqual([]);
    expect(validateReward(computeSheet([pec(11), ...rows.slice(1)]), 11, 'abilita-campagna', 'rio-salvatore')).toMatch(/già/);
  });

  it('correggere una partita non duplica i PEC e segnala le ricompense rimaste senza Pietra Miliare', () => {
    const before = [pec(3, 's1'), row({ kind: 'ricompensa', milestone: 2, choice: 'azione-bonus' })];
    const corrected = before.filter((r) => r.sessionId !== 's1').concat(pec(1, 's1'));
    const s = computeSheet(corrected);
    expect(s.pec).toBe(1);
    expect(s.bonusActions).toBe(0);
    expect(s.orphanRewards).toEqual([2]);
  });

  it('i Traguardi passano al successore di un Sopravvissuto morto', () => {
    const dead = computeSheet([row({ kind: 'traguardo', text: 'Opala Nera' }), row({ kind: 'stato', status: 'morto' })]);
    expect(dead.dead).toBe(true);
    const heir = computeSheet([], dead.traguardi);
    expect(heir.traguardi).toEqual(['Opala Nera']);
    expect(heir.pec).toBe(0);
  });

  it('le Missioni si sbloccano in ordine; una sconfitta lascia la Missione disponibile', () => {
    const p = missionProgress([{ scenarioId: 'rio-m1', outcome: 'vittoria' }, { scenarioId: 'rio-m2', outcome: 'sconfitta' }]);
    expect(p.slice(0, 3).map((m) => m.state)).toEqual(['completata', 'disponibile', 'bloccata']);
    expect(p[1].attempts).toBe(1);
  });
});
