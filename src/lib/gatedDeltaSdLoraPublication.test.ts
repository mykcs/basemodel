import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GATED_DELTA_SD_LORA_PUBLICATION as snapshot } from '../data/gatedDeltaSdLoraPublicationSnapshot';
import { CAPABILITY_READER_ROUTES } from '../data/capabilityReaderRoutes';
import { bilingualStaticPaths } from './sitemapRoutes';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const current = read('../components/research/OpenEvoGatedDeltaSdLoraExplainer.astro');
const history = read('../components/research/OpenEvoGdrDirectApplyExplainer.astro');

describe('Gated-Delta SD-LoRA publication split', () => {
  it('keeps runtime control free of Task Vector, score, probe, and future-state leakage', () => {
    expect(snapshot.runtimeBoundary.taskVectorRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.scoreRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.probeRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.futureStateRuntimeInput).toBe(false);
    expect(snapshot.runtimeBoundary.decay).toBe(0);
    expect(snapshot.status.realExecutionProved).toBe(true);
    expect(snapshot.status.executionProofOnly).toBe(true);
    expect(snapshot.status.fullPairedD1Complete).toBe(false);
    expect(snapshot.status.pairedRound0RolloutObserved).toBe(true);
    expect(snapshot.status.efficacyClaim).toBe(false);
    expect(snapshot.status.finalPanelAccess).toBe(false);
    expect(snapshot.routeSExecution.attemptCount).toBe(128);
    expect(snapshot.routeSExecution.appliedFactorWrites).toBe(7904);
    expect(snapshot.routeSExecution.allGExactZero).toBe(true);
  });

  it('gives current mechanism and historical experiment separate canonical owners', () => {
    expect(CAPABILITY_READER_ROUTES).toEqual(expect.arrayContaining([
      expect.objectContaining({ route: 'gdr-directapply', owner: 'OpenEvoGdrDirectApplyExplainer' }),
      expect.objectContaining({ route: 'gated-delta-sd-lora', owner: 'OpenEvoGatedDeltaSdLoraExplainer' }),
    ]));
    expect(bilingualStaticPaths).toContain('/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/');
  });

  it('keeps the current page about recurrent write rather than replaying the old admission experiment', () => {
    expect(current).toContain("Task Vector 只做事后分析，不参与在线更新");
    expect(current).toContain('S<sub>t</sub> = S̃<sub>t−1</sub> + β');
    expect(current).toContain('真实 GDR 路径已经跑通；方法效果还没有结论');
    expect(current).toContain('现在证明了“真的跑起来”，还没有证明“效果更好”');
    expect(current).toContain('snapshot.routeSExecution.appliedFactorWrites.toLocaleString');
    expect(current).toContain('完整四轮 Vanilla vs GDR paired D1 仍未完成');
    expect(current).not.toContain('20,480 rollouts · 44 candidates · 7 adopted');
    expect(current).not.toContain('16-task probe 比较新旧状态');
  });

  it('keeps the historical page about candidate admission rather than duplicating the current recurrence', () => {
    expect(history).toContain('历史 GDR-v1 训练了 44 个 candidate，只采用了 7 个');
    expect(history).toContain('固定 16 题 probe 比较新旧状态');
    expect(history).toContain('gated-delta-sd-lora');
    expect(history).not.toContain('S̃<sub>t−1</sub> = exp(g');
    expect(history).not.toContain('D0.26');
    expect(history).not.toContain('Task Vector 退出 runtime causal path');
  });

  it('pins a dated scientific source rather than turning the website into authority', () => {
    expect(snapshot.source.repository).toBe('mykcs/openevo-experiment');
    expect(snapshot.source.branch).toContain('gated-delta-sd-lora-event-write');
    expect(snapshot.source.head).toMatch(/^[0-9a-f]{40}$/);
    expect(snapshot.checkedAt).toMatch(/^2026-09-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
    expect(current).toContain('这是网站发布快照');
  });
});
