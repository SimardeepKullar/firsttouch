import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { teamsUpSummary } from '../lib/runDetail';
import { FOCUS_RING } from './pressable';

/** "Teams are up" over "3 teams · published 5:30 AM", with a "View teams" button (03 Run detail, admin view).
 *  For an admin who has no team of their own. The whole panel is one link to Teams, like TeamPanel. */
export function TeamsUpPanel({ teamCount, publishedAt }: { teamCount: number; publishedAt: string | null }) {
  const { title, subtitle } = teamsUpSummary(teamCount, publishedAt);

  return (
    <Link href="/teams" asChild>
      <Pressable
        role="link"
        aria-label={`${title}, ${subtitle}. View teams`}
        className={`flex-row items-center gap-3 rounded-[18px] border border-line bg-surface-2 px-[14px] py-3 ${FOCUS_RING}`}
      >
        <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-soft">
          <View className="h-4 w-4 rounded-full bg-brand" />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-inter-extrabold text-[16px] text-ink">{title}</Text>
          <Text className="mt-0.5 text-[13px] text-muted">{subtitle}</Text>
        </View>
        <View className="h-10 justify-center rounded-[12px] bg-button px-[14px]">
          <Text className="font-inter-extrabold text-[14px] text-brand-on">View teams</Text>
        </View>
      </Pressable>
    </Link>
  );
}