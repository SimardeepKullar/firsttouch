-- Area 3: a manage-only admin (role = admin, plays = false), like Coach.
--
-- Cast:
--   e1 Coach       admin, plays = false (the user we act as)
--   e2 Player Two  player, 5 stars, has not paid
--   e3 Player Three player
begin;
select plan(27);

-- ---------------------------------------------------------------------------
-- Set-up, as the database owner
-- ---------------------------------------------------------------------------
select tests.create_user('00000000-0000-0000-0000-0000000000e1', 'coach@test.local', '{"full_name":"Coach"}');
select tests.create_user('00000000-0000-0000-0000-0000000000e2', 'two@test.local',   '{"full_name":"Player Two"}');
select tests.create_user('00000000-0000-0000-0000-0000000000e3', 'three@test.local', '{"full_name":"Player Three"}');

update profiles set role = 'admin', plays = false where id = '00000000-0000-0000-0000-0000000000e1';
update profiles set stars = 5                     where id = '00000000-0000-0000-0000-0000000000e2';

insert into seasons (id, name, type, default_location, default_start_time)
values ('00000000-0000-0000-0000-0000000000f1', 'Test season', 'indoor', 'Test field', '07:00');

insert into runs (id, season_id, run_date, start_time, location, status) values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000f1', '2030-07-06', '07:00', 'Test field', 'open'),       -- open, before lock
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000f1', '2020-07-04', '07:00', 'Test field', 'open'),       -- lock time has passed
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-0000000000f1', '2030-07-13', '07:00', 'Test field', 'published');

insert into holidays (holiday_date, name) values ('2030-10-14', 'Test Thanksgiving');

insert into rsvps (run_id, player_id, going) values
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-0000000000e2', true);

insert into season_passes (season_id, player_id, paid) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000e2', false);

insert into team_assignments (run_id, player_id, team, slot) values
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-0000000000e2', 'red', 1);

insert into push_subscriptions (player_id, endpoint, p256dh, auth) values
  ('00000000-0000-0000-0000-0000000000e2', 'https://push.test/e2', 'k', 'a'),
  ('00000000-0000-0000-0000-0000000000e3', 'https://push.test/e3', 'k', 'a');

insert into job_errors (source, detail) values ('test', 'admin test error');

select tests.act_as('00000000-0000-0000-0000-0000000000e1');

-- ---------------------------------------------------------------------------
-- run_roster shows real stars and unpaid flag to an admin
-- ---------------------------------------------------------------------------
select results_eq(
  $$select stars, flag_unpaid from run_roster
     where run_id = '00000000-0000-0000-0000-0000000000a3'
       and player_id = '00000000-0000-0000-0000-0000000000e2'$$,
  $$values (5::smallint, true)$$,
  'run_roster shows real stars and flag_unpaid to an admin'
);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
select is(
  (select count(*)::int from profiles where id in (
    '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e3')),
  3,
  'admin can read profiles'
);
select isnt_empty(
  $$update profiles set stars = 2, position = 'defend' where id = '00000000-0000-0000-0000-0000000000e2' returning id$$,
  'admin can update a player''s stars and position'
);

-- ---------------------------------------------------------------------------
-- seasons
-- ---------------------------------------------------------------------------
select isnt_empty($$select 1 from seasons where id = '00000000-0000-0000-0000-0000000000f1'$$, 'admin can read seasons');
select lives_ok(
  $$insert into seasons (id, name, type, default_location, default_start_time)
    values ('00000000-0000-0000-0000-0000000000f2', 'Another season', 'outdoor', 'x', '07:00')$$,
  'admin can insert seasons'
);
select isnt_empty($$update seasons set name = 'Renamed' where id = '00000000-0000-0000-0000-0000000000f1' returning id$$, 'admin can update seasons');
select isnt_empty($$delete from seasons where id = '00000000-0000-0000-0000-0000000000f2' returning id$$, 'admin can delete seasons');

