import { Pressable, Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { FOCUS_RING } from '../../components/pressable';
import { useAuth } from '../../lib/auth';

// Placeholder: the real Settings (and Appearance, T-20) come later. Sign out lives here for now.
export default function Settings() {
  const { signOut } = useAuth();
  return (
    <Screen>
      <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
        Settings
      </Text>
      <Pressable
        role="button"
        onPress={signOut}
        className={`min-h-tap items-center justify-center self-start rounded-input border border-line bg-surface px-6 ${FOCUS_RING}`}
      >
        <Text className="font-inter-semibold text-ink">Sign out</Text>
      </Pressable>
    </Screen>
  );
}
