import { describe, expect, it } from 'vitest';
import { parseAuthError, stripAuthErrorFromUrl } from './authError';

describe('parseAuthError', () => {
  it('returns null for a normal URL', () => {
    expect(parseAuthError('http://localhost:8081/')).toBeNull();
    expect(parseAuthError('http://localhost:8081/?code=abc123')).toBeNull();
  });

  it('returns null for something that is not a URL', () => {
    expect(parseAuthError('not a url')).toBeNull();
  });

  it('shows a friendly "cancelled" message for access_denied in the query', () => {
    const msg = parseAuthError(
      'http://localhost:8081/?error=access_denied&error_code=bad_oauth_callback&error_description=User+cancelled'
    );
    expect(msg).toMatch(/cancelled/i);
  });

  it('also reads the error from the hash', () => {
    const msg = parseAuthError('http://localhost:8081/#error=access_denied&error_description=nope');
    expect(msg).toMatch(/cancelled/i);
  });

  it('uses a generic message for any other error', () => {
    expect(parseAuthError('http://localhost:8081/?error=server_error')).toBe(
      'Sign-in failed. Please try again.'
    );
  });

  it('treats an error_code on its own as an error', () => {
    expect(parseAuthError('http://localhost:8081/?error_code=unexpected_failure')).toBe(
      'Sign-in failed. Please try again.'
    );
  });
});

describe('stripAuthErrorFromUrl', () => {
  it('removes the error params and hash but keeps the path and other params', () => {
    expect(
      stripAuthErrorFromUrl('http://localhost:8081/sign-in?error=access_denied&error_code=x&error_description=y&foo=1#error=access_denied')
    ).toBe('/sign-in?foo=1');
  });
});
