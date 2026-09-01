import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const tree = read('../components/research/OpenEvoCapabilityExperimentTree.astro');
const zhIndex = read('../pages/research/seed-openevo/study/capability-exploration/index.astro');
const enIndex = read('../pages/en/research/seed-openevo/study/capability-exploration/index.astro');

describe('OpenEvo roguelike experiment tree', () => {
  it('models Stage 1 and Stage 2 as separate floors', () => {
    expect(tree).toContain('data-floor="stage1"');
    expect(tree).toContain('data-floor="stage2"');
    expect(tree).toContain('进入第 2 层 · Stage 2');
    expect(tree).toContain('换地图');
  });

  it('keeps historical and corrected Stage-1 starts distinct', () => {
    expect(tree).toContain('data-stage1="old"');
    expect(tree).toContain('data-stage1="current"');
    for (const arm of ['old-3b-self', 'old-7b-self', 'old-3b-minimax', 'old-7b-minimax']) {
      expect(tree).toContain(`data-analysis="${arm}"`);
    }
  });
  it('shows the historical zero-update ending before the repair action', () => {
    expect(tree).toContain('data-bug="legacy-gate"');
    expect(tree).toContain('我们要求至少 8 个重复成功任务；四条历史路线里最好一块也只有 7 个');
    expect(tree).toContain('7 < 8');
    expect(tree).toContain('没有任何完整数据块触发参数更新');
    expect(tree).toContain('data-ending-from-old');
    expect(tree).not.toContain('data-ending-from-old hidden');
    expect(tree.indexOf('data-ending-from-old')).toBeLessThan(tree.indexOf('data-repair="legacy-gate"'));
    expect(tree).toContain('旧 run 的 0-update 结局原样保留');
  });

  it('gives Ceiling-1.0 and OpenEVO 2.0 separate arrows and destinations', () => {
    expect(tree).toContain('data-current-map-arrow="ceiling"');
    expect(tree).toContain('data-current-map-arrow="evo2"');
    expect(tree).toContain('data-current-outcome-slot="ceiling"');
    expect(tree).toContain('data-current-outcome-slot="evo2"');
    expect(tree).toContain('各自进入不同的后续节点');
    expect(tree).toContain('data-ceiling-lineage');
    expect(tree).toContain('data-current-route="ceiling"');
    expect(tree).toContain('data-current-route="evo2"');
  });

  it('renders the Ceiling-1.0 pilot with semantic node hierarchy', () => {
    expect(tree).toContain('data-ceiling-lineage');
    expect(tree).toContain('data-node-type="scientific-amendment"');
    expect(tree).toContain('取消独立 64-component 停止线');
    expect(tree).toContain('effective rank ≤ 4096；replay_capacity=64 不变');
    expect(tree).toContain('7B capacity-amended run');
    expect(tree).toContain('data-node-type="engineering-fix"');
    for (const fix of ['trainer 来源', '重启校验', '谱系记录', 'HF 冷归档']) {
      expect(tree).toContain(fix);
    }
    expect(tree).toContain('data-node-state="future"');
    expect(tree).toContain('Rank reduction / compression');
    expect(tree).toContain('尚未激活；需要单独 scientific amendment');
    expect(tree).toContain('current-route-row--ceiling');
    expect(tree).toContain('ceiling-lineage__spine');
  });

  it('marks Harness 2.0.1 mechanically complete and moves the lock to readiness', () => {
    expect(tree).toContain('Harness 2.0 Mini Study：v1 接口问题');
    expect(tree).toContain('Harness 2.0.1 · Mechanical PASS');
    expect(tree).toContain('data-harness201-status');
    expect(tree).toContain('HOLD_FOR_STAGE2_READINESS_AUDIT');
    expect(tree).toContain('data-readiness-gate disabled');
    expect(tree).toContain('BLOCKED_HARNESS_READINESS');
    expect(tree).not.toContain("修复完成并重新 qualification 后解锁");
  });

  it('keeps detailed experiment pages secondary to the inline outcome', () => {
    for (const href of ['/3b-self-analysis/', '/7b-self-analysis/', '/3b-minimax-analysis/', '/7b-minimax-analysis/', '/stage2-ceiling/', '/harness-2-0/']) {
      expect(tree).toContain(href);
    }
    expect(tree).toContain('data-story-zone');
    expect(tree).toContain('继续看这条线的完整实验页与证据');
  });

  it('mounts before detailed blocks on both locale homepages', () => {
    expect(zhIndex).toContain('OpenEvoCapabilityExperimentTree');
    expect(enIndex).toContain('OpenEvoCapabilityExperimentTree');
    expect(zhIndex.indexOf('OpenEvoCapabilityExperimentTree locale')).toBeLessThan(zhIndex.indexOf('OpenEvoStage1VersionComparison locale'));
  });
});
