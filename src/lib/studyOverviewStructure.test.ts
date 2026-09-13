import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OPEN_EVO_EXPERIMENTS } from '../data/openEvoExperimentNavigation';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const studyZh = read('src/pages/research/seed-openevo/study/index.astro');
const studyEn = read('src/pages/en/research/seed-openevo/study/index.astro');
const designZh = read('src/pages/research/seed-openevo/study/design/index.astro');
const designEn = read('src/pages/en/research/seed-openevo/study/design/index.astro');
const overview = read('src/components/research/SeedOpenEvoStudyOverview.astro');
const experimentIndex = read('src/components/research/OpenEvoExperimentIndex.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const training = read('src/components/research/SeedOpenEvoTrainingDesignOverview.astro');

const formerHomepageOwners = [
  'OpenEvoExperimentGateway',
  'SeedOpenEvoTrainingDecisionLab',
  'OpenEvoFairComparisonExplainer',
  'OpenEvoNextExperimentProtocol',
];

describe('study overview information architecture', () => {
  it('keeps one canonical Study owner while preserving the accepted reader-first semantics', () => {
    for (const page of [studyZh, studyEn]) {
      expect(page).toContain('import OpenEvoExperimentIndex from');
      expect(page).toContain('<OpenEvoExperimentIndex locale={locale} />');
      expect(page).not.toContain('SeedOpenEvoStudyOverviewReaderFirst');
      for (const owner of formerHomepageOwners) expect(page).not.toContain(owner);
    }
    expect((experimentIndex.match(/<h1\b/g) ?? []).length).toBe(1);
    expect(OPEN_EVO_EXPERIMENTS.map((item) => item.title.zh)).toContain('训练跑了很久，但参数一直没有更新');
    expect(OPEN_EVO_EXPERIMENTS.map((item) => item.title.zh)).toContain('1.7B · DirectApply / No-GDR 实验');
    for (const required of [
      'OpenEVO (Harness) · WebShop 数据集实验',
      '和 SEED 对照',
      'https://arxiv.org/abs/2607.14777',
      'GitHub',
      '训练资源与运行条件',
      '流程理解图：OpenEVO / SEED / WebShop',
      'TL;DR',
      '三个研究问题',
      '当前可直接比较的 7B 结果',
      '7B · 基础模型',
      '7B · 使用 OpenEVO 学习结果',
      '7.17',
      '8.74',
      '5 / 128',
      '95% CI [-3.21, +6.31]',
      '不能和上面两个 7B 分数直接比较',
      '现在不能宣布谁最终更强',
      '研究入口',
    ]) expect(overview).toContain(required);

    for (const forbidden of [
      'Track A',
      '配对评测',
      '实验共同流程',
      '分数与阶段',
      'main benchmark',
      'MiniMax hindsight',
      '三个研究问题怎样连起来',
      'WebShop 是一个文字购物环境：模型要根据用户需求搜索商品',
    ]) expect(overview).not.toContain(forbidden);
  });

  it('keeps accepted provenance direct and orders depth after the reader answer', () => {
    const sourceLinks = overview.indexOf('class="source-links"');
    const tldr = overview.indexOf('TL;DR');
    const questions = overview.indexOf('三个研究问题');
    const measurement = overview.indexOf('当前可直接比较的 7B 结果');
    const routes = overview.indexOf('研究入口');
    expect(sourceLinks).toBeGreaterThanOrEqual(0);
    expect(sourceLinks).toBeLessThan(tldr);
    expect(tldr).toBeLessThan(questions);
    expect(questions).toBeLessThan(measurement);
    expect(measurement).toBeLessThan(routes);
    expect(overview).toContain('<details class="depth">');
    expect(overview).toContain('<details class="provenance">');
  });

  it('keeps page metadata aligned with the first-screen object identity', () => {
    expect(studyZh).toContain('OpenEVO (Harness) · WebShop 数据集实验');
    expect(studyEn).toContain('OpenEVO (Harness) · WebShop dataset experiments');
  });

  it('moves training design into the flow map and leaves the old route as a redirect', () => {
    expect(hub).toContain('id="training-design"');
    expect(hub).toContain('SeedOpenEvoTrainingDesignOverview');
    expect(training).toContain('Stage 1 责任边界');
    expect(training).toContain('当前 Stage 1 参数协议');
    expect(designZh).toContain('/research/seed-openevo/flow/#training-design');
    expect(designEn).toContain('/en/research/seed-openevo/flow/#training-design');
    expect(designZh).not.toContain('SeedOpenEvoTrainingDecisionLab');
    expect(designEn).not.toContain('SeedOpenEvoTrainingDecisionLab');
  });

  it('protects the scientific comparison boundary on the visible overview', () => {
    for (const phrase of [
      '训练分',
      '候选更新数量',
      '95% CI [-3.21, +6.31]',
      '不能证明稳定优势',
      '不能和上面两个 7B 分数直接比较',
      '还没有获得正式运行任务的授权',
    ]) expect(overview).toContain(phrase);
  });

  it('keeps the four semantic owners reachable without rebuilding them on Study', () => {
    for (const path of [
      '/research/seed-openevo/flow/',
      '/research/seed-openevo/study/run/',
      '/research/seed-openevo/study/capability-exploration/',
      '/research/seed-openevo/study/results/',
    ]) expect(overview).toContain(path);
    expect(overview).not.toContain("p('/research/seed-openevo/study/design/')");
  });

  it('records a dated public-state snapshot instead of treating progress as a final result', () => {
    expect(overview).toContain('data-study-checked="2026-09-07"');
    expect(overview).toContain('1ad894cfd76157b4f9ecde7e81351bd7564a1f65');
    expect(overview).toContain('下一阶段的 SEED 对照方案已经预先登记');
    expect(overview).toContain('不会把尚未封存的训练进度写成最终结果');
  });
});
