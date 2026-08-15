import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const explainer = [
  read('src/components/research/InteractiveResearchExplainer.tsx'),
  read('src/components/research/explainer/ResearchExplainerPrimitives.tsx'),
  read('src/components/research/explainer/EnvironmentExplainers.tsx'),
  read('src/components/research/explainer/MethodExplainers.tsx'),
  read('src/components/research/explainer/ServerExplainer.tsx'),
  read('src/components/research/AlfworldTaskFamilies.astro'),
].join('\n');
const css = [
  read('src/styles/interactive-research-explainer.css'),
  read('src/styles/interactive-research-explainer-core.css'),
  read('src/styles/interactive-research-explainer-environments.css'),
  read('src/styles/interactive-research-explainer-methods.css'),
].join('\n');
const trajectory = read('src/components/research/AgentEnvironmentTrajectory.astro');
const detail = read('src/components/research/SeedOpenEvoResearchDetail.astro');
const pageRouter = read('src/components/research/SeedOpenEvoResearchPage.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const evoZh = read('src/pages/research/seed-openevo/openevo.astro');
const evoEn = read('src/pages/en/research/seed-openevo/openevo.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');

describe('interactive research explainers', () => {
  it('mounts the priority bilingual explainers as visible islands', () => {
    expect(trajectory).toContain('kind="webshop"');
    expect(trajectory).toContain('kind="alfworld"');
    expect(trajectory.match(/client:visible/g)?.length).toBe(2);
    for (const [source, kind] of [
      [seedZh, 'seed'], [seedEn, 'seed'], [evoZh, 'openevo'], [evoEn, 'openevo'],
      [loopsZh, 'compare'], [loopsEn, 'compare'], [labZh, 'server'], [labEn, 'server'],
    ] as const) {
      expect(source).toContain('InteractiveResearchExplainer');
      expect(source).toContain(`kind="${kind}"`);
      expect(source).toContain('client:visible');
    }
  });

  it('places the progressive explainer before the long technical core through a shared slot', () => {
    expect(pageRouter).toContain('<slot />');
    expect(detail).toContain('<slot />');
    expect(detail.indexOf('<slot />')).toBeLessThan(detail.indexOf('SeedOpenEvoResearchPageCore'));
    expect(seedZh).not.toContain('SeedFrameworkDiagram');
    expect(seedEn).not.toContain('SeedFrameworkDiagram');
    expect(evoZh).not.toContain('OpenEvoFrameworkDiagram');
    expect(evoEn).not.toContain('OpenEvoFrameworkDiagram');
    expect(loopsZh).not.toContain('SeedOpenEvoComparisonDiagram');
    expect(loopsEn).not.toContain('SeedOpenEvoComparisonDiagram');
    expect(labZh).not.toContain('ServerAuthorityDiagram');
    expect(labEn).not.toContain('ServerAuthorityDiagram');
    expect(guide).toContain('kind="server"');
    expect(guide).toContain('kind="compare"');
    expect(guide).not.toContain('ServerAuthorityDiagram');
    expect(guide).not.toContain('SeedOpenEvoComparisonDiagram');
  });

  it('keeps one shared semantic color and line-style grammar', () => {
    for (const token of ['--irx-env:#2563eb', '--irx-experience:#d97706', '--irx-signal:#dc2626', '--irx-state:#7c3aed', '--irx-persist:#059669']) expect(css).toContain(token);
    expect(explainer).toContain('<marker');
    expect(css).toContain('stroke-dasharray');
    expect(css).toContain('.irx-edge-layer');
    expect(css).toContain('.irx-edge-persist');
    for (const token of ['--irx-env-text:', '--irx-experience-text:', '--irx-state-text:', '--irx-persist-text:']) expect(css).toContain(token);
  });

  it('measures connector endpoints from live DOM geometry instead of fixed SVG coordinates', () => {
    for (const term of ['ResizeObserver', 'getBoundingClientRect()', 'data-flow-id', 'data-flow-edge', 'data-from-anchor', 'data-start-x', 'connectorPath']) expect(explainer).toContain(term);
    expect(explainer).not.toMatch(/<path className="(?:state|env|signal|persist|control)" d="M\d/);
    expect(css).toContain('@media(max-width:760px)');
    expect(css).toContain('.irx-edge-layer{display:none}');
  });

  it('teaches WebShop as a changing website environment with explicit benchmark boundaries', () => {
    for (const term of ['OBSERVATION', 'AVAILABLE ACTIONS', 'AGENT SELECTED', 'ENVIRONMENT TRANSITION', 'REWARD / SCORE', 'search["black sports sweatshirt"]', 'click["Buy Now"]']) expect(explainer).toContain(term);
    for (const boundary of ['1,000-product', '6680 / 2590', 'Phase H0 Natural Success Search', 'goal 0–499', 'goal 500–end']) expect(explainer).toContain(boundary);
    expect(explainer).toContain('教学演示');
    expect(explainer).toContain('not a measured Phase G result');
  });

  it('makes ALFWorld world state, movement, precondition failure, and splits explicit', () => {
    for (const term of ['AGENT INVENTORY', 'MICROWAVE', 'PRECONDITION FAILED', 'apple is not in microwave', 'put apple in microwave', 'GOAL SATISFIED', 'train / valid_seen / valid_unseen']) expect(explainer).toContain(term);
    expect(explainer).toContain('goto · pick · open · put · heat · cool · clean · examine');
    expect(explainer).toContain('movementEdges');
  });

  it('makes SEED same-action dual-context re-scoring and both learning branches explicit', () => {
    for (const term of ['hold the same sampled action tokens fixed', 'P_plain(action)', 'P_skill(action)', 'plain context', 'skill-augmented context', 'OPD', 'GRPO', 'GRPO + OPD', 'policy θt+1', 'next-loop']) expect(explainer).toContain(term);
    expect(explainer).toContain('Illustrative probabilities only');
    expect(explainer).toContain('same checkpoint');
  });

  it('keeps OpenEvo carrier fan-out, validation merge, successor revision, and next-task loop explicit', () => {
    for (const term of ['SEALED EVIDENCE', 'EVOLUTION METHOD', 'MEMORY', 'AGENT ARTIFACT', 'PARAMETRIC ADAPTER', 'VALIDATION GATE', 'fresh reload', 'behavior probe', 'scientific contract', 'SUCCESSOR REVISION', 'TASK N+1']) expect(explainer).toContain(term);
    expect(explainer).toContain('OpenEvo ≠ SD-LoRA');
    expect(explainer).toContain('method-${item.id}');
    expect(explainer).toContain('${item.id}-validation');
  });

  it('compares SEED and OpenEvo from one shared experience instead of a table', () => {
    for (const term of ['SHARED EXPERIENCE', 'update mechanism', 'task boundary', 'carrier', 'validation', 'what persists', 'activation timing']) expect(explainer).toContain(term);
    expect(explainer).toContain('shared-seed');
    expect(explainer).toContain('shared-evo');
    expect(explainer).toContain('current OpenEvo WebShop path');
  });

  it('preserves the server sibling-container and authorization model with measured connectors', () => {
    for (const term of ['Docker daemon', 'dev-wangr / wangr-dev', 'root UID 0', '/var/run/docker.sock', 'UID/GID 1001:1001', 'no Docker socket', '/data/home/wangr/workspace', 'dev-guozy · dev-huzh', 'container root ≠ physical-host ownership', 'technical capability ≠ authorization scope']) expect(explainer).toContain(term);
    for (const edge of ['dev-socket', 'socket-daemon', 'daemon-exp', 'daemon-siblings', 'dev-workspace', 'exp-workspace']) expect(explainer).toContain(edge);
    expect(explainer).toContain('irx-mobile-relations');
    expect(explainer).toContain('they are not child containers of dev-wangr');
  });

  it('supports keyboard navigation, static SSR content, audit markup, and reduced-motion fallback', () => {
    for (const key of ["event.key === 'ArrowRight'", "event.key === 'ArrowLeft'", "event.key === 'Home'", "event.key === 'End'"]) expect(explainer).toContain(key);
    expect(explainer).toContain('aria-live="polite"');
    expect(explainer).toContain('data-ui-audit="contrast layout"');
    expect(explainer).toContain('data-ui-audit-item');
    expect(explainer).toContain("window.matchMedia('(prefers-reduced-motion: reduce)')");
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
  });
});
