// Light / dark / system theme switch. The Settings control that calls setThemeMode() is T-20.
//
// How it works:
//  - On web, global.css reads a class on <html>: `.dark`, `.system`, or none (light).
//    public/index.html sets that class from localStorage before the first paint (no flash);
//    this module keeps it in sync afterwards.
//  - NativeWind's colorScheme is told the mode too, so `dark:` classes and useColorScheme() agree.
//  - The choice is saved with AsyncStorage (localStorage on web).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme, useColorScheme } from 'nativewind';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { DEFAULT_MODE, htmlClassesFor, loadMode, resolveScheme, saveMode, type ThemeMode } from './themeMode';

export type { ThemeMode } from './themeMode';

let currentMode: ThemeMode = DEFAULT_MODE;
const listeners = new Set<() => void>();

function applyMode(mode: ThemeMode) {
  // NativeWind first: on web its set() adds/removes `.dark` itself ...
  colorScheme.set(mode);
  // ... then we make sure `<html>` has exactly the class global.css wants (it can't express `.system`).
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const classes = document.documentElement.classList;
    classes.remove('dark', 'system');
    classes.add(...htmlClassesFor(mode));
  }
  currentMode = mode;
  listeners.forEach((listener) => listener());
}

/** Reads the saved choice and applies it. Call once when the app starts. */
export async function initTheme(): Promise<ThemeMode> {
  const mode = await loadMode(AsyncStorage);
  applyMode(mode);
  return mode;
}

/** Switches the theme now and remembers it on this device. */
export async function setThemeMode(mode: ThemeMode): Promise<void> {
  applyMode(mode);
  await saveMode(AsyncStorage, mode);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The current mode, the colours actually showing, and a setter. Re-renders when either changes. */
export function useTheme() {
  const mode = useSyncExternalStore(subscribe, () => currentMode, () => DEFAULT_MODE);
  const { colorScheme: nativewindScheme } = useColorScheme();

  // useColorScheme() already reflects the mode we set, or the phone when mode is 'system'
  // (it updates live when the OS setting changes).
  const scheme = resolveScheme(mode, nativewindScheme === 'dark' ? 'dark' : 'light');
  return { mode, scheme, setMode: setThemeMode };
}
