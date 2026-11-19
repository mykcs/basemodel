import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Wiring assertions complement the browser predicates. A test file can exist
// and pass manually while being absent from the real release gate.
const pkg=JSON.parse(readFileSync(new URL('../../package.json', import.meta.url),'utf8')) as {
  scripts: Record<string,string>;
};
const required=[
  'tests/e2e/sitewide-typography.spec.ts',
  'tests/e2e/sitewide-readable-dates.spec.ts',
  'tests/e2e/typography-experiment-selector.spec.ts',
  'tests/e2e/typography-stage2-genealogy.spec.ts',
  'tests/e2e/typography-server-governance.spec.ts',
  'tests/e2e/sitewide-math-rendering.spec.ts',
];

describe('Typography UI Gate wiring',()=>{
  for(const key of ['test:ui','test:ui:all']){
    it(key+' includes the executed readability and math witnesses',()=>{
      const script=pkg.scripts[key];
      expect(script).toBeTruthy();
      for(const path of required)expect(script).toContain(path);
    });
  }
  it('the all-built-route math audit runs bounded route batches',()=>{
    const source=readFileSync(new URL('../../tests/e2e/sitewide-math-rendering.spec.ts',import.meta.url),'utf8');
    expect(source).toContain('partitionRoundRobin(allBuiltRoutes, 8)');
    expect(source).toContain('for (const [batchIndex, routeBatch]');
  });
  it('all built design routes and compiler counterexamples run in the normal gates',()=>{
    const source=readFileSync(new URL('../../tests/e2e/sitewide-typography.spec.ts',import.meta.url),'utf8');
    expect(source).toContain('partitionRoundRobin(allDesignDocuments,8)');
    expect(source).toContain('for(const width of [440,1440])');
    expect(source).toContain('readRenderedDesign');
    expect(pkg.scripts['audit:typography']).toContain('scripts/lib/sitewide-spacing.test.mjs');
    expect(pkg.scripts['audit:typography']).toContain('scripts/lib/rendered-design-contract.test.mjs');
  });
});
