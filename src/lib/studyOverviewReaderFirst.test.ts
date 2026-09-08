import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const overview = read('src/components/research/SeedOpenEvoStudyOverviewReaderFirst.astro');
const studyZh = read('src/pages/research/seed-openevo/study/index.astro');
const studyEn = read('src/pages/en/research/seed-openevo/study/index.astro');

describe('reader-first Study overview', () => {
  it('protects the accepted first-screen identity and provenance affordances', () => {
    for (const required of [
      'OpenEVO (Harness) · WebShop 数据集实验',
      '和 SEED 对照',
      'https://arxiv.org/abs/2607.14777',
      '训练资源与运行条件',
      '流程理解图：OpenEVO / SEED / WebShop',
      'TL;DR',
      '三个研究问题',
    ]) expect(overview).toContain(required);

    expect(studyZh).toContain('SeedOpenEvoStudyOverviewReaderFirst');
    expect(studyEn).toContain('SeedOpenEvoStudyOverviewReaderFirst');
    expect(studyZh).toContain('OpenEVO (Harness) · WebShop 数据集实验');
    expect(studyEn).toContain('OpenEVO (Harness) · WebShop dataset experiments');
  });

  it('keeps the current evidence and its scientific boundary visible', () => {
    for (const required of [
      '7B · 基础模型',
      '7B · 使用 OpenEVO 学习结果',
      '7.17',
      '8.74',
      '5 / 128',
      '95% CI [-3.21, +6.31]',
      '不能和上面两个 7B 分数直接比较',
      '现在不能宣布谁最终更强',
    ]) expect(overview).toContain(required);
  });

  it('keeps progressive disclosure without hiding claim-changing caveats', () => {
    const tldr = overview.indexOf('TL;DR');
    const questions = overview.indexOf('三个研究问题');
    const measurement = overview.indexOf('当前可直接比较的 7B 结果');
    const routes = overview.indexOf('研究入口');
    expect(tldr).toBeGreaterThanOrEqual(0);
    expect(tldr).toBeLessThan(questions);
    expect(questions).toBeLessThan(measurement);
    expect(measurement).toBeLessThan(routes);
    expect(overview).toContain('<details class="depth">');
    expect(overview).toContain('<details class="provenance">');
  });

  it('blocks presenter language and internal implementation vocabulary from returning', () => {
    for (const forbidden of [
      '先用一条线看懂',
      '先分清两种“新任务”',
      '三个研究问题怎样连起来',
      '语义 owner',
      'main benchmark',
      'WebShop 是一个文字购物环境：模型要根据用户需求搜索商品',
    ]) expect(overview).not.toContain(forbidden);
  });
});
