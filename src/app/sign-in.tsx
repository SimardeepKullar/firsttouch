import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useAuth } from '../lib/auth';
import { parseAuthError, stripAuthErrorFromUrl } from '../lib/authError';

export default function SignIn() {
  const { signInWithGoogle } = useAuth();
  // If Google sent the user back with an error in the URL (e.g. they pressed Cancel), show it.
  const [error, setError] = useState<string | null>(() =>
    Platform.OS === 'web' && typeof window !== 'undefined' ? parseAuthError(window.location.href) : null
  );

  // Then tidy the address bar so reloading the page doesn't show the same error again.
  useEffect(() => {
    if (Platform.OS === 'web' && parseAuthError(window.location.href)) {
      window.history.replaceState(null, '', stripAuthErrorFromUrl(window.location.href));
    }
  }, []);

  async function handlePress() {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.');
    }
  }

  return (
    <View className="flex-1 items-center justify-center px-6">
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