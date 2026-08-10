import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const result = spawnSync(process.execPath, ['./node_modules/tsx/dist/cli.mjs', 'scripts/audit-final-product-hardening.ts'], {
  cwd: process.cwd(),
  env: process.env,
  encoding: 'utf8',
});

const report = [
  'DIAGNOSTIC_ONLY: original audit-final-product-hardening.ts',
  `exit_status=${result.status ?? 'null'}`,
  result.error ? `spawn_error=${result.error.stack ?? result.error.message}` : '',
  '--- stdout ---',
  result.stdout ?? '',
  '--- stderr ---',
  result.stderr ?? '',
].filter(Boolean).join('\n') + '\n';

fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'public/hardening-audit-output.txt'), report);
console.log(report);
process.exit(0);
