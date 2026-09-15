import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const archiveRoot = new URL('../../docs/archive/site-en/src/pages/en/', import.meta.url);
const manifest = readFileSync(new URL('../../docs/archive/site-en/MANIFEST.tsv', import.meta.url), 'utf8');
const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
  redirects?: Array<{ source: string; destination: string; permanent?: boolean }>;
};

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
function legacyRedirectPairs(original: string): Array<{ source: string; destination: string }> {
  const relative = original.replace('src/pages/en/', '');
  if (relative === '404.astro') return [];
  if (relative === 'index.astro') return [{ source: '/en', destination: '/' }, { source: '/en/', destination: '/' }];

  if (relative.endsWith('/index.astro')) {
    const stem = relative.slice(0, -'index.astro'.length);
    const source = `/en/${stem.replace(/\/$/, '')}`;
    const destination = `/${stem}`;
    return [{ source, destination }, { source: `${source}/`, destination }];
  }

  if (relative.endsWith('.astro')) {
    const stem = relative.slice(0, -'.astro'.length).replace('[id]', ':id');
    const source = `/en/${stem}`;
    const destination = `/${stem}/`;
    return [{ source, destination }, { source: `${source}/`, destination }];
  }

  if (relative.endsWith('.json.ts')) {
    const route = relative.slice(0, -'.ts'.length);
    return [{ source: `/en/${route}`, destination: `/${route}` }];
  }

  return [];
}

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

  it('keeps every real archived English URL on an explicit temporary Chinese redirect', () => {
    const expected = new Map(rows.flatMap((row) => legacyRedirectPairs(row.original)).map((item) => [item.source, item.destination]));
    const actual = (vercel.redirects ?? []).filter((item) => item.source === '/en' || item.source.startsWith('/en/'));

    expect(actual).toHaveLength(expected.size);
    expect(actual.some((item) => item.source.includes(':path') || item.source.includes('(.*)'))).toBe(false);
    for (const item of actual) {
      expect(item.permanent, item.source).toBe(false);
      expect(item.destination, item.source).toBe(expected.get(item.source));
    }
    for (const [source, destination] of expected) {
      const redirect = actual.find((item) => item.source === source);
      expect(redirect?.destination, source).toBe(destination);
    }
  });
});
