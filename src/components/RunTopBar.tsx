import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { RunStatus } from '../lib/runDetail';
import { ArrowLeftIcon } from './RunIcons';
import { StatusChip } from './StatusChip';
import { FOCUS_RING } from './pressable';

/** "← Home", styled like Home's "View all →" link. Also used on Run detail's loading and not-found states. */
export function HomeLink() {
  return (
    <Link href="/" asChild>
      <Pressable
        role="link"
        aria-label="Back to Home"
        className={`min-h-tap flex-row items-center gap-1 self-start pr-2 ${FOCUS_RING}`}
      >
        <ArrowLeftIcon className="text-brand-text" size={16} strokeWidth={2.4} />
        <Text className="font-inter-bold text-[14px] text-brand-text">Home</Text>
      </Pressable>
    </Link>
  );
}

/** The top row of Run detail (03, V3): "← Home" on the left, the run's status chip on the right. */
export function RunTopBar({ chip }: { chip: RunStatus }) {
  return (
    <View className="flex-row items-center justify-between">
      <HomeLink />
      <StatusChip kind={chip} size="pass" soft />
    </View>
  );
}
