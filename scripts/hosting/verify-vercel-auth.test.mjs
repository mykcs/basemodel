import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  checkedPaths,
  isVercelSsoChallenge,
  parseProtectedVercelUrl,
  verifyVercelAuthentication,
} from './verify-vercel-auth.mjs';

const canonical = 'https://basemodel-preview.vercel.app/';
const staged = 'https://basemodel-preview-abcdef123-example-team.vercel.app/';
const challenge = (target) => `https://vercel.com/sso-api?url=${encodeURIComponent(target)}&nonce=testnonce123`;
const response = (target, status = 302, location = challenge(target)) => ({
  status, headers: new Headers({ location }),
});

test('accepts only the protected production host or its exact staged hostname shape', () => {
  assert.equal(parseProtectedVercelUrl(canonical).hostname, 'basemodel-preview.vercel.app');
  assert.equal(parseProtectedVercelUrl(staged).hostname, 'basemodel-preview-abcdef123-example-team.vercel.app');
  for (const bad of [
    '', 'http://basemodel-preview.vercel.app/',
    'https://other.vercel.app/', 'https://basemodel-preview.vercel.app.evil.test/',
    'https://user:pass@basemodel-preview.vercel.app/',
    'https://basemodel-preview.vercel.app:444/',
    'https://basemodel-preview.vercel.app/secret',
    'https://basemodel-preview.vercel.app/?secret=yes',
    'https://basemodel-preview.vercel.app/#hash',
  ]) assert.throws(() => parseProtectedVercelUrl(bad));
});

test('SSO proof checks redirect target, login endpoint, nonce and protocol', () => {
  const target = new URL('/og-cover.svg', canonical);
  assert.equal(isVercelSsoChallenge({ status: 302, location: challenge(target.toString()) }, target), true);
  for (const [status, location] of [
    [200, challenge(target.toString())],
    [302, 'https://evil.example/sso-api?url=' + encodeURIComponent(target.toString()) + '&nonce=x'],
    [302, 'https://vercel.com/login?url=' + encodeURIComponent(target.toString()) + '&nonce=x'],
    [302, challenge('https://other.vercel.app/og-cover.svg')],
    [302, 'https://vercel.com/sso-api?url=' + encodeURIComponent(target.toString())],
    [302, 'http://vercel.com/sso-api?url=' + encodeURIComponent(target.toString()) + '&nonce=x'],
  ]) assert.equal(isVercelSsoChallenge({ status, location }, target), false);
});

test('checks all four independent paths and rejects public content', async () => {
  const seen = [];
  const result = await verifyVercelAuthentication(canonical, {
    fetchImpl: async (target, init) => {
      seen.push(target.pathname);
      assert.equal(init.redirect, 'manual');
      return response(target.toString());
    },
  });
  assert.deepEqual(result.verified, checkedPaths);
  assert.deepEqual(seen, checkedPaths);
  await assert.rejects(() => verifyVercelAuthentication(canonical, {
    fetchImpl: async (target) => target.pathname === '/og-cover.svg'
      ? response(target.toString(), 200) : response(target.toString()),
  }), /FAIL CLOSED/);
  await assert.rejects(() => verifyVercelAuthentication(canonical, {
    paths: ['//external.example'], fetchImpl: async () => response(canonical),
  }), /Unsafe/);
});
