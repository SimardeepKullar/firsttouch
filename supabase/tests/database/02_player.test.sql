-- Area 2: a signed-in player (role = player, plays = true).
--
-- Cast (ids end in b1..b5 so they're easy to spot):
--   b1 Player One   the player we act as
--   b2 Player Two   another player
--   b3 Watcher      plays = false (cannot RSVP)
--   b4 Leaver       deletes their own account
-- Runs use 2030 dates (still open) and a 2020 date (already locked), so they
-- never clash with seed.sql's runs.
begin;
select plan(45);

-- ---------------------------------------------------------------------------
-- Set-up, as the database owner (RLS doesn't apply to the owner)
-- ---------------------------------------------------------------------------
select tests.create_user('00000000-0000-0000-0000-0000000000b1', 'one@test.local',     '{"full_name":"Player One"}');
select tests.create_user('00000000-0000-0000-0000-0000000000b2', 'two@test.local',     '{"full_name":"Player Two"}');
select tests.create_user('00000000-0000-0000-0000-0000000000b3', 'watcher@test.local', '{"full_name":"Watcher"}');
select tests.create_user('00000000-0000-0000-0000-0000000000b4', 'leaver@test.local',  '{"full_name":"Leaver"}');

update profiles set plays = false where id = '00000000-0000-0000-0000-0000000000b3';
update profiles set stars = 4     where id = '00000000-0000-0000-0000-0000000000b2';

insert into seasons (id, name, type, default_location, default_start_time)
values ('00000000-0000-0000-0000-0000000000c1', 'Test season', 'indoor', 'Test field', '07:00');

insert into runs (id, season_id, run_date, start_time, location, status) values
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000c1', '2030-06-01', '07:00', 'Test field', 'open'),      -- open, before lock
  ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000c1', '2020-06-06', '07:00', 'Test field', 'open'),      -- open, but lock time has passed
  ('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-0000000000c1', '2030-06-08', '07:00', 'Test field', 'locked'),    -- not open
  ('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000c1', '2030-06-15', '07:00', 'Test field', 'published');  -- teams published

insert into holidays (holiday_date, name) values ('2030-09-02', 'Test Labour Day');

insert into rsvps (run_id, player_id, going) values
  ('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000b2', true),
  ('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000b4', true);

insert into season_passes (season_id, player_id, paid) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000b1', true),
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000b2', false);

insert into team_assignments (run_id, player_id, team, slot) values
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000b2', 'blue', 1),  -- open run: hidden
  ('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-0000000000b2', 'blue', 1);  -- published: visible

insert into push_subscriptions (player_id, endpoint, p256dh, auth) values
  ('00000000-0000-0000-0000-0000000000b1', 'https://push.test/one',    'k', 'a'),
  ('00000000-0000-0000-0000-0000000000b2', 'https://push.test/two',    'k', 'a'),
  ('00000000-0000-0000-0000-0000000000b4', 'https://push.test/leaver', 'k', 'a');

insert into job_errors (source, detail) values ('test', 'a failed job');

-- ---------------------------------------------------------------------------
-- profiles and player_directory
-- ---------------------------------------------------------------------------
select tests.act_as('00000000-0000-0000-0000-0000000000b1');

select is((select count(*)::int from profiles), 0, 'player sees no rows in profiles');

select is(
  (select count(*)::int from player_directory
    where id in ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b2')),
  2,
  'player can read player_directory'
);

select results_eq(
  $$select id from player_directory where is_me$$,
  $$values ('00000000-0000-0000-0000-0000000000b1'::uuid)$$,
  'is_me is true only on the player''s own row'
);

-- ---------------------------------------------------------------------------
-- run_roster hides stars and unpaid flag from players
-- ---------------------------------------------------------------------------
select results_eq(
  $$select stars, flag_unpaid from run_roster
     where run_id = '00000000-0000-0000-0000-0000000000d4'
       and player_id = '00000000-0000-0000-0000-0000000000b2'$$,
  $$values (null::smallint, null::boolean)$$,
  'run_roster shows stars and flag_unpaid as null to a player'
);

-- ---------------------------------------------------------------------------
-- A player can't change their own role, plays, stars or position.
-- First line of defence: RLS lets a player update no profile rows at all,
-- so the update silently changes nothing.
-- ---------------------------------------------------------------------------
select is_empty($$update profiles set role = 'admin'      where id = '00000000-0000-0000-0000-0000000000b1' returning id$$, 'player cannot change own role');
select is_empty($$update profiles set plays = false       where id = '00000000-0000-0000-0000-0000000000b1' returning id$$, 'player cannot change own plays');
select is_empty($$update profiles set stars = 5           where id = '00000000-0000-0000-0000-0000000000b1' returning id$$, 'player cannot change own stars');
select is_empty($$update profiles set position = 'defend' where id = '00000000-0000-0000-0000-0000000000b1' returning id$$, 'player cannot change own position');

-- Second line of defence: guard_profile_columns. It fires when an update gets
-- past RLS (for example inside a security-definer function) while a non-admin
-- is signed in. To reach it, run the update as the owner (skips RLS) while the
-- player's claims are still set.
reset role;
select throws_ok($$update profiles set role = 'admin'      where id = '00000000-0000-0000-0000-0000000000b1'$$, '42501', null, 'guard blocks a role change by a signed-in player');
select throws_ok($$update profiles set plays = false       where id = '00000000-0000-0000-0000-0000000000b1'$$, '42501', null, 'guard blocks a plays change by a signed-in player');
select throws_ok($$update profiles set stars = 5           where id = '00000000-0000-0000-0000-0000000000b1'$$, '42501', null, 'guard blocks a stars change by a signed-in player');
select throws_ok($$update profiles set position = 'defend' where id = '00000000-0000-0000-0000-0000000000b1'$$, '42501', null, 'guard blocks a position change by a signed-in player');

-- update_my_name
select tests.act_as('00000000-0000-0000-0000-0000000000b1');
select lives_ok($$select update_my_name('  New Name  ')$$, 'update_my_name works');
select is((select full_name from player_directory where is_me), 'New Name', 'update_my_name trims the name');
select throws_ok($$select update_my_name('   ')$$, 'P0001', 'name cannot be empty', 'update_my_name rejects an empty name');

-- ---------------------------------------------------------------------------
-- RSVPs
-- ---------------------------------------------------------------------------
select lives_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000b1', true)$$,
  'player can RSVP for themselves to an open run before lock'
);
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000b1', true)$$,
  '42501', null, 'player cannot RSVP after the lock time'
);
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-0000000000b1', true)$$,
  '42501', null, 'player cannot RSVP to a run that is not open'
);
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000b2', true)$$,
  '42501', null, 'player cannot RSVP for another player'
);

