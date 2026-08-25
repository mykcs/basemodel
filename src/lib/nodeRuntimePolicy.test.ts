import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as { engines?: { node?: string } };

describe('Node runtime policy', () => {
  it('pins the Vercel Node major so future major upgrades are deliberate', () => {
    expect(packageJson.engines?.node).toBe('24.x');
  });
});
