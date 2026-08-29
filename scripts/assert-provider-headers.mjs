const baseUrl = process.argv[2];
const modelId = process.argv[3] ?? 'qwen2-5-3b-instruct';
if (!baseUrl) {
  console.error('Usage: npm run assert:provider-headers -- <base-url> [model-id]');
  process.exit(2);
}

const origin = new URL(baseUrl);
const required = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
};
const html = await fetch(new URL('/', origin), { redirect: 'follow' });
if (!html.ok) throw new Error(`HTML response failed: ${html.status}`);
for (const [key, expected] of Object.entries(required)) {
  if (html.headers.get(key) !== expected) throw new Error(`${key}: expected ${expected}, got ${html.headers.get(key)}`);
}
if (!html.headers.has('permissions-policy')) throw new Error('permissions-policy is missing');
if (!html.headers.has('content-security-policy-report-only')) throw new Error('report-only CSP is missing');
if (html.headers.has('content-security-policy')) throw new Error('enforced CSP is premature while inline scripts remain');

const model = await fetch(new URL(`/model-data/${encodeURIComponent(modelId)}.json`, origin));
if (!model.ok) throw new Error(`model-data response failed: ${model.status}`);
const cache = model.headers.get('cache-control') ?? '';
for (const directive of ['public', 'max-age=3600', 's-maxage=86400', 'stale-while-revalidate=86400']) {
  if (!cache.includes(directive)) throw new Error(`cache-control missing ${directive}: ${cache}`);
}
console.log('[assert-provider-headers] PASS');
