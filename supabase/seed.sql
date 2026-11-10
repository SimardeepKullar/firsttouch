-- Local development seed data (runs on `supabase db reset`). Never applied to remote.

-- "Today" in Toronto. Everything below is placed relative to this, so the sample
-- data always has a recent published run and upcoming open ones.
create temporary table seed_ctx on commit drop as
  select (now() at time zone 'America/Toronto')::date as today;

-- Seasons. Dates are relative to today (not the real season dates): the indoor
-- season started 8 weeks ago and ends in 20 weeks; outdoor follows it.
insert into seasons (name, type, starts_on, ends_on, default_location, default_start_time, is_current)
select v.name, v.type::season_type, v.starts_on, v.ends_on, v.loc, v.t::time, v.cur
from seed_ctx c, lateral (values
  ('Indoor 2026-27', 'indoor',  c.today - 56,  c.today + 140,
   '7855 Finch Ave W, Brampton, ON L6T 0B2', '06:30', true),
  ('Outdoor 2027',   'outdoor', c.today + 147, c.today + 330,
   '32 Kennedy Rd N, Brampton, ON L6V 1X4',  '07:00', false)
) v(name, type, starts_on, ends_on, loc, t, cur);

-- Holiday Mondays
select fill_holidays(y) from generate_series(2026, 2028) y;

-- Test users. Inserting into auth.users fires handle_new_user(), which creates
-- the profiles. Password for all of them is "password123" (local only).
create temporary table seed_users (
  n int, full_name text, email text, is_admin boolean, plays boolean,
  stars smallint, position "position"
) on commit drop;

