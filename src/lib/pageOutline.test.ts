import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const componentPath = path.join(root, 'src/components/navigation/PageOutline.astro');
const layoutPath = path.join(root, 'src/layouts/AppLayout.astro');

const component = fs.readFileSync(componentPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');

describe('long-page outline', () => {
  it('is mounted once and opts article routes into a labeled directory', () => {
    expect(layout).toContain("import PageOutline from '../components/navigation/PageOutline.astro';");
    expect(layout.match(/<PageOutline locale=\{locale\} article=\{isTechnicalArticle\} \/>/g)).toHaveLength(1);
    expect(layout.indexOf('<PageOutline locale={locale} article={isTechnicalArticle} />')).toBeGreaterThan(layout.indexOf('</main>'));
  });

  it('derives a semantic outline from headings only when the page is long enough', () => {
    expect(component).toContain("main.querySelectorAll<HTMLHeadingElement>('h2, h3')");
    expect(component).toContain('levelTwo.length >= 4 ? levelTwo : candidates');
    expect(component).toContain('headings.length < (articleMode ? 2 : 4) || !longEnough');
    expect(component).toContain("link.setAttribute('aria-current', 'location')");
    expect(component).toContain('link.dataset.outlineTarget = id');
  });

  it('keeps the rail desktop-only, theme-aware, and reduced-motion safe', () => {
    expect(component).toContain('<style is:global>');
    expect(component).toContain('@media (min-width: 1320px) and (min-height: 640px) and (hover: hover) and (pointer: fine)');
    expect(component).toContain('@media (prefers-reduced-motion: reduce)');
    expect(component).toContain('background: var(--surface)');
    expect(component).toContain('color: var(--ink)');
    expect(component).toContain('background: var(--accent-deep)');
    expect(component).not.toMatch(/var\(--[^,)]+,\s*#(?:fff|ffffff)\b/i);
  });

  it('keeps the navigation localized and progressively enhanced', () => {
    expect(component).toContain("locale === 'zh' ? '本页导航' : 'On this page'");
    expect(component).toContain('hidden>');
    expect(component).toContain('root.hidden = false');
    expect(component).toContain('initPageOutline();');
    expect(component).toContain("main.querySelector('.evo-article__toc')");
    expect(component).toContain('if (articleMode) link.textContent = text');
    expect(component).toContain('header.after(root)');
    expect(component).not.toContain('astro:page-load');
    expect(component).not.toContain('__atlasPageOutlineCleanup');
    expect(layout).not.toContain('ClientRouter');
  });
});
