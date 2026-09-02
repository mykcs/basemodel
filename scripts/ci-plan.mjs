import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const SAFE_DOC = /^(?:README\.md|AGENTS\.md|docs\/.+\.md)$/;

export function classifyCiMode(eventName, changedFiles) {
  if (eventName === 'push') {
    return { mode: 'full', reason: 'main push is always revalidated with the full repository gate' };
  }
  if (eventName === 'workflow_dispatch') {
    return { mode: 'full', reason: 'manual CI is always fail-closed full validation' };
  }
  if (eventName !== 'pull_request') {
    return { mode: 'full', reason: `unknown event ${eventName || '<empty>'}; fail closed` };
  }

  const files = [...new Set(changedFiles.filter(Boolean))].sort();
  if (files.length === 0) {
    return { mode: 'full', reason: 'empty or unproven PR diff; fail closed' };
  }
  if (files.every((file) => SAFE_DOC.test(file))) {
    return { mode: 'docs', reason: 'PR changes only proven Markdown documentation paths' };
  }
  return { mode: 'full', reason: 'code, CI, config, test, asset, data, or mixed PR diff requires full validation' };
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function main() {
  const eventName = argValue('--event') ?? process.env.GITHUB_EVENT_NAME ?? '';
  const base = argValue('--base');
  const head = argValue('--head') ?? 'HEAD';
  let changedFiles = [];
  let diffError;

  if (eventName === 'pull_request') {
    try {
      if (!base) throw new Error('missing --base');
      git(['cat-file', '-e', `${base}^{commit}`]);
      git(['cat-file', '-e', `${head}^{commit}`]);
      const output = git(['diff', '--name-only', '--no-renames', base, head]);
      changedFiles = output ? output.split(/\r?\n/).filter(Boolean) : [];
    } catch (error) {
      diffError = error instanceof Error ? error.message : String(error);
    }
  }

  const result = diffError
    ? { mode: 'full', reason: `could not prove PR diff (${diffError}); fail closed` }
    : classifyCiMode(eventName, changedFiles);

  console.log(`[ci-plan] event=${eventName} mode=${result.mode} changed=${changedFiles.length}`);
  for (const file of changedFiles) console.log(`[ci-plan] ${file}`);
  console.log(`[ci-plan] ${result.reason}`);

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `mode=${result.mode}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT, `reason=${result.reason}\n`);
  }
}

const invoked = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (invoked === import.meta.url) main();
