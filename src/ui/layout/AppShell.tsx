import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Globe, Menu, Settings, X } from 'lucide-react';
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
    <Link to="/" className="focus-ring flex shrink-0 flex-col leading-none" aria-label="Zombicide Hub, vai alla dashboard globale">
      <span className="title-display rounded-sm bg-[#d8232a] px-2 text-3xl text-white sm:text-4xl" style={{ WebkitTextStroke: '1px #000', clipPath: 'polygon(2% 8%,100% 0,98% 92%,0 100%)' }}>
        ZOMBICIDE
      </span>
      <span className="title-display -mt-1 self-end text-xl text-[var(--accent-2)] sm:text-2xl">
        {universeId ? UNIVERSES[universeId].name.toUpperCase() : 'HUB'}
      </span>
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

  const item = (active: boolean) =>
    `focus-ring flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
      active ? 'border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_14px_var(--glow)]' : 'border-[var(--line)] bg-black/30 hover:border-[var(--line-hi)]'
    }`;

  return (
    <nav aria-label="Universi" className="flex flex-col gap-2">
      <h2 className="title-display px-1 text-2xl">Universi</h2>
      {UNIVERSE_IDS.map((id) => (
        <Link key={id} to={scopedPath(id, keepSection)} onClick={onNavigate} data-universe={id} className={item(universeId === id)}>
          <span className="grid size-9 place-items-center rounded-md bg-[var(--accent)]/20 text-[var(--accent)]">
            <UniverseEmblem id={id} className="size-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block font-semibold">{UNIVERSES[id].name}</span>
            <span className="block truncate text-xs text-[var(--muted)]">{UNIVERSES[id].subtitle}</span>
          </span>
        </Link>
      ))}
      <Link to={scopedPath(undefined, keepSection)} onClick={onNavigate} className={item(!universeId)}>
        <span className="grid size-9 place-items-center rounded-md bg-white/10">
          <Globe className="size-5" aria-hidden />
        </span>
        <span className="font-semibold">Tutti gli universi</span>
      </Link>
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
          </div>
        </div>
      )}

      <BloodEdge />
      <div className="relative z-10 mx-auto flex max-w-[1600px] gap-5 px-4 pt-5 pb-24">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="panel sticky top-24 p-3">
            <UniverseSwitcher />
          </div>
        </aside>
        <main id="contenuto" className="min-w-0 flex-1">
          {/* Selettore universo compatto per tablet e smartphone */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Universi">
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
