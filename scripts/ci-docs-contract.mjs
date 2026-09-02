import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const SAFE_DOC = /^(?:README\.md|AGENTS\.md|docs\/.+\.md)$/;
const base = process.env.CI_BASE_SHA?.trim();
const head = process.env.CI_HEAD_SHA?.trim() || 'HEAD';

if (!base) {
  console.error('[docs-contract] CI_BASE_SHA is required');
  process.exit(2);
}

function git(args, options = {}) {
  if (options.capture === false) {
    execFileSync('git', args, { stdio: 'inherit' });
    return '';
  }
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

try {
  git(['cat-file', '-e', `${base}^{commit}`]);
  git(['cat-file', '-e', `${head}^{commit}`]);
  git(['diff', '--check', base, head], { capture: false });

  const output = git(['diff', '--name-only', '--no-renames', base, head]);
  const files = output ? output.split(/\r?\n/).filter(Boolean) : [];
  if (files.length === 0) throw new Error('documentation mode received an empty diff');

  for (const file of files) {
    if (!SAFE_DOC.test(file)) throw new Error(`non-documentation path reached docs mode: ${file}`);
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8');
    if (/^(?:<<<<<<<|=======|>>>>>>>)(?: |$)/m.test(text)) {
      throw new Error(`merge-conflict marker found in ${file}`);
    }
    if (text.includes('\0')) throw new Error(`NUL byte found in ${file}`);
  }

  console.log(`[docs-contract] PASS files=${files.length}`);
} catch (error) {
  console.error(`[docs-contract] FAIL: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
