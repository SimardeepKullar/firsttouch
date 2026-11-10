import { describe, expect, it } from 'vitest';
import { holidayNamesByDate, rosterByRun, visibleRuns, type HomeRun } from './homeRuns';

const run = (runDate: string): HomeRun => ({
  id: runDate, runDate, startTime: '06:30:00', location: 'x', lockAt: '2027-01-01T00:00:00Z',
  holiday: null, goingNames: [], goingCount: 0, iAmGoing: false,
});

const runs = ['2026-11-09', '2026-11-10', '2026-11-17', '2026-11-18', '2026-11-24'].map(run);

describe('visibleRuns', () => {
  it('shows today through the next 7 days, dropping past runs', () => {
    expect(visibleRuns(runs, '2026-11-10', false).map((r) => r.runDate)).toEqual(['2026-11-10', '2026-11-17']);
  });
  it('"View all" shows every upcoming run', () => {
    expect(visibleRuns(runs, '2026-11-10', true).map((r) => r.runDate)).toEqual([
      '2026-11-10', '2026-11-17', '2026-11-18', '2026-11-24',
    ]);
  });
  it('sorts by date', () => {
    expect(visibleRuns([run('2026-11-12'), run('2026-11-11')], '2026-11-10', false).map((r) => r.runDate)).toEqual([
      '2026-11-11', '2026-11-12',
    ]);
  });
});

describe('holidayNamesByDate', () => {
  it('maps a date to its holiday name', () => {
    const m = holidayNamesByDate([{ holiday_date: '2027-02-15', name: 'Family Day' }]);
    expect(m.get('2027-02-15')).toBe('Family Day');
    expect(m.get('2027-02-14')).toBeUndefined();
  });
});

describe('rosterByRun', () => {
  it('groups rows per run and keeps their order', () => {
    const m = rosterByRun([
      { run_id: 'a', player_id: '1', full_name: 'A' },
      { run_id: 'b', player_id: '2', full_name: 'B' },
      { run_id: 'a', player_id: '3', full_name: 'C' },
    ]);
    expect(m.get('a')?.map((r) => r.full_name)).toEqual(['A', 'C']);
    expect(m.get('b')).toHaveLength(1);
  });
});
