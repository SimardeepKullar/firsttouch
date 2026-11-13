// Small decisions for the Settings screen, as plain functions so they can be tested.
import { parseMode, type ThemeMode } from './themeMode';

export type NameCheck = { ok: true; name: string } | { ok: false; message: string };

/** Trims the typed name and says whether it can be sent to update_my_name. */
export function validateName(raw: string): NameCheck {
  const name = raw.trim();
  if (name === '') return { ok: false, message: 'Enter your name.' };
  return { ok: true, name };
}

/** Which theme to show after sign-in. The saved choice (from the database) wins; with nothing
 *  saved yet, the device's choice stays. A value that isn't a real mode counts as nothing saved. */
export function themeAfterSignIn(saved: string | null | undefined, device: ThemeMode): ThemeMode {
  if (saved === 'light' || saved === 'dark' || saved === 'system') return parseMode(saved);
  return device;
}
