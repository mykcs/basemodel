import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const tree = read('../components/research/OpenEvoCapabilityExperimentTree.astro');
const treeMarkup = tree.slice(0, tree.indexOf('<script>'));
const zhIndex = read('../pages/research/seed-openevo/study/capability-exploration/index.astro');
const enIndex = read('../pages/en/research/seed-openevo/study/capability-exploration/index.astro');
const lobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const zhFirstRun = read('../pages/research/seed-openevo/study/capability-exploration/first-run/index.astro');
const enFirstRun = read('../pages/en/research/seed-openevo/study/capability-exploration/first-run/index.astro');

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

  it('renders the Ceiling-1.0 pilot with ELI5 map labels and progressive disclosure', () => {
    expect(tree).toContain('data-ceiling-lineage');
    expect(tree).toContain('data-node-type="scientific-amendment"');
    for (const label of ['放宽参数更新次数', '继续 7B 训练', '修复训练运行问题', '7B 当前进度', '以后可能压缩已积累的参数更新']) {
      expect(tree).toContain(label);
    }
    for (const vagueLabel of ['放宽 64 限制', '7B 继续跑', '>工程修复<', '>当前结果<', '>以后可能压缩<']) {
      expect(tree).not.toContain(vagueLabel);
    }
    expect(tree).toContain('每 128 次任务整理一轮经验');
    expect(tree).toContain('不再固定最多 64 次');
    expect(tree).toContain('训练仍在继续');
    for (const key of ['amendment', 'run', 'fixes', 'result', 'future']) {
      expect(tree).toContain(`data-lineage-detail="${key}"`);
      expect(tree).toContain(`data-lineage-detail-template="${key}"`);
    }
    expect(tree).toContain('data-lineage-detail-layer');
    expect(tree).toContain('data-lineage-detail-close');
    expect(tree).toContain('role="dialog"');
    expect(tree).toContain('data-node-type="engineering-fix"');
    expect(tree).toContain('用对训练代码');
    expect(tree).toContain('中断后还能接着跑');
    expect(tree).toContain('把来历记完整');
    expect(tree).toContain('归档以后仍然认得');
    expect(tree).toContain('技术记录：trainer source · restart validator · execution provenance · HF cold archive。');
    expect(tree).toContain('data-node-state="future"');
    expect(tree).toContain('rank reduction / compression · future scientific amendment');
    expect(tree).toContain('current-route-row--ceiling');
    expect(tree).toContain('ceiling-lineage__spine');
  });

  it('separates visible route previews from truly hidden content', () => {
    expect(tree).toContain('data-preview-state="preview"');
    expect(tree).toContain('const setPreviewState = (el: HTMLElement, preview: boolean)');
    expect(tree).toContain("button.setAttribute('aria-disabled', 'true')");
    expect(tree).toContain('button.tabIndex = -1');
    const previewTags = [...treeMarkup.matchAll(/<[^>]*data-route-preview[^>]*>/g)].map((match) => match[0]);
    expect(previewTags.length).toBeGreaterThan(0);
    expect(previewTags.some((tag) => /\shidden(?:\s|>)/.test(tag))).toBe(false);
    expect(tree).toContain('data-floor="stage2" hidden');
    expect(tree).toContain('data-lineage-detail-layer hidden');
    expect(tree).toContain('data-story={story.id} hidden');
    expect(tree).not.toContain('!important');
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

  it('uses the capability homepage as a two-map lobby and preserves a first-run child route', () => {
    expect(zhIndex).toContain('OpenEvoCapabilityMapLobby');
    expect(enIndex).toContain('OpenEvoCapabilityMapLobby');
    expect(zhIndex).not.toContain('OpenEvoCapabilityExperimentTree');
    expect(enIndex).not.toContain('OpenEvoCapabilityExperimentTree');
    expect(lobby).toContain('data-map-choice="first-run"');
    expect(lobby).toContain('data-map-choice="redesign"');
    expect(lobby).toContain('/capability-exploration/first-run/');
    expect(lobby).toContain('/capability-exploration/openevo-2-0/');
    expect(zhFirstRun).toContain('data-testid="openevo-first-run-shell"');
    expect(enFirstRun).toContain('data-testid="openevo-first-run-shell"');
  });
});
