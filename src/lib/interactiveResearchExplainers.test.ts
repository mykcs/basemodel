import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const explainer = read('src/components/research/InteractiveResearchExplainer.tsx');
const css = read('src/styles/interactive-research-explainer.css');
const trajectory = read('src/components/research/AgentEnvironmentTrajectory.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const evoZh = read('src/pages/research/seed-openevo/openevo.astro');
const evoEn = read('src/pages/en/research/seed-openevo/openevo.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');

describe('interactive research explainers', () => {
  it('mounts the interactive layer lazily on the priority bilingual routes', () => {
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

  it('keeps the shared research color and connector grammar explicit', () => {
    for (const token of ['--irx-env:#2563eb', '--irx-experience:#d97706', '--irx-signal:#dc2626', '--irx-state:#7c3aed', '--irx-persist:#059669']) expect(css).toContain(token);
    expect(explainer).toContain('<svg');
    expect(explainer).toContain('<marker');
    expect(css).toContain('stroke-dasharray');
    expect(explainer).toContain('irx-evo-wires');
    expect(explainer).toContain('irx-compare-wires');
    expect(explainer).toContain('irx-server-wires');
  });

  it('teaches WebShop as a changing website environment with action-linked state', () => {
    for (const term of ['OBSERVATION', 'AVAILABLE ACTIONS', 'AGENT SELECTED', 'ENVIRONMENT TRANSITION', 'REWARD / SCORE', 'search["black sports sweatshirt"]', 'click["Buy Now"]']) expect(explainer).toContain(term);
    for (const boundary of ['1,000-product', '6680 / 2590', 'Phase H0 Natural Success Search', 'goal 0–499', '500–end']) expect(explainer).toContain(boundary);
    expect(explainer).toContain('教学演示');
    expect(explainer).toContain('not a measured Phase G result');
  });

  it('makes ALFWorld object state and failed preconditions observable', () => {
    for (const term of ['AGENT INVENTORY', 'MICROWAVE', 'PRECONDITION FAILED', 'apple is not in microwave', 'put apple in microwave', 'GOAL SATISFIED']) expect(explainer).toContain(term);
    expect(explainer).toContain('train / valid_seen / valid_unseen');
    expect(explainer).toContain('goto · pick · open · put · heat · cool · clean · examine');
  });

  it('makes SEED same-action dual-context re-scoring and both learning branches explicit', () => {
    for (const term of ['same already-sampled action tokens', 'same sampled action token', 'P_plain(action)', 'P_skill(action)', 'plain context', 'skill-augmented context', 'OPD', 'GRPO', 'GRPO + OPD', 'policy θt+1']) expect(explainer).toContain(term);
    expect(explainer).toContain('Illustrative probabilities only');
    expect(explainer).toContain('not token probabilities from a real run');
  });

  it('keeps OpenEvo carrier fan-out, validation, successor revision, and next-task boundary explicit', () => {
    for (const term of ['SEALED EVIDENCE', 'EVOLUTION METHOD', 'MEMORY', 'AGENT ARTIFACT', 'PARAMETRIC ADAPTER', 'VALIDATION GATE', 'fresh reload', 'behavior probe', 'scientific contract', 'SUCCESSOR REVISION', 'TASK N+1']) expect(explainer).toContain(term);
    expect(explainer).toContain('neither synonymous with SD-LoRA nor with external memory');
    expect(explainer).toContain('memory / artifact / adapter');
  });

  it('compares SEED and OpenEvo from shared experience rather than external-memory shorthand', () => {
    for (const term of ['SHARED EXPERIENCE', 'Where does this experience ultimately live?', 'update mechanism', 'task boundary', 'carrier', 'validation', 'activation time']) expect(explainer).toContain(term);
    expect(explainer).toContain('current OpenEvo WebShop path itself includes a parametric adapter');
  });

  it('preserves the server sibling-container and authorization model', () => {
    for (const term of ['Docker daemon', 'dev-wangr / wangr-dev', 'root UID 0', '/var/run/docker.sock', 'UID/GID 1001:1001', 'no Docker socket', '/data/home/wangr/workspace', 'dev-guozy · dev-huzh', 'container root ≠ physical-host ownership', 'technical capability ≠ authorization scope']) expect(explainer).toContain(term);
  });

  it('supports keyboard navigation, static SSR content, and reduced-motion fallback', () => {
    expect(explainer).toContain("event.key === 'ArrowRight'");
    expect(explainer).toContain("event.key === 'ArrowLeft'");
    expect(explainer).toContain("event.key === 'Home'");
    expect(explainer).toContain("event.key === 'End'");
    expect(explainer).toContain('aria-live="polite"');
    expect(explainer).toContain("window.matchMedia('(prefers-reduced-motion: reduce)')");
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
    expect(css).toContain('@media(max-width:720px)');
  });
});
