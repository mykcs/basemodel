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
// Vercel's build image does not expose apt-get. Download the Playwright-pinned
// browser only; the subsequent launch is the real compatibility check.
run('npx', ['playwright', 'install', 'chromium']);
run('npm', ['run', 'test:ui'], {
  CI: '1',
  PLAYWRIGHT_REUSE_BUILD: '1',
});
console.log('[vercel-ui-gate] PASS');
