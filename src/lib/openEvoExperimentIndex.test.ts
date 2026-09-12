import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../components/research/OpenEvoExperimentIndex.astro', import.meta.url), 'utf8');

describe('experiment-first Study index', () => {
  it('uses five experiments as parents and analysis links as children', () => {
    for (const title of [
      '训练跑了很久，但参数一直没有更新',
      '7B 长周期实验',
      '3B + 1.7B 后继实验',
      '1.7B · GDR-v1 实验',
      '1.7B · DirectApply / No-GDR 实验',
    ]) expect(source).toContain(title);
    expect(source).toContain('class="experiment-children"');
    expect(source).toContain('SD-LoRA 为什么越来越慢');
    expect(source).toContain('它同时属于上一项 3B + 1.7B 后继实验');
  });
});
