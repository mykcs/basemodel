import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const studyZh = read('src/pages/research/seed-openevo/study/index.astro');
const studyEn = read('src/pages/en/research/seed-openevo/study/index.astro');
const designZh = read('src/pages/research/seed-openevo/study/design/index.astro');
const designEn = read('src/pages/en/research/seed-openevo/study/design/index.astro');
const overview = read('src/components/research/SeedOpenEvoStudyOverview.astro');

const formerHomepageOwners = [
  'OpenEvoExperimentGateway',
  'SeedOpenEvoTrainingDecisionLab',
  'OpenEvoFairComparisonExplainer',
  'OpenEvoNextExperimentProtocol',
];

describe('study overview information architecture', () => {
  it('keeps the overview as one research argument instead of embedding whole detail pages', () => {
    for (const page of [studyZh, studyEn]) {
      expect(page).toContain('SeedOpenEvoStudyOverview');
      for (const owner of formerHomepageOwners) expect(page).not.toContain(owner);
    }
    expect((overview.match(/<h1\b/g) ?? []).length).toBe(1);
    expect(overview).toContain('OpenEVO (Harness) · WebShop 数据集实验');
    expect(overview).toContain('OpenEVO · 7B 配对评测');
    expect(overview).not.toContain('Track A');
    expect(overview).toContain('TL;DR');
    expect(overview).toContain('三个研究问题');
    expect(overview).toContain('实验共同流程');
    expect(overview).toContain('分数与阶段');
    expect(overview).toContain('当前结论');
    expect(overview).toContain('下一步科学问题');
    expect(overview).toContain('https://arxiv.org/abs/2607.14777');
    expect(overview).toContain('/research/seed-openevo/flow/');
    expect(overview).not.toContain('OpenEvo × SEED：WebShop 研究');
    expect(overview).not.toContain('三个研究问题怎样连起来');
    expect(overview).not.toContain('WebShop 是一个文字购物环境：模型要根据用户需求搜索商品');

    const tldr = overview.indexOf('TL;DR');
    const questions = overview.indexOf('三个研究问题');
    const flow = overview.indexOf('实验共同流程');
    const scores = overview.indexOf('分数与阶段');
    expect(tldr).toBeLessThan(questions);
    expect(questions).toBeLessThan(flow);
    expect(flow).toBeLessThan(scores);
  });

  it('keeps page metadata aligned with the first-screen object identity', () => {
    expect(studyZh).toContain('OpenEVO (Harness) · WebShop 数据集实验');
    expect(studyEn).toContain('OpenEVO (Harness) · WebShop dataset experiments');
  });

  it('moves training-design depth to the canonical design route', () => {
    expect(designZh).toContain('SeedOpenEvoTrainingDecisionLab');
    expect(designZh).toContain('OpenEvoFairComparisonExplainer');
    expect(designZh).toContain('OpenEvoNextExperimentProtocol');
    expect(designEn).toContain('SeedOpenEvoTrainingDecisionLab');
    expect(designEn).toContain('OpenEvoFairComparisonExplainer');
  });

  it('protects scientific wording boundaries on the visible overview', () => {
    for (const phrase of [
      '候选更新',
      '正式应用',
      '训练分',
      'final',
      '观察：',
      '支持：',
      '不能证明：',
      '不能和上面的 8.74 直接相减',
      'activation_authority=false',
    ]) expect(overview).toContain(phrase);
  });

  it('keeps all four deep routes reachable from the overview', () => {
    for (const path of [
      '/research/seed-openevo/study/design/',
      '/research/seed-openevo/study/run/',
      '/research/seed-openevo/study/capability-exploration/',
      '/research/seed-openevo/study/results/',
    ]) expect(overview).toContain(path);
  });

  it('records a dated public-state snapshot instead of treating old counters as live truth', () => {
    expect(overview).toContain('data-study-checked="2026-09-07"');
    expect(overview).toContain('1ad894cfd76157b4f9ecde7e81351bd7564a1f65');
    expect(overview).toContain('exec/stage2-shared-final-freeze-202609050041');
    expect(overview).toContain('不复制聊天记录里的历史 Rxx 进度');
  });
});
