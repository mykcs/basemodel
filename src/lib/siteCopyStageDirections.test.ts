import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcRoot = fileURLToPath(new URL('../', import.meta.url));
const runtimeRoots = ['components', 'pages', 'layouts'].map((part) => join(srcRoot, part));
const allowedExtensions = new Set(['.astro', '.tsx', '.ts']);
const walk = (path: string): string[] => statSync(path).isFile() ? [path] : readdirSync(path).flatMap((entry) => walk(join(path, entry)));
const runtimeFiles = runtimeRoots
  .flatMap(walk)
  .filter((file) => allowedExtensions.has(extname(file)))
  .filter((file) => !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file))
  .filter((file) => !file.endsWith('/AGENTS.md'));

const editorialStageDirections = [
  /下面先讲[^'"`\n]{0,160}/g,
  /这里承接原首页[^'"`\n]{0,160}/g,
  /先进入模型浏览器[^'"`\n]{0,160}/g,
  /The page starts with the research objects[^'"`\n]{0,180}/gi,
  /This section now holds the family snapshot[^'"`\n]{0,180}/gi,
  /Start in the model browser[^'"`\n]{0,180}/gi,
] as const;

describe('site copy stage-direction guard', () => {
  it('removes zero-information narration about how the page will explain itself', () => {
    const findings: string[] = [];
    for (const file of runtimeFiles) {
      const source = readFileSync(file, 'utf8');
      for (const pattern of editorialStageDirections) {
        pattern.lastIndex = 0;
        for (const match of source.matchAll(pattern)) findings.push(`${file.replace(srcRoot, 'src/')}: ${match[0]}`);
      }
    }
    expect(findings).toEqual([]);
  });
});
