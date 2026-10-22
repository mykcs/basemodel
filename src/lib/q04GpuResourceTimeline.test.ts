import { describe, expect, it } from 'vitest';
import {
  Q04_GPU_ROUND140 as receipt,
  q04GpuHasContinuousSampling,
  q04GpuPeakGiB,
  q04GpuSeconds,
} from '../data/research-evidence/advisor-q04-gpu-round140-20261022';

describe('Q04 single-cycle GPU-resource evidence', () => {
  it('describes a 34m32s experiment, not a GPU-indexed snapshot', () => {
    expect(q04GpuSeconds).toBeGreaterThan(2072);
    expect(q04GpuSeconds).toBeLessThan(2073);
    expect(receipt.identity).toContain('Round 140');
    expect(receipt.model).toBe('Qwen3-1.7B');
  });

  it('keeps the actual stages contiguous and within the real cycle', () => {
    expect(receipt.stages[0].startSeconds).toBe(0);
    expect(receipt.stages.at(-1)?.endSeconds).toBeCloseTo(q04GpuSeconds, 2);
    for (let index = 1; index < receipt.stages.length; index++) {
      expect(receipt.stages[index]!.startSeconds).toBe(receipt.stages[index - 1]!.endSeconds);
    }
    expect((receipt.stages[0].endSeconds / q04GpuSeconds) * 100).toBeCloseTo(75, 0);
  });

  it('cannot convert two NVML snapshots and a PyTorch stage peak into one measured curve', () => {
    expect(q04GpuHasContinuousSampling).toBe(false);
    expect(receipt.nvmlSnapshots).toHaveLength(2);
    expect(receipt.nvmlSnapshots.map(x => x.usedMiB)).toEqual([2, 4586]);
    expect(receipt.nvmlSnapshots.every(x => x.tSeconds >= 0 && x.tSeconds < q04GpuSeconds)).toBe(true);
    expect(q04GpuPeakGiB).toBeCloseTo(5.7148, 3);
    expect(receipt.schedulerBudget.highPhaseMiB).toBe(24576);
    expect(receipt.schedulerBudget.highPhaseMiB / 1024).toBeGreaterThan(q04GpuPeakGiB);
  });
});
