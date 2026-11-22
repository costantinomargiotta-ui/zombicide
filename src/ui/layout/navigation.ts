import { BarChart3, BookMarked, Box, ClipboardList, Home, Layers, LayoutDashboard, Library, NotebookPen, Settings, Sparkles, Target, Users, type LucideIcon } from 'lucide-react';

export interface NavItem {
  sub: string;
  label: string;
  icon: LucideIcon;
}

/** Menu principale: una sola voce per sezione. */
export const NAV_ITEMS: NavItem[] = [
  { sub: '', label: 'Dashboard', icon: Home },
  { sub: 'campagne', label: 'Campagne', icon: Layers },
  { sub: 'scenari', label: 'Scenari', icon: Target },
  { sub: 'regolamenti', label: 'Regolamenti', icon: BookMarked },
  { sub: 'personaggi', label: 'Sopravvissuti', icon: Users },
  { sub: 'carte', label: 'Carte', icon: Library },
  { sub: 'collezione', label: 'Collezione', icon: Box },
];

/** Collegamenti secondari, sotto il selettore degli universi. */
export const SIDE_ITEMS: NavItem[] = [
  { sub: 'statistiche', label: 'Statistiche', icon: BarChart3 },
  { sub: 'note', label: 'Note', icon: NotebookPen },
];

/** Schede interne: ogni gruppo appartiene a una voce del menu principale. */
export const SECTION_TABS: Record<string, NavItem[]> = {
  campagne: [
    { sub: 'campagne', label: 'Le mie campagne', icon: Layers },
    { sub: 'partite', label: 'Registro partite', icon: ClipboardList },
    { sub: 'progressi', label: 'Progressi', icon: BarChart3 },
  ],
  personaggi: [
    { sub: 'personaggi', label: 'Sopravvissuti', icon: Users },
    { sub: 'abilita', label: 'Abilità', icon: Sparkles },
  ],
  collezione: [
    { sub: 'collezione', label: 'La mia collezione', icon: Box },
    { sub: 'copertura', label: 'Copertura dei dati', icon: LayoutDashboard },
  ],
};

/** Voce del menu principale a cui appartiene una sezione (es. «partite» → «campagne»). */
export function navOwner(section: string): string {
  for (const [owner, tabs] of Object.entries(SECTION_TABS)) if (tabs.some((t) => t.sub === section)) return owner;
  if (section === 'equipaggiamento') return 'carte';
  return section;
}

/** Sezione corrente dal percorso: «/u/moderno/partite» → «partite». */
export const sectionOf = (pathname: string) => pathname.replace(/^\/u\/[^/]+/, '').replace(/^\//, '').split('/')[0];

export const SETTINGS_ITEM: NavItem = { sub: 'impostazioni', label: 'Impostazioni', icon: Settings };
