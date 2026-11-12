import { Text, View } from 'react-native';
import type { RosterPlayer } from '../lib/useRunDetail';
import { RosterRow } from './RosterRow';

/** The "Who's coming" section: a heading, a note about the order, and one row per player. */
export function WhosComing({ players }: { players: RosterPlayer[] }) {
  return (
    <View className="gap-[10px]">
      <View className="flex-row items-baseline justify-between">
        <Text role="heading" aria-level={2} className="font-inter-extrabold text-[20px] tracking-[-0.01em] text-ink">
          Who’s coming
        </Text>
        <Text className="text-[13px] text-muted">In order of RSVP</Text>
      </View>
      {players.length === 0 ? (
        <Text className="text-body text-muted">No one has said yes yet.</Text>
      ) : (
        <View className="rounded-card border border-line bg-surface shadow-card">
          {players.map((player, i) => (
            <RosterRow key={player.playerId} player={player} first={i === 0} />
          ))}
        </View>
      )}
    </View>
  );
}
