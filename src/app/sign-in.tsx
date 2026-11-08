import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../lib/auth';

export default function SignIn() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handlePress() {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.');
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-4xl font-bold text-green-900">FirstTouch</Text>
      <Text className="mt-2 text-base text-gray-600">Weekend runs, balanced teams</Text>

      <Pressable
        onPress={handlePress}
        className="mt-10 w-full max-w-sm items-center rounded-xl bg-green-900 py-4 active:opacity-80"
      >
        <Text className="text-lg font-semibold text-white">Continue with Google</Text>
      </Pressable>

      {error && <Text className="mt-4 text-center text-red-600">{error}</Text>}
    </View>
  );
}