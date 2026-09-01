import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const lab = read('src/components/research/SeedOpenEvoTrainingDecisionLab.astro');
const nav = read('src/components/research/SeedOpenEvoResearchNav.astro');
const zhPage = read('src/pages/research/seed-openevo/study/design/index.astro');
const enPage = read('src/pages/en/research/seed-openevo/study/design/index.astro');
const zhStudy = read('src/pages/research/seed-openevo/study/index.astro');
const enStudy = read('src/pages/en/research/seed-openevo/study/index.astro');

describe('SEED × OpenEvo training design lab', () => {
  it('keeps the external teacher outside the WebShop action loop', () => {
    for (const term of [
      'Qwen 3B / 7B',
      'Princeton WebShop',
      'completed trajectory',
      'GLM / Kimi / MiniMax',
      'episode 完成后读取一次',
      'one post-hoc analyzer generation',
      'the teacher must never become the WebShop actor',
    ]) expect(lab).toContain(term);
    expect(lab).toContain('5–15 calls / episode');
    expect(lab).toContain('1,440 个 primary analyzer jobs');
    expect(lab).toContain('2,880');
  });

  it('freezes the actor sampling and analyzer protocols visibly', () => {
    for (const term of [
      'Stage 1 actor temperature', '0.4',
      'Stage 1 top-p / top-k', '1.0 / off',
      'repetition penalty',
      '15 / 512',
      'history length',
      'malformed regeneration',
      'Historical Stage 2 actor temperature', '0.7',
      'Historical Stage 2 update window', '256 rollouts',
      'superseded OpenEvo-native v1',
      '128-attempt evidence rounds',
      'T=0 · 1024 tokens',
    ]) expect(lab).toContain(term);
    expect(lab).toContain('campaign 21,920');
    expect(lab).toContain('1,440 + 19,200 = 20,640');
  });

  it('preserves distinct scientific claims instead of flattening all comparisons', () => {
    for (const id of ['matched', 'native', 'nobootstrap', 'analyzer']) {
      expect(lab).toContain(`id: '${id}'`);
    }
    for (const claim of ['system', 'learner', 'teacher', 'bootstrap', 'thinking']) {
      expect(lab).toContain(`data-claim=\"${claim}\"`);
      expect(lab).toContain(`data-claim-panel=\"${claim}\"`);
    }
    expect(lab).toContain('OPSD privileged-distillation');
    expect(lab).toContain('full-system');
    expect(lab).toContain('learner-level');
  });

  it('keeps negative evidence and old runs semantically bounded', () => {
    expect(lab).toContain('OpenEvo-native-greedy-v1');
    expect(lab).toContain('Kimi step-level gateway');
    expect(lab).toContain('fallback-enabled trajectories');
    expect(lab).toContain('协议错误');
    expect(lab).toContain('engineering-incident evidence');
  });

  it('documents the paired MiniMax thinking qualification without turning it into live status', () => {
    for (const term of [
      '35,029 tokens', '38,149 tokens', '33.3 s', '91.1 s',
      'adaptive + split', '10 / 10', '8.9%', '2.86×', '2.74×',
    ]) expect(lab).toContain(term);
    expect(lab).toContain('Evidence boundary');
    expect(lab).not.toContain('formal-thinking-on');
    expect(lab).not.toContain('current live MiniMax');
  });

  it('wires the focused route and the main study page to the same bilingual lab', () => {
    expect(zhPage).toContain('SeedOpenEvoTrainingDecisionLab');
    expect(zhPage).toContain('page=\"design\"');
    expect(enPage).toContain('SeedOpenEvoTrainingDecisionLab');
    expect(enPage).toContain('page=\"design\"');
    expect(nav).toContain("'design'");
    expect(nav).toContain("'/research/seed-openevo/study/design/'");
    expect(zhStudy).toContain('SeedOpenEvoTrainingDecisionLab');
    expect(zhStudy).toContain('<SeedOpenEvoTrainingDecisionLab locale={locale} />');
    expect(enStudy).toContain('SeedOpenEvoTrainingDecisionLab');
    expect(enStudy).toContain('<SeedOpenEvoTrainingDecisionLab locale={locale} />');
  });

  it('keeps interaction optional and reduced-motion readable', () => {
    expect(lab).toContain('<details');
    expect(lab).toContain('role=\"tablist\"');
    expect(lab).toContain('prefers-reduced-motion:reduce');
    expect(lab).toContain('.flow-pulse{animation:none;display:none}');
    expect(lab).toContain('hidden');
  });
});
