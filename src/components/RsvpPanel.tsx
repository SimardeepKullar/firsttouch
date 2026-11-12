import { Pressable, Text, View } from 'react-native';
import type { HomeVariant } from '../lib/homeVariant';
import { rsvpPanelKind, rsvpPanelText, type TeamColor } from '../lib/runDetail';
import { formatTorontoTime } from '../lib/torontoTime';
import { useRsvp } from '../lib/useRsvp';
import { CheckIcon, LockIcon, PlusIcon } from './RunIcons';
import { TeamPanel } from './TeamPanel';
import { FOCUS_RING } from './pressable';

const CARD = 'gap-[14px] rounded-card border border-line bg-surface p-4 shadow-card';

type MyTeam = { team: TeamColor; positions: ('attack' | 'defend')[] } | null;

type Props = {
  runId: string;
  going: boolean;
  /** Past the lock time, or the run is no longer open (locked, published, cancelled). */
  closed: boolean;
  /** run_lock_at: when RSVPs close (ISO timestamp). */
  lockAt: string;
  variant: HomeVariant;
  myTeam: MyTeam;
};

/** "Your RSVP" on Run detail (03, V3). A manager (admin who doesn't play) gets a note; a player gets the
 *  pill while open, then their team (once published) or a disabled "Locked" pill. */
export function RsvpPanel({ runId, going, closed, lockAt, variant, myTeam }: Props) {
  if (variant === 'manager') {
    return (
      <View role="region" aria-label="Your RSVP" className={CARD}>
        <Text className="font-inter-semibold text-[15px] text-muted">You’re managing this run</Text>
      </View>
    );
  }
  return <PlayerPanel runId={runId} going={going} closed={closed} lockAt={lockAt} myTeam={myTeam} />;
}

// Its own component so the useRsvp hook only runs for players, never for a manager.
function PlayerPanel({ runId, going, closed, lockAt, myTeam }: Omit<Props, 'variant'>) {
  const rsvp = useRsvp(runId);
  const kind = rsvpPanelKind('player', closed, myTeam !== null);
  const text = rsvpPanelText(going);

  return (
    <View role="region" aria-label="Your RSVP" className={CARD}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 shrink">
          <Text className="font-inter-extrabold text-[12px] tracking-[0.1em] text-muted">YOUR RSVP</Text>
          <Text className="mt-1 font-inter-extrabold text-[20px] tracking-[-0.02em] text-ink">{text.title}</Text>
          {kind === 'open' ? (
            <View className="mt-1 flex-row items-center gap-[6px]">
              <LockIcon className="text-muted" size={14} strokeWidth={2.2} />
              <Text className="text-[13px] text-muted">{`RSVPs close ${formatTorontoTime(new Date(lockAt))}`}</Text>
            </View>
          ) : null}
        </View>

        {kind === 'open' ? (
          <Pressable
            role="button"
            aria-pressed={going}
            onPress={() => rsvp.setGoing(!going)}
            className={`h-[46px] shrink-0 flex-row items-center justify-center gap-2 rounded-full border-[1.5px] px-[18px] ${FOCUS_RING} ${
              going ? 'border-transparent bg-button-in shadow-button-in' : 'border-brand-line'
            }`}
          >
            {going ? (
              <CheckIcon className="text-brand-on" size={16} strokeWidth={3} />
            ) : (
              <PlusIcon className="text-brand-text" size={16} strokeWidth={3} />
            )}
            <Text className={`font-inter-extrabold text-[15px] ${going ? 'text-brand-on' : 'text-brand-text'}`}>
              {text.action}
            </Text>
          </Pressable>
        ) : null}

        {kind === 'locked' ? (
          <Pressable
            role="button"
            disabled
            aria-disabled
            className="h-[46px] shrink-0 flex-row items-center gap-[6px] rounded-full border border-line bg-surface-2 px-4"
          >
            <LockIcon className="text-muted" size={16} strokeWidth={2.4} />
            <Text className="font-inter-bold text-[15px] text-muted">Locked</Text>
          </Pressable>
        ) : null}
      </View>

      {kind === 'team' && myTeam ? <TeamPanel team={myTeam.team} positions={myTeam.positions} /> : null}

      {rsvp.errorMessage ? (
        <Text role="alert" className="text-center text-[14px] font-inter-semibold text-danger">
          {rsvp.errorMessage}
        </Text>
      ) : null}
    </View>
  );
}