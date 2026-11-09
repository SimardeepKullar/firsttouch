import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useMe } from '../../lib/useMe';

export default function Home() {
  const { signOut } = useAuth();
  const me = useMe();

  if (me.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (me.error || !me.data) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-red-600">
          {`Couldn't load your profile: ${me.error?.message ?? 'no profile found'}`}
        </Text>
        <Pressable onPress={signOut} className="mt-6 rounded-xl border border-green-900 px-6 py-3">
          <Text className="font-semibold text-green-900">Sign out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-green-900">Hi, {me.data.name}</Text>

      {me.data.isAdmin && (
        <Text className="mt-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900">
          Admin
        </Text>
      )}

      <Pressable onPress={signOut} className="mt-8 rounded-xl border border-green-900 px-6 py-3">
        <Text className="font-semibold text-green-900">Sign out</Text>
      </Pressable>
    </View>
  );
}