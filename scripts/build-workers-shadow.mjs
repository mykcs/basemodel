import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const CURRENT_PRODUCTION_URL = 'https://basemodel-preview.vercel.app';
const buildDir = resolve('dist');

const fail = (message) => {
  console.error(`\nWorkers shadow build aborted: ${message}`);
  process.exit(1);
};

const run = (command, args, env = process.env) => {
  const result = spawnSync(command, args, { env, stdio: 'inherit' });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) fail(`${command} ${args.join(' ')} exited with status ${result.status ?? 'unknown'}`);
};

console.log('Workers Static Assets shadow build');
console.log(`  canonical production: ${CURRENT_PRODUCTION_URL}`);
console.log('  search indexing: disabled');
console.log('  production cutover: no');

run('npm', ['run', 'verify:deploy']);
run('npm', ['run', 'build'], {
  ...process.env,
  PUBLIC_SITE_URL: CURRENT_PRODUCTION_URL,
  PUBLIC_SEARCH_INDEXING: 'disabled',
});

const indexPath = resolve(buildDir, 'index.html');
if (!existsSync(indexPath)) fail('dist/index.html does not exist after build');

const html = readFileSync(indexPath, 'utf8');
const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
const hasRobotsNoindex = metaTags.some(
  (tag) => /name=["']robots["']/i.test(tag) && /noindex/i.test(tag),
);
if (!hasRobotsNoindex) fail('shadow artifact is missing a robots noindex meta tag');
if (!html.includes(CURRENT_PRODUCTION_URL)) fail(`shadow artifact does not retain current Production identity: ${CURRENT_PRODUCTION_URL}`);

console.log('\nWorkers shadow artifact ready');
console.log(`WORKERS_SHADOW_BUILD_DIR=${buildDir}`);
console.log(`WORKERS_SHADOW_CANONICAL=${CURRENT_PRODUCTION_URL}`);
console.log('WORKERS_SHADOW_INDEXING=disabled');
console.log('WORKERS_SHADOW_PRODUCTION_CHANGED=no');
