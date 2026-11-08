import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Box, ClipboardList, Globe, Library, Menu, Package, Settings, Target, Trophy, Users, X } from 'lucide-react';
import { UNIVERSES } from '../../domain/universes';
import { UNIVERSE_IDS } from '../../domain/types';
import { scopedPath, useScope } from '../../lib/scope';
import { UniverseEmblem } from '../components/UniverseEmblem';
import { NAV_ITEMS } from './navigation';
import { SyncIndicator } from '../components/SyncIndicator';
import { BloodEdge, HeaderScenery } from './Scenery';

function Logo() {
  const { universeId } = useScope();
  return (
    <Link to="/" className="focus-ring relative flex shrink-0 flex-col items-center leading-none" aria-label="Zombicide Hub, vai alla dashboard globale">
      <img src="/ui/logo.webp" alt="Zombicide Hub" className="h-14 w-auto drop-shadow-[0_3px_0_rgba(0,0,0,0.8)] sm:h-16" />
      {universeId && <span className="title-display -mt-1 text-sm text-[var(--accent-2)]">{UNIVERSES[universeId].name.toUpperCase()}</span>}
    </Link>
  );
}

function TopNav({ onNavigate }: { onNavigate?: () => void }) {
  const { path } = useScope();
  return (
    <>
      {NAV_ITEMS.map(({ sub, label, icon: Icon }) => (
        <NavLink
          key={sub}
          to={path(sub)}
          end={sub === ''}
          onClick={onNavigate}
          className={({ isActive }) =>
            `btn focus-ring justify-start whitespace-nowrap px-3 py-1.5 text-sm ${isActive ? 'btn-accent' : ''}`
          }
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </NavLink>
      ))}
    </>
  );
}

function UniverseSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const { universeId } = useScope();
  const location = useLocation();
  // Mantiene la sezione corrente quando si cambia universo (es. collezione → collezione).
  const section = location.pathname.replace(/^\/u\/[^/]+/, '').replace(/^\//, '').split('/')[0];
  const keepSection = NAV_ITEMS.some((n) => n.sub === section) ? section : '';

  const ROW: Record<string, string> = {
    fantasy: 'from-[#5a1f86] to-[#2b0f45] border-[#9b4de0]',
    moderno: 'from-[#2f6a12] to-[#13300a] border-[#7ccf2a]',
    western: 'from-[#8a3d10] to-[#3d1a06] border-[#ec7a1c]',
    marvel: 'from-[#14427e] to-[#0a1f3d] border-[#2f8fd8]',
    tutti: 'from-[#b0141b] to-[#5a0a0d] border-[#ff4a4a]',
  };
  const item = (key: string, active: boolean) =>
    `focus-ring flex items-center gap-2.5 rounded-lg border-2 bg-gradient-to-r px-2.5 py-1.5 transition hover:brightness-125 ${ROW[key]} ${
      active ? 'shadow-[0_0_16px_rgba(255,255,255,0.35)] ring-2 ring-white/70' : 'opacity-90'
    }`;

  return (
    <nav aria-label="Universi" className="flex flex-col gap-1.5">
      <h2 className="title-display flex items-center gap-2 px-1 text-2xl"><Globe className="size-5" aria-hidden /> Universi</h2>
      {UNIVERSE_IDS.map((id) => (
        <Link key={id} to={scopedPath(id, keepSection)} onClick={onNavigate} className={item(id, universeId === id)} aria-current={universeId === id || undefined}>
          <img src={`/ui/icona-${id}.webp`} alt="" className="size-9 shrink-0 rounded object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block text-lg font-semibold text-white">{UNIVERSES[id].name}</span>
            <span className="block truncate text-[11px] text-white/75">({UNIVERSES[id].subtitle})</span>
          </span>
        </Link>
      ))}
      <Link to={scopedPath(undefined, keepSection)} onClick={onNavigate} className={item('tutti', !universeId)} aria-current={!universeId || undefined}>
        <img src="/ui/icona-tutti.webp" alt="" className="size-9 shrink-0 rounded object-contain" />
        <span className="title-display text-xl text-white">Tutti gli Universi</span>
      </Link>
    </nav>
  );
}

