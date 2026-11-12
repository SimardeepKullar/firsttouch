import { Text, View } from 'react-native';
import { positionTag, rosterExtras } from '../lib/runDetail';
import type { RosterPlayer } from '../lib/useRunDetail';
import { Avatar } from './Avatar';
import { FlagBadge } from './FlagBadge';
import { PositionTag } from './PositionTag';
import { StarRating } from './StarRating';

/** One person in "Who's coming" (03, V3): avatar, name (" · You" on your own row), the Morning of badge
 *  if it applies, and the position tag. Admins also see stars and Unpaid; players never do. */
export function RosterRow({
  player,
  first,
  isMe,
  isAdmin,
}: {
  player: RosterPlayer;
  first: boolean;
  isMe: boolean;
  isAdmin: boolean;
}) {
  const extras = rosterExtras(isAdmin, player);
  return (
    <View className={`min-h-[48px] flex-row items-center gap-3 px-4 py-2 ${first ? '' : 'border-t border-line'}`}>
      <Avatar name={player.name} size={38} tone="muted" outlined />
      <View className="min-w-0 flex-1 gap-[3px]">
        <Text numberOfLines={1} className="font-inter-semibold text-[15px] text-ink">
          {player.name}
          {isMe ? <Text className="text-brand-text"> · You</Text> : null}
        </Text>
        {extras.stars !== null ? <StarRating rating={extras.stars} size={12} /> : null}
      </View>
      {player.morningOf ? <FlagBadge kind="morningOf" size="md" /> : null}
      {extras.unpaid ? <FlagBadge kind="unpaid" size="md" /> : null}
      <PositionTag position={positionTag(player.position)} />
    </View>
  );
}