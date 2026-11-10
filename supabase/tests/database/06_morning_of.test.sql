-- morning_of: set by the set_morning_of trigger when a "yes" arrives on the
-- Toronto calendar day of the run. Tests insert rsvps as the database owner
-- with an explicit responded_at, which is how we fake "when they answered".
--
-- Run day is Sat 2027-07-10 (EDT, UTC-4), so Toronto 05:00 is 09:00 UTC.
begin;
select plan(9);

select tests.create_user('00000000-0000-0000-0000-0000000000c1', 'm1@test.local', '{"full_name":"M One"}');
select tests.create_user('00000000-0000-0000-0000-0000000000c2', 'm2@test.local', '{"full_name":"M Two"}');
select tests.create_user('00000000-0000-0000-0000-0000000000c3', 'm3@test.local', '{"full_name":"M Three"}');
select tests.create_user('00000000-0000-0000-0000-0000000000c4', 'm4@test.local', '{"full_name":"M Four"}');
select tests.create_user('00000000-0000-0000-0000-0000000000c5', 'm5@test.local', '{"full_name":"M Five"}');

insert into seasons (id, name, type, default_location, default_start_time)
values ('00000000-0000-0000-0000-0000000000f1', 'Morning season', 'indoor', 'Test field', '06:30');
insert into runs (id, season_id, run_date, start_time, location)
values ('00000000-0000-0000-0000-0000000003a1', '00000000-0000-0000-0000-0000000000f1', '2027-07-10', '06:30', 'x');

insert into rsvps (run_id, player_id, going, responded_at) values
  -- c1: 05:00 Toronto on run day -> morning-of
  ('00000000-0000-0000-0000-0000000003a1', '00000000-0000-0000-0000-0000000000c1', true, '2027-07-10 05:00 America/Toronto'),
  -- c2: the day before at noon -> not morning-of
  ('00000000-0000-0000-0000-0000000003a1', '00000000-0000-0000-0000-0000000000c2', true, '2027-07-09 12:00 America/Toronto'),
  -- c3: 23:30 the night before -> still not (it is 03:30 UTC on run day, but Toronto says the 9th)
  ('00000000-0000-0000-0000-0000000003a1', '00000000-0000-0000-0000-0000000000c3', true, '2027-07-09 23:30 America/Toronto'),
  -- c4: 00:00 Toronto exactly on run day -> morning-of (the day boundary is Toronto midnight)
  ('00000000-0000-0000-0000-0000000003a1', '00000000-0000-0000-0000-0000000000c4', true, '2027-07-10 00:00 America/Toronto'),
  -- c5: says no on run day -> never morning-of
  ('00000000-0000-0000-0000-0000000003a1', '00000000-0000-0000-0000-0000000000c5', false, '2027-07-10 05:00 America/Toronto');

select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c1'), true,  'yes at 05:00 Toronto on run day sets morning_of');
select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c2'), false, 'yes the day before does not');
select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c3'), false, 'yes at 23:30 the night before does not');
select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c4'), true,  'yes at Toronto midnight starting run day sets morning_of');
select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c5'), false, 'a "no" on run day is not morning_of');

-- Switching c1 to "no" clears the flag.
update rsvps set going = false where player_id = '00000000-0000-0000-0000-0000000000c1';
select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c1'), false, 'switching to no clears morning_of');

-- Switching a "no" back to "yes" counts as a new response made now(). now() is
-- not run day (2027), so it is not morning-of: the trigger refreshes responded_at.
update rsvps set going = true where player_id = '00000000-0000-0000-0000-0000000000c1';
select is((select morning_of from rsvps where player_id = '00000000-0000-0000-0000-0000000000c1'), false,
  'changing back to yes re-stamps responded_at to now, so it is judged on today''s date');
select cmp_ok((select responded_at from rsvps where player_id = '00000000-0000-0000-0000-0000000000c1'), '>=', now(),
  'the flip refreshed responded_at');

-- A yes with no explicit time uses now(): a run dated today (Toronto) is morning-of.
insert into runs (id, season_id, run_date, start_time, location)
values ('00000000-0000-0000-0000-0000000003a2', '00000000-0000-0000-0000-0000000000f1',
        (now() at time zone 'America/Toronto')::date, '06:30', 'x');
insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000003a2', '00000000-0000-0000-0000-0000000000c2', true);
select is((select morning_of from rsvps where run_id = '00000000-0000-0000-0000-0000000003a2'), true,
  'a yes made now for a run dated today (Toronto) is morning_of');

select * from finish();
rollback;