insert into seed_users values
  (1,  'John',  'john@example.com',  true,  true,  4, 'attack'),
  (2,  'Sim',   'sim@example.com',   true,  true,  3, 'defend'),
  (3,  'Coach', 'coach@example.com', true,  false, 3, 'attack'),
  (4,  'Aiden Brooks',   'player01@example.com', false, true, 5, 'attack'),
  (5,  'Ben Carter',     'player02@example.com', false, true, 4, 'defend'),
  (6,  'Chris Dalton',   'player03@example.com', false, true, 3, 'attack'),
  (7,  'Dev Patel',      'player04@example.com', false, true, 2, 'defend'),
  (8,  'Eli Moreno',     'player05@example.com', false, true, 1, 'attack'),
  (9,  'Farid Haddad',   'player06@example.com', false, true, 4, 'attack'),
  (10, 'Gabe Nguyen',    'player07@example.com', false, true, 5, 'defend'),
  (11, 'Hassan Ali',     'player08@example.com', false, true, 3, 'defend'),
  (12, 'Ivan Petrov',    'player09@example.com', false, true, 2, 'attack'),
  (13, 'Jamal Wright',   'player10@example.com', false, true, 1, 'defend'),
  (14, 'Kofi Mensah',    'player11@example.com', false, true, 4, 'defend'),
  (15, 'Liam Gallagher', 'player12@example.com', false, true, 3, 'attack'),
  (16, 'Marco Rossi',    'player13@example.com', false, true, 5, 'attack'),
  (17, 'Nate Singh',     'player14@example.com', false, true, 2, 'defend'),
  (18, 'Omar Farouk',    'player15@example.com', false, true, 3, 'attack'),
  (19, 'Pablo Reyes',    'player16@example.com', false, true, 4, 'attack'),
  (20, 'Quinn Murphy',   'player17@example.com', false, true, 1, 'attack'),
  (21, 'Raj Kapoor',     'player18@example.com', false, true, 3, 'defend'),
  (22, 'Sam Okafor',     'player19@example.com', false, true, 2, 'attack'),
  (23, 'Tariq Khan',     'player20@example.com', false, true, 5, 'defend'),
  (24, 'Uri Cohen',      'player21@example.com', false, true, 4, 'defend'),
  (25, 'Victor Lam',     'player22@example.com', false, true, 3, 'attack'),
  (26, 'Wes Tanaka',     'player23@example.com', false, true, 2, 'defend'),
  (27, 'Xavi Costa',     'player24@example.com', false, true, 1, 'defend'),
  (28, 'Yusuf Demir',    'player25@example.com', false, true, 4, 'attack');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  '00000000-0000-0000-0000-000000000000',
  ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  'authenticated', 'authenticated', email,
  crypt('password123', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', full_name),
  now(), now(), '', '', '', ''
from seed_users;

insert into auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id::text, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', now(), now(), now()
from auth.users u;

-- Roles, plays, stars and position (no signed-in user, so the column guard allows it)
update profiles p
   set role     = case when s.is_admin then 'admin'::user_role else 'player'::user_role end,
       plays    = s.plays,
       stars    = s.stars,
       position = s.position
  from seed_users s
 where p.email = s.email;

-- =============================================================================
-- Runs, RSVPs, passes and teams
-- =============================================================================

-- generate_season_runs() is admin-only, so pretend John (an admin) is signed in
-- for the call, then sign him out again.
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', false);
select generate_season_runs(id) from seasons where type = 'indoor';
select set_config('request.jwt.claims', '', false);

-- Pick the runs the screens need. Past runs are before today; upcoming are today or later.
create temporary table seed_runs on commit drop as
select 'published'::text as kind, id, run_date from (
  select id, run_date from runs
   where run_date < (select today from seed_ctx)
   order by run_date desc limit 1) q
union all
select case rn when 1 then 'busy' when 2 then 'quiet' else 'split' end, id, run_date from (
  select id, run_date, row_number() over (order by run_date) rn from runs
   where run_date >= (select today from seed_ctx)
   order by run_date limit 3) q;

-- RSVPs. Coach (n = 3) never gets one. Times are Toronto local.
-- Published run: 18 yes (two arrive on run day = morning-of), 2 no.
insert into rsvps (run_id, player_id, going, responded_at)
select r.id, p.id, u.n <= 19,
       case when u.n in (17, 18)
            then (r.run_date + time '00:30') at time zone 'America/Toronto'
            else (r.run_date - 3 + time '20:00') at time zone 'America/Toronto' end
  from seed_runs r
  join seed_users u on u.n in (1, 2) or u.n between 4 and 21
  join profiles p on p.email = u.email
 where r.kind = 'published';

-- Busy run: 20 yes (John and Sim included), 2 no.
insert into rsvps (run_id, player_id, going)
select r.id, p.id, u.n <= 21
  from seed_runs r
  join seed_users u on u.n in (1, 2) or u.n between 4 and 23
  join profiles p on p.email = u.email
 where r.kind = 'busy';

-- Quiet run: only 3 yes.
insert into rsvps (run_id, player_id, going)
select r.id, p.id, true
  from seed_runs r
  join seed_users u on u.n between 4 and 6
  join profiles p on p.email = u.email
 where r.kind = 'quiet';

-- Split run: John is going, Sim says no, plus a few others.
insert into rsvps (run_id, player_id, going)
select r.id, p.id, u.n <> 2
  from seed_runs r
  join seed_users u on u.n in (1, 2, 7, 8, 9)
  join profiles p on p.email = u.email
 where r.kind = 'split';

-- Season passes for the indoor season (players only; Coach does not play).
-- n 1-21 paid, n 22-24 have an unpaid pass, n 25-28 have no pass at all:
-- 7 of 27 players (about a quarter) lack a paid pass, 3 of them unpaid.
insert into season_passes (season_id, player_id, paid, amount_cents, method, marked_by, marked_at)
select s.id, p.id, u.n <= 21,
       case when u.n <= 21 then s.pass_price_cents end,
       case when u.n <= 21 then (array['e-transfer', 'cash'])[1 + u.n % 2] end,
       case when u.n <= 21 then (select id from profiles where email = 'john@example.com') end,
       case when u.n <= 21 then now() end
  from seasons s
  join seed_users u on u.n <> 3 and u.n <= 24
  join profiles p on p.email = u.email
 where s.type = 'indoor';

-- Publish the published run: 3 teams, snake draft by stars (yes + plays only).
update runs r
   set status = 'published',
       published_at = ((r.run_date + r.start_time) at time zone 'America/Toronto') - interval '30 minutes'
  from seed_runs sr
 where r.id = sr.id and sr.kind = 'published';

insert into team_assignments (run_id, player_id, team, slot)
select run_id, player_id,
       (array['blue', 'yellow', 'red'])[1 + case when (rn / 3) % 2 = 0 then rn % 3 else 2 - rn % 3 end]::team_color,
       (rn / 3 + 1)::smallint
  from (
    select sr.id as run_id, p.id as player_id,
           (row_number() over (order by p.stars desc, p.full_name) - 1)::int as rn
      from seed_runs sr
      join rsvps v on v.run_id = sr.id and v.going
      join profiles p on p.id = v.player_id and p.plays
     where sr.kind = 'published'
  ) ranked;
