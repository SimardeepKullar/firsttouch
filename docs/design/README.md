# FirstTouch — design handoff

Mobile-first web app for a recreational soccer group that plays pickup runs on Saturday and Sunday mornings, plus holiday Mondays. Players RSVP. RSVPs lock automatically 1 hour before the start, and teams are generated and published at that moment. Admins rate players, manage the season's runs and track season passes. This folder is the design reference for building it.

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This spec: product rules, components and every screen |
| `tokens/tokens.json` | All colours, type sizes, radii and sizes as data |
| `tokens/theme.css` | The same values as CSS variables (light by default, Graphite dark under `:root.dark`) |
| `tokens/tailwind.theme.js` | Tailwind / NativeWind theme extension that points at those variables |
| `assets/firsttouch-icon.png` | App icon, 232 × 232, rounded corners with a transparent background |
| `assets/firsttouch-icon-original.png` | The original logo image, with its black surround |
| `screens/*.dc.html` | Source of each mockup screen (see "Reading the screen files") |

### Reading the screen files

The `.dc.html` files are mockups from a design canvas, not production code. They won't open on their own in a browser, because they need the canvas runtime (`support.js`). Use them as an exact reference:

- **Layout and values:** every size, colour, gap and radius is in the inline `style="…"` attributes.
- **Data and states:** each file's `<script>` block holds the placeholder data and the state logic in `renderVals()`.
- **Template syntax:** `{{name}}` is a value from `renderVals()`, `<sc-for>` is a loop and `<sc-if>` is a conditional.
- **Props:** a screen's props are listed in `data-props` at the top of its script block (see "Screen props" below). They switch between variants and states.
- **Images:** `/_blob/3dfcf1bac4cf45bac56a39dd2306c225` is the logo; use `assets/firsttouch-icon.png` instead.
- **Links:** `href="X.dc.html"` links point to the canvas names. The mapping is: `Main` = 01-sign-in, `CreateAccount` = 01b, `ForgotPassword` = 01c, `NewPassword` = 01d, `Home` = 02, `RunDetail` = 03, `Teams` = 04, `Settings` = 05, `AdminPlayers` = 06, `RunManager` = 07-admin-runs, `TeamBuilder` = 08, `TeamBuilderDesktop` = 08b, `SeasonPasses` = 09, `Holidays` = 11.

### Screen props

| Screen | Prop | Values | What it changes |
|---|---|---|---|
| 01 Sign in | `emailAuth` | `off` (default), `on` | `on` adds email/password sign-in under an "or" divider |
| 01b Create account | `step` | `form`, `sent` | `sent` shows "Check your email to confirm your account" |
| 01c Forgot password | `step` | `form`, `sent` | `sent` shows "If that email has an account, we've sent a link" |
| 02 Home | `plays` | `on` (default), `off` | `off` = non-playing admin (Coach): no "I'm in" toggle, Admin tab shown |
| 02 Home | `dark` | boolean | Graphite dark mode |
| 02 Home | `pass` | `paid`, `unpaid` | Season pass chip |
| 03 Run detail | `role` | `player` (default), `admin` | Admin adds stars and the Unpaid badge |
| 03 Run detail | `locked` | boolean | The RSVP row shows "RSVPs closed" and a disabled "Locked" button |
| 03 Run detail | `going` | `true` (default), `false` | The viewer's own RSVP: "You're in" or "You're not going" |
| 04 Teams | `role` | `player` (default), `admin` | Admin adds stars, star totals and Unpaid flags |
| 04 Teams | `view` | `table`, `field` | Table or Field view |
| 04 Teams | `teams` | `3`, `2` | 3 = indoor run; 2 = outdoor run |
| 04 Teams | `dark` | boolean | Graphite dark mode |
| 05 Settings | `emailAuth` | `off`, `on` | `on` adds the "Change password" row |
| 06 Admin · Players | `filter` | `all`, `flagged`, `att`, `def` | Starting filter |
| 07 Admin · Runs | `status` | `open`, `locked`, `published`, `cancelled`, `empty` | Next-run card state (`empty` = fewer than 4 players) |
| 07 Admin · Runs | `overlay` | `none`, `sheet`, `confirm` | Edit-run bottom sheet, or the delete confirmation |
| 07 Admin · Runs | `compact` | boolean | Clips the screen to phone height (used for the overlay states) |

