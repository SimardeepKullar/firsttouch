import { describe, expect, it } from 'vitest';
import { themeAfterSignIn, validateName } from './settings';

describe('validateName', () => {
  it('accepts a normal name and trims it', () => {
    expect(validateName('  Sam Okafor  ')).toEqual({ ok: true, name: 'Sam Okafor' });
  });

  it('rejects an empty name', () => {
    expect(validateName('')).toEqual({ ok: false, message: 'Enter your name.' });
  });

  it('rejects a name that is only spaces', () => {
    expect(validateName('   ')).toEqual({ ok: false, message: 'Enter your name.' });
  });
});

describe('themeAfterSignIn', () => {
  it('uses the saved choice when there is one, even if the device differs', () => {
    expect(themeAfterSignIn('dark', 'light')).toBe('dark');
    expect(themeAfterSignIn('light', 'dark')).toBe('light');
    expect(themeAfterSignIn('system', 'dark')).toBe('system');
  });

  it('keeps the device choice when nothing is saved yet', () => {
    expect(themeAfterSignIn(null, 'dark')).toBe('dark');
    expect(themeAfterSignIn(undefined, 'system')).toBe('system');
  });

  it('ignores a saved value that is not a real mode', () => {
    expect(themeAfterSignIn('purple', 'dark')).toBe('dark');
  });
});
