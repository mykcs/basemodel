import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const fixtureDir = mkdtempSync(join(root, '.playwright-negative-'));
try {
  const spec = join(fixtureDir, 'negative.spec.mjs');
  const config = join(fixtureDir, 'playwright.config.mjs');
  writeFileSync(spec, "import { test, expect } from '@playwright/test'; test('negative fixture', () => expect(true).toBe(false));\n");
  writeFileSync(config, `export default { testDir: ${JSON.stringify(fixtureDir)}, webServer: undefined, retries: 0, workers: 1, reporter: 'line' };\n`);
  const result = spawnSync(process.execPath, ['./node_modules/@playwright/test/cli.js', 'test', '--config', config], { cwd: root, encoding: 'utf8' });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const identifiedAssertion = output.includes('negative fixture')
    && output.includes('expect(received).toBe(expected)')
    && output.includes('Expected: false')
    && output.includes('Received: true');
  if (result.status === 0 || !identifiedAssertion) {
    console.error('[browser-gate-negative-self-test] expected the intentional expect(true).toBe(false) fixture failure');
    process.exitCode = 1;
  } else {
    console.log('[browser-gate-negative-self-test] PASS: intentional assertion failure was identified');
  }
} finally {
  rmSync(fixtureDir, { recursive: true, force: true });
}