## Product rules shown in the designs

- **Run details:** indoor runs are at 6:30 AM at 7855 Finch Ave W, Brampton. Outdoor runs are at 7:00 AM at 32 Kennedy Rd N, Brampton. The current season label is "Indoor 2026–27".
- **When runs happen:** every Saturday and Sunday in a season, plus holiday Mondays that fall inside a season (managed on the Holidays screen).
- **RSVP lock:** RSVPs close automatically **1 hour before the start time**, for example "RSVPs close 5:30 AM" for a 6:30 AM run.
- **Automatic teams:** teams are generated and published automatically when RSVPs close. There are no manual Lock, Generate or Publish buttons.
- **Team count:** outdoor runs always have 2 teams. Indoor runs have 3 teams only when **19 or more** players are going; otherwise 2.
- **Too few players:** with fewer than 4 players going, no teams are made, and the admin sees "Not enough players — no teams made".
- **Admin-only information:** star ratings, star totals and the Unpaid flag are shown only to admins. Players see only the Morning-of flag.
- **New players:** start at 3 stars and Attack.
- **Admins:** there are three. **John** and **Sim** are admins who also play; **Coach** only manages and never plays (Plays off).
- **Playing admins are normal players:** they RSVP like everyone else and appear in Run detail, Teams and Team builder only when they've said yes, with no badge or special treatment there. In the mockups, Sim is going on the example run and John isn't.
- **Admin screens never assume the admin is going:** Runs, Team builder and Passes look the same whether the admin viewing them is going, not going or doesn't play.
- **Non-playing admins:** an admin with **Plays** switched off is never put in teams and gets no "I'm in" toggle (see the Home `plays = off` variant), but still has the Admin tab.
- **Sign-in:** launch is Google sign-in only. Email and password sign-in (01 with `emailAuth = on`, plus 01b, 01c and 01d) is designed but off for now.

## Global rules

- **Phone first:** design width 390 × 844. Screens marked "full scroll" on the canvas are drawn at their full scrolled length; the bottom navigation stays fixed. One desktop layout exists, for the admin Team builder (1280 wide).
- **Typeface:** one typeface, Archivo, weights 400–800. Headings are 800 weight with letter-spacing −0.02em.
- **Light and dark:** light is the default. Dark mode is the Graphite palette (see `theme.css`). Team colours and the flag badge colours are the same in both.
- **Tap targets:** at least 44 × 44. Primary buttons are 56 tall with a 16 radius.
- **Shapes:** cards have a 22–24 radius, a 1px `line` border and no shadow. Badges are pill-shaped. Bottom sheets have a 28 radius on the top corners over a 50% ink scrim.
- **Icons:** simple 2px-stroke line icons. The mockups use inline SVG; any matching line-icon set is fine.
- **Accessibility:** use real `<button>`, `<a>` and `<input>` elements with labels; give icon-only buttons an `aria-label`; switches use `role="switch"` with `aria-checked`; disabled controls are visibly dimmed and use `disabled` or `aria-disabled`. Text contrast is at least 4.5:1 in both themes.

## Brand

- **App icon:** `assets/firsttouch-icon.png`. Use it for the sign-in screen (112px for Google-only, 72px with email), the auth screens (56px), the desktop sidebar (40px), the favicon and the Home Screen icon.
- **Wordmark:** "First" in `ink` plus "Touch" in the accent colour, Archivo 800. The accent is `#0E4D32` on light backgrounds and `#62CC7E` on dark or pitch-green backgrounds.
- **Logo colours:** Touch green `#62CC7E`, White `#FFFFFF`, Pine `#34614E`, Forest `#1D472B`, Deep pitch `#04150F`.

## Fixed team colours

| Team | Fill | Text on top |
|---|---|---|
| Blue | `#2563EB` | `#FFFFFF` |
| Yellow | `#F5C518` | `#1F1A05` |
| Red (third indoor team) | `#DC2626` | `#FFFFFF` |

## Flags

- **Morning of** (amber badge): the player said yes on the day of the run. Everyone sees it.
- **Unpaid** (red badge): the player has no paid season pass. **Admins only.**
- **Flagged players still play** and appear in teams as normal.
- **Field view:** a flag shows as a 12px dot on the player's circle (amber `#F59E0B`; red `#DC2626` for admins only). The legend under the pitch lists only the flags the viewer can see.

