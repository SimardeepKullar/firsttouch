import { describe, expect, it } from 'vitest';
import { MSG_CLOSED, MSG_OFFLINE, MSG_OTHER, rsvpErrorMessage } from './rsvpError';

describe('rsvpErrorMessage', () => {
  it('maps an RLS refusal (42501) to the closed message, not the raw error', () => {
    const raw = { code: '42501', message: 'new row violates row-level security policy for table "rsvps"' };
    expect(rsvpErrorMessage(raw)).toBe(MSG_CLOSED);
  });
  it('maps a request that never arrived to the connection message', () => {
    expect(rsvpErrorMessage(new TypeError('Failed to fetch'))).toBe(MSG_OFFLINE);
    expect(rsvpErrorMessage({ message: 'Network request failed' })).toBe(MSG_OFFLINE);
  });
  it('falls back to a generic message for anything else, never the raw text', () => {
    expect(rsvpErrorMessage({ code: '23503', message: 'foreign key violation' })).toBe(MSG_OTHER);
    expect(rsvpErrorMessage('boom')).toBe(MSG_OTHER);
    expect(rsvpErrorMessage(null)).toBe(MSG_OTHER);
  });
});
