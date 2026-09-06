import { describe, expect, it } from 'vitest';
import { pageFileToRoute, planHostedUi } from '../../scripts/vercel-ui-plan';

describe('Vercel hosted UI gate planner', () => {
  it('maps concrete Astro page files to their deployed routes', () => {
    expect(pageFileToRoute('src/pages/index.astro')).toBe('/');
    expect(pageFileToRoute('src/pages/en/index.astro')).toBe('/en/');
    expect(pageFileToRoute('src/pages/research/seed-openevo/study/results.astro')).toBe('/research/seed-openevo/study/results/');
    expect(pageFileToRoute('src/pages/en/research/seed-openevo/study/results.astro')).toBe('/en/research/seed-openevo/study/results/');
    expect(pageFileToRoute('src/pages/models/[slug].astro')).toBeUndefined();
    expect(pageFileToRoute('src/pages/_bodies/home-v2.astro')).toBeUndefined();
  });

  it('keeps a metadata-only Results release on exact changed-route coverage', () => {
    const plan = planHostedUi([
      'src/pages/research/seed-openevo/study/results.astro',
      'src/pages/en/research/seed-openevo/study/results.astro',
    ]);

    expect(plan.mode).toBe('focused');
    expect(plan.risk).toBe('local');
    expect(plan.routes).toEqual([
      '/en/research/seed-openevo/study/results/',
      '/research/seed-openevo/study/results/',
    ]);
    expect(plan.specs).toContain('tests/e2e/results-mobile-overflow.spec.ts');
    expect(plan.specs).toContain('tests/e2e/results-reference-visual.spec.ts');
    expect(plan.specs).toContain('tests/e2e/open-evo-webshop-program-report.spec.ts');
  });

  it('focuses bounded explainer owners on only their real routes', () => {
    const method = planHostedUi(['src/components/research/explainer/MethodExplainers.tsx']);
    expect(method.mode).toBe('focused');
    expect(method.specs).toEqual(['tests/e2e/research-explainer-layout.spec.ts']);
    expect(method.routes).toEqual([
      '/en/research/seed-openevo/flow/openevo/', '/en/research/seed-openevo/flow/seed/',
      '/research/seed-openevo/flow/openevo/', '/research/seed-openevo/flow/seed/',
    ]);

    const methodCss = planHostedUi(['src/styles/interactive-research-explainer-methods.css']);
    expect(methodCss.mode).toBe('focused');
    expect(methodCss.routes).toContain('/lab/');
    expect(methodCss.routes).toContain('/en/lab/');
    expect(planHostedUi(['src/components/research/explainer/MethodExplainers.tsx', 'src/styles/tokens.css']).mode).toBe('full');
  });

  it('replays PR #430 as bounded server-route coverage instead of a full-site matrix', () => {
    const plan = planHostedUi([
      'src/components/research/Lyg2171ServerOverview.astro',
      'src/lib/publicServerCopy.test.ts',
    ]);

    expect(plan.mode).toBe('focused');
    expect(plan.routes).toEqual([
      '/en/research/seed-openevo/flow/server/',
      '/research/seed-openevo/flow/server/',
    ]);
    expect(plan.specs).toEqual([]);
  });

  it('replays PR #426 with docs and concrete server pages as bounded route coverage', () => {
    const plan = planHostedUi([
      'AGENTS.md',
      'docs/agents/current/scenario-trigger-registry.md',
      'docs/agents/current/server-artifact-governance-and-reclaim-sop.md',
      'docs/agents/current/server-storage-pressure-audit-sop.md',
      'src/components/research/Lyg2171ServerOverview.astro',
      'src/lib/publicServerCopy.test.ts',
      'src/pages/en/research/seed-openevo/flow/server.astro',
      'src/pages/research/seed-openevo/flow/server.astro',
    ]);

    expect(plan.mode).toBe('focused');
    expect(plan.routes).toEqual([
      '/en/research/seed-openevo/flow/server/',
      '/research/seed-openevo/flow/server/',
    ]);
  });

  it('fails closed when a bounded owner is mixed with an unrelated shared component', () => {
    const plan = planHostedUi([
      'src/components/research/Lyg2171ServerOverview.astro',
      'src/components/research/Example.astro',
    ]);
    expect(plan.mode).toBe('full');
  });

  it('fails closed to the complete matrix for shared or global UI changes', () => {
    expect(planHostedUi(['src/components/research/Example.astro']).mode).toBe('full');
    expect(planHostedUi(['src/styles/tokens.css']).mode).toBe('full');
    expect(planHostedUi(['scripts/vercel-ui-plan.ts']).mode).toBe('full');
    expect(planHostedUi(['scripts/ci-ui-gate.mjs']).mode).toBe('full');
    expect(planHostedUi(['scripts/ci-ui-test-list.mjs']).mode).toBe('full');
    expect(planHostedUi(['scripts/ci-ui-test-timings-202609061200.json']).mode).toBe('full');
    expect(planHostedUi(['.github/workflows/self-hosted-ci.yml']).mode).toBe('full');
    expect(planHostedUi(['.circleci/config.yml']).mode).toBe('full');
    expect(planHostedUi(['.circleci/browser-runtime.Dockerfile']).mode).toBe('full');
    expect(planHostedUi(['scripts/ci-circleci-prepare.sh']).mode).toBe('full');
    expect(planHostedUi(['.github/runner/Dockerfile']).mode).toBe('full');
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
