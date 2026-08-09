import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./GuideContent.astro', import.meta.url), 'utf8');

describe('SEED site walkthrough', () => {
  it('keeps the end-to-end research route wired to real product pages', () => {
    for (const route of [
      '/papers/seed/',
      '/models/qwen2-5-3b-instruct/',
      '/models/',
      '/families/',
      '/landscape/',
      '/workspace/',
      '/compare/',
      '/data-status/',
      '/methodology/',
    ]) {
      expect(source).toContain(route);
    }
  });

  it('covers the global search, compare exports, evidence boundary, and local-only persistence', () => {
    expect(source).toContain('⌘K');
    expect(source).toContain('Markdown');
    expect(source).toContain('CSV');
    expect(source).toContain('BibTeX');
    expect(source).toContain('not_verified');
    expect(source).toContain('浏览器本地');
    expect(source).toContain('cloud storage');
  });

  it('anchors the tutorial on the actual SEED paper models and method-reproduction deep link', () => {
    expect(source).toContain('qwen2-5-3b-instruct');
    expect(source).toContain('qwen3-1-7b');
    expect(source).toContain('paper=seed');
    expect(source).toContain('mode=method');
    expect(source).toContain('runtime=verl');
  });
});
