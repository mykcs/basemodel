import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { EmittedFile } from './site-acceptance-core';
import { routeForFile } from './site-acceptance-core';

export const digest = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');

export function fileInventory(directory: string, prefix = ''): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isSymbolicLink()) throw new Error(`Symlink is not an acceptance input: ${prefix}${entry.name}`);
    const name = `${prefix}${entry.name}`;
    return entry.isDirectory()
      ? fileInventory(path.join(directory, entry.name), `${name}/`)
      : entry.isFile() ? [name] : [];
  }).sort();
}

export function materialInputIdentity(root: string) {
  const roots = ['src', 'public', 'scripts'];
  const files = roots.flatMap((dir) => fileInventory(path.join(root, dir)).map((file) => `${dir}/${file}`));
  for (const name of fs.readdirSync(root).sort()) {
    if (/^(?:astro\.config\.|tsconfig.*\.json$|package(?:-lock)?\.json$|vercel\.json$|\.npmrc$)/.test(name)) files.push(name);
  }
  const entries = files.sort().map((file) => ({ file, sha256: digest(fs.readFileSync(path.join(root, file))) }));
  return { sha256: digest(JSON.stringify(entries)), files: entries.length, scope: 'src + public + scripts + root build configuration' };
}

export function emittedFile(directory: string, file: string): EmittedFile {
  const pathname = routeForFile(file);
  const local = path.join(directory, file);
  const base = fs.realpathSync(directory);
  if (!fs.realpathSync(local).startsWith(`${base}${path.sep}`)) throw new Error('Output escaped build directory');
  const bytes = fs.readFileSync(local);
  return { file, pathname, bytes: bytes.length, sha256: digest(bytes) };
}

export function verifyOutputManifest(directory: string, expected: readonly EmittedFile[]): string[] {
  if (!expected.length) return ['Empty output manifest'];
  const errors: string[] = [];
  const actualFiles = fileInventory(directory);
  const indexed = new Set(expected.map((entry) => entry.file));
  for (const file of actualFiles) if (!indexed.has(file)) errors.push(`Unrecorded build output: ${file}`);
  for (const entry of expected) {
    try {
      const actual = emittedFile(directory, entry.file);
      if (actual.sha256 !== entry.sha256 || actual.bytes !== entry.bytes || actual.pathname !== entry.pathname) {
        errors.push(`Build output changed: ${entry.file}`);
      }
    } catch { errors.push(`Missing or invalid build output: ${entry.file}`); }
  }
  if (indexed.size !== expected.length) errors.push('Duplicate output manifest file');
  return errors;
}

export function pageSourceInventory(root: string) {
  const live = fileInventory(path.join(root, 'src/pages'));
  const archived = path.join(root, 'docs/archive/site-en/src/pages');
  return {
    liveSourceFiles: live.length,
    publicPageSources: live.filter((file) => file.endsWith('.astro') && !file.startsWith('_bodies/')).length,
    bodyFragments: live.filter((file) => file.startsWith('_bodies/')),
    endpointSources: live.filter((file) => file.endsWith('.ts')),
    archivedEnglishPageSources: fs.existsSync(archived) ? fileInventory(archived).filter((file) => file.endsWith('.astro.archive')).length : 0,
    archivedSourcesAreLiveRoutes: false,
  };
}

/** Hash canonical field tuples, not JavaScript object insertion order. */
export function outputManifestDigest(manifest: readonly EmittedFile[]): string {
  const sorted = [...manifest].sort((a, b) => a.file < b.file ? -1 : a.file > b.file ? 1 : 0);
  return digest(JSON.stringify(sorted.map((entry) => [entry.file, entry.pathname, entry.bytes, entry.sha256])));
}
