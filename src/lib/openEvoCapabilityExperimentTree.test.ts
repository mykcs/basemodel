import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const tree = read('../components/research/OpenEvoCapabilityExperimentTree.astro');
const zhIndex = read('../pages/research/seed-openevo/study/capability-exploration/index.astro');
const enIndex = read('../pages/en/research/seed-openevo/study/capability-exploration/index.astro');

describe('OpenEvo capability experiment tree', () => {
  it('makes the four research layers explicit', () => {
    for (const term of ['Stage 1', '轨迹采集', '分析 / 状态构建', 'Stage 2', '结果 / 研究']) {
      expect(tree).toContain(term);
    }
  });

  it('keeps the historical and current Stage-1 lineages distinct', () => {
    expect(tree).toContain('旧版 1,440 条轨迹');
    expect(tree).toContain('fresh corrected 1,440 条轨迹');
    expect(tree).toContain('3B / 7B × self / MiniMax');
    expect(tree).toContain('OPSD · Text Memory · Skill Bundle · Agent System');
  });
  it('shows all three Stage-2 designs without implying one shared Stage-1 corpus', () => {
    expect(tree).toContain('历史 256-window 硬门槛');
    expect(tree).toContain('OpenEVO-Ceiling-1.0');
    expect(tree).toContain('OpenEVO 2.0');
    expect(tree).toContain('下面两条共享同一个 fresh corrected Stage 1');
  });

  it('links the public research branches and mounts on both locale homepages', () => {
    for (const href of [
      '/stage1-previous/', '/four-arm-analysis/', '/minimax-teacher/',
      '/stage2-256-window/', '/stage2-ceiling/', '/openevo-2-0/', '/harness-2-0/',
    ]) expect(tree).toContain(href);
    expect(zhIndex).toContain('OpenEvoCapabilityExperimentTree');
    expect(enIndex).toContain('OpenEvoCapabilityExperimentTree');
    expect(zhIndex.indexOf('OpenEvoCapabilityExperimentTree locale')).toBeLessThan(zhIndex.indexOf('OpenEvoStage1VersionComparison locale'));
  });
});
