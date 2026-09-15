import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const appCss = read('../styles/app.css');
const primitives = read('../styles/components/research-content-primitives.css');
const flowHero = read('../components/research/SeedOpenEvoMissionHero.astro');
const sdLora = read('../components/research/OpenEvoVanillaSdLoraMechanism.astro');

describe('shared research content primitives', () => {
  it('loads the proven content primitive after the canonical shell owners', () => {
    const header = appCss.indexOf("@import './components/header.css';");
    const research = appCss.indexOf("@import './components/research-content-primitives.css';");
    expect(header).toBeGreaterThan(-1);
    expect(research).toBeGreaterThan(header);
  });

  it('uses one semantic fact band in two different pilot families', () => {
    expect(flowHero).toContain('class="mission-hero__frame research-fact-band"');
    expect(flowHero).toContain('style="--research-fact-columns:5"');
    expect(sdLora).toContain('class="sdlora-intro__frame research-fact-band"');
    expect(sdLora).toContain('style="--research-fact-columns:4"');
    expect(flowHero).toContain('<dl class="mission-hero__frame research-fact-band"');
    expect(sdLora).toContain('<dl class="sdlora-intro__frame research-fact-band"');
  });

  it('keeps the shared primitive narrow instead of turning it into a page template', () => {
    expect(primitives).toContain('.research-fact-band');
    expect(primitives).toContain('grid-template-columns: repeat(var(--research-fact-columns, 4), minmax(0, 1fr))');
    expect(primitives).not.toContain('.card');
    expect(primitives).not.toContain('.hero');
    expect(primitives).not.toContain('box-shadow');
    expect(primitives).not.toContain('background:');
    expect(flowHero).not.toContain('.mission-hero__frame{display:grid');
    expect(sdLora).not.toContain('.sdlora-intro__frame{display:grid');
  });
});
