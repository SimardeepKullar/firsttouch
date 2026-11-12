# FirstTouch — design handoff (Version 3)

Mobile-first web app for a recreational soccer group that plays pickup runs on Saturday and Sunday mornings, plus holiday Mondays. Players RSVP. RSVPs lock automatically 1 hour before the start, and teams are generated and published at that moment. Admins rate players, manage the season's runs and track season passes. This folder is the design reference for building it.

**Version 3** is the current design. It keeps everything from Version 2 (Inter, green gradients, the floating bottom nav, **light mode as the default** and an **optional dark mode** chosen in Settings › Appearance) and changes three things: the Home run cards, the Teams cards, and the dark-mode background. The product rules are the same as Versions 1 and 2.

## What changed in Version 3

Only **02 Home** and **04 Teams** have new mockups. Every other screen keeps its Version 2 mockup, but takes the new dark colours from the tokens.

1. **Dark mode is grey-black, not green-black.** `bg` `#0D1110`, `surface` `#171B1B`, `surface-2` `#202525`, `line` `#2A3030`, plus new `input-border`, `ink`, `ink-2`, `muted`, `muted-2`, `nav`, `switch-off`, `star-on`, `star-off`, `locked-bg` and a fainter green glow in `page`. Light mode is unchanged. This applies to **every** screen, because it's just token values.
2. **Curved left bars.** Run cards and team cards no longer have a straight 4px bar. Each card has a 6px left edge that follows the card's rounded corners (a crescent), filled with a top-to-bottom gradient that fades in the bottom 40%. See "Curved left bar" below for the CSS.
3. **Run cards (Home)** are rebuilt; see Shared components › Run card and 02 Home.
4. **Team cards (Teams)** get a colour wash across the card, a crescent bar, a "Your team" card at the top for players, and the "{n} players" chip in the team colour; see Shared components › Team card and 04 Teams.
5. **New tokens:** `card-bar`, `card-bar-closed`, `button-in` (+ `button-in-shadow`), `ball-fill` / `ball-patch` / `ball-line`, `team-{blue|yellow|red}-wash`, `-bar`, `-border`, `-chip-bg`, `-chip-fg`. All are in `tokens/`.

### Curved left bar

Draw it with a transparent left border and layered backgrounds, so the bar takes the card's corner radius:

```css
.card {
  border: 0;
  border-left: 6px solid transparent;
  border-radius: 24px;            /* 26 for team cards */
  background:
    var(--team-blue-wash) padding-box,                     /* optional tint (team cards only) */
    linear-gradient(var(--surface), var(--surface)) padding-box,
    var(--team-blue-bar) border-box;                       /* or var(--card-bar) on Home */
}
```

Team washes are the same in both themes: Blue 26%, Yellow 20%, Red 20% at the top-left corner, fading to a fifth of that 70% of the way across (160°). Blue is slightly stronger on purpose, so the three read evenly.

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This spec: product rules, components and every screen |
| `tokens/tokens.json` | All colours, type sizes, radii and sizes as data |
| `tokens/theme.css` | The same values as CSS variables (light by default; dark under `:root.dark`; System follows the phone) |
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
- **Links:** `href="X.dc.html"` links point to the canvas names. In `02-home` and `04-teams` the links already use the file names. In the other files the mapping is: `V2Main` = 01-sign-in, `V2CreateAccount` = 01b, `V2ForgotPassword` = 01c, `V2NewPassword` = 01d, `V2Home` = 02, `V2RunDetail` = 03, `V2Teams` = 04, `V2Settings` = 05, `V2AdminPlayers` = 06, `V2RunManager` = 07-admin-runs, `V2TeamBuilder` = 08, `V2TeamBuilderDesktop` = 08b, `V2SeasonPasses` = 09, `V2Holidays` = 11.
- **Colours in the files:** values appear as `{{t.name}}`; `name` is a key of the active theme in `tokens/tokens.json` (`theme.light` or `theme.dark`), and each file's `tok()` method lists them too.

### Screen props

