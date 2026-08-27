import { spawnSync } from 'node:child_process';

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const productionBranch = branch === 'main';
const fullUiBranch = /^(?:agent\/(?:visual-closeout|css|ui|layout|theme|responsive|nav|navigation)-|agent\/semantic-release-(?:visual-closeout|css|ui|layout|theme|responsive|nav|navigation)-)/;
const focusedFixBranch = /^fix\/.*(?:visual|css|ui|layout|theme|responsive|nav|navigation)/;
const resultsOverflowValidationBranch = /^(?:fix|research)\/results-mobile-overflow(?:-|$)/;
const resultsReleaseBranch = /^research\/results-(?:integrated|release)(?:-|$)/;
const fairComparisonExplainerBranch = /^research\/eli5-fair-comparison(?:-|$)/;
const shouldRun = productionBranch
  || fullUiBranch.test(branch)
  || focusedFixBranch.test(branch)
  || resultsOverflowValidationBranch.test(branch)
  || resultsReleaseBranch.test(branch)
  || fairComparisonExplainerBranch.test(branch);

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

const focusedOnly = focusedFixBranch.test(branch) && !fullUiBranch.test(branch) && !productionBranch;
const resultsOverflowOnly = resultsOverflowValidationBranch.test(branch) && !fullUiBranch.test(branch) && !productionBranch;
const fairComparisonExplainerOnly = fairComparisonExplainerBranch.test(branch) && !fullUiBranch.test(branch) && !productionBranch;
console.log(
  focusedOnly || resultsOverflowOnly || fairComparisonExplainerOnly
    ? `[vercel-ui-gate] running focused exact-preview Chromium acceptance for ${branch}`
    : `[vercel-ui-gate] running exact-preview Chromium acceptance for ${branch}`,
);

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

if (resultsOverflowOnly) {
  run('npx', [
    'playwright', 'test', 'tests/e2e/results-mobile-overflow.spec.ts',
    '--project=chromium', '--max-failures=1',
  ], {
    CI: '1',
    PLAYWRIGHT_REUSE_BUILD: '1',
  });
} else if (fairComparisonExplainerOnly) {
  // This branch changes a bilingual research explanation, responsive layout,
  // motion, details disclosure, and checkpoint timeline. Exercise that exact
  // surface instead of skipping browser acceptance or paying for the unrelated
  // full-site matrix.
  run('npx', [
    'playwright', 'test', 'tests/e2e/fair-comparison-eli5.spec.ts',
    '--project=chromium', '--max-failures=1',
  ], {
    CI: '1',
    PLAYWRIGHT_REUSE_BUILD: '1',
  });
} else if (focusedOnly) {
  // Fix branches need an exact regression for the bug class they are changing.
  // Keep this focused so an unrelated stale explainer-ownership assertion cannot
  // hide the result of the theme regression itself. The same WebShop test is also
  // part of `test:ui`, so full UI branches continue to run it in the broad matrix.
  run('npx', [
    'playwright', 'test', 'tests/e2e/webshop-training-theme.spec.ts',
    '--project=chromium', '--max-failures=1',
  ], {
    CI: '1',
    PLAYWRIGHT_REUSE_BUILD: '1',
  });
} else {
  run('npm', ['run', 'test:ui'], {
    CI: '1',
    PLAYWRIGHT_REUSE_BUILD: '1',
  });
}

console.log('[vercel-ui-gate] PASS');
