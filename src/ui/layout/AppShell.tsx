import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Bell as Bell_, Box, CircleUserRound, ClipboardList, Globe, Library, Menu, NotebookPen, Package, Search, Target, Trophy, Users, X } from 'lucide-react';
import { useRecentActivities } from '../../data/hooks';
import { useSyncStatus } from '../../data/syncController';
import { relativeTime } from '../../lib/format';
import { UNIVERSES } from '../../domain/universes';
import { UNIVERSE_IDS } from '../../domain/types';
import { scopedPath, useScope } from '../../lib/scope';
import { UniverseEmblem } from '../components/UniverseEmblem';
import { NAV_ITEMS } from './navigation';
import { BloodEdge, HeaderScenery, PaintSplatter } from './Scenery';

function Logo() {
  return (
    <Link to="/" className="focus-ring relative z-10 -my-3 -ml-4 block shrink-0" aria-label="Zombicide Hub, vai alla dashboard globale">
      <img src="/ui/logo-hub.webp" alt="Zombicide Hub" className="h-[72px] w-auto sm:h-[92px] lg:h-[116px]" />
    </Link>
  );
}

/** Campanella: ultime attività registrate. */
function Bell() {
  const [open, setOpen] = useState(false);
  const activities = useRecentActivities(6);
  return (
    <div className="relative">
      <button type="button" className="btn focus-ring px-2.5" onClick={() => setOpen((v) => !v)} aria-label="Ultime attività" aria-expanded={open}>
        <Bell_ className="size-5 fill-[#f5c518] text-[#f5c518]" />
      </button>
      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} aria-label="Chiudi" />
          <div className="panel absolute right-0 z-50 mt-2 w-80 p-3">
            <p className="mb-2 font-semibold">Ultime attività</p>
            {activities?.length ? (
              <ul className="flex flex-col">
                {activities.map((a) => (
                  <li key={a.id} className="flex gap-2 border-b border-white/10 py-1.5 text-sm last:border-0">
                    <span className="flex-1">{a.message}</span><span className="shrink-0 text-xs text-[var(--muted)]">{relativeTime(a.at)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-[var(--muted)]">Nessuna attività.</p>}
          </div>
        </>
      )}
    </div>
  );
}

/** Profilo: account, sincronizzazione e impostazioni. Il pallino indica lo stato della sincronizzazione. */
function Profile() {
  const { path } = useScope();
  const sync = useSyncStatus();
  const dot = sync.status === 'sincronizzato' ? 'bg-[#57c02a]' : sync.status === 'errore' ? 'bg-red-500' : sync.status === 'disattivata' ? 'hidden' : 'bg-amber-400';
  return (
    <NavLink to={path('impostazioni')} className={({ isActive }) => `btn focus-ring relative px-2.5 ${isActive ? 'btn-accent' : ''}`} aria-label="Account e impostazioni" title={`Account e impostazioni · sincronizzazione: ${sync.status}`}>
      <CircleUserRound className="size-6" />
      <span className={`absolute right-1 bottom-1 size-2.5 rounded-full ring-2 ring-black ${dot}`} aria-hidden />
    </NavLink>
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
            `btn focus-ring justify-start whitespace-nowrap px-3.5 py-2 text-base ${isActive ? 'border-2 !border-[#ff9a1a] text-[#ffc21a] shadow-[0_0_14px_rgba(255,154,26,0.55)]' : ''}`
          }
        >
          <Icon className="size-5" aria-hidden />
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
      <h2 className="title-display flex items-center gap-2 px-1 text-2xl"><Users className="size-6" aria-hidden /> Universi</h2>
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
    { sub: 'progressi', label: 'Progressi', icon: BarChart3 },
    { sub: 'statistiche', label: 'Statistiche Globali', icon: Trophy },
    { sub: 'personaggi', label: 'Sopravvissuti (tutti)', icon: Users },
    { sub: 'equipaggiamento', label: 'Equipaggiamento (tutto)', icon: Package },
    { sub: 'carte', label: 'Carte (tutte)', icon: Library },
    { sub: 'note', label: 'Note', icon: NotebookPen },
  ];
  return (
    <nav aria-label="Collegamenti" className="flex flex-col">
      {links.map(({ sub, label, icon: Icon }) => (
        <NavLink key={sub} to={path(sub)} onClick={onNavigate}
          className={({ isActive }) => `focus-ring flex items-center gap-3 border-b border-white/10 px-2 py-2 text-[17px] transition last:border-0 hover:bg-white/5 ${isActive ? 'text-[var(--accent-2)]' : ''}`}>
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

      <header className="sticky top-0 z-30 bg-[#0b0b0d]">
        {universeId ? <HeaderScenery universeId={universeId} /> : (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <img src="/ui/schizzi-alto.webp" alt="" className="absolute inset-x-0 top-0 h-full w-full object-cover opacity-60 [mask-image:linear-gradient(90deg,#000_0,transparent_22%,transparent_70%,#000_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
          </div>
        )}
        <div className="relative mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3">
          <Logo />
          <nav aria-label="Sezioni" className="hidden flex-1 flex-wrap gap-1.5 xl:flex">
            <TopNav />
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <NavLink to={path('cerca')} className={({ isActive }) => `btn focus-ring px-2.5 ${isActive ? 'btn-accent' : ''}`} aria-label="Cerca" title="Cerca">
              <Search className="size-5" />
            </NavLink>
            <Bell />
            <Profile />
            <button type="button" className="btn px-2.5 xl:hidden" onClick={() => setDrawer(true)} aria-label="Apri il menu" aria-expanded={drawer}>
              <Menu className="size-5" />
            </button>
          </div>
        </div>
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

      <PaintSplatter />
      <BloodEdge />
      <div className="relative z-10 mx-auto flex max-w-[1600px] gap-5 px-4 pt-5 pb-24">
        <aside className={`hidden w-60 shrink-0 ${/^\/campagne\/[^/]+/.test(location.pathname) ? '' : 'lg:block'}`}>
          <div className="sticky top-24 flex flex-col gap-3">
            <div className="panel p-2.5"><UniverseSwitcher /></div>
            <div className="panel px-1.5 py-1"><SideLinks /></div>
          </div>
        </aside>
        <main id="contenuto" className="min-w-0 flex-1">
          {/* Selettore universo compatto per tablet e smartphone */}
          <div className={`mb-4 flex gap-2 overflow-x-auto pb-1 ${/^\/campagne\/[^/]+/.test(location.pathname) ? 'hidden' : 'lg:hidden'}`} aria-label="Universi">
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
