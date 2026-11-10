import { Text, View } from 'react-native';

/** Morning of: everyone sees it. Unpaid: admins only. Which one to show is the screen's call. */
export type FlagKind = 'morningOf' | 'unpaid';
/** 'sm' is 20 tall (03 Run detail); 'md' is 22 tall (04 Teams, 06 Players). */
export type FlagBadgeSize = 'sm' | 'md';

const KINDS: Record<FlagKind, { label: string; box: string; text: string }> = {
  morningOf: { label: 'Morning of', box: 'bg-morning-bg', text: 'text-morning-fg' },
  unpaid: { label: 'Unpaid', box: 'bg-unpaid-bg', text: 'text-unpaid-fg' },
};

export function FlagBadge({ kind, size = 'sm' }: { kind: FlagKind; size?: FlagBadgeSize }) {
  const k = KINDS[kind];
  return (
    <View className={`${size === 'sm' ? 'h-5' : 'h-[22px]'} items-center justify-center self-start rounded-full px-2 ${k.box}`}>
      <Text className={`font-inter-bold text-[11px] ${k.text}`}>{k.label}</Text>
    </View>
  );
}

/** Same size as a 'md' flag badge, on the `hero` gradient with white text (06 Admin players). */
export function AdminBadge() {
  return (
    <View className="h-[22px] items-center justify-center self-start rounded-full bg-hero px-2">
      <Text className="font-inter-extrabold text-[11px] text-white">Admin</Text>
    </View>
  );
}
