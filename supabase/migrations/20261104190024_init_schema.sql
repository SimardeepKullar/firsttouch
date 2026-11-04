-- =============================================================================
-- FirstTouch: initial schema (Foundation milestone)
-- Source of truth: docs/spec.md
-- Not included yet (later milestones): publish_teams, Edge Functions, push
-- sending, pg_cron jobs.
-- =============================================================================


-- =============================================================================
-- 1. Enums
-- =============================================================================

create type user_role   as enum ('player', 'admin');
create type position    as enum ('attack', 'defend');
create type season_type as enum ('indoor', 'outdoor');
create type run_status  as enum ('open', 'locked', 'published', 'cancelled');
create type team_color  as enum ('blue', 'yellow', 'red');


-- =============================================================================
-- 2. Tables
-- =============================================================================

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null,
  email       text not null unique,
  role        user_role not null default 'player',
  plays       boolean not null default true,  -- false for an admin who only manages
  stars       smallint not null default 3 check (stars between 1 and 5),
  position    "position" not null default 'attack',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table seasons (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                 -- e.g. 'Indoor 2026-27'
  type        season_type not null,
  starts_on   date,                          -- real dates still to be supplied
  ends_on     date,
  default_location   text not null,
  default_start_time time not null,
  pass_price_cents   integer not null default 12000,  -- placeholder $120
  is_current  boolean not null default false
);
create unique index one_current_season on seasons (is_current) where is_current;

create table holidays (                      -- long-weekend Mondays that become runs
  holiday_date date primary key,             -- always a Monday
  name        text not null,                 -- e.g. 'Family Day'
  active      boolean not null default true  -- false = an admin switched it off
);

create table season_passes (
  season_id   uuid references seasons on delete cascade,
  player_id   uuid references profiles on delete cascade,
  paid        boolean not null default false,
  amount_cents integer,
  method      text,                          -- 'e-transfer', 'cash', later 'stripe'
  marked_by   uuid references profiles,
  marked_at   timestamptz,
  primary key (season_id, player_id)
);

create table runs (
  id          uuid primary key default gen_random_uuid(),
  season_id   uuid not null references seasons on delete cascade,
  run_date    date not null unique,          -- Toronto local date
  start_time  time not null,                 -- copied from the season, admin can edit
  location    text not null,                 -- copied from the season, admin can edit
  status      run_status not null default 'open',
  team_count_override smallint check (team_count_override in (2, 3)),
  published_at timestamptz
);

create table rsvps (
  run_id      uuid references runs on delete cascade,
  player_id   uuid references profiles on delete cascade,
  going       boolean not null,
  responded_at timestamptz not null default now(),
  morning_of  boolean not null default false, -- set by trigger
  primary key (run_id, player_id)
);

create table team_assignments (
  run_id      uuid references runs on delete cascade,
  player_id   uuid references profiles on delete cascade,
  team        team_color not null,
  slot        smallint not null,             -- order within the team, for the field layout
  primary key (run_id, player_id)
);

create table job_errors (                    -- admin-visible log of failed jobs and pushes
  id          bigint generated always as identity primary key,
  source      text not null,                 -- 'send-push', 'rsvp-reminder', ...
  detail      text,
  created_at  timestamptz not null default now()
);

create table push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references profiles on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now()
);


-- =============================================================================
-- 3. Helper functions: admin check, lock time
-- =============================================================================

create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- True when the caller's profile has plays = true. Security definer because
-- players cannot read profiles directly, yet the RSVP policies need this check.
create function my_plays() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and plays);
$$;

-- RSVPs close 1 hour before the run's start, Toronto time (DST-safe)
create function run_lock_at(r runs) returns timestamptz
language sql stable as $$
  select ((r.run_date + r.start_time) at time zone 'America/Toronto') - interval '1 hour';
$$;


-- =============================================================================
-- 4. Holiday functions (long-weekend Mondays)
-- =============================================================================

-- nth Monday of a month
create function nth_monday(y int, m int, n int) returns date
language sql immutable as $$
  select make_date(y, m, 1)
         + ((8 - extract(isodow from make_date(y, m, 1))::int) % 7)
         + 7 * (n - 1);
