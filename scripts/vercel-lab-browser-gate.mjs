import { spawnSync } from 'node:child_process';

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const resultsReleaseBranch = /^research\/results-(?:integrated|release)(?:-|$)/;
const shouldRun = branch === 'main'
  || branch === 'agent/sync-zju-shell-environment-20260816'
  || resultsReleaseBranch.test(branch);

if (!shouldRun) {
  console.log(`[vercel-lab-browser-gate] skipped for branch: ${branch || 'unknown'}`);
  process.exit(0);
}

// Keep the browser inside node_modules so Vercel's restored build cache can
// reuse it across deployments. PLAYWRIGHT_BROWSERS_PATH=0 is Playwright's
// hermetic/local-browser mode; it also keeps this gate independent of $HOME.
process.env.PLAYWRIGHT_BROWSERS_PATH = '0';

const run = (command, args, extraEnv = {}) => {
  console.log(`[vercel-lab-browser-gate] ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  if (result.error) {
    console.error(`[vercel-lab-browser-gate] failed to start ${command}:`, result.error);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
};

const capture = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', env: process.env });
  if (result.error || result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    console.error(`[vercel-lab-browser-gate] ${command} preflight failed`, result.error ?? '');
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
};

console.log(`[vercel-lab-browser-gate] running focused Chromium acceptance for ${branch}`);

// Vercel builds run on Amazon Linux 2023. Install only the Chromium runtime
// libraries already proven sufficient by the repository's prior real-browser gate.
run('dnf', [
  'install', '-y', '--setopt=install_weak_deps=False',
  'nspr', 'nss',
  'mesa-libgbm', 'mesa-libEGL', 'libdrm',
  'libxkbcommon',
  'libX11', 'libX11-xcb', 'libxcb',
  'libXdamage', 'libXext', 'libXfixes', 'libXrandr', 'libxshmfence',
  'dbus-libs', 'cairo',
]);

// Headless CI uses Chromium's headless shell; do not download the additional
// full Chrome-for-Testing binary. If the hermetic shell came back with the
// Vercel build cache this command is a fast no-op.
run('npx', ['playwright', 'install', '--only-shell', 'chromium']);

const browser = capture('bash', [
  '-lc',
  'find node_modules/playwright-core/.local-browsers -type f -name chrome-headless-shell | head -n 1',
]);
if (!browser) {
  console.error('[vercel-lab-browser-gate] Playwright headless-shell binary not found');
  process.exit(1);
}

console.log(`[vercel-lab-browser-gate] ldd preflight: ${browser}`);
const ldd = spawnSync('ldd', [browser], { encoding: 'utf8', env: process.env });
const lddOutput = `${ldd.stdout ?? ''}${ldd.stderr ?? ''}`;
process.stdout.write(lddOutput);
if (ldd.error || ldd.status !== 0 || lddOutput.includes('not found')) {
  console.error('[vercel-lab-browser-gate] unresolved browser runtime libraries');
  process.exit(ldd.status ?? 1);
}

run('npx', ['playwright', 'test', '--config', 'tests/e2e/lab-playwright.config.ts'], { CI: '1' });
console.log('[vercel-lab-browser-gate] PASS');
