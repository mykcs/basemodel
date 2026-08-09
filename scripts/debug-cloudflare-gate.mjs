import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const steps = [
  ['check', ['npm', 'run', 'check']],
  ['validate', ['npm', 'run', 'validate']],
  ['semantic', ['npm', 'run', 'audit:semantic']],
  ['claims', ['npm', 'run', 'audit:claims']],
  ['freshness', ['npm', 'run', 'audit:freshness']],
  ['unit', ['npm', 'test']],
  ['v2', ['npm', 'run', 'audit:v2']],
  ['v2-adversarial', ['npm', 'run', 'audit:v2:adversarial']],
  ['hardening', ['npm', 'run', 'audit:hardening']],
  ['build', ['npm', 'run', 'build']],
];
const sanitize = (text) => String(text ?? '')
  .replace(/(?:token|secret|password|authorization)\s*[:=]\s*\S+/gi, '[redacted]')
  .split('\n').slice(-40).join('\n');
const results = [];
for (const [name, [command, ...args]] of steps) {
  const run = spawnSync(command, args, { encoding: 'utf8', env: process.env, maxBuffer: 8 * 1024 * 1024 });
  results.push({ name, status: run.status, signal: run.signal, stdoutTail: sanitize(run.stdout), stderrTail: sanitize(run.stderr) });
}
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/diagnostics.json', JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
fs.writeFileSync('dist/index.html', fs.existsSync('dist/index.html') ? fs.readFileSync('dist/index.html') : '<!doctype html><title>Gate diagnostics</title><a href="/diagnostics.json">diagnostics</a>');
console.log('Sanitized diagnostics written to dist/diagnostics.json');
process.exit(0);
