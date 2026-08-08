import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const configSource = readFileSync(resolve(here, '../../astro.config.mjs'), 'utf8');

describe('Astro 7 rendering compatibility', () => {
  it('preserves HTML-aware whitespace compression from Astro 6', () => {
    expect(configSource).toMatch(/\bcompressHTML\s*:\s*true\b/);
  });
});
