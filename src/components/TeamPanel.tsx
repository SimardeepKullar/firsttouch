import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { teamSummary, type TeamColor } from '../lib/runDetail';
import { FOCUS_RING } from './pressable';

// Whole class names so Tailwind finds them when it scans this file.
const TEAM: Record<TeamColor, { wash: string; dot: string; ring: string }> = {
  blue: { wash: 'bg-team-blue-wash', dot: 'bg-team-blue', ring: 'bg-team-blue/25' },
  yellow: { wash: 'bg-team-yellow-wash', dot: 'bg-team-yellow', ring: 'bg-team-yellow/25' },
  red: { wash: 'bg-team-red-wash', dot: 'bg-team-red', ring: 'bg-team-red/25' },
};

/** "You're on Blue · 7 players · ATT/DEF 3:4" with a "View teams" button (03 Run detail after the lock;
 *  T-41 can reuse it on Home's closed cards). The whole panel is one link to Teams. */
export function TeamPanel({ team, positions }: { team: TeamColor; positions: readonly ('attack' | 'defend')[] }) {
  const t = TEAM[team];
  const { title, subtitle } = teamSummary(team, positions);

  return (
    <Link href="/teams" asChild>
      <Pressable
        role="link"
        aria-label={`${title}, ${subtitle}. View teams`}
        className={`flex-row items-center gap-3 rounded-[18px] border border-line bg-surface-2 ${t.wash} px-[14px] py-3 ${FOCUS_RING}`}
      >
        <View className={`h-6 w-6 items-center justify-center rounded-full ${t.ring}`}>
          <View className={`h-4 w-4 rounded-full ${t.dot}`} />
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
