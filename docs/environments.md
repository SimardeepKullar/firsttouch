# Environments: one-time setup

FirstTouch has three databases. Only one of them matters if it breaks.

| | What it is | Who changes it |
| --- | --- | --- |
| **local** | `npx supabase start`: a throwaway copy on your Mac (Docker) | You, freely. `npx supabase db reset` rebuilds it |
| **dev** | Supabase project `firsttouch-dev` | You, with `npm run db:push:dev` |
| **prod** | Supabase project `firsttouch-prod` | **Only** GitHub Actions, after a PR merges to `main` and CI passes |

Prod is safe because **its keys never touch your computer.** No `.env.production` exists. The prod database password lives only in a GitHub secret that only the `main` branch can read, and the prod web keys live only in Cloudflare's Production settings. Nothing you run locally can reach prod.

Do these steps once, in this order.

## 1. Make the repo public and protect `main`

1. GitHub → **firsttouch** → **Settings** → **General** → bottom of the page → **Change visibility** → **Public**.
2. **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**:
   - Name: `protect main`. Enforcement: **Active**.
   - Target branches: **Add target** → **Include default branch**.
   - Tick **Restrict deletions** and **Block force pushes**.
   - Tick **Require a pull request before merging** (required approvals: 0, since you work alone). Under it, set **Allowed merge methods** to **Squash** only.
   - Tick **Require status checks to pass** → **Add checks** → type `verify` and pick it. (It shows up after CI has run once, so do this after the T-01 PR's first run.)
   - **Create**.

GitHub now refuses to merge any PR until CI's `verify` job is green, and refuses direct pushes to `main`.

## 2. Create the prod Supabase project

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**. Name `firsttouch-prod`, region **Canada (Central)**, same as dev.
2. Generate a strong **database password** and save it in your password manager. You'll paste it into GitHub in step 3 and nowhere else.
3. Note the **project ref**: the 20 letters in the dashboard URL (`supabase.com/dashboard/project/<ref>`).
4. **Authentication → Sign In / Providers → Google**: enable it with the same Google client ID and secret as dev.
5. **Authentication → URL Configuration**: Site URL `https://firsttouch.pages.dev`. Redirect URLs: `https://firsttouch.pages.dev/**`.
6. In **Google Cloud → Google Auth Platform → Clients → your client**, add prod's callback to Authorized redirect URIs: `https://<prod-ref>.supabase.co/auth/v1/callback`.

Don't create any tables in the dashboard. CI builds the whole schema from `supabase/migrations` on the first deploy.

## 3. Give GitHub the prod credentials

1. Supabase → your avatar → **Account preferences → Access Tokens** → **Generate new token**, named `firsttouch-github-deploy`. Copy it.
2. GitHub → **Settings** → **Environments** → **New environment** → `production`:
   - **Deployment branches and tags** → **Selected branches and tags** → add `main`. Now only `main` can read these secrets.
   - **Add environment secret** `SUPABASE_ACCESS_TOKEN` = the token from 1.
   - **Add environment secret** `SUPABASE_PROD_DB_PASSWORD` = the password from step 2.
3. GitHub → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable** `SUPABASE_PROD_PROJECT_REF` = the prod ref. (This one is a *repository* variable, not an environment one, because CI checks it to decide whether to deploy at all. A ref isn't a secret.)

The `deploy-prod` job is skipped until that variable exists. The first merge to `main` after you add it creates the whole prod schema.

## 4. Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick `firsttouch`.
2. Production branch: `main`. Build command: `npx expo export --platform web`. Output directory: `dist`.
3. **Settings → Variables and Secrets**. Set both variables separately for each environment:
   - **Production**: `EXPO_PUBLIC_SUPABASE_URL` = `https://<prod-ref>.supabase.co`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = prod's publishable key.
   - **Preview**: the same two names with the **dev** values.

Every ticket branch then gets its own preview URL running against dev, and only `main` runs against prod.

## Day to day

```bash
git checkout main && git pull
git checkout -b ticket/T-NN-short-slug
npx expo start                 # app on dev (reads .env.development)
npx supabase db reset          # rebuild your local database whenever you like
npm run db:types               # after any migration change; commit the result
npm run db:push:dev            # put your migrations on the dev project
git push -u origin ticket/T-NN-short-slug   # hook runs npm run verify first
```

Open the PR, wait for green, squash and merge. CI then applies any new migrations to prod.

**Once prod has run its first deploy, never edit an existing migration.** Prod has already run it and won't run it again. Every change is a new migration file (`npx supabase migration new <name>`).

## Testing against local Supabase

Run the web app against the throwaway database on your Mac, with the seeded test users. **Nothing here touches dev or prod.** Everything uses `127.0.0.1` (your own computer), the local demo key, and a throwaway database. No prod key, ref or password is involved, and no file the script writes ever holds anything but local values.

### 1. Start (and reset) local Supabase

Docker must be running.

```bash
npx supabase start       # first run downloads images; later runs are quick
npx supabase status      # prints the API URL (http://127.0.0.1:54321) and the publishable key
npx supabase db reset    # rebuild the database from the migrations and supabase/seed.sql
```

The seed gives you 28 users, all `@example.com`, all with password `password123`:

- **Admins:** `john@` (John), `sim@` (Sim) and `coach@` (Coach, who doesn't play).
- **Players:** `player01@` to `player25@` (Aiden Brooks, Ben Carter, ...).

### 2. Run the app against it

```bash
npm run web:local
```

- It checks local Supabase is running (and tells you to run `npx supabase start` if not).
- It writes `.env.development.local` for this run only. Expo loads that file ahead of `.env.development`, so the app uses local. The file is deleted when the script stops, including on Ctrl+C. `.env.development` is never touched, and the file is gitignored.
- The app is at **http://localhost:8082**. `npm run web` uses 8081. Browsers keep a separate saved sign-in per address, so a local session and a dev session never overwrite each other.
- If `.env.development.local` already exists and the script didn't make it, the script stops and leaves it alone. Delete or rename it, then run again.

### 3. Sign in as a seed user

Sign-in in the app is Google only, which doesn't work against local. Instead, open http://localhost:8082, open the browser console (Chrome: **Cmd+Option+J**), paste this and press Enter. Replace the placeholder with the `PUBLISHABLE_KEY` from `npx supabase status` (it's the public local demo key, not a secret):

```js
(async () => {
  const email = 'coach@example.com'; // change this to switch user
  const res = await fetch('http://127.0.0.1:54321/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: '<publishable key from npx supabase status>', 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  });
  const session = await res.json();
  if (!session.access_token) return console.error('Sign-in failed:', session);
  localStorage.setItem('sb-127-auth-token', JSON.stringify(session));
  location.reload();
})();
```

The page reloads signed in. (If Chrome blocks pasting, type `allow pasting` in the console first.)

**Switch user:** paste the snippet again with a different `email` (for example `player01@example.com`). It replaces the saved session.

**Sign out:** run `localStorage.removeItem('sb-127-auth-token'); location.reload()`.

### 4. Switch theme

The theme is saved in the browser. In the console on the same address:

```js
localStorage.setItem('firsttouch.theme', 'dark'); location.reload();   // or 'light' or 'system'
```

### 5. Which database am I on?

- **Script:** `npm run web:local` prints a banner saying `LOCAL Supabase`. `npm run web` doesn't.
- **Port:** 8082 is local, 8081 is dev.
- **Names:** local greets seed names (`Hi, Coach`, `Hi, John`, `Hi, Aiden Brooks`). Dev shows your real Google account name.
- **Console:** `Object.keys(localStorage)` shows `sb-127-auth-token` for local, and `sb-<project-ref>-auth-token` for a hosted project.

### 6. Go back to dev

Press **Ctrl+C** in the `web:local` terminal. Check that `.env.development.local` is gone (`ls .env.development.local` should say no such file), then run `npm run web` (or `npx expo start --web`) as usual. It reads `.env.development`, and the app is at http://localhost:8081.
