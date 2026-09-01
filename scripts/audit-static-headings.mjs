import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const text = (html) => html
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ')
  .trim();

const failures = [];
const pages = walk(dist).filter((path) => path.endsWith('.html'));
for (const path of pages) {
  const html = readFileSync(path, 'utf8');
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => text(match[1] ?? ''));
  if (headings.length !== 1) {
    const route = `/${relative(dist, path).replaceAll('\\', '/').replace(/index\.html$/, '')}`;
    failures.push(`${route} expected exactly one <h1>; found ${headings.length}${headings.length ? `: ${headings.join(' | ')}` : ''}`);
  }
}

if (failures.length) {
  console.error(`[audit-static-headings] FAIL (${failures.length}/${pages.length} routes)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`[audit-static-headings] PASS: ${pages.length} static routes each contain exactly one <h1>`);
