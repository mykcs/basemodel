import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { VANILLA_SD_LORA_MECHANISM as facts } from '../data/vanillaSdLoraMechanism';
import { CAPABILITY_READER_ROUTES } from '../data/capabilityReaderRoutes';
import { bilingualStaticPaths } from './sitemapRoutes';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const component = read('../components/research/OpenEvoVanillaSdLoraMechanism.astro');
const slide = read('../components/research/OpenEvoVanillaSdLoraSlide.astro');
const projectionSource = `${slide}\n${component}`;
const zhPage = read('../pages/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro');

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
      '每个任务最早一条 clean exact success',
      '容量 64 的旧经验池',
      'Dₜ ← BₜAₜ',
      'α₁ · α₂ · … · αₜ',
      'ΔWₜ = Σ αᵢDᵢ',
      'candidate cumulative adapter',
      'SD-LoRA 到这里结束',
    ]) expect(projectionSource).toContain(phrase);
    expect(component).toContain('本轮 dataset 不把旧 round 的 raw rollout 直接拼回来');
    expect(component).toContain('这些是需要测的风险，不是当前已经证明的故障原因');
  });

  it('keeps paper semantics separate from the OpenEvo language-agent adaptation', () => {
    expect(component).toContain('paper_equivalent=false');
    expect(component).toContain('rehearsal_free=false');
    expect(component).toContain('single_cumulative_adapter');
    expect(component).toContain('bounded_trajectory_replay');
    expect(component).toContain('不是 ICLR 2025 vision protocol 的逐项复刻');
  });

  it('registers bilingual routes and reader ownership', () => {
    const route = '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/';
    expect(bilingualStaticPaths).toContain(route);
    expect(CAPABILITY_READER_ROUTES.some((row) => row.route === 'vanilla-sd-lora' && row.owner === 'OpenEvoVanillaSdLoraMechanism')).toBe(true);
    expect(zhPage).toContain('<OpenEvoVanillaSdLoraMechanism locale={locale} />');
    expect(enPage).toContain('<OpenEvoVanillaSdLoraMechanism locale={locale} />');
  });
});
