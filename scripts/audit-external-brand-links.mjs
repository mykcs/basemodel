import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const expectedBrand = (href) => {
  try {
    const url = new URL(href.replaceAll('&amp;', '&'));
    const host = url.hostname.toLowerCase();
    if (host === 'github.com' || host.endsWith('.github.com')) return 'github';
    if (host === 'huggingface.co' || host.endsWith('.huggingface.co')) return 'huggingface';
  } catch {}
  return null;
};

const failures = [];
let checkedLinks = 0;
const pages = walk(dist).filter((path) => path.endsWith('.html'));
for (const path of pages) {
  const html = readFileSync(path, 'utf8');
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = match[1] ?? '';
    const body = match[2] ?? '';
    const hrefMatch = attrs.match(/\bhref=(['"])(.*?)\1/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[2] ?? '';
    const brand = expectedBrand(href);
    if (!brand) continue;
    checkedLinks += 1;
    if (!body.includes(`data-external-brand="${brand}"`)) {
      const route = `/${relative(dist, path).replaceAll('\\', '/').replace(/index\.html$/, '')}`;
      failures.push(`${route} missing ${brand} mark for ${href}`);
    }
  }
}

if (failures.length) {
  console.error(`[audit-external-brand-links] FAIL (${failures.length}/${checkedLinks} brand links)`);
  for (const failure of failures.slice(0, 80)) console.error(`  - ${failure}`);
  if (failures.length > 80) console.error(`  ... ${failures.length - 80} more`);
  process.exit(1);
}
console.log(`[audit-external-brand-links] PASS: ${checkedLinks} GitHub/Hugging Face links carry the matching official brand mark across ${pages.length} static routes`);
