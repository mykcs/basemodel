import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const navigation = read('src/components/research/SeedOpenEvoResearchNav.astro');
const missionRibbon = read('src/components/research/SeedOpenEvoMissionRibbon.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const detail = read('src/components/research/SeedOpenEvoResearchDetail.astro');
const report = read('src/components/research/OpenEvoWebShopProgramReport.astro');
const resultsZh = read('src/pages/research/seed-openevo/results.astro');
const resultsEn = read('src/pages/en/research/seed-openevo/results.astro');

const orderedIds = [
  "id: 'hub'",
  "id: 'base-model'",
  "id: 'seed'",
  "id: 'openevo'",
  "id: 'benchmarks'",
  "id: 'webshop'",
  "id: 'alfworld'",
  "id: 'loops'",
  "id: 'run'",
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
    expect(navigation).toContain("t('运行实验', 'Run experiment')");
    expect(navigation).toContain("t('实验结果', 'Experiment results')");
  });

  it('renders that same global navigation on the hub, every detail route, and the experiment guide bridge', () => {
    expect(hub).toContain('<SeedOpenEvoResearchNav locale={locale} page="hub" />');
    expect(detail).toContain('<SeedOpenEvoResearchNav locale={locale} page={page} />');
    expect(missionRibbon).toContain("import SeedOpenEvoResearchNav from './SeedOpenEvoResearchNav.astro';");
    expect(missionRibbon).toContain('<SeedOpenEvoResearchNav locale={locale} page={page} />');
    expect(missionRibbon).toContain("exact('/guide/openevo-webshop-alfworld') ? 'run'");
    expect(missionRibbon).not.toContain('const steps = [');
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

  it('keeps the shared site header visible on both report routes', () => {
    for (const resultsPage of [resultsZh, resultsEn]) {
      expect(resultsPage).not.toContain('body:has([data-program-report]) .site-header,');
      expect(resultsPage).toContain('body:has([data-program-report]) .site-footer,');
    }
  });
});
