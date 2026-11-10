// The privacy policy text. This file is the ONE copy: the /privacy page (src/app/privacy.tsx)
// draws it, and docs/privacy.md only points here. To change the policy, edit this file.
//
// The text is plain data (headings, paragraphs, lists, tables) so the page can lay it out with
// the app's own components. Inline pieces: a plain string, { b } for bold, { mailto } for an email link.

export type Span = string | { b: string } | { mailto: string };
export type Block =
  | { type: 'h2'; text: string }
  | { type: 'p'; spans: Span[] }
  | { type: 'ul'; items: Span[][] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export const PRIVACY_TITLE = 'FirstTouch — Privacy Policy';
export const CONTACT_EMAIL = 'simardeepk7@gmail.com';

export const PRIVACY_BLOCKS: Block[] = [
  // T-66 fills in the date. Until then the placeholder stays visible.
  { type: 'p', spans: [{ b: 'Effective date:' }, ' [date]'] },
  {
    type: 'p',
    spans: [
      'FirstTouch is a small app run by Simardeep Kullar for a recreational soccer group in Brampton, Ontario. It lets members sign in, say whether they are coming to weekend and holiday morning runs, and see the teams for each run. This policy explains what information the app keeps, who can see it, and how to have it deleted.',
    ],
  },
  { type: 'p', spans: [{ b: 'In short:' }] },
  {
    type: 'ul',
    items: [
      ['We collect only what the app needs to organize runs: your name, email, RSVPs, team placements, and a few details admins set.'],
      ['Your skill rating and payment status are visible only to the group’s admins.'],
      ['We do not sell your information, show ads, or use tracking or analytics tools.'],
      ['You can delete your account at any time from Settings.'],
    ],
  },

  { type: 'h2', text: 'What we collect and why' },
  {
    type: 'table',
    headers: ['Information', 'Where it comes from', 'Why we keep it'],
    rows: [
      [
        'Name and email address',
        'Your Google account when you sign in with Google, or what you type when you create an account with email and password',
        'To create your account, sign you in, and show your name on RSVP lists and teams',
      ],
      [
        'RSVPs and when you made them',
        'You, when you tap “I’m in” or change your answer',
        'To know who is coming and to mark same-day RSVPs as “Morning of”',
      ],
      [
        'Team placements',
        'Created by the app’s team generator, and sometimes adjusted by an admin',
        'To show which team you are on',
      ],
      ['Skill rating (1 to 5) and position (attack or defend)', 'Set by admins', 'To build balanced teams'],
      [
        'Season pass status: paid or not, amount, how you paid (for example e-transfer or cash), and which admin recorded it',
        'Recorded by an admin',
        'To track who has paid for the season. We never collect card or bank details',
      ],
      [
        'Notification subscription',
        'Your browser, if you turn on notifications',
        'To send you reminders and “Teams are up” messages',
      ],
      [
        'Basic technical logs, such as IP address and request times',
        'Collected automatically by our hosting and database providers',
        'To keep the service running and secure',
      ],
    ],
  },
  {
    type: 'p',
    spans: [
      'We do not ask for your phone number, address, date of birth, or location, and the app does not track you across other websites. If you sign in with email and password, Supabase stores your password only in scrambled (hashed) form; nobody running the app can see it.',
    ],
  },

  { type: 'h2', text: 'Who can see your information' },
  {
    type: 'table',
    headers: ['Information', 'Other players', 'Admins'],
    rows: [
      ['Your name and position', 'Yes', 'Yes'],
      ['Whether you are going to a run', 'Yes', 'Yes'],
      ['Your team', 'Yes, once teams are published', 'Yes'],
      ['“Morning of” flag', 'Yes', 'Yes'],
      ['Your email address', 'No', 'Yes'],
      ['Your skill rating', 'No (you cannot see your own either)', 'Yes'],
      ['Your season pass status', 'No', 'Yes'],
    ],
  },
  {
    type: 'p',
    spans: [
      'Admins are a small number of group members chosen to run the group. Simardeep Kullar, who runs the app, can also access the database to maintain it. We do not share your information with anyone outside the group except the service providers listed below, or if the law requires it.',
    ],
  },

  { type: 'h2', text: 'Services we use, storage and retention' },
  { type: 'p', spans: ['The app relies on a few outside services. Each one handles only the information it needs to do its job.'] },
  {
    type: 'table',
    headers: ['Service', 'What it does for the app', 'Information it handles'],
    rows: [
      ['Supabase', 'Database, sign-in and server functions', 'All account and app data listed above'],
      ['Cloudflare Pages', 'Hosts the app’s web pages', 'Technical logs such as IP address'],
      ['Google', '“Sign in with Google”', 'Your Google name and email, only if you choose Google sign-in'],
      ['GitHub', 'Stores private weekly backups of the database', 'A copy of the database'],
      [
        'Your browser’s push service (Apple, Google or Mozilla)',
        'Delivers notifications',
        'Notification text and your browser’s subscription address',
      ],
      [
        'Resend',
        'Sends account confirmation and password-reset emails',
        'Your email address, only if you use email sign-in (not available yet; sign-in is Google only for now)',
      ],
    ],
  },
  {
    type: 'p',
    spans: [
      { b: 'Where it is stored:' },
      ' the database is hosted by Supabase in Canada. Some of the other services listed above may process data outside Canada.',
    ],
  },
  {
    type: 'p',
    spans: [
      { b: 'How long we keep it:' },
      ' your information stays while your account is active. When you delete your account, your profile, RSVPs, team placements, season pass records and notification subscriptions are deleted right away. Copies in backups are removed as old backups are replaced; we keep the last 8 weekly backups, so this takes up to 8 weeks.',
    ],
  },

  { type: 'h2', text: 'Your choices' },
  {
    type: 'ul',
    items: [
      [{ b: 'Change your name:' }, ' in Settings.'],
      [{ b: 'Turn notifications off:' }, ' in Settings, or in your phone or browser settings.'],
      [
        { b: 'See or correct your information:' },
        ' ask an admin or email us; we will tell you what we hold about you, including your skill rating if you ask.',
      ],
      [{ b: 'Delete your account:' }, ' tap “Delete account” in Settings, or email us and we will do it for you.'],
    ],
  },

  { type: 'h2', text: 'Changes to this policy' },
  {
    type: 'p',
    spans: ['If we change this policy, we will update the effective date at the top and tell members in the app before the change applies.'],
  },

  { type: 'h2', text: 'Contact' },
  { type: 'p', spans: ['Questions or requests: Simardeep Kullar, ', { mailto: CONTACT_EMAIL }, '.'] },
];

/** The link a `{ mailto }` span opens. */
export function mailtoHref(email: string): `mailto:${string}` {
  return `mailto:${email}`;
}

/** All the plain text of a span list (used by the tests). */
export function spanText(spans: Span[]): string {
  return spans.map((s) => (typeof s === 'string' ? s : 'b' in s ? s.b : s.mailto)).join('');
}
