import { describe, expect, it } from 'vitest';
import { activeAdminSection, activeTab, isAdminPath, tabsFor } from './nav';

describe('tabsFor', () => {
  it('gives players Home, Teams, Settings', () => {
    expect(tabsFor(false).map((t) => t.name)).toEqual(['home', 'teams', 'settings']);
  });
  it('gives admins the Admin tab between Teams and Settings', () => {
    expect(tabsFor(true).map((t) => t.name)).toEqual(['home', 'teams', 'admin', 'settings']);
  });
});

describe('activeTab', () => {
  it('maps each path to its tab', () => {
    expect(activeTab('/')).toBe('home');
    expect(activeTab('/teams')).toBe('teams');
    expect(activeTab('/settings')).toBe('settings');
  });
  it('keeps Admin highlighted on every admin page', () => {
    for (const p of ['/admin', '/admin/runs', '/admin/runs/holidays', '/admin/passes']) {
      expect(activeTab(p)).toBe('admin');
    }
  });
  it('ignores a trailing slash and returns null for unknown paths', () => {
    expect(activeTab('/teams/')).toBe('teams');
    expect(activeTab('/swatches')).toBeNull();
  });
});

describe('activeAdminSection', () => {
  it('opens on Players at /admin', () => {
    expect(activeAdminSection('/admin')).toBe('players');
  });
  it('highlights the matching pill', () => {
    expect(activeAdminSection('/admin/runs')).toBe('runs');
    expect(activeAdminSection('/admin/team-builder')).toBe('team-builder');
    expect(activeAdminSection('/admin/passes')).toBe('passes');
  });
  it('treats Holidays as part of Runs', () => {
    expect(activeAdminSection('/admin/runs/holidays')).toBe('runs');
  });
  it('is null outside admin, and does not match look-alike paths', () => {
    expect(activeAdminSection('/teams')).toBeNull();
    expect(activeAdminSection('/administrator')).toBeNull();
  });
});

describe('isAdminPath', () => {
  it('matches /admin and children only', () => {
    expect(isAdminPath('/admin')).toBe(true);
    expect(isAdminPath('/admin/runs/holidays')).toBe(true);
    expect(isAdminPath('/administrator')).toBe(false);
    expect(isAdminPath('/')).toBe(false);
  });
});
