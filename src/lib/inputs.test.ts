import { describe, expect, it } from 'vitest';
import { isSpaceKey, isStarFilled, passwordToggleLabel, setStarsLabel, STAR_VALUES } from './inputs';

describe('setStarsLabel', () => {
  it('reads "Set N stars", singular for 1', () => {
    expect(setStarsLabel(1)).toBe('Set 1 star');
    expect(setStarsLabel(2)).toBe('Set 2 stars');
    expect(setStarsLabel(5)).toBe('Set 5 stars');
  });
});

describe('STAR_VALUES', () => {
  it('is one button per star, 1 to 5', () => {
    expect(STAR_VALUES).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('isStarFilled', () => {
  it('fills every star up to the rating', () => {
    expect([1, 2, 3, 4, 5].map((s) => isStarFilled(s, 3))).toEqual([true, true, true, false, false]);
  });
  it('fills nothing at 0 and everything at 5 or more', () => {
    expect(STAR_VALUES.some((s) => isStarFilled(s, 0))).toBe(false);
    expect(STAR_VALUES.every((s) => isStarFilled(s, 9))).toBe(true);
  });
});

describe('passwordToggleLabel', () => {
  it('names the action the button will do', () => {
    expect(passwordToggleLabel(false)).toBe('Show password');
    expect(passwordToggleLabel(true)).toBe('Hide password');
  });
});

describe('isSpaceKey', () => {
  it('recognises Space only', () => {
    expect(isSpaceKey(' ')).toBe(true);
    expect(isSpaceKey('Spacebar')).toBe(true);
    expect(isSpaceKey('Enter')).toBe(false);
    expect(isSpaceKey('a')).toBe(false);
  });
});
