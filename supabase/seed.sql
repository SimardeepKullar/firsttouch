-- Local development seed data (runs on `supabase db reset`). Never applied to remote.

-- Seasons. The dates are SAMPLE dates, not the real season dates.
insert into seasons (name, type, starts_on, ends_on, default_location, default_start_time, is_current)
values
  ('Indoor 2026-27', 'indoor',  '2026-11-07', '2027-04-25',
   '7855 Finch Ave W, Brampton, ON L6T 0B2', '06:30', true),
  ('Outdoor 2027',   'outdoor', '2027-05-01', '2027-10-31',
   '32 Kennedy Rd N, Brampton, ON L6V 1X4',  '07:00', false);

-- Holiday Mondays
select fill_holidays(y) from generate_series(2026, 2028) y;

-- Test users. Inserting into auth.users fires handle_new_user(), which creates
-- the profiles. Password for all of them is "password123" (local only).
create temporary table seed_users (
  n int, full_name text, email text, is_admin boolean, plays boolean,
  stars smallint, position "position"
) on commit drop;

insert into seed_users values
  (1,  'John',  'john@example.com',  true,  true,  4, 'attack'),
  (2,  'Sim',   'sim@example.com',   true,  true,  3, 'defend'),
  (3,  'Coach', 'coach@example.com', true,  false, 3, 'attack'),
  (4,  'Aiden Brooks',   'player01@example.com', false, true, 5, 'attack'),
  (5,  'Ben Carter',     'player02@example.com', false, true, 4, 'defend'),
  (6,  'Chris Dalton',   'player03@example.com', false, true, 3, 'attack'),
  (7,  'Dev Patel',      'player04@example.com', false, true, 2, 'defend'),
  (8,  'Eli Moreno',     'player05@example.com', false, true, 1, 'attack'),
  (9,  'Farid Haddad',   'player06@example.com', false, true, 4, 'attack'),
  (10, 'Gabe Nguyen',    'player07@example.com', false, true, 5, 'defend'),
  (11, 'Hassan Ali',     'player08@example.com', false, true, 3, 'defend'),
  (12, 'Ivan Petrov',    'player09@example.com', false, true, 2, 'attack'),
  (13, 'Jamal Wright',   'player10@example.com', false, true, 1, 'defend'),
  (14, 'Kofi Mensah',    'player11@example.com', false, true, 4, 'defend'),
  (15, 'Liam Gallagher', 'player12@example.com', false, true, 3, 'attack'),
  (16, 'Marco Rossi',    'player13@example.com', false, true, 5, 'attack'),
  (17, 'Nate Singh',     'player14@example.com', false, true, 2, 'defend'),
  (18, 'Omar Farouk',    'player15@example.com', false, true, 3, 'attack'),
  (19, 'Pablo Reyes',    'player16@example.com', false, true, 4, 'attack'),
  (20, 'Quinn Murphy',   'player17@example.com', false, true, 1, 'attack'),
  (21, 'Raj Kapoor',     'player18@example.com', false, true, 3, 'defend'),
  (22, 'Sam Okafor',     'player19@example.com', false, true, 2, 'attack'),
  (23, 'Tariq Khan',     'player20@example.com', false, true, 5, 'defend'),
  (24, 'Uri Cohen',      'player21@example.com', false, true, 4, 'defend'),
  (25, 'Victor Lam',     'player22@example.com', false, true, 3, 'attack'),
  (26, 'Wes Tanaka',     'player23@example.com', false, true, 2, 'defend'),
  (27, 'Xavi Costa',     'player24@example.com', false, true, 1, 'defend'),
  (28, 'Yusuf Demir',    'player25@example.com', false, true, 4, 'attack');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  '00000000-0000-0000-0000-000000000000',
  ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  'authenticated', 'authenticated', email,
  crypt('password123', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', full_name),
  now(), now(), '', '', '', ''
from seed_users;

insert into auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id::text, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', now(), now(), now()
from auth.users u;

-- Roles, plays, stars and position (no signed-in user, so the column guard allows it)
update profiles p
   set role     = case when s.is_admin then 'admin'::user_role else 'player'::user_role end,
       plays    = s.plays,
       stars    = s.stars,
       position = s.position
  from seed_users s
 where p.email = s.email;
