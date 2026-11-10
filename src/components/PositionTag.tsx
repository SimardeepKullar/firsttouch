import { Text, View } from 'react-native';

export type Position = 'ATT' | 'DEF';

const STYLES: Record<Position, { box: string; text: string }> = {
  ATT: { box: 'border-ink bg-ink', text: 'text-bg' },
  DEF: { box: 'border-input-border bg-transparent', text: 'text-ink-2' },
};

export function PositionTag({ position }: { position: Position }) {
  const s = STYLES[position];
  return (
    <View className={`h-6 w-10 items-center justify-center rounded-badge border ${s.box}`}>
      <Text className={`font-inter-extrabold text-[11px] tracking-[0.04em] ${s.text}`}>{position}</Text>
    </View>
  );
}
