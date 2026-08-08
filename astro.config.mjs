import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const site = process.env.PUBLIC_SITE_URL || 'https://mykcs.github.io';
const base = process.env.PUBLIC_BASE_PATH || '/basemodel';

export default defineConfig({
  site,
  base,
  output: 'static',
  // Astro 7 defaults to JSX-style whitespace compression, which can remove
  // meaningful spaces between adjacent inline elements. Preserve the Astro 6
  // HTML-aware behavior so the framework upgrade does not change rendered copy.
  compressHTML: true,
  integrations: [react()],
  build: {
    format: 'directory',
  },
  // 中文默认留根路径 (现有 URL / SEO 不变); 英文走 /en/ 前缀。
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
