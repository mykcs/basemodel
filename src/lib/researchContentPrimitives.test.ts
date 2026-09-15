import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const appCss = read('../styles/app.css');
const primitives = read('../styles/components/research-content-primitives.css');
const flowHero = read('../components/research/SeedOpenEvoMissionHero.astro');
const sdLora = read('../components/research/OpenEvoVanillaSdLoraMechanism.astro');
const serverOverview = read('../components/research/Lyg2171ServerOverview.astro');
const q17Diagnostics = read('../components/research/OpenEvoQ17AdvisorDiagnostics.astro');

describe('shared research content primitives', () => {
  it('loads the proven content primitive after the canonical shell owners', () => {
    const header = appCss.indexOf("@import './components/header.css';");
    const research = appCss.indexOf("@import './components/research-content-primitives.css';");
    expect(header).toBeGreaterThan(-1);
    expect(research).toBeGreaterThan(header);
  });

  it('uses one semantic fact band across all four pilot families', () => {
    expect(flowHero).toContain('class="mission-hero__frame research-fact-band"');
    expect(flowHero).toContain('style="--research-fact-columns:5"');
    expect(sdLora).toContain('class="sdlora-intro__frame research-fact-band"');
    expect(sdLora).toContain('style="--research-fact-columns:4"');
    expect(flowHero).toContain('<dl class="mission-hero__frame research-fact-band"');
    expect(sdLora).toContain('<dl class="sdlora-intro__frame research-fact-band"');
    expect(serverOverview).toContain('class="server-hero__facts research-fact-band"');
    expect(serverOverview).toContain('style="--research-fact-columns:3"');
    expect(q17Diagnostics).toContain('class="result-hero__facts research-fact-band"');
    expect(q17Diagnostics).toContain('style="--research-fact-columns:3"');
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
