import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const result = spawnSync('npx', ['tsx', 'scripts/audit-final-product-hardening.ts'], {
  cwd: process.cwd(),
  env: process.env,
  encoding: 'utf8',
});

const text = [
  'DIAGNOSTIC_ONLY: hardening audit wrapper',
  `status=${result.status ?? 'null'}`,
  result.error ? `error=${result.error.stack ?? result.error.message}` : '',
  '--- stdout ---',
  result.stdout ?? '',
  '--- stderr ---',
  result.stderr ?? '',
].filter(Boolean).join('\n');

fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'public/hardening-runtime-diagnostics.txt'), text + '\n');
console.log(text);

// Diagnostic branch only: preserve the failure details in the Preview artifact.
process.exit(0);
