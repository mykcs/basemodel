import { spawnSync } from 'node:child_process';
import { availableParallelism } from 'node:os';

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

// Put Playwright's browser inside node_modules so Vercel's restored build cache
// can retain it between deployments. This also makes the browser path explicit
// instead of depending on the ephemeral /vercel/.cache home directory.
process.env.PLAYWRIGHT_BROWSERS_PATH = '0';

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

const fullFallbackPlan = (reason) => ({
  mode: 'full',
  risk: 'global',
  changedFiles: [],
  routes: [],
  specs: [],
  reason,
});

const productionPlan = (() => {
  if (!productionBranch) return undefined;

  const result = spawnSync('npx', ['tsx', 'scripts/vercel-ui-plan.ts', '--json'], {
    encoding: 'utf8',
    env: process.env,
  });
  if (result.error || result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    return fullFallbackPlan('The Production UI planner could not run; fail closed to the complete hosted matrix.');
  }

  try {
    const plan = JSON.parse(result.stdout);
    if (
      !['skip', 'focused', 'full'].includes(plan.mode)
      || !Array.isArray(plan.changedFiles)
      || !Array.isArray(plan.routes)
      || !Array.isArray(plan.specs)
    ) {
      return fullFallbackPlan('The Production UI planner returned an invalid shape; fail closed to the complete hosted matrix.');
    }
    return plan;
  } catch (error) {
    return fullFallbackPlan(`The Production UI planner returned invalid JSON (${error}); fail closed to the complete hosted matrix.`);
  }
})();

if (productionPlan) {
  console.log(`[vercel-ui-gate] Production plan: ${productionPlan.mode} (${productionPlan.risk})`);
  console.log(`[vercel-ui-gate] ${productionPlan.reason}`);
  if (productionPlan.changedFiles.length > 0) {
    console.log('[vercel-ui-gate] Production changed files:');
    for (const file of productionPlan.changedFiles) console.log(`- ${file}`);
  }

  if (productionPlan.mode === 'skip') {
    console.log('[vercel-ui-gate] browser layer skipped; verify:deploy and the static production build already passed');
    process.exit(0);
  }
}

const focusedOnly = focusedFixBranch.test(branch) && !fullUiBranch.test(branch) && !productionBranch;
const resultsOverflowOnly = resultsOverflowValidationBranch.test(branch) && !fullUiBranch.test(branch) && !productionBranch;
const fairComparisonExplainerOnly = fairComparisonExplainerBranch.test(branch) && !fullUiBranch.test(branch) && !productionBranch;
const productionFocused = productionPlan?.mode === 'focused';
console.log(
  focusedOnly || resultsOverflowOnly || fairComparisonExplainerOnly || productionFocused
    ? `[vercel-ui-gate] running focused exact-${productionBranch ? 'Production' : 'Preview'} Chromium acceptance for ${branch}`
    : `[vercel-ui-gate] running exact-${productionBranch ? 'Production' : 'Preview'} Chromium acceptance for ${branch}`,
);

const visibleCpus = availableParallelism();
// Provider evidence on the ordinary 8-core Pro Preview builder showed 4 workers
// is the throughput sweet spot for this browser-heavy suite: 4 workers completed
// the 91-test matrix in ~1.6m, while 6 and 8 workers slowed it to ~2.3m because
// individual browser cases became CPU-contention bound. Keep the half-CPU rule
// and cap at 4; a 2-core Hobby runner therefore remains serial.
const automaticWorkers = Math.max(1, Math.min(4, Math.floor(visibleCpus / 2)));
const hostedPlaywrightEnv = {
  CI: '1',
  PLAYWRIGHT_REUSE_BUILD: '1',
  PLAYWRIGHT_WORKERS: process.env.PLAYWRIGHT_WORKERS ?? String(automaticWorkers),
};
console.log(`[vercel-ui-gate] Playwright workers: ${hostedPlaywrightEnv.PLAYWRIGHT_WORKERS} (${visibleCpus} CPUs visible)`);

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

// Headless CI only needs Chromium's headless shell. Hermetic install mode puts
// it under node_modules, which Vercel restores with the build cache. On a warm
// cache this becomes a no-op; on a cold cache it avoids the extra full browser.
run('npx', ['playwright', 'install', '--only-shell', 'chromium']);

// Fail before Playwright starts if the downloaded browser still has any
// unresolved shared-library dependency. This keeps environment failures
// distinct from actual geometry/rendering regressions.
const browser = capture('bash', [
  '-lc',
  'find node_modules/playwright-core/.local-browsers -type f -name chrome-headless-shell | head -n 1',
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

if (productionFocused) {
  const specs = [...productionPlan.specs];
  if (productionPlan.routes.length > 0) specs.push('tests/e2e/vercel-changed-route-smoke.spec.ts');

  if (specs.length === 0) {
    console.error('[vercel-ui-gate] focused Production plan had no browser targets; fail closed');
    process.exit(1);
  }

  run('npx', [
    'playwright', 'test', ...specs,
    '--project=chromium', '--max-failures=1',
  ], {
    ...hostedPlaywrightEnv,
    VERCEL_CHANGED_ROUTES: productionPlan.routes.join(','),
  });
} else if (resultsOverflowOnly) {
  run('npx', [
    'playwright', 'test', 'tests/e2e/results-mobile-overflow.spec.ts',
    '--project=chromium', '--max-failures=1',
  ], hostedPlaywrightEnv);
} else if (fairComparisonExplainerOnly) {
  // This branch changes a bilingual research explanation, responsive layout,
  // motion, details disclosure, and checkpoint timeline. Exercise that exact
  // surface instead of skipping browser acceptance or paying for the unrelated
  // full-site matrix.
  run('npx', [
    'playwright', 'test', 'tests/e2e/fair-comparison-eli5.spec.ts',
    '--project=chromium', '--max-failures=1',
  ], hostedPlaywrightEnv);
} else if (focusedOnly) {
  // Fix branches need an exact regression for the bug class they are changing.
  // Keep this focused so an unrelated stale explainer-ownership assertion cannot
  // hide the result of the theme regression itself. The same WebShop test is also
  // part of `test:ui`, so full UI branches continue to run it in the broad matrix.
  run('npx', [
    'playwright', 'test', 'tests/e2e/webshop-training-theme.spec.ts',
    '--project=chromium', '--max-failures=1',
  ], hostedPlaywrightEnv);
} else {
  run('npm', ['run', 'test:ui'], hostedPlaywrightEnv);
}

console.log('[vercel-ui-gate] PASS');
