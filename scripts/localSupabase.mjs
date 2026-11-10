// Logic behind `npm run web:local`, kept apart from the script so it can be tested.
// Plain JavaScript (not TypeScript) because Node runs the script directly.

/** First line of the override file. Lets the script tell its own leftover file
 *  (after a crash) from one you made by hand, which it must never delete. */
export const MARKER = '# created by `npm run web:local`; deleted when it exits';

/** The port web:local uses. `npm run web` uses Expo's default, 8081, so the two
 *  apps have separate browser storage (and therefore separate sign-ins). */
export const LOCAL_PORT = 8082;

/** Local means this computer only. This is the guard that stops a non-local URL
 *  (dev, or worse prod) from ever being written into the override file. */
export function isLocalUrl(url) {
  try {
    const { protocol, hostname } = new URL(url);
    return (
      (protocol === 'http:' || protocol === 'https:') &&
      ['127.0.0.1', 'localhost', '[::1]'].includes(hostname)
    );
  } catch {
    return false;
  }
}

/** Read `npx supabase status -o json` output. Returns { url, key } for a running
 *  local stack, or null if the text isn't JSON or lacks a local URL or key. */
export function parseStatus(text) {
  let status;
  try {
    status = JSON.parse(text);
  } catch {
    return null;
  }
  const url = status?.API_URL;
  const key = status?.PUBLISHABLE_KEY;
  if (typeof url !== 'string' || typeof key !== 'string' || !key) return null;
  if (!isLocalUrl(url)) return null;
  return { url, key };
}

/** Contents of .env.development.local for this run. */
export function buildEnvFile({ url, key }) {
  if (!isLocalUrl(url)) throw new Error(`Refusing to write a non-local URL: ${url}`);
  return [
    MARKER,
    `EXPO_PUBLIC_SUPABASE_URL=${url}`,
    `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${key}`,
    '',
  ].join('\n');
}

/** True if the file's text was written by this script. */
export function isOurFile(text) {
  return text.split('\n')[0] === MARKER;
}

/** The message printed once the app is starting. */
export function banner({ url, port }) {
  return [
    '',
    '┌──────────────────────────────────────────────────────────────',
    '│  LOCAL Supabase (seed data), not dev and not prod',
    `│  Database:  ${url}`,
    `│  App:       http://localhost:${port}`,
    '│  Sign in:   paste the snippet from docs/environments.md into the',
    '│             browser console (seed users: john@, sim@, coach@,',
    '│             player01@..player25@example.com, password123)',
    '│  Check:     the app greets seed names ("Hi, Coach"), not your own name',
    '│  Stop:      Ctrl+C removes .env.development.local again',
    '└──────────────────────────────────────────────────────────────',
    '',
  ].join('\n');
}
