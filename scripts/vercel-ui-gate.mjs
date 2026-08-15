import { spawnSync } from 'node:child_process';

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const shouldRun = branch.startsWith('agent/visual-closeout-');

if (!shouldRun) {
  console.log(`[vercel-ui-gate] skipped for branch: ${branch || 'unknown'}`);
  process.exit(0);
}

const run = (command, args, extraEnv = {}) => {
  console.log(`[vercel-ui-gate] ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });

  if (result.error) {
    console.error(`[vercel-ui-gate] failed to start ${command}:`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

console.log(`[vercel-ui-gate] running exact-preview Chromium acceptance for ${branch}`);

// Vercel's build image is Amazon Linux 2023. Playwright's Linux dependency
// installer assumes Ubuntu/apt, so install the equivalent AL2023 runtime
// libraries explicitly with Vercel's supported dnf package manager.
run('dnf', [
  'install', '-y', '--setopt=install_weak_deps=False',
  'nspr', 'nss',
  'mesa-libgbm', 'mesa-libEGL', 'libdrm',
  'libxkbcommon',
  'libX11', 'libX11-xcb', 'libxcb',
  'libXdamage', 'libXext', 'libXfixes', 'libXrandr', 'libxshmfence',
  'dbus-libs', 'cairo',
]);

run('npx', ['playwright', 'install', 'chromium']);

// Fail before Playwright starts if the downloaded browser still has any
// unresolved shared-library dependency. This keeps environment failures
// distinct from actual geometry/rendering regressions.
run('bash', ['-lc', [
  'set -euo pipefail',
  'browser="$(find /vercel/.cache/ms-playwright -type f -name chrome-headless-shell | head -n 1)"',
  'test -n "$browser"',
  'echo "[vercel-ui-gate] ldd preflight: $browser"',
  'ldd "$browser" | tee /tmp/playwright-ldd.txt',
  'if grep -q "not found" /tmp/playwright-ldd.txt; then',
  '  echo "[vercel-ui-gate] unresolved browser runtime libraries" >&2',
  '  exit 1',
  'fi',
].join('; ')]);

run('npm', ['run', 'test:ui'], {
  CI: '1',
  PLAYWRIGHT_REUSE_BUILD: '1',
});
console.log('[vercel-ui-gate] PASS');
