import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const component = read('src/components/research/OpenEvoExperimentProgram.astro');
const state = read('src/lib/openEvoScientificState.ts');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');
const appendix = read('src/components/research/OpenEvoWebShopResultsAppendix.astro');

describe('OpenEvo × WebShop experiment state provenance', () => {
  it('separates retired sources from the scientific source of truth', () => {
    for (const repo of ['seed3090', 'openevo-webshop', 'openevo-experiment']) expect(component).toContain(repo);
    expect(component).toContain("state: t('历史', 'Historical')");
    expect(component).toContain("state: t('当前 source of truth', 'Current source of truth')");
    expect(component).toContain('RTX6 / 4×RTX 3090');
    expect(component).toContain('actual branch');
  });

  it('keeps Phase D–F mechanism evidence distinct from task efficacy', () => {
    expect(component).toContain('SD-LoRA optimizer steps');
    expect(component).toContain('2 components · effective rank 8');
    expect(component).toContain('nonzero logit delta');
    expect(component).toContain('这些是机制证据，不是 WebShop 效果结论');
    expect(component).toContain('RTX5090_PHASE_D_F_2026-08-14.md');
  });

  it('keeps completed Phase G measurements as historical evidence', () => {
    expect(component).toContain('历史证据 · Phase G · completed');
    expect(component).toContain('12 个 promotion-dev episodes');
    expect(component).toContain("{ arm: 'base', score: '0.000'}");
    expect(component).toContain("{ arm: 'adapter1x', score: '0.000'}");
    expect(component).toContain("{ arm: 'cumulative', score: '0.000'}");
    expect(component).not.toContain('formal_task_consumption_allowed = false');
    expect(component).not.toContain('0 consumed');
  });

  it('shows a dated default-main H1.27 snapshot without pretending it is live state', () => {
    expect(state).toContain("checkedAt: '2026-08-18'");
    expect(state).toContain("phase: 'H1.27'");
    expect(state).toContain("status: 'completed-descriptive-only'");
    expect(state).toContain("classification: 'scale-only-not-supported-or-task-local'");
    expect(state).toContain('observedAttempts: 64');
    expect(state).toContain('scientificValidAttempts: 48');
    expect(state).toContain('parserOrFallbackInvalidAttempts: 16');
    expect(component).toContain('默认 main 快照');
    expect(component).toContain('default-branch snapshot');
    expect(component).toContain('openEvoScientificState.defaultBranchSnapshot.phase');
    expect(component).not.toContain('当前阶段</span>\n      <strong>Phase H0</strong>');
    expect(component).not.toContain('Current experiment allocation: 5× RTX 5090');
  });

  it('routes live state through branch, campaign, reconciliation/result, and preregistered GPU authority', () => {
    for (const token of ['current-campaign.json', 'actual branch', 'reconciliation / result', 'preregistration', 'authorized UUIDs']) {
      expect(component + state).toContain(token);
    }
    expect(state).toContain('active scientific branch may be ahead');
    expect(state).toContain('GPU allocation is not a static-site fact');
  });

  it('keeps W&B observational and mounts the same unified results modules on both locale routes', () => {
    expect(component).toContain('W&B 继续承担观测与比较');
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
