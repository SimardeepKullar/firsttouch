import { Text, View } from 'react-native';
import { positionTag } from '../lib/runDetail';
import type { RosterPlayer } from '../lib/useRunDetail';
import { Avatar } from './Avatar';
import { FlagBadge } from './FlagBadge';
import { PositionTag } from './PositionTag';

/** One person in "Who's coming": avatar, name, the Morning of badge (if it applies), position tag. */
export function RosterRow({ player, first }: { player: RosterPlayer; first: boolean }) {
  return (
    <View className={`flex-row items-center gap-3 px-4 py-3 ${first ? '' : 'border-t border-line'}`}>
      <Avatar name={player.name} size={40} tone="brand" />
      <View className="min-w-0 flex-1 gap-1">
        <Text numberOfLines={1} className="font-inter-bold text-[16px] text-ink">
          {player.name}
        </Text>
        {player.morningOf ? <FlagBadge kind="morningOf" /> : null}
      </View>
      <PositionTag position={positionTag(player.position)} />
    </View>
  );
}
