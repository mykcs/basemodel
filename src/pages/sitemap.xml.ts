import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// 静态 sitemap: 列出全部公开路由, zh (根) + en (/en/ 前缀) 双语。
// Astro.site 来自 PUBLIC_SITE_URL, base 来自 PUBLIC_BASE_PATH (构建期注入), 二者拼出绝对 URL。
export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://mykcs.github.io')).href.replace(/\/$/, '');
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
  // en 镜像路由: 每个 zh 路径加 /en 前缀。
  const enUrls = zhUrls.map((url) => url.replace(`${prefix}/`, `${prefix}/en/`));
  const urls = [...zhUrls, ...enUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
