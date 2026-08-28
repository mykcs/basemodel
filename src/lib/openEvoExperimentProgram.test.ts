import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const component = read('src/components/research/OpenEvoExperimentProgram.astro');
const state = read('src/lib/openEvoScientificState.ts');
const zhRoute = read('src/pages/research/seed-openevo/study/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/study/results.astro');
const appendix = read('src/components/research/OpenEvoWebShopResultsAppendix.astro');

describe('OpenEvo × WebShop experiment state provenance', () => {
  it('separates historical repositories from the current scientific source of truth', () => {
    for (const repo of ['seed3090', 'openevo-webshop', 'openevo-experiment']) expect(component).toContain(repo);
    expect(component).toContain("state: t('历史档案', 'Historical archive')");
    expect(component).toContain("state: t('当前科学总账', 'Current scientific source of truth')");
    expect(component).toContain('RTX6 / 4×RTX 3090');
    expect(component + state).toContain('working branch');
  });

  it('keeps Phase D–F mechanism evidence distinct from task efficacy', () => {
    expect(component).toContain('SD-LoRA optimizer steps');
    expect(component).toContain('2 components · effective rank 8');
    expect(component).toContain('nonzero logit delta');
    expect(component).toContain('这些只能证明“训练机制工作了”，不能证明“WebShop 分数提高了”');
    expect(component).toContain('RTX5090_PHASE_D_F_2026-08-14.md');
  });

  it('keeps completed Phase G measurements as historical evidence', () => {
    expect(component).toContain('历史证据 · Phase G · 已完成');
    expect(component).toContain('共跑了 12 次开发集评测（promotion-dev episodes）');
    expect(component).toContain("{ arm: 'base', score: '0.000', wins: '0 / 4', steps: '9.50', fallback: '3 / 38' }");
    expect(component).toContain("{ arm: 'adapter1x', score: '0.000', wins: '0 / 4', steps: '14.25', fallback: '1 / 57' }");
    expect(component).toContain("{ arm: 'cumulative', score: '0.000', wins: '0 / 4', steps: '6.00', fallback: '3 / 24' }");
    expect(component).not.toContain('formal_task_consumption_allowed = false');
    expect(component).not.toContain('0 consumed');
  });

  it('shows the dated 2026-08-28 WB1 Track B Gen28 snapshot from default main', () => {
    expect(state).toContain("checkedAt: '2026-08-28'");
    expect(state).toContain("checkedSourceCommit: '04c0faf02af6f0fcb0724aff3c5697b0c858e9e4'");
    expect(state).toContain("phase: 'WB1-TRACKB-CONTINUATION'");
    expect(state).toContain("status: 'trackb-gen28-state-v28-adopted-final-locked-no-training'");
    expect(state).toContain('validCompletedTrainingEpisodes: 3584');
    expect(state).toContain('targetTrainingEpisodes: 20640');
    expect(state).toContain('remainingTrainingEpisodes: 17056');
    expect(state).toContain('latestCompletedGeneration: 28');
    expect(state).toContain('latestNativeStateVersion: 28');
    expect(state).toContain('gpuAllocationAllowed: false');
    expect(component).toContain('Gen {snapshot.latestCompletedGeneration} · state-v{snapshot.latestNativeStateVersion}');
    expect(component).toContain('未授权');
    expect(component).toContain('训练 / GPU / 最终测试');
  });

  it('routes live state through branch, campaign, reconciliation/result, preregistration, and explicit GPU authority', () => {
    for (const token of ['current-campaign.json', 'working branch', 'reconciliation / result', 'preregistration', 'authorized UUIDs']) {
      expect(component + state).toContain(token);
    }
    expect(state).toContain('active scientific branch may be ahead');
    expect(state).toContain('GPU allocation is not a static-site fact');
  });

  it('keeps W&B observational and mounts the same unified results modules on both locale routes', () => {
    expect(component).toContain('W&B 是实验观察面板');
    expect(component).toContain('Run Manifest');
    expect(component).toContain('data-testid="openevo-experiment-program"');
    expect(component).not.toContain('client:');

    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('OpenEvoWebShopResultsHero');
      expect(route).toContain('OpenEvoWebShopResultsQuestions');
      expect(route).toContain('OpenEvoWebShopResultsAppendix');
      expect(route).not.toContain('OpenEvoWebShopResultIndex');
      expect(route).not.toContain('OpenEvoWebShopNarrativeReport');
      expect(route).not.toContain('OpenEvoWebShopProgramReport');
      expect(route).not.toContain('Seed3090ParametricProgress');
      expect(route).not.toContain('5×RTX5090');
      expect(route).not.toContain('Phase H0 Natural Success Search');
    }
    expect(appendix).toContain('H1.40');
    expect(appendix).toContain('Seed3090ParametricProgress');
  });
});
