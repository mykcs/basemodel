import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const extrasMode = process.argv[2] === 'extras';
if (process.argv.length > (extrasMode ? 3 : 2)) {
  console.error('Usage: node scripts/ci-ui-gate.mjs [extras]');
  process.exit(2);
}
if (extrasMode) {
  rmSync(join(process.env.CI_BROWSER_EXTRAS_DIR || 'ci-browser-extras', 'public-extras-proof.json'), { force: true });
}

const base = process.env.CI_BASE_SHA?.trim();
const head = process.env.CI_HEAD_SHA?.trim() || 'HEAD';

if (!base) {
  console.error('[ci-ui-gate] CI_BASE_SHA is required');
  process.exit(2);
}

const parsePositiveInteger = (name, fallback) => {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    console.error(`[ci-ui-gate] ${name} must be a positive integer`);
    process.exit(2);
  }
  return parsed;
};

const shardIndex = parsePositiveInteger('CI_BROWSER_SHARD_INDEX', 1);
const shardTotal = parsePositiveInteger('CI_BROWSER_SHARD_TOTAL', 1);
if (shardIndex > shardTotal) {
  console.error('[ci-ui-gate] CI_BROWSER_SHARD_INDEX cannot exceed CI_BROWSER_SHARD_TOTAL');
  process.exit(2);
}
if (extrasMode && (shardIndex !== 1 || shardTotal !== 1)) {
  console.error('[ci-ui-gate] extras is one unsharded seven-case owner');
  process.exit(2);
}
const primaryShard = shardIndex === 1;
const ownsBuild = process.env.CI_BROWSER_BUILD === '1';
const ownsInstall = process.env.CI_BROWSER_INSTALL === '1';
const installWithDeps = process.env.CI_PLAYWRIGHT_WITH_DEPS === '1';
const forceFull = process.env.CI_UI_FORCE_FULL === '1';

