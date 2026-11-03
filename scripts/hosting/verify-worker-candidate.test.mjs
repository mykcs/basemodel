import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { renderHeaders, renderRedirects } from './cloudflare-static-contract.mjs';
import { verifyWorkerCandidate } from './verify-worker-candidate.mjs';

const validSha = 'a'.repeat(40);

function withFixture(callback) {
  const root = mkdtempSync(join(tmpdir(), 'basemodel-cf-gate-'));
  const dist = join(root, 'dist');
  mkdirSync(dist);
  const source = { redirects: [{ source: '/old', destination: '/new', permanent: false }], headers: [
    { source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] },
  ] };
  const worker = { name: 'basemodel-access-standby', workers_dev: true, preview_urls: false,
    assets: { directory: './dist', not_found_handling: '404-page', html_handling: 'auto-trailing-slash' } };
  writeFileSync(join(root, 'vercel.json'), JSON.stringify(source));
  writeFileSync(join(root, 'wrangler.standby.jsonc'), JSON.stringify(worker));
  writeFileSync(join(dist, '_redirects'), renderRedirects(source));
  writeFileSync(join(dist, '_headers'), renderHeaders(source));
  writeFileSync(join(dist, 'index.html'), '<meta name="robots" content="noindex,nofollow"><main>test</main>');
  writeFileSync(join(dist, 'standby-source-sha.txt'), `${validSha}\n`);
  try { callback({ root, dist, worker }); } finally { rmSync(root, { recursive: true, force: true }); }
}

test('accepts exact source identity, protected static-only config and generated artifact', () => {
  withFixture(({ root, dist }) => {
    assert.deepEqual(verifyWorkerCandidate({ projectRoot: root, distRoot: dist, expectedSha: validSha }),
      { worker: 'basemodel-access-standby', redirects: 1, sha: validSha });
  });
});

test('fails closed on changed worker identity, preview publication or dynamic routing', () => {
  for (const mutation of [
    (config) => { config.name = 'basemodel-workers-shadow'; },
    (config) => { config.preview_urls = true; },
    (config) => { config.assets.directory = './public'; },
    (config) => { config.routes = ['example.com/*']; },
  ]) withFixture(({ root, dist, worker }) => {
    mutation(worker);
    writeFileSync(join(root, 'wrangler.standby.jsonc'), JSON.stringify(worker));
    assert.throws(() => verifyWorkerCandidate({ projectRoot: root, distRoot: dist }), /Cloudflare candidate rejected/);
  });
});

test('rejects wrong SHA, altered redirects, removed noindex header and public index', () => {
  withFixture(({ root, dist }) => {
    assert.throws(() => verifyWorkerCandidate({ projectRoot: root, distRoot: dist, expectedSha: 'b'.repeat(40) }), /source identity differs/);
    writeFileSync(join(dist, '_redirects'), '/old /other 307\n');
    assert.throws(() => verifyWorkerCandidate({ projectRoot: root, distRoot: dist }), /redirects differ/);
  });
  withFixture(({ root, dist }) => {
    writeFileSync(join(dist, '_headers'), '/*\n  X-Frame-Options: DENY\n');
    assert.throws(() => verifyWorkerCandidate({ projectRoot: root, distRoot: dist }), /response headers differ/);
  });
  withFixture(({ root, dist }) => {
    const index = readFileSync(join(dist, 'index.html'), 'utf8');
    writeFileSync(join(dist, 'index.html'), index.replace('noindex,nofollow', 'index,follow'));
    assert.throws(() => verifyWorkerCandidate({ projectRoot: root, distRoot: dist }), /lacks noindex/);
  });
});
