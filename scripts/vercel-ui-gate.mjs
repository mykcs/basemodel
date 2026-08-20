import { spawnSync } from 'node:child_process';

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const shouldRun = branch.startsWith('agent/visual-closeout-')
  || branch.startsWith('agent/semantic-release-visual-closeout-')
  || branch.startsWith('agent/css-')
  || branch.startsWith('agent/ui-')
  || branch.startsWith('agent/layout-')
  || branch.startsWith('agent/theme-')
  || branch.startsWith('agent/responsive-')
  || branch.startsWith('agent/nav-')
  || branch.startsWith('agent/navigation-');

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

const capture = (command, args) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    env: process.env,
  });
  if (result.error || result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    console.error(`[vercel-ui-gate] ${command} preflight failed`, result.error ?? '');
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
};

console.log(`[vercel-ui-gate] running exact-preview Chromium acceptance for ${branch}`);

// Vercel's build image is Amazon Linux 2023. Playwright's Linux dependency
// installer assumes Ubuntu/apt, so install the equivalent AL2023 Chromium
// runtime libraries explicitly with Vercel's supported dnf package manager.
//
// This hosted gate is intentionally Chromium-only. Playwright WebKit fallback
// binaries target supported Ubuntu/Debian environments and must not be forced
// into the AL2023 build image with ad-hoc ABI shims. When cross-browser
// acceptance is required, run `npm run test:ui:all` on a Playwright-supported
// runner instead of weakening or destabilizing the Vercel Preview gate.
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
const browser = capture('bash', [
  '-lc',
  'find /vercel/.cache/ms-playwright -type f -name chrome-headless-shell | head -n 1',
]);
if (!browser) {
  console.error('[vercel-ui-gate] Playwright headless-shell binary not found');
  process.exit(1);
}
console.log(`[vercel-ui-gate] ldd preflight: ${browser}`);
const ldd = spawnSync('ldd', [browser], { encoding: 'utf8', env: process.env });
const lddOutput = `${ldd.stdout ?? ''}${ldd.stderr ?? ''}`;
process.stdout.write(lddOutput);
if (ldd.error || ldd.status !== 0 || lddOutput.includes('not found')) {
  console.error('[vercel-ui-gate] unresolved browser runtime libraries');
  process.exit(ldd.status ?? 1);
}

// A fast real-browser document-width preflight prints concrete offending
// elements before the larger route matrix runs. It is a guard, not a bypass:
// any remaining horizontal overflow fails the deployment.
run('node', ['scripts/ui-overflow-preflight.mjs'], { CI: '1' });

run('npm', ['run', 'test:ui'], {
  CI: '1',
  PLAYWRIGHT_REUSE_BUILD: '1',
});

console.log('[vercel-ui-gate] PASS');
