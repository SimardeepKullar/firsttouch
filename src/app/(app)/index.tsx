import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_directory')
        .select('id, full_name, position, plays')
        .eq('is_me', true)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

function useIsAdmin() {
  return useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      return data;
    },
  });
}

export default function Home() {
  const { signOut } = useAuth();
  const me = useMe();
  const isAdmin = useIsAdmin();

  if (me.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (me.error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-red-600">
          {`Couldn't load your profile: ${me.error.message}`}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-green-900">Hi, {me.data?.full_name}</Text>

      {isAdmin.data && (
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