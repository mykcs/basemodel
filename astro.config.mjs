import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';

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
  integrations: [react(), starlight({
    title: 'BaseModel · 技术手册',
    description: 'OpenEVO、Agent Harness 和科研资源的可检索操作文档',
    customCss: ['./src/styles/starlight-handbook.css'],
    head: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex,nofollow' } }],
    sidebar: [{ label: '技术手册', items: [
      { label: '从这里开始', link: '/handbook/' },
      { label: 'Agent Harness', link: '/handbook/agent-harness/' },
      { label: 'OpenEVO GPU 调度', link: '/handbook/openevo-gpu/' },
    ] }],
  })],
  build: {
    format: 'directory',
  },
  // Development baseline is temporarily Chinese-only; English source is archived under docs/archive/site-en/.
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
