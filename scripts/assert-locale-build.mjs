import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
if (!existsSync(dist)) throw new Error('dist is missing; run npm run build first');

const registry = await import(new URL('../src/lib/sitemapRoutes.ts', import.meta.url));
const publicPaths = registry.sitemapStaticPaths();

const fileFor = (pathname) => join(dist, pathname.replace(/^\//, ''), 'index.html');
const alternates = (html) => [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
  .map((match) => ({ lang: match[1], url: new URL(match[2]) }));

for (const pathname of publicPaths) {
  const file = fileFor(pathname);
  if (!existsSync(file)) throw new Error(`declared locale route did not build: ${pathname}`);
  const html = readFileSync(file, 'utf8');
  const sourceCanonical = new URL(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '');
  for (const alternate of alternates(html).filter(({ lang }) => lang !== 'x-default')) {
    const targetFile = fileFor(alternate.url.pathname);
    if (!existsSync(targetFile)) throw new Error(`${pathname} advertises missing ${alternate.url.pathname}`);
    const targetHtml = readFileSync(targetFile, 'utf8');
    const reciprocal = alternates(targetHtml).some(({ url }) => url.href === sourceCanonical.href);
    if (!reciprocal) throw new Error(`${alternate.url.pathname} does not reciprocate ${pathname}`);
  }
}

console.log(`[assert-locale-build] PASS: ${publicPaths.length} locale routes have real reciprocal targets`);
