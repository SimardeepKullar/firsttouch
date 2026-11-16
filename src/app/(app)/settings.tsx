import { useState } from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EditNameSheet } from '../../components/EditNameSheet';
import { ProfileCard } from '../../components/ProfileCard';
import { Screen } from '../../components/Screen';
import { SegmentedControl, type SegmentedOption } from '../../components/SegmentedControl';
import { SectionHeading, SettingsCard, SettingsRow } from '../../components/SettingsCard';
import { useAuth } from '../../lib/auth';
import { homeVariant } from '../../lib/homeVariant';
import { appearanceHint, profileChip } from '../../lib/settings';
import { useTheme, type ThemeMode } from '../../lib/theme';
import { useMe } from '../../lib/useMe';
import { useDeleteAccount, useMyPass, useSaveTheme } from '../../lib/useSettings';

const APPEARANCE_OPTIONS: readonly SegmentedOption<ThemeMode>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

// Settings: profile card, Appearance, Privacy and Account. (Notifications come in T-32.)
export default function Settings() {
  const { session, signOut } = useAuth();
  const me = useMe();
  const pass = useMyPass();
  const [editingName, setEditingName] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteAccount = useDeleteAccount();

  function cancelDelete() {
    if (deleteAccount.isPending) return; // don't close the dialog in the middle of deleting
    setConfirmingDelete(false);
    deleteAccount.reset(); // forget an old error
  }

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
          onEdit={() => setEditingName(true)}
        />
      ) : null}
      {editingName && me.data ? (
        <EditNameSheet currentName={me.data.name} onClose={() => setEditingName(false)} />
      ) : null}
      <SectionHeading>Appearance</SectionHeading>
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

      <SectionHeading>Privacy</SectionHeading>
      <SettingsCard>
        <SettingsRow label="Privacy policy" role="link" chevron onPress={() => router.push('/privacy')} />
      </SettingsCard>

      <SectionHeading>Account</SectionHeading>
      <SettingsCard>
        <SettingsRow label="Sign out" onPress={signOut} />
        <SettingsRow label="Delete account" danger divider onPress={() => setConfirmingDelete(true)} />
      </SettingsCard>

      <ConfirmDialog
        visible={confirmingDelete}
        title="Delete your account?"
        message="This permanently deletes your profile, your RSVPs, your season passes and your settings. You’ll be signed out. This can’t be undone."
        confirmLabel={deleteAccount.isPending ? 'Deleting…' : 'Delete'}
        onConfirm={() => deleteAccount.mutate()}
        onCancel={cancelDelete}
        busy={deleteAccount.isPending}
        error={deleteAccount.isError ? 'Couldn’t delete your account. Please try again.' : null}
      />
    </Screen>
  );
}
