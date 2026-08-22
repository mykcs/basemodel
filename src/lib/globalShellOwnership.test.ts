import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const pagesRoot = fileURLToPath(new URL('../pages/', import.meta.url));
const stylesRoot = fileURLToPath(new URL('../styles/', import.meta.url));
const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return files(path);
    return entry.isFile() ? [path] : [];
  });
}

function astroPages(directory: string): string[] {
  return files(directory).filter((path) => path.endsWith('.astro'));
}

function withoutComments(source: string) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

const headerSelector = /\.(?:site-header|nav-inner|brand(?:-mark)?|desktop-nav|mission-nav|journey-nav|journey-link|resource-menu|mobile-menu|mobile-journeys|mobile-utility-links|menu-toggle|theme-toggle|lang-switch|command-search-trigger)\b/;

describe('global shell ownership', () => {
  it('keeps page-owned Astro files from styling the shared site header directly', () => {
    const offenders = astroPages(pagesRoot).flatMap((path) => {
      const source = withoutComments(readFileSync(path, 'utf8'));
      const ownsHeader = /\.site-header\b|\[data-site-header(?:[^\]]*)?\]/.test(source);
      return ownsHeader ? [path.replace(`${pagesRoot}/`, '')] : [];
    });

    expect(
      offenders,
      `Page CSS must not reach into .site-header or [data-site-header]. Put header behavior in Header.astro or the canonical Header owner. Offenders: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('loads semantic shell owners after every retained compatibility layer', () => {
    const app = read('../styles/app.css');
    const closeout = app.indexOf("@import './visual-closeout.css';");
    const shell = app.indexOf("@import './components/global-shell.css';");
    const header = app.indexOf("@import './components/header.css';");

    expect(closeout).toBeGreaterThan(-1);
    expect(shell).toBeGreaterThan(closeout);
    expect(header).toBeGreaterThan(shell);
  });

  it('keeps final Header breakpoint ownership in the canonical owner', () => {
    const header = read('../styles/components/header.css');
    expect(header).toContain('.site-header .mission-nav');
    expect(header).toContain('@media (max-width: 1080px)');
    expect(header).toContain('.site-header .mobile-menu.is-open');
    expect(header).toContain('@media (max-width: 640px)');
    expect(header).toContain('.site-header .mobile-menu .mobile-menu__inner');
  });

  it('keeps retired compatibility layers out of shared Header ownership', () => {
    for (const path of [
      '../styles/design-refinement.css',
      '../styles/mobile-composition.css',
      '../styles/visual-closeout.css',
    ]) {
      expect(headerSelector.test(withoutComments(read(path))), path).toBe(false);
    }
  });

  it('freezes the remaining legacy Header selector debt to the known files', () => {
    const debt = files(stylesRoot)
      .filter((path) => path.endsWith('.css'))
      .filter((path) => headerSelector.test(withoutComments(readFileSync(path, 'utf8'))))
      .map((path) => path.replace(`${stylesRoot}/`, ''))
      .sort();

    expect(debt).toEqual([
      'components/header.css',
      'final-hardening.css',
      'site.css',
      'visual-identity.css',
      'visual-upgrade.css',
    ].sort());
  });

  it('owns shared shell width and footer geometry semantically', () => {
    const shell = read('../styles/components/global-shell.css');
    expect(shell).toContain('.shell');
    expect(shell).toContain('.footer-inner');
    expect(shell).toContain('@media (max-width: 390px)');
  });
});