const run = (command, args, extraEnv = {}) => {
  console.log(`[ci-ui-gate] ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  if (result.error) {
    console.error(`[ci-ui-gate] failed to start ${command}:`, result.error);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
};

const planner = spawnSync(
  process.execPath,
  ['--experimental-strip-types', 'scripts/vercel-ui-plan.ts', '--json'],
  {
    encoding: 'utf8',
    env: {
      ...process.env,
      VERCEL_ENV: 'production',
      VERCEL_GIT_PREVIOUS_SHA: base,
      VERCEL_GIT_COMMIT_SHA: head,
    },
  },
);

if (planner.error || planner.status !== 0) {
  if (planner.stdout) process.stdout.write(planner.stdout);
  if (planner.stderr) process.stderr.write(planner.stderr);
  console.error('[ci-ui-gate] planner failed; fail closed');
  process.exit(planner.status ?? 1);
}

let plan;
try {
  plan = JSON.parse(planner.stdout);
} catch (error) {
  console.error('[ci-ui-gate] planner returned invalid JSON', error);
  process.exit(1);
}

console.log(`[ci-ui-gate] plan=${plan.mode} risk=${plan.risk} shard=${shardIndex}/${shardTotal}`);
console.log(`[ci-ui-gate] ${plan.reason}`);
if (!['skip', 'focused', 'full'].includes(plan.mode)) {
  console.error('[ci-ui-gate] invalid planner mode; fail closed');
  process.exit(1);
}

const expectedMode = process.env.CI_EXPECTED_UI_MODE?.trim();
if (expectedMode && plan.mode !== expectedMode) {
  console.error(`[ci-ui-gate] planner drift: allocation expected ${expectedMode}, re-evaluation returned ${plan.mode}`);
  process.exit(1);
}

if (forceFull) {
  plan = {
    ...plan,
    mode: 'full',
    risk: 'global',
    reason: 'Explicit fallback canary requests the complete browser acceptance matrix.',
  };
  console.log('[ci-ui-gate] force-full fallback canary enabled');
}

if (extrasMode && plan.mode === 'focused') {
  console.error('[ci-ui-gate] extras requires full applicability');
  process.exit(1);
}

if (plan.mode === 'skip') {
  console.log('[ci-ui-gate] no browser-relevant changes; PASS');
  process.exit(0);
}

if (plan.mode === 'focused' && !primaryShard) {
  console.log('[ci-ui-gate] focused browser coverage is owned by shard 1; PASS');
  process.exit(0);
}

// Use the same dependency-free planner before spending npm/browser work.
// Only the shards that actually own acceptance need a dependency install.
if (ownsInstall) {
  run('npm', ['ci']);
}

if (ownsBuild) {
  run('npm', ['run', 'build']);
}

const transformCacheDir = join(tmpdir(), `basemodel-playwright-transform-${head.replace(/[^A-Za-z0-9._-]/g, '_')}-${shardIndex}of${shardTotal}`);
rmSync(transformCacheDir, { recursive: true, force: true });
console.log(`[ci-ui-gate] fresh Playwright transform cache: ${transformCacheDir}`);

const browserEnv = {
  CI: '1',
  PLAYWRIGHT_REUSE_BUILD: '1',
  PLAYWRIGHT_WORKERS: process.env.PLAYWRIGHT_WORKERS ?? '1',
  PWTEST_CACHE_DIR: transformCacheDir,
};

const installArgs = ['playwright', 'install'];
if (installWithDeps) installArgs.push('--with-deps');
installArgs.push('chromium');
if (extrasMode && process.env.CI_UNIFIED_PREFLIGHT === '1') {
  console.log('[ci-ui-gate] unified extras uses the pinned browser image');
} else {
  run('npx', installArgs);
}

const ciInfrastructureChanged = plan.changedFiles.some((file) => (
  file === 'scripts/ci-ui-gate.mjs'
  || file === 'scripts/ci-build-artifact.mjs'
  || file === 'scripts/ci-public-plan.mjs'
  || file === 'scripts/ci-ui-test-list.mjs'
  || file === 'scripts/ci-ui-test-timings-202609061200.json'
  || file === 'scripts/ci-ui-test-timings-202609152256.json'
  || file === 'scripts/vercel-ui-plan.ts'
  || file === '.github/workflows/self-hosted-ci.yml'
  || file === '.github/workflows/public-pr-ci.yml'
  || file === '.github/workflows/review-preview.yml'
  || file === '.circleci/config.yml'
  || file === 'scripts/ci-circleci-prepare.sh'
  || file.startsWith('.github/runner/')
));

const labRelevant = forceFull || ciInfrastructureChanged || plan.changedFiles.some((file) => (
  /^src\/pages\/(?:en\/)?lab\.astro$/.test(file)
  || file.startsWith('src/layouts/')
  || file.startsWith('src/styles/')
  || file === 'src/components/research/InteractiveResearchExplainer.tsx'
  || file === 'src/components/research/explainer/ResearchExplainerPrimitives.tsx'
  || file === 'src/components/research/explainer/ServerExplainer.tsx'
  || file.startsWith('public/')
  || /^(?:astro|playwright)\.config\.[cm]?[jt]s$/.test(file)
  || /^(?:package|package-lock)\.json$/.test(file)
  || file === 'scripts/vercel-lab-browser-gate.mjs'
  || /^tests\/e2e\/lab-/.test(file)
  || file === 'tests/e2e/lab-playwright.config.ts'
));

if (primaryShard && process.env.CI_UNIFIED_PREFLIGHT !== '1') {
  run('node', ['scripts/ui-overflow-preflight.mjs'], browserEnv);
} else if (process.env.CI_UNIFIED_PREFLIGHT === '1') {
  console.log('[ci-ui-gate] overflow preflight belongs to the exact-source unified producer');
} else {
  console.log('[ci-ui-gate] overflow preflight is owned by shard 1');
}

if (extrasMode) {
  if (plan.mode !== 'full') {
    console.error('[ci-ui-gate] extras requires full applicability');
    process.exit(1);
  }
  const { canonicalJsonTests, requireExactCases } = await import('./ci-ui-test-list.mjs');
  const directory = process.env.CI_BROWSER_EXTRAS_DIR || 'ci-browser-extras';
  mkdirSync(directory, { recursive: true });
  const proofPath = join(directory, 'public-extras-proof.json');
  const suites = [
    { name: 'core', file: 'core-research-visual-signatures.capture.spec.ts', count: 1,
      args: ['tests/e2e/core-research-visual-signatures.capture.spec.ts', '--output=test-results/public-core'] },
    { name: 'lab', file: 'lab-server-visual-qa.spec.ts', count: 6,
      args: ['--config', 'tests/e2e/lab-playwright.config.ts'] },
  ];
  const accepted = [];
  try {
    for (const suite of suites) {
      const canonicalPath = join(directory, suite.name + '-canonical.json');
      const reportPath = join(directory, suite.name + '-executed.json');
      const common = ['playwright', 'test', ...suite.args, '--project=chromium', '--workers=1', '--retries=0', '--max-failures=1'];
      const invoke = (extra, path) => {
        // Never qualify from a report left by an earlier invocation.
        writeFileSync(path, '{}\n');
        run('npx', [...common, ...extra], { ...browserEnv, PLAYWRIGHT_JSON_OUTPUT_FILE: resolve(path) });
        return canonicalJsonTests(JSON.parse(readFileSync(path, 'utf8')), { browser: 'chromium', executed: !extra.includes('--list') });
      };
      const expected = invoke(['--list', '--reporter=json'], canonicalPath);
      if (expected.length !== suite.count || expected.some(item => item.specFile !== suite.file)) throw new Error(`Unexpected ${suite.name} population: require ${suite.count} cases from ${suite.file}`);
      if (suite.name === 'core' && expected[0].title !== 'capture accepted core research screenshot signatures') throw new Error('Unexpected core signature identity');
      const actual = invoke(['--reporter=list,json'], reportPath);
      requireExactCases(expected, actual);
      accepted.push({ name: suite.name, cases: actual.length, canonical: canonicalPath, report: reportPath, identities: actual.map(item => item.id) });
    }
    writeFileSync(proofPath, JSON.stringify({
      schemaVersion: 1, head, base,
      run: process.env.GITHUB_RUN_ID ?? null, attempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
      producerAttempt: process.env.CI_BUILD_RUN_ATTEMPT ?? null,
      browser: 'chromium', cases: accepted.reduce((sum, suite) => sum + suite.cases, 0), suites: accepted,
    }, null, 2) + '\n');
  } catch (error) {
    console.error('[ci-ui-gate] extras FAIL:', error.message);
    process.exit(1);
  }
  console.log('[ci-ui-gate] Public-only extras: 1 core capture + 6 Lab cases PASS');
  process.exit(0);
}

if (plan.mode === 'focused') {
  const specs = [...plan.specs];
  if (plan.routes.length > 0) {
    specs.push('tests/e2e/vercel-changed-route-smoke.spec.ts');
  }
  if (specs.length === 0) {
    console.error('[ci-ui-gate] focused plan has no browser targets; fail closed');
    process.exit(1);
  }

  run(
    'npx',
    ['playwright', 'test', ...specs, '--project=chromium', '--max-failures=1'],
    {
      ...browserEnv,
      VERCEL_CHANGED_ROUTES: plan.routes.join(','),
    },
  );
} else {
  // Keep every importing spec. The timed runner proves its exact full-title
  // selection against this unfiltered population before starting a browser.
  mkdirSync('ci-browser-inventory', { recursive: true });
  const canonical = `ci-browser-inventory/canonical-${shardIndex}.json`;
  const report = `ci-browser-inventory/executed-${shardIndex}.json`;
  run('npm', ['run', 'test:ui', '--', '--list', '--reporter=json'], {
    ...browserEnv, PLAYWRIGHT_JSON_OUTPUT_FILE: canonical,
  });
  run('node', ['scripts/ci-ui-test-list.mjs', 'timed', 'test:ui', 'chromium',
    String(shardIndex), String(shardTotal), canonical,
    'scripts/ci-ui-test-timings-20261029-public.json', report], browserEnv);
}

if (labRelevant && primaryShard) {
  console.log('[ci-ui-gate] Lab-relevant diff detected; running the 6-case active-Lab gate on shard 1');
  run(
    'npx',
    ['playwright', 'test', '--config', 'tests/e2e/lab-playwright.config.ts'],
    browserEnv,
  );
} else if (labRelevant) {
  console.log('[ci-ui-gate] Lab gate is owned by shard 1');
} else {
  console.log('[ci-ui-gate] Lab gate skipped; diff cannot affect Lab/server UI');
}

console.log('[ci-ui-gate] PASS');
