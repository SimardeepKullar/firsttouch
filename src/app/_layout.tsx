import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../../global.css';
import { AuthProvider, useAuth } from '../lib/auth';
import { initTheme } from '../lib/theme';

// Keep the splash screen up until Inter has loaded.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// The navigator paints its own background behind every screen (a flat grey by default).
// Make it transparent so the `page` background on the wrapper below shows through.
const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-page">
        <ActivityIndicator />
      </View>
    );
  }

  const signedIn = session !== null;

  return (
    // Every screen sits on the `page` background: the soft green glow top-right over `bg`.
    <View className="flex-1 bg-bg bg-page">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={signedIn} redirectTo="/sign-in">
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Apply the saved light/dark/system choice (public/index.html already did it for the first paint on web).
  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}