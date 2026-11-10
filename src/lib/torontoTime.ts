// Dates and times for the run cards. Pure functions (no React) so they can be unit tested.
// Everything is shown in Toronto time, whatever the phone's own time zone is.

const TZ = 'America/Toronto';

/** One formatter per shape, built once. `timeZone` is what makes the output Toronto time. */
const dayParts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const timeParts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
const weekdayFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' });
const monthDayFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });

/** The Toronto calendar date of an instant, as "YYYY-MM-DD" (the same shape as runs.run_date). */
export function torontoDate(instant: Date): string {
  const p = Object.fromEntries(dayParts.formatToParts(instant).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

/** "2026-11-10" plus n days. Done in UTC so daylight saving can't shift the result. */
export function addDays(isoDate: string, n: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** "5:30 AM". Built from parts because newer engines put a narrow no-break space before AM/PM. */
export function formatTorontoTime(instant: Date): string {
  const p = Object.fromEntries(timeParts.formatToParts(instant).map((x) => [x.type, x.value]));
  return `${p.hour}:${p.minute} ${String(p.dayPeriod).toUpperCase()}`;
}

/** A date-only value at midday UTC: the same calendar day in Toronto (7 or 8 in the morning there). */
function noonOf(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00Z`);
}

/** "SAT" for a run date. */
export function dayKicker(isoDate: string): string {
  return weekdayFmt.format(noonOf(isoDate)).toUpperCase();
}

/** "Feb 13" for a run date. */
export function shortDate(isoDate: string): string {
  return monthDayFmt.format(noonOf(isoDate));
}

/** runs.start_time ("06:30:00") as "6:30 AM". It is already a Toronto wall-clock time, so no zone maths. */
export function formatStartTime(startTime: string): string {
  const [h, m] = startTime.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${period}`;
}

/** True once the lock time has passed. */
export function rsvpsClosed(lockAt: string, now: Date): boolean {
  return now.getTime() >= new Date(lockAt).getTime();
}

/** "RSVPs close 5:30 AM", or "RSVPs closed 5:30 AM" after the lock time. */
export function closeLine(lockAt: string, now: Date): string {
  const time = formatTorontoTime(new Date(lockAt));
  return `${rsvpsClosed(lockAt, now) ? 'RSVPs closed' : 'RSVPs close'} ${time}`;
}

/** Splits "7855 Finch Ave W, Brampton, ON" into two lines at the first comma. */
export function addressLines(address: string): [string, string] {
  const i = address.indexOf(',');
  if (i === -1) return [address.trim(), ''];
  return [address.slice(0, i + 1).trim(), address.slice(i + 1).trim()];
}

/** "Indoor 2026-27" -> "Indoor 2026–27" (en dash, as in the mockup). */
export function seasonLabel(name: string): string {
  return name.replace(/(\d{4})-(\d{2})\b/, '$1–$2');
}

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** "three runs this week", "one run this week", "no runs this week". */
export function runsThisWeek(count: number): string {
  const word = count < WORDS.length ? WORDS[count] : String(count);
  return `${word} ${count === 1 ? 'run' : 'runs'} this week`;
}
