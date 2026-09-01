import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const detail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const lab = read('../components/research/SeedOpenEvoTrainingDecisionLab.astro');
const analysis = read('../components/research/OpenEvoExperimentAnalysisPlan.astro');
const studyZh = read('../pages/research/seed-openevo/study/index.astro');
const designZh = read('../pages/research/seed-openevo/study/design/index.astro');

describe('page heading ownership', () => {
  it('does not render the parent Results H1 when the Results hero owns the page heading', () => {
    expect(detail).toContain("page !== 'results'");
  });

  it('lets the design lab be H1 standalone and H2 when embedded', () => {
    expect(lab).toContain('headingLevel?: 1 | 2');
    expect(lab).toContain('headingLevel === 1');
    expect(studyZh).toContain('headingLevel={2}');
    expect(designZh).toContain('<SeedOpenEvoTrainingDecisionLab locale={locale} />');
  });

  it('keeps the analysis plan as a section under the results-page H1', () => {
    expect(analysis).toContain('<h2 class="analysis-hero__title">');
    expect(analysis).not.toContain('<h1>');
  });
});
