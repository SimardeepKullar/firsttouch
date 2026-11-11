import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { longDate, runKicker, type SeasonType } from '../lib/runDetail';
import { formatStartTime } from '../lib/torontoTime';
import { ChevronLeftIcon } from './NavIcons';
import { ClockIcon, PinIcon } from './RunIcons';
import { StatTile } from './StatTile';
import { FOCUS_RING } from './pressable';

type Props = {
  runDate: string;
  startTime: string;
  location: string;
  seasonType: SeasonType;
  going: number;
  attackers: number;
  defenders: number;
};

/** The floating hero-gradient card at the top of Run detail (03-run-detail, V2 header). */
export function RunHeaderCard({ runDate, startTime, location, seasonType, going, attackers, defenders }: Props) {
  return (
    <View className="mx-3 mt-3 gap-3 overflow-hidden rounded-hero bg-hero px-4 pb-[18px] pt-3">
      {/* The faint ball in the corner. Drawn first so everything else sits on top of it. */}
      <Svg
        width={200}
        height={200}
        viewBox="0 0 64 64"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={1.5}
        pointerEvents="none"
        style={{ position: 'absolute', right: -50, top: -30 }}
        aria-hidden
      >
        <Circle cx={32} cy={32} r={30} />
        <Path d="M32 20l11.4 8.3-4.4 13.4H25l-4.4-13.4z" />
        <Path d="M32 20V3M43.4 28.3l16-5.2M39 41.7l10 13.8M25 41.7l-10 13.8M20.6 28.3l-16-5.2" />
      </Svg>

      <Link href="/" asChild>
        <Pressable
          role="link"
          aria-label="Back to Home"
          className={`-ml-[6px] h-11 w-11 items-center justify-center self-start rounded-[14px] ${FOCUS_RING}`}
        >
          <ChevronLeftIcon className="text-white" />
        </Pressable>
      </Link>

      <View>
        <Text className="font-inter-extrabold text-[13px] tracking-[0.1em] text-logo-touch">
          {runKicker(runDate, seasonType)}
        </Text>
        <Text role="heading" aria-level={1} className="mt-1 font-inter-extrabold text-[30px] tracking-[-0.03em] text-white">
          {longDate(runDate)}
        </Text>
        <View className="mt-[10px] gap-[6px]">
          <View className="flex-row items-center gap-2">
            <ClockIcon className="text-white/80" />
            <Text className="text-body text-white/80">{formatStartTime(startTime)}</Text>
          </View>
          <View className="flex-row items-start gap-2">
            <PinIcon className="text-white/80" />
            <Text className="shrink text-body text-white/80">{location}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2">
        <StatTile value={going} label="going" />
        <StatTile value={attackers} label="attackers" />
        <StatTile value={defenders} label="defenders" />
      </View>
    </View>
  );
}
