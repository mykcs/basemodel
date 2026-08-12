import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const VERCEL_PRODUCTION_URL = 'https://basemodel-preview.vercel.app';
const LEGACY_PAGES_URL = 'https://basemodel.pages.dev';
const configuredSite = process.env.PUBLIC_SITE_URL;
const site = configuredSite && configuredSite !== LEGACY_PAGES_URL
  ? configuredSite
  : VERCEL_PRODUCTION_URL;

export default defineConfig({
  site,
  base: '/',
  output: 'static',
  // Astro 7 defaults to JSX-style whitespace compression, which can remove
  // meaningful spaces between adjacent inline elements. Preserve the Astro 6
  // HTML-aware behavior so the framework upgrade does not change rendered copy.
  compressHTML: true,
  integrations: [react()],
  build: {
    format: 'directory',
  },
  // 中文默认留根路径；英文走 /en/ 前缀。
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