-- ---------------------------------------------------------------------------
-- runs
-- ---------------------------------------------------------------------------
select isnt_empty($$select 1 from runs where id = '00000000-0000-0000-0000-0000000000a1'$$, 'admin can read runs');
select lives_ok(
  $$insert into runs (id, season_id, run_date, start_time, location)
    values ('00000000-0000-0000-0000-0000000000a4', '00000000-0000-0000-0000-0000000000f1', '2030-07-20', '07:00', 'x')$$,
  'admin can insert runs'
);
select isnt_empty($$update runs set location = 'New field' where id = '00000000-0000-0000-0000-0000000000a1' returning id$$, 'admin can update runs');
select isnt_empty($$delete from runs where id = '00000000-0000-0000-0000-0000000000a4' returning id$$, 'admin can delete runs');

-- ---------------------------------------------------------------------------
-- holidays
-- ---------------------------------------------------------------------------
select isnt_empty($$select 1 from holidays where holiday_date = '2030-10-14'$$, 'admin can read holidays');
select lives_ok($$insert into holidays (holiday_date, name) values ('2030-11-11', 'Test holiday')$$, 'admin can insert holidays');
select isnt_empty($$update holidays set active = false where holiday_date = '2030-10-14' returning holiday_date$$, 'admin can update holidays');
select isnt_empty($$delete from holidays where holiday_date = '2030-11-11' returning holiday_date$$, 'admin can delete holidays');

-- ---------------------------------------------------------------------------
-- season_passes
-- ---------------------------------------------------------------------------
select isnt_empty($$select 1 from season_passes where player_id = '00000000-0000-0000-0000-0000000000e2'$$, 'admin can read season_passes');
select lives_ok(
  $$insert into season_passes (season_id, player_id, paid)
    values ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000e3', true)$$,
  'admin can insert season_passes'
);
select isnt_empty(
  $$update season_passes set paid = true where player_id = '00000000-0000-0000-0000-0000000000e2' returning player_id$$,
  'admin can mark a season pass paid'
);

-- ---------------------------------------------------------------------------
-- team_assignments
-- ---------------------------------------------------------------------------
select isnt_empty($$select 1 from team_assignments where player_id = '00000000-0000-0000-0000-0000000000e2'$$, 'admin can read team_assignments');
select lives_ok(
  $$insert into team_assignments (run_id, player_id, team, slot)
    values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000e3', 'yellow', 1)$$,
  'admin can insert team_assignments'
);
select isnt_empty(
  $$delete from team_assignments where run_id = '00000000-0000-0000-0000-0000000000a1' returning player_id$$,
  'admin can delete team_assignments'
);

-- ---------------------------------------------------------------------------
-- RSVPs: any player, even after lock; never a plays = false profile
-- ---------------------------------------------------------------------------
select lives_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000e2', true)$$,
  'admin can RSVP for a player after the lock time'
);
select lives_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000e3', true)$$,
  'admin can RSVP for another player'
);
select isnt_empty(
  $$update rsvps set going = false
     where run_id = '00000000-0000-0000-0000-0000000000a3' and player_id = '00000000-0000-0000-0000-0000000000e2'
    returning player_id$$,
  'admin can change a player''s RSVP'
);
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000e1', true)$$,
  '42501', null, 'admin cannot RSVP for a plays = false profile (the Coach rule)'
);

-- ---------------------------------------------------------------------------
-- job_errors and push_subscriptions
-- ---------------------------------------------------------------------------
select isnt_empty($$select 1 from job_errors where detail = 'admin test error'$$, 'admin can read job_errors');
select results_eq(
  $$select player_id from push_subscriptions
     where player_id in ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e3')
     order by player_id$$,
  $$values ('00000000-0000-0000-0000-0000000000e2'::uuid), ('00000000-0000-0000-0000-0000000000e3'::uuid)$$,
  'admin can read every player''s push_subscriptions'
);

select * from finish();
rollback;
