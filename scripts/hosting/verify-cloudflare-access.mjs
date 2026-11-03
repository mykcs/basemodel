import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STANDBY_WORKER = 'basemodel-access-standby';
export const checkedPaths = ['/', '/index.html', '/og-cover.svg', '/model-data/hosting-access-probe.json'];

export function parseProtectedWorkerUrl(input) {
  if (!input) throw new Error('CLOUDFLARE_PROTECTED_URL must be configured before any deploy');
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Expected a bare HTTPS Cloudflare Worker origin without credentials, path or query');
  }
  const hostname = url.hostname;
  if (!new RegExp(`^${STANDBY_WORKER}\\.[a-z0-9-]+\\.workers\\.dev$`).test(hostname)) {
    throw new Error(`Expected the dedicated ${STANDBY_WORKER}.<account>.workers.dev origin`);
  }
  return url;
}

export function isAccessLoginRedirect({ status, location }, workerOrigin) {
  if (![301, 302, 303, 307, 308].includes(status) || !location) return false;
  let destination;
  try { destination = new URL(location, workerOrigin); } catch { return false; }
  if (destination.protocol !== 'https:' || destination.username || destination.password) return false;
  if (!/^\/cdn-cgi\/access\/login(?:\/|$)/.test(destination.pathname)) return false;
  return destination.hostname === workerOrigin.hostname || /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(destination.hostname);
}

export async function verifyCloudflareAccess(input, { fetchImpl = fetch, paths = checkedPaths } = {}) {
  const origin = parseProtectedWorkerUrl(input);
  const verified = [];
  for (const path of paths) {
    if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Unsafe probe path');
    const url = new URL(path, origin);
    const response = await fetchImpl(url, {
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
      headers: { 'Cache-Control': 'no-store' },
    });
    const location = response.headers.get('location');
    if (!isAccessLoginRedirect({ status: response.status, location }, origin)) {
      throw new Error(`FAIL CLOSED: anonymous ${path} returned HTTP ${response.status}; expected Cloudflare Access login redirect`);
    }
    verified.push({ path, status: response.status });
  }
  return { hostname: origin.hostname, verified };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyCloudflareAccess(process.env.CLOUDFLARE_PROTECTED_URL)
    .then(({ verified }) => {
      console.log(`Access gate PASS for ${verified.length} anonymous routes: ${verified.map(({ path }) => path).join(', ')}`);
      console.log('Scope: anonymous HTTP challenge only. Authorized browser and settings audit still required before primary cutover.');
    })
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
