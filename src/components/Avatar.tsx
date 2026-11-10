import { Text, View } from 'react-native';
import { initialsFromName, MAX_STACK_AVATARS, overflowCount } from '../lib/display';

/** The sizes the mockups use: 32 (Home stack), 34 (Passes), 36 (Players), 40 (Run detail), 48. */
export type AvatarSize = 32 | 34 | 36 | 40 | 48;
/** 'default' = `ink` initials; 'brand' = `brand-text` (Home and Run detail); 'muted' = `ink-2` (the "+n" circle). */
export type AvatarTone = 'default' | 'brand' | 'muted';

const SIZES: Record<AvatarSize, { box: string; text: string }> = {
  32: { box: 'h-8 w-8', text: 'text-[11px]' },
  34: { box: 'h-[34px] w-[34px]', text: 'text-xs' },
  36: { box: 'h-9 w-9', text: 'text-[13px]' },
  40: { box: 'h-10 w-10', text: 'text-[13px]' },
  48: { box: 'h-12 w-12', text: 'text-[17px]' },
};
const TONES: Record<AvatarTone, string> = {
  default: 'text-ink',
  brand: 'text-brand-text',
  muted: 'text-ink-2',
};

type CircleProps = { text: string; label: string; size: AvatarSize; tone: AvatarTone; ring?: boolean; overlap?: boolean };

function AvatarCircle({ text, label, size, tone, ring, overlap }: CircleProps) {
  return (
    <View
      role="img"
      aria-label={label}
      className={`items-center justify-center rounded-full bg-surface-2 ${SIZES[size].box} ${
        ring ? 'border-2 border-surface' : ''
      } ${overlap ? '-ml-[10px]' : ''}`}
    >
      <Text className={`font-inter-extrabold ${SIZES[size].text} ${TONES[tone]}`}>{text}</Text>
    </View>
  );
}

export function Avatar({ name, size = 40, tone = 'default' }: { name: string; size?: AvatarSize; tone?: AvatarTone }) {
  return <AvatarCircle text={initialsFromName(name)} label={name} size={size} tone={tone} />;
}

type StackProps = {
  /** Players to show as avatars. Only the first 3 are drawn. */
  names: string[];
  /** Everyone going. Defaults to names.length. The "+n" is total minus the avatars shown. */
  total?: number;
};

/** Overlapping 32px avatars with a "+n" circle, as on the 02 Home run card. */
export function AvatarStack({ names, total = names.length }: StackProps) {
  const shown = names.slice(0, MAX_STACK_AVATARS);
  const extra = overflowCount(total, shown.length);
  return (
    <View className="flex-row">
      {shown.map((name, i) => (
        <AvatarCircle key={`${name}-${i}`} text={initialsFromName(name)} label={name} size={32} tone="brand" ring overlap={i > 0} />
      ))}
      {extra > 0 ? (
        <AvatarCircle text={`+${extra}`} label={`${extra} more`} size={32} tone="muted" ring overlap={shown.length > 0} />
      ) : null}
    </View>
  );
}
