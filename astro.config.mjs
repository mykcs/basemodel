import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

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
  // The native /sitemap.xml owns indexing policy. Explicitly configure the
  // sitemap integration so Starlight cannot add an unfiltered second sitemap.
  integrations: [react(), sitemap({ filter: () => false }), starlight({
    // Starlight parses its fallback title before inheriting Astro's zh locale.
    title: { en: 'BaseModel · 技术手册', zh: 'BaseModel · 技术手册' },
    description: 'OpenEVO、Agent Harness 和科研资源的可检索操作文档',
    disable404Route: true,
    customCss: ['./src/styles/app.css', './src/styles/starlight-handbook.css'],
    components: {
      Header: './src/components/handbook/Header.astro',
      ThemeProvider: './src/components/common/ThemeInitialization.astro',
      ThemeSelect: './src/components/handbook/ThemeSelect.astro',
      MobileMenuToggle: './src/components/handbook/MobileMenuToggle.astro',
    },
    head: [
      { tag: 'meta', attrs: { name: 'robots', content: 'noindex,nofollow' } },
      { tag: 'link', attrs: { rel: 'sitemap', href: '/sitemap.xml' } },
    ],
    sidebar: [{ label: '技术手册', items: [
      { label: '从这里开始', link: '/handbook/' },
      { label: 'Agent Harness', link: '/handbook/agent-harness/' },
      { label: 'OpenEVO GPU 调度', link: '/handbook/openevo-gpu/' },
    ] }],
  }), {
    name: 'basemodel-native-style-scope',
    hooks: {
      // `class` preserves native scoped specificity while forwarding scope
      // through Starlight's class-only child components (notably its icons).
      'astro:config:setup': ({ updateConfig }) => updateConfig({ scopedStyleStrategy: 'class' }),
    },
  }],
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
