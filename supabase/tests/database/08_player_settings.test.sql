begin;
select plan(13);

-- Set-up first, as the database owner, before anyone is "signed in".
select tests.create_user('00000000-0000-0000-0000-0000000000e1', 'settings1@test.local');
select tests.create_user('00000000-0000-0000-0000-0000000000e2', 'settings2@test.local');
select tests.create_user('00000000-0000-0000-0000-0000000000e3', 'settings3@test.local');

-- Table exists, and RLS is on
select has_table('public', 'player_settings', 'player_settings table exists');
select ok(
  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.player_settings')), false),
  'RLS is on for player_settings'
);
-- Player e1 can save and read their own row
select tests.act_as('00000000-0000-0000-0000-0000000000e1');
select lives_ok(
  $$insert into player_settings (player_id, theme) values ('00000000-0000-0000-0000-0000000000e1', 'dark')$$,
  'a player can insert their own settings row'
);
select is(
  (select theme::text from player_settings where player_id = '00000000-0000-0000-0000-0000000000e1'),
  'dark',
  'a player can read their own row'
);
select lives_ok(
  $$update player_settings set theme = 'system' where player_id = '00000000-0000-0000-0000-0000000000e1'$$,
  'a player can update their own row'
);
select is(
  (select theme::text from player_settings where player_id = '00000000-0000-0000-0000-0000000000e1'),
  'system',
  'the update stuck'
);

-- The default is light
reset role;
insert into player_settings (player_id) values ('00000000-0000-0000-0000-0000000000e3');
select is(
  (select theme::text from player_settings where player_id = '00000000-0000-0000-0000-0000000000e3'),
  'light',
  'theme defaults to light'
);

-- Player e1 cannot touch anyone else's row
select tests.act_as('00000000-0000-0000-0000-0000000000e1');
select is_empty(
  $$select 1 from player_settings where player_id = '00000000-0000-0000-0000-0000000000e3'$$,
  'a player cannot read someone else''s row'
);
select throws_ok(
  $$insert into player_settings (player_id, theme) values ('00000000-0000-0000-0000-0000000000e2', 'dark')$$,
  '42501', null, 'a player cannot insert a row for someone else'
);
select is_empty(
  $$update player_settings set theme = 'dark' where player_id = '00000000-0000-0000-0000-0000000000e3' returning 1$$,
  'a player cannot update someone else''s row'
);
select throws_ok(
  $$update player_settings set theme = 'purple' where player_id = '00000000-0000-0000-0000-0000000000e1'$$,
  '22P02', null, 'an unknown theme is rejected'
);

-- anon gets nothing
reset role;
select tests.act_as_anon();
select throws_ok(
  $$select 1 from player_settings$$,
  '42501', null, 'anon cannot read player_settings'
);

-- Deleting an account removes its settings row
reset role;
select tests.act_as('00000000-0000-0000-0000-0000000000e1');
select delete_my_account();
reset role;
select is_empty(
  $$select 1 from player_settings where player_id = '00000000-0000-0000-0000-0000000000e1'$$,
  'the settings row is deleted with the account'
);

select * from finish();
rollback;
