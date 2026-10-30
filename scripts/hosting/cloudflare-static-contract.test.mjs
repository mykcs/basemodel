import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { renderRedirects, renderHeaders } from './cloudflare-static-contract.mjs';

const config = JSON.parse(readFileSync(fileURLToPath(new URL('../../vercel.json', import.meta.url)), 'utf8'));

test('mirrors every Vercel redirect and keeps 307/308 semantics', () => {
  const rendered = renderRedirects(config);
  const lines = rendered.split('\n').filter((line) => line.startsWith('/'));
  assert.equal(lines.length, config.redirects.length);
  assert.match(rendered, /^\/research\/seed-openevo\/results\/\* \/research\/seed-openevo\/study\/results\/:splat 308$/m);
  assert.match(rendered, /^\/en\/models\/:id \/models\/:id\/ 307$/m);
  assert.match(rendered, /^\/en\/lab https:\/\/fuhuo-20260419\.vercel\.app\/docs\/machines 308$/m);
  const dynamicIndex = lines.findIndex((line) => /(?:\*|:[A-Za-z][\w-]*)/.test(line.split(' ')[0]));
  assert.equal(dynamicIndex, lines.length - 5, 'all static rules must precede five dynamic rules; Cloudflare otherwise exhausts the dynamic-rule budget');
  assert.equal(lines.slice(dynamicIndex).length, 5);
});

test('keeps security headers and applies non-indexing across the standby', () => {
  const rendered = renderHeaders(config);
  assert.match(rendered, /^\/\*\n  X-Robots-Tag: noindex, nofollow, noarchive$/m);
  assert.match(rendered, /^  X-Frame-Options: DENY$/m);
  assert.match(rendered, /^\/model-data\/\*\n  Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400$/m);
});

test('fails closed for new syntax that cannot be translated safely', () => {
  assert.throws(() => renderRedirects({ redirects: [{ source: '/a', destination: '/b', permanent: false, has: [] }] }), /Unsupported/);
  assert.throws(() => renderRedirects({ redirects: [{ source: '/a\nb', destination: '/c', permanent: false }] }), /Unsafe/);
  assert.throws(() => renderHeaders({ headers: [{ source: '/unexpected', headers: [] }] }), /Unsupported/);
  assert.throws(() => renderHeaders({ headers: [{ source: '/(.*)', headers: [{ key: 'X-Test', value: 'ok\nX-Leak: 1' }] }] }), /Invalid/);
});
