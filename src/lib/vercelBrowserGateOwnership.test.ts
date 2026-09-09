import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shouldRunVercelBrowserGates } from '../../scripts/vercel-browser-gates.mjs';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const vercel = JSON.parse(read('vercel.json')) as { buildCommand?: string };
const publicWorkflow = read('.github/workflows/public-pr-ci.yml');
const wrapper = read('scripts/vercel-browser-gates.mjs');

describe('browser CI ownership after public-GHA cutover', () => {
  it('makes Production the only Vercel environment that skips duplicate browser CI', () => {
    expect(shouldRunVercelBrowserGates({ VERCEL_ENV: 'production' })).toBe(false);
    expect(shouldRunVercelBrowserGates({ VERCEL_ENV: 'preview' })).toBe(true);
    expect(shouldRunVercelBrowserGates({})).toBe(true);
  });

  it('keeps repository validation/build in Vercel while delegating required browser CI to public-ci-gate', () => {
    expect(vercel.buildCommand).toBe('npm run verify:deploy && npm run build && node scripts/vercel-browser-gates.mjs');
    expect(publicWorkflow).toContain('name: public-ci-gate');
    expect(publicWorkflow).toContain('needs: [deterministic, browser]');
    expect(wrapper).toContain("run('scripts/vercel-ui-gate.mjs')");
    expect(wrapper).toContain("run('scripts/vercel-lab-browser-gate.mjs')");
  });
});
