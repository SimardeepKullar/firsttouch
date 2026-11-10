// The 2px line icons for the bottom bar (paths from the 02-home / 04-teams mockups) and the
// back chevron from 11-admin-holidays. The colour comes from a Tailwind text class (`text-muted`,
// `text-brand-text`), which ThemedSvg turns into currentColor.
import { Circle, Path } from 'react-native-svg';
import { ThemedSvg } from './svg';
import type { TabName } from '../lib/nav';

type IconProps = { className: string };

function NavSvg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <ThemedSvg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </ThemedSvg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <NavSvg className={className}>
      <Path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </NavSvg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <NavSvg className={className}>
      <Path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <Path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4v4h-4z" />
    </NavSvg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <NavSvg className={className}>
      <Path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z" />
      <Path d="M9 12l2 2 4-4" />
    </NavSvg>
  );
}

export function GearIcon({ className }: IconProps) {
  return (
    <NavSvg className={className}>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </NavSvg>
  );
}

export const TAB_ICONS: Record<TabName, (p: IconProps) => React.JSX.Element> = {
  home: HomeIcon,
  teams: TrophyIcon,
  admin: ShieldIcon,
  settings: GearIcon,
};

/** Back chevron, 20px, 2.2 stroke (11-admin-holidays). */
export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <ThemedSvg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <Path d="M15 5l-7 7 7 7" />
    </ThemedSvg>
  );
}
