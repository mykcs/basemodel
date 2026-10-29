import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Regression: public CI runs canonical Playwright screenshots and then Lab.
// Two default test-results output owners silently drop earlier PNG/JSON evidence.
describe('independent Lab Playwright artifact output',()=>{
  it('keeps Lab results beneath but separate from the canonical shard upload directory',()=>{
    const lab=readFileSync(new URL('../../tests/e2e/lab-playwright.config.ts',import.meta.url),'utf8');
    const gate=readFileSync(new URL('../../scripts/ci-ui-gate.mjs',import.meta.url),'utf8');
    const workflow=readFileSync(new URL('../../.github/workflows/public-pr-ci.yml',import.meta.url),'utf8');
    const target=lab.match(/outputDir:\s*['"]([^'"]+)['"]/);
    expect(target,'Lab must have an explicit isolated output').toBeTruthy();
    const full=resolve(process.cwd(),'tests/e2e',target![1]!);
    const shard=resolve(process.cwd(),'test-results');
    expect(full).toBe(resolve(shard,'lab-gate'));
    expect(full).not.toBe(shard);
    expect(gate).toContain("'--config', 'tests/e2e/lab-playwright.config.ts'");
    expect(workflow).toContain('test-results/**/*.png');
    expect(workflow).toContain('test-results/**/*.json');
  });
});
