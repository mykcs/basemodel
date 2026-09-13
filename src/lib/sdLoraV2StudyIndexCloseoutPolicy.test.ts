import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const websiteSpec = read('../../docs/agents/current/website-design-spec.md');
const journey = read('../../docs/agents/current/research-journey-experience.md');
const visualGate = read('../../docs/agents/current/ui-change-visual-acceptance-gate.md');
const registry = read('../../docs/agents/current/scenario-trigger-registry.md');

describe('SD-LoRA v2 publication conversation lessons', () => {
  it('preserves approved plain-language conversation prose as a publication baseline', () => {
    expect(websiteSpec).toContain('accepted copy baseline');
    expect(websiteSpec).toContain('先保真再网页化');
    expect(registry).toContain('do not “webify” it into more academic, managerial, or jargon-heavy prose');
  });

  it('treats parent discoverability and one canonical Study label as IA acceptance', () => {
    expect(journey).toContain('Publication discoverability is part of the journey');
    expect(journey).toContain('direct URL returns `200`');
    expect(journey).toContain('one stable reader-facing name');
    expect(journey).toContain('实验目录, 运行实验, 研究结果');
    expect(journey).not.toContain('| `02 · OpenEvo × WebShop 科学研究 / study` | 实验流程,');
  });

  it('requires responsive browser checks to select the visible semantic target', () => {
    expect(visualGate).toContain('more than one DOM instance of the same semantic target');
    expect(visualGate).toContain('Do not use `.first()`');
    expect(visualGate).toContain('visible-count, computed visibility/geometry, destination');
  });
});
