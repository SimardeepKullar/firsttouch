# Groups, seasons and join codes — design handoff (Version 3)

**Problem this solves:** today anyone who signs in with Google is automatically part of the current season. Now an account only lets you sign in. To see runs, RSVP or be placed on a team, a player must be a **member of the current season** of a group. They become a member by entering that season's join code, or by an admin adding them.

All screens follow Version 3: curved `card-bar` left edge, green wash, ball watermark, the V3 dark neutrals and the floating bottom nav. Every screen is 390 wide; most are 844 tall, and longer ones (Home, Seasons) are drawn as a full scroll. The floating bottom nav is 76 tall on every screen, in light and dark (`theme` prop).

## How it works

1. **Groups sit above seasons.** A group (e.g. "Brampton Weekend Football") owns its seasons and its admins. Stars, position and Plays are set **per group**. Whoever creates a group is its first admin. Players never see or pick a group or a season: once they're in, the app always opens straight to Home. For now everyone is in one group, so there's no group switcher and no group labels on player screens.
2. **First screen for someone in no season** (12 Join a season) offers two paths: **Join a season** with a code (main path, most prominent) or **Start your own runs** (secondary, below an "OR" divider).
3. **Starting your own runs** (14): name the group and set up its first season. You become its admin and get the season's join code to share. **An account can create at most 3 groups**; after that the option is disabled (12 `groupLimit`) and the form shows an error (14 `step = error`).
4. **Admins create later seasons** from 13 Admin · Seasons: Indoor/Outdoor, name (auto, e.g. "Outdoor 2027"), start and end dates, start time, address, pass price, prefilled from the last season of the same type. Runs are still created from the Runs tab.
5. **Each season has its own join code**: 6 characters shown as `KX7 42P`, plus a link `/join/KX742P` that fills the code in. Admins can copy it, share the link, make a new code (the old one stops working), or turn the code off.
6. **Players join once per season.** Joining creates their unpaid season pass. After a successful join they go **straight to Home**, where a one-time welcome popup shows the season details (02, `welcome`).
7. **Optional approval.** "Approve new players" (on by default): someone who was never a member of any earlier season of this group waits until an admin approves or declines them. Returning players go straight in.
8. **Invite last season's players.** One tap notifies everyone from the previous season who hasn't joined yet, with the code. They still tap Join.
9. **Upcoming → current → ended.** A new season that starts today or earlier is *current* straight away. Otherwise it's *upcoming*: people can join early, and it becomes *current* on its start date. A group can have a current and an upcoming season at the same time, or only an upcoming one. One current season per group. Each season has its own join code.
10. **Ending a season** (confirm dialog): runs after today are deleted; past runs, teams and passes are kept; the code stops working; members can't RSVP until they join the next season.
11. **Admins are managed per group** from the player sheet in 06 Admin · Players: Make admin, Remove admin, Transfer admin. A group always keeps at least one admin.
12. **Admins can remove a player from the group** (player sheet › "Remove from {group}"). The player leaves the current season and can't RSVP; their history stays. They can rejoin with a code if an admin approves them.
13. **What carries over between seasons:** the account, the group's stars, position, Plays and admin roles, and history. What doesn't: season membership and passes.

## Screens and props

### 12 Join a season (`12-join-season.dc.html`)
Props: `theme` (light/dark), `state` (`enter` | `error` | `pending`), `returning` (boolean), `groupLimit` (boolean). No bottom nav.
Logo + "FirstTouch" and a "Sign out" link at the top, "Hi {first name}", a heading and intro line, then a V3 card.
- **enter:** "Join a season" / "Runs are for season members. Enter the 6-character code an admin gave you." Card label "SEASON CODE", six 56-tall boxes in two groups of three with a dash between; the active box has a 2px `brand` border. "Join season" button (disabled look until 6 characters). Under the card: link icon + "Got an invite link? Opening it fills in the code for you."
- **Start your own runs** (shown with enter, error and returning): an "OR" divider, then a dashed-outline card with a `brand-soft` plus icon, "Start your own runs", "Organise your own games and invite players" and a chevron. Opens 14.
- **groupLimit:** the Start your own runs card is disabled: `surface-2` background, solid border, `muted-2` text and icon, no chevron, and the line "You've created 3 groups, the most allowed. No more groups can be created." under its title.
- **error:** boxes get a `red-row-border` border and the line "That code doesn't match an open season." (`red-fg`, role=alert). Intro: "Check the code with an admin. Codes change each season."
- **pending:** heading "Almost there", a card with an amber curved bar, chip "Waiting for an admin" (`amber-bg` / `amber-fg`), season name, "Your request is in. You'll get a notification when an admin approves you, usually within a day.", and the request time. No Start-your-own option here.
- **returning:** as enter, but heading "{last season} has ended" and intro "Thanks for playing. Enter the code for the next season to keep RSVPing. Your stars and position carry over."
- Footer: "Signed in as {email}".
- There is **no joined state**: a successful join goes straight to Home with the welcome popup.

