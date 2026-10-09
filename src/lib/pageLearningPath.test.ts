import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
describe('reader-meaning first sitewide learning path', () => {
  it('uses a meaningful, flat, static outline rather than a new card system', () => {
    const source = read('src/components/navigation/PageLearningPath.astro');
    expect(source).toContain('data-reader-guide');
    expect(source).toContain('<nav class="page-learning-path"');
    expect(source).toContain('items.length < 2 || items.length > 5');
    expect(source).toContain('href={item.href}');
    expect(source).toContain('border-bottom: 1px solid var(--line)');
    expect(source).not.toContain('client:visible');
    expect(source).not.toContain('box-shadow');
  });
  it('hides redundant anonymous rails without hiding the route-owning navigation', () => {
    const source = read('src/components/navigation/PageOutline.astro');
    expect(source).toContain('[data-reader-guide]');
    expect(source).toContain('.model-detail-nav');
    expect(source).toContain('.paper-nav');
    expect(source).toContain('.learning-track-nav');
    expect(source).toContain("['choice', 'operational', 'comparison'].includes(attentionMode ?? '')");
  });
  it('keeps the WebShop-specific table of contents as its owner, without inventing a second map', () => {
    const detail = read('src/components/research/SeedOpenEvoResearchDetail.astro');
    expect(detail).not.toContain("webshop: [");
    const source = read('src/components/navigation/PageOutline.astro');
    expect(source).toContain('[data-webshop-story-nav]');
    expect(source).toContain('.page-contents');
  });
});
