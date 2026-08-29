import { spawnSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const fixture = join(process.cwd(), `.lint-negative-${process.pid}.ts`);
try {
  writeFileSync(fixture, 'undeclaredLintFixture = 1;\n', 'utf8');
  const result = spawnSync(process.execPath, ['./node_modules/eslint/bin/eslint.js', fixture, '--max-warnings', '0'], { encoding: 'utf8' });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const identifiedFixture = output.includes(fixture) || output.includes(`.lint-negative-${process.pid}.ts`);
  if (result.status === 0 || !identifiedFixture || !output.includes('no-undef')) {
    console.error('[lint-negative-self-test] expected a nonzero no-undef failure naming the injected fixture');
    process.exitCode = 1;
  } else {
    console.log('[lint-negative-self-test] PASS: injected fixture produced an identified no-undef failure');
  }
} finally {
  unlinkSync(fixture);
}
