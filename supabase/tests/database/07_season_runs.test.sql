-- generate_season_runs, set_holiday_active and ontario_monday_holidays.
-- Dates are in 2035 so they can never clash with seed data.
--   Season A: Fri 2035-02-16 .. Sun 2035-03-04 (Family Day is Mon Feb 19)
--   Season B: Sat 2035-09-01 .. Sun 2035-09-30 (Labour Day is Mon Sep 3), never given runs
begin;
select plan(25);

select tests.create_user('00000000-0000-0000-0000-0000000000d1', 'admin@test.local',  '{"full_name":"Admin"}');
select tests.create_user('00000000-0000-0000-0000-0000000000d2', 'player@test.local', '{"full_name":"Player"}');
update profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000d1';

insert into seasons (id, name, type, starts_on, ends_on, default_location, default_start_time) values
  ('00000000-0000-0000-0000-0000000000a1', 'Season A', 'indoor', '2035-02-16', '2035-03-04', 'A field', '06:30'),
  ('00000000-0000-0000-0000-0000000000b1', 'Season B', 'indoor', '2035-09-01', '2035-09-30', 'B field', '07:15'),
  ('00000000-0000-0000-0000-0000000000c1', 'No dates', 'indoor', null, null, 'C field', '07:00'),
  ('00000000-0000-0000-0000-0000000000e1', 'Other season', 'outdoor', '2035-01-01', '2035-01-31', 'Other field', '07:00');

-- Holiday rows already there before generating:
insert into holidays (holiday_date, name, active) values
  ('2035-02-21', 'Not a Monday',  true),   -- a Wednesday: must be ignored
  ('2035-02-26', 'Switched off',  false);  -- a Monday, off: must be skipped
-- A run already on one of the dates (in another season, 'Other season'): must be left alone.
insert into runs (id, season_id, run_date, start_time, location)
values ('00000000-0000-0000-0000-0000000004a1', '00000000-0000-0000-0000-0000000000e1', '2035-02-17', '09:00', 'Old field');

-- ---------------------------------------------------------------------------
-- ontario_monday_holidays: read-only, so run it as the owner
-- ---------------------------------------------------------------------------
-- The spec's table starts at Oct 2026 (the first season), so compare from there.
select results_eq(
  $$select holiday_date from generate_series(2026, 2028) y, ontario_monday_holidays(y)
    where holiday_date >= '2026-10-01' order by 1$$,
  $$values ('2026-10-12'::date), ('2026-12-28'), ('2027-02-15'), ('2027-05-24'), ('2027-08-02'), ('2027-09-06'),
           ('2027-10-11'), ('2027-12-27'), ('2028-01-03'), ('2028-02-21'), ('2028-05-22'), ('2028-07-03'),
           ('2028-08-07'), ('2028-09-04'), ('2028-10-09'), ('2028-12-25')$$,
  'ontario_monday_holidays matches the spec table for Oct 2026 to 2028');
select is(
  (select count(*)::int from generate_series(2026, 2028) y, ontario_monday_holidays(y)), 
  20,  -- the 16 in the spec table, plus Family, Victoria, Civic and Labour Day 2026 before it
  'exactly 20 Monday holidays across 2026 to 2028, nothing extra');
select ok(
  not exists (select 1 from generate_series(2026, 2028) y, ontario_monday_holidays(y)
              where holiday_date in ('2026-04-06', '2027-03-29', '2028-04-17')),
  'Easter Monday is not included');
select ok(
  not exists (select 1 from generate_series(2026, 2028) y, ontario_monday_holidays(y)
              where extract(isodow from holiday_date) <> 1),
  'every returned date is a Monday');

-- ---------------------------------------------------------------------------
-- generate_season_runs
-- ---------------------------------------------------------------------------
select tests.act_as('00000000-0000-0000-0000-0000000000d2');
select throws_ok($$select generate_season_runs('00000000-0000-0000-0000-0000000000a1')$$, '42501', 'admin only',
  'a player cannot generate runs');
reset role;
select tests.act_as_anon();
select throws_ok($$select generate_season_runs('00000000-0000-0000-0000-0000000000a1')$$, '42501', null,
  'a signed-out visitor cannot generate runs');
reset role;

