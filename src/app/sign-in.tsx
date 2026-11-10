import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleButton } from '../components/GoogleButton';
import { COLUMN } from '../components/layout';
import { useAuth } from '../lib/auth';
import { parseAuthError, stripAuthErrorFromUrl } from '../lib/authError';

// The router re-creates this screen when we tidy the URL, which would lose the error. Keep the
// message here, outside the component, so the new copy can pick it up.
let urlError: string | null = null;

// Sign-in screen, 01-sign-in with emailAuth = off. Sizes are from the mockup.
export default function SignIn() {
  const { signInWithGoogle } = useAuth();
  const { bottom } = useSafeAreaInsets();
  // If Google sent the user back with an error in the URL (e.g. they pressed Cancel), show it.
  const [error, setError] = useState<string | null>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      urlError = parseAuthError(window.location.href) ?? urlError;
    }
    return urlError;
  });

  // Then tidy the address bar so reloading the page doesn't show the same error again. This goes
  // through the router (not window.history) because the router puts the URL back otherwise.
  useEffect(() => {
    if (Platform.OS === 'web' && parseAuthError(window.location.href)) {
      router.replace(stripAuthErrorFromUrl(window.location.href) as '/sign-in');
    } else {
      // The URL is clean: this is the re-created screen (it already picked the message up) or a
      // later visit, so forget the message and it won't come back after Privacy policy -> back.
      urlError = null;
    }
  }, []);

  async function handlePress() {
    urlError = null;
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.');
    }
  }

  return (
    <View className={`flex-1 px-6 pt-[120px] ${COLUMN}`} style={{ paddingBottom: Math.max(32, bottom) }}>
      <View className="items-center gap-[14px]">
        <Image
          source={require('../../assets/images/icon.png')}
          alt="FirstTouch logo"
          contentFit="contain"
          // App Store icon shape: corner radius is 22.37% of the size (112 × 0.2237 ≈ 25).
          style={{ width: 112, height: 112, borderRadius: 25, borderCurve: 'continuous', boxShadow: '0 6px 14px rgba(4, 21, 15, 0.25)' }}
        />
        <Text
          role="heading"
          aria-level={1}
          className="mt-[6px] font-inter-extrabold text-[34px] tracking-[-0.02em] text-ink"
        >
          First<Text className="text-brand-text">Touch</Text>
        </Text>
        <Text className="max-w-[280px] text-center text-[16px] leading-[23px] text-muted">
          Weekend morning soccer. Sign in to RSVP and see your team.
        </Text>
      </View>

      <View className="mt-[64px] gap-[14px]">
        <GoogleButton onPress={handlePress} />
        {error && (
          <Text role="alert" className="text-center text-body text-unpaid-fg">
            {error}
          </Text>
        )}
      </View>

      <View className="mt-auto items-center">
        <Text className="text-center text-[13px] leading-[19.5px] text-muted">
          By continuing you agree to our{' '}
          <Link href="/privacy" className="underline">
            Privacy policy
          </Link>
          .
        </Text>
      </View>
    </View>
  );
}
