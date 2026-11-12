import { Text, View } from 'react-native';
import { Path } from 'react-native-svg';
import { ThemedSvg } from './svg';

/** Season-pass state (02 Home, 05 Settings, 09 Passes) or run state (07 Admin runs). */
export type StatusChipKind = 'paid' | 'unpaid' | 'open' | 'locked' | 'published' | 'cancelled' | 'admin';
/** Sizes taken from the mockups: 'run' 28 tall (07 next-run card), 'pass' 30 tall (02 Home),
 *  'row' 24 tall with no dot (07 "All runs" rows). */
export type StatusChipSize = 'run' | 'pass' | 'row';

// Whole class names so Tailwind can find them when it scans this file.
const KINDS: Record<StatusChipKind, { label: string; box: string; text: string; dot: string }> = {
  paid: { label: 'Paid', box: 'bg-ok-bg', text: 'text-ok-fg', dot: 'bg-ok-fg' },
  unpaid: { label: 'Not paid', box: 'bg-unpaid-bg', text: 'text-unpaid-fg', dot: 'bg-unpaid-fg' },
  open: { label: 'Open', box: 'bg-ok-bg', text: 'text-ok-fg', dot: 'bg-ok-fg' },
  locked: { label: 'Locked', box: 'bg-locked-bg', text: 'text-locked-fg', dot: 'bg-locked-fg' },
  published: { label: 'Teams published', box: 'bg-brand', text: 'text-brand-on', dot: 'bg-brand-on' },
  cancelled: { label: 'Cancelled', box: 'bg-unpaid-bg', text: 'text-unpaid-fg', dot: 'bg-unpaid-fg' },
  admin: { label: 'Admin', box: 'bg-brand-soft', text: 'text-brand-text', dot: 'bg-brand-text' },
};

const SIZES: Record<StatusChipSize, { box: string; text: string; dot: string | null }> = {
  run: { box: 'h-7 gap-1.5 px-[10px]', text: 'text-[13px] font-inter-extrabold', dot: 'h-2 w-2' },
  pass: { box: 'h-[30px] gap-1.5 px-3', text: 'text-[13px] font-inter-bold', dot: 'h-[7px] w-[7px]' },
  row: { box: 'h-6 px-2', text: 'text-[11px] font-inter-extrabold', dot: null },
};

/** "Teams published" in the soft green, as drawn on 03 Run detail (the solid fill is for 07 Admin runs). */
const SOFT_PUBLISHED = { label: 'Teams published', box: 'bg-brand-soft', text: 'text-brand-text', dot: 'bg-brand-text' };

type Props = {
  kind: StatusChipKind;
  /** Replaces the default label, e.g. "Indoor pass: Paid" on Home. */
  label?: string;
  /** Defaults to 'pass' for paid/unpaid/admin and 'run' for the run states. */
  size?: StatusChipSize;
  /** Draws a `published` chip soft instead of solid. Ignored for the other kinds. */
  soft?: boolean;
};

export function StatusChip({ kind, label, size, soft }: Props) {
  const k = kind === 'published' && soft ? SOFT_PUBLISHED : KINDS[kind];
  const s = SIZES[size ?? (kind === 'paid' || kind === 'unpaid' || kind === 'admin' ? 'pass' : 'run')];
  return (
    <View className={`flex-row items-center self-start rounded-full ${k.box} ${s.box}`}>
      {s.dot ? <View className={`rounded-full ${k.dot} ${s.dot}`} /> : null}
      <Text className={`${k.text} ${s.text}`}>{label ?? k.label}</Text>
    </View>
  );
}

/** The "Published" pill at the top of 04 Teams: a filled check circle and a `brand-line` border. */
export function PublishedPill({ label = 'Published' }: { label?: string }) {
  return (
    <View className="h-8 flex-row items-center gap-1.5 self-start rounded-full border border-brand-line bg-ok-bg pl-2 pr-3">
      <View className="h-[18px] w-[18px] items-center justify-center rounded-full bg-brand">
        <ThemedSvg width={11} height={11} viewBox="0 0 24 24" className="text-brand-on">
          <Path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ThemedSvg>
      </View>
      <Text className="font-inter-bold text-[13px] text-ok-fg">{label}</Text>
    </View>
  );
}
