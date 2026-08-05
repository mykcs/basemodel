import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const site = process.env.PUBLIC_SITE_URL || 'https://example.github.io';
const base = process.env.PUBLIC_BASE_PATH || '';

export default defineConfig({
  site,
  base,
  output: 'static',
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
