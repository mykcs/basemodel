import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const headerSource = readFileSync(new URL('./Header.astro', import.meta.url), 'utf8');
const navigationCss = readFileSync(new URL('../styles/navigation-groups.css', import.meta.url), 'utf8');
const layoutSource = readFileSync(new URL('../layouts/AppLayout.astro', import.meta.url), 'utf8');

describe('three-part research navigation', () => {
  it('exposes exactly the three user-facing research paths in both locales', () => {
    const groupIds = headerSource.match(/^\s+id: '(?:reproduce-seed|train-openevo|foundations)',$/gm) ?? [];

    expect(groupIds).toHaveLength(6);
    expect(headerSource).toContain("label: '复现 SEED'");
    expect(headerSource).toContain("label: 'OpenEvo 训练'");
    expect(headerSource).toContain("label: '相关知识'");
    expect(headerSource).toContain("label: 'Reproduce SEED'");
    expect(headerSource).toContain("label: 'Run OpenEvo'");
    expect(headerSource).toContain("label: 'Foundations'");
    expect(headerSource).not.toContain('const primaryLinks');
    expect(headerSource).not.toContain('const utilityLinks');
  });

  it('keeps the reproduction, execution, benchmark, model, Agent, and training routes reachable', () => {
    for (const route of [
      '/research/seed-openevo/',
      '/research/seed-openevo/seed/',
      '/research/seed-openevo/results/',
      '/guide/openevo-webshop-alfworld/',
      '/research/seed-openevo/openevo/',
      '/research/seed-openevo/benchmarks/',
      '/research/seed-openevo/loops/',
      '/workspace/',
      '/compare/',
      '/guide/',
      '/research/seed-openevo/base-model/',
      '/models/',
      '/papers/',
    ]) {
      expect(headerSource).toContain(route);
    }
  });

  it('uses native grouped disclosure and preserves keyboard/mobile escape behavior', () => {
    expect(headerSource).toContain('<details class:list');
    expect(headerSource).toContain('<summary data-ui-audit-item>');
    expect(headerSource).toContain('data-nav-cluster');
    expect(headerSource).toContain('data-mobile-nav-cluster');
    expect(headerSource).toContain("event.key !== 'Escape'");
    expect(headerSource).toContain('closeNavClusters');
    expect(headerSource).toContain('aria-current');
  });

  it('loads the navigation layer last and keeps theme-safe, reduced-motion styles', () => {
    const knowledgeIndex = layoutSource.indexOf("import '../styles/knowledge-architecture.css';");
    const navigationIndex = layoutSource.indexOf("import '../styles/navigation-groups.css';");

    expect(knowledgeIndex).toBeGreaterThan(-1);
    expect(navigationIndex).toBeGreaterThan(knowledgeIndex);
    expect(navigationCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(navigationCss).toContain('var(--surface)');
    expect(navigationCss).toContain('var(--ink)');
    expect(navigationCss).toContain('var(--muted)');
    expect(navigationCss).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});
