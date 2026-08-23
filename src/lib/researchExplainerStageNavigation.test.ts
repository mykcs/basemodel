import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const primitives = read('src/components/research/explainer/ResearchExplainerPrimitives.tsx');
const environments = read('src/components/research/explainer/EnvironmentExplainers.tsx');
const methods = read('src/components/research/explainer/MethodExplainers.tsx');
const server = read('src/components/research/explainer/ServerExplainer.tsx');
const environmentCss = read('src/styles/interactive-research-explainer-environments.css');

describe('research explainer stage navigation', () => {
  it('keeps one shared full-stage navigator and does not redraw the WebShop phases inside the scene', () => {
    expect(primitives.match(/className="irx-stepper"/g)).toHaveLength(1);
    expect(environments).not.toContain('irx-linear-map');
    expect(environments).not.toContain("['目标', '搜索', '商品', '选项', '评测']");
    expect(environments).not.toContain("['Goal', 'Search', 'Product', 'Options', 'Reward']");
    expect(environmentCss).not.toContain('.irx-linear-map');
  });

  it('does not introduce the retired duplicate-stage pattern in sibling explainers', () => {
    for (const source of [methods, server]) expect(source).not.toContain('irx-linear-map');
  });
});
