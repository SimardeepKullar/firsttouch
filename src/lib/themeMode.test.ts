import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MODE,
  THEME_STORAGE_KEY,
  htmlClassesFor,
  loadMode,
  parseMode,
  resolveScheme,
  saveMode,
  type KeyValueStorage,
} from './themeMode';

function fakeStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: async (key) => data[key] ?? null,
    setItem: async (key, value) => {
      data[key] = value;
    },
  };
}

describe('parseMode', () => {
  it('accepts the three modes', () => {
    expect(parseMode('light')).toBe('light');
    expect(parseMode('dark')).toBe('dark');
    expect(parseMode('system')).toBe('system');
  });

  it('falls back to light for anything else', () => {
    expect(DEFAULT_MODE).toBe('light');
    for (const bad of [null, undefined, '', 'Dark', 'blue', 1, {}]) {
      expect(parseMode(bad)).toBe('light');
    }
  });
});

describe('resolveScheme', () => {
  it('light and dark ignore the phone setting', () => {
    expect(resolveScheme('light', 'dark')).toBe('light');
    expect(resolveScheme('dark', 'light')).toBe('dark');
  });

  it('system follows the phone setting', () => {
    expect(resolveScheme('system', 'light')).toBe('light');
    expect(resolveScheme('system', 'dark')).toBe('dark');
  });
});

describe('htmlClassesFor', () => {
  it('maps each mode to the class global.css expects', () => {
    expect(htmlClassesFor('light')).toEqual([]);
    expect(htmlClassesFor('dark')).toEqual(['dark']);
    expect(htmlClassesFor('system')).toEqual(['system']);
  });
});

describe('loadMode / saveMode', () => {
  it('returns the default when nothing is saved', async () => {
    expect(await loadMode(fakeStorage())).toBe('light');
  });

  it('round-trips each mode', async () => {
    for (const mode of ['light', 'dark', 'system'] as const) {
      const storage = fakeStorage();
      await saveMode(storage, mode);
      expect(storage.data[THEME_STORAGE_KEY]).toBe(mode);
      expect(await loadMode(storage)).toBe(mode);
    }
  });

  it('ignores a corrupt saved value', async () => {
    expect(await loadMode(fakeStorage({ [THEME_STORAGE_KEY]: 'purple' }))).toBe('light');
  });

  it('does not throw when storage fails', async () => {
    const broken: KeyValueStorage = {
      getItem: async () => {
        throw new Error('nope');
      },
      setItem: async () => {
        throw new Error('nope');
      },
    };
    expect(await loadMode(broken)).toBe('light');
    await expect(saveMode(broken, 'dark')).resolves.toBeUndefined();
  });
});
