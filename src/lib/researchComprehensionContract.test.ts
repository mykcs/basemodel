import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');

const migrated = {
  lobby: read('../components/research/OpenEvoCapabilityMapLobby.astro'),
  firstRun: read('../components/research/OpenEvoFirstRunMap.astro'),
  mechanism: read('../components/research/OpenEvoMechanismMap.astro'),
  gateway: read('../components/research/OpenEvoRedesignMap.astro'),
  report: read('../components/research/OpenEvoSuccessorReport.astro'),
  exploration: read('../components/research/OpenEvoSuccessorExplorationMap.astro'),
};

const orientationFields = ['question', 'why', 'start', 'finish', 'state'] as const;

describe('research comprehension architecture', () => {
  it('gives every migrated route a zero-context orientation contract', () => {
    for (const [name, source] of Object.entries(migrated)) {
      expect(source, name).toContain('ResearchOrientation');
      for (const field of orientationFields) {
        expect(source, `${name}:${field}`).toMatch(new RegExp(`\\b${field}=`));
      }
    }
  });

  it('encodes sequential research as an ordered journey instead of flat sections', () => {
    for (const name of ['lobby', 'firstRun', 'mechanism', 'exploration'] as const) {
      expect(migrated[name], name).toContain('ResearchJourney');
    }
    expect(migrated.report).toContain('data-research-journey');
    expect(migrated.report).toContain('data-research-step');
  });

  it('keeps the successor gateway as an explicit two-mode reader choice', () => {
    expect(migrated.gateway).toContain('data-reading-choice');
    expect((migrated.gateway.match(/data-successor-mode=/g) ?? []).length).toBe(2);
  });

  it('uses named progressive disclosure for researcher-only depth', () => {
    for (const name of ['firstRun', 'mechanism', 'gateway', 'report', 'exploration'] as const) {
      expect(migrated[name], name).toContain('ResearchDepth');
    }
  });

  it('documents the execution checklist that owns this migration', () => {
    const plan = read('../../docs/agents/history/2026-09-06-reader-journey-repair.md');
    expect(plan).toContain('## 技术细节');
    expect(plan).toContain('## 交付标准');
    expect(plan).toContain('## 执行清单');
    expect(plan).toContain('## 2026-09-07 统一读者体系收敛');
  });
});

// Static-first primitives: comprehension cannot depend on client-side hydration.
describe('research comprehension primitives', () => {
  const orientation = read('../components/research/ResearchOrientation.astro');
  const journey = read('../components/research/ResearchJourney.astro');
  const depth = read('../components/research/ResearchDepth.astro');
  const stateRail = read('../components/research/ResearchStateRail.astro');

  it('keeps orientation and lifecycle state semantic in server-rendered HTML', () => {
    expect(orientation).toContain('<dl class="research-orientation__fields">');
    expect(stateRail).toContain('<ul>');
    expect(stateRail).toContain('Scientific result');
    for (const source of [orientation, stateRail]) expect(source).not.toContain('client:');
  });

  it('uses native disclosure and ordered-list semantics for journeys and research depth', () => {
    expect(journey).toContain('<ol>');
    expect(journey).toContain('<details');
    expect(journey).toContain('<summary>');
    expect(depth).toContain('<details');
    expect(depth).toContain('<summary>');
    expect(journey).toContain('prefers-reduced-motion');
    for (const source of [journey, depth]) expect(source).not.toContain('client:');
  });
});
