import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const pilotSources = [
  read('../components/research/SeedOpenEvoResearchHub.astro'),
  read('../components/research/SeedOpenEvoMissionHero.astro'),
  read('../components/research/OpenEvoVanillaSdLoraMechanism.astro'),
  read('../components/research/OpenEvoQ17AdvisorDiagnostics.astro'),
  read('../components/research/Lyg2171ServerOverview.astro'),
];
const mobileComposition = read('../styles/mobile-composition.css');
const visualCloseout = read('../styles/visual-closeout.css');

describe('content-first pilot consolidation', () => {
  it('keeps the four pilot surfaces static-first', () => {
    for (const source of pilotSources) {
      expect(source).not.toMatch(/client:(?:load|idle|visible|media|only)/);
    }
  });

  it('retires compatibility overrides only where compact ownership is explicit', () => {
    expect(mobileComposition).toContain('.mission-hero:not(.mission-hero--compact) .mission-hero__copy');
    expect(mobileComposition).not.toContain("body[data-reader-contract-id='flow'] .site-main .mission-hero.mission-hero--compact .mission-hero__copy");
    expect(visualCloseout).not.toContain("body[data-reader-contract-id='flow-server'] .server-hero");
  });
});
