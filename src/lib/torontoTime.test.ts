import { describe, expect, it } from 'vitest';
import {
  addDays, addressLines, closeLine, dayKicker, formatStartTime, formatTorontoTime, rsvpsClosed,
  runsThisWeek, seasonLabel, shortDate, torontoDate,
} from './torontoTime';

describe('torontoDate', () => {
  it('uses the Toronto day, not the UTC day', () => {
    // 02:00 UTC on Nov 10 is still the evening of Nov 9 in Toronto (UTC-5).
    expect(torontoDate(new Date('2026-11-10T02:00:00Z'))).toBe('2026-11-09');
    expect(torontoDate(new Date('2026-11-10T06:00:00Z'))).toBe('2026-11-10');
  });
});

describe('addDays', () => {
  it('crosses month and year ends', () => {
    expect(addDays('2026-11-10', 7)).toBe('2026-11-17');
    expect(addDays('2026-12-29', 7)).toBe('2027-01-05');
  });
  it('is not thrown off by the clocks changing', () => {
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09');
  });
});

describe('formatTorontoTime', () => {
  it('shows winter time (UTC-5)', () => {
    expect(formatTorontoTime(new Date('2027-02-13T10:30:00Z'))).toBe('5:30 AM');
  });
  it('shows summer time (UTC-4)', () => {
    expect(formatTorontoTime(new Date('2027-07-10T09:30:00Z'))).toBe('5:30 AM');
  });
  it('uses a plain space and PM', () => {
    const s = formatTorontoTime(new Date('2027-02-13T22:05:00Z'));
    expect(s).toBe('5:05 PM');
  });
});

describe('date labels', () => {
  it('gives the day kicker and short date', () => {
    expect(dayKicker('2027-02-13')).toBe('SAT');
    expect(dayKicker('2027-02-15')).toBe('MON');
    expect(shortDate('2027-02-13')).toBe('Feb 13');
  });
});

describe('formatStartTime', () => {
  it('formats morning, noon, midnight and evening', () => {
    expect(formatStartTime('06:30:00')).toBe('6:30 AM');
    expect(formatStartTime('12:00:00')).toBe('12:00 PM');
    expect(formatStartTime('00:15:00')).toBe('12:15 AM');
    expect(formatStartTime('19:05:00')).toBe('7:05 PM');
  });
});

describe('closeLine', () => {
  const lock = '2027-02-13T10:30:00Z'; // 5:30 AM Toronto
  it('says "close" before the lock time', () => {
    expect(closeLine(lock, new Date('2027-02-12T10:30:00Z'))).toBe('RSVPs close 5:30 AM');
    expect(rsvpsClosed(lock, new Date('2027-02-13T10:29:59Z'))).toBe(false);
  });
  it('says "closed" from the lock time on', () => {
    expect(closeLine(lock, new Date('2027-02-13T10:30:00Z'))).toBe('RSVPs closed 5:30 AM');
    expect(rsvpsClosed(lock, new Date('2027-02-13T10:30:00Z'))).toBe(true);
  });
  it('reads the offset from the instant (works the same in summer)', () => {
    expect(closeLine('2027-07-10T09:30:00+00:00', new Date('2027-07-01T00:00:00Z'))).toBe('RSVPs close 5:30 AM');
  });
});

describe('addressLines', () => {
  it('splits at the first comma', () => {
    expect(addressLines('7855 Finch Ave W, Brampton, ON L6T 0B2')).toEqual(['7855 Finch Ave W,', 'Brampton, ON L6T 0B2']);
  });
  it('copes with no comma', () => {
    expect(addressLines('The Dome')).toEqual(['The Dome', '']);
  });
});

describe('season text', () => {
  it('uses an en dash in the season name', () => {
    expect(seasonLabel('Indoor 2026-27')).toBe('Indoor 2026–27');
    expect(seasonLabel('Outdoor 2027')).toBe('Outdoor 2027');
  });
  it('spells small counts', () => {
    expect(runsThisWeek(3)).toBe('three runs this week');
    expect(runsThisWeek(1)).toBe('one run this week');
    expect(runsThisWeek(0)).toBe('no runs this week');
    expect(runsThisWeek(12)).toBe('12 runs this week');
  });
});
