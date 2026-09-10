import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcRoot = fileURLToPath(new URL('../', import.meta.url));
const component = readFileSync(join(srcRoot, 'components/research/OpenEvoTextMemoryPlan.astro'), 'utf8');
const page = readFileSync(join(srcRoot, 'pages/research/seed-openevo/study/capability-exploration/text-memory/index.astro'), 'utf8');
const enPage = readFileSync(join(srcRoot, 'pages/en/research/seed-openevo/study/capability-exploration/text-memory/index.astro'), 'utf8');

describe('OpenEVO Text Memory plan page', () => {
  it('keeps the research theme explicit and leaves blank boxes for unknowns', () => {
    expect(component).toContain('把 Text Memory 这位老师重新写好');
    expect(component).toContain('R104');
    expect(component).toContain('R122');
    expect(component).toContain('2048 → 4096');
    expect(component).toContain('20 → 10+10');
    expect(component).toContain('data-blank="final-r160-score"');
    expect(component).toContain('data-blank="successor-ablation"');
  });

  it('publishes both zh and en routes', () => {
    expect(page).toContain('OpenEvoTextMemoryPlan');
    expect(enPage).toContain('OpenEvoTextMemoryPlan');
  });
});
