import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  OPEN_EVO_CROSS_EXPERIMENT_RESULTS_ROUTE,
  OPEN_EVO_EXPERIMENTS,
  OPEN_EVO_METHOD_BACKGROUND_ROUTE,
  OPEN_EVO_SECONDARY_ROUTES,
  OPEN_EVO_CANONICAL_ROUTE_OWNERS,
} from '../data/openEvoExperimentNavigation';

const source = readFileSync(new URL('../components/research/OpenEvoExperimentIndex.astro', import.meta.url), 'utf8');

describe('experiment-first Study index', () => {
  it('renders from one machine-readable experiment navigation owner', () => {
    expect(OPEN_EVO_EXPERIMENTS).toHaveLength(5);
    expect(new Set(OPEN_EVO_EXPERIMENTS.map((item) => item.id)).size).toBe(5);
    expect(source).toContain("from '../../data/openEvoExperimentNavigation'");
    expect(source).toContain('OPEN_EVO_EXPERIMENTS.map');
    expect(source).toContain('experiment.childLinks.map');
    expect(source).toContain('data-experiment-primary={experiment.id}');
    expect(source).toContain('.experiment-node p,.experiment-children{display:none}');
    expect(source).toContain('experiment.childLinks.filter((child) => child.mobileFeatured)');
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

  it('keeps GDR-v1 attached to its frozen result and current recurrent-rule mechanism without reclaiming Vanilla Flow ownership', () => {
    const gdr = OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gdr-v1-1p7b');
    expect(gdr?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/gdr-directapply/');
    expect(gdr?.childLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: 'result', href: '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/' }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/gdr-directapply/' }),
      expect.objectContaining({ role: 'mechanism', href: '/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/' }),
    ]));
    expect(gdr?.childLinks.some((link) => link.href.endsWith('/vanilla-sd-lora/'))).toBe(false);
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS['vanilla-sd-lora']).toBeUndefined();
    const readerContracts = readFileSync(new URL('../data/siteReaderContracts.ts', import.meta.url), 'utf8');
    expect(readerContracts).toContain("c('flow-sd-lora', '/research/seed-openevo/flow/sd-lora/'");
    expect(readerContracts).toContain("redirectsTo: '/research/seed-openevo/flow/sd-lora/'");

    const gdrExplainer = readFileSync(new URL('../components/research/OpenEvoGdrDirectApplyExplainer.astro', import.meta.url), 'utf8');
    expect(gdrExplainer).toContain('44 个候选更新，只有 7 个真正改到了后续模型');
    expect(gdrExplainer).not.toContain('id="recurrence"');
    const currentGatedDelta = readFileSync(new URL('../components/research/OpenEvoGatedDeltaSdLoraExplainer.astro', import.meta.url), 'utf8');
    expect(currentGatedDelta).toContain('Gated Delta 的 State 更新');
    expect(currentGatedDelta).toContain('四轮 Vanilla vs GDR 配对实验已经全部封存');
    expect(currentGatedDelta).toContain('不是“GDR 对所有设置都更好”');

    const frozenResult = readFileSync(new URL('../components/research/OpenEvoSuccessorReport.astro', import.meta.url), 'utf8');
    expect(frozenResult).toContain('1.7B 最终测试 37.60 分');
    expect(frozenResult).toContain('1/128');

    const vanilla = readFileSync(new URL('../components/research/OpenEvoVanillaSdLoraMechanism.astro', import.meta.url), 'utf8');
    expect(vanilla).toContain('LoRA 训练出来了，不等于下一轮真的用了它');
    expect(vanilla).toContain('44 个候选');
  });

  it('keeps DirectApply attached to its full run, same-task check, SD-LoRA history, Text Memory, and D1 diagnostics', () => {
    const directApply = OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'directapply-1p7b');
    expect(directApply?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/');
    expect(directApply?.childLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/' }),
      expect.objectContaining({ role: 'diagnostic', href: '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/' }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/sd-lora-scaling/' }),
      expect.objectContaining({ role: 'analysis', label: expect.objectContaining({ zh: 'SD-LoRA v2：约 2× 加速与 WebShop 验证' }), href: '/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/', mobileFeatured: true }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/sd-lora-history/' }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/text-memory/' }),
      expect.objectContaining({ role: 'analysis', href: '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/#geometry' }),
      expect.objectContaining({ role: 'diagnostic', href: '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/#function' }),
    ]));

    const analysis = readFileSync(new URL('../components/research/OpenEvoQ17DirectApplyAnalysis.astro', import.meta.url), 'utf8');
    expect(analysis).toContain('完整跑完 160 轮、20,480 次 WebShop 尝试和 159 次 SD-LoRA 参数更新');
    expect(analysis).toContain('id="geometry"');
    expect(analysis).toContain('id="function"');
    expect(analysis).toContain('D1_FAIL_FUNCTION_NOT_PRESERVED');

    const historySeries = readFileSync(new URL('../components/research/OpenEvoSdLoraHistorySkeleton.astro', import.meta.url), 'utf8');
    expect(historySeries).toContain('没有完成的科学实验不会提前写成结论');
  });

  it('keeps Results as a cross-experiment index rather than a second owner of the five experiment bodies', () => {
    const experimentOwnedHrefs = OPEN_EVO_EXPERIMENTS.flatMap((experiment) => [
      experiment.primaryHref,
      experiment.evidenceLink.href,
      ...experiment.childLinks.map((link) => link.href),
    ]);
    expect(experimentOwnedHrefs.every((href) => !href.startsWith('/research/seed-openevo/study/results/'))).toBe(true);
    expect(Object.keys(OPEN_EVO_CANONICAL_ROUTE_OWNERS).every((route) => !route.startsWith('results'))).toBe(true);
    expect(OPEN_EVO_CROSS_EXPERIMENT_RESULTS_ROUTE).toEqual({
      id: 'cross-experiment-results',
      label: { zh: '跨实验结果索引', en: 'Cross-experiment results index' },
      href: '/research/seed-openevo/study/results/',
    });
    expect(OPEN_EVO_SECONDARY_ROUTES[1]).toEqual(OPEN_EVO_CROSS_EXPERIMENT_RESULTS_ROUTE);
    expect(source).toContain('data-secondary-route={item.id}');

    const resultsZh = readFileSync(new URL('../pages/research/seed-openevo/study/results.astro', import.meta.url), 'utf8');
    const resultsEn = readFileSync(new URL('../pages/en/research/seed-openevo/study/results.astro', import.meta.url), 'utf8');
    expect(resultsZh).not.toContain('openEvoExperimentNavigation');
    expect(resultsEn).not.toContain('openEvoExperimentNavigation');
  });

  it('keeps system/method flow outside the experiment history tree', () => {
    const experimentOwnedHrefs = OPEN_EVO_EXPERIMENTS.flatMap((experiment) => [
      experiment.primaryHref,
      experiment.evidenceLink.href,
      ...experiment.childLinks.map((link) => link.href),
    ]);
    expect(experimentOwnedHrefs.every((href) => !href.startsWith('/research/seed-openevo/flow/'))).toBe(true);
    expect(OPEN_EVO_METHOD_BACKGROUND_ROUTE.href).toBe('/research/seed-openevo/flow/');
    expect(OPEN_EVO_SECONDARY_ROUTES[0]).toEqual(OPEN_EVO_METHOD_BACKGROUND_ROUTE);

    const contextSource = readFileSync(new URL('../components/research/ResearchRouteContext.astro', import.meta.url), 'utf8');
    expect(contextSource).toContain('data-hub-method-background');
    expect(contextSource).toContain('OPEN_EVO_METHOD_BACKGROUND_ROUTE');
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
    expect(allChildren.some((child) => child.href.endsWith('/sd-lora-equivalence/'))).toBe(true);
    expect(allChildren.every((child) => child.role !== undefined)).toBe(true);
    expect(OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gdr-v1-1p7b')?.lineageNote?.zh)
      .toContain('同时属于上一项 3B + 1.7B 后继实验');
    expect(OPEN_EVO_SECONDARY_ROUTES).toHaveLength(3);
  });
});
