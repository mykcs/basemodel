import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readerContractForRoute } from '../data/siteReaderContracts';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const home = read('../pages/_bodies/home-v2.astro');
const study = read('../components/research/OpenEvoExperimentIndex.astro');
const nav = read('../components/research/SeedOpenEvoResearchNav.astro');

describe('B01 reader entry journeys', () => {
  it('gives four explicit continuation intents on home without inventing another navigation system', () => {
    for (const label of ['第一次来', '只想看结论', '隔一阵回来', '准备继续实验']) {
      expect(home).toContain(label);
    }
    expect(home).toContain("href: p('/research/seed-openevo/flow/')");
    expect(home).toContain("href: p('/research/seed-openevo/study/results/')");
    expect(home).toContain("#reader-entry");
    expect(home).toContain("href: p('/research/seed-openevo/study/run/')");
    expect(nav).toContain("href: p('/research/seed-openevo/study/')");
  });

  it('lets Study readers choose background, current conclusions, or the latest question before the full directory', () => {
    for (const required of [
      'data-reader-entry',
      '我们真正想回答的是',
      '第一次来',
      '只想看当前结论',
      '隔一阵回来',
      '七次实验怎样一步步把问题缩小',
      'id="experiment-directory"',
    ]) expect(study).toContain(required);

    expect(study).toContain("href: p('/research/seed-openevo/flow/')");
    expect(study).toContain("href: p('/research/seed-openevo/study/results/')");
    expect(study).toContain('const latestExperiment = OPEN_EVO_EXPERIMENTS.at(-1)!;');
    expect(study).toContain('href: p(latestExperiment.primaryHref)');
  });

  it('keeps moving measurements with Results instead of copying them into the Study entry', () => {
    for (const duplicatedMovingResult of ['7.17', '8.74', '95% CI [-3.21, +6.31]']) {
      expect(study).not.toContain(duplicatedMovingResult);
    }
    expect(study).toContain('当前结论与限制由 Results 页维护');
    expect(study).toContain('不复制训练期分数');
  });

  it('updates the existing Reader Contracts instead of adding a competing contract store', () => {
    const homeContract = readerContractForRoute('/');
    expect(homeContract?.nextStep).toContain('第一次来');
    expect(homeContract?.nextStep).toContain('隔一阵回来');

    const studyContract = readerContractForRoute('/research/seed-openevo/study/');
    expect(studyContract?.primaryTask).toContain('补背景');
    expect(studyContract?.primaryTask).toContain('最新研究问题');
    expect(studyContract?.firstViewportGoal).toContain('三个互不混淆的入口');
    expect(studyContract?.mustStayVisible).toContain('Results 页维护');
    expect(studyContract?.firstViewportSelector).toBe('.study-hero__lede');
    expect(studyContract?.firstViewportBudget?.maxInteractive).toBe(4);
    expect(studyContract?.firstViewportBudget?.maxHeadings).toBe(1);
  });
});
