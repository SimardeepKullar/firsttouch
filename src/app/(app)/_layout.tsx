import { Tabs } from 'expo-router';
import { ActivityIndicator, Platform, Pressable, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBar } from '../../components/TabBar';
import { useAuth } from '../../lib/auth';
import { useMe } from '../../lib/useMe';

// On web, a tab you've left stays mounted just behind the active one (there is no native screen
// container to hide it). The navigator's own background is transparent so the page glow shows,
// so paint the same page background on each tab's scene to cover the one behind it.
const sceneStyle = (Platform.OS === 'web'
  ? { backgroundColor: 'var(--bg)', backgroundImage: 'var(--page)' }
  : undefined) as ViewStyle | undefined;

export default function AppLayout() {
  const me = useMe();
  const { signOut } = useAuth();
  const { top } = useSafeAreaInsets();

  // Wait for "who am I" before building the tabs. Showing a spinner (not redirecting) means an
  // admin who reloads /admin/runs isn't bounced to Home while we still don't know they're an admin.
  if (me.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (me.error || !me.data) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-danger">
          {`Couldn't load your profile: ${me.error?.message ?? 'no profile found'}`}
        </Text>
        <Pressable
          role="button"
          onPress={signOut}
          className="mt-6 min-h-tap items-center justify-center rounded-input border border-line px-6"
        >
          <Text className="font-inter-semibold text-ink">Sign out</Text>
        </Pressable>
      </View>
    );
  }

  const { isAdmin } = me.data;

  return (
    <View className="flex-1" style={{ paddingTop: top }}>
      <Tabs tabBar={() => <TabBar isAdmin={isAdmin} />} screenOptions={{ headerShown: false, animation: 'none', sceneStyle }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="teams" />
        {/* The UI guard: a player who types /admin/... is sent to Home. (RLS protects the data.) */}
        <Tabs.Protected guard={isAdmin}>
          <Tabs.Screen name="admin" />
        </Tabs.Protected>
        <Tabs.Screen name="settings" />
        {/* Run detail, reached from a run card. Our own tab bar only lists the four tabs, so this adds no
            button. (Don't use `options={{ href: null }}` here: in this SDK it stops /runs/<id> resolving.) */}
        <Tabs.Screen name="runs" />
      </Tabs>
    </View>
  );
}
