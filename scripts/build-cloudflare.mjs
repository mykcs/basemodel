import { spawnSync } from 'node:child_process';
import {
  resolveCloudflareSiteUrl,
  resolveSearchIndexing,
} from './cloudflare-deployment-env.mjs';

const run = (command, args, env = process.env) => {
  const result = spawnSync(command, args, {
    env,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const checks = [
  ['run', 'check'],
  ['run', 'validate'],
  ['run', 'audit:semantic'],
  ['run', 'audit:claims'],
  ['run', 'audit:freshness'],
  ['test'],
];

for (const args of checks) {
  run('npm', args);
}

const branch = process.env.CF_PAGES_BRANCH;
const siteUrl = resolveCloudflareSiteUrl({
  explicitSiteUrl: process.env.PUBLIC_SITE_URL,
  deploymentUrl: process.env.CF_PAGES_URL,
  branch,
});

if (!siteUrl) {
  console.error(
    'Cloudflare build requires CF_PAGES_URL (injected by Pages) or an explicit PUBLIC_SITE_URL for Production.',
  );
  process.exit(1);
}

const searchIndexing = resolveSearchIndexing({
  branch,
  configuredValue: process.env.PUBLIC_SEARCH_INDEXING,
});

run('npm', ['run', 'build'], {
  ...process.env,
  PUBLIC_SITE_URL: siteUrl,
  PUBLIC_SEARCH_INDEXING: searchIndexing,
  // GitHub Pages owns /basemodel; Cloudflare Pages serves this project at the origin root.
  PUBLIC_BASE_PATH: '/',
});