| Screen | Prop | Values | What it changes |
|---|---|---|---|
| Every screen | `theme` | `light` (default), `dark` | Light or dark mode |
| 01 Sign in | `emailAuth` | `off` (default), `on` | `on` adds email/password sign-in under an "or" divider |
| 01b Create account | `step` | `form`, `sent` | `sent` shows "Check your email to confirm your account" |
| 01c Forgot password | `step` | `form`, `sent` | `sent` shows "If that email has an account, we've sent a link" |
| 02 Home | `plays` | `on` (default), `off` | `off` = non-playing admin (Coach): no "I'm in" toggle, Admin tab shown |
| 02 Home | `pass` | `paid`, `unpaid` | Season pass chip |
| 03 Run detail | `role` | `player` (default), `admin` | Admin adds stars and the Unpaid badge |
| 03 Run detail | `locked` | boolean | The RSVP row shows "RSVPs closed" and a disabled "Locked" button |
| 03 Run detail | `going` | `true` (default), `false` | The viewer's own RSVP: "You're in" or "You're not going" |
| 04 Teams | `role` | `player` (default), `admin` | Admin adds stars, star totals and Unpaid flags |
| 04 Teams | `view` | `table`, `field` | Table or Field view |
| 04 Teams | `teams` | `3`, `2` | 3 = indoor run; 2 = outdoor run |
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
- **Typeface:** one typeface, Inter, weights 400–800. Headings are 800 weight with letter-spacing −0.03em; body text is 15–16px.
- **Light and dark:** light is the default. Dark mode is optional, chosen in Settings › Appearance (Light / Dark / System, where System follows the phone). Every colour comes from the theme tokens; team fill colours are the same in both themes, while team text and tint colours have a light and a dark value.
- **Page background:** a soft radial green glow in the top-right corner over `bg` (`page` token).
- **Tap targets:** at least 44 × 44. Primary buttons are 56 tall with a 16 radius.
- **Shapes:** cards have a 24 radius, a 1px `line` border and the soft `shadow`. Hero cards (Run detail header, Season pass card, Auto team creation) use the `hero` green gradient with a 28 radius and white text. Primary buttons use the `button` gradient. Badges and segmented controls are pill-shaped. Bottom sheets have a 28 radius on the top corners over a 50% ink scrim.
- **Icons:** simple 2px-stroke line icons. The mockups use inline SVG; any matching line-icon set is fine.
- **Accessibility:** use real `<button>`, `<a>` and `<input>` elements with labels; give icon-only buttons an `aria-label`; switches use `role="switch"` with `aria-checked`; disabled controls are visibly dimmed and use `disabled` or `aria-disabled`. Text contrast is at least 4.5:1 in both themes.

## Brand

- **App icon:** `assets/firsttouch-icon.png`. Use it for the sign-in screen (112px for Google-only, 72px with email), the auth screens (56px), the desktop sidebar (40px), the favicon and the Home Screen icon.
- **Wordmark:** "First" in `ink` plus "Touch" in `brand-text`, weight 800. On the green hero gradient, use white plus Touch green `#62CC7E`.
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
- **Bottom nav:** a floating bar, 76 tall with a 26 radius, inset 12px from the screen edges and 14px from the bottom, in the `nav` colour with a `line` border and `shadow`. Each tab is a 24px icon over a 12px label; the active tab is `brand-text` with a 22 × 3 `brand` underline. Icons: house (Home), trophy (Teams), shield (Admin), gear (Settings).

## Shared components