/** Collegamenti rapidi sotto gli universi, come nel mockup. */
function SideLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { path } = useScope();
  const links = [
    { sub: 'collezione', label: 'La mia Collezione', icon: Box },
    { sub: 'campagne', label: 'Le mie Campagne', icon: Target },
    { sub: 'partite', label: 'Registro Partite', icon: ClipboardList },
    { sub: 'statistiche', label: 'Statistiche Globali', icon: Trophy },
    { sub: 'personaggi', label: 'Sopravvissuti (tutti)', icon: Users },
    { sub: 'equipaggiamento', label: 'Equipaggiamento (tutto)', icon: Package },
    { sub: 'carte', label: 'Carte (tutte)', icon: Library },
    { sub: 'impostazioni', label: 'Impostazioni', icon: Settings },
  ];
  return (
    <nav aria-label="Collegamenti" className="flex flex-col">
      {links.map(({ sub, label, icon: Icon }) => (
        <NavLink key={sub} to={path(sub)} onClick={onNavigate}
          className={({ isActive }) => `focus-ring flex items-center gap-3 border-b border-white/10 px-2 py-2 text-[15px] transition last:border-0 hover:bg-white/5 ${isActive ? 'text-[var(--accent-2)]' : ''}`}>
          <Icon className="size-5 shrink-0" aria-hidden />{label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell() {
  const { universeId, path } = useScope();
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div data-universe={universeId} className="app-bg min-h-dvh">
      <a href="#contenuto" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-black focus:p-2">
        Vai al contenuto
      </a>

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-black">
        <HeaderScenery universeId={universeId} />
        <div className="relative mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3">
          <Logo />
          <nav aria-label="Sezioni" className="hidden flex-1 flex-wrap gap-1.5 xl:flex">
            <TopNav />
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <SyncIndicator />
            <NavLink to={path('impostazioni')} className={({ isActive }) => `btn focus-ring px-2.5 ${isActive ? 'btn-accent' : ''}`} aria-label="Impostazioni">
              <Settings className="size-5" />
            </NavLink>
            <button type="button" className="btn px-2.5 xl:hidden" onClick={() => setDrawer(true)} aria-label="Apri il menu" aria-expanded={drawer}>
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        <div className="relative h-1.5 hazard-stripe" aria-hidden />
      </header>

      {drawer && (
        <div className="fixed inset-0 z-40 xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} aria-label="Chiudi il menu" />
          <div data-universe={universeId} className="app-bg absolute inset-y-0 right-0 flex w-[min(340px,90vw)] flex-col gap-4 overflow-y-auto border-l border-[var(--line)] p-4">
            <div className="flex items-center justify-between">
              <span className="title-display text-2xl">Menu</span>
              <button type="button" className="btn px-2" onClick={() => setDrawer(false)} aria-label="Chiudi">
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Sezioni" className="grid grid-cols-2 gap-1.5">
              <TopNav onNavigate={() => setDrawer(false)} />
            </nav>
            <UniverseSwitcher onNavigate={() => setDrawer(false)} />
            <SideLinks onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <BloodEdge />
      <div className="relative z-10 mx-auto flex max-w-[1600px] gap-5 px-4 pt-5 pb-24">
        <aside className={`hidden w-60 shrink-0 ${location.pathname.includes('/scheda/') ? '' : 'lg:block'}`}>
          <div className="sticky top-24 flex flex-col gap-3">
            <div className="panel p-2.5"><UniverseSwitcher /></div>
            <div className="panel px-1.5 py-1"><SideLinks /></div>
          </div>
        </aside>
        <main id="contenuto" className="min-w-0 flex-1">
          {/* Selettore universo compatto per tablet e smartphone */}
          <div className={`mb-4 flex gap-2 overflow-x-auto pb-1 ${location.pathname.includes('/scheda/') ? 'hidden' : 'lg:hidden'}`} aria-label="Universi">
            <Link to="/" className={`btn shrink-0 text-sm ${!universeId ? 'btn-accent' : ''}`}>
              <Globe className="size-4" /> Tutti
            </Link>
            {UNIVERSE_IDS.map((id) => (
              <Link key={id} to={scopedPath(id)} data-universe={id} className={`btn shrink-0 text-sm ${universeId === id ? 'btn-accent' : ''}`}>
                <UniverseEmblem id={id} className="size-4" /> {UNIVERSES[id].name}
              </Link>
            ))}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
