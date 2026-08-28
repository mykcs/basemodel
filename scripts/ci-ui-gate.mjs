import { spawnSync } from 'node:child_process';

const base = process.env.CI_BASE_SHA?.trim();
const head = process.env.CI_HEAD_SHA?.trim() || 'HEAD';

if (!base) {
  console.error('[ci-ui-gate] CI_BASE_SHA is required');
  process.exit(2);
}

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

console.log(`[ci-ui-gate] plan=${plan.mode} risk=${plan.risk}`);
console.log(`[ci-ui-gate] ${plan.reason}`);
if (!['skip', 'focused', 'full'].includes(plan.mode)) {
  console.error('[ci-ui-gate] invalid planner mode; fail closed');
  process.exit(1);
}

if (plan.mode === 'skip') {
  console.log('[ci-ui-gate] no browser-relevant changes; PASS');
  process.exit(0);
}

const browserEnv = {
  CI: '1',
  PLAYWRIGHT_REUSE_BUILD: '1',
  PLAYWRIGHT_WORKERS: process.env.PLAYWRIGHT_WORKERS ?? '1',
};

// The self-hosted runner owns its browser runtime. Keep provider-specific
// Amazon Linux dnf/ldd setup out of repository CI and reuse Playwright's
// persistent runner cache between jobs.
run('npx', ['playwright', 'install', 'chromium']);
run('node', ['scripts/ui-overflow-preflight.mjs'], browserEnv);

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
  run('npm', ['run', 'test:ui'], browserEnv);
}

const ciInfrastructureChanged = plan.changedFiles.some((file) => (
  file === 'scripts/ci-ui-gate.mjs'
  || file === 'scripts/vercel-ui-plan.ts'
  || file === '.github/workflows/self-hosted-ci.yml'
  || file.startsWith('.github/runner/')
));

const labRelevant = ciInfrastructureChanged || plan.changedFiles.some((file) => (
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

if (labRelevant) {
  console.log('[ci-ui-gate] Lab-relevant diff detected; running the 12-case Lab gate');
  run(
    'npx',
    ['playwright', 'test', '--config', 'tests/e2e/lab-playwright.config.ts'],
    browserEnv,
  );
} else {
  console.log('[ci-ui-gate] Lab gate skipped; diff cannot affect Lab/server UI');
}

console.log('[ci-ui-gate] PASS');
