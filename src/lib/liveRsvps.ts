// Pure helpers for live RSVP updates (no React, no network) so they can be unit tested.

/** The bits of a Supabase Realtime "postgres_changes" event we look at. `new` is the row after an
 *  insert/update; `old` is the row before (for a delete it holds only the primary key columns, and
 *  the primary key of rsvps is (run_id, player_id), so run_id is there either way). */
export type RsvpEvent = {
  new?: Record<string, unknown> | null;
  old?: Record<string, unknown> | null;
};

/** The run an RSVP event is about, or null if the event doesn't say. */
export function eventRunId(event: RsvpEvent): string | null {
  const id = event.new?.run_id ?? event.old?.run_id;
  return typeof id === 'string' ? id : null;
}

/** Does this event change something on screen? True when it is about one of the runs shown.
 *  If the event doesn't name a run we can't rule it out, so it counts (a spare refetch is
 *  harmless; a missed update is not). */
export function concernsRuns(event: RsvpEvent, runIds: readonly string[]): boolean {
  const id = eventRunId(event);
  return id === null || runIds.includes(id);
}

/** Timer functions, injectable so tests don't have to wait. */
export type Timers = {
  set: (fn: () => void, ms: number) => unknown;
  clear: (handle: unknown) => void;
};

const realTimers: Timers = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/** Turns a burst of "something changed" calls into one `action`.
 *  The first `trigger()` starts a timer; more calls before it fires are absorbed (the timer is NOT
 *  restarted), so the action runs at most once per `delayMs` and never later than `delayMs` after
 *  the first call. 20 events in a second therefore cause a handful of refetches at most, not 20. */
export function createCoalescer(action: () => void, delayMs: number, timers: Timers = realTimers) {
  let pending: unknown = null;
  return {
    trigger() {
      if (pending !== null) return;
      pending = timers.set(() => {
        pending = null;
        action();
      }, delayMs);
    },
    /** Drop a waiting call (used when the screen goes away). */
    cancel() {
      if (pending === null) return;
      timers.clear(pending);
      pending = null;
    },
  };
}
