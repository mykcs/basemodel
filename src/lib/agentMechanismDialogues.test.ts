import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('SEED and OpenEvo beginner data-pipeline integration', () => {
  const component = read('src/components/research/AgentMechanismDialogues.astro');
  const zhRoute = read('src/pages/research/seed-openevo/loops.astro');
  const enRoute = read('src/pages/en/research/seed-openevo/loops.astro');

  it('externalizes both update mechanisms as input-process-output pipelines', () => {
    expect(component).toContain("id: 'seed'");
    expect(component).toContain("id: 'openevo'");
    expect(component).toContain('<ol class="mechanism-dialogue__turns">');
    expect(component).toContain('mechanism-turn__io');
    expect(component).toContain("t('流入','IN')");
    expect(component).toContain("t('加工','PROCESS')");
    expect(component).toContain("t('流出','OUT')");
    expect(component).toContain('data-ui-audit="contrast layout"');
    expect(component).toContain('更新对象：policy 参数');
    expect(component).toContain('successor revision');
  });

  it('draws the flow structurally and animates data packets without character-arrow diagrams', () => {
    for (const glyph of ['→', '↔', '↓', '↑', '⇒']) expect(component).not.toContain(glyph);
    expect(component).toContain('class="flow-pipe"');
    expect(component).toContain('.flow-pipe__line');
    expect(component).toContain('.flow-pipe__packet');
    expect(component).toContain('@keyframes data-packet');
    expect(component).toContain('@media(prefers-reduced-motion:reduce)');
  });

  it('mounts the pipeline on both localized loop-comparison routes', () => {
    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('AgentMechanismDialogues');
      expect(route).toContain('<AgentMechanismDialogues locale={locale} />');
    }
  });
});
