import { Pressable, Text } from 'react-native';
import { ProfileCard } from '../../components/ProfileCard';
import { Screen } from '../../components/Screen';
import { SegmentedControl, type SegmentedOption } from '../../components/SegmentedControl';
import { FOCUS_RING } from '../../components/pressable';
import { useAuth } from '../../lib/auth';
import { homeVariant } from '../../lib/homeVariant';
import { appearanceHint, profileChip } from '../../lib/settings';
import { useTheme, type ThemeMode } from '../../lib/theme';
import { useMe } from '../../lib/useMe';
import { useMyPass, useSaveTheme } from '../../lib/useSettings';

const APPEARANCE_OPTIONS: readonly SegmentedOption<ThemeMode>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

// Settings, built up over T-20: Appearance is in; profile, Privacy and Delete account come next.
export default function Settings() {
  const { session, signOut } = useAuth();
  const me = useMe();
  const pass = useMyPass();
  const { mode, setMode } = useTheme();
  const saveTheme = useSaveTheme();

  function pickTheme(next: ThemeMode) {
    setMode(next); // switches the colours now and remembers it on this device
    saveTheme.mutate(next); // saves it to your row, so a new browser gets it too
  }

  return (
    <Screen>
      <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
        Settings
      </Text>
      {me.data ? (
        <ProfileCard
          name={me.data.name}
          email={session?.user.email ?? ''}
          chip={profileChip(homeVariant(me.data.isAdmin, me.data.plays), pass.data ?? null)}
          onEdit={() => undefined} // the name sheet comes in a later step
        />
      ) : null}
      <Text className="mt-[10px] px-1 font-inter-extrabold text-[13px] uppercase tracking-[0.08em] text-muted">
        Appearance
      </Text>
      <SegmentedControl
        options={APPEARANCE_OPTIONS}
        value={mode}
        onChange={pickTheme}
        label="Appearance"
        kind="radio"
        size="lg"
      />
      <Text className="px-1 text-[13px] text-muted">{appearanceHint(mode)}</Text>
      {saveTheme.isError ? (
        <Text className="px-1 text-[13px] text-unpaid-fg">
          Couldn’t save your choice. It still applies on this device.
        </Text>
      ) : null}

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
