import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const PROJECT_NAME = 'basemodel';
const PRODUCTION_BRANCH = 'main';
const BUILD_DIR = 'dist';
const PROTECTED_PREVIEW_NAMES = new Set(['main', 'master', 'production', 'prod']);

const fail = (message) => {
  console.error(`\nDirect Upload Preview aborted: ${message}`);
  process.exit(1);
};

const run = (command, args, { env = process.env, capture = false } = {}) => {
  const result = spawnSync(command, args, {
    env,
    encoding: capture ? 'utf8' : undefined,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (capture) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    fail(`${command} exited with status ${result.status ?? 'unknown'}`);
  }

  return result;
};

const git = (args) => {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    fail(`git ${args.join(' ')} failed`);
  }
  return result.stdout.trim();
};

export const sanitizePreviewLabel = (value) => {
  const normalized = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 18);
  return normalized || 'change';
};

export const makePreviewBranch = ({ label, sha, now = new Date() }) => {
  const timestamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const shortSha = String(sha).slice(0, 7).toLowerCase();
  return `agent-preview-${sanitizePreviewLabel(label)}-${shortSha}-${timestamp}`;
};

export const isProtectedPreviewBranch = (branch) => {
  const normalized = String(branch ?? '').trim().toLowerCase();
  return PROTECTED_PREVIEW_NAMES.has(normalized) || normalized === PRODUCTION_BRANCH;
};

const assertPreviewNoindex = () => {
  const indexPath = resolve(BUILD_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    fail(`${indexPath} does not exist after the production build`);
  }

  const html = readFileSync(indexPath, 'utf8');
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const hasRobotsNoindex = metaTags.some(
    (tag) => /name=["']robots["']/i.test(tag) && /noindex/i.test(tag),
  );

  if (!hasRobotsNoindex) {
    fail('built Preview is missing a robots noindex meta tag');
  }
};

const localWranglerMajor = (wranglerPath) => {
  const version = spawnSync(wranglerPath, ['--version'], { encoding: 'utf8' });
  if (version.error || version.status !== 0) return null;
  const match = `${version.stdout ?? ''} ${version.stderr ?? ''}`.match(/\b(\d+)\./);
  return match ? Number(match[1]) : null;
};

const resolveWrangler = () => {
  const local = resolve(
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler',
  );

  if (existsSync(local) && (localWranglerMajor(local) ?? 0) >= 4) {
    return { command: local, prefixArgs: [] };
  }

  return {
    command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    prefixArgs: ['--yes', 'wrangler@4'],
  };
};

const extractPagesUrls = (text) => {
  const matches = String(text).match(/https:\/\/[a-z0-9.-]+\.pages\.dev(?:\/[^\s]*)?/gi) ?? [];
  return [...new Set(matches.map((url) => url.replace(/[),.;]+$/, '')))];
};

const verifyPublicUrl = async (url) => {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) {
        console.log(`Public verification: HTTP ${response.status} ${url}`);
        return;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 5) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 2_000));
    }
  }
  fail(`deployment completed but public verification failed for ${url}: ${lastError?.message ?? 'unknown error'}`);
};

const main = async () => {
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    fail('CLOUDFLARE_API_TOKEN is not set. Use a secret manager or shell environment; never commit the token.');
  }
  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
    fail('CLOUDFLARE_ACCOUNT_ID is not set.');
  }

  const sha = git(['rev-parse', 'HEAD']);
  const sourceBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const commitMessage = git(['log', '-1', '--pretty=%s']);
  const dirty = git(['status', '--porcelain']);
  const allowDirty = process.env.DIRECT_UPLOAD_ALLOW_DIRTY === '1';

  if (dirty && !allowDirty) {
    fail('working tree is dirty. Commit the Preview state first so the uploaded assets match --commit-hash. Set DIRECT_UPLOAD_ALLOW_DIRTY=1 only for an explicitly disposable Preview.');
  }

  const label = process.env.PREVIEW_LABEL || sourceBranch;
  const previewBranch = makePreviewBranch({ label, sha });
  if (isProtectedPreviewBranch(previewBranch) || !previewBranch.startsWith('agent-preview-')) {
    fail(`refusing unsafe Preview branch: ${previewBranch}`);
  }

  const previewOrigin = `https://${previewBranch}.${PROJECT_NAME}.pages.dev`;
  const buildEnv = {
    ...process.env,
    CF_PAGES_BRANCH: previewBranch,
    PUBLIC_SITE_URL: previewOrigin,
    PUBLIC_SEARCH_INDEXING: 'disabled',
  };

  console.log('Cloudflare Preview plan');
  console.log(`  project: ${PROJECT_NAME}`);
  console.log(`  source: ${sourceBranch}@${sha.slice(0, 7)}${dirty ? ' (dirty)' : ''}`);
  console.log(`  preview branch: ${previewBranch}`);
  console.log('  production: protected / untouched');
  console.log('  mode: local repository build + Wrangler Direct Upload');

  run('npm', ['run', 'build:cloudflare'], { env: buildEnv });
  assertPreviewNoindex();

  const { command, prefixArgs } = resolveWrangler();
  const deployArgs = [
    ...prefixArgs,
    'pages',
    'deploy',
    BUILD_DIR,
    `--project-name=${PROJECT_NAME}`,
    `--branch=${previewBranch}`,
    `--commit-hash=${sha}`,
    `--commit-message=[Direct Upload Preview] ${commitMessage}`,
    ...(dirty ? ['--commit-dirty=true'] : []),
  ];

  const deploy = run(command, deployArgs, {
    env: {
      ...process.env,
      WRANGLER_SEND_METRICS: process.env.WRANGLER_SEND_METRICS ?? 'false',
    },
    capture: true,
  });

  const output = `${deploy.stdout ?? ''}\n${deploy.stderr ?? ''}`;
  const urls = extractPagesUrls(output);
  const branchUrl = previewOrigin;
  const deploymentUrl = urls.find((url) => url !== branchUrl) ?? urls[0] ?? branchUrl;

  await verifyPublicUrl(deploymentUrl);

  console.log('\nDirect Upload Preview complete');
  console.log(`DIRECT_UPLOAD_PREVIEW_URL=${deploymentUrl}`);
  console.log(`DIRECT_UPLOAD_BRANCH_URL=${branchUrl}`);
  console.log(`DIRECT_UPLOAD_BRANCH=${previewBranch}`);
  console.log(`DIRECT_UPLOAD_COMMIT=${sha}`);
  console.log('DIRECT_UPLOAD_MODE=wrangler-pages-direct-upload');
  console.log('Production was not targeted by this command.');
};

const invokedDirectly = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((error) => fail(error?.stack ?? error?.message ?? String(error)));
}
