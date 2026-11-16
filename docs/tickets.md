# FirstTouch — ticket plan

Created on GitHub Nov 9, 2026: labels, milestones, issues #1–#76 (except #3, the T-01 PR) and the **FirstTouch** project board (Todo / In progress / Done).

**How to read this file**

- Every ticket is titled `T-NN · <verb> …` (the AGENTS.md convention). T-numbers follow dependency order. Each ticket's GitHub issue number is in brackets. T-NN is issue #NN, except T-02 (#1) and T-03 (#2), which existed before the plan, and tickets from T-81 on, which were added later (their issue numbers are in brackets). T-82 to T-93 and the new T-69 were added on Nov 15, 2026 for groups, seasons and join codes; they come before the remaining admin and player tickets in the order of work.
- **Sources:** `docs/spec.md` (behaviour, data, rules, permissions), `docs/design/` (look and layout), `docs/privacy.md`. Where they disagree, the spec wins on behaviour and permissions and the design wins on visuals. See [Spec and design disagreements](#spec-and-design-disagreements) at the end.
- **Sizes:** S = one sitting. M = one or two sittings. L = two full sittings (used rarely).
- **Labels:** `database`, `functions`, `player UI`, `admin UI`, `infra`, `tests`, `design`, `later`. `design` marks a ticket that also fills a gap with no mockup (it reuses existing patterns, and the gap is spelled out in the ticket).
- **Designs:** this plan follows **Version 3**, the only design (`docs/design/README.md`). Every screen in `docs/design/screens/` is Version 3. Groups, seasons and join codes are detailed in `docs/design/seasons-and-join-codes.md` (screens 12, 13, 14, the Home welcome popup and the Players admin controls).
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
19. T-82 · Write the groups, seasons and join codes plan into the docs (#106)
20. T-83 · Restyle the Admin badge to soft green and drop the ADMIN tag (#107)
21. T-69 · Add groups and per-group roles to the database (#69)
22. T-84 · Scope runs and holidays to a group (#108)
23. T-85 · Add season membership, join codes and approval (#109)
24. T-86 · Add the admin season functions (#110)
25. T-81 · Build the Join a season screen and the season gate (#104)
26. T-87 · Build Start your own runs (#111)
27. T-88 · Show the welcome popup on Home (#112)
28. T-89 · Build the Admin · Seasons tab (#113)
29. T-90 · Add the New season sheet and the End season dialog (#114)
30. T-21 · Build the Admin · Players list with search and filters (#21)
31. T-22 · Let admins set stars, position and Plays (#22)
32. T-23 · Add the player sheet's admin controls: make, remove and transfer admin, and remove from the group (#23)
33. T-24 · Build the season card on Admin · Runs (#24)
34. T-25 · List every run of the season on Admin · Runs (#25)
35. T-26 · Add the edit-run sheet: time, address, cancel and delete (#26)
36. T-27 · Build the Admin · Holidays screen (#27)
37. T-28 · Let admins add a one-off holiday date (#28)

### Teams
38. T-29 · Implement balanceTeams: team count, sizes and snake draft (#29)
39. T-30 · Finish balanceTeams: swaps, restarts, slots and output checks (#30)
40. T-31 · Add the web manifest, service worker and VAPID keys (#31)
41. T-32 · Let players turn on notifications in Settings (#32)
42. T-33 · Show the "Add to Home Screen" banner on iPhone (#33)
43. T-34 · Build the send-push Edge Function (#34)
44. T-35 · Add save_teams, publish_teams and the service_role grants (#35)
45. T-36 · Build the generate-teams Edge Function (#36)
46. T-37 · Schedule the lock-and-publish job with pg_cron (#37)
47. T-38 · Build the Teams screen table view (#38)
48. T-39 · Draw the indoor Field view (three half-pitches) (#39)
49. T-40 · Draw the outdoor Field view (full pitch) (#40)
50. T-41 · Show "Teams are up" on Home and Run detail (#41)
51. T-42 · Push team and run changes live with Realtime (#42)
52. T-43 · Add the Next run card to Admin · Runs (#43)
53. T-44 · Build the Admin · Team builder: summary, team count and Reshuffle (#44)
54. T-45 · Let admins drag players between teams with the fairness bar (#45)
55. T-46 · Build the desktop Team builder with the admin sidebar (#46)
56. T-47 · Schedule the evening reminder job (#47)
57. T-48 · Send pushes when a run is moved, cancelled or deleted (#48)
58. T-91 · Invite last season's players and push approvals (#115)
59. T-49 · Schedule the yearly holiday fill job (#49)
60. T-92 · Roll seasons over with a daily job (#116)
61. T-50 · Add Deno tests for generate-teams and send-push (#50)

### Season passes and flags
62. T-51 · Record who marked a pass paid, with a trigger and tests (#51)
63. T-52 · Build the Admin · Season passes screen (#52)
64. T-53 · Add the Flagged list to Admin · Runs (#53)

### Web launch
65. T-54 · Create the prod Supabase project and GitHub production environment (#54)
66. T-03 · Deploy the website from CI, after prod migrations (#2)
67. T-55 · Deploy Edge Functions and their secrets from CI (#55)
68. T-56 · Check holiday Mondays and create the first real season in prod (#56)
69. T-57 · Back up the prod database weekly to firsttouch-backups (#57)
70. T-58 · Show failed jobs and pushes on the admin screen (#58)
71. T-59 · Add the EXPO_PUBLIC_EMAIL_AUTH switch and the email sign-in form (#59)
72. T-60 · Build the Create account screen (#60)
73. T-61 · Build the Forgot password and Set a new password screens (#61)
74. T-62 · Add Change password to Settings (#62)
75. T-63 · Test email sign-in locally with Mailpit and Playwright (#63)
76. T-64 · Add a Playwright end-to-end test against the preview URL (#64)
77. T-65 · Publish the Google sign-in app out of Testing mode (#65)
78. T-66 · Run the launch checklist (#66)

### Later (no milestone, label `later`)
- T-67 · Switch on email sign-in with a domain and Resend (#67)
- T-68 · Send a weekly reminder about unpaid season passes (#68)
- T-70 · Let admins add walk-ins to a locked or published run (#70)
- T-71 · Let admins mark no-shows (#71)
- T-72 · Add a player cap and waitlist (#72)
- T-73 · Take season pass payments in the app with Stripe (#73)
- T-74 · Add match rotation and scores (#74)
- T-75 · Ship App Store and Google Play builds (#75)
- T-93 · Let a player be in more than one group (#117)
- ~~T-76 · Let admins deactivate players (#76)~~ closed: superseded by T-23 and T-86

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
- [ ] The admin header shows the "Admin" title only. The mockups' ADMIN tag is not built (T-83, disagreement 32).
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
- [ ] A playing admin (John, Sim) sees the normal player Home with a pass chip, plus the Admin tab.
- [ ] Turning Plays on or off for an admin (T-22) switches their Home on the next load.

**Learning notes**
- Conditional rendering in React
- Deriving UI from one `useMe` result (`plays`, admin status)

---

### T-18 · Build the Run detail screen (player view) (#18)
**Milestone:** RSVP loop · **Labels:** player UI, design · **Size:** M

**Summary:** Build Run detail (Version 3): a "← Home" link and a status chip on top; a run card with the curved card bar, the green wash and a soccer ball, showing the kicker, date, start time, two-line address and three stat tiles (going, attackers, defenders); one "Your RSVP" row with a compact pill that toggles in place; after the lock, your team panel or a disabled "Locked" pill; and "Who's coming" in RSVP order with position tags and Morning of badges. Players never see stars or Unpaid here.

**Spec:** Lock time and player-facing views (`run_roster`); Access control (stars and Unpaid admin-only); Key flows › Admins and RSVPs
**Design:** `03-run-detail` (V3) with `role = player`, `locked = false | true`, `going = true | false`
**Depends on:** T-15

**Acceptance criteria**
- [ ] No hero header and no page title. The top row is a "← Home" text link (`brand-text`, 14 px / 700, 16 px arrow, tap area at least 44 px tall, no box) and a status chip: "Open" while open, "Locked" once the lock time has passed or the run is locked, "Teams published" (soft green) once published.
- [ ] The run card has the curved 6 px card bar (grey once closed), the green wash and a faint soccer ball. It shows the kicker "INDOOR <year>" ("OUTDOOR <year>" for an outdoor season; the year of the run), the date, "6:30 AM start", a two-line address, and the going, attackers and defenders tiles inside the card. There is no "RSVPs close" line in this card.
- [ ] Your RSVP is one row: "YOUR RSVP", your status ("You're in" / "You're not going") and "RSVPs close h:mm AM" on the left; a compact pill on the right, "You're in" (filled, `button-in`) or "I'm in" (outline). Tapping it toggles your RSVP in place, and Home's card agrees (one shared mutation, a refused save rolls both back and shows the error line).
- [ ] After the lock, going, teams published: the "You're on {team}" panel (team wash, dot, "{n} players · ATT/DEF {a}:{d}", "View teams"). After the lock otherwise (not going, or no teams yet): a disabled "Locked" pill with a lock icon on the same line, and no close line.
- [ ] *Design gap:* for an admin with Plays off, the RSVP card is replaced by the line "You're managing this run" (as on Home).
- [ ] "Who's coming" lists `run_roster` in `responded_at` order: 38 px avatar, name (" · You" on your own row), only the Morning of badge, and the position tag. No stars, no Unpaid.
- [ ] The list and the counts update live (reuse the T-16 subscription with this screen's own query key).
- [ ] A wrong or unknown run id shows "Run not found" with a way back to Home.

**Learning notes**
- Expo Router dynamic routes (`runs/[id].tsx`) and `useLocalSearchParams`
- Selecting from a view (`run_roster`) with supabase-js
- Sharing one mutation hook between Home and Run detail (two query keys, one rollback snapshot)
- Theme tokens for colours that change per theme (the wash, the stat tile)

---

### T-19 · Add the admin view of Run detail (#19)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** S

**Summary:** For admins, each "Who's coming" row also shows five small stars under the name and the Unpaid badge where it applies, and the list note reads "In order of RSVP · admin view". The data already comes back filled in for admins and empty (`null`) for players, because `run_roster` uses `case when is_admin() then …`; the screen decides from who is looking (`useMe`), not from whether the values happen to be there. Once teams are published, an admin with no team of their own (Coach, or a playing admin who isn't going) also sees the "Teams are up" panel in the RSVP card. A player who isn't going sees no panel.

**Spec:** Lock time and player-facing views (`run_roster` returns stars and `flag_unpaid` only for admins)
**Design:** `03-run-detail` with `role = admin` (drawn as John, not going, locked; Sim listed like any player)
**Depends on:** T-18

**Acceptance criteria**
- [ ] Admins see five small stars (12 px) under each name and the Unpaid badge where it applies (after Morning of, centred in the row). Players never do, even by changing the request in dev tools: stars and `flag_unpaid` come back `null`.
- [ ] The list note reads "In order of RSVP · admin view" for an admin and "In order of RSVP" for a player. Whether the viewer is an admin comes from `useMe`, in tested pure functions (`rosterListNote`, `rosterExtras`).
- [ ] The screen looks the same whether the admin is going, not going, or doesn't play.
- [ ] Playing admins appear in the list only when they've said yes, with no special badge. Their own row keeps " · You" (see disagreement 29).
- [ ] An admin who just said yes appears at once without stars or Unpaid; the refetch fills them in.
- [ ] *Design gap:* after publish, an admin with no team (Coach, or not going) sees "Teams are up" over "{n} teams · published h:mm AM" with a `brand` dot and "View teams", inside the RSVP card. A going admin sees "You're on {team}" like any player. A player who isn't going sees no panel. (The Home card version is T-41.)
- [ ] Matches the V3 mockup in light and dark.

**Learning notes**
- How `case when is_admin() then … end` in a view hides columns per caller
- Checking a request's response in the browser Network tab
- Deciding in a pure function from who is looking, not from what the data contains (`number | null` and narrowing)

---

### T-20 · Build the Settings screen: profile, name, appearance, privacy, sign out, delete account (#20)
**Milestone:** RSVP loop · **Labels:** player UI, database, design · **Size:** L

**Summary:** Build Settings without the Notifications section (T-32): profile card with avatar, name, pass chip and email; a pencil button to change your display name; the Appearance control (Light, Dark or System); the privacy link; Sign out; and Delete account with a confirmation. The Appearance choice is saved per player in a new `player_settings` table, which T-32 later adds the notification switches to. The edit-name sheet and the delete confirmation are built as reusable `BottomSheet` and `ConfirmDialog` components, so later admin tickets (T-23, T-26, T-27) reuse them.

**Spec:** Database functions (`update_my_name`); Non-functional requirements › Privacy (Delete account); Access control (players change only their name; own-row pattern like `push_subscriptions`). Appearance isn't in the spec (new in the V2 design)
**Design:** `05-settings` with `emailAuth = off` and `theme = light | dark` (profile card, Appearance between Notifications and Privacy, Privacy, Account); README › Global rules › Light and dark. The edit-name sheet and delete confirmation have no mockup: reuse the bottom sheet and confirm dialog from `07-admin-runs` (`overlay = sheet | confirm`)
**Depends on:** T-05, T-08, T-09, T-10

**Acceptance criteria**

*Profile and account*
- [ ] The profile card shows avatar, name, email, and a "Paid" or "Not paid" chip for the current season. *Design gap:* for an admin with Plays off, show the Admin badge instead of a pass chip. With no current season, no chip is shown.
- [ ] The pencil opens a sheet with a Name field. Saving calls `update_my_name`, and an empty name shows an error. The new name shows on Home and in lists.
- [ ] "Privacy policy" opens `/privacy`.
- [ ] Sign out returns to sign-in.
- [ ] "Delete account" (red) asks "Delete your account?" with what gets deleted. Confirming calls `delete_my_account`, then clears this browser's session (`signOut({ scope: 'local' })`, because the account is already gone on the server) and shows sign-in. Your RSVPs disappear from other screens.
- [ ] Your email isn't editable here (it comes from Google).
- [ ] The edit-name sheet and the delete confirmation use two reusable components, `BottomSheet` and `ConfirmDialog` (React Native `Modal`, 50% scrim, closing with the X button, the scrim or Escape), built from the `07-admin-runs` mockup.

*Appearance*
- [ ] New migration: `player_settings` (one row per player, `theme` is a `theme_mode` enum of `light` | `dark` | `system`, default `light`). RLS: players read and write only their own row; no access for `anon`. pgTAP tests prove a player can't read or change anyone else's row. `npm run db:types` is re-run and committed.
- [ ] The three-option control (a radio group built on the T-08 segmented control) shows the saved choice. Picking one switches the theme at once (using the T-05 theme module) and saves it.
- [ ] The hint changes with the choice: "Light is the default. Dark mode is optional." or, for System, "Follows your phone's light or dark setting."
- [ ] Signing in on a new browser applies the saved theme: once you're signed in, the saved choice wins over the device's (a pure, tested function, `themeAfterSignIn`). With nothing saved, the device's choice stays and no row is written until you pick one. Before sign-in (sign-in and /privacy), the device's last choice is used, or Light.

**Learning notes**
- supabase-js `rpc()` for database functions, and `upsert` for a one-row-per-player table
- Writing your own migration with a table and RLS policies (`npx supabase migration new`)
- A reusable bottom sheet and confirm dialog (React Native `Modal`, or a portal on web)
- Keeping a saved setting and the device in step (TanStack Query plus `localStorage`)

---

### T-82 · Write the groups, seasons and join codes plan into the docs (#106)
**Milestone:** RSVP loop · **Labels:** documentation · **Size:** S

**Summary:** Planning chore, no app code. Brings the Version 3 designs for groups, seasons and join codes into the repo and writes the agreed plan into the spec, this ticket plan and the GitHub issues, replacing the old one-line T-69.

**Spec:** Overview; Data model; Access control; Server functions and scheduled jobs; Key flows › Groups, seasons and join codes; Notifications; Later and open items
**Design:** all of `docs/design/` (Version 3 only), especially `seasons-and-join-codes.md`, `12-join-season`, `13-admin-seasons`, `14-start-your-runs`
**Depends on:** T-20

**Acceptance criteria**
- [ ] The Version 3 design files are committed, and `docs/design/README.md` describes Version 3 only, with screens 12, 13 and 14 and every new prop.
- [ ] `docs/spec.md`: join codes leave "Out of scope"; groups, `group_members`, `season_members` and the new season columns are in the Data model; Access control, functions, jobs, Key flows, Notifications and Later are updated.
- [ ] This file: the new tickets, the changed tickets (T-21, T-22, T-23, T-24, T-35, T-36, T-43, T-46, T-49, T-52, T-56, T-64), D5 in place of D3, and T-76 closed as superseded.
- [ ] The GitHub issues match this file and are on the project board.

---

### T-83 · Restyle the Admin badge to soft green and drop the ADMIN tag (#107)
**Milestone:** RSVP loop · **Labels:** player UI, admin UI · **Size:** S

**Summary:** Version 3 changed the small Admin badge from the green `hero` gradient with white text to soft green: `brand-soft` background with `brand-text`. The ADMIN tag in the Admin header is **dropped**: the page title already says "Admin", so the tag only repeated it (see disagreement 32). Everything else on the built screens (sign in, Home, Run detail, Settings, the tab bar at 76 tall) already matches Version 3.

**Spec:** —
**Design:** `06-admin-players` (Admin badge on player rows; the ADMIN tag in the header of 06 and 07 is not built); README › Shared components › Admin badge
**Depends on:** —

**Acceptance criteria**
- [ ] `AdminHeader` shows only the "Admin" title; the ADMIN tag is removed (it duplicated the title).
- [ ] `AdminBadge` (22 tall, 11px / 800) uses `bg-brand-soft` and `text-brand-text`. It shows on the Settings profile card for an admin who doesn't play.
- [ ] The `/components` gallery note for AdminBadge no longer says "hero gradient".
- [ ] The badge reads clearly in light and dark (contrast at least 4.5:1). Measured in Chrome DevTools: 4.67 in light, 8.34 in dark and System-dark.

**Learning notes**
- Why the colours live in tokens: a restyle is a class-name change, not new colours
- Checking contrast with the browser's accessibility tools (and the eyedropper when the background is see-through)

---

### T-69 · Add groups and per-group roles to the database (#69)
**Milestone:** RSVP loop · **Labels:** database, tests · **Size:** L

**Summary:** A **group** (e.g. "Brampton Weekend Football") now owns seasons and admins. Admin, Plays, stars and position move from `profiles` to a new `group_members` table, so they're set per group: someone can be 5 stars in one group and 3 in another. Every existing policy, view and function is re-pointed at the group, with one group in the seed so the built screens keep working. Admins can make, remove and transfer admin in the database (the screen is T-23). A `profiles.is_dev` flag, set by hand, makes someone admin in every group.

**Spec:** Data model (`groups`, `group_members`, `profiles.is_dev`, `seasons.group_id`); Access control (helpers, admins per group); Database functions (make / remove / transfer admin, `delete_my_account`)
**Design:** No mockup (database). The rules come from `seasons-and-join-codes.md` › How it works 1, 11 and 13
**Depends on:** T-02, T-12

**Acceptance criteria**
- [ ] One **new** migration (dev already runs the first two, so don't edit them):
  - `groups (id, name, created_by, created_at)`
  - `group_members (group_id, player_id, role, plays, stars, position, active, created_at)`, primary key (group_id, player_id); `role`, `plays`, `stars`, `position` and `active` leave `profiles`, and their values are copied into one group for existing dev data
  - `profiles.is_dev boolean not null default false`
  - `seasons.group_id not null` (existing seasons go into that group)
- [ ] Helpers (security definer, `set search_path`): `is_dev()`, `is_group_admin(group_id)` (an active admin of the group, or a Dev) and `is_group_member(group_id)`. `is_admin()` stays, with no arguments, meaning "a Dev or an admin of any group", only so the app can decide whether to show the Admin tab. **Policies never use `is_admin()`.**
- [ ] Every existing policy, view and function uses the group of the row it touches (season → group, run → season → group). `my_plays()` reads Plays from the run's group. `run_roster` shows stars and the Unpaid flag only to admins of that run's group. `player_directory` reads name from `profiles` and position and Plays from `group_members`.
- [ ] A guard trigger on `group_members` lets only the group's admins change `role`, `plays`, `stars`, `position` or `active` (it replaces `guard_profile_columns`), and refuses any change that would leave a group with no active admin.
- [ ] `make_admin(group_id, player_id)`, `remove_admin(group_id, player_id)` and `transfer_admin(group_id, to_player_id)` are admin-only. Transfer makes the other person admin and removes the caller in one transaction.
- [ ] `delete_my_account()` refuses with "Transfer admin first: you're the only admin of {group}." when the caller is the only admin of a group that has other active members. Settings shows that message.
- [ ] `seed.sql` puts everyone in one group, "Brampton Weekend Football", with John, Sim and Coach as its admins.
- [ ] pgTAP: per-group stars and Plays; an admin of group A can't read or change group B; a Dev can; the last-admin rule; make / remove / transfer admin; the delete-account guard. Every existing test file is updated for groups and passes.
- [ ] Home, Coach's Home, Run detail (player and admin) and Settings still work unchanged. `npm run db:types` is run and committed.

**Learning notes**
- Moving columns to a new table in a migration without losing data (`insert … select`, then `alter table … drop column`)
- Why `is_group_admin(group_id)` is security definer, and why policies should never call a helper that ignores the row's group
- Constraint triggers vs `before update` triggers for "at least one admin"

---

### T-84 · Scope runs and holidays to a group (#108)
**Milestone:** RSVP loop · **Labels:** database, tests · **Size:** M

**Summary:** Two groups can play on the same Saturday, and one group switching off a holiday mustn't cancel another group's run. Run dates become unique per season, seasons in one group can't overlap, there is one current season per group, and holidays are stored per group.

**Spec:** Data model (`runs`, `seasons`, `holidays`); Key flows › Long-weekend Mondays
**Design:** No mockup (database). `11-admin-holidays` shows the per-group switches
**Depends on:** T-69

**Acceptance criteria**
- [ ] New migration:
  - `runs.run_date` is unique per `(season_id, run_date)` instead of across the whole app
  - seasons in the same group can't overlap: an exclusion constraint on `(group_id, daterange(starts_on, ends_on, '[]'))` (needs `btree_gist`), with `starts_on` and `ends_on` now required
  - `one_current_season` becomes unique on `group_id where is_current`
  - `holidays` gets `group_id`, primary key `(group_id, holiday_date)`
- [ ] `fill_holidays(group_id, year)`, `generate_season_runs(season_id)` and `set_holiday_active(group_id, holiday_date, active)` work within one group, and `generate_season_runs` refuses an ended season (`ended_at` arrives in T-85; until then this check is skipped).
- [ ] pgTAP: two groups each get a run on the same Saturday; overlapping seasons in one group are refused, while the same dates in two groups are fine; switching a holiday off in group A leaves group B's run; one current season per group. The T-12 season-run tests still pass after updating.
- [ ] `npm run db:types` is run and committed.

**Learning notes**
- Exclusion constraints and `daterange` (`&&` means "overlaps")
- Why a composite unique key replaces a single-column one

---

### T-85 · Add season membership, join codes and approval (#109)
**Milestone:** RSVP loop · **Labels:** database, tests · **Size:** L

**Summary:** This closes the open sign-up. A player only sees a season (its runs, RSVPs, teams and players) once they're an **active member**, which they become by entering the season's join code. Brand-new players wait for an admin's approval; returning players go straight in. Admins never need a code.

**Spec:** Data model (`season_members`, the new `seasons` columns); Access control; Database functions (`join_season`, `my_season`, `mark_welcome_seen`); Key flows › Groups, seasons and join codes
**Design:** No mockup (database). States used by `12-join-season`, `13-admin-seasons` and `02-home` (`welcome`)
**Depends on:** T-84

**Acceptance criteria**
- [ ] New migration:
  - `seasons` gets `join_code text not null unique` (default `new_join_code()`), `code_enabled` (default true), `requires_approval` (default true) and `ended_at`
  - `member_status` enum (`waiting`, `active`, `removed`)
  - `season_members (season_id, player_id, status, joined_via ('code' | 'admin'), joined_at, approved_by, approved_at, welcomed_at)`, primary key (season_id, player_id)
- [ ] `new_join_code()` makes 6 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no 0, O, 1 or I) and tries again if the code is taken.
- [ ] `join_season(code)`:
  - strips spaces and dashes and upper-cases the code
  - finds a season with that code that has the code on and hasn't ended; otherwise it raises "That code doesn't match an open season."
  - **waiting** if the season needs approval and the player was never an active member of this group, **and always waiting** if an admin removed them from the group (their `group_members.active` is false) or from this season; otherwise **active**
  - joining twice keeps one row; returns the season's id, name and the status
- [ ] A trigger runs when a member becomes active: it creates the unpaid `season_passes` row, and creates (or reactivates) their `group_members` row with 3 stars, Attack and Plays on for a first-timer.
- [ ] A trigger after a season is inserted adds the group's admins who play as active members.
- [ ] `is_season_member(season_id)` (active member, or an admin of the season's group). `seasons`, `runs`, `rsvps`, `team_assignments` and `run_roster` are readable only by active members of that season and the group's admins. Writing your own RSVP also needs it. `player_directory` shows players only the active members of their current and upcoming seasons. `season_members`: players read their own rows; the group's admins read and write their group's rows.
- [ ] `my_season()` returns:
  - the current and the upcoming season the caller is active or waiting in (id, name, dates, status, request time)
  - the name of the last season they were active in
  - whether they can still create a group (fewer than 3 created)
- [ ] `mark_welcome_seen(season_id)` sets the caller's `welcomed_at`.
- [ ] Existing dev members become active members of the current season, with `welcomed_at` set. `seed.sql` adds one waiting player, one player with no membership and one ended season.
- [ ] pgTAP (`season_membership.test.sql`) checks that:
  - a non-member and a waiting member can't read the season, its runs, RSVPs, teams or the two views, and can't RSVP
  - a returning player joins as active, while a new player waits
  - the code works with spaces, a dash or lower case; a wrong code, a code that's off and an ended season give the same error
  - a removed player rejoins as waiting
  - a pass appears only once the player is active
  - playing admins are added to a new season
  - each `my_season()` case
- [ ] `npm run db:types` is run and committed.

**Learning notes**
- A membership table as the key to row-level security, and helper functions so policies don't check each other in a loop
- Giving the same error for different failures, so a code can't be guessed by its error
- Triggers that react to a status change (`old.status is distinct from new.status`)

---

### T-86 · Add the admin season functions (#110)
**Milestone:** RSVP loop · **Labels:** database, tests · **Size:** M

**Summary:** The database functions behind Start your own runs, Admin · Seasons and the player sheet: create a group or a season, make a new code, approve or decline new players, end a season, and remove a player from the group. Each runs as one transaction and checks the caller.

**Spec:** Database functions; Key flows › Groups, seasons and join codes
**Design:** No mockup (database). Used by `14-start-your-runs` (`form`, `error`), `13-admin-seasons` (`errors`, `overlay = new | end`) and `06-admin-players` (`overlay = remove`)
**Depends on:** T-85

**Acceptance criteria**
- [ ] `create_group(name, season fields)` (any signed-in user):
  - creates the group, makes the caller its admin, and creates its first season
  - refuses a 4th group created by the same account with "You've created 3 groups, the most allowed. No more groups can be created."
  - an empty name gives "Give your group a name"
- [ ] `create_season(group_id, type, name, starts_on, ends_on, start time, address, price)` (group admins):
  - end before start gives "End date must be after the start date"; overlapping dates give "These dates overlap {season}"
  - the season is **current straight away** if it starts today or earlier (Toronto) and the group has no current season; otherwise it's upcoming
- [ ] `regenerate_join_code(season_id)`: the old code stops working.
- [ ] `approve_members(season_id, player_ids uuid[])` sets waiting members active and records who and when, returning how many. `decline_member(season_id, player_id)` sets them to removed.
- [ ] `end_season(season_id)`:
  - sets `ended_at`, `is_current = false`, `code_enabled = false` and `ends_on = least(ends_on, today)`
  - deletes the season's runs after today and returns how many
  - refuses a season that has already ended
- [ ] `remove_from_group(group_id, player_id)`:
  - sets `group_members.active = false` and marks their memberships in seasons that haven't ended as removed; RSVPs to runs after today are deleted, while history and passes are kept
  - refuses your own row and the last admin
- [ ] Turning `code_enabled` and `requires_approval` on or off stays a plain update by the group's admins.
- [ ] pgTAP: each function works for the group's admin and is refused for a player and for another group's admin; plus the 3-group limit, the current-vs-upcoming rule, the overlap error and the `end_season` deletions.

**Learning notes**
- Array parameters and `= any(...)`
- "Today in Toronto": `(now() at time zone 'America/Toronto')::date`
- Returning row counts with `get diagnostics`

---

### T-81 · Build the Join a season screen and the season gate (#104)
**Milestone:** RSVP loop · **Labels:** player UI · **Size:** M

**Summary:** A signed-in person who isn't an active member of a current or upcoming season sees Join a season instead of the tabs. They type the code, or open an invite link that fills it in, and go **straight to Home**. A new player sees "Waiting for an admin" until approved. Players never pick a season: Home shows the runs of every season they're in.

**Spec:** Key flows › Groups, seasons and join codes (player steps)
**Design:** `12-join-season` (`state = enter | error | pending`, `returning`, `groupLimit`)
**Depends on:** T-85, T-08

**Acceptance criteria**
- [ ] `src/app/(app)/_layout.tsx` calls `my_season()`. Admins always get the tabs. A player active in a current or upcoming season gets the tabs; anyone else gets the Join screen, with no bottom nav. `useMe` no longer fails for someone who isn't in any group yet.
- [ ] **enter:**
  - "Join a season" and its intro
  - six 56-tall boxes in two groups of three with a dash between, the active box with a 2px `brand` border
  - typing or pasting upper-cases letters and ignores spaces and dashes
  - "Join season" looks disabled until there are 6 characters, and shows a spinner while joining
- [ ] **returning:** when `my_season()` names a last season, the heading reads "{last season} has ended" with the returning intro.
- [ ] **error:** red box borders and "That code doesn't match an open season." (`role="alert"`).
- [ ] **pending:**
  - the amber card, "Waiting for an admin", the season name and the request time
  - until T-91 the line reads "Your request is in. An admin usually approves new players within a day. Check back here."
  - the status refreshes when the app comes back to the front, and Home opens once approved
- [ ] **Start your own runs:** the "OR" card opens 14 (T-87). With `groupLimit` (from `my_season()`) it's disabled with the 3-group line.
- [ ] A successful join goes straight to Home; there is no joined screen.
- [ ] `/join/[code]`:
  - signed in, it joins
  - signed out, it keeps the code through Google sign-in and then joins
  - a wrong code shows the error state with the code filled in
- [ ] Home and the pass chip use the player's seasons from `my_season()`: upcoming runs of the current and the upcoming season as one list in date order, and the pass chip for the season of the next run.
- [ ] Header with logo + "FirstTouch" and "Sign out"; footer "Signed in as {email}". Matches the mockup in light and dark at 390 wide.

**Learning notes**
- Expo Router dynamic routes (`[code].tsx`) and `useLocalSearchParams` (SDK 58 docs)
- A segmented code input built from one hidden `TextInput`
- Keeping a value across an OAuth redirect on web (`sessionStorage`)
- Refreshing on focus (`AppState` / TanStack Query `focusManager`)

---

### T-87 · Build Start your own runs (#111)
**Milestone:** RSVP loop · **Labels:** player UI · **Size:** M

**Summary:** From the Join screen, anyone can create a group and its first season, become its admin, and get the join code to share.

**Spec:** Key flows › Groups, seasons and join codes (start your own runs)
**Design:** `14-start-your-runs` (`step = form | error | done`)
**Depends on:** T-86, T-81

**Acceptance criteria**
- [ ] **form:**
  - "← Back" to Join and the intro
  - one card with Group name, a "FIRST SEASON" label, Indoor/Outdoor, Season name (filled in from the type and start year, e.g. "Indoor 2026–27" or "Outdoor 2027", until edited), Start and End date pickers, Start time, Pass price ($120 default) and Address
  - a full-width "Create group" button
- [ ] **error:** the field errors from `create_group` show under their fields ("Give your group a name", "End date must be after the start date"), and the 3-group limit shows as an alert above the button. The form scrolls.
- [ ] **done:**
  - an "ADMIN" chip and "You're the admin of {group}"
  - the join code card ("JOIN CODE · {season}", the code as `KX7 42P`, the link built from the app's own address)
  - "Copy code" and "Share link"
  - the line about approving new players, and "Go to Home →", which opens Home with the Admin tab and no welcome popup
- [ ] Light and dark, 390 wide.

**Learning notes**
- Form state with derived defaults (the season name follows the type and date until you edit it)
- Copying and sharing: `expo-clipboard` and `Share` / `navigator.share`, with copy as the fallback (SDK 58 docs)

---

### T-88 · Show the welcome popup on Home (#112)
**Milestone:** RSVP loop · **Labels:** player UI · **Size:** S

**Summary:** The first time a player opens Home after joining a season, or after being approved, a bottom sheet shows the season details. It never shows again once dismissed, on any device.

**Spec:** Key flows › Groups, seasons and join codes (after joining)
**Design:** `02-home` (`welcome = true`)
**Depends on:** T-81

**Acceptance criteria**
- [ ] Shown when `my_season()` says the player is active and `welcomed_at` is empty. Not shown to the group's creator, or to admins added automatically.
- [ ] The `BottomSheet` (T-20) contains:
  - a drag handle and the ball watermark
  - a "✓ You're in" chip, the season name (28px / 800) and dates
  - a `surface-2` box with "Sat & Sun at {time}", the address on two lines and "Season pass ${price} · pay an admin"
  - a full-width "Got it" button
- [ ] "Got it" or tapping the scrim closes it and calls `mark_welcome_seen`. It stays closed after a reload and on another device.
- [ ] Light and dark.

**Learning notes**
- Storing "seen once" on the server instead of the device, and why

---

### T-89 · Build the Admin · Seasons tab (#113)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** L

**Summary:** A new Seasons sub-tab where admins see the group's current and upcoming seasons, share each season's join code, approve new players, and see past seasons.

**Spec:** Key flows › Groups, seasons and join codes (admin steps)
**Design:** `13-admin-seasons` (`state = active | both | upcoming | ended`, `overlay = none`)
**Depends on:** T-86, T-81, T-83

**Acceptance criteria**
- [ ] The admin pills read Players · Runs · **Seasons** · Team builder · Passes and scroll sideways. The route is `src/app/(app)/admin/(sections)/seasons.tsx`; `nav.ts` and its tests are updated.
- [ ] Top: the group name as a small kicker above "CURRENT SEASON", and a "+ New season" pill (it opens T-90's sheet; hidden until then).
- [ ] **Season card:**
  - a status chip: "Current · open to join" (`ok`), "Upcoming · starts {date}" (`amber`) or "Ended {date}" (`locked`)
  - the name, dates, run count
  - tiles for members · waiting (amber) · paid
- [ ] **Join code card:**
  - the code as `KX7 42P` (muted when off), with the link or "Code is off · nobody new can join"
  - "New code" calls `regenerate_join_code` after asking "The old code will stop working."
  - "Copy code" and "Share link"
  - the "Code is on" and "Approve new players" switches
- [ ] **Waiting for approval · {n}:**
  - rows with avatar, name, "New" chip and "Joined with code · {when}"; with two open seasons each row also names its season
  - × asks first, then calls `decline_member`; ✓ and "Approve all" call `approve_members`
  - the tiles update straight away; the section is hidden when nobody is waiting
- [ ] **both:** a NEXT SEASON section after the current season, with the upcoming season's card (amber bar) and its own code card.
- [ ] **upcoming:** only the NEXT SEASON section, and no End button.
- [ ] **ended:** "LAST SEASON", a grey bar and the dashed "No season is open" card; "Start the next season" opens the New season sheet.
- [ ] Past seasons list (name, dates, member count), and the red-outline "End {season}" button (it opens T-90's dialog).
- [ ] The Invite card stays hidden until T-91. Light and dark.

**Learning notes**
- Optimistic updates for a list in TanStack Query (approve and decline)
- One screen, four states: deriving the state from data instead of storing it

---

### T-90 · Add the New season sheet and the End season dialog (#114)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** M

**Summary:** Admins create the group's next season (current straight away if it has started, otherwise upcoming) and end the current one.

**Spec:** Key flows › Groups, seasons and join codes (new season, end season)
**Design:** `13-admin-seasons` (`overlay = new | end`, `errors`)
**Depends on:** T-89

**Acceptance criteria**
- [ ] **New season sheet (`BottomSheet`):**
  - Indoor/Outdoor; Name filled in from the type and start year until edited; Start and End date pickers; Start time, Address and Pass price, filled in from the last season of the same type
  - the note "If it starts today or earlier, it becomes the current season straight away. Otherwise it opens as Upcoming…"
  - "Create {name}" calls `create_season`; the "Invite {last season} players" checkbox stays hidden until T-91
- [ ] With **`errors`**: "End date must be after the start date" and "These dates overlap {season}" show under the date fields.
- [ ] After creating, the Seasons tab shows the new season (state `active` or `both`) with its code.
- [ ] **End season dialog:**
  - "End {season}?" with the three bullets; the first gives the real number of runs after today that will be deleted
  - Cancel and a red "End season", which calls `end_season`; the tab then shows `ended`, or `upcoming` if one exists

**Learning notes**
- A centred confirm dialog (`ConfirmDialog` from T-20)
- Date maths for the season name ("Indoor 2026–27" vs "Outdoor 2027")

---

### T-21 · Build the Admin · Players list with search and filters (#21)
**Milestone:** RSVP loop · **Labels:** admin UI, design · **Size:** M

**Summary:** List the admin's group for admins: admins first (Coach, John, Sim), then everyone else A to Z. It has a search field, the All / Flagged / ATT / DEF filters, and each card's name, Admin badge, flag badges and current stars and position. Editing comes in T-22; the player sheet in T-23.

**Spec:** Access control (group admins read their group's members); Overview (flags)
**Design:** `06-admin-players` with `filter = all | flagged | att | def`, `overlay = none`
**Depends on:** T-09, T-69, T-83

**Acceptance criteria**
- [ ] Shows the active members of the admin's group only (people removed from the group, and other groups' players, never appear), admins first, then alphabetical. The search placeholder reads "Search {n} people", and search filters by name as you type.
- [ ] Filter chips show counts ("All 41", "Flagged 9"). ATT and DEF filter by position.
- [ ] *Flag meaning (the design shows flags per person, the spec stores them per RSVP):* Unpaid means no paid pass for the current season. Morning of means a morning-of yes for the next run. Flagged means either one.
- [ ] Cards with Plays off read "Manages only · never placed in teams", with the rating and position dimmed.
- [ ] Admins have the soft-green Admin badge (T-83).
- [ ] The line above the list reads "{n} players · tap stars to rate".

**Learning notes**
- Reading `group_members` joined to `profiles` as a group admin (RLS limits it to your group)
- Filtering and sorting in the client with `useMemo` vs in the query
- `FlatList` for long lists in React Native

---

### T-22 · Let admins set stars, position and Plays (#22)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** S

**Summary:** Make the Players cards editable: tap a star to set the rating, tap Attack or Defend, flip Plays. Each change saves at once with optimistic UI. All three are per group, so they only change this group's view of the player.

**Spec:** Access control (the `group_members` guard; group admins change stars, position, plays); Overview (new players start at 3 stars, Attack)
**Design:** `06-admin-players` (star picker, Attack/Defend toggle, compact Plays switch; "Ratings are for {group} only." in the player sheet)
**Depends on:** T-08, T-21

**Acceptance criteria**
- [ ] Tapping star N sets `stars = N` on the player's `group_members` row. Attack/Defend sets `position`. The Plays switch sets `plays`. Each saves without a Save button and rolls back with a message on error.
- [ ] Turning Plays off dims the rating and position and shows the "Manages only" line. That person can no longer RSVP to this group's runs (the database refuses), and Home shows them Coach's view.
- [ ] Changing stars never shows up anywhere a player can see, and never changes the player's rating in another group.
- [ ] A new member appears with 3 stars and Attack.

**Learning notes**
- `useMutation` per field vs one generic "update member" mutation
- Why the guard trigger exists even though RLS already allows only admins

---

### T-23 · Add the player sheet's admin controls: make, remove and transfer admin, and remove from the group (#23)
**Milestone:** RSVP loop · **Labels:** admin UI · **Size:** M

**Summary:** Tapping a player on Admin · Players opens their sheet. Besides the ratings (T-22), it lets admins make someone admin, remove an admin, transfer their own admin to someone else, and remove a player from the group. A group always keeps at least one admin, and the database enforces it.

**Spec:** Access control › Admins; Database functions (`make_admin`, `remove_admin`, `transfer_admin`, `remove_from_group`)
**Design:** `06-admin-players` (`overlay = player | transfer | remove`, `sheetFor = player | admin | self`, `onlyAdmin`)
**Depends on:** T-22, T-69, T-86

**Acceptance criteria**
- [ ] Tapping a row opens the `BottomSheet`:
  - avatar, name, the Admin badge for admins, the subtitle ("Player", "Admin · plays", "You · admin · plays") and a close button
  - the ratings box with "Ratings are for {group} only."
  - the ADMIN section
- [ ] **Player:** "Make admin" (brand outline) with "Admins can rate players, manage runs and seasons, and approve new players." It calls `make_admin`, and the badge appears at once.
- [ ] **Another admin:** "Remove admin" (red outline) calls `remove_admin` after a confirmation.
- [ ] **Your own row:**
  - "Transfer admin" (brand outline) and "Remove admin" (red outline)
  - with `onlyAdmin` both are disabled, with "You're the only admin of {group}." and the amber "A group needs at least one admin."
  - you lose the Admin tab after removing your own admin
- [ ] **Transfer (`overlay = transfer`):**
  - a search field and a list of the group's members (avatar, name, radio button), with the picked row highlighted
  - "Make {name} admin and remove your admin access?"
  - "Transfer" is disabled until someone is picked and calls `transfer_admin`
- [ ] **Remove from {group}** (not on your own row): the red text button and its note open the confirm dialog (`overlay = remove`), "Remove {name}?". Confirming calls `remove_from_group`, and the player leaves the list.
- [ ] Database errors (last admin, not allowed) show in the sheet. Light and dark.

**Learning notes**
- A list with single selection (radio group semantics: `role="radiogroup"` / `aria-checked`)
- Showing a server rule's error in the UI instead of repeating the rule in the client

---

### T-24 · Build the season card on Admin · Runs (#24)
**Milestone:** RSVP loop · **Labels:** admin UI, design · **Size:** M

**Summary:** The Season section of Admin · Runs: pick the group's current or upcoming season, set its start and end dates, and tap "Create runs", which calls `generate_season_runs` and reports how many runs it added. It also has the Holidays link. New seasons are created on Admin · Seasons (T-90).

**Spec:** Key flows › Season run list (admin) steps 1, 2 and 5
**Design:** `07-admin-runs` (Season section: title, two-option switch, Start and End date, "Create runs", schedule note, "Holidays" link; 24 radius with `shadow`)
**Depends on:** T-08, T-09, T-86

**Acceptance criteria**
- [ ] *Design gap:* the mockup's Indoor / Outdoor switch picks between the group's current and upcoming seasons, labelled by name, and is hidden when only one is open. The title shows the season name. Ended seasons aren't shown.
- [ ] Start and End are real date pickers (the mockup shows text fields) and save to `starts_on` / `ends_on`. "End date must be after the start date" and "These dates overlap {season}" come back from the database and show under the fields.
- [ ] "Create runs" calls `generate_season_runs` and shows "Added {n} runs" (or "No new runs"). Running it again after extending the dates adds only the missing dates.
- [ ] The note reads "Every Saturday and Sunday at {time}, {address}, plus holiday Mondays." Outdoor adds "Outdoor runs always have 2 teams."
- [ ] "Holidays" opens the Holidays screen (T-27).

**Learning notes**
- A date picker on React Native for web (`<input type="date">` via a web-only component, or a library)
- Showing a database constraint error (the overlap exclusion) as a friendly message
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
**Design:** `07-admin-runs` with `overlay = sheet` and `overlay = confirm` (`compact = true`). Use the `BottomSheet` and `ConfirmDialog` components built in T-20.
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
**Depends on:** T-24, T-26 (reuses the `ConfirmDialog` built in T-20)

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
**Design:** `11-admin-holidays` ("Add date" dashed button). The form has no mockup: reuse the `BottomSheet` from T-20 (`07-admin-runs`)
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
**Design:** `05-settings` (Notifications: "Night-before reminder", "Teams published", "Changes and cancellations"). The "Enable notifications" button has no mockup: use the primary button style inside the same card. Reuse `SectionHeading`, `SettingsCard` and `SettingsRow` from T-20, and extend `useMySettings` and `useSaveTheme` (in `src/lib/useSettings.ts`) with the three switches.
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
- [ ] `service_role` gets read access to `runs`, `seasons`, `rsvps`, `profiles` and `group_members` (stars, position and Plays are per group) for generate-teams (it can't use `run_roster`, which hides stars from non-admins; see disagreement S1).
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
- [ ] `supabase/functions/generate-teams/index.ts` accepts `{ run_id, seed? }`. Only the service role or an admin of the run's group can call it.
- [ ] It uses each player's stars and position from the run's group (`group_members`). It includes every yes RSVP from a member with Plays on (paid or not, morning-of or not). It uses the season type and `team_count_override`.
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

**Summary:** Once teams are published, a closed run card on Home shows the Version 3 team panel in place of the "I'm in" button: your team's wash, a team dot, "You're on {team}" over "{n} players · ATT/DEF {a}:{d}", and a "View teams" button. An admin with no team of their own (Coach, or a playing admin who isn't going) sees "Teams are up" instead. A player who isn't going sees no team panel. (Run detail's "Teams are up" panel is built in T-19; here it is reused on Home.)

**Spec:** Key flows (players see teams the moment RSVPs close)
**Design:** `02-home` (closed card panel; `plays = off` variant); README › 02 Home › Closed card (V3)
**Depends on:** T-17, T-38

**Acceptance criteria**
- [ ] The panel replaces the "I'm in" button on a closed card (the card's bar is already `card-bar-closed` from T-14). It is radius 18 with a `line` border, a 16 px dot with a 4 px soft ring, a title (16 px / 800) over a subtitle (13 px, `muted`), and a "View teams" button (`button` gradient, `on-brand`) on the right.
- [ ] Published and you're on a team: the panel is your team's `team-*-wash` over `surface-2`, the dot is your team colour, and it reads "You're on {team}" over "{n} players · ATT/DEF {a}:{d}". "View teams" opens Teams for that run.
- [ ] Published and you're an admin with no team (Coach, or a playing admin who isn't going): the panel is `surface-2` with a `brand` dot, and reads "Teams are up" over "{n} teams · published h:mm AM", plus "View teams".
- [ ] *Design gap:* published and you're a player who isn't going: no team panel (players only see the team they're on). The closed card just has no button.
- [ ] *Design gap:* locked with fewer than 4 players: a muted "Not enough players — no teams this time" and no button.
- [ ] Run detail already shows this panel under the RSVP section: T-18 builds the "You're on {team}" case as the `TeamPanel` component, and T-19 adds the admin "Teams are up" variant. Here, reuse `TeamPanel` on Home.
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
**Design:** `07-admin-runs` with `status = open | locked | published | cancelled | empty` (curved `card-bar` left edge, `brand` wash, 26 radius, `shadow`)
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

**Summary:** On a wide screen, the admin area gets the pitch-green sidebar (logo, Players / Runs / Seasons / Team builder / Passes, "Back to player view"). The Team builder uses the desktop layout: a top bar, a fairness strip, three team columns with full names, and a bottom bar with the note and warning.

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

### T-91 · Invite last season's players and push approvals (#115)
**Milestone:** Teams · **Labels:** database, functions, admin UI · **Size:** M

**Summary:** One tap sends last season's players the new season's code, and a waiting player gets a push when an admin approves them. Until this ticket, admins share the link themselves and the pending screen says "Check back here".

**Spec:** Notifications › Messages (season open; approved)
**Design:** `13-admin-seasons` (Invite last season's players card; the "Invite {last season} players" checkbox in `overlay = new`); `12-join-season` (`state = pending` copy)
**Depends on:** T-34, T-90

**Acceptance criteria**
- [ ] `invite_last_season(season_id)` (group admins) pushes "{Season} is open. Tap to join." to active members of the group's previous season who aren't in this one. The push opens `/join/{code}`. It returns how many players it went to.
- [ ] The Invite card shows "{n} players from {last season} haven't joined yet. Sends them the code." Send changes it to "Sent to {n}".
- [ ] The New season sheet's checkbox (checked by default) sends the invites after the season is created.
- [ ] `approve_members` pushes "You're in {season}." to each approved player. The pending screen goes back to the design's "You'll get a notification when an admin approves you, usually within a day."
- [ ] Both messages respect the "Changes and cancellations" switch. Failures go to `job_errors`.

**Learning notes**
- Calling send-push from SQL with pg_net
- Deep links in a push payload

---

---

### T-49 · Schedule the yearly holiday fill job (#49)
**Milestone:** Teams · **Labels:** database · **Size:** S

**Summary:** On December 1 at 6 AM Toronto time, call `fill_holidays(group, next year)` for every group, so the coming year's holiday Mondays show on each group's Holidays screen early.

**Spec:** Scheduled jobs (fill-next-year-holidays); Long-weekend Mondays › How dates get in
**Design:** `11-admin-holidays` (where the dates appear)
**Depends on:** T-37, T-84

**Acceptance criteria**
- [ ] `cron.schedule('fill-next-year-holidays', '0 11 1 12 *', …)` (11:00 UTC is 06:00 EST, and Toronto is on EST in December).
- [ ] Running the job body by hand adds next year's dates to every group and leaves switched-off dates switched off.
- [ ] A failure writes to `job_errors`.

**Learning notes**
- Cron expression syntax
- `on conflict do nothing` (why refilling never brings a switched-off date back)

---

### T-92 · Roll seasons over with a daily job (#116)
**Milestone:** Teams · **Labels:** database, tests · **Size:** S

**Summary:** Every morning a job ends a current season whose end date has passed and makes an upcoming season current on its start date, so admins never have to.

**Spec:** Scheduled jobs (season-rollover); Key flows › Groups, seasons and join codes
**Design:** `13-admin-seasons` (the New season sheet's note)
**Depends on:** T-37, T-86

**Acceptance criteria**
- [ ] `season_rollover()`: for each group, if the current season's `ends_on` is before today (Toronto), call `end_season`; then make current the upcoming season whose `starts_on` is today or earlier. It does nothing on days with no change.
- [ ] `cron.schedule('season-rollover', …)` at 03:00 Toronto (scheduled for both UTC offsets, or checked inside the function).
- [ ] Failures go to `job_errors`. pgTAP covers `season_rollover()` with fixed dates.

**Learning notes**
- Writing the job as a plain function you can test, and having pg_cron only call it

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

**Summary:** For the chosen season: a pitch-green card with the price, "{n} of {total} paid", the amount still owed and a progress bar; All / Not paid filters; and one row per member with a Paid switch. Unpaid rows are tinted red.

**Spec:** Overview (season passes marked paid by admins; unpaid players still play); Access control (group admins)
**Design:** `09-admin-season-passes`
**Depends on:** T-08, T-09, T-51, T-85

**Acceptance criteria**
- [ ] *Design gap:* the mockup's Indoor / Outdoor switch picks between the group's current and upcoming seasons, labelled by name, and is hidden when only one is open. The title and price come from the season (`pass_price_cents`).
- [ ] Lists the season's active members who play (Coach and other manage-only admins are left out, matching "40 of 41"). Waiting and removed people aren't listed.
- [ ] The Paid switch updates the member's `season_passes` row with optimistic UI. Paid rows show "Paid" and "Marked paid by {name} · {date}". Unpaid rows use `#FEF2F2` with a `#FCA5A5` border and "Not paid".
- [ ] "{n} of {total} paid", "{u} unpaid · ${u × price} due" and the bar update at once.
- [ ] "Not paid {u}" filter. Rows sorted A to Z.

**Learning notes**
- Joining members to their passes in one query
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

### T-56 · Check holiday Mondays and create the first real season in prod (#56)
**Milestone:** Web launch · **Labels:** database · **Size:** S

**Summary:** Prod has no seed and needs none: the first admin creates the group and its first season in the app with Start your own runs (T-87). This ticket checks the generated holiday Mondays against Ontario's official list once, and covers the launch-day steps.

**Spec:** Key flows › Groups, seasons and join codes; Long-weekend Mondays ("Check them once against Ontario's official holiday list before launch")
**Design:** `14-start-your-runs`
**Depends on:** T-54, T-87

**Acceptance criteria**
- [ ] The 2026–2028 holiday table from the spec is checked against ontario.ca, with any difference fixed in the function plus a test.
- [ ] After launch, these steps happen in the app, with no SQL:
  - Simar signs in, taps Start your own runs and creates "Brampton Weekend Football" with "Indoor 2026–27" (7855 Finch Ave W, Brampton, ON L6T 0B2, 6:30, the real dates), then taps Create runs on Admin · Runs and shares the code
  - John and Coach join with the code, are approved, and are made admin (Coach with Plays off)
- [ ] The only hand step: Simar's `profiles.is_dev` is set to true in the Supabase dashboard, as `docs/environments.md` describes.

**Learning notes**
- Why prod data comes from the app (or migrations), never from hand-written SQL

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
- [ ] The test users are active members of a test group's season (set up by the script, or by joining with its code), since only members can see runs.
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

### T-76 · Let admins deactivate players (#76) — closed, superseded
Replaced by "Remove from {group}": `remove_from_group` (T-86) and the player sheet (T-23). `profiles.active` moved to `group_members.active`.

### T-93 · Let a player be in more than one group (#117)
**Labels:** later, player UI, design · **Size:** L · **Spec:** Later (more than one group per player) · **Design:** needs new mockups · **Depends on:** T-89
The database already allows it (membership is per group). Needed: a way to join a second group's season while already in one, group labels on run cards and Teams, a group switcher in Admin for someone who admins two groups, and Home combining runs from both.
**Learning notes:** designing for "usually one, sometimes many" without cluttering the common case.

---

## Spec and design disagreements

Rule used: **the spec wins on behaviour and permissions, the design wins on visuals.** All four decisions were settled on Nov 9, 2026. Everything else is resolved as described and already written into the tickets.

### Decisions

| # | Question | Decision | Affects |
| --- | --- | --- | --- |
| D1 | Settings shows three notification switches (Night-before, Teams published, Changes and cancellations). The spec has only an "Enable notifications" button and nowhere to store per-type choices. | **Decided:** keep the switches (the design is clear, the privacy policy says "turn notifications off in Settings", and it's cheap). Store them on the `player_settings` table (own read/write), which T-20 creates for the Appearance setting. Show "Enable notifications" first, switches after. Update the spec. | T-32, T-34, T-47, T-48 |
| D2 | The design shows a **Cancelled** run state (chip, "Cancelled by an admin" row, Next-run card variant) but no Cancel button anywhere. The spec has `cancelled` status and a "run cancelled" push, but its admin flow only describes Delete. | **Decided:** add "Cancel run" to the edit sheet. It keeps the run visible as Cancelled (useful for rain-outs, so players can see it's off), while Delete removes it entirely. | T-26, T-43, T-48 |
| D3 | Seasons: the spec says an admin "creates or opens a season". The design only lets you pick Indoor/Outdoor and edit dates, with no create-season or "current season" control. Prod has no seed. | **Superseded by D5 (Nov 15, 2026).** Seasons are created in the app (Start your own runs, Admin · Seasons). | T-24, T-56 |
| D5 | Sign-up is open, so anyone who signs in is in the season. | **Decided Nov 15, 2026:** <ul><li>**Groups** own seasons and admins; admin, Plays, stars and position are per group.</li><li>Players join a season with its 6-character **join code**, and brand-new players wait for **approval** (on by default). There's no limit on wrong codes.</li><li>Players never pick a season: Home shows every season they're in, and a **welcome popup** replaces a "You're in" screen.</li><li>A new season is **current straight away** if it has started, otherwise upcoming until a daily job flips it.</li><li>Admins can remove each other (a group always keeps one); an account can create **at most 3 groups**; admins see only their own group's players and can remove a player from the group.</li><li>Playing admins are added to each new season automatically; a hand-set **Dev** flag is admin everywhere.</li></ul> | T-69, T-81–T-93, T-21–T-24, T-35, T-36, T-49, T-52, T-56, T-64, T-76 |
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
| 9 | `03-run-detail` | V2 drew "Change" as a link back to Home. | The spec's RSVP is a toggle. V3 replaces "Change" with a pill ("You're in" / "I'm in") that toggles in place. (T-18) |
| 10 | `04-teams` | *(Fixed in V2.)* The V1 mockup drew the 3-tab player nav for admins. V2 shows the Admin tab. | Nothing to resolve. One shared tab bar shows Admin for admins everywhere. (T-09, T-38) |
| 11 | `04-teams`, `08-admin-team-builder` | No state for "teams not published yet" or "fewer than 4 players". | New empty states: "Teams publish automatically at {time}" and "Not enough players — no teams made" (wording from `07`). (T-38, T-44) |
| 12 | `02-home` | The closed card is only drawn for a player on a team, and for Coach. Not for a player who said no, or a run locked with under 4. | An admin with no team (Coach, or not going): "Teams are up" panel. A player who isn't going: no panel. Under 4: muted "Not enough players — no teams this time". (T-41; Run detail's version is T-19) |
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
| 29 | `03-run-detail` admin view | The mockup and README drop the " · You" suffix for admins. | Decided: an admin who is going keeps " · You" on their own row, like any player (friendlier). (T-19) |
| 30 | `05-settings` Appearance | Nothing says which choice wins after sign-in when this device's saved theme and the one saved in the database differ. | Decided: once signed in, the database wins. With nothing saved, the device's choice stays and no row is written until the player picks one. It's a pure, tested function, `themeAfterSignIn`. (T-20) |
| 31 | `05-settings` profile card | The Paid / Not paid chip has no state for "no current season". Home shows "Not paid" in that case. | Decided: no chip on Settings, because "Not paid" would be misleading. Admins who don't play still get the Admin badge. (T-20) |
| 32 | `06-admin-players`, `07-admin-runs` header | The mockups and README draw an ADMIN tag beside the "Admin" title. | Decided: no tag, because the title already says "Admin". The Admin badge on player rows and Settings stays, in soft green. README lines fixed. (T-83, T-09) |

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
| S13 | spec Privacy › Account deletion | `delete_my_account` lets any admin delete their own account, including the last admin (S10 only covers demoting yourself). | Not built in T-20. Decide in T-23 whether the function should refuse for the last admin. |