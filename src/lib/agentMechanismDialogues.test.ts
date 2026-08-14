import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('SEED and OpenEvo data-flow explanation', () => {
  const component = read('src/components/research/AgentMechanismDialogues.astro');
  const zhRoute = read('src/pages/research/seed-openevo/loops.astro');
  const enRoute = read('src/pages/en/research/seed-openevo/loops.astro');

  it('keeps both update mechanisms explicit', () => {
    expect(component).toContain("name:'SEED'");
    expect(component).toContain("name:'OpenEvo'");
    expect(component).toContain('policy 参数');
    expect(component).toContain('artifact / adapter / revision');
    expect(component).toContain('successor revision');
  });

  it('uses a quiet subject heading instead of a process sentence', () => {
    expect(component).toContain('SEED 与 OpenEvo 数据流');
    expect(component).not.toContain('数据从哪里进来，经过什么加工，最后流向哪里');
    expect(component).toContain('flow-grid');
  });

  it('remains mounted on both localized loop-comparison routes', () => {
    for (const route of [zhRoute,enRoute]) {
      expect(route).toContain('AgentMechanismDialogues');
      expect(route).toContain('<AgentMechanismDialogues locale={locale} />');
    }
  });
});
