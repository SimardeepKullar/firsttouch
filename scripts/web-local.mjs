// `npm run web:local`: the web app against local Supabase, on port 8082.
// For this run only it writes .env.development.local (which Expo loads ahead of
// .env.development), then deletes it when Expo exits, including on Ctrl+C.
// Never touches .env.development. Only ever writes local values.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { banner, buildEnvFile, isOurFile, LOCAL_PORT, parseStatus } from './localSupabase.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const envFile = `${root}.env.development.local`;

function fail(message) {
  console.error(`\nweb:local: ${message}\n`);
  process.exit(1);
}

// 1. Is local Supabase running? `status` prints JSON on stdout when it is.
const status = spawnSync('npx', ['supabase', 'status', '-o', 'json'], { cwd: root, encoding: 'utf8' });
const local = status.status === 0 ? parseStatus(status.stdout) : null;
if (!local) {
  fail('local Supabase is not running. Start it first with:  npx supabase start  (needs Docker running)');
}

// 2. Don't clobber a file we didn't make. A leftover of our own (after a crash) is fine to replace.
if (existsSync(envFile)) {
  if (!isOurFile(readFileSync(envFile, 'utf8'))) {
    fail(
      '.env.development.local already exists and was not made by this script, so it was left alone.\n' +
        'Delete or rename it, then run again. (npm run web:local creates and removes its own.)'
    );
  }
  rmSync(envFile);
}

// 3. Put the override in place, and make sure it's removed however we exit.
writeFileSync(envFile, buildEnvFile(local));
let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  rmSync(envFile, { force: true });
}
process.on('exit', cleanup);

// 4. Run Expo on its own port. (Metro's cache is keyed by the env values, so no --clear is needed.)
const child = spawn('npx', ['expo', 'start', '--web', '--port', String(LOCAL_PORT)], {
  cwd: root,
  stdio: 'inherit',
});
console.log(banner({ url: local.url, port: LOCAL_PORT }));

// Ctrl+C reaches Expo too (same terminal); for a plain `kill`, pass it on.
// We wait for Expo to exit, then clean up in the 'exit' handler above.
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => child.kill(signal));
}
child.on('exit', (code, signal) => {
  cleanup();
  process.exit(code ?? (signal ? 1 : 0));
});
