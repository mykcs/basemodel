const ORIGIN = 'https://basemodel-preview.vercel.app';
const USER_AGENT = 'basemodel-production-smoke/1.0';

const htmlChecks = [
  '/',
  '/en/',
  '/research/seed-openevo/study/results/',
  '/lab/',
];

async function fetchText(path, init = {}) {
  const response = await fetch(`${ORIGIN}${path}`, {
    redirect: 'manual',
    headers: { 'User-Agent': USER_AGENT },
    ...init,
  });
  const body = await response.text();
  return { path, response, body };
}

function canonicalFor(path) {
  return `${ORIGIN}${path}`;
}

function record(results, ok, name, detail) {
  results.push({ ok, name, detail });
}
export async function runSmoke() {
  const results = [];

  for (const path of htmlChecks) {
    const { response, body } = await fetchText(path);
    record(results, response.status === 200, `${path} status`, `HTTP ${response.status}`);

    const canonical = canonicalFor(path);
    record(
      results,
      body.includes(`rel="canonical"`) && body.includes(`href="${canonical}"`),
      `${path} canonical`,
      canonical,
    );
    record(
      results,
      !/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(body),
      `${path} indexability`,
      'Production HTML must not expose noindex',
    );
  }

  const robots = await fetchText('/robots.txt');
  record(results, robots.response.status === 200, 'robots status', `HTTP ${robots.response.status}`);
  record(results, robots.body.includes('User-agent: *'), 'robots wildcard', 'User-agent: *');
  record(results, robots.body.includes('Allow: /'), 'robots allow', 'Allow: /');
  const sitemap = await fetchText('/sitemap.xml');
  record(results, sitemap.response.status === 200, 'sitemap status', `HTTP ${sitemap.response.status}`);
  record(
    results,
    sitemap.body.includes('/research/seed-openevo/study/results/'),
    'sitemap critical route',
    '/research/seed-openevo/study/results/',
  );

  const legacy = await fetchText('/research/seed-openevo/results');
  const location = legacy.response.headers.get('location') ?? '';
  record(
    results,
    [301, 308].includes(legacy.response.status),
    'legacy results redirect status',
    `HTTP ${legacy.response.status}`,
  );
  record(
    results,
    location.endsWith('/research/seed-openevo/study/results/'),
    'legacy results redirect target',
    location || 'missing Location header',
  );

  const failures = results.filter((result) => !result.ok);
  return {
    ok: failures.length === 0,
    checkedAt: new Date().toISOString(),
    origin: ORIGIN,
    results,
    failures,
  };
}
export default {
  async scheduled(_controller, _env, ctx) {
    ctx.waitUntil((async () => {
      const report = await runSmoke();
      console.log(JSON.stringify(report));
      if (!report.ok) {
        throw new Error(`Production smoke failed: ${report.failures.map((item) => item.name).join(', ')}`);
      }
    })());
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/healthz') {
      return Response.json({ ok: true, worker: 'basemodel-production-smoke' });
    }
    if (url.pathname !== '/check') return new Response('Not found', { status: 404 });

    const expected = env.SMOKE_TOKEN ? `Bearer ${env.SMOKE_TOKEN}` : '';
    if (!expected || request.headers.get('authorization') !== expected) {
      return new Response('Unauthorized', { status: 401 });
    }

    const report = await runSmoke();
    return Response.json(report, { status: report.ok ? 200 : 503 });
  },
};
