import { describe, expect, it } from 'vitest';
import { banner, buildEnvFile, isLocalUrl, isOurFile, MARKER, parseStatus } from './localSupabase.mjs';

const local = { url: 'http://127.0.0.1:54321', key: 'sb_publishable_demo' };

describe('isLocalUrl', () => {
  it('accepts this computer only', () => {
    expect(isLocalUrl('http://127.0.0.1:54321')).toBe(true);
    expect(isLocalUrl('http://localhost:54321')).toBe(true);
  });
  it('rejects hosted projects, look-alikes and junk', () => {
    expect(isLocalUrl('https://abcdefghijklmnopqrst.supabase.co')).toBe(false);
    expect(isLocalUrl('http://127.0.0.1.evil.com')).toBe(false);
    expect(isLocalUrl('http://localhost@evil.com')).toBe(false);
    expect(isLocalUrl('not a url')).toBe(false);
    expect(isLocalUrl('')).toBe(false);
  });
});

describe('parseStatus', () => {
  it('reads the URL and publishable key', () => {
    const text = JSON.stringify({ API_URL: local.url, PUBLISHABLE_KEY: local.key, SECRET_KEY: 'x' });
    expect(parseStatus(text)).toEqual(local);
  });
  it('returns null when Supabase is not running (no JSON)', () => {
    expect(parseStatus('')).toBeNull();
    expect(parseStatus('supabase start is not running.')).toBeNull();
  });
  it('returns null when the key or URL is missing', () => {
    expect(parseStatus(JSON.stringify({ API_URL: local.url }))).toBeNull();
    expect(parseStatus(JSON.stringify({ PUBLISHABLE_KEY: local.key }))).toBeNull();
  });
  it('returns null if the URL is not local', () => {
    const text = JSON.stringify({ API_URL: 'https://abc.supabase.co', PUBLISHABLE_KEY: local.key });
    expect(parseStatus(text)).toBeNull();
  });
});

describe('buildEnvFile', () => {
  it('writes the marker and both variables', () => {
    const text = buildEnvFile(local);
    expect(text).toContain(`EXPO_PUBLIC_SUPABASE_URL=${local.url}`);
    expect(text).toContain(`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${local.key}`);
    expect(isOurFile(text)).toBe(true);
  });
  it('throws rather than write a non-local URL', () => {
    expect(() => buildEnvFile({ url: 'https://abc.supabase.co', key: 'k' })).toThrow();
  });
});

describe('isOurFile', () => {
  it('is false for a hand-made file', () => {
    expect(isOurFile('EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\n')).toBe(false);
    expect(isOurFile('')).toBe(false);
  });
  it('is true only when the marker is the first line', () => {
    expect(isOurFile(`${MARKER}\nA=1\n`)).toBe(true);
    expect(isOurFile(`A=1\n${MARKER}\n`)).toBe(false);
  });
});

describe('banner', () => {
  it('names the database and the app address', () => {
    const text = banner({ url: local.url, port: 8082 });
    expect(text).toContain(local.url);
    expect(text).toContain('http://localhost:8082');
    expect(text).toContain('LOCAL');
  });
});
