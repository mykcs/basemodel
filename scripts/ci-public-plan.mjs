import { appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const browserAllocationForMode = (mode, fullShardTotal = 4) => {
  if (!Number.isInteger(fullShardTotal) || fullShardTotal < 1 || fullShardTotal > 16) {
    throw new Error('fullShardTotal must be an integer in [1, 16]');
  }
  if (mode === 'skip') return { browserTotal: 0, shards: [] };
  if (mode === 'focused') return { browserTotal: 1, shards: [1] };
  if (mode === 'full') {
    return { browserTotal: fullShardTotal, shards: Array.from({ length: fullShardTotal }, (_, index) => index + 1) };
  }
  throw new Error(`unsupported UI mode: ${mode}`);
};

export const resolveFullShardTotal = (env = process.env) => {
  const raw = env.CI_FULL_BROWSER_SHARDS?.trim() || '4';
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 16) {
    throw new Error('CI_FULL_BROWSER_SHARDS must be an integer in [1, 16]');
  }
  return value;
};

export const planPublicBrowserAllocation = (env = process.env) => {
  const base = env.CI_BASE_SHA?.trim();
  const head = env.CI_HEAD_SHA?.trim() || 'HEAD';
  if (!base) throw new Error('CI_BASE_SHA is required');

  const planner = spawnSync(
    process.execPath,
    ['--experimental-strip-types', 'scripts/vercel-ui-plan.ts', '--json'],
    {
      encoding: 'utf8',
      env: {
        ...env,
        VERCEL_ENV: 'production',
        VERCEL_GIT_PREVIOUS_SHA: base,
        VERCEL_GIT_COMMIT_SHA: head,
      },
    },
  );
  if (planner.error || planner.status !== 0) {
    if (planner.stdout) process.stdout.write(planner.stdout);
    if (planner.stderr) process.stderr.write(planner.stderr);
    throw planner.error ?? new Error(`UI planner exited ${planner.status}`);
  }

  let plan;
  try {
    plan = JSON.parse(planner.stdout);
  } catch (error) {
    throw new Error(`UI planner returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!['skip', 'focused', 'full'].includes(plan.mode)) {
    throw new Error(`UI planner returned unsupported mode: ${String(plan.mode)}`);
  }

  const allocation = browserAllocationForMode(plan.mode, resolveFullShardTotal(env));
  return {
    mode: plan.mode,
    risk: plan.risk,
    reason: plan.reason,
    ...allocation,
  };
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    const plan = planPublicBrowserAllocation(process.env);
    console.log(`[ci-public-plan] mode=${plan.mode} risk=${plan.risk} browser_total=${plan.browserTotal}`);
    console.log(`[ci-public-plan] ${plan.reason}`);
    const payload = {
      mode: plan.mode,
      risk: plan.risk,
      browser_total: plan.browserTotal,
      shards: plan.shards,
    };
    console.log(JSON.stringify(payload));
    if (process.argv.includes('--github-output')) {
      const output = process.env.GITHUB_OUTPUT;
      if (!output) throw new Error('GITHUB_OUTPUT is required with --github-output');
      appendFileSync(output, `mode=${plan.mode}\n`);
      appendFileSync(output, `browser_total=${plan.browserTotal}\n`);
      appendFileSync(output, `shards_json=${JSON.stringify(plan.shards)}\n`);
    }
  } catch (error) {
    console.error('[ci-public-plan]', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
