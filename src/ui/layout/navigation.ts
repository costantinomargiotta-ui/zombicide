import { BarChart3, Box, Dices, Home, Layers, Library, Settings, Swords, Target, Users, type LucideIcon } from 'lucide-react';

export interface NavItem {
  sub: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { sub: '', label: 'Dashboard', icon: Home },
  { sub: 'campagne', label: 'Campagne', icon: Layers },
  { sub: 'personaggi', label: 'Personaggi', icon: Users },
  { sub: 'scenari', label: 'Scenari', icon: Target },
  { sub: 'partite', label: 'Partite', icon: Dices },
  { sub: 'equipaggiamento', label: 'Equipaggiamento', icon: Swords },
  { sub: 'carte', label: 'Carte', icon: Library },
  { sub: 'statistiche', label: 'Statistiche', icon: BarChart3 },
  { sub: 'collezione', label: 'Collezione', icon: Box },
];

export const SETTINGS_ITEM: NavItem = { sub: 'impostazioni', label: 'Impostazioni', icon: Settings };
