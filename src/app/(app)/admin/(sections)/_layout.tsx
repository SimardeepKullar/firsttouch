import { Slot } from 'expo-router';
import { View } from 'react-native';
import { AdminHeader } from '../../../../components/AdminHeader';
import { AdminSubTabs } from '../../../../components/AdminSubTabs';
import { COLUMN } from '../../../../components/layout';

// Header and pill row stay put; the section below them scrolls.
export default function AdminSectionsLayout() {
  return (
    <View className={`flex-1 gap-[10px] px-4 pt-4 ${COLUMN}`}>
      <AdminHeader />
      <AdminSubTabs />
      <View className="-mx-4 flex-1">
        <Slot />
      </View>
    </View>
  );
}
