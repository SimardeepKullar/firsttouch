# FirstTouch — System Design Spec

Nov 2, 2026 · @Simar

## Overview

FirstTouch v1 is a mobile-first web app, hosted on Cloudflare Pages with Supabase as the whole backend, that lets about 27 players RSVP to Saturday and Sunday morning runs and lets admins publish balanced teams. There is no custom server; all rules live in Postgres and two Supabase functions.

**In scope for v1**

- Open sign-up: anyone with the link signs in with Google. Email and password sign-in (with "Forgot password?") is designed but switched off until a domain and Resend are set up.
- Admins create all of a season's Saturday and Sunday runs, plus long-weekend holiday Mondays, at once, see the full list ahead of time, and can edit the time or address of any run or delete it; players toggle "I'm in".
- RSVPs lock automatically 1 hour before the start time; teams are generated and published at that same moment.
- "Morning of" flag for a yes made on the run's own date (Toronto time).
- Season passes (indoor or outdoor), marked paid by admins; "Unpaid" flag visible to admins only; unpaid players still play.
- Admin-set stars (1 to 5, visible to admins only) and position (attack or defend); new players start at 3 stars, attack. Three admins to start: John and Sim also play; Coach only manages.
- Balanced teams: Blue and Yellow, plus Red when the indoor head count is 19 or more; outdoor is always 2 teams. No player cap or waitlist.
- Team table and field diagram; web push notifications.

**Out of scope for v1:** season join codes, walk-ins and no-show handling, player cap or waitlist, in-app payment, match rotation and scores, App Store and Google Play builds.

**Key decisions**

| Decision | Choice | Reason |
| --- | --- | --- |
| Client | Expo (React Native) web export, TypeScript | Same code becomes the store apps later |
| Hosting | Cloudflare Pages, free plan | Free for commercial use; no bandwidth metering |
| Backend | Supabase: Postgres, Auth, Realtime, Edge Functions, pg\_cron | One managed service; permissions enforced in the database |
| Time zone | All run dates in America/Toronto | Morning-of rule and cron jobs depend on local dates |
| Placeholders | Season "Indoor 2026–27", pass $120 | Real season dates still to be supplied. Locations and start times are real: indoor 7855 Finch Ave W, Brampton at 6:30 AM; outdoor 32 Kennedy Rd N, Brampton at 7:00 AM |

## Architecture

The browser downloads the app from Cloudflare Pages once, then reads and writes directly to Supabase; Supabase is the only place data and rules live, and it sends notifications through each browser's own push service.

&#91;embedded content: system architecture · device, Cloudflare Pages, Supabase, push services\]

Row-level security in Postgres decides what each signed-in user can see and change, so no server sits between the app and the database.

| Component | Technology | Responsibility |
| --- | --- | --- |
| Web app | Expo (React Native for web), Expo Router, TypeScript, NativeWind, TanStack Query, react-native-svg | All screens; RSVP toggle; team table and field diagram; admin tools |
| Service worker + manifest | Plain JS in public/ | Home Screen install; receives and shows push notifications |
| Static hosting | Cloudflare Pages (free plan) | Serves the built app over HTTPS; preview URL per branch |
| Auth | Supabase Auth | Google sign-in and email + password (sign-up, confirmation and password-reset emails); issues the session token used by RLS |
| Database | Supabase Postgres with RLS | All data, permissions, morning-of trigger, roster view with flags |
| Live updates | Supabase Realtime | Pushes RSVP count changes to open screens |
| Server logic | Supabase Edge Functions (Deno) | generate-teams, send-push |
| Schedules | pg\_cron + pg\_net | Lock and publish teams, evening-before reminder, yearly holiday fill |
| Push delivery | Web Push with VAPID keys | Delivers notifications via Apple, Google or Mozilla push services |

## Data model

Seven core tables (plus small holidays and job\_errors tables) hang off two parents: a **season** owns its runs and passes, and a **profile** (one per signed-in user) owns RSVPs, passes, team slots and push subscriptions. Flags are computed in a view, never stored by hand.

| Table | One row per | Belongs to |
| --- | --- | --- |
| profiles | player (linked to the Supabase auth user) | — |
| seasons | indoor or outdoor season | — |
| season\_passes | player per season | seasons, profiles |
| runs | Saturday or Sunday session | seasons |
| rsvps | player per run | runs, profiles |
| team\_assignments | player per run, once teams exist | runs, profiles |
| push\_subscriptions | browser or device a player enabled notifications on | profiles |

### Schema (Postgres, Supabase migration)

