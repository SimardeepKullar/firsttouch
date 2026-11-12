import { Text, View } from 'react-native';
import { longDate, runKicker, type SeasonType } from '../lib/runDetail';
import { addressLines, formatStartTime } from '../lib/torontoTime';
import { CardFrame } from './CardFrame';
import { ClockIcon, PinIcon } from './RunIcons';
import { SoccerBall } from './SoccerBall';
import { StatTile } from './StatTile';

type Props = {
  runDate: string;
  startTime: string;
  location: string;
  seasonType: SeasonType;
  /** RSVPs have closed (or the run is past "open"): the bar turns grey. */
  closed: boolean;
  going: number;
  attackers: number;
  defenders: number;
};

/** The run card at the top of Run detail (03, V3): curved bar, green wash, a ball peeking in, then the
 *  kicker, date, time, address and three stat tiles. No "RSVPs close" line here; that's in Your RSVP. */
export function RunSummaryCard({ runDate, startTime, location, seasonType, closed, going, attackers, defenders }: Props) {
  const [line1, line2] = addressLines(location);

  return (
    <CardFrame
      bar={closed ? 'closed' : 'open'}
      wash
      decoration={
        <View className="absolute -right-[60px] -top-[34px]">
          <SoccerBall size={190} />
        </View>
      }
    >
      <View className="pb-0.5 pl-0.5">
        <Text className="font-inter-extrabold text-[14px] tracking-[0.06em] text-brand-text">
          {runKicker(runDate, seasonType)}
        </Text>
        <Text
          role="heading"
          aria-level={1}
          className="mt-0.5 font-inter-extrabold text-[30px] leading-[33px] tracking-[-0.03em] text-ink"
        >
          {longDate(runDate)}
        </Text>

        <View className="mt-[14px] gap-[9px]">
          <View className="flex-row items-center gap-[10px]">
            <ClockIcon className="text-muted" />
            <Text className="text-body text-ink-2">{`${formatStartTime(startTime)} start`}</Text>
          </View>
          <View className="flex-row items-start gap-[10px]">
            <View className="mt-px">
              <PinIcon className="text-muted" />
            </View>
            <Text className="shrink text-body leading-[20px] text-ink-2">{line2 ? `${line1}\n${line2}` : line1}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row gap-2">
          <StatTile value={going} label="going" />
          <StatTile value={attackers} label="attackers" />
          <StatTile value={defenders} label="defenders" />
        </View>
      </View>
    </CardFrame>
  );
}
