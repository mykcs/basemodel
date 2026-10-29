import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const publicSourceRoots = ['src', 'public'];
const sourceExtensions = new Set([
  '.astro', '.css', '.html', '.js', '.jsx', '.json', '.md', '.mdx',
  '.svg', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml',
]);

// Encoded to avoid putting the very identities we prohibit into public test text.
// These are *known* private-person references, not a complete name detector.
const prohibited = [
  '\u9b4f\u8001\u5e08',
  '\u53f2\u8001\u5e08',
  '\u66f9\u8001\u5e08',
  '\u5b59\u8001\u5e08',
  '\u5b59\u9662\u957f',
  '\u9a6c\u8001\u5e08',
  '\u738b\u9510',
  '\u7389\u8083',
  '\u4e91\u9e4f',
];

function* productionSourceFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* productionSourceFiles(path);
    } else if (entry.isFile() && sourceExtensions.has(extname(path)) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name)) {
      yield path;
    }
  }
}

function escapedUnicode(term: string): string {
  return Array.from(term).map((character) => `\\u${character.codePointAt(0)!.toString(16).padStart(4, '0')}`).join('');
}

describe('published BaseModel person-name privacy', () => {
  it('does not expose known private persons in site production source or static public assets', () => {
    const findings: string[] = [];
    let scanned = 0;

    for (const root of publicSourceRoots) {
      for (const path of productionSourceFiles(join(repositoryRoot, root))) {
        scanned += 1;
        const content = readFileSync(path, 'utf8');
        for (const term of prohibited) {
          if (content.includes(term) || content.toLowerCase().includes(escapedUnicode(term).toLowerCase())) {
            findings.push(relative(repositoryRoot, path));
            break;
          }
        }
      }
    }

    expect(scanned).toBeGreaterThan(100);
    expect(findings, `Known private identities in publishable files: ${findings.join(', ')}`).toEqual([]);
  });

  it('recognizes both literal and Unicode-escaped variants', () => {
    const example = prohibited[0]!;
    expect(example.length).toBeGreaterThan(2);
    expect(escapedUnicode(example)).toContain('\\u');
  });
});
