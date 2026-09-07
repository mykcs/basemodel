import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const map = read('../components/research/OpenEvoFirstRunMap.astro');
const zh = read('../pages/research/seed-openevo/study/capability-exploration/first-run/index.astro');
const en = read('../pages/en/research/seed-openevo/study/capability-exploration/first-run/index.astro');

describe('OpenEvo first-run historical map', () => {
  it('defaults to 7B while keeping a switchable 3B diagnostic lineage', () => {
    expect(map).toContain('data-first-run-arm="7b" aria-pressed="true"');
    expect(map).toContain('data-first-run-arm="3b" aria-pressed="false"');
    expect(map).toContain('data-first-run-panel="7b"');
    expect(map).toContain('data-first-run-panel="3b" hidden');
    expect(map).toContain('Qwen2.5-7B');
    expect(map).toContain('Qwen2.5-3B');
  });

  it('uses literal first-reader copy instead of decorative branching language', () => {
    expect(map).toContain('3B 和 7B 的第一轮购物实验');
    expect(map).toContain('我们分别用 Qwen2.5-3B 和 Qwen2.5-7B 做 WebShop 实验');
    expect(map).toContain("state: '7B 继续，3B 停止'");
    expect(map).not.toContain('第一轮购物学习：7B 与 3B 的分岔');
    expect(map).not.toContain('HISTORICAL MAP · FIRST RUN');
    expect(map).not.toContain('STAGE 1 → STAGE 2 → OUTCOME');
    expect(map).not.toContain('路径分叉');
    expect(map).not.toContain('两条模型线');
  });

  it('keeps scientific amendments on the main lineage and runtime repairs in a patch lane', () => {
    expect(map).toContain('data-node-kind="scientific-amendment"');
    expect(map).toContain('data-node-kind="engineering-fix" data-node-state="resolved"');
    expect(map).toContain('放宽参数学习容量');
    expect(map).toContain('修复训练运行问题');
    expect(map).toContain('64 指累计参数组件数，即已接受的更新次数，与经验缓存条数、一次训练内的优化步数不同');
    expect(map).toContain('有效秩上限仍为 4096');
    expect(map).toContain('经验缓存容量 replay_capacity=64 是另一项配置');
  });

  it('keeps compression out of the formal lineage while publishing the resolved post-run mechanism diagnostic', () => {
    expect(map).toContain('POST-RUN PARAMETER ANALYSIS');
    expect(map).toContain('data-node-kind="evidence" data-node-state="resolved"');
    expect(map).toContain('update stable rank 16.55');
    expect(map).toContain('K64');
    expect(map).toContain('K80');
    expect(map).toContain('K96');
    expect(map).toContain('压缩结果没有写回训练或正式最终模型');
  });

  it('preserves the stopped 3B evidence without turning the harness diagnosis into an amendment', () => {
    expect(map).toContain('3,200 次尝试永久保留为旧实验记录');
    expect(map).toContain('128 次尝试中，有 33 次因动作无效而结束');
    expect(map).toContain('data-node-kind="evidence" data-node-state="stopped"');
    expect(map).toContain('新接口需要重新采集初始经验');
    expect(map).toContain('/capability-exploration/openevo-2-0/');
  });

  it('uses progressive disclosure with mobile dialog semantics', () => {
    expect(map).toContain('data-first-run-detail-layer');
    expect(map).toContain('data-first-run-detail-close');
    expect(map).toContain('role="dialog"');
    expect(map).toContain("window.matchMedia('(max-width: 720px)')");
    expect(map).toContain("event.key === 'Escape'");
  });

  it('mounts the same shared map on both locale routes', () => {
    expect(zh).toContain('OpenEvoFirstRunMap');
    expect(en).toContain('OpenEvoFirstRunMap');
  });
});
