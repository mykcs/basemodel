import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) =>
  readFileSync(new URL(relative, import.meta.url), 'utf8');

describe('sitewide human-expression content application', () => {
  it('removes presenter-first headings from representative public surfaces', () => {
    const landscape = read('../components/landscape/LandscapePrototype.tsx');
    const q17 = read('../components/research/OpenEvoQ17DirectApplyAnalysis.astro');
    const acceleration = read('../components/research/OpenEvoSdLoraAccelerationContext.astro');
    const minimax = read('../pages/research/seed-openevo/study/minimax-teacher/index.astro');

    expect(landscape).toContain('四个研究决策字段');
    expect(landscape).not.toContain('先读懂四个字段');
    expect(q17).toContain('同类题的稳定性提升更明显，覆盖范围只小幅扩大');
    expect(q17).not.toContain('先变好的是');
    expect(acceleration).toContain('两条加速路线的封存结果');
    expect(minimax).toContain('教师能力需要在同一轨迹上直接比较');
    expect(minimax).not.toContain('MINIMAX-M3 × SEED-STYLE HINDSIGHT · H1.46');
  });
  it('keeps human labels above internal OpenEvo vocabulary across shared diagrams', () => {
    const framework = read('../components/research/OpenEvoFrameworkDiagram.astro');
    const comparison = read('../components/research/SeedOpenEvoComparisonDiagram.astro');
    const canonical = read('../components/research/SeedOpenEvoCanonicalFigure.astro');
    const interactive = read('../components/research/explainer/MethodExplainers.tsx');

    expect(framework).toContain("t('已封存证据','SEALED EVIDENCE')");
    expect(framework).toContain("t('演化方法','EVOLUTION METHOD')");
    expect(framework).toContain("t('下一版本','SUCCESSOR REVISION')");
    expect(comparison).toContain("t('任务边界','BOUNDARY')");
    expect(canonical).toContain("t('任务完成边界','TASK BOUNDARY')");
    expect(interactive).toContain("role={zh ? '演化方法' : 'EVOLUTION METHOD'}");
    expect(interactive).toContain("zh ? '验证门' : 'VALIDATION GATE'");
  });
  it('humanizes run-state codes without deleting audit identity', () => {
    const q17 = read('../components/research/OpenEvoQ17DirectApplyAnalysis.astro');
    const textMemory = read('../components/research/OpenEvoTextMemoryPlan.astro');
    const result = read('../components/research/OpenEvoWebShopResultNote.astro');

    expect(q17).toContain('保持旧 Memory、不更新（NOOP / KEEP_PRIOR）');
    expect(textMemory).toContain('保持旧笔记、不更新（NOOP）');
    expect(result).toContain('测量无效（MEASUREMENT_INVALID）');
    expect(result).toContain('重新测量仍无效（REMEASUREMENT_INVALID）');
  });

  it('preserves legitimate research questions and removes obsolete site positioning', () => {
    const resultsQuestion = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
    const og = read('../../public/og-cover.svg');

    expect(resultsQuestion).toContain('怎样才算和 SEED 公平比较');
    expect(og).not.toContain('Agent Foundation Model Atlas');
    expect(og).toContain('Base Model · SEED × OpenEvo');
  });
});
