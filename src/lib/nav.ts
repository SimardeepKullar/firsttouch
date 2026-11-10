// Navigation rules that aren't styling: which tabs a user gets, and which tab / admin
// sub-tab is highlighted for a given URL path. Plain functions so they can be tested.

export type TabName = 'home' | 'teams' | 'admin' | 'settings';
export type TabDef = { name: TabName; label: string; href: '/' | '/teams' | '/admin' | '/settings' };

/** Players get Home, Teams, Settings. Admins also get Admin (between Teams and Settings),
 *  whether or not they play: a non-playing coach is still an admin. */
export function tabsFor(isAdmin: boolean): TabDef[] {
  return [
    { name: 'home', label: 'Home', href: '/' },
    { name: 'teams', label: 'Teams', href: '/teams' },
    ...(isAdmin ? [{ name: 'admin', label: 'Admin', href: '/admin' } as const] : []),
    { name: 'settings', label: 'Settings', href: '/settings' },
  ];
}

/** "/admin/runs/" -> "/admin/runs"; "" -> "/". */
function clean(pathname: string): string {
  const p = pathname.split(/[?#]/)[0] ?? '';
  return p.length > 1 ? p.replace(/\/+$/, '') || '/' : '/';
}

/** True for /admin and everything under it. */
export function isAdminPath(pathname: string): boolean {
  const p = clean(pathname);
  return p === '/admin' || p.startsWith('/admin/');
}

/** Which bottom tab is highlighted for this path (null for a path with no tab). */
export function activeTab(pathname: string): TabName | null {
  const p = clean(pathname);
  if (p === '/') return 'home';
  if (p === '/teams' || p.startsWith('/teams/')) return 'teams';
  if (isAdminPath(p)) return 'admin';
  if (p === '/settings' || p.startsWith('/settings/')) return 'settings';
  return null;
}

export type AdminSection = 'players' | 'runs' | 'team-builder' | 'passes';
export type AdminSectionDef = {
  key: AdminSection;
  label: string;
  href: '/admin' | '/admin/runs' | '/admin/team-builder' | '/admin/passes';
};

/** The pill row under the Admin header. Admin opens on Players. */
export const ADMIN_SECTIONS: AdminSectionDef[] = [
  { key: 'players', label: 'Players', href: '/admin' },
  { key: 'runs', label: 'Runs', href: '/admin/runs' },
  { key: 'team-builder', label: 'Team builder', href: '/admin/team-builder' },
  { key: 'passes', label: 'Passes', href: '/admin/passes' },
];

/** Which pill is highlighted. Holidays belongs to Runs. */
export function activeAdminSection(pathname: string): AdminSection | null {
  const p = clean(pathname);
  if (p === '/admin') return 'players';
  if (p === '/admin/runs' || p.startsWith('/admin/runs/')) return 'runs';
  if (p === '/admin/team-builder' || p.startsWith('/admin/team-builder/')) return 'team-builder';
  if (p === '/admin/passes' || p.startsWith('/admin/passes/')) return 'passes';
  return null;
}
