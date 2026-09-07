import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const detail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const lab = read('../components/research/SeedOpenEvoTrainingDecisionLab.astro');
const overview = read('../components/research/SeedOpenEvoStudyOverview.astro');
const analysis = read('../components/research/OpenEvoExperimentAnalysisPlan.astro');
const studyZh = read('../pages/research/seed-openevo/study/index.astro');
const designZh = read('../pages/research/seed-openevo/study/design/index.astro');

describe('page heading ownership', () => {
  it('does not render the parent Results H1 when the Results hero owns the page heading', () => {
    expect(detail).toContain("page !== 'results'");
  });

  it('gives the study overview one H1 and keeps the design lab standalone on its canonical route', () => {
    expect((overview.match(/<h1\b/g) ?? []).length).toBe(1);
    expect(studyZh).toContain('SeedOpenEvoStudyOverview');
    expect(studyZh).not.toContain('SeedOpenEvoTrainingDecisionLab');
    expect(lab).toContain('headingLevel?: 1 | 2');
    expect(lab).toContain('headingLevel === 1');
    expect(designZh).toContain('<SeedOpenEvoTrainingDecisionLab locale={locale} />');
  });

  it('names analysis subjects directly instead of using narrative fork or host-language headings', () => {
    expect(analysis).toContain('7B 无外部教师实验的后续分析');
    expect(analysis).toContain('3B / 7B × self / MiniMax 的四组比较');
    expect(analysis).toContain('Stage 1 的两项设计选择');
    expect(analysis).not.toContain('Stage 1 设计分岔');
    expect(analysis).not.toContain('四组实验怎样一起回答问题？');
  });

  it('keeps the analysis plan as a section under the results-page H1', () => {
    expect(analysis).toContain('<h2 class="analysis-hero__title">');
    expect(analysis).not.toContain('<h1>');
  });
});