```sql
create type user_role   as enum ('player', 'admin');
create type position    as enum ('attack', 'defend');
create type season_type as enum ('indoor', 'outdoor');
create type run_status  as enum ('open', 'locked', 'published', 'cancelled');
create type team_color  as enum ('blue', 'yellow', 'red');

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null,
  email       text not null unique,
  role        user_role not null default 'player',
  plays       boolean not null default true,  -- false for an admin who only manages
  stars       smallint not null default 3 check (stars between 1 and 5),
  position    position not null default 'attack',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table seasons (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                 -- e.g. 'Indoor 2026-27'
  type        season_type not null,
  starts_on   date,                          -- real dates still to be supplied
  ends_on     date,
  default_location   text not null,
  default_start_time time not null,
  pass_price_cents   integer not null default 12000,  -- placeholder $120
  is_current  boolean not null default false
);
create unique index one_current_season on seasons (is_current) where is_current;

-- seed defaults
-- indoor:  '7855 Finch Ave W, Brampton, ON L6T 0B2', 06:30
-- outdoor: '32 Kennedy Rd N, Brampton, ON L6V 1X4',  07:00

create table holidays (                    -- long-weekend Mondays that become runs
  holiday_date date primary key,             -- always a Monday
  name        text not null,                 -- e.g. 'Family Day'
  active       boolean not null default true -- false = an admin switched it off
);

create table season_passes (
  season_id   uuid references seasons on delete cascade,
  player_id   uuid references profiles on delete cascade,
  paid        boolean not null default false,
  amount_cents integer,
  method      text,                          -- 'e-transfer', 'cash', later 'stripe'
  marked_by   uuid references profiles,
  marked_at   timestamptz,
  primary key (season_id, player_id)
);

create table runs (
  id          uuid primary key default gen_random_uuid(),
  season_id   uuid not null references seasons on delete cascade,
  run_date    date not null unique,          -- Toronto local date
  start_time  time not null,                 -- copied from the season, admin can edit
  location    text not null,                 -- copied from the season, admin can edit
  status      run_status not null default 'open',
  team_count_override smallint check (team_count_override in (2, 3)),
  published_at timestamptz
);

create table rsvps (
  run_id      uuid references runs on delete cascade,
  player_id   uuid references profiles on delete cascade,
  going       boolean not null,
  responded_at timestamptz not null default now(),
  morning_of  boolean not null default false, -- set by trigger
  primary key (run_id, player_id)
);

create table team_assignments (
  run_id      uuid references runs on delete cascade,
  player_id   uuid references profiles on delete cascade,
  team        team_color not null,
  slot        smallint not null,             -- order within the team, for the field layout
  primary key (run_id, player_id)
);

create table job_errors (                  -- admin-visible log of failed jobs and pushes
  id          bigint generated always as identity primary key,
  source      text not null,                 -- 'send-push', 'rsvp-reminder', ...
  detail      text,
  created_at  timestamptz not null default now()
);

create table push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references profiles on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now()
);
```

### Lock time and player-facing views

```sql
-- RSVPs close 1 hour before the run's start, Toronto time (DST-safe)
create function run_lock_at(r runs) returns timestamptz
language sql stable as $$
  select ((r.run_date + r.start_time) at time zone 'America/Toronto') - interval '1 hour';
$$;

-- Who is in the group: names and positions only, never stars.
-- Owner-rights view, so players can list others while the profiles table stays admin-only.
create view player_directory as
select id, full_name, position, plays, (id = auth.uid()) as is_me
from profiles
where active;

-- Who is going to a run, with flags. Stars and the unpaid flag are admin-only.
create view run_roster as
select r.run_id, r.player_id, p.full_name, p.position,
       case when is_admin() then p.stars end          as stars,
       r.responded_at,
       r.morning_of                                   as flag_morning_of,
       case when is_admin()
            then not coalesce(sp.paid, false) end     as flag_unpaid
from rsvps r
join runs ru     on ru.id = r.run_id
join profiles p  on p.id = r.player_id
left join season_passes sp
       on sp.season_id = ru.season_id and sp.player_id = r.player_id
where r.going and p.plays;
```

Field positions are not stored: the client draws them from team, position and slot, so a moved player re-lays out automatically.

## Access control

