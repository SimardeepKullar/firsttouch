export type Player = { id: string; stars: 1 | 2 | 3 | 4 | 5; position: 'attack' | 'defend' };
export type Options = { seasonType: 'indoor' | 'outdoor'; teamCountOverride?: 2 | 3; seed: number };
export type Team = { color: 'blue' | 'yellow' | 'red'; players: Player[]; stars: number; attackers: number; defenders: number };

export function balanceTeams(players: Player[], options: Options): Team[] {
  throw new Error('Not implemented yet');
}
