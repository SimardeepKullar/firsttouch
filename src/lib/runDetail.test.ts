import { describe, expect, it } from 'vitest';
import { longDate, positionCounts, positionTag, rsvpPanelKind, rsvpPanelText, runKicker } from './runDetail';

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
  it('shows "managing" for a manager, open or locked', () => {
    expect(rsvpPanelKind('manager', false)).toBe('managing');
    expect(rsvpPanelKind('manager', true)).toBe('managing');
  });
  it('shows the toggle for a player while open', () => {
    expect(rsvpPanelKind('player', false)).toBe('open');
  });
  it('shows the locked panel for a player after the lock', () => {
    expect(rsvpPanelKind('player', true)).toBe('locked');
  });
});

describe('rsvpPanelText', () => {
  it('says "You’re in" with a Change button when going', () => {
    expect(rsvpPanelText(true)).toEqual({ title: 'You’re in', action: 'Change' });
  });
  it('says "You’re not going" with an I’m in button when not', () => {
    expect(rsvpPanelText(false)).toEqual({ title: 'You’re not going', action: 'I’m in' });
  });
});

describe('runKicker and longDate', () => {
  it('builds the header kicker from the weekday and season type', () => {
    expect(runKicker('2027-02-14', 'indoor')).toBe('SUNDAY RUN · INDOOR');
    expect(runKicker('2027-02-13', 'outdoor')).toBe('SATURDAY RUN · OUTDOOR');
  });
  it('writes the long date', () => {
    expect(longDate('2027-02-14')).toBe('Sunday, Feb 14');
  });
});
