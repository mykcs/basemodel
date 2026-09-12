import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildDataHealth } from './dataHealth';

const notice = readFileSync(new URL('../components/catalog/CatalogFreshnessNotice.astro', import.meta.url), 'utf8');
const modelsIndex = readFileSync(new URL('../pages/_bodies/models-index.astro', import.meta.url), 'utf8');
const dataStatus = readFileSync(new URL('../pages/_bodies/data-status.astro', import.meta.url), 'utf8');

describe('catalog freshness boundary', () => {
  it('keeps post-snapshot first-party evidence visible without inferring flagship or release dates', () => {
    for (const token of ['Qwen 3.8 Max', 'Qwen 3.8 Plus / Flash', 'Gemini 3.7 Flash', 'Grok 4.6']) expect(notice).toContain(token);
    for (const url of [
      'ff5aa6be824a8979713c8e07bc90f10bc1020905',
      'ac513de34e15f87b0bc4810893d7c370fac9f8b7',
      'googleapis/python-genai',
      'xai-org/xai-sdk-python',
    ]) expect(notice).toContain(url);
    expect(notice).toContain('不是模型发布日期');
    expect(notice).toContain('不能单独证明');
    expect(notice).toContain('does not by itself establish');
    expect(modelsIndex).toContain('compact={true}');
    expect(modelsIndex).toContain("localePath(locale, '/data-status/')");
    expect(modelsIndex).not.toContain('showSignals={true}');
    expect(dataStatus).toContain('showSignals={true}');
  });

  it('marks a family snapshot stale after its vendor refresh window instead of leaving old current claims silently trusted', () => {
    const health = buildDataHealth(
      [],
      [{ id: 'qwen', name: 'Qwen', official_catalog_urls: ['https://example.test/qwen'], refresh_days: 7, model_types: ['api'] }],
      [{
        id: 'qwen',
        vendor_id: 'qwen',
        name: 'Qwen',
        current_generation: 'Qwen3.7',
        catalog_checked_at: '2026-08-12',
        current_claim: { text: 'old current claim', status: 'confirmed', source_url: 'https://example.test/qwen', checked_at: '2026-08-12' },
      }],
      new Date('2026-08-28T00:00:00Z'),
    );
    expect(health.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ modelId: 'qwen', recordType: 'family', reason: 'stale-source', checkedAt: '2026-08-12' }),
    ]));
    expect(health.familyCoverage[0]?.unresolvedCount).toBeGreaterThan(0);
  });
});
