import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
const primaryShard = shardIndex === 1;
const ownsBuild = process.env.CI_BROWSER_BUILD === '1';
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
  'npx',
  ['tsx', 'scripts/vercel-ui-plan.ts', '--json'],
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

if (forceFull) {
  plan = {
    ...plan,
    mode: 'full',
    risk: 'global',
    reason: 'Explicit fallback canary requests the complete browser acceptance matrix.',
  };
  console.log('[ci-ui-gate] force-full fallback canary enabled');
}

if (plan.mode === 'skip') {
  console.log('[ci-ui-gate] no browser-relevant changes; PASS');
  process.exit(0);
}

if (plan.mode === 'focused' && !primaryShard) {
  console.log('[ci-ui-gate] focused browser coverage is owned by shard 1; PASS');
  process.exit(0);
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
run('npx', installArgs);

if (primaryShard) {
  run('node', ['scripts/ui-overflow-preflight.mjs'], browserEnv);
} else {
  console.log('[ci-ui-gate] overflow preflight is owned by shard 1');
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
  const fullArgs = ['run', 'test:ui'];
  if (shardTotal > 1) {
    fullArgs.push('--', `--shard=${shardIndex}/${shardTotal}`);
  }
  run('npm', fullArgs, browserEnv);
}

const ciInfrastructureChanged = plan.changedFiles.some((file) => (
  file === 'scripts/ci-ui-gate.mjs'
  || file === 'scripts/vercel-ui-plan.ts'
  || file === '.github/workflows/self-hosted-ci.yml'
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

if (labRelevant && primaryShard) {
  console.log('[ci-ui-gate] Lab-relevant diff detected; running the 12-case Lab gate on shard 1');
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