- **Status chip:** a 28–32px pill with a dot and a label. Pass: Paid / Not paid. Runs: Open, Locked, Teams published, Cancelled. Teams uses a "Published" pill with a filled check circle and a `brand-line` border.
- **Flag badge:** 20–22px tall, 11px weight-700 label, using the status tokens (`amber-*` for Morning of, `red-*` for Unpaid).
- **Admin badge:** the same size as a flag badge, on the `hero` gradient with white text.
- **Position tag:** 40 × 24, radius 8. **ATT** is filled `ink` with `bg`-coloured text; **DEF** is an outline in `input-border` with `ink-2` text.
- **Star rating (admin only):** five 12–13px stars in `star-on` / `star-off`. The editable version has tappable 40 × 44 buttons with 26px stars.
- **Segmented control:** a pill track in `surface` with a `line` border; the selected segment is the `button` gradient with `on-brand` text.
- **Switch:** 52 × 32 with a 26px white knob (46 × 28 for the compact Plays switch). The track is the brand gradient when on and `switch-off` when off.
- **Run card (Home, V3):** 24 radius, `surface`, `shadow`, and a curved 6px left bar in `card-bar` (`card-bar-closed` once RSVPs close). Top row: day kicker in `brand-text` (plus the holiday chip), a 30px date, and a Details pill. Then two columns: on the left the start time (clock icon), the address on two lines (pin icon) and the lock-icon "RSVPs close 5:30 AM" line in `muted`; on the right three stacked 36px avatars plus a "+n" circle, and under them a 40-tall "{n} going" pill (check icon in `brand-soft` / `brand-line` when you're going, clock icon and `line` border when not). Then a full-width 50-tall button, radius 16: **"I'm in"** (plus icon, `brand-line` outline, `brand-text`) or **"You're in"** (check icon, `button-in` fill with `on-brand` text; in dark it also has the `button-in-shadow` glow).
- **Team card (Teams, V3):** 26 radius, the team's `wash` over `surface`, a curved 6px left bar in the team's `bar` gradient, `shadow`. A 200px soccer ball peeks in from the right edge (`ball-fill`, `ball-patch`, `ball-line`). Header: an 18px team dot with a soft glow, the team name at 22px/800, and a 34-tall "{n} players" chip (`team-*-chip-bg` / `-fg`: the solid team colour in light, a 40% team tint with white text in dark). Rows and footer are as before.
- **Your team card (Teams, players only, V3):** at the top of Teams, above the team cards. 24 radius, the team's `wash`, a curved team `bar`. It shows "YOUR TEAM" (12px, 800, 0.1em tracking, `muted`), a 22px team dot with a 5px soft ring, the team name at 30px/800, and "{n} players · ATT/DEF {a}:{d}" in `muted`. No avatars. Admins don't see it.
- **Pitch:** the `pitch-grass` gradient with stripes and `pitch-lines`, rounded 14–16. Player dots are team-coloured circles with a white border and a 3px team-colour glow.
- **Password field:** a 56-tall input with a 44 × 44 show/hide eye button inside it on the right.
- **Avatar:** a circle with initials in `surface-2` (Home uses `brand-text` initials).

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
- **V3:** the run cards follow Shared components › Run card (V3). The header, greeting, banner and Auto team creation card are unchanged from V2.
- **V2 header:** the app icon (44px) on the left; on the right the pass chip and a 44px bell button with a green unread dot. The greeting has a 40 × 3 `brand` underline beneath it, then the banner (green-tinted with a `brand-line` border), then an "Upcoming runs" heading with a "View all" link.
- **Auto team creation card:** after the run cards, a hero-gradient card with a players icon, "Auto team creation" and "Teams are made automatically when RSVPs close, 1 hour before kickoff.", with a faint goal drawing on the right.
- **Top:** a season pass chip ("Indoor pass: Paid" or "Indoor pass: Not paid") and the user's avatar. Greeting "Morning, {first name}" with the subtitle "Indoor 2026–27 · …".
- **Banner:** "Add FirstTouch to your Home Screen for notifications", dismissible with an X button.
- **Run cards:** one per upcoming run. Each card shows the day, the date (with the holiday name if any), "6:30 AM start", the address, a lock-icon line "RSVPs close 5:30 AM", stacked avatars, "{n} going" and the large "I'm in" toggle.
- **Closed card (V3):** once RSVPs close, the line reads "RSVPs closed 5:30 AM", the bar turns grey (`card-bar-closed`) and the "I'm in" button is replaced by a team panel: radius 18, the team's `wash` over `surface-2`, a 16px team dot with a soft ring, "You're on {team}" (16px/800) over "{n} players · ATT/DEF {a}:{d}" (13px, `muted`), and a "View teams" button on the right. Coach's panel reads "Teams are up" over "3 teams · published 5:30 AM" with a `brand` dot.
- **Holiday card:** a holiday Monday shows the kicker "Holiday Monday" and the title "Mon Feb 15 · Family Day".
- **Mockup examples:** Sat Feb 13 (closed, on Blue), Sun Feb 14 (open, you're in), and Mon Feb 15 · Family Day (open, not replied).
- **Non-playing admin (`plays = off`, shown as Coach):** the cards keep the date, time, address, "{n} going" and the "Details" link, but the "I'm in" toggle is replaced by a muted line, "You're managing this run". The top chip reads "Admin · manages runs" instead of the pass chip. A closed card's panel reads "Teams are up" with "View teams" (no team of their own). The bottom nav includes the Admin tab.

### 03 Run detail (`03-run-detail.dc.html`)
- **V3:** no hero header and no page title. The top row has a 44 × 44 back button on the left (`surface`, `line` border, 14 radius, `ink` chevron) and a status chip on the right: "Open" (`ok-bg` / `ok-fg`) or, once locked, "Teams published" (`brand-soft` / `brand-text`). The chip is 30 tall with a 7px dot.
- **Run card:** the Home run card's look at 26 radius: a `brand` wash over `surface` (12% in light and 14% in dark at the top-left corner, fading to a fifth of that 70% of the way across, 160°), a curved 6px left bar in `card-bar` (a grey `muted-2` bar once locked), and a 190px soccer ball peeking in from the right (`ball-fill`, `ball-patch`, `ball-line`). Inside:
  - the kicker "INDOOR 2027" (14px, 800, 0.06em tracking, `brand-text`; "OUTDOOR 2027" for an outdoor season), taken from the run's season;
  - the date, 30px / 800 (for example "Sunday, Feb 14");
  - the clock line "6:30 AM start" and the pin line with the address on two lines;
  - three stat tiles (going, attackers, defenders): 16 radius, `line` border, 70% white in light and 4% white in dark, with a 24px / 800 number over a 12px / 600 `muted` label.
  - There is no "RSVPs close" line in this card.
- **Your RSVP:** a 24-radius `surface` card with a `line` border, `shadow` and 16 padding. One row: on the left "YOUR RSVP" (12px, 800, 0.1em tracking, `muted`), the status at 20px / 800 ("You're in" or "You're not going"), and while RSVPs are open the lock-icon line "RSVPs close 5:30 AM" (13px, `muted`). On the right a 46-tall pill button that toggles your RSVP in place:
  - going: "You're in" with a check icon, filled with `button` in light and `button-in` (with `button-in-shadow`) in dark, `on-brand` text;
  - not going: "I'm in" with a plus icon, a 1.5px `brand-line` outline, `brand-text`.
- **After the lock, going:** the pill and the close line disappear. Below the row sits a team panel: 18 radius, your team's `wash` over `surface-2`, a `line` border, a 16px team dot with a 4px soft ring, "You're on Blue" (16px / 800) over "7 players · ATT/DEF 3:4" (13px, `muted`), and a 40-tall "View teams" button (`button` gradient, 12 radius) on the right. (Admins see "Teams are up" with a `brand` dot instead; that is the admin view, T-19.)
- **After the lock, not going:** a disabled "Locked" pill (lock icon, `surface-2`, `line` border, `muted` text) takes the pill's place on the same line. There is no close line.
- **Admins with Plays off (Coach), not drawn in the mockup:** the whole RSVP row is replaced by the line "You're managing this run", as on Home.
- **Who's coming, player view:** a heading with the note "In order of RSVP" (13px / 600, `muted`) on the right, then a 24-radius card with 4px vertical padding. Rows are at least 48 tall with 8px / 16px padding: a 38px avatar (`surface-2`, `line` border, `ink-2` initials at 12px / 700), the name (15px / 600) with " · You" in `brand-text` on your own row, the "Morning of" badge (22 tall, amber) and the position tag. A player who isn't going isn't in the list. No stars, no Unpaid badge.
- **Who's coming, admin view:** the note reads "In order of RSVP · admin view", each row shows a 12px star row under the name and the Unpaid badge, no " · You" suffix, and the bottom nav includes the Admin tab. Drawn as John, not going; Sim is listed like any player.

### 04 Teams (`04-teams.dc.html`)
- **V3:** players see the Your team card under the "Published" line, in both Table and Field views. Team cards follow Shared components › Team card (V3).
- **V2 look:** see Team card and Pitch under Shared components. The Table / Field control is a pill with the selected side in the button gradient.
- **Top:** the run summary, a Table / Field segmented control, and a small "Published 5:30 AM" label under it (6:00 AM for a 7:00 AM outdoor run).
- **Table view, player:** one card per team. The header strip is filled in the team colour. Rows show avatar, name, the "Morning of" badge and the position tag. The footer shows **player count and ATT:DEF ratio** only.
- **Table view, admin:** rows also show stars and the Unpaid badge, and the footer adds **total stars**.
- **Field view, indoor (3 teams):** one half-pitch card per team, stacked. Defenders form a back line near the goal (22% across) and attackers a front line (66% across), zig-zagged when there are 4 or more in a line. Players are 32px circles with initials in the team colour.
- **Field view, outdoor (2 teams):** a full pitch with Blue on the left half and Yellow on the right, plus a summary card for each team.
- **Field flags:** players see only amber Morning-of dots, and the legend lists Morning of only. Admins also see red Unpaid dots and a matching legend entry.

### 05 Settings (`05-settings.dc.html`)
- **Appearance (new in V2):** a three-option control, **Light / Dark / System**, between Notifications and Privacy. Light is selected by default. Choosing Dark switches the app to dark mode; System follows the phone and shows "Follows your phone's light or dark setting." Store the choice per user (and on the device for a fast first paint).
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
