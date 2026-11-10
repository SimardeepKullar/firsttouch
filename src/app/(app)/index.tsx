import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { RunCard } from '../../components/RunCard';
import { ArrowRightIcon, PlayersIcon } from '../../components/RunIcons';
import { Screen } from '../../components/Screen';
import { StatusChip } from '../../components/StatusChip';
import { FOCUS_RING } from '../../components/pressable';
import { visibleRuns } from '../../lib/homeRuns';
import { runsThisWeek, seasonLabel, torontoDate } from '../../lib/torontoTime';
import { useHome } from '../../lib/useHome';
import { useMe } from '../../lib/useMe';

/** The current time, refreshed every 30 seconds so a card flips to "RSVPs closed" on its own. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// Home for a playing member. (Coach's Home, plays = off, is T-17.)
export default function Home() {
  const me = useMe();
  const now = useNow();
  const today = torontoDate(now);
  const home = useHome(today);
  const [showAll, setShowAll] = useState(false);

  const firstName = me.data?.name.trim().split(/\s+/)[0] ?? '';
  const week = home.data ? visibleRuns(home.data.runs, today, false) : [];
  const shown = home.data ? visibleRuns(home.data.runs, today, showAll) : [];

  return (
    <Screen>
      <View className="flex-row items-center justify-between pb-[6px]">
        <Image
          source={require('../../../assets/images/icon.png')}
          alt="FirstTouch"
          style={{ width: 44, height: 44, borderRadius: 10, borderCurve: 'continuous' }}
        />
        {home.data ? <StatusChip kind={home.data.paid ? 'paid' : 'unpaid'} label={`Indoor pass: ${home.data.paid ? 'Paid' : 'Not paid'}`} /> : null}
      </View>

      <View className="mb-[6px]">
        <Text role="heading" aria-level={1} className="font-inter-extrabold text-[32px] tracking-[-0.03em] text-ink">
          {`Morning, ${firstName}`}
        </Text>
        {home.data?.seasonName ? (
          <Text className="mt-[6px] text-body-lg text-muted">
            {`${seasonLabel(home.data.seasonName)} · ${runsThisWeek(week.length)}`}
          </Text>
        ) : null}
        <View className="mt-3 h-[3px] w-10 rounded-[2px] bg-brand" />
      </View>

      <View className="mt-1 flex-row items-center justify-between">
        <Text role="heading" aria-level={2} className="font-inter-extrabold text-[20px] tracking-[-0.01em] text-ink">
          Upcoming runs
        </Text>
        <Pressable
          role="button"
          aria-expanded={showAll}
          onPress={() => setShowAll((v) => !v)}
          className={`min-h-tap flex-row items-center gap-1 ${FOCUS_RING}`}
        >
          <Text className="font-inter-bold text-[14px] text-brand-text">{showAll ? 'Show less' : 'View all'}</Text>
          {showAll ? null : <ArrowRightIcon className="text-brand-text" size={16} strokeWidth={2.4} />}
        </Pressable>
      </View>

      {home.isLoading ? <ActivityIndicator /> : null}
      {home.error ? <Text className="text-danger">{`Couldn't load runs: ${home.error.message}`}</Text> : null}
      {home.data && shown.length === 0 ? <Text className="text-body text-muted">No upcoming runs.</Text> : null}
      <View className="gap-4">
        {shown.map((run) => (
          <RunCard key={run.id} run={run} now={now} />
        ))}
      </View>

      <View
        role="region"
        aria-label="Auto team creation"
        className="min-h-[128px] overflow-hidden rounded-card bg-hero p-5"
      >
        <PlayersIcon />
        <Text className="mt-[10px] font-inter-extrabold text-[19px] text-white">Auto team creation</Text>
        <Text className="mt-[6px] max-w-[220px] text-[14px] leading-[20px] text-white/80">
          Teams are made automatically when RSVPs close, 1 hour before kickoff.
        </Text>
      </View>
    </Screen>
  );
}
