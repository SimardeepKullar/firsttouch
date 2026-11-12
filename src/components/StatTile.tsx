import { Text, View } from 'react-native';

/** One stat tile inside the Run detail card (V3): a big number over a small label. */
export function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 rounded-[16px] border border-line bg-stat-tile px-3 py-[10px]">
      <Text className="font-inter-extrabold text-[24px] tracking-[-0.02em] text-ink">{value}</Text>
      <Text className="font-inter-semibold text-[12px] text-muted">{label}</Text>
    </View>
  );
}
