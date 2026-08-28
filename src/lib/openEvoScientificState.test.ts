import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const state = read('src/lib/openEvoScientificState.ts');
const currentFacing = [
  'src/components/research/SeedOpenEvoMissionHero.astro',
  'src/components/research/OpenEvoExperimentGateway.astro',
  'src/components/research/OpenEvoExperimentProgram.astro',
  'src/components/OpenEvoSeedBenchmarksGuide.astro',
  'src/components/research/explainer/EnvironmentExplainers.tsx',
  'src/components/research/OpenEvoModelExperimentGuide.astro',
  'src/components/research/Seed3090ParametricProgress.astro',
  'src/components/research/SeedOpenEvoComparisonDiagram.astro',
  'src/pages/_bodies/home-v2.astro',
  'src/pages/guide.astro',
  'src/pages/en/guide.astro',
  'src/pages/guide/today.astro',
  'src/pages/research/seed-openevo/study/run.astro',
  'src/pages/en/research/seed-openevo/study/run.astro',
  'src/pages/research/seed-openevo/study/index.astro',
  'src/pages/en/research/seed-openevo/study/index.astro',
  'src/pages/research/seed-openevo/study/results.astro',
  'src/pages/en/research/seed-openevo/study/results.astro',
].map((path) => ({ path, source: read(path) }));
const joined = currentFacing.map(({ source }) => source).join('\n');

describe('OpenEvo scientific-state provenance', () => {
  it('pins the current dated default-main snapshot to the source commit that was actually checked', () => {
    expect(state).toContain("checkedAt: '2026-08-28'");
    expect(state).toContain("checkedSourceCommit: '04c0faf02af6f0fcb0724aff3c5697b0c858e9e4'");
    expect(state).toContain("branch: 'main'");
    expect(state).toContain("phase: 'WB1-TRACKB-CONTINUATION'");
    expect(state).toContain("status: 'trackb-gen28-state-v28-adopted-final-locked-no-training'");
    expect(state).toContain("classification: 'GEN28_STATE_V28_BARRIER_PASS_ADOPTED'");
    expect(state).toContain('validCompletedTrainingEpisodes: 3584');
    expect(state).toContain('latestCompletedGeneration: 28');
    expect(state).toContain('latestNativeStateVersion: 28');
  });

  it('requires branch-aware campaign and reconciliation routing for live claims', () => {
    expect(state).toContain('active scientific branch may be ahead');
    expect(state).toContain('current-campaign.json');
    expect(state).toContain('reconciliation/result');
    expect(joined).toContain('current-campaign');
    expect(joined).toContain('reconciliation');
    expect(joined).toContain('working branch');
  });

  it('does not let current-facing or reusable surfaces freeze the old H0 / 5-GPU state as live truth', () => {
    for (const { path, source } of currentFacing) {
      expect(source, `${path} reintroduced the old live allocation`).not.toContain('当前实验分配：5× RTX 5090');
      expect(source, `${path} reintroduced the old live allocation`).not.toContain('Current experiment allocation: 5× RTX 5090');
      expect(source, `${path} reintroduced the old live allocation`).not.toContain('当前实验分配为 <strong>5×RTX5090</strong>');
      expect(source, `${path} reintroduced the old live allocation`).not.toContain('current allocation of <strong>5×RTX5090</strong>');
      expect(source, `${path} reintroduced H0 as the live next stage`).not.toContain('下一阶段是 Phase H0 Natural Success Search');
      expect(source, `${path} reintroduced H0 as the live next stage`).not.toContain('Phase H0 Natural Success Search is next');
      expect(source, `${path} reintroduced H0 as the live next gate`).not.toContain('下一 Gate 是 Phase H0 Natural Success Search');
      expect(source, `${path} reintroduced H0 as the live next gate`).not.toContain('the next gate is Phase H0 Natural Success Search');
      expect(source, `${path} reintroduced H0 as a fixed current status`).not.toContain('当前阶段</span><strong>Phase H0</strong>');
      expect(source, `${path} reintroduced H0 as a fixed current status`).not.toContain('Current phase</span><strong>Phase H0</strong>');
      expect(source, `${path} reintroduced a time-dependent project-testing claim`).not.toContain('当前项目里正在测什么');
      expect(source, `${path} reintroduced a time-dependent project-testing claim`).not.toContain('What our project is testing now');
    }
  });

  it('keeps GPU inventory, allocation, authorization, and idle capacity separate', () => {
    expect(state).toContain('GPU allocation is not a static-site fact');
    expect(state).toContain('preregistration');
    expect(state).toContain('authorized GPU UUIDs');
    expect(state).toContain('live-idle check');
    expect(state).toContain('gpuAllocationAllowed: false');
    const lab = read('src/pages/lab.astro');
    expect(lab).toContain('8×RTX5090 visible · allocation policy unknown');
    expect(lab).toContain('历史记录：5×RTX5090 allocation');
  });

  it('keeps the durable Agent copy contract aligned with the runtime pages', () => {
    const srcAgents = read('src/AGENTS.md');
    const provenance = read('docs/agents/current/scientific-state-provenance.md');
    const copyStandard = read('docs/agents/current/audience-centered-technical-copy.md');
    for (const source of [srcAgents, provenance, copyStandard]) {
      expect(source).toContain('current-campaign');
      expect(source).toContain('reconciliation');
      expect(source).toContain('preregistration');
    }
    expect(provenance).toContain('A regression test that requires a stale current phase is itself a stale contract');
    expect(copyStandard).toContain('Current scientific claims must be delegated, not copied');
  });
});
