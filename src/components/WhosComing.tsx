import { Text, View } from 'react-native';
import type { RosterPlayer } from '../lib/useRunDetail';
import { RosterRow } from './RosterRow';

/** The "Who's coming" section: a heading, a note about the order, and one row per player. */
export function WhosComing({ players, myId }: { players: RosterPlayer[]; myId: string | undefined }) {
  return (
    <View className="gap-[10px]">
      <View className="mt-1 flex-row items-baseline justify-between">
        <Text role="heading" aria-level={2} className="font-inter-extrabold text-[20px] tracking-[-0.01em] text-ink">
          Who’s coming
        </Text>
        <Text className="font-inter-semibold text-[13px] text-muted">In order of RSVP</Text>
      </View>
      {players.length === 0 ? (
        <Text className="text-body text-muted">No one has said yes yet.</Text>
      ) : (
        <View className="rounded-card border border-line bg-surface py-1 shadow-card">
          {players.map((player, i) => (
            <RosterRow key={player.playerId} player={player} first={i === 0} isMe={player.playerId === myId} />
          ))}
        </View>
      )}
    </View>
  );
}
