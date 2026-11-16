import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Path } from 'react-native-svg';
import { FOCUS_RING } from './pressable';
import { ThemedSvg } from './svg';

/** The small uppercase title above a group on Settings ("Appearance", "Privacy", "Account"). */
export function SectionHeading({ children }: { children: string }) {
  return (
    <Text
      role="heading"
      aria-level={2}
      className="mt-[10px] px-1 font-inter-extrabold text-[13px] uppercase tracking-[0.08em] text-muted"
    >
      {children}
    </Text>
  );
}

/** The rounded white card that holds a group of rows. */
export function SettingsCard({ children }: { children: ReactNode }) {
  return <View className="rounded-[20px] border border-line bg-surface px-4">{children}</View>;
}

type RowProps = {
  label: string;
  onPress: () => void;
  /** 'link' for a row that opens another page, 'button' for one that does something. */
  role?: 'button' | 'link';
  /** The red look (Delete account). */
  danger?: boolean;
  /** A ">" on the right, for rows that open another page. */
  chevron?: boolean;
  /** A thin line above this row. Set it on every row except the first in a card. */
  divider?: boolean;
};

/** One tappable row inside a SettingsCard, at least 52 tall. */
export function SettingsRow({ label, onPress, role = 'button', danger = false, chevron = false, divider = false }: RowProps) {
  return (
    <Pressable
      role={role}
      onPress={onPress}
      className={`min-h-[52px] flex-row items-center justify-between ${divider ? 'border-t border-line' : ''} ${FOCUS_RING}`}
    >
      <Text className={danger ? 'font-inter-extrabold text-[16px] text-unpaid-fg' : 'font-inter-bold text-[16px] text-ink'}>
        {label}
      </Text>
      {chevron ? (
        <ThemedSvg width={20} height={20} viewBox="0 0 24 24" className="text-muted">
          <Path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </ThemedSvg>
      ) : null}
    </Pressable>
  );
}