Every table has row-level security switched on, so the browser can talk to Postgres directly and still only see or change what its role allows. Admin checks go through one helper function. The Supabase projects are created with "Automatically expose new tables" turned off and automatic RLS turned on, so the migration grants access explicitly: tables and views to the authenticated role only, nothing to anon. This keeps signed-out visitors away from player\_directory and run\_roster. Any signed-in user can read every rsvps row, including "no" answers, because Realtime only delivers changes on rows the reader can see; the table holds no stars or payment data. service\_role has no table grants yet; the Edge Functions milestone adds the ones generate-teams and send-push need. The column guard trigger lets calls with no signed-in user through (SQL editor, service role, seed), which is how the first admin is set by hand.

```sql
create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;
```

| Table or view | Player can read | Player can write | Admin |
| --- | --- | --- | --- |
| profiles | Nothing directly | Own display name, through update\_my\_name() | Everything, incl. stars, position, role, plays |
| player\_directory (view) | All active players: name, position, plays | — | Same |
| seasons, holidays | All | Nothing | Everything |
| season\_passes | Own pass | Nothing | Everything |
| runs | All | Nothing | Everything |
| rsvps / run\_roster | Everyone going to any run; stars and unpaid flag come back empty | Own row, only while the run is open, before run\_lock\_at (1 hour before start), and if plays = true | Everything, including after lock |
| team\_assignments | Rows for published runs | Nothing | Everything, any status |
| push\_subscriptions | Own | Own (insert, delete) | Read all (for sending) |

**Star ratings are admin-only.** Players never read the profiles table; they see other players through player\_directory and run\_roster, which leave stars out (or return them empty) unless is\_admin() is true. This hides a player's own rating too. Star totals and the fairness bar on team screens show for admins only. Players change their display name through update\_my\_name(), which touches only full\_name, and guard\_profile\_columns() stays as a second check that only admins change role, plays, stars or position.

