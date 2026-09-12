import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  OPEN_EVO_EXPERIMENTS,
  OPEN_EVO_SECONDARY_ROUTES,
} from '../data/openEvoExperimentNavigation';

const source = readFileSync(new URL('../components/research/OpenEvoExperimentIndex.astro', import.meta.url), 'utf8');

describe('experiment-first Study index', () => {
  it('renders from one machine-readable experiment navigation owner', () => {
    expect(OPEN_EVO_EXPERIMENTS).toHaveLength(5);
    expect(new Set(OPEN_EVO_EXPERIMENTS.map((item) => item.id)).size).toBe(5);
    expect(source).toContain("from '../../data/openEvoExperimentNavigation'");
    expect(source).toContain('OPEN_EVO_EXPERIMENTS.map');
    expect(source).toContain('experiment.childLinks.map');
  });

  it('keeps the five experiment parents and key lineage/analysis children', () => {
    const titles = OPEN_EVO_EXPERIMENTS.map((item) => item.title.zh);
    expect(titles).toEqual([
      '训练跑了很久，但参数一直没有更新',
      '7B 长周期实验',
      '3B + 1.7B 后继实验',
      '1.7B · GDR-v1 实验',
      '1.7B · DirectApply / No-GDR 实验',
    ]);    const allChildren = OPEN_EVO_EXPERIMENTS.flatMap((item) => item.childLinks);
    expect(allChildren.some((child) => child.label.zh === 'SD-LoRA 为什么越来越慢')).toBe(true);
    expect(allChildren.every((child) => child.role !== undefined)).toBe(true);
    expect(OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gdr-v1-1p7b')?.lineageNote?.zh)
      .toContain('同时属于上一项 3B + 1.7B 后继实验');
    expect(OPEN_EVO_SECONDARY_ROUTES).toHaveLength(3);
  });
});