$$;

-- every Ontario holiday that lands on (or is observed on) a Monday in year y
create function ontario_monday_holidays(y int)
returns table (holiday_date date, name text)
language sql immutable as $$
  with fixed(d, label) as (values
    (make_date(y, 1, 1),   'New Year''s Day'),
    (make_date(y, 7, 1),   'Canada Day'),
    (make_date(y, 12, 25), 'Christmas Day'),
    (make_date(y, 12, 26), 'Boxing Day')
  ),
  observed as (
    select case
      when label = 'Christmas Day' and extract(isodow from d) in (6, 7) then make_date(y, 12, 27)
      when label = 'Boxing Day'    and extract(isodow from d) in (6, 7) then make_date(y, 12, 28)
      when extract(isodow from d) = 6 then d + 2   -- Saturday: observed Monday
      when extract(isodow from d) = 7 then d + 1   -- Sunday: observed Monday
      else d end as d, label
    from fixed
  )
  select d, label from observed where extract(isodow from d) = 1
  union all
  select * from (values
    (nth_monday(y, 2, 3),  'Family Day'),
    (make_date(y, 5, 24) - (extract(isodow from make_date(y, 5, 24))::int - 1), 'Victoria Day'),
    (nth_monday(y, 8, 1),  'Civic Holiday'),
    (nth_monday(y, 9, 1),  'Labour Day'),
    (nth_monday(y, 10, 2), 'Thanksgiving')
  ) v(d, label);
$$;

-- add a year's dates without touching ones admins already edited
create function fill_holidays(y int) returns void
language sql as $$
  insert into holidays (holiday_date, name)
  select holiday_date, name from ontario_monday_holidays(y)
  on conflict (holiday_date) do nothing;
$$;


-- =============================================================================
-- 5. Season run list: generate_season_runs, set_holiday_active
-- =============================================================================

-- Admin-only. Creates a run for every Saturday, Sunday and active holiday
-- Monday between starts_on and ends_on; skips dates that already have a run.
-- Returns the number of runs created.
create function generate_season_runs(season_id uuid) returns integer
language plpgsql security definer set search_path = public as $$
declare
  s       seasons%rowtype;
  y       int;
  created integer;
begin
  if not is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  select * into s from seasons where id = generate_season_runs.season_id;
  if not found then
    raise exception 'season not found';
  end if;
  if s.starts_on is null or s.ends_on is null then
    raise exception 'season needs starts_on and ends_on before runs can be created';
  end if;
  if s.ends_on < s.starts_on then
    raise exception 'season ends_on is before starts_on';
  end if;

  for y in extract(year from s.starts_on)::int .. extract(year from s.ends_on)::int loop
    perform fill_holidays(y);
  end loop;

  insert into runs (season_id, run_date, start_time, location)
  select s.id, d::date, s.default_start_time, s.default_location
  from generate_series(s.starts_on::timestamp, s.ends_on::timestamp, interval '1 day') d
  where extract(isodow from d) in (6, 7)
     or (extract(isodow from d) = 1
         and exists (select 1 from holidays h
                     where h.holiday_date = d::date and h.active))
  on conflict (run_date) do nothing;

  get diagnostics created = row_count;
  return created;
end;
$$;

-- Admin-only. Switches a holiday Monday on or off. On: adds its run if the
-- date falls inside a season that already has runs. Off: deletes that run.
create function set_holiday_active(holiday_date date, active boolean) returns void
language plpgsql security definer set search_path = public as $$
declare
  s seasons%rowtype;
begin
  if not is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  update holidays h
     set active = set_holiday_active.active
   where h.holiday_date = set_holiday_active.holiday_date;
  if not found then
    raise exception 'holiday % not found', set_holiday_active.holiday_date;
  end if;

  if set_holiday_active.active then
    select * into s
    from seasons se
    where set_holiday_active.holiday_date between se.starts_on and se.ends_on
      and exists (select 1 from runs r where r.season_id = se.id)
    order by se.starts_on
    limit 1;

    if found then
      insert into runs (season_id, run_date, start_time, location)
      values (s.id, set_holiday_active.holiday_date, s.default_start_time, s.default_location)
      on conflict (run_date) do nothing;
    end if;
  else
    delete from runs r where r.run_date = set_holiday_active.holiday_date;
  end if;