select tests.act_as('00000000-0000-0000-0000-0000000000d1');
select throws_ok($$select generate_season_runs('00000000-0000-0000-0000-0000000000c1')$$, 'P0001', null,
  'a season without dates is refused');

-- Weekends: Feb 17,18 24,25 Mar 3,4 = 6 (Feb 17 already taken -> 5 new), plus Family Day Mon Feb 19 = 6 created.
select is(generate_season_runs('00000000-0000-0000-0000-0000000000a1'), 6, 'returns how many runs it created');
reset role;

select results_eq(
  $$select run_date from runs where season_id = '00000000-0000-0000-0000-0000000000a1' order by 1$$,
  $$values ('2035-02-18'::date), ('2035-02-19'), ('2035-02-24'), ('2035-02-25'), ('2035-03-03'), ('2035-03-04')$$,
  'creates Saturdays, Sundays and the active holiday Monday only');
select is((select count(*)::int from runs where season_id = '00000000-0000-0000-0000-0000000000a1' and location = 'A field' and start_time = '06:30'), 6,
  'every new run has the season''s address and time');
select is((select count(*)::int from runs where run_date = '2035-02-21'), 0, 'a holiday row that is not a Monday is ignored');
select is((select count(*)::int from runs where run_date = '2035-02-26'), 0, 'a switched-off holiday is skipped');
select is((select active from holidays where holiday_date = '2035-02-26'), false, 'refilling does not switch the holiday back on');
select is((select location || ' ' || season_id::text from runs where run_date = '2035-02-17'), 'Old field 00000000-0000-0000-0000-0000000000e1',
  'an existing run on a date is left untouched');
select is((select count(*)::int from holidays where holiday_date = '2035-02-19' and name = 'Family Day'), 1,
  'it filled the year''s holidays itself');

select tests.act_as('00000000-0000-0000-0000-0000000000d1');
select is(generate_season_runs('00000000-0000-0000-0000-0000000000a1'), 0, 'running again creates nothing new');
reset role;

-- ---------------------------------------------------------------------------
-- set_holiday_active
-- ---------------------------------------------------------------------------
select tests.act_as('00000000-0000-0000-0000-0000000000d2');
select throws_ok($$select set_holiday_active('2035-02-19', false)$$, '42501', 'admin only', 'a player cannot switch a holiday');
reset role;

select tests.act_as('00000000-0000-0000-0000-0000000000d1');
select throws_ok($$select set_holiday_active('2035-06-04', true)$$, 'P0001', null, 'an unknown holiday date is refused');

select set_holiday_active('2035-02-19', false);
reset role;
select is((select count(*)::int from runs where run_date = '2035-02-19'), 0, 'switching off deletes that day''s run');
select is((select active from holidays where holiday_date = '2035-02-19'), false, 'and marks the holiday inactive');

select tests.act_as('00000000-0000-0000-0000-0000000000d1');
select set_holiday_active('2035-02-19', true);
reset role;
select results_eq(
  $$select season_id, start_time, location from runs where run_date = '2035-02-19'$$,
  $$values ('00000000-0000-0000-0000-0000000000a1'::uuid, '06:30'::time, 'A field'::text)$$,
  'switching on inside a season that has runs adds the run with that season''s time and address');

-- Switched-off Monday Feb 26 is inside season A too.
select tests.act_as('00000000-0000-0000-0000-0000000000d1');
select set_holiday_active('2035-02-26', true);
reset role;
select is((select count(*)::int from runs where run_date = '2035-02-26'), 1, 'the earlier switched-off Monday can be turned on too');

-- Generating season A filled in all of 2035's holidays. Switch two of them off
-- directly (as the owner, so no run is touched):
--   Labour Day is in season B, which has no runs yet.
--   Victoria Day is in no season at all.
update holidays set active = false where holiday_date in ('2035-09-03', '2035-05-21');
select tests.act_as('00000000-0000-0000-0000-0000000000d1');
select set_holiday_active('2035-09-03', true);
select set_holiday_active('2035-05-21', true);
reset role;
select is((select count(*)::int from runs where run_date = '2035-09-03'), 0, 'switching on inside a season with no runs yet adds nothing');
select is((select count(*)::int from runs where run_date = '2035-05-21'), 0, 'switching on outside every season adds nothing');
select is((select active from holidays where holiday_date = '2035-05-21'), true, 'but the holiday itself is switched on');

select * from finish();
rollback;