## Navigation

- **Players:** bottom tabs for Home, Teams and Settings.
- **Admins:** bottom tabs for Home, Teams, Admin and Settings. Inside the Admin tab, a row of pill sub-tabs switches between **Players, Runs, Team builder, Passes**. Holidays opens from the Runs screen.
- **Desktop sidebar:** the same sections (Players, Runs, Team builder, Passes), plus "Back to player view".
- **Bottom nav:** 84 tall, with a 26px icon over a 12px label. The active tab uses the `brand` colour at weight 800.

## Shared components

- **Status chip:** a 28–32px pill with a dot and a label. Pass: Paid / Not paid. Runs: Open (green), Locked (grey), Teams published (pitch green, white text), Cancelled (red).
- **Flag badge:** 20–22px tall, with an 11px weight-800 label.
- **Admin badge:** the same size as a flag badge, pitch green with white text.
- **Position tag:** 42 × 26, radius 8, 1.5px ink border. **ATT** is filled ink with light text; **DEF** is an outline only.
- **Star rating (admin only):** five 12–13px stars, filled in `star-on`, empty in `star-off`. The editable version has tappable 40 × 44 buttons with 26px stars.
- **Segmented control:** a `surface-2` track with 4px padding; the selected segment is `surface` with a small shadow.
- **Switch:** 52 × 32 with a 26px white knob (46 × 28 for the compact Plays switch). The track is `brand` when on and `switch-off` when off.
- **Password field:** a 56-tall input with a 44 × 44 show/hide eye button inside it on the right.
- **Avatar:** a circle with initials in `surface-2`.

## Screens

### 01 Sign in (`01-sign-in.dc.html`)
- **Default (launch):** app icon, the FirstTouch wordmark, a tagline, "Continue with Google", and the privacy policy link at the bottom. There's no email section.
- **`emailAuth = on` (later):** an "or" divider, then Email and Password fields (password has show/hide), a "Forgot password?" link next to the Password label, and a "Sign in" button. "New here? Create an account" sits at the bottom above the privacy link.
- **Google mark:** the mockup uses a plain "G" placeholder. Use Google's official sign-in button assets in the build.

### 01b Create account (`01b-create-account.dc.html`)
- **Form:** a "Back to sign in" link, then Name, Email and Password fields. Password has a show/hide eye and the hint "At least 8 characters". Below them, a "Create account" button and, at the bottom, "Already have an account? Sign in".
- **Sent state:** "Check your email to confirm your account", with the address it went to, a "Resend email" button and "Back to sign in".

### 01c Forgot password (`01c-forgot-password.dc.html`)
- **Form:** an Email field and a "Send reset link" button.
- **Sent state:** "Check your email" with the line "If that email has an account, we've sent a link", and "Back to sign in".

### 01d Set a new password (`01d-set-new-password.dc.html`)
- **Contents:** New password (show/hide, "At least 8 characters" hint), Confirm password, and a "Save password" button. Reached from the reset link, and from Settings › Change password.

