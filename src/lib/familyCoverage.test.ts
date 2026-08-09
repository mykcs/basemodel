import { describe, expect, it } from 'vitest';
import { currentSurfaceSummary, familyCoverageRecords, localizedFamilyClaim } from './familyCoverage';

describe('effective family coverage', () => {
  it('separates Qwen hosted/API current models from the open-weight flagship', () => {
    const qwen = familyCoverageRecords.find((family) => family.id === 'qwen');
    expect(qwen).toBeDefined();
    expect(qwen?.current_generation).toBe('Qwen3.7');
    expect(currentSurfaceSummary(qwen!).api).toBe('qwen3-7-max');
    expect(currentSurfaceSummary(qwen!).openWeight).toBe('qwen3-6-35b-a3b');
  });
  it('provides localized current-state claims for highlighted families', () => {
    for (const id of ['qwen', 'kimi', 'llama', 'deepseek']) {
      const family = familyCoverageRecords.find((item) => item.id === id)!;
      expect(localizedFamilyClaim(family, 'zh')).toBeTruthy();
      expect(localizedFamilyClaim(family, 'en')).toBeTruthy();
    }
  });
});
