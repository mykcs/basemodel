import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const archiveRoot = new URL('../../docs/archive/site-en/src/pages/en/', import.meta.url);
const manifest = readFileSync(new URL('../../docs/archive/site-en/MANIFEST.tsv', import.meta.url), 'utf8');

function filesUnder(directory: URL): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    return entry.isDirectory() ? filesUnder(child) : [child.pathname];
  });
}

function gitBlobSha(content: Buffer): string {
  return createHash('sha1')
    .update(Buffer.from(`blob ${content.length}\0`))
    .update(content)
    .digest('hex');
}

type ArchiveRow = { original: string; mode: string; sha: string; archived: string };
const rows: ArchiveRow[] = manifest.split('\n')
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [original, mode, sha, archived] = line.split('\t');
    return { original: original!, mode: mode!, sha: sha!, archived: archived! };
  });
describe('English site archive', () => {
  it('keeps English out of the active Astro page surface', () => {
    expect(existsSync(new URL('../../src/pages/en/', import.meta.url))).toBe(false);
    expect(rows).toHaveLength(63);
    expect(filesUnder(archiveRoot)).toHaveLength(63);
  });

  it('keeps every archived file byte-identical to its recorded Git blob', () => {
    for (const row of rows) {
      expect(row.original.startsWith('src/pages/en/'), row.original).toBe(true);
      expect(row.mode, row.original).toBe('100644');
      expect(row.archived.endsWith('.archive'), row.archived).toBe(true);
      const file = new URL(`../../${row.archived}`, import.meta.url);
      expect(existsSync(file), row.archived).toBe(true);
      expect(gitBlobSha(readFileSync(file)), row.original).toBe(row.sha);
    }
  });

  it('keeps the archive inert to active source scanners', () => {
    for (const file of filesUnder(archiveRoot)) {
      expect(file.endsWith('.archive'), file).toBe(true);
      expect(file.endsWith('.astro'), file).toBe(false);
      expect(file.endsWith('.ts'), file).toBe(false);
      expect(file.endsWith('.tsx'), file).toBe(false);
    }
  });
});
