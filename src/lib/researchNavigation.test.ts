import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const navigation = read('src/components/research/SeedOpenEvoResearchNav.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const detail = read('src/components/research/SeedOpenEvoResearchDetail.astro');
const report = read('src/components/research/OpenEvoWebShopProgramReport.astro');

const orderedIds = [
  "id: 'hub'",
  "id: 'base-model'",
  "id: 'seed'",
  "id: 'openevo'",
  "id: 'benchmarks'",
  "id: 'webshop'",
  "id: 'alfworld'",
  "id: 'loops'",
  "id: 'results'",
];

describe('SEED × OpenEvo research navigation', () => {
  it('defines one complete global information architecture in one shared component', () => {
    let previous = -1;
    for (const token of orderedIds) {
      const position = navigation.indexOf(token);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }
    expect(navigation).toContain("t('研究导航', 'Research navigation')");
    expect(navigation).toContain("t('SEED 与 OpenEvo 全局研究导航', 'SEED and OpenEvo global research navigation')");
  });

  it('renders that same global navigation on the hub and every detail route', () => {
    expect(hub).toContain('<SeedOpenEvoResearchNav locale={locale} page="hub" />');
    expect(detail).toContain('<SeedOpenEvoResearchNav locale={locale} page={page} />');
    expect(hub).not.toContain('const pages = [');
    expect(detail).not.toContain('const pages = [');
    expect(detail).not.toContain('navIds');
    expect(detail).not.toContain('plain-detail__track-switch');
    expect(detail).not.toContain('独立方法框架');
  });

  it('keeps active state and responsive behavior identical instead of deleting entries', () => {
    expect(navigation).toContain("aria-current={item.id === page ? 'page' : undefined}");
    expect(navigation).toContain('overflow-x:auto');
    expect(navigation).toContain('@media(max-width:720px)');
    expect(navigation).not.toContain('page ===');
  });

  it('labels report navigation as local content rather than a second global tab bar', () => {
    expect(report).toContain("aria-label={t('报告目录', 'Report contents')}");
    expect(detail).toContain("content:'本页内容'");
    expect(detail).toContain("content:'On this page'");
  });
});