**Admins.** Start with three admins: John and Sim with plays = true (they RSVP and are placed in teams like anyone else) and Coach with plays = false (manages only, cannot RSVP, never placed in teams). The first admin is set by hand in the Supabase dashboard; after that, admins promote others and switch plays on or off from the Players screen. The holidays table follows the same rule as seasons: everyone reads, only admins add dates or switch them off. John and Sim (Simar's own admin account) both mark season passes as paid; all admins have the same full permissions in the app.

**Unpaid flag is admin-only.** run\_roster returns null for flag\_unpaid unless is\_admin() is true, and players can read only their own season\_passes row, so other players never see who has not paid.

## Server functions and scheduled jobs

Two Edge Functions (TypeScript on Deno), seven database functions (plus the holiday helpers) and three scheduled jobs carry all server-side logic; everything else is direct, permission-checked table access from the browser.

### Edge Functions

| Function | Called by | Does | Returns |
| --- | --- | --- | --- |
| generate-teams | lock-and-publish job (service key) at lock time; admin "Reshuffle" after publishing | Checks the caller is the job or an admin; reads run\_roster and season type; runs balanceTeams(); replaces the run's team\_assignments in one transaction; calls publish\_teams() | Teams with star totals, sizes, attack/defend counts (totals shown to admins only) |
| send-push | Database (pg\_net) or admin | Loads push\_subscriptions for the target players; sends Web Push with VAPID keys; deletes subscriptions the push service reports as gone (HTTP 404 or 410) | Sent and failed counts |

### Database functions and triggers

| Name | Fires on | Does |
| --- | --- | --- |
| generate\_season\_runs(season\_id) | Admin, "Create runs" on a season with dates | Inserts a run for every Saturday and Sunday, plus every active Monday in the holidays table (it first calls fill\_holidays() for each year the season covers), from starts\_on to ends\_on, copying the season's default location and start time; skips dates that already have a run |
| run\_lock\_at(run) | Used by RLS, the lock job and the app | Returns start time minus 1 hour, Toronto time |
| set\_morning\_of() | Before insert or update on rsvps | When going is true, sets morning\_of = (responded\_at in America/Toronto)::date = run\_date; a later "no" clears it |
| publish\_teams(run\_id) | generate-teams | Sets status published and published\_at; sends "Teams are up" the first time, "Teams updated" after a reshuffle |
| update\_my\_name(text) | Player, Settings | Changes the caller's full\_name only |
| guard\_profile\_columns() | Before update on profiles | Blocks changes to role, plays, stars, position by non-admins |
| handle\_new\_user() | After insert on auth.users | Creates the profile row (3 stars, attack, plays). The name comes from the Google profile, or from the full\_name typed on the sign-up form, falling back to the part of the email before the @ |
| my\_plays() | RSVP policies | Returns the caller's plays flag; needed because players cannot read profiles directly |

### Scheduled jobs (pg\_cron)

pg\_cron runs in UTC, so each job is scheduled for both possible offsets or checks Toronto time inside the function. The times below are Toronto time.

| Job | When | Does |
| --- | --- | --- |
| lock-and-publish | Every 5 minutes | For open runs whose run\_lock\_at has passed: sets status locked, then calls generate-teams, which publishes. With fewer than 4 players the run stays locked with no teams and admins get a push |
| evening-reminder | Daily 18:00 | For each run dated tomorrow (Friday for Saturday, Saturday for Sunday, Sunday for a holiday Monday), pushes to playing members with no RSVP for it |
| fill-next-year-holidays | December 1, 06:00 | Calls fill\_holidays(next year) so the coming year's holiday Mondays are listed early |

The database blocks RSVPs at the exact lock time, so the job running up to 5 minutes later never lets a late RSVP slip in.

Runs are not created weekly: an admin creates the whole season's runs up front, then edits or deletes individual runs from the season's run list (see Key flows).

## Key flows

A run moves open → locked → published (or to cancelled at any point). One hour before the start time, a job locks RSVPs, builds teams and publishes them in one step, so players see teams the moment RSVPs close.

&#91;embedded content: weekend run lifecycle · 8 steps, 1 loop\]

Players can RSVP from the moment a run exists until 1 hour before it starts (5:30 AM for indoor, 6:00 AM for outdoor at the default times); a yes on the run's own date still counts but carries the morning-of flag. After publishing, admins can still drag players between teams or reshuffle, and players see the change at once.

### Season run list (admin)

1. Admin creates or opens a season and enters its start and end dates.
2. "Create runs" calls generate\_season\_runs(); every Saturday, Sunday and holiday Monday in range appears with the season's default address and time (indoor 6:30 AM at 7855 Finch Ave W, outdoor 7:00 AM at 32 Kennedy Rd N).
3. The season screen lists every run, past and upcoming, with date, time, address, status and number going.
4. The admin can edit any run's time or address, or delete it. Deleting a run that already has RSVPs asks for confirmation and sends a "run cancelled" push to those players first; RSVPs and teams are removed with the run.
5. Re-running "Create runs" after changing the season's dates adds only the missing dates.

### Long-weekend Mondays

A Monday holiday inside a season becomes a run with the season's usual address and start time; admins can change or delete it like any other run.

**Which Mondays count:** Ontario holidays that always fall on a Monday (Family Day, Victoria Day, Labour Day, Thanksgiving), the Civic Holiday (first Monday of August, a day off for most of Toronto though not a statutory holiday), and any holiday whose observed day moves to a Monday (for example Boxing Day when December 26 is a Saturday). Easter Monday is left out because most people work it.

**How dates get in, every year:** nobody types them. A database function works out each year's holiday Mondays from the rules above, and generate\_season\_runs calls it for every year the season covers before creating runs, so a 2028 season fills in 2028's Mondays on its own. A yearly job on December 1 also fills next year, so admins see upcoming holidays early. Admins can add a one-off date or switch a computed one off (active = false); refilling never brings a switched-off date back, because it only inserts dates that are not already there. Switching it back on is the same toggle (active = true). Turning a date on adds its run straight away if it falls inside a season that already has runs; turning it off deletes that run, with the same confirmation and "run cancelled" push as any run delete when players have already said yes.

```sql
-- nth Monday of a month
create function nth_monday(y int, m int, n int) returns date
language sql immutable as $$
  select make_date(y, m, 1)
         + ((8 - extract(isodow from make_date(y, m, 1))::int) % 7)
         + 7 * (n - 1);
$$;

-- every Ontario holiday that lands on (or is observed on) a Monday in year y
create function ontario_monday_holidays(y int)
returns table (holiday_date date, name text)
language sql immutable as $$
  with fixed(d, label) as (values
    (make_date(y, 1, 1),   'New Year''s Day'),
    (make_date(y, 7, 1),   'Canada Day'),
    (make_date(y, 12, 25), 'Christmas Day'),
    (make_date(y, 12, 26), 'Boxing Day')
  ),
  observed as (
    select case
      when label = 'Christmas Day' and extract(isodow from d) in (6, 7) then make_date(y, 12, 27)
      when label = 'Boxing Day'    and extract(isodow from d) in (6, 7) then make_date(y, 12, 28)
      when extract(isodow from d) = 6 then d + 2   -- Saturday: observed Monday
      when extract(isodow from d) = 7 then d + 1   -- Sunday: observed Monday
      else d end as d, label
    from fixed
  )
  select d, label from observed where extract(isodow from d) = 1
  union all
  select * from (values
    (nth_monday(y, 2, 3),  'Family Day'),
    (make_date(y, 5, 24) - (extract(isodow from make_date(y, 5, 24))::int - 1), 'Victoria Day'),
    (nth_monday(y, 8, 1),  'Civic Holiday'),
    (nth_monday(y, 9, 1),  'Labour Day'),
    (nth_monday(y, 10, 2), 'Thanksgiving')
  ) v(d, label);
$$;

-- add a year's dates without touching ones admins already edited
create function fill_holidays(y int) returns void
language sql as $$
  insert into holidays (holiday_date, name)
  select holiday_date, name from ontario_monday_holidays(y)
  on conflict (holiday_date) do nothing;
$$;
```

| Date | Holiday |
| --- | --- |
| Mon Oct 12, 2026 | Thanksgiving |
| Mon Dec 28, 2026 | Boxing Day (observed; Dec 26 is a Saturday) |
| Mon Feb 15, 2027 | Family Day |
| Mon May 24, 2027 | Victoria Day |
| Mon Aug 2, 2027 | Civic Holiday |
| Mon Sep 6, 2027 | Labour Day |
| Mon Oct 11, 2027 | Thanksgiving |
| Mon Dec 27, 2027 | Christmas Day (observed; Dec 25 is a Saturday) |
| Mon Jan 3, 2028 | New Year's Day (observed; Jan 1 is a Saturday) |
| Mon Feb 21, 2028 | Family Day |
| Mon May 22, 2028 | Victoria Day |
| Mon Jul 3, 2028 | Canada Day (observed; Jul 1 is a Saturday) |
| Mon Aug 7, 2028 | Civic Holiday |
| Mon Sep 4, 2028 | Labour Day |
| Mon Oct 9, 2028 | Thanksgiving |
| Mon Dec 25, 2028 | Christmas Day |

These dates are what the function produces. Check them once against Ontario's official holiday list before launch. A holiday Monday that most of the group won't play on, such as Christmas Day 2028, is switched off by an admin.

### RSVP request, step by step

1. Player taps "I'm in"; the app updates the screen at once.
2. The app upserts its rsvps row (run, player, going = true).
3. RLS allows it only for the player's own row, only while the run is open and before run\_lock\_at, and only if the profile has plays = true.
4. The set\_morning\_of trigger compares the Toronto date of the response with the run date and sets the flag.
5. Realtime broadcasts the change; other open screens update the "going" count.

**Admins and RSVPs.** Playing admins (John, Sim) RSVP like any player: they are in a run's roster and teams only when they said yes, so an admin skipping a run changes nothing. Admin tools work the same whether or not the admin is going. The manage-only admin (Coach, plays = false) sees every run card without the "I'm in" toggle, with the line "You're managing this run" in its place, and is never counted or placed in teams.

### Email and password sign-in

**Status: designed, switched off.** v1 launches with Google sign-in only. The screens below are designed now and built behind the EXPO\_PUBLIC\_EMAIL\_AUTH switch, so turning email sign-in on later needs no new code, only the domain, Resend and the dashboard setting.

1. **Create account:** the player enters name, email and password (at least 8 characters). The app calls supabase.auth.signUp with the name in options.data.full\_name, so handle\_new\_user can use it. Supabase emails a confirmation link; the account works once it is clicked.
2. **Sign in:** email and password through supabase.auth.signInWithPassword. A wrong password and an unknown email show the same message, so the screen never reveals who has an account.
3. **Forgot password:** the player enters their email; the app calls supabase.auth.resetPasswordForEmail with redirectTo set to the app's /reset-password page. The screen always says "If that email has an account, we've sent a link".
4. **Reset password:** the link opens /reset-password signed in for recovery only (the PASSWORD\_RECOVERY auth event). The player types a new password; the app calls supabase.auth.updateUser({ password }) and then goes to Home.
5. **Change password:** in Settings, while signed in, through the same updateUser call.

Google and email accounts with the same address: if someone signs in with Google using an email that already has a confirmed password account, Supabase links both to one user, so there is still one profile. The redirect URL pattern http://localhost:8081/\*\* already covers /reset-password.

### Lock and publish, step by step

1. Every 5 minutes, lock-and-publish looks for open runs whose run\_lock\_at has passed.
2. It sets the run to locked and calls generate-teams with the service key and a random seed.
3. generate-teams reads run\_roster and the season type, runs balanceTeams(), and replaces team\_assignments in one transaction.
4. It calls publish\_teams(), which sets the run to published and sends "Teams are up" to everyone going.
5. Fewer than 4 players: no teams are made, the run stays locked, and admins get a push.
6. After publishing, an admin can drag players between teams (admin-only by RLS) or tap Reshuffle, which reruns generate-teams and sends "Teams updated".

## Team balancing spec

balanceTeams() is a pure TypeScript function in supabase/functions/\_shared/balance.ts, imported by the generate-teams function and checked by Vitest tests; given the same roster and random seed it always returns the same teams.

### Interface

```ts
type Player = { id: string; stars: 1 | 2 | 3 | 4 | 5; position: 'attack' | 'defend' };
type Options = { seasonType: 'indoor' | 'outdoor'; teamCountOverride?: 2 | 3; seed: number };
type Team = { color: 'blue' | 'yellow' | 'red'; players: Player[];
              stars: number; attackers: number; defenders: number };

function balanceTeams(players: Player[], options: Options): Team[];
```

### Rules

| Rule | Value |
| --- | --- |
| Who is included | Every yes RSVP from a profile with plays = true, paid or unpaid, morning-of or not; the admin-only account is never included |
| When it runs | Automatically at lock time (1 hour before start); again when an admin taps Reshuffle |
| Team count, outdoor | Always 2 |
| Team count, indoor | 2 up to 18 players; 3 from 19 |
| Admin override | team\_count\_override on the run wins over both |
| Team sizes | As equal as possible; the remainder goes one each to Blue, then Yellow |
| Player cap | None, and no waitlist; sizes simply grow (40 indoor → 14 / 13 / 13; 27 outdoor → 14 / 13) |
| Fewer than 4 players | No teams; the run stays locked and admins are notified |

### Algorithm

1. Work out team count and target sizes from the rules above.
2. **Snake draft.** Sort defenders by stars, highest first, and deal them in snake order (Blue, Yellow, Red, Red, Yellow, Blue…), skipping full teams. Deal attackers the same way, starting with the team with the lowest star total. Ties in stars are ordered by the seeded random number generator.
3. **Improve by swapping.** Score the split; try every swap of two players on different teams; keep any swap that lowers the score; repeat until no swap helps.
4. Repeat steps 2 and 3 from 20 seeded starting orders and keep the lowest score.
5. Assign slot numbers within each team: defenders first, then attackers, each by stars.

```latex
\text{score} = 3 \cdot \text{range(team stars)} + 2 \cdot \text{range(attackers)} + 10 \cdot \text{range(team size)}
```

Range means the highest team value minus the lowest. The weights are starting values, kept in a config object so they can be tuned after a few weekends.

### Output check

The function asserts before returning: every input player appears exactly once, sizes differ by at most 1, and team count matches the rules. With 27 players and 20 restarts it should run in well under a second; a test measures this.

## Notifications

v1 uses standard Web Push from the installed web app; Android browsers can subscribe directly, while iPhones (iOS 16.4 or later) must add the app to the Home Screen first and open it from there.

### Setup

1. Generate a VAPID key pair once; the public key ships in the client config, the private key is a Supabase secret.
2. The app ships a web manifest (name, icons, start URL, display standalone) and a service worker at the site root that shows incoming pushes and opens the right screen on tap.
3. Settings has an "Enable notifications" button; the permission prompt only runs from that tap, which iOS requires.
4. On success the client saves the subscription (endpoint, p256dh, auth) to push\_subscriptions.
5. On iPhone in a normal Safari tab, the app shows an "Add to Home Screen" banner instead of the button.

### Messages

| Trigger | Who gets it | Text | Opens |
| --- | --- | --- | --- |
| evening-reminder job, 18:00 the evening before each run | Playing members with no RSVP for tomorrow's run | "Run tomorrow at 6:30 AM — are you in? Tap to RSVP." | Home |
| Teams published at lock time | Everyone going to that run | "Teams for Saturday are up — you're on Blue." | Teams |
| Admin reshuffles | Everyone going to that run | "Teams for Saturday were updated — you're now on Yellow." | Teams |
| Fewer than 4 players at lock time | Admins | "Only 3 players for Sunday's run; no teams made." | Run manager |
| Run cancelled or deleted | Everyone with a yes | "Sunday's run is cancelled." | Home |
| Weekly, optional | Players without a paid season pass | "Your Indoor season pass is still unpaid." | Home |
| Admin changes a run's time or address | Everyone with a yes for that run | "Saturday's run moved to 7:00 AM at 32 Kennedy Rd N." | Home |

When the store apps arrive later, send-push gains a second path through the Expo Push Service for native devices; the database side does not change.

## Deployment and environments

One GitHub repo deploys the web app to Cloudflare Pages on every push and the database and functions to Supabase through the Supabase CLI; there are two environments, dev and prod, which fits the Supabase free plan's two-project limit.

| Environment | Web app | Supabase project | Deployed when |
| --- | --- | --- | --- |
| Dev / preview | Cloudflare preview URL per branch | firsttouch-dev (Canada region) | Every push to a non-main branch |
| Prod | firsttouch.pages.dev (free address; a close variant if the name is taken) | firsttouch-prod (Canada region) | Merge to main |

### Repo layout

```text
firsttouch/
  app/                 Expo Router screens (player and admin)
  components/          UI, team table, field diagram (react-native-svg)
  lib/                 Supabase client, queries, push helpers
  public/              manifest.json, service worker, icons
  supabase/
    migrations/        SQL schema, RLS, triggers, cron jobs
    functions/
      _shared/         balance.ts (balanceTeams) + balance.test.ts
      generate-teams/
      send-push/
    seed.sql           indoor and outdoor seasons with real addresses and times,
                       3 admins (John and Sim playing, Coach managing only), 25 sample players
```

One app, one package.json; no workspaces. Vitest runs from the root (npm test) and picks up balance.test.ts.

### Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Build command | npx expo export --platform web |
| Output directory | dist |
| Environment variables | EXPO\_PUBLIC\_SUPABASE\_URL, EXPO\_PUBLIC\_SUPABASE\_PUBLISHABLE\_KEY, EXPO\_PUBLIC\_VAPID\_PUBLIC\_KEY, EXPO\_PUBLIC\_EMAIL\_AUTH ("false" until email sign-in is switched on) (different values for preview and production) |
| Routing | Single-page app: unknown paths serve index.html |

### Supabase settings

- **Auth providers:** Google (OAuth client from Google Cloud, with Supabase's callback URL; its consent screen needs the app name, a support email and the privacy policy URL). Email with password is designed but OFF for now: the Email provider stays disabled in the Supabase dashboard (so the server refuses email sign-ups and sign-ins) and the app hides the email form while EXPO\_PUBLIC\_EMAIL\_AUTH is not "true". To turn it on: set up the domain and Resend, enable the Email provider with "Confirm email" on, and set EXPO\_PUBLIC\_EMAIL\_AUTH=true. For background, the built-in Supabase sender: it delivers only to members of the Supabase team (so only to Simar) and only about 2 emails an hour. So a custom sender is required before email sign-in can be switched on, or players would never receive confirmation or reset emails: buy a domain, verify it in Resend (free: 100 emails a day, 3,000 a month) and set Resend as Supabase's custom SMTP. Locally, every email goes to Mailpit, the test inbox that runs with supabase start.
- **Redirect URLs:** the prod domain and the preview URL pattern.
- **Secrets:** VAPID private key, used only by send-push.
- **Extensions:** pg\_cron and pg\_net enabled.

### CI (GitHub Actions)

1. On every pull request: type check, lint, Vitest (balancing tests), and supabase db lint.
2. On merge to main: supabase db push and supabase functions deploy against prod; Cloudflare builds the site from the same commit.
3. Database changes live in the migration files, never as edits in the Supabase dashboard. Until the first prod deploy, edit the existing migration files freely and rebuild the database with supabase db reset (it reruns every migration and seed.sql). From the first prod deploy on, every change is a new migration file, because prod has already run the old ones.

### Project tracking

- **Board:** GitHub Issues with a GitHub Projects board, in the same account as the repo.
- **Milestones:** Foundation, RSVP loop, Teams, Season passes and flags, Web launch.
- **Labels:** database, functions, player UI, admin UI, infra, tests.
- **Source of truth:** this spec. The earlier plan doc is background reading only.

## Non-functional requirements

The load is tiny (about 27 users, two runs a week), so the design targets low cost, simple operations and correct permissions rather than scale.

| Area | Requirement | How it is met |
| --- | --- | --- |
| Security | Players cannot see star ratings or unpaid flags, or change stars, roles, other players' RSVPs or unpublished teams | RLS on every table; column guard trigger; admin check inside generate-teams |
| Security | No secrets in the browser | Browser holds only the public anon key and VAPID public key; service-role key and VAPID private key live in Supabase secrets |
| Privacy | Account deletion | Settings "Delete account" calls a function that deletes the auth user; profile rows cascade |
| Performance | RSVP toggle feels instant | Optimistic UI update; Realtime pushes the new count to other viewers |
| Performance | Team generation under 2 seconds end to end | Pure function on at most about 30 players; one transaction to save |
| Availability | App up on Saturday and Sunday mornings | Cloudflare serves static files; weekly cron and RSVP traffic keep the free Supabase project active; upgrade to Pro ($25 a month) if it ever pauses |
| Data safety | Recover from a bad change | Free plan has no automatic backups: a weekly GitHub Action runs pg\_dump into a separate private repo (firsttouch-backups, not the code repo, because dumps hold names and emails) and keeps the last 8 weekly dumps; seed.sql rebuilds dev |
| Monitoring | Know when something breaks | Supabase logs for functions and cron; a failed send-push or cron job writes to a job\_errors table shown on the admin screen |
| Cost | $0 a month for v1 | Cloudflare Pages free, Supabase free; optional custom domain is the only spend |
| Accessibility | Usable outdoors on a phone | Large tap targets, high contrast, team colours always paired with team names |

## Testing plan

The balancing function and the permission rules carry the most risk, so they get automated tests; screens get a short manual checklist on real phones before each launch.

| Layer | Tool | What is tested |
| --- | --- | --- |
| Balancing | Vitest | Team count for 4, 14, 18, 19, 24, 27 and 40 players indoors and outdoors; every player placed once; sizes differ by at most 1; star ranges small on random rosters; same seed gives same teams |
| Database rules | pgTAP via supabase test db | A player cannot read profiles or any star rating (directly or through either view), cannot edit stars or role, cannot RSVP for someone else, cannot RSVP after the lock time, cannot read unpublished teams, cannot see anyone's unpaid flag; the admin-only account cannot RSVP; an admin can do all of these. generate\_season\_runs creates every Saturday, Sunday and holiday Monday in range with the season's default address and time, ignores a holiday row that is not a Monday, and skips existing dates |
| Lock time | pgTAP | run\_lock\_at for a 6:30 AM run is 5:30 AM Toronto time, including on the weekends the clocks change; an RSVP at 5:29 succeeds and at 5:31 is refused |
| Triggers | pgTAP | A yes at 05:00 Toronto time on run day sets morning\_of; a yes the day before does not; a yes at 23:30 the night before does not |
| Edge Functions | Deno tests against the dev project | generate-teams rejects anyone but the job or an admin, publishes and pushes; with 3 players it leaves the run locked and alerts admins; the evening reminder targets only runs dated tomorrow, including holiday Mondays; send-push removes expired subscriptions |
| End to end | Playwright on the preview URL | Sign in, RSVP, lock time passes (test run set to start soon), teams appear, admin swaps a player, player never sees stars |
| Manual | iPhone and Android phones | Add to Home Screen, enable notifications, receive "Teams are up", field diagram readable outdoors |
| Email sign-in | Local stack + Mailpit; Playwright | Sign-up creates a profile with the typed name; sign-in fails until the email is confirmed; wrong password and unknown email show the same message; reset link opens /reset-password and the new password works; the old one does not |

## Later and open items

Each later feature fits the current design without reworking the schema.

| Later feature | Change needed |
| --- | --- |
| Season join code | Add join\_code to seasons and a season\_members table; a player enters the code once per season, and RLS on rsvps also checks membership |
| Walk-ins | Admin adds an existing player or a named guest to a locked or published run; they go on the smallest team, or the admin taps Reshuffle |
| No-shows | Admin marks a player as a no-show; option to rebalance the remaining players; no-show count kept per player |
| Player cap and waitlist | max\_players on runs; yes RSVPs past the cap join a waitlist in order and move up when someone drops |
| In-app season pass payment | Stripe Checkout from an Edge Function; a Stripe webhook marks season\_passes paid with method 'stripe'. Cloudflare's free plan allows this |
| Match rotation | New matches table (run, team A, team B, result, minute); rules: 5-minute games, scorer stays on, on a draw the team on longest goes off |
| App Store and Google Play | EAS builds from the same code; Expo push path in send-push; Sign in with Apple; personal developer accounts, Google 14-day closed test |
| Email sign-in | Now part of v1 (see Key flows). Still needed before launch: a custom email sender (see Open items) |

**Open items**

- [ ] To switch on email sign-in (not needed for launch): a domain plus Resend as Supabase's custom email sender, then enable the Email provider and set EXPO\_PUBLIC\_EMAIL\_AUTH=true. Until then players sign in with Google only.
- [ ] Real indoor and outdoor season start and end dates; generate\_season\_runs needs them before any runs exist (sample dates are fine for building and testing).
- [ ] Check firsttouch.pages.dev is free when creating the Cloudflare project.
