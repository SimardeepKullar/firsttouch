import { describe, expect, it } from 'vitest';

import { balanceTeams } from './index';

describe('balanceTeams', () => {
  it('is not implemented yet', () => {
    expect(() => balanceTeams([], { seasonType: 'indoor', seed: 1 })).toThrow('Not implemented yet');
  });
});
