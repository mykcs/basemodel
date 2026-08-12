import { spawnSync } from 'node:child_process';
import {
  resolveCloudflareSiteUrl,
  resolveSearchIndexing,
} from './cloudflare-deployment-env.mjs';

const run = (command, args, env = process.env) => {
  const result = spawnSync(command, args, { env, stdio: 'inherit' });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
};

// Legacy/fallback Cloudflare validation only. Vercel now owns ordinary Preview and Production.
// Keep this deterministic so a future rollback or Cloudflare-specific reproduction remains trustworthy.
run('npm', ['run', 'verify:deploy']);

const branch = process.env.CF_PAGES_BRANCH;
const siteUrl = resolveCloudflareSiteUrl({
  explicitSiteUrl: process.env.PUBLIC_SITE_URL,
  deploymentUrl: process.env.CF_PAGES_URL,
  branch,
});

if (!siteUrl) {
  console.error('Cloudflare build requires CF_PAGES_URL or an explicit PUBLIC_SITE_URL.');
  process.exit(1);
}

const searchIndexing = resolveSearchIndexing({ branch, configuredValue: process.env.PUBLIC_SEARCH_INDEXING });
run('npm', ['run', 'build'], {
  ...process.env,
  PUBLIC_SITE_URL: siteUrl,
  PUBLIC_SEARCH_INDEXING: searchIndexing,
});
