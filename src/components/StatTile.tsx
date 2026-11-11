import { Text, View } from 'react-native';

/** One translucent "glass" tile in the Run detail header: a big number over a small label. */
export function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 rounded-[16px] border border-white/[0.12] bg-white/10 px-3 py-[10px]">
      <Text className="font-inter-extrabold text-[24px] text-white">{value}</Text>
      <Text className="text-[12px] text-white/75">{label}</Text>
    </View>
  );
}
