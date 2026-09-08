import { spawnSync } from 'node:child_process';
import { changedFilesForVercel } from './vercel-git-range.mjs';

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const resultsReleaseBranch = /^research\/results-(?:.+)$/;
const gateOwner = 'scripts/vercel-lab-browser-gate.mjs';

function isLabRelevant(file) {
  return /^src\/pages\/(?:en\/)?lab\.astro$/.test(file)
    || file.startsWith('src/layouts/')
    || file.startsWith('src/styles/')
    || file === 'src/components/research/InteractiveResearchExplainer.tsx'
    || file === 'src/components/research/explainer/ResearchExplainerPrimitives.tsx'
    || file === 'src/components/research/explainer/ServerExplainer.tsx'
    || file.startsWith('public/')
    || /^(?:astro|playwright)\.config\.[cm]?[jt]s$/.test(file)
    || file === 'vercel.json'
    || file === 'scripts/vercel-ui-gate.mjs'
    || file === 'scripts/vercel-ui-plan.ts'
    || file === 'scripts/vercel-git-range.mjs'
    || file === 'scripts/request-vercel-final-gate.mjs'
    || /^(?:package|package-lock)\.json$/.test(file)
    || file === gateOwner
    || /^tests\/e2e\/lab-/.test(file)
    || file === 'tests/e2e/lab-playwright.config.ts';
}

let changedFiles = [];
let rangeProven = false;
try {
  changedFiles = changedFilesForVercel();
  rangeProven = true;
} catch (error) {
  console.warn(`[vercel-lab-browser-gate] could not prove Vercel Git range; fail closed where this gate is release-eligible (${error})`);
}

const labRelevant = rangeProven && changedFiles.some(isLabRelevant);
const explicitBranch = branch === 'agent/sync-zju-shell-environment-20260816' || resultsReleaseBranch.test(branch);
const shouldRun = branch === 'main' || explicitBranch || labRelevant;

if (!shouldRun) {
  console.log(`[vercel-lab-browser-gate] skipped for branch: ${branch || 'unknown'}; no Lab-relevant diff`);
  process.exit(0);
}
if (branch === 'main' && rangeProven && !labRelevant) {
  console.log('[vercel-lab-browser-gate] skipped on main: proven diff cannot affect Lab/server UI');
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
