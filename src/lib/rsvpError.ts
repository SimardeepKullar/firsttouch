// Turns whatever went wrong while saving an RSVP into one short sentence for the player.
// Plain function (no React, no network) so it can be tested.

export const MSG_CLOSED = 'RSVPs for this run have closed.';
export const MSG_OFFLINE = 'Couldn’t save. Check your connection and try again.';
export const MSG_OTHER = 'Couldn’t save your RSVP. Please try again.';

/** Postgres code 42501 is "insufficient_privilege": what row-level security raises when a policy
 *  says no. For rsvps that means the run is locked or not open, or the profile can't play. */
const RLS_REFUSED = '42501';

/** supabase-js returns database errors as an object with `code` and `message`; a request that never
 *  reached the server (offline, DNS, CORS) arrives as a "Failed to fetch"-style message with no code. */
export function rsvpErrorMessage(error: unknown): string {
  if (typeof error !== 'object' || error === null) return MSG_OTHER;
  const { code, message } = error as { code?: unknown; message?: unknown };
  if (code === RLS_REFUSED) return MSG_CLOSED;
  if (typeof message === 'string' && /failed to fetch|network|load failed|fetch failed/i.test(message)) return MSG_OFFLINE;
  return MSG_OTHER;
}