### 02 Home (`02-home.dc.html`)
- **Top:** a season pass chip ("Indoor pass: Paid" or "Indoor pass: Not paid") and the user's avatar. Greeting "Morning, {first name}" with the subtitle "Indoor 2026–27 · …".
- **Banner:** "Add FirstTouch to your Home Screen for notifications", dismissible with an X button.
- **Run cards:** one per upcoming run. Each card shows the day, the date (with the holiday name if any), "6:30 AM start", the address, a lock-icon line "RSVPs close 5:30 AM", stacked avatars, "{n} going" and the large "I'm in" toggle.
- **Closed card:** once RSVPs close, the line reads "RSVPs closed 5:30 AM" and the "I'm in" toggle is disabled (dimmed). A panel below shows a team-colour dot, "Teams are up — you're on {team}" and a "View teams" button.
- **Holiday card:** a holiday Monday shows the kicker "Holiday Monday" and the title "Mon Feb 15 · Family Day".
- **Mockup examples:** Sat Feb 13 (closed, on Blue), Sun Feb 14 (open, you're in), and Mon Feb 15 · Family Day (open, not replied).
- **Non-playing admin (`plays = off`, shown as Coach):** the cards keep the date, time, address, "{n} going" and the "Details" link, but the "I'm in" toggle is replaced by a muted line, "You're managing this run". The top chip reads "Admin · manages runs" instead of the pass chip. A closed card's panel reads "Teams are up" with "View teams" (no team of their own). The bottom nav includes the Admin tab.

### 03 Run detail (`03-run-detail.dc.html`)
- **Header:** pitch-green with rounded bottom corners, a back button, the date, start time and address, and three stat tiles (going, attackers, defenders).
- **Your RSVP:** the viewer's own status, "You're in" (with a "Change" button) or "You're not going" (with an "I'm in" button), plus "RSVPs close 5:30 AM". After the lock (`locked`), it reads "RSVPs closed 5:30 AM" and the button is disabled with a lock icon and the label "Locked".
- **Admin example:** the admin view is drawn as John looking at a run he isn't going to ("You're not going", locked). Sim appears in the list like any other player.
- **Who's coming, player view:** each row has an avatar, name, position tag and only the "Morning of" badge. No stars, no Unpaid badge.
- **Who's coming, admin view:** each row also shows stars and the Unpaid badge, and the bottom nav includes the Admin tab.

### 04 Teams (`04-teams.dc.html`)
- **Top:** the run summary, a Table / Field segmented control, and a small "Published 5:30 AM" label under it (6:00 AM for a 7:00 AM outdoor run).
- **Table view, player:** one card per team. The header strip is filled in the team colour. Rows show avatar, name, the "Morning of" badge and the position tag. The footer shows **player count and ATT:DEF ratio** only.
- **Table view, admin:** rows also show stars and the Unpaid badge, and the footer adds **total stars**.
- **Field view, indoor (3 teams):** one half-pitch card per team, stacked. Defenders form a back line near the goal (22% across) and attackers a front line (66% across), zig-zagged when there are 4 or more in a line. Players are 32px circles with initials in the team colour.
- **Field view, outdoor (2 teams):** a full pitch with Blue on the left half and Yellow on the right, plus a summary card for each team.
- **Field flags:** players see only amber Morning-of dots, and the legend lists Morning of only. Admins also see red Unpaid dots and a matching legend entry.

### 05 Settings (`05-settings.dc.html`)
- **Profile card:** avatar, name, a Paid chip, email, and a pencil button to edit the display name.
- **Notifications:** three switches, in this order: "Night-before reminder", "Teams published", "Changes and cancellations".
- **Privacy:** a privacy policy link.
- **Account:** "Change password" (shown only when `emailAuth = on`; it opens 01d), Sign out, and "Delete account" in red (`#B91C1C`).

### 06 Admin · Players (`06-admin-players.dc.html`)
- **Search and filters:** a search field and filter chips All / Flagged / ATT / DEF.
- **List order:** admins are listed first (Coach, John, Sim), then everyone else alphabetically.
- **Admins in the mockup:** John and Sim have the Admin badge with Plays on; Coach has the Admin badge with Plays off.
- **Player cards:** each card has the name, an **Admin** badge for admins, any flag badges, and a **Plays** switch on the right. Below that are a tappable 1–5 star control and an Attack / Defend toggle.
- **Plays off:** the card shows "Manages only · never placed in teams", and the rating and position controls are dimmed. The mockup example is "Coach".
- **New players:** start at 3 stars and Attack.

### 07 Admin · Runs (`07-admin-runs.dc.html`)
- **Next run card:** a status chip (Open, Locked, Teams published or Cancelled), stat tiles (going, ATT:DEF, flagged), and a line that changes with the state, for example "RSVPs close 5:30 AM · teams publish automatically". When published, a "View teams" button appears.
- **Empty state (`status = empty`):** fewer than 4 players; the card shows an amber "Not enough players — no teams made" notice.
- **Flagged · {run}:** the list of flagged players with the reason ("Said yes 4:58 AM", "No indoor pass") and their badge. Unchanged.
- **Season section:** a "Holidays" link in the section header; a card with the season title and an Indoor / Outdoor switch, Start date and End date fields, a "Create runs" button and a one-line description of the schedule.
- **All runs this season:** every run, past and upcoming. Each row shows the day and date, the holiday name if any, the start time and address, "{n} going" (or a reason), and a status chip. A "Show all {n} runs" link sits at the end.
- **Edit sheet (`overlay = sheet`):** tapping a run opens a bottom sheet with the run's title and status, a Start time field (hint: "RSVPs close and teams publish 1 hour before"), an Address field, "Save changes", and "Delete run" in red.
- **Delete confirmation (`overlay = confirm`):** for a run with RSVPs, a dialog reads "Delete {run}?" and "12 players said yes. They'll be told this run is cancelled.", with Cancel and a red Delete button.

### 08 Admin · Team builder, mobile (`08-admin-team-builder.dc.html`)
- **Opens on the published teams.** There are no Generate or Publish buttons.
- **Summary card:** the run summary with a "Published 5:30 AM" chip, the season label, a team count picker (2 / 3), a "Reshuffle" button, and the note "Changes save instantly. Players are notified when you reshuffle."
- **Team cards:** stacked, one per team, with a **fairness bar** that compares total stars against a 30-star scale. While a player is being dragged, the change shows as a faded part of the bar.
- **Player chips:** two columns per card, each with a drag handle, first name, flag dot, star count and position tag.
- **Drag to swap:** the player's old slot is dashed and faded; the chip being dragged is lifted (rotated slightly, with a shadow); the target team gets a highlight ring and a dashed "Drop here" slot.
- **Fairness warning:** an amber line when a move widens the star spread, for example "Moving Lena widens the star spread from 1 to 6".

### 08b Admin · Team builder, desktop (`08b-admin-team-builder-desktop.dc.html`)
- **Layout:** a pitch-green sidebar (logo, Players / Runs / Team builder / Passes, "Back to player view") next to the main area. On narrow screens the sidebar stacks above the main area.
- **Top bar:** the run summary with a "Published 5:30 AM" chip, the season label, the team count picker and Reshuffle.
- **Body:** a fairness strip with one bar per team, then three team columns with full-name rows, flag badges, team footers and the same drag state as mobile.
- **Bottom bar:** the note "Changes save instantly. Players are notified when you reshuffle." and the fairness warning. There's no "Unpublished changes" bar and no Publish button.

### 09 Admin · Season passes (`09-admin-season-passes.dc.html`)
- **Season card:** pitch-green, with an Indoor / Outdoor switch, the season title and price ("Indoor 2026–27", "$120"), "{n} of {total} paid", the amount still owed, and a progress bar. The outdoor price is a placeholder.
- **Filter chips:** All / Not paid.
- **Player rows:** each row has a Paid switch. Paid rows show "Paid" and, beneath it, "Marked paid by John · {date}". Unpaid rows are tinted red (`#FEF2F2` with a `#FCA5A5` border) and labelled "Not paid".

### 10 Logo sheet (`10-logo-sheet.dc.html`)
- **Contents:** the app icon at several sizes, the logo with the name on light, Graphite and pitch-green backgrounds, and the logo colour swatches.

### 11 Admin · Holidays (`11-admin-holidays.dc.html`)
- **Top:** a back link to Runs, the title, and the note "Holiday Mondays inside a season become runs automatically."
- **List:** one row per holiday Monday, showing "{date} · {name}" (for example "Mon Oct 12, 2026 · Thanksgiving"), the season it falls in, and an on/off switch. Switched-off rows are greyed and read "Off · no run". The mockup example switched off is "Mon Dec 25, 2028 · Christmas Day".
- **Add date:** a dashed "Add date" button at the end of the list.

## Placeholder data used in the mockups

- **Roster:** about 20 players going (10 ATT, 10 DEF), with ratings from 1 to 5 stars. Indoor runs show three teams of 7, 7 and 6 (star totals 23, 23 and 22); the outdoor example shows two teams of 10.
- **Flags:** two players flagged Morning of and three flagged Unpaid (the Unpaid flags are visible in admin views only).
- **Season passes:** 40 players (including John and Sim), 31 of them paid. The admin player list has 41 people, because it adds Coach, who doesn't play and needs no pass.
- **Signed-in player:** the player screens are drawn as Daniel Mensah, a regular (non-admin) player.
- **Dates:** runs are shown around the weekend of Sat Feb 13 – Mon Feb 15, 2027.
- **Placeholders:** names, emails and dates are placeholders. The addresses and times are the real run details.
