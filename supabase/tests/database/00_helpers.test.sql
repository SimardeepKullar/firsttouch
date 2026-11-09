-- Shared helpers for every database test. Lives in its own schema, "tests",
-- so it can never clash with the app's tables or functions in "public".
-- Files run in name order, so this one (00_) runs first and the helpers exist
-- for the rest. The helpers are created outside the test transaction so they
-- stay. That's fine because these tests only ever run against the local or
-- CI database, never dev or prod (migrations don't include this folder).

create schema if not exists tests;

-- Create a sign-in user. Inserting into auth.users fires the real
-- handle_new_user trigger, which creates their profile (player, plays, 3 stars).
create or replace function tests.create_user(
  user_id uuid,
  email text,
  meta jsonb default '{}'
) returns uuid
language sql as $$
  insert into auth.users (id, email, raw_user_meta_data)
  values (user_id, email, meta)
  returning id;
$$;

-- Pretend to be a signed-in user for the rest of the current transaction.
create or replace function tests.act_as(user_id uuid) returns void
language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', user_id, 'role', 'authenticated')::text,
    true
  );
end;
$$;

-- Pretend to be a signed-out visitor.
create or replace function tests.act_as_anon() returns void
language plpgsql as $$
begin
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
end;
$$;

-- To go back to being the database owner (to set up or check data), run the
-- plain statement `reset role;`. A restricted role can't call a function to
-- promote itself, so it has to be a statement. Always `reset role;` before
-- switching from one acting user to another.
--
-- `reset role` keeps the last user's claims, so auth.uid() still returns that
-- user. Do all set-up that touches profiles before the first act_as, so the
-- column guard sees no signed-in user and allows it.

begin;
select plan(4);

select has_function('tests', 'act_as', array['uuid'], 'helper act_as exists');

select tests.create_user('00000000-0000-0000-0000-0000000000a1', 'helper@test.local');
select is(
  (select email from profiles where id = '00000000-0000-0000-0000-0000000000a1'),
  'helper@test.local',
  'create_user makes a profile through the sign-up trigger'
);

select tests.act_as('00000000-0000-0000-0000-000000000001');
select is(auth.uid(), '00000000-0000-0000-0000-000000000001'::uuid, 'act_as makes auth.uid() return that user');

reset role;
select tests.act_as_anon();
select is(auth.uid(), null, 'act_as_anon makes auth.uid() null');

select * from finish();
rollback;
