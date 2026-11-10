// What the Home run list shows, as plain functions (no React, no network) so they can be tested.
import { addDays } from './torontoTime';

/** One run as a Home card needs it. */
export type HomeRun = {
  id: string;
  runDate: string; // "2027-02-13", a Toronto date
  startTime: string; // "06:30:00"
  location: string;
  /** From the run_lock_at computed field: when RSVPs close (an ISO timestamp). */
  lockAt: string;
  /** The holiday's name when this run is a holiday Monday, else null. */
  holiday: string | null;
  /** The first people to say yes (oldest first), already cut down to what the avatar stack shows. */
  goingNames: string[];
  /** Everyone going (yes RSVPs from players with Plays on). */
  goingCount: number;
  iAmGoing: boolean;
};

/** How far ahead the default Home list looks: today plus the next 7 days (design decision 24). */
export const DAYS_AHEAD = 7;

/** The runs to draw: the next 7 days by default, or every upcoming run for "View all". Date order. */
export function visibleRuns(runs: HomeRun[], today: string, showAll: boolean): HomeRun[] {
  const last = addDays(today, DAYS_AHEAD);
  return runs
    .filter((r) => r.runDate >= today && (showAll || r.runDate <= last))
    .sort((a, b) => a.runDate.localeCompare(b.runDate));
}

type HolidayRow = { holiday_date: string; name: string };

/** runs and holidays have no foreign key, so the link is the date: a run whose run_date equals a
 *  holiday's holiday_date is that holiday's run. Returns date -> holiday name. */
export function holidayNamesByDate(holidays: HolidayRow[]): Map<string, string> {
  return new Map(holidays.map((h) => [h.holiday_date, h.name]));
}

type RosterRow = { run_id: string; player_id: string; full_name: string };

/** Groups roster rows (already in the order they said yes) by run. */
export function rosterByRun(rows: RosterRow[]): Map<string, RosterRow[]> {
  const byRun = new Map<string, RosterRow[]>();
  for (const row of rows) {
    const list = byRun.get(row.run_id);
    if (list) list.push(row);
    else byRun.set(row.run_id, [row]);
  }
  return byRun;
}
