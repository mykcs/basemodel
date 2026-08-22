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
const detailCore = read('src/components/research/SeedOpenEvoResearchPageCore.astro');
const pageRouter = read('src/components/research/SeedOpenEvoResearchPage.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const evoZh = read('src/pages/research/seed-openevo/openevo.astro');
const evoEn = read('src/pages/en/research/seed-openevo/openevo.astro');
const webshopZh = read('src/pages/research/seed-openevo/webshop.astro');
const webshopEn = read('src/pages/en/research/seed-openevo/webshop.astro');
const alfworldZh = read('src/pages/research/seed-openevo/alfworld.astro');
const alfworldEn = read('src/pages/en/research/seed-openevo/alfworld.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');

describe('interactive research explainers', () => {
  it('mounts each true step-by-step bilingual explainer only on its dedicated route', () => {
    for (const [source, kind] of [
      [seedZh, 'seed'], [seedEn, 'seed'], [evoZh, 'openevo'], [evoEn, 'openevo'],
      [webshopZh, 'webshop'], [webshopEn, 'webshop'], [alfworldZh, 'alfworld'], [alfworldEn, 'alfworld'],
      [labZh, 'server'], [labEn, 'server'],
    ] as const) {
      expect(source).toContain('InteractiveResearchExplainer');
      expect(source).toContain(`kind="${kind}"`);
      expect(source).toContain('client:visible');
    }
    for (const source of [loopsZh, loopsEn]) {
      expect(source).toContain('SeedOpenEvoCanonicalFigure');
      expect(source).not.toContain('InteractiveResearchExplainer');
      expect(source).not.toContain('kind="compare"');
      expect(source).not.toContain('client:visible');
    }
    expect(trajectory).toContain('ResearchConceptIndex');
    expect(trajectory).not.toContain('InteractiveResearchExplainer');
    expect(guide).not.toContain('InteractiveResearchExplainer');
  });

  it('places the progressive explainer before the long technical core through a shared slot', () => {
    expect(pageRouter).toContain('<slot />');
    expect(detail).toContain('<slot />');
    const slotPosition = detail.indexOf('<slot />');
    const coreMarkupPosition = detail.lastIndexOf('<SeedOpenEvoResearchPageCore');
    expect(slotPosition).toBeGreaterThan(-1);
    expect(coreMarkupPosition).toBeGreaterThan(slotPosition);
    expect(seedZh).not.toContain('SeedFrameworkDiagram');
    expect(seedEn).not.toContain('SeedFrameworkDiagram');
    expect(evoZh).not.toContain('OpenEvoFrameworkDiagram');
    expect(evoEn).not.toContain('OpenEvoFrameworkDiagram');
    expect(loopsZh).not.toContain('SeedOpenEvoComparisonDiagram');
    expect(loopsEn).not.toContain('SeedOpenEvoComparisonDiagram');
    expect(labZh).not.toContain('ServerAuthorityDiagram');
    expect(labEn).not.toContain('ServerAuthorityDiagram');
    expect(guide).not.toContain('kind="server"');
    expect(guide).not.toContain('kind="compare"');
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

  it('teaches WebShop as a changing website environment with explicit benchmark and historical experiment boundaries', () => {
    for (const term of ['OBSERVATION', 'AVAILABLE ACTIONS', 'AGENT SELECTED', 'ENVIRONMENT TRANSITION', 'REWARD / SCORE', 'search["black sports sweatshirt"]', 'click["Buy Now"]']) expect(explainer).toContain(term);
    for (const boundary of ['1,000-product', '6680 / 2590', 'goal 0–499', 'goal 500–end']) expect(explainer).toContain(boundary);
    expect(explainer).toContain('Phase G/H0 are dated historical scientific boundaries');
    expect(explainer).toContain('experiment branch actually in use');
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

  it('retains a compare explainer implementation for reuse without mounting it beside canonical C1', () => {
    for (const term of ['SHARED EXPERIENCE', 'update mechanism', 'task boundary', 'carrier', 'validation', 'what persists', 'activation timing']) expect(explainer).toContain(term);
    expect(explainer).toContain('shared-seed');
    expect(explainer).toContain('shared-evo');
    expect(explainer).toContain('SD-LoRA adapter used in the WebShop experiment is one validated parametric path');
    expect(loopsZh).not.toContain('kind="compare"');
    expect(loopsEn).not.toContain('kind="compare"');
  });

  it('preserves the server sibling-container and authorization model with measured connectors and public-safe labels', () => {
    for (const term of ['Docker daemon', 'current development container', 'root UID 0', '/var/run/docker.sock', 'ordinary UID · explicit GPU · no Docker socket', 'approved persistent workspace', 'User A · User B · …', 'container root ≠ physical-host root', 'technical capability ≠ authorization scope']) expect(explainer).toContain(term);
    for (const edge of ['dev-socket', 'socket-daemon', 'daemon-exp', 'daemon-siblings', 'dev-workspace', 'exp-workspace']) expect(explainer).toContain(edge);
    for (const forbidden of ['dev-wangr', 'wangr-dev', 'dev-guozy', 'dev-huzh', '/data/home/wangr']) expect(explainer).not.toContain(forbidden);
    expect(explainer).toContain('irx-mobile-relations');
    expect(explainer).toContain('not child containers of the current development container');
  });

  it('supports keyboard navigation, static SSR content, audit markup, and reduced-motion fallback', () => {
    for (const key of ["event.key === 'ArrowRight'", "event.key === 'ArrowLeft'", "event.key === 'Home'", "event.key === 'End'"]) expect(explainer).toContain(key);
    expect(explainer).toContain('aria-live="polite"');
    expect(explainer).toContain('data-ui-audit="contrast layout"');
    expect(explainer).toContain('data-ui-audit-item');
    expect(explainer).toContain("window.matchMedia('(prefers-reduced-motion: reduce)')");
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
  });

  it('opens as one complete framework figure before tracing local modules', () => {
    for (const token of ['useState(true)', 'data-overview={overview}', 'irx-paper-figure', 'SYSTEM MAP', 'irx-visual-key', 'irx-inspector', 'onOverview={showOverview}']) expect(explainer).toContain(token);
    expect(css).toContain('.irx[data-overview=true] .irx-edge-layer g .irx-edge');
    expect(css).toContain('.irx-paper-caption');
    expect(css).not.toContain('.irx-figures{');
  });

  it('keeps the explainer eyebrow descriptive instead of repeating the page title', () => {
    expect(explainer).toContain("eyebrow: 'WEBSHOP'");
    expect(explainer).not.toContain('WEBSHOP · INTERACTIVE ENVIRONMENT');
    expect(detailCore).toContain("t('购物任务', 'Shopping task')");
    expect(detailCore).toContain("t('世界状态', 'World state')");
  });
});
