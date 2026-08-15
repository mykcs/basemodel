import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const actionableLayer = read('src/components/common/ActionableContentLayer.astro');
const actionableCss = read('src/styles/actionable-content.css');
const environmentExplainers = read('src/components/research/explainer/EnvironmentExplainers.tsx');
const researchCss = read('src/styles/interactive-research-explainer.css');
const benchmarkDiagram = read('src/components/research/BenchmarkDatasetDiagram.astro');

describe('visual closeout regressions', () => {
  it('does not create toolbar-sized blank space above static code blocks', () => {
    expect(actionableLayer).not.toContain("setProperty('padding-top'");
    expect(actionableCss).not.toMatch(/actionable-code-shell>pre\{[^}]*padding-top/);
    expect(actionableCss).toContain('padding-right:6.5rem');
    expect(actionableCss).toContain('padding-right:3.75rem');
  });

  it('names the exact WebShop demo value instead of referring to an ambiguous value above', () => {
    expect(environmentExplainers).toContain('最后一步显示的 “DEMO: task_score = 1.0”');
    expect(environmentExplainers).toContain('The final-step “DEMO: task_score = 1.0”');
    expect(environmentExplainers).not.toContain('上面的 1.0 只是教学演示');
    expect(environmentExplainers).not.toContain('The 1.0 above is a teaching demo');
  });

  it('renders Level-3 benchmark relationships without fixed-coordinate SVG wires', () => {
    expect(benchmarkDiagram).toContain('class="scene-wires"');
    expect(researchCss).toContain('.benchmark-architecture .scene:before,.benchmark-architecture .scene-wires{display:none!important}');
    expect(researchCss).toContain('grid-template-areas:"corpus snapshot goal goal"');
    expect(researchCss).toContain('grid-template-areas:"alfred world splits splits"');
    expect(researchCss).toContain('.benchmark-architecture .scene-node:not(:last-of-type)::after');
    expect(researchCss).toContain('@media(max-width:900px)');
  });
});
