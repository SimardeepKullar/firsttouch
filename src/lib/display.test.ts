import { describe, expect, it } from 'vitest';
import { clampStars, initialsFromName, MAX_STACK_AVATARS, overflowCount, starLabel } from './display';

describe('initialsFromName', () => {
  it('uses the first letter of each word', () => {
    expect(initialsFromName('Marco Bellini')).toBe('MB');
    expect(initialsFromName('Mary Jane Watson')).toBe('MJW');
  });
  it('uses the first two letters of a single name', () => {
    expect(initialsFromName('Sim')).toBe('SI');
    expect(initialsFromName('x')).toBe('X');
  });
  it('upper-cases and ignores extra spaces', () => {
    expect(initialsFromName('  daniel   mensah ')).toBe('DM');
  });
  it('handles an empty name', () => {
    expect(initialsFromName('')).toBe('');
    expect(initialsFromName('   ')).toBe('');
  });
});

describe('overflowCount', () => {
  it('is total minus the avatars shown', () => {
    expect(overflowCount(20, MAX_STACK_AVATARS)).toBe(17);
    expect(overflowCount(4, 3)).toBe(1);
  });
  it('is 0 when everyone has an avatar, and never negative', () => {
    expect(overflowCount(3, 3)).toBe(0);
    expect(overflowCount(1, 3)).toBe(0);
    expect(overflowCount(0, 0)).toBe(0);
  });
});

describe('starLabel', () => {
  it('reads "n of 5 stars"', () => {
    expect(starLabel(4)).toBe('4 of 5 stars');
    expect(starLabel(1)).toBe('1 of 5 stars');
  });
  it('clamps to 0-5 and rounds', () => {
    expect(starLabel(9)).toBe('5 of 5 stars');
    expect(starLabel(-2)).toBe('0 of 5 stars');
    expect(starLabel(3.6)).toBe('4 of 5 stars');
    expect(starLabel(Number.NaN)).toBe('0 of 5 stars');
  });
  it('clampStars matches', () => {
    expect(clampStars(6)).toBe(5);
  });
});
