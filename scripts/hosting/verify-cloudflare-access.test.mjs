import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkedPaths, isAccessLoginRedirect, parseProtectedWorkerUrl, verifyCloudflareAccess } from './verify-cloudflare-access.mjs';

const protectedUrl = 'https://basemodel-access-standby.lab-account.workers.dev/';
const accessLocation = 'https://team.cloudflareaccess.com/cdn-cgi/access/login/opaque';

test('only accepts dedicated worker production origin', () => {
  assert.equal(parseProtectedWorkerUrl(protectedUrl).origin, 'https://basemodel-access-standby.lab-account.workers.dev');
  for (const unsafe of [
    '', 'http://basemodel-access-standby.lab-account.workers.dev/',
    'https://basemodel-workers-shadow.lab-account.workers.dev/',
    'https://basemodel-access-standby.lab-account.workers.dev/foo',
    'https://basemodel-access-standby.lab-account.workers.dev/?token=private',
    'https://basemodel-access-standby.pages.dev/',
  ]) assert.throws(() => parseProtectedWorkerUrl(unsafe));
});

test('recognizes only a real Cloudflare Access login challenge', () => {
  const origin = new URL(protectedUrl);
  assert.equal(isAccessLoginRedirect({ status: 302, location: accessLocation }, origin), true);
  assert.equal(isAccessLoginRedirect({ status: 302, location: '/cdn-cgi/access/login/app' }, origin), true);
  for (const failed of [
    { status: 200, location: accessLocation },
    { status: 403, location: accessLocation },
    { status: 302, location: 'https://evil.example/steal' },
    { status: 302, location: '/login' },
    { status: 302, location: 'http://team.cloudflareaccess.com/cdn-cgi/access/login' },
    { status: 302, location: 'https://team.cloudflareaccess.com.evil.example/cdn-cgi/access/login' },
  ]) assert.equal(isAccessLoginRedirect(failed, origin), false, JSON.stringify(failed));
});

test('rejects an anonymously available page or static asset', async () => {
  let count = 0;
  const fetchImpl = async () => {
    count += 1;
    return { status: count === 3 ? 200 : 302, headers: new Headers({ location: accessLocation }) };
  };
  await assert.rejects(verifyCloudflareAccess(protectedUrl, { fetchImpl }), /FAIL CLOSED: anonymous \/og-cover\.svg returned HTTP 200/);
  assert.equal(count, 3);
});

test('accepts only when every route challenges anonymous access', async () => {
  const called = [];
  const fetchImpl = async (url, init) => {
    called.push([url.pathname, init.redirect]);
    return { status: 302, headers: new Headers({ location: accessLocation }) };
  };
  const result = await verifyCloudflareAccess(protectedUrl, { fetchImpl });
  assert.equal(result.verified.length, checkedPaths.length);
  assert.deepEqual(called, checkedPaths.map((path) => [path, 'manual']));
});
