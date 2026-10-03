import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const rootAgents = read('../../AGENTS.md');
const principles = read('../../docs/agents/current/ui-design-principles.md');
const tokens = read('../styles/tokens.css');
const visualIdentity = read('../styles/visual-identity.css');
const globalStyles = read('../styles/global.css');

describe('visual identity non-drift contract', () => {
  it('is mandatory and discoverable from the repository Agent entrypoint', () => {
    expect(rootAgents).toContain('ui-design-principles.md');
    expect(rootAgents).toContain('sitewide-visual-knowledge-architecture.md');
    expect(principles).toContain('Research Editorial × Experimental Workbench');
    expect(principles).toContain('future UI work does not drift');
  });

  it('locks the two-canvas system and shared widths', () => {
    for (const token of [
      '--canvas-editorial:',
      '--canvas-workbench:',
      '--reading-width: 720px',
      '--editorial-max: 1120px',
      '--workbench-max: 1440px',
    ]) {
      expect(tokens).toContain(token);
    }
    expect(principles).toContain('260px / flexible center / 320px');
    expect(visualIdentity).toContain('grid-template-columns: 260px minmax(0, 1fr) 320px');
  });

  it('keeps shape and elevation deliberately scarce', () => {
    expect(tokens).toContain('--radius-control: 6px');
    expect(tokens).toContain('--radius-panel: 10px');
    expect(tokens).toContain('--radius-feature: 16px');
    expect(tokens).toContain('--shadow-floating:');
    expect(principles).toContain('Permanent shadows are not an ordinary hierarchy tool');
    expect(principles).toContain('Hovering a normal card must not make it “float upward”');
    expect(visualIdentity).toContain('box-shadow: none');
  });

  it('preserves the research reasoning signature and typography split', () => {
    expect(principles).toContain('Model → Framework → Benchmark → Evidence → Feedback');
    expect(principles).toContain('Fact → Evidence → Judgment → Decision');
    expect(tokens).toContain('--font-interface:');
    expect(tokens).toContain('--font-editorial:');
    expect(tokens).toContain('--font-mono:');
    expect(visualIdentity).toContain('font-family: var(--font-editorial)');
    expect(visualIdentity).toContain('.site-main .workspace .page-header h1');
  });

  it('protects the card budget and mobile persistent-layer budget', () => {
    expect(principles).toContain('Card budget: cards are scarce');
    expect(principles).toContain('at most **two persistent UI layers at the same time**');
    expect(principles).toContain('Do not solve a hierarchy problem by wrapping every idea in a new card.');
    expect(visualIdentity).toContain('body:has(.compare-tray) .workspace-mobile-nav');
  });

  it('loads the visual identity layer through the existing global stylesheet', () => {
    expect(globalStyles).toContain("@import './visual-identity.css';");
  });
});
