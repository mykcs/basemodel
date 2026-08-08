import { spawnSync } from 'node:child_process';

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

const explicitSiteUrl = process.env.PUBLIC_SITE_URL;
const deploymentUrl = process.env.CF_PAGES_URL;
const branch = process.env.CF_PAGES_BRANCH;
const isProduction = branch === 'main';

const stablePagesProductionUrl = (value) => {
  const url = new URL(value);
  const labels = url.hostname.split('.');

  // CF_PAGES_URL points at the current deployment. Production deployments are
  // commonly exposed as <hash>.<project>.pages.dev while <project>.pages.dev is
  // the durable production alias. Strip only the deployment label.
  if (
    labels.length >= 4 &&
    labels.at(-2) === 'pages' &&
    labels.at(-1) === 'dev'
  ) {
    url.hostname = labels.slice(1).join('.');
  }

  return url.origin;
};

let siteUrl = explicitSiteUrl;
if (!siteUrl && deploymentUrl) {
  siteUrl = isProduction ? stablePagesProductionUrl(deploymentUrl) : deploymentUrl;
}

if (!siteUrl) {
  console.error(
    'Cloudflare build requires CF_PAGES_URL (injected by Pages) or an explicit PUBLIC_SITE_URL.',
  );
  process.exit(1);
}

const searchIndexing = isProduction
  ? (process.env.PUBLIC_SEARCH_INDEXING || 'enabled')
  : 'disabled';

run('npm', ['run', 'build'], {
  ...process.env,
  PUBLIC_SITE_URL: siteUrl,
  PUBLIC_SEARCH_INDEXING: searchIndexing,
  // GitHub Pages owns /basemodel; Cloudflare Pages serves this project at the origin root.
  PUBLIC_BASE_PATH: '/',
});
