import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const pagesRoot = fileURLToPath(new URL('../pages/', import.meta.url));

function astroPages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return astroPages(path);
    return entry.isFile() && entry.name.endsWith('.astro') ? [path] : [];
  });
}

function withoutComments(source: string) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

describe('global shell ownership', () => {
  it('keeps page-owned Astro files from styling the shared site header directly', () => {
    const offenders = astroPages(pagesRoot).flatMap((path) => {
      const source = withoutComments(readFileSync(path, 'utf8'));
      const ownsHeader = /\.site-header\b|\[data-site-header(?:[^\]]*)?\]/.test(source);
      return ownsHeader ? [path.replace(`${pagesRoot}/`, '')] : [];
    });

    expect(
      offenders,
      `Page CSS must not reach into .site-header or [data-site-header]. Put header behavior in Header.astro or the shared global style layers instead. Offenders: ${offenders.join(', ')}`,
    ).toEqual([]);
  });
});
