-- Area 1: a signed-out visitor (role "anon") can read nothing and call nothing.
begin;
select plan(21);

select tests.act_as_anon();

-- Tables
select throws_ok($$select * from profiles$$,           '42501', null, 'anon cannot read profiles');
select throws_ok($$select * from seasons$$,            '42501', null, 'anon cannot read seasons');
select throws_ok($$select * from holidays$$,           '42501', null, 'anon cannot read holidays');
select throws_ok($$select * from season_passes$$,      '42501', null, 'anon cannot read season_passes');
select throws_ok($$select * from runs$$,               '42501', null, 'anon cannot read runs');
select throws_ok($$select * from rsvps$$,              '42501', null, 'anon cannot read rsvps');
select throws_ok($$select * from team_assignments$$,   '42501', null, 'anon cannot read team_assignments');
select throws_ok($$select * from job_errors$$,         '42501', null, 'anon cannot read job_errors');
select throws_ok($$select * from push_subscriptions$$, '42501', null, 'anon cannot read push_subscriptions');

-- Views
select throws_ok($$select * from player_directory$$, '42501', null, 'anon cannot read player_directory');
select throws_ok($$select * from run_roster$$,       '42501', null, 'anon cannot read run_roster');

-- Functions
select throws_ok($$select is_admin()$$,                          '42501', null, 'anon cannot call is_admin()');
select throws_ok($$select my_plays()$$,                          '42501', null, 'anon cannot call my_plays()');
select throws_ok($$select run_lock_at(null::runs)$$,             '42501', null, 'anon cannot call run_lock_at()');
select throws_ok($$select generate_season_runs(gen_random_uuid())$$, '42501', null, 'anon cannot call generate_season_runs()');
select throws_ok($$select set_holiday_active(current_date, true)$$,  '42501', null, 'anon cannot call set_holiday_active()');
select throws_ok($$select update_my_name('Hacker')$$,            '42501', null, 'anon cannot call update_my_name()');
select throws_ok($$select delete_my_account()$$,                 '42501', null, 'anon cannot call delete_my_account()');
select throws_ok($$select fill_holidays(2027)$$,                 '42501', null, 'anon cannot call fill_holidays()');
select throws_ok($$select nth_monday(2027, 2, 3)$$,              '42501', null, 'anon cannot call nth_monday()');
select throws_ok($$select * from ontario_monday_holidays(2027)$$, '42501', null, 'anon cannot call ontario_monday_holidays()');

select * from finish();
rollback;
