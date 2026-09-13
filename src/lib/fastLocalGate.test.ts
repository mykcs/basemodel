import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { classifyUiFile } from '../../scripts/preflight-ui';
import { directConcretePageConsumers, planFastGate } from '../../scripts/verify-fast';

const leaf = 'src/pages/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro';
const leafEn = 'src/pages/en/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro';

describe('development-only fast local gate', () => {
  it('admits only concrete leaf page edits to the scoped fast path', () => {
    const plan = planFastGate([leaf]);
    expect(plan.mode).toBe('leaf-pages');
    expect(plan.pages).toEqual([leaf]);
    expect(plan.routes).toEqual(['/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/']);
  });

  it('allows a bounded bilingual leaf-page batch plus source-test/docs companions', () => {
    const plan = planFastGate([
      leaf,
      leafEn,
      'src/lib/vanillaSdLoraMechanism.test.ts',
      'docs/agents/history/example.md',
    ]);
    expect(plan.mode).toBe('leaf-pages');
    expect(plan.pages).toHaveLength(2);
  });
  it('admits a shared Astro component only when every runtime importer is a bounded concrete page', () => {
    const component = 'src/components/research/SeedOpenEvoProgressBriefing.astro';
    expect(directConcretePageConsumers(component)).toEqual([
      'src/pages/en/research/seed-openevo/study/briefing/index.astro',
      'src/pages/research/seed-openevo/study/briefing/index.astro',
    ]);
    const plan = planFastGate([component]);
    expect(plan.mode).toBe('bounded-components');
    expect(plan.components).toEqual([component]);
    expect(plan.pages).toHaveLength(2);
  });

  it('allows docs and source-test companions beside a bounded component without widening runtime scope', () => {
    const component = 'src/components/research/SeedOpenEvoProgressBriefing.astro';
    const plan = planFastGate([
      component,
      'src/lib/seedOpenEvoProgressBriefing.test.ts',
      'docs/agents/history/example.md',
    ]);
    expect(plan.mode).toBe('bounded-components');
    expect(plan.components).toEqual([component]);
    expect(plan.pages).toHaveLength(2);
  });

  it('fails closed when a component path no longer exists, covering deletes and renames', () => {
    const plan = planFastGate(['src/components/research/RemovedFastGateComponent.astro']);
    expect(plan.mode).toBe('full');
  });

  it('fails closed for indirect/global components, dynamic pages, data, or the fast-gate owner itself', () => {
    for (const files of [
      ['src/pages/research/seed-openevo/study/results/[note].astro'],
      ['src/components/research/OpenEvoStage2StrategyChooser.astro'],
      ['src/components/Header.astro'],
      ['src/data/openEvoExperimentNavigation.ts'],
      ['scripts/verify-fast.ts'],
      ['package.json'],
    ]) {
      expect(planFastGate(files).mode, files.join(',')).toBe('full');
    }
  });

  it('fails closed when a page path no longer exists, covering deletes and renames', () => {
    const plan = planFastGate(['src/pages/research/seed-openevo/study/capability-exploration/removed-page/index.astro']);
    expect(plan.mode).toBe('full');
  });

  it('treats the fast-gate implementation as global CI/gate risk', () => {
    expect(classifyUiFile('scripts/verify-fast.ts')).toBe('global');
  });

  it('skips documentation-only iteration but never changes release authority', () => {
    expect(planFastGate(['docs/agents/history/example.md']).mode).toBe('skip');
    const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
    expect(packageJson.scripts['verify:fast']).toBe('tsx scripts/verify-fast.ts');
    expect(packageJson.scripts['check:watch']).toContain('astro check --watch');
    expect(packageJson.scripts['verify:deploy']).toContain('npm run check');
  });
  it('keeps public GitHub Actions on the full deterministic release gate', () => {
    const workflow = readFileSync(new URL('../../.github/workflows/public-pr-ci.yml', import.meta.url), 'utf8');
    expect(workflow).toContain('run: npm run verify:deploy');
    expect(workflow).not.toContain('run: npm run verify:fast');
  });
});
