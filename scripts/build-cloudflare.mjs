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

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.CF_PAGES_URL;

if (!siteUrl) {
  console.error(
    'Cloudflare build requires CF_PAGES_URL (injected by Pages) or an explicit PUBLIC_SITE_URL.',
  );
  process.exit(1);
}

run('npm', ['run', 'build'], {
  ...process.env,
  PUBLIC_SITE_URL: siteUrl,
  // GitHub Pages owns /basemodel; Cloudflare Pages serves this project at the origin root.
  PUBLIC_BASE_PATH: '/',
});
