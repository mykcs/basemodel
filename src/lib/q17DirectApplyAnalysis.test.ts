import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const component = read('../components/research/OpenEvoQ17DirectApplyAnalysis.astro');
const contracts = read('../data/siteReaderContracts.ts');
const routes = read('../data/capabilityReaderRoutes.ts');
const sitemap = read('./sitemapRoutes.ts');
const lobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const zhPage = read('../pages/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/index.astro');

describe('Q17 DirectApply complete analysis page', () => {
  it('publishes a bilingual canonical route with reader ownership', () => {
    for (const text of [zhPage, enPage]) expect(text).toContain('q17-directapply-analysis');
    expect(contracts).toContain("c('capability-q17-directapply-analysis'");
    expect(routes).toContain('"route": "q17-directapply-analysis"');
    expect(sitemap).toContain("'/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/'");
    expect(lobby).toContain('directApplyAnalysisHref');
  });

  it('keeps training, frozen final, and D1 as distinct evidence layers', () => {
    expect(component).toContain('R159');
    expect(component).toContain('60.716');
    expect(component).toContain('50 / 128');
    expect(component).toContain('D1_FAIL_FUNCTION_NOT_PRESERVED');
    expect(component).toContain('159');
    expect(component).toContain('78 / 159');
    expect(component).toContain('4.15%');
  });

  it('shows all three compression candidates and preregistered preservation thresholds', () => {
    for (const token of ['K64', 'K80', 'K96', '87.5', '90.625', '96.875', '≤ 1e-4', '≤ 0.05', '≤ 0.01']) {
      expect(component).toContain(token);
    }
    expect(component).toContain('newInvalid: 2');
    expect(component).toContain('newInvalid: 0');
  });

  it('protects the scientific boundaries that change interpretation', () => {
    expect(component).toContain('different frozen panels');
    expect(component).toContain('rerun_authorized=false');
    expect(component).toContain('did not modify R159');
    expect(component).toContain('one DirectApply trajectory plus one final measurement');
  });
});
