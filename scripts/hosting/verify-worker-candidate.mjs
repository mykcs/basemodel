import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHeaders, renderRedirects } from './cloudflare-static-contract.mjs';

const HERE = fileURLToPath(new URL('../../', import.meta.url));
const WORKER = 'basemodel-access-standby';

const read = (path) => readFileSync(path, 'utf8');
const fail = (message) => { throw new Error(`Cloudflare candidate rejected: ${message}`); };

/** Validate the exact asset/configuration pair before even a dry-run upload. */
export function verifyWorkerCandidate({ projectRoot = HERE, distRoot = resolve(projectRoot, 'dist'), expectedSha } = {}) {
  const config = JSON.parse(read(resolve(projectRoot, 'wrangler.standby.jsonc')));
  const allowedKeys = new Set(['$schema', 'name', 'compatibility_date', 'workers_dev', 'preview_urls', 'assets']);
  if (Object.keys(config).some((key) => !allowedKeys.has(key))) fail('unexpected Worker configuration key');
  if (config.name !== WORKER || config.workers_dev !== true || config.preview_urls !== false) {
    fail('worker identity, production origin, or preview isolation changed');
  }
  if (Object.keys(config.assets ?? {}).sort().join(',') !== 'directory,html_handling,not_found_handling'
    || config.assets.directory !== './dist'
    || config.assets.not_found_handling !== '404-page'
    || config.assets.html_handling !== 'auto-trailing-slash') {
    fail('static-only asset routing changed');
  }

  const sourceConfig = JSON.parse(read(resolve(projectRoot, 'vercel.json')));
  if (read(resolve(distRoot, '_redirects')) !== renderRedirects(sourceConfig)) fail('redirects differ from tested source');
  if (read(resolve(distRoot, '_headers')) !== renderHeaders(sourceConfig)) fail('response headers differ from tested source');

  const index = read(resolve(distRoot, 'index.html'));
  const tags = index.match(/<meta\b[^>]*>/gi) ?? [];
  if (!tags.some((tag) => /name=["']robots["']/i.test(tag) && /noindex/i.test(tag))) {
    fail('index.html lacks noindex metadata');
  }
  if (!read(resolve(distRoot, '_headers')).includes('X-Robots-Tag: noindex, nofollow, noarchive')) {
    fail('static assets lack noindex response headers');
  }
  if (expectedSha !== undefined) {
    if (!/^[0-9a-f]{40}$/.test(expectedSha)) fail('expected source SHA must be an exact Git commit');
    if (read(resolve(distRoot, 'standby-source-sha.txt')) !== `${expectedSha}\n`) fail('artifact source identity differs');
  }
  return { worker: WORKER, redirects: sourceConfig.redirects.length, sha: expectedSha ?? null };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const expectedSha = process.env.CI_HEAD_SHA || process.env.EXPECTED_SHA;
    if (expectedSha) {
      const actualSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
      if (actualSha !== expectedSha) fail('checkout is not the requested source SHA');
    }
    const result = verifyWorkerCandidate({ expectedSha });
    console.log(`Cloudflare candidate PASS: ${result.worker}, ${result.redirects} redirects, source ${result.sha ?? 'local build'}`);
    console.log('Scope: static artifact / Wrangler config only. Cloudflare Access and authenticated visual checks require protected deployment.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