end;
$$;


-- =============================================================================
-- 6. Triggers: morning-of flag, profile column guard, new-user profile
-- =============================================================================

-- When going is true, morning_of = the response's Toronto date equals the run
-- date; a later "no" clears it. A yes that follows a no (going flips) counts as
-- a fresh response, so responded_at is refreshed unless the caller set it.
create function set_morning_of() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE'
     and new.going is distinct from old.going
     and new.responded_at is not distinct from old.responded_at then
    new.responded_at := now();
  end if;

  if new.going then
    new.morning_of :=
      (new.responded_at at time zone 'America/Toronto')::date
      = (select r.run_date from runs r where r.id = new.run_id);
  else
    new.morning_of := false;
  end if;
  return new;
end;
$$;

create trigger rsvps_set_morning_of
  before insert or update on rsvps
  for each row execute function set_morning_of();

-- Only admins change role, plays, stars or position. Calls with no signed-in
-- user (SQL editor, service role, seed) are trusted, which is how the first
-- admin is set by hand in the dashboard.
create function guard_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not is_admin() then
    if new.role     is distinct from old.role
    or new.plays    is distinct from old.plays
    or new.stars    is distinct from old.stars
    or new.position is distinct from old.position then
      raise exception 'only admins can change role, plays, stars or position'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_columns
  before update on profiles
  for each row execute function guard_profile_columns();

-- Creates the profile (3 stars, attack, plays) from the Google name and email.
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
             nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
             split_part(coalesce(new.email, ''), '@', 1),
             'Player'),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- =============================================================================
-- 7. Player self-service functions
-- =============================================================================

