import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const isCloudflarePreview =
    process.env.CF_PAGES === '1' &&
    Boolean(process.env.CF_PAGES_BRANCH) &&
    process.env.CF_PAGES_BRANCH !== 'main';
  const shouldNoIndex =
    process.env.PUBLIC_SEARCH_INDEXING === 'disabled' || isCloudflarePreview;

  if (shouldNoIndex) {
    // Do not use Disallow here. Cloudflare Preview responses already include
    // X-Robots-Tag: noindex, and backup builds emit meta robots=noindex. Search
    // engines need to be allowed to fetch pages in order to observe noindex.
    return new Response('User-agent: *\nAllow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const origin = (site ?? new URL('https://mykcs.github.io')).href.replace(/\/$/, '');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemap = `${origin}${base}/sitemap.xml`;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
