// What the Run detail screen decides, as plain functions (no React, no network) so they can be tested.
import type { HomeVariant } from './homeVariant';
import type { RosterPlayer } from './useRunDetail';

type Position = 'attack' | 'defend';
export type SeasonType = 'indoor' | 'outdoor';

/** How many attackers and defenders are in a list of players. */
export function positionCounts(rows: readonly { position: Position }[]) {
  const attackers = rows.filter((r) => r.position === 'attack').length;
  return { attackers, defenders: rows.length - attackers };
}

/** The database says 'attack' / 'defend'; the PositionTag component wants 'ATT' / 'DEF'. */
export function positionTag(position: Position): 'ATT' | 'DEF' {
  return position === 'attack' ? 'ATT' : 'DEF';
}

export type RsvpPanelKind = 'managing' | 'open' | 'team' | 'locked';

/** The note beside "Who's coming". Admins are told they are looking at the admin view. */
export function rosterListNote(isAdmin: boolean): string {
  return isAdmin ? 'In order of RSVP · admin view' : 'In order of RSVP';
}

/** The admin-only extras for one row. Decided by who is looking, not by what the data happens to contain:
 *  a player gets nothing, and an admin gets stars only if we have a number and Unpaid only if it is true. */
export function rosterExtras(
  isAdmin: boolean,
  player: { stars: number | null; flagUnpaid: boolean | null },
): { stars: number | null; unpaid: boolean } {
  if (!isAdmin) return { stars: null, unpaid: false };
  return { stars: player.stars, unpaid: player.flagUnpaid === true };
}

/** Which RSVP panel to draw. A manager (admin who doesn't play) never RSVPs. After the lock a player
 *  with a team (teams are published) sees it; everyone else sees the disabled "Locked" pill. */
export function rsvpPanelKind(variant: HomeVariant, closed: boolean, hasTeam = false): RsvpPanelKind {
  if (variant === 'manager') return 'managing';
  if (!closed) return 'open';
  return hasTeam ? 'team' : 'locked';
}

/** The words in the panel: the status line, and the pill (which shows your answer; tapping it flips it). */
export function rsvpPanelText(going: boolean) {
  return going
    ? { title: 'You’re in', action: 'You’re in' }
    : { title: 'You’re not going', action: 'I’m in' };
}

const TZ = 'America/Toronto';
const longDateFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', month: 'short', day: 'numeric' });

/** A date-only value at midday UTC, which is the same calendar day in Toronto. */
const noonOf = (isoDate: string) => new Date(`${isoDate}T12:00:00Z`);

/** "INDOOR 2027": the season type and the calendar year of the run. */
export function runKicker(runDate: string, seasonType: SeasonType): string {
  return `${seasonType.toUpperCase()} ${runDate.slice(0, 4)}`;
}

/** "Sunday, Feb 14" */
export function longDate(runDate: string): string {
  return longDateFmt.format(noonOf(runDate));
}

/** Who is saying yes or no, as the roster needs to know them. */
export type RsvpMe = { id: string; name: string; position: Position };

/** A copy of the Run detail data with my RSVP applied, as if the save had worked (the instant update).
 *  - yes: I go at the end of the list (oldest yes first), unless I'm already on it;
 *  - no: I come off the list;
 *  - saying what's already true changes nothing.
 *  Never edits `data` itself: React Query needs a new object to notice a change. The "Morning of" badge, stars 
 *  and Unpaid are not guessed here (false / null); the refetch after the save brings the real values. */
export function applyRsvpToDetail<T extends { roster: RosterPlayer[] }>(data: T, going: boolean, me: RsvpMe): T {
  const onList = data.roster.some((p) => p.playerId === me.id);
  if (going === onList) return data;
  if (going) {
    const row: RosterPlayer = { playerId: me.id, name: me.name, position: me.position, morningOf: false, stars: null, flagUnpaid: null };
    return { ...data, roster: [...data.roster, row] };
  }
  return { ...data, roster: data.roster.filter((p) => p.playerId !== me.id) };
}

export type RunStatus = 'open' | 'locked' | 'published' | 'cancelled';
export type TeamColor = 'blue' | 'yellow' | 'red';

/** Which status chip to show at the top. The database status wins for published and cancelled; otherwise
 *  a run past its lock time counts as locked even if the lock job hasn't updated the row yet. */
export function runChipKind(status: RunStatus, closed: boolean): RunStatus {
  if (status === 'published' || status === 'cancelled') return status;
  return status === 'locked' || closed ? 'locked' : 'open';
}

/** The team panel's two lines. `positions` is everyone on your team, you included. */
export function teamSummary(team: TeamColor, positions: readonly Position[]) {
  const { attackers, defenders } = positionCounts(positions.map((position) => ({ position })));
  const name = team.charAt(0).toUpperCase() + team.slice(1);
  const count = positions.length;
  return {
    title: `You’re on ${name}`,
    subtitle: `${count} ${count === 1 ? 'player' : 'players'} · ATT/DEF ${attackers}:${defenders}`,
  };
}

/** My team once teams are published: its colour, and the position of everyone on it (me included).
 *  `assignments` are the team_assignments rows of the run; `roster` says who plays where. */
export function findMyTeam(
  userId: string | undefined,
  assignments: readonly { player_id: string; team: TeamColor }[],
  roster: readonly { playerId: string; position: Position }[],
): { team: TeamColor; positions: Position[] } | null {
  const mine = assignments.find((a) => a.player_id === userId);
  if (!mine) return null;
  const positions = assignments
    .filter((a) => a.team === mine.team)
    .flatMap((a) => {
      const player = roster.find((r) => r.playerId === a.player_id);
      return player ? [player.position] : [];
    });
  return { team: mine.team, positions };
}
