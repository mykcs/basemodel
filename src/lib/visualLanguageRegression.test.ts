import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layoutSource = readFileSync(new URL('../layouts/AppLayout.astro', import.meta.url), 'utf8');
const seedStripSource = readFileSync(new URL('../components/SeedUseCaseStrip.astro', import.meta.url), 'utf8');
const socialCoverSource = readFileSync(new URL('../../public/og-cover.svg', import.meta.url), 'utf8');

describe('visual language regression guards', () => {
  it('does not reintroduce the decorative evidence-first footer slogan', () => {
    expect(layoutSource).not.toContain('footer.motto');
    expect(socialCoverSource).not.toContain('数据优先，证据先行');
  });

  it('keeps page-level SEED context compact while preserving the full worked example', () => {
    expect(seedStripSource).toContain('seed-use-case-compact');
    expect(seedStripSource).toContain('standalone &&');
    expect(seedStripSource).toContain('!standalone &&');
    expect(seedStripSource).toContain('market-snapshot');
    expect(seedStripSource).toContain('ALFWorld / WebShop');
  });
});
