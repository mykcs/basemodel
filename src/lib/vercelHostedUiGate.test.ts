import { describe, expect, it } from 'vitest';
import { pageFileToRoute, planHostedUi } from '../../scripts/vercel-ui-plan';

describe('Vercel hosted UI gate planner', () => {
  it('maps concrete Astro page files to their deployed routes', () => {
    expect(pageFileToRoute('src/pages/index.astro')).toBe('/');
    expect(pageFileToRoute('src/pages/en/index.astro')).toBe('/en/');
    expect(pageFileToRoute('src/pages/research/seed-openevo/results.astro')).toBe('/research/seed-openevo/results/');
    expect(pageFileToRoute('src/pages/en/research/seed-openevo/results.astro')).toBe('/en/research/seed-openevo/results/');
    expect(pageFileToRoute('src/pages/models/[slug].astro')).toBeUndefined();
    expect(pageFileToRoute('src/pages/_bodies/home-v2.astro')).toBeUndefined();
  });

  it('keeps a metadata-only Results release on exact changed-route coverage', () => {
    const plan = planHostedUi([
      'src/pages/research/seed-openevo/results.astro',
      'src/pages/en/research/seed-openevo/results.astro',
    ]);

    expect(plan.mode).toBe('focused');
    expect(plan.risk).toBe('local');
    expect(plan.routes).toEqual([
      '/en/research/seed-openevo/results/',
      '/research/seed-openevo/results/',
    ]);
    expect(plan.specs).toContain('tests/e2e/results-mobile-overflow.spec.ts');
    expect(plan.specs).toContain('tests/e2e/results-reference-visual.spec.ts');
    expect(plan.specs).toContain('tests/e2e/open-evo-webshop-program-report.spec.ts');
  });

  it('fails closed to the complete matrix for shared or global UI changes', () => {
    expect(planHostedUi(['src/components/research/Example.astro']).mode).toBe('full');
    expect(planHostedUi(['src/styles/tokens.css']).mode).toBe('full');
    expect(planHostedUi(['scripts/vercel-ui-plan.ts']).mode).toBe('full');
  });

  it('fails closed when a local source file cannot be mapped to one concrete route', () => {
    const plan = planHostedUi(['src/lib/some-local-helper.ts']);
    expect(plan.risk).toBe('local');
    expect(plan.mode).toBe('full');
  });

  it('fails closed instead of inventing a public route for an internal page module', () => {
    const plan = planHostedUi(['src/pages/_bodies/home-v2.astro']);
    expect(plan.risk).toBe('local');
    expect(plan.mode).toBe('full');
    expect(plan.routes).toEqual([]);
  });

  it('uses representative safety coverage for content-only changes', () => {
    const generic = planHostedUi(['src/data/models/example.json']);
    expect(generic.mode).toBe('focused');
    expect(generic.specs).toContain('tests/e2e/ui-safety.spec.ts');

    const research = planHostedUi(['src/data/openEvoWebShopProgram.ts']);
    expect(research.mode).toBe('focused');
    expect(research.specs).toContain('tests/e2e/open-evo-webshop-program-report.spec.ts');
    expect(research.specs).toContain('tests/e2e/results-mobile-overflow.spec.ts');
  });

  it('skips the browser layer for non-UI files after deterministic build validation', () => {
    const plan = planHostedUi(['docs/agents/current/deployment-policy.md']);
    expect(plan.mode).toBe('skip');
    expect(plan.risk).toBe('none');
  });
});
