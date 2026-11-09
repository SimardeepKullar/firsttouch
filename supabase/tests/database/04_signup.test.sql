-- Area 4: the sign-up trigger (handle_new_user). A new auth.users row gets a
-- profile named from Google's full_name, falling back to name, then the email
-- prefix, then 'Player'.
begin;
select plan(5);

select tests.create_user('00000000-0000-0000-0000-000000000f01', 'gina@test.local', '{"full_name":"  Gina Full  ","name":"Gina Name"}');
select tests.create_user('00000000-0000-0000-0000-000000000f02', 'hal@test.local',  '{"full_name":"   ","name":"Hal Name"}');
select tests.create_user('00000000-0000-0000-0000-000000000f03', 'ivy.prefix@test.local');
select tests.create_user('00000000-0000-0000-0000-000000000f04', null);

select is(
  (select full_name from profiles where id = '00000000-0000-0000-0000-000000000f01'),
  'Gina Full',
  'uses full_name (trimmed) when present'
);
select is(
  (select full_name from profiles where id = '00000000-0000-0000-0000-000000000f02'),
  'Hal Name',
  'falls back to name when full_name is blank'
);
select is(
  (select full_name from profiles where id = '00000000-0000-0000-0000-000000000f03'),
  'ivy.prefix',
  'falls back to the email prefix when there is no name'
);
select is(
  (select full_name from profiles where id = '00000000-0000-0000-0000-000000000f04'),
  'Player',
  'falls back to Player when there is no name and no email'
);
select results_eq(
  $$select email, role::text, plays, stars, position::text from profiles where id = '00000000-0000-0000-0000-000000000f01'$$,
  $$values ('gina@test.local', 'player', true, 3::smallint, 'attack')$$,
  'new profile gets the email and the defaults: player, plays, 3 stars, attack'
);

select * from finish();
rollback;
