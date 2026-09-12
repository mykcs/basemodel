import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const modelDetail = read('src/pages/_bodies/model-detail.astro');
const setup = read('src/components/models/detail/SeedOpenEvoExperimentSetup.astro');
const modelsIndex = read('src/pages/_bodies/models-index.astro');
const researchCore = read('src/components/research/SeedOpenEvoResearchPageCore.astro');
const hub = read('src/components/research/SeedOpenEvoResearchHub.astro');
const missionHero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const nav = read('src/components/research/SeedOpenEvoResearchNav.astro');
const sitemap = read('src/lib/sitemapRoutes.ts');

describe('Qwen2.5-3B-Instruct experiment setup migration', () => {
  it('keeps one canonical content owner on the model detail page', () => {
    expect(modelDetail).toContain("model.id === 'qwen2-5-3b-instruct'");
    expect(modelDetail).toContain('<SeedOpenEvoExperimentSetup locale={locale} />');
    for (const token of ['Base / Instruct', 'BF16 / FP16 / INT4', 'SFT / LoRA / RL', 'Checkpoint / revision', 'prompt / parser']) {
      expect(setup).toContain(token);
    }
    expect(researchCore).not.toContain("page === 'base-model'");
    expect(researchCore).not.toContain('model-name-diagram');
  });

  it('routes model discovery and the research flow to the same canonical section', () => {
    const target = "/models/qwen2-5-3b-instruct/#experiment-setup";
    expect(modelsIndex).toContain(target);
    expect(hub).toContain(target);
    expect(missionHero).toContain(target);
    expect(nav).toContain(target);
    expect(sitemap).toContain("bilingualCompatibilityPaths");
    expect(sitemap).toContain("'/research/seed-openevo/flow/base-model/'");
    const staticRoutes = sitemap.slice(0, sitemap.indexOf('export const bilingualCompatibilityPaths'));
    expect(staticRoutes).not.toContain("'/research/seed-openevo/flow/base-model/'");
  });
});
