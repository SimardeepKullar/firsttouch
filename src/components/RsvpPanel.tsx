import { Pressable, Text, View } from 'react-native';
import type { HomeVariant } from '../lib/homeVariant';
import { rsvpPanelKind, rsvpPanelText } from '../lib/runDetail';
import { closeLine, rsvpsClosed } from '../lib/torontoTime';
import { useRsvp } from '../lib/useRsvp';
import { LockIcon } from './RunIcons';
import { FOCUS_RING } from './pressable';

const CARD =
  'flex-row items-center justify-between gap-3 rounded-[20px] border border-line bg-surface py-3 pl-4 pr-3 shadow-card';

type Props = {
  runId: string;
  going: boolean;
  /** run_lock_at: when RSVPs close (ISO timestamp). */
  lockAt: string;
  now: Date;
  variant: HomeVariant;
};

/** "Your RSVP" on Run detail. A manager (admin who doesn't play) gets a note; a player gets the toggle,
 *  or the disabled "Locked" button after the lock. */
export function RsvpPanel({ runId, going, lockAt, now, variant }: Props) {
  const closed = rsvpsClosed(lockAt, now);

  if (rsvpPanelKind(variant, closed) === 'managing') {
    return (
      <View className={CARD}>
        <Text className="font-inter-semibold text-[15px] text-muted">You’re managing this run</Text>
      </View>
    );
  }
  return <PlayerPanel runId={runId} going={going} closed={closed} lockAt={lockAt} now={now} />;
}

// Its own component so the useRsvp hook only runs for players, never for a manager.
function PlayerPanel({ runId, going, closed, lockAt, now }: Omit<Props, 'variant'> & { closed: boolean }) {
  const rsvp = useRsvp(runId);
  const text = rsvpPanelText(going);

  return (
    <View className="gap-2">
      <View className={CARD}>
        <View className="shrink">
          <Text className="font-inter-extrabold text-[16px] text-ink">{text.title}</Text>
          <View className="mt-[3px] flex-row items-center gap-[6px]">
            <LockIcon className="text-muted" size={14} strokeWidth={2.2} />
            <Text className="text-[13px] text-muted">{closeLine(lockAt, now)}</Text>
          </View>
        </View>

        {closed ? (
          <Pressable
            role="button"
            disabled
            aria-disabled
            className="h-11 flex-row items-center gap-[6px] rounded-full border border-line bg-surface-2 px-[14px]"
          >
            <LockIcon className="text-muted" size={16} strokeWidth={2.4} />
            <Text className="font-inter-extrabold text-[15px] text-muted">Locked</Text>
          </Pressable>
        ) : (
          <Pressable
            role="button"
            aria-label={going ? 'Change to not going' : 'I’m in'}
            onPress={() => rsvp.setGoing(!going)}
            className={`h-11 items-center justify-center rounded-full bg-button px-[18px] ${FOCUS_RING}`}
          >
            <Text className="font-inter-extrabold text-[15px] text-brand-on">{text.action}</Text>
          </Pressable>
        )}
      </View>
      {rsvp.errorMessage ? (
        <Text role="alert" className="text-center text-[14px] font-inter-semibold text-danger">
          {rsvp.errorMessage}
        </Text>
      ) : null}
    </View>
  );
}