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

  it('keeps experiment-first headings human-readable instead of leading with internal shorthand', () => {
    const forbiddenLead = /^(?:7\s*<\s*8|Stage\s*\d|Q17|Track\s+[A-Z]|GATE\b)/i;
    for (const experiment of OPEN_EVO_EXPERIMENTS) {
      expect(experiment.title.zh).not.toMatch(forbiddenLead);
      expect(experiment.title.en).not.toMatch(forbiddenLead);
    }
    expect(OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gate-no-update')?.title.zh).toBe('训练跑了很久，但参数一直没有更新');
  });

  it('keeps scientific result numbers in canonical result owners instead of duplicating them into navigation', () => {
    const navigationOwner = read('../data/openEvoExperimentNavigation.ts');
    for (const duplicatedMetric of ['49.33', '37.60', '60.72', '58 / 128', '1 / 128', '44 个', '160 轮', '159 次']) {
      expect(navigationOwner, duplicatedMetric).not.toContain(duplicatedMetric);
    }
    expect(read('../components/research/OpenEvoCeilingStrategy.astro')).toContain('49.33 / 100');
    expect(read('../components/research/OpenEvoSuccessorReport.astro')).toContain('37.60');
    expect(read('../components/research/OpenEvoQ17DirectApplyAnalysis.astro')).toContain('60.72 / 100');
  });

  it('keeps child-page parent identity canonical while route-specific method explanation stays in body copy', () => {
    expect(context).toContain('const contextExperimentTitle = experiment?.title[locale];');
    expect(context).toContain('正式名称是 DirectApply / No-GDR');
    expect(context).not.toContain('共同检查通过后直接采用；不跑 16 题 GDR 新旧参数小测）');
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

  it('binds the five retained bilingual experiment snapshots to their canonical parents', () => {
    for (const [route, experimentId] of canonical) {
      const reader = CAPABILITY_READER_ROUTES.find((item) => item.route === route);
      expect(reader, route).toBeDefined();
      const pages = [
        read(`../pages/research/seed-openevo/study/capability-exploration/${route}/index.astro`),
        read(`../../docs/archive/site-en/src/pages/en/research/seed-openevo/study/capability-exploration/${route}/index.astro.archive`),
      ];
      for (const page of pages) {
        if (reader?.coverage === 'self-contained') {
          const owner = read(`../components/research/${reader.owner}.astro`);
          expect(page).not.toContain('<ResearchRouteContext');
          expect(owner).toContain(`experimentId=\"${experimentId}\"`);
          expect(owner).toContain('ResearchRouteContext');
        } else {
          expect(page).toContain(`route=\"${route}\" experimentId=\"${experimentId}\"`);
        }
      }
    }
  });

  it('binds the sixth completed Bounded experiment to its active canonical route', () => {
    const experiment = OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'bounded-effective-state-1p7b');
    expect(experiment?.status).toBe('completed');
    expect(experiment?.primaryHref).toBe('/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/');
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS['bounded-effective-state-gdr']).toBe('bounded-effective-state-1p7b');
    const reader = CAPABILITY_READER_ROUTES.find((item) => item.route === 'bounded-effective-state-gdr');
    expect(reader?.coverage).toBe('self-contained');
    const routePage = read('../pages/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/index.astro');
    expect(routePage).toContain('<ResearchRouteContext locale={locale} route="bounded-effective-state-gdr" />');
    expect(routePage).toContain('<OpenEvoEffectiveStateGdrLoraStudy locale={locale} />');
    expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS['bounded-effective-state-gdr']).toBe('bounded-effective-state-1p7b');
  });

  it('keeps experiment deep links resolvable and every experiment attached to result or analysis content', () => {
    const capabilityPrefix = '/research/seed-openevo/study/capability-exploration/';
    const routeSourceExists = (localePrefix: string, href: string) => {
      const path = href.split('#')[0];
      if (!path?.startsWith(capabilityPrefix)) return false;
      const route = path.slice(capabilityPrefix.length).replace(/\/$/, '');
      const directoryRoute = new URL(`../pages/${localePrefix}research/seed-openevo/study/capability-exploration/${route}/index.astro`, import.meta.url);
      const fileRoute = new URL(`../pages/${localePrefix}research/seed-openevo/study/capability-exploration/${route}.astro`, import.meta.url);
      return existsSync(directoryRoute) || existsSync(fileRoute);
    };

    const appearances = new Map<string, Set<string>>();
    for (const experiment of OPEN_EVO_EXPERIMENTS) {
      expect(experiment.childLinks.some((link) => ['result', 'analysis'].includes(link.role)), experiment.id).toBe(true);
      for (const link of [
        { href: experiment.primaryHref },
        ...experiment.childLinks,
        experiment.evidenceLink,
      ]) {
        expect(routeSourceExists('', link.href), `missing zh deep link: ${link.href}`).toBe(true);
        const route = link.href.split('#')[0]?.slice(capabilityPrefix.length).replace(/\/$/, '');
        if (!route) continue;
        const owners = appearances.get(route) ?? new Set<string>();
        owners.add(experiment.id);
        appearances.set(route, owners);
      }
    }

    for (const [route, owners] of appearances) {
      if (owners.size < 2) continue;
      expect(OPEN_EVO_CANONICAL_ROUTE_OWNERS[route], `cross-linked route needs one canonical owner: ${route}`).toBeDefined();
      expect(owners.has(OPEN_EVO_CANONICAL_ROUTE_OWNERS[route]!), `${route} canonical owner must be one of its experiment contexts`).toBe(true);
    }
  });

  it('keeps historical GDR-v1, DirectApply, and the recurrent-GDR successor as distinct objects', () => {
    const ids = OPEN_EVO_EXPERIMENTS.map((item) => item.id);
    expect(ids).toContain('gdr-v1-1p7b');
    expect(ids).toContain('directapply-1p7b');
    expect(ids.filter((id) => id.includes('gdr'))).toEqual(['gdr-v1-1p7b']);
    expect(OPEN_EVO_EXPERIMENTS.find((item) => item.id === 'gdr-v1-1p7b')?.lineageNote?.zh).toContain('GDR 机制问题');

    const history = read('../components/research/OpenEvoGdrDirectApplyExplainer.astro');
    const current = read('../components/research/OpenEvoGatedDeltaSdLoraExplainer.astro');
    expect(history).toContain('旧 GDR-v1');
    expect(history).toContain('DirectApply');
    expect(history).toContain('训练完，再筛一次');
    expect(history).not.toContain('id=\"recurrence\"');
    expect(current).toContain('Gated Delta 的 State 更新');
    expect(current).toContain('四轮 Vanilla vs GDR 配对资格实验已经全部封存');
    expect(current).toContain('这个结论只属于当前冻结的资格实验');
  });

  it('keeps the active Chinese experiment IA aligned with the retained English study snapshot', () => {
    const zhStudy = read('../pages/research/seed-openevo/study/index.astro');
    const enStudy = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/study/index.astro.archive');
    for (const study of [zhStudy, enStudy]) {
      expect(study).toContain('OpenEvoExperimentIndex');
      expect(study).toContain('<OpenEvoExperimentIndex locale={locale} />');
      expect(study).not.toContain('OPEN_EVO_EXPERIMENTS.map');
    }

    const routeSourceExists = (route: string) => {
      const directoryRoute = new URL(`../pages/research/seed-openevo/study/capability-exploration/${route}/index.astro`, import.meta.url);
      const fileRoute = new URL(`../pages/research/seed-openevo/study/capability-exploration/${route}.astro`, import.meta.url);
      return existsSync(directoryRoute) || existsSync(fileRoute);
    };
    for (const route of Object.keys(OPEN_EVO_CANONICAL_ROUTE_OWNERS)) {
      expect(routeSourceExists(route), `missing active zh route: ${route}`).toBe(true);
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
