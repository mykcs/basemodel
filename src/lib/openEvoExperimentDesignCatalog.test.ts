import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const catalog = read('../components/research/OpenEvoExperimentDesignCatalog.astro');
const map = read('../components/research/OpenEvoRedesignMap.astro');
const zh = read('../pages/research/seed-openevo/study/capability-exploration/openevo-2-0/index.astro');
const en = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/study/capability-exploration/openevo-2-0/index.astro.archive');

const familyIds = [
  'stage1-shared-harness-deliberation',
  'fresh-stage1-202609021800',
  'stage1-minimax-posthoc',
  'stage1-opsd-v2',
  'stage2-vnext',
  'gdn-d1',
  'ceiling1-end-to-end-autonomous',
];
describe('OpenEvo experiment design catalog', () => {
  it('mounts one shared bilingual design catalog in the current redesign map', () => {
    expect(map).toContain("import OpenEvoExperimentDesignCatalog from './OpenEvoExperimentDesignCatalog.astro'");
    expect(map).toContain('<OpenEvoExperimentDesignCatalog locale={locale} />');
    expect(zh).toContain('OpenEvoRedesignMap');
    expect(en).toContain('OpenEvoRedesignMap');
    expect(catalog).toContain('data-testid="openevo-experiment-design-catalog"');
  });

  it('groups recent config objects into seven reader-facing design families', () => {
    for (const id of familyIds) expect(catalog).toContain(id);
    for (const title of [
      'Shared Stage1 Harness and Deliberation',
      'Fresh Stage1 202609021800',
      'Stage1 MiniMax Post-Hoc Analysis',
      'OPSD v2 Parametric Bootstrap',
      'Stage2-vNext Persistent Evidence Learning',
      'GDN D1 Prospective Geometry Confirmation',
      'Ceiling-1.0 End-to-End Autonomous Campaign',
    ]) expect(catalog).toContain(title);
    expect(catalog).toContain('49 个设计、控制和诊断文件，不等于 49 个独立实验');
    expect(catalog).toContain('六个科学设计，外加一条放行控制线');
  });
  it('keeps design state distinct from execution results and uses progressive disclosure', () => {
    expect(catalog).toContain('设计目录不是实验结果');
    expect(catalog).toContain('FROZEN / PREREGISTERED');
    expect(catalog).toContain('<details class="design-catalog__evidence">');
    expect(catalog).toContain('technical child designs and pinned sources');
    expect(catalog).toContain('冻结或预注册都不等于运行完成');
    expect(catalog).toContain('查看设计目录的原始证据');
  });

  it('pins immutable upstream evidence and excludes private infrastructure from public copy', () => {
    expect(catalog).toContain('bb57c88eb5de3036dee3ea9b095bc550dd6882c8');
    expect(catalog).toContain('DESIGN_FAMILY_DRY_RUN.json');
    expect(catalog).toContain('PUBLIC_SAFE_DRY_RUN_SUMMARY.json');
    expect(catalog).not.toContain('/data/home/');
    expect(catalog).not.toContain('GPU-');
    expect(catalog).not.toMatch(/ephemeral-secret|minimax-0910-secret|api[_ -]?key/i);
  });

  it('keeps English design titles while Chinese remains the primary zh explanation', () => {
    expect(catalog).toContain("title: 'Fresh Stage1 202609021800'");
    expect(catalog).toContain('六个科学设计，外加一条放行控制线');
    expect(catalog).toContain('Six scientific designs, plus one release-control line');
    expect(catalog).toContain('运行完成、PASS/FAIL、指标和最终结论');
  });
});
