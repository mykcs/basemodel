import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
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
    return new Response('User-agent: *\nAllow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const origin = (site ?? new URL('https://basemodel-preview.vercel.app')).href.replace(/\/$/, '');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemap = `${origin}${base}/sitemap.xml`;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