reset role;
select tests.act_as('00000000-0000-0000-0000-0000000000b3');
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000b3', true)$$,
  '42501', null, 'a profile with plays = false cannot RSVP'
);

-- Changing an answer that already exists. The app saves with an upsert, so the update branch
-- (ON CONFLICT DO UPDATE) is checked against rsvps_update_own, which raises 42501 like an insert.
reset role;
insert into rsvps (run_id, player_id, going) values
  ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000b1', false),  -- after lock
  ('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-0000000000b1', false);  -- not open
select tests.act_as('00000000-0000-0000-0000-0000000000b1');

select lives_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000b1', false)
    on conflict (run_id, player_id) do update set going = excluded.going$$,
  'player can change their own RSVP (upsert) on an open run before lock'
);
select is(
  (select going from rsvps where run_id = '00000000-0000-0000-0000-0000000000d1' and player_id = '00000000-0000-0000-0000-0000000000b1'),
  false, 'the change was saved'
);
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000b1', true)
    on conflict (run_id, player_id) do update set going = excluded.going$$,
  '42501', null, 'player cannot change an existing RSVP (upsert) after the lock time'
);
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-0000000000b1', true)
    on conflict (run_id, player_id) do update set going = excluded.going$$,
  '42501', null, 'player cannot change an existing RSVP (upsert) on a run that is not open'
);
select is(
  (select going from rsvps where run_id = '00000000-0000-0000-0000-0000000000d2' and player_id = '00000000-0000-0000-0000-0000000000b1'),
  false, 'the refused change left the old answer in place'
);

