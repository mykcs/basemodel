import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layout = readFileSync(new URL('../../src/layouts/AppLayout.astro', import.meta.url), 'utf8');

describe('site theme bootstrap', () => {
  it('defaults a first visit to light instead of following the operating system', () => {
    expect(layout).toContain("const storedTheme = localStorage.getItem('atlas-theme');");
    expect(layout).toContain("document.documentElement.dataset.theme = storedTheme === 'dark' ? 'dark' : 'light';");
    expect(layout).not.toContain("matchMedia('(prefers-color-scheme: dark)')");
    expect(layout).not.toContain('prefersDark');
  });

  it('keeps a saved dark choice while invalid or missing values fall back to light', () => {
    expect(layout).toContain("storedTheme === 'dark' ? 'dark' : 'light'");
    expect(layout).toContain("document.documentElement.dataset.theme = 'light';");
  });
});
