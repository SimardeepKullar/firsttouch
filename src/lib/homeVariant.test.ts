import { describe, expect, it } from 'vitest';
import { homeVariant, topChip } from './homeVariant';

describe('homeVariant', () => {
  it('gives an admin who does not play (Coach) the manager Home', () => {
    expect(homeVariant(true, false)).toBe('manager');
  });
  it('gives a playing admin (John, Sim) the normal player Home', () => {
    expect(homeVariant(true, true)).toBe('player');
  });
  it('gives a regular player the player Home', () => {
    expect(homeVariant(false, true)).toBe('player');
  });
});

describe('topChip', () => {
  it('shows "admin" for a manager and the pass chip for a player', () => {
    expect(topChip('manager')).toBe('admin');
    expect(topChip('player')).toBe('pass');
  });
});
