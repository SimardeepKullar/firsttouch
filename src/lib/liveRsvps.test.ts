import { describe, expect, it, vi } from 'vitest';
import { concernsRuns, createCoalescer, eventRunId } from './liveRsvps';

describe('eventRunId', () => {
  it('reads run_id from the new row (insert/update)', () => {
    expect(eventRunId({ new: { run_id: 'a', player_id: 'p' }, old: {} })).toBe('a');
  });
  it('reads run_id from the old row (delete)', () => {
    expect(eventRunId({ new: {}, old: { run_id: 'b', player_id: 'p' } })).toBe('b');
  });
  it('is null when the event names no run', () => {
    expect(eventRunId({ new: {}, old: {} })).toBeNull();
    expect(eventRunId({})).toBeNull();
  });
});

describe('concernsRuns', () => {
  it('is true for a run on screen', () => {
    expect(concernsRuns({ new: { run_id: 'a' } }, ['a', 'b'])).toBe(true);
  });
  it('is false for a run not on screen', () => {
    expect(concernsRuns({ new: { run_id: 'z' } }, ['a', 'b'])).toBe(false);
  });
  it('is false when nothing is on screen', () => {
    expect(concernsRuns({ new: { run_id: 'a' } }, [])).toBe(false);
  });
  it('is true when the event names no run (better a spare refetch than a missed update)', () => {
    expect(concernsRuns({ new: {}, old: {} }, ['a'])).toBe(true);
  });
});

describe('createCoalescer', () => {
  it('turns a burst of triggers into one action', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const c = createCoalescer(action, 300);
    for (let i = 0; i < 20; i++) c.trigger();
    expect(action).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(action).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('does not push the action back when more triggers arrive (bounded delay)', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const c = createCoalescer(action, 300);
    c.trigger();
    vi.advanceTimersByTime(200);
    c.trigger();
    vi.advanceTimersByTime(100);
    expect(action).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('runs again for a later burst', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const c = createCoalescer(action, 300);
    c.trigger();
    vi.advanceTimersByTime(300);
    c.trigger();
    vi.advanceTimersByTime(300);
    expect(action).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('cancel drops a waiting action', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const c = createCoalescer(action, 300);
    c.trigger();
    c.cancel();
    vi.advanceTimersByTime(1000);
    expect(action).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
