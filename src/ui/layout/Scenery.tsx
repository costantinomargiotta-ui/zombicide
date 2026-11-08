import type { UniverseId } from '../../domain/types';

/**
 * Decorazioni originali disegnate in SVG (nessuna grafica ufficiale):
 * skyline per universo nella testata e schizzi di sangue sui bordi, come nei mockup.
 */

// Generatore deterministico, così il disegno è identico a ogni caricamento.
function rng(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}

function Favela() {
  const r = rng(7);
  const colors = ['#e94b3c', '#f2c418', '#2f8fd8', '#57c02a', '#f07d1a', '#c03bd0', '#e8e1d2', '#14a3a3'];
  const houses = [];
  let x = 0;
  while (x < 1600) {
    const w = 18 + r() * 26;
    const base = 120 - Math.sin(x / 260) * 28 - 20;
    const h = 14 + r() * 26;
    houses.push(<rect key={x} x={x} y={base - h} width={w} height={h + 60} fill={colors[Math.floor(r() * colors.length)]} opacity={0.8} />);
    if (r() > 0.5) houses.push(<rect key={`w${x}`} x={x + w / 3} y={base - h + 5} width={4} height={5} fill="#1a1208" opacity={0.6} />);
    x += w - 2;
  }
  return <g>{houses}</g>;
}

function Palm({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${s})`} fill="#0b0b0d">
      <path d="M0 140 C 4 110 6 80 2 50 L 6 50 C 10 80 9 110 6 140 Z" />
      <path d="M4 50 C -20 40 -40 46 -52 60 C -32 48 -14 48 4 54 Z" />
      <path d="M4 50 C 28 38 48 44 60 58 C 40 46 20 48 4 54 Z" />
      <path d="M4 50 C -6 30 -26 22 -40 26 C -22 28 -8 38 4 52 Z" />
      <path d="M4 50 C 16 28 36 22 48 28 C 30 30 16 40 4 52 Z" />
    </g>
  );
}

const SKY: Record<UniverseId | 'globale', string> = {
  moderno: 'linear-gradient(180deg,#1d5a8a 0%,#e98a3a 70%,#7a1b12 100%)',
  fantasy: 'linear-gradient(180deg,#2b0f3d 0%,#6a2a6e 60%,#3b0c14 100%)',
  western: 'linear-gradient(180deg,#5a2a0e 0%,#e08a32 65%,#3a1d07 100%)',
  marvel: 'linear-gradient(180deg,#0d1c40 0%,#3a2a7a 60%,#2b0c35 100%)',
  globale: '#000000',
};

export function HeaderScenery({ universeId }: { universeId?: UniverseId }) {
  const key = universeId ?? 'globale';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ background: SKY[key] }}>
      <svg viewBox="0 0 1600 140" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        {key === 'moderno' && (
          <>
            <path d="M980 140 L1080 60 L1140 40 L1200 70 L1320 140 Z" fill="#132a1a" opacity={0.85} />
            {/* Statua sul monte: sagoma generica */}
            <g fill="#0b0b0d" transform="translate(1136 8)"><rect x="3" y="0" width="5" height="34" /><rect x="-12" y="8" width="35" height="4" /><rect x="0" y="32" width="11" height="6" /></g>
            <Favela />
            <Palm x={120} s={0.9} /><Palm x={420} s={1.1} /><Palm x={760} s={0.8} /><Palm x={1420} s={1.05} />
          </>
        )}
        {key === 'fantasy' && <path d="M0 140 V100 h40 V70 l20-26 20 26 v30 h60 V60 l30-40 30 40 v40 h80 V84 h30 v-20 h16 v20 h30 v36 h90 V50 l40-50 40 50 v50 h120 V90 h60 v50 h300 V96 h50 V60 l24-30 24 30 v36 h160 V80 h70 v60 Z" fill="#0b0b0d" opacity={0.85} />}
        {key === 'western' && <path d="M0 140 V118 h120 V96 l50-26 50 26 v22 h80 v-18 h10 v-40 l10-10 10 10 v40 h10 v18 h200 V100 h120 v18 h300 l40-30 40 30 v22 h180 V104 h90 v36 Z" fill="#0b0b0d" opacity={0.85} />}
        {key === 'marvel' && <path d="M0 140 V80 h40 V30 h40 v50 h30 V10 h50 v70 h40 V40 h60 v40 h40 V20 l20-20 20 20 v60 h60 V50 h70 v90 h120 V60 h40 V20 h40 v60 h60 V36 h70 v104 h200 V70 h50 V24 h40 v116 Z" fill="#0b0b0d" opacity={0.85} />}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />
    </div>
  );
}

/** Schizzi rossi e gialli sul bordo inferiore della finestra, presi dal mockup dell'utente. */
export function BloodEdge() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0" aria-hidden>
      <img src="/ui/zombie-angolo.webp" alt="" className="absolute bottom-0 left-0 hidden w-64 opacity-90 lg:block" />
      <img src="/ui/schizzi-basso.webp" alt="" className="block h-6 w-full object-cover object-bottom sm:h-8" />
    </div>
  );
}

/** Schizzi di colore netti sui bordi laterali della pagina, come nel mockup della Dashboard. */
export function PaintSplatter() {
  return (
    <div className="pointer-events-none fixed inset-y-0 inset-x-0 z-0 hidden overflow-hidden lg:block" aria-hidden>
      <img src="/ui/schizzi-lato.webp" alt="" className="absolute top-0 left-0 h-full w-3 object-cover opacity-80" />
      <img src="/ui/schizzi-lato.webp" alt="" className="absolute top-0 right-0 h-full w-3 -scale-x-100 object-cover opacity-80" />
      <span className="absolute -top-24 -right-24 size-72 rounded-full bg-[#c4141b] opacity-25 blur-3xl" />
      <span className="absolute top-1/3 -left-24 size-64 rounded-full bg-[#e0a312] opacity-15 blur-3xl" />
    </div>
  );
}
