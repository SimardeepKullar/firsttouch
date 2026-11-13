import { Pressable, Text, View } from 'react-native';
import { Path } from 'react-native-svg';
import { initialsFromName } from '../lib/display';
import type { ProfileChip } from '../lib/settings';
import { AdminBadge } from './FlagBadge';
import { FOCUS_RING } from './pressable';
import { StatusChip } from './StatusChip';
import { ThemedSvg } from './svg';

type Props = {
  name: string;
  email: string;
  chip: ProfileChip;
  /** Called when the pencil is pressed. */
  onEdit: () => void;
};

/** The profile card at the top of Settings (05): avatar, name, a pass chip or the Admin badge, email, and a pencil. */
export function ProfileCard({ name, email, chip, onEdit }: Props) {
  return (
    <View className="flex-row items-center gap-[14px] rounded-[20px] border border-line bg-surface py-[14px] pl-4 pr-2">
      <View
        role="img"
        aria-label={name}
        className="h-12 w-12 items-center justify-center rounded-full bg-hero"
      >
        <Text className="font-inter-extrabold text-[17px] text-white">{initialsFromName(name)}</Text>
      </View>
      <View className="min-w-0 flex-1 gap-[2px]">
        <View className="flex-row items-center gap-2">
          <Text numberOfLines={1} className="shrink font-inter-extrabold text-[17px] text-ink">
            {name}
          </Text>
          {chip === 'admin' ? <AdminBadge /> : null}
          {chip === 'paid' || chip === 'unpaid' ? <StatusChip kind={chip} size="row" /> : null}
        </View>
        <Text numberOfLines={1} className="text-[14px] text-muted">
          {email}
        </Text>
      </View>
      <Pressable
        role="button"
        aria-label="Edit display name"
        onPress={onEdit}
        className={`h-11 w-11 items-center justify-center rounded-[12px] bg-surface-2 ${FOCUS_RING}`}
      >
        <ThemedSvg width={20} height={20} viewBox="0 0 24 24" className="text-ink">
          <Path
            d="M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ThemedSvg>
      </Pressable>
    </View>
  );
}
