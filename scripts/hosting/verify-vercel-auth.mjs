import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_HOST = 'basemodel-preview.vercel.app';
const STAGED_HOST = /^basemodel-preview-[a-z0-9]{9}-[a-z0-9-]+\.vercel\.app$/;
export const checkedPaths = ['/', '/index.html', '/og-cover.svg', '/model-data/hosting-access-probe.json'];

export function parseProtectedVercelUrl(input) {
  if (!input) throw new Error('VERCEL_PROTECTED_URL must identify the existing protected site');
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || url.port
    || url.pathname !== '/' || url.search || url.hash
    || (url.hostname !== PROJECT_HOST && !STAGED_HOST.test(url.hostname))) {
    throw new Error('Expected the approved HTTPS Vercel project origin, with no credentials, path or query');
  }
  return url;
}

export function isVercelSsoChallenge({ status, location }, targetUrl) {
  if (![301, 302, 303, 307, 308].includes(status) || !location) return false;
  let redirect;
  try { redirect = new URL(location); } catch { return false; }
  if (redirect.protocol !== 'https:' || redirect.hostname !== 'vercel.com'
    || redirect.port || redirect.username || redirect.password || redirect.pathname !== '/sso-api') return false;
  if (redirect.searchParams.get('url') !== targetUrl.toString()) return false;
  return Boolean(redirect.searchParams.get('nonce'));
}

export async function verifyVercelAuthentication(input, { fetchImpl = fetch, paths = checkedPaths } = {}) {
  const origin = parseProtectedVercelUrl(input);
  const verified = [];
  for (const path of paths) {
    if (!path.startsWith('/') || path.startsWith('//') || path.includes('?') || path.includes('#')) {
      throw new Error('Unsafe anonymous verification path');
    }
    const target = new URL(path, origin);
    const response = await fetchImpl(target, {
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
      headers: { 'Cache-Control': 'no-store' },
    });
    if (!isVercelSsoChallenge({ status: response.status, location: response.headers.get('location') }, target)) {
      throw new Error(`FAIL CLOSED: anonymous ${path} returned HTTP ${response.status}; expected Vercel Authentication`);
    }
    verified.push(path);
  }
  return { hostname: origin.hostname, verified };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyVercelAuthentication(process.env.VERCEL_PROTECTED_URL)
    .then(({ verified }) => {
      console.log(`Vercel Authentication PASS: ${verified.length} anonymous routes require login.`);
      console.log('Scope: anonymous denial only; authorized routes, provider identity and rendered UI require separate checks.');
    })
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
