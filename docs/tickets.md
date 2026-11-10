# FirstTouch — ticket plan

Created on GitHub Nov 9, 2026: labels, milestones, issues #1–#76 (except #3, the T-01 PR) and the **FirstTouch** project board (Todo / In progress / Done).

**How to read this file**

- Every ticket is titled `T-NN · <verb> …` (the AGENTS.md convention). T-numbers follow dependency order. Each ticket's GitHub issue number is in brackets. T-NN is issue #NN, except T-02 (#1) and T-03 (#2), which existed before the plan.
- **Sources:** `docs/spec.md` (behaviour, data, rules, permissions), `docs/design/` (look and layout), `docs/privacy.md`. Where they disagree, the spec wins on behaviour and permissions and the design wins on visuals. See [Spec and design disagreements](#spec-and-design-disagreements) at the end.
- **Sizes:** S = one sitting. M = one or two sittings. L = two full sittings (used rarely).
- **Labels:** `database`, `functions`, `player UI`, `admin UI`, `infra`, `tests`, `design`, `later`. `design` marks a ticket that also fills a gap with no mockup (it reuses existing patterns, and the gap is spelled out in the ticket).
- **Designs:** this plan follows **Version 3** of the designs (`docs/design/README.md`, switched in T-78 on Nov 10, 2026): Version 2's Inter, green gradients, floating bottom nav and Appearance setting, plus grey-black dark mode, the new Home run cards (curved `card-bar`, "{n} going" pill, full-width "I'm in" / "You're in" button) and the new Teams cards (team wash, curved team bar, team-colour chips, and a "Your team" card for players). Only `02-home` and `04-teams` have new mockups; every other screen keeps its Version 2 mockup with the new dark colours.
- **Expo docs:** the app is on Expo SDK 58, so "Expo docs" in the learning notes means `https://docs.expo.dev/versions/v58.0.0/`, not memory or older tutorials.

**Already done (no tickets):** Expo app with NativeWind and Expo Router in `src/app`; Vitest; the `balance.ts` placeholder and test; the first migration (tables, RLS, views, holiday functions, `generate_season_runs`, `set_holiday_active`, triggers, `update_my_name`, `delete_my_account`, grants, Realtime on `rsvps`) and `seed.sql`, pushed to dev.

**Still open from earlier work:** T-01 (CI, pre-push hook, dev/prod split) is committed on `ticket/T-01-ci-and-environments` but has no PR and isn't merged. It has no GitHub issue. Open its PR and merge it before starting T-02, because almost everything below depends on CI.

---

## Order of work

### Foundation
1. T-02 · Add database tests for RLS, grants and guard functions (#1)
2. T-04 · Finish Google sign-in (#4)
3. T-05 · Add the design tokens, Inter font and light/dark themes (#5)
4. T-06 · Replace the app icon, favicon and splash with the FirstTouch logo (#6)
5. T-07 · Build the display components: chips, badges, position tag, avatar, stars (#7)
6. T-08 · Build the input components: switch, segmented control, star picker, fields, buttons (#8)
7. T-09 · Build the bottom tab bar and the Admin sub-tabs (#9)
8. T-10 · Add the public /privacy page (#10)
9. T-11 · Restyle the sign-in screen to match the design (#11)
10. T-12 · Add pgTAP tests for lock time, morning-of and season run generation (#12)
11. T-13 · Extend seed.sql with runs, RSVPs, passes and teams (#13)

### RSVP loop
12. T-14 · Build the Home screen run cards (#14)
13. T-15 · Add the "I'm in" RSVP toggle with instant feedback (#15)
14. T-16 · Update going counts live with Supabase Realtime (#16)
15. T-17 · Show Coach's Home for admins who don't play (#17)
16. T-18 · Build the Run detail screen (player view) (#18)
17. T-19 · Add the admin view of Run detail (#19)
18. T-20 · Build the Settings screen: profile, name, appearance, privacy, sign out, delete account (#20)
19. T-21 · Build the Admin · Players list with search and filters (#21)
20. T-22 · Let admins set stars, position and Plays (#22)
21. T-23 · Let admins make or remove other admins (#23)
22. T-24 · Build the season card on Admin · Runs (#24)
23. T-25 · List every run of the season on Admin · Runs (#25)
24. T-26 · Add the edit-run sheet: time, address, cancel and delete (#26)
25. T-27 · Build the Admin · Holidays screen (#27)
26. T-28 · Let admins add a one-off holiday date (#28)

### Teams
27. T-29 · Implement balanceTeams: team count, sizes and snake draft (#29)
28. T-30 · Finish balanceTeams: swaps, restarts, slots and output checks (#30)
29. T-31 · Add the web manifest, service worker and VAPID keys (#31)
30. T-32 · Let players turn on notifications in Settings (#32)
31. T-33 · Show the "Add to Home Screen" banner on iPhone (#33)
32. T-34 · Build the send-push Edge Function (#34)
33. T-35 · Add save_teams, publish_teams and the service_role grants (#35)
34. T-36 · Build the generate-teams Edge Function (#36)
35. T-37 · Schedule the lock-and-publish job with pg_cron (#37)
36. T-38 · Build the Teams screen table view (#38)
37. T-39 · Draw the indoor Field view (three half-pitches) (#39)
38. T-40 · Draw the outdoor Field view (full pitch) (#40)
39. T-41 · Show "Teams are up" on Home and Run detail (#41)
40. T-42 · Push team and run changes live with Realtime (#42)
41. T-43 · Add the Next run card to Admin · Runs (#43)
42. T-44 · Build the Admin · Team builder: summary, team count and Reshuffle (#44)
43. T-45 · Let admins drag players between teams with the fairness bar (#45)
44. T-46 · Build the desktop Team builder with the admin sidebar (#46)
45. T-47 · Schedule the evening reminder job (#47)
46. T-48 · Send pushes when a run is moved, cancelled or deleted (#48)
47. T-49 · Schedule the yearly holiday fill job (#49)
48. T-50 · Add Deno tests for generate-teams and send-push (#50)

### Season passes and flags
49. T-51 · Record who marked a pass paid, with a trigger and tests (#51)
50. T-52 · Build the Admin · Season passes screen (#52)
51. T-53 · Add the Flagged list to Admin · Runs (#53)

### Web launch
52. T-54 · Create the prod Supabase project and GitHub production environment (#54)
53. T-03 · Deploy the website from CI, after prod migrations (#2)
54. T-55 · Deploy Edge Functions and their secrets from CI (#55)
55. T-56 · Add the real seasons to prod with a data migration (#56)
56. T-57 · Back up the prod database weekly to firsttouch-backups (#57)
57. T-58 · Show failed jobs and pushes on the admin screen (#58)
58. T-59 · Add the EXPO_PUBLIC_EMAIL_AUTH switch and the email sign-in form (#59)
59. T-60 · Build the Create account screen (#60)
60. T-61 · Build the Forgot password and Set a new password screens (#61)
61. T-62 · Add Change password to Settings (#62)
62. T-63 · Test email sign-in locally with Mailpit and Playwright (#63)
63. T-64 · Add a Playwright end-to-end test against the preview URL (#64)
64. T-65 · Publish the Google sign-in app out of Testing mode (#65)
65. T-66 · Run the launch checklist (#66)

### Later (no milestone, label `later`)
- T-67 · Switch on email sign-in with a domain and Resend (#67)
- T-68 · Send a weekly reminder about unpaid season passes (#68)
- T-69 · Add season join codes (#69)
- T-70 · Let admins add walk-ins to a locked or published run (#70)
- T-71 · Let admins mark no-shows (#71)
- T-72 · Add a player cap and waitlist (#72)
- T-73 · Take season pass payments in the app with Stripe (#73)
- T-74 · Add match rotation and scores (#74)
- T-75 · Ship App Store and Google Play builds (#75)
- T-76 · Let admins deactivate players (#76)

---

## Foundation

### T-02 · Add database tests for RLS, grants and guard functions (#1)
*Exists as #1. Keep its body as written. Phase 4 only adds the milestone, labels and board.*
**Milestone:** Foundation · **Labels:** database, tests · **Size:** M
**Depends on:** T-01 merged

---

### T-04 · Finish Google sign-in (#4)
**Milestone:** Foundation · **Labels:** player UI, infra · **Size:** S

**Summary:** Google sign-in, the Supabase client, protected routes and a placeholder Home (name plus Admin badge) are already on `main`. This ticket finishes the plumbing so every later screen can rely on it: a single profile hook, clear errors, and sign-in confirmed on the dev project. Restyling the screen is T-11.

**Spec:** Overview; Access control; Deployment and environments › Supabase settings
**Design:** No mockup (behaviour only; visuals are T-11)
**Depends on:** T-01 merged

**Acceptance criteria**
- [ ] One hook (for example `useMe` in `src/lib/`) returns the signed-in player's id, name, position, `plays` and admin status. The placeholder Home uses it instead of its own two queries.
- [ ] If Google sends the user back with an error in the URL (for example they press Cancel), the sign-in screen shows a friendly message instead of nothing.
- [ ] Reloading the page keeps you signed in. Signing out clears cached data, so a second account on the same browser never sees the first account's data.
- [ ] The dev project's redirect URLs include `http://localhost:8081/**`, and signing in on `npx expo start --web` works end to end. A brand-new Google account gets a profile with 3 stars, Attack and Plays on.
- [ ] A signed-in user whose profile can't be loaded sees an error with a Sign out button, not a blank screen.
- [ ] `npm run verify` passes.

**Learning notes**
- Supabase Auth: `signInWithOAuth`, the PKCE flow and `onAuthStateChange`
- TanStack Query: query keys, and `queryClient.clear()` on sign-out
- Expo Router: `Stack.Protected` guards (Expo docs › Router › Protected routes)

---

### T-05 · Add the design tokens, Inter font and light/dark themes (#5)
**Milestone:** Foundation · **Labels:** design, infra · **Size:** M

**Summary:** Move the V2 design's colours, gradients, shadows, radii and sizes from `docs/design/tokens/` into `tailwind.config.js` and `global.css`, so screens use names like `bg-surface` and `text-muted` instead of hex values. Load Inter (400–800). Light is the default; dark switches on with a `.dark` class, and "System" follows the phone. The Settings control that picks the mode comes in T-20; this ticket builds the switch it flips.

**Spec:** Architecture (NativeWind); Non-functional requirements › Accessibility
**Design:** `README.md` › Global rules, Brand; `tokens/tokens.json` (`theme.light`, `theme.dark`), `tokens/theme.css` (including the `prefers-color-scheme` block for System), `tokens/tailwind.theme.js`; any screen with `theme = light | dark` to check the result
**Depends on:** T-01 merged

**Acceptance criteria**
- [ ] `tailwind.config.js` extends the theme with every colour, background image (`page`, `button`, `hero`, `grass`), shadow, radius and size from `tailwind.theme.js`. `global.css` holds the light variables and the `.dark` overrides from `theme.css`.
- [ ] Inter loads at weights 400, 500, 600, 700 and 800. Headings use 800 with −0.03em letter-spacing, and body text is 15–16 px.
- [ ] Screens sit on the `page` background (the soft green glow in the top-right corner over `bg`).
- [ ] One small theme module (for example `src/lib/theme.ts`) sets the mode to `light`, `dark` or `system`, remembers it on the device, and applies it before the first paint, so there's no flash of the wrong theme. `system` follows the OS setting and updates live when it changes.
- [ ] Team fill colours are identical in both themes. Team text and soft tint colours use their light or dark values.
- [ ] A temporary test page (removed before merge, or kept under a dev-only route) shows the swatches and gradients in both themes.
- [ ] `npm run verify` passes.

**Learning notes**
- NativeWind v4: theme with CSS variables, `darkMode: 'class'`, and `colorScheme.set()` / `useColorScheme`
- CSS gradients and `box-shadow` through Tailwind on web (native would need `expo-linear-gradient`; not needed for v1)
- Expo Fonts (`expo-font`, or the `@expo-google-fonts/inter` package) in the Expo docs
- CSS custom properties and the `prefers-color-scheme` media query

---

### T-06 · Replace the app icon, favicon and splash with the FirstTouch logo (#6)
**Milestone:** Foundation · **Labels:** design, infra · **Size:** S

**Summary:** Swap the Expo template icons for the FirstTouch logo and rename the app "FirstTouch". The design only ships a 232 px icon with transparent rounded corners, which is too small for a 512 px web app icon and wrong for an iPhone Home Screen icon (iOS rounds the corners itself), so this ticket also asks for a larger, square export.

**Spec:** Notifications › Setup (manifest icons)
**Design:** `assets/firsttouch-icon.png`, `assets/firsttouch-icon-original.png`; `10-logo-sheet`; README › Brand
**Depends on:** T-05

**Acceptance criteria**
- [ ] `app.json` has name "FirstTouch". The favicon, icon and splash use the logo, and the splash background is a brand colour (the dark end of the `hero` gradient, `#0A3F27`, or Deep pitch `#04150F`), not the template blue.
- [ ] A square, full-bleed 1024 × 1024 icon is exported from the design (no transparent corners) and saved in `assets/images/`. Until it exists, the 232 px file is used and this box stays open.
- [ ] Sizes needed later by the web manifest (T-31) are generated from it: 192, 512, and a 180 px Apple touch icon.
- [ ] The browser tab shows the new favicon on `npx expo start --web`.

**Learning notes**
- Expo docs: app config `icon`, `web.favicon`, and the `expo-splash-screen` plugin
- Web app icons: "maskable" icons, and why iOS wants square icons without transparency

---

### T-07 · Build the display components: chips, badges, position tag, avatar, stars (#7)
**Milestone:** Foundation · **Labels:** player UI, design · **Size:** M

**Summary:** Build the small, read-only pieces every screen reuses, in `src/components/`: status chip, flag badge, Admin badge, position tag, avatar, and the read-only star rating. Each takes simple props, so screens never repeat styling.

**Spec:** Access control (stars and Unpaid are admin-only); Overview (flags)
**Design:** README › Shared components, Flags; status chips in `07-admin-runs` (`status` prop), `02-home` (pass chip) and `04-teams` (Published pill); badges in `03-run-detail`; position tags in `04-teams`; stacked avatars in `02-home`
**Depends on:** T-05

**Acceptance criteria**
- [ ] `StatusChip`: pass (Paid / Not paid) and run status (Open, Locked, Teams published, Cancelled) using the `ok-*`, `locked-*`, `brand` and `red-*` tokens, 28–32 tall, dot plus label. Also the Teams "Published" pill: a filled check circle with a `brand-line` border.
- [ ] `FlagBadge` (Morning of `amber-*`, Unpaid `red-*`): 20–22 tall, 11 px weight-700 label. `AdminBadge`: same size, on the `hero` gradient with white text.
- [ ] `PositionTag`: 40 × 24, radius 8. ATT is filled `ink` with `bg`-coloured text. DEF is an outline in `input-border` with `ink-2` text.
- [ ] `Avatar`: a circle with initials on `surface-2` (Home uses `brand-text` initials), in the sizes the mockups use, plus the stacked-avatars group with a "+n" circle.
- [ ] `StarRating` (read-only): five 12–13 px stars in `star-on` / `star-off`, with an accessible label such as "4 of 5 stars".
- [ ] Every component looks right in light and dark.
- [ ] These components don't decide who sees stars or Unpaid. Screens decide that from the data.

**Learning notes**
- React Native `View`, `Text`, and passing `className` with NativeWind
- TypeScript props types and union types (`'open' | 'locked' | …`)
- Accessibility props in React Native for web (`accessibilityLabel` becomes `aria-label`)

---

### T-08 · Build the input components: switch, segmented control, star picker, fields, buttons (#8)
**Milestone:** Foundation · **Labels:** player UI, admin UI, design · **Size:** M

**Summary:** Build the interactive controls: switch (normal and compact), segmented control, the editable star picker, a text field, a password field with show/hide, and primary/secondary/danger buttons. They follow the design's sizes and the accessibility rules (real roles, 44 × 44 tap targets, dimmed disabled state).

**Spec:** Non-functional requirements › Accessibility
**Design:** README › Global rules (Tap targets, Accessibility), Shared components; switch in `05-settings` and `06-admin-players` (compact Plays switch); segmented control in `04-teams` and `05-settings` (Appearance); star picker in `06-admin-players`; password field in `01-sign-in` (`emailAuth = on`) and `01b-create-account`
**Depends on:** T-05

**Acceptance criteria**
- [ ] `Switch`: 52 × 32 with a 26 px white knob (compact 46 × 28). Track is the brand gradient when on, `switch-off` when off. `role="switch"` with `aria-checked`.
- [ ] `SegmentedControl`: a pill track in `surface` with a `line` border; the selected segment uses the `button` gradient with `on-brand` text. Each segment reports pressed state. It also works as a radio group (needed for Appearance in T-20).
- [ ] `StarPicker`: five 40 × 44 buttons with 26 px stars, each labelled "Set N stars".
- [ ] `TextField` and `PasswordField`: 56 tall, radius 16, a label above, an optional hint below. The password field has a 44 × 44 eye button labelled "Show password" / "Hide password".
- [ ] `Button`: primary is 56 tall, radius 16, on the `button` gradient. Secondary and danger variants. Smaller buttons follow the mockups (the `size.button` token says 48; the README and mockups use 56 for primary). Disabled buttons are dimmed and marked disabled.
- [ ] Keyboard Tab reaches every control on web, and Space/Enter operates it.

**Learning notes**
- React Native `Pressable` and `TextInput`; `accessibilityRole` and `accessibilityState`
- Controlled inputs in React (`value` plus `onChangeText`)
- WAI-ARIA switch pattern

---

### T-09 · Build the bottom tab bar and the Admin sub-tabs (#9)
**Milestone:** Foundation · **Labels:** player UI, admin UI · **Size:** M

**Summary:** Set up the signed-in routes: Home, Teams and Settings tabs for players, plus an Admin tab for admins. Inside Admin, the pill sub-tabs switch between Players, Runs, Team builder and Passes. Non-admins can't reach any admin route, even by typing the URL.

**Spec:** Access control (admins); Key flows › Admins and RSVPs
**Design:** README › Navigation; bottom nav in `02-home` (`plays` on/off shows 3 or 4 tabs) and `04-teams` (`role = admin` shows 4); sub-tabs in `06-admin-players`, `07-admin-runs`, `08-admin-team-builder`, `09-admin-season-passes`; Holidays reached from Runs (`11-admin-holidays`)
**Depends on:** T-04, T-05, T-07

**Acceptance criteria**
- [ ] Routes live under `src/app/(app)/`. Tabs: Home, Teams, Settings, and Admin only when the user is an admin. Each screen can be a placeholder for now.
- [ ] The bottom nav is a floating bar: 76 tall, radius 26, inset 12 px from the sides and 14 px from the bottom, in the `nav` colour with a `line` border and `shadow`. Each tab is a 24 px icon over a 12 px label. The active tab is `brand-text` with a 22 × 3 `brand` underline. Icons: house (Home), trophy (Teams), shield (Admin), gear (Settings), as 2 px line icons.
- [ ] Screen content scrolls underneath the floating bar without the last item being hidden behind it.
- [ ] Admin opens on Players. The sub-tab row (Players, Runs, Team builder, Passes) highlights the current page. Holidays is a route under Runs, with a back link.
- [ ] A player who types an admin URL lands on Home. (RLS already blocks the data. This is the UI guard.)
- [ ] The admin header shows "Admin" plus the ADMIN tag, as in the mockups.
- [ ] On a wide browser the content stays in a phone-width column. The desktop admin sidebar comes in T-46.

**Learning notes**
- Expo Router: groups `(app)`, `Tabs` layouts, nested layouts, and `Stack.Protected` for the admin group (Expo docs › Router)
- `useSegments` / `usePathname` to highlight the active sub-tab
- Icons: `@expo/vector-icons` or an SVG icon set with 2 px strokes
- Safe-area insets (`react-native-safe-area-context`) for a floating bar

---

### T-10 · Add the public /privacy page (#10)
**Milestone:** Foundation · **Labels:** player UI · **Size:** S

**Summary:** Publish `docs/privacy.md` at `/privacy`, readable without signing in, because Google's consent screen needs a public privacy policy URL. Link to it from the sign-in screen and from Settings.

**Spec:** Deployment and environments › Supabase settings (consent screen needs the privacy URL); Non-functional requirements › Privacy
**Design:** No mockup. Use the tokens: `page` background, `ink` text, Inter, a phone-width column, a back link
**Depends on:** T-05

**Acceptance criteria**
- [ ] `/privacy` opens when signed out and when signed in. It sits outside the protected route group.
- [ ] It shows the policy text with its headings and both tables, readable on a 390 px wide phone (tables scroll sideways or stack).
- [ ] The "Nov 2, 2026 · @Simar" byline line is left out. "Effective date: [date]" stays a visible placeholder until T-66 fills it in.
- [ ] The text comes from one place. Either the page imports the markdown, or the page is the source and `docs/privacy.md` says so. No two copies that can drift.
- [ ] The contact email is a `mailto:` link.

**Learning notes**
- Expo Router: routes outside a protected group
- Rendering markdown in React Native for web (for example `react-native-markdown-display`), versus hand-written `Text` blocks
- Metro: importing a non-JS asset, if you go that way

---

### T-11 · Restyle the sign-in screen to match the design (#11)
**Milestone:** Foundation · **Labels:** player UI · **Size:** S

**Summary:** Make the sign-in screen match the launch design: the logo at 112 px, the FirstTouch wordmark, the tagline, a "Continue with Google" button that follows Google's branding rules, and the privacy link at the bottom. No email section yet (that's T-59).

**Spec:** Overview (Google sign-in only at launch); Key flows › Email and password sign-in (status: off)
**Design:** `01-sign-in` with `emailAuth = off`; README › Screens › 01 Sign in, Brand (wordmark colours)
**Depends on:** T-04, T-06, T-07, T-08, T-10

**Acceptance criteria**
- [ ] Layout, spacing and sizes match `01-sign-in` (default), in light and dark.
- [ ] The wordmark is "First" in `ink` plus "Touch" in `brand-text`, weight 800.
- [ ] The Google button uses Google's official "G" mark and wording.
- [ ] "Privacy policy" opens `/privacy`.
- [ ] The error message from T-04 still shows under the button.

**Learning notes**
- Google Identity "Sign in with Google" branding guidelines
- `expo-image` for the logo
- Using theme tokens instead of hard-coded colours, so both themes work for free

---

### T-12 · Add pgTAP tests for lock time, morning-of and season run generation (#12)
**Milestone:** Foundation · **Labels:** database, tests · **Size:** M

**Summary:** T-02 covers permissions. This ticket covers the rest of the spec's database testing plan: the lock time across daylight-saving changes, the morning-of trigger, and `generate_season_runs` with holiday Mondays.

**Spec:** Testing plan (rows: Database rules, Lock time, Triggers); Long-weekend Mondays (dates table)
**Design:** No mockup
**Depends on:** T-02

**Acceptance criteria**
- [ ] `run_lock_at` for a 6:30 AM run is 5:30 AM Toronto time, including on the two weekends a year the clocks change.
- [ ] An RSVP at 5:29 succeeds and one at 5:31 is refused (fake the time, or set `start_time` relative to `now()`).
- [ ] A yes at 05:00 Toronto time on run day sets `morning_of`. A yes the day before doesn't. A yes at 23:30 the night before doesn't. Switching to "no" clears it.
- [ ] `generate_season_runs` creates every Saturday, Sunday and active holiday Monday in range, with the season's address and time. It ignores a holiday row that isn't a Monday, skips switched-off holidays and existing dates, and returns how many it created.
- [ ] `ontario_monday_holidays(2026..2028)` returns exactly the dates in the spec's table (no Easter Monday).
- [ ] `set_holiday_active` off deletes that day's run, and on adds it back only when the date is inside a season that already has runs.

**Learning notes**
- pgTAP: `is()`, `ok()`, `throws_ok()`, `results_eq()`
- Postgres `timestamptz` and `AT TIME ZONE`; how DST shifts UTC offsets
- Faking `now()` in tests (or computing dates relative to it)

---

### T-13 · Extend seed.sql with runs, RSVPs, passes and teams (#13)
**Milestone:** Foundation · **Labels:** database · **Size:** S

**Summary:** Local Supabase has seasons and 28 users but no runs, so every screen would be empty. Add sample runs around "this weekend", RSVPs (some morning-of), season passes (some unpaid) and one published run with teams, so screens can be built against realistic data.

**Spec:** Deployment and environments › Repo layout (seed.sql); Placeholders
**Design:** README › Placeholder data used in the mockups (about 20 going, 2 morning-of, 3 unpaid)
**Depends on:** T-12

**Acceptance criteria**
- [ ] After `npx supabase db reset`, the indoor season has runs from its start date to its end date, including holiday Mondays.
- [ ] Runs are placed relative to today, so there is always one published run (with teams) earlier this weekend or last weekend, one open run coming up with about 20 yes RSVPs, and one with fewer than 4.
- [ ] Two RSVPs are morning-of. About a quarter of players have no paid indoor pass. John is going and Sim isn't on one run (or the reverse). Coach has no RSVPs.
- [ ] Seed still never runs against dev or prod (it's local-only).
- [ ] T-02 and T-12 tests still pass (they don't depend on seed data).

**Learning notes**
- Why `generate_season_runs()` refuses to run in seed (no signed-in admin), and the options: insert runs directly, or set `request.jwt.claims` to an admin first
- `generate_series` for dates; `current_date` relative dates
- `supabase db reset` (re-runs migrations, then seed.sql)

---

## RSVP loop

### T-14 · Build the Home screen run cards (#14)
**Milestone:** RSVP loop · **Labels:** player UI · **Size:** M

**Summary:** Build Home for a playing member: the V2 header (app icon and pass chip), the greeting with its underline, the season subtitle, an "Upcoming runs" list with one Version 3 run card per run (curved `card-bar` left edge, date, time, address, the "RSVPs close" line, stacked avatars, the "{n} going" pill), and the "Auto team creation" card. The full-width "I'm in" button is drawn here but wired up in T-15.

**Spec:** Key flows (lifecycle; RSVP until 1 hour before); Lock time and player-facing views (`run_lock_at`); Long-weekend Mondays
**Design:** `02-home` with `plays = on`, `pass = paid | unpaid`, `theme = light | dark`. README › What changed in Version 3 (Curved left bar) and Shared components › Run card (Home, V3). Cards: open, closed (grey bar, no button), holiday (day kicker plus the holiday chip)
**Depends on:** T-09, T-13

**Acceptance criteria**
- [ ] Header: the 44 px app icon on the left and the pass chip on the right. No bell: the mockup's notification bell is left out (decision D4).
- [ ] "Morning, {first name}" with the 40 × 3 `brand` underline and the season subtitle.
- [ ] "Upcoming runs" shows runs from today through the next 7 days, in date order. *Design gap:* "View all" expands the list to every upcoming run in the season (the mockup links it to Run detail as a placeholder).
- [ ] Each card (radius 24, `surface`, `shadow-card`) has a curved 6 px left bar that follows the card's rounded corners, filled with `card-bar` (README › Curved left bar). Once RSVPs close the bar is `card-bar-closed`. No straight 4 px bar.
- [ ] Top row: the day kicker (SAT, SUN, MON) in `brand-text`, the 30 px date, and a 38-tall Details pill (`surface-2`, `line` border). A holiday Monday adds the holiday name from the `holidays` table as a 22-tall `brand-soft` chip next to the kicker.
- [ ] Left column: the run's own start time (clock icon) and address on two lines (pin icon), not hard-coded, then the lock-icon line "RSVPs close h:mm AM" in `muted`, which is start time minus 1 hour in Toronto time. Once that time passes it reads "RSVPs closed h:mm AM".
- [ ] Right column: three stacked 36 px avatars of the first three people going plus a "+n" circle, and under them a 40-tall "{n} going" pill. When you're going the pill has a check icon, `brand-soft` fill and a `brand-line` border; when you're not it has a clock icon and a `line` border.
- [ ] "{n} going" counts yes RSVPs from players with Plays on.
- [ ] Under the columns, a full-width 50-tall button (radius 16): "I'm in" (plus icon, `brand-line` outline, `brand-text`) or "You're in" (check icon, `button-in` fill, `on-brand` text, and `shadow-button-in` in dark). Its behaviour is T-15.
- [ ] Once RSVPs close the button is not shown. (The team panel that takes its place is T-41.)
- [ ] The pass chip reads "Indoor pass: Paid" or "Indoor pass: Not paid" for the current season (no `season_passes` row means Not paid). The greeting uses your first name.
- [ ] "Details" opens Run detail (a placeholder until T-18).
- [ ] After the run cards, the hero-gradient "Auto team creation" card reads "Teams are made automatically when RSVPs close, 1 hour before kickoff."
- [ ] Matches the V3 mockup in light and dark.

**Learning notes**
- TanStack Query `useQuery`; selecting related rows with supabase-js (`runs` plus `holidays`)
- PostgREST computed fields: selecting `run_lock_at` as if it were a column
- Formatting dates and times in `America/Toronto` (`Intl.DateTimeFormat` with `timeZone`)
- The curved bar: on web, a transparent 6 px left border plus layered `padding-box` / `border-box` backgrounds (README › Curved left bar). Build it once as a shared card frame, because T-38–T-41 reuse it with the team bars.
---

### T-15 · Add the "I'm in" RSVP toggle with instant feedback (#15)
**Milestone:** RSVP loop · **Labels:** player UI · **Size:** S

**Summary:** Make the full-width "I'm in" / "You're in" button work. Tapping it updates the card at once, saves your `rsvps` row, and rolls back with a message if the database refuses (for example because RSVPs just closed).

**Spec:** Key flows › RSVP request, step by step; Access control (rsvps row); Non-functional requirements › Performance (optimistic UI)
**Design:** `02-home` (V3 button states: off is "I'm in" with a plus icon, a `brand-line` outline and `brand-text`; on is "You're in" with a check icon, the `button-in` fill, `on-brand` text, and the `button-in-shadow` glow in dark only; after the lock the button is gone)
**Depends on:** T-14

**Acceptance criteria**
- [ ] Tapping toggles at once (optimistic) between "I'm in" and "You're in", then upserts `{ run_id, player_id, going }`. The button reports its state with `aria-pressed`.
- [ ] The "on" state uses `bg-button-in` and, in dark, `shadow-button-in` (the tokens from T-78), not the plain `button` gradient.
- [ ] If the save fails (after lock, or a network error), the button flips back and a short message explains why.
- [ ] The "{n} going" pill updates with the button: the count, and its going / not-going look (check icon and `brand-soft` vs clock icon and `line` border).
- [ ] Saying yes on the run's own date shows you with the Morning of badge in Run detail (the trigger does this; check it).
- [ ] A double tap never leaves the screen out of step with the database.

**Learning notes**
- TanStack Query `useMutation` with `onMutate`, `onError` rollback and `onSettled` invalidate ("optimistic updates" guide)
- supabase-js `upsert` and `onConflict`
- Reading Postgres RLS errors (code `42501`) on the client
---

### T-16 · Update going counts live with Supabase Realtime (#16)
**Milestone:** RSVP loop · **Labels:** player UI · **Size:** S

**Summary:** When someone else says yes or no, every open Home and Run detail screen updates its count without a refresh.

**Spec:** Architecture (Live updates); Key flows › RSVP request step 5; Access control (why everyone can read `rsvps`)
**Design:** `02-home`, `03-run-detail` (counts and lists)
**Depends on:** T-15

**Acceptance criteria**
- [ ] With two browsers signed in as different players, a toggle in one changes the count in the other within a couple of seconds.
- [ ] The subscription is removed when you leave the screen and is re-created after the tab sleeps and wakes.
- [ ] Only one Realtime channel is open, however many cards are on screen.

**Learning notes**
- Supabase Realtime "Postgres Changes" and how RLS applies to them
- `useEffect` cleanup; invalidating TanStack Query on an event
- Browser tab visibility (`visibilitychange`)

---

### T-17 · Show Coach's Home for admins who don't play (#17)
**Milestone:** RSVP loop · **Labels:** player UI, admin UI · **Size:** S

**Summary:** An admin with Plays off (Coach) sees the same run cards without the "I'm in" toggle. In its place is the muted line "You're managing this run". The top chip reads "Admin", and the Admin tab is in the nav.

**Spec:** Key flows › Admins and RSVPs; Access control › Admins
**Design:** `02-home` with `plays = off`
**Depends on:** T-14

**Acceptance criteria**
- [ ] With Plays off: no toggle, "You're managing this run" instead, and the chip reads "Admin" (the V2 mockup; the README still says "Admin · manages runs", see disagreements).
- [ ] The note under the count reads "RSVPs open", or "RSVPs are closed" after the lock.
- [ ] A playing admin (John, Sim) sees the normal player Home with a pass chip, plus the Admin tab.
- [ ] Turning Plays on or off for an admin (T-22) switches their Home on the next load.

**Learning notes**
- Conditional rendering in React
- Deriving UI from one `useMe` result (`plays`, admin status)

---

### T-18 · Build the Run detail screen (player view) (#18)
**Milestone:** RSVP loop · **Labels:** player UI, design · **Size:** M

**Summary:** Build Run detail: the floating hero-gradient header card with date, time, address and three glass stat tiles, your own RSVP panel, and "Who's coming" in RSVP order with position tags and Morning of badges. Players never see stars or Unpaid here.

**Spec:** Lock time and player-facing views (`run_roster`); Access control (stars and Unpaid admin-only); Key flows › Admins and RSVPs
**Design:** `03-run-detail` with `role = player`, `locked = false | true`, `going = true | false`
**Depends on:** T-15

**Acceptance criteria**
- [ ] The header is a floating card (inset 12 px, radius 28) on the `hero` gradient with a faint ball watermark. It shows "SUNDAY RUN · INDOOR" (day and season type), the date, start time, address, and translucent tiles for going, attackers and defenders.
- [ ] Your RSVP: "You're in" with a "Change" button, or "You're not going" with an "I'm in" button. Both toggle your RSVP in place (the mockup's "Change" link to Home is a placeholder).
- [ ] After the lock: "RSVPs closed h:mm AM" and a disabled "Locked" button with a lock icon.
- [ ] *Design gap:* for an admin with Plays off, the RSVP panel is replaced by the line "You're managing this run" (as on Home).
- [ ] "Who's coming" lists `run_roster` in `responded_at` order, with avatar, name, position tag and only the Morning of badge.
- [ ] The list updates live (reuse the T-16 subscription).

**Learning notes**
- Expo Router dynamic routes (`run/[id].tsx`) and `useLocalSearchParams`
- Selecting from a view (`run_roster`) with supabase-js
- Sharing one mutation hook between Home and Run detail

---

### T-19 · Add the admin view of Run detail (#19)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** S

**Summary:** For admins, each row on Run detail also shows the star rating and the Unpaid badge, and the list note reads "In order of RSVP · admin view". The data already comes back filled in for admins and empty for players.

**Spec:** Lock time and player-facing views (`run_roster` returns stars and `flag_unpaid` only for admins)
**Design:** `03-run-detail` with `role = admin` (drawn as John, not going, locked; Sim listed like any player)
**Depends on:** T-18

**Acceptance criteria**
- [ ] Admins see five small stars and the Unpaid badge where it applies. Players never do, even by changing the request in dev tools (stars come back `null`).
- [ ] The screen looks the same whether the admin is going, not going, or doesn't play.
- [ ] Playing admins appear in the list only when they've said yes, with no special badge.

**Learning notes**
- How `case when is_admin() then … end` in a view hides columns per caller
- Checking a request's response in the browser Network tab

---

### T-20 · Build the Settings screen: profile, name, appearance, privacy, sign out, delete account (#20)
**Milestone:** RSVP loop · **Labels:** player UI, database, design · **Size:** L

**Summary:** Build Settings without the Notifications section (T-32): profile card with avatar, name, pass chip and email; a pencil button to change your display name; the Appearance control (Light, Dark or System); the privacy link; Sign out; and Delete account with a confirmation. The Appearance choice is saved per player in a new `player_settings` table, which T-32 later adds the notification switches to.

**Spec:** Database functions (`update_my_name`); Non-functional requirements › Privacy (Delete account); Access control (players change only their name; own-row pattern like `push_subscriptions`). Appearance isn't in the spec (new in the V2 design)
**Design:** `05-settings` with `emailAuth = off` and `theme = light | dark` (profile card, Appearance between Notifications and Privacy, Privacy, Account); README › Global rules › Light and dark. The edit-name sheet and delete confirmation have no mockup: reuse the bottom sheet and confirm dialog from `07-admin-runs` (`overlay = sheet | confirm`)
**Depends on:** T-05, T-08, T-09, T-10

**Acceptance criteria**

*Profile and account*
- [ ] The profile card shows avatar, name, email, and a "Paid" or "Not paid" chip for the current season. *Design gap:* for an admin with Plays off, show the Admin badge instead of a pass chip.
- [ ] The pencil opens a sheet with a Name field. Saving calls `update_my_name`, and an empty name shows an error. The new name shows on Home and in lists.
- [ ] "Privacy policy" opens `/privacy`.
- [ ] Sign out returns to sign-in.
- [ ] "Delete account" (red) asks "Delete your account?" with what gets deleted. Confirming calls `delete_my_account`, signs out, and shows sign-in. Your RSVPs disappear from other screens.
- [ ] Your email isn't editable here (it comes from Google).

*Appearance*
- [ ] New migration: `player_settings` (one row per player, `theme` = `light` | `dark` | `system`, default `light`). RLS: players read and write only their own row; no access for `anon`. pgTAP tests prove a player can't read or change anyone else's row. `npm run db:types` is re-run and committed.
- [ ] The three-option control (a radio group built on the T-08 segmented control) shows the saved choice. Picking one switches the theme at once (using the T-05 theme module) and saves it.
- [ ] The hint changes with the choice: "Light is the default. Dark mode is optional." or, for System, "Follows your phone's light or dark setting."
- [ ] Signing in on a new browser applies the saved theme. Before sign-in (sign-in and /privacy), the device's last choice is used, or Light.

**Learning notes**
- supabase-js `rpc()` for database functions, and `upsert` for a one-row-per-player table
- Writing your own migration with a table and RLS policies (`npx supabase migration new`)
- A reusable bottom sheet and confirm dialog (React Native `Modal`, or a portal on web)
- Keeping a saved setting and the device in step (TanStack Query plus `localStorage`)

---

### T-21 · Build the Admin · Players list with search and filters (#21)
**Milestone:** RSVP loop · **Labels:** admin UI, design · **Size:** M

**Summary:** List everyone in the group for admins: admins first (Coach, John, Sim), then everyone else A to Z. It has a search field, the All / Flagged / ATT / DEF filters, and each card's name, Admin badge, flag badges and current stars and position. Editing comes in T-22.

**Spec:** Access control (profiles: admins read everything); Overview (flags)
**Design:** `06-admin-players` with `filter = all | flagged | att | def`
**Depends on:** T-09

**Acceptance criteria**
- [ ] Shows every active profile, admins first, then alphabetical. The search placeholder reads "Search {n} people", and search filters by name as you type.
- [ ] Filter chips show counts ("All 41", "Flagged 9"). ATT and DEF filter by position.
- [ ] *Flag meaning (the design shows flags per person, the spec stores them per RSVP):* Unpaid means no paid pass for the current season. Morning of means a morning-of yes for the next run. Flagged means either one.
- [ ] Cards with Plays off read "Manages only · never placed in teams", with the rating and position dimmed.
- [ ] The line above the list reads "{n} players · tap stars to rate".

**Learning notes**
- Reading `profiles` as an admin (RLS lets admins read it all)
- Filtering and sorting in the client with `useMemo` vs in the query
- `FlatList` for long lists in React Native

---

### T-22 · Let admins set stars, position and Plays (#22)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** S

**Summary:** Make the Players cards editable: tap a star to set the rating, tap Attack or Defend, flip Plays. Each change saves at once with optimistic UI.

**Spec:** Access control (`guard_profile_columns`; admins change stars, position, plays); Overview (new players start at 3 stars, Attack)
**Design:** `06-admin-players` (star picker, Attack/Defend toggle, compact Plays switch)
**Depends on:** T-08, T-21

**Acceptance criteria**
- [ ] Tapping star N sets `stars = N`. Attack/Defend sets `position`. The Plays switch sets `plays`. Each saves without a Save button and rolls back with a message on error.
- [ ] Turning Plays off dims the rating and position and shows the "Manages only" line. That person can no longer RSVP (the database refuses), and Home shows them Coach's view.
- [ ] Changing stars never shows up anywhere a player can see.
- [ ] A new sign-up appears with 3 stars and Attack.

**Learning notes**
- `useMutation` per field vs one generic "update profile" mutation
- Why the guard trigger exists even though RLS already allows only admins

---

### T-23 · Let admins make or remove other admins (#23)
**Milestone:** RSVP loop · **Labels:** admin UI, design, database · **Size:** S

**Summary:** The spec says admins promote others from the Players screen, but the mockup has no control for it. Add one using existing patterns: tapping a player's name opens a small sheet with an "Admin" switch. An admin can't remove their own admin role, so the group never loses its last admin by accident.

**Spec:** Access control › Admins ("admins promote others and switch plays on or off from the Players screen")
**Design:** No mockup for this control. Use the bottom sheet (`07-admin-runs`, `overlay = sheet`) plus the Switch from `05-settings`
**Depends on:** T-22

**Acceptance criteria**
- [ ] Tapping a name opens a sheet showing the name, email (admins can see it) and an "Admin" switch.
- [ ] Turning it on sets `role = 'admin'`. That person sees the Admin tab after their next load.
- [ ] Your own Admin switch is disabled, with the line "You can't remove your own admin role". Enforce this in the database too (a check in the guard trigger), with a pgTAP test.
- [ ] Admins move to the top of the list after promotion.

**Learning notes**
- Extending a trigger function in a new migration (before the first prod deploy you may still edit the original)
- pgTAP `throws_ok` for the new rule

---

### T-24 · Build the season card on Admin · Runs (#24)
**Milestone:** RSVP loop · **Labels:** admin UI, design · **Size:** M

**Summary:** The Season section of Admin · Runs: pick Indoor or Outdoor, set the season's start and end dates, and tap "Create runs", which calls `generate_season_runs` and reports how many runs it added. It also has the Holidays link and a way to choose the current season.

**Spec:** Key flows › Season run list (admin) steps 1, 2 and 5; Data model (`seasons.is_current`)
**Design:** `07-admin-runs` (Season section: title, Indoor/Outdoor segmented control, Start and End date, "Create runs", schedule note, "Holidays" link)
**Depends on:** T-08, T-09

**Acceptance criteria**
- [ ] The Indoor/Outdoor control switches between the two seasons. The title shows the season name.
- [ ] Start and End are real date pickers (the mockup shows text fields) and save to `starts_on` / `ends_on`. End before start shows an error.
- [ ] "Create runs" calls `generate_season_runs` and shows "Added {n} runs" (or "No new runs"). Running it again after extending the dates adds only the missing dates.
- [ ] The note reads "Every Saturday and Sunday at {time}, {address}, plus holiday Mondays." Outdoor adds "Outdoor runs always have 2 teams."
- [ ] *Design gap:* a "Current season" switch on the card sets `is_current` (only one can be current; the database enforces this). Home and the pass chips use the current season.
- [ ] "Holidays" opens the Holidays screen (T-27).

**Learning notes**
- A date picker on React Native for web (`<input type="date">` via a web-only component, or a library)
- Postgres partial unique index (`one_current_season`) and the error it raises
- `rpc()` return values

---

### T-25 · List every run of the season on Admin · Runs (#25)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** M

**Summary:** Under the season card, list the season's runs, past and upcoming. Each row shows day and date, holiday name, time and address, "{n} going" (or a reason), and a status chip. Tapping a row opens the edit sheet (T-26).

**Spec:** Key flows › Season run list (admin) step 3
**Design:** `07-admin-runs` ("All runs this season", "Tap a run to edit", "Show all {n} runs")
**Depends on:** T-24

**Acceptance criteria**
- [ ] Rows show the DOW/day/month block, holiday name if any, "{time} · {address}", "{n} going" and the status chip.
- [ ] A locked run with fewer than 4 players reads "No teams · not enough players". A cancelled run reads "Cancelled by an admin".
- [ ] The list starts around today and shows about 9 rows. "Show all {n} runs" expands to the full season.
- [ ] Counts load in one query, not one request per row.

**Learning notes**
- Counting related rows with supabase-js (`rsvps(count)`) or a small view
- `SectionList` / `FlatList` and scrolling to "today"

---

### T-26 · Add the edit-run sheet: time, address, cancel and delete (#26)
**Milestone:** RSVP loop · **Labels:** admin UI, design · **Size:** M

**Summary:** Tapping a run opens a bottom sheet to change its start time and address, or delete it. Deleting a run that has yes RSVPs asks for confirmation first. The sheet also has "Cancel run" (decision D2), which keeps the run but marks it cancelled. The pushes for these changes come in T-48.

**Spec:** Key flows › Season run list (admin) step 4; Data model (`run_status` includes `cancelled`); Notifications › Messages (run moved; run cancelled or deleted)
**Design:** `07-admin-runs` with `overlay = sheet` and `overlay = confirm` (`compact = true`)
**Depends on:** T-25

**Acceptance criteria**
- [ ] The sheet shows the run title and "Indoor · {status} · {n} going", a Start time field with the hint "RSVPs close and teams publish 1 hour before", an Address field, "Save changes" and a red "Delete run".
- [ ] Saving updates `start_time` / `location`. The new lock time shows on Home at once. Editing a run that's already locked doesn't reopen RSVPs (the sheet says so).
- [ ] Delete with no RSVPs deletes straight away. With yes RSVPs: the dialog "Delete {run}?" / "{n} players said yes. They'll be told this run is cancelled." with Cancel and a red Delete.
- [ ] *(D2)* "Cancel run" sets `status = 'cancelled'` after the same style of confirmation. The run stays in the list with the Cancelled chip, and Home shows it as cancelled with no toggle.
- [ ] The sheet closes with the X, the scrim, and Escape on web.

**Learning notes**
- A bottom sheet with a 28 radius over a 50% scrim (React Native `Modal`, or a sheet library that works on web)
- Time inputs and Postgres `time` values (`06:30:00`)
- `delete` with supabase-js, and what cascades

---

### T-27 · Build the Admin · Holidays screen (#27)
**Milestone:** RSVP loop · **Labels:** admin UI, design · **Size:** M

**Summary:** List the holiday Mondays from the `holidays` table with the season each falls in and an on/off switch. Switching one off deletes its run (with a confirmation if players said yes). Switching it back on adds the run again.

**Spec:** Key flows › Long-weekend Mondays; Database functions (`set_holiday_active`)
**Design:** `11-admin-holidays`
**Depends on:** T-24, T-26 (reuses the confirm dialog)

**Acceptance criteria**
- [ ] A back link to Runs, the title, and the note "Holiday Mondays inside a season become runs automatically."
- [ ] Rows read "{Mon Oct 12, 2026} · {name}" with the season name below, sorted by date from today on. *Design gap:* a date outside every season reads "Not in a season". Easter Monday never appears unless an admin adds it (the mockup's Easter Monday row is wrong; see disagreements).
- [ ] Switching off calls `set_holiday_active(date, false)`. The row greys out and reads "Off · no run". If the run had yes RSVPs, the T-26 confirmation shows first.
- [ ] Switching on calls `set_holiday_active(date, true)`, and the run appears in the season list.

**Learning notes**
- `rpc()` with named arguments
- Joining a date to the season whose range contains it (client side or in SQL)

---

### T-28 · Let admins add a one-off holiday date (#28)
**Milestone:** RSVP loop · **Labels:** admin UI, database, design · **Size:** S

**Summary:** The "Add date" button opens a sheet for a Monday and a name. A new database function inserts it and, as with switching a holiday on, adds its run straight away if it falls inside a season that already has runs.

**Spec:** Key flows › Long-weekend Mondays ("Admins can add a one-off date"); Access control (holidays: admins write)
**Design:** `11-admin-holidays` ("Add date" dashed button). The form has no mockup: reuse the bottom sheet from `07-admin-runs`
**Depends on:** T-27

**Acceptance criteria**
- [ ] New migration: `add_holiday(holiday_date date, name text)`. Admin-only, Mondays only (anything else raises an error), and adds the run if the date is inside a season with runs. Execute is granted to `authenticated`.
- [ ] pgTAP tests: a player is refused, a Tuesday is refused, a Monday inside a season with runs creates the run.
- [ ] The sheet has a date picker and a Name field. Saving shows the new row in the list.
- [ ] `npm run db:types` is re-run and committed.

**Learning notes**
- Writing a `security definer` function with `set search_path`
- `extract(isodow from …)`
- Regenerating `database.types.ts`

---

## Teams

### T-29 · Implement balanceTeams: team count, sizes and snake draft (#29)
**Milestone:** Teams · **Labels:** functions, tests · **Size:** M

**Summary:** First half of the balancing algorithm in `supabase/functions/_shared/balance.ts`: a seeded random number generator, the team-count and team-size rules, and the snake draft. Vitest tests cover each rule.

**Spec:** Team balancing spec › Interface, Rules, Algorithm steps 1–2
**Design:** No mockup
**Depends on:** T-01 merged

**Acceptance criteria**
- [ ] A small seeded RNG (for example mulberry32) gives the same numbers for the same seed.
- [ ] Team count: outdoor is always 2. Indoor is 2 up to 18 players and 3 from 19. `teamCountOverride` wins over both.
- [ ] Sizes are as equal as possible, with the remainder going one each to Blue, then Yellow (40 indoor gives 14/13/13; 27 outdoor gives 14/13).
- [ ] Snake draft: defenders by stars, highest first, dealt Blue, Yellow, Red, Red, Yellow, Blue…, skipping full teams. Then attackers the same way, starting with the lowest star total. Ties are ordered by the RNG.
- [ ] Fewer than 4 players returns no teams (or throws a named error; pick one and document it).
- [ ] Vitest: team count for 4, 14, 18, 19, 24, 27 and 40 players, indoor and outdoor; the override; sizes; the same seed gives the same teams. The placeholder "not implemented" test is removed.

**Learning notes**
- Pure functions and why they are easy to test
- Seeded pseudo-random generators (mulberry32) vs `Math.random`
- Vitest `describe`, `it`, `expect`, `it.each` tables

---

### T-30 · Finish balanceTeams: swaps, restarts, slots and output checks (#30)
**Milestone:** Teams · **Labels:** functions, tests · **Size:** M

**Summary:** Second half: score a split, improve it by trying every two-player swap, repeat from 20 seeded starting orders, assign slots, and check the output before returning. A test checks it runs well under a second for 27 players.

**Spec:** Team balancing spec › Algorithm steps 3–5, the score formula, Output check
**Design:** No mockup
**Depends on:** T-29

**Acceptance criteria**
- [ ] `score = 3·range(team stars) + 2·range(attackers) + 10·range(team size)`, with the weights in an exported config object.
- [ ] The swap loop keeps any swap that lowers the score and repeats until none helps. 20 seeded restarts, and the lowest score wins.
- [ ] Slots: defenders first, then attackers, each by stars.
- [ ] Before returning, it asserts every player appears exactly once, sizes differ by at most 1, and the team count matches the rules.
- [ ] Each `Team` has the correct `stars`, `attackers` and `defenders` totals.
- [ ] Vitest: star ranges are small on random rosters (for example at most 2 on 200 random 27-player rosters), the same seed gives the same result, and 27 players with 20 restarts runs in under a second.

**Learning notes**
- Local search / hill climbing
- Writing property-style tests with many random inputs
- Measuring time in a test (`performance.now()`)

---

### T-31 · Add the web manifest, service worker and VAPID keys (#31)
**Milestone:** Teams · **Labels:** infra · **Size:** M

**Summary:** Make the site installable and ready for push: a web manifest with name, icons, start URL and standalone display; a service worker at the site root that shows pushes and opens the right screen when tapped; and a VAPID key pair (public key in the app's env, private key as a Supabase secret).

**Spec:** Notifications › Setup steps 1–2; Architecture (Service worker + manifest in `public/`); Non-functional requirements › Security (no secrets in the browser)
**Design:** README › Brand (icon for the Home Screen); icon sizes from T-06
**Depends on:** T-06

**Acceptance criteria**
- [ ] `public/manifest.json` (name FirstTouch, short name, icons 192/512, `start_url`, `display: standalone`, theme and background colours) is linked from the page head, along with the Apple touch icon.
- [ ] `public/sw.js` is served at `/sw.js`, registered on load (web only), and on a `push` event shows the notification. On `notificationclick` it focuses or opens the URL in the payload.
- [ ] A VAPID key pair exists. `EXPO_PUBLIC_VAPID_PUBLIC_KEY` is in `.env.example` (placeholder) and `.env.development`. The private key is set as a Supabase secret on dev only. How to make and store keys is written in `docs/environments.md`.
- [ ] Chrome DevTools › Application shows the manifest with no errors and the service worker as activated.

**Learning notes**
- Expo docs: the `public/` folder, and customising the web HTML head for `web.output: "single"` (check which applies in SDK 58)
- Service worker lifecycle (`install`, `activate`, `push`, `notificationclick`)
- Web Push and VAPID: what the public and private keys are for (`npx web-push generate-vapid-keys`)
- Supabase secrets (`supabase secrets set`)

---

### T-32 · Let players turn on notifications in Settings (#32)
**Milestone:** Teams · **Labels:** player UI, database, design · **Size:** M

**Summary:** Add the Notifications section to Settings. Until this browser is subscribed it shows an "Enable notifications" button (the permission prompt must come from a tap, which iOS requires). After that it shows the design's three switches. The subscription is saved to `push_subscriptions`, and the switches are saved per player (see decision D1).

**Spec:** Notifications › Setup steps 3–4; Access control (push_subscriptions: own insert/delete)
**Design:** `05-settings` (Notifications: "Night-before reminder", "Teams published", "Changes and cancellations"). The "Enable notifications" button has no mockup: use the primary button style inside the same card
**Depends on:** T-20, T-31

**Acceptance criteria**
- [ ] Tapping "Enable notifications" asks for permission, subscribes with the VAPID public key, and saves `endpoint`, `p256dh` and `auth` to `push_subscriptions`. If permission is denied, it explains how to allow it in the browser.
- [ ] *(D1)* New migration: three boolean columns on `player_settings` (from T-20), all on by default: `notify_reminder`, `notify_teams`, `notify_changes`. pgTAP tests prove players still can't read anyone else's row.
- [ ] The three switches save to it. Hints: "The evening before a run you haven't answered" (the mockup's "each run you're in" contradicts the spec), "When RSVPs close and teams are set", "Time, address or cancelled runs".
- [ ] A "Turn off on this device" link deletes this browser's subscription.
- [ ] Browsers without Push support (and iPhone Safari outside the Home Screen, see T-33) don't show the button.
- [ ] `npm run db:types` is re-run and committed.

**Learning notes**
- `Notification.requestPermission()`, `PushManager.subscribe()` and `applicationServerKey`
- Why iOS needs the app on the Home Screen (iOS 16.4+) before Push works
- Platform-specific code in Expo (`Platform.OS === 'web'`, `.web.ts` files)

---

### T-33 · Show the "Add to Home Screen" banner on iPhone (#33)
**Milestone:** Teams · **Labels:** player UI · **Size:** S

**Summary:** On an iPhone in a normal Safari tab, push can't work until FirstTouch is added to the Home Screen. Show the design's dismissible banner on Home, and show the same message in Settings in place of the "Enable notifications" button.

**Spec:** Notifications › Setup step 5
**Design:** `02-home` (banner "Add FirstTouch to your Home Screen for notifications" with an X)
**Depends on:** T-32

**Acceptance criteria**
- [ ] The banner shows only on iOS Safari when the page isn't running standalone. It never shows on Android, desktop, or the installed app.
- [ ] X hides it, and it stays hidden on that device (saved in `localStorage`).
- [ ] Settings shows a short "Add to Home Screen, then open FirstTouch from there to turn on notifications" message instead of the button in the same situation.
- [ ] Tested in the iOS Simulator's Safari, or on a real iPhone.

**Learning notes**
- Detecting standalone mode (`navigator.standalone`, `matchMedia('(display-mode: standalone)')`)
- `localStorage` on web vs AsyncStorage

---

### T-34 · Build the send-push Edge Function (#34)
**Milestone:** Teams · **Labels:** functions, database · **Size:** M

**Summary:** A Deno Edge Function that sends Web Push messages to a list of players. It's called by the database (through pg_net) or by an admin, respects each player's notification switches, deletes subscriptions the push service says are gone, and logs failures to `job_errors`.

**Spec:** Server functions and scheduled jobs › Edge Functions (send-push); Access control ("the Edge Functions milestone adds" service_role grants); Non-functional requirements › Monitoring
**Design:** No mockup
**Depends on:** T-31, T-32

**Acceptance criteria**
- [ ] `supabase/functions/send-push/index.ts` accepts `{ messages: [{ player_ids, title, body, url, category }] }` and returns `{ sent, failed }`.
- [ ] Only the service role key or a signed-in admin can call it. Anyone else gets 401/403.
- [ ] Players who switched that category off are skipped. Admin alerts always send.
- [ ] Subscriptions that return HTTP 404 or 410 are deleted. Other failures write a `job_errors` row with `source = 'send-push'`.
- [ ] New migration: `service_role` gets only what this function needs (read `push_subscriptions` and `player_settings`, delete `push_subscriptions`, insert `job_errors`, read `profiles` for the admin check). pgTAP checks the grants.
- [ ] Works locally with `npx supabase functions serve` and a real browser subscription.

**Learning notes**
- Supabase Edge Functions on Deno: `Deno.serve`, `supabase functions serve`, and secrets via `Deno.env`
- A Web Push library that runs on Deno (for example `jsr:@negrel/webpush`, or `npm:web-push` if it works there)
- Checking the caller's JWT inside a function (`supabase.auth.getUser`)
- Postgres `grant … to service_role`

---

### T-35 · Add save_teams, publish_teams and the service_role grants (#35)
**Milestone:** Teams · **Labels:** database, tests · **Size:** M

**Summary:** Database side of team generation. `save_teams(run_id, teams jsonb)` replaces a run's team assignments and calls `publish_teams` in one transaction (an Edge Function can't run a multi-step transaction through supabase-js). `publish_teams(run_id)` marks the run published and sends "Teams are up" or "Teams updated" through send-push.

**Spec:** Database functions (`publish_teams`); Edge Functions (generate-teams "replaces … in one transaction; calls publish_teams()"); Notifications › Messages (rows 2 and 3)
**Design:** No mockup
**Depends on:** T-34

**Acceptance criteria**
- [ ] `save_teams` deletes the run's `team_assignments`, inserts the new ones (team and slot), then calls `publish_teams`, all in one transaction. It's executable by `service_role` only.
- [ ] `publish_teams` sets `status = 'published'` and `published_at = now()`. The first time it sends "Teams for {Saturday} are up — you're on {Blue}." to each player going. After that it sends "Teams for {Saturday} were updated — you're now on {Yellow}." The push goes through pg_net to send-push.
- [ ] `service_role` gets read access to `runs`, `seasons`, `rsvps` and `profiles` for generate-teams (it can't use `run_roster`, which hides stars from non-admins; see disagreement S1).
- [ ] The send-push URL and service key come from Supabase Vault, not from the migration. Local setup is documented.
- [ ] pgTAP: players and admins can't call `save_teams` directly. After `save_teams` a player can read the teams. A second call replaces, not appends.
- [ ] `npm run db:types` is re-run and committed.

**Learning notes**
- Postgres functions as transactions; `jsonb_to_recordset`
- pg_net `net.http_post` (asynchronous: it returns a request id, not the response)
- Supabase Vault (`vault.create_secret`, `vault.decrypted_secrets`)

---

### T-36 · Build the generate-teams Edge Function (#36)
**Milestone:** Teams · **Labels:** functions · **Size:** M

**Summary:** The function the lock job and the Reshuffle button call. It checks the caller, loads who is going and the season type, runs `balanceTeams`, and saves through `save_teams`. With fewer than 4 players it leaves the run locked and alerts the admins.

**Spec:** Edge Functions (generate-teams); Lock and publish, step by step; Team balancing spec › Rules (who is included)
**Design:** No mockup
**Depends on:** T-30, T-35

**Acceptance criteria**
- [ ] `supabase/functions/generate-teams/index.ts` accepts `{ run_id, seed? }`. Only the service role or an admin can call it.
- [ ] It includes every yes RSVP from a profile with Plays on (paid or not, morning-of or not). It uses the season type and `team_count_override`.
- [ ] It imports `balanceTeams` from `_shared/balance.ts` (the same file Vitest tests).
- [ ] 4 or more players: it calls `save_teams` and returns teams with star totals, sizes and ATT/DEF counts.
- [ ] Fewer than 4: no teams, the run stays locked, and admins get "Only {n} players for {Sunday}'s run; no teams made." Nothing is written to `team_assignments`.
- [ ] It runs locally against the seeded published and empty runs, end to end, in under 2 seconds.

**Learning notes**
- Importing shared code into an Edge Function (`../_shared/`) and how Deno resolves `.ts` imports
- `supabase.functions.invoke` from the app (for Reshuffle)
- Supabase client with the service role key, server side only

---

### T-37 · Schedule the lock-and-publish job with pg_cron (#37)
**Milestone:** Teams · **Labels:** database · **Size:** M

**Summary:** Every 5 minutes, a database job finds open runs whose lock time has passed, sets them to locked, and calls generate-teams for each with a random seed. This is what makes teams appear by themselves 1 hour before kick-off.

**Spec:** Scheduled jobs (lock-and-publish); Lock and publish, step by step; Deployment › Supabase settings (pg_cron and pg_net enabled)
**Design:** No mockup
**Depends on:** T-36

**Acceptance criteria**
- [ ] New migration enables `pg_cron` and `pg_net` and adds `lock_due_runs()`: it locks each open run where `now() >= run_lock_at`, then calls generate-teams through pg_net with the service key from Vault.
- [ ] Scheduled with `cron.schedule('lock-and-publish', '*/5 * * * *', …)`.
- [ ] Only runs that move from open to locked in this tick are sent to generate-teams, so a run with fewer than 4 players doesn't alert admins every 5 minutes.
- [ ] A failed call writes to `job_errors` (`source = 'lock-and-publish'`).
- [ ] Locally: a seeded run starting in about 61 minutes locks and publishes within 5 minutes of its lock time. A run with 3 players stays locked, and admins get the push.

**Learning notes**
- pg_cron: `cron.schedule`, `cron.job_run_details`; it runs in UTC
- pg_net responses (`net._http_response`) for debugging
- Why RLS already blocks late RSVPs even if the job runs a few minutes late

---

### T-38 · Build the Teams screen table view (#38)
**Milestone:** Teams · **Labels:** player UI, admin UI, design · **Size:** M

**Summary:** The Teams tab shows the next run's published teams: run summary, the Table / Field switch, "Published h:mm AM", the "Your team" card for players, and one Version 3 card per team (team-colour wash, curved team bar, ball, team-colour chip) with rows and a footer. Admins also see stars, star totals and Unpaid badges.

**Spec:** Access control (team_assignments readable once published; stars and Unpaid admin-only)
**Design:** `04-teams` with `view = table`, `role = player | admin`, `teams = 3 | 2`, `theme = light | dark`; README › What changed in Version 3 (Curved left bar), Shared components › Team card (Teams, V3) and Your team card (Teams, players only, V3)
**Depends on:** T-07, T-08, T-37

**Acceptance criteria**
- [ ] Shows the soonest run (today or later) with published teams, or the most recent published run if none are upcoming.
- [ ] The top shows the run summary, the Table / Field pill control, and the "Published h:mm AM" line.
- [ ] Players see a "Your team" card under the "Published" line, above the team cards: radius 24, their team's `team-*-wash` over `surface`, a curved 6 px left bar in `team-*-bar`, `shadow-card`. It shows "YOUR TEAM" (12 px, 800, 0.1em tracking, `muted`), a 22 px team dot with a 5 px soft ring, the team name at 30 px / 800, and "{n} players · ATT/DEF {a}:{d}" in `muted`. No avatars.
- [ ] Admins never see the "Your team" card. *Design gap:* a player who isn't on a team in this run (not going) doesn't see it either.
- [ ] Each team card: radius 26, the team's `team-*-wash` over `surface`, a curved 6 px left bar in `team-*-bar` (no straight 4 px bar), `shadow-card`, and a 200 px soccer ball peeking in from the right edge drawn with `ball-fill`, `ball-patch` and `ball-line`.
- [ ] Team card header: an 18 px team dot with a soft glow, the team name (always written out) at 22 px / 800, and a 34-tall "{n} players" chip in `team-*-chip` / `team-*-chip-fg` (solid team colour in light; a 40% team tint with white text in dark).
- [ ] Rows show avatar, name (plus " · You" for yourself), Morning of badge and position tag. The footer shows Players and ATT / DEF.
- [ ] Admin: rows add stars and Unpaid, and the footer adds Total stars. The Admin tab shows in the nav.
- [ ] *Design gap:* with nothing published yet, show "Teams publish automatically at {lock time}" for the next run. If it's locked with fewer than 4 players, show "Not enough players — no teams made".
- [ ] The Table/Field control switches views (Field is T-39 and T-40). The "Your team" card stays in both views.
- [ ] Matches the V3 mockup in light and dark.

**Learning notes**
- Grouping rows by team in the client (`reduce`)
- Joining `team_assignments` to `run_roster` / `player_directory` for names and flags
- Mapping a team name to its whole class names (`bg-team-blue-wash`, `bg-team-blue-bar`, `bg-team-blue-chip`, …) in one lookup object, so Tailwind can see them
- Reusing the curved card frame from T-14 with a team bar and wash
---

### T-39 · Draw the indoor Field view (three half-pitches) (#39)
**Milestone:** Teams · **Labels:** player UI, admin UI · **Size:** M

**Summary:** The Field view for a run with three teams: the "Your team" card for players (from T-38), then one half-pitch card per team with defenders on a back line near the goal and attackers on a front line, as 32 px circles with initials in the team colour. Flag dots and a legend show only what the viewer may see.

**Spec:** Data model ("Field positions are not stored: the client draws them from team, position and slot")
**Design:** `04-teams` with `view = field`, `teams = 3`, `role = player | admin`, `theme`; README › Shared components › Pitch and Your team card (V3)
**Depends on:** T-38

**Acceptance criteria**
- [ ] Players see the same "Your team" card as in the Table view, above the pitches. Admins don't.
- [ ] Each half-pitch card (radius 22) uses the V3 team frame: the team's `team-*-wash` over `surface` and a curved 6 px left bar in `team-*-bar`. Its header has a 12 px team dot with a soft ring, the team name and the team's meta line.
- [ ] The pitch is drawn with react-native-svg (the `grass` gradient, stripes, `pitch-lines`, goal box), radius 14–16, in the light or dark values.
- [ ] Player dots are 32 px team-coloured circles with initials, a white border and a 3 px team-colour glow.
- [ ] Defenders sit at 22% across and attackers at 66%, spread evenly down the line by slot, and zig-zagged when a line has 4 or more.
- [ ] Each circle is labelled "{name}, {team}, {position}" for screen readers.
- [ ] Flag dots: amber Morning of for everyone, red Unpaid for admins only. The legend lists only the flags the viewer can see, plus "Back line DEF · front line ATT".
- [ ] A player moved in the Team builder appears in the new team's lines after refresh (or live, after T-42).

**Learning notes**
- react-native-svg (`Svg`, `Rect`, `Circle`, `G`) on web
- Absolute positioning with percentages over an SVG
- Writing the layout maths as a pure function you can unit test
---

### T-40 · Draw the outdoor Field view (full pitch) (#40)
**Milestone:** Teams · **Labels:** player UI, admin UI · **Size:** S

**Summary:** For two-team runs (outdoor, or an indoor run with 18 or fewer), show the "Your team" card for players, then draw one full pitch with Blue on the left and Yellow on the right, plus a summary card per team.

**Spec:** Team balancing spec › Rules (outdoor always 2)
**Design:** `04-teams` with `view = field`, `teams = 2`; README › Your team card (V3)
**Depends on:** T-39

**Acceptance criteria**
- [ ] Players see the same "Your team" card as in the Table view, above the pitch. Admins don't.
- [ ] Full pitch with a halfway line, centre circle and both boxes. Blue defenders at 11% and attackers at 35%. Yellow mirrored at 89% and 65%.
- [ ] Summary cards (radius 20) use the V3 team frame: `team-*-wash` over `surface` and a curved 6 px `team-*-bar`. They read "{n} players" plus "ATT/DEF a:d" (players), or "★ total · a:d" (admins).
- [ ] Reuses the layout function, flag dots and legend from T-39.

**Learning notes**
- Mirroring coordinates; reusing a pure layout function with options
---

### T-41 · Show "Teams are up" on Home and Run detail (#41)
**Milestone:** Teams · **Labels:** player UI, design · **Size:** S

**Summary:** Once teams are published, a closed run card on Home shows the Version 3 team panel in place of the "I'm in" button: your team's wash, a team dot, "You're on {team}" over "{n} players · ATT/DEF {a}:{d}", and a "View teams" button. Coach, and players who aren't going, see "Teams are up" with no team of their own.

**Spec:** Key flows (players see teams the moment RSVPs close)
**Design:** `02-home` (closed card panel; `plays = off` variant); README › 02 Home › Closed card (V3)
**Depends on:** T-17, T-38

**Acceptance criteria**
- [ ] The panel replaces the "I'm in" button on a closed card (the card's bar is already `card-bar-closed` from T-14). It is radius 18 with a `line` border, a 16 px dot with a 4 px soft ring, a title (16 px / 800) over a subtitle (13 px, `muted`), and a "View teams" button (`button` gradient, `on-brand`) on the right.
- [ ] Published and you're on a team: the panel is your team's `team-*-wash` over `surface-2`, the dot is your team colour, and it reads "You're on {team}" over "{n} players · ATT/DEF {a}:{d}". "View teams" opens Teams for that run.
- [ ] Published and you don't play (Coach): the panel is `surface-2` with a `brand` dot, and reads "Teams are up" over "{n} teams · published h:mm AM", plus "View teams".
- [ ] *Design gap:* published and you're a player who isn't going: the same "Teams are up" panel as Coach.
- [ ] *Design gap:* locked with fewer than 4 players: a muted "Not enough players — no teams this time" and no button.
- [ ] Run detail shows the same panel under the RSVP section.
- [ ] Matches the V3 mockup in light and dark.

**Learning notes**
- Passing a run id to the Teams tab (route params or a search param)
- Reusing the team lookup object from T-38 for the wash and dot colour
---

### T-42 · Push team and run changes live with Realtime (#42)
**Milestone:** Teams · **Labels:** database, player UI · **Size:** S

**Summary:** The spec says players see a moved player or a reshuffle "at once". Add `team_assignments` and `runs` to the Realtime publication and refresh the Teams screen, Home cards and the Team builder when they change.

**Spec:** Key flows ("players see the change at once"); Architecture (Live updates)
**Design:** No mockup
**Depends on:** T-38, T-16

**Acceptance criteria**
- [ ] New migration adds `team_assignments` and `runs` to `supabase_realtime`.
- [ ] A Reshuffle by an admin updates an open Teams screen in another browser within a couple of seconds.
- [ ] A run's status change (open, locked, published) updates Home without a refresh.
- [ ] Players still never receive rows from unpublished runs (RLS applies to Realtime; check it).

**Learning notes**
- `alter publication supabase_realtime add table …`
- How Realtime applies RLS, and the caveat for DELETE events

---

### T-43 · Add the Next run card to Admin · Runs (#43)
**Milestone:** Teams · **Labels:** admin UI · **Size:** M

**Summary:** At the top of Admin · Runs, a card for the next run shows its status chip, stat tiles (going, ATT : DEF, flagged) and a line that changes with the state. A "View teams" button appears once teams are published.

**Spec:** Key flows (open → locked → published, or cancelled); Lock and publish step 5 (fewer than 4)
**Design:** `07-admin-runs` with `status = open | locked | published | cancelled | empty`
**Depends on:** T-25, T-37

**Acceptance criteria**
- [ ] Status chip and line per state: open "RSVPs close h:mm · teams publish automatically", locked "RSVPs closed h:mm · publishing teams now", published "Teams published automatically at h:mm", cancelled "Cancelled · players who said yes were told", empty (locked, under 4) the amber "Not enough players — no teams made".
- [ ] Tiles: going, ATT : DEF, flagged (Morning of plus Unpaid for this run).
- [ ] "View teams" opens the Team builder on that run.
- [ ] Updates live (T-42).

**Learning notes**
- Mapping a status enum to UI with a lookup object instead of nested `if`s

---

### T-44 · Build the Admin · Team builder: summary, team count and Reshuffle (#44)
**Milestone:** Teams · **Labels:** admin UI, design · **Size:** M

**Summary:** The mobile Team builder opens on the published teams. It shows a summary card (run, "Published h:mm", season, 2/3 team picker, Reshuffle), the flag legend, and one card per team with a fairness bar and two columns of player chips. Dragging comes in T-45.

**Spec:** Lock and publish step 6 (Reshuffle reruns generate-teams and sends "Teams updated"); Team balancing spec › Rules (admin override)
**Design:** `08-admin-team-builder`
**Depends on:** T-36, T-38

**Acceptance criteria**
- [ ] Opens on the same run Teams would show. Summary: "{Sat, Feb 13} · {n} players", time and address, the "Published h:mm" chip, the season label.
- [ ] Reshuffle calls generate-teams with a new seed. Teams change, and players get "Teams updated".
- [ ] The 2 / 3 picker sets `team_count_override` and reshuffles straight away (so it also notifies). The note reads "Changes save instantly. Players are notified when you reshuffle."
- [ ] Team cards: name, "{n} · a:d", star total, a fairness bar on a 30-star scale, and chips with first name, flag dot, "{n}★" and position tag.
- [ ] *Design gap:* with nothing published yet, the same empty states as T-38.

**Learning notes**
- `supabase.functions.invoke('generate-teams', { body })`
- Disabling a button while a mutation is running (`isPending`)

---

### T-45 · Let admins drag players between teams with the fairness bar (#45)
**Milestone:** Teams · **Labels:** admin UI · **Size:** L

**Summary:** Admins drag a player chip onto another team. While dragging, the old slot is dashed and faded, the chip is lifted, and the target team gets a highlight ring and a "Drop here" slot. The fairness bars preview the change, and an amber line warns when the move widens the star spread. Dropping saves at once and doesn't send a push.

**Spec:** Lock and publish step 6 ("drag players between teams (admin-only by RLS)"); Access control (team_assignments: admin everything)
**Design:** `08-admin-team-builder` (drag state: ghost slot, lifted chip, ring, "Drop here", faded bar delta, warning "Moving Lena widens the star spread from 1 to 6")
**Depends on:** T-44

**Acceptance criteria**
- [ ] Drag works with a mouse and with touch on a phone browser. A non-drag fallback (tap a chip, then tap a team) works with the keyboard and screen readers.
- [ ] While dragging: ghost slot, lifted chip, highlight ring, "Drop here", and the bar shows the before and after totals faded.
- [ ] If the move widens the gap between the highest and lowest team star totals, the amber warning shows the before and after spread. The admin can still drop.
- [ ] Dropping updates that player's `team_assignments.team` and re-numbers slots. A player's Teams screen shows the change (live after T-42). No push is sent.
- [ ] Team sizes may become unequal after a move. The header counts show it.

**Learning notes**
- react-native-gesture-handler `Gesture.Pan()` plus react-native-reanimated shared values (both already installed), and how they behave on web
- Measuring drop zones (`onLayout` / `measure`)
- Accessible alternatives to drag and drop

---

### T-46 · Build the desktop Team builder with the admin sidebar (#46)
**Milestone:** Teams · **Labels:** admin UI, design · **Size:** M

**Summary:** On a wide screen, the admin area gets the pitch-green sidebar (logo, Players / Runs / Team builder / Passes, "Back to player view"). The Team builder uses the desktop layout: a top bar, a fairness strip, three team columns with full names, and a bottom bar with the note and warning.

**Spec:** Same as T-44/T-45
**Design:** `08b-admin-team-builder-desktop` (1280 wide); README › Navigation › Desktop sidebar
**Depends on:** T-45

**Acceptance criteria**
- [ ] At 1024 px and wider, every admin screen shows the sidebar instead of the pill sub-tabs and bottom nav. Screens other than the Team builder keep their phone-width content (they have no desktop mockup).
- [ ] The Team builder matches 08b: top bar with "{n} teams" picker and Reshuffle, fairness strip, columns with Total / Players / ATT:DEF footers, the same drag states as mobile.
- [ ] On narrow screens the sidebar stacks above the main area, as the README describes.
- [ ] "Back to player view" goes to Home.

**Learning notes**
- `useWindowDimensions` for breakpoints in React Native
- NativeWind responsive prefixes (`lg:`) on web

---

### T-47 · Schedule the evening reminder job (#47)
**Milestone:** Teams · **Labels:** database · **Size:** S

**Summary:** At 6 PM Toronto time every day, push "Run tomorrow at {6:30 AM} — are you in? Tap to RSVP." to every playing member who hasn't answered for tomorrow's run, including holiday Mondays.

**Spec:** Scheduled jobs (evening-reminder); Notifications › Messages (row 1)
**Design:** No mockup (respects the "Night-before reminder" switch in `05-settings`)
**Depends on:** T-37

**Acceptance criteria**
- [ ] `send_evening_reminders()` finds runs dated tomorrow in Toronto (not cancelled) and the active, plays = true players with no `rsvps` row for them, and calls send-push with category "reminder".
- [ ] Scheduled at both 22:00 and 23:00 UTC, and the function only acts when it's 18:00 in Toronto, so it fires once a day across DST.
- [ ] Tapping the notification opens Home.
- [ ] pgTAP: given seeded runs, the target list is exactly the players without a row for tomorrow's run (Friday for Saturday, Saturday for Sunday, Sunday for a holiday Monday).

**Learning notes**
- pg_cron in UTC and checking Toronto time inside the function
- `not exists` subqueries

---

### T-48 · Send pushes when a run is moved, cancelled or deleted (#48)
**Milestone:** Teams · **Labels:** database, tests · **Size:** M

**Summary:** Tell the players who said yes when an admin changes a run's time or address, cancels it, or deletes it (including switching a holiday off). Database triggers do it, so every path (sheet, holiday switch, SQL) sends the same message.

**Spec:** Notifications › Messages (run moved; run cancelled or deleted); Key flows › Season run list step 4; Long-weekend Mondays (turning a date off)
**Design:** No mockup (respects the "Changes and cancellations" switch)
**Depends on:** T-26, T-27, T-34

**Acceptance criteria**
- [ ] After an update of `start_time` or `location`: "{Saturday}'s run moved to {7:00 AM} at {32 Kennedy Rd N}." to everyone with a yes.
- [ ] Status set to cancelled, or the run deleted: "{Sunday}'s run is cancelled." to everyone with a yes. The yes list is captured before the cascade delete removes the RSVPs.
- [ ] Tapping opens Home.
- [ ] pgTAP: each trigger queues one pg_net request with the right player ids (check `net.http_request_queue`), and none when nobody said yes.

**Learning notes**
- `after update of col1, col2` triggers; `before delete` triggers and `OLD`
- Building JSON payloads in SQL (`jsonb_build_object`, `array_agg`)

---

### T-49 · Schedule the yearly holiday fill job (#49)
**Milestone:** Teams · **Labels:** database · **Size:** S

**Summary:** On December 1 at 6 AM Toronto time, call `fill_holidays(next year)` so the coming year's holiday Mondays show on the Holidays screen early.

**Spec:** Scheduled jobs (fill-next-year-holidays); Long-weekend Mondays › How dates get in
**Design:** `11-admin-holidays` (where the dates appear)
**Depends on:** T-37

**Acceptance criteria**
- [ ] `cron.schedule('fill-next-year-holidays', '0 11 1 12 *', …)` (11:00 UTC is 06:00 EST, and Toronto is on EST in December).
- [ ] Running the job body by hand adds next year's dates and leaves switched-off dates switched off.
- [ ] A failure writes to `job_errors`.

**Learning notes**
- Cron expression syntax
- `on conflict do nothing` (why refilling never brings a switched-off date back)

---

### T-50 · Add Deno tests for generate-teams and send-push (#50)
**Milestone:** Teams · **Labels:** functions, tests · **Size:** M

**Summary:** Automated tests for the two Edge Functions, run against the local Supabase stack in CI.

**Spec:** Testing plan (row: Edge Functions)
**Design:** No mockup
**Depends on:** T-36, T-47, T-48

**Acceptance criteria**
- [ ] generate-teams: refuses a player and anonymous callers; publishes and pushes for an admin and for the service role; with 3 players leaves the run locked and alerts admins.
- [ ] send-push: deletes a subscription when the push service returns 410 (mock the push endpoint); skips players whose switch is off.
- [ ] Evening reminder targets only runs dated tomorrow, including a holiday Monday.
- [ ] CI runs these after `supabase start` (uses `supabase functions serve` in the background), and they pass.

**Learning notes**
- `Deno.test` and `deno test`; mocking `fetch`
- Running a background process in a GitHub Actions step

---

## Season passes and flags

### T-51 · Record who marked a pass paid, with a trigger and tests (#51)
**Milestone:** Season passes and flags · **Labels:** database, tests · **Size:** S

**Summary:** When an admin marks a pass paid or unpaid, the database fills in who did it and when, so "Marked paid by John · Nov 2" can be trusted. Also add tests for who can see pass status.

**Spec:** Data model (`season_passes.marked_by`, `marked_at`, `amount_cents`, `method`); Access control (season_passes: own pass; admin everything); Unpaid flag is admin-only
**Design:** `09-admin-season-passes` ("Marked paid by John · {date}")
**Depends on:** T-02

**Acceptance criteria**
- [ ] A `before insert or update` trigger sets `marked_by = auth.uid()` and `marked_at = now()` whenever `paid` changes. Marking paid also sets `amount_cents` to the season price when it's empty.
- [ ] pgTAP: a player reads only their own pass, can't write any pass, and sees `flag_unpaid` as null in `run_roster`. An admin's change stamps their own id.
- [ ] `npm run db:types` is re-run if anything typed changed.

**Learning notes**
- Trigger functions with `NEW`/`OLD` and `is distinct from`
- Why stamping in the database beats trusting values sent by the client

---

### T-52 · Build the Admin · Season passes screen (#52)
**Milestone:** Season passes and flags · **Labels:** admin UI · **Size:** M

**Summary:** For the chosen season: a pitch-green card with the price, "{n} of {total} paid", the amount still owed and a progress bar; All / Not paid filters; and one row per player with a Paid switch. Unpaid rows are tinted red.

**Spec:** Overview (season passes marked paid by admins; unpaid players still play); Access control (admins all have the same permissions)
**Design:** `09-admin-season-passes`
**Depends on:** T-08, T-09, T-51

**Acceptance criteria**
- [ ] Indoor/Outdoor switches the season. The title and price come from the season (`pass_price_cents`).
- [ ] Lists active players with Plays on (Coach and other manage-only admins are left out, matching "40 of 41"). No pass row counts as Not paid.
- [ ] The Paid switch upserts the `season_passes` row with optimistic UI. Paid rows show "Paid" and "Marked paid by {name} · {date}". Unpaid rows use `#FEF2F2` with a `#FCA5A5` border and "Not paid".
- [ ] "{n} of {total} paid", "{u} unpaid · ${u × price} due" and the bar update at once.
- [ ] "Not paid {u}" filter. Rows sorted A to Z.

**Learning notes**
- Left-joining "everyone" to "who has a row" (client merge or a view)
- Formatting money from cents (`Intl.NumberFormat`)

---

### T-53 · Add the Flagged list to Admin · Runs (#53)
**Milestone:** Season passes and flags · **Labels:** admin UI · **Size:** S

**Summary:** Under the Next run card, list the next run's flagged players with the reason and their badge: "Said yes 4:58 AM" (Morning of) or "No indoor pass" (Unpaid). Flagged players still play.

**Spec:** Overview (morning-of flag; Unpaid admin-only; unpaid players still play); `run_roster` view
**Design:** `07-admin-runs` ("Flagged · {Sun, Feb 14}", "Still playing")
**Depends on:** T-43, T-51

**Acceptance criteria**
- [ ] Lists everyone going to the next run with `flag_morning_of` or `flag_unpaid`, with avatar, name, reason and badge.
- [ ] Morning of reason shows the Toronto time they said yes. Unpaid reason says "No {indoor/outdoor} pass".
- [ ] Hidden when nobody is flagged.
- [ ] The Next run card's "flagged" tile matches the list length.

**Learning notes**
- Reusing the `run_roster` query from Run detail
- Formatting `responded_at` in Toronto time

---

## Web launch

### T-54 · Create the prod Supabase project and GitHub production environment (#54)
**Milestone:** Web launch · **Labels:** infra · **Size:** S

**Summary:** Do steps 1–3 of `docs/environments.md`: protect `main`, create `firsttouch-prod` in Canada with Google sign-in, and give GitHub the prod credentials so the `deploy-prod` job starts running. No prod key goes in any file.

**Spec:** Deployment and environments; AGENTS.md › Environments
**Design:** No mockup
**Depends on:** T-01 merged

**Acceptance criteria**
- [ ] `main` ruleset: PRs only, squash only, `verify` required, no force pushes or deletions.
- [ ] `firsttouch-prod` exists (Canada Central), with "Automatically expose new tables" off and automatic RLS on (as the spec says), Google provider on, Site URL and redirect URLs set, and prod's callback in the Google client.
- [ ] GitHub `production` environment (main only) with `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROD_DB_PASSWORD`. Repo variable `SUPABASE_PROD_PROJECT_REF`.
- [ ] The next merge to `main` runs `deploy-prod` and creates the schema. Check the tables exist in the prod dashboard (read-only look).
- [ ] From this merge on, migrations are append-only. AGENTS.md already says so.

**Learning notes**
- GitHub rulesets, environments, secrets vs variables
- `supabase db push --dry-run`
- Why prod keys never touch your Mac

---

### T-03 · Deploy the website from CI, after prod migrations (#2)
*Exists as #2. Keep its body. Phase 4 only adds the milestone, labels and board.* Two notes to add when you pick it up: set `EXPO_PUBLIC_VAPID_PUBLIC_KEY` and `EXPO_PUBLIC_EMAIL_AUTH=false` alongside the Supabase vars, and check that unknown paths (for example `/privacy` on a fresh load) serve the app (Cloudflare Pages treats a site with no `404.html` as a single-page app).
**Milestone:** Web launch · **Labels:** infra · **Size:** M
**Depends on:** T-54

---

### T-55 · Deploy Edge Functions and their secrets from CI (#55)
**Milestone:** Web launch · **Labels:** infra, functions · **Size:** M

**Summary:** Extend `deploy-prod` so a merge to `main` also deploys generate-teams and send-push to prod, and document the one-time prod secrets: the VAPID private key, and the Vault entries the cron jobs use to call the functions.

**Spec:** Deployment › CI step 2 ("supabase functions deploy against prod"); Supabase settings (Secrets; Extensions)
**Design:** No mockup
**Depends on:** T-03, T-37

**Acceptance criteria**
- [ ] `deploy-prod` runs `supabase functions deploy` after migrations, for prod only.
- [ ] `docs/environments.md` has a section for setting the prod VAPID private key (`supabase secrets set` run from CI, or by hand in the dashboard) and the prod Vault secrets (function URL, service key) without putting them on your Mac.
- [ ] The dev project has the same secrets, and the lock job works on dev end to end.
- [ ] No secret appears in the repo or in CI logs.

**Learning notes**
- `supabase functions deploy --project-ref`
- GitHub Actions masked secrets
- Supabase Vault from the dashboard SQL editor (read-only rule for prod: dashboard settings and secrets only, never schema)

---

### T-56 · Add the real seasons to prod with a data migration (#56)
**Milestone:** Web launch · **Labels:** database · **Size:** S

**Summary:** Prod has no seed, so the two real seasons (with the real addresses, times and price) go in through a migration. Admins then set the dates and tap "Create runs" in the app. Also check the generated holiday Mondays against Ontario's official list once.

**Spec:** Key decisions (Placeholders); Open items (real season dates); Long-weekend Mondays ("Check them once against Ontario's official holiday list before launch")
**Design:** No mockup
**Depends on:** T-54

**Acceptance criteria**
- [ ] The migration inserts "Indoor 2026–27" (7855 Finch Ave W, Brampton, ON L6T 0B2, 6:30) and the outdoor season (32 Kennedy Rd N, Brampton, ON L6V 1X4, 7:00), with dates if known, otherwise null. It doesn't fail when re-run locally after seed (use `on conflict`, or check first).
- [ ] Exactly one season is current.
- [ ] The 2026–2028 holiday table from the spec is checked against ontario.ca, with any difference fixed in the function plus a test.
- [ ] After merge: an admin sets the dates in prod and taps Create runs (in the app, not SQL).

**Learning notes**
- Data migrations vs schema migrations
- Idempotent SQL (`insert … where not exists`)

---

### T-57 · Back up the prod database weekly to firsttouch-backups (#57)
**Milestone:** Web launch · **Labels:** infra · **Size:** M

**Summary:** The free plan has no automatic backups. A weekly GitHub Action runs `pg_dump` against prod and commits the dump to a separate private repo, `firsttouch-backups`, keeping the last 8.

**Spec:** Non-functional requirements › Data safety; privacy.md (backups kept 8 weeks)
**Design:** No mockup
**Depends on:** T-54

**Acceptance criteria**
- [ ] A private repo `firsttouch-backups` exists. This repo can push to it with a fine-grained token or deploy key, limited to that repo.
- [ ] `.github/workflows/backup.yml` runs weekly (and on manual dispatch) in the `production` environment, dumps schema and data (including `auth` users), and pushes a dated file.
- [ ] Only the newest 8 dumps are kept.
- [ ] A restore is tested once: the latest dump loads into local Supabase. The steps are written in `docs/environments.md`.
- [ ] A failed backup run sends GitHub's failure email (default), and that is noted in the docs.

**Learning notes**
- `pg_dump` / `psql`, and Supabase's connection strings (the session pooler works over IPv4 from GitHub runners)
- GitHub Actions `schedule` (cron) and `workflow_dispatch`
- Fine-grained personal access tokens vs deploy keys

---

### T-58 · Show failed jobs and pushes on the admin screen (#58)
**Milestone:** Web launch · **Labels:** admin UI, design · **Size:** S

**Summary:** The spec says failed jobs and pushes are logged to `job_errors` and shown on the admin screen, but there's no mockup. Add a small amber card at the top of Admin · Runs listing recent failures, so problems on a Saturday morning are visible.

**Spec:** Non-functional requirements › Monitoring
**Design:** No mockup. Reuse the amber notice from `07-admin-runs` (`status = empty`) and the list rows from the Flagged list
**Depends on:** T-43, T-55

**Acceptance criteria**
- [ ] When there are `job_errors` rows from the last 7 days, Admin · Runs shows "{n} problems this week" with the newest few (source, time, short detail). Nothing shows when there are none.
- [ ] Players can't see it (RLS already blocks reading `job_errors`).

**Learning notes**
- Filtering by `created_at >= now() - interval '7 days'` with supabase-js (`.gte`)

---

### T-59 · Add the EXPO_PUBLIC_EMAIL_AUTH switch and the email sign-in form (#59)
**Milestone:** Web launch · **Labels:** player UI, infra · **Size:** M

**Summary:** Build email and password sign-in now but keep it hidden. When `EXPO_PUBLIC_EMAIL_AUTH` is "true", the sign-in screen adds the "or" divider, Email and Password fields, "Forgot password?", "Sign in", and "New here? Create an account". Otherwise it's the Google-only screen.

**Spec:** Key flows › Email and password sign-in (status, step 2); Supabase settings (Email provider stays off; how to turn on)
**Design:** `01-sign-in` with `emailAuth = on` (logo shrinks to 72 px)
**Depends on:** T-11, T-08

**Acceptance criteria**
- [ ] `EXPO_PUBLIC_EMAIL_AUTH` is in `.env.example` (default "false"). With anything other than "true", no email UI renders and no email route opens.
- [ ] With "true", the layout matches `01-sign-in` (`emailAuth = on`). Sign in calls `signInWithPassword`.
- [ ] A wrong password and an unknown email show the same message. An unconfirmed email shows "Confirm your email first".
- [ ] `supabase/config.toml`: `minimum_password_length = 8` locally (matches the spec).
- [ ] Works against local Supabase. Dev and prod keep the Email provider off.

**Learning notes**
- `process.env.EXPO_PUBLIC_*` (inlined at build time; changing it needs a rebuild)
- supabase-js `signInWithPassword` and its error codes
- Why the error message must not reveal whether an account exists

---

### T-60 · Build the Create account screen (#60)
**Milestone:** Web launch · **Labels:** player UI · **Size:** M

**Summary:** Name, Email and Password (at least 8 characters) sign-up that sends a confirmation email, then the "Check your email to confirm your account" state with Resend. Hidden unless the email switch is on.

**Spec:** Key flows › Email and password sign-in step 1; Database functions (`handle_new_user` uses `full_name` from the form)
**Design:** `01b-create-account` with `step = form | sent`
**Depends on:** T-59

**Acceptance criteria**
- [ ] Form validates name (not empty), email format and password length before calling `signUp` with `options.data.full_name`.
- [ ] The sent state shows the address it went to, a "Resend email" button (calls `auth.resend`), and "Back to sign in".
- [ ] "Already have an account? Sign in" and "Back to sign in" go to the sign-in screen with the email form.
- [ ] Locally, confirming the link from Mailpit creates a profile with the typed name.

**Learning notes**
- supabase-js `signUp`, `resend`, and `emailRedirectTo`
- Mailpit (local inbox at the URL `supabase start` prints)
- Simple form validation without a library

---

### T-61 · Build the Forgot password and Set a new password screens (#61)
**Milestone:** Web launch · **Labels:** player UI · **Size:** M

**Summary:** "Forgot password?" sends a reset link and always says "If that email has an account, we've sent a link". The link opens `/reset-password`, where the player sets a new password and goes to Home.

**Spec:** Key flows › Email and password sign-in steps 3–4 (`resetPasswordForEmail` with `redirectTo` `/reset-password`; `PASSWORD_RECOVERY` event; `updateUser`)
**Design:** `01c-forgot-password` with `step = form | sent`; `01d-set-new-password`
**Depends on:** T-59

**Acceptance criteria**
- [ ] Forgot password: Email field and "Send reset link". The sent state shows the neutral message whether or not the email exists.
- [ ] `/reset-password` opens only during a recovery session (the `PASSWORD_RECOVERY` event). Otherwise it redirects to sign-in.
- [ ] New and Confirm password must match and be at least 8 characters. "Save password" calls `updateUser({ password })` and goes to Home.
- [ ] The eye button shows or hides both fields.
- [ ] The old password stops working (checked in T-63).

**Learning notes**
- Supabase password recovery flow and the `PASSWORD_RECOVERY` auth event
- Expo Router: a route reachable both signed out and in recovery (outside the protected groups)

---

### T-62 · Add Change password to Settings (#62)
**Milestone:** Web launch · **Labels:** player UI · **Size:** S

**Summary:** When email sign-in is switched on, Settings › Account shows "Change password", which opens the Set a new password screen for a signed-in user.

**Spec:** Key flows › Email and password sign-in step 5
**Design:** `05-settings` with `emailAuth = on`; `01d-set-new-password`
**Depends on:** T-61, T-20

**Acceptance criteria**
- [ ] The row shows only when `EXPO_PUBLIC_EMAIL_AUTH` is "true".
- [ ] It reuses the 01d screen. Saving returns to Settings with a "Password changed" message.
- [ ] *(Open question for later)* Hide the row for Google-only accounts, since they have no password to change. Check `user.identities`.

**Learning notes**
- `supabase.auth.getUser()` and `identities`

---

### T-63 · Test email sign-in locally with Mailpit and Playwright (#63)
**Milestone:** Web launch · **Labels:** tests · **Size:** M

**Summary:** Automate the spec's email sign-in tests against the local stack: sign up, confirm through Mailpit, sign in, reset the password.

**Spec:** Testing plan (row: Email sign-in)
**Design:** No mockup
**Depends on:** T-60, T-61, T-62

**Acceptance criteria**
- [ ] Sign-up creates a profile with the typed name. Sign-in fails until the email is confirmed.
- [ ] A wrong password and an unknown email show the same message.
- [ ] The reset link opens `/reset-password`. The new password works and the old one doesn't.
- [ ] Runs locally with one npm script (for example `npm run test:e2e:email`), reading emails from Mailpit's API.

**Learning notes**
- Playwright test basics (`page.goto`, locators, `expect`)
- Mailpit's HTTP API for reading messages

---

### T-64 · Add a Playwright end-to-end test against the preview URL (#64)
**Milestone:** Web launch · **Labels:** tests, infra · **Size:** M

**Summary:** One end-to-end test of the main loop on a branch's preview site (dev database): sign in, RSVP, pass the lock time with a run set to start soon, see teams, have an admin move a player, and confirm a player never sees stars.

**Spec:** Testing plan (row: End to end)
**Design:** No mockup
**Depends on:** T-03, T-45, T-55

**Acceptance criteria**
- [ ] Test users sign in without Google (for example dev-only email test accounts created by a setup script, or a session injected from a service-role-created user). The approach is written in the PR.
- [ ] The test creates a run starting about 61 minutes ahead on dev, RSVPs several players, waits for lock-and-publish, and sees the Teams screen.
- [ ] As admin it moves a player, and the player's Teams screen shows it.
- [ ] As a player, no star rating or Unpaid badge appears anywhere in the page text.
- [ ] It can run from CI on a PR's preview URL (optional job), and locally.

**Learning notes**
- Playwright projects and `storageState` for signed-in sessions
- Why Google OAuth can't be automated, and test-only sign-in options

---

### T-65 · Publish the Google sign-in app out of Testing mode (#65)
**Milestone:** Web launch · **Labels:** infra · **Size:** S

**Summary:** In Testing mode only listed test users can sign in. Fill in the OAuth consent screen (app name, support email, logo, homepage, privacy policy URL, authorized domain) and publish it, so anyone with the link can sign in with Google.

**Spec:** Deployment › Supabase settings (consent screen needs the app name, a support email and the privacy policy URL); Overview (open sign-up)
**Design:** `assets/firsttouch-icon.png` (consent screen logo)
**Depends on:** T-03, T-10

**Acceptance criteria**
- [ ] Consent screen: app name FirstTouch, support email, logo, homepage `https://firsttouch.pages.dev`, privacy policy `https://firsttouch.pages.dev/privacy`, authorized domain set.
- [ ] Only the basic scopes (openid, email, profile) are requested, so no Google verification review is needed. Check Google's current rules, especially for a `pages.dev` subdomain as an authorized domain.
- [ ] Publishing status is "In production".
- [ ] A Google account that was never a test user can sign in on prod.

**Learning notes**
- Google Auth Platform: branding, audience (Testing vs In production), and sensitive vs non-sensitive scopes
- Domain verification through Google Search Console, if Google asks for it

---

### T-66 · Run the launch checklist (#66)
**Milestone:** Web launch · **Labels:** tests, infra · **Size:** S

**Summary:** Last checks before sharing the link: the manual phone checklist from the spec, the admin accounts set up in prod, and the privacy policy's effective date filled in.

**Spec:** Testing plan (row: Manual); Access control › Admins (first admin set by hand, then promoted in the app); Open items
**Design:** All screens
**Depends on:** T-23, T-56, T-57, T-58, T-63, T-64, T-65

**Acceptance criteria**
- [ ] Sim signs in on prod. Sim is made admin by hand in the Supabase dashboard (the one allowed manual change, per the spec). John and Coach sign in and are promoted from the Players screen. Coach's Plays is switched off there.
- [ ] On a real iPhone: Add to Home Screen, enable notifications, receive "Teams are up", the field diagram is readable outdoors.
- [ ] Same on a real Android phone (install prompt or browser).
- [ ] "Effective date" in the privacy policy is set to the launch date.
- [ ] The Cloudflare project name `firsttouch` was free (or the spec and docs are updated to the real URL).
- [ ] The first weekly backup has run.

**Learning notes**
- Safari Web Inspector for debugging an iPhone from the Mac
- Chrome remote debugging for Android

---

## Later (no milestone)

Each of these has the `later` label, a one-line summary and the spec reference. Full acceptance criteria get written when one is picked up.

### T-67 · Switch on email sign-in with a domain and Resend (#67)
**Labels:** later, infra · **Size:** M · **Spec:** Supabase settings; Open items · **Design:** `01-sign-in` (`emailAuth = on`), 01b–01d · **Depends on:** T-63
Buy a domain, verify it in Resend, set Resend as Supabase's custom SMTP, enable the Email provider with "Confirm email" on in dev, then prod, and set `EXPO_PUBLIC_EMAIL_AUTH=true` in Cloudflare.
**Learning notes:** DNS records (SPF, DKIM); Supabase custom SMTP; Resend domains.

### T-68 · Send a weekly reminder about unpaid season passes (#68)
**Labels:** later, database · **Size:** S · **Spec:** Notifications › Messages ("Weekly, optional") · **Design:** No mockup · **Depends on:** T-47
A weekly pg_cron job pushes "Your Indoor season pass is still unpaid." to players without a paid pass for the current season. It needs its own category or switch.
**Learning notes:** pg_cron weekly schedules; adding a notification category.

### T-69 · Add season join codes (#69)
**Labels:** later, database, player UI · **Size:** L · **Spec:** Later and open items (Season join code) · **Design:** No mockup
Add `join_code` to seasons and a `season_members` table. A player enters the code once per season, and the RSVP policies also check membership.
**Learning notes:** RLS with membership tables; migrating policies safely in prod.

### T-70 · Let admins add walk-ins to a locked or published run (#70)
**Labels:** later, admin UI, database · **Size:** M · **Spec:** Later (Walk-ins) · **Design:** No mockup
Add an existing player or a named guest to a locked or published run. They go on the smallest team, or the admin taps Reshuffle.
**Learning notes:** nullable guest rows vs profile rows; extending `team_assignments`.

### T-71 · Let admins mark no-shows (#71)
**Labels:** later, admin UI, database · **Size:** M · **Spec:** Later (No-shows) · **Design:** No mockup
Mark a player as a no-show, with an option to rebalance the remaining players, and keep a no-show count per player.

### T-72 · Add a player cap and waitlist (#72)
**Labels:** later, database, player UI · **Size:** L · **Spec:** Later (Player cap and waitlist) · **Design:** No mockup
`max_players` on runs. Yes RSVPs past the cap join a waitlist in order and move up when someone drops.

### T-73 · Take season pass payments in the app with Stripe (#73)
**Labels:** later, functions, player UI · **Size:** L · **Spec:** Later (In-app season pass payment) · **Design:** No mockup
Stripe Checkout from an Edge Function. A Stripe webhook marks `season_passes` paid with method 'stripe'.
**Learning notes:** Stripe Checkout; verifying webhook signatures in Deno.

### T-74 · Add match rotation and scores (#74)
**Labels:** later, database, admin UI · **Size:** L · **Spec:** Later (Match rotation) · **Design:** No mockup
A new `matches` table (run, team A, team B, result, minute). 5-minute games, the scorer stays on, and on a draw the team that's been on longest goes off.

### T-75 · Ship App Store and Google Play builds (#75)
**Labels:** later, infra · **Size:** L · **Spec:** Later (App Store and Google Play) · **Design:** all screens
EAS builds from the same code, an Expo Push path in send-push, Sign in with Apple, personal developer accounts, and Google's 14-day closed test.
**Learning notes:** EAS Build and Submit; expo-notifications; Sign in with Apple requirements.

### T-76 · Let admins deactivate players (#76)
**Labels:** later, admin UI · **Size:** S · **Spec:** Data model (`profiles.active`; `player_directory` filters on it) · **Design:** No mockup
`active` exists in the schema, but no screen sets it. Add a "Deactivate" option to the T-23 player sheet so people who leave the group drop off lists without deleting their history.

---

## Spec and design disagreements

Rule used: **the spec wins on behaviour and permissions, the design wins on visuals.** All four decisions were settled on Nov 9, 2026. Everything else is resolved as described and already written into the tickets.

### Decisions

| # | Question | Decision | Affects |
| --- | --- | --- | --- |
| D1 | Settings shows three notification switches (Night-before, Teams published, Changes and cancellations). The spec has only an "Enable notifications" button and nowhere to store per-type choices. | **Decided:** keep the switches (the design is clear, the privacy policy says "turn notifications off in Settings", and it's cheap). Store them on the `player_settings` table (own read/write), which T-20 creates for the Appearance setting. Show "Enable notifications" first, switches after. Update the spec. | T-32, T-34, T-47, T-48 |
| D2 | The design shows a **Cancelled** run state (chip, "Cancelled by an admin" row, Next-run card variant) but no Cancel button anywhere. The spec has `cancelled` status and a "run cancelled" push, but its admin flow only describes Delete. | **Decided:** add "Cancel run" to the edit sheet. It keeps the run visible as Cancelled (useful for rain-outs, so players can see it's off), while Delete removes it entirely. | T-26, T-43, T-48 |
| D3 | Seasons: the spec says an admin "creates or opens a season". The design only lets you pick Indoor/Outdoor and edit dates, with no create-season or "current season" control. Prod has no seed. | **Decided:** prod seasons come from a data migration (T-56). Add a small "Current season" switch to the season card (T-24). Creating next year's seasons stays a migration until a later ticket. | T-24, T-56 |
| D4 | V2 Home adds a **notification bell** with a green unread dot ("Notifications, 1 new"). The spec has push notifications only, with no in-app list of past messages to be "unread". | **Decided:** remove the bell. Notifications are push only (as the spec says), with no in-app list, so there's nothing for a bell to open. Turning notifications on and off stays in Settings. | T-14 |

### Spec vs design, resolved

| # | Where | Disagreement | Resolution |
| --- | --- | --- | --- |
| 1 | `05-settings` | Night-before switch hint says "The evening before each run you're in". The spec's reminder goes to members who **haven't replied**. | Spec wins: hint reads "The evening before a run you haven't answered". (T-32) |
| 2 | `02-home` vs spec Notifications step 5 | Design puts the "Add to Home Screen" banner on Home. The spec puts it in Settings in place of the Enable button. | Both: dismissible banner on Home (design), message in place of the button in Settings (spec). iPhone Safari tabs only. (T-33) |
| 3 | `07-admin-runs`, `11-admin-holidays` | Both list **Easter Monday** (Mon Mar 29, 2027). The spec explicitly leaves Easter Monday out. | Spec wins: never generated. It appears only if an admin adds it as a one-off. (T-27) |
| 4 | `11-admin-holidays` | Thanksgiving 2026 is labelled "Outdoor 2026", a season that doesn't exist. The list is also missing several observed dates (Boxing Day 2026, Christmas 2027, New Year's 2028, Canada Day 2028). | Placeholder data. The list shows whatever `holidays` holds. Dates outside every season read "Not in a season" (new text). (T-27) |
| 5 | `06-admin-players` | Shows a per-person "Morning of" flag (Sam Whitfield). The spec stores morning-of per RSVP, not per player. | Players screen: Unpaid = current season's pass; Morning of = a morning-of yes for the next run. (T-21) |
| 6 | `06-admin-players` | The spec says admins promote others from the Players screen. The design has no control for it. | Add a player sheet with an Admin switch. You can't remove your own admin role. (T-23) |
| 7 | spec Monitoring | `job_errors` is "shown on the admin screen". There's no design. | Amber "problems this week" card on Admin · Runs, reusing existing styles. (T-58) |
| 8 | `03-run-detail` | No variant for an admin with Plays off. The spec says they can't RSVP. | Replace the RSVP panel with "You're managing this run", as on Home. (T-18) |
| 9 | `03-run-detail` | "Change" is a link back to Home. | The spec's RSVP is a toggle: "Change" / "I'm in" toggles in place. (T-18) |
| 10 | `04-teams` | *(Fixed in V2.)* The V1 mockup drew the 3-tab player nav for admins. V2 shows the Admin tab. | Nothing to resolve. One shared tab bar shows Admin for admins everywhere. (T-09, T-38) |
| 11 | `04-teams`, `08-admin-team-builder` | No state for "teams not published yet" or "fewer than 4 players". | New empty states: "Teams publish automatically at {time}" and "Not enough players — no teams made" (wording from `07`). (T-38, T-44) |
| 12 | `02-home` | The closed card is only drawn for a player on a team, and for Coach. Not for a player who said no, or a run locked with under 4. | Not going: Coach's "Teams are up" panel. Under 4: muted "Not enough players — no teams this time". (T-41) |
| 13 | README "Drag to swap" vs `08` mockup | The mockup moves one player (team sizes become 6 and 8); the README calls it a swap. The spec says "drag players between teams". | Drag **moves** one player; a swap is two moves. Unequal sizes are allowed and shown. (T-45) |
| 14 | `08-admin-team-builder` | The 2/3 team picker: the design says "Changes save instantly". The spec says the override changes how teams are generated. | Picking a count sets `team_count_override` and reshuffles at once, which sends "Teams updated". (T-44) |
| 15 | `07-admin-runs` edit sheet | No mention of telling players. The spec sends "run moved" on time/address changes. | Spec wins: database trigger sends the push. (T-48) |
| 16 | `07-admin-runs` edit sheet | Editing a locked or published run's time isn't covered by either. | Allowed. RSVPs stay closed (RLS needs status `open`). The sheet says so. (T-26) |
| 17 | `11-admin-holidays` | "Add date" has no form. Switching off a holiday with yes RSVPs has no confirmation. The spec requires both, plus a push. | Add-date sheet and the `07` confirm dialog are reused. A new `add_holiday()` creates the run straight away, like switching on. (T-27, T-28, T-48) |
| 18 | `09-admin-season-passes` | Who is listed: 40 people, without Coach. The spec doesn't say. Design has no payment method picker; the spec stores `method`. | List active players with Plays on. The switch sets paid, amount (season price), `marked_by`/`marked_at` via trigger. Method stays empty for now. (T-51, T-52) |
| 19 | `05-settings` | The profile card's "Paid" chip: Coach has no pass. Edit-name and delete-account confirmation have no mockup. | Coach gets the Admin badge instead. Edit name and delete reuse the `07` sheet and confirm dialog. (T-20) |
| 20 | Desktop | Only the Team builder has a desktop layout, but its sidebar lists all admin sections. | At ≥1024 px every admin screen uses the sidebar; screens without a desktop mockup keep their phone-width content. (T-46) |
| 21 | Dark mode | *(Changed in V2.)* V1 had Graphite dark following the OS. V2 has its own dark palette, every screen has a `theme` prop, and players choose Light / Dark / System in Settings. Saving the choice per player isn't in the spec. | Design wins on the look. The choice is stored in a new `player_settings` table (own read/write) and on the device. Update the spec's data model. (T-05, T-20) |
| 22 | `assets/` | The icon is 232 px with transparent rounded corners. A web manifest needs 512 px, and iPhone Home Screen icons should be square and full-bleed. | Ask for a 1024 px square export; generate 180/192/512 from it. (T-06) |
| 23 | `01b`, `01c` | "Back to sign in" links point to `SignInEmail`, which isn't in the canvas map. | It means `01-sign-in` with `emailAuth = on`. (T-60, T-61) |
| 24 | `02-home` | How far ahead Home shows runs isn't specified. | Today through the next 7 days (matches "three runs this week"). (T-14) |
| 25 | `02-home` README vs V2 mockup | The README's Home section still lists the avatar in the top row and the chip "Admin · manages runs". The V2 mockup replaces the avatar with the app icon and a bell, and Coach's chip reads just "Admin". | The V2 mockup is newer, so it wins: app icon on the left, chip on the right, Coach's chip "Admin". The bell is removed (D4). (T-14, T-17) |
| 26 | `02-home` | "View all" next to "Upcoming runs" links to Run detail in the mockup. | Placeholder link. "View all" shows every upcoming run in the season. (T-14) |
| 27 | `tokens.json` vs README | `size.button` is 48, but the README and the mockups' primary buttons are 56 tall. | Primary buttons are 56 (README and mockups). Smaller buttons follow each mockup. (T-08) |
| 28 | `05-settings` | Appearance (Light / Dark / System) is new in V2 and not in the spec. | Built as designed, in the Settings ticket (T-20). |

### Spec internal gaps and spec vs repo

| # | Where | Issue | Resolution |
| --- | --- | --- | --- |
| S1 | spec Edge Functions | generate-teams "reads run_roster". Called with the service key, `is_admin()` is false (no signed-in user), so `run_roster` returns **null stars** and teams would be balanced blind. | generate-teams reads `rsvps` plus `profiles` directly, with `service_role` grants. Update the spec. (T-35, T-36) |
| S2 | spec Edge Functions | "Replaces team_assignments in one transaction" can't be done from supabase-js, which sends one statement per request. | New `save_teams(run_id, jsonb)` database function does delete, insert and `publish_teams` in one transaction. Update the spec's function list. (T-35) |
| S3 | spec Notifications | "Weekly, optional" unpaid reminder appears in Messages but not in Scheduled jobs. | Later ticket. (T-68) |
| S4 | spec Repo layout | Shows `app/`, `components/`, `lib/` at the repo root. AGENTS.md and the code use `src/app`, `src/lib`. | AGENTS.md wins: `src/components/`, `src/lib/`. Update the spec's tree. |
| S5 | spec Cloudflare settings and CI step 2 | Says Cloudflare builds the site from Git. Existing ticket #2 (T-03) deploys from CI with Direct Upload instead, so the site never goes live before its migration. | Keep T-03. Update the spec's Cloudflare section when it's done. |
| S6 | spec CI step 2 | "supabase functions deploy against prod" isn't in `ci.yml` yet. | T-55. |
| S7 | spec Email sign-in | Passwords "at least 8 characters". `supabase/config.toml` has `minimum_password_length = 6`. | Set it to 8. (T-59) |
| S8 | spec Live updates | Realtime is only on `rsvps`, but the spec says players see team moves "at once". | Add `team_assignments` and `runs` to the publication. (T-42) |
| S9 | spec Edge Functions / pg_net | The cron jobs and `publish_teams` must call Edge Functions with the service key; the spec doesn't say where that key lives in the database. | Supabase Vault, set per environment, never in a migration. (T-35, T-55) |
| S10 | spec Access control › Admins | Nothing stops the last admin from demoting themselves. | Block demoting yourself, in the UI and the guard trigger. (T-23) |
| S11 | privacy.md | "Effective date: [date]" is a placeholder. | Filled in at launch. (T-66) |
| S12 | seed.sql | No runs, RSVPs, passes or teams, so screens would be empty locally. | T-13. |
