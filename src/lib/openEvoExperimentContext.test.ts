import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OPEN_EVO_CANONICAL_ROUTE_OWNERS, OPEN_EVO_EXPERIMENTS } from '../data/openEvoExperimentNavigation';
import { CAPABILITY_READER_ROUTES } from '../data/capabilityReaderRoutes';

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
  it('uses one src/data owner for both the Study index and experiment Hub', () => {
    const index = read('../components/research/OpenEvoExperimentIndex.astro');
    const owner = read('../data/openEvoExperimentNavigation.ts');
    expect(index).toContain("from '../../data/openEvoExperimentNavigation'");
    expect(context).toContain("from '../../data/openEvoExperimentNavigation'");
    expect(index).toContain('OPEN_EVO_EXPERIMENTS.map');
    expect(context).toContain('OPEN_EVO_EXPERIMENTS.find');
    expect(owner.match(/export const OPEN_EVO_EXPERIMENTS/g)).toHaveLength(1);
    expect(index).not.toContain('const experiments =');
    expect(context).not.toContain('const experiments =');
  });

  it('locks the experiment navigation data contract used by the Study index and Hubs', () => {
    const owner = read('../data/openEvoExperimentNavigation.ts');
    for (const field of ['id:', 'title:', 'summary:', 'primaryHref:', 'childLinks:', 'lineageNote?:', 'status:']) {
      expect(owner, field).toContain(field);
    }
    for (const experiment of OPEN_EVO_EXPERIMENTS) {
      expect(experiment.id).toBeTruthy();
      expect(experiment.title.zh && experiment.title.en).toBeTruthy();
      expect(experiment.summary.zh && experiment.summary.en).toBeTruthy();
      expect(experiment.primaryHref).toMatch(/^\/research\/seed-openevo\/study\//);
      expect(['historical', 'completed']).toContain(experiment.status);
      expect(experiment.childLinks.length).toBeGreaterThan(0);
      for (const child of experiment.childLinks) {
        expect(child.role).toBeTruthy();
        expect(child.label.zh && child.label.en).toBeTruthy();
        expect(child.href).toMatch(/^\/research\/seed-openevo\/study\//);
      }
    }
  });

  it('allows only explicit semantic child roles and never falls back to misc', () => {
    const allowedRoles = ['result', 'analysis', 'mechanism', 'diagnostic', 'history', 'evidence'];
    const owner = read('../data/openEvoExperimentNavigation.ts');
    expect(owner).not.toMatch(/['\"]misc['\"]/);
    for (const experiment of OPEN_EVO_EXPERIMENTS) {
      for (const child of [...experiment.childLinks, experiment.evidenceLink]) {
        expect(allowedRoles).toContain(child.role);
      }
    }
  });

  it('extends the existing research context instead of creating a second navigation system', () => {
    expect(context).toContain("CAPABILITY_READER_ROUTES");
    expect(context).toContain("OPEN_EVO_EXPERIMENTS");
    expect(context).toContain('experimentId?: OpenEvoExperimentId');
    expect(context).toContain('data-experiment-context');
    expect(context).toContain('data-experiment-hub-context');
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
    expect(context).toContain('data-hub-motivation');
    expect(context).toContain('data-hub-group="result"');
    expect(context).toContain('data-hub-group="analysis"');
    expect(context).toContain('data-hub-group="evidence"');
  });

  it('gives experiment-derived child routes one canonical parent and leaves archive-only routes unclaimed', () => {
    const experimentIds = new Set(OPEN_EVO_EXPERIMENTS.map((item) => item.id));
    const declaredRoutes = new Set<string>(CAPABILITY_READER_ROUTES.map((item) => item.route));
    for (const [route, owner] of Object.entries(OPEN_EVO_CANONICAL_ROUTE_OWNERS)) {
      expect(declaredRoutes.has(route), route).toBe(true);
      expect(experimentIds.has(owner), `${route} -> ${owner}`).toBe(true);
    }
    for (const route of ['stage2-7b-analysis', 'openevo-2-0/report', 'openevo-2-0/exploration', 'q17-directapply-frontier', 'sd-lora-scaling', 'sd-lora-history', 'text-memory']) {
      expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS[route], route).toBeDefined();
    }
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS.archive).toBeUndefined();
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS['stage1-previous']).toBeUndefined();
    expect(context).toContain('OPEN_EVO_CANONICAL_ROUTE_OWNERS');
    expect(context).toContain('resolvedExperimentId');
  });


  it('keeps archive and legacy bookmarks in the history/evidence tier rather than the focused research map', () => {
    const lobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS.archive).toBeUndefined();
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS['stage1-previous']).toBeUndefined();
    expect(lobby).toContain('data-archive-tier="history-evidence"');
    expect(lobby).toContain("{ href: stage1EvolutionHref, label: t('兼容旧书签：初始经验设计过程'");
    expect(lobby).not.toContain('data-deep-dive="stage1-evolution"');
    expect(lobby).toContain('它们用于追溯证据，不是新的主要实验入口');
  });

  it('binds all five canonical experiment entries in both locales', () => {
    for (const [route, experimentId] of canonical) {
      for (const prefix of ['', 'en/']) {
        const page = read(`../pages/${prefix}research/seed-openevo/study/capability-exploration/${route}/index.astro`);
        expect(page).toContain(`route=\"${route}\" experimentId=\"${experimentId}\"`);
      }
    }
  });

  it('keeps Chinese and English on one experiment IA with matching owned routes', () => {
    const zhStudy = read('../pages/research/seed-openevo/study/index.astro');
    const enStudy = read('../pages/en/research/seed-openevo/study/index.astro');
    for (const study of [zhStudy, enStudy]) {
      expect(study).toContain('OpenEvoExperimentIndex');
      expect(study).toContain('<OpenEvoExperimentIndex locale={locale} />');
      expect(study).not.toContain('OPEN_EVO_EXPERIMENTS.map');
    }

    const routeSourceExists = (prefix: string, route: string) => {
      const directoryRoute = new URL(`../pages/${prefix}research/seed-openevo/study/capability-exploration/${route}/index.astro`, import.meta.url);
      const fileRoute = new URL(`../pages/${prefix}research/seed-openevo/study/capability-exploration/${route}.astro`, import.meta.url);
      return existsSync(directoryRoute) || existsSync(fileRoute);
    };
    for (const route of Object.keys(OPEN_EVO_CANONICAL_ROUTE_OWNERS)) {
      expect(routeSourceExists('', route), `missing zh route: ${route}`).toBe(true);
      expect(routeSourceExists('en/', route), `missing en route: ${route}`).toBe(true);
    }

    for (const experiment of OPEN_EVO_EXPERIMENTS) {
      expect(experiment.title.zh).toBeTruthy();
      expect(experiment.title.en).toBeTruthy();
      expect(experiment.summary.zh).toBeTruthy();
      expect(experiment.summary.en).toBeTruthy();
      expect(experiment.childLinks.every((link) => Boolean(link.label.zh && link.label.en))).toBe(true);
    }
  });
});
