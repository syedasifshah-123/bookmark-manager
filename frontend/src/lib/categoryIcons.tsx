import {
  Folder, Monitor, Trophy, Film, Newspaper, Music2, BookOpen,
  ShoppingCart, Gamepad2, Plane, Lightbulb, Wrench, Palette,
  BarChart2, Globe, Code2, Star, Heart, Camera, Coffee,
  Briefcase, Zap, Tag, Rss,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const CATEGORY_ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'Folder',       Icon: Folder },
  { name: 'Monitor',      Icon: Monitor },
  { name: 'Code2',        Icon: Code2 },
  { name: 'Globe',        Icon: Globe },
  { name: 'Trophy',       Icon: Trophy },
  { name: 'Film',         Icon: Film },
  { name: 'Newspaper',    Icon: Newspaper },
  { name: 'Rss',          Icon: Rss },
  { name: 'Music2',       Icon: Music2 },
  { name: 'BookOpen',     Icon: BookOpen },
  { name: 'ShoppingCart', Icon: ShoppingCart },
  { name: 'Gamepad2',     Icon: Gamepad2 },
  { name: 'Plane',        Icon: Plane },
  { name: 'Lightbulb',    Icon: Lightbulb },
  { name: 'Wrench',       Icon: Wrench },
  { name: 'Palette',      Icon: Palette },
  { name: 'BarChart2',    Icon: BarChart2 },
  { name: 'Star',         Icon: Star },
  { name: 'Heart',        Icon: Heart },
  { name: 'Camera',       Icon: Camera },
  { name: 'Coffee',       Icon: Coffee },
  { name: 'Briefcase',    Icon: Briefcase },
  { name: 'Zap',          Icon: Zap },
  { name: 'Tag',          Icon: Tag },
];

export const ICON_MAP = Object.fromEntries(
  CATEGORY_ICONS.map(({ name, Icon }) => [name, Icon])
) as Record<string, LucideIcon>;

export function getCategoryIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Folder;
}
