This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Workflow: one ticket, one branch, one PR

Every feature, bug fix or task is a **ticket**: a GitHub issue titled `T-NN · <title>`, made from the *Ticket* issue template. One ticket = one branch = one squashed commit on `main`, so every commit on `main` is a state CI has checked.

```bash
git checkout main && git pull
git checkout -b ticket/T-NN-short-slug   # next free T-number
# ...work, committing small steps on the branch...
npm run verify                           # typecheck + lint + tests
git push -u origin ticket/T-NN-short-slug
# open a PR (template asks for "Closes #<issue>"), wait for CI to go green,
# then "Squash and merge" titled "T-NN · <title>", and delete the branch
git checkout main && git pull
```

- **Never commit or push straight to `main`.** The `.githooks/pre-push` hook (installed by `npm install`) blocks it and runs `npm run verify` before every push.
- **Merge only when CI is green.** CI (`.github/workflows/ci.yml`) runs `npm run verify`, starts a throwaway local Supabase (which runs every migration and `seed.sql`), lints the database, runs the database tests, and checks `src/lib/database.types.ts` is up to date.
- Commits on a branch: `feat(T-NN): ...`, `fix(T-NN): ...`, `test(T-NN): ...`, `chore(T-NN): ...`.
- Finish (merge) one ticket before starting the next.

## Environments: dev and prod

| | Database | Web app | Keys live in | Changed by |
| --- | --- | --- | --- | --- |
| **local** | `npx supabase start` (Docker) | — | built in | anything: reset freely |
| **dev** | Supabase `firsttouch-dev` (`mzzzauexjousasuwvyax`) | `npx expo start`; Cloudflare preview per branch | `.env.development` (gitignored); Cloudflare *Preview* vars | `npm run db:push:dev` |
| **prod** | Supabase `firsttouch-prod` | `firsttouch.pages.dev` from `main` | GitHub secrets + Cloudflare *Production* vars only | **only** CI's `deploy-prod` job, after a merge to `main` |

Rules that keep prod safe:
- Never create `.env.production` or put a prod key, ref or password in any file. With none on disk, nothing run locally can reach prod.
- Never run `supabase db push`, `db reset` or SQL against prod from a terminal. Prod changes only through migrations merged to `main`.
- Database changes are migration files, never dashboard edits. Until the first prod deploy, migrations may be edited in place (`npx supabase db reset` locally). From the first prod deploy on they are append-only: every change is a new migration file.
- After changing a migration, run `npm run db:types` and commit the result (CI fails otherwise).

## Database tests

pgTAP tests in `supabase/tests/database/*.test.sql` check the RLS policies, grants and guard functions against the local database. Run them with `npm run test:db` (needs `npx supabase start`); CI runs them on every PR.

- **Every new policy or security-definer function gets a test**, covering both what it allows and what it blocks.
- Each file runs in a transaction and rolls back, and creates its own users with `tests.create_user(...)` (never relies on `seed.sql`). Act as a user with `tests.act_as(<uuid>)` or `tests.act_as_anon()`, and `reset role;` before switching. The helpers are in `00_helpers.test.sql`.

Setup steps for the prod project, GitHub and Cloudflare are in `docs/environments.md`.
