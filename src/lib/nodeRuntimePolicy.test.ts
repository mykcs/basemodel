import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as { engines?: { node?: string } };
const fallbackNodeVersion = readFileSync(
  new URL('../../.node-version', import.meta.url),
  'utf8',
).trim();

describe('Node runtime policy', () => {
  it('pins the Vercel Node major so future major upgrades are deliberate', () => {
    expect(packageJson.engines?.node).toBe('24.x');
  });

  it('keeps the fallback/local Node pin separate from the Vercel runtime contract', () => {
    expect(fallbackNodeVersion).toMatch(/^22\./);
    expect(packageJson.engines?.node).not.toMatch(/^22\\./);
  });
});
