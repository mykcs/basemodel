import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const packageJson = JSON.parse(read('../../package.json')) as {
  scripts?: Record<string, string>;
};
const playwrightConfig = read('../../playwright.config.ts');
const browserGate = read('../../tests/e2e/ui-safety.spec.ts');
const policy = read('../../docs/agents/current/ui-change-visual-acceptance-gate.md');
const visualRoute = read('../components/visual/VisualRoute.astro');
const layerMap = read('../components/visual/LayerMap.astro');
const evidenceLadder = read('../components/visual/EvidenceLadder.astro');

describe('UI visual acceptance gate contract', () => {
  it('keeps the focused and cross-browser UI commands wired', () => {
    expect(packageJson.scripts?.['test:ui']).toContain('ui-safety.spec.ts');
    expect(packageJson.scripts?.['test:ui']).toContain('--project=chromium');
    expect(packageJson.scripts?.['test:ui:all']).toBe('playwright test tests/e2e/ui-safety.spec.ts');
  });

  it('retains evidence when browser verification fails', () => {
    expect(playwrightConfig).toContain("trace: 'retain-on-failure'");
    expect(playwrightConfig).toContain("screenshot: 'only-on-failure'");
    expect(playwrightConfig).toContain("video: 'retain-on-failure'");
  });

  it('covers themes, viewports, overflow, clipping, overlap, and theme transitions', () => {
    expect(browserGate).toContain("theme: 'light'");
    expect(browserGate).toContain("theme: 'dark'");
    expect(browserGate).toContain('width: 390');
    expect(browserGate).toContain('width: 768');
    expect(browserGate).toContain('width: 1440');
    expect(browserGate).toContain('document horizontal overflow');
    expect(browserGate).toContain('clipped horizontally');
    expect(browserGate).toContain('audited siblings overlap');
    expect(browserGate).toContain('low contrast');
    expect(browserGate).toContain('theme switching updates page and surface colors without a reload');
  });

  it('keeps shared visual primitives opted into browser auditing', () => {
    for (const component of [visualRoute, layerMap, evidenceLadder]) {
      expect(component).toContain('data-ui-audit="contrast layout"');
      expect(component).toContain('data-ui-audit-item');
    }
  });

  it('records the owner-first-discovery anti-pattern and exact commands', () => {
    expect(policy).toContain('the owner became the first real visual tester');
    expect(policy).toContain('npm run test:ui');
    expect(policy).toContain('npm run test:ui:all');
    expect(policy).toContain('light → dark → light');
    expect(policy).toContain('390 × 844');
  });
});
