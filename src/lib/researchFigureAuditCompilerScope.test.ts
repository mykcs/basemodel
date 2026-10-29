import { afterEach, expect, it } from 'vitest';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const temporary: string[] = [];
afterEach(() => temporary.splice(0).forEach(path => rmSync(path, { recursive: true, force: true })));

it('ignores compiler-only scope markers while retaining unknown semantic-owner failures', () => {
  // Synthetic inventory supplies the existing completeness floor, not visual evidence.
  const root = mkdtempSync(join(tmpdir(), 'figure-scope-regression-'));
  temporary.push(root);
  mkdirSync(join(root, 'scripts'));
  copyFileSync(new URL('../../scripts/audit-sitewide-research-figure-widths.mjs', import.meta.url), join(root, 'scripts/audit.mjs'));
  for (let index = 0; index < 260; index++) {
    const path = join(root, 'dist', `page-${index}`);
    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, 'index.html'), '<html></html>');
  }
  const route = join(root, 'dist/research/seed-openevo/study/capability-exploration/q17-directapply-analysis');
  mkdirSync(route, { recursive: true });
  const file = join(route, 'index.html');
  const render = (first: string) => writeFileSync(file,
    first + '<figure class="astro-scope123"></figure>'.repeat(59) + '<table></table>'.repeat(115));
  const run = () => spawnSync(process.execPath, [join(root, 'scripts/audit.mjs')], { encoding: 'utf8' });

  render('<figure class="astro-scope123"></figure>');
  expect(run().status).toBe(0);
  render('<figure class="astro-scope123 paper-effect" data-paper-width="single"></figure>');
  expect(run().status).toBe(0);
  render('<figure class="astro-scope123 unknown-real-owner"></figure>');
  const unknown = run();
  expect(unknown.status).toBe(1);
  expect(unknown.stderr).toContain('unknown-real-owner');
  render('<figure class="astro-scope123 paper-effect"></figure>');
  expect(run().status).toBe(1);
});
