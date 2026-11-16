-- player_settings: one row per player, for choices that follow them across devices.
-- Today: the Appearance choice. T-32 adds the notification switches.

create type theme_mode as enum ('light', 'dark', 'system');

create table player_settings (
  player_id  uuid primary key references profiles on delete cascade,
  theme      theme_mode not null default 'light'
);

alter table player_settings enable row level security;

-- Own row only: read, insert, update. Nobody (not even an admin) reads other rows.
create policy player_settings_read_own on player_settings
  for select to authenticated using (player_id = auth.uid());
create policy player_settings_insert_own on player_settings
  for insert to authenticated with check (player_id = auth.uid());
create policy player_settings_update_own on player_settings
  for update to authenticated using (player_id = auth.uid()) with check (player_id = auth.uid());

-- Nothing to anon; signed-in players get only what the policies allow.
revoke all on player_settings from anon, authenticated;
grant select, insert, update on player_settings to authenticated;
