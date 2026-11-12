import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { BackLink } from '../../../components/BackLink';
import { RsvpPanel } from '../../../components/RsvpPanel';
import { RunSummaryCard } from '../../../components/RunSummaryCard';
import { RunTopBar } from '../../../components/RunTopBar';
import { rsvpsClosed } from '../../../lib/torontoTime';
import { WhosComing } from '../../../components/WhosComing';
import { COLUMN, useNavClearance } from '../../../components/layout';
import { useAuth } from '../../../lib/auth';
import { homeVariant } from '../../../lib/homeVariant';
import { positionCounts, runChipKind } from '../../../lib/runDetail';
import { useLiveRsvps } from '../../../lib/useLiveRsvps';
import { useMe } from '../../../lib/useMe';
import { useNow } from '../../../lib/useNow';
import { useRunDetail } from '../../../lib/useRunDetail';

/** What the screen shows when there is no run to draw: a spinner, or a message, with a way back. */
function Notice({ children }: { children: React.ReactNode }) {
  return (
    <View className={`flex-1 gap-3 px-4 pt-4 ${COLUMN}`}>
      <BackLink href="/" label="Home" />
      {children}
    </View>
  );
}

// Run detail (player view): /runs/<id>. Header card, your RSVP, and who is coming.
export default function RunDetail() {
  // 1. Every hook first. The run id comes from the URL.
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const userId = session?.user.id;
  const me = useMe();
  const now = useNow();
  const run = useRunDetail(id);
  const clearance = useNavClearance();

  // Keep this screen's list up to date: when anyone RSVPs to THIS run, refetch ['run', userId, id].
  const runIds = useMemo(() => [id], [id]);
  useLiveRsvps(['run', userId, id], runIds);

  // 2. Then decide what to draw.
  if (run.isPending) {
    return (
      <Notice>
        <ActivityIndicator />
      </Notice>
    );
  }
  if (run.error) {
    return (
      <Notice>
        <Text className="text-danger">{`Couldn't load this run: ${run.error.message}`}</Text>
      </Notice>
    );
  }
  if (!run.data) {
    return (
      <Notice>
        <Text role="heading" aria-level={1} className="font-inter-extrabold text-[24px] text-ink">
          Run not found
        </Text>
        <Text className="text-body text-muted">This run doesn’t exist, or the link is wrong.</Text>
      </Notice>
    );
  }

  const data = run.data;
  const { attackers, defenders } = positionCounts(data.roster);
  const iAmGoing = data.roster.some((p) => p.playerId === userId);
  const variant = me.data ? homeVariant(me.data.isAdmin, me.data.plays) : 'player';
  const closed = rsvpsClosed(data.lockAt, now);
  const chip = runChipKind(data.status, closed);

  return (
    <ScrollView
      className={`flex-1 ${COLUMN}`}
      contentContainerClassName="gap-[14px] px-4 pt-4"
      contentContainerStyle={{ paddingBottom: clearance }}
    >
      <RunTopBar chip={chip} />
      <RunSummaryCard
        runDate={data.runDate}
        startTime={data.startTime}
        location={data.location}
        seasonType={data.seasonType}
        closed={chip !== 'open'}
        going={data.roster.length}
        attackers={attackers}
        defenders={defenders}
      />
      <RsvpPanel
        runId={data.id}
        going={iAmGoing}
        closed={chip !== 'open'}
        lockAt={data.lockAt}
        variant={variant}
        myTeam={data.myTeam}
      />
      <WhosComing players={data.roster} />
    </ScrollView>
  );
}
