import { describe, expect, it } from 'vitest';
import { estimateVram } from './HardwareCalculator';

const base = { parameters: 7, context: 4096, batch: 1, gpuCount: 1, rank: 16, precision: 'bf16' as const, optimizer: 'adam' as const };

describe('estimateVram', () => {
  it('changes planning output for precision, context, batch, rank, optimizer, and GPU count', () => {
    const oneGpu = estimateVram(base);
    expect(estimateVram({ ...base, precision: 'fp32' }).inference).toBeGreaterThan(oneGpu.inference);
    expect(estimateVram({ ...base, context: 32768 }).inference).toBeGreaterThan(oneGpu.inference);
    expect(estimateVram({ ...base, batch: 4 }).inference).toBeGreaterThan(oneGpu.inference);
    expect(estimateVram({ ...base, parameters: 70, rank: 64 }).adapter).toBeGreaterThan(estimateVram({ ...base, parameters: 70 }).adapter);
    expect(estimateVram({ ...base, optimizer: 'none' }).training).toBeLessThan(oneGpu.training);
    expect(estimateVram({ ...base, gpuCount: 2 }).inference).toBeLessThan(oneGpu.inference);
    expect(estimateVram({ ...base, kvCacheEnabled: false }).inference).toBeLessThan(oneGpu.inference);
  });
});
