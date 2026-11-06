import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url));
const index = JSON.parse(read('public/research/seed-openevo/evidence/source-index.json').toString());
const sortKeys = (value: unknown): unknown => Array.isArray(value) ? value.map(sortKeys)
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, item]) => [key, sortKeys(item)])) : value;

describe('anonymous public provenance', () => {
  it('keeps every scientific payload committed while withholding only known access locators', () => {
    const fields: Record<string, string[]> = {
      'research/seed-openevo/evidence/wandb-threeway/receipt.json': ['/source/entity', '/workspace', '/report'],
      'research/seed-openevo/evidence/q17-wandb-lineage-audit-20260915.json': ['/read_only_observations/wandb_project', '/historical_stage2_wandb_run', '/visualization_mirror/url', '/native_workspace/url'],
      'research/seed-openevo/evidence/bounded-effective-state-advisor-analysis-20260919.json': ['/wandb/workspace'],
    };
    expect(index.receipts).toHaveLength(3);
    expect(index.sources).toHaveLength(7);
    for (const receipt of index.receipts) {
      expect(receipt.locator_fields).toEqual(fields[receipt.path]);
      const evidence = JSON.parse(read(`public/${receipt.path}`).toString());
      expect(evidence.privacy_presentation.kind).toBe('presentation_derivative');
      expect(evidence.privacy_presentation.original_sha256).toBe(receipt.original_sha256);
      expect(receipt.original_sha256).toMatch(/^[a-f0-9]{64}$/);
      delete evidence.privacy_presentation;
      for (const pointer of fields[receipt.path]!) {
        const parts = pointer.slice(1).split('/');
        let parent = evidence;
        for (const part of parts.slice(0, -1)) parent = parent[part];
        delete parent[parts.at(-1)!];
      }
      const digest = createHash('sha256').update(JSON.stringify(sortKeys(evidence))).digest('hex');
      expect(digest, receipt.path).toBe(receipt.scientific_payload_sha256);
    }
  });

  it('restores the existing social card with actual decoded pixels and no metadata payload', async () => {
    const png = sharp(read('public/og-cover.png'));
    const metadata = await png.metadata();
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630]);
    expect(metadata.exif).toBeUndefined();
    expect(metadata.xmp).toBeUndefined();
    expect((await png.raw().toBuffer()).length).toBeGreaterThan(1200 * 630 * 3);
    const layout = read('src/layouts/AppLayout.astro').toString();
    expect(layout).toContain("new URL('/og-cover.png', siteOrigin)");
    expect(layout).toContain('property="og:image" content={ogImage}');
    expect(layout).toContain('name="twitter:image" content={ogImage}');
  });
});
