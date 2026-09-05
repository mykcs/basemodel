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

  it('keeps scientific amendments on the main lineage and runtime repairs in a patch lane', () => {
    expect(map).toContain('data-node-kind="scientific-amendment"');
    expect(map).toContain('data-node-kind="engineering-fix" data-node-state="resolved"');
    expect(map).toContain('放宽参数学习容量');
    expect(map).toContain('修复训练运行问题');
    expect(map).toContain('64 数的是累计 SD-LoRA component，不是 replay buffer，也不是 optimizer step');
    expect(map).toContain('effective-rank cap 仍是 4096');
    expect(map).toContain('replay_capacity=64 是另一项独立配置');
  });

  it('keeps compression out of the formal lineage while publishing the resolved post-run mechanism diagnostic', () => {
    expect(map).toContain('POST-RUN PARAMETER ANALYSIS');
    expect(map).toContain('data-node-kind="evidence" data-node-state="resolved"');
    expect(map).toContain('update stable rank 16.55');
    expect(map).toContain('K64');
    expect(map).toContain('K80');
    expect(map).toContain('K96');
    expect(map).toContain('不属于 formal final checkpoint');
  });

  it('preserves the stopped 3B evidence without turning the harness diagnosis into an amendment', () => {
    expect(map).toContain('3,200 条');
    expect(map).toContain('33/128 invalid termination');
    expect(map).toContain('data-node-kind="evidence" data-node-state="stopped"');
    expect(map).toContain('新 Harness 必须从新的 Stage 1 重新开始');
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