### 14 Start your own runs (`14-start-your-runs.dc.html`) — new
Props: `theme`, `step` (`form` | `error` | `done`). No bottom nav.
- **form:** a "← Back" text link (to 12, styled like Run detail's "← Home"), heading "Start your own runs", intro "Create a group and its first season. You'll be its admin and get a code to share." One card: Group name; a divider and "FIRST SEASON" label; the Indoor/Outdoor segmented control; Season name (auto-filled); Start date + End date; Start time + Pass price; Address. Values prefill like the New season sheet. Full-width "Create group" button below the card.
- **error:** the form with field errors in the red style (`red-row-border` border, `red-fg` 13px/600 text under the field): "Give your group a name" under an empty Group name and "End date must be after the start date" under End date. Above "Create group", an alert box (`red-bg` / `red-fg`, alert icon): "You've created 3 groups, the most allowed. No more groups can be created." This state is 930 tall (it scrolls).
- **done:** an "ADMIN" chip, heading "You're the admin of {group}", the join code card (V3 curved bar + wash + ball): "JOIN CODE · {season}", the code at 38px/800 with wide tracking, the link, "Copy code" (outline) and "Share link" (filled). Then "Players who enter this code join {season}. You approve anyone new." and a full-width "Go to Home →" button at the bottom.

### 02 Home (`02-home.dc.html`) — new prop `welcome`
`welcome = true` shows a bottom sheet over Home (the artboard is cropped to 844 for this state). Shown once, the first time a player opens Home after joining or after being approved; never again after it's dismissed.
Contents: drag handle, ball watermark top-right, a "✓ You're in" chip (`ok-bg` / `ok-fg`), the season name (28px/800) and dates, a `surface-2` box with "Sat & Sun at {time}", the address on two lines and "Season pass ${price} · pay an admin", and a full-width "Got it" button. Tapping the scrim also dismisses it.

### 06 Admin · Players (`06-admin-players.dc.html`) — new player sheet
Props: `overlay` (`none` | `player` | `transfer` | `remove`), `sheetFor` (`player` | `admin` | `self`), `onlyAdmin` (boolean). Tapping a row opens the sheet.
- Header: avatar, name, the Admin badge for admins, a subtitle ("Player", "Admin · plays", "You · admin · plays"), close button.
- A `surface-2` box with the 5 stars, the Attack/Defend control and the Plays switch ("Off means they're never placed in teams").
- Note under it: "Ratings are for {group} only."
- **ADMIN** section with a one-line note and the actions:
  - a player: "Make admin" (brand outline). Note: "Admins can rate players, manage runs and seasons, and approve new players."
  - another admin: "Remove admin" (red outline).
  - your own row: "Transfer admin" (brand outline) and "Remove admin" (red outline).
  - your own row when you're the only admin (`onlyAdmin`): both buttons disabled (`surface-2`, `muted-2` text) with the note "You're the only admin of {group}." and an amber warning line "A group needs at least one admin."
- **Remove from {group}** (sheetFor = player and admin, not your own row): under the ADMIN section, after a divider, a red text button "Remove from {group}" with the note "They leave the current season and can't RSVP. Their history stays."
- **remove:** a centred confirm dialog: "Remove {name}?", "They'll lose access to {group}'s runs. They can rejoin with a code if an admin approves them.", Cancel and a red "Remove".
- **transfer:** a dialog over the sheet: "Transfer admin", a search field, then a list of the group's players (32px avatar, name, a radio button); the selected row has a `brand-soft` background and a filled `brand` radio. Below the list: "Make {name} admin and remove your admin access?" ("Pick who becomes admin." when nobody is picked), Cancel and "Transfer" (disabled, `surface-2` / `muted-2`, until someone is picked).
- Admins keep the existing Admin badge on their row in the list.

### 13 Admin · Seasons (`13-admin-seasons.dc.html`)
Props: `theme`, `state` (`active` | `both` | `upcoming` | `ended`), `overlay` (`none` | `new` | `end`), `errors` (boolean). A **Seasons** tab in the admin section pills, order: Players · Runs · Seasons · Team builder · Passes (the pill row scrolls sideways).
- **Group name** as a small kicker (15px/800, `ink`) above "CURRENT SEASON", with a "+ New season" pill on the right.
- **Season card** (V3 curved bar + wash + ball): status chip ("Current · open to join" in `ok` colours; "Upcoming"; "Ended {date}" in `locked` colours), name at 30px/800, dates and run count, and three tiles: members · waiting (amber number) · paid.
- **Join code card:** "JOIN CODE", the code at 34px/800 (muted when off), the link or "Code is off · nobody new can join", a "New code" pill, "Copy code" and "Share link", then two switches: "Code is on" and "Approve new players".
- **Waiting for approval · {n}** with "Approve all": rows with avatar, name, a "New" chip, "Joined with code · {when}", decline (×) and approve (✓).
- **Invite last season's players** card with a "Send" pill.
- **Past seasons** list, then a red-outline **End {season}** button.
- **state = active:** the current season only (CURRENT SEASON heading, season card, code card), as above.
- **state = both:** the current season as above, then a **NEXT SEASON** heading with the upcoming season's card (amber curved bar, "Upcoming · starts {date}" chip in `amber` colours, name, "Starts {date} · {dates}", tiles for members · waiting) and that season's **own** code card (Copy code, Share link, New code, the two switches). The waiting list covers both seasons and each row says which one it's for ("Joined with code · 2h ago · for Outdoor 2027"). The Invite card sends the upcoming season's code.
- **state = upcoming:** no current season. Under NEXT SEASON, the upcoming season's card and its code card. Players in it can already see its run days on Home. No End button.
- **state = ended:** heading "LAST SEASON", grey bar, and a dashed card "No season is open" with "Start the next season".
- **overlay = new:** the New season bottom sheet. Its note: "If it starts today or earlier, it becomes the current season straight away. Otherwise it opens as Upcoming, so players can join early, and becomes current on its start date. Create its runs from the Runs tab." With `errors = true`: Start and End date get red borders, "End date must be after the start date" under End date, and "These dates overlap {other season}" (with an alert icon) under the date row. **overlay = end:** the End season dialog.

## Not in scope now
A group switcher, group labels on run cards, screens for being in two groups at once, developer or super-admin screens.
