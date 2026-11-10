// Small pieces of input logic (no React, so they can be unit tested).
import { clampStars, MAX_STARS } from './display';

/** The label on each star button in the editable picker: "Set 1 star", "Set 2 stars", ... */
export function setStarsLabel(n: number): string {
  const stars = clampStars(n);
  return `Set ${stars} ${stars === 1 ? 'star' : 'stars'}`;
}

/** The star numbers the picker shows buttons for: [1, 2, 3, 4, 5]. */
export const STAR_VALUES: readonly number[] = Array.from({ length: MAX_STARS }, (_, i) => i + 1);

/** Whether the star with this number (1-5) is drawn filled when the rating is `value`. */
export function isStarFilled(star: number, value: number): boolean {
  return star <= clampStars(value);
}

/** The label of the eye button: it names what pressing it will do. */
export function passwordToggleLabel(shown: boolean): string {
  return shown ? 'Hide password' : 'Show password';
}

/** On web a Pressable only treats Space as a press for role="button". Switches and radios need
 *  Space too (the WAI-ARIA pattern), so they check keys with this. */
export function isSpaceKey(key: string): boolean {
  return key === ' ' || key === 'Spacebar';
}
