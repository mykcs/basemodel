import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const navigation = read('src/components/research/SeedOpenEvoResearchNav.astro');
const layout = read('src/layouts/AppLayout.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const detail = read('src/components/research/SeedOpenEvoResearchDetail.astro');
const hero = read('src/components/research/OpenEvoWebShopResultsHero.astro');
const resultsZh = read('src/pages/research/seed-openevo/study/results.astro');
const resultsEn = read('src/pages/en/research/seed-openevo/study/results.astro');

const flowIds = [
  "id: 'hub'",
  "id: 'base-model'",
  "id: 'seed'",
  "id: 'openevo'",
  "id: 'benchmarks'",
  "id: 'webshop'",
  "id: 'alfworld'",
  "id: 'loops'",
];

const studyIds = [
  "id: 'experiment'",
  "id: 'run'",
  "id: 'results'",
];

describe('SEED × OpenEvo research navigation', () => {
  it('splits the local navigation into the same two journeys as the site header', () => {
    let previous = navigation.indexOf('const flowPages = [');
    for (const token of flowIds) {
      const position = navigation.indexOf(token);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }

    previous = navigation.indexOf('const studyPages = [');
    for (const token of studyIds) {
      const position = navigation.indexOf(token);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }

    expect(navigation).toContain("const pages = currentTrack === 'flow' ? flowPages : studyPages;");
    expect(navigation).toContain('data-research-track={currentTrack}');
    expect(navigation).toContain("label: t('流程理解图', 'Flow map')");
    expect(navigation).toContain("label: t('OpenEvo × WebShop 科学研究', 'OpenEvo × WebShop study')");
    expect(navigation).toContain("t('实验流程', 'Experiment workflow')");
    expect(navigation).toContain("t('运行实验', 'Run experiment')");
    expect(navigation).toContain("t('研究结果', 'Research findings')");
    expect(navigation).not.toContain("t('研究导航', 'Research navigation')");
    expect(navigation).not.toContain('const pages = [');
  });

  it('mounts the same canonical nav on research pages and both bridge routes', () => {
    expect(hub).toContain('<SeedOpenEvoResearchNav locale={locale} page="hub" />');
    expect(detail).toContain('<SeedOpenEvoResearchNav locale={locale} page={page} />');
    expect(layout).toContain("import SeedOpenEvoResearchNav from '../components/research/SeedOpenEvoResearchNav.astro';");
    expect(layout).toContain("exactRoute('/research/seed-openevo/study') ? 'experiment'");
    expect(layout).toContain("exactRoute('/research/seed-openevo/study/run') ? 'run'");
    expect(layout).toContain('<SeedOpenEvoResearchNav locale={locale} page={researchBridgePage} />');
    expect(layout).toContain("pathNoBase.replace(/^\\/en(\\/|$)/, '/')");
    expect(hub).not.toContain('const pages = [');
    expect(detail).not.toContain('const pages = [');
    expect(detail).not.toContain('navIds');
    expect(detail).not.toContain('plain-detail__track-switch');
    expect(detail).not.toContain('独立方法框架');
  });

  it('keeps active state and responsive behavior while changing only the contextual child set', () => {
    expect(navigation).toContain("aria-current={item.id === page ? 'page' : undefined}");
    expect(navigation).toContain('overflow-x:auto');
    expect(navigation).toContain('@media(max-width:720px)');
    expect(navigation).not.toContain('page ===');
  });

  it('labels Results navigation by the research content rather than report filing language', () => {
    expect(hero).toContain("aria-label={t('研究结果导航', 'Research results navigation')}");
    expect(hero).not.toContain("aria-label={t('报告目录', 'Report contents')}");
    expect(detail).toContain("content:'本页内容'");
    expect(detail).toContain("content:'On this page'");
  });

  it('keeps the shared site header visible while both results routes share the unified modules', () => {
    for (const resultsPage of [resultsZh, resultsEn]) {
      expect(resultsPage).not.toContain('body:has([data-program-report]) .site-header,');
      expect(resultsPage).not.toContain('body:has([data-program-report]) .site-footer,');
      expect(resultsPage).not.toContain('data-program-report');
      expect(resultsPage).toContain("body:has([data-testid='openevo-webshop-result-index']) .plain-detail__header");
      expect(resultsPage).toContain('data-testid="openevo-webshop-result-index"');
    }
  });
});