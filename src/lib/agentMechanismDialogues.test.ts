import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('SEED and OpenEvo beginner dialogue integration', () => {
  const component = read('src/components/research/AgentMechanismDialogues.astro');
  const zhRoute = read('src/pages/research/seed-openevo/loops.astro');
  const enRoute = read('src/pages/en/research/seed-openevo/loops.astro');

  it('externalizes both update mechanisms as semantic dialogues', () => {
    expect(component).toContain("id: 'seed'");
    expect(component).toContain("id: 'openevo'");
    expect(component).toContain('<ol class="mechanism-dialogue__turns">');
    expect(component).toContain('<details>');
    expect(component).toContain('data-ui-audit="contrast layout"');
    expect(component).toContain("t('更新对象', 'Updated object')");
    expect(component).toContain("t('生效时间', 'Activation')");
  });

  it('uses structural CSS connectors instead of character-arrow diagrams', () => {
    for (const glyph of ['→', '↔', '↓', '↑', '⇒']) {
      expect(component).not.toContain(glyph);
    }
    expect(component).toContain(".mechanism-dialogue__turns::before");
    expect(component).toContain("content: '';");
  });

  it('mounts the dialogue on both localized loop-comparison routes', () => {
    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('AgentMechanismDialogues');
      expect(route).toContain('<AgentMechanismDialogues locale={locale} />');
    }
  });
});
