// Small pieces of display logic (no React, so they can be unit tested).

/** Initials for an avatar. Same rule as the mockups: the first letter of every word,
 *  or the first two letters when the name is a single word ("Sim" -> "SI"). */
export function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.map((w) => w[0]).join('').toUpperCase();
}

/** How many avatars the stack shows before the "+n" circle (02 Home shows 3). */
export const MAX_STACK_AVATARS = 3;

/** The "n" in "+n": players going who don't get their own avatar. 0 means no "+n" circle. */
export function overflowCount(total: number, shown: number): number {
  return Math.max(0, Math.floor(total) - shown);
}

export const MAX_STARS = 5;

/** A star rating as a whole number from 0 to 5 (anything else is clamped). */
export function clampStars(rating: number): number {
  if (!Number.isFinite(rating)) return 0;
  return Math.min(MAX_STARS, Math.max(0, Math.round(rating)));
}

/** The text read out for a star rating, e.g. "4 of 5 stars". */
export function starLabel(rating: number): string {
  return `${clampStars(rating)} of ${MAX_STARS} stars`;
}