-- Changes the caller's full_name only.
create function update_my_name(new_name text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if nullif(trim(new_name), '') is null then
    raise exception 'name cannot be empty';
  end if;
  update profiles set full_name = trim(new_name) where id = auth.uid();
end;
$$;

-- Deletes the caller's auth user; profile, RSVPs, passes etc. cascade.
create function delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;


-- =============================================================================
-- 8. Views
-- =============================================================================

-- Who is in the group: names and positions only, never stars.
-- Owner-rights view, so players can list others while the profiles table stays admin-only.
create view player_directory as
select id, full_name, position, plays, (id = auth.uid()) as is_me
from profiles
where active;

-- Who is going to a run, with flags. Stars and the unpaid flag are admin-only.
create view run_roster as
select r.run_id, r.player_id, p.full_name, p.position,
       case when is_admin() then p.stars end          as stars,
       r.responded_at,
       r.morning_of                                   as flag_morning_of,
       case when is_admin()
            then not coalesce(sp.paid, false) end     as flag_unpaid
from rsvps r
join runs ru     on ru.id = r.run_id
join profiles p  on p.id = r.player_id
left join season_passes sp
       on sp.season_id = ru.season_id and sp.player_id = r.player_id
where r.going and p.plays;


-- =============================================================================
-- 9. Row-level security
-- =============================================================================

alter table profiles           enable row level security;
alter table seasons            enable row level security;
alter table holidays           enable row level security;
alter table season_passes      enable row level security;
alter table runs               enable row level security;
alter table rsvps              enable row level security;
alter table team_assignments   enable row level security;
alter table job_errors         enable row level security;
alter table push_subscriptions enable row level security;

-- profiles: admin only (players use player_directory / update_my_name)
create policy profiles_admin_all on profiles
  for all to authenticated using (is_admin()) with check (is_admin());

-- seasons, holidays: everyone reads, admin writes
create policy seasons_read on seasons
  for select to authenticated using (true);
create policy seasons_admin_all on seasons
  for all to authenticated using (is_admin()) with check (is_admin());

create policy holidays_read on holidays
  for select to authenticated using (true);
create policy holidays_admin_all on holidays
  for all to authenticated using (is_admin()) with check (is_admin());

-- season_passes: own pass; admin everything
create policy season_passes_read_own on season_passes
  for select to authenticated using (player_id = auth.uid());
create policy season_passes_admin_all on season_passes
  for all to authenticated using (is_admin()) with check (is_admin());

-- runs: everyone reads, admin writes
create policy runs_read on runs
  for select to authenticated using (true);
create policy runs_admin_all on runs
  for all to authenticated using (is_admin()) with check (is_admin());

-- rsvps: everyone can read (needed so Realtime delivers count changes to every
-- open screen; the table holds no stars or payment data). A player writes only
-- their own row, while the run is open and before the lock time, and only if
-- their profile has plays = true. Admin everything, including after lock.
create policy rsvps_read on rsvps
  for select to authenticated using (true);
create policy rsvps_insert_own on rsvps
  for insert to authenticated
  with check (
    player_id = auth.uid()
    and my_plays()
    and exists (select 1 from runs r
                where r.id = rsvps.run_id
                  and r.status = 'open'
                  and now() < run_lock_at(r))
  );
create policy rsvps_update_own on rsvps
  for update to authenticated
  using (
    player_id = auth.uid()
    and my_plays()
    and exists (select 1 from runs r
                where r.id = rsvps.run_id
                  and r.status = 'open'
                  and now() < run_lock_at(r))
  )
  with check (
    player_id = auth.uid()
    and my_plays()
    and exists (select 1 from runs r
                where r.id = rsvps.run_id
                  and r.status = 'open'
                  and now() < run_lock_at(r))
  );
-- An admin can write any RSVP, but never one for a profile with plays = false
-- (a manage-only admin like Coach cannot RSVP).
create policy rsvps_admin_all on rsvps
  for all to authenticated
  using (is_admin())
  with check (is_admin()
              and exists (select 1 from profiles pr
                          where pr.id = rsvps.player_id and pr.plays));

-- team_assignments: players see published runs only; admin everything
create policy team_assignments_read_published on team_assignments
  for select to authenticated
  using (exists (select 1 from runs r
                 where r.id = team_assignments.run_id and r.status = 'published'));
create policy team_assignments_admin_all on team_assignments
  for all to authenticated using (is_admin()) with check (is_admin());

-- push_subscriptions: own (read, insert, delete); admin reads all
create policy push_subscriptions_read_own on push_subscriptions
  for select to authenticated using (player_id = auth.uid());
create policy push_subscriptions_insert_own on push_subscriptions
  for insert to authenticated with check (player_id = auth.uid());
create policy push_subscriptions_delete_own on push_subscriptions
  for delete to authenticated using (player_id = auth.uid());
create policy push_subscriptions_admin_read on push_subscriptions
  for select to authenticated using (is_admin());

-- job_errors: admin reads
create policy job_errors_admin_read on job_errors
  for select to authenticated using (is_admin());


-- =============================================================================
-- 10. Grants (nothing to anon; authenticated gets only what the policies allow)
-- =============================================================================

revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant select, update                 on profiles           to authenticated;
grant select, insert, update, delete on seasons            to authenticated;
grant select, insert, update, delete on holidays           to authenticated;
grant select, insert, update, delete on season_passes      to authenticated;
grant select, insert, update, delete on runs               to authenticated;
grant select, insert, update, delete on rsvps              to authenticated;
grant select, insert, update, delete on team_assignments   to authenticated;
grant select, insert, delete         on push_subscriptions to authenticated;
grant select                         on job_errors         to authenticated;

grant select on player_directory, run_roster to authenticated;

-- Functions the app (or RLS policies running as the caller) calls.
grant execute on function is_admin()                          to authenticated;
grant execute on function my_plays()                          to authenticated;
grant execute on function run_lock_at(runs)                   to authenticated;
grant execute on function generate_season_runs(uuid)          to authenticated;
grant execute on function set_holiday_active(date, boolean)   to authenticated;
grant execute on function update_my_name(text)                to authenticated;
grant execute on function delete_my_account()                 to authenticated;


-- =============================================================================
-- 11. Realtime
-- =============================================================================

alter publication supabase_realtime add table rsvps;
