// Google (via Supabase) sends the user back to the app with the problem in the URL,
// for example `?error=access_denied&error_description=...` when they press Cancel.
// The details can be in the query string (?...) or the hash (#...), so we look in both.

const FALLBACK = 'Sign-in failed. Please try again.';

/** Returns a friendly message if the URL carries a sign-in error, otherwise null. */
export function parseAuthError(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const params = new URLSearchParams(parsed.search);
  new URLSearchParams(parsed.hash.replace(/^#/, '')).forEach((value, key) => {
    if (!params.has(key)) params.set(key, value);
  });

  const error = params.get('error');
  const code = params.get('error_code');
  if (!error && !code) return null;

  if (error === 'access_denied') {
    return 'Sign-in was cancelled. Tap “Continue with Google” to try again.';
  }
  return FALLBACK;
}

/** Removes the error from the address bar so a page reload doesn't show it again. */
export function stripAuthErrorFromUrl(url: string): string {
  const parsed = new URL(url);
  for (const key of ['error', 'error_code', 'error_description']) {
    parsed.searchParams.delete(key);
  }
  parsed.hash = '';
  return parsed.pathname + parsed.search;
}
