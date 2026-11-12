import { describe, expect, it } from 'vitest';
import { applyRsvpToDetail, findMyTeam, longDate, positionCounts, positionTag, rosterExtras, rosterListNote, rsvpPanelKind, rsvpPanelText, runChipKind, runKicker, teamSummary } from './runDetail';
import type { RunDetailData } from './useRunDetail';

describe('positionCounts', () => {
  it('counts attackers and defenders', () => {
    const rows = [{ position: 'attack' }, { position: 'defend' }, { position: 'attack' }] as const;
    expect(positionCounts(rows)).toEqual({ attackers: 2, defenders: 1 });
  });
  it('is zero for an empty list', () => {
    expect(positionCounts([])).toEqual({ attackers: 0, defenders: 0 });
  });
});

describe('positionTag', () => {
  it('turns the database word into the tag text', () => {
    expect(positionTag('attack')).toBe('ATT');
    expect(positionTag('defend')).toBe('DEF');
  });
});

describe('rsvpPanelKind', () => {
  it('shows "managing" for a manager, whatever else is true', () => {
    expect(rsvpPanelKind('manager', false, false)).toBe('managing');
    expect(rsvpPanelKind('manager', true, true)).toBe('managing');
  });
  it('shows the toggle for a player while open', () => {
    expect(rsvpPanelKind('player', false, false)).toBe('open');
  });
  it('shows the team panel after the lock when the player has a team', () => {
    expect(rsvpPanelKind('player', true, true)).toBe('team');
  });
  it('shows the Locked pill after the lock when there is no team', () => {
    expect(rsvpPanelKind('player', true, false)).toBe('locked');
  });
});

describe('rsvpPanelText', () => {
  it('says "You’re in" on the status line and on the pill when going', () => {
    expect(rsvpPanelText(true)).toEqual({ title: 'You’re in', action: 'You’re in' });
  });
  it('says "You’re not going" with an "I’m in" pill when not', () => {
    expect(rsvpPanelText(false)).toEqual({ title: 'You’re not going', action: 'I’m in' });
  });
});

describe('runKicker and longDate', () => {
  it('builds the kicker from the season type and the run’s year', () => {
    expect(runKicker('2027-02-14', 'indoor')).toBe('INDOOR 2027');
    expect(runKicker('2026-09-13', 'outdoor')).toBe('OUTDOOR 2026');
  });
  it('writes the long date', () => {
    expect(longDate('2027-02-14')).toBe('Sunday, Feb 14');
  });
});

describe('runChipKind', () => {
  it('is open while the run is open and the lock time has not passed', () => {
    expect(runChipKind('open', false)).toBe('open');
  });
  it('is locked once the lock time passes, even if the lock job has not run yet', () => {
    expect(runChipKind('open', true)).toBe('locked');
  });
  it('is locked for a run the job has locked', () => {
    expect(runChipKind('locked', false)).toBe('locked');
  });
  it('follows published and cancelled whatever the clock says', () => {
    expect(runChipKind('published', true)).toBe('published');
    expect(runChipKind('published', false)).toBe('published');
    expect(runChipKind('cancelled', false)).toBe('cancelled');
    expect(runChipKind('cancelled', true)).toBe('cancelled');
  });
});

describe('teamSummary', () => {
  it('names the team and gives the player count and the ATT/DEF split', () => {
    const positions = ['attack', 'attack', 'attack', 'defend', 'defend', 'defend', 'defend'] as const;
    expect(teamSummary('blue', positions)).toEqual({ title: 'You’re on Blue', subtitle: '7 players · ATT/DEF 3:4' });
  });
  it('says "1 player" for a team of one', () => {
    expect(teamSummary('red', ['defend'])).toEqual({ title: 'You’re on Red', subtitle: '1 player · ATT/DEF 0:1' });
  });
});

describe('findMyTeam', () => {
  const roster = [
    { playerId: 'a', position: 'attack' as const },
    { playerId: 'b', position: 'defend' as const },
    { playerId: 'c', position: 'defend' as const },
  ];
  const assignments = [
    { player_id: 'a', team: 'blue' as const },
    { player_id: 'b', team: 'blue' as const },
    { player_id: 'c', team: 'red' as const },
  ];

  it('gives my team colour and the positions of everyone on that team', () => {
    expect(findMyTeam('a', assignments, roster)).toEqual({ team: 'blue', positions: ['attack', 'defend'] });
  });
  it('is null when I have no team (not going, or teams not published yet)', () => {
    expect(findMyTeam('z', assignments, roster)).toBeNull();
    expect(findMyTeam('a', [], roster)).toBeNull();
  });
  it('is null when nobody is signed in', () => {
    expect(findMyTeam(undefined, assignments, roster)).toBeNull();
  });
});

describe('applyRsvpToDetail', () => {
  const me = { id: 'me', name: 'Me', position: 'defend' as const };
  const ann = { playerId: 'a', name: 'Ann', position: 'attack' as const, morningOf: false };
  const base: RunDetailData = {
    id: 'r1',
    runDate: '2027-02-14',
    startTime: '06:30:00',
    location: '7855 Finch Ave W, Brampton, ON',
    lockAt: '2027-02-14T10:30:00Z',
    seasonType: 'indoor',
    status: 'open',
    myTeam: null,
    roster: [ann],
  };

  it('adds me at the end when I say yes', () => {
    const next = applyRsvpToDetail(base, true, me);
    expect(next.roster.map((p) => p.name)).toEqual(['Ann', 'Me']);
    expect(next.roster[1]).toEqual({ playerId: 'me', name: 'Me', position: 'defend', morningOf: false });
  });
  it('does not add me twice', () => {
    const once = applyRsvpToDetail(base, true, me);
    expect(applyRsvpToDetail(once, true, me).roster).toHaveLength(2);
  });
  it('takes me off the list when I say no', () => {
    const once = applyRsvpToDetail(base, true, me);
    expect(applyRsvpToDetail(once, false, me).roster).toEqual([ann]);
  });
  it('changes nothing when I was not on the list and say no', () => {
    expect(applyRsvpToDetail(base, false, me).roster).toEqual([ann]);
  });
  it('never changes the data it was given', () => {
    applyRsvpToDetail(base, true, me);
    expect(base.roster).toEqual([ann]);
  });
});

describe('rosterListNote', () => {
  it('is plain for a player', () => {
    expect(rosterListNote(false)).toBe('In order of RSVP');
  });
  it('adds "admin view" for an admin', () => {
    expect(rosterListNote(true)).toBe('In order of RSVP · admin view');
  });
});

describe('rosterExtras', () => {
  it('gives an admin the stars and the Unpaid badge', () => {
    expect(rosterExtras(true, { stars: 4, flagUnpaid: true })).toEqual({ stars: 4, unpaid: true });
  });
  it('shows no Unpaid badge for an admin when the player has paid', () => {
    expect(rosterExtras(true, { stars: 4, flagUnpaid: false })).toEqual({ stars: 4, unpaid: false });
  });
  it('shows no stars and no badge when the values are not known yet (null)', () => {
    expect(rosterExtras(true, { stars: null, flagUnpaid: null })).toEqual({ stars: null, unpaid: false });
  });
  it('gives a player nothing, even if the values were somehow present', () => {
    expect(rosterExtras(false, { stars: 5, flagUnpaid: true })).toEqual({ stars: null, unpaid: false });
  });
});