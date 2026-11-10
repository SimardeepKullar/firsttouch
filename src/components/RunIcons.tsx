// Small line icons for the run card (paths from the 02-home mockup). Colour comes from a Tailwind
// text class (`text-muted`), which ThemedSvg turns into currentColor.
import { Circle, Path, Rect } from 'react-native-svg';
import { ThemedSvg } from './svg';

type Props = { className: string; size?: number; strokeWidth?: number };

function Icon({ className, size = 18, strokeWidth = 2, children }: Props & { children: React.ReactNode }) {
  return (
    <ThemedSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </ThemedSvg>
  );
}

export const ClockIcon = (p: Props) => (
  <Icon {...p}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M12 7v5l3 2" />
  </Icon>
);

export const LockIcon = (p: Props) => (
  <Icon {...p}>
    <Rect x={5} y={11} width={14} height={10} rx={2} />
    <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);

export const PinIcon = ({ className, size = 18 }: Props) => (
  <ThemedSvg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} aria-hidden>
    <Path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </ThemedSvg>
);

export const CheckIcon = (p: Props) => (
  <Icon {...p}>
    <Path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const PlusIcon = (p: Props) => (
  <Icon {...p}>
    <Path d="M12 5v14M5 12h14" />
  </Icon>
);

export const ChevronRightIcon = (p: Props) => (
  <Icon {...p}>
    <Path d="M9 6l6 6-6 6" />
  </Icon>
);

export const ArrowRightIcon = (p: Props) => (
  <Icon {...p}>
    <Path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

/** The two-people icon on the "Auto team creation" card. Drawn in `logo-touch`, a green that is the same in both themes, because the hero is dark in both. */
export function PlayersIcon() {
  return (
    <ThemedSvg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-logo-touch" aria-hidden>
      <Circle cx={9} cy={8} r={3} />
      <Path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <Circle cx={17} cy={9} r={2.5} />
      <Path d="M16 14.2c2.8.3 5 2.7 5 5.8" />
    </ThemedSvg>
  );
}
