-- Lock time: run_lock_at is one hour before start, in Toronto time, and the
-- RSVP policies refuse a response once that moment has passed.
--
-- Cast:
--   b1 Player  an ordinary player who RSVPs
begin;
select plan(10);

-- run_date is unique, and seed.sql fills the calendar with runs: clear them
-- (rolled back with the transaction) so the test dates below are free.
delete from runs;

select tests.create_user('00000000-0000-0000-0000-0000000000b1', 'lock@test.local', '{"full_name":"Lock Player"}');

insert into seasons (id, name, type, default_location, default_start_time)
values ('00000000-0000-0000-0000-0000000000f1', 'Lock season', 'indoor', 'Test field', '06:30');

-- Runs at 6:30 AM on ordinary days and on both clock-change weekends of 2027.
-- Clocks go forward Sun 2027-03-14 and back Sun 2027-11-07 (America/Toronto).
insert into runs (id, season_id, run_date, start_time, location) values
  ('00000000-0000-0000-0000-0000000001a1', '00000000-0000-0000-0000-0000000000f1', '2027-01-09', '06:30', 'x'),  -- winter (EST, UTC-5)
  ('00000000-0000-0000-0000-0000000001a2', '00000000-0000-0000-0000-0000000000f1', '2027-07-10', '06:30', 'x'),  -- summer (EDT, UTC-4)
  ('00000000-0000-0000-0000-0000000001a3', '00000000-0000-0000-0000-0000000000f1', '2027-03-13', '06:30', 'x'),  -- Sat before spring-forward
  ('00000000-0000-0000-0000-0000000001a4', '00000000-0000-0000-0000-0000000000f1', '2027-03-14', '06:30', 'x'),  -- Sun the clocks jump
  ('00000000-0000-0000-0000-0000000001a5', '00000000-0000-0000-0000-0000000000f1', '2027-11-06', '06:30', 'x'),  -- Sat before fall-back
  ('00000000-0000-0000-0000-0000000001a6', '00000000-0000-0000-0000-0000000000f1', '2027-11-07', '06:30', 'x');  -- Sun the clocks fall back

-- Part 1: the lock moment, checked two ways.
-- (a) as Toronto wall-clock time: always 05:30 on the run's own date.
select is(
  (select run_lock_at(r) at time zone 'America/Toronto' from runs r where r.id = '00000000-0000-0000-0000-0000000001a1'),
  '2027-01-09 05:30'::timestamp, 'winter run locks at 5:30 AM Toronto');
select is(
  (select run_lock_at(r) at time zone 'America/Toronto' from runs r where r.id = '00000000-0000-0000-0000-0000000001a2'),
  '2027-07-10 05:30'::timestamp, 'summer run locks at 5:30 AM Toronto');

-- (b) as the real instant (UTC), which proves the offset used was right.
select is(
  (select run_lock_at(r) from runs r where r.id = '00000000-0000-0000-0000-0000000001a3'),
  '2027-03-13 10:30:00+00'::timestamptz, 'Sat before spring-forward: 5:30 EST = 10:30 UTC');
select is(
  (select run_lock_at(r) from runs r where r.id = '00000000-0000-0000-0000-0000000001a4'),
  '2027-03-14 09:30:00+00'::timestamptz, 'spring-forward Sunday: 5:30 EDT = 09:30 UTC');
select is(
  (select run_lock_at(r) from runs r where r.id = '00000000-0000-0000-0000-0000000001a5'),
  '2027-11-06 09:30:00+00'::timestamptz, 'Sat before fall-back: 5:30 EDT = 09:30 UTC');
select is(
  (select run_lock_at(r) from runs r where r.id = '00000000-0000-0000-0000-0000000001a6'),
  '2027-11-07 10:30:00+00'::timestamptz, 'fall-back Sunday: 5:30 EST = 10:30 UTC');
select is(
  (select run_lock_at(r) at time zone 'America/Toronto' from runs r where r.id = '00000000-0000-0000-0000-0000000001a4'),
  '2027-03-14 05:30'::timestamp, 'spring-forward Sunday still reads 5:30 AM on a Toronto clock');

-- Part 2: faking the time. now() is frozen for a whole transaction, so instead
-- of moving the clock we move the run: pick a start_time relative to now().
--   run starts 61 min from now -> locks 1 min AHEAD (like an RSVP at 5:29)
--   run starts 59 min from now -> locks 1 min AGO   (like an RSVP at 5:31)
-- run_date is unique, so one run is moved between the two checks.
insert into runs (id, season_id, run_date, start_time, location) values
  ('00000000-0000-0000-0000-0000000002a1', '00000000-0000-0000-0000-0000000000f1',
   ((now() + interval '61 minutes') at time zone 'America/Toronto')::date,
   ((now() + interval '61 minutes') at time zone 'America/Toronto')::time, 'x');

select tests.create_user('00000000-0000-0000-0000-0000000000b2', 'lock2@test.local', '{"full_name":"Lock Player Two"}');

select tests.act_as('00000000-0000-0000-0000-0000000000b1');
select lives_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000002a1', '00000000-0000-0000-0000-0000000000b1', true)$$,
  'an RSVP one minute before the lock succeeds');

-- Move the run so its lock was one minute ago.
reset role;
update runs
   set run_date   = ((now() + interval '59 minutes') at time zone 'America/Toronto')::date,
       start_time = ((now() + interval '59 minutes') at time zone 'America/Toronto')::time
 where id = '00000000-0000-0000-0000-0000000002a1';

select tests.act_as('00000000-0000-0000-0000-0000000000b2');
select throws_ok(
  $$insert into rsvps (run_id, player_id, going) values ('00000000-0000-0000-0000-0000000002a1', '00000000-0000-0000-0000-0000000000b2', true)$$,
  '42501', null, 'a new RSVP one minute after the lock is refused');

reset role;
select tests.act_as('00000000-0000-0000-0000-0000000000b1');
-- An update that matches no visible row does not raise; it changes nothing.
update rsvps set going = false where run_id = '00000000-0000-0000-0000-0000000002a1' and player_id = '00000000-0000-0000-0000-0000000000b1';
reset role;
select is(
  (select going from rsvps where run_id = '00000000-0000-0000-0000-0000000002a1' and player_id = '00000000-0000-0000-0000-0000000000b1'),
  true, 'changing an RSVP after the lock does nothing');

select * from finish();
rollback;
