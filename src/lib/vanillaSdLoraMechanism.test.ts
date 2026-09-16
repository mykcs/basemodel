import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { VANILLA_SD_LORA_MECHANISM as facts } from '../data/vanillaSdLoraMechanism';
import { bilingualStaticPaths } from './sitemapRoutes';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const component = read('../components/research/OpenEvoVanillaSdLoraMechanism.astro');
const slide = read('../components/research/OpenEvoVanillaSdLoraSlide.astro');
const seriesNav = read('../components/research/OpenEvoSdLoraHistorySeriesNav.astro');
const projectionSource = `${slide}\n${component}`;
const readerContracts = read('../data/siteReaderContracts.ts');
const zhPage = read('../pages/research/seed-openevo/flow/sd-lora/index.astro');
const enPage = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/flow/sd-lora/index.astro.archive');
const zhCompatibilityPage = read('../pages/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro');
const enCompatibilityPage = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro.archive');

describe('Vanilla SD-LoRA mechanism projection', () => {
  it('pins the Q17 mechanism facts used by the reader-facing diagram', () => {
    expect(facts.authority.q17ExecutionSha).toBe('ac130148ee08b6462d9728e482a858fe5f514047');
    expect(facts.round).toMatchObject({ taskCount: 16, rolloutsPerTask: 8, rolloutCount: 128 });
    expect(facts.selection.rule).toBe('earliest clean exact success per distinct task identity');
    expect(facts.selection).toMatchObject({ traceStepsMin: 2, traceStepsMax: 15, maxTraceExamples: 240, maxRecords: 256 });
    expect(facts.trainer).toMatchObject({ rank: 8, learningRate: 2e-4, coefficientLearningRate: 1e-2, epochs: 1, replayCapacity: 64, maxLength: 2048, dtype: 'bfloat16', seed: 1993 });
    expect(facts.state).toMatchObject({ paperEquivalent: false, rehearsalFree: false, routingMode: 'single_cumulative_adapter', retentionStrategy: 'bounded_trajectory_replay', effectiveRankLimit: 4096 });
  });

  it('keeps the visual mainline on one SD-LoRA round rather than an OpenEvo system overview', () => {
    for (const phrase of [
      '16 个任务 × 每题 8 次',
      '每个任务只取最早一条通过全部检查的成功',
      '最多带回 64 条旧经验',
      'Dₜ ← BₜAₜ',
      'α₁ · α₂ · … · αₜ',
      'ΔWₜ = Σ αᵢDᵢ',
      '先得到一份候选 LoRA',
      'SD-LoRA 训练到这里结束',
    ]) expect(projectionSource).toContain(phrase);
    expect(component).toContain('过去所有任务尝试不会整批混进来');
    expect(component).toContain('这些是接下来要测的风险，目前还不能说它们就是已经发生的故障原因');
  });

  it('keeps paper semantics separate from the OpenEvo language-agent adaptation', () => {
    expect(component).toContain('paper_equivalent=false');
    expect(component).toContain('rehearsal_free=false');
    expect(component).toContain('single_cumulative_adapter');
    expect(component).toContain('bounded_trajectory_replay');
    expect(component).toContain('不是 ICLR 2025 vision protocol 的逐项复刻');
  });

  it('registers the live Chinese route, archived English source, and reader ownership', () => {
    const route = '/research/seed-openevo/flow/sd-lora/';
    expect(bilingualStaticPaths).toContain(route);
    expect(readerContracts).toContain("c('flow-sd-lora', '/research/seed-openevo/flow/sd-lora/'");
    expect(zhPage).toContain('<OpenEvoVanillaSdLoraMechanism locale={locale} />');
    expect(enPage).toContain('<OpenEvoVanillaSdLoraMechanism locale={locale} />');
    expect(enPage).toContain('title="Why does OpenEvo need SD-LoRA?"');
    for (const phrase of [
      'SD-LoRA: how successful traces become a candidate LoRA update',
      'LoRA freezes the base model and trains only a small set of adapter parameters',
      'keeping only the earliest fully checked success per task',
      'Ordinary LoRA',
      'Scalable Decoupled LoRA',
      'This page calls the current baseline “Vanilla SD-LoRA.”',
    ]) expect(component).toContain(phrase);
    expect(zhCompatibilityPage).toContain("const target = '/research/seed-openevo/flow/sd-lora/'");
    expect(enCompatibilityPage).toContain("const target = '/en/research/seed-openevo/flow/sd-lora/'");
    expect(seriesNav).toContain("const vanillaCanonical = '/research/seed-openevo/flow/sd-lora'");
    expect(seriesNav).toContain("neutral === vanillaCanonical ? 'vanilla-sd-lora'");
    expect(seriesNav).toContain("route === 'vanilla-sd-lora' ? `${vanillaCanonical}/`");
  });
});
