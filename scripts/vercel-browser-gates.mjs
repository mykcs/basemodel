import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function shouldRunVercelBrowserGates(env = process.env) {
  // Public GitHub Actions is the required browser CI after the 2026-09-09 cutover.
  // A Vercel Production build must not pay for the same Chromium matrix again.
  // Preview/unknown environments remain fail-closed and keep provider-specific UI acceptance.
  return env.VERCEL_ENV !== 'production';
}

function run(script) {
  execFileSync(process.execPath, [script], {
    stdio: 'inherit',
    env: process.env,
  });
}

export function main(env = process.env) {
  if (!shouldRunVercelBrowserGates(env)) {
    console.log(
      '[vercel-browser-gates] Production: required public-ci-gate already owns browser CI; skip duplicate Vercel Chromium/Lab execution.',
    );
    return;
  }

  console.log('[vercel-browser-gates] Preview/unknown environment: run Vercel Chromium and Lab acceptance.');
  run('scripts/vercel-ui-gate.mjs');
  run('scripts/vercel-lab-browser-gate.mjs');
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) main();
