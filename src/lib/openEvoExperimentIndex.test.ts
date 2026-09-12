import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  OPEN_EVO_EXPERIMENTS,
  OPEN_EVO_SECONDARY_ROUTES,
} from '../data/openEvoExperimentNavigation';

const source = readFileSync(new URL('../components/research/OpenEvoExperimentIndex.astro', import.meta.url), 'utf8');

describe('experiment-first Study index', () => {
  it('renders from one machine-readable experiment navigation owner', () => {
    expect(OPEN_EVO_EXPERIMENTS).toHaveLength(5);
    expect(new Set(OPEN_EVO_EXPERIMENTS.map((item) => item.id)).size).toBe(5);
    expect(source).toContain("from '../../data/openEvoExperimentNavigation'");
    expect(source).toContain('OPEN_EVO_EXPERIMENTS.map');
    expect(source).toContain('experiment.childLinks.map');
  });

  it('keeps the historical gate-failure experiment attached to its blocked-update analysis and first-run evidence', () => {
    const gateFailure = OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gate-no-update');
    expect(gateFailure?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/stage2-256-window/');
    expect(gateFailure?.childLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/stage2-256-window/' }),
      expect.objectContaining({ role: 'history', href: '/research/seed-openevo/study/capability-exploration/first-run/' }),
    ]));
  });

  it('keeps the 7B long run attached to its sealed result and SD-LoRA parameter analysis', () => {
    const longRun = OPEN_EVO_EXPERIMENTS.find((item) => item.id === '7b-long-run');
    expect(longRun?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/stage2-ceiling/');
    expect(longRun?.childLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: 'result', href: '/research/seed-openevo/study/capability-exploration/stage2-ceiling/' }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/' }),
    ]));
    const parameterAnalysis = readFileSync(new URL('../components/research/OpenEvo7BStage2AnalysisMap.astro', import.meta.url), 'utf8');
    expect(parameterAnalysis).toContain('7B 已发生真实参数更新');
    expect(parameterAnalysis).toContain('SD-LoRA 参数更新');
  });

  it('keeps the 3B + 1.7B successor attached to its overview, report, exploration, and Harness interface diagnostic', () => {
    const successor = OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'successor-3b-1p7b');
    expect(successor?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/openevo-2-0/');
    expect(successor?.childLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: 'result', href: '/research/seed-openevo/study/capability-exploration/openevo-2-0/' }),
      expect.objectContaining({ role: 'evidence', href: '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/' }),
      expect.objectContaining({ role: 'diagnostic', href: '/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/' }),
      expect.objectContaining({ role: 'diagnostic', href: '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/' }),
    ]));

    const harnessStudy = readFileSync(new URL('../components/research/OpenEvoHarness2MiniStudy.astro', import.meta.url), 'utf8');
    expect(harnessStudy).toContain('购物接口的历史对照实验');
    expect(harnessStudy).toContain('正式 Stage 2');
  });

  it('keeps GDR-v1 attached to its frozen result, 44-to-7 analysis, candidate mechanism, and original-rule distinction', () => {
    const gdr = OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gdr-v1-1p7b');
    expect(gdr?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/gdr-directapply/');
    expect(gdr?.childLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: 'result', href: '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/' }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/gdr-directapply/' }),
      expect.objectContaining({ role: 'mechanism', href: '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/' }),
      expect.objectContaining({ role: 'mechanism', href: '/research/seed-openevo/study/capability-exploration/gdr-directapply/#original-gated-delta' }),
    ]));

    const gdrExplainer = readFileSync(new URL('../components/research/OpenEvoGdrDirectApplyExplainer.astro', import.meta.url), 'utf8');
    expect(gdrExplainer).toContain('44 个 SD-LoRA candidate');
    expect(gdrExplainer).toContain('id="original-gated-delta"');
    expect(gdrExplainer).toContain('原始 Gated Delta Rule');

    const frozenResult = readFileSync(new URL('../components/research/OpenEvoSuccessorReport.astro', import.meta.url), 'utf8');
    expect(frozenResult).toContain('1.7B 最终测试 37.60 分');
    expect(frozenResult).toContain('1/128');

    const vanilla = readFileSync(new URL('../components/research/OpenEvoVanillaSdLoraMechanism.astro', import.meta.url), 'utf8');
    expect(vanilla).toContain('候选参数训练完成');
    expect(vanilla).toContain('44 个候选');
  });

  it('keeps the five experiment parents and key lineage/analysis children', () => {
    const titles = OPEN_EVO_EXPERIMENTS.map((item) => item.title.zh);
    expect(titles).toEqual([
      '训练跑了很久，但参数一直没有更新',
      '7B 长周期实验',
      '3B + 1.7B 后继实验',
      '1.7B · GDR-v1 实验',
      '1.7B · DirectApply / No-GDR 实验',
    ]);    const allChildren = OPEN_EVO_EXPERIMENTS.flatMap((item) => item.childLinks);
    expect(allChildren.some((child) => child.label.zh === 'SD-LoRA 为什么越来越慢')).toBe(true);
    expect(allChildren.every((child) => child.role !== undefined)).toBe(true);
    expect(OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gdr-v1-1p7b')?.lineageNote?.zh)
      .toContain('同时属于上一项 3B + 1.7B 后继实验');
    expect(OPEN_EVO_SECONDARY_ROUTES).toHaveLength(3);
  });
});
