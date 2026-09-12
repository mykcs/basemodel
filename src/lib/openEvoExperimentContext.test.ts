import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OPEN_EVO_EXPERIMENTS } from '../data/openEvoExperimentNavigation';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const context = read('../components/research/ResearchRouteContext.astro');

const canonical = [
  ['stage2-256-window', 'gate-no-update'],
  ['stage2-ceiling', '7b-long-run'],
  ['openevo-2-0', 'successor-3b-1p7b'],
  ['gdr-directapply', 'gdr-v1-1p7b'],
  ['q17-directapply-analysis', 'directapply-1p7b'],
] as const;

describe('experiment context hierarchy', () => {
  it('extends the existing research context instead of creating a second navigation system', () => {
    expect(context).toContain("OPEN_EVO_EXPERIMENTS");
    expect(context).toContain('experimentId?: OpenEvoExperimentId');
    expect(context).toContain('data-experiment-context');
    expect(context).toContain('data-experiment-id={experiment?.id}');
    expect(context).toContain("'实验目录'");
    expect(context).toContain("'Experiment index'");
  });

  it('gives every experiment hub a motivation, result path, analysis path, and evidence/history path', () => {
    for (const experiment of OPEN_EVO_EXPERIMENTS) {
      expect(experiment.motivation.zh.length).toBeGreaterThan(10);
      expect(experiment.motivation.en.length).toBeGreaterThan(10);
      expect(experiment.childLinks.some((link) => ['analysis', 'mechanism', 'diagnostic'].includes(link.role))).toBe(true);
      expect(['evidence', 'history']).toContain(experiment.evidenceLink.role);
      expect(experiment.evidenceLink.href.startsWith('/research/seed-openevo/study/')).toBe(true);
    }
    expect(context).toContain('data-experiment-hub');
    expect(context).toContain('data-hub-group="result"');
    expect(context).toContain('data-hub-group="analysis"');
    expect(context).toContain('data-hub-group="evidence"');
  });

  it('binds all five canonical experiment entries in both locales', () => {
    for (const [route, experimentId] of canonical) {
      for (const prefix of ['', 'en/']) {
        const page = read(`../pages/${prefix}research/seed-openevo/study/capability-exploration/${route}/index.astro`);
        expect(page).toContain(`route=\"${route}\" experimentId=\"${experimentId}\"`);
      }
    }
  });
});
