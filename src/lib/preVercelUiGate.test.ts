import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ESCAPED_UI_REGRESSIONS,
  classifyUiFile,
  classifyUiRisk,
  commandsForRisk,
} from '../../scripts/preflight-ui';

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};
const uiAcceptancePolicy = readFileSync(
  resolve(process.cwd(), 'docs/agents/current/ui-change-visual-acceptance-gate.md'),
  'utf8',
);

describe('pre-Vercel UI regression gate', () => {
  it('classifies UI changes upward by blast radius', () => {
    expect(classifyUiFile('docs/agents/current/ui-design-principles.md')).toBe('none');
    expect(classifyUiFile('src/data/openEvoWebShopProgram.ts')).toBe('content');
    expect(classifyUiFile('src/pages/research/example.astro')).toBe('local');
    expect(classifyUiFile('src/components/research/Example.astro')).toBe('shared');
    expect(classifyUiFile('src/styles/tokens.css')).toBe('global');
    expect(classifyUiFile('src/components/Header.astro')).toBe('global');

    expect(classifyUiRisk([
      'src/pages/research/example.astro',
      'src/styles/tokens.css',
    ]).risk).toBe('global');
  });

  it('requires the full deterministic/build/overflow/browser sequence for UI work', () => {
    const local = commandsForRisk('local').map((entry) => entry.command);
    expect(local).toEqual([
      'npm run verify:deploy',
      'npm run build',
      'npm run ui:overflow-preflight',
      'npm run test:ui',
    ]);

    const global = commandsForRisk('global').map((entry) => entry.command);
    expect(global).toEqual([
      'npm run verify:deploy',
      'npm run build',
      'npm run ui:overflow-preflight',
      'npm run test:ui:all',
    ]);
    expect(commandsForRisk('none')).toEqual([]);
  });

  it('keeps the unified preflight commands discoverable in package scripts and canonical policy', () => {
    expect(packageJson.scripts['preflight:ui']).toBe('tsx scripts/preflight-ui.ts');
    expect(packageJson.scripts['preflight:ui:plan']).toBe('tsx scripts/preflight-ui.ts --plan');
    expect(packageJson.scripts['ui:overflow-preflight']).toContain('scripts/ui-overflow-preflight.mjs');
    expect(packageJson.scripts['verify:deploy']).toContain('npm test');

    expect(uiAcceptancePolicy).toContain('npm run preflight:ui:plan');
    expect(uiAcceptancePolicy).toContain('npm run preflight:ui');
    expect(uiAcceptancePolicy).toContain('first provider-triggering ref update');
    expect(uiAcceptancePolicy).toContain('A GitHub/Vercel commit status is not by itself proof');
  });

  it('keeps every escaped browser defect wired into both UI suites', () => {
    const chromium = packageJson.scripts['test:ui'];
    const crossBrowser = packageJson.scripts['test:ui:all'];

    for (const regression of ESCAPED_UI_REGRESSIONS.filter((entry) => entry.stage === 'browser')) {
      expect(existsSync(resolve(process.cwd(), regression.gate)), regression.id).toBe(true);
      expect(chromium, `${regression.id} missing from test:ui`).toContain(regression.gate);
      expect(crossBrowser, `${regression.id} missing from test:ui:all`).toContain(regression.gate);
    }
  });

  it('keeps deterministic and preflight escaped-defect owners present', () => {
    for (const regression of ESCAPED_UI_REGRESSIONS.filter((entry) => entry.stage !== 'browser')) {
      expect(existsSync(resolve(process.cwd(), regression.gate)), regression.id).toBe(true);
    }

    expect(packageJson.scripts['verify:deploy']).toContain('npm test');
    expect(packageJson.scripts['ui:overflow-preflight']).toContain('scripts/ui-overflow-preflight.mjs');
  });
});
