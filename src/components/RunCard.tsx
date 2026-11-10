import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { AvatarStack } from './Avatar';
import { CardFrame } from './CardFrame';
import { CheckIcon, ChevronRightIcon, ClockIcon, LockIcon, PinIcon, PlusIcon } from './RunIcons';
import { FOCUS_RING } from './pressable';
import type { HomeRun } from '../lib/homeRuns';
import { useRsvp } from '../lib/useRsvp';
import { addressLines, closeLine, dayKicker, formatStartTime, rsvpsClosed, shortDate } from '../lib/torontoTime';

/** One upcoming run on Home (02-home, V3). `now` is passed in so the open/closed state is a pure
 *  function of the props. */
export function RunCard({ run, now }: { run: HomeRun; now: Date }) {
  const closed = rsvpsClosed(run.lockAt, now);
  const [line1, line2] = addressLines(run.location);
  const going = run.iAmGoing;
  const rsvp = useRsvp(run.id);

  return (
    <CardFrame bar={closed ? 'closed' : 'open'}>
      {/* Top row: day kicker (+ holiday chip), date, Details pill */}
      <View className="flex-row items-start justify-between gap-[10px]">
        <View>
          <View className="flex-row items-center gap-2">
            <Text className="font-inter-extrabold text-[14px] tracking-[0.06em] text-brand-text">{dayKicker(run.runDate)}</Text>
            {run.holiday ? (
              <View className="h-[22px] justify-center rounded-full bg-brand-soft px-2">
                <Text className="font-inter-bold text-[12px] text-brand-text">{run.holiday}</Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-0.5 font-inter-extrabold text-[30px] leading-[33px] tracking-[-0.03em] text-ink">
            {shortDate(run.runDate)}
          </Text>
        </View>
        <Link href={{ pathname: '/runs/[id]', params: { id: run.id } }} asChild>
          <Pressable
            role="link"
            aria-label={`Details for ${dayKicker(run.runDate)} ${shortDate(run.runDate)}`}
            className={`h-[38px] flex-row items-center gap-1 rounded-full border border-line bg-surface-2 pl-4 pr-3 ${FOCUS_RING}`}
          >
            <Text className="font-inter-semibold text-[15px] text-ink">Details</Text>
            <ChevronRightIcon className="text-ink" size={16} strokeWidth={2.4} />
          </Pressable>
        </Link>
      </View>

      {/* Two columns: where and when on the left, who is going on the right */}
      <View className="flex-row items-end justify-between gap-[10px]">
        <View className="min-w-0 flex-1 gap-[9px]">
          <View className="flex-row items-center gap-[10px]">
            <ClockIcon className="text-muted" />
            <Text className="text-body text-ink-2">{formatStartTime(run.startTime)}</Text>
          </View>
          <View className="flex-row items-start gap-[10px]">
            <View className="mt-px">
              <PinIcon className="text-muted" />
            </View>
            <Text className="shrink text-body leading-[19px] text-ink-2">{line2 ? `${line1}\n${line2}` : line1}</Text>
          </View>
          <View className="flex-row items-center gap-[10px]">
            <LockIcon className="text-muted" />
            <Text className="text-[14px] text-muted">{closeLine(run.lockAt, now)}</Text>
          </View>
        </View>

        <View className="items-end gap-[10px]">
          <AvatarStack names={run.goingNames} total={run.goingCount} size={36} />
          <View
            className={`h-10 flex-row items-center gap-2 rounded-full border-[1.5px] pl-[10px] pr-[14px] ${
              going ? 'border-brand-line bg-brand-soft' : 'border-line'
            }`}
          >
            {going ? <CheckIcon className="text-brand-text" strokeWidth={2.4} /> : <ClockIcon className="text-muted" strokeWidth={2.4} />}
            <Text className="font-inter-bold text-[14px] text-ink">{`${run.goingCount} going`}</Text>
          </View>
        </View>
      </View>

      {/* The toggle. Gone once RSVPs close. Tapping flips the card at once (see useRsvp). */}
      {closed ? null : (
        <Pressable
          role="button"
          aria-pressed={going}
          aria-label={going ? "You're in" : "I'm in"}
          onPress={() => rsvp.setGoing(!going)}
          className={`h-[50px] flex-row items-center justify-center gap-[10px] rounded-input border-[1.5px] ${FOCUS_RING} ${
            going ? 'border-transparent bg-button-in shadow-button-in' : 'border-brand-line'
          }`}
        >
          {going ? <CheckIcon className="text-brand-on" strokeWidth={3} /> : <PlusIcon className="text-brand-text" strokeWidth={3} />}
          <Text className={`font-inter-extrabold text-[16px] ${going ? 'text-brand-on' : 'text-brand-text'}`}>
            {going ? 'You’re in' : 'I’m in'}
          </Text>
        </Pressable>
      )}
      {/* Why the last tap was undone. Outside the open/closed check: after a refused save the card
          may close at the same moment, and the message should still be readable. */}
      {rsvp.errorMessage ? (
        <Text role="alert" className="text-center text-[14px] font-inter-semibold text-danger">
          {rsvp.errorMessage}
        </Text>
      ) : null}
    </CardFrame>
  );
}