-- ---------------------------------------------------------------------------
-- team_assignments, season_passes, push_subscriptions, job_errors
-- ---------------------------------------------------------------------------
reset role;
select tests.act_as('00000000-0000-0000-0000-0000000000b1');

select results_eq(
  $$select run_id from team_assignments where player_id = '00000000-0000-0000-0000-0000000000b2'$$,
  $$values ('00000000-0000-0000-0000-0000000000d4'::uuid)$$,
  'player sees team_assignments only for published runs'
);
select results_eq(
  $$select player_id from season_passes$$,
  $$values ('00000000-0000-0000-0000-0000000000b1'::uuid)$$,
  'player sees only their own season_passes'
);
select results_eq(
  $$select player_id from push_subscriptions$$,
  $$values ('00000000-0000-0000-0000-0000000000b1'::uuid)$$,
  'player sees only their own push_subscriptions'
);
select is_empty($$select * from job_errors$$, 'player cannot read job_errors');

-- ---------------------------------------------------------------------------
-- runs, seasons, holidays are read-only for players
-- ---------------------------------------------------------------------------
select throws_ok(
  $$insert into runs (season_id, run_date, start_time, location) values ('00000000-0000-0000-0000-0000000000c1', '2030-07-06', '07:00', 'x')$$,
  '42501', null, 'player cannot insert runs'
);
select is_empty($$update runs set location = 'x' where id = '00000000-0000-0000-0000-0000000000d1' returning id$$, 'player cannot update runs');
select is_empty($$delete from runs where id = '00000000-0000-0000-0000-0000000000d1' returning id$$, 'player cannot delete runs');

select throws_ok(
  $$insert into seasons (name, type, default_location, default_start_time) values ('x', 'indoor', 'x', '07:00')$$,
  '42501', null, 'player cannot insert seasons'
);
select is_empty($$update seasons set name = 'x' where id = '00000000-0000-0000-0000-0000000000c1' returning id$$, 'player cannot update seasons');
select is_empty($$delete from seasons where id = '00000000-0000-0000-0000-0000000000c1' returning id$$, 'player cannot delete seasons');

select throws_ok(
  $$insert into holidays (holiday_date, name) values ('2030-10-14', 'x')$$,
  '42501', null, 'player cannot insert holidays'
);
select is_empty($$update holidays set name = 'x' where holiday_date = '2030-09-02' returning holiday_date$$, 'player cannot update holidays');
select is_empty($$delete from holidays where holiday_date = '2030-09-02' returning holiday_date$$, 'player cannot delete holidays');

select throws_ok($$select set_holiday_active('2030-09-02', false)$$, '42501', 'admin only', 'set_holiday_active raises "admin only" for a player');

-- ---------------------------------------------------------------------------
-- delete_my_account deletes only the caller, and their rows cascade
-- ---------------------------------------------------------------------------
reset role;
select tests.act_as('00000000-0000-0000-0000-0000000000b4');
select lives_ok($$select delete_my_account()$$, 'delete_my_account works');

reset role;  -- check as the owner, who sees every row
select is_empty($$select 1 from auth.users         where id        = '00000000-0000-0000-0000-0000000000b4'$$, 'the caller''s auth user is gone');
select is_empty($$select 1 from profiles           where id        = '00000000-0000-0000-0000-0000000000b4'$$, 'the caller''s profile is gone');
select is_empty($$select 1 from rsvps              where player_id = '00000000-0000-0000-0000-0000000000b4'$$, 'the caller''s RSVPs are gone');
select is_empty($$select 1 from push_subscriptions where player_id = '00000000-0000-0000-0000-0000000000b4'$$, 'the caller''s push subscriptions are gone');
select is(
  (select count(*)::int from profiles where id in (
    '00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000b3')),
  3,
  'other players are not deleted'
);

select * from finish();
rollback;
