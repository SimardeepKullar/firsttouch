// What the Run detail screen decides, as plain functions (no React, no network) so they can be tested.
import type { HomeVariant } from './homeVariant';

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

export type RsvpPanelKind = 'managing' | 'open' | 'locked';

/** Which RSVP panel to draw. A manager (admin who doesn't play) never RSVPs, open or locked. */
export function rsvpPanelKind(variant: HomeVariant, closed: boolean): RsvpPanelKind {
  if (variant === 'manager') return 'managing';
  return closed ? 'locked' : 'open';
}

/** The words in the panel: the status line and the button label. */
export function rsvpPanelText(going: boolean) {
  return going
    ? { title: 'You’re in', action: 'Change' }
    : { title: 'You’re not going', action: 'I’m in' };
}

const TZ = 'America/Toronto';
const weekdayLong = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long' });
const longDateFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', month: 'short', day: 'numeric' });

/** A date-only value at midday UTC, which is the same calendar day in Toronto. */
const noonOf = (isoDate: string) => new Date(`${isoDate}T12:00:00Z`);

/** "SUNDAY RUN · INDOOR" */
export function runKicker(runDate: string, seasonType: SeasonType): string {
  return `${weekdayLong.format(noonOf(runDate)).toUpperCase()} RUN · ${seasonType.toUpperCase()}`;
}

/** "Sunday, Feb 14" */
export function longDate(runDate: string): string {
  return longDateFmt.format(noonOf(runDate));
}
