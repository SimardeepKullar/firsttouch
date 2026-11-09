// The pure (no React, no browser) part of theming: which modes exist, which one applies,
// and how the choice is saved and loaded. Kept separate from theme.ts so it can be unit-tested.

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

/** Light is the default (docs/design/README.md › Global rules). */
export const DEFAULT_MODE: ThemeMode = 'light';

/** localStorage key on web. public/index.html reads the same key before first paint. */
export const THEME_STORAGE_KEY = 'firsttouch.theme';

/** The bit of AsyncStorage we use; lets tests pass in a fake. */
export type KeyValueStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

/** Turns whatever was stored into a valid mode; anything unknown falls back to the default. */
export function parseMode(raw: unknown): ThemeMode {
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : DEFAULT_MODE;
}

/** Which colours actually show: system follows the phone, the other two are fixed. */
export function resolveScheme(mode: ThemeMode, systemScheme: ColorScheme): ColorScheme {
  return mode === 'system' ? systemScheme : mode;
}

/** The class(es) global.css expects on <html>: `.dark`, `.system`, or none for light. */
export function htmlClassesFor(mode: ThemeMode): string[] {
  if (mode === 'dark') return ['dark'];
  if (mode === 'system') return ['system'];
  return [];
}

export async function loadMode(storage: KeyValueStorage): Promise<ThemeMode> {
  try {
    return parseMode(await storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_MODE;
  }
}

export async function saveMode(storage: KeyValueStorage, mode: ThemeMode): Promise<void> {
  try {
    await storage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Not being able to remember the choice shouldn't break the app; it just won't persist.
  }
}
