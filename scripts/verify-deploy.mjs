import { spawnSync } from 'node:child_process';

const steps = [
  ['npm', ['run', 'check'], 'Astro/type check'],
  ['npm', ['run', 'validate'], 'data validation'],
  ['npm', ['run', 'audit:semantic'], 'semantic audit'],
  ['npm', ['run', 'audit:claims'], 'claim audit'],
  ['npm', ['run', 'audit:freshness'], 'freshness audit'],
  ['npm', ['test'], 'Vitest'],
  ['npm', ['run', 'audit:v2'], 'V2 completion audit'],
  ['npm', ['run', 'audit:v2:adversarial'], 'V2 adversarial audit'],
  ['npm', ['run', 'audit:hardening'], 'final product hardening audit'],
];

for (const [command, args, label] of steps) {
  console.log(`\n[verify:deploy] ${label}`);
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`[verify:deploy] ${label} could not start:`);
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`[verify:deploy] ${label} failed with exit code ${result.status ?? 1}.`);
    process.exit(result.status ?? 1);
  }
}

console.log('\n[verify:deploy] all deployment gates passed.');
