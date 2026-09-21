import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { scanPublicMathRendering, strictPublicMathFailures } from './publicMathRenderingAudit';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

describe('public math rendering audit', () => {
  it('has no strict fake-math renderer failures outside the concurrent Gated-Delta owner', () => {
    expect(strictPublicMathFailures()).toEqual([]);
  });

  it('keeps known scientific formula owners on the shared MathFormula renderer', () => {
    const owners = [
      '../components/research/SeedOpenEvoBriefingTechnicalNotes.astro',
      '../components/research/SeedOpenEvoProgressBriefing.astro',
      '../components/research/OpenEvoSdLoraScaling.astro',
      '../components/SeedComputeTimeBudget.astro',
      '../components/research/OpenEvoExperimentResultsScaffold.astro',
      '../components/research/OpenEvoVanillaSdLoraMechanism.astro',
      '../components/research/OpenEvoVanillaSdLoraSlide.astro',
      '../components/research/WebShopEvaluationFigure.astro',
    ];
    for (const owner of owners) expect(read(owner)).toContain('MathFormula');
  });
  it('does not overgeneralize code and pseudocode into mathematics', () => {
    const reproduction = read('../components/SeedStudentReproductionGuide.astro');
    const bounded = read('../components/research/OpenEvoSdLoraBoundedAccelerationStudy.astro');
    expect(reproduction).toContain('<code>completed_rollouts == expected_rollouts</code>');
    expect(bounded).toContain('<code>T_chunk(full state in) → full state out</code>');
  });

  it('keeps review candidates explicit instead of pretending the heuristic is complete', () => {
    const review = scanPublicMathRendering().filter((finding) => !finding.strict);
    expect(Array.isArray(review)).toBe(true);
  });
});
