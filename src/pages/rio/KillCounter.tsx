import { Minus, RotateCcw, Skull } from 'lucide-react';
import type { CampaignParticipant, Character } from '../../domain/types';
import { ZOMBIE_TYPES, totalKills } from '../../domain/kills';
import { liveKills, rioRepo } from '../../data/rioRepository';
import { Panel } from '../../ui/components/Panel';
import { Portrait } from './RioCampaign';

/** Contatore da usare al tavolo: un tocco = uno zombie eliminato. I dati passano nel modulo di fine missione. */
export function KillCounter({ campaignId, participants, characters }: { campaignId: string; participants: CampaignParticipant[]; characters: Map<string, Character> }) {
  const grand = participants.reduce((a, p) => a + totalKills(liveKills(p)), 0);
  return (
    <Panel title="Contatore zombie · missione in corso" icon={Skull}
      action={<span className="flex items-center gap-3"><span className="text-lg font-bold text-[var(--accent-2)]">{grand}</span>
        {grand > 0 && <button type="button" className="btn px-2 py-1 text-xs" onClick={() => { if (confirm('Azzerare il contatore di tutti i sopravvissuti?')) void rioRepo.resetLiveKills(campaignId); }}><RotateCcw className="size-3" /> Azzera</button>}</span>}>
      <p className="mb-3 text-xs text-[var(--muted)]">Tocca il tipo di zombie ogni volta che un sopravvissuto ne elimina uno; il «−» corregge un errore. Alla registrazione della missione i conteggi vengono inseriti da soli e il contatore si azzera.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {participants.map((p) => {
          const k = liveKills(p);
          const c = characters.get(p.characterId);
          return (
            <div key={p.id} className="rounded-lg border-2 border-white/15 bg-black/40 p-2">
              <div className="mb-2 flex items-center gap-2">
                <span className="size-10 shrink-0 overflow-hidden rounded-md"><Portrait c={c} /></span>
                <span className="flex-1 text-lg font-semibold">{c?.name}</span>
                <span className="flex items-center gap-1 text-2xl font-bold text-[var(--accent-2)]"><Skull className="size-5" />{totalKills(k)}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {ZOMBIE_TYPES.map((t) => (
                  <div key={t.id} className="flex flex-col gap-1">
                    <button type="button" onClick={() => void rioRepo.addLiveKill(p.id, t.id, 1)} aria-label={`${c?.name}: +1 ${t.label}`}
                      className="flex flex-col items-center rounded-md border-2 border-[#8a4a00] bg-gradient-to-b from-[#ffb21e] to-[#e88a00] py-2 font-semibold text-black active:translate-y-px">
                      <span className="text-xl leading-none">{k[t.id] ?? 0}</span>
                      <span className="text-[11px]">{t.short}</span>
                    </button>
                    <button type="button" onClick={() => void rioRepo.addLiveKill(p.id, t.id, -1)} disabled={!k[t.id]} aria-label={`${c?.name}: −1 ${t.label}`}
                      className="grid h-6 place-items-center rounded border border-white/20 bg-black/40 disabled:opacity-30"><Minus className="size-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
