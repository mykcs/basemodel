import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { sitemapStaticPaths } from '../lib/sitemapRoutes';

// Static bilingual sitemap. Preview surfaces stay non-indexable; Vercel Production uses Astro.site.
export const GET: APIRoute = async ({ site }) => {
  const isVercelProduction = process.env.VERCEL_ENV === 'production';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';
  const isCloudflarePreview =
    process.env.CF_PAGES === '1' &&
    Boolean(process.env.CF_PAGES_BRANCH) &&
    process.env.CF_PAGES_BRANCH !== 'main';
  const explicitNoIndex =
    process.env.PUBLIC_SEARCH_INDEXING === 'disabled' && !isVercelProduction;
  const shouldNoIndex = explicitNoIndex || isVercelPreview || isCloudflarePreview;

  if (shouldNoIndex) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n',
      { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
    );
  }

  const origin = (site ?? new URL('https://basemodel-preview.vercel.app')).href.replace(/\/$/, '');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const prefix = `${origin}${base}`;

  const models = await getCollection('models');
  const papers = await getCollection('papers');

  const staticUrls = sitemapStaticPaths().map((path) => `${prefix}${path}`);
  const zhUrls = [
    ...models.map((entry) => `${prefix}/models/${entry.data.id}/`),
    ...papers.map((entry) => `${prefix}/papers/${entry.data.id}/`),
  ];
  const enUrls = [
    ...models.map((entry) => `${prefix}/en/models/${entry.data.id}/`),
    ...papers.map((entry) => `${prefix}/en/papers/${entry.data.id}/`),
  ];
  const urls = [...staticUrls, ...zhUrls, ...enUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
