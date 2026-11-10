// Bits shared by the input components.
import type { KeyboardEvent } from 'react';
import { isSpaceKey } from '../lib/inputs';

/** Visible keyboard-focus ring. `web:` = only on web; `focus-visible` = only for keyboard focus, not clicks. */
export const FOCUS_RING = 'web:focus-visible:ring-2 web:focus-visible:ring-brand web:focus-visible:ring-offset-2 web:focus-visible:ring-offset-bg';

/** Dimmed look for disabled controls (the mockups use 0.4-0.45). */
export const DISABLED_LOOK = 'opacity-[0.45]';

/** Makes Space press a switch or radio on web. React Native Web only does that for role="button"
 *  (Enter already works for every role). Web only: other platforms never call this. */
export function spaceToPress(onPress: () => void, disabled?: boolean) {
  return (e: KeyboardEvent) => {
    if (disabled || !isSpaceKey(e.key)) return;
    e.preventDefault(); // stop the page scrolling
    onPress();
  };
}
