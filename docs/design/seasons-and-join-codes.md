# Seasons and join codes — design handoff (Version 3)

**Problem this solves:** today anyone who signs in with Google is automatically part of the current season. Instead, an account only lets you sign in. To see runs, RSVP or be placed on a team, a player must be a **member of the current season**, which they get by entering that season's join code (or by an admin adding them).

Mockups: `screens/12-join-season.dc.html` (player) and `screens/13-admin-seasons.dc.html` (admin). Both have `theme` (light/dark) and `state` props; Seasons also has `overlay` (none / new / end). Styling follows Version 3: curved `card-bar` left edge, green wash, ball watermark, the V3 dark neutrals, the floating bottom nav.

## How it works

1. **Admins create a season.** New season sheet: Indoor/Outdoor, name (auto, e.g. "Outdoor 2027"), start and end dates, start time, address, pass price. Values are prefilled from the last season of the same type. Runs are still created from the Runs tab.
2. **Each season has its own join code**: 6 characters shown as `KX7 42P` (no 0/O/1/I), plus a link `/join/KX742P` that fills the code in. Admins can copy it, share the link, make a new code (old one stops working), or turn the code off.
3. **Players join once per season.** Joining creates their `season_members` row and their unpaid season pass for that season.
4. **Optional approval.** Setting "Approve new players" (on by default): someone who was never a member of any past season lands as *waiting* until an admin approves or declines. Returning players (member of any earlier season) go straight in.
5. **Invite last season's players.** One tap notifies everyone from the previous season who hasn't joined yet, with the code. They still tap Join.
6. **Upcoming → current → ended.** A new season starts as *upcoming* so people can join before it begins; it becomes *current* on its start date. Only one season is current at a time (keeps the existing `one_current_season` rule).
7. **Ending a season** (confirm dialog): runs after today are deleted; past runs, teams and passes are kept; the code stops working; members can't RSVP until they join the next season.
8. **What carries over between seasons:** the account, stars, position, Plays, admin role, history. What doesn't: membership and passes.

## Screens

### 12 Join a season (player, no bottom nav)
Shown after sign-in to anyone who isn't an active member of the current or upcoming season. Logo + "FirstTouch" and a "Sign out" link at the top, "Hi {first name}", a heading and intro line, then a V3 card.
- **enter:** "Join a season" / "Runs are for season members. Enter the 6-character code an admin gave you." Card label "SEASON CODE", six 56-tall boxes in two groups of three with a dash between, active box has a 2px `brand` border. "Join season" button (disabled look until 6 characters). Under the card: link icon + "Got an invite link? Opening it fills in the code for you." Footer: "Signed in as {email}".
- **error:** boxes get a `red-row-border` border and the line "That code doesn't match an open season." (`red-fg`, role=alert). Intro: "Check the code with an admin. Codes change each season."
- **pending:** heading "Almost there", a card with an amber curved bar, chip "Waiting for an admin" (`amber-bg`/`amber-fg`), season name, "Your request is in. You'll get a notification when an admin approves you, usually within a day.", and the request time.
- **joined:** heading "You're in", card with chip "You're a member" (`ok-bg`/`ok-fg`), season name and dates, run days and time, address, "Season pass $120 · pay an admin", and a full-width "See this weekend's runs →" button to Home.
- **returning** (prop `returning`): same as enter but heading "{Last season} has ended" and intro "Thanks for playing. Enter the code for the next season to keep RSVPing. Your stars and position carry over."

### 13 Admin · Seasons
A new **Seasons** tab in the admin section pills, order: Players · Runs · Seasons · Team builder · Passes (the pill row scrolls sideways).
- Header row "CURRENT SEASON" + a "+ New season" pill button.
- **Season card** (V3 curved bar + wash + ball): status chip ("Current · open to join" in `ok` colours; "Upcoming"; "Ended {date}" in `locked` colours), name at 30px/800, dates and run count, and three tiles: members · waiting (amber number) · paid.
- **Join code card:** "JOIN CODE", the code at 34px/800 with wide tracking (muted when off), the link or "Code is off · nobody new can join", a "New code" pill, "Copy code" (outline) and "Share link" (filled) buttons, then two switches: "Code is on" and "Approve new players" with one-line notes.
- **Waiting for approval · {n}** with "Approve all": rows with avatar, name, a "New" chip (amber), "Joined with code · {when}", a decline (×) and an approve (✓) square button.
- **Invite last season's players:** icon, title, "{n} players from {last season} haven't joined yet. Sends them the code.", "Send" pill.
- **Past seasons:** rows with name, dates and member count.
- **End {season}** button: red outline, opens the End season dialog.
- **state = ended:** heading "LAST SEASON", grey bar, and a dashed card "No season is open" with "Start the next season".
- **overlay = new:** bottom sheet "New season" — Indoor/Outdoor segmented control, Name, Start/End date, Start time + Address, Pass price, a checked "Invite {last season} players" box with explanation, the "Upcoming until its start date" note, and "Create {name}".
- **overlay = end:** centred dialog "End {season}?" with the three bullet consequences, Cancel and a red "End season".

## Data model (proposal — reconcile with the existing schema)
- `seasons`: add `status` (`upcoming` | `current` | `ended`), `join_code` (unique, nullable when off), `code_enabled` boolean, `requires_approval` boolean (default true).
- `season_members`: `season_id`, `player_id`, `status` (`waiting` | `active` | `removed`), `joined_via` (`code` | `invite` | `admin`), `joined_at`, `approved_by`, unique (`season_id`, `player_id`).
- Joining goes through an RPC (e.g. `join_season(code)`) that checks the code, decides active vs waiting, and creates the pass row in one transaction. Rate-limit wrong codes.
- RLS: reading runs/RSVPs/teams for a season and creating/updating an RSVP require an **active** membership in that run's season. Admins bypass as today.
- Sign-in stays open; routing sends non-members to Join a season.
