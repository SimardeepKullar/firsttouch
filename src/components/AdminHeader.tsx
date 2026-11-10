import { Text, View } from 'react-native';

/** "Admin" title plus the ADMIN tag, as at the top of 06-09 (the tag is 26 tall, bigger than AdminBadge). */
export function AdminHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
        Admin
      </Text>
      <View className="h-[26px] items-center justify-center rounded-full bg-hero px-[10px]">
        <Text className="font-inter-extrabold text-[12px] tracking-[0.04em] text-white">ADMIN</Text>
      </View>
    </View>
  );
}
