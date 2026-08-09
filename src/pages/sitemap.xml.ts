import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// 静态 sitemap：列出全部公开路由，zh（根）+ en（/en/ 前缀）双语。
// Astro.site 来自 Cloudflare 构建期的 PUBLIC_SITE_URL；正常部署基路径为 /。
export const GET: APIRoute = async ({ site }) => {
  if (process.env.PUBLIC_SEARCH_INDEXING === 'disabled') {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n',
      { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
    );
  }

  const origin = (site ?? new URL('https://basemodel.pages.dev')).href.replace(/\/$/, '');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const prefix = `${origin}${base}`;

  const models = await getCollection('models');
  const papers = await getCollection('papers');

  const staticPaths = ['/', '/models/', '/families/', '/compare/', '/papers/', '/guide/', '/landscape/', '/methodology/', '/workspace/', '/data-status/'];
  const zhUrls = [
    ...staticPaths.map((path) => `${prefix}${path}`),
    ...models.map((entry) => `${prefix}/models/${entry.data.id}/`),
    ...papers.map((entry) => `${prefix}/papers/${entry.data.id}/`),
  ];
  const enUrls = zhUrls.map((url) => url.replace(`${prefix}/`, `${prefix}/en/`));
  const urls = [...zhUrls, ...enUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
