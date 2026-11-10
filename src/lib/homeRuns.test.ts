import { describe, expect, it } from 'vitest';
import { applyRsvp, holidayNamesByDate, rosterByRun, visibleRuns, type HomeRun } from './homeRuns';

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

describe('applyRsvp', () => {
  const me = { id: 'me', name: 'Me Player' };
  const base = (over: Partial<HomeRun>): { runs: HomeRun[] } => ({
    runs: [{ ...run('2026-11-14'), id: 'r1', ...over }, { ...run('2026-11-21'), id: 'r2' }],
  });

  it('yes: count +1, flag on, my name joins the stack when everyone fits', () => {
    const out = applyRsvp(base({ goingNames: ['A', 'B'], goingCount: 2 }), 'r1', true, me);
    expect(out.runs[0]).toMatchObject({ iAmGoing: true, goingCount: 3, goingNames: ['A', 'B', 'Me Player'] });
  });
  it('yes on a full stack: only the count grows', () => {
    const out = applyRsvp(base({ goingNames: ['A', 'B', 'C'], goingCount: 20 }), 'r1', true, me);
    expect(out.runs[0]).toMatchObject({ goingCount: 21, goingNames: ['A', 'B', 'C'] });
  });
  it('yes when some going players are hidden: name is not added out of order', () => {
    const out = applyRsvp(base({ goingNames: ['A'], goingCount: 5 }), 'r1', true, me);
    expect(out.runs[0].goingNames).toEqual(['A']);
  });
  it('no: count -1, flag off, my name leaves the stack', () => {
    const out = applyRsvp(base({ iAmGoing: true, goingNames: ['A', 'Me Player', 'C'], goingCount: 20 }), 'r1', false, me);
    expect(out.runs[0]).toMatchObject({ iAmGoing: false, goingCount: 19, goingNames: ['A', 'C'] });
  });
  it('no when I am not in the first names: names stay, count drops', () => {
    const out = applyRsvp(base({ iAmGoing: true, goingNames: ['A', 'B', 'C'], goingCount: 20 }), 'r1', false, me);
    expect(out.runs[0]).toMatchObject({ goingCount: 19, goingNames: ['A', 'B', 'C'] });
  });
  it('same answer twice changes nothing', () => {
    const data = base({ iAmGoing: true, goingCount: 4 });
    expect(applyRsvp(data, 'r1', true, me).runs[0]).toBe(data.runs[0]);
  });
  it('touches only the named run and never changes the input', () => {
    const data = base({ goingCount: 3 });
    const out = applyRsvp(data, 'r1', true, me);
    expect(out.runs[1]).toBe(data.runs[1]);
    expect(data.runs[0].goingCount).toBe(3);
  });
});
